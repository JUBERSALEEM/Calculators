"use client";

import * as React from "react";
import { Callout } from "@/components/ui/callout";

export interface CalculatorShellProps {
  /** Rendered input controls (owned by the calculator page). */
  controls: React.ReactNode;
  /** Whether a valid result is currently available. */
  hasResult: boolean;
  /** Result card content (owned by the calculator page). */
  result: React.ReactNode;
  /** Optional validation/refusal message shown instead of the result. */
  notice?: { type: "error" | "warning" | "info"; title: string; children: React.ReactNode } | null;
  /** Action button (e.g. "Calculate" or "Reset"). */
  action?: React.ReactNode;
}

export function CalculatorShell({
  controls,
  hasResult,
  result,
  notice,
  action,
}: CalculatorShellProps) {
  return (
    <section aria-labelledby="calculator-heading" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="space-y-4">{controls}</div>
          {action && <div className="pt-2">{action}</div>}
        </div>
        <div className="md:col-span-4">
          <div className="space-y-4">
            {notice ? (
              <Callout
                variant={notice.type === "error" ? "error" : notice.type === "warning" ? "warning" : "info"}
                title={notice.title}
              >
                {notice.children}
              </Callout>
            ) : null}
            {hasResult && result}
            {!hasResult && !notice && (
              <div className="rounded-calc p-5 border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Enter values above to see the result.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
