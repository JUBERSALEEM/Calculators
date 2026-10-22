import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{diff\\%} = \\frac{|A - B|}{(A + B) / 2} \\times 100",
    plain: "difference% = |A − B| ÷ mean(A, B) × 100",
    variables: [
      { symbol: "A", description: "First value." },
      { symbol: "B", description: "Second value." },
    ],
  },
  workedExample: {
    label: "A = 100, B = 120.",
    steps: ["difference% = |100 − 120| ÷ ((100 + 120) / 2) × 100", "difference% = 20 ÷ 110 × 100", "difference% ≈ 18.18%"],
    result: "18.18%",
    note: "Symmetric: swapping A and B gives the same result. Distinct from percentage change.",
  },
  assumptions: ["The mean of A and B is used as the base (must not be zero)."],
  limitations: ["Undefined when A + B = 0."],
  references: [
    { code: "REF-MATH-ELEM", title: "Standard arithmetic definition", url: "#" },
  ],
};
