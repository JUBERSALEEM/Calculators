import { describe, expect, it } from "vitest";

import {
  calculators,
  categories,
  categoryBySlug,
  getCalculator,
  implementedCount,
  runCalculator,
  searchIndex,
} from "@/lib/calculators/registry";
import { errored } from "@/lib/calculators/testing";

describe("calculator registry integrity", () => {
  it("has at least the five calculators promised for the first release", () => {
    expect(implementedCount).toBeGreaterThanOrEqual(5);
    expect(calculators).toHaveLength(implementedCount);
  });

  it("has unique slugs and unique catalogue IDs", () => {
    const slugs = calculators.map((calculator) => calculator.slug);
    const ids = calculators.map((calculator) => calculator.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses kebab-case slugs and CALC-nnnn catalogue IDs", () => {
    for (const calculator of calculators) {
      expect(calculator.slug, calculator.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(calculator.id, calculator.slug).toMatch(/^CALC-\d{4}$/);
    }
  });

  it("keeps page titles and meta descriptions inside a sensible length", () => {
    for (const calculator of calculators) {
      expect(calculator.title.length, `${calculator.slug} title`).toBeLessThanOrEqual(65);
      expect(calculator.description.length, `${calculator.slug} description`).toBeGreaterThanOrEqual(110);
      expect(calculator.description.length, `${calculator.slug} description`).toBeLessThanOrEqual(165);
      expect(calculator.summary.length, `${calculator.slug} summary`).toBeLessThanOrEqual(90);
    }
  });

  it("cites at least one https source per calculator", () => {
    for (const calculator of calculators) {
      expect(calculator.references.length, calculator.slug).toBeGreaterThan(0);
      for (const reference of calculator.references) {
        expect(reference.url, calculator.slug).toMatch(/^https:\/\//);
        expect(reference.label.length, calculator.slug).toBeGreaterThan(3);
      }
    }
  });

  it("documents a formula, assumptions and an example for every tool", () => {
    for (const calculator of calculators) {
      expect(calculator.formula.length, calculator.slug).toBeGreaterThan(0);
      expect(calculator.assumptions.length, calculator.slug).toBeGreaterThan(0);
      expect(calculator.explanation.length, calculator.slug).toBeGreaterThan(0);
      expect(calculator.fields.length, calculator.slug).toBeGreaterThan(0);
      expect(calculator.example, calculator.slug).toBeDefined();
    }
  });

  it("only cross-links to calculators that exist, never to itself", () => {
    for (const calculator of calculators) {
      for (const relatedSlug of calculator.related) {
        expect(relatedSlug, `${calculator.slug} → ${relatedSlug}`).not.toBe(calculator.slug);
        expect(getCalculator(relatedSlug), `${calculator.slug} → ${relatedSlug}`).toBeDefined();
      }
    }
  });

  it("derives categories that each contain at least one calculator", () => {
    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      expect(category.calculators.length, category.slug).toBeGreaterThan(0);
      expect(category.description.length, category.slug).toBeGreaterThan(20);
      expect(categoryBySlug.get(category.slug)).toBe(category);
    }
    const total = categories.reduce((sum, category) => sum + category.calculators.length, 0);
    expect(total).toBe(implementedCount);
  });

  it("gives every calculator a place in the search index", () => {
    expect(searchIndex).toHaveLength(implementedCount);
    for (const entry of searchIndex) {
      expect(entry.keywords.length).toBeGreaterThan(0);
      expect(entry.categoryName.length).toBeGreaterThan(0);
    }
  });

  it("returns validation errors, not exceptions, when every field is blank", () => {
    for (const calculator of calculators) {
      const raw = Object.fromEntries(calculator.fields.map((field) => [field.name, ""]));
      const outcome = runCalculator(calculator, raw);
      // Either the schema rejects the blanks, or the calculator reports its own
      // error. What must never happen is a thrown exception or a NaN result.
      if (!outcome.ok) {
        expect(Object.keys(outcome.errors).length, calculator.slug).toBeGreaterThan(0);
      } else {
        for (const output of outcome.outputs) {
          expect(output.value, calculator.slug).not.toMatch(/NaN|Infinity/);
        }
      }
    }
  });

  it("never emits NaN or Infinity for valid boundary input", () => {
    for (const calculator of calculators) {
      const raw: Record<string, string> = {};
      for (const field of calculator.fields) {
        if (field.kind === "number") raw[field.name] = String(field.min ?? 1);
        else if (field.kind === "select") raw[field.name] = field.defaultValue;
        else if (field.kind === "text") raw[field.name] = "";
      }
      const outcome = runCalculator(calculator, raw);
      if (outcome.ok) {
        for (const output of outcome.outputs) {
          expect(output.value, `${calculator.slug}: ${output.label}`).not.toMatch(/NaN|Infinity/);
        }
      } else {
        expect(Object.keys(outcome.errors).length, calculator.slug).toBeGreaterThan(0);
      }
    }
  });
});
