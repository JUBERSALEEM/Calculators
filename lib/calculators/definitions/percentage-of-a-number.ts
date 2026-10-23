import { asNumber } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

export const percentageOfANumber: Calculator = {
  id: "CALC-0001",
  slug: "percentage-of-a-number",
  name: "Percentage of a Number",
  title: "Percentage of a Number Calculator",
  description:
    "Work out what a percentage of any number is, with the arithmetic shown step by step. Handles negative values and decimals.",
  summary: "Find what X% of a number is, e.g. 15% of 240.",
  category: { id: "C01", slug: "basic-arithmetic", name: "Basic Arithmetic & Percentages" },
  keywords: ["percent of", "percentage calculator", "x percent of y", "portion"],
  verification: "standard-math",
  related: ["percentage-change", "percentage-difference", "percentage-point-change"],
  updated: "2026-10-22",
  fields: [
    {
      kind: "number",
      name: "percent",
      label: "Percentage",
      unit: "%",
      placeholder: "15",
      hint: "Negative percentages are allowed and produce a negative portion.",
    },
    {
      kind: "number",
      name: "base",
      label: "Of value",
      placeholder: "240",
      hint: "The number you are taking a percentage of.",
    },
  ],
  compute(values) {
    const percent = asNumber(values, "percent");
    const base = asNumber(values, "base");
    const portion = (percent / 100) * base;

    return {
      ok: true,
      outputs: [
        { label: `${formatNumber(percent, { maxFractionDigits: 6 })}% of ${formatNumber(base, { maxFractionDigits: 6 })}`, value: formatNumber(portion, { maxFractionDigits: 6 }), emphasis: true },
        { label: "Calculation", value: `(${formatNumber(percent, { maxFractionDigits: 6 })} ÷ 100) × ${formatNumber(base, { maxFractionDigits: 6 })}` },
        { label: "Remaining amount", value: formatNumber(base - portion, { maxFractionDigits: 6 }), hint: "The base minus the portion." },
      ],
    };
  },
  formula: [{ label: "Percentage of a number", expression: "portion = (percentage ÷ 100) × base" }],
  explanation: [
    "A percentage is a fraction with a denominator of 100. Finding a percentage of a number is therefore a two-step operation: divide the percentage by 100 to express it as a decimal, then multiply by the base value.",
    "Because the operation is a plain multiplication, it is defined for every finite input, including negative percentages and negative bases. The sign of the result follows the ordinary rules of multiplication, which is why 15% of −240 is −36 rather than 36.",
  ],
  assumptions: [
    "The percentage is interpreted as “parts per hundred” of the base value — the standard definition.",
    "No tax, discount or rounding rules are applied; the result is the exact product, rounded only for display.",
  ],
  references: [
    { label: "Percentage — definition and notation", url: "https://en.wikipedia.org/wiki/Percentage", note: "Definition used: a ratio expressed as a fraction of 100." },
  ],
  example: {
    inputs: "15% of 240",
    result: "36",
    working: "(15 ÷ 100) × 240 = 0.15 × 240 = 36",
  },
};
