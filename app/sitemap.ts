import { getCalculatorSlugs } from "@/calculators/registry";

const BASE = "http://localhost:3000";

// Routes that should be indexed. Only published/implemented calculator slugs are
// included; planned or research-stage calculators are excluded (sitemap hygiene).
const STATIC_ROUTES = [
  "/",
  "/calculators",
  "/about",
  "/privacy",
  "/terms",
];

export default async function sitemap() {
  const calculatorRoutes = getCalculatorSlugs().map((slug) => ({
    url: `${BASE}/calculators/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticRoutes = STATIC_ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.6,
  }));

  return [...staticRoutes, ...calculatorRoutes];
}
