export type Testimonial = {
  handle: string;
  name: string;
  avatarHue: number;
  text: string;
  metric?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    handle: "@solveldigan",
    name: "Veldi",
    avatarHue: 192,
    text: "184ms fills on pump.fun bonded tokens. Axiom feels like dial-up after this.",
    metric: "+412 SOL / 7d",
  },
  {
    handle: "@chainfox",
    name: "Fox",
    avatarHue: 312,
    text: "Sat 500 wallets on a single deploy this morning. Zero queue, zero failed inclusion.",
    metric: "500 wallets · 1 click",
  },
  {
    handle: "@apehard",
    name: "ape",
    avatarHue: 28,
    text: "The MEV shield is genuinely uncanny. I can see bots chasing decoys while I'm already filled.",
  },
  {
    handle: "@degenmarcus",
    name: "Marcus",
    avatarHue: 270,
    text: "DCA that arms a trailing stop on entry. Finally. I built this in Pine years ago.",
  },
  {
    handle: "@nodecaster",
    name: "Cas",
    avatarHue: 156,
    text: "Cashback hit my main wallet 4 days running. Tier laddering actually rewards consistency.",
    metric: "Tier: Diamond",
  },
  {
    handle: "@solshogun",
    name: "Shogun",
    avatarHue: 8,
    text: "Sniped a creator-chain — Insider-X auto-rotated me into the Raydium pool the second the bond cleared.",
  },
  {
    handle: "@quietalpha",
    name: "Q",
    avatarHue: 218,
    text: "I run a 280-wallet routine on Drift. Fleet view replaced 6 other tools.",
  },
  {
    handle: "@chartingrune",
    name: "Rune",
    avatarHue: 96,
    text: "The hero scene alone made me sign up. Then the product is somehow even better.",
  },
];
