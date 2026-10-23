"use client";

import { useId, useMemo, useState } from "react";

import { AlertIcon, CheckIcon, ResetIcon } from "@/components/icons";
import { getCalculator, runCalculator } from "@/lib/calculators/registry";
import type { Field, Output, Tone } from "@/lib/calculators/types";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-line bg-paper-deep text-ink-soft",
  positive: "border-positive/30 bg-positive-soft text-positive",
  caution: "border-caution/30 bg-caution-soft text-caution",
  danger: "border-danger/30 bg-danger-soft text-danger",
};

function initialValues(fields: Field[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    if (field.kind === "number") {
      values[field.name] = field.defaultValue === undefined ? "" : String(field.defaultValue);
    } else if (field.kind === "select") {
      values[field.name] = field.defaultValue;
    } else {
      values[field.name] = field.defaultValue ?? "";
    }
  }
  return values;
}

/**
 * Only the slug crosses the server/client boundary. The calculator definition —
 * including its compute function — is resolved inside the client bundle, because
 * functions cannot be serialised into a Client Component.
 */
export function CalculatorForm({ slug }: { slug: string }) {
  const calculator = getCalculator(slug);

  if (!calculator) {
    return (
      <p className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
        This calculator could not be loaded. Please reload the page.
      </p>
    );
  }

  return <CalculatorFormInner calculator={calculator} />;
}

function CalculatorFormInner({ calculator }: { calculator: NonNullable<ReturnType<typeof getCalculator>> }) {
  const baseId = useId();
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(calculator.fields));
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Results are derived, never stored, so they cannot go stale when an input changes.
  const result = useMemo(
    () => (submitted ? runCalculator(calculator, values) : null),
    [submitted, calculator, values],
  );

  const errors = result && !result.ok ? result.errors : {};
  const formError = errors.form;

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function reset() {
    setValues(initialValues(calculator.fields));
    setSubmitted(false);
    setCopied(false);
  }

  async function copyResult() {
    if (!result?.ok) return;
    const text = result.outputs.map((output) => `${output.label}: ${output.value}`).join("\n");
    try {
      await navigator.clipboard.writeText(`${calculator.name}\n${text}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
    >
      <h2 id={`${baseId}-heading`} className="sr-only">
        {calculator.name} inputs
      </h2>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        data-testid="calculator-form"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {calculator.fields.map((field) => {
            const id = `${baseId}-${field.name}`;
            const hintId = `${id}-hint`;
            const errorId = `${id}-error`;
            const error = errors[field.name];
            const describedBy = [field.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

            return (
              <div
                key={field.name}
                className={field.kind === "text" && field.multiline ? "sm:col-span-2" : undefined}
              >
                <label htmlFor={id} className="block text-sm font-medium text-ink">
                  {field.label}
                  {field.kind === "number" && field.unit && (
                    <span className="ml-1 font-normal text-muted">({field.unit})</span>
                  )}
                  {"optional" in field && field.optional && (
                    <span className="ml-1 font-normal text-muted">(optional)</span>
                  )}
                </label>

                <div className="mt-1.5">
                  {field.kind === "number" && (
                    <input
                      id={id}
                      name={field.name}
                      type="number"
                      inputMode="decimal"
                      value={values[field.name] ?? ""}
                      onChange={(event) => update(field.name, event.target.value)}
                      min={field.min}
                      max={field.max}
                      step={field.step ?? "any"}
                      placeholder={field.placeholder}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={describedBy}
                      className={[
                        "tnum w-full rounded-lg border bg-surface-raised px-3 py-2.5 text-ink placeholder:text-muted/70",
                        "focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                        error ? "border-danger" : "border-line",
                      ].join(" ")}
                      data-testid={`input-${field.name}`}
                    />
                  )}

                  {field.kind === "select" && (
                    <select
                      id={id}
                      name={field.name}
                      value={values[field.name] ?? field.defaultValue}
                      onChange={(event) => update(field.name, event.target.value)}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={describedBy}
                      className={[
                        "w-full rounded-lg border bg-surface-raised px-3 py-2.5 text-ink",
                        "focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                        error ? "border-danger" : "border-line",
                      ].join(" ")}
                      data-testid={`select-${field.name}`}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.kind === "text" &&
                    (field.multiline ? (
                      <textarea
                        id={id}
                        name={field.name}
                        rows={3}
                        value={values[field.name] ?? ""}
                        onChange={(event) => update(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className={[
                          "tnum w-full rounded-lg border bg-surface-raised px-3 py-2.5 font-mono text-sm text-ink placeholder:font-sans placeholder:text-muted/70",
                          "focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                          error ? "border-danger" : "border-line",
                        ].join(" ")}
                        data-testid={`input-${field.name}`}
                      />
                    ) : (
                      <input
                        id={id}
                        name={field.name}
                        type="text"
                        value={values[field.name] ?? ""}
                        onChange={(event) => update(field.name, event.target.value)}
                        placeholder={field.placeholder}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={describedBy}
                        className="w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-ink"
                      />
                    ))}
                </div>

                {field.hint && (
                  <p id={hintId} className="mt-1.5 text-xs leading-relaxed text-muted">
                    {field.hint}
                  </p>
                )}
                {error && (
                  <p id={errorId} className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-danger">
                    <AlertIcon className="mt-px size-3.5 shrink-0" />
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {formError && (
          <p role="alert" className="mt-4 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            data-testid="calculate-button"
          >
            Calculate
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <ResetIcon className="size-4" />
            Reset
          </button>
          {result?.ok && (
            <button
              type="button"
              onClick={copyResult}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted hover:text-ink"
            >
              {copied ? <CheckIcon className="size-3.5 text-positive" /> : null}
              {copied ? "Copied" : "Copy result"}
            </button>
          )}
        </div>
      </form>

      <div aria-live="polite" aria-atomic="true" className="mt-6" data-testid="result-region">
        {result === null && (
          <div className="rounded-xl border border-dashed border-line bg-paper-deep/60 px-4 py-6 text-center text-sm text-muted">
            Enter your values and select <span className="font-medium text-ink">Calculate</span> to see the result.
          </div>
        )}

        {result?.ok && (
          <div className="rounded-xl border border-line bg-paper-deep/50 p-4 sm:p-5">
            {result.interpretation && (
              <p className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_CLASS[result.interpretation.tone]}`}>
                {result.interpretation.label}
              </p>
            )}

            <dl className="space-y-3">
              {result.outputs.map((output: Output) => (
                <div
                  key={output.label}
                  className={[
                    "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1",
                    output.emphasis ? "border-b border-line pb-3" : "",
                  ].join(" ")}
                >
                  <dt className={`text-sm ${output.emphasis ? "font-medium text-ink" : "text-muted"}`}>{output.label}</dt>
                  <dd
                    className={[
                      "tnum text-right",
                      output.emphasis
                        ? "text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
                        : "text-sm font-medium text-ink",
                    ].join(" ")}
                    data-testid={output.emphasis ? "primary-result" : undefined}
                  >
                    {output.value}
                    {output.hint && <span className="block text-xs font-normal text-muted">{output.hint}</span>}
                  </dd>
                </div>
              ))}
            </dl>

            {result.interpretation && (
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{result.interpretation.detail}</p>
            )}

            {result.notes && result.notes.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-line pt-3">
                {result.notes.map((note) => (
                  <li key={note} className="text-xs leading-relaxed text-muted">
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
