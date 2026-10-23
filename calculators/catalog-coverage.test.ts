import { describe, it, expect } from "vitest";
import { CATALOG_ENTRIES } from "./catalog-data";
import { ALL_SPECS } from "./specs-all";

// Guards the 1,248-entry catalog: every catalog slug has exactly one executable spec,
// and no spec exists without a catalog entry.
describe("catalog ↔ spec coverage", () => {
  it("has one spec per catalog entry (1,248)", () => {
    expect(CATALOG_ENTRIES).toHaveLength(1248);
    expect(ALL_SPECS).toHaveLength(1248);
  });

  it("has no duplicate catalog slugs or spec slugs", () => {
    expect(new Set(CATALOG_ENTRIES.map((e) => e.slug)).size).toBe(CATALOG_ENTRIES.length);
    expect(new Set(ALL_SPECS.map((s) => s.slug)).size).toBe(ALL_SPECS.length);
  });

  it("maps every catalog slug to a spec and vice versa", () => {
    const specSlugs = new Set(ALL_SPECS.map((s) => s.slug));
    const catalogSlugs = new Set(CATALOG_ENTRIES.map((e) => e.slug));
    expect([...catalogSlugs].filter((s) => !specSlugs.has(s))).toEqual([]);
    expect([...specSlugs].filter((s) => !catalogSlugs.has(s))).toEqual([]);
  });
});
