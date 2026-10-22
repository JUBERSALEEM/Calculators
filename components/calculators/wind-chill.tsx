"use client";

import * as React from "react";
import { windChill } from "@/calculators/wind-chill/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { formatNumber } from "@/lib/format/number";

export function WindChillCalculator() {
  const [temp, setTemp] = React.useState("");
  const [wind, setWind] = React.useState("");
  const [result, setResult] = React.useState<{ windChillF: number; category: string } | null>(null);
  const [notice, setNotice] = React.useState<{ type: "error" | "info"; title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (temp.trim() === "" || wind.trim() === "") {
      setNotice({ type: "error", title: "Missing input", children: "Please fill in temperature and wind speed." });
      setResult(null);
      return;
    }
    const t = Number(temp.replace(/,/g, "."));
    const v = Number(wind.replace(/,/g, "."));
    if (!Number.isFinite(t) || !Number.isFinite(v)) {
      setNotice({ type: "error", title: "Invalid input", children: "Enter valid numbers for both fields." });
      setResult(null);
      return;
    }
    const calc = windChill({ temperatureF: t, windSpeedMph: v });
    if (calc.ok) {
      setResult(calc.value);
      setNotice(null);
    } else {
      setNotice({ type: "error", title: "Outside valid range", children: calc.error });
      setResult(null);
    }
  };

  return (
    <CalculatorShell
      controls={
        <>
          <NumberField id="temp" label="Air temperature" unit="°F" value={temp} onChange={setTemp} helper="e.g. 0" />
          <NumberField id="wind" label="Wind speed" unit="mph" value={wind} onChange={setWind} helper="e.g. 15" />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <>
            <ResultCard label="Wind chill" value={formatNumber(result.windChillF, 1)} unit="°F" highlight />
            <ResultCard label="Risk" value={result.category} />
          </>
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: notice.type, title: notice.title, children: notice.children } : null}
    />
  );
}
