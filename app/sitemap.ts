import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { getAllProjects } from "@/content/work";
import { getAllPosts } from "@/content/blog";
import { getMedia } from "@/content/media";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const abs = (path: string) => `${base}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: abs(""), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: abs("/work"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: abs("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const workRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => {
    const media = getMedia(p.slug);
    return {
      url: abs(`/work/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.tier === "flagship" ? 0.8 : 0.6,
      ...(media?.image ? { images: [new URL(media.image, base).toString()] } : {}),
    };
  });

  const blogRoutes: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: abs(`/blog/${post.slug}`),
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "yearly",
    priority: 0.6,
    images: [new URL(`/blog/${post.slug}/opengraph-image`, base).toString()],
  }));

  return [...staticRoutes, ...workRoutes, ...blogRoutes];
}
