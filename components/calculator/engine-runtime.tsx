"use client";

import * as React from "react";
import type { CalculatorSpec } from "@/lib/engine/types";
import { validateAndRun, getDefaultRawInputs } from "@/lib/engine/helpers";
import type { Result } from "@/lib/calc/result";
import { Callout } from "@/components/ui/callout";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface Props {
  slug: string;
  group: number;
}

export function EngineRuntime({ slug, group }: Props) {
  const [spec, setSpec] = React.useState<CalculatorSpec | null>(null);
  const [raw, setRaw] = React.useState<Record<string, string>>({});
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    import("@/calculators/spec-loader")
      .then((m) => m.loadSpec(group as never, slug))
      .then((found) => {
        if (cancelled || !found) return;
        setSpec(found);
        setRaw(getDefaultRawInputs(found));
      })
      .catch(() => {
        /* handled by the empty state */
      });
    return () => {
      cancelled = true;
    };
  }, [slug, group]);

  const { fieldErrors, calcResult } = React.useMemo(() => {
    if (!spec) return { fieldErrors: {} as Record<string, string>, calcResult: null as Result<never> | null };
    return validateAndRun(spec, raw);
  }, [spec, raw]);

  if (!spec) {
    return (
      <div className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading the calculation engine…</p>
      </div>
    );
  }

  const setValue = (key: string, value: string) => {
    setTouched(true);
    setRaw((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setTouched(false);
    setRaw(getDefaultRawInputs(spec));
  };

  return (
    <section aria-label="Calculator inputs and results" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form
        className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">Inputs</h2>
        {spec.fields.map((f) => {
          const err = touched ? fieldErrors[f.key] : undefined;
          if (f.kind === "select") {
            return (
              <Select
                key={f.key}
                label={f.label}
                error={err}
                helper={f.helper}
                value={raw[f.key] ?? f.defaultValue}
                onChange={(e) => setValue(f.key, e.target.value)}
              >
                {(f.options ?? []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            );
          }
          if (f.kind === "text") {
            return (
              <Input
                key={f.key}
                label={f.label}
                error={err}
                helper={f.helper}
                inputMode="text"
                value={raw[f.key] ?? f.defaultValue}
                onChange={(e) => setValue(f.key, e.target.value)}
              />
            );
          }
          return (
            <Input
              key={f.key}
              label={f.unit ? `${f.label} (${f.unit})` : f.label}
              error={err}
              helper={f.helper}
              inputMode="decimal"
              type="number"
              step={f.step ?? "any"}
              min={f.min}
              max={f.max}
              value={raw[f.key] ?? f.defaultValue}
              onChange={(e) => setValue(f.key, e.target.value)}
            />
          );
        })}
        <div className="flex items-center gap-3 pt-1">
          <button type="button" onClick={reset} className="btn-outline text-sm">
            Reset defaults
          </button>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Results update automatically — nothing leaves your browser.
          </span>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">Results</h2>
        {calcResult && !calcResult.ok ? (
          <Callout variant="error" title="Cannot compute this result">
            {calcResult.error}
          </Callout>
        ) : calcResult && calcResult.ok ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {calcResult.value.outputs.map((o) => (
                <div
                  key={o.label}
                  className={`rounded-calc border p-4 ${
                    o.highlight
                      ? "border-brand-600 dark:border-brand-500 ring-1 ring-brand-600 dark:ring-brand-500 bg-white dark:bg-neutral-900"
                      : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                    {o.label}
                  </p>
                  <p className="flex items-baseline gap-1 flex-wrap">
                    <span
                      className={`text-2xl font-semibold break-words ${
                        o.highlight ? "text-brand-700 dark:text-brand-300" : "text-neutral-900 dark:text-neutral-50"
                      }`}
                    >
                      {o.value}
                    </span>
                    {o.unit && <span className="text-xs text-neutral-500 dark:text-neutral-400">{o.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
            {calcResult.value.advisory && (
              <Callout variant="info" title="Note">
                {calcResult.value.advisory}
              </Callout>
            )}
          </>
        ) : (
          <Callout variant="warning" title="Check your inputs">
            Enter a valid value for every field to see the result.
          </Callout>
        )}

        <details className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <summary className="cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-50">
            Formula and variables
          </summary>
          <p className="mt-3 text-sm font-mono text-neutral-700 dark:text-neutral-300 break-words">{spec.formulaPlain}</p>
          <dl className="mt-3 space-y-1">
            {spec.variables.map((v) => (
              <div key={v.symbol} className="text-sm text-neutral-600 dark:text-neutral-400">
                <dt className="inline font-medium text-neutral-800 dark:text-neutral-200">{v.symbol}</dt>
                <dd className="inline"> — {v.description}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
