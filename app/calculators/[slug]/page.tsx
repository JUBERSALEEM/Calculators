import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CALCULATORS,
  getCalculator,
  getCalculatorsInCategory,
} from "@/calculators/registry";
import { getContent } from "@/calculators/content-index";
import { CalculatorRenderer } from "@/components/calculators/calculator-renderer";
import { CalculatorCard } from "@/components/calculator/calculator-card";
import type { CalculatorContent } from "@/calculators/page-types";

export function generateStaticParams() {
  return CALCULATORS.map((calc) => ({ slug: calc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) return {};
  return {
    title: `${meta.name} — Free Online Calculator`,
    description: meta.description,
    alternates: { canonical: `/calculators/${slug}` },
    openGraph: {
      type: "website",
      title: `${meta.name} — Free Online Calculator`,
      description: meta.description,
      url: `/calculators/${slug}`,
    },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  if (!meta) return notFound();

  const content = getContent(slug) as CalculatorContent | undefined;
  const siblings = getCalculatorsInCategory(meta.category)
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  return (
    <div className="container-page">
      <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
          Home
        </Link>
        <span>&rsaquo;</span>
        <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400">
          Directory
        </Link>
        <span>&rsaquo;</span>
        <span className="text-neutral-900 dark:text-neutral-50">{meta.name}</span>
      </nav>

      {/* Calculator near the top — client interactive island */}
      <section aria-labelledby="calc-heading" className="mb-10">
        <CalculatorRenderer slug={slug} />
      </section>

      {content && (
        <>
          <section className="mb-10">
            <h2 id="how-it-works" className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              How it works
            </h2>
            <div className="card mb-4">
              <p className="font-mono text-base text-neutral-900 dark:text-neutral-100 mb-2">
                {content.formula.plain}
              </p>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mt-4 mb-2">
                Variables
              </h3>
              <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1 pl-5">
                {content.formula.variables.map((v) => (
                  <li key={v.symbol}>
                    <span className="font-mono font-medium">{v.symbol}</span> — {v.description}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 id="worked-example" className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Worked example
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">{content.workedExample.label}</p>
            <ol className="list-decimal pl-6 text-neutral-700 dark:text-neutral-300 mb-2 space-y-1">
              {content.workedExample.steps.map((s, i) => (
                <li key={i} className="text-sm font-mono">{s}</li>
              ))}
            </ol>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-50">Result:</span>{" "}
              <span className="font-mono text-brand-600 dark:text-brand-400">
                {content.workedExample.result}
              </span>
            </div>
            {content.workedExample.note && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{content.workedExample.note}</p>
            )}
          </section>

          <section className="mb-10">
            <h2 id="assumptions" className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Assumptions
            </h2>
            <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
              {content.assumptions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Limitations
            </h3>
            <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 mb-4 space-y-1">
              {content.limitations.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 id="references" className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              References
            </h2>
            <ul className="list-disc pl-6 text-neutral-700 dark:text-neutral-300 space-y-1">
              {content.references.map((r, i) => (
                <li key={i}>
                  {r.code ? `${r.code}: ` : ""}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
              Last reviewed: {meta.lastReviewed}. Formula status:{" "}
              <span className="text-neutral-700 dark:text-neutral-300">{meta.formulaStatus}</span>{" "}
              (catalog status: {meta.status}).
            </p>
          </section>
        </>
      )}

      <section className="mb-10">
        <h2 id="related" className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
          Related calculators
        </h2>
        {siblings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siblings.map((calc) => (
              <CalculatorCard key={calc.slug} calc={calc} />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400">
            No related calculators in this category yet.
          </p>
        )}
      </section>
    </div>
  );
}
