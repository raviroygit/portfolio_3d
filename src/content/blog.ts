import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

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
  };
}

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(readPostFile)
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getPost(slug: string): Post | undefined {
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const md = path.join(BLOG_DIR, `${slug}.md`);
  if (fs.existsSync(mdx)) return readPostFile(`${slug}.mdx`);
  if (fs.existsSync(md)) return readPostFile(`${slug}.md`);
  return undefined;
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
