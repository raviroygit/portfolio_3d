// Regenerate two project assets, merging into meta.json without dropping entries:
//  1. askvoya  — from a user-provided full-page screenshot (local file).
//  2. whatsapp-ai-bot — composite using the OFFICIAL WhatsApp logo + a robot badge.
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT_DIR = join(process.cwd(), "public", "assets", "projects");
const metaPath = join(OUT_DIR, "meta.json");
const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : [];
const bySlug = new Map(meta.map((r) => [r.slug, r]));
const toHex = ({ r, g, b }) => `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;

// --- 1. AskVoya: use the provided screenshot ------------------------------
const ASKVOYA_SRC = "/Users/kov/.claude/image-cache/1891effd-a08c-4922-a087-b193f1a73a3e/1.png";
{
  const m = await sharp(ASKVOYA_SRC).metadata();
  const stats = await sharp(ASKVOYA_SRC).stats();
  const dims = { width: 1280, height: Math.round((m.height / m.width) * 1280) };
  await sharp(ASKVOYA_SRC).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(OUT_DIR, "askvoya-v2.webp"));
  const e = bySlug.get("askvoya") ?? { slug: "askvoya" };
  e.image = "/assets/projects/askvoya-v2.webp";
  e.dims = dims;
  e.dominant = toHex(stats.dominant);
  bySlug.set("askvoya", e);
  console.log("askvoya ✓", e.dominant, JSON.stringify(dims));
}

// --- 2. WhatsApp AI Bot: real WhatsApp logo + robot badge -----------------
{
  const W = 1280, H = 800;
  // Official WhatsApp glyph (Simple Icons, viewBox 0 0 24 24).
  const WA_PATH =
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

  const poster = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#075E54"/>
      <stop offset="0.55" stop-color="#128C7E"/>
      <stop offset="1" stop-color="#25D366"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.4" r="0.62">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#000000" flood-opacity="0.30"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Left badge: official WhatsApp logo -->
  <g filter="url(#soft)">
    <rect x="400" y="288" width="200" height="200" rx="48" fill="#ffffff"/>
    <g transform="translate(440 328) scale(5.0)">
      <path d="${WA_PATH}" fill="#25D366"/>
    </g>
  </g>

  <!-- Plus -->
  <g fill="#ffffff">
    <rect x="624" y="378" width="32" height="8" rx="4"/>
    <rect x="636" y="366" width="8" height="32" rx="4"/>
  </g>

  <!-- Right badge: robot head -->
  <g filter="url(#soft)">
    <rect x="680" y="288" width="200" height="200" rx="48" fill="#ffffff"/>
    <g transform="translate(720 322)">
      <line x1="60" y1="36" x2="60" y2="14" stroke="#25D366" stroke-width="9" stroke-linecap="round"/>
      <circle cx="60" cy="8" r="12" fill="#25D366"/>
      <rect x="6" y="36" width="108" height="96" rx="26" fill="#25D366"/>
      <rect x="22" y="56" width="76" height="44" rx="16" fill="#ffffff"/>
      <circle cx="44" cy="78" r="11" fill="#128C7E"/>
      <circle cx="76" cy="78" r="11" fill="#128C7E"/>
      <rect x="40" y="112" width="40" height="10" rx="5" fill="#ffffff"/>
    </g>
  </g>

  <text x="${W / 2}" y="592" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">WhatsApp AI Bot</text>
  <text x="${W / 2}" y="644" text-anchor="middle" font-family="-apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="500" fill="#E7FFF4" opacity="0.92">Document-grounded, multilingual automation on WhatsApp</text>
</svg>`;

  const buf = Buffer.from(poster);
  await sharp(buf).resize(W, H).webp({ quality: 82 }).toFile(join(OUT_DIR, "whatsapp-ai-bot-v2.webp"));
  // square logo: just the WhatsApp mark on green
  const logo = `
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" rx="56" fill="#25D366"/>
  <g transform="translate(40 40) scale(7.33)"><path d="${WA_PATH}" fill="#ffffff"/></g>
</svg>`;
  await sharp(Buffer.from(logo)).resize(256, 256).png().toFile(join(OUT_DIR, "whatsapp-ai-bot-logo-v2.png"));

  const e = bySlug.get("whatsapp-ai-bot") ?? { slug: "whatsapp-ai-bot", url: null, finalUrl: null, title: "WhatsApp AI Bot", description: "A smart WhatsApp bot that automates responses with document-grounded, multilingual AI." };
  e.image = "/assets/projects/whatsapp-ai-bot-v2.webp";
  e.logo = "/assets/projects/whatsapp-ai-bot-logo-v2.png";
  e.themeColor = "#128C7E";
  e.dominant = "#128C7E";
  e.dims = { width: 1280, height: 800 };
  bySlug.set("whatsapp-ai-bot", e);
  console.log("whatsapp-ai-bot ✓");
}

// preserve existing order, append any new slugs
const order = meta.map((r) => r.slug);
for (const s of bySlug.keys()) if (!order.includes(s)) order.push(s);
writeFileSync(metaPath, JSON.stringify(order.map((s) => bySlug.get(s)).filter(Boolean), null, 2));
console.log("meta.json written.");
