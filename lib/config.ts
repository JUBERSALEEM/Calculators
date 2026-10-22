/**
 * Site configuration. Only non-secret values live here.
 *
 * Analytics / advertising are intentionally NOT activated. The environment
 * variables below are documented for later activation (see README.md) and are
 * never hard-coded with fabricated IDs.
 */
export const site = {
  name: "Calculators",
  url:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : "http://localhost:3000",
};

export const SITE_URL = site.url;

export const analytics = {
  // Google Analytics 4 measurement ID. Set via NEXT_PUBLIC_GA4_MEASUREMENT_ID.
  // Not committed; left undefined until the owner creates a GA4 property.
  measurementId:
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
      ? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
      : undefined,
} as const;
