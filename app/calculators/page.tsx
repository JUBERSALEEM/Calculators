import { CALCULATORS, getCategories, statusCounts } from "@/calculators/registry";
import { CalculatorExplorer } from "@/components/calculator/explorer";
import Link from "next/link";

export const metadata = {
  title: "Calculator Directory — 1,248 calculators across 84 categories",
  description:
    "Browse every implemented calculator, grouped by discipline. Each tool documents its formula, assumptions, limitations and source status, and runs entirely in your browser.",
  alternates: { canonical: "/calculators" },
};

export default function DirectoryPage() {
  const categories = getCategories();
  const counts = statusCounts();
  const items = CALCULATORS.map((c) => ({
    slug: c.slug,
    name: c.name,
    category: c.category,
    categoryLabel: c.categoryLabel,
    status: c.formulaStatus,
  }));

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Calculator directory</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-4 max-w-3xl">
        {CALCULATORS.length.toLocaleString("en-US")} working calculators across {categories.length} categories.{" "}
        <Link href="/all-calculators" className="text-brand-600 dark:text-brand-400 hover:underline">
          View the full list by category
        </Link>.
        Every entry is implemented and documented with its formula, assumptions and limitations. Only the entries
        marked as known-answer tested in the catalog are checked against independent reference values.
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        Source status: {counts.SOURCE_VERIFIED} verified against an inspected authoritative source ·{" "}
        {counts.RESEARCH_REQUIRED.toLocaleString("en-US")} standard closed-form or user-parameterised ·{" "}
        {counts.SPECIALIST_REVIEW_REQUIRED} flagged for specialist review (code- or clinically-gated parameters are
        user-supplied and clearly labelled).{" "}
        <Link href="/about" className="text-brand-600 dark:text-brand-400 hover:underline">
          How we verify
        </Link>
      </p>

      <CalculatorExplorer items={items} categories={categories} />

      <section className="mt-14">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">Browse by category</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="flex items-center justify-between gap-3 rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
              >
                <span className="text-sm text-neutral-800 dark:text-neutral-200">
                  <span className="text-neutral-400 dark:text-neutral-500 mr-2">{c.code}</span>
                  {c.label}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
