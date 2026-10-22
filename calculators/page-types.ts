/**
 * Shared type for calculator page content (server-rendered for SEO).
 * Each calculator provides its own content.ts conforming to this shape.
 */

export interface FormulaVariable {
  symbol: string;
  description: string;
}

export interface WorkedExample {
  label: string;
  steps: string[];
  result: string;
  note?: string;
}

export interface CalculatorContent {
  formula: {
    latex: string;
    plain: string;
    variables: FormulaVariable[];
  };
  workedExample: WorkedExample;
  assumptions: string[];
  limitations: string[];
  references: Array<{ code?: string; title: string; url: string }>;
}
