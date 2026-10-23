import { bmi } from "@/lib/calculators/definitions/bmi";
import { compoundInterest } from "@/lib/calculators/definitions/compound-interest";
import { heatIndex } from "@/lib/calculators/definitions/heat-index";
import { lengthConverter } from "@/lib/calculators/definitions/length-converter";
import { mean } from "@/lib/calculators/definitions/mean";
import { percentageChange } from "@/lib/calculators/definitions/percentage-change";
import { percentageDifference } from "@/lib/calculators/definitions/percentage-difference";
import { percentageOfANumber } from "@/lib/calculators/definitions/percentage-of-a-number";
import { percentagePointChange } from "@/lib/calculators/definitions/percentage-point-change";
import { temperatureConverter } from "@/lib/calculators/definitions/temperature-converter";
import { varianceStdDev } from "@/lib/calculators/definitions/variance-stddev";
import { windChill } from "@/lib/calculators/definitions/wind-chill";
import { validateInputs } from "@/lib/calculators/validation";
import type { CalcOutcome, CalcValues, Calculator } from "@/lib/calculators/types";

/**
 * The implemented catalogue.
 *
 * Only calculators that have a working, tested implementation belong here.
 * The full plan of 1,248 entries lives in docs/project-plan/catalog.csv; an
 * entry is added to this registry only when it has:
 *   1. a verified formula (see `verification` on each definition),
 *   2. input validation and explicit invalid-input behaviour,
 *   3. unit tests with independently checked expected values,
 *   4. prose explaining the formula, assumptions and limitations.
 */
export const calculators: readonly Calculator[] = [
  percentageOfANumber,
  percentageChange,
  percentageDifference,
  percentagePointChange,
  mean,
  varianceStdDev,
  compoundInterest,
  bmi,
  heatIndex,
  windChill,
  lengthConverter,
  temperatureConverter,
].sort((a, b) => a.name.localeCompare(b.name));

export const calculatorBySlug = new Map(calculators.map((calculator) => [calculator.slug, calculator]));

export function getCalculator(slug: string): Calculator | undefined {
  return calculatorBySlug.get(slug);
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  calculators: Calculator[];
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "basic-arithmetic": "Percentages, proportions and everyday number work, with the arithmetic shown.",
  statistics: "Averages and descriptive statistics, with the inputs summarised so results can be checked.",
  money: "Interest, growth and time-value calculations for savings and borrowing.",
  weather: "Apparent temperature tools based on the published US National Weather Service formulae.",
  health: "Screening and measurement tools, presented with their clinical limitations in view.",
  "unit-conversion": "Measurement conversions built on exact SI and NIST definitions.",
};

/** Categories are derived from the implemented calculators, so a category page
 *  can never exist without at least one working tool behind it. */
export const categories: readonly Category[] = Array.from(
  calculators.reduce((map, calculator) => {
    const existing = map.get(calculator.category.slug);
    if (existing) {
      existing.calculators.push(calculator);
    } else {
      map.set(calculator.category.slug, { ...calculator.category, description: "", calculators: [calculator] });
    }
    return map;
  }, new Map<string, Category>()),
)
  .map(([, category]) => ({
    ...category,
    description: CATEGORY_DESCRIPTIONS[category.slug] ?? "",
    calculators: [...category.calculators].sort((a, b) => a.name.localeCompare(b.name)),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug);
}

/** Lightweight index for client-side search; no network request is involved. */
export interface SearchEntry {
  slug: string;
  name: string;
  summary: string;
  categoryName: string;
  categorySlug: string;
  keywords: string[];
}

export const searchIndex: readonly SearchEntry[] = calculators.map((calculator) => ({
  slug: calculator.slug,
  name: calculator.name,
  summary: calculator.summary,
  categoryName: calculator.category.name,
  categorySlug: calculator.category.slug,
  keywords: calculator.keywords,
}));

/**
 * Validate raw form values and run the calculation.
 * Returns field-keyed errors instead of throwing, so the UI can render them.
 */
export function runCalculator(calculator: Calculator, raw: Record<string, string>): CalcOutcome {
  const validated = validateInputs(calculator.fields, raw);
  if (!validated.ok) return { ok: false, errors: validated.errors };

  try {
    return calculator.compute(validated.values as CalcValues);
  } catch {
    // A throwing calculator is a defect, not a user error. Fail closed and
    // keep the message generic rather than leaking an internal stack.
    return { ok: false, errors: { form: "This calculation could not be completed. Please check your inputs." } };
  }
}

export const implementedCount = calculators.length;
