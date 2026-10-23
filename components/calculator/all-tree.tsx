"use client";

import * as React from "react";
import Link from "next/link";

export interface TreeItem {
  slug: string;
  name: string;
  formulaStatus: "SOURCE_VERIFIED" | "RESEARCH_REQUIRED" | "SPECIALIST_REVIEW_REQUIRED";
}

export interface TreeCategory {
  code: string;
  slug: string;
  label: string;
  items: TreeItem[];
}

export interface TreeGroup {
  id: number;
  label: string;
  categories: TreeCategory[];
}

interface Props {
  groups: TreeGroup[];
}

const STATUS_TAG: Record<TreeItem["formulaStatus"], string | null> = {
  SOURCE_VERIFIED: "Source-verified",
  RESEARCH_REQUIRED: null,
  SPECIALIST_REVIEW_REQUIRED: "Specialist review",
};

export function AllCalculatorsTree({ groups }: Props) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState<Set<string>>(() => new Set());

  const q = query.trim().toLowerCase();
  const matches = (it: TreeItem) => !q || it.name.toLowerCase().includes(q) || it.slug.includes(q);

  // While searching, every category with a match is shown open so results are visible.
  const isOpen = (code: string) => (q ? true : open.has(code));

  const toggle = (code: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });

  const expandAll = () => setOpen(new Set(groups.flatMap((g) => g.categories.map((c) => c.code))));
  const collapseAll = () => setOpen(new Set());

  const totalShown = groups.reduce(
    (n, g) => n + g.categories.reduce((m, c) => m + c.items.filter(matches).length, 0),
    0,
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-end mb-6">
        <div className="flex-1">
          <label htmlFor="tree-search" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Filter by name
          </label>
          <input
            id="tree-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter, e.g. “loan”, “BMI”, “concrete”"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-calc border border-neutral-300 dark:border-neutral-700 px-4 py-3 text-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-brand-600 outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-outline" onClick={expandAll}>
            Expand all
          </button>
          <button type="button" className="btn-outline" onClick={collapseAll}>
            Collapse all
          </button>
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6" role="status" aria-live="polite">
        {q
          ? `${totalShown.toLocaleString("en-US")} matching calculator${totalShown === 1 ? "" : "s"}`
          : "Expand a category to see its calculators."}
      </p>

      <div className="space-y-10">
        {groups.map((g) => {
          const visibleCats = g.categories.filter((c) => c.items.some(matches));
          if (visibleCats.length === 0) return null;
          return (
            <section key={g.id} aria-labelledby={`group-${g.id}`}>
              <h2 id={`group-${g.id}`} className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
                {g.label}
              </h2>
              <ul className="space-y-2">
                {visibleCats.map((c) => {
                  const items = c.items.filter(matches);
                  const expanded = isOpen(c.code);
                  const panelId = `cat-${c.code}`;
                  return (
                    <li
                      key={c.code}
                      className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                    >
                      <h3>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={panelId}
                          onClick={() => toggle(c.code)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/60 rounded-calc"
                        >
                          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            <span className="text-neutral-400 dark:text-neutral-500 mr-2">{c.code}</span>
                            {c.label}
                          </span>
                          <span className="flex items-center gap-3 shrink-0">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {items.length}
                              {q ? ` of ${c.items.length}` : ""}
                            </span>
                            <span aria-hidden="true" className="text-neutral-500">
                              {expanded ? "−" : "+"}
                            </span>
                          </span>
                        </button>
                      </h3>
                      {expanded && (
                        <div id={panelId} className="border-t border-neutral-200 dark:border-neutral-800 px-4 py-3">
                          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1.5">
                            {items.map((it) => {
                              const tag = STATUS_TAG[it.formulaStatus];
                              return (
                                <li key={it.slug} className="text-sm">
                                  <Link
                                    href={`/calculators/${it.slug}`}
                                    className="text-brand-700 dark:text-brand-400 hover:underline"
                                  >
                                    {it.name}
                                  </Link>
                                  {tag && (
                                    <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">({tag})</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
