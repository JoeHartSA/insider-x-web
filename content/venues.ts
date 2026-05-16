export type Venue = {
  id: string;
  name: string;
  category: "amm" | "perps" | "memes" | "aggregator" | "orderbook";
  short: string;
  vol24h: string;
};

export const VENUES: Venue[] = [
  { id: "pumpfun", name: "pump.fun", category: "memes", short: "PMP", vol24h: "$184M" },
  { id: "raydium", name: "Raydium", category: "amm", short: "RAY", vol24h: "$420M" },
  { id: "meteora", name: "Meteora", category: "amm", short: "MET", vol24h: "$215M" },
  { id: "jupiter", name: "Jupiter", category: "aggregator", short: "JUP", vol24h: "$1.8B" },
  { id: "orca", name: "Orca", category: "amm", short: "ORC", vol24h: "$96M" },
  { id: "phoenix", name: "Phoenix", category: "orderbook", short: "PHX", vol24h: "$54M" },
  { id: "pumpswap", name: "Pumpswap", category: "memes", short: "PSW", vol24h: "$71M" },
  { id: "drift", name: "Drift", category: "perps", short: "DFT", vol24h: "$612M" },
  { id: "zeta", name: "Zeta", category: "perps", short: "ZTA", vol24h: "$48M" },
  { id: "magiceden", name: "Magic Eden", category: "aggregator", short: "MED", vol24h: "$31M" },
];
