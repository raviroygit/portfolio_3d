import { siteConfig, navItems } from "./seo";
import { getAllProjects, projectGroups, getProjectsByGroup } from "@/content/work";
import { getAllPosts, getPostContent } from "@/content/blog";
import type { Project } from "@/content/types";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/**
 * Curated /llms.txt — a Markdown index of the site for LLMs and AI crawlers,
 * following the https://llmstxt.org convention. Generated from content data so
 * it never drifts from the live pages.
 */
export function buildLlmsTxt(): string {
  const posts = getAllPosts();
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.description}`);
  lines.push("");
  lines.push(
    `${siteConfig.name} is an AI Platform Engineer & Infrastructure Architect. ` +
      `This portfolio documents the AI platforms, multi-tenant SaaS products, and ` +
      `orchestration infrastructure he designs and ships end to end.`,
  );
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  for (const item of navItems) {
    lines.push(`- [${item.label}](${abs(item.href)})`);
  }
  lines.push("");

  lines.push("## Work & Case Studies");
  lines.push("");
  for (const group of projectGroups) {
    const items = getProjectsByGroup(group);
    if (items.length === 0) continue;
    lines.push(`### ${group}`);
    lines.push("");
    for (const p of items) {
      lines.push(`- [${p.name}](${abs(`/work/${p.slug}`)}): ${p.tagline}`);
    }
    lines.push("");
  }

  lines.push("## Writing");
  lines.push("");
  if (posts.length === 0) {
    lines.push("- No posts published yet.");
  } else {
    for (const post of posts) {
      lines.push(
        `- [${post.frontmatter.title}](${abs(`/blog/${post.slug}`)}): ${post.frontmatter.description}`,
      );
    }
  }
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: ${siteConfig.email}`);
  lines.push(`- GitHub: ${siteConfig.social.github}`);
  lines.push(`- LinkedIn: ${siteConfig.social.linkedin}`);
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Full content (llms-full.txt)](${abs("/llms-full.txt")}): every project and post in full.`,
  );
  lines.push("");

  return lines.join("\n");
}

function projectDetail(p: Project): string {
  const out: string[] = [];
  out.push(`## ${p.name}`);
  out.push("");
  out.push(`- URL: ${abs(`/work/${p.slug}`)}`);
  if (p.url) out.push(`- Live: ${p.url}`);
  out.push(`- Category: ${p.category} (${p.group})`);
  out.push(`- Role: ${p.role}`);
  out.push(`- Timeframe: ${p.timeframe}`);
  out.push("");
  out.push(p.tagline);
  out.push("");
  out.push("### Problem");
  out.push(p.problem);
  out.push("");
  out.push("### Approach");
  for (const a of p.approach) out.push(`- ${a}`);
  out.push("");
  out.push("### Architecture");
  for (const a of p.architecture) out.push(`- ${a}`);
  out.push("");
  if (p.metrics && p.metrics.length > 0) {
    out.push("### Metrics");
    for (const m of p.metrics) out.push(`- ${m.value} — ${m.label}`);
    out.push("");
  }
  out.push(`### Stack`);
  out.push(p.stack.join(", "));
  out.push("");
  return out.join("\n");
}

/** /llms-full.txt — the index plus full text of every project and blog post. */
export function buildLlmsFullTxt(): string {
  const lines: string[] = [buildLlmsTxt()];

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("# Full Project Detail");
  lines.push("");
  for (const p of getAllProjects()) {
    lines.push(projectDetail(p));
  }

  const posts = getAllPosts();
  if (posts.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("# Full Writing");
    lines.push("");
    for (const post of posts) {
      lines.push(`## ${post.frontmatter.title}`);
      lines.push("");
      lines.push(`- URL: ${abs(`/blog/${post.slug}`)}`);
      lines.push(`- Published: ${post.frontmatter.date}`);
      lines.push(`- Tags: ${post.frontmatter.tags.join(", ")}`);
      lines.push("");
      lines.push(getPostContent(post.slug));
      lines.push("");
    }
  }

  return lines.join("\n");
}
