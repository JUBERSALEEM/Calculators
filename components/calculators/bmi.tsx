"use client";

import * as React from "react";
import { bmi } from "@/calculators/bmi/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { Callout } from "@/components/ui/callout";
import { formatNumber } from "@/lib/format/number";

export function BMICalculator() {
  const [weight, setWeight] = React.useState("");
  const [ft, setFt] = React.useState("");
  const [inches, setInches] = React.useState("");
  const [result, setResult] = React.useState<{ bmi: number; category: string } | null>(null);
  const [notice, setNotice] = React.useState<{ type: "error"; title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (weight.trim() === "" || ft.trim() === "" || inches.trim() === "") {
      setNotice({ type: "error", title: "Missing input", children: "Please fill in weight and height." });
      setResult(null);
      return;
    }
    const w = Number(weight.replace(/,/g, "."));
    const f = Number(ft.replace(/,/g, "."));
    const i = Number(inches.replace(/,/g, "."));
    if (!Number.isFinite(w) || !Number.isFinite(f) || !Number.isFinite(i)) {
      setNotice({ type: "error", title: "Invalid input", children: "Enter valid numbers for all fields." });
      setResult(null);
      return;
    }
    const calc = bmi({ weightLb: w, heightFt: f, heightIn: i });
    if (calc.ok) {
      setResult(calc.value);
      setNotice(null);
    } else {
      setNotice({ type: "error", title: "Invalid input", children: calc.error });
      setResult(null);
    }
  };

  return (
    <CalculatorShell
      controls={
        <>
          <NumberField id="weight" label="Weight" unit="lb" value={weight} onChange={setWeight} helper="e.g. 169" />
          <div className="flex gap-3">
            <NumberField id="ft" label="Feet" value={ft} onChange={setFt} helper="e.g. 5" />
            <NumberField id="in" label="Inches" value={inches} onChange={setInches} helper="e.g. 9" />
          </div>
          <Callout variant="info" title="About BMI">
            Adults 20+. BMI is a screening measure, not a diagnosis. See the assumptions and
            limitations below the calculator.
          </Callout>
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <>
            <ResultCard label="BMI" value={formatNumber(result.bmi, 2)} unit="kg/m²" highlight />
            <ResultCard label="Category" value={result.category} />
          </>
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
