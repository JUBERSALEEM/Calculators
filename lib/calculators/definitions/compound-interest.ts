import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

const FREQUENCIES: Record<string, { periods: number; label: string }> = {
  annually: { periods: 1, label: "Annually" },
  semiannually: { periods: 2, label: "Semi-annually" },
  quarterly: { periods: 4, label: "Quarterly" },
  monthly: { periods: 12, label: "Monthly" },
  weekly: { periods: 52, label: "Weekly" },
  daily: { periods: 365, label: "Daily" },
  continuous: { periods: 0, label: "Continuously" },
};

export const compoundInterest: Calculator = {
  id: "CALC-0157",
  slug: "compound-interest",
  name: "Compound Interest",
  title: "Compound Interest Calculator",
  description:
    "Project a balance with compound interest at any compounding frequency, including continuous compounding, with interest earned and effective annual rate.",
  summary: "Grow a balance with periodic or continuous compounding.",
  category: { id: "C10", slug: "money", name: "Money & Interest" },
  keywords: ["compound interest", "future value", "savings growth", "effective annual rate", "APY"],
  verification: "standard-math",
  related: ["mean", "percentage-change"],
  updated: "2026-10-22",
  fields: [
    { kind: "number", name: "principal", label: "Starting amount", min: 0, max: 1e12, placeholder: "10000" },
    { kind: "number", name: "annualRate", label: "Annual interest rate", unit: "%", min: 0, max: 1000, placeholder: "5", hint: "Nominal annual rate, before compounding." },
    { kind: "number", name: "years", label: "Years", min: 0, max: 200, step: 0.01, placeholder: "10" },
    {
      kind: "select",
      name: "frequency",
      label: "Compounding",
      defaultValue: "monthly",
      options: Object.entries(FREQUENCIES).map(([value, meta]) => ({ value, label: meta.label })),
    },
  ],
  compute(values) {
    const principal = asNumber(values, "principal");
    const annualRate = asNumber(values, "annualRate");
    const years = asNumber(values, "years");
    const frequencyKey = asString(values, "frequency");
    const frequency = FREQUENCIES[frequencyKey];

    if (!frequency) {
      return { ok: false, errors: { frequency: "Choose a compounding frequency." } };
    }

    const rate = annualRate / 100;
    const balance =
      frequency.periods === 0
        ? principal * Math.exp(rate * years)
        : principal * Math.pow(1 + rate / frequency.periods, frequency.periods * years);

    const interest = balance - principal;
    const effectiveAnnual =
      frequency.periods === 0 ? Math.exp(rate) - 1 : Math.pow(1 + rate / frequency.periods, frequency.periods) - 1;

    return {
      ok: true,
      outputs: [
        { label: `Balance after ${formatNumber(years, { maxFractionDigits: 2 })} years`, value: formatNumber(balance, { maxFractionDigits: 2 }), emphasis: true },
        { label: "Interest earned", value: formatNumber(interest, { maxFractionDigits: 2 }) },
        { label: "Effective annual rate", value: `${formatNumber(effectiveAnnual * 100, { maxFractionDigits: 4 })}%`, hint: "The actual yearly growth after compounding." },
        {
          label: "Formula used",
          value:
            frequency.periods === 0
              ? "FV = P × e^(r × t)"
              : `FV = P × (1 + r ÷ ${frequency.periods})^(${frequency.periods} × t)`,
        },
      ],
      notes: [
        "Interest is credited and left to compound. No deposits, withdrawals, fees or taxes are modelled.",
      ],
    };
  },
  formula: [
    { label: "Periodic compounding", expression: "FV = P × (1 + r ÷ n)^(n × t)" },
    { label: "Continuous compounding", expression: "FV = P × e^(r × t)" },
    { label: "Effective annual rate", expression: "EAR = (1 + r ÷ n)^n − 1" },
  ],
  explanation: [
    "Compound interest means each period's interest is added to the balance, so later periods earn interest on the interest already earned. The formula applies the per-period rate n times per year for t years.",
    "As n grows the balance approaches the continuous-compounding limit P·e^(r·t). The difference between monthly and continuous compounding is small — at a 5% nominal rate, the effective annual rate is 5.116% monthly and 5.127% continuous — but it compounds over long horizons.",
    "The effective annual rate (also called APY) makes nominal rates comparable: it converts a nominal rate with any compounding frequency into the single yearly growth factor actually applied to the balance.",
  ],
  assumptions: [
    "The nominal annual rate is constant for the whole term.",
    "No additional contributions or withdrawals are made after the initial deposit.",
    "Fees, taxes and inflation are not included; the result is a nominal balance, not purchasing power.",
    "Interest is credited at the end of each period and immediately compounds.",
  ],
  cautions: [
    "A 365-day year is assumed for daily compounding. Actual products may use 360-day or actual/actual conventions, which produce slightly different results.",
    "This is not a savings projection: rates change, and a fixed rate for 200 years is not a realistic scenario.",
  ],
  references: [
    { label: "Compound interest", url: "https://en.wikipedia.org/wiki/Compound_interest", note: "Periodic and continuous compounding formulae; effective annual rate." },
    {
      label: "CFPB Regulation Z, Appendix J — annual percentage rate computations",
      url: "https://www.consumerfinance.gov/rules-policy/regulations/1026/J/",
      note: "Background on how US consumer credit rules define and compute rates; not used in this calculation.",
    },
  ],
  example: {
    inputs: "10,000 at 5% for 10 years, compounded monthly",
    result: "16,470.09",
    working: "10,000 × (1 + 0.05 ÷ 12)^(12 × 10) = 10,000 × 1.647009… = 16,470.09",
  },
};
