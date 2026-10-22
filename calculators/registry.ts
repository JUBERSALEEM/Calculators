/**
 * Calculator registry — single source of truth for the implemented catalog.
 *
 * Relationship to docs/project-plan/catalog.csv:
 *   id        -> catalog ID (CALC-0001, ...), permanent, never reused
 *   slug      -> catalog slug and URL segment (/calculators/[slug])
 *   category  -> primary category key from the catalog
 *   status    -> implementation status of *this* repository. "Implemented" only
 *              when a working module + tests exist. This is NOT a claim about
 *              formula_status in catalog.csv, which is updated only when a
 *              source inspection upgrades it.
 *
 * A build-time assertion (lib/registry-assertions.test.ts / CI gate G7) verifies
 * ids, slugs and category membership against this file. catalog.csv remains the
 * authoritative catalog and is intentionally not duplicated here beyond the
 * fields needed for routing and SEO.
 */

export interface CalculatorMeta {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  description: string;
  intent: "calculate" | "convert" | "estimate";
  status: "Implemented" | "Planned" | "Deferred";
  formulaStatus:
    | "SOURCE_VERIFIED"
    | "RESEARCH_REQUIRED"
    | "SPECIALIST_REVIEW_REQUIRED";
  sources: Array<{ code: string; title: string; url: string; accessed: string }>;
  lastReviewed: string;
  inputs: Array<{ label: string; unit: string; placeholder?: string }>;
  outputLabel: string;
  related: string[]; // sibling slugs for internal links
}

/** Implemented calculators (Phase 1). */
export const CALCULATORS: CalculatorMeta[] = [
  {
    id: "CALC-0001",
    name: "Percentage of a Number",
    slug: "percentage-of-a-number",
    category: "C01",
    categoryLabel: "Basic Arithmetic and Percentages",
    description:
      "Find what portion a percentage represents of a base amount (e.g. 15% of 200).",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "RESEARCH_REQUIRED",
    sources: [
      {
        code: "REF-MATH-ELEM",
        title: "Standard arithmetic definition (percent of a base)",
        url: "https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md#c01--basic-arithmetic-and-percentages",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Base amount", unit: "", placeholder: "e.g. 200" },
      { label: "Percent", unit: "%", placeholder: "e.g. 15" },
    ],
    outputLabel: "Portion",
    related: ["percentage-change", "percentage-difference"],
  },
  {
    id: "CALC-0002",
    name: "Percentage Change",
    slug: "percentage-change",
    category: "C01",
    categoryLabel: "Basic Arithmetic and Percentages",
    description:
      "Relative change from an old value to a new value, expressed as a percentage of the old value.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "RESEARCH_REQUIRED",
    sources: [
      {
        code: "REF-MATH-ELEM",
        title: "Standard arithmetic definition (relative change)",
        url: "https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md#c01--basic-arithmetic-and-percentages",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Old value", unit: "", placeholder: "e.g. 100" },
      { label: "New value", unit: "", placeholder: "e.g. 120" },
    ],
    outputLabel: "% change vs old value",
    related: ["percentage-difference", "percentage-of-a-number"],
  },
  {
    id: "CALC-0003",
    name: "Percentage Difference",
    slug: "percentage-difference",
    category: "C01",
    categoryLabel: "Basic Arithmetic and Percentages",
    description:
      "Symmetric percentage difference between two values using their mean as the base — not a change calculation.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "RESEARCH_REQUIRED",
    sources: [
      {
        code: "REF-MATH-ELEM",
        title: "Standard arithmetic definition (percentage difference vs mean)",
        url: "https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md#c01--basic-arithmetic-and-percentages",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Value A", unit: "", placeholder: "e.g. 100" },
      { label: "Value B", unit: "", placeholder: "e.g. 120" },
    ],
    outputLabel: "% difference vs mean",
    related: ["percentage-change", "percentage-of-a-number"],
  },
  {
    id: "CALC-0025",
    name: "Arithmetic Mean",
    slug: "arithmetic-mean",
    category: "C02",
    categoryLabel: "Fractions, Ratios, Proportions and Averages",
    description: "Mean (average) of a list of numbers, with sum and count.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "RESEARCH_REQUIRED",
    sources: [
      {
        code: "REF-MATH-ELEM",
        title: "Standard arithmetic definition (arithmetic mean)",
        url: "https://github.com/JUBERSALEEM/Calculators/blob/main/docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md#c02--fractions-ratios-proportions-and-averages",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      {
        label: "Numbers",
        unit: "",
        placeholder: "e.g. 10, 20, 30, 40 (comma-separated)",
      },
    ],
    outputLabel: "Mean",
    related: ["weighted-average", "median-quartiles"],
  },
  {
    id: "CALC-0847",
    name: "Wind Chill",
    slug: "wind-chill",
    category: "C53",
    categoryLabel: "Meteorology and Climate",
    description:
      "How cold it feels on exposed skin, given air temperature and wind speed. NWS formula; valid only at or below 50 °F with wind above 3 mph.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "SOURCE_VERIFIED",
    sources: [
      {
        code: "R-008",
        title: "Understanding Wind Chill",
        url: "https://www.weather.gov/safety/cold-wind-chill-chart",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Air temperature", unit: "°F", placeholder: "e.g. 0" },
      { label: "Wind speed", unit: "mph", placeholder: "e.g. 15" },
    ],
    outputLabel: "Wind chill (°F)",
    related: ["heat-index"],
  },
  {
    id: "CALC-0848",
    name: "Heat Index",
    slug: "heat-index",
    category: "C53",
    categoryLabel: "Meteorology and Climate",
    description:
      "How hot it feels in the shade, given air temperature and relative humidity. NWS Rothfusz regression (error ±1.3 °F); direct sun can add up to 15 °F.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "SOURCE_VERIFIED",
    sources: [
      {
        code: "R-009",
        title: "What is the heat index? (NWS Amarillo)",
        url: "https://www.weather.gov/ama/heatindex",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Air temperature", unit: "°F", placeholder: "e.g. 100" },
      { label: "Relative humidity", unit: "%", placeholder: "e.g. 55" },
    ],
    outputLabel: "Heat index (°F)",
    related: ["wind-chill"],
  },
  {
    id: "CALC-0897",
    name: "BMI Calculator (Adults)",
    slug: "bmi",
    category: "C57",
    categoryLabel: "Nutrition and Dietary Calculations",
    description:
      "Body mass index for adults 20+. A screening measure only — not a diagnosis. CDC categories.",
    intent: "calculate",
    status: "Implemented",
    formulaStatus: "SOURCE_VERIFIED",
    sources: [
      {
        code: "R-011",
        title: "Adult BMI Categories",
        url: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Weight", unit: "lb", placeholder: "e.g. 169" },
      { label: "Height", unit: "ft/in", placeholder: "e.g. 5 ft 9 in" },
    ],
    outputLabel: "BMI (kg/m²)",
    related: [],
  },
  {
    id: "CALC-0957",
    name: "Length Converter",
    slug: "length-converter",
    category: "C61",
    categoryLabel: "Unit Conversion and Measurement",
    description:
      "Convert between metric and imperial length units using NIST SP 811 exact factors.",
    intent: "convert",
    status: "Implemented",
    formulaStatus: "SOURCE_VERIFIED",
    sources: [
      {
        code: "R-001",
        title: "NIST SP 811 — SI units, Appendix B.8 conversion factors",
        url: "https://www.nist.gov/pml/special-publication-811",
        accessed: "2026-10-22",
      },
      {
        code: "R-014",
        title: "NIST SP 811 Appendix B.8 (chunks D–G)",
        url: "https://www.nist.gov/physical-measurement-laboratory/nist-guide-si-appendix-b8",
        accessed: "2026-10-22",
      },
    ],
    lastReviewed: "2026-10-22",
    inputs: [
      { label: "Value", unit: "", placeholder: "e.g. 100" },
      { label: "From", unit: "", placeholder: "ft" },
      { label: "To", unit: "", placeholder: "m" },
    ],
    outputLabel: "Converted value",
    related: [],
  },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getCalculatorSlugs(): string[] {
  return CALCULATORS.map((c) => c.slug);
}

export function getCategories() {
  const map = new Map<string, { slug: string; label: string; count: number }>();
  for (const c of CALCULATORS) {
    if (!map.has(c.category)) {
      map.set(c.category, { slug: c.category.toLowerCase(), label: c.categoryLabel, count: 0 });
    }
    map.get(c.category)!.count += 1;
  }
  return Array.from(map.values());
}

export function getCalculatorsInCategory(category: string): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === category);
}
