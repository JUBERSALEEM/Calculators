import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\begin{aligned}\\text{HI} = {}& -42.379 + 2.04901523T + 10.14333127\\text{RH} - 0.22475541T\\text{RH}\\\\& - 0.00683783T^2 - 0.05481717\\text{RH}^2 + 0.00122874T^2\\text{RH}\\\\& + 0.00085282T\\text{RH}^2 - 0.00000199T^2\\text{RH}^2\\end{aligned}",
    plain: "Rothfusz multiple regression (T in °F, RH in %).",
    variables: [
      { symbol: "T", description: "Air temperature in °F." },
      { symbol: "RH", description: "Relative humidity in %." },
    ],
  },
  workedExample: {
    label: "T = 100°F, RH = 55% (NWS published example).",
    steps: ["Substitute T = 100, RH = 55 into the Rothfusz regression.", "≈ 123.6°F (NWS reports ≈ 124°F)."],
    result: "≈ 123.6°F",
    note: "The regression has a stated error of ±1.3 °F.",
  },
  assumptions: [
    "Values are for shady locations; direct sun can add up to 15 °F (not modeled here).",
    "Meaningful in hot conditions (roughly 80 °F and above).",
  ],
  limitations: [
    "The regression has a stated error of ±1.3 °F; treat results as an estimate.",
    "Below roughly 80 °F the heat index is not meaningfully different from air temperature.",
  ],
  references: [
    {
      code: "R-009",
      title: "What is the heat index? — NWS Amarillo",
      url: "https://www.weather.gov/ama/heatindex",
    },
  ],
};
