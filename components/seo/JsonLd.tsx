export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://insider-x.io#org",
        name: "Insider-X Labs",
        url: "https://insider-x.io",
        logo: "https://insider-x.io/favicon.svg",
        sameAs: [
          "https://x.com/insiderx",
          "https://t.me/insiderx",
          "https://discord.gg/insiderx",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://insider-x.io#app",
        name: "Insider-X",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        description:
          "Trade faster, safer, smarter on Solana. Sub-200ms fills, on-chain rug protection, and fees up to 5× cheaper than Axiom, Trojan and Photon.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
