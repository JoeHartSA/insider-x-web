"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & {
  intensity?: "default" | "strong";
};

export const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  { className, intensity = "default", children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-[var(--radius-lg)] overflow-hidden",
        intensity === "strong" ? "glass-strong" : "glass",
        className,
      )}
      {...rest}
    >
      {/* top hairline highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      {children}
    </div>
  );
});
