"use client";

import * as React from "react";
import { heatIndex } from "@/calculators/heat-index/formula";
import { NumberField } from "@/components/calculator/number-field";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ResultCard } from "@/components/ui/result-card";
import { Callout } from "@/components/ui/callout";
import { formatNumber } from "@/lib/format/number";

export function HeatIndexCalculator() {
  const [temp, setTemp] = React.useState("");
  const [rh, setRh] = React.useState("");
  const [result, setResult] = React.useState<{ heatIndexF: number; advisory: string | null } | null>(null);
  const [notice, setNotice] = React.useState<{ type: "error"; title: string; children: React.ReactNode } | null>(null);

  const handleCalculate = () => {
    if (temp.trim() === "" || rh.trim() === "") {
      setNotice({ type: "error", title: "Missing input", children: "Please fill in temperature and humidity." });
      setResult(null);
      return;
    }
    const t = Number(temp.replace(/,/g, "."));
    const r = Number(rh.replace(/,/g, "."));
    if (!Number.isFinite(t) || !Number.isFinite(r)) {
      setNotice({ type: "error", title: "Invalid input", children: "Enter valid numbers for both fields." });
      setResult(null);
      return;
    }
    const calc = heatIndex({ temperatureF: t, relativeHumidityPct: r });
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
          <NumberField id="temp" label="Air temperature" unit="°F" value={temp} onChange={setTemp} helper="e.g. 100" />
          <NumberField id="rh" label="Relative humidity" unit="%" value={rh} onChange={setRh} helper="e.g. 55" />
        </>
      }
      hasResult={result !== null}
      result={
        result ? (
          <>
            <ResultCard label="Heat index (shade)" value={formatNumber(result.heatIndexF, 1)} unit="°F" highlight />
            {result.advisory && (
              <Callout variant="info" title="Advisory">
                {result.advisory}
              </Callout>
            )}
          </>
        ) : null
      }
      action={<button onClick={handleCalculate} className="btn-primary w-full">Calculate</button>}
      notice={notice ? { type: "error", title: notice.title, children: notice.children } : null}
    />
  );
}
