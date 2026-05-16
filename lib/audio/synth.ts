"use client";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const Ctor = (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!Ctor) return null;
    ctx = new Ctor();
  } catch {
    return null;
  }
  return ctx;
}

/** Pure sub-bass hit synthesized live. No audio asset required. */
export function playSubBassHit(volume = 0.7) {
  const c = getCtx();
  if (!c) return;

  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  const lp = c.createBiquadFilter();

  o.type = "sine";
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(40, t + 0.45);

  lp.type = "lowpass";
  lp.frequency.value = 200;

  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

  o.connect(lp);
  lp.connect(g);
  g.connect(c.destination);

  o.start(t);
  o.stop(t + 0.75);
}

/** Brief cyan-y "tick" for hover events. */
export function playTick(volume = 0.18) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.setValueAtTime(2200, t);
  o.frequency.exponentialRampToValueAtTime(1800, t + 0.06);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  o.connect(g);
  g.connect(c.destination);
  o.start(t);
  o.stop(t + 0.14);
}

/** Soft whoosh used for big scene transitions. */
export function playWhoosh(volume = 0.4) {
  const c = getCtx();
  if (!c) return;
  const t = c.currentTime;
  const bufferSize = 0.7 * c.sampleRate;
  const noise = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const src = c.createBufferSource();
  src.buffer = noise;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(500, t);
  bp.frequency.exponentialRampToValueAtTime(2200, t + 0.6);
  bp.Q.value = 1.2;

  const g = c.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(volume, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start(t);
  src.stop(t + 0.72);
}
