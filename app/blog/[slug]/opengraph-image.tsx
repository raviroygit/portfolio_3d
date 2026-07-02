import { getPost, getPostSlugs } from "@/content/blog";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export async function generateStaticParams() {
  return (await getPostSlugs()).map((slug) => ({ slug }));
}

export const dynamicParams = true;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Writing by Ravi Roy";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  return renderOgCard({
    eyebrow: post ? `writing · ${post.frontmatter.category.toLowerCase()}` : "writing",
    title: post?.frontmatter.title ?? "Writing",
  });
}
