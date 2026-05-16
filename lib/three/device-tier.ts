"use client";

export type DeviceTier = "A" | "B" | "C";

/**
 * Three-tier device classification used by every scene to pick instance counts,
 * shader precision, and post-fx complexity.
 *
 * A — WebGPU or high-end WebGL2 (desktop / M-series mac)
 * B — modern mobile / mid-range desktop, WebGL2 only
 * C — low-power / reduced-motion / no WebGL  → static posters
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "B";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "C";

  const hasWebGPU = "gpu" in navigator;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  // No WebGL at all → tier C
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return "C";
  } catch {
    return "C";
  }

  if (hasWebGPU && cores >= 8 && mem >= 8 && !isCoarse) return "A";
  if (cores >= 6 && mem >= 4) return isCoarse ? "B" : "A";
  return "B";
}

export function fleetTileCount(tier: DeviceTier): number {
  if (tier === "A") return 500;
  if (tier === "B") return 240;
  return 120;
}

export function coinCount(tier: DeviceTier): number {
  if (tier === "A") return 200;
  if (tier === "B") return 90;
  return 0;
}
