/**
 * CALC-0848 — Heat Index
 * NOAA/NWS Weather Prediction Center (WPC) & Rothfusz multiple regression (R-009, inspected 2026-10-22):
 *   1) Simple Steadman screening equation:
 *      HI_simple = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + RH * 0.094)
 *      If 0.5 * (HI_simple + T) < 80 °F, return HI_simple (avoids unphysical polynomial extrapolation below 80 °F).
 *   2) Full Rothfusz regression:
 *      HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH
 *           - 0.00683783*T^2 - 0.05481717*RH^2 + 0.00122874*T^2*RH
 *           + 0.00085282*T*RH^2 - 0.00000199*T^2*RH^2
 *      with NWS dry-air adjustment (RH < 13% and 80 <= T <= 112 °F) and high-humidity
 *      adjustment (RH > 85% and 80 <= T <= 87 °F).
 * Regression error ±1.3 °F in shade; direct sunshine can add up to 15 °F.
 * Known-answer (NWS): T=100°F, RH=55% -> 123.6°F; T=100°F, RH=15% -> 95.8°F.
 * Verification status: SOURCE_VERIFIED.
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  temperatureF: number;
  relativeHumidityPct: number; // 0-100
}

export interface Output {
  heatIndexF: number;
  advisory: string | null;
}

const C = {
  c1: -42.379,
  c2: 2.04901523,
  c3: 10.14333127,
  c4: -0.22475541,
  c5: -0.00683783,
  c6: -0.05481717,
  c7: 0.00122874,
  c8: 0.00085282,
  c9: -0.00000199,
};

function advisoryFor(t: number, hi: number): string | null {
  if (t < 80) {
    return "Heat index is primarily defined for hot conditions (80 °F and above); below 80 °F the NWS Steadman screening equation is used.";
  }
  if (hi >= 125) return "Extreme danger — heat stroke highly likely with continued exposure (shade value; sun adds up to 15 °F).";
  if (hi >= 103) return "Danger — heat cramps and heat exhaustion likely; heat stroke possible with prolonged activity.";
  if (hi >= 90) return "Extreme caution — heat cramps and heat exhaustion possible with prolonged exposure.";
  if (hi >= 80) return "Caution — fatigue possible with prolonged exposure or physical activity.";
  return null;
}

export function heatIndex(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.temperatureF)) return err("Temperature must be a valid number.");
  if (!Number.isFinite(i.relativeHumidityPct)) return err("Relative humidity must be a valid number.");
  if (i.relativeHumidityPct < 0 || i.relativeHumidityPct > 100) {
    return err("Relative humidity must be between 0% and 100%.");
  }

  const T = i.temperatureF;
  const R = i.relativeHumidityPct;
  const simple = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + R * 0.094);
  if (0.5 * (simple + T) < 80) {
    return ok({ heatIndexF: simple, advisory: advisoryFor(T, simple) });
  }

  const T2 = T * T;
  const R2 = R * R;
  let hi =
    C.c1 +
    C.c2 * T +
    C.c3 * R +
    C.c4 * T * R +
    C.c5 * T2 +
    C.c6 * R2 +
    C.c7 * T2 * R +
    C.c8 * T * R2 +
    C.c9 * T2 * R2;

  if (R < 13 && T >= 80 && T <= 112) {
    hi -= ((13 - R) / 4) * Math.sqrt(Math.max(0, (17 - Math.abs(T - 95)) / 17));
  } else if (R > 85 && T >= 80 && T <= 87) {
    hi += ((R - 85) / 10) * ((87 - T) / 5);
  }

  return ok({ heatIndexF: hi, advisory: advisoryFor(T, hi) });
}
