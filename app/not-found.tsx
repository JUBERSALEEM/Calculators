import Link from "next/link";

import { SearchIcon } from "@/components/icons";
import { calculators } from "@/lib/calculators/registry";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-24 text-center">
      <p className="tnum text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        That page doesn&rsquo;t exist
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
        The calculator may have been renamed, or the link may be mistyped. Everything currently published is
        listed in the directory.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/calculators"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          <SearchIcon className="size-4" />
          Browse all calculators
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-line-strong hover:text-ink"
        >
          Go to the homepage
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Popular calculators</p>
        <ul className="mt-3 flex flex-wrap justify-center gap-2">
          {calculators.slice(0, 6).map((calculator) => (
            <li key={calculator.slug}>
              <Link
                href={`/calculators/${calculator.slug}`}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-soft hover:border-accent/60 hover:text-accent-ink"
              >
                {calculator.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
