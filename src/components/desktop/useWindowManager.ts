"use client";

import { useCallback, useRef, useState } from "react";

export type WinState = {
  id: number;
  appKey: string;
  x: number;
  y: number;
  z: number;
};

/** Minimal window manager: open (focus if already open), close, focus, drag. */
export function useWindowManager() {
  const [wins, setWins] = useState<WinState[]>([]);
  const zTop = useRef(10);
  const idRef = useRef(1);

  const open = useCallback((appKey: string) => {
    setWins((prev) => {
      zTop.current += 1;
      const existing = prev.find((w) => w.appKey === appKey);
      if (existing) {
        return prev.map((w) =>
          w.appKey === appKey ? { ...w, z: zTop.current } : w,
        );
      }
      const i = prev.length;
      return [
        ...prev,
        { id: idRef.current++, appKey, x: 36 + i * 30, y: 30 + i * 26, z: zTop.current },
      ];
    });
  }, []);

  const close = useCallback((id: number) => {
    setWins((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focus = useCallback((id: number) => {
    setWins((prev) => {
      zTop.current += 1;
      const z = zTop.current;
      return prev.map((w) => (w.id === id ? { ...w, z } : w));
    });
  }, []);

  const moveBy = useCallback((id: number, dx: number, dy: number) => {
    setWins((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, x: Math.max(-40, w.x + dx), y: Math.max(0, w.y + dy) } : w,
      ),
    );
  }, []);

  return { wins, open, close, focus, moveBy };
}
