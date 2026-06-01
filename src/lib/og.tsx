import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG = "#0d1117";
const FG = "#f3f4ec";
const MUTED = "#9aa3b2";
const ACCENT = "#b6f24a";

type OgCardInput = {
  /** small mono label at the top, e.g. "case study · ai platform" */
  eyebrow: string;
  /** the headline (project name / post title) */
  title: string;
  /** dimmed footer chips */
  footer?: string[];
};

/**
 * Shared branded 1200×630 OG card (dark + lime), matching the global
 * app/opengraph-image.tsx. Used by per-project and per-post OG routes.
 */
export function renderOgCard({ eyebrow, title, footer }: OgCardInput) {
  // scale the title down for very long names so it never overflows
  const fontSize = title.length > 46 ? 60 : title.length > 30 ? 72 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: BG,
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, rgba(182,242,74,0.18), transparent 60%)",
          color: FG,
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: MUTED }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: ACCENT }} />
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            fontSize,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 24, color: MUTED }}>
          <span style={{ color: FG }}>ravi roy</span>
          <span style={{ color: "#3a4151" }}>·</span>
          <span>ai platform engineer</span>
          {footer?.map((f) => (
            <span key={f} style={{ display: "flex", gap: 24 }}>
              <span style={{ color: "#3a4151" }}>·</span>
              <span>{f}</span>
            </span>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
