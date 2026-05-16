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
          "The fastest execution engine on Solana. Command up to 500 wallets in parallel across pump.fun, Raydium, Jupiter, Drift and every alt-market.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "184",
        },
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
