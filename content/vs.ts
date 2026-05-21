export type VsPage = {
  slug: "axiom" | "trojan" | "photon";
  competitor: string;
  tagline: string;
  bullets: { title: string; copy: string }[];
};

export const VS_PAGES: Record<string, VsPage> = {
  axiom: {
    slug: "axiom",
    competitor: "Axiom",
    tagline: "Faster than the gateway.",
    bullets: [
      {
        title: "63ms faster on median fills",
        copy: "184ms quote-to-fill vs Axiom's measured 247ms across identical pairs and RPC providers.",
      },
      {
        title: "25× more parallel wallets",
        copy: "Insider-X runs 500 wallets in lockstep. Axiom caps at 20.",
      },
      {
        title: "Cashback up to 50%",
        copy: "Axiom tops out at 35%. We pay more, more often, with no minimum volume to unlock the first tier.",
      },
      {
        title: "Private MEV decoys",
        copy: "Our shield doesn't just bundle through Jito — it generates a public mempool decoy so adversarial bots chase a feint.",
      },
    ],
  },
  trojan: {
    slug: "trojan",
    competitor: "Trojan",
    tagline: "Same casino energy. Faster pulls.",
    bullets: [
      {
        title: "128ms faster on median fills",
        copy: "184ms quote-to-fill vs Trojan's measured 312ms. The gap widens at congestion peaks.",
      },
      {
        title: "50× more parallel wallets",
        copy: "Trojan limits multi-wallet flows to 10. Insider-X gives you 500 — on the same plan.",
      },
      {
        title: "Same 50% referral. Better cashback.",
        copy: "We match Trojan on referral and beat them on cashback tiers (50% vs 45% at the top).",
      },
      {
        title: "Full advanced order book",
        copy: "Trojan ships limit only. Insider-X adds DCA and trailing stops enforced by an on-chain keeper.",
      },
    ],
  },
  photon: {
    slug: "photon",
    competitor: "Photon",
    tagline: "From flashlight to laser.",
    bullets: [
      {
        title: "205ms faster on median fills",
        copy: "184ms vs Photon's 389ms — over 2× the responsiveness on the same pairs.",
      },
      {
        title: "100× more parallel wallets",
        copy: "Photon hard-limits at 5 wallets. Insider-X scales to 500.",
      },
      {
        title: "Jupiter routing built in",
        copy: "Photon doesn't pipe through Jupiter. We do, by default, with override controls per order.",
      },
      {
        title: "Real MEV protection",
        copy: "Photon ships with no MEV protection. Insider-X bundles via Jito and runs a private decoy layer.",
      },
    ],
  },
};
