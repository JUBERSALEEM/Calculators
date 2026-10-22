"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";

/**
 * A validated numeric input for calculators.
 * - Parses locale decimal separators ("," and ".").
 * - Exposes value, error, and whether the field is "touched" (invalid after user interaction).
 * - Never coerces invalid input into a number — an empty or NaN input is an error state.
 */

interface NumberFieldProps {
  id: string;
  label: string;
  unit?: string;
  value: string;
  onChange: (value: string) => void;
  schema?: z.ZodTypeAny; // optional Zod refinement (e.g. positive, range)
  helper?: string;
}

export function NumberField({
  id,
  label,
  unit,
  value,
  onChange,
  schema,
  helper,
}: NumberFieldProps) {
  const [touched, setTouched] = React.useState(false);

  const parse = (raw: string): { ok: true; value: number } | { ok: false; error: string } => {
    if (raw.trim() === "") return { ok: false, error: `${label} is required` };
    const n = Number(raw.replace(/,/g, "."));
    if (!Number.isFinite(n)) return { ok: false, error: `${label} must be a valid number` };
    if (schema) {
      const result = schema.safeParse(n);
      if (!result.success) {
        const message = result.error.errors[0]?.message || `${label} is invalid`;
        return { ok: false, error: message };
      }
    }
    return { ok: true, value: n };
  };

  const parsed = parse(value);
  const showError = touched && !parsed.ok;

  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <Input
          id={id}
          label={label}
          error={showError ? parsed.error : undefined}
          helper={helper}
          value={value}
          onChange={(e) => {
            setTouched(true);
            onChange(e.target.value);
          }}
          onBlur={() => setTouched(true)}
          inputMode="decimal"
        />
      </div>
      {unit && (
        <span className="shrink-0 px-3 py-2 text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 rounded-r-calc">
          {unit}
        </span>
      )}
    </div>
  );
}
