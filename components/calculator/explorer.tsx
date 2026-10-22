"use client";

import * as React from "react";
import Link from "next/link";

export interface ExplorerItem {
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  status: string;
}

interface Props {
  items: ExplorerItem[];
  categories: Array<{ slug: string; code: string; label: string; count: number }>;
}

const PAGE = 60;

export function CalculatorExplorer({ items, categories }: Props) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [visible, setVisible] = React.useState(PAGE);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (category !== "all" && it.category !== category) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.slug.includes(q) ||
        it.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [items, query, category]);

  React.useEffect(() => {
    setVisible(PAGE);
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
        <div className="flex-1">
          <label htmlFor="calc-search" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Search {items.length.toLocaleString("en-US")} calculators
          </label>
          <input
            id="calc-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “mortgage”, “BMI”, “concrete”, “odds”…"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-calc border border-neutral-300 dark:border-neutral-700 px-4 py-3 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
        <div className="md:w-72">
          <label htmlFor="calc-category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Category
          </label>
          <select
            id="calc-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-calc border border-neutral-300 dark:border-neutral-700 px-3 py-3 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-brand-600 outline-none"
          >
            <option value="all">All categories ({items.length.toLocaleString("en-US")})</option>
            {categories.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label} ({c.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4" role="status" aria-live="polite">
        {filtered.length.toLocaleString("en-US")} matching calculator{filtered.length === 1 ? "" : "s"}
        {filtered.length > visible ? ` — showing the first ${visible}` : ""}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.slice(0, visible).map((it) => (
          <li key={it.slug}>
            <Link
              href={`/calculators/${it.slug}`}
              className="block h-full rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-calc transition-colors"
            >
              <span className="block font-medium text-neutral-900 dark:text-neutral-50 text-sm">{it.name}</span>
              <span className="mt-1 block text-xs text-neutral-500 dark:text-neutral-400">{it.categoryLabel}</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No calculators match that search. Try a different term or category.
        </p>
      )}

      {filtered.length > visible && (
        <div className="mt-6 text-center">
          <button type="button" className="btn-outline" onClick={() => setVisible((v) => v + PAGE * 2)}>
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
