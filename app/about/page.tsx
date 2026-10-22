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
        This is Phase 1 of the project. A small initial batch of calculators is implemented and
        tested; the full catalog (1,248 entries) is maintained in
        <a href="https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/catalog.csv" className="text-brand-600 dark:text-brand-400">catalog.csv</a>,
        with the roadmap in the master plan.
      </p>
    </div>
  );
}
