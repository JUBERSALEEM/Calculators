import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{change\\%} = \\frac{\\text{new} - \\text{old}}{|\\text{old}|} \\times 100",
    plain: "change% = (new − old) ÷ |old| × 100",
    variables: [
      { symbol: "old", description: "Starting (base) value. Must not be zero." },
      { symbol: "new", description: "The value after the change." },
    ],
  },
  workedExample: {
    label: "Change from 100 to 120.",
    steps: ["change% = (120 − 100) ÷ |100| × 100", "change% = 20 ÷ 100 × 100", "change% = 20%"],
    result: "+20%",
    note: "This is relative change (asymmetric). It is not the same as percentage difference.",
  },
  assumptions: [
    "The old value is the base of comparison, so it must not be zero.",
  ],
  limitations: ["If the old value is zero, relative change is undefined."],
  references: [
    { code: "REF-MATH-ELEM", title: "Standard arithmetic definition", url: "#" },
  ],
};
