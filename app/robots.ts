import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://insider-x.io/sitemap.xml",
    host: "https://insider-x.io",
  };
}
