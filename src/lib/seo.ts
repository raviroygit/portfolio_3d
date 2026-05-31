import type { Metadata } from "next";

export const siteConfig = {
  name: "Ravi Roy",
  title: "Ravi Roy — AI Platform Engineer & Infrastructure Architect",
  description:
    "AI Platform Engineer & Infrastructure Architect. I design and ship production AI platforms, multi-tenant SaaS, and the orchestration infrastructure behind them — end to end, from Postgres to LLM routing to mobile.",
  url: "https://raviroy.in",
  locale: "en_US",
  email: "ravi140398@gmail.com",
  social: {
    github: "https://github.com/raviroygit",
    linkedin: "https://www.linkedin.com/in/erraviroy/",
  },
  // TODO(ravi): add a real Cal.com / Calendly link for the "Book a call" CTA.
  calendar: "",
} as const;

export const navItems = [
  { label: "Work", href: "/work" },
  { label: "Infrastructure", href: "/#ai-infrastructure" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
  images?: { url: string }[];
};

/** Single helper to produce consistent per-route Metadata. */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  type = "website",
  publishedTime,
  tags,
  images,
}: BuildMetadataInput = {}): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const resolvedTitle = title ?? siteConfig.title;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
