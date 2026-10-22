import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{mean} = \\frac{\\sum x}{n}",
    plain: "mean = sum of values ÷ count of values",
    variables: [
      { symbol: "x", description: "Each number in the list." },
      { symbol: "n", description: "Count of numbers." },
    ],
  },
  workedExample: {
    label: "Mean of 10, 20, 30, 40.",
    steps: ["sum = 10 + 20 + 30 + 40 = 100", "count = 4", "mean = 100 ÷ 4 = 25"],
    result: "25",
  },
  assumptions: ["Accepts a comma-separated list of numbers. At least one value is required."],
  limitations: ["Empty input is refused."],
  references: [
    { code: "REF-MATH-ELEM", title: "Standard arithmetic definition", url: "#" },
  ],
};
