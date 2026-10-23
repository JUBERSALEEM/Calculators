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

// Added: Steadman branch, dry-air and high-humidity adjustments (expected values computed independently)
function hiVal(t: number, r: number): number {
  const res = heatIndex({ temperatureF: t, relativeHumidityPct: r });
  if (!res.ok) throw new Error(res.error);
  return res.value.heatIndexF;
}

describe("heat index (NWS) — audited branches", () => {
  it("uses the Steadman equation below the regression range: 50 °F / 50% = 47.05 °F", () => {
    expect(hiVal(50, 50)).toBeCloseTo(47.05, 2);
  });

  it("returns the Steadman value for 79 °F / 60% = 79.42 °F (gate not met)", () => {
    expect(hiVal(79, 60)).toBeCloseTo(79.42, 2);
  });

  it("matches the Rothfusz regression at 100 °F / 55% = 123.64 °F", () => {
    expect(hiVal(100, 55)).toBeCloseTo(123.64, 2);
  });

  it("matches the Rothfusz regression at 100 °F / 15% = 95.85 °F (no dry adjustment at 15%)", () => {
    expect(hiVal(100, 15)).toBeCloseTo(95.85, 2);
  });

  it("applies the dry-air adjustment at 100 °F / 10%: 94.12 °F", () => {
    expect(hiVal(100, 10)).toBeCloseTo(94.12, 2);
  });

  it("applies the high-humidity adjustment at 85 °F / 90%: 101.78 °F", () => {
    expect(hiVal(85, 90)).toBeCloseTo(101.78, 2);
  });

  it("rejects relative humidity outside 0–100%", () => {
    expect(heatIndex({ temperatureF: 90, relativeHumidityPct: 101 }).ok).toBe(false);
    expect(heatIndex({ temperatureF: 90, relativeHumidityPct: -1 }).ok).toBe(false);
  });

  it("rejects non-finite temperature", () => {
    expect(heatIndex({ temperatureF: Number.NaN, relativeHumidityPct: 50 }).ok).toBe(false);
  });
});
