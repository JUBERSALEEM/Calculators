"use client";

import * as React from "react";
import { lengthConverter } from "@/calculators/length-converter/formula";
import { LENGTH } from "@/lib/units/registry";
import { NumberField } from "@/components/calculator/number-field";
import { Select } from "@/components/ui/select";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatNumber } from "@/lib/format/number";

const UNITS = Object.entries(LENGTH.units).map(([sym, def]) => ({ sym, name: def.name }));

export function LengthConverterCalculator() {
  const [value, setValue] = React.useState("");
  const [from, setFrom] = React.useState("m");
  const [to, setTo] = React.useState("ft");
  const [result, setResult] = React.useState<{ result: number; from: string; to: string } | null>(null);
  const [notice, setNotice] = React.useState<{ title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (value.trim() === "") {
      setNotice({ title: "Missing input", children: "Please enter a value." });
      setResult(null);
      return;
    }
    const v = Number(value.replace(/,/g, "."));
    if (!Number.isFinite(v)) {
      setNotice({ title: "Invalid input", children: "Enter a valid number." });
      setResult(null);
      return;
    }
    const calc = lengthConverter({ value: v, from, to });
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
          <NumberField id="value" label="Value" value={value} onChange={setValue} helper="e.g. 100" />
          <div className="grid gap-3 md:grid-cols-2">
            <Select
              id="from"
              label="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u.sym} value={u.sym}>
                  {u.sym.toUpperCase()} — {u.name}
                </option>
              ))}
            </Select>
            <Select
              id="to"
              label="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {UNITS.map((u) => (
                <option key={u.sym} value={u.sym}>
                  {u.sym.toUpperCase()} — {u.name}
                </option>
              ))}
            </Select>
          </div>
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <ResultCard
            label={`Converted (${result.from.toUpperCase()} → ${result.to.toUpperCase()})`}
            value={formatNumber(result.result, 4)}
            highlight
          />
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Convert</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
