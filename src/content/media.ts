import meta from "../../public/assets/projects/meta.json";

export type ProjectMedia = {
  slug: string;
  url: string;
  finalUrl: string;
  title: string | null;
  description: string | null;
  themeColor: string | null;
  dominant: string | null;
  image: string | null;
  dims: { width: number; height: number } | null;
  logo: string | null;
};

const map = new Map<string, ProjectMedia>(
  (meta as ProjectMedia[]).map((m) => [m.slug, m]),
);

/** Real captured screenshot / logo / brand color for a project, by slug. */
export function getMedia(slug: string): ProjectMedia | undefined {
  return map.get(slug);
}
