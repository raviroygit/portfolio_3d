import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { getRemotePost, getRemotePosts, getRemotePostContent } from "./blog-remote";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  tags: string[];
  draft?: boolean;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  readingTime: string;
  /** Where the post comes from: local MDX file vs. the remote CMS. */
  source: "local" | "remote";
  /** Pre-rendered HTML body (remote posts only; local posts render via MDX import). */
  contentHtml?: string;
  /** Optional cover image URL (remote posts). */
  coverImageUrl?: string | null;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: data as PostFrontmatter,
    readingTime: readingTime(content).text,
    source: "local",
  };
}

/** Local MDX posts, newest first (drafts excluded). */
function getLocalPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPostFile)
    .filter((p) => !p.frontmatter.draft);
}

function getLocalPost(slug: string): Post | undefined {
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const md = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(mdx)) return readPostFile(`${slug}.mdx`);
  if (fs.existsSync(md)) return readPostFile(`${slug}.md`);
  return undefined;
}

/** All published posts (local MDX + remote CMS), newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const [local, remote] = await Promise.all([
    Promise.resolve(getLocalPosts()),
    getRemotePosts(),
  ]);
  return [...local, ...remote].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime(),
  );
}

/** Fetch a single post by slug — local MDX takes precedence over remote. */
export async function getPost(slug: string): Promise<Post | undefined> {
  const local = getLocalPost(slug);
  if (local) return local;
  return (await getRemotePost(slug)) ?? undefined;
}

export async function getPostSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((p) => p.slug);
}

/** Plain-text body (frontmatter/HTML stripped) — used by /llms-full.txt. */
export async function getPostContent(slug: string): Promise<string> {
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.existsSync(mdx) ? mdx : fs.existsSync(md) ? md : null;
  if (file) return matter(fs.readFileSync(file, "utf8")).content.trim();
  return getRemotePostContent(slug);
}
