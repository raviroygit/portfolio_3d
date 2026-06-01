import type { Project, Capability, SkillGroup, Experience } from "./types";
import { getMedia } from "./media";

/**
 * Real products with live URLs. Screenshots, logos, and brand colors are
 * captured into public/assets/projects and merged at render via getMedia().
 * Architecture-focused, SEO-friendly copy. `TODO(ravi)` marks product specifics
 * to confirm.
 */

export const projects: Project[] = [
  {
    slug: "nextgen-ai-dev",
    name: "NextGen AI Dev",
    category: "AI Platform",
    group: "AI Platforms",
    url: "https://nxtgenaidev.com",
    tier: "product",
    accent: "signal",
    tagline:
      "The AI platform company behind Elevence, Echo AI, ClipCam & more — unified model access via one API.",
    role: "Founding Engineer & Platform Architect",
    timeframe: "2024 — present",
    problem:
      "NextGen AI Dev builds products (ClipCam, Echo AI, Elevence AI and more) on top of a unified AI platform — many models from many providers via one API. The core challenge: build shared infrastructure — orchestration, auth, billing, memory — once, so every product ships on a proven foundation instead of rebuilding it.",
    approach: [
      "Built a provider-agnostic AI orchestration backend on Mastra (Bun/Hono) routing 60+ providers.",
      "Centralized identity, multi-tenancy, and credits so every product is multi-tenant on day one.",
      "Composed products (Echo, Elevence, VoAgents, EXL) on the same platform primitives.",
    ],
    architecture: [
      "Mastra/Hono AI runtime + Express B2B layer scale independently.",
      "Model router with fallback and cost-aware selection across 60+ providers.",
      "Organization-aware memory and credit checks on every request.",
    ],
    stack: ["Mastra", "Bun", "Hono", "Express", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Pinecone"],
    links: { live: "https://nxtgenaidev.com" },
  },
  {
    slug: "elevence-ai",
    name: "Elevence AI",
    category: "AI Platform",
    group: "AI Platforms",
    url: "https://www.elevence.ai",
    tier: "flagship",
    featured: 1,
    accent: "signal",
    tagline:
      "One studio for GPT-5, Claude, Gemini & 60+ models — unified behind a single interface.",
    role: "Full-Stack Product Builder & Architect",
    timeframe: "2024 — present",
    problem:
      "Working across GPT-5, Claude, Gemini and dozens of other models means juggling separate APIs, keys, and UIs. Elevence AI unifies 60+ models into one studio so users work with all of them in a single place.",
    approach: [
      "Fronted the provider-agnostic orchestration layer with a unified multi-model studio UX.",
      "Built on the shared org-auth platform for instant multi-tenancy and access control.",
      "Made switching between 60+ models seamless — same interface, any provider.",
    ],
    architecture: [
      "60+ models behind one studio via the orchestration layer.",
      "Provider routing with fallback and cost-aware selection.",
      "Multi-tenant via the organization auth platform.",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "OpenAI"],
    links: { live: "https://www.elevence.ai" },
  },
  {
    slug: "echo-ai",
    name: "Echo AI",
    category: "Voice AI Assistant",
    group: "AI Platforms",
    url: "https://echo-ai.nxtgenaidev.com",
    tier: "product",
    accent: "cyan",
    tagline: "A voice-powered AI assistant with tool use and persistent memory.",
    role: "AI Engineer",
    timeframe: "2024",
    problem:
      "Echo AI is a voice-powered AI assistant — talk to it, and it uses tools and remembers context across sessions. Built on the NextGen platform with Google and email sign-in.",
    approach: [
      "Built the voice assistant experience on the shared agent + voice runtime.",
      "Tool-calling with persistent, per-user memory.",
      "Passwordless / social login via the auth platform.",
    ],
    architecture: [
      "Voice pipeline + agent runtime with tool use and memory.",
      "Runs on the orchestration layer for provider routing and fallback.",
      "Google + email auth via the identity platform.",
    ],
    stack: ["TypeScript", "Mastra", "OpenAI", "Pinecone", "Redis", "WebSockets"],
    links: { live: "https://echo-ai.nxtgenaidev.com" },
  },
  {
    slug: "exl-ai-playground",
    name: "EXL AI Playground",
    category: "AI Playground",
    group: "AI Platforms",
    url: "https://exlaiplayground.com",
    tier: "flagship",
    featured: 4,
    accent: "signal",
    tagline:
      "An interactive playground to experiment with language models, image generation, and AI tools — in real time.",
    role: "Full-Stack Engineer",
    timeframe: "2024",
    problem:
      "Builders need a fast way to test models, prompts, and AI tools without wiring up each provider. EXL AI Playground is an interactive sandbox to build, test, and explore AI capabilities in real time.",
    approach: [
      "Exposed the multi-provider orchestration layer through an interactive playground.",
      "Supported language models, image generation, and AI-powered tools in one UI.",
    ],
    architecture: [
      "Multi-model architecture — experiment across providers in one interface.",
      "Real-time execution backed by the provider-agnostic orchestration layer.",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "OpenAI"],
    links: { live: "https://exlaiplayground.com" },
  },
  {
    slug: "voagents-ai",
    name: "VoAgents AI",
    category: "Voice AI",
    group: "AI Platforms",
    url: "https://voagents.ai",
    tier: "flagship",
    featured: 2,
    accent: "cyan",
    tagline:
      "AI voice agents & phone assistants that answer, schedule, and convert calls automatically.",
    role: "AI Engineer & System Architect",
    timeframe: "2024 — present",
    problem:
      "Businesses miss calls, and staffing phone lines is expensive. VoAgents AI fields real phone calls with AI voice agents — answering, scheduling, and converting — at production scale, not in a demo.",
    approach: [
      "Engineered a streaming speech pipeline (STT → LLM → TTS) tuned for conversational latency.",
      "Added barge-in / interruption handling for natural phone conversations.",
      "Gave agents tools + memory to answer, schedule, and convert on the call.",
    ],
    architecture: [
      "Low-latency streaming STT → LLM → TTS loop with interruption handling.",
      "Telephony integration for inbound/outbound calls.",
      "Agent runtime with tool-calling on the shared orchestration layer.",
    ],
    metrics: [
      { label: "Uptime", value: "99%" },
      { label: "Daily calls", value: "6,342+" },
      { label: "Capability", value: "Answer · Schedule · Convert" },
    ],
    stack: ["TypeScript", "Node.js", "Mastra", "OpenAI", "WebSockets", "Telephony"],
    links: { live: "https://voagents.ai" },
  },
  {
    slug: "clipcam",
    name: "ClipCam",
    category: "Consumer App",
    group: "SaaS Products",
    url: "https://www.clipcam.app",
    tier: "flagship",
    featured: 3,
    accent: "signal",
    tagline:
      "Reaction clips in seconds — record over any clip, auto-stitched in the cloud.",
    role: "Full-Stack & Mobile Developer",
    timeframe: "2024 — present",
    problem:
      "Making side-by-side reaction videos means fiddly editing. ClipCam makes it one tap: press record, react over any source clip, and a polished side-by-side export is stitched in the cloud while you keep filming. Built for short-form creators who want to ship fast — on iOS, Android, and web.",
    approach: [
      "Built the cross-platform capture app (iOS · Android · Web) for one-tap recording.",
      "Cloud rendering stitches the side-by-side export automatically — no manual editing.",
      "One-tap export + direct share to YouTube, TikTok, Instagram, and X.",
      "Passwordless: end-to-end OTP, no passwords.",
    ],
    architecture: [
      "Capture clients with a cloud-side compositing/render pipeline.",
      "Aspect/layout/source pipeline (16:9, 9:16, 1:1) for every platform.",
      "Multi-platform share targets + OTP auth via the identity platform.",
    ],
    stack: ["React Native", "Expo", "Node.js", "TypeScript", "FFmpeg", "Cloud Render"],
    links: { live: "https://www.clipcam.app" },
  },
  {
    slug: "fanisin",
    name: "Fanisin",
    category: "Consumer AI",
    group: "SaaS Products",
    url: "https://fanisin.com",
    tier: "flagship",
    featured: 5,
    accent: "cyan",
    tagline:
      "Where every fan is in — live video, voice, and text with AI twins of creators.",
    role: "AI Engineer & Full-Stack Developer",
    timeframe: "2023 — 2024",
    problem:
      "Fanisin lets fans have live video calls, voice calls, and texting with AI twins of creators and experts — the closest you've ever been. Each twin captures a real person's voice and style for real-time conversation.",
    approach: [
      "Built the AI-twin persona system and the real-time conversation experience.",
      "Integrated live video, voice, and text channels into one product.",
      "Ran on the shared AI orchestration layer for model access and routing.",
    ],
    architecture: [
      "Real-time AI-twin runtime over video / voice / text channels.",
      "Per-twin persona context + memory on the orchestration + identity platform.",
    ],
    stack: ["Next.js", "Node.js", "TypeScript", "PostgreSQL", "OpenAI", "WebRTC"],
    links: { live: "https://fanisin.com" },
  },
  {
    slug: "bae-i",
    name: "BAE-I",
    category: "Consumer AI",
    group: "SaaS Products",
    url: "https://bae-i.com",
    tier: "product",
    accent: "signal",
    tagline: "Your AI companion — conversational, always available.",
    role: "AI Engineer & Full-Stack Developer",
    timeframe: "2024",
    problem:
      "BAE-I is an AI companion product — a conversational AI persona built for ongoing, personal interaction.",
    approach: [
      "Built the conversational companion experience and persona memory.",
      "Ran on the shared orchestration layer for model routing.",
    ],
    architecture: [
      "Conversational AI runtime with persistent, user-scoped memory.",
      "Built on the orchestration + auth platform.",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "OpenAI", "Pinecone"],
    links: { live: "https://bae-i.com" },
  },
  {
    slug: "hihellohr",
    name: "HiHelloHR",
    category: "Enterprise / HR",
    group: "Enterprise Systems",
    url: "https://hihellohr.com",
    tier: "flagship",
    featured: 6,
    accent: "cyan",
    tagline:
      "A full HRMS — payroll, attendance, facial recognition, and IoT access control.",
    role: "Platform & Full-Stack Engineer",
    timeframe: "2022 — present",
    problem:
      "Businesses needed one system spanning HR, payroll, attendance, and physical access — software and hardware — instead of stitching together separate vendors. HiHelloHR manages employee data, payroll, and time & attendance, and extends into facial-recognition attendance and IoT-based door access.",
    approach: [
      "Built the HRMS — employee data, payroll, and time & attendance tracking — end to end.",
      "Added facial recognition for attendance and an IoT door controller for access control.",
      "Unified people data, attendance, and physical access into one platform.",
    ],
    architecture: [
      "HRMS: employee data, payroll, leave & attendance",
      "Facial-recognition attendance",
      "IoT door controller integration",
      "Access-control system bridging software + hardware",
    ],
    stack: ["React Native", "Node.js", "TypeScript", "MongoDB", "IoT", "Computer Vision"],
    links: { live: "https://hihellohr.com" },
  },
  {
    slug: "parking-bucket",
    name: "Parking Bucket",
    category: "Smart Parking",
    group: "Enterprise Systems",
    url: "https://parkingbucket.com",
    tier: "product",
    accent: "signal",
    tagline: "A smart parking platform — book and manage parking before you arrive.",
    role: "Full-Stack & Mobile Developer",
    timeframe: "2022",
    problem:
      "Drivers waste time and fuel hunting for parking. Parking Bucket lets them find, book, navigate to, and review parking spaces ahead of time.",
    approach: [
      "Built the booking platform and mobile app end to end.",
      "Search, booking, navigation, and reviews for parking spaces.",
    ],
    architecture: [
      "Location-based parking search + booking with a mobile client.",
      "Navigation and review system over a production backend.",
    ],
    stack: ["Angular", "Cordova", "Node.js", "MongoDB"],
    links: { live: "https://parkingbucket.com" },
  },
  {
    slug: "evenlysplit",
    name: "EvenlySplit",
    category: "Mobile App",
    group: "SaaS Products",
    url: "https://play.google.com/store/apps/details?id=com.nxtgenaidev.evenly",
    tier: "product",
    accent: "signal",
    tagline:
      "Split expenses with friends, roommates & groups — settle up instantly. iOS & Android.",
    role: "Full-Stack & Mobile Engineer",
    timeframe: "2024 — present",
    problem:
      "EvenlySplit is the smartest way to split expenses with friends, roommates, and groups — track who owes what, settle up instantly, and never lose track of shared costs. Shipped on both the App Store and Google Play.",
    approach: [
      "Built the cross-platform mobile app (Expo / React Native) for iOS and Android.",
      "Group expense splitting with real-time balances and an expense khata/ledger.",
      "Debt-simplification to minimize the number of settlements between members.",
      "Multi-currency support with push notifications for activity and settle-ups.",
    ],
    architecture: [
      "Expo / React Native client on a Fastify + PostgreSQL backend.",
      "Debt-simplification algorithm for minimal settlements.",
      "Groups, balances, settlements, and khata over a typed API.",
    ],
    stack: ["React Native", "Expo", "Fastify", "TypeScript", "PostgreSQL", "Drizzle"],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.nxtgenaidev.evenly",
      appStore: "https://apps.apple.com/us/app/evenlysplit-expense-khata/id6756101586",
    },
  },
  {
    slug: "healthcare-rag",
    name: "HealthCare RAG",
    category: "Healthcare AI",
    group: "AI Platforms",
    tier: "product",
    accent: "cyan",
    tagline:
      "Automated, HIPAA-compliant health report generation with RAG over clinical data.",
    role: "AI Engineer",
    timeframe: "2024",
    problem:
      "Clinicians spend hours turning raw lab reports, imaging notes, and patient histories into readable summaries. HealthCare RAG automates report generation with retrieval-augmented generation over clinical data — context-rich, personalized, and privacy-compliant.",
    approach: [
      "Built a RAG pipeline orchestrated with LangChain for multi-step clinical workflows.",
      "Used domain-specific medical embedding models (BioBERT, PubMedBERT) for accurate retrieval.",
      "Parsed clinical data — lab reports, imaging notes, patient histories — into a searchable vector store.",
      "Generated context-aware, per-patient summaries under HIPAA / GDPR data-privacy constraints.",
    ],
    architecture: [
      "Retrieval-augmented generation with medical embeddings (BioBERT / PubMedBERT).",
      "LangChain orchestration of multi-step retrieval → reasoning → summary.",
      "HIPAA / GDPR-compliant data handling with real-time analytics on system performance.",
    ],
    stack: ["LangChain", "RAG", "BioBERT", "PubMedBERT", "Pinecone", "Node.js", "TypeScript"],
    links: {},
  },
  {
    slug: "askvoya",
    name: "AskVoya",
    category: "AI Travel Assistant",
    group: "AI Platforms",
    url: "https://askvoya.com",
    tier: "product",
    accent: "signal",
    tagline:
      "An AI travel-assistant chatbot on WhatsApp — answering up to 90% of traveler questions, 24/7.",
    role: "AI Engineer & Full-Stack Developer",
    timeframe: "2024 — present",
    problem:
      "Tour operators and travel agencies field the same traveler questions around the clock, in many languages. Voya is an AI travel-assistant chatbot on WhatsApp that handles up to 90% of those questions automatically — itineraries, bookings, recommendations — so agencies deliver 24/7 personalized support without scaling headcount.",
    approach: [
      "Built a WhatsApp-native conversational assistant with multilingual support out of the box.",
      "Added itinerary management — real-time updates, changes, and location-specific recommendations.",
      "Answered contextual queries on hotels, flights, weather, dining, activities, and distances.",
      "Layered in marketing templates, review collection, and emergency/crisis assistance.",
    ],
    architecture: [
      "WhatsApp messaging integration over a context-aware conversational AI runtime.",
      "Multilingual NLU with itinerary and booking context per traveler.",
      "Built on the shared orchestration layer for model routing and fallback.",
    ],
    metrics: [
      { label: "Questions handled", value: "Up to 90%" },
      { label: "Availability", value: "24/7" },
      { label: "Channel", value: "WhatsApp" },
    ],
    stack: ["Next.js", "Node.js", "TypeScript", "OpenAI", "WhatsApp API", "PostgreSQL"],
    links: { live: "https://askvoya.com" },
  },
  {
    slug: "whatsapp-ai-bot",
    name: "WhatsApp AI Bot",
    category: "AI Assistant",
    group: "SaaS Products",
    tier: "product",
    accent: "signal",
    tagline:
      "A smart WhatsApp bot that automates responses with document-grounded, multi-language AI.",
    role: "AI Engineer & Full-Stack Developer",
    timeframe: "2023",
    problem:
      "Teams field the same questions on events, travel, and documents over and over. This WhatsApp bot automates responses with context-aware AI — grounded in documents, with reminders, notifications, and integrations.",
    approach: [
      "Built document-based Q&A over PDFs, spreadsheets, and databases for instant answers.",
      "Added event/travel notifications, flight tracking, and location recommendations (Google Maps).",
      "Delivered a personalized, context-aware chatbot with multi-language support and custom reminders.",
    ],
    architecture: [
      "Retrieval over documents + databases for grounded answers.",
      "WhatsApp messaging integration with scheduled reminders and notifications.",
      "Third-party API integrations (flights, maps) behind a conversational layer.",
    ],
    stack: ["Node.js", "TypeScript", "OpenAI", "RAG", "WhatsApp API", "MongoDB"],
    links: {},
  },
  {
    slug: "pawpal-ai",
    name: "PawPal AI",
    category: "Consumer AI",
    group: "SaaS Products",
    tier: "product",
    accent: "cyan",
    tagline:
      "A smart pet companion — voice chat with breed avatars, AI image analysis & generation.",
    role: "AI Engineer & Full-Stack Developer",
    timeframe: "2023",
    problem:
      "Pet owners want quick, trustworthy guidance on breeds, health, and care. PawPal AI pairs interactive breed avatars with voice conversation and AI image analysis to make pet guidance hands-free and personal.",
    approach: [
      "Built voice-to-voice conversations with AI avatars of different dog breeds.",
      "Added AI image analysis (health, breed, mood) and AI-generated pet portraits.",
      "Gave breed-selection and care/training guidance from lifestyle and activity inputs.",
    ],
    architecture: [
      "Voice pipeline + per-breed avatar personas for hands-free guidance.",
      "Image analysis + generation pipeline for health, breed, and portrait features.",
    ],
    stack: ["React Native", "Expo", "Node.js", "TypeScript", "OpenAI"],
    links: {},
  },
  {
    slug: "3spay",
    name: "3SPay",
    category: "Fintech / POS",
    group: "Enterprise Systems",
    url: "https://3s-pay.com",
    tier: "product",
    accent: "signal",
    tagline:
      "A POS payment platform — secure card management, transaction processing & reporting.",
    role: "Backend Engineer",
    timeframe: "2022",
    problem:
      "POS operators need secure, reliable payment processing with clear reporting. 3SPay delivers card management, transaction processing, and user analytics on a secure, optimized backend.",
    approach: [
      "Built a secure, optimized backend for seamless payment processing.",
      "Implemented card management, transaction processing, and user analytics/reporting.",
      "Improved user management and operational efficiency for POS systems.",
    ],
    architecture: [
      "Secure payment-processing backend with card management.",
      "Transaction pipeline with analytics and reporting.",
    ],
    stack: ["Node.js", "Express", "TypeScript", "MongoDB"],
    links: { live: "https://3s-pay.com" },
  },
  {
    slug: "npm-packages",
    name: "NPM Packages",
    category: "Open Source",
    group: "Enterprise Systems",
    tier: "product",
    accent: "cyan",
    tagline:
      "Published NPM packages for multi-platform efficiency — GPS, scanning, updates & sync.",
    role: "Author & Maintainer",
    timeframe: "2021 — 2023",
    problem:
      "Cross-platform apps repeatedly re-implement device features and sync. I authored reusable NPM packages so teams get GPS, scanning, auto-updates, and real-time sync as drop-in modules.",
    approach: [
      "Published GPS data integration for location-based functionality.",
      "Built scanner / QR-code support to accelerate data capture.",
      "Added Windows app update automation and real-time cross-platform data sync.",
    ],
    architecture: [
      "Reusable, versioned NPM modules consumed across multiple apps.",
      "Native-bridge integrations (GPS, scanner) with real-time sync.",
    ],
    stack: ["TypeScript", "JavaScript", "Node.js", "npm"],
    links: {},
  },
];

export const projectGroups = [
  "AI Platforms",
  "SaaS Products",
  "Enterprise Systems",
] as const;

export const capabilities: Capability[] = [
  {
    title: "AI Platforms & Orchestration",
    description:
      "The runtime that makes AI products possible — routing, fallback, and multi-model architecture across 60+ providers.",
    items: [
      "AI orchestration backend (Mastra)",
      "Provider-agnostic model routing",
      "Multi-provider architecture",
      "Organization-aware AI memory",
    ],
  },
  {
    title: "AI Agents & Voice AI",
    description:
      "Agents that use tools and remember context, and voice systems that hold real conversations.",
    items: [
      "Tool-calling agent runtimes",
      "Low-latency voice pipelines (STT → LLM → TTS)",
      "Interruption / barge-in handling",
      "RAG & tenant-scoped memory",
    ],
  },
  {
    title: "Workflow Automation",
    description:
      "Node-based pipelines and content distribution that run reliably, async, at scale.",
    items: [
      "Node-based workflow engine",
      "Scheduling & async execution",
      "Retries & queue processing",
      "Multi-channel content distribution",
    ],
  },
  {
    title: "Auth, Identity & Multi-Tenancy",
    description: "The hard identity layer — solved once, reused everywhere.",
    items: [
      "Multi-tenant orgs & projects",
      "RBAC, SSO, passwordless",
      "Audit logs & session management",
      "Encrypted secret vault",
    ],
  },
  {
    title: "Mobile & Web Products",
    description: "End-to-end product delivery, from data model to app store.",
    items: [
      "React Native / Expo apps",
      "Next.js / React / Vue / Ionic web",
      "Production backends (Fastify / Express / NestJS)",
      "Hardware / IoT integration",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    group: "AI & Infrastructure",
    skills: ["LLM Infrastructure", "AI Orchestration", "Model Routing", "AI Agents", "Voice AI", "RAG / Memory", "LangChain", "Mastra", "OpenAI", "Google Gemini", "Ollama", "TensorFlow"],
  },
  {
    group: "Backend",
    skills: ["Node.js", "NestJS", "Fastify", "Express", "Hono", "Bun", "TypeScript", "GraphQL", "gRPC", "Keycloak"],
  },
  {
    group: "Data & Vector",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Pinecone", "Chroma", "Firebase", "Drizzle", "Mongoose", "Sequelize"],
  },
  {
    group: "Frontend & Mobile",
    skills: ["React", "Next.js", "React Native", "Expo", "Vue.js", "Ionic", "Cordova", "Three.js", "Tailwind CSS", "shadcn/ui"],
  },
  {
    group: "Cloud & DevOps",
    skills: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Vercel", "Railway", "Heroku", "CI/CD", "Firebase"],
  },
  {
    group: "Architecture",
    skills: ["Multi-Tenant SaaS", "RBAC / SSO", "Workflow Automation", "System Design", "Secret Vaults", "IoT Integration"],
  },
];

export const experiences: Experience[] = [
  {
    role: "Freelance AI Platform & Full-Stack Engineer (Remote)",
    company: "Independent — NextGen AI Dev",
    url: "https://nxtgenaidev.com",
    date: "2025 — Present",
    points: [
      "Design and ship production AI platforms, orchestration infrastructure, and multi-tenant SaaS for clients — remote, end to end, from Postgres to LLM routing to web and mobile.",
      "Built the AI orchestration backend routing 60+ providers with fallback and cost-aware selection.",
      "Built an org-based auth platform (RBAC, SSO, passwordless, secret vault, audit logs) every product delegates to.",
      "Ship AI, voice, consumer, and enterprise products (Elevence, Echo, VoAgents, ClipCam, HiHelloHR) on the shared NextGen platform.",
    ],
  },
  {
    role: "Lead Software Engineer",
    company: "Mapping Metrics (AI-Powered)",
    date: "2024 — 2025",
    points: [
      "Led engineering on AI-powered products — owning architecture, delivery, and the AI integration layer.",
      "Built RAG, agent, and voice-AI systems and the orchestration around them.",
      "Mentored engineers and drove technical decisions across the stack.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Dipole Tech Innovation (OPC) Pvt. Ltd.",
    date: "2021 — 2024",
    points: [
      "Delivered 6+ production projects spanning web, mobile, and backend.",
      "Architected scalable Node.js services and React / React Native clients end to end.",
      "Owned features from data model to deployment across multiple client products.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Ezycerts Solutions Pvt. Ltd.",
    url: "https://www.ezycerts.com/",
    date: "2018 — 2021",
    points: [
      "Built and maintained production web applications across the MERN stack.",
      "Collaborated cross-functionally to ship 5+ products end to end.",
      "Implemented responsive, cross-browser interfaces and reviewed code for quality.",
    ],
  },
];

// ---- selectors -----------------------------------------------------------

/** Projects with a real screenshot/poster rank ahead of image-less ones.
 *  Array.prototype.sort is stable, so relative order is otherwise preserved. */
const hasImage = (p: Project) => Boolean(getMedia(p.slug)?.image);
const rankByMedia = (list: Project[]) =>
  [...list].sort((a, b) => Number(hasImage(b)) - Number(hasImage(a)));

export const getAllProjects = () => rankByMedia(projects);

export const getFeaturedProjects = () =>
  projects
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99));

export const getProjectsByGroup = (group: string) =>
  rankByMedia(projects.filter((p) => p.group === group));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getProjectSlugs = () => projects.map((p) => p.slug);
