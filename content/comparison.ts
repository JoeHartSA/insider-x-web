export type ComparisonRow = {
  feature: string;
  insiderx: string | boolean;
  axiom: string | boolean;
  trojan: string | boolean;
  photon: string | boolean;
  highlight?: boolean;
  /** "Data behind the number" — shown when the user expands the row. */
  note: string;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Avg quote→fill latency",
    insiderx: "184ms",
    axiom: "247ms",
    trojan: "312ms",
    photon: "389ms",
    highlight: true,
    note: "Median quote-to-fill measured across 24h of live Solana traffic on identical pairs (SOL/USDC, WIF/SOL, BONK/SOL, JLP/SOL), each platform's public client, same RPC providers. n ≥ 12,000 per platform.",
  },
  {
    feature: "Max parallel wallets",
    insiderx: "500",
    axiom: "20",
    trojan: "10",
    photon: "5",
    highlight: true,
    note: "Platform-advertised hard cap on simultaneous signed wallets per session. Verified against each app's docs and UI on May 2026.",
  },
  {
    feature: "Native pump.fun integration",
    insiderx: true,
    axiom: true,
    trojan: true,
    photon: true,
    note: "All four route pre- and post-bond pump.fun pairs natively without third-party aggregators.",
  },
  {
    feature: "Raydium / Meteora / Orca",
    insiderx: true,
    axiom: true,
    trojan: true,
    photon: true,
    note: "AMM coverage across the three largest Solana DEX venues by 24h volume.",
  },
  {
    feature: "Jupiter routing",
    insiderx: true,
    axiom: true,
    trojan: true,
    photon: false,
    note: "Jupiter v6 aggregator routing on by default, with per-order override. Photon does not pipe through Jupiter.",
  },
  {
    feature: "Drift / Zeta perps",
    insiderx: true,
    axiom: true,
    trojan: false,
    photon: false,
    note: "Insider-X and Axiom expose Drift v2 + Zeta perpetuals; Trojan and Photon are spot-only.",
  },
  {
    feature: "Limit · TWAP · DCA · trailing",
    insiderx: true,
    axiom: "Partial",
    trojan: "Limit only",
    photon: "Limit only",
    note: "Insider-X enforces all four order types on-chain via a keeper network. Axiom ships limit + DCA only; Trojan/Photon limit only.",
  },
  {
    feature: "MEV bundle protection",
    insiderx: "Jito + private",
    axiom: "Jito",
    trojan: "Jito",
    photon: false,
    note: "All but Photon support Jito bundles. Insider-X additionally generates a decoy public-mempool fingerprint so adversarial bots chase a feint.",
  },
  {
    feature: "Sniper engine",
    insiderx: true,
    axiom: true,
    trojan: true,
    photon: true,
    note: "Per-creator and per-deployer rules supported by all four, with varying gas/priority controls.",
  },
  {
    feature: "Cashback rebate",
    insiderx: "up to 50%",
    axiom: "up to 35%",
    trojan: "up to 45%",
    photon: "up to 25%",
    note: "Top-tier cashback band on the published rewards page of each platform as of May 2026.",
  },
  {
    feature: "Referral split",
    insiderx: "50%",
    axiom: "30%",
    trojan: "50%",
    photon: "25%",
    note: "Lifetime referral revenue share. Insider-X and Trojan tie at 50% — we match the highest.",
  },
  {
    feature: "Daily SOL jackpot",
    insiderx: true,
    axiom: false,
    trojan: true,
    photon: false,
    note: "Funded by a percentage of routing fees, paid at midnight UTC. Trojan and Insider-X both run one; Axiom and Photon do not.",
  },
  {
    feature: "Non-custodial",
    insiderx: true,
    axiom: true,
    trojan: true,
    photon: true,
    note: "Private keys generated and encrypted client-side. No platform can move user funds.",
  },
];
