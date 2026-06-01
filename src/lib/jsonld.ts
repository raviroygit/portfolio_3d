import { siteConfig } from "./seo";
import { experiences } from "@/content/work";

const abs = (path: string) => new URL(path, siteConfig.url).toString();

/** Stable @id for the Person node so other schemas can reference it. */
const PERSON_ID = `${siteConfig.url}/#person`;
const personRef = { "@id": PERSON_ID };

/** schema.org Person — sitewide identity. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    image: abs("/assets/logo.png"),
    email: `mailto:${siteConfig.email}`,
    jobTitle: "AI Platform Engineer & Infrastructure Architect",
    description: siteConfig.description,
    hasOccupation: {
      "@type": "Occupation",
      name: "AI Platform Engineer & Infrastructure Architect",
      description:
        "Designs and ships production AI platforms, multi-tenant SaaS, AI agents, and the LLM orchestration infrastructure behind them.",
      skills: [
        "AI Platform Engineering",
        "LLM Orchestration",
        "Multi-Tenant SaaS Architecture",
        "AI Agents & Voice AI",
        "RAG & Vector Search",
        "Authentication, RBAC & SSO",
        "Full-Stack & Mobile Development",
      ].join(", "),
    },
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
    worksFor: experiences.map((e) => ({
      "@type": "Organization",
      name: e.company,
      ...(e.url ? { url: e.url } : {}),
    })),
    sameAs: Object.values(siteConfig.social),
  };
}

/** schema.org WebSite. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: personRef,
  };
}

/** schema.org ProfilePage — strengthens the home page as the person's profile. */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    mainEntity: personRef,
    inLanguage: "en",
  };
}

/** schema.org BreadcrumbList. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** schema.org ItemList — for listing pages (e.g. /work). */
export function itemListSchema(input: {
  name: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: abs(item.path),
    })),
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
  const url = abs(`/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: abs(`/blog/${input.slug}/opengraph-image`),
    inLanguage: "en",
    author: personRef,
    publisher: personRef,
    keywords: input.tags?.join(", "),
  };
}

/** schema.org SoftwareApplication — case studies / products. */
export function softwareSchema(input: {
  name: string;
  description: string;
  slug: string;
  category: string;
  image?: string;
  appUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    applicationCategory: input.category,
    operatingSystem: "Web",
    url: abs(`/work/${input.slug}`),
    ...(input.appUrl ? { sameAs: input.appUrl } : {}),
    ...(input.image ? { image: new URL(input.image, siteConfig.url).toString() } : {}),
    author: personRef,
    publisher: personRef,
  };
}

/** Render helper: stringified JSON-LD for a <script> tag. */
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
