import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { CalcOutcome, Calculator } from "@/lib/calculators/types";

const ABSOLUTE_ZERO = { c: -273.15, f: -459.67, k: 0, r: 0 };

function toCelsius(value: number, unit: string): number {
  switch (unit) {
    case "f":
      return ((value - 32) * 5) / 9;
    case "k":
      return value - 273.15;
    case "r":
      return ((value - 491.67) * 5) / 9;
    default:
      return value;
  }
}

export const temperatureConverter: Calculator = {
  id: "CALC-0961",
  slug: "temperature-converter",
  name: "Temperature Converter",
  title: "Temperature Converter (°C, °F, K, °R)",
  description:
    "Convert between Celsius, Fahrenheit, kelvin and Rankine, with absolute-zero validation and all four scales shown at once.",
  summary: "Convert °C, °F, K and °R with absolute-zero checks.",
  category: { id: "C61", slug: "unit-conversion", name: "Unit Conversion" },
  keywords: ["celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter", "rankine"],
  verification: "source-verified",
  related: ["length-converter", "wind-chill", "heat-index"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "value", label: "Temperature", step: 0.01, placeholder: "100" },
    {
      kind: "select",
      name: "from",
      label: "From",
      defaultValue: "c",
      options: [
        { value: "c", label: "Celsius (°C)" },
        { value: "f", label: "Fahrenheit (°F)" },
        { value: "k", label: "Kelvin (K)" },
        { value: "r", label: "Rankine (°R)" },
      ],
    },
  ],
  compute(values): CalcOutcome {
    const value = asNumber(values, "value");
    const from = asString(values, "from");
    const minimum = ABSOLUTE_ZERO[from as keyof typeof ABSOLUTE_ZERO];

    if (minimum === undefined) {
      return { ok: false, errors: { from: "Choose a temperature scale." } };
    }
    if (value < minimum) {
      return {
        ok: false,
        errors: { value: `That is below absolute zero, the lowest possible temperature on this scale (${minimum}).` },
      };
    }

    const c = toCelsius(value, from);
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;
    const r = (c + 273.15) * 1.8;

    return {
      ok: true,
      outputs: [
        { label: "Celsius", value: `${formatNumber(c, { maxFractionDigits: 4 })} °C`, emphasis: from !== "c" },
        { label: "Fahrenheit", value: `${formatNumber(f, { maxFractionDigits: 4 })} °F`, emphasis: from === "c" },
        { label: "Kelvin", value: `${formatNumber(k, { maxFractionDigits: 4 })} K` },
        { label: "Rankine", value: `${formatNumber(r, { maxFractionDigits: 4 })} °R` },
      ],
      notes: [
        "Temperature conversion is affine, not multiplicative: the scales have different zero points as well as different step sizes, which is why a simple multiply-by-a-factor shortcut gives wrong answers.",
      ],
    };
  },
  formula: [
    { label: "Celsius to Fahrenheit", expression: "°F = °C × 9/5 + 32" },
    { label: "Kelvin", expression: "K = °C + 273.15" },
    { label: "Rankine", expression: "°R = (°C + 273.15) × 9/5" },
  ],
  explanation: [
    "The four scales differ in two ways: the size of one degree and the position of zero. Celsius and kelvin share a degree size but have different zero points; Fahrenheit and Rankine share a degree size, and one Fahrenheit degree is 5/9 of a Celsius degree.",
    "Because of that, conversion is a linear transformation rather than a multiplication. Applying a ratio alone — treating °C to °F as “multiply by 1.8” — fails at the offset, which is why 0 °C is 32 °F and not 0 °F.",
    "Absolute zero is a hard physical limit, so inputs below it are rejected rather than converted: −273.15 °C, −459.67 °F, 0 K and 0 °R all describe the same state.",
  ],
  assumptions: [
    "The input is a thermodynamic temperature on the selected scale.",
    "The exact ice-point offset of 273.15 K is used, per the SI definition of the Celsius scale.",
    "Values below absolute zero are rejected as physically impossible.",
  ],
  cautions: [
    "Kelvin and Rankine are absolute scales and are written without a degree symbol (K, not °K).",
  ],
  references: [
    {
      label: "NIST SP 811 Appendix B.8 — temperature conversion",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8",
      note: "Defines t/°C = (t/°F − 32)/1.8 and T/K = (t/°F + 459.67)/1.8, and notes that temperature intervals convert differently from temperatures. Accessed 22 October 2026.",
    },
    {
      label: "BIPM — The International System of Units (SI), 9th edition",
      url: "https://www.bipm.org/en/publications/si-brochure/",
      note: "Definition of the kelvin and the Celsius scale (via NIST SP 811, which references this edition).",
    },
  ],
  example: {
    inputs: "100 °C",
    result: "212 °F, 373.15 K, 671.67 °R",
    working: "100 × 9/5 + 32 = 212 °F; 100 + 273.15 = 373.15 K; 373.15 × 1.8 = 671.67 °R.",
  },
};
