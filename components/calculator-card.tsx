import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { Calculator } from "@/lib/calculators/types";

export function CalculatorCard({ calculator }: { calculator: Calculator }) {
  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/60 hover:bg-surface-raised"
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {calculator.category.name}
      </span>
      <span className="mt-2 flex items-start justify-between gap-3">
        <span className="text-base font-semibold tracking-tight text-ink">{calculator.name}</span>
        <ArrowRightIcon className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
      </span>
      <span className="mt-2 text-sm leading-relaxed text-muted">{calculator.summary}</span>
      <span className="mt-auto pt-4 text-[0.7rem] font-medium text-positive">
        {calculator.verification === "source-verified" ? "Source-verified formula" : "Standard formula, shown in full"}
      </span>
    </Link>
  );
}
