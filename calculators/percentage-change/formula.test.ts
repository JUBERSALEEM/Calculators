import { describe, it, expect } from "vitest";
import { percentageChange } from "./formula";

describe("percentageChange (CALC-0002)", () => {
  it("computes +20% for 100 -> 120 (known-answer T1)", () => {
    const r = percentageChange({ old: 100, new: 120 });
    if (r.ok) expect(r.value.changePct).toBeCloseTo(20, 6);
    else throw new Error("unexpected error");
  });

  it("computes -25% for 100 -> 75", () => {
    const r = percentageChange({ old: 100, new: 75 });
    if (r.ok) expect(r.value.changePct).toBeCloseTo(-25, 6);
    else throw new Error("unexpected error");
  });

  it("refuses old value of zero (division by zero)", () => {
    const r = percentageChange({ old: 0, new: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("zero");
  });

  it("rejects non-finite input", () => {
    const r = percentageChange({ old: NaN as any, new: 10 });
    expect(r.ok).toBe(false);
  });
});
