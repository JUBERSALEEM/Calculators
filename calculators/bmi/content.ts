import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{BMI} = \\frac{\\text{weight (kg)}}{\\text{height (m)}^2}",
    plain: "BMI = weight (kg) ÷ height (m)²",
    variables: [
      { symbol: "weight", description: "Body weight (entered in lb, converted to kg)." },
      { symbol: "height", description: "Height (entered in ft/in, converted to m)." },
    ],
  },
  workedExample: {
    label: "169 lb, 5 ft 9 in (CDC published example).",
    steps: ["169 lb × 0.45359237 ≈ 76.66 kg", "5 ft 9 in = 69 in × 0.0254 ≈ 1.7526 m", "BMI = 76.66 ÷ (1.7526)² ≈ 24.95 kg/m²"],
    result: "24.95 kg/m² — Healthy weight (not yet overweight).",
    note: "Matches the CDC worked example; 169 lb is just below the overweight threshold.",
  },
  assumptions: [
    "Adults aged 20 and over. Categories do not depend on age, sex, or race.",
    "1 lb = 0.45359237 kg (exact); 1 in = 0.0254 m (exact).",
  ],
  limitations: [
    "BMI is a screening measure, not a diagnosis or a measure of body fatness.",
    "Not appropriate for children/teens (use BMI percentile), athletes, or pregnant people.",
    "Consider BMI together with other health factors; not a substitute for professional advice.",
  ],
  references: [
    {
      code: "R-011",
      title: "Adult BMI Categories — CDC",
      url: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
    },
  ],
};
