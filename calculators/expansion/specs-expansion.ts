/**
 * Expansion batch 1 — biology and ecology calculators that were not already in the catalog.
 *
 * Each formula is a standard textbook result. Known-answer tests are in
 * calculators/known-answers-expansion.test.ts; their expected values were computed
 * independently (Python), not taken from this file.
 */
import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { done, intF, outN, outS, parseNumList, txtF } from "@/lib/engine/helpers";

function parseList(raw: string, label: string) {
  const parsed = parseNumList(raw, 1);
  if (!parsed.ok) return err(`${label}: ${parsed.error}`);
  return parsed;
}

function parseCounts(raw: string) {
  const parsed = parseList(raw, "Counts");
  if (!parsed.ok) return parsed;
  if (parsed.value.some((x) => !Number.isFinite(x) || x < 0)) return err("Counts must be zero or positive numbers.");
  if (parsed.value.every((x) => x === 0)) return err("At least one individual must be counted.");
  return parsed;
}

export const EXPANSION_SPECS: CalculatorSpec[] = [
  {
    slug: "allele-frequency-genotype-counts",
    fields: [
      intF("AA", "Homozygous dominant count (AA)", 36, { min: 0 }),
      intF("Aa", "Heterozygote count (Aa)", 48, { min: 0 }),
      intF("aa", "Homozygous recessive count (aa)", 16, { min: 0 }),
    ],
    formulaPlain: "N = AA + Aa + aa;  p = (2·AA + Aa) / (2N);  q = 1 − p",
    variables: [
      { symbol: "p", description: "Frequency of allele A" },
      { symbol: "q", description: "Frequency of allele a" },
    ],
    assumptions: ["Diploid, sexually reproducing population; genotypes counted at one locus with two alleles."],
    limitations: ["A single sample is an estimate; sampling error falls as N grows."],
    compute: (v) => {
      const AA = Number(v.AA), Aa = Number(v.Aa), aa = Number(v.aa);
      const N = AA + Aa + aa;
      if (N <= 0) return err("At least one individual must be counted.");
      const p = (2 * AA + Aa) / (2 * N);
      return done([
        outN("Frequency of allele A (p)", p, 4, "", true),
        outN("Frequency of allele a (q)", 1 - p, 4, "", true),
        outN("Individuals counted (N)", N, 0),
      ]);
    },
  },
  {
    slug: "shannon-diversity",
    fields: [txtF("counts", "Individuals per species (comma-separated)", "10, 20, 30, 40")],
    formulaPlain: "H′ = −Σ pᵢ ln pᵢ, with pᵢ = nᵢ / N;  evenness J′ = H′ / ln S",
    variables: [
      { symbol: "nᵢ", description: "Count of species i" },
      { symbol: "S", description: "Number of species with nᵢ > 0" },
    ],
    assumptions: ["The sample represents the community; species with a zero count are excluded."],
    limitations: ["H′ depends on sample size and sampling effort; compare only samples collected the same way."],
    compute: (v) => {
      const parsed = parseCounts(String(v.counts));
      if (!parsed.ok) return parsed;
      const present = parsed.value.filter((x) => x > 0);
      const N = present.reduce((a, b) => a + b, 0);
      const H = -present.reduce((acc, n) => acc + (n / N) * Math.log(n / N), 0);
      const S = present.length;
      return done([
        outN("Shannon index (H′)", H, 4, "", true),
        outN("Species present (S)", S, 0),
        S > 1
          ? outN("Evenness (J′ = H′ / ln S)", H / Math.log(S), 4)
          : outS("Evenness (J′ = H′ / ln S)", "undefined — only one species"),
      ]);
    },
  },
  {
    slug: "simpson-diversity",
    fields: [txtF("counts", "Individuals per species (comma-separated)", "10, 20, 30, 40")],
    formulaPlain: "D = Σ pᵢ²;  Gini–Simpson = 1 − D;  inverse Simpson = 1 / D",
    variables: [{ symbol: "pᵢ", description: "Proportion of individuals belonging to species i" }],
    assumptions: ["Proportions are estimated from the sample without a small-sample correction."],
    limitations: ["Dominated by common species; rare species barely change D."],
    compute: (v) => {
      const parsed = parseCounts(String(v.counts));
      if (!parsed.ok) return parsed;
      const N = parsed.value.reduce((a, b) => a + b, 0);
      const D = parsed.value.reduce((acc, n) => acc + (n / N) ** 2, 0);
      return done([
        outN("Simpson dominance (D)", D, 4, "", true),
        outN("Gini–Simpson index (1 − D)", 1 - D, 4),
        outN("Inverse Simpson (1 / D)", 1 / D, 4),
      ]);
    },
  },
  {
    slug: "lincoln-petersen",
    fields: [
      intF("M", "Animals marked on first visit (M)", 50, { min: 1 }),
      intF("C", "Animals captured on second visit (C)", 40, { min: 1 }),
      intF("R", "Marked animals recaptured (R)", 10, { min: 0 }),
    ],
    formulaPlain: "Lincoln–Petersen: N = M·C / R (R > 0);  Chapman: N = (M + 1)(C + 1) / (R + 1) − 1",
    variables: [
      { symbol: "N", description: "Estimated population size" },
      { symbol: "M, C, R", description: "Marked, captured and recaptured counts" },
    ],
    assumptions: [
      "Closed population: no births, deaths, immigration or emigration between visits.",
      "Marked animals mix randomly with unmarked animals, and marks are not lost.",
    ],
    limitations: ["The Lincoln–Petersen estimate is biased when R is small; the Chapman estimate is defined even when R = 0."],
    compute: (v) => {
      const M = Number(v.M), C = Number(v.C), R = Number(v.R);
      if (R > C) return err("Recaptured animals cannot exceed the number captured on the second visit.");
      if (R > M) return err("Recaptured animals cannot exceed the number marked.");
      const chapman = ((M + 1) * (C + 1)) / (R + 1) - 1;
      return done([
        R > 0
          ? outN("Lincoln–Petersen estimate", (M * C) / R, 1, "animals")
          : outS("Lincoln–Petersen estimate", "undefined — no recaptures"),
        outN("Chapman estimate", chapman, 1, "animals", true),
      ]);
    },
  },
  {
    slug: "net-reproductive-rate",
    fields: [
      txtF("lx", "Age-specific survival lₓ, values 0–1 (comma-separated)", "1, 0.5, 0.25"),
      txtF("mx", "Age-specific fecundity mₓ (comma-separated)", "0, 2, 2"),
    ],
    formulaPlain: "R₀ = Σ lₓ·mₓ;  generation time T = Σ x·lₓ·mₓ / R₀",
    variables: [
      { symbol: "lₓ", description: "Proportion of a cohort surviving to age class x" },
      { symbol: "mₓ", description: "Mean offspring produced per individual in age class x" },
      { symbol: "x", description: "Age class index, starting at 0" },
    ],
    assumptions: ["Discrete, non-overlapping generations and a closed cohort (life-table data)."],
    limitations: ["Describes the growth rate under constant conditions; it does not forecast a real population."],
    compute: (v) => {
      const lx = parseList(String(v.lx), "Survival lₓ");
      if (!lx.ok) return lx;
      const mx = parseList(String(v.mx), "Fecundity mₓ");
      if (!mx.ok) return mx;
      const L = lx.value, M = mx.value;
      if (L.length !== M.length) return err("Survival and fecundity lists must have the same number of age classes.");
      if (L.some((x) => !Number.isFinite(x) || x < 0 || x > 1)) return err("Survival values lₓ must be between 0 and 1.");
      if (M.some((x) => !Number.isFinite(x) || x < 0)) return err("Fecundity values mₓ must be zero or positive.");
      const R0 = L.reduce((acc, l, i) => acc + l * M[i]!, 0);
      if (R0 <= 0) return err("R₀ is zero: no reproduction in this life table, so generation time is undefined.");
      const T = L.reduce((acc, l, i) => acc + i * l * M[i]!, 0) / R0;
      const trend = R0 > 1 ? "Increasing (R₀ > 1)" : R0 < 1 ? "Declining (R₀ < 1)" : "Stable (R₀ = 1)";
      return done([
        outN("Net reproductive rate (R₀)", R0, 4, "", true),
        outN("Generation time (T)", T, 4, "age classes"),
        outS("Trend if conditions stay constant", trend),
      ]);
    },
  },
  {
    slug: "community-similarity",
    fields: [
      intF("a", "Species found only in site A (a)", 5, { min: 0 }),
      intF("b", "Species found only in site B (b)", 3, { min: 0 }),
      intF("c", "Species shared by both sites (c)", 5, { min: 0 }),
    ],
    formulaPlain: "Jaccard = c / (a + b + c);  Sørensen = 2c / (2c + a + b)",
    variables: [
      { symbol: "a", description: "Species unique to site A" },
      { symbol: "b", description: "Species unique to site B" },
      { symbol: "c", description: "Species present at both sites" },
    ],
    assumptions: ["Presence/absence data; abundance is ignored."],
    limitations: ["Both indices depend on sampling effort: the more species you miss, the lower the similarity."],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      const union = a + b + c;
      if (union <= 0) return err("At least one species must be recorded across the two sites.");
      const denom = 2 * c + a + b;
      return done([
        outN("Jaccard similarity", c / union, 4, "", true),
        outN("Sørensen similarity", (2 * c) / denom, 4, "", true),
        outN("Species recorded in total", union, 0),
      ]);
    },
  },
];
