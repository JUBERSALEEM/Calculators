import type { MetadataRoute } from "next";

import { calculators, categories } from "@/lib/calculators/registry";
import { site } from "@/lib/site";

/**
 * Only routes that actually exist and are meant to be indexed are listed.
 * Planned catalogue entries are deliberately absent: adding 1,248 URLs for
 * pages that do not exist would be a doorway-style pattern, not an SEO win.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-22");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/calculators`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/categories`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${site.url}/categories/${category.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const calculatorRoutes: MetadataRoute.Sitemap = calculators.map((calculator) => ({
    url: `${site.url}/calculators/${calculator.slug}`,
    lastModified: new Date(calculator.updated),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes];
}
