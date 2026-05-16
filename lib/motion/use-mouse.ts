"use client";

import { useEffect, useRef } from "react";

export type MouseState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/**
 * Smooth, springy mouse-position store, accessed by ref to keep render churn
 * out of the React tree. Updated on every animation frame.
 */
export function useMouse() {
  const ref = useRef<MouseState>({ x: -1000, y: -1000, vx: 0, vy: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const tick = () => {
      const s = ref.current;
      const t = target.current;
      const nx = s.x + (t.x - s.x) * 0.18;
      const ny = s.y + (t.y - s.y) * 0.18;
      s.vx = nx - s.x;
      s.vy = ny - s.y;
      s.x = nx;
      s.y = ny;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
