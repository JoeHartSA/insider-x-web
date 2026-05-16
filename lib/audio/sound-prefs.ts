"use client";

import { useEffect, useState } from "react";

const KEY = "ix:sound-enabled";

export function useSoundPref() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(KEY);
    if (stored === "true") setEnabled(true);
  }, []);

  const update = (next: boolean) => {
    setEnabled(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, next ? "true" : "false");
    }
  };

  return [enabled, update] as const;
}
