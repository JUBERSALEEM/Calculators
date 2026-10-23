import { asNumber } from "@/lib/calculators/validation";
import { formatNumber, formatSignedPercent } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

export const percentageChange: Calculator = {
  id: "CALC-0002",
  slug: "percentage-change",
  name: "Percentage Change",
  title: "Percentage Change Calculator (Increase & Decrease)",
  description:
    "Calculate the percentage increase or decrease between two values, with the absolute change and a worked formula.",
  summary: "Measure the rise or fall from an old value to a new one.",
  category: { id: "C01", slug: "basic-arithmetic", name: "Basic Arithmetic & Percentages" },
  keywords: ["percent increase", "percent decrease", "percentage difference over time", "growth rate"],
  verification: "standard-math",
  related: ["percentage-of-a-number", "percentage-difference", "percentage-point-change"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "oldValue", label: "Original value", placeholder: "80", hint: "The starting value. Must not be zero." },
    { kind: "number", name: "newValue", label: "New value", placeholder: "100" },
  ],
  compute(values) {
    const oldValue = asNumber(values, "oldValue");
    const newValue = asNumber(values, "newValue");

    if (oldValue === 0) {
      return {
        ok: false,
        errors: {
          oldValue:
            "Percentage change is undefined when the original value is 0, because it divides by the original value.",
        },
      };
    }

    const change = newValue - oldValue;
    const percentChange = (change / Math.abs(oldValue)) * 100;
    const direction = change === 0 ? "No change" : change > 0 ? "Increase" : "Decrease";

    return {
      ok: true,
      outputs: [
        { label: "Percentage change", value: formatSignedPercent(percentChange, 4), emphasis: true },
        { label: "Absolute change", value: formatNumber(change, { maxFractionDigits: 6 }), hint: `${direction} from ${formatNumber(oldValue, { maxFractionDigits: 6 })}.` },
        {
          label: "Working",
          value: `(${formatNumber(newValue, { maxFractionDigits: 6 })} − ${formatNumber(oldValue, { maxFractionDigits: 6 })}) ÷ |${formatNumber(oldValue, { maxFractionDigits: 6 })}| × 100`,
        },
      ],
      interpretation: {
        label: direction,
        detail:
          change === 0
            ? "The two values are identical, so the percentage change is zero."
            : `The value moved by ${formatNumber(Math.abs(change), { maxFractionDigits: 6 })} units, which is ${formatNumber(Math.abs(percentChange), { maxFractionDigits: 2 })}% of the original magnitude.`,
        tone: change === 0 ? "neutral" : change > 0 ? "positive" : "caution",
      },
      notes: [
        "The denominator is the magnitude of the original value, so the sign of the change is never inverted by a negative starting point.",
      ],
    };
  },
  formula: [{ label: "Percentage change", expression: "change % = ((new − old) ÷ |old|) × 100" }],
  explanation: [
    "Percentage change expresses a movement between two values as a fraction of the starting value. Subtracting the old value from the new one gives the absolute change; dividing by the magnitude of the old value and multiplying by 100 turns that into a percentage.",
    "This is deliberately not the same calculation as percentage difference. Change has a fixed base — the original value — so a change from 100 to 120 is +20%, while the reverse change from 120 to 100 is −16.67%. Percentage difference uses the mean of the two values as its base and is symmetric.",
  ],
  assumptions: [
    "The original value is the reference base for the comparison.",
    "The magnitude |old| is used as the denominator so that a negative base does not flip the direction of the reported change.",
    "Percentage change is undefined when the original value is zero.",
  ],
  cautions: [
    "A percentage change is not interchangeable with a percentage-point change. Going from 10% to 12% is a 2 percentage-point rise but a 20% relative increase.",
  ],
  references: [
    { label: "Relative change and difference", url: "https://en.wikipedia.org/wiki/Relative_change_and_difference", note: "Formulae for relative change and percentage difference." },
  ],
  example: {
    inputs: "Old value 80, new value 100",
    result: "+25%",
    working: "(100 − 80) ÷ |80| × 100 = 20 ÷ 80 × 100 = 25%",
  },
};
