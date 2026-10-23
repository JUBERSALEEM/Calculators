/** Shared types for calculator definitions. */

export type FieldOption = { value: string; label: string };

export interface NumberField {
  kind: "number";
  name: string;
  label: string;
  /** Unit shown next to the input, e.g. "%" or "kg". */
  unit?: string;
  hint?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  /** Shown only when the unit is chosen elsewhere; purely presentational. */
  optional?: boolean;
}

export interface SelectField {
  kind: "select";
  name: string;
  label: string;
  options: FieldOption[];
  defaultValue: string;
  hint?: string;
}

export interface TextField {
  kind: "text";
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  /** Render as a multi-line textarea. */
  multiline?: boolean;
  optional?: boolean;
  /** Hard character cap, as a denial-of-service guard. Defaults to 2,000. */
  maxLength?: number;
}

export type Field = NumberField | SelectField | TextField;

export type Tone = "neutral" | "positive" | "caution" | "danger";

export interface Output {
  label: string;
  /** Pre-formatted value including any unit. */
  value: string;
  /** Small supporting line, e.g. the same value in another unit. */
  hint?: string;
  /** Rendered larger, as the primary answer. */
  emphasis?: boolean;
}

export interface Interpretation {
  label: string;
  detail: string;
  tone: Tone;
}

export type CalcOutcome =
  | {
      ok: true;
      outputs: Output[];
      interpretation?: Interpretation;
      /** Contextual caveats shown beneath the result. */
      notes?: string[];
    }
  | { ok: false; errors: Record<string, string> };

export type CalcValues = Record<string, number | string>;

/** How the formula in this calculator was established. */
export type Verification =
  /** Checked against a source that was opened and read; see `references`. */
  | "source-verified"
  /** A mathematical definition or derivation, shown in full on the page. */
  | "standard-math"
  /** Requires a qualified reviewer before publication. */
  | "specialist-review";

export interface FormulaLine {
  label: string;
  expression: string;
}

export interface Reference {
  label: string;
  url: string;
  /** Publisher, edition date or accessed date. */
  note?: string;
}

export interface CalculatorMeta {
  /** Catalog ID from docs/project-plan/catalog.csv (CALC-0001 ...). */
  id: string;
  slug: string;
  name: string;
  /** Page <title> suffix and H1. */
  title: string;
  /** Meta description, 120-160 characters. */
  description: string;
  /** One-line card summary. */
  summary: string;
  category: { id: string; slug: string; name: string };
  /** Extra search terms that are not already in the name. */
  keywords: string[];
  verification: Verification;
  /** Slug of another calculator to cross-link, if any. */
  related: string[];
  /** Entity updated date for JSON-LD and the page footer. */
  updated: string;
}

export interface Calculator extends CalculatorMeta {
  fields: Field[];
  compute: (values: CalcValues) => CalcOutcome;
  formula: FormulaLine[];
  /** Prose explaining what the tool does and how it works. */
  explanation: string[];
  assumptions: string[];
  cautions?: string[];
  references: Reference[];
  example?: {
    inputs: string;
    result: string;
    working: string;
  };
}
