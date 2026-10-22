import type { Result } from "@/lib/calc/result";

export type FieldKind = "number" | "select" | "text";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CalcField {
  key: string;
  label: string;
  kind: FieldKind;
  unit?: string;
  defaultValue: string;
  placeholder?: string;
  helper?: string;
  min?: number;
  max?: number;
  gt?: number;
  nonZero?: boolean;
  integer?: boolean;
  step?: string;
  options?: SelectOption[];
}

export interface CalcOutput {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export interface CalcRunResult {
  outputs: CalcOutput[];
  advisory?: string;
}

export type ParsedInputs = Record<string, number | string>;

export interface SpecVariable {
  symbol: string;
  description: string;
}

export interface CalculatorSpec {
  slug: string;
  fields: CalcField[];
  formulaPlain: string;
  variables: SpecVariable[];
  assumptions?: string[];
  limitations?: string[];
  compute: (inputs: ParsedInputs) => Result<CalcRunResult>;
}
