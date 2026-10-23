import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";

/**
 * Known-answer tests for expansion batch 1 at default inputs. Expected values were computed
 * independently in Python from the textbook formulas (not read from the implementation).
 * Tolerance = half the last displayed digit.
 */
const ROWS: [slug: string, label: string, expected: number, tolerance: number][] = [
  ["allele-frequency-genotype-counts", "Frequency of allele A (p)", 0.6, 5e-05],
  ["allele-frequency-genotype-counts", "Frequency of allele a (q)", 0.4, 5e-05],
  ["allele-frequency-genotype-counts", "Individuals counted (N)", 100.0, 0.5],
  ["shannon-diversity", "Shannon index (H′)", 1.2798542258336676, 5e-05],
  ["shannon-diversity", "Species present (S)", 4.0, 0.5],
  ["shannon-diversity", "Evenness (J′ = H′ / ln S)", 0.9232196723355078, 5e-05],
  ["simpson-diversity", "Simpson dominance (D)", 0.30000000000000004, 5e-05],
  ["simpson-diversity", "Gini–Simpson index (1 − D)", 0.7, 5e-05],
  ["simpson-diversity", "Inverse Simpson (1 / D)", 3.333333333333333, 5e-05],
  ["lincoln-petersen", "Lincoln–Petersen estimate", 200.0, 0.05],
  ["lincoln-petersen", "Chapman estimate", 189.0909090909091, 0.05],
  ["net-reproductive-rate", "Net reproductive rate (R₀)", 1.5, 5e-05],
  ["net-reproductive-rate", "Generation time (T)", 1.3333333333333333, 5e-05],
  ["community-similarity", "Jaccard similarity", 0.38461538461538464, 5e-05],
  ["community-similarity", "Sørensen similarity", 0.5555555555555556, 5e-05],
  ["community-similarity", "Species recorded in total", 13.0, 0.5],
];

function outputs(slug: string) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const out = validateAndRun(spec, getDefaultRawInputs(spec));
  if (!out.calcResult || !out.calcResult.ok) throw new Error(`${slug}: did not compute`);
  return out.calcResult.value.outputs;
}

describe("expansion batch 1 — known-answer values", () => {
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

/** Shannon with one species: evenness is undefined and shown as text, not NaN. */
describe("expansion batch 1 — edge cases", () => {
  const spec = (slug: string) => SPEC_BY_SLUG.get(slug) as CalculatorSpec;

  it("Shannon evenness is text (not NaN) when only one species is present", () => {
    const out = outputs("shannon-diversity");
    const r = spec("shannon-diversity").compute({ counts: "5, 0" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const row = r.value.outputs.find((o) => o.label.startsWith("Evenness"));
      expect(row?.value).toBe("undefined — only one species");
    }
    expect(out.length).toBeGreaterThan(0);
  });

  it("Shannon for two equally common species: H′ = ln 2 = 0.6931 and evenness J′ = 1", () => {
    const r = spec("shannon-diversity").compute({ counts: "1, 1" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const H = Number(r.value.outputs.find((o) => o.label.startsWith("Shannon"))!.value);
      const J = Number(r.value.outputs.find((o) => o.label.startsWith("Evenness"))!.value);
      expect(Math.abs(H - Math.LN2)).toBeLessThanOrEqual(0.00005);
      expect(Math.abs(J - 1)).toBeLessThanOrEqual(0.00005);
    }
  });

  it("Shannon rejects an all-zero sample", () => {
    expect(spec("shannon-diversity").compute({ counts: "0, 0" }).ok).toBe(false);
  });

  it("Simpson rejects negative counts", () => {
    expect(spec("simpson-diversity").compute({ counts: "5, -1" }).ok).toBe(false);
  });

  it("Allele frequency rejects zero individuals", () => {
    expect(spec("allele-frequency-genotype-counts").compute({ AA: 0, Aa: 0, aa: 0 }).ok).toBe(false);
  });

  it("Lincoln–Petersen shows Chapman only when there are no recaptures", () => {
    const r = spec("lincoln-petersen").compute({ M: 50, C: 40, R: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const lp = r.value.outputs.find((o) => o.label.startsWith("Lincoln"));
      expect(lp?.value).toBe("undefined — no recaptures");
    }
  });

  it("Lincoln–Petersen rejects more recaptures than captures", () => {
    expect(spec("lincoln-petersen").compute({ M: 50, C: 10, R: 20 }).ok).toBe(false);
  });

  it("Net reproductive rate rejects a life table with no reproduction", () => {
    expect(spec("net-reproductive-rate").compute({ lx: "1, 0.5", mx: "0, 0" }).ok).toBe(false);
  });

  it("Net reproductive rate rejects survival outside 0–1", () => {
    expect(spec("net-reproductive-rate").compute({ lx: "1, 1.5", mx: "0, 2" }).ok).toBe(false);
  });

  it("Community similarity rejects a sample with no species", () => {
    expect(spec("community-similarity").compute({ a: 0, b: 0, c: 0 }).ok).toBe(false);
  });
});
