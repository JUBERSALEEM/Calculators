/**
 * CALC-0002 — Percentage Change
 * Formula: change% = (new - old) / |old| * 100  (relative to old value)
 * Source: standard arithmetic (REF-MATH-ELEM), master plan §8 C01.
 * Verification status: RESEARCH_REQUIRED (no inspected citation).
 * Known-answer: old=100, new=120 -> +20.00%
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  old: number;   // base value, must be != 0
  new: number;
}

export interface Output {
  changePct: number;
}

export function percentageChange(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.old)) return err("Old value must be a valid number.");
  if (!Number.isFinite(i.new)) return err("New value must be a valid number.");
  if (i.old === 0) return err("Old value must not be zero (change is relative to the old value).");
  return ok({ changePct: ((i.new - i.old) / Math.abs(i.old)) * 100 });
}
