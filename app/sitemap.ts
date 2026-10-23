import type { MetadataRoute } from "next";
import { CALCULATORS, getCategories, isIndexable } from "@/calculators/registry";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-22");
  const staticPaths = ["", "/calculators", "/all-calculators", "/roadmap", "/about", "/privacy", "/terms"];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Specialist-gated calculators stay out of the sitemap and are noindexed.
  const calculatorRoutes: MetadataRoute.Sitemap = CALCULATORS.filter(isIndexable).map((c) => ({
    url: `${SITE_URL}/calculators/${c.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: c.formulaStatus === "SOURCE_VERIFIED" ? 0.9 : 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes];
}
