/**
 * CALC-0957 — Length Converter
 * Converts between metric and imperial length units via SI (metre).
 * Factors from NIST SP 811 Appendix B.8 (inspected R-001, R-014, 2026-10-22).
 * Marked exact where the inspected source marks them boldface.
 * Verification status: SOURCE_VERIFIED.
 */

import { Result, ok, err } from "@/lib/calc/result";
import { convertUnits } from "@/lib/units/registry";

export interface Inputs {
  value: number;
  from: string; // unit symbol, e.g. "ft"
  to: string;   // unit symbol, e.g. "m"
}

export interface Output {
  result: number;
  from: string;
  to: string;
}

export function lengthConverter(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.value)) return err("Value must be a valid number.");
  try {
    const result = convertUnits("length", i.value, i.from, i.to);
    return ok({ result, from: i.from, to: i.to });
  } catch (e) {
    return err(`Unknown unit: ${e instanceof Error ? e.message : String(e)}`);
  }
}
