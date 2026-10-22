"use client";

import { getCalculatorComponent } from "./registry";
import { getCalculator } from "@/calculators/registry";
import { Callout } from "@/components/ui/callout";

export function CalculatorRenderer({ slug }: { slug: string }) {
  const Component = getCalculatorComponent(slug);
  const meta = getCalculator(slug);

  if (!Component || !meta) {
    return (
      <Callout variant="error" title="Calculator not available">
        This calculator&rsquo;s interactive component has not been implemented yet.
      </Callout>
    );
  }

  return <Component />;
}
