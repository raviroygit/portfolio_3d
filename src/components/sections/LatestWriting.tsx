import { Section } from "@/components/ui/Section";
import { getAllPosts } from "@/content/blog";
import { WritingCarousel, type WritingCard } from "./WritingCarousel";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Home-page "Writing" rail: latest posts in a scrollable carousel. */
export async function LatestWriting() {
  const posts = await getAllPosts();
  if (posts.length === 0) return null;

  const cards: WritingCard[] = posts.slice(0, 10).map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    description: p.frontmatter.description,
    category: p.frontmatter.category,
    dateLabel: formatDate(p.frontmatter.date),
    readingTime: p.readingTime,
    coverImageUrl: p.coverImageUrl ?? null,
  }));

  return (
    <Section id="writing">
      <WritingCarousel posts={cards} />
    </Section>
  );
}
