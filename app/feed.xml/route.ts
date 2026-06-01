import { siteConfig } from "@/lib/seo";
import { getAllPosts } from "@/content/blog";

export const dynamic = "force-static";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function GET() {
  const abs = (path: string) => new URL(path, siteConfig.url).toString();
  const posts = getAllPosts();
  const lastBuild = posts[0]?.frontmatter.date
    ? new Date(posts[0].frontmatter.date).toUTCString()
    : new Date(0).toUTCString();

  const items = posts
    .map((post) => {
      const url = abs(`/blog/${post.slug}`);
      return `    <item>
      <title>${esc(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
      <category>${esc(post.frontmatter.category)}</category>
      <description>${esc(post.frontmatter.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteConfig.name)} — Writing</title>
    <link>${abs("/blog")}</link>
    <atom:link href="${abs("/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>${esc(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
