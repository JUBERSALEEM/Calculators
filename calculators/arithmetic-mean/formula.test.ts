import { describe, it, expect } from "vitest";
import { arithmeticMean } from "./formula";

describe("arithmeticMean (CALC-0025)", () => {
  it("computes mean, sum, count", () => {
    const r = arithmeticMean({ values: [10, 20, 30, 40] });
    if (r.ok) {
      expect(r.value.mean).toBe(25);
      expect(r.value.sum).toBe(100);
      expect(r.value.count).toBe(4);
    } else throw new Error("unexpected error");
  });

  it("single value returns itself", () => {
    const r = arithmeticMean({ values: [7] });
    if (r.ok) expect(r.value.mean).toBe(7);
    else throw new Error("unexpected error");
  });

  it("refuses empty list", () => {
    const r = arithmeticMean({ values: [] });
    expect(r.ok).toBe(false);
  });

  it("refuses non-finite values", () => {
    const r = arithmeticMean({ values: [1, NaN as any] });
    expect(r.ok).toBe(false);
  });
});
