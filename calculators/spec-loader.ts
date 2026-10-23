import type { CalculatorSpec } from "@/lib/engine/types";
import type { DomainGroupId } from "@/calculators/domain-map";

/**
 * Lazily loads one discipline's specs. Shared by the server-rendered page (for
 * SEO content) and the client runtime (for interactivity), so each route only
 * ever pulls a single ~150-calculator chunk.
 */
const LOADERS: Record<DomainGroupId, () => Promise<CalculatorSpec[]>> = {
  1: () => import("@/calculators/domains/m01-arithmetic-algebra-geo").then((m) => m.M01_SPECS),
  2: () => import("@/calculators/domains/m02-calculus-linalg-stats-discrete").then((m) => m.M02_SPECS),
  3: () => import("@/calculators/domains/m03-finance-loans-invest").then((m) => m.M03_SPECS),
  4: () => import("@/calculators/domains/m04-accounting-tax-payroll-econ-mkt").then((m) => m.M04_SPECS),
  5: () => import("@/calculators/domains/m05-construction-mechanical-electrical").then((m) => m.M05_SPECS),
  6: () => import("@/calculators/domains/m06-industry-transport-physics").then((m) => m.M06_SPECS),
  7: () =>
    Promise.all([
      import("@/calculators/domains/m07-science-energy-earth-life").then((m) => m.M07_SPECS),
      import("@/calculators/expansion/specs-expansion").then((m) => m.EXPANSION_SPECS),
    ]).then(([base, extra]) => [...base, ...extra]),
  8: () => import("@/calculators/domains/m08-digital-life-sciences").then((m) => m.M08_SPECS),
  9: () => import("@/calculators/domains/m09-civic-everyday").then((m) => m.M09_SPECS),
};

export async function loadSpecGroup(group: DomainGroupId): Promise<CalculatorSpec[]> {
  return LOADERS[group]();
}

export async function loadSpec(group: DomainGroupId, slug: string): Promise<CalculatorSpec | undefined> {
  const specs = await LOADERS[group]();
  return specs.find((s) => s.slug === slug);
}
