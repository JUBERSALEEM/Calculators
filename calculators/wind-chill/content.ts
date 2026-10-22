import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{WC} = 35.74 + 0.6215T - 35.75(V^{0.16}) + 0.4275T(V^{0.16})",
    plain: "Wind chill (°F) = 35.74 + 0.6215×T − 35.75×V^0.16 + 0.4275×T×V^0.16",
    variables: [
      { symbol: "T", description: "Air temperature in °F." },
      { symbol: "V", description: "Wind speed in mph." },
    ],
  },
  workedExample: {
    label: "T = 0°F, V = 15 mph (NWS published example).",
    steps: ["Wind chill = 35.74 + 0.6215(0) − 35.75(15^0.16) + 0.4275(0)(15^0.16)", "≈ −19.4°F"],
    result: "−19.4°F",
    note: "Matches the NWS worked example (rounded to −19°F on the NWS chart).",
  },
  assumptions: [
    "Temperature at or below 50 °F and wind speed above 3 mph (NWS validity domain).",
    "Measurement height ~5 ft; applies to exposed human skin, not inanimate objects.",
    "Bright sunshine may make it feel 10–18 °F warmer (not modeled here).",
  ],
  limitations: [
    "Outside the validity domain (T > 50 °F or V ≤ 3 mph) the tool refuses rather than extrapolate.",
    "Wind chill cannot make an object colder than the actual air temperature.",
  ],
  references: [
    {
      code: "R-008",
      title: "Understanding Wind Chill",
      url: "https://www.weather.gov/safety/cold-wind-chill-chart",
    },
  ],
};
