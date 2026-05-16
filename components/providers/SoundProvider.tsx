"use client";

import { useEffect, type ReactNode } from "react";
import { soundBus } from "@/lib/audio/sound-bus";
import { useSoundPref } from "@/lib/audio/sound-prefs";

/**
 * Wires the global sound-bus to user preference. Audio assets themselves are
 * lazily loaded via Howler inside <SoundEngine/> only when sound is enabled.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled] = useSoundPref();

  useEffect(() => {
    soundBus.setEnabled(enabled);
  }, [enabled]);

  return <>{children}</>;
}
