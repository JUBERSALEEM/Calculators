import Link from "next/link";
import { CalculatorMeta } from "@/calculators/registry";

export function CalculatorCard({ calc }: { calc: CalculatorMeta }) {
  return (
    <Link href={`/calculators/${calc.slug}`} className="group block">
      <article className="card hover:shadow-calc transition-shadow duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-md brand-bg px-3 py-1.5 text-brand-600 dark:text-brand-400 text-xs font-medium">
            {calc.categoryLabel.split(" ").slice(0, 2).join(" ")}
          </div>
          <span className="ml-auto text-xs text-neutral-400">{calc.intent}</span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {calc.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
          {calc.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Inputs: {calc.inputs.length}</span>
          <span className="hidden md:inline">Output: {calc.outputLabel}</span>
        </div>
      </article>
    </Link>
  );
}
