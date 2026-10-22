"use client";

import * as React from "react";
import { percentageDifference } from "@/calculators/percentage-difference/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatNumber, formatPercent } from "@/lib/format/number";

export function PercentageDifferenceCalculator() {
  const [a, setA] = React.useState("");
  const [b, setB] = React.useState("");
  const [result, setResult] = React.useState<{ differencePct: number; mean: number } | null>(null);
  const [notice, setNotice] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (a.trim() === "" || b.trim() === "") {
      setNotice({ title: "Missing input", children: "Please fill in both values." });
      setResult(null);
      return;
    }
    const av = Number(a.replace(/,/g, "."));
    const bv = Number(b.replace(/,/g, "."));
    if (!Number.isFinite(av) || !Number.isFinite(bv)) {
      setNotice({ title: "Invalid input", children: "Enter valid numbers for both fields." });
      setResult(null);
      return;
    }
    const calc = percentageDifference({ a: av, b: bv });
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
          <NumberField id="pa" label="Value A" value={a} onChange={setA} helper="e.g. 100" />
          <NumberField id="pb" label="Value B" value={b} onChange={setB} helper="e.g. 120" />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <>
            <ResultCard label="Difference vs mean" value={formatPercent(result.differencePct)} highlight />
            <ResultCard label="Mean of A and B" value={formatNumber(result.mean)} />
          </>
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
