"use client";

import type { SoundEvent } from "./events";

type Listener = (e: SoundEvent, volume?: number) => void;

class SoundBus {
  private enabled = false;
  private listeners = new Set<Listener>();

  setEnabled(v: boolean) {
    this.enabled = v;
  }
  isEnabled() {
    return this.enabled;
  }

  on(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  emit(e: SoundEvent, volume = 1) {
    if (!this.enabled) return;
    this.listeners.forEach((l) => l(e, volume));
  }
}

export const soundBus = new SoundBus();

/** Convenience helper — safe to call from any handler. */
export function playSound(e: SoundEvent, volume?: number) {
  soundBus.emit(e, volume);
}
