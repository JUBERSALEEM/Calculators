import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowRightIcon } from "@/components/icons";
import { categories } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "Calculator categories",
  description:
    "Browse calculators grouped by subject: basic arithmetic, statistics, money, weather, health and unit conversion.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/categories", label: "Categories" }]} />

      <header className="max-w-3xl pb-8 pt-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Categories</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Every category listed here contains at least one working calculator. Empty categories are not
          published.
        </p>
      </header>

      <ul className="grid gap-4 pb-16 sm:grid-cols-2">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/categories/${category.slug}`}
              className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent/60"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="text-lg font-semibold tracking-tight text-ink">{category.name}</span>
                <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </span>
              <span className="mt-2 text-sm leading-relaxed text-muted">{category.description}</span>
              <span className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
                {category.calculators.length} {category.calculators.length === 1 ? "calculator" : "calculators"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
