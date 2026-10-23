import { asNumber } from "@/lib/calculators/validation";
import { formatNumber, formatSignedPercent } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

export const percentagePointChange: Calculator = {
  id: "CALC-0004",
  slug: "percentage-point-change",
  name: "Percentage Point Change",
  title: "Percentage Point Change Calculator",
  description:
    "Separate a percentage-point move from a relative percentage change and see both figures side by side, with basis points for rate changes.",
  summary: "Distinguish points from percent when rates move.",
  category: { id: "C01", slug: "basic-arithmetic", name: "Basic Arithmetic & Percentages" },
  keywords: ["percentage points", "pp change", "basis points", "rate rise"],
  verification: "standard-math",
  related: ["percentage-change", "percentage-of-a-number"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "firstRate", label: "First rate", unit: "%", placeholder: "10", hint: "Already expressed as a percentage." },
    { kind: "number", name: "secondRate", label: "Second rate", unit: "%", placeholder: "12" },
  ],
  compute(values) {
    const firstRate = asNumber(values, "firstRate");
    const secondRate = asNumber(values, "secondRate");
    const points = secondRate - firstRate;
    const relative = firstRate === 0 ? null : (points / Math.abs(firstRate)) * 100;

    return {
      ok: true,
      outputs: [
        { label: "Change in percentage points", value: `${points > 0 ? "+" : points < 0 ? "−" : ""}${formatNumber(Math.abs(points), { maxFractionDigits: 4 })} pp`, emphasis: true },
        {
          label: "Relative change",
          value: relative === null ? "Undefined" : formatSignedPercent(relative, 4),
          hint: relative === null ? "The first rate is 0%, so a relative change cannot be expressed." : "The point change as a proportion of the first rate.",
        },
        { label: "Basis points", value: `${points > 0 ? "+" : points < 0 ? "−" : ""}${formatNumber(Math.abs(points) * 100, { maxFractionDigits: 2 })} bp`, hint: "One basis point is 0.01 percentage points." },
      ],
      interpretation: {
        label: `${formatNumber(firstRate, { maxFractionDigits: 4 })}% to ${formatNumber(secondRate, { maxFractionDigits: 4 })}%`,
        detail:
          relative === null
            ? "The move is a change in percentage points; a relative change from zero is undefined."
            : `That is a ${formatNumber(Math.abs(points), { maxFractionDigits: 4 })} percentage-point move and a ${formatNumber(Math.abs(relative), { maxFractionDigits: 2 })}% relative change.`,
        tone: points === 0 ? "neutral" : points > 0 ? "positive" : "caution",
      },
    };
  },
  formula: [
    { label: "Percentage points", expression: "points = second rate − first rate" },
    { label: "Relative change", expression: "relative % = (points ÷ |first rate|) × 100" },
  ],
  explanation: [
    "A percentage point is the unit of the difference between two percentages. If an interest rate rises from 10% to 12%, it has risen by 2 percentage points. The relative change is different: the rate has grown by 20% of its former value.",
    "News reports and product claims often blur the two. Saying a rate “rose 2%” when it moved from 10% to 12% understates the move; saying “rose 2 percentage points” is precise. This tool shows both so the distinction is explicit.",
  ],
  assumptions: [
    "Both inputs are already percentages in the range 0–100 (or a rate expressed in percent).",
    "Basis points are computed as 100 × percentage points.",
  ],
  cautions: [
    "A relative change is undefined when the starting rate is zero.",
  ],
  references: [
    { label: "Percentage point", url: "https://en.wikipedia.org/wiki/Percentage_point", note: "Definition; 100 basis points = 1 percentage point." },
  ],
  example: {
    inputs: "10% → 12%",
    result: "+2 pp, +20% relative",
    working: "12 − 10 = 2 percentage points; (2 ÷ 10) × 100 = 20% relative change.",
  },
};
