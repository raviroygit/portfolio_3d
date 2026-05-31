import { siteConfig } from "./seo";

/** schema.org Person — sitewide identity. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: "AI Platform Engineer & Infrastructure Architect",
    description: siteConfig.description,
    knowsAbout: [
      "AI Platforms",
      "AI Infrastructure",
      "LLM Orchestration",
      "Multi-Tenant SaaS",
      "AI Agents",
      "Voice AI",
      "Workflow Automation",
      "RBAC & SSO",
      "System Design",
    ],
    sameAs: Object.values(siteConfig.social),
  };
}

/** schema.org WebSite. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
  };
}

/** schema.org Article — blog posts. */
export function articleSchema(input: {
  title: string;
  description: string;
  slug: string;
  date: string;
  tags?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.date,
    url: new URL(`/blog/${input.slug}`, siteConfig.url).toString(),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    keywords: input.tags?.join(", "),
  };
}

/** schema.org SoftwareApplication — case studies / products. */
export function softwareSchema(input: {
  name: string;
  description: string;
  slug: string;
  category: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    applicationCategory: input.category,
    url: new URL(`/work/${input.slug}`, siteConfig.url).toString(),
    author: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
  };
}

/** Render helper: stringified JSON-LD for a <script> tag. */
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
