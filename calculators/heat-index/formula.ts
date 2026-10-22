/**
 * CALC-0848 — Heat Index
 * NWS Rothfusz multiple regression (R-009, inspected 2026-10-22):
 *   HI = -42.379 + 2.04901523*T + 10.14333127*RH - 0.22475541*T*RH
 *        - 0.00683783*T^2 - 0.05481717*RH^2 + 0.00122874*T^2*RH
 *        + 0.00085282*T*RH^2 - 0.00000199*T^2*RH^2
 *   T °F, RH %.
 * Error ±1.3 °F. Values are for shady locations; direct sun can add up to 15 °F.
 * Meaningful in hot conditions (roughly T >= 80°F). Computed for any input but an
 * advisory is shown below 80°F where the index is not meaningfully "felt".
 * Known-answer: T=100°F, RH=55% -> 123.6°F; T=100°F, RH=15% -> 95.8°F.
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
    return "Heat index is meaningful in hot conditions (roughly 80 °F and above). Below that, it feels close to the air temperature.";
  }
  if (hi >= 125) return "Extreme danger — high risk of heat illness.";
  if (hi >= 103) return "Danger — heat cramps and heat exhaustion likely.";
  if (hi >= 90) return "Extreme caution — heat cramps and heat exhaustion possible.";
  if (hi >= 80) return "Caution — fatigue possible with prolonged exposure.";
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
  const T2 = T * T;
  const R2 = R * R;
  const hi =
    C.c1 +
    C.c2 * T +
    C.c3 * R +
    C.c4 * T * R +
    C.c5 * T2 +
    C.c6 * R2 +
    C.c7 * T2 * R +
    C.c8 * T * R2 +
    C.c9 * T2 * R2;

  return ok({ heatIndexF: hi, advisory: advisoryFor(T, hi) });
}
