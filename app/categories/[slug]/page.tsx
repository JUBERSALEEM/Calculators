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
  const calcs = getCalculatorsInCategory(category.slug.toUpperCase());
  return {
    title: `${category.label} calculators`,
    description: `Browse ${calcs.length} verified ${category.label.toLowerCase()} calculators.`,
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

  const calcs = getCalculatorsInCategory(category.slug.toUpperCase());

  return (
    <div className="container-page">
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
          Home
        </Link>
        <span>&rsaquo;</span>
        <span className="text-neutral-900 dark:text-neutral-50">{category.label}</span>
      </nav>

      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
        {category.label}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {calcs.length} verified calculator{calcs.length !== 1 ? "s" : ""} in this category.
      </p>

      {calcs.length === 0 ? (
        <div className="rounded-calc p-10 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
          <p className="text-neutral-500 dark:text-neutral-400">
            No calculators in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calcs.map((calc) => (
            <article key={calc.slug} className="card">
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-md brand-bg px-2 py-1 text-[10px] font-medium text-brand-600 dark:text-brand-400 uppercase tracking-tighter">
                  {calc.intent}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                {calc.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                {calc.description}
              </p>
              <Link
                href={`/calculators/${calc.slug}`}
                className="btn-outline w-full text-center"
              >
                Open calculator
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
