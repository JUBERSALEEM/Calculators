"use client";

import * as React from "react";
import { cn } from "@/components/lib/cn";

interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  value: React.ReactNode;
  unit?: string;
  highlight?: boolean;
}

export function ResultCard({
  className,
  label,
  value,
  unit,
  highlight = false,
  ...props
}: ResultCardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-calc p-5 md:p-6 shadow-calc",
        tokens.color.surface,
        tokens.color.border,
        highlight
          ? "ring-2 ring-brand-600 dark:ring-brand-500 shadow-calc-lg"
          : "bg-white dark:bg-neutral-900",
        className
      )}
      {...props}
    >
      {label && (
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
          {label}
        </p>
      )}
      <div className="flex items-baseline gap-1">
        <span className={cn("text-3xl md:text-4xl font-semibold text-neutral-900 dark:text-neutral-50", highlight ? "text-brand-600 dark:text-brand-400" : "")}>
          {value}
        </span>
        {unit && <span className="text-sm text-neutral-500 dark:text-neutral-400">{unit}</span>}
      </div>
    </div>
  );
}

import { tokens } from "@/lib/design/tokens";
