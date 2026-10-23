import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CalculatorForm } from "@/components/calculator-form";
import { CheckIcon, InfoIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { calculators, calculatorBySlug, getCalculator } from "@/lib/calculators/registry";
import { absoluteUrl } from "@/lib/site";
import type { Calculator } from "@/lib/calculators/types";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const calculator = calculatorBySlug.get(slug);
  if (!calculator) return { title: "Calculator not found", robots: { index: false } };

  const path = `/calculators/${calculator.slug}`;
  return {
    title: calculator.title,
    description: calculator.description,
    keywords: [calculator.name, ...calculator.keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: calculator.title,
      description: calculator.description,
      url: path,
    },
    twitter: { card: "summary", title: calculator.title, description: calculator.description },
  };
}

function VerificationBadge({ calculator }: { calculator: Calculator }) {
  const verified = calculator.verification === "source-verified";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold",
        verified
          ? "border-positive/30 bg-positive-soft text-positive"
          : "border-line bg-paper-deep text-ink-soft",
      ].join(" ")}
    >
      <CheckIcon className="size-3" />
      {verified ? "Source-verified formula" : "Formula shown in full"}
    </span>
  );
}

export default async function CalculatorPage({ params }: Params) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  const related = calculator.related
    .map((relatedSlug) => getCalculator(relatedSlug))
    .filter((item): item is Calculator => item !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: calculator.name,
        description: calculator.description,
        url: absoluteUrl(`/calculators/${calculator.slug}`),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: calculator.category.name,
            item: absoluteUrl(`/categories/${calculator.category.slug}`),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: calculator.name,
            item: absoluteUrl(`/calculators/${calculator.slug}`),
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <Breadcrumbs
        items={[
          { href: `/categories/${calculator.category.slug}`, label: calculator.category.name },
          { href: `/calculators/${calculator.slug}`, label: calculator.name },
        ]}
      />

      <header className="max-w-3xl pb-6 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/categories/${calculator.category.slug}`}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-ink hover:underline"
          >
            {calculator.category.name}
          </Link>
          <span aria-hidden="true" className="text-line-strong">
            ·
          </span>
          <VerificationBadge calculator={calculator} />
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{calculator.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{calculator.description}</p>
      </header>

      {/* The working calculator, above the fold and before any supporting prose. */}
      <CalculatorForm slug={calculator.slug} />

      <AdSlot placement="below-result" className="mt-6" />

      <div className="mt-12 grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0 space-y-12">
          <section aria-labelledby="what-heading">
            <h2 id="what-heading" className="text-xl font-semibold tracking-tight text-ink">
              What this calculator does
            </h2>
            <div className="mt-3 space-y-3">
              {calculator.explanation.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[0.95rem] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section aria-labelledby="formula-heading">
            <h2 id="formula-heading" className="text-xl font-semibold tracking-tight text-ink">
              Formula
            </h2>
            <div className="mt-3 space-y-3">
              {calculator.formula.map((line) => (
                <div key={line.expression} className="rounded-lg border border-line bg-surface p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">{line.label}</p>
                  <p className="formula mt-2 text-ink">{line.expression}</p>
                </div>
              ))}
            </div>
          </section>

          {calculator.example && (
            <section aria-labelledby="example-heading">
              <h2 id="example-heading" className="text-xl font-semibold tracking-tight text-ink">
                Worked example
              </h2>
              <div className="mt-3 rounded-lg border border-line bg-surface p-4">
                <p className="text-sm text-ink-soft">
                  <span className="font-medium text-ink">Input:</span> {calculator.example.inputs}
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  <span className="font-medium text-ink">Result:</span>{" "}
                  <span className="tnum font-semibold text-ink">{calculator.example.result}</span>
                </p>
                <p className="formula mt-3 border-t border-line pt-3 text-muted">{calculator.example.working}</p>
              </div>
            </section>
          )}

          <section aria-labelledby="assumptions-heading">
            <h2 id="assumptions-heading" className="text-xl font-semibold tracking-tight text-ink">
              Assumptions
            </h2>
            <ul className="mt-3 space-y-2">
              {calculator.assumptions.map((assumption) => (
                <li key={assumption} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <CheckIcon className="mt-1 size-3.5 shrink-0 text-positive" />
                  {assumption}
                </li>
              ))}
            </ul>
          </section>

          {calculator.cautions && calculator.cautions.length > 0 && (
            <section aria-labelledby="limits-heading">
              <h2 id="limits-heading" className="text-xl font-semibold tracking-tight text-ink">
                Limitations and cautions
              </h2>
              <ul className="mt-3 space-y-2 rounded-lg border border-caution/30 bg-caution-soft p-4">
                {calculator.cautions.map((caution) => (
                  <li key={caution} className="flex gap-2.5 text-sm leading-relaxed text-caution">
                    <InfoIcon className="mt-0.5 size-4 shrink-0" />
                    {caution}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="references-heading">
            <h2 id="references-heading" className="text-xl font-semibold tracking-tight text-ink">
              Sources
            </h2>
            <ul className="mt-3 space-y-3">
              {calculator.references.map((reference) => (
                <li key={reference.url} className="rounded-lg border border-line bg-surface p-4">
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noopener noreferrer external"
                    className="text-sm font-medium text-accent-ink underline underline-offset-2 hover:text-accent"
                  >
                    {reference.label}
                  </a>
                  {reference.note && <p className="mt-1.5 text-xs leading-relaxed text-muted">{reference.note}</p>}
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="details-heading" className="rounded-xl border border-line bg-surface p-5">
            <h2 id="details-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
              Details
            </h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Catalogue ID</dt>
                <dd className="tnum font-medium text-ink">{calculator.id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Category</dt>
                <dd className="text-right font-medium text-ink">{calculator.category.name}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Verification</dt>
                <dd className="text-right font-medium text-ink">
                  {calculator.verification === "source-verified" ? "Source-verified" : "Standard formula"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Updated</dt>
                <dd className="font-medium text-ink">
                  <time dateTime={calculator.updated}>{calculator.updated}</time>
                </dd>
              </div>
            </dl>
          </section>

          {related.length > 0 && (
            <nav aria-labelledby="related-heading" className="rounded-xl border border-line bg-surface p-5">
              <h2 id="related-heading" className="text-sm font-semibold uppercase tracking-wider text-muted">
                Related calculators
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/calculators/${item.slug}`} className="text-ink-soft hover:text-accent-ink hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </>
  );
}
