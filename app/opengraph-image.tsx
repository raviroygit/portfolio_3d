import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Ravi Roy — AI Platform Engineer & Infrastructure Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/assets/logo.png"));
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`;

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
          background: "#0d1117",
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, rgba(182,242,74,0.18), transparent 60%)",
          color: "#f3f4ec",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 26, color: "#9aa3b2" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            width={64}
            height={64}
            alt="Ravi Roy"
            style={{ borderRadius: 999, border: "2px solid #b6f24a" }}
          />
          ravi roy / ai-platform-engineer
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0 20px",
            maxWidth: 900,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <span>I build the</span>
          <span style={{ color: "#b6f24a" }}>platform</span>
          <span>under the product.</span>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 24, color: "#9aa3b2" }}>
          <span>60+ AI providers</span>
          <span style={{ color: "#3a4151" }}>·</span>
          <span>Multi-tenant SaaS</span>
          <span style={{ color: "#3a4151" }}>·</span>
          <span>AI infrastructure</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
