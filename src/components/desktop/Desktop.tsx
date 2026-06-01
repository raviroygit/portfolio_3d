"use client";

import { cn } from "@/lib/cn";
import { Window } from "./Window";
import { useWindowManager } from "./useWindowManager";
import { APPS, APP_BY_KEY, FolderIcon } from "./registry";

const WALLPAPER = "/assets/desk-screen.png";

/** A small interactive desktop OS. Fills its parent (the 3D screen overlay or a
 *  full-screen mobile portal). Wallpaper is the headshot; folders open windows. */
export function Desktop({
  onExit,
  onFullscreen,
  className,
}: {
  onExit?: () => void;
  onFullscreen?: () => void;
  className?: string;
}) {
  const { wins, open, close, focus, moveBy } = useWindowManager();

  return (
    <div
      className={cn(
        "relative h-full w-full select-none overflow-hidden bg-bg text-fg",
        className,
      )}
    >
      {/* wallpaper — the source asset is stored upside-down (the 3D screen
          corrects it via flipY), so flip it here for the DOM */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${WALLPAPER})`, transform: "scaleY(-1)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-bg/55" />

      {/* top menubar */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between border-b border-border/60 bg-bg/40 px-3 py-1.5 backdrop-blur-sm">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-signal">
          RaviOS
        </span>
        {onFullscreen ? (
          <button
            type="button"
            onClick={onFullscreen}
            className="rounded-md border border-border bg-bg-2/60 px-2 py-0.5 font-mono text-[0.7rem] text-fg-muted transition-colors hover:border-signal/50 hover:text-signal"
          >
            ⛶ Full screen
          </button>
        ) : null}
        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="rounded-md border border-border bg-bg-2/60 px-2 py-0.5 font-mono text-[0.7rem] text-fg-muted transition-colors hover:border-signal/50 hover:text-signal"
          >
            ⏻ Exit
          </button>
        ) : null}
      </div>

      {/* desktop folder icons */}
      <div className="absolute left-3 top-12 z-10 flex flex-col flex-wrap gap-1 content-start">
        {APPS.map((app) => (
          <button
            key={app.key}
            type="button"
            onClick={() => open(app.key)}
            className="group flex w-20 flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors hover:bg-fg/5 focus-visible:bg-fg/5"
          >
            <FolderIcon accent={app.accent} />
            <span className="font-mono text-[0.65rem] tracking-wide text-fg-muted group-hover:text-fg">
              {app.label}
            </span>
          </button>
        ))}
      </div>

      {/* windows */}
      {wins.map((w) => {
        const app = APP_BY_KEY[w.appKey];
        if (!app) return null;
        const Body = app.Component;
        return (
          <Window
            key={w.id}
            title={app.title}
            x={w.x}
            y={w.y}
            z={w.z}
            width={app.width}
            onClose={() => close(w.id)}
            onFocus={() => focus(w.id)}
            onMoveBy={(dx, dy) => moveBy(w.id, dx, dy)}
          >
            <Body />
          </Window>
        );
      })}

      {/* taskbar */}
      <div className="absolute inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border/60 bg-bg/55 px-3 py-1.5 backdrop-blur-sm">
        <span className="size-2 rounded-full bg-signal shadow-[0_0_8px_var(--color-signal)]" aria-hidden />
        {APPS.map((app) => {
          const isOpen = wins.some((w) => w.appKey === app.key);
          return (
            <button
              key={app.key}
              type="button"
              onClick={() => open(app.key)}
              className={cn(
                "rounded-md px-2 py-0.5 font-mono text-[0.7rem] transition-colors",
                isOpen
                  ? "bg-signal/15 text-signal"
                  : "text-fg-subtle hover:text-fg",
              )}
            >
              {app.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
