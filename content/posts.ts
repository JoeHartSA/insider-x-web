export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
};

export const POSTS: Post[] = [
  {
    slug: "184ms-fills-on-solana",
    title: "How we shaved 60ms off every fill on Solana",
    excerpt:
      "Co-locating with Jito, terminating TLS at the edge, and the one obscure compute-budget trick we ship in every order.",
    date: "2026-05-08",
    tag: "Engineering",
  },
  {
    slug: "fleet-architecture",
    title: "The architecture behind 500 simultaneous wallets",
    excerpt:
      "Local key generation, parallel signing, batched inclusion, and how we stopped fighting the runtime.",
    date: "2026-04-21",
    tag: "Engineering",
  },
  {
    slug: "mev-shield-decoys",
    title: "Why we built a decoy mempool layer (and what it caught)",
    excerpt:
      "Three weeks of bots chasing falsified fingerprints — and the real fills landing on the other side of the wall.",
    date: "2026-04-02",
    tag: "Research",
  },
];
