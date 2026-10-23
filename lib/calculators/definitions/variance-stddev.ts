import { asString } from "@/lib/calculators/validation";
import { formatNumber, parseLocaleNumber, splitNumberList } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

const MAX_VALUES = 10_000;

export const varianceStdDev: Calculator = {
  id: "CALC-0114",
  slug: "variance-stddev",
  name: "Standard Deviation Calculator",
  title: "Standard Deviation & Variance Calculator",
  description:
    "Calculate population or sample standard deviation and variance from a list of numbers, with the mean, count and squared deviations shown.",
  summary: "Population or sample standard deviation and variance.",
  category: { id: "C08", slug: "statistics", name: "Statistics & Probability" },
  keywords: ["standard deviation", "variance", "sigma", "sample", "population", "spread"],
  verification: "standard-math",
  related: ["mean", "percentage-difference"],
  updated: "2026-10-23",
  fields: [
    {
      kind: "text",
      name: "numbers",
      label: "Values",
      multiline: true,
      placeholder: "2, 4, 4, 4, 5, 5, 7, 9",
      hint: "Separate values with commas, spaces or new lines. Up to 10,000 values.",
      maxLength: 200_000,
      defaultValue: "",
    },
    {
      kind: "select",
      name: "dataset",
      label: "Are these values…",
      defaultValue: "population",
      options: [
        { value: "population", label: "The whole population (divide by N)" },
        { value: "sample", label: "A sample of a larger population (divide by n − 1)" },
      ],
      hint: "A sample uses Bessel's correction, so it gives a slightly larger and unbiased estimate.",
    },
  ],
  compute(values) {
    const tokens = splitNumberList(asString(values, "numbers"));
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

    const isSample = asString(values, "dataset") === "sample";
    const count = parsed.length;
    if (isSample && count < 2) {
      return {
        ok: false,
        errors: { numbers: "A sample standard deviation needs at least two values. Add another value, or choose the whole population." },
      };
    }

    const sum = parsed.reduce((total, value) => total + value, 0);
    const mean = sum / count;
    const squaredDeviations = parsed.map((value) => (value - mean) ** 2);
    const totalSquared = squaredDeviations.reduce((total, value) => total + value, 0);
    const divisor = isSample ? count - 1 : count;
    const variance = totalSquared / divisor;
    const standardDeviation = Math.sqrt(variance);
    const symbol = isSample ? "s" : "σ";

    return {
      ok: true,
      outputs: [
        {
          label: `Standard deviation (${symbol})`,
          value: formatNumber(standardDeviation, { maxFractionDigits: 8 }),
          emphasis: true,
        },
        { label: `Variance (${symbol}²)`, value: formatNumber(variance, { maxFractionDigits: 8 }) },
        { label: "Mean", value: formatNumber(mean, { maxFractionDigits: 8 }) },
        { label: "Count", value: formatNumber(count) },
        {
          label: "Working",
          value: `√(${formatNumber(totalSquared, { maxFractionDigits: 8 })} ÷ ${formatNumber(divisor)})`,
          hint: `${formatNumber(totalSquared, { maxFractionDigits: 8 })} is the sum of squared deviations from the mean.`,
        },
      ],
      notes: [
        isSample
          ? "A sample divides the squared deviations by n − 1 rather than n (Bessel's correction), so the result estimates the spread of the wider population rather than describing these values exactly."
          : "Population mode divides by N, so the result describes exactly this set of values. Use it only when your list is the entire group of interest.",
        "Standard deviation is in the same unit as the input values; variance is in that unit squared.",
        "Standard deviation is sensitive to outliers: a single extreme value can dominate the total of squared deviations.",
      ],
    };
  },
  formula: [
    { label: "Population standard deviation", expression: "σ = √( Σ(xᵢ − μ)² ÷ N )" },
    { label: "Sample standard deviation", expression: "s = √( Σ(xᵢ − x̄)² ÷ (n − 1) )" },
    { label: "Variance", expression: "σ² = Σ(xᵢ − μ)² ÷ N   (variance is the square of the standard deviation)" },
  ],
  explanation: [
    "Standard deviation measures how far the values in a set typically sit from their mean. Each value's distance from the mean is squared, the squares are averaged, and the square root returns the answer to the original unit.",
    "Squaring before averaging is what stops positive and negative deviations from cancelling out: a value 3 below the mean and one 3 above both contribute 9. Taking the square root at the end puts the measure back in the same units as the data, which is why it is usually reported alongside a mean.",
    "The choice of divisor matters. Dividing by N describes the spread of the values you have. Dividing by n − 1 applies Bessel's correction, which makes the sample value an unbiased estimate of the spread of a larger population — the usual choice when your list is a sample rather than everything.",
  ],
  assumptions: [
    "The values are a single list of numeric observations; each is weighted equally.",
    "The list is either the complete population of interest or a sample drawn from it, and the matching divisor has been chosen deliberately.",
    "Arithmetic is performed in double precision; results are displayed to eight decimal places without rounding the stored value.",
  ],
  cautions: [
    "Standard deviation assumes a roughly bell-shaped distribution for the 68–95–99.7 interpretation to hold; for skewed data, a range or interquartile range can describe the spread better.",
    "A sample standard deviation from fewer than about 30 values is itself uncertain; it is an estimate, not a fixed property of the population.",
    "This tool does not calculate a confidence interval or a standard error of the mean.",
  ],
  references: [
    {
      label: "Wikipedia — Standard deviation",
      url: "https://en.wikipedia.org/wiki/Standard_deviation",
      note: "Definitions of population and sample standard deviation, the role of Bessel's correction, and the eight-value worked example used in this page's tests. Accessed 23 October 2026.",
    },
  ],
  example: {
    inputs: "2, 4, 4, 4, 5, 5, 7, 9 (whole population)",
    result: "σ = 2",
    working:
      "Mean = 40 ÷ 8 = 5. Squared deviations: 9, 1, 1, 1, 0, 0, 4, 16 → sum = 32. Variance = 32 ÷ 8 = 4. σ = √4 = 2.",
  },
};
