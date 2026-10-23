import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No internal or staging routes are exposed in this build, but keep the
        // next.js asset path out of the crawl queue.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
