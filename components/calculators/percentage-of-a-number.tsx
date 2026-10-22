"use client";

import * as React from "react";
import { percentageOfANumber } from "@/calculators/percentage-of-a-number/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatNumber } from "@/lib/format/number";

export function PercentageOfANumberCalculator() {
  const [base, setBase] = React.useState("");
  const [percent, setPercent] = React.useState("");
  const [result, setResult] = React.useState<{ portion: number } | null>(null);
  const [notice, setNotice] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (base.trim() === "" || percent.trim() === "") {
      setNotice({ title: "Missing input", children: "Please fill in both the base amount and the percent." });
      setResult(null);
      return;
    }
    const b = Number(base.replace(/,/g, "."));
    const p = Number(percent.replace(/,/g, "."));
    if (!Number.isFinite(b) || !Number.isFinite(p)) {
      setNotice({ title: "Invalid input", children: "Enter valid numbers for both fields." });
      setResult(null);
      return;
    }
    const calc = percentageOfANumber({ base: b, percent: p });
    if (calc.ok) {
      setResult(calc.value);
      setNotice(null);
    } else {
      setNotice({ title: "Invalid input", children: calc.error });
      setResult(null);
    }
  };

  return (
    <CalculatorShell
      controls={
        <>
          <NumberField id="base" label="Base amount" value={base} onChange={setBase} helper="e.g. 200" />
          <NumberField id="percent" label="Percent" unit="%" value={percent} onChange={setPercent} helper="e.g. 15" />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <ResultCard label="Portion" value={formatNumber(result.portion)} highlight />
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
