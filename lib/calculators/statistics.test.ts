import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, outputLabel, primary, run } from "@/lib/calculators/testing";

describe("arithmetic mean (CALC-0111)", () => {
  it("computes the plan's known answer: 4, 8, 15, 16, 23, 42 → 18", () => {
    expect(primary(run("mean", { numbers: "4, 8, 15, 16, 23, 42" })).value).toBe("18");
  });

  it("accepts newlines and mixed separators", () => {
    expect(primary(run("mean", { numbers: "4\n8, 15;16 23\t42" })).value).toBe("18");
  });

  it("handles decimals and negative values", () => {
    // (−10 + −5 + 0 + 5 + 10) ÷ 5 = 0.
    expect(primary(run("mean", { numbers: "-10, -5, 0, 5, 10" })).value).toBe("0");
    // (1.5 + 2.5) ÷ 2 = 2.
    expect(primary(run("mean", { numbers: "1.5 2.5" })).value).toBe("2");
  });

  it("reports count, sum and range", () => {
    const outcome = ok(run("mean", { numbers: "4, 8, 15, 16, 23, 42" }));
    expect(outputLabel(outcome, "Count").value).toBe("6");
    expect(outputLabel(outcome, "Sum").value).toBe("108");
    expect(outputLabel(outcome, "Smallest").value).toBe("4");
    expect(outputLabel(outcome, "Largest").value).toBe("42");
  });

  it("names the bad token instead of silently dropping it", () => {
    const outcome = errored(run("mean", { numbers: "4, 8, banana" }));
    expect(outcome.errors.numbers).toMatch(/banana/);
  });

  it("rejects an empty list", () => {
    expect(errored(run("mean", { numbers: "   " })).errors.numbers).toBe("Enter at least one number.");
  });

  it("caps the list at 10,000 values with an explicit message", () => {
    const tooMany = Array.from({ length: 10_001 }, () => "1").join(",");
    expect(errored(run("mean", { numbers: tooMany })).errors.numbers).toMatch(/no more than 10,000/);
    const atLimit = Array.from({ length: 10_000 }, () => "1").join(",");
    expect(numberOf(primary(run("mean", { numbers: atLimit })).value)).toBe(1);
  });

  it("only applies display rounding, so a repeating mean stays precise", () => {
    // 1, 2, 2 → 1.66666666…
    const outcome = primary(run("mean", { numbers: "1, 2, 2" }));
    expect(numberOf(outcome.value)).toBeCloseTo(1.6667, 3);
  });
});

describe("standard deviation and variance (CALC-0114)", () => {
  it("reproduces the source's worked example: 2,4,4,4,5,5,7,9 has a population σ of 2", () => {
    const outcome = primary(run("variance-stddev", { numbers: "2,4,4,4,5,5,7,9", dataset: "population" }));
    expect(numberOf(outcome.value)).toBeCloseTo(2, 8);
    expect(numberOf(outputLabel(run("variance-stddev", { numbers: "2,4,4,4,5,5,7,9", dataset: "population" }), "Variance (σ²)").value)).toBe(4);
  });

  it("applies Bessel's correction in sample mode", () => {
    // Same data: 32 ÷ 7 = 4.571428571, √ = 2.138089935…
    const outcome = primary(run("variance-stddev", { numbers: "2,4,4,4,5,5,7,9", dataset: "sample" }));
    expect(numberOf(outcome.value)).toBeCloseTo(2.138089935, 8);
  });

  it("computes a known sample deviation for the plan's six-value dataset", () => {
    // Mean 18; squared deviations 196, 100, 9, 4, 25, 576 → total 910.
    // Sample variance 910 ÷ 5 = 182, so s = 13.490737563…
    const outcome = primary(run("variance-stddev", { numbers: "4, 8, 15, 16, 23, 42", dataset: "sample" }));
    expect(numberOf(outcome.value)).toBeCloseTo(13.490737563, 8);
  });

  it("returns zero spread for identical values", () => {
    const outcome = primary(run("variance-stddev", { numbers: "7 7 7 7", dataset: "population" }));
    expect(numberOf(outcome.value)).toBe(0);
  });

  it("needs at least two values for a sample deviation", () => {
    const outcome = errored(run("variance-stddev", { numbers: "5", dataset: "sample" }));
    expect(outcome.errors.numbers).toMatch(/at least two values/);
  });

  it("allows a single value in population mode", () => {
    const outcome = primary(run("variance-stddev", { numbers: "5", dataset: "population" }));
    expect(numberOf(outcome.value)).toBe(0);
  });

  it("names the invalid token", () => {
    expect(errored(run("variance-stddev", { numbers: "1, 2, x", dataset: "population" })).errors.numbers).toMatch(/“x”/);
  });

  it("rejects an empty list", () => {
    expect(errored(run("variance-stddev", { numbers: "", dataset: "population" })).errors.numbers).toBe(
      "Enter at least one number.",
    );
  });
});
