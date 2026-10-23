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


function entry2(
  id: string,
  name: string,
  slug: string,
  cat: { category: string; categoryLabel: string },
  inputsOutputs: string,
  complexity: CatalogEntryRaw["complexity"],
  related: string[],
): CatalogEntryRaw {
  return {
    ...entry(id, name, slug, cat, inputsOutputs, complexity, related),
    note: "Standard textbook formula; known-answer tested in calculators/known-answers-expansion-batch2.test.ts.",
  };
}

const BATCH1: CatalogEntryRaw[] = [
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

// Batch 2: biology, lab and ecology calculators (CALC-1255 to 1270).
const BATCH2: CatalogEntryRaw[] = [
  entry2("CALC-1255", "Recombination Frequency and Map Distance (Haldane and Kosambi)", "recombination-map-distance", BIO, 
    "recombinant fraction r -> cM (Haldane, Kosambi)", "Simple", ["population-growth", "hardy-weinberg"]),
  entry2("CALC-1256", "Inbreeding Coefficient from Pedigree Paths", "inbreeding-coefficient-path", BIO, 
    "common ancestors, path lengths -> F", "Moderate", ["hardy-weinberg", "effective-population-size"]),
  entry2("CALC-1257", "Effective Population Size", "effective-population-size", BIO, 
    "breeding males and females -> Ne, ΔF", "Simple", ["inbreeding-coefficient-path", "hardy-weinberg"]),
  entry2("CALC-1258", "Doubling Time and Growth Rate", "doubling-time-growth-rate", BIO, 
    "start and end population, time -> r, doubling time", "Simple", ["population-growth", "logistic-growth"]),
  entry2("CALC-1259", "Plate-Count Viable Cells (CFU per mL)", "plate-count-cfu", BIO, 
    "colonies, dilution, volume plated -> CFU/mL", "Simple", ["dilution-c1v1", "molarity"]),
  entry2("CALC-1260", "Hemocytometer Cell Count", "hemocytometer-cell-count", BIO, 
    "cells counted, squares, dilution -> cells/mL", "Simple", ["plate-count-cfu", "dilution-c1v1"]),
  entry2("CALC-1261", "Solution Osmolarity from van ’t Hoff Factor", "solution-osmolarity", BIO, 
    "concentration, particles per formula unit -> osmol/L", "Simple", ["molarity", "molar-mass"]),
  entry2("CALC-1262", "qPCR Fold Change (ΔΔCt)", "qpcr-fold-change", BIO, 
    "Ct values, efficiency -> fold change", "Moderate", ["plate-count-cfu", "population-growth"]),
  entry2("CALC-1263", "Species–Area Relationship", "species-area-relationship", ECO, 
    "constant c, area A, exponent z -> species S", "Simple", ["margalef-richness", "chao1-richness"]),
  entry2("CALC-1264", "Margalef Richness Index", "margalef-richness", ECO, 
    "species counts -> richness d", "Simple", ["hill-numbers", "berger-parker-dominance"]),
  entry2("CALC-1265", "Berger–Parker Dominance", "berger-parker-dominance", ECO, 
    "species counts -> dominance d", "Simple", ["hill-numbers", "shannon-diversity"]),
  entry2("CALC-1266", "Hill Numbers (Orders 0, 1, 2)", "hill-numbers", ECO, 
    "species counts -> effective number of species", "Moderate", ["shannon-diversity", "simpson-diversity"]),
  entry2("CALC-1267", "Chao1 Species Richness Estimator", "chao1-richness", ECO, 
    "observed species, singletons, doubletons -> estimated richness", "Moderate", ["hill-numbers", "species-area-relationship"]),
  entry2("CALC-1268", "Trophic Transfer Efficiency", "trophic-transfer-efficiency", ECO, 
    "production at levels n and n+1 -> efficiency %", "Simple", ["net-primary-productivity", "lotka-volterra-equilibrium"]),
  entry2("CALC-1269", "Lotka–Volterra Predator–Prey Equilibrium", "lotka-volterra-equilibrium", ECO, 
    "growth, predation, death, conversion rates -> equilibrium densities", "Moderate", ["logistic-growth", "trophic-transfer-efficiency"]),
  entry2("CALC-1270", "Net Primary Productivity", "net-primary-productivity", ECO, 
    "GPP, respiration -> NPP, efficiency", "Simple", ["trophic-transfer-efficiency", "species-area-relationship"]),
];


function entryN(
  id: string,
  name: string,
  slug: string,
  cat: { category: string; categoryLabel: string },
  inputsOutputs: string,
  complexity: CatalogEntryRaw["complexity"],
  related: string[],
): CatalogEntryRaw {
  return {
    ...entry(id, name, slug, cat, inputsOutputs, complexity, related),
    note: "Standard textbook formula; known-answer tested in calculators/known-answers-expansion-batch3.test.ts.",
  };
}

// Batch 3: genetics calculators (CALC-1271 to 1276).
const BATCH3: CatalogEntryRaw[] = [
  entryN("CALC-1271", "LOD Score for Linkage", "lod-score-linkage", BIO, 
    "recombinant and non-recombinant offspring, θ -> LOD", "Moderate", ["recombination-map-distance", "hardy-weinberg"]),
  entryN("CALC-1272", "Mutation–Selection Balance", "mutation-selection-balance", BIO, 
    "mutation rate, selection coefficient -> q̂, carriers", "Moderate", ["hardy-weinberg", "effective-population-size"]),
  entryN("CALC-1273", "Selection Against a Recessive Allele", "recessive-selection-change", BIO, 
    "q, s -> Δq per generation", "Simple", ["mutation-selection-balance", "hardy-weinberg"]),
  entryN("CALC-1274", "Allele Frequency After Migration", "migration-allele-frequency", BIO, 
    "resident and migrant frequencies, rate -> q′", "Simple", ["recessive-selection-change", "effective-population-size"]),
  entryN("CALC-1275", "Heterozygosity Loss by Genetic Drift", "heterozygosity-drift-decay", BIO, 
    "H₀, Ne, generations -> H_t", "Simple", ["effective-population-size", "inbreeding-coefficient-path"]),
  entryN("CALC-1276", "Coefficient of Relationship", "coefficient-of-relationship", BIO, 
    "paths and links -> r", "Simple", ["inbreeding-coefficient-path", "hardy-weinberg"]),
];

export const EXPANSION_ENTRIES: CatalogEntryRaw[] = [...BATCH1, ...BATCH2, ...BATCH3];
