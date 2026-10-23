/**
 * Expansion batch 1 — biology and ecology calculators that were not already in the catalog.
 *
 * Each formula is a standard textbook result. Known-answer tests are in
 * calculators/known-answers-expansion.test.ts; their expected values were computed
 * independently (Python), not taken from this file.
 */
import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { done, intF, nnF, numF, outN, outS, parseNumList, posF, txtF } from "@/lib/engine/helpers";

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
  {
    slug: "recombination-map-distance",
    fields: [numF("r", "Recombination fraction (r), 0 up to but not including 0.5", 0.1, "fraction", { min: 0, max: 0.4999 })],
    formulaPlain: "Haldane: d = −½ ln(1 − 2r);  Kosambi: d = ¼ ln[(1 + 2r) / (1 − 2r)];  distances in Morgans × 100 = cM",
    variables: [
      { symbol: "r", description: "Proportion of meioses with a recombinant gamete between two loci" },
      { symbol: "d", description: "Map distance in Morgans (1 M = 100 cM)" },
    ],
    assumptions: ["Two linked loci on one chromosome; r is estimated from offspring counts (recombinants ÷ total)."],
    limitations: ["r = 0.5 means unlinked loci (independent assortment): no map distance exists. Haldane assumes no crossover interference; Kosambi allows partial interference."],
    compute: (v) => {
      const r = Number(v.r);
      if (!Number.isFinite(r) || r < 0 || r >= 0.5)
        return err("Recombination fraction must be at least 0 and below 0.5 (0.5 means unlinked loci, with no map distance).");
      const haldane = -0.5 * Math.log(1 - 2 * r);
      const kosambi = 0.25 * Math.log((1 + 2 * r) / (1 - 2 * r));
      return done([
        outN("Recombination frequency", r * 100, 2, "%"),
        outN("Haldane map distance", haldane * 100, 4, "cM", true),
        outN("Kosambi map distance", kosambi * 100, 4, "cM", true),
      ]);
    },
  },
  {
    slug: "inbreeding-coefficient-path",
    fields: [
      intF("k", "Number of common ancestors (k)", 2, { min: 1 }),
      intF("n1", "Generations from common ancestor to parent 1 (n₁)", 2, { min: 1 }),
      intF("n2", "Generations from common ancestor to parent 2 (n₂)", 2, { min: 1 }),
      numF("FA", "Inbreeding coefficient of the common ancestor (F_A)", 0, "fraction", { min: 0, max: 0.999 }),
    ],
    formulaPlain: "Wright's path method: F = Σ (½)^(n₁ + n₂ + 1) · (1 + F_A), summed over the common ancestors",
    variables: [
      { symbol: "F", description: "Inbreeding coefficient of the offspring of the two parents" },
      { symbol: "n₁, n₂", description: "Number of generations from the common ancestor down to each parent" },
      { symbol: "F_A", description: "Inbreeding coefficient of the common ancestor" },
    ],
    assumptions: ["Every common ancestor is reached by the same pair of path lengths (k identical paths).", "Paths are counted only through the listed common ancestors."],
    limitations: ["Real pedigrees can have several different path lengths; sum each path separately and enter them one at a time."],
    compute: (v) => {
      const k = Number(v.k), n1 = Number(v.n1), n2 = Number(v.n2), FA = Number(v.FA);
      if (!Number.isFinite(FA) || FA < 0 || FA >= 1) return err("F_A must be at least 0 and below 1.");
      const F = k * Math.pow(0.5, n1 + n2 + 1) * (1 + FA);
      return done([
        outN("Inbreeding coefficient (F)", F, 5, "", true),
        outN("Inbreeding as a percentage", F * 100, 3, "%"),
      ]);
    },
  },
  {
    slug: "effective-population-size",
    fields: [
      intF("Nm", "Breeding males (Nm)", 10, { min: 1 }),
      intF("Nf", "Breeding females (Nf)", 30, { min: 1 }),
    ],
    formulaPlain: "Ne = 4·Nm·Nf / (Nm + Nf);  inbreeding rate per generation ΔF = 1 / (2·Ne)",
    variables: [
      { symbol: "Ne", description: "Effective population size (the idealised population that loses genetic diversity at the same rate)" },
      { symbol: "Nm, Nf", description: "Numbers of breeding males and breeding females" },
    ],
    assumptions: ["Random mating, equal variance in family size, and non-overlapping generations (Wright's idealised model)."],
    limitations: ["Real populations usually have Ne well below the census size N."],
    compute: (v) => {
      const Nm = Number(v.Nm), Nf = Number(v.Nf);
      const Ne = (4 * Nm * Nf) / (Nm + Nf);
      return done([
        outN("Effective population size (Ne)", Ne, 2, "individuals", true),
        outN("Inbreeding rate per generation (ΔF)", 1 / (2 * Ne), 5),
      ]);
    },
  },
  {
    slug: "doubling-time-growth-rate",
    fields: [
      posF("N0", "Starting population (N₀)", 100, "cells"),
      posF("N", "Population at the end (N)", 800, "cells"),
      posF("t", "Elapsed time (t)", 6, "time units"),
    ],
    formulaPlain: "Growth rate r = ln(N / N₀) / t;  doubling time t_d = t · ln 2 / ln(N / N₀)",
    variables: [
      { symbol: "N₀, N", description: "Population at the start and end of the interval" },
      { symbol: "r", description: "Per-capita growth rate (per time unit)" },
      { symbol: "t_d", description: "Time for the population to double" },
    ],
    assumptions: ["Exponential growth over the interval (no limits on resources)."],
    limitations: ["Doubling time is undefined when the population did not grow; the calculator shows that instead of a value."],
    compute: (v) => {
      const N0 = Number(v.N0), N = Number(v.N), t = Number(v.t);
      const lnRatio = Math.log(N / N0);
      const r = lnRatio / t;
      return done([
        outN("Per-capita growth rate (r)", r, 4, "per time unit", true),
        N > N0
          ? outN("Doubling time (t_d)", (t * Math.LN2) / lnRatio, 4, "time units", true)
          : outS("Doubling time (t_d)", "undefined — population did not grow"),
      ]);
    },
  },
  {
    slug: "plate-count-cfu",
    fields: [
      intF("colonies", "Colonies counted on the plate", 42, { min: 0 }),
      posF("dilution", "Dilution factor of the plated tube (10⁻⁴ → 10000)", 10000, "×"),
      posF("vol", "Volume plated", 0.1, "mL"),
    ],
    formulaPlain: "CFU per mL = colonies × dilution factor / volume plated (mL)",
    variables: [
      { symbol: "CFU", description: "Colony-forming units (each colony is assumed to grow from one viable cell)" },
    ],
    assumptions: ["Each colony arises from a single viable cell; the sample was mixed evenly before plating."],
    limitations: ["Counts below 30 or above 300 colonies per plate are outside the usual countable range and are less reliable."],
    compute: (v) => {
      const c = Number(v.colonies), dil = Number(v.dilution), vol = Number(v.vol);
      const cfu = (c * dil) / vol;
      const advisory =
        c === 0
          ? "No colonies counted: this is a detection limit, not a count."
          : c < 30 || c > 300
            ? "Outside the usual countable range (30–300 colonies per plate)."
            : undefined;
      return done(
        [outN("Viable count (CFU per mL)", cfu, 0, "CFU/mL", true)],
        advisory,
      );
    },
  },
  {
    slug: "hemocytometer-cell-count",
    fields: [
      intF("total", "Cells counted in all squares", 120, { min: 0 }),
      intF("squares", "Number of squares counted", 4, { min: 1 }),
      posF("dil", "Dilution factor of the sample (1:1 with trypan blue → 2)", 2, "×"),
    ],
    formulaPlain: "Cells per mL = (total cells ÷ squares counted) × dilution factor × 10⁴",
    variables: [
      { symbol: "10⁴", description: "Converts counts per 0.1 µL (one large square at 0.1 mm depth) into counts per mL" },
    ],
    assumptions: ["Standard counting chamber with 0.1 mm depth and 1 mm² large squares (Neubauer-type)."],
    limitations: ["Aim for roughly 20–100 cells per square; more or fewer gives poor precision."],
    compute: (v) => {
      const total = Number(v.total), squares = Number(v.squares), dil = Number(v.dil);
      const avg = total / squares;
      return done([
        outN("Average cells per square", avg, 2),
        outN("Cells per mL", avg * dil * 1e4, 0, "cells/mL", true),
      ]);
    },
  },
  {
    slug: "solution-osmolarity",
    fields: [
      nnF("c", "Solute concentration (c)", 0.15, "mol/L"),
      posF("i", "van ’t Hoff factor (i), particles per formula unit", 2, ""),
    ],
    formulaPlain: "Osmolarity = i · c   (osmol/L; × 1000 = mOsm/L)",
    variables: [
      { symbol: "i", description: "Number of dissolved particles per formula unit (NaCl ≈ 2 in dilute solution)" },
      { symbol: "c", description: "Molar concentration of the solute" },
    ],
    assumptions: ["Ideal dilute solution: the osmotic coefficient is taken as 1."],
    limitations: ["Real solutions deviate from ideal behaviour at higher concentrations; this estimate is for laboratory solutions, not clinical interpretation."],
    compute: (v) => {
      const c = Number(v.c), i = Number(v.i);
      return done([
        outN("Osmolarity", i * c * 1000, 1, "mOsm/L", true),
        outN("Osmolarity in osmol/L", i * c, 4, "osmol/L"),
      ]);
    },
  },
  {
    slug: "qpcr-fold-change",
    fields: [
      numF("ctT", "Target gene Ct, treated sample", 24, "cycles", { min: 0, max: 50 }),
      numF("ctR", "Reference gene Ct, treated sample", 18, "cycles", { min: 0, max: 50 }),
      numF("ctTc", "Target gene Ct, control sample", 26, "cycles", { min: 0, max: 50 }),
      numF("ctRc", "Reference gene Ct, control sample", 18, "cycles", { min: 0, max: 50 }),
      numF("E", "Amplification efficiency E (1 = 100% per cycle)", 1, "", { gt: 0, max: 2 }),
    ],
    formulaPlain: "ΔCt = Ct(target) − Ct(reference);  ΔΔCt = ΔCt(treated) − ΔCt(control);  fold change = (1 + E)^(−ΔΔCt)",
    variables: [
      { symbol: "Ct", description: "Threshold cycle at which fluorescence crosses the threshold" },
      { symbol: "E", description: "Per-cycle amplification efficiency (same for target and reference)" },
    ],
    assumptions: ["Target and reference genes have similar efficiency E; with E = 1 the formula is the standard 2^(−ΔΔCt) method."],
    limitations: ["Ct values from a single well are not reliable; use replicates and check the melt curve."],
    compute: (v) => {
      const dT = Number(v.ctT) - Number(v.ctR);
      const dC = Number(v.ctTc) - Number(v.ctRc);
      const ddCt = dT - dC;
      const E = Number(v.E);
      return done([
        outN("ΔCt, treated (target − reference)", dT, 2, "cycles"),
        outN("ΔCt, control (target − reference)", dC, 2, "cycles"),
        outN("ΔΔCt", ddCt, 2, "cycles"),
        outN("Fold change in target expression", Math.pow(1 + E, -ddCt), 4, "×", true),
      ]);
    },
  },
  {
    slug: "species-area-relationship",
    fields: [
      posF("c", "Species–area constant (c)", 10, ""),
      posF("A", "Area (A)", 16, "area units"),
      numF("z", "Exponent (z), above 0 up to 1", 0.25, "", { gt: 0, max: 1 }),
    ],
    formulaPlain: "S = c · A^z;  species gained when area doubles = S · (2^z − 1)",
    variables: [
      { symbol: "S", description: "Expected number of species in area A" },
      { symbol: "c, z", description: "Constants fitted to survey data for one habitat type and taxon" },
    ],
    assumptions: ["Power-law form; c and z fitted for the habitat and taxon, and valid over the surveyed range of areas."],
    limitations: ["Do not extrapolate far beyond the surveyed areas; z values differ across habitats and taxa."],
    compute: (v) => {
      const c = Number(v.c), A = Number(v.A), z = Number(v.z);
      const S = c * Math.pow(A, z);
      return done([
        outN("Expected species in area A (S)", S, 2, "species", true),
        outN("Ratio S(2A) / S(A) = 2^z", Math.pow(2, z), 4, "×"),
        outN("Species gained by doubling the area", S * (Math.pow(2, z) - 1), 2, "species"),
      ]);
    },
  },
  {
    slug: "margalef-richness",
    fields: [txtF("counts", "Individuals per species (comma-separated)", "10, 20, 30, 40")],
    formulaPlain: "Margalef richness d = (S − 1) / ln N,   S = species present, N = total individuals",
    variables: [
      { symbol: "S", description: "Number of species with at least one individual" },
      { symbol: "N", description: "Total number of individuals counted" },
    ],
    assumptions: ["Richness depends on sample size, so compare only samples of similar size."],
    limitations: ["Needs at least 2 individuals (ln 1 = 0 makes the index undefined)."],
    compute: (v) => {
      const parsed = parseCounts(String(v.counts));
      if (!parsed.ok) return parsed;
      const present = parsed.value.filter((x) => x > 0);
      const N = present.reduce((a, b) => a + b, 0);
      if (N < 2) return err("Margalef richness needs at least 2 individuals.");
      const S = present.length;
      return done([
        outN("Margalef richness (d)", (S - 1) / Math.log(N), 4, "", true),
        outN("Species present (S)", S, 0),
        outN("Individuals counted (N)", N, 0),
      ]);
    },
  },
  {
    slug: "berger-parker-dominance",
    fields: [txtF("counts", "Individuals per species (comma-separated)", "10, 20, 30, 40")],
    formulaPlain: "d = n_max / N,   where n_max is the count of the most abundant species and N is the total",
    variables: [{ symbol: "d", description: "Proportion of the sample made up by the most common species" }],
    assumptions: ["Counts are for one sample from one community."],
    limitations: ["Depends only on the most abundant species; it says nothing about rare species."],
    compute: (v) => {
      const parsed = parseCounts(String(v.counts));
      if (!parsed.ok) return parsed;
      const N = parsed.value.reduce((a, b) => a + b, 0);
      const nmax = Math.max(...parsed.value);
      return done([
        outN("Berger–Parker dominance (d)", nmax / N, 4, "", true),
        outN("Inverse dominance (1 / d)", N / nmax, 4),
      ]);
    },
  },
  {
    slug: "hill-numbers",
    fields: [txtF("counts", "Individuals per species (comma-separated)", "10, 20, 30, 40")],
    formulaPlain: "Order 0: D₀ = S;  order 1: D₁ = exp(H′);  order 2: D₂ = 1 / Σ pᵢ²",
    variables: [
      { symbol: "pᵢ", description: "Proportion of individuals in species i" },
      { symbol: "H′", description: "Shannon index (natural logarithm)" },
    ],
    assumptions: ["Equal weighting of species is not assumed; the order q sets how strongly common species count."],
    limitations: ["Hill numbers are effective numbers of species, not counts of observed species (except order 0)."],
    compute: (v) => {
      const parsed = parseCounts(String(v.counts));
      if (!parsed.ok) return parsed;
      const present = parsed.value.filter((x) => x > 0);
      const N = present.reduce((a, b) => a + b, 0);
      const H = -present.reduce((acc, n) => acc + (n / N) * Math.log(n / N), 0);
      const sumSq = present.reduce((acc, n) => acc + (n / N) ** 2, 0);
      return done([
        outN("Hill number order 0 (= richness S)", present.length, 0),
        outN("Hill number order 1 (exp H′)", Math.exp(H), 4, "", true),
        outN("Hill number order 2 (1 / Σ pᵢ²)", 1 / sumSq, 4),
      ]);
    },
  },
  {
    slug: "chao1-richness",
    fields: [
      intF("S", "Species observed (S_obs)", 20, { min: 0 }),
      intF("F1", "Singletons: species seen exactly once (f₁)", 10, { min: 0 }),
      intF("F2", "Doubletons: species seen exactly twice (f₂)", 5, { min: 0 }),
    ],
    formulaPlain: "Bias-corrected Chao1 = S_obs + f₁(f₁ − 1) / [2(f₂ + 1)];  classic Chao1 = S_obs + f₁² / (2 f₂)",
    variables: [
      { symbol: "S_obs", description: "Species actually observed in the sample" },
      { symbol: "f₁, f₂", description: "Number of species represented by exactly one or two individuals" },
    ],
    assumptions: ["Rare species carry the information about unseen species; sampling is random."],
    limitations: ["An estimate of total richness, not a count. Unreliable for very small samples."],
    compute: (v) => {
      const S = Number(v.S), F1 = Number(v.F1), F2 = Number(v.F2);
      if (F1 + F2 > S) return err("Singletons plus doubletons cannot exceed the number of species observed.");
      const chao = S + (F1 * (F1 - 1)) / (2 * (F2 + 1));
      return done([
        outN("Chao1 richness (bias-corrected)", chao, 1, "species", true),
        outN("Estimated unseen species", chao - S, 1, "species"),
        F2 > 0
          ? outN("Chao1 richness (classic)", S + (F1 * F1) / (2 * F2), 1, "species")
          : outS("Chao1 richness (classic)", "undefined — no doubletons (f₂ = 0)"),
      ]);
    },
  },
  {
    slug: "trophic-transfer-efficiency",
    fields: [
      posF("Pn", "Production at trophic level n", 1000, "kcal/m²/yr"),
      nnF("Pn1", "Production at trophic level n + 1", 100, "kcal/m²/yr"),
    ],
    formulaPlain: "Transfer efficiency = P(n+1) / P(n) × 100%;  energy not transferred = 100% − efficiency",
    variables: [{ symbol: "P", description: "Production (energy fixed per unit area per year) at a trophic level" }],
    assumptions: ["Production values are measured for the same area and time period."],
    limitations: ["Efficiencies vary widely between food chains; the often-cited 10% is only a rough rule of thumb."],
    compute: (v) => {
      const Pn = Number(v.Pn), Pn1 = Number(v.Pn1);
      if (Pn1 > Pn) return err("Production at level n + 1 cannot exceed production at level n (efficiency above 100%).");
      const eff = (Pn1 / Pn) * 100;
      return done([
        outN("Trophic transfer efficiency", eff, 2, "%", true),
        outN("Energy not transferred", 100 - eff, 2, "%"),
      ]);
    },
  },
  {
    slug: "lotka-volterra-equilibrium",
    fields: [
      posF("alpha", "Prey growth rate (α)", 1, "per time unit"),
      posF("beta", "Predation rate (β)", 0.1, "per prey × predator"),
      posF("gamma", "Predator death rate (γ)", 1.5, "per time unit"),
      posF("delta", "Predator conversion rate (δ)", 0.075, "per prey × predator"),
    ],
    formulaPlain: "dx/dt = αx − βxy;  dy/dt = δxy − γy;  interior equilibrium: x* = γ / δ (prey),  y* = α / β (predators)",
    variables: [
      { symbol: "x, y", description: "Prey and predator densities" },
      { symbol: "x*, y*", description: "Densities at which both populations stop changing" },
    ],
    assumptions: ["Idealised two-species model: prey grow without limit in the absence of predators; predators eat prey at rate βxy."],
    limitations: ["The classic model has neutral cycles around the equilibrium and ignores limits on prey growth; it is a teaching model, not a forecast."],
    compute: (v) => {
      const a = Number(v.alpha), b = Number(v.beta), g = Number(v.gamma), d = Number(v.delta);
      return done([
        outN("Equilibrium prey density (x* = γ / δ)", g / d, 2, "individuals", true),
        outN("Equilibrium predator density (y* = α / β)", a / b, 2, "individuals", true),
      ]);
    },
  },
  {
    slug: "net-primary-productivity",
    fields: [
      posF("GPP", "Gross primary productivity (GPP)", 1200, "g C/m²/yr"),
      nnF("R", "Autotroph respiration (R)", 600, "g C/m²/yr"),
    ],
    formulaPlain: "NPP = GPP − R;  NPP efficiency = NPP / GPP × 100%",
    variables: [
      { symbol: "GPP", description: "Carbon fixed by photosynthesis per unit area per year" },
      { symbol: "R", description: "Carbon used by plants for respiration" },
    ],
    assumptions: ["GPP and respiration are measured for the same area and period."],
    limitations: ["Heterotroph consumption is not subtracted, so this is not net ecosystem production."],
    compute: (v) => {
      const G = Number(v.GPP), R = Number(v.R);
      const npp = G - R;
      return done(
        [
          outN("Net primary productivity (NPP)", npp, 1, "g C/m²/yr", true),
          outN("NPP efficiency (NPP / GPP)", (npp / G) * 100, 2, "%"),
        ],
        npp < 0 ? "Respiration exceeds GPP: the plants are a net carbon source in this period." : undefined,
      );
    },
  },
];
