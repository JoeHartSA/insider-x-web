import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: "fleet" | "cool";
};

export function GradientText({ children, variant = "fleet", className, ...rest }: Props) {
  return (
    <span
      className={cn(variant === "fleet" ? "gradient-text-fleet" : "gradient-text-cool", className)}
      {...rest}
    >
      {children}
    </span>
  );
}
