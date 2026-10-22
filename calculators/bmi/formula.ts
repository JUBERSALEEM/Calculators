/**
 * CALC-0897 — BMI Calculator (Adults)
 * Formula: BMI = weight(kg) / height(m)^2
 * Source: CDC Adult BMI Categories (R-011, inspected 2026-10-22).
 * Inputs accepted in lb and ft/in (US customary); converted to kg/m using exact
 * constants: 1 lb = 0.45359237 kg (exact, NIST R-001), 1 in = 0.0254 m (exact).
 * Verification status: SOURCE_VERIFIED.
 * Known-answer (CDC): 169 lb, 5 ft 9 in -> 24.95 kg/m² (healthy, not yet overweight);
 *                     124 lb, 5 ft 9 in -> 18.31 kg/m² (underweight);
 *                     203 lb, 5 ft 9 in -> 29.97 kg/m² (not yet class 1 obesity).
 * Limitation: adults 20+ only. Not a diagnosis; a screening measure.
 */

import { Result, ok, err } from "@/lib/calc/result";

const LB_TO_KG = 0.45359237; // exact
const IN_TO_M = 0.0254; // exact

export interface Inputs {
  weightLb: number;
  heightFt: number;
  heightIn: number;
}

export interface Output {
  bmi: number;
  category: string;
}

export function categoryFor(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity class 1";
  if (bmi < 40) return "Obesity class 2";
  return "Obesity class 3 (severe)";
}

export function bmi(i: Inputs): Result<Output, string> {
  if (!Number.isFinite(i.weightLb)) return err("Weight must be a valid number.");
  if (!Number.isFinite(i.heightFt)) return err("Height feet must be a valid number.");
  if (!Number.isFinite(i.heightIn)) return err("Height inches must be a valid number.");
  if (i.weightLb <= 0) return err("Weight must be greater than zero.");
  const totalInches = i.heightFt * 12 + i.heightIn;
  if (totalInches <= 0) return err("Height must be greater than zero.");

  const weightKg = i.weightLb * LB_TO_KG;
  const heightM = totalInches * IN_TO_M;
  const bmiValue = weightKg / (heightM * heightM);

  return ok({ bmi: bmiValue, category: categoryFor(bmiValue) });
}
