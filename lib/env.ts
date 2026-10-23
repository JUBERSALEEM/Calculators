/**
 * Optional integrations. All are OFF unless the corresponding environment
 * variable is set at build time. Nothing here is a secret: these values are
 * public identifiers that ship to the browser by design.
 *
 * Do not add placeholder or fabricated IDs. An empty value means "not
 * configured", and the related script is not rendered at all.
 */
export const integrations = {
  /** Google Analytics 4 measurement ID, e.g. G-XXXXXXXXXX */
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || null,
  /** Google AdSense publisher ID, e.g. ca-pub-0000000000000000 */
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || null,
} as const;

export const analyticsConfigured = integrations.gaMeasurementId !== null;
export const adsConfigured = integrations.adsenseClient !== null;
