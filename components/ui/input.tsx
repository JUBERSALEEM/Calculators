"use client";

import * as React from "react";
import { cn } from "@/components/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ className, label, error, helper, id, ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "block w-full rounded-calc border px-3 py-2 text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-500 dark:placeholder:text-neutral-600",
          "focus:ring-2 focus:ring-brand-600 dark:focus:ring-brand-500 focus:border-brand-600 dark:focus:border-brand-500 outline-none transition-colors",
          "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700",
          error && "border-rose-500 dark:border-rose-700 focus:ring-rose-500 dark:focus:ring-rose-600",
          className
        )}
        {...props}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-neutral-500 dark:text-neutral-400">
          {helper}
        </p>
      )}
    </div>
  );
}
