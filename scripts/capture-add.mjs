// Capture screenshots for newly-added projects and merge into meta.json
// WITHOUT dropping existing entries. Live sites go through microlink; the
// WhatsApp AI Bot has no site, so we synthesize a branded composite poster.
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "assets", "projects");
mkdirSync(OUT_DIR, { recursive: true });

const liveTargets = [
  { slug: "askvoya", url: "https://askvoya.com" },
  { slug: "3spay", url: "https://3s-pay.com" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const toHex = ({ r, g, b }) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
const abs = (base, href) => { try { return new URL(href, base).toString(); } catch { return null; } };

async function microlinkShot(url) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&embed=screenshot.url`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 60000);
  try {
    const res = await fetch(api, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`http ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } finally { clearTimeout(t); }
}

async function fetchMeta(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow", signal: ctrl.signal });
    const html = await res.text();
    const final = res.url || url;
    const pick = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
    return {
      finalUrl: final,
      title: pick(/<title[^>]*>([^<]+)<\/title>/i),
      description:
        pick(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        pick(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i),
      themeColor: pick(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i),
      logo: abs(final, pick(/<link[^>]+rel=["']apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || pick(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i) || "/favicon.ico"),
    };
  } catch { return {}; } finally { clearTimeout(t); }
}

const metaPath = join(OUT_DIR, "meta.json");
const prev = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : [];
const bySlug = new Map(prev.map((r) => [r.slug, r]));
const order = prev.map((r) => r.slug);
const ensure = (s) => { if (!order.includes(s)) order.push(s); };

for (const t of liveTargets) {
  process.stdout.write(`→ ${t.slug} … `);
  let image = null, dominant = null, dims = null;
  try {
    const buf = await microlinkShot(t.url);
    const img = sharp(buf);
    const m = await img.metadata();
    const stats = await img.stats();
    dominant = stats.dominant ? toHex(stats.dominant) : null;
    dims = { width: 1280, height: Math.round((m.height / m.width) * 1280) };
    await sharp(buf).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT_DIR, `${t.slug}.webp`));
    image = `/assets/projects/${t.slug}.webp`;
  } catch (e) {
    process.stdout.write(`shot failed (${e.message}) `);
  }

  const meta = await fetchMeta(t.url);
  let logo = bySlug.get(t.slug)?.logo ?? null;
  if (meta.logo && !logo) {
    try {
      const r = await fetch(meta.logo, { headers: { "user-agent": UA } });
      if (r.ok) {
        await sharp(Buffer.from(await r.arrayBuffer())).resize({ width: 128, height: 128, fit: "inside" }).png().toFile(join(OUT_DIR, `${t.slug}-logo.png`));
        logo = `/assets/projects/${t.slug}-logo.png`;
      }
    } catch { /* ignore */ }
  }

  bySlug.set(t.slug, {
    slug: t.slug,
    url: t.url,
    finalUrl: meta.finalUrl || t.url,
    title: meta.title || bySlug.get(t.slug)?.title || null,
    description: meta.description || bySlug.get(t.slug)?.description || null,
    themeColor: meta.themeColor || null,
    dominant: dominant || meta.themeColor || bySlug.get(t.slug)?.dominant || null,
    image: image || bySlug.get(t.slug)?.image || null,
    dims: dims || bySlug.get(t.slug)?.dims || null,
    logo,
  });
  ensure(t.slug);
  process.stdout.write(image ? "✓\n" : "✗\n");
}

// --- WhatsApp AI Bot: synthesized composite (WhatsApp chat + a bot face) ---
process.stdout.write("→ whatsapp-ai-bot (composite) … ");
const W = 1280, H = 800;
const poster = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#075E54"/>
      <stop offset="0.55" stop-color="#128C7E"/>
      <stop offset="1" stop-color="#25D366"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#000000" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- WhatsApp chat bubble -->
  <g filter="url(#soft)" transform="translate(430 300)">
    <path d="M0 56 A56 56 0 1 1 56 112 L8 112 A8 8 0 0 1 0 104 Z" fill="#ffffff"/>
    <path d="M-2 96 l-26 30 6 -44 z" fill="#ffffff"/>
    <!-- phone glyph -->
    <path d="M40 40 c2 -4 6 -5 10 -3 l10 5 c3 2 4 5 3 8 c-2 7 -1 15 4 24 c5 9 12 14 19 16 c3 1 6 0 8 -3 l6 -9 c2 -3 6 -4 9 -2 l9 6 c3 2 4 6 2 9 c-6 11 -19 15 -33 9 c-13 -6 -27 -20 -33 -33 c-6 -13 -5 -27 3 -32 z" fill="#25D366"/>
  </g>

  <!-- Bot head, overlapping -->
  <g filter="url(#soft)" transform="translate(690 286)">
    <rect x="0" y="22" width="160" height="132" rx="34" fill="#ffffff"/>
    <line x1="80" y1="22" x2="80" y2="2" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
    <circle cx="80" cy="-4" r="11" fill="#ffffff"/>
    <circle cx="56" cy="86" r="15" fill="#128C7E"/>
    <circle cx="104" cy="86" r="15" fill="#128C7E"/>
    <rect x="52" y="118" width="56" height="12" rx="6" fill="#25D366"/>
  </g>

  <text x="${W / 2}" y="600" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="62" font-weight="700" fill="#ffffff">WhatsApp AI Bot</text>
  <text x="${W / 2}" y="652" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, sans-serif" font-size="28" font-weight="500" fill="#E7FFF4" opacity="0.92">Document-grounded, multilingual automation on WhatsApp</text>
</svg>`;

const posterBuf = Buffer.from(poster);
await sharp(posterBuf).resize(W, H).webp({ quality: 82 }).toFile(join(OUT_DIR, "whatsapp-ai-bot.webp"));
await sharp(posterBuf).resize({ width: 256, height: 256, fit: "cover" }).png().toFile(join(OUT_DIR, "whatsapp-ai-bot-logo.png"));
bySlug.set("whatsapp-ai-bot", {
  slug: "whatsapp-ai-bot",
  url: null,
  finalUrl: null,
  title: "WhatsApp AI Bot",
  description: "A smart WhatsApp bot that automates responses with document-grounded, multilingual AI.",
  themeColor: "#128C7E",
  dominant: "#128C7E",
  image: "/assets/projects/whatsapp-ai-bot.webp",
  dims: { width: 1280, height: 800 },
  logo: "/assets/projects/whatsapp-ai-bot-logo.png",
});
ensure("whatsapp-ai-bot");
process.stdout.write("✓\n");

const merged = order.map((s) => bySlug.get(s)).filter(Boolean);
writeFileSync(metaPath, JSON.stringify(merged, null, 2));
console.log("\nDone.");
merged.forEach((r) => console.log((r.image ? "IMG" : "---"), r.slug.padEnd(20), (r.dominant || "-").padEnd(9), (r.title || "").slice(0, 40)));
