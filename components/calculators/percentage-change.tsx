"use client";

import * as React from "react";
import { percentageChange } from "@/calculators/percentage-change/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatPercent } from "@/lib/format/number";

export function PercentageChangeCalculator() {
  const [old, setOld] = React.useState("");
  const [newV, setNewV] = React.useState("");
  const [result, setResult] = React.useState<{ changePct: number } | null>(null);
  const [notice, setNotice] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (old.trim() === "" || newV.trim() === "") {
      setNotice({ title: "Missing input", children: "Please fill in both the old and new values." });
      setResult(null);
      return;
    }
    const o = Number(old.replace(/,/g, "."));
    const n = Number(newV.replace(/,/g, "."));
    if (!Number.isFinite(o) || !Number.isFinite(n)) {
      setNotice({ title: "Invalid input", children: "Enter valid numbers for both fields." });
      setResult(null);
      return;
    }
    const calc = percentageChange({ old: o, new: n });
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
          <NumberField id="old" label="Old value" value={old} onChange={setOld} helper="e.g. 100" />
          <NumberField id="newV" label="New value" value={newV} onChange={setNewV} helper="e.g. 120" />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <ResultCard label="Change vs old value" value={formatPercent(result.changePct)} highlight />
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
