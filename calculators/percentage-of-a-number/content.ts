import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{portion} = \\text{base} \\times \\frac{\\text{percent}}{100}",
    plain: "portion = base × (percent ÷ 100)",
    variables: [
      { symbol: "base", description: "The total amount to take a percentage of." },
      { symbol: "percent", description: "The percentage (e.g. 15 for 15%)." },
    ],
  },
  workedExample: {
    label: "What is 15% of 200?",
    steps: ["portion = 200 × (15 ÷ 100)", "portion = 200 × 0.15", "portion = 30"],
    result: "30",
  },
  assumptions: [
    "The base may be any number, including negative or zero.",
    "The percent may be negative (a reduction) or greater than 100.",
  ],
  limitations: ["None beyond standard arithmetic precision."],
  references: [
    { code: "REF-MATH-ELEM", title: "Standard arithmetic definition", url: "#" },
  ],
};
