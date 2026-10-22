import { describe, it, expect } from "vitest";
import { percentageOfANumber } from "./formula";

describe("percentageOfANumber (CALC-0001)", () => {
  it("computes portion of a base", () => {
    const r = percentageOfANumber({ base: 200, percent: 15 });
    if (r.ok) expect(r.value.portion).toBeCloseTo(30, 6);
    else throw new Error("unexpected error");
  });

  it("handles negative percent", () => {
    const r = percentageOfANumber({ base: 200, percent: -10 });
    if (r.ok) expect(r.value.portion).toBeCloseTo(-20, 6);
    else throw new Error("unexpected error");
  });

  it("handles zero base", () => {
    const r = percentageOfANumber({ base: 0, percent: 50 });
    if (r.ok) expect(r.value.portion).toBe(0);
    else throw new Error("unexpected error");
  });

  it("rejects non-finite base", () => {
    const r = percentageOfANumber({ base: NaN as any, percent: 10 });
    expect(r.ok).toBe(false);
  });
});
