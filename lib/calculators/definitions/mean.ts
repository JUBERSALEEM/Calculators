import { formatNumber, splitNumberList, parseLocaleNumber } from "@/lib/format";
import { asString } from "@/lib/calculators/validation";
import type { Calculator } from "@/lib/calculators/types";

const MAX_VALUES = 10_000;

export const mean: Calculator = {
  id: "CALC-0111",
  slug: "mean",
  name: "Mean Calculator",
  title: "Mean (Average) Calculator",
  description:
    "Calculate the arithmetic mean of any list of numbers, with the count and sum shown so the result can be checked by hand.",
  summary: "Average a list of numbers and see the sum behind it.",
  category: { id: "C08", slug: "statistics", name: "Statistics & Probability" },
  keywords: ["average calculator", "arithmetic mean", "mean of numbers"],
  verification: "standard-math",
  related: ["variance-stddev", "percentage-change"],
  updated: "2026-10-22",
  fields: [
    {
      kind: "text",
      name: "numbers",
      label: "Numbers",
      multiline: true,
      placeholder: "4, 8, 15, 16, 23, 42",
      hint: "Separate values with commas, spaces or new lines. Up to 10,000 values.",
      maxLength: 200_000,
      defaultValue: "",
    },
  ],
  compute(values) {
    const raw = asString(values, "numbers");
    const tokens = splitNumberList(raw);

    if (tokens.length === 0) {
      return { ok: false, errors: { numbers: "Enter at least one number." } };
    }
    if (tokens.length > MAX_VALUES) {
      return { ok: false, errors: { numbers: `Enter no more than ${MAX_VALUES.toLocaleString("en-US")} numbers at once.` } };
    }

    const parsed: number[] = [];
    for (const token of tokens) {
      const value = parseLocaleNumber(token);
      if (value === null) {
        return { ok: false, errors: { numbers: `“${token.slice(0, 24)}” is not a valid number.` } };
      }
      parsed.push(value);
    }

    const count = parsed.length;
    const sum = parsed.reduce((total, value) => total + value, 0);
    const average = sum / count;
    const sorted = [...parsed].sort((a, b) => a - b);
    const min = sorted[0] ?? 0;
    const max = sorted[sorted.length - 1] ?? 0;

    return {
      ok: true,
      outputs: [
        { label: "Mean", value: formatNumber(average, { maxFractionDigits: 8 }), emphasis: true },
        { label: "Count", value: formatNumber(count) },
        { label: "Sum", value: formatNumber(sum, { maxFractionDigits: 8 }) },
        { label: "Smallest", value: formatNumber(min, { maxFractionDigits: 8 }) },
        { label: "Largest", value: formatNumber(max, { maxFractionDigits: 8 }) },
        { label: "Working", value: `${formatNumber(sum, { maxFractionDigits: 8 })} ÷ ${formatNumber(count)}` },
      ],
      notes: [
        "This is the arithmetic mean. It is sensitive to very large or very small values: a single outlier can move it substantially.",
      ],
    };
  },
  formula: [{ label: "Arithmetic mean", expression: "mean = (x₁ + x₂ + … + xₙ) ÷ n" }],
  explanation: [
    "The arithmetic mean adds every value and divides by how many there are. It is the most common “average”, and it is the right choice when each value should carry equal weight.",
    "Because every value contributes additively, the mean is pulled towards outliers. For skewed data — incomes, house prices, response times — the median is often a better summary. This tool reports the smallest and largest values so an outlier is visible rather than hidden.",
  ],
  assumptions: [
    "All entries are numbers in the same unit.",
    "Each value carries equal weight; this is not a weighted average.",
    "The empty string and whitespace are ignored; an empty list is an error rather than a zero result.",
  ],
  references: [
    { label: "Arithmetic mean", url: "https://en.wikipedia.org/wiki/Arithmetic_mean", note: "Definition of the arithmetic mean." },
  ],
  example: {
    inputs: "4, 8, 15, 16, 23, 42",
    result: "18",
    working: "(4 + 8 + 15 + 16 + 23 + 42) ÷ 6 = 108 ÷ 6 = 18",
  },
};
