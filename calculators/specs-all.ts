/**
 * Static aggregation of every domain spec — used by tests, build-time validation
 * and the server-rendered content projection. Client bundles never import this;
 * they lazily import a single domain module instead.
 */
import type { CalculatorSpec } from "@/lib/engine/types";
import { M01_SPECS } from "@/calculators/domains/m01-arithmetic-algebra-geo";
import { M02_SPECS } from "@/calculators/domains/m02-calculus-linalg-stats-discrete";
import { M03_SPECS } from "@/calculators/domains/m03-finance-loans-invest";
import { M04_SPECS } from "@/calculators/domains/m04-accounting-tax-payroll-econ-mkt";
import { M05_SPECS } from "@/calculators/domains/m05-construction-mechanical-electrical";
import { M06_SPECS } from "@/calculators/domains/m06-industry-transport-physics";
import { M07_SPECS } from "@/calculators/domains/m07-science-energy-earth-life";
import { M08_SPECS } from "@/calculators/domains/m08-digital-life-sciences";
import { M09_SPECS } from "@/calculators/domains/m09-civic-everyday";
import { EXPANSION_SPECS } from "@/calculators/expansion/specs-expansion";

export const ALL_SPECS: CalculatorSpec[] = [
  ...M01_SPECS,
  ...M02_SPECS,
  ...M03_SPECS,
  ...M04_SPECS,
  ...M05_SPECS,
  ...M06_SPECS,
  ...M07_SPECS,
  ...M08_SPECS,
  ...M09_SPECS,
  ...EXPANSION_SPECS,
];

export const SPEC_BY_SLUG = new Map(ALL_SPECS.map((s) => [s.slug, s]));
