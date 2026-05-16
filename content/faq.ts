export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: "What is Insider-X?",
    a: "Insider-X is the fastest execution engine on Solana. We let you trade up to 500 wallets in parallel across every alt-market that matters — pump.fun, Raydium, Meteora, Jupiter, Phoenix, Orca, Pumpswap, Drift and more.",
  },
  {
    q: "How is this faster than Axiom?",
    a: "We run a private validator + RPC mesh co-located with the major Solana clusters and ship signed transactions through Jito bundles. Our median quote-to-fill is 184ms versus Axiom's measured ~247ms. Methodology and raw traces are published in the docs.",
  },
  {
    q: "Why 500 wallets?",
    a: "Because that's the practical ceiling traders actually need. 500 lets you split exposure, simulate organic flow on launches, and run sniping campaigns without ever queueing. Everyone else caps at 5–20.",
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
    a: "Cashback up to 50% based on 30-day rolling volume, 50% lifetime referral split, and a daily SOL jackpot funded by 5% of routing fees. Tiers run Bronze → Diamond.",
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
    a: "0.5% routing fee with cashback rebates that take effective cost to as low as 0.25%. No subscription, no seat licenses.",
  },
  {
    q: "When is it live?",
    a: "Private beta now. Public launch this quarter. Join the waitlist to get an invite ahead of the queue.",
  },
];
