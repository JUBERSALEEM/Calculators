import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { calculators, categories, implementedCount } from "@/lib/calculators/registry";

export const metadata: Metadata = {
  title: "About & verification method",
  description:
    "How calculators on this site are researched, verified and tested — and what the site deliberately does not claim.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/about", label: "About" }]} />

      <article className="max-w-3xl pb-16">
        <header className="pt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">About this site</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            This is a calculator site built around a simple constraint: a number is only useful if you can
            check it. Every tool shows its formula, states its assumptions, cites a source where one exists,
            and refuses to answer outside the range where the method is valid.
          </p>
        </header>

        <section aria-labelledby="method" className="mt-10">
          <h2 id="method" className="text-xl font-semibold tracking-tight text-ink">
            How a calculator gets published
          </h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <li>
              <strong className="text-ink">1. It exists in the catalogue.</strong> The project maintains a
              researched catalogue of 1,248 candidate calculators with unique IDs and slugs, so a new tool
              cannot duplicate an existing one.
            </li>
            <li>
              <strong className="text-ink">2. The formula is verified.</strong> Either against a document that
              was opened and read — a regulator, a standards body or a peer-reviewed method — or as a
              mathematical definition that is derived in full on the page.
            </li>
            <li>
              <strong className="text-ink">3. Edge cases are decided.</strong> Zero denominators, empty inputs,
              values below absolute zero, temperatures outside a regression&rsquo;s calibrated range: each is
              handled explicitly, never silently coerced.
            </li>
            <li>
              <strong className="text-ink">4. It is tested.</strong> Known-answer tests use values published by
              the source or computed independently by hand, plus boundary and invalid-input tests.
            </li>
            <li>
              <strong className="text-ink">5. The page explains itself.</strong> Formula, variables, worked
              example, assumptions, limitations and references are all on the page, not hidden in a comment.
            </li>
          </ol>
        </section>

        <section aria-labelledby="status" className="mt-10">
          <h2 id="status" className="text-xl font-semibold tracking-tight text-ink">
            Current state
          </h2>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-wider text-muted">Published calculators</dt>
              <dd className="tnum mt-1 text-2xl font-semibold text-ink">{implementedCount}</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-wider text-muted">Categories with tools</dt>
              <dd className="tnum mt-1 text-2xl font-semibold text-ink">{categories.length}</dd>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-wider text-muted">Catalogued candidates</dt>
              <dd className="tnum mt-1 text-2xl font-semibold text-ink">1,248</dd>
            </div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            The gap is deliberate. Publishing 1,248 pages of unverified arithmetic would be easy to
            generate and worthless to use — and search quality guidance treats bulk unsupported pages as
            spam. Tools are published only when they pass the tests above.
          </p>
        </section>

        <section aria-labelledby="sources" className="mt-10">
          <h2 id="sources" className="text-xl font-semibold tracking-tight text-ink">
            Primary sources used so far
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <li>
              US CDC for adult BMI categories and the screening caveat.
            </li>
            <li>
              NOAA / National Weather Service for the wind-chill and heat-index formulae, including their
              valid input ranges.
            </li>
            <li>
              NIST Special Publication 811 for exact unit-conversion factors and temperature-scale
              definitions.
            </li>
            <li>
              Standard mathematical definitions for percentages, the arithmetic mean and compound interest,
              each derived on its own page.
            </li>
          </ul>
        </section>

        <section aria-labelledby="not" className="mt-10">
          <h2 id="not" className="text-xl font-semibold tracking-tight text-ink">
            What this site does not claim
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
            <li>No calculator is a substitute for medical, legal, financial or engineering advice.</li>
            <li>No result is guaranteed to match a specific regulator, lender or clinician&rsquo;s figure.</li>
            <li>No prediction of search rankings, traffic or advertising approval.</li>
            <li>No account, upload or tracking of the numbers you type.</li>
          </ul>
        </section>

        <p className="mt-10 text-sm">
          <Link href="/calculators" className="text-accent-ink underline underline-offset-2">
            Browse the {implementedCount} published calculators
          </Link>{" "}
          — currently:{" "}
          {calculators.map((calculator, index) => (
            <span key={calculator.slug}>
              <Link href={`/calculators/${calculator.slug}`} className="text-ink-soft underline underline-offset-2 hover:text-accent-ink">
                {calculator.name}
              </Link>
              {index < calculators.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </article>
    </>
  );
}
