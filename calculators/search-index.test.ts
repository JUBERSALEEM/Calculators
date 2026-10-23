import { describe, expect, it } from "vitest";
import { ALL_ENTRIES } from "./registry";
import { SEARCH_INDEX } from "./search-index";

describe("client search index", () => {
  it("covers every calculator with the same name and category as the registry", () => {
    const byIndex = new Map(SEARCH_INDEX.map((r) => [r.slug, r]));
    expect(SEARCH_INDEX.length).toBe(ALL_ENTRIES.length);
    const drift = ALL_ENTRIES.filter((e) => {
      const r = byIndex.get(e.slug);
      return !r || r.name !== e.name || r.categoryLabel !== e.categoryLabel;
    }).map((e) => e.slug);
    expect(drift).toEqual([]);
  });
});
