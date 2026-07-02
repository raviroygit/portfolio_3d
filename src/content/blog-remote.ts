/**
 * Remote "Insights" reader.
 *
 * Reads the shared blogs backend (Fastify on Cloud Run) via the authenticated
 * CMS list endpoint `GET /api/v1/blogs/posts`, filtered to `status='published'`.
 *
 * Auth is per-org: the endpoint returns ONLY the caller's org's posts — the org
 * is taken from the `X-Organization-Id` header (not a query param), paired with
 * an `X-API-Key: blg_…` credential bound to that org. So we authenticate AS
 * `NEXT_PUBLIC_BLG_ORG_ID` (6a21a62ca1d17d43907d568f) and get exactly that org's
 * posts — no client-side org filtering needed.
 *
 * The list response already includes each post's full `contentHtml`, so both the
 * index and the detail page are served from this one (Data-Cache-deduped) call —
 * we never hit the by-slug endpoint (which would need a projectKey in its path).
 *
 * Rows are normalized into the local `Post` shape so the existing consumers
 * (blog list/detail, sitemap, feed, llms) work unchanged. Every call degrades to
 * empty on a backend outage instead of failing `next build`. The `X-API-Key` is
 * read only from the non-public `BLG_API_KEY` so it stays server-side.
 */
import type { Post } from "./blog";

const BASE = (process.env.NEXT_PUBLIC_BLG_API_URL ?? "").replace(/\/$/, "");

/** Org we authenticate AS — the endpoint returns only this org's posts. */
const BLG_ORG_ID = (
  process.env.NEXT_PUBLIC_BLG_ORG_ID ??
  process.env.BLG_ORG_ID ??
  ""
).trim();

/**
 * Optional channel filter. When set, only posts in this projectKey are shown;
 * empty means "all of the org's published posts, any channel".
 */
const BLG_PROJECT_KEY = (process.env.BLG_PROJECT_KEY ?? "").trim();

/** CMS API key (`blg_live_…` / `blg_test_…`), bound to BLG_ORG_ID. Server-only. */
const BLG_API_KEY = (process.env.BLG_API_KEY ?? "").trim();
if (process.env.NEXT_PUBLIC_BLG_API_KEY) {
  console.warn(
    "[blog] SECURITY: NEXT_PUBLIC_BLG_API_KEY is set — a NEXT_PUBLIC_ key is bundled into client JS and exposed publicly. Rename it to BLG_API_KEY and rotate the leaked key.",
  );
}

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {};
  if (BLG_API_KEY) h["X-API-Key"] = BLG_API_KEY;
  if (BLG_ORG_ID) h["X-Organization-Id"] = BLG_ORG_ID;
  return h;
}

type BlogTag = { slug: string; name: string };

/** Raw CMS PostRow (subset we consume). */
interface CmsPostRow {
  id: string;
  organizationId: string;
  projectKey: string;
  slug: string;
  title: string;
  excerpt: string | null;
  contentHtml: string | null;
  coverUrl?: string | null;
  coverImageUrl?: string | null;
  authorName: string;
  languageCode: string;
  publishedAt: string | null;
  readingTimeMinutes: number | null;
  isFeatured: boolean;
  viewCount: number;
  status: string;
  visibility: string;
  deletedAt: string | null;
  tags?: BlogTag[];
  seo?: { metaTitle?: string; metaDescription?: string; ogImageUrl?: string } | null;
}

type ListResponse = { items: CmsPostRow[]; page: number; limit: number };

let warnedNoKey = false;

/** Revalidate window (seconds) for the blog Data Cache. */
const BLOG_REVALIDATE = 300;

/** True for a row we should surface: published, not deleted, in our channel (if set). */
function isPublishable(p: CmsPostRow): boolean {
  if (p.status !== "published" || p.deletedAt) return false;
  if (BLG_PROJECT_KEY && p.projectKey !== BLG_PROJECT_KEY) return false;
  return true;
}

/** CMS row → local Post shape, with cover/excerpt fallbacks. */
function toPost(p: CmsPostRow): Post {
  const tags = (p.tags ?? []).map((t) => t.name);
  return {
    slug: p.slug,
    frontmatter: {
      title: p.title,
      description: p.excerpt ?? p.seo?.metaDescription ?? "",
      date: p.publishedAt ?? "",
      category: p.tags?.[0]?.name ?? "Insights",
      tags,
      draft: false,
    },
    readingTime: p.readingTimeMinutes ? `${p.readingTimeMinutes} min read` : "",
    source: "remote",
    contentHtml: p.contentHtml ?? "",
    coverImageUrl: p.coverUrl ?? p.coverImageUrl ?? p.seo?.ogImageUrl ?? null,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET JSON with small retries on transient failures (429/5xx/network). 404 and
 * other 4xx are definitive. Responses go through Next's Data Cache, which dedupes
 * the single list call across the index/sitemap/detail renders and refreshes on
 * the window.
 */
async function getJson<T>(path: string): Promise<T | null> {
  if (!BASE) {
    console.warn("[blog] NEXT_PUBLIC_BLG_API_URL is not set — remote posts will be empty.");
    return null;
  }
  const url = `${BASE}${path}`;
  const MAX = 4;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    try {
      const res = await fetch(url, {
        next: { revalidate: BLOG_REVALIDATE },
        headers: { accept: "application/json", ...authHeaders() },
      });
      if (res.ok) return (await res.json()) as T;
      if (res.status === 404) return null;
      if (res.status !== 429 && res.status < 500) {
        console.warn(`[blog] ${path} → ${res.status} (no retry)`);
        return null;
      }
      console.warn(`[blog] ${path} → ${res.status} (attempt ${attempt}/${MAX})`);
    } catch (err) {
      console.warn(`[blog] ${path} fetch error (attempt ${attempt}/${MAX}):`, err);
    }
    if (attempt < MAX) await delay(300 * attempt);
  }
  console.warn(`[blog] ${path} — giving up after ${MAX} attempts (remote posts may be empty)`);
  return null;
}

/** Warn once if misconfigured — the authenticated CMS endpoint will 401. */
function ensureConfig(): void {
  if ((!BLG_API_KEY || !BLG_ORG_ID) && !warnedNoKey) {
    console.warn(
      "[blog] Remote Insights need BLG_API_KEY (the org's blg_ key) and NEXT_PUBLIC_BLG_ORG_ID (the org that key is bound to). Missing either → remote posts render empty.",
    );
    warnedNoKey = true;
  }
}

/**
 * All of the org's published posts (newest first). The list carries full
 * contentHtml, so this is the single source for both the index and detail pages.
 */
export async function getRemotePosts(): Promise<Post[]> {
  ensureConfig();
  if (!BLG_API_KEY || !BLG_ORG_ID) return [];
  const LIMIT = 100;
  const MAX_PAGES = 50; // safety backstop (5000 posts)
  const rows: CmsPostRow[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      status: "published",
      page: String(page),
      limit: String(LIMIT),
    });
    const data = await getJson<ListResponse>(`/api/v1/blogs/posts?${params.toString()}`);
    const items = data?.items ?? [];
    rows.push(...items);
    if (items.length < LIMIT) break; // last page
  }
  return rows
    .filter(isPublishable)
    .map(toPost)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime(),
    );
}

/** A single published remote post by slug (found within the org's list). */
export async function getRemotePost(slug: string): Promise<Post | null> {
  const posts = await getRemotePosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Plain-text body of a remote post (HTML stripped) — used by /llms-full.txt. */
export async function getRemotePostContent(slug: string): Promise<string> {
  const post = await getRemotePost(slug);
  if (!post?.contentHtml) return "";
  return post.contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
