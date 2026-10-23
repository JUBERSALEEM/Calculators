import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";

/**
 * Known-answer tests for expansion batch 3 (CALC-1271 to CALC-1276, genetics) at default inputs.
 * Expected values were computed in Python from the textbook formulas (not read from the code).
 * Tolerance = half the last displayed digit.
 */
const ROWS: [slug: string, label: string, expected: number, tolerance: number][] = [
  ["lod-score-linkage", "LOD score", 3.196965083187472, 0.0005],
  ["lod-score-linkage", "Odds for linkage (10^LOD)", 1573.856323011863, 0.005],
  ["mutation-selection-balance", "Equilibrium recessive allele frequency (q̂)", 0.01, 5e-07],
  ["mutation-selection-balance", "Carrier frequency (2q̂)", 0.02, 5e-06],
  ["mutation-selection-balance", "Affected frequency (q̂²)", 0.0001, 5e-08],
  ["recessive-selection-change", "Change in q per generation (Δq)", -0.052631578947368425, 5e-07],
  ["recessive-selection-change", "Recessive allele frequency next generation (q′)", 0.4473684210526316, 5e-07],
  ["migration-allele-frequency", "Allele frequency after migration (q′)", 0.24000000000000002, 5e-07],
  ["migration-allele-frequency", "Change in q (Δq)", 0.04000000000000001, 5e-07],
  ["heterozygosity-drift-decay", "Expected heterozygosity after t generations (H_t)", 0.4521910375044022, 5e-06],
  ["heterozygosity-drift-decay", "Proportion of heterozygosity lost", 9.561792499119559, 0.005],
  ["coefficient-of-relationship", "Coefficient of relationship (r)", 0.125, 5e-07],
];

function outputs(slug: string) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const out = validateAndRun(spec, getDefaultRawInputs(spec));
  if (!out.calcResult || !out.calcResult.ok) throw new Error(`${slug}: did not compute`);
  return out.calcResult.value.outputs;
}

describe("expansion batch 3 — known-answer values", () => {
  for (const [slug, label, expected, tol] of ROWS) {
    it(`${slug} → ${label} ≈ ${expected}`, () => {
      const row = outputs(slug).find((r) => r.label === label);
      expect(row, `${slug}: no output "${label}"`).toBeDefined();
      const got = Number(String(row!.value).replace(/,/g, ""));
      expect(Number.isFinite(got)).toBe(true);
      expect(Math.abs(got - expected)).toBeLessThanOrEqual(Math.max(tol, 1e-9 * Math.abs(expected)));
    });
  }
});

const spec = (slug: string) => SPEC_BY_SLUG.get(slug) as CalculatorSpec;

describe("expansion batch 3 — validation and edge cases", () => {
  it("LOD with no offspring is rejected", () => {
    expect(spec("lod-score-linkage").compute({ R: 0, NR: 0, theta: 0.1 }).ok).toBe(false);
  });

  it("LOD at θ = 0.5 (unlinked) is zero", () => {
    const r = spec("lod-score-linkage").compute({ R: 10, NR: 10, theta: 0.5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Math.abs(Number(r.value.outputs[0]!.value))).toBeLessThan(1e-9);
  });

  it("mutation-selection rejects s of 0 (no selection, no equilibrium)", () => {
    const s = spec("mutation-selection-balance");
    const out = validateAndRun(s, { ...getDefaultRawInputs(s), s: "0" });
    expect(out.calcResult?.ok ?? false).toBe(false);
  });

  it("recessive selection with s·q² = 1 is undefined, not Infinity", () => {
    const r = spec("recessive-selection-change").compute({ q: 1, s: 1 });
    expect(r.ok).toBe(false);
  });

  it("recessive selection with q = 0 gives no change", () => {
    const r = spec("recessive-selection-change").compute({ q: 0, s: 0.5 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBe(0);
  });

  it("migration with m = 0 leaves the frequency unchanged", () => {
    const r = spec("migration-allele-frequency").compute({ q: 0.3, qm: 0.9, m: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBeCloseTo(0.3, 6);
  });

  it("drift with Ne below 1 is rejected", () => {
    const s = spec("heterozygosity-drift-decay");
    const out = validateAndRun(s, { ...getDefaultRawInputs(s), Ne: "0.5" });
    expect(out.calcResult?.ok ?? false).toBe(false);
  });

  it("drift at zero generations keeps the starting heterozygosity", () => {
    const r = spec("heterozygosity-drift-decay").compute({ H0: 0.5, Ne: 50, t: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBeCloseTo(0.5, 5);
  });

  it("parent–child relationship (k = 1, n = 1) is 0.5", () => {
    const r = spec("coefficient-of-relationship").compute({ k: 1, n: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBeCloseTo(0.5, 6);
  });
});
