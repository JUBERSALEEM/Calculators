/**
 * CALC-0847 — Wind Chill
 * NWS formula (R-008, inspected 2026-10-22):
 *   Wind chill (°F) = 35.74 + 0.6215*T - 35.75*(V^0.16) + 0.4275*T*(V^0.16)
 *   T = air temperature °F, V = wind speed mph.
 * Validity: T <= 50°F AND V > 3 mph. Outside this domain the tool refuses
 * (does not extrapolate). Wind chill applies to people/animals, not objects.
 * Known-answer (NWS page example): T=0°F, V=15 mph -> -19.4°F.
 * Verification status: SOURCE_VERIFIED.
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  temperatureF: number;
  windSpeedMph: number;
}

export interface Output {
  windChillF: number;
  category: string;
}

function categoryFor(wc: number): string {
  if (wc >= 32) return "Chilly — little risk";
  if (wc >= 0) return "Cold — frostbite risk with prolonged exposure";
  return "Very cold — frostbite risk; limit exposure";
}

export function windChill(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.temperatureF)) return err("Temperature must be a valid number.");
  if (!Number.isFinite(i.windSpeedMph)) return err("Wind speed must be a valid number.");

  // Domain enforcement per NWS: T <= 50°F and V > 3 mph.
  if (i.temperatureF > 50) {
    return err("Wind chill is defined only for temperatures at or below 50 °F.");
  }
  if (i.windSpeedMph <= 3) {
    return err("Wind chill is defined only for wind speeds above 3 mph.");
  }

  const vPow = Math.pow(i.windSpeedMph, 0.16);
  const wc = 35.74 + 0.6215 * i.temperatureF - 35.75 * vPow + 0.4275 * i.temperatureF * vPow;
  return ok({ windChillF: wc, category: categoryFor(wc) });
}
