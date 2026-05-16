"use client";

import { type ReactNode } from "react";
import { LenisProvider } from "@/lib/motion/lenis";
import { SoundProvider } from "./SoundProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <SoundProvider>{children}</SoundProvider>
    </LenisProvider>
  );
}
