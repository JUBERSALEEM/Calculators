import { describe, expect, it } from "vitest";

import { searchCalculators } from "@/lib/search";
import { calculators, searchIndex } from "@/lib/calculators/registry";

const names = (results: { name: string }[]) => results.map((result) => result.name);

describe("searchCalculators", () => {
  it("returns nothing for an empty query unless directory mode is on", () => {
    expect(searchCalculators(searchIndex, "")).toEqual([]);
    expect(searchCalculators(searchIndex, "   ")).toEqual([]);
    expect(searchCalculators(searchIndex, "", { alwaysList: true })).toHaveLength(calculators.length);
  });

  it("finds a calculator by name, case-insensitively", () => {
    expect(names(searchCalculators(searchIndex, "bMi"))).toEqual(["BMI Calculator"]);
    expect(names(searchCalculators(searchIndex, "wind"))).toContain("Wind Chill Calculator");
  });

  it("ranks a name match above a keyword or summary match", () => {
    const results = searchCalculators(searchIndex, "percentage");
    expect(results.length).toBeGreaterThan(1);
    // Every percentage tool starts with "Percentage", so they lead the results.
    expect(results[0]?.name.toLowerCase().startsWith("percentage")).toBe(true);
  });

  it("matches synonyms that are keywords but not in the name", () => {
    const results = names(searchCalculators(searchIndex, "celsius"));
    expect(results).toContain("Temperature Converter");
  });

  it("matches a category name", () => {
    const results = searchCalculators(searchIndex, "weather");
    expect(results.every((result) => result.categoryName === "Weather & Climate")).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns an empty list, not an error, for gibberish", () => {
    expect(searchCalculators(searchIndex, "zzzqqq")).toEqual([]);
  });

  it("does not mutate the index it is given", () => {
    const before = searchIndex.map((entry) => entry.slug);
    searchCalculators(searchIndex, "a", { alwaysList: true });
    expect(searchIndex.map((entry) => entry.slug)).toEqual(before);
  });
});
