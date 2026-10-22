"use client";

import { useState, useMemo } from "react";
import { getCalculator, getCalculatorSlugs } from "@/calculators/registry";
import Link from "next/link";
import { cn } from "@/components/lib/cn";

export function CalculatorSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return getCalculatorSlugs()
      .map((s) => getCalculator(s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search calculators…"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          "w-full rounded-calc border border-neutral-300 dark:border-neutral-700 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500 dark:placeholder:text-neutral-600",
          "bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-brand-600 outline-none transition-colors",
          focused && "shadow-calc-lg"
        )}
        aria-label="Search calculators"
        autoComplete="off"
        spellCheck="false"
      />
      {focused && query.length > 0 && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-calc-lg">
          {results.map((c) => (
            <Link
              key={c.slug}
              href={`/calculators/${c.slug}`}
              className="block px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              <div className="font-medium text-neutral-900 dark:text-neutral-50">{c.name}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {c.categoryLabel}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
