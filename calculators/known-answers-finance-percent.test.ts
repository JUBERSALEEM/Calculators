import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";

/**
 * Known-answer tests for finance and percentage calculators at their default inputs.
 * Expected values were computed independently in Python from the textbook formulas
 * (not by reading the implementation). Tolerance = half the last displayed digit.
 */
const ROWS: [slug: string, label: string, expected: number, tolerance: number][] = [
  ["simple-interest", "Simple interest earned", 1800.0, 0.500000001],
  ["simple-interest", "Maturity total", 11800.0, 0.500000001],
  ["compound-interest", "Future value (FV)", 20096.61376695633, 0.0050000010000000004],
  ["continuous-compounding", "Future value", 13498.588075760032, 0.0050000010000000004],
  ["continuous-compounding", "Effective annual yield", 6.183654654535964, 5.0001000000000005e-05],
  ["effective-annual-rate", "Effective Annual Rate (EAR / APY)", 12.682503013196978, 5.0001000000000005e-05],
  ["future-value-lumpsum", "Future value (FV)", 12590.850584094902, 0.0050000010000000004],
  ["present-value-lumpsum", "Present value (PV)", 5083.492921347176, 0.0050000010000000004],
  ["annuity-future-value", "Ordinary annuity FV", 81939.673403229, 0.0050000010000000004],
  ["annuity-present-value", "Ordinary annuity PV", 51725.560751130964, 0.0050000010000000004],
  ["annuity-payment", "Periodic payment (PMT)", 966.6400764714137, 0.0050000010000000004],
  ["loan-payment", "Monthly payment", 489.1537054682168, 0.0050000010000000004],
  ["mortgage-payment", "Monthly Principal & Interest", 2212.2380822253785, 0.0050000010000000004],
  ["cagr", "Compound Annual Growth Rate", 10.1480502409091, 5.0001000000000005e-05],
  ["doubling-time", "Exact doubling time", 9.006468342000588, 5.0001000000000005e-05],
  ["roi", "Return on Investment (ROI)", 34.0, 0.500000001],
  ["holding-period-return", "Holding Period Return (HPR)", 22.5, 0.050000001],
  ["annualized-return", "Compound annualised return", 11.200091216860987, 5.0001000000000005e-05],
  ["npv", "Net Present Value (NPV)", 259.20360631104313, 0.050000001],
  ["irr", "Internal Rate of Return (IRR)", 11.390449729133756, 5.0001000000000005e-05],
  ["perpetuity-present-value", "Perpetuity present value", 50000.0, 0.500000001],
  ["bond-price", "Bond clean price", 925.6126256977221, 0.0050000010000000004],
  ["bond-price", "PV of coupons", 371.9368715113876, 0.0050000010000000004],
  ["bond-price", "PV of principal", 553.6757541863345, 0.0050000010000000004],
  ["current-yield", "Current yield", 5.208333333333334, 0.000500001],
  ["capm", "CAPM required return", 11.149999999999999, 0.0050000010000000004],
  ["gordon-growth", "Intrinsic share value P₀", 50.00000000000001, 0.500000001],
  ["wacc", "WACC", 8.771999999999998, 0.000500001],
  ["percentage-of-a-number", "Portion", 45.0, 0.500000001],
  ["percentage-change", "Percentage change", 20.0, 0.500000001],
  ["percentage-difference", "Symmetric difference", 18.181818181818183, 0.0050000010000000004],
  ["percentage-difference", "Arithmetic mean", 110, 0.500000001],
  ["percentage-point-change", "Percentage point change", 2.5, 0.050000001],
  ["percentage-point-change", "Relative % change", 20.0, 0.500000001],
  ["reverse-percentage", "Original value", 100.0, 0.500000001],
  ["reverse-percentage", "Change amount", 18.0, 0.500000001],
  ["add-percentage", "Increased value", 229.99999999999997, 0.500000001],
  ["add-percentage", "Added amount", 30.0, 0.500000001],
  ["subtract-percentage", "Reduced value", 160.0, 0.500000001],
  ["subtract-percentage", "Subtracted amount", 40.0, 0.500000001],
  ["successive-percentage-change", "Net cumulative change", 23.750000000000004, 0.0050000010000000004],
  ["successive-percentage-change", "Cumulative multiplier", 1.2375, 5.0001000000000005e-05],
  ["percent-error", "Absolute percent error", 0.44204697832593415, 0.000500001],
  ["percent-of-total", "Share of total", 25.0, 0.500000001],
  ["percent-of-total", "Remainder share", 75.0, 0.500000001],
  ["percent-of-percent", "Portion of base", 100.0, 0.500000001],
  ["percent-of-percent", "Combined percentage", 10.0, 0.500000001],
  ["recover-loss-gain", "Gain required to break even", 33.33333333333333, 0.0050000010000000004],
  ["arithmetic-mean", "Arithmetic mean", 24, 0.500000001],
  ["arithmetic-mean", "Sum", 120, 0.500000001],
  ["arithmetic-mean", "Count (n)", 5, 0.500000001],
];

function outputs(slug: string) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const out = validateAndRun(spec, getDefaultRawInputs(spec));
  if (!out.calcResult || !out.calcResult.ok) throw new Error(`${slug}: did not compute`);
  return out.calcResult.value.outputs;
}

describe("finance & percentage known-answer values", () => {
  for (const [slug, label, expected, tol] of ROWS) {
    it(`${slug} → ${label} = ${expected}`, () => {
      const row = outputs(slug).find((r) => r.label === label);
      expect(row, `${slug}: no output "${label}"`).toBeDefined();
      const got = Number(String(row!.value).replace(/,/g, ""));
      expect(Number.isFinite(got)).toBe(true);
      expect(Math.abs(got - expected)).toBeLessThanOrEqual(tol);
    });
  }
});
