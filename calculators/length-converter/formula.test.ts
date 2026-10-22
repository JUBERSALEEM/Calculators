import { describe, it, expect } from "vitest";
import { lengthConverter } from "./formula";

describe("lengthConverter (CALC-0957)", () => {
  it("converts 1 ft to 0.3048 m (exact NIST factor)", () => {
    const r = lengthConverter({ value: 1, from: "ft", to: "m" });
    if (r.ok) expect(r.value.result).toBe(0.3048);
    else throw new Error("unexpected error");
  });

  it("round-trips identity (T6): ft -> m -> ft", () => {
    const r1 = lengthConverter({ value: 100, from: "ft", to: "m" });
    expect(r1.ok).toBe(true);
    if (r1.ok) {
      const r2 = lengthConverter({ value: r1.value.result, from: "m", to: "ft" });
      expect(r2.ok).toBe(true);
      if (r2.ok) expect(r2.value.result).toBeCloseTo(100, 6);
    }
  });

  it("converts 1 mile to 1609.344 m (exact derived)", () => {
    const r = lengthConverter({ value: 1, from: "mi", to: "m" });
    if (r.ok) expect(r.value.result).toBeCloseTo(1609.344, 6);
    else throw new Error("unexpected error");
  });

  it("rejects unknown units", () => {
    const r = lengthConverter({ value: 10, from: "furlong" as any, to: "m" });
    expect(r.ok).toBe(false);
  });

  it("rejects non-finite value", () => {
    const r = lengthConverter({ value: NaN as any, from: "m", to: "ft" });
    expect(r.ok).toBe(false);
  });
});
