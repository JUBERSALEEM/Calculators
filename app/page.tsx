import { CalculatorMeta } from "@/calculators/registry";
import { CALCULATORS, getCalculatorSlugs } from "@/calculators/registry";
import { CalculatorSearch } from "@/components/calculator/search";
import { CalculatorCard } from "@/components/calculator/calculator-card";
import Link from "next/link";

export const metadata = {
  title: "Calculators — verified, privacy-first online calculators",
  description:
    "Working calculators you can trust. Percentage change, BMI, wind chill, heat index, " +
    "length conversion and more — formulas verified against authoritative sources. All " +
    "calculations run in your browser.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Calculators — verified, privacy-first online calculators",
    description:
      "Working calculators you can trust. All formulas verified against authoritative sources.",
  },
};

const FEATURED_SLUGS = [
  "percentage-change",
  "bmi",
  "heat-index",
  "wind-chill",
  "length-converter",
  "arithmetic-mean",
];

function Featured() {
  const featured = getCalculatorSlugs()
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is CalculatorMeta => !!c && FEATURED_SLUGS.includes(c.slug))
    .sort(
      (a, b) => FEATURED_SLUGS.indexOf(a.slug) - FEATURED_SLUGS.indexOf(b.slug)
    );

  return (
    <section className="py-10 border-b border-neutral-200 dark:border-neutral-800">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              Featured calculators
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Start here with our most-used verified tools.
            </p>
          </div>
          <Link
            href="/calculators"
            className="btn-outline"
          >
            View all calculators
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((calc) => (
            <CalculatorCard key={calc.slug} calc={calc} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-10 bg-neutral-100 dark:bg-neutral-900/40">
      <div className="container-page">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
          How it works
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="p-5 rounded-calc bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Pick a tool
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Browse the directory or search for the calculator you need.
            </p>
          </li>
          <li className="p-5 rounded-calc bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Enter values
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Fill in the inputs with units shown. Invalid entries are rejected with a clear
              message — never silently coerced.
            </p>
          </li>
          <li className="p-5 rounded-calc bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
              Get your result
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Results update instantly in your browser. Every formula is explained with its
              source and limitations.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="container-page">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-balance text-neutral-900 dark:text-neutral-50 mb-6">
          Calculators you can verify
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
          Working calculators with formulas checked against authoritative sources — NIST,
          NOAA/NWS, CDC, and more. Every calculation runs in your browser; nothing is sent to
          a server.
        </p>
        <CalculatorSearch />
      </div>

      <Featured />

      <HowItWorks />
    </div>
  );
}
