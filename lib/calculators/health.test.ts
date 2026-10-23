import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, outputLabel, primary, run } from "@/lib/calculators/testing";

describe("BMI (CALC-0897)", () => {
  it("reproduces the plan's known imperial answers at 5 ft 9 in", () => {
    // 124 lb → 18.31, 169 lb → 24.95, 203 lb → 29.97 BMI (CDC table values).
    // Displayed values are rounded to one decimal place, as the CDC table does.
    const cases = [
      { weight: "124", bmi: 18.3 },
      { weight: "169", bmi: 25.0 },
      { weight: "203", bmi: 30.0 },
    ];

    for (const testCase of cases) {
      const outcome = run("bmi", { units: "imperial", weight: testCase.weight, height: "69" });
      expect(numberOf(primary(outcome).value), `weight ${testCase.weight} lb`).toBeCloseTo(testCase.bmi, 5);
    }
  });

  it("classifies from the rounded value, so 169 lb at 5 ft 9 in is the first overweight row", () => {
    // Unrounded BMI is 24.9527…, which rounds to 25.0 and therefore crosses the CDC cut-point.
    const outcome = ok(run("bmi", { units: "imperial", weight: "169", height: "69" }));
    expect(outcome.interpretation?.label).toBe("Overweight");
  });

  it("computes a metric BMI independently", () => {
    // 70 kg / 1.75 m² = 70 / 3.0625 = 22.857… → 22.9.
    const outcome = run("bmi", { units: "metric", weight: "70", height: "175" });
    expect(numberOf(primary(outcome).value)).toBe(22.9);
    expect(ok(outcome).interpretation?.label).toBe("Healthy weight");
  });

  it("keeps the normal weight range in the same unit system as the input", () => {
    const outcome = run("bmi", { units: "imperial", weight: "169", height: "69" });
    expect(outputLabel(outcome, "Weight range for a healthy BMI").value).toMatch(/lb$/);
  });

  it("refuses a zero height instead of returning Infinity", () => {
    const outcome = errored(run("bmi", { units: "metric", weight: "70", height: "0" }));
    // Height has a 50-unit floor in the field metadata, so the form refuses it
    // before compute() runs; the divide-by-zero branch is the second guard.
    expect(outcome.errors.height).toBe("Height must be at least 50.");
  });

  it("never returns a non-finite display value", () => {
    const outcome = ok(run("bmi", { units: "metric", weight: "70", height: "175" }));
    for (const output of outcome.outputs) expect(output.value).not.toMatch(/NaN|Infinity/);
  });

  it("rejects an out-of-range weight at the validation layer", () => {
    const outcome = errored(run("bmi", { units: "metric", weight: "5000", height: "175" }));
    expect(outcome.errors.weight).toBeDefined();
  });
});
