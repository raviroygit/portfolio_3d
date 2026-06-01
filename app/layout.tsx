import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { siteConfig, buildMetadata } from "@/lib/seo";
import {
  personSchema,
  websiteSchema,
  jsonLdScript,
} from "@/lib/jsonld";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundStarfield } from "@/components/three/BackgroundStarfield";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata(),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  category: "technology",
  keywords: [
    "AI Platform Engineer",
    "AI Infrastructure Architect",
    "Full-Stack Product Builder",
    "LLM Orchestration",
    "Multi-Tenant SaaS",
    "Voice AI",
    "AI Agents",
    "RAG",
    "Next.js",
    "Ravi Roy",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // optional — set GOOGLE_SITE_VERIFICATION in the deploy env to enable GSC.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(personSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(websiteSchema())}
        />
        {/* skip link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-bg"
        >
          Skip to content
        </a>

        {/* sitewide ambient starfield, fixed behind all content */}
        <div className="pointer-events-none fixed inset-0 -z-10 opacity-50">
          <BackgroundStarfield className="size-full" />
        </div>

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
