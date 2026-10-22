import { describe, it, expect } from "vitest";
import { percentageDifference } from "./formula";

describe("percentageDifference (CALC-0003)", () => {
  it("computes 18.18% for A=100, B=120 (known-answer T1)", () => {
    const r = percentageDifference({ a: 100, b: 120 });
    if (r.ok) expect(r.value.differencePct).toBeCloseTo(18.181818, 4);
    else throw new Error("unexpected error");
  });

  it("is symmetric (A,B) == (B,A)", () => {
    const r1 = percentageDifference({ a: 100, b: 120 });
    const r2 = percentageDifference({ a: 120, b: 100 });
    if (r1.ok && r2.ok) expect(r1.value.differencePct).toBeCloseTo(r2.value.differencePct, 6);
    else throw new Error("unexpected error");
  });

  it("returns 0 for identical values", () => {
    const r = percentageDifference({ a: 50, b: 50 });
    if (r.ok) expect(r.value.differencePct).toBe(0);
    else throw new Error("unexpected error");
  });

  it("refuses when mean is zero", () => {
    const r = percentageDifference({ a: 10, b: -10 });
    expect(r.ok).toBe(false);
  });
});
