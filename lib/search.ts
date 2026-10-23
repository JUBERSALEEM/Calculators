/**
 * Client-side calculator search.
 *
 * Pure functions so the ranking is unit-tested rather than hidden inside a
 * component. Search never leaves the browser and never touches the network.
 */

export interface Searchable {
  slug: string;
  name: string;
  summary: string;
  categoryName: string;
  keywords: string[];
}

const SCORE = {
  nameStartsWith: 100,
  nameContains: 80,
  keyword: 60,
  category: 40,
  summary: 20,
} as const;

function scoreEntry(entry: Searchable, query: string): number {
  const name = entry.name.toLowerCase();
  if (name.startsWith(query)) return SCORE.nameStartsWith;
  if (name.includes(query)) return SCORE.nameContains;
  if (entry.keywords.some((keyword) => keyword.toLowerCase().includes(query))) return SCORE.keyword;
  if (entry.categoryName.toLowerCase().includes(query)) return SCORE.category;
  if (entry.summary.toLowerCase().includes(query)) return SCORE.summary;
  return 0;
}

/**
 * Rank entries against a query.
 * With `alwaysList`, an empty query returns everything (directory mode);
 * otherwise it returns nothing, so a search box does not dump the catalogue
 * on focus.
 */
export function searchCalculators<T extends Searchable>(
  entries: readonly T[],
  rawQuery: string,
  options: { alwaysList?: boolean } = {},
): T[] {
  const query = rawQuery.trim().toLowerCase();
  if (query === "") return options.alwaysList ? [...entries] : [];

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .map((hit) => hit.entry);
}
