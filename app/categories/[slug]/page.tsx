import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorCard } from "@/components/calculator-card";
import { categories, categoryBySlug } from "@/lib/calculators/registry";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: `${category.name} calculators`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} calculators`,
      description: category.description,
      url: `/categories/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = categoryBySlug.get(slug);
  if (!category) notFound();

  return (
    <>
      <Breadcrumbs
        items={[
          { href: "/categories", label: "Categories" },
          { href: `/categories/${category.slug}`, label: category.name },
        ]}
      />

      <header className="max-w-3xl pb-8 pt-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{category.name}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{category.description}</p>
        <p className="mt-2 text-sm text-muted">
          {category.calculators.length} {category.calculators.length === 1 ? "calculator" : "calculators"} in this
          category.
        </p>
      </header>

      <ul className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {category.calculators.map((calculator) => (
          <li key={calculator.slug}>
            <CalculatorCard calculator={calculator} />
          </li>
        ))}
      </ul>

      <p className="pb-16 text-sm">
        <Link href="/calculators" className="text-accent-ink underline underline-offset-2">
          Browse all calculators
        </Link>
      </p>
    </>
  );
}
