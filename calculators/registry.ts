/**
 * Calculator registry — single source of truth for routing, SEO and navigation.
 *
 * One row per catalog entry in docs/project-plan/catalog.csv (1,248 calculators,
 * 84 categories). Each entry maps to exactly one executable spec in
 * calculators/domains/*, loaded lazily per discipline.
 *
 * status "Implemented" means an executable spec exists in this repository and
 * passes the smoke tests (finite, labelled results). It does NOT mean the formula
 * has been independently verified; see docs/project-plan/catalog.csv for that. It is NOT a claim that formula_status has been upgraded: the
 * catalog's formula_status is preserved verbatim from the research log, and
 * SPECIALIST_REVIEW_REQUIRED tools stay flagged in the UI.
 */

import { CATALOG_CATEGORIES, CATALOG_ENTRIES, type CatalogEntryRaw } from "@/calculators/catalog-data";
import { EXPANSION_ENTRIES } from "@/calculators/expansion/catalog-expansion";
import { VERIFIED_SLUGS } from "@/calculators/verified-slugs";
import { groupForCategoryCode, type DomainGroupId } from "@/calculators/domain-map";

export interface CalculatorMeta {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  description: string;
  intent: "calculate" | "convert" | "estimate";
  status: "Implemented" | "Planned" | "Deferred";
  formulaStatus:
    | "SOURCE_VERIFIED"
    | "RESEARCH_REQUIRED"
    | "SPECIALIST_REVIEW_REQUIRED";
  sources: Array<{ code: string; title: string; url: string; accessed: string }>;
  lastReviewed: string;
  inputs: Array<{ label: string; unit: string; placeholder?: string }>;
  outputLabel: string;
  related: string[];
}

function describe(entry: CatalogEntryRaw): string {
  const io = entry.inputsOutputs.replace(/->/g, "→").replace(/<->/g, "↔");
  const flag =
    entry.formulaStatus === "SPECIALIST_REVIEW_REQUIRED"
      ? " Code- or clinically-gated parameters are user-supplied and the tool is flagged for specialist review."
      : entry.formulaStatus === "SOURCE_VERIFIED"
        ? " Formula parameters verified against the cited authoritative source."
        : "";
  return `${entry.name}: ${io}. ${entry.categoryLabel}.${flag}`;
}

/** Every calculator: the planned catalog plus expansion entries. */
export const ALL_ENTRIES: CatalogEntryRaw[] = [...CATALOG_ENTRIES, ...EXPANSION_ENTRIES];

export const CALCULATORS: CalculatorMeta[] = ALL_ENTRIES.map((entry) => ({
  id: entry.id,
  name: entry.name,
  slug: entry.slug,
  category: entry.category,
  categoryLabel: entry.categoryLabel,
  description: describe(entry),
  intent: entry.intent,
  status: "Implemented",
  formulaStatus: entry.formulaStatus,
  sources: entry.sources,
  lastReviewed: "2026-10-22",
  inputs: [],
  outputLabel: entry.name,
  related: entry.related,
}));

const BY_SLUG = new Map(CALCULATORS.map((c) => [c.slug, c]));

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return BY_SLUG.get(slug);
}

export function getCalculatorSlugs(): string[] {
  return CALCULATORS.map((c) => c.slug);
}

export interface CategoryMeta {
  slug: string;
  code: string;
  label: string;
  fullLabel: string;
  count: number;
}

export function getCategories(): CategoryMeta[] {
  return CATALOG_CATEGORIES.map((c) => ({
    slug: c.slug,
    code: c.code,
    label: c.title,
    fullLabel: c.label,
    count: ALL_ENTRIES.filter((e) => e.category === c.code).length,
  }));
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getCalculatorsInCategory(code: string): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.category === code);
}

export function groupForSlug(slug: string): DomainGroupId {
  const meta = BY_SLUG.get(slug);
  return meta ? groupForCategoryCode(meta.category) : 1;
}

export function statusCounts() {
  const out = { SOURCE_VERIFIED: 0, RESEARCH_REQUIRED: 0, SPECIALIST_REVIEW_REQUIRED: 0 };
  for (const e of ALL_ENTRIES) out[e.formulaStatus] += 1;
  return out;
}

/** Specialist-gated entries are excluded from the sitemap and marked noindex. */
export function isIndexable(meta: CalculatorMeta): boolean {
  return meta.formulaStatus !== "SPECIALIST_REVIEW_REQUIRED";
}

export const TOTAL_CALCULATORS = CALCULATORS.length;
export const TOTAL_CATEGORIES = CATALOG_CATEGORIES.length;

/**
 * Verification counts shown in the UI. "Verified" = asserted against independently computed
 * values in a known-answer test (see calculators/verification.test.ts for the CSV agreement check).
 */
export function verificationCounts() {
  const total = CALCULATORS.length;
  const verified = CALCULATORS.filter((c) => VERIFIED_SLUGS.has(c.slug)).length;
  const specialist = CALCULATORS.filter((c) => c.formulaStatus === "SPECIALIST_REVIEW_REQUIRED").length;
  return { total, verified, specialist, smokeOnly: total - verified - specialist };
}

export const TOTAL_LABEL = TOTAL_CALCULATORS.toLocaleString("en-US");
