"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Physics-driven custom cursor.
 *
 * Two HTML layers:
 *  - inner dot (snaps to actual pointer position)
 *  - outer ring (spring-followed; scales + ignites over CTAs;
 *    on rapid movement splits into R/G/B channels via inner spans)
 *
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringRRef = useRef<HTMLSpanElement | null>(null);
  const ringGRef = useRef<HTMLSpanElement | null>(null);
  const ringBRef = useRef<HTMLSpanElement | null>(null);

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduced) {
      setEnabled(false);
      document.body.style.cursor = "auto";
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const dot = { x: target.x, y: target.y };
    const ring = { x: target.x, y: target.y, scale: 1, ignited: 0 };

    let raf = 0;
    let speed = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onEnterCta = () => {
      ring.ignited = 1;
    };
    const onLeaveCta = () => {
      ring.ignited = 0;
    };
    const onDown = () => {
      ring.scale = 0.7;
    };
    const onUp = () => {
      ring.scale = 1;
    };

    const tick = () => {
      const dx = target.x - dot.x;
      const dy = target.y - dot.y;
      dot.x += dx * 0.55;
      dot.y += dy * 0.55;

      const rdx = target.x - ring.x;
      const rdy = target.y - ring.y;
      ring.x += rdx * 0.18;
      ring.y += rdy * 0.18;

      const inst = Math.min(60, Math.hypot(rdx, rdy));
      speed = speed * 0.85 + inst * 0.15;
      const split = Math.min(14, speed * 0.45);
      const baseScale = ring.ignited ? 1.7 : ring.scale;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${baseScale})`;
        ringRef.current.style.opacity = ring.ignited ? "1" : "0.7";
      }
      if (ringRRef.current) {
        ringRRef.current.style.transform = `translate(${-split}px, 0)`;
      }
      if (ringGRef.current) {
        ringGRef.current.style.transform = `translate(0, 0)`;
      }
      if (ringBRef.current) {
        ringBRef.current.style.transform = `translate(${split}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Event-delegated CTA detection — much cheaper than MutationObserver +
    // per-element listeners. We track the closest [data-cursor='cta'] from
    // the actual mouseover target instead of attaching to each element.
    const onOver = (e: MouseEvent) => {
      const tgt = e.target as Element | null;
      if (tgt?.closest?.("[data-cursor='cta']")) onEnterCta();
    };
    const onOut = (e: MouseEvent) => {
      const tgt = e.target as Element | null;
      const next = (e as MouseEvent & { relatedTarget?: Element | null }).relatedTarget;
      if (!tgt?.closest?.("[data-cursor='cta']")) return;
      if (next && (next as Element).closest?.("[data-cursor='cta']")) return;
      onLeaveCta();
    };
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 size-[6px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 size-9 mix-blend-screen"
        style={{ willChange: "transform, opacity", transition: "opacity 200ms" }}
      >
        <span
          ref={ringRRef}
          className="absolute inset-0 rounded-full border border-[color:var(--color-ix-cyan)]"
          style={{ filter: "blur(0.2px)", willChange: "transform" }}
        />
        <span
          ref={ringGRef}
          className="absolute inset-0 rounded-full border border-[color:var(--color-ix-violet)]"
          style={{ willChange: "transform" }}
        />
        <span
          ref={ringBRef}
          className="absolute inset-0 rounded-full border border-[color:var(--color-ix-magenta)]"
          style={{ filter: "blur(0.2px)", willChange: "transform" }}
        />
      </div>
    </div>
  );
}
