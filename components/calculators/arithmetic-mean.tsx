"use client";

import * as React from "react";
import { arithmeticMean } from "@/calculators/arithmetic-mean/formula";
import { Input } from "@/components/ui/input";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatNumber } from "@/lib/format/number";

function parseList(raw: string): number[] | null {
  const parts = raw.split(",").map((s) => s.trim()).filter((s) => s !== "");
  if (parts.length === 0) return null;
  const nums = parts.map((s) => Number(s));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  return nums;
}

export function ArithmeticMeanCalculator() {
  const [values, setValues] = React.useState("");
  const [result, setResult] = React.useState<{ mean: number; sum: number; count: number } | null>(null);
  const [notice, setNotice] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    const nums = parseList(values);
    if (!nums) {
      setNotice({ title: "Invalid input", children: "Enter a comma-separated list of numbers (e.g. 10, 20, 30)." });
      setResult(null);
      return;
    }
    const calc = arithmeticMean({ values: nums });
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
          <Input
            id="values"
            label="Numbers"
            helper="Comma-separated, e.g. 10, 20, 30, 40"
            value={values}
            onChange={(e) => setValues(e.target.value)}
          />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <>
            <ResultCard label="Mean" value={formatNumber(result.mean)} highlight />
            <ResultCard label="Sum" value={formatNumber(result.sum)} />
            <ResultCard label="Count" value={formatNumber(result.count)} />
          </>
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
