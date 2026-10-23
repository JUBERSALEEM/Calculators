"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";
import type { SearchEntry } from "@/lib/calculators/registry";
import { searchCalculators } from "@/lib/search";

interface Props {
  entries: readonly SearchEntry[];
  /** "hero" renders the large homepage field; "inline" the directory filter. */
  variant?: "hero" | "inline";
  placeholder?: string;
  /** When true the full result list is always shown (directory mode). */
  alwaysList?: boolean;
}

export function CalculatorSearch({ entries, variant = "inline", placeholder, alwaysList = false }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listId = useId();
  const normalized = query.trim().toLowerCase();

  const results = useMemo(
    () => searchCalculators(entries, query, { alwaysList }),
    [entries, query, alwaysList],
  );

  const showList = alwaysList || (focused && normalized !== "");
  const hero = variant === "hero";

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const first = results[0];
    if (first) router.push(`/calculators/${first.slug}`);
  }

  return (
    <div className={hero ? "w-full" : "w-full max-w-md"}>
      <form role="search" onSubmit={onSubmit} className="w-full">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search calculators
        </label>
        <div
          className={[
            "flex items-center gap-3 rounded-xl border bg-surface shadow-[var(--shadow)] transition-colors",
            hero ? "px-4 py-3.5" : "px-3 py-2",
            focused ? "border-accent" : "border-line hover:border-line-strong",
          ].join(" ")}
        >
          <SearchIcon className={hero ? "size-5 shrink-0 text-muted" : "size-4 shrink-0 text-muted"} />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              // Delay so a click on a result still registers.
              window.setTimeout(() => setFocused(false), 150);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setQuery("");
            }}
            placeholder={placeholder ?? (hero ? "Search 11 calculators — try “percentage” or “BMI”" : "Filter calculators…")}
            autoComplete="off"
            aria-controls={listId}
            aria-describedby={`${listId}-status`}
            className={[
              "w-full bg-transparent text-ink placeholder:text-muted focus:outline-none",
              hero ? "text-base sm:text-lg" : "text-sm",
            ].join(" ")}
            data-testid="calculator-search-input"
          />
          {query !== "" && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="rounded px-1.5 py-0.5 text-xs font-medium text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <p id={`${listId}-status`} aria-live="polite" className="sr-only">
        {normalized === ""
          ? `${entries.length} calculators available.`
          : `${results.length} ${results.length === 1 ? "calculator" : "calculators"} match “${query.trim()}”.`}
      </p>

      {showList && (
        <div
          id={listId}
          className={[
            "mt-2 overflow-hidden rounded-xl border border-line bg-surface",
            hero ? "shadow-[var(--shadow)]" : "",
          ].join(" ")}
          data-testid="search-results"
        >
          {results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted">
              <p className="font-medium text-ink">No calculators match “{query.trim()}”.</p>
              <p className="mt-1">
                Try a broader term, or{" "}
                <Link href="/calculators" className="text-accent-ink underline underline-offset-2">
                  browse the full directory
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="max-h-96 divide-y divide-line overflow-y-auto">
              {results.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/calculators/${entry.slug}`}
                    className="flex items-baseline justify-between gap-4 px-4 py-3 hover:bg-paper-deep"
                  >
                    <span>
                      <span className="block text-sm font-medium text-ink">{entry.name}</span>
                      <span className="mt-0.5 block text-xs text-muted">{entry.summary}</span>
                    </span>
                    <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-wider text-muted">
                      {entry.categoryName.split("&")[0]?.trim()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
