"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Lazy3D } from "./Lazy3D";
import { ComputerPoster } from "./posters";

const ComputerScene = dynamic(() => import("./scenes/ComputerScene"), {
  ssr: false,
  loading: () => <ComputerPoster />,
});

export function HeroComputer({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      <Lazy3D className={className} poster={<ComputerPoster />} rootMargin="0px">
        <ComputerScene variant="hero" onOpen={() => setOpen(true)} />
      </Lazy3D>

      {/* phones can't drive the angled 3D screen — a tap target opens the modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full border border-signal/50 bg-bg/70 px-4 py-2 font-mono text-xs text-signal backdrop-blur-sm lg:hidden"
      >
        ⏻ open interactive desktop
      </button>

      {/* modal: blurred backdrop + the SAME 3D PC, head-on, interactive */}
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md">
              <div className="absolute inset-0">
                <ComputerScene variant="modal" onExit={() => setOpen(false)} />
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 z-10 rounded-md border border-border bg-bg-2/70 px-3 py-1.5 font-mono text-xs text-fg-muted backdrop-blur-sm transition-colors hover:border-signal/50 hover:text-signal"
              >
                ⏻ Exit
              </button>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
