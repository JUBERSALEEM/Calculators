/**
 * CALC-0001 — Percentage of a Number
 * Formula: portion = base * (percent / 100)
 * Source: standard arithmetic (REF-MATH-ELEM), master plan §8 C01.
 * Verification status: RESEARCH_REQUIRED (no inspected citation).
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  base: number;      // any real
  percent: number;   // percent, may be negative
}

export interface Output {
  portion: number;
}

export function percentageOfANumber(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.base)) return err("Base amount must be a valid number.");
  if (!Number.isFinite(i.percent)) return err("Percent must be a valid number.");
  return ok({ portion: i.base * (i.percent / 100) });
}
