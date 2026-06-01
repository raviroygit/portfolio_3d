"use client";

import { Badge } from "@/components/ui/Badge";
import { skillGroups } from "@/content/work";

export function SkillsApp() {
  return (
    <div className="space-y-4">
      {skillGroups.map((g) => (
        <section key={g.group}>
          <h3 className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-signal-dim">
            {g.group}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {g.skills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
