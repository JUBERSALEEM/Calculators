import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CALCULATORS, getCalculator, getCalculatorsInCategory, groupForSlug, isIndexable } from "@/calculators/registry";
import { getContent } from "@/calculators/content-index";
import { loadSpec } from "@/calculators/spec-loader";
import { EngineRuntime } from "@/components/calculator/engine-runtime";
import { Callout } from "@/components/ui/callout";

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
    robots: isIndexable(meta) ? undefined : { index: false, follow: true },
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

  const group = groupForSlug(slug);
  const spec = await loadSpec(group, slug);
  const legacy = getContent(slug);

  const siblings = getCalculatorsInCategory(meta.category)
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  const assumptions = [...(spec?.assumptions ?? []), ...(legacy?.assumptions ?? [])];
  const limitations = [...(spec?.limitations ?? []), ...(legacy?.limitations ?? [])];
  const references = [
    ...meta.sources,
    ...(legacy?.references?.map((r) => ({ code: r.code ?? "", title: r.title, url: r.url, accessed: "2026-10-22" })) ?? []),
  ];
  const seen = new Set<string>();
  const uniqueRefs = references.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

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
        <Link
          href={`/categories/${meta.category.toLowerCase()}`}
          className="hover:text-brand-600 dark:hover:text-brand-400"
        >
          {meta.categoryLabel}
        </Link>
        <span>&rsaquo;</span>
        <span className="text-neutral-900 dark:text-neutral-50">{meta.name}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">{meta.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl">{meta.description}</p>
      </header>

      {meta.formulaStatus === "SPECIALIST_REVIEW_REQUIRED" && (
        <Callout variant="warning" title="Specialist review required">
          This calculator involves code-governed, licensed or clinical parameters. Any regulated values are supplied
          by you and the arithmetic is shown transparently — it is <strong>not</strong> an authoritative code or
          clinical determination. Verify against the governing standard or a qualified professional before relying on
          the output.
        </Callout>
      )}

      <section aria-labelledby="calc-heading" className="my-8">
        <h2 id="calc-heading" className="sr-only">
          Interactive calculator
        </h2>
        {spec ? (
          <EngineRuntime slug={slug} group={group} />
        ) : (
          <Callout variant="error" title="Calculator unavailable">
            This calculator’s engine module could not be loaded. Please reload the page.
          </Callout>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Formula and variables</h2>
          <div className="card">
            <p className="font-mono text-sm text-neutral-900 dark:text-neutral-100 mb-3 break-words">
              {spec?.formulaPlain ?? legacy?.formula.plain}
            </p>
            <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
              {(spec?.variables ?? legacy?.formula.variables ?? []).map((v) => (
                <li key={v.symbol}>
                  <span className="font-mono font-medium">{v.symbol}</span> — {v.description}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Worked example</h2>
          <div className="card">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              The calculator opens with a documented default case. Changing any input recomputes instantly and shows
              the full multi-metric output, so you can reproduce the arithmetic yourself from the formula above.
            </p>
            {legacy?.workedExample && (
              <div className="mt-3">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-2">{legacy.workedExample.label}</p>
                <ol className="list-decimal pl-5 text-xs font-mono text-neutral-700 dark:text-neutral-300 space-y-1">
                  {legacy.workedExample.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Result: </span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{legacy.workedExample.result}</span>
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Assumptions</h2>
          <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            {assumptions.length > 0 ? (
              assumptions.map((a, i) => <li key={i}>{a}</li>)
            ) : (
              <li>The formula is evaluated exactly as written above, with no hidden rounding before the display step.</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Limitations</h2>
          <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            {limitations.length > 0 ? (
              limitations.map((l, i) => <li key={i}>{l}</li>)
            ) : (
              <li>
                This is an arithmetic model of the stated formula. It does not account for factors outside the inputs
                shown and is not professional advice.
              </li>
            )}
          </ul>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">References and status</h2>
        {uniqueRefs.length > 0 && (
          <ul className="list-disc pl-5 text-sm text-neutral-700 dark:text-neutral-300 space-y-1 mb-4">
            {uniqueRefs.map((r) => (
              <li key={r.url}>
                {r.code ? `${r.code}: ` : ""}
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 dark:text-brand-400 hover:underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Catalog ID {meta.id} · Category {meta.category} · Formula status{" "}
          <span className="text-neutral-700 dark:text-neutral-300">{meta.formulaStatus}</span> · Implementation{" "}
          {meta.status} · Last reviewed {meta.lastReviewed}.
        </p>
      </section>

      <section className="mt-10 mb-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">Related calculators</h2>
        {siblings.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {siblings.map((calc) => (
              <li key={calc.slug}>
                <Link
                  href={`/calculators/${calc.slug}`}
                  className="block h-full rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-brand-500 transition-colors"
                >
                  <span className="block text-sm font-medium text-neutral-900 dark:text-neutral-50">{calc.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">No siblings in this category.</p>
        )}
      </section>
    </div>
  );
}
