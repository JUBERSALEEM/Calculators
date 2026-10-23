/**
 * Expansion roadmap: phases, targets and acceptance gates. Mirrored in
 * docs/project-plan/EXPANSION_PLAN.md. Targets are planning estimates, not commitments.
 */
export type PhaseStatus = "complete" | "in-progress" | "planned" | "gated";

export interface RoadmapPhase {
  id: string;
  title: string;
  status: PhaseStatus;
  goal: string;
  scope: string[];
  /** Estimated number of calculators this phase adds (planning target). */
  targetAdded: number | null;
  /** Calculators actually added so far in this phase (kept in step with the catalog CSV). */
  addedSoFar: number;
  /** Acceptance gate every calculator in this phase must pass before it is marked verified. */
  gate: string;
}

export const ENTRY_GATE =
  "Formula cited to a standard or derived from a stated textbook result · inputs typed with units and ranges · " +
  "zero denominators and domain limits return readable errors · no NaN or Infinity · known-answer test with values " +
  "computed independently of the code · catalog row and CSV status updated only after the test passes.";

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "P0",
    title: "Baseline catalog",
    status: "complete",
    goal: "Planned catalog of 1,248 calculators across 84 categories, with formula status for every entry.",
    scope: ["84 categories (C01–C84)", "21 source-verified entries", "59 specialist-review entries (kept gated)"],
    targetAdded: 1248,
    addedSoFar: 1248,
    gate: "Catalog generated from docs/project-plan/tools/catalog_source.py; coverage test passes.",
  },
  {
    id: "P1",
    title: "Biology and ecology batch 1",
    status: "complete",
    goal: "Add biology and ecology calculators that were missing from the baseline (genetics frequencies, diversity, mark-recapture, life tables, community similarity).",
    scope: [
      "Allele frequency from genotype counts",
      "Shannon and Simpson diversity",
      "Lincoln–Petersen and Chapman estimators",
      "Net reproductive rate and generation time",
      "Jaccard and Sørensen community similarity",
    ],
    targetAdded: 6,
    addedSoFar: 6,
    gate: ENTRY_GATE,
  },
  {
    id: "P2",
    title: "Life sciences, lab and animal calculators",
    status: "in-progress",
    goal: "Genetics (linkage, inbreeding, pedigree), lab calculations (osmolarity, cell counts, plate dilutions), population ecology, animal and pet energy needs.",
    scope: [
      "Genetics: linkage distance, inbreeding coefficient, recombination frequency",
      "Lab: osmolarity, cell count to concentration, plate-count dilutions",
      "Ecology: species–area, relative abundance, Lotka–Volterra equilibrium",
      "Animal energy: maintenance energy requirement (published equations, cited)",
    ],
    targetAdded: 150,
    addedSoFar: 16,
    gate: ENTRY_GATE + " Animal dosing or clinical use is out of scope: those become SPECIALIST_REVIEW_REQUIRED.",
  },
  {
    id: "P3",
    title: "Verify the planned catalog",
    status: "planned",
    goal: "Give known-answer tests to every RESEARCH_REQUIRED entry with a closed-form formula, starting with mathematics, statistics and finance (C01–C16).",
    scope: ["Mathematics and statistics (m01, m02)", "Finance and accounting (m03, m04)", "Engineering formulas (m05, m06)"],
    targetAdded: null,
    addedSoFar: 0,
    gate: ENTRY_GATE + " Entries that cannot meet the gate keep Smoke-tested status and are listed in the plan.",
  },
  {
    id: "P4",
    title: "Expansion to about 4,000 calculators",
    status: "planned",
    goal: "Reach about 4,000 calculators. Close variants that people search for (for example unit pairs and calculator variants) are allowed as separate pages, per the revised rule O1.",
    scope: [
      "Unit-pair converters generated from the verified base converters",
      "Domain variants (for example mortgage variants, sport pace variants) with distinct inputs or outputs",
      "Ecology, environmental and everyday calculators not yet covered",
    ],
    targetAdded: 2700,
    addedSoFar: 0,
    gate: ENTRY_GATE + " Each variant states how it differs from its base calculator.",
  },
  {
    id: "P5",
    title: "Specialist-review tools",
    status: "gated",
    goal: "Keep building-code, clinical, statutory and licensed-table calculators behind a specialist review. They are never marked verified without licensed data and sign-off.",
    scope: ["59 specialist-review entries", "Excluded from the sitemap and marked noindex"],
    targetAdded: null,
    addedSoFar: 0,
    gate: "Licensed source and qualified reviewer sign-off recorded in the catalog; otherwise the tool stays flagged.",
  },
];

export const EXPANSION_TARGET_TOTAL = 4000;
