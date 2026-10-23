/**
 * Site-wide configuration.
 *
 * NEXT_PUBLIC_SITE_URL must be set in production so canonical URLs, sitemap
 * entries and Open Graph tags point at the real domain. The fallback exists so
 * that local development and CI builds work without any environment file.
 */
export const site = {
  name: "Calculators",
  shortName: "Calculators",
  tagline: "Verified calculators that show their working",
  description:
    "Free, fast calculators for percentages, health, weather, units and money. Every formula is documented, every assumption is stated, and the arithmetic runs in your browser.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en",
  twitter: "@calculators",
} as const;

export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
