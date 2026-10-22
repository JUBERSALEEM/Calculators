import type { Result } from "@/lib/calc/result";
import type {
  CalcField,
  CalcRunResult,
  CalculatorSpec,
  ParsedInputs,
  SpecVariable,
} from "@/lib/engine/types";
import { done, intF, nnF, numF, outN, outS, posF, selF, txtF } from "@/lib/engine/helpers";

/**
 * Terse output row: [label, value, decimals?, unit?, highlight?].
 * A string value renders as text; a number value is formatted to `decimals`.
 */
export type OutputTuple = [string, string | number, ...Array<string | number | boolean | undefined>];

/**
 * Values handed to a numeric calculator's `compute`.
 *
 * Every field is a validated finite number by the time `compute` runs (see
 * `validateAndRun`), and the strict proxy in `mk` throws on any key that is not
 * declared on the spec, so an index-signature type would only add noise
 * (`number | undefined` under noUncheckedIndexedAccess) to 1,000+ formulas.
 * The alias is therefore intentionally permissive.
 */
export type NumIn = any;

/** Short numeric field (any real number). */
export const n = (label: string, def: number | string, unit?: string, opts: Partial<CalcField> = {}) =>
  numF(label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), label, def, unit, opts);
/** Short positive field (> 0). */
export const p = (label: string, def: number | string, unit?: string, opts: Partial<CalcField> = {}) =>
  posF(label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), label, def, unit, opts);
/** Short non-negative field (≥ 0). */
export const z = (label: string, def: number | string, unit?: string, opts: Partial<CalcField> = {}) =>
  nnF(label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), label, def, unit, opts);
/** Short integer field. */
export const it = (label: string, def: number | string, opts: Partial<CalcField> = {}) =>
  intF(label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), label, def, opts);
/** Short select field. */
export const s = (label: string, options: Array<[string, string]>, def?: string) =>
  selF(
    label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    label,
    options.map(([value, lbl]) => ({ value, label: lbl })),
    def
  );
/** Short text field. */
export const t = (label: string, def: string, opts: Partial<CalcField> = {}) =>
  txtF(label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""), label, def, opts);

function strict<T extends object>(o: T, slug: string): T {
  return new Proxy(o, {
    get(target, prop, receiver) {
      if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);
      if (prop === "then" || prop === "toJSON" || prop === "constructor") return Reflect.get(target, prop, receiver);
      if (!(prop in target)) {
        throw new Error(`Internal input key "${prop}" is not declared in the "${slug}" field list.`);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

function toVariables(variableSpec: string | Array<[string, string]>, fields: CalcField[]): SpecVariable[] {
  if (Array.isArray(variableSpec)) {
    return variableSpec.map(([symbol, description]) => ({ symbol, description }));
  }
  return [
    {
      symbol: variableSpec,
      description: `Inputs and units: ${fields.map((f) => `${f.label}${f.unit ? ` (\({f.unit})\)` : ""}`).join(", ")}.`,
    },
  ];
}

function runOutputs(
  outputs: OutputTuple[] | Result<CalcRunResult>
): Result<CalcRunResult> {
  if (!Array.isArray(outputs)) return outputs;
  const mapped = outputs.map((t) => {
    const [label, value, third, fourth, fifth] = t as [
      string,
      number | string,
      number | string | boolean | undefined,
      string | boolean | undefined,
      boolean | undefined
    ];
    if (typeof value === "number") {
      const decimals = typeof third === "number" ? third : 4;
      const unit = typeof fourth === "string" ? fourth : undefined;
      const highlight = typeof fourth === "boolean" ? fourth : (fifth ?? false);
      return outN(label, value, decimals, unit, highlight);
    }
    const unit = typeof third === "string" ? third : undefined;
    const highlight = typeof third === "boolean" ? third : (typeof fourth === "boolean" ? fourth : false);
    return outS(label, value, unit, highlight);
  });
  return done(mapped);
}

/**
 * Numeric-only calculator builder: every field is numeric, so `compute` receives a
 * clean `Record<string, number>`.
 */
export function mk(
  slug: string,
  fields: CalcField[],
  formulaPlain: string,
  variableSpec: string | Array<[string, string]>,
  compute: (v: NumIn) => OutputTuple[] | Result<CalcRunResult>,
  opts: { assumptions?: string[]; limitations?: string[] } = {}
): CalculatorSpec {
  return {
    slug,
    fields,
    formulaPlain,
    variables: toVariables(variableSpec, fields),
    assumptions: opts.assumptions,
    limitations: opts.limitations,
    compute: (raw: ParsedInputs) => {
      const v: NumIn = {};
      for (const [k, val] of Object.entries(raw)) v[k] = Number(val);
      return runOutputs(compute(strict(v, slug)));
    },
  };
}

/** Mixed-type builder (selects / text): `compute` receives raw parsed inputs. */
export function mkx(
  slug: string,
  fields: CalcField[],
  formulaPlain: string,
  variableSpec: string | Array<[string, string]>,
  compute: (v: NumIn) => OutputTuple[] | Result<CalcRunResult>,
  opts: { assumptions?: string[]; limitations?: string[] } = {}
): CalculatorSpec {
  return {
    slug,
    fields,
    formulaPlain,
    variables: toVariables(variableSpec, fields),
    assumptions: opts.assumptions,
    limitations: opts.limitations,
    compute: (raw: ParsedInputs) => runOutputs(compute(strict(raw, slug) as NumIn)),
  };
}
