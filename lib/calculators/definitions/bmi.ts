import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

const KG_PER_LB = 0.45359237; // exact
const M_PER_IN = 0.0254; // exact

const CATEGORIES = [
  { max: 18.5, label: "Underweight", tone: "caution" as const },
  { max: 25, label: "Healthy weight", tone: "positive" as const },
  { max: 30, label: "Overweight", tone: "caution" as const },
  { max: 35, label: "Obesity, class 1", tone: "danger" as const },
  { max: 40, label: "Obesity, class 2", tone: "danger" as const },
  { max: Number.POSITIVE_INFINITY, label: "Obesity, class 3", tone: "danger" as const },
];

/** CDC classifies from BMI rounded to one decimal place, which is why its own
 *  table lists 169 lb at 5 ft 9 in as the first overweight row. */
function classify(bmiOneDecimal: number) {
  return CATEGORIES.find((category) => bmiOneDecimal < category.max) ?? CATEGORIES[CATEGORIES.length - 1]!;
}

export const bmi: Calculator = {
  id: "CALC-0897",
  slug: "bmi",
  name: "BMI Calculator",
  title: "BMI Calculator (Adults)",
  description:
    "Calculate adult body mass index in metric or imperial units and see the CDC weight category, with the healthy weight range for your height.",
  summary: "Adult body mass index with CDC categories.",
  category: { id: "C57", slug: "health", name: "Health & Nutrition" },
  keywords: ["body mass index", "bmi chart", "healthy weight", "bmi calculator metric"],
  verification: "source-verified",
  related: ["percentage-change", "mean"],
  updated: "2026-10-22",
  fields: [
    {
      kind: "select",
      name: "units",
      label: "Units",
      defaultValue: "metric",
      options: [
        { value: "metric", label: "Metric (kg, cm)" },
        { value: "imperial", label: "Imperial (lb, in)" },
      ],
    },
    {
      kind: "number",
      name: "weight",
      label: "Weight",
      min: 1,
      max: 700,
      step: 0.1,
      placeholder: "70",
      hint: "Kilograms in metric mode, pounds in imperial mode.",
    },
    {
      kind: "number",
      name: "height",
      label: "Height",
      min: 50,
      max: 260,
      step: 0.1,
      placeholder: "175",
      hint: "Centimetres in metric mode, total inches in imperial mode (5 ft 9 in = 69 in).",
    },
  ],
  compute(values) {
    const units = asString(values, "units");
    const weight = asNumber(values, "weight");
    const height = asNumber(values, "height");

    const weightKg = units === "imperial" ? weight * KG_PER_LB : weight;
    const heightM = units === "imperial" ? height * M_PER_IN : height / 100;

    if (heightM <= 0) {
      return { ok: false, errors: { height: "Height must be greater than zero." } };
    }

    const bmiRaw = weightKg / (heightM * heightM);
    const bmiRounded = Math.round(bmiRaw * 10) / 10;
    const category = classify(bmiRounded);

    const toDisplayWeight = (kg: number) => (units === "imperial" ? kg / KG_PER_LB : kg);
    const unitLabel = units === "imperial" ? "lb" : "kg";
    const healthyMin = toDisplayWeight(18.5 * heightM * heightM);
    const healthyMax = toDisplayWeight(24.9 * heightM * heightM);

    return {
      ok: true,
      outputs: [
        { label: "BMI", value: `${formatNumber(bmiRounded, { minFractionDigits: 1, maxFractionDigits: 1 })} kg/m²`, emphasis: true },
        {
          label: "Weight range for a healthy BMI",
          value: `${formatNumber(healthyMin, { maxFractionDigits: 1 })} – ${formatNumber(healthyMax, { maxFractionDigits: 1 })} ${unitLabel}`,
          hint: "Equivalent to a BMI of 18.5 to 24.9 at this height.",
        },
        {
          label: "Inputs converted",
          value: `${formatNumber(weightKg, { maxFractionDigits: 1 })} kg, ${formatNumber(heightM, { maxFractionDigits: 3 })} m`,
        },
      ],
      interpretation: {
        label: category.label,
        detail: `A BMI of ${formatNumber(bmiRounded, { minFractionDigits: 1, maxFractionDigits: 1 })} falls in the CDC adult category “${category.label}”.`,
        tone: category.tone,
      },
      notes: [
        "BMI is a screening measure, not a diagnosis. The CDC advises that it be considered alongside other health factors.",
        "Categories apply to adults aged 20 and over and are the same regardless of age, sex or race. Children and teenagers require age- and sex-specific percentiles, which this tool does not calculate.",
      ],
    };
  },
  formula: [
    { label: "BMI", expression: "BMI = weight (kg) ÷ height (m)²" },
    { label: "Imperial conversion", expression: "weight(kg) = lb × 0.45359237;  height(m) = in × 0.0254" },
  ],
  explanation: [
    "Body mass index divides weight in kilograms by the square of height in metres. Because height is squared, a small change in height moves BMI considerably — which is why the same weight can be classified differently at different heights.",
    "The CDC's published table classifies from BMI rounded to one decimal place. That detail matters at the boundaries: 169 lb at 5 ft 9 in computes to 24.95, which rounds to 25.0 and is therefore the first value in the overweight band, exactly as the CDC table states. This calculator reproduces that behaviour rather than comparing an unrounded value.",
    "Imperial inputs are converted with the exact factors 0.45359237 kg per pound and 0.0254 m per inch, then the metric formula is applied. This is more precise than the widely copied “703 × lb ÷ in²” shortcut, which is the same formula with a rounded constant.",
  ],
  assumptions: [
    "The person is an adult aged 20 or over.",
    "Height and weight are measured, not estimated.",
    "The CDC adult cut-points are used: under 18.5 underweight; 18.5 to under 25 healthy; 25 to under 30 overweight; 30 to under 35 class 1 obesity; 35 to under 40 class 2; 40 and above class 3.",
    "BMI is rounded to one decimal place before the category is assigned, matching the CDC's own tables.",
  ],
  cautions: [
    "BMI cannot distinguish muscle from fat, and it does not account for fat distribution. Athletes with high muscle mass are routinely classified as overweight.",
    "BMI is not valid for pregnancy, for children and adolescents, or for people whose height cannot be measured accurately (for example, some wheelchair users).",
    "This tool does not provide medical advice. Speak to a clinician about what a result means for you.",
  ],
  references: [
    {
      label: "CDC — Adult BMI Categories",
      url: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
      note: "Categories, adult-only scope and the screening disclaimer; reviewed 19 March 2024. Accessed 22 October 2026.",
    },
    {
      label: "NIST SP 811 Appendix B — conversion factors",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
      note: "Pound and inch definitions used for the unit conversion.",
    },
  ],
  example: {
    inputs: "70 kg, 175 cm",
    result: "22.9 kg/m² — healthy weight",
    working: "70 ÷ (1.75)² = 70 ÷ 3.0625 = 22.857 → 22.9 kg/m².",
  },
};
