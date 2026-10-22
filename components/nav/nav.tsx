"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCalculator, getCalculatorSlugs, getCategories } from "@/calculators/registry";
import { cn } from "@/components/lib/cn";

export function Nav() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  useTheme();
  const slugs = getCalculatorSlugs();
  const categories = getCategories();

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-neutral-900 dark:text-neutral-50"
          >
            <span className="text-brand-600 dark:text-brand-400">Calc</span>ulators
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="calc-menu"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-calc text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <span className="sr-only">Open menu</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        id="calc-menu"
        className={cn(
          "md:hidden bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-300",
          menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search calculators…"
              className="w-full rounded-calc border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-600 outline-none bg-white dark:bg-neutral-900"
              aria-label="Search calculators"
            />
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-6 mb-2">
            Browse by category
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={closeMenu}
                className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                {cat.label} <span className="text-neutral-400">({cat.count})</span>
              </button>
            ))}
          </div>

          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-6 mb-2">
            Quick links
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {slugs.slice(0, 8).map((s) => {
              const meta = getCalculator(s);
              return (
                <Link
                  key={s}
                  href={`/calculators/${s}`}
                  onClick={closeMenu}
                  className="text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {meta?.name || s}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
