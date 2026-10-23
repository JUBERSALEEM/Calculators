import { getCalculator, runCalculator } from "@/lib/calculators/registry";
import type { CalcOutcome } from "@/lib/calculators/types";

/** Test-only helpers. Nothing in the app imports this module. */

export function run(slug: string, raw: Record<string, string>): CalcOutcome {
  const calculator = getCalculator(slug);
  if (!calculator) throw new Error(`No calculator registered for slug "${slug}"`);
  return runCalculator(calculator, raw);
}

export function ok(outcome: CalcOutcome): Extract<CalcOutcome, { ok: true }> {
  if (!outcome.ok) throw new Error(`Expected success, got errors: ${JSON.stringify(outcome.errors)}`);
  return outcome;
}

export function errored(outcome: CalcOutcome): Extract<CalcOutcome, { ok: false }> {
  if (outcome.ok) throw new Error("Expected a validation error, but the calculation succeeded.");
  return outcome;
}

/** The emphasised output, i.e. the answer the page shows largest. */
export function primary(outcome: CalcOutcome): { value: string; hint?: string } {
  const output = ok(outcome).outputs.find((item) => item.emphasis);
  if (!output) throw new Error("No emphasised output found");
  return { value: output.value, hint: output.hint };
}

export function outputLabel(outcome: CalcOutcome, label: string): { value: string; hint?: string } {
  const output = ok(outcome).outputs.find((item) => item.label === label);
  if (!output) {
    throw new Error(`No output labelled "${label}". Available: ${ok(outcome).outputs.map((o) => o.label).join(" | ")}`);
  }
  return { value: output.value, hint: output.hint };
}

/** Pull the first number out of a formatted string ("1,609.344 km" → 1609.344). */
export function numberOf(formatted: string): number {
  const match = formatted.replace(/\u2212/g, "-").replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  if (!match) throw new Error(`No number found in "${formatted}"`);
  return Number(match[0]);
}
