import Link from "next/link";

import { Logo } from "@/components/icons";
import { categories, implementedCount } from "@/lib/calculators/registry";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-deep">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo className="size-6 text-accent" />
            <span className="font-semibold tracking-tight">Calculators</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {implementedCount} working calculators. Every formula is documented, every assumption is
            stated, and the arithmetic runs in your browser — no account, no upload.
          </p>
        </div>

        <nav aria-label="Categories">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Categories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`} className="text-ink-soft hover:text-accent-ink hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Site">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Site</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/calculators" className="text-ink-soft hover:text-accent-ink hover:underline">All calculators</Link></li>
            <li><Link href="/about" className="text-ink-soft hover:text-accent-ink hover:underline">About &amp; method</Link></li>
            <li><Link href="/privacy" className="text-ink-soft hover:text-accent-ink hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="text-ink-soft hover:text-accent-ink hover:underline">Terms</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} Calculators. Calculations are for information only and are not professional advice.</p>
          <p className="tnum">Formulas documented · Sources cited · Runs offline</p>
        </div>
      </div>
    </footer>
  );
}
