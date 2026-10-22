import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCalculatorsInCategory } from "@/calculators/registry";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategories().find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.label} calculators`,
    description: `All ${category.count} working ${category.label.toLowerCase()} calculators, each with its formula, assumptions and limitations documented.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategories().find((c) => c.slug === slug);
  if (!category) return notFound();

  const calcs = getCalculatorsInCategory(category.code);
  const index = getCategories().findIndex((c) => c.code === category.code);
  const prev = index > 0 ? getCategories()[index - 1] : null;
  const next = index < getCategories().length - 1 ? getCategories()[index + 1] : null;

  return (
    <div className="container-page">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400">
          Directory
        </Link>
        <span>&rsaquo;</span>
        <span className="text-neutral-900 dark:text-neutral-50">{category.label}</span>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">{category.label}</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {calcs.length} calculator{calcs.length === 1 ? "" : "s"} in category {category.code}. Each runs entirely in
        your browser and documents its formula and limits.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {calcs.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={`/calculators/${calc.slug}`}
              className="block h-full rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-brand-500 transition-colors"
            >
              <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-50">{calc.name}</span>
              <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">
                {calc.formulaStatus === "SOURCE_VERIFIED"
                  ? "Source verified"
                  : calc.formulaStatus === "SPECIALIST_REVIEW_REQUIRED"
                    ? "Specialist review required"
                    : "Standard formula"}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-sm">
        {prev ? (
          <Link href={`/categories/${prev.slug}`} className="btn-outline">
            ← {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/categories/${next.slug}`} className="btn-outline">
            {next.label} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
