import Link from "next/link";

import { CalculatorCard } from "@/components/calculator-card";
import { CalculatorSearch } from "@/components/calculator-search";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { categories, calculators, implementedCount, searchIndex } from "@/lib/calculators/registry";

const POPULAR = [
  "percentage-change",
  "bmi",
  "heat-index",
  "wind-chill",
  "compound-interest",
  "length-converter",
];

const PRINCIPLES = [
  {
    title: "The formula is on the page",
    body: "Every calculator shows its equation, defines each variable and works through an example you can check by hand. No black boxes.",
  },
  {
    title: "Sources are cited",
    body: "Weather tools cite the National Weather Service. BMI uses CDC categories. Unit conversions use exact NIST definitions.",
  },
  {
    title: "Limits are stated",
    body: "Where a formula only holds inside a range — wind chill above 3 mph, BMI for adults — the tool says so instead of guessing.",
  },
  {
    title: "Your numbers stay local",
    body: "The arithmetic runs in your browser. Inputs are never uploaded, logged or attached to an account.",
  },
];

export default function HomePage() {
  const popular = POPULAR.map((slug) => calculators.find((calculator) => calculator.slug === slug)).filter(
    (calculator): calculator is NonNullable<typeof calculator> => calculator !== undefined,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0" />
        <div className="relative py-16 sm:py-24">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-ink">
            <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-accent" />
            {implementedCount} calculators · every formula documented
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Calculators that
            <span className="text-accent"> show their working</span>.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Percentages, health screening, weather, units and money. Each tool explains the maths,
            cites its source and tells you when the answer stops being valid.
          </p>

          <div className="mt-8 max-w-2xl">
            <CalculatorSearch
              entries={searchIndex}
              variant="hero"
              placeholder={`Search ${implementedCount} calculators — try “percentage”, “BMI” or “wind”`}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Popular:</span>
            {popular.slice(0, 4).map((calculator) => (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft transition-colors hover:border-accent/50 hover:text-accent-ink"
              >
                {calculator.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular calculators */}
      <section aria-labelledby="popular-heading" className="py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="popular-heading" className="text-2xl font-semibold tracking-tight text-ink">
              Start with the common ones
            </h2>
            <p className="mt-1.5 text-sm text-muted">The calculators people reach for most often.</p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-ink hover:underline"
          >
            All {implementedCount} calculators
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((calculator) => (
            <li key={calculator.slug}>
              <CalculatorCard calculator={calculator} />
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="border-t border-line py-14">
        <h2 id="categories-heading" className="text-2xl font-semibold tracking-tight text-ink">
          Browse by category
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Categories appear here only once they contain a working calculator.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="group flex h-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/60"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">{category.name}</span>
                  <span className="tnum rounded-full bg-paper-deep px-2 py-0.5 text-xs font-semibold text-muted">
                    {category.calculators.length}
                  </span>
                </span>
                <span className="mt-1.5 text-sm leading-relaxed text-muted">{category.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Method */}
      <section aria-labelledby="method-heading" className="border-t border-line py-14">
        <h2 id="method-heading" className="text-2xl font-semibold tracking-tight text-ink">
          Built to be checked
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">
          A calculator is only useful if you can trust the number it produces. These are the rules every
          tool on this site follows.
        </p>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <li key={principle.title} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="flex items-center gap-2 font-medium text-ink">
                <CheckIcon className="size-4 text-positive" />
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted">
          Read the full{" "}
          <Link href="/about" className="text-accent-ink underline underline-offset-2">
            verification method
          </Link>{" "}
          or the{" "}
          <Link href="/calculators" className="text-accent-ink underline underline-offset-2">
            complete list of implemented calculators
          </Link>
          .
        </p>
      </section>
    </>
  );
}
