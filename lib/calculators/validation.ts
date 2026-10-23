import { z } from "zod";

import { parseLocaleNumber } from "@/lib/format";
import type { CalcValues, Field, NumberField } from "@/lib/calculators/types";

/**
 * Input validation for calculators.
 *
 * The field metadata that renders the form is the single source of truth: the
 * Zod schema is generated from the same metadata, so a range can never be
 * enforced in one place and displayed in another. Parsing rejects empty strings
 * before coercion, because `Number("")` is `0` and silently accepting that
 * would turn a blank input into a confident wrong answer.
 */

const EMPTY = "Enter a value";
const NOT_A_NUMBER = "Enter a valid number";

function numberSchema(field: NumberField) {
  return z.preprocess((raw) => {
    if (typeof raw !== "string") return raw;
    const trimmed = raw.trim();
    if (trimmed === "") return undefined;
    const parsed = parseLocaleNumber(trimmed);
    // NaN is rejected by z.number(); undefined is rejected as missing.
    return parsed === null ? Number.NaN : parsed;
  }, z.number().min(field.min ?? Number.NEGATIVE_INFINITY).max(field.max ?? Number.POSITIVE_INFINITY));
}

function fieldSchema(field: Field): z.ZodTypeAny {
  if (field.kind === "number") return numberSchema(field);
  if (field.kind === "select") {
    const values = field.options.map((option) => option.value);
    if (values.length === 0) return z.string();
    return z.enum(values as [string, ...string[]]);
  }
  return z.string().max(field.maxLength ?? 2000, { message: `Enter no more than ${(field.maxLength ?? 2000).toLocaleString("en-US")} characters.` });
}

export function buildInputSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) shape[field.name] = fieldSchema(field);
  return z.object(shape);
}

function messageFor(field: Field | undefined, issue: z.core.$ZodIssue, rawValue: string | undefined): string {
  const code = issue.code as string;
  if (code === "invalid_type") {
    // Zod's public issue no longer carries the received value, so the raw string
    // is the reliable way to tell "left blank" from "not a number".
    return rawValue === undefined || rawValue.trim() === "" ? EMPTY : NOT_A_NUMBER;
  }
  if (code === "too_small" || code === "too_big") {
    if (field?.kind === "number") {
      const bound = code === "too_small" ? field.min : field.max;
      if (bound !== undefined) {
        return code === "too_small"
          ? `${field.label} must be at least ${bound}${field.unit ? ` ${field.unit}` : ""}.`
          : `${field.label} must be at most ${bound}${field.unit ? ` ${field.unit}` : ""}.`;
      }
    }
    return code === "too_small" ? "Value is too small." : "Value is too large.";
  }
  if (code === "invalid_value" || code === "invalid_enum_value") {
    return "Choose one of the available options.";
  }
  return issue.message || "This value is not valid.";
}

export type ValidationOutcome =
  | { ok: true; values: CalcValues }
  | { ok: false; errors: Record<string, string> };

export function validateInputs(fields: Field[], raw: Record<string, string>): ValidationOutcome {
  const schema = buildInputSchema(fields);
  const result = schema.safeParse(raw);

  if (result.success) {
    const values: CalcValues = {};
    for (const [key, value] of Object.entries(result.data as Record<string, unknown>)) {
      if (typeof value === "number" || typeof value === "string") values[key] = value;
    }
    return { ok: true, values };
  }

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const name = String(issue.path[0] ?? "");
    if (!name || errors[name]) continue;
    errors[name] = messageFor(
      fields.find((field) => field.name === name),
      issue,
      typeof raw[name] === "string" ? raw[name] : undefined,
    );
  }
  return { ok: false, errors };
}

/** Small helpers used inside calculator definitions to read typed values. */
export function asNumber(values: CalcValues, name: string): number {
  const value = values[name];
  return typeof value === "number" ? value : Number.NaN;
}

export function asString(values: CalcValues, name: string): string {
  const value = values[name];
  return typeof value === "string" ? value : String(value ?? "");
}

/** Build an error-only outcome, keyed by field name. */
export function fail(errors: Record<string, string>): { ok: false; errors: Record<string, string> } {
  return { ok: false, errors };
}
