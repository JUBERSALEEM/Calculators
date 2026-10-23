/**
 * Catalog entries added by the expansion programme (see docs/project-plan/EXPANSION_PLAN.md).
 * Same shape as CATALOG_ENTRIES. Mirrored as rows in docs/project-plan/catalog.csv.
 */
import type { CatalogEntryRaw } from "@/calculators/catalog-data";

const BIO = { category: "C47", categoryLabel: "Biology and Life Sciences" } as const;
const ECO = { category: "C48", categoryLabel: "Environmental Science and Emissions" } as const;

function entry(
  id: string,
  name: string,
  slug: string,
  cat: { category: string; categoryLabel: string },
  inputsOutputs: string,
  complexity: CatalogEntryRaw["complexity"],
  related: string[],
): CatalogEntryRaw {
  return {
    id,
    name,
    slug,
    ...cat,
    inputsOutputs,
    complexity,
    priority: "P2",
    formulaStatus: "RESEARCH_REQUIRED",
    note: "Standard textbook formula; known-answer tested in calculators/known-answers-expansion.test.ts.",
    intent: "calculate",
    sources: [],
    related,
  };
}

export const EXPANSION_ENTRIES: CatalogEntryRaw[] = [
  entry("CALC-1249", "Allele Frequency from Genotype Counts", "allele-frequency-genotype-counts", BIO,
    "AA, Aa, aa counts -> p, q", "Simple", ["hardy-weinberg", "population-growth"]),
  entry("CALC-1250", "Shannon Diversity Index", "shannon-diversity", ECO,
    "species counts -> H′, evenness", "Moderate", ["simpson-diversity", "community-similarity"]),
  entry("CALC-1251", "Simpson Diversity Index", "simpson-diversity", ECO,
    "species counts -> D, 1 − D", "Simple", ["shannon-diversity", "community-similarity"]),
  entry("CALC-1252", "Lincoln–Petersen Mark-Recapture", "lincoln-petersen", BIO,
    "marked, captured, recaptured -> population N", "Moderate", ["population-growth", "logistic-growth"]),
  entry("CALC-1253", "Net Reproductive Rate and Generation Time", "net-reproductive-rate", BIO,
    "survival and fecundity by age -> R₀, T", "Moderate", ["population-growth", "logistic-growth"]),
  entry("CALC-1254", "Community Similarity (Jaccard and Sørensen)", "community-similarity", ECO,
    "unique and shared species -> similarity", "Simple", ["shannon-diversity", "simpson-diversity"]),
];
