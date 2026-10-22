"use client";

import * as React from "react";
import { cn } from "@/components/lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Select({ className, label, error, helper, id, children, ...props }: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "block w-full rounded-calc border px-3 py-2 text-neutral-900 dark:text-neutral-50",
          "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700",
          "focus:ring-2 focus:ring-brand-600 dark:focus:ring-brand-500 focus:border-brand-600 dark:focus:border-brand-500 outline-none transition-colors",
          error && "border-rose-500 dark:border-rose-700 focus:ring-rose-500 dark:focus:ring-rose-600",
          className
        )}
        {...props}
        aria-invalid={error ? "true" : "false"}
      >
        {children}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${selectId}-helper`} className="text-xs text-neutral-500 dark:text-neutral-400">
          {helper}
        </p>
      )}
    </div>
  );
}
