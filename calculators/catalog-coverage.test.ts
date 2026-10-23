import { describe, it, expect } from "vitest";
import { CATALOG_ENTRIES } from "./catalog-data";
import { EXPANSION_ENTRIES } from "./expansion/catalog-expansion";
import { ALL_SPECS } from "./specs-all";

// Guards the catalog: every catalog slug has exactly one executable spec, and no spec exists without a catalog entry.
const ALL_CATALOG = [...CATALOG_ENTRIES, ...EXPANSION_ENTRIES];

describe("catalog ↔ spec coverage", () => {
  it("has the planned 1,248 entries plus the expansion entries", () => {
    expect(CATALOG_ENTRIES).toHaveLength(1248);
    expect(EXPANSION_ENTRIES.length).toBeGreaterThan(0);
    expect(ALL_CATALOG).toHaveLength(1248 + EXPANSION_ENTRIES.length);
  });

  it("has one spec per catalog entry", () => {
    expect(ALL_SPECS).toHaveLength(ALL_CATALOG.length);
  });

  it("has no duplicate catalog slugs, ids or spec slugs", () => {
    expect(new Set(ALL_CATALOG.map((e) => e.slug)).size).toBe(ALL_CATALOG.length);
    expect(new Set(ALL_CATALOG.map((e) => e.id)).size).toBe(ALL_CATALOG.length);
    expect(new Set(ALL_SPECS.map((s) => s.slug)).size).toBe(ALL_SPECS.length);
  });

  it("maps every catalog slug to a spec and vice versa", () => {
    const specSlugs = new Set(ALL_SPECS.map((s) => s.slug));
    const catalogSlugs = new Set(ALL_CATALOG.map((e) => e.slug));
    expect([...catalogSlugs].filter((s) => !specSlugs.has(s))).toEqual([]);
    expect([...specSlugs].filter((s) => !catalogSlugs.has(s))).toEqual([]);
  });

  it("every related link points to a calculator that exists", () => {
    const slugs = new Set(ALL_CATALOG.map((e) => e.slug));
    const broken = ALL_CATALOG.flatMap((e) => e.related.filter((r) => !slugs.has(r)).map((r) => `${e.slug} → ${r}`));
    expect(broken).toEqual([]);
  });
});
