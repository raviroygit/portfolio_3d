export type InfraSystem = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  /** the systems-level capabilities that prove depth */
  capabilities: string[];
  /** optional secondary grouping (e.g. supported channels) */
  supports?: { label: string; items: string[] };
  stack: string[];
  accent: "signal" | "cyan";
};

/**
 * Internal infrastructure I've built and run in production. These are platforms
 * other products delegate to — the unglamorous hard layer that makes everything
 * above it possible. Architecture-focused, SEO-friendly.
 */
export const infraSystems: InfraSystem[] = [
  {
    slug: "ai-orchestration-platform",
    index: "01",
    name: "AI Orchestration Platform",
    tagline: "One API in front of 60+ model providers.",
    description:
      "A provider-agnostic orchestration layer that routes every AI request across 60+ providers with fallback and cost-aware selection. Apps ask for a capability; the platform decides which model answers — so products are never locked to a single vendor.",
    capabilities: [
      "60+ AI providers behind one interface",
      "Model routing with fallback & cost-aware selection",
      "Multi-provider architecture (fan-out / fail-over)",
      "AI workflows chaining models + tools",
      "Mastra backend (Bun / Hono) runtime",
      "Organization-aware AI memory",
    ],
    stack: ["Mastra", "Bun", "Hono", "TypeScript", "PostgreSQL", "Redis", "Pinecone"],
    accent: "signal",
  },
  {
    slug: "workflow-orchestration-engine",
    index: "02",
    name: "Workflow Orchestration Engine",
    tagline: "Node-based pipelines that run reliably, async, at scale.",
    description:
      "A node-based workflow engine for automating multi-step pipelines — scheduled or event-driven, executed asynchronously with retries and backoff. The substrate behind automations across the platform.",
    capabilities: [
      "Node-based visual workflows",
      "Scheduling (cron + event triggers)",
      "Asynchronous execution",
      "Automatic retries with backoff",
      "Multi-step pipelines with branching",
      "Durable queue processing",
    ],
    stack: ["Node.js", "TypeScript", "Redis", "BullMQ", "PostgreSQL"],
    accent: "cyan",
  },
  {
    slug: "content-distribution-infrastructure",
    index: "03",
    name: "Content Distribution Infrastructure",
    tagline: "Publish once, distribute everywhere — on schedule.",
    description:
      "A multi-channel distribution system that schedules, repurposes, and auto-publishes content across social platforms and blogs through OAuth integrations and queue-backed processing.",
    capabilities: [
      "Scheduling & auto-publishing",
      "Content repurposing per channel",
      "Multi-channel distribution",
      "OAuth integrations",
      "Queue processing",
    ],
    supports: {
      label: "Channels",
      items: [
        "LinkedIn",
        "X / Twitter",
        "Facebook",
        "Instagram",
        "WordPress",
        "Ghost",
        "Dev.to",
        "Custom Blogs",
      ],
    },
    stack: ["Node.js", "TypeScript", "Redis", "OAuth 2.0", "PostgreSQL"],
    accent: "signal",
  },
  {
    slug: "authentication-platform",
    index: "04",
    name: "Authentication Platform",
    tagline: "Multi-tenant identity, solved once for every product.",
    description:
      "The org-first identity platform every product delegates to: multi-tenant organizations and projects, RBAC, SSO, passwordless and social login, session management, audit logs, and an encrypted secret vault.",
    capabilities: [
      "Multi-tenant — organizations & projects",
      "RBAC (org / role / resource)",
      "SSO + passwordless + email OTP",
      "Social login",
      "Session management",
      "Audit logs",
      "Encrypted secret vault",
    ],
    stack: ["NestJS", "Node.js", "TypeScript", "PostgreSQL", "Redis", "JWT"],
    accent: "cyan",
  },
];
