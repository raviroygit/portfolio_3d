"use client";

import type { ComponentType } from "react";
import { ProjectsApp } from "./apps/ProjectsApp";
import { ProductsApp } from "./apps/ProductsApp";
import { SkillsApp } from "./apps/SkillsApp";
import { AboutApp } from "./apps/AboutApp";
import { ContactApp } from "./apps/ContactApp";

export type AppDef = {
  key: string;
  label: string;
  title: string;
  accent: "signal" | "cyan";
  width: number;
  Component: ComponentType;
};

/** A folder icon glyph, tinted by accent. */
export function FolderIcon({ accent }: { accent: "signal" | "cyan" }) {
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
      <path
        d="M6 12a3 3 0 0 1 3-3h9l3 4h18a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V12Z"
        className={accent === "cyan" ? "fill-cyan/20 stroke-cyan/70" : "fill-signal/20 stroke-signal/70"}
        strokeWidth="1.5"
      />
      <path
        d="M6 18h36"
        className={accent === "cyan" ? "stroke-cyan/50" : "stroke-signal/50"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export const APPS: AppDef[] = [
  { key: "projects", label: "Projects", title: "Projects", accent: "signal", width: 520, Component: ProjectsApp },
  { key: "products", label: "Products", title: "Flagship Products", accent: "cyan", width: 540, Component: ProductsApp },
  { key: "skills", label: "Skills", title: "Skills & Stack", accent: "signal", width: 460, Component: SkillsApp },
  { key: "about", label: "About", title: "About — Ravi Roy", accent: "cyan", width: 480, Component: AboutApp },
  { key: "contact", label: "Contact", title: "Contact", accent: "signal", width: 420, Component: ContactApp },
];

export const APP_BY_KEY = Object.fromEntries(APPS.map((a) => [a.key, a])) as Record<string, AppDef>;
