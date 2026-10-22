import { describe, it, expect } from "vitest";
import { bmi } from "./formula";

describe("bmi (CALC-0897)", () => {
  it("matches CDC known-answer: 169 lb, 5 ft 9 in -> 24.95 kg/m² (healthy)", () => {
    const r = bmi({ weightLb: 169, heightFt: 5, heightIn: 9 });
    if (r.ok) expect(r.value.bmi).toBeCloseTo(24.95, 1);
    else throw new Error("unexpected error");
  });

  it("matches CDC known-answer: 124 lb, 5 ft 9 in -> 18.31 kg/m² (underweight)", () => {
    const r = bmi({ weightLb: 124, heightFt: 5, heightIn: 9 });
    if (r.ok) expect(r.value.bmi).toBeCloseTo(18.31, 1);
    else throw new Error("unexpected error");
  });

  it("matches CDC known-answer: 203 lb, 5 ft 9 in -> 29.97 kg/m²", () => {
    const r = bmi({ weightLb: 203, heightFt: 5, heightIn: 9 });
    if (r.ok) expect(r.value.bmi).toBeCloseTo(29.97, 1);
    else throw new Error("unexpected error");
  });

  it("refuses zero/negative weight", () => {
    const r = bmi({ weightLb: 0, heightFt: 5, heightIn: 9 });
    expect(r.ok).toBe(false);
  });

  it("refuses zero height", () => {
    const r = bmi({ weightLb: 150, heightFt: 0, heightIn: 0 });
    expect(r.ok).toBe(false);
  });
});
