export const metadata = {
  title: "Terms of Use",
  description: "Terms of use for Calculators.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Terms of Use</h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        Last updated: October 22, 2026.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Not professional advice</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        The calculators are provided for general informational and educational purposes only.
        They are not medical, legal, financial, tax, or engineering advice, and must not be used
        as a substitute for consultation with a qualified professional in the relevant field.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">No guarantee of accuracy</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        While each implemented calculator uses a documented formula and is tested, we make no
        warranty that the results are accurate, complete, or suitable for any particular purpose.
        Always check a calculator&rsquo;s assumptions and limitations before relying on a result.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Use at your own risk</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        Your use of this site is at your own risk. We are not liable for any loss or damage
        arising from use of or reliance on a calculator.
      </p>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mt-8 mb-3">Changes</h2>
      <p className="text-neutral-700 dark:text-neutral-300 mb-4">
        We may update or remove calculators and these terms at any time. Continued use of the
        site after changes constitutes acceptance of the revised terms.
      </p>
    </div>
  );
}
