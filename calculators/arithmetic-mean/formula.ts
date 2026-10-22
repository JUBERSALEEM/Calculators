/**
 * CALC-0025 — Arithmetic Mean
 * Formula: mean = (Σ x) / n
 * Source: standard arithmetic (REF-MATH-ELEM), master plan §8 C02.
 * Verification status: RESEARCH_REQUIRED (no inspected citation).
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  values: number[]; // at least one
}

export interface Output {
  mean: number;
  sum: number;
  count: number;
}

export function arithmeticMean(i: Inputs): Result<Output, string> {
  if (!Array.isArray(i.values) || i.values.length === 0) {
    return err("Enter at least one number.");
  }
  if (i.values.some((v) => !Number.isFinite(v))) {
    return err("All values must be valid numbers.");
  }
  const sum = i.values.reduce((acc, v) => acc + v, 0);
  return ok({ mean: sum / i.values.length, sum, count: i.values.length });
}
