import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorCard } from "@/components/calculator-card";
import { CalculatorSearch } from "@/components/calculator-search";
import { calculators, categories, implementedCount, searchIndex } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "All calculators",
  description: `Browse all ${implementedCount} working calculators — percentages, statistics, money, weather, health and unit conversion. Each one shows its formula and sources.`,
  alternates: { canonical: "/calculators" },
};

export default function CalculatorDirectoryPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/calculators", label: "All calculators" }]} />

      <header className="max-w-3xl pb-8 pt-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">All calculators</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          {implementedCount} working tools across {categories.length} categories. Everything here runs in
          your browser, and every formula is documented on its page.
        </p>
        <div className="mt-6">
          <CalculatorSearch entries={searchIndex} alwaysList placeholder="Filter by name, category or keyword…" />
        </div>
      </header>

      <nav aria-label="Categories" className="mb-8 flex flex-wrap gap-2 border-y border-line py-4">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent/60 hover:text-accent-ink"
          >
            {category.name}
            <span className="ml-1.5 text-xs text-muted">{category.calculators.length}</span>
          </Link>
        ))}
      </nav>

      <ul className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <li key={calculator.slug}>
            <CalculatorCard calculator={calculator} />
          </li>
        ))}
      </ul>

      <section className="mb-16 rounded-xl border border-line bg-surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Why only {implementedCount}?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          The project has a researched catalogue of 1,248 candidate calculators, but publishing a page
          requires a verified formula, tested implementation, documented assumptions and cited sources.
          Tools are added as they meet that bar rather than being generated in bulk — which is also what
          search quality guidance asks of a site like this.
        </p>
      </section>
    </>
  );
}
