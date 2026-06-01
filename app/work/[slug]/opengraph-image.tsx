import { getProject, getProjectSlugs } from "@/content/work";
import { renderOgCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study by Ravi Roy";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  return renderOgCard({
    eyebrow: project ? `case study · ${project.category.toLowerCase()}` : "case study",
    title: project?.name ?? "Work",
    footer: project ? [project.group.toLowerCase()] : undefined,
  });
}
