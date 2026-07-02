import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation for the blog. The CMS / blog-automation POSTs here
 * after publishing (or editing) a post so it appears instantly — no redeploy,
 * no waiting for the ISR window.
 *
 *   POST /api/revalidate
 *   header: x-revalidate-secret: <BLG_REVALIDATE_SECRET>
 *   (or ?secret=<...> for tools that can't set headers)
 *
 * Re-renders the blog index, every post page, and the derived feeds (sitemap,
 * RSS, llms.txt) — all of which refetch the backend. Secret-gated so only the
 * automation can trigger it.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.BLG_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: "revalidation not configured" },
      { status: 500 },
    );
  }

  const provided =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret") ??
    "";
  if (provided !== secret) {
    return NextResponse.json({ revalidated: false, error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/"); // home-page "Writing" rail
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
