import type { MetadataRoute } from "next";

const SITE = "https://insider-x.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    "",
    "/features",
    "/rewards",
    "/vs/axiom",
    "/vs/trojan",
    "/vs/photon",
    "/docs",
    "/blog",
    "/changelog",
  ].map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
