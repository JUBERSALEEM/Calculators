export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Calculators.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Privacy Policy</h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        Last updated: October 22, 2026.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">No personal information is collected</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        The calculators on this site do not require an account, and they do not collect your
        personal information. Everything you type into a calculator stays in your browser — no
        calculation input or result is sent to a server, logged, or shared.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Analytics</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        Analytics integration (Google Analytics 4) is prepared but not activated. If enabled in
        the future, it would be consent-gated and would record only aggregate, slug-level events
        (page view, calculator used, input refused) — never the values you enter.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Advertising</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        No advertising is served on this site. If advertising is introduced later, it will be
        placed below the calculator result, never between the heading and the inputs, and never
        on sensitive pages (health, legal, or financial hardship).
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Third-party sites</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        Calculator pages link to authoritative sources (for example NIST, NOAA/NWS, CDC). Those
        sites are operated by other organizations and are subject to their own privacy policies.
      </p>
    </div>
  );
}
