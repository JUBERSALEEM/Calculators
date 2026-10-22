import { describe, it, expect } from "vitest";
import { heatIndex } from "./formula";

describe("heatIndex (CALC-0848)", () => {
  it("matches NWS example: T=100°F, RH=55% -> ~123.6°F (known-answer T1)", () => {
    const r = heatIndex({ temperatureF: 100, relativeHumidityPct: 55 });
    if (r.ok) expect(r.value.heatIndexF).toBeCloseTo(123.6, 1);
    else throw new Error("unexpected error");
  });

  it("matches NWS example: T=100°F, RH=15% -> ~95.8°F", () => {
    const r = heatIndex({ temperatureF: 100, relativeHumidityPct: 15 });
    if (r.ok) expect(r.value.heatIndexF).toBeCloseTo(95.8, 1);
    else throw new Error("unexpected error");
  });

  it("rejects humidity outside 0-100", () => {
    const r = heatIndex({ temperatureF: 90, relativeHumidityPct: 110 });
    expect(r.ok).toBe(false);
  });

  it("rejects non-finite input", () => {
    const r = heatIndex({ temperatureF: NaN as any, relativeHumidityPct: 50 });
    expect(r.ok).toBe(false);
  });
});
