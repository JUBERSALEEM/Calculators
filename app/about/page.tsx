export const metadata = {
  title: "About",
  description: "About Calculators — verified, privacy-first online calculators.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">About</h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        Calculators is a collection of working, verified online calculators. Every formula is
        documented with its source, assumptions, and limitations — and every calculation runs
        entirely in your browser. Nothing you enter is sent to a server.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Our approach</h2>
      <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-6 space-y-2">
        <li>Verified formulas — each calculator traces to an inspected authoritative source where available.</li>
        <li>Privacy by design — inputs never leave your browser.</li>
        <li>No dark patterns — invalid input is refused with a clear message, never silently coerced.</li>
        <li>Accessible — keyboard operable, reduced-motion respected, WCAG 2.2 AA targeted.</li>
      </ul>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Sources</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        Where a formula depends on an authority, the calculator page names it (for example NIST
        SP 811 for unit conversion factors, NOAA/NWS for wind chill and heat index, CDC for BMI
        categories). Calculators whose formula source has not yet been inspected are labelled
        accordingly and are not presented as verified.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Status</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        All 1,248 catalog entries across 84 categories are implemented and tested. Of those, 21 have
        formula parameters verified against an inspected authoritative source, 1,168 are standard
        closed-form or user-parameterised calculations, and 59 are flagged for specialist review.
      </p>
      <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-2">
        <li>
          <strong>Source verified (21).</strong> Parameters checked against the inspection log — NIST
          SP 811, FAO-56, NOAA/NWS, CDC, SSA, IRS, US DOL and CFPB Regulation Z Appendix J.
        </li>
        <li>
          <strong>Standard formula (1,168).</strong> Closed-form, engineering or user-parameterised
          arithmetic. The formula is printed in full on each page with its assumptions and limits.
        </li>
        <li>
          <strong>Specialist review pending (59).</strong> Building-code tables, licensed standards
          (NEC, NFPA, ACI, ASCE, ASTM, ISO), pediatric growth references and clinical dosing. No
          licensed table or clinical claim is embedded: regulated values are inputs you supply, the
          page carries a review banner, and the tool is excluded from the sitemap.
        </li>
      </ul>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        The catalog and roadmap live in{" "}
        <a href="https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/catalog.csv" className="text-brand-600 dark:text-brand-400">catalog.csv</a>{" "}
        and the master plan.
      </p>
    </div>
  );
}
