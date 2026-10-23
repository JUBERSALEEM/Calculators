import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

/** Factors are exact for the imperial/SI definitions (NIST SP 811 Appendix B). */
export const LENGTH_UNITS = [
  { value: "mm", label: "Millimetre (mm)", metres: 0.001, exact: true },
  { value: "cm", label: "Centimetre (cm)", metres: 0.01, exact: true },
  { value: "m", label: "Metre (m)", metres: 1, exact: true },
  { value: "km", label: "Kilometre (km)", metres: 1000, exact: true },
  { value: "in", label: "Inch (in)", metres: 0.0254, exact: true },
  { value: "ft", label: "Foot (ft)", metres: 0.3048, exact: true },
  { value: "yd", label: "Yard (yd)", metres: 0.9144, exact: true },
  { value: "mi", label: "Mile (mi)", metres: 1609.344, exact: true },
  { value: "nmi", label: "Nautical mile (nmi)", metres: 1852, exact: true },
] as const;

export const lengthConverter: Calculator = {
  id: "CALC-0957",
  slug: "length-converter",
  name: "Length Converter",
  title: "Length Converter (Metric & Imperial)",
  description:
    "Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards, miles and nautical miles using exact SI definitions.",
  summary: "Convert nine length units at once with exact factors.",
  category: { id: "C61", slug: "unit-conversion", name: "Unit Conversion" },
  keywords: ["cm to inches", "metres to feet", "km to miles", "length conversion"],
  verification: "source-verified",
  related: ["temperature-converter", "percentage-of-a-number"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "value", label: "Value", step: 0.000001, placeholder: "1" },
    {
      kind: "select",
      name: "from",
      label: "From",
      defaultValue: "mi",
      options: LENGTH_UNITS.map((unit) => ({ value: unit.value, label: unit.label })),
    },
    {
      kind: "select",
      name: "to",
      label: "To",
      defaultValue: "km",
      options: LENGTH_UNITS.map((unit) => ({ value: unit.value, label: unit.label })),
    },
  ],
  compute(values) {
    const value = asNumber(values, "value");
    const from = asString(values, "from");
    const to = asString(values, "to");
    const fromUnit = LENGTH_UNITS.find((unit) => unit.value === from);
    const toUnit = LENGTH_UNITS.find((unit) => unit.value === to);

    if (!fromUnit || !toUnit) {
      return { ok: false, errors: { from: "Choose a valid unit." } };
    }

    const metres = value * fromUnit.metres;
    const converted = metres / toUnit.metres;

    return {
      ok: true,
      outputs: [
        {
          label: `${formatNumber(value, { maxFractionDigits: 8 })} ${fromUnit.label.match(/\(([^)]+)\)/)?.[1] ?? from}`,
          value: `${formatNumber(converted, { maxFractionDigits: 8 })} ${toUnit.label.match(/\(([^)]+)\)/)?.[1] ?? to}`,
          emphasis: true,
        },
        ...LENGTH_UNITS.filter((unit) => unit.value !== from).map((unit) => ({
          label: `In ${unit.label}`,
          value: formatNumber(metres / unit.metres, { maxFractionDigits: 8 }),
        })),
      ],
      notes: [
        "All fourteen imperial and metric definitions used here are exact, so the only rounding applied is for display.",
        "The nautical mile is exactly 1852 m by definition; it is not a rounded version of the statute mile.",
      ],
    };
  },
  formula: [
    { label: "Via the metre", expression: "result = (value × factor_from) ÷ factor_to" },
    { label: "Exact definitions", expression: "1 in = 0.0254 m;  1 ft = 0.3048 m;  1 yd = 0.9144 m;  1 mi = 1609.344 m;  1 nmi = 1852 m" },
  ],
  explanation: [
    "Every length conversion is performed in two steps: multiply by the factor that expresses the source unit in metres, then divide by the factor that expresses the target unit in metres. Routing everything through a single base unit prevents the drift that accumulates when dozens of pairwise factors are maintained separately.",
    "The imperial definitions are exact rather than measured: the international inch is defined as exactly 25.4 mm, which fixes the foot, yard and mile. The nautical mile is separately defined as exactly 1852 m.",
  ],
  assumptions: [
    "The international (post-1959) definitions of the inch, foot, yard and mile are used, not the older US survey foot.",
    "The value is a length, not an area or a volume; areas and volumes scale with the square and cube of these factors.",
    "Conversions are dimensionless arithmetic; no significant-figure truncation is applied to the displayed result beyond formatting.",
  ],
  cautions: [
    "The US survey foot (1200/3937 m) differs from the international foot by about 2 parts per million. It was retired for most federal mapping purposes in 2023 but may still appear in older survey records.",
  ],
  references: [
    {
      label: "NIST SP 811 Appendix B.8 — Factors for units listed alphabetically",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
      note: "foot = 0.3048 m (exact), foot (US survey) = 0.304006 m, and the general table convention that boldface factors are exact. Accessed 22 October 2026.",
    },
    {
      label: "NIST SP 811 — Guide for the Use of the International System of Units (SI)",
      url: "https://www.nist.gov/pml/special-publication-811",
      note: "Scope and edition notes for the conversion-factor tables (2008 edition; superseded for SI definitions by SP 330 / the 9th SI Brochure).",
    },
  ],
  example: {
    inputs: "1 mile to kilometres",
    result: "1.609344 km",
    working: "1 mi × 1609.344 m/mi = 1609.344 m; 1609.344 ÷ 1000 = 1.609344 km.",
  },
};
