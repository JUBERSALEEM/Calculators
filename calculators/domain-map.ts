/**
 * Domain grouping for the 1,248-calculator engine.
 *
 * Every catalog category (C01–C84) belongs to exactly one domain module. The
 * mapping is intentionally static so bundlers can emit one lazily-loaded chunk
 * per discipline instead of shipping all 1,000+ specs to every page.
 */
export const DOMAIN_GROUPS = [
  { id: 1, key: "math-core", label: "Arithmetic, Algebra and Geometry", from: 1, to: 5 },
  { id: 2, key: "math-advanced", label: "Calculus, Linear Algebra, Statistics and Discrete Maths", from: 6, to: 9 },
  { id: 3, key: "finance", label: "Finance, Loans, Investments and Retirement", from: 10, to: 14 },
  { id: 4, key: "business", label: "Accounting, Tax, Payroll, Economics and Marketing", from: 15, to: 22 },
  { id: 5, key: "engineering", label: "Construction, Mechanical, Electrical and Process Engineering", from: 23, to: 31 },
  { id: 6, key: "industry", label: "Manufacturing, Trades, Logistics, Transport and Physics", from: 32, to: 45 },
  { id: 7, key: "science", label: "Chemistry, Biology, Environment, Energy, Earth and Life Sciences", from: 46, to: 57 },
  { id: 8, key: "digital", label: "Health, Dates, Units, Computing, Media and Education", from: 58, to: 71 },
  { id: 9, key: "civic", label: "Quality, HR, Insurance, Law, Gaming, Sport, Travel and Everyday", from: 72, to: 84 },
] as const;

export type DomainGroupId = (typeof DOMAIN_GROUPS)[number]["id"];

export function groupForCategoryCode(code: string): DomainGroupId {
  const num = Number(code.replace(/^C/i, ""));
  for (const g of DOMAIN_GROUPS) {
    if (num >= g.from && num <= g.to) return g.id;
  }
  return 9;
}

export function groupForSlug(slug: string, categoryOf: (s: string) => string | undefined): DomainGroupId {
  const code = categoryOf(slug);
  return code ? groupForCategoryCode(code) : 9;
}
