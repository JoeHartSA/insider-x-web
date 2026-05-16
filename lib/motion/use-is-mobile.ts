"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe viewport breakpoint hook. Defaults to `false` on first render so
 * server output matches a desktop layout, then hydrates to the real value.
 *
 * Use this only to short-circuit expensive client-side code paths (e.g.
 * dropping a 3D scene on small viewports). Avoid using it to swap layout in
 * SSR-rendered content — use Tailwind responsive classes for that.
 */
export function useIsMobile(query = "(max-width: 767px)"): boolean {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const update = () => setMatch(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return match;
}

/** Touch-input detection — for disabling hover/parallax handlers. */
export function useIsCoarse(): boolean {
  return useIsMobile("(pointer: coarse)");
}
