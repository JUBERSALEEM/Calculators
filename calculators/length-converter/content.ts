import { CalculatorContent } from "@/calculators/page-types";

export const content: CalculatorContent = {
  formula: {
    latex: "\\text{value}_{\\text{to}} = \\text{value} \\times \\frac{\\text{factor}_{\\text{from}}}{\\text{factor}_{\\text{to}}}",
    plain: "Convert via SI (metre): value × (from-unit factor) ÷ (to-unit factor)",
    variables: [
      { symbol: "factor_from", description: "SI metres per source unit (NIST SP 811)." },
      { symbol: "factor_to", description: "SI metres per target unit (NIST SP 811)." },
    ],
  },
  workedExample: {
    label: "100 ft to metres.",
    steps: ["1 ft = 0.3048 m (exact NIST factor)", "100 ft × 0.3048 = 30.48 m"],
    result: "30.48 m",
  },
  assumptions: [
    "All conversion factors trace to NIST SP 811 Appendix B.8; exact factors flagged exact.",
    "Conversion is via SI only — no intermediate rounding.",
  ],
  limitations: [
    "This release includes metric + common imperial length units (m, cm, mm, km, ft, in, yd, mi).",
    "Mass, temperature and other quantities are not yet covered.",
  ],
  references: [
    {
      code: "R-001",
      title: "NIST SP 811 — SI units, Appendix B.8",
      url: "https://www.nist.gov/pml/special-publication-811",
    },
    {
      code: "R-014",
      title: "NIST SP 811 Appendix B.8 (chunks D–G)",
      url: "https://www.nist.gov/physical-measurement-laboratory/nist-guide-si-appendix-b8",
    },
  ],
};
