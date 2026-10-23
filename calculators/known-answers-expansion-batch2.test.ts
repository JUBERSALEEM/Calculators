import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";
import { formatNumber } from "@/lib/format/number";

/**
 * Known-answer tests for expansion batch 2 (CALC-1255 to CALC-1270) at default inputs.
 * Expected values were computed in Python (independent of the implementation) from the
 * textbook formulas. Tolerance = half the last displayed digit.
 */
const ROWS: [slug: string, label: string, expected: number, tolerance: number][] = [
  ["recombination-map-distance", "Recombination frequency", 10.0, 0.005],
  ["recombination-map-distance", "Haldane map distance", 11.157177565710485, 5e-05],
  ["recombination-map-distance", "Kosambi map distance", 10.136627702704105, 5e-05],
  ["inbreeding-coefficient-path", "Inbreeding coefficient (F)", 0.0625, 5e-06],
  ["inbreeding-coefficient-path", "Inbreeding as a percentage", 6.25, 0.0005],
  ["effective-population-size", "Effective population size (Ne)", 30.0, 0.005],
  ["effective-population-size", "Inbreeding rate per generation (ΔF)", 0.016666666666666666, 5e-06],
  ["doubling-time-growth-rate", "Per-capita growth rate (r)", 0.34657359027997264, 5e-05],
  ["doubling-time-growth-rate", "Doubling time (t_d)", 2.0, 5e-05],
  ["plate-count-cfu", "Viable count (CFU per mL)", 4200000.0, 0.5],
  ["hemocytometer-cell-count", "Average cells per square", 30.0, 0.005],
  ["hemocytometer-cell-count", "Cells per mL", 600000.0, 0.5],
  ["solution-osmolarity", "Osmolarity", 300.0, 0.05],
  ["solution-osmolarity", "Osmolarity in osmol/L", 0.3, 5e-05],
  ["qpcr-fold-change", "ΔCt, treated (target − reference)", 6.0, 0.005],
  ["qpcr-fold-change", "ΔCt, control (target − reference)", 8.0, 0.005],
  ["qpcr-fold-change", "ΔΔCt", -2.0, 0.005],
  ["qpcr-fold-change", "Fold change in target expression", 4.0, 5e-05],
  ["species-area-relationship", "Expected species in area A (S)", 20.0, 0.005],
  ["species-area-relationship", "Ratio S(2A) / S(A) = 2^z", 1.189207115002721, 5e-05],
  ["species-area-relationship", "Species gained by doubling the area", 3.7841423000544205, 0.005],
  ["margalef-richness", "Margalef richness (d)", 0.6514417228548777, 5e-05],
  ["margalef-richness", "Species present (S)", 4.0, 0.5],
  ["margalef-richness", "Individuals counted (N)", 100.0, 0.5],
  ["berger-parker-dominance", "Berger–Parker dominance (d)", 0.4, 5e-05],
  ["berger-parker-dominance", "Inverse dominance (1 / d)", 2.5, 5e-05],
  ["hill-numbers", "Hill number order 0 (= richness S)", 4.0, 0.5],
  ["hill-numbers", "Hill number order 1 (exp H′)", 3.5961154666243225, 5e-05],
  ["hill-numbers", "Hill number order 2 (1 / Σ pᵢ²)", 3.333333333333333, 5e-05],
  ["chao1-richness", "Chao1 richness (bias-corrected)", 27.5, 0.05],
  ["chao1-richness", "Estimated unseen species", 7.5, 0.05],
  ["chao1-richness", "Chao1 richness (classic)", 30.0, 0.05],
  ["trophic-transfer-efficiency", "Trophic transfer efficiency", 10.0, 0.005],
  ["trophic-transfer-efficiency", "Energy not transferred", 90.0, 0.005],
  ["lotka-volterra-equilibrium", "Equilibrium prey density (x* = γ / δ)", 20.0, 0.005],
  ["lotka-volterra-equilibrium", "Equilibrium predator density (y* = α / β)", 10.0, 0.005],
  ["net-primary-productivity", "Net primary productivity (NPP)", 600.0, 0.05],
  ["net-primary-productivity", "NPP efficiency (NPP / GPP)", 50.0, 0.005],
];

function outputs(slug: string) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const out = validateAndRun(spec, getDefaultRawInputs(spec));
  if (!out.calcResult || !out.calcResult.ok) throw new Error(`${slug}: did not compute`);
  return out.calcResult.value.outputs;
}

describe("expansion batch 2 — known-answer values", () => {
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

describe("expansion batch 2 — validation and edge cases", () => {
  it("recombination fraction 0.5 (unlinked) is rejected, not turned into a distance", () => {
    expect(spec("recombination-map-distance").compute({ r: 0.5 }).ok).toBe(false);
  });

  it("recombination fraction 0 gives a zero map distance", () => {
    const r = spec("recombination-map-distance").compute({ r: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs.find((o) => o.label === "Haldane map distance")!.value)).toBe(0);
  });

  it("inbreeding rejects F_A of 1 or more", () => {
    expect(spec("inbreeding-coefficient-path").compute({ k: 1, n1: 1, n2: 1, FA: 1 }).ok).toBe(false);
  });

  it("full siblings (k = 2, n₁ = n₂ = 1) give F = 0.25", () => {
    const r = spec("inbreeding-coefficient-path").compute({ k: 2, n1: 1, n2: 1, FA: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBeCloseTo(0.25, 5);
  });

  it("effective population size with one male and one female is 2", () => {
    const r = spec("effective-population-size").compute({ Nm: 1, Nf: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(Number(r.value.outputs[0]!.value)).toBe(2);
  });

  it("doubling time is text, not a number, when the population did not grow", () => {
    const r = spec("doubling-time-growth-rate").compute({ N0: 100, N: 50, t: 6 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.outputs[1]!.value).toBe("undefined — population did not grow");
  });

  it("plate count with no colonies is flagged as a detection limit", () => {
    const r = spec("plate-count-cfu").compute({ colonies: 0, dilution: 1000, vol: 0.1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.advisory).toMatch(/detection limit/);
  });

  it("plate count above 300 colonies is flagged as outside the countable range", () => {
    const r = spec("plate-count-cfu").compute({ colonies: 500, dilution: 1000, vol: 0.1 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.advisory).toMatch(/countable range/);
  });

  it("plate count rejects zero volume through input validation", () => {
    const s = spec("plate-count-cfu");
    const out = validateAndRun(s, { ...getDefaultRawInputs(s), vol: "0" });
    expect(out.calcResult?.ok ?? false).toBe(false);
  });

  it("qPCR rejects efficiency of 0 through input validation", () => {
    const s = spec("qpcr-fold-change");
    const out = validateAndRun(s, { ...getDefaultRawInputs(s), E: "0" });
    expect(out.calcResult?.ok ?? false).toBe(false);
  });

  it("Margalef rejects a single individual (ln 1 = 0)", () => {
    expect(spec("margalef-richness").compute({ counts: "1" }).ok).toBe(false);
  });

  it("Hill numbers for one species are all 1", () => {
    const r = spec("hill-numbers").compute({ counts: "7, 0" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Number(r.value.outputs[1]!.value)).toBeCloseTo(1, 4);
      expect(Number(r.value.outputs[2]!.value)).toBeCloseTo(1, 4);
    }
  });

  it("Chao1 rejects singletons + doubletons greater than species observed", () => {
    expect(spec("chao1-richness").compute({ S: 5, F1: 4, F2: 3 }).ok).toBe(false);
  });

  it("Chao1 classic is text when there are no doubletons", () => {
    const r = spec("chao1-richness").compute({ S: 20, F1: 4, F2: 0 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.outputs[2]!.value).toBe("undefined — no doubletons (f₂ = 0)");
  });

  it("trophic efficiency rejects production above 100% of the level below", () => {
    expect(spec("trophic-transfer-efficiency").compute({ Pn: 100, Pn1: 200 }).ok).toBe(false);
  });

  it("NPP shows an advisory and a negative value when respiration exceeds GPP", () => {
    const r = spec("net-primary-productivity").compute({ GPP: 500, R: 800 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Number(r.value.outputs[0]!.value.replace(/,/g, ""))).toBe(-300);
      expect(r.value.advisory).toMatch(/net carbon source/);
    }
  });
});

describe("number display — no negative zero", () => {
  it("formats −0 and tiny negatives that round to zero as 0", () => {
    expect(formatNumber(-0, 4)).toBe("0");
    expect(formatNumber(-0.00001, 2)).toBe("0");
    expect(formatNumber(-1.5, 2)).toBe("-1.5");
  });
});
