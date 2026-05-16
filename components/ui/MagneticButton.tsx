"use client";

import { forwardRef, useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { playSound } from "@/lib/audio/sound-bus";
import { SOUND_EVENTS } from "@/lib/audio/events";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  strength?: number;
  asChild?: boolean;
  children: ReactNode;
  href?: string;
  /** When true, wraps in <a> instead of <button> */
  external?: boolean;
  /** Optional class on the magnetic wrapper (e.g. "w-full sm:w-auto"). */
  wrapperClassName?: string;
};

/**
 * Cursor-attracted CTA. The button itself gets pulled ~14px toward the pointer
 * while the inner label slides ~5px — a tiny parallax that reads "premium".
 *
 * Primary variant ignites: a gradient ring appears + a soft cyan→magenta sheen
 * sweeps across the surface on hover.
 */
export const MagneticButton = forwardRef<HTMLButtonElement, Props>(function MagneticButton(
  {
    className,
    wrapperClassName,
    variant = "primary",
    strength = 14,
    children,
    href,
    external,
    onClick,
    ...rest
  },
  fwdRef,
) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let raf = 0;
    const state = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      state.tx = dx * strength;
      state.ty = dy * strength;
    };

    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
    };

    const tick = () => {
      state.x += (state.tx - state.x) * 0.18;
      state.y += (state.ty - state.y) * 0.18;
      wrap.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      inner.style.transform = `translate3d(${state.x * 0.35}px, ${state.y * 0.35}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const base =
    "relative inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium tracking-[0.04em] transition-colors duration-300 will-change-transform select-none";

  const variants: Record<Variant, string> = {
    primary:
      "text-black bg-white hover:bg-[color:var(--color-ix-cyan)] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_60px_-25px_rgba(91,233,255,0.55)]",
    secondary:
      "text-white border border-[color:var(--color-ix-border-strong)] bg-[color:var(--color-ix-surface)]/60 hover:bg-[color:var(--color-ix-surface-2)] backdrop-blur",
    ghost: "text-white/80 hover:text-white",
  };

  const Content = (
    <span
      ref={innerRef}
      className="relative z-10 inline-flex items-center gap-2"
      style={{ willChange: "transform" }}
    >
      {children}
    </span>
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound(variant === "primary" ? SOUND_EVENTS.CLICK_HARD : SOUND_EVENTS.CLICK_SOFT);
    onClick?.(e);
  };

  return (
    <div
      ref={wrapRef}
      className={cn("inline-block", wrapperClassName)}
      style={{ willChange: "transform" }}
    >
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          data-cursor="cta"
          className={cn(base, variants[variant], "group/cta", className)}
        >
          {variant === "primary" && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, #5be9ff, #7b5bff, #ff49c8, #5be9ff)",
                filter: "blur(14px)",
                transform: "scale(1.05)",
                zIndex: 0,
              }}
            />
          )}
          {Content}
        </a>
      ) : (
        <button
          ref={fwdRef}
          data-cursor="cta"
          className={cn(base, variants[variant], "group/cta", className)}
          onClick={handleClick}
          {...rest}
        >
          {variant === "primary" && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/cta:opacity-100"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, #5be9ff, #7b5bff, #ff49c8, #5be9ff)",
                filter: "blur(14px)",
                transform: "scale(1.05)",
                zIndex: 0,
              }}
            />
          )}
          {Content}
        </button>
      )}
    </div>
  );
});
