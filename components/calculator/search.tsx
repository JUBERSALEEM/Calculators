"use client";

import { useState, useMemo, useRef } from "react";
import { CALCULATORS } from "@/calculators/registry";
import Link from "next/link";
import { cn } from "@/components/lib/cn";

const INDEX = CALCULATORS.map((c) => ({
  slug: c.slug,
  name: c.name,
  categoryLabel: c.categoryLabel,
  haystack: `${c.name} ${c.slug} ${c.categoryLabel}`.toLowerCase(),
}));

export function CalculatorSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return INDEX.filter((c) => c.haystack.includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search 1,248 calculators…"
        onFocus={() => {
          if (blurTimer.current) clearTimeout(blurTimer.current);
          setFocused(true);
        }}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setFocused(false), 150);
        }}
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
      {focused && query.trim().length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-calc-lg overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">No matching calculator.</p>
          ) : (
            results.map((c) => (
              <Link
                key={c.slug}
                href={`/calculators/${c.slug}`}
                className="block px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
              >
                <span className="block font-medium text-neutral-900 dark:text-neutral-50">{c.name}</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">{c.categoryLabel}</span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
