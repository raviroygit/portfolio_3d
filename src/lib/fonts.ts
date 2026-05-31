import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  JetBrains_Mono,
} from "next/font/google";

/**
 * Type system — three families, each a CSS variable consumed by the Tailwind v4
 * `@theme` in app/globals.css. Self-hosted via next/font (zero layout shift).
 *
 * - display: Bricolage Grotesque — characterful headline grotesque
 * - sans:    Hanken Grotesk — clean, legible body
 * - mono:    JetBrains Mono — technical labels, stats, the "infra" voice
 */

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const sans = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const fontVariables = `${display.variable} ${sans.variable} ${mono.variable}`;
