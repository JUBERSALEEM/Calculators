import { it, expect } from "vitest";
import { CALCULATORS, getCategories } from "./registry";
import { CATALOG_TOTAL, CATALOG_CATEGORY_COUNT } from "./catalog-counts";

it("catalog-counts constants match the registry", () => {
  expect(CALCULATORS.length).toBe(CATALOG_TOTAL);
  expect(getCategories().length).toBe(CATALOG_CATEGORY_COUNT);
});
