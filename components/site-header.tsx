import Link from "next/link";

import { Logo } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { categories } from "@/lib/calculators/registry";

const nav = [
  { href: "/calculators", label: "All calculators" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-[2px]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md font-semibold tracking-tight text-ink"
          aria-label="Calculators — home"
        >
          <Logo className="size-7 text-accent" />
          <span className="text-[1.05rem]">Calculators</span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/calculators"
            className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
          >
            <span aria-hidden="true" className="text-xs">Find a calculator</span>
            <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">/</kbd>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Secondary navigation: horizontal scroll on small screens, no hamburger needed. */}
      <div className="border-t border-line md:hidden">
        <nav aria-label="Mobile" className="-mb-px flex gap-1 overflow-x-auto px-3 py-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-paper-deep hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          {categories.slice(0, 2).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted hover:bg-paper-deep hover:text-ink"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
