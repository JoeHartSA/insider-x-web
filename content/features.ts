export type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
};

export const FEATURES: Feature[] = [
  {
    id: "command-center",
    eyebrow: "01 · Command Center",
    title: "One cockpit. Five hundred wallets.",
    copy: "Fleet view shows every wallet's balance, exposure and live PnL in a single grid. Group, tag, and fire orders against any selection with a keystroke. No tab-switching, no copy-pasting addresses.",
    bullets: [
      "Group wallets by strategy, persona or auto-tag by behaviour",
      "Hot-key fire across any selection",
      "Risk dashboard rolls up to a single P&L curve",
      "CSV / KMS-encrypted export for accounting",
    ],
  },
  {
    id: "mev-shield",
    eyebrow: "02 · Sniper + MEV Shield",
    title: "Land sub-block. Deflect the snipers behind you.",
    copy: "Snipes are signed locally and shipped through Jito bundles co-located with the validator. The MEV Shield generates a decoy fingerprint in the public mempool so adversarial bots chase a feint while your real fill lands privately.",
    bullets: [
      "Sub-block landing on contested launches",
      "Private Jito bundles + adaptive decoys",
      "Per-creator and per-deployer snipe rules",
      "Auto-rotate from pump.fun → Raydium on bond",
    ],
  },
  {
    id: "advanced-orders",
    eyebrow: "03 · Advanced Orders",
    title: "Limit, TWAP, DCA, trailing. On-chain.",
    copy: "Build complex order graphs visually — a limit that hatches a TWAP, a DCA that arms a trailing stop on entry. Every order is enforced on-chain by our keeper network, no off-chain trust required.",
    bullets: [
      "Composable order graphs with branching logic",
      "On-chain keeper network — no centralised enforcer",
      "Per-order MEV settings and fee caps",
      "Backtest any graph against the last 30 days",
    ],
  },
];
