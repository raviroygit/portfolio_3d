# Ravi Roy — Portfolio Strategy & Positioning

> A brutally honest strategy doc for repositioning raviroy.in from a "generic React developer
> portfolio" into a **premium AI-platform-engineer & infrastructure-architect** presence.
> This is the source of truth for the rebuild. Copy in the site should trace back to this.

---

## 0. The brutal-honest assessment (read this first)

Your current site **actively undersells you.** It is the well-known JS-Mastery 3D template, and it shows. Specifically, it works against you in five ways:

1. **It positions you as a freelancer, not an architect.** The hero says *"I develop iOS, Android, 3D visuals, user interfaces and web applications."* That is a list of *deliverables a junior contractor offers*, not the identity of someone who builds AI platforms and multi-tenant infrastructure. It reads as "will build whatever you pay for."
2. **The proof is weak and partly fake-looking.** Two of the four projects ("Portfolio 1", "Portfolio 2") share the **exact same description as Parking Bucket** ("You are going out of station…"). Anyone technical will spot copy-paste filler instantly and discount everything else on the page.
3. **The testimonials signal the wrong tier.** *"our traffic increased by 50%"* and *"impossible to make a website as beautiful as our product"* are small-agency, marketing-site testimonials. They scream "freelancer who makes nice websites," which is the **exact opposite** of what you want to be hired for.
4. **Zero evidence of the thing that makes you valuable.** Nowhere does it say you built an AI orchestration backend routing **60+ providers**, an org-based **auth/RBAC/SSO/secret-vault** platform, **voice AI** systems, or **multi-tenant SaaS**. The single most differentiating fact about you is completely absent.
5. **The skills list is generic and dated.** HTML/CSS/jQuery-era framing (HTML5, CSS3, Redux, Bootstrap-tier tags) buries the modern, in-demand stack (LLM infra, Pinecone, agents, NestJS, Fastify, multi-tenant Postgres).

**The fix is not cosmetic.** A nicer hero on the same content still says "freelancer." We reposition the *substance*: lead with platforms and infrastructure, prove it with real architecture, and retire the marketing-site framing entirely.

**One more honest note:** the moment you claim "AI Platform Engineer," technical buyers will look for proof. Vague claims hurt more than no claims. Every product needs at least one concrete, true detail (a number, an architecture decision, a scale figure). Placeholders are flagged `TODO(ravi)` throughout the build — fill them with *real* facts, even small ones. "Routes 60+ providers" beats "powerful AI platform" every time.

---

## 1. Personal branding strategy

**Brand essence:** *The engineer who builds the platform under the product.* While most "AI developers" wire up a chatbot against one API, you build the **infrastructure that makes AI products possible at scale** — orchestration, multi-tenancy, auth, memory, routing, workflows.

**Brand pillars (everything ladders up to these):**
- **Platforms, not pages.** You ship systems with users, tenants, and uptime — not one-off sites.
- **Infrastructure depth.** Auth, RBAC, SSO, secret vaults, model routing, orchestration — the unglamorous hard parts.
- **End-to-end ownership.** Postgres → backend → LLM routing → web → mobile. One person, whole stack.
- **AI-native.** Agents, voice AI, RAG/memory, 60+ providers — not bolted on, built in.

**Brand voice:** Precise, technical, confident, low-hype. Sound like an engineer who has shipped, not a marketer. Use exact nouns (NestJS, Pinecone, multi-tenant, RBAC) — specificity *is* the credibility. Never say "passionate," "ninja," "rockstar," or "I love coding."

**Brand personality in the UI:** "AI infrastructure control-room." Engineering-grade precision: dark, monospace technical labels, status indicators, real numbers. (See §11.)

---

## 2. Positioning statement

**Primary (one-liner for hero / meta / LinkedIn):**
> **AI Platform Engineer & Infrastructure Architect.** I design and ship production AI platforms, multi-tenant SaaS, and the orchestration infrastructure behind them — end to end, from Postgres to LLM routing to mobile.

**Extended (about / bio):**
> I'm Ravi Roy, a full-stack engineer with 5+ years building production software — now focused on AI platforms and the infrastructure that runs them. I've built an AI orchestration backend that routes across 60+ model providers, organization-based auth with RBAC/SSO/secret-vault and passwordless login, multi-tenant SaaS platforms, voice-AI systems, and workflow-automation engines. I own the whole stack: data model, backend, AI layer, web, and mobile.

**Titles to lead with (in priority order):**
1. AI Platform Engineer
2. AI Infrastructure Architect
3. Full-Stack Product Builder
4. Workflow Automation Engineer
5. SaaS Product Architect

**Titles to explicitly retire:** "React Developer," "Frontend Developer," "Freelancer," "Web Developer." These cap your perceived level and invite the wrong (cheap, commodity) work.

---

## 3. Information architecture / sitemap

```
/                      Landing (the 10-second pitch + proof)
  #what-i-build        Capabilities (platforms / agents / infra / SaaS / voice / mobile)
  #products            Featured products grid
  #ai-infrastructure   The orchestration story (60+ providers, routing, memory)
  #systems             Architecture & systems (auth/RBAC/SSO/vault, multi-tenant, workflow engine)
  #expertise           Technical expertise (grouped, modern stack)
  #work                Selected work (links into case studies)
  #contact             CTA band
/work                  All products / case studies (index)
/work/[slug]           Individual case study (problem → approach → architecture → stack → outcome)
/blog                  Writing (authority engine)
/blog/[slug]           Article (MDX)
/contact               Focused contact page (form + direct channels)
```
`/about` and `/services` are **anchors on `/`** (`#what-i-build` carries services, the about story is woven into hero + systems) — standalone thin pages would dilute SEO and duplicate content.

**Primary nav:** Work · Infrastructure · Writing · Contact (+ availability LED).

---

## 4. Project / product showcase strategy

**Tier your portfolio. Do not show everything flat.** Three tiers:

- **Flagship (2–3, full case studies):** the AI orchestration platform / NextGen AI Dev, the org-auth/RBAC/SSO/vault platform, and one voice-AI product (VoAgents/Echo). These carry the positioning. Each gets a real case study.
- **Products (grid, short cards → optional case study):** Elevence AI, Connxn AI, EXL AI Playground, Fanisin, HiHelloHR.
- **Infrastructure capabilities (not "projects" — capabilities):** model routing, multi-tenant architecture, workflow orchestration, secret vault, passwordless auth. Present as a systems section, not portfolio cards.

**Kill or reframe:** the old "Portfolio 1 / Portfolio 2 / Parking Bucket" entries. If kept at all, move to a tiny "earlier work" footnote. They dilute a platform-engineer narrative.

**Each product card shows:** name, category tag (e.g. `AI INFRA`, `VOICE AI`, `SAAS`), one-line outcome, core stack chips, and links. No fluff.

---

## 5. Case-study structure (the `/work/[slug]` template)

Every flagship case study follows the same scannable spine:

1. **Header:** name, category, one-line positioning, role, timeframe, links (live / repo / demo).
2. **Context / problem:** what needed to exist and why it was hard (1 short para).
3. **Approach:** the key decisions — *why* this architecture (bullets).
4. **Architecture highlights:** the systems-level details that prove depth (e.g. "tenant isolation at the row + connection level," "provider-agnostic routing layer with fallback + cost-aware selection," "RBAC with org/role/resource scoping"). This is the section that converts skeptics.
5. **Stack:** grouped chips (backend / AI / data / infra / client).
6. **Outcome / scale:** real numbers — providers, tenants, latency, throughput, users. `TODO(ravi)` until supplied.
7. **Next / related** project.

**Rule:** every case study must contain at least one architecture diagram or one concrete number. Prose alone won't convince engineers.

---

## 6. SEO strategy

**Reality check:** "Ravi Roy" + a personal site won't rank for head terms like "AI platform" — that's not the goal. SEO here serves two realistic jobs: (a) own your **name + identity** SERP completely, and (b) build **long-tail authority** via writing that the right people (founders, CTOs, recruiters) actually search.

**Keyword tiers:**
- **Identity (own these fully):** "Ravi Roy", "Ravi Roy AI engineer", "Ravi Roy developer", brand-name products (NextGen AI Dev, VoAgents, etc.).
- **Capability (target on landing + case studies):** "AI platform engineer", "AI infrastructure architect", "LLM orchestration", "multi-tenant SaaS architecture", "voice AI developer", "RBAC SSO platform", "AI agent developer", "workflow automation engineer".
- **Long-tail (blog cornerstone targets):** "how to route between multiple LLM providers", "multi-tenant database architecture postgres", "building an AI orchestration layer", "RBAC design for SaaS", "voice AI agent architecture", "passwordless auth implementation", "React Native + AI app architecture", "secret vault design", "LLM cost optimization routing".

**On-page essentials (built in):** per-route `<title>` + meta description, canonical URLs, Open Graph + Twitter cards, dynamic OG images, JSON-LD (`Person` + `WebSite` sitewide, `Article` on posts, optionally `SoftwareApplication`/`CreativeWork` on case studies), `sitemap.xml`, `robots.txt`, semantic headings, fast Core Web Vitals (the 3D must stay lazy/gated — see §11).

---

## 7. Content strategy (the blog as authority engine)

**Thesis:** Case studies prove *what* you built; the blog proves *how you think.* For an architect, "how you think" is the product. Write **build-in-public technical deep-dives** drawn from work you've actually done — these double as SEO long-tail and as proof.

**Categories (map 1:1 to your real surface area):**
`AI Infrastructure` · `AI Agents` · `Workflow Automation` · `Multi-Tenant SaaS` · `Voice AI` · `AI Development` · `React Native` · `Mobile Development` · `Product Engineering` · `System Design`.

**Cornerstone pieces to write first (each is a flex disguised as a tutorial):**
- "Routing across 60+ LLM providers: designing a provider-agnostic AI orchestration layer."
- "Multi-tenant from day one: row + connection isolation in Postgres for a SaaS platform."
- "Designing org-based RBAC, SSO, and a secret vault for an AI platform."
- "Architecture of a production voice-AI agent."
- "Organization-aware AI memory: giving agents tenant-scoped context."

**Cadence (be realistic):** 1 high-quality cornerstone post / month beats 4 thin posts. Quality + specificity is the authority signal.

**Authority-building beyond the blog:**
- Cross-link from your product sites back to case studies (real backlinks).
- Repurpose each cornerstone post into a LinkedIn/X thread → drives the right audience.
- GitHub: pin the repos behind the case studies; a strong profile README mirrors the positioning.
- Optionally syndicate posts (canonical back to raviroy.in) to dev.to / Hashnode for reach.

---

## 8. Conversion strategy

**One primary CTA, everywhere:** **"Work with me" / "Book a call."** Not "Contact." You're selling architecture capacity, so the conversion is a *conversation*, not a form submission.

- **Hero:** primary CTA (Book a call) + secondary (View work). Plus an **availability LED** ("Available for select projects") — scarcity + status.
- **After every flagship case study:** a "Building something like this? Let's talk" band.
- **Sticky/persistent:** keep the CTA reachable in the nav.
- **Contact page:** the EmailJS form *plus* direct channels (email, GitHub, LinkedIn, calendar link `TODO(ravi)`). Give serious buyers a fast path; forms feel junior to senior buyers.

---

## 9. Trust-building strategy

Engineers and founders trust **specificity, evidence, and restraint.**
- **Real numbers** (60+ providers, N tenants, latency) — the single biggest trust lever.
- **Architecture diagrams** on case studies — shows you think in systems.
- **Live links + repos** wherever possible — clickable proof.
- **Modern, exact stack** — names signal currency.
- **Restraint** — no hype words, no fake testimonials. If you keep testimonials, get *new* ones that speak to architecture/ownership, not "beautiful website." Better: drop them and let the work talk.
- **Consistency** — same name, title, and avatar across site, GitHub, LinkedIn, X.

---

## 10. Visual design recommendations

See the implemented design system in `app/globals.css`. Direction: **"AI infrastructure control-room."**
- **Theme:** dark-mode-first. Near-black cool-tinted surfaces (oklch), warm paper-white text.
- **Accent:** a single **electric-lime signal** color used sparingly (status LEDs, key numbers, hovers, the terminal cursor). Deliberately **not** the cliché AI purple/blue gradient — differentiation by restraint.
- **Type:** **Bricolage Grotesque** (display, characterful) + **Hanken Grotesk** (body) + **JetBrains Mono** (technical labels, stats). Mono labels (`// ai-platform-engineer`, `status: available`) carry the engineering identity.
- **Atmosphere:** subtle grid/scanline texture, fine borders, large negative space, big mono stat numbers. Depth via layered transparency and one accent glow, not heavy shadows.
- **3D:** kept as a signature but **bespoke + performant** (orchestration/node-field hero), lazy-mounted and gated. It should feel like a system visualization, not a template gimmick.

---

## 11. UX recommendations

- **10-second test:** above the fold answers "who, what level, proof, action." Hero headline = positioning; sub = capability list in platform terms; CTA + availability; a strip of product/stat proof.
- **Performance is UX:** the 3D must lazy-mount (IntersectionObserver), pause offscreen (`frameloop`), clamp DPR, and fall back to a static poster under `prefers-reduced-motion` and on mobile. A slow portfolio undermines "infrastructure engineer."
- **Scannability:** sections lead with a mono eyebrow + bold statement; details in bullets, not paragraphs.
- **Accessibility:** semantic landmarks, focus-visible states, reduced-motion support, sufficient contrast (paper-white on near-black passes AA), keyboard-navigable nav/menu.
- **Mobile:** single-column, posters instead of canvases, tap-friendly CTAs.

---

## 12. Redesign roadmap (build phases)

1. **Strategy doc** (this file) — drives all copy.
2. **Foundation** — design tokens, fonts, layout shell, `cn()`.
3. **UI primitives** — Container, SectionHeading, Button, Badge, Card, Prose, decorative bits.
4. **Content layer** — typed `Project`/`Skill`/`Experience` models + seeded case studies (flagged TODOs).
5. **3D islands** — `Canvas3D` performance wrapper + bespoke hero scene + reused scenes.
6. **Landing page** — 8 sections + Navbar/Footer.
7. **Work routes** — `/work` + `/work/[slug]`.
8. **MDX blog** — pipeline + seed cornerstone posts.
9. **SEO infra** — metadata, sitemap, robots, OG, JSON-LD.
10. **Contact** — focused route + EmailJS island + direct channels.
11. **Cleanup + perf** — remove template files, build/lint clean, Lighthouse pass.

---

## 13. What I need from you (fill the `TODO(ravi)` flags)

To convert this from "strong-looking" to "undeniable," supply real facts where the build flags them:
- For each product: 1–2 line description, your role, the stack, **one real number**, and live/repo links.
- Real outcome metrics (tenants, providers, users, latency, uptime, scale).
- Screenshots / a short demo clip per flagship product.
- A calendar link (Cal.com / Calendly) for the "Book a call" CTA.
- LinkedIn/X handles to wire into footer + JSON-LD `sameAs`.
- Decision on testimonials: drop, or replace with architecture-focused ones.
