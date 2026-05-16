"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  fadeEdges?: boolean;
  className?: string;
};

/**
 * CSS-only infinite marquee (two copies of children, translated -50%).
 * Pause on hover, optional gradient edge fades.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  fadeEdges = true,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        fadeEdges &&
          "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      <div
        className="flex w-max gap-12 will-change-transform"
        style={{
          animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : "normal"}`,
        }}
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-12">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
