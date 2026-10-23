import { asNumber } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

export const percentageDifference: Calculator = {
  id: "CALC-0003",
  slug: "percentage-difference",
  name: "Percentage Difference",
  title: "Percentage Difference Calculator",
  description:
    "Compare two values with the symmetric percentage difference, where neither value is treated as the starting point.",
  summary: "Compare two values symmetrically, with no base value.",
  category: { id: "C01", slug: "basic-arithmetic", name: "Basic Arithmetic & Percentages" },
  keywords: ["percent difference", "compare two numbers", "symmetric percentage"],
  verification: "standard-math",
  related: ["percentage-change", "percentage-of-a-number"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "valueA", label: "First value", placeholder: "100" },
    { kind: "number", name: "valueB", label: "Second value", placeholder: "120" },
  ],
  compute(values) {
    const valueA = asNumber(values, "valueA");
    const valueB = asNumber(values, "valueB");
    const mean = (valueA + valueB) / 2;

    if (mean === 0) {
      return {
        ok: false,
        errors: {
          valueB: "Percentage difference is undefined when the two values average to zero (for example 50 and −50).",
        },
      };
    }

    const difference = Math.abs(valueA - valueB);
    const percentDifference = (difference / Math.abs(mean)) * 100;
    const identical = difference === 0;

    return {
      ok: true,
      outputs: [
        { label: "Percentage difference", value: `${formatNumber(percentDifference, { maxFractionDigits: 4 })}%`, emphasis: true },
        { label: "Absolute difference", value: formatNumber(difference, { maxFractionDigits: 6 }) },
        { label: "Average of the two values", value: formatNumber(mean, { maxFractionDigits: 6 }), hint: "Used as the common base." },
      ],
      interpretation: identical
        ? { label: "Identical values", detail: "Both values are the same, so the difference is zero.", tone: "neutral" }
        : {
            label: "Symmetric comparison",
            detail: "Neither value is treated as the starting point, which is why swapping the two inputs produces the same answer.",
            tone: "neutral",
          },
    };
  },
  formula: [{ label: "Percentage difference", expression: "difference % = (|A − B| ÷ |(A + B) ÷ 2|) × 100" }],
  explanation: [
    "Percentage difference compares two measurements of the same kind without declaring either one correct. It divides the absolute gap between them by their average, so the result is symmetric: swapping A and B changes nothing.",
    "Use percentage change instead when one value genuinely happens before the other — a price before and after a rise, for example. Use percentage difference when comparing two instruments, two batches, or two estimates where neither is authoritative.",
  ],
  assumptions: [
    "Both values measure the same quantity in the same units.",
    "Neither value is treated as a reference or a starting point.",
    "The result is undefined when the two values average to zero.",
  ],
  cautions: [
    "Because the denominator is the mean, percentage difference is always smaller than the percentage change computed from the lower value. A 100 versus 120 comparison is 18.18% by difference but 20% by change.",
  ],
  references: [
    { label: "Relative change and difference", url: "https://en.wikipedia.org/wiki/Relative_change_and_difference", note: "Symmetric percentage difference formula." },
  ],
  example: {
    inputs: "A = 100, B = 120",
    result: "18.18%",
    working: "|100 − 120| ÷ ((100 + 120) ÷ 2) × 100 = 20 ÷ 110 × 100 = 18.18%",
  },
};
