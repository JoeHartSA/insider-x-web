export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: "What is Insider-X?",
    a: "Insider-X is a faster, safer, smarter trading terminal for Solana. Trade up to 500 wallets in parallel, with on-chain rug protection that watches every block and fees up to 5× cheaper than Axiom, Trojan and Photon.",
  },
  {
    q: "How is this faster than Axiom?",
    a: "We run a private validator + RPC mesh co-located with the major Solana clusters and ship signed transactions through Jito bundles. Our preliminary median quote-to-fill is 184ms versus Axiom's measured ~247ms. Numbers are internal-benchmark — full methodology will be published with the public launch.",
  },
  {
    q: "Why 500 wallets?",
    a: "Because that's the practical ceiling traders actually need. 500 lets you split exposure, simulate organic flow on launches, and run sniping campaigns without ever queueing. Everyone else caps at 5–20.",
  },
  {
    q: "How does rug protection work?",
    a: "Insider-X watches the on-chain layer every block. Bundle consolidation, bubble-map expansion, dev-wallet transfers, suspicious top-holder rebalances — the second any of these light up, we react. If you've armed auto-exit, your position is sold before the rug clears the mempool. Otherwise you get a live warning the second the pattern matches.",
  },
  {
    q: "Is Insider-X non-custodial?",
    a: "Yes. Keys are generated and stored client-side, encrypted, never leave your machine. We can't move your funds.",
  },
  {
    q: "Which chains do you support?",
    a: "Solana only today. We're laser-focused on being the best on Solana before we add Base, Sui or Hyperliquid.",
  },
  {
    q: "How do rewards work?",
    a: "Cashback up to 50% based on 30-day rolling volume, 50% lifetime referral split, and tiered fee discounts that compound with your activity. Tiers run Bronze → Diamond.",
  },
  {
    q: "What order types are supported?",
    a: "Limit, DCA and trailing stops, enforced on-chain by our keeper network. You can compose them — e.g. a limit that hatches a DCA, or a DCA that arms a trailing stop on entry.",
  },
  {
    q: "Does pump.fun routing work natively?",
    a: "Yes — including pre-bond and post-bond, with auto-migrate to Raydium when a token graduates. Snipes can be aimed at specific creators or chains of deployers.",
  },
  {
    q: "What if MEV bots try to front-run me?",
    a: "Every order can be sent through private Jito bundles. You can also enable our adaptive shielding which falsifies a public mempool fingerprint while routing the real fill privately.",
  },
  {
    q: "What does Insider-X cost?",
    a: "Routing fees from 0.1% — up to 5× cheaper than the competing field (0.5–1.0%). Cashback rebates can take effective cost lower still. No subscription, no seat licenses.",
  },
  {
    q: "When is it live?",
    a: "Private beta now. Public launch this quarter. Join the beta waitlist to get an invite ahead of the queue and a permanent fee tier upgrade.",
  },
];
