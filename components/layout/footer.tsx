import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-neutral-900 dark:text-neutral-50"
            >
              <span className="text-brand-600 dark:text-brand-400">Calc</span>ulators
            </Link>
            <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
              Verified, privacy-first calculators. All calculations run in your
              browser — nothing is sent to a server.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Calculators
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/calculators" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Legal &amp; policy
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              More
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <a
                  href="https://github.com/JUBERSALEEM/Calculators"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-600 dark:hover:text-brand-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-neutral-200 dark:border-neutral-800" />

        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          &copy; {new Date().getFullYear()} Calculators. Not medical, legal, financial, or
          engineering advice. See individual calculator pages for assumptions and sources.
        </p>
      </div>
    </footer>
  );
}
