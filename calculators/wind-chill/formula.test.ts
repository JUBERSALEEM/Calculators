import { describe, it, expect } from "vitest";
import { windChill } from "./formula";

describe("windChill (CALC-0847)", () => {
  it("matches NWS example: T=0°F, V=15 mph -> -19.4°F (known-answer T1)", () => {
    const r = windChill({ temperatureF: 0, windSpeedMph: 15 });
    if (r.ok) expect(r.value.windChillF).toBeCloseTo(-19.4, 1);
    else throw new Error("unexpected error");
  });

  it("refuses temperature above 50°F (domain)", () => {
    const r = windChill({ temperatureF: 60, windSpeedMph: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("50");
  });

  it("refuses wind speed at or below 3 mph (domain)", () => {
    const r = windChill({ temperatureF: 0, windSpeedMph: 3 });
    expect(r.ok).toBe(false);
  });

  it("rejects non-finite input", () => {
    const r = windChill({ temperatureF: NaN as any, windSpeedMph: 10 });
    expect(r.ok).toBe(false);
  });
});
