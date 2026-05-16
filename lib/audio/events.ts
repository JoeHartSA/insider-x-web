export const SOUND_EVENTS = {
  HOVER_TICK: "hover_tick",
  CLICK_SOFT: "click_soft",
  CLICK_HARD: "click_hard",
  WHOOSH: "whoosh",
  FLEET_FIRE: "fleet_fire",
  COIN_DROP: "coin_drop",
  IGNITION: "ignition",
} as const;

export type SoundEvent = (typeof SOUND_EVENTS)[keyof typeof SOUND_EVENTS];
