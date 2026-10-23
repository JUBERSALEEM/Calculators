/**
 * CALC-0003 — Percentage Difference
 * Formula: diff% = |A - B| / |(A + B) / 2| * 100  (symmetric, absolute mean as base)
 * Source: standard arithmetic (REF-MATH-ELEM), master plan §8 C01.
 * Verification status: RESEARCH_REQUIRED (no inspected citation).
 * Known-answer: A=100, B=120 -> 18.18%
 */

import { Result, ok, err } from "@/lib/calc/result";

export interface Inputs {
  a: number;
  b: number;
}

export interface Output {
  differencePct: number;
  mean: number;
}

export function percentageDifference(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.a)) return err("Value A must be a valid number.");
  if (!Number.isFinite(i.b)) return err("Value B must be a valid number.");
  const mean = (i.a + i.b) / 2;
  if (mean === 0) return err("The mean of the two values is zero; difference is undefined.");
  const base = Math.abs(mean); // absolute mean keeps the result non-negative for negative inputs
  return ok({
    differencePct: (Math.abs(i.a - i.b) / base) * 100,
    mean,
  });
}
