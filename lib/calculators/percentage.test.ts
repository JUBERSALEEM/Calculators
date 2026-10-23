import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, outputLabel, primary, run } from "@/lib/calculators/testing";

describe("percentage of a number (CALC-0001)", () => {
  it("computes 15% of 200", () => {
    expect(primary(run("percentage-of-a-number", { percent: "15", base: "200" })).value).toBe("30");
  });

  it("handles a percentage above 100 and a negative base", () => {
    // 150% of 40 = 60 (checked independently: 1.5 × 40).
    expect(primary(run("percentage-of-a-number", { percent: "150", base: "40" })).value).toBe("60");
    // 10% of −250 = −25.
    expect(numberOf(primary(run("percentage-of-a-number", { percent: "10", base: "-250" })).value)).toBe(-25);
  });

  it("reports the remaining amount", () => {
    const result = run("percentage-of-a-number", { percent: "25", base: "80" });
    expect(outputLabel(result, "Remaining amount").value).toBe("60");
  });

  it("rejects a blank input", () => {
    expect(errored(run("percentage-of-a-number", { percent: "", base: "80" })).errors.percent).toBe("Enter a value");
  });
});

describe("percentage change (CALC-0002)", () => {
  it("computes the plan's known answer: 100 → 120 is +20%", () => {
    expect(primary(run("percentage-change", { oldValue: "100", newValue: "120" })).value).toBe("+20%");
  });

  it("computes a decrease", () => {
    // (80 − 100) ÷ 100 × 100 = −20%.
    expect(primary(run("percentage-change", { oldValue: "100", newValue: "80" })).value).toBe("−20%");
  });

  it("keeps the sign of the change when the starting value is negative", () => {
    // (−50 − (−100)) ÷ 100 = +50%, i.e. the value rose despite the larger negative input.
    expect(primary(run("percentage-change", { oldValue: "-100", newValue: "-50" })).value).toBe("+50%");
  });

  it("refuses a zero starting value instead of dividing by zero", () => {
    const outcome = errored(run("percentage-change", { oldValue: "0", newValue: "10" }));
    expect(outcome.errors.oldValue).toMatch(/undefined when the original value is 0/);
  });

  it("reports no change when the values are equal", () => {
    const outcome = ok(run("percentage-change", { oldValue: "5", newValue: "5" }));
    expect(outcome.interpretation?.label).toBe("No change");
  });
});

describe("percentage difference (CALC-0003)", () => {
  it("computes the plan's known answer: 100 vs 120 is 18.18%", () => {
    // |100 − 120| ÷ 110 × 100 = 18.1818...
    expect(primary(run("percentage-difference", { valueA: "100", valueB: "120" })).value).toBe("18.1818%");
  });

  it("is symmetric in its inputs", () => {
    const forward = primary(run("percentage-difference", { valueA: "100", valueB: "120" })).value;
    const reverse = primary(run("percentage-difference", { valueA: "120", valueB: "100" })).value;
    expect(forward).toBe(reverse);
  });

  it("refuses a pair that averages to zero", () => {
    const outcome = errored(run("percentage-difference", { valueA: "50", valueB: "-50" }));
    expect(outcome.errors.valueB).toMatch(/average to zero/);
  });

  it("returns zero for identical values", () => {
    expect(primary(run("percentage-difference", { valueA: "7", valueB: "7" })).value).toBe("0%");
  });
});

describe("percentage point change (CALC-0004)", () => {
  it("distinguishes points from relative change for 10% → 12%", () => {
    const outcome = run("percentage-point-change", { firstRate: "10", secondRate: "12" });
    expect(primary(outcome).value).toBe("+2 pp");
    expect(outputLabel(outcome, "Relative change").value).toBe("+20%");
    expect(outputLabel(outcome, "Basis points").value).toBe("+200 bp");
  });

  it("handles a fall", () => {
    const outcome = run("percentage-point-change", { firstRate: "15", secondRate: "12.5" });
    expect(primary(outcome).value).toBe("−2.5 pp");
    expect(outputLabel(outcome, "Relative change").value).toBe("−16.6667%");
  });

  it("marks relative change undefined when starting from zero", () => {
    const outcome = run("percentage-point-change", { firstRate: "0", secondRate: "5" });
    expect(outputLabel(outcome, "Relative change").value).toBe("Undefined");
    expect(primary(outcome).value).toBe("+5 pp");
  });
});
