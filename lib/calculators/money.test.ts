import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, outputLabel, primary, run } from "@/lib/calculators/testing";

const approx = (formatted: string) => numberOf(formatted);

describe("compound interest (CALC-0157)", () => {
  it("reproduces the plan's known answer: 10,000 at 5% for 10 years, compounded monthly", () => {
    // 10000 × (1 + 0.05/12)^(120) = 16,470.0948…
    const outcome = primary(
      run("compound-interest", { principal: "10000", annualRate: "5", years: "10", frequency: "monthly" }),
    );
    expect(approx(outcome.value)).toBeCloseTo(16470.09, 2);
  });

  it("gives 16,288.95 when compounded annually", () => {
    // 10000 × 1.05^10 = 16,288.9463…
    const outcome = primary(
      run("compound-interest", { principal: "10000", annualRate: "5", years: "10", frequency: "annually" }),
    );
    expect(approx(outcome.value)).toBeCloseTo(16288.95, 2);
  });

  it("matches the continuous-compounding limit with e^(rt)", () => {
    // 10000 × e^0.5 = 16,487.2127…
    const outcome = primary(
      run("compound-interest", { principal: "10000", annualRate: "5", years: "10", frequency: "continuous" }),
    );
    expect(approx(outcome.value)).toBeCloseTo(16487.21, 2);
  });

  it("computes the effective annual rate from the compounding frequency", () => {
    // (1 + 0.05/12)^12 − 1 = 5.1162%.
    const outcome = run("compound-interest", {
      principal: "1000",
      annualRate: "5",
      years: "1",
      frequency: "monthly",
    });
    expect(numberOf(outputLabel(outcome, "Effective annual rate").value)).toBeCloseTo(5.1162, 4);
  });

  it("returns the principal unchanged at a zero rate", () => {
    const outcome = primary(
      run("compound-interest", { principal: "2500", annualRate: "0", years: "5", frequency: "daily" }),
    );
    expect(approx(outcome.value)).toBe(2500);
  });

  it("reports interest earned as the difference from the principal", () => {
    const outcome = ok(
      run("compound-interest", { principal: "1000", annualRate: "10", years: "2", frequency: "annually" }),
    );
    // 1000 × 1.1² = 1210, so interest = 210.
    expect(numberOf(outputLabel(outcome, "Interest earned").value)).toBeCloseTo(210, 6);
  });

  it("rejects a negative principal", () => {
    expect(
      errored(
        run("compound-interest", { principal: "-100", annualRate: "5", years: "1", frequency: "annually" }),
      ).errors.principal,
    ).toBeDefined();
  });

  it("returns the principal when the term is zero years", () => {
    // FV = P × (1 + r)^0 = P, which is defined; the tool states it rather than erroring.
    const outcome = primary(
      run("compound-interest", { principal: "1000", annualRate: "5", years: "0", frequency: "annually" }),
    );
    expect(numberOf(outcome.value)).toBe(1000);
  });

  it("rejects a negative term", () => {
    expect(
      errored(run("compound-interest", { principal: "100", annualRate: "5", years: "-1", frequency: "annually" }))
        .errors.years,
    ).toBeDefined();
  });
});
