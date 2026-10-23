import Link from "next/link";
import { CALCULATORS, getCategories, statusCounts } from "@/calculators/registry";
import { DOMAIN_GROUPS, groupForCategoryCode } from "@/calculators/domain-map";
import { AllCalculatorsTree, type TreeGroup } from "@/components/calculator/all-tree";

export const metadata = {
  title: "All calculators — full list by discipline and category",
  description:
    "The complete list of every calculator in the directory, grouped by discipline and category. Expand any category to see its calculators.",
  alternates: { canonical: "/all-calculators" },
};

export default function AllCalculatorsPage() {
  const categories = getCategories();
  const counts = statusCounts();

  const groups: TreeGroup[] = DOMAIN_GROUPS.map((g) => ({
    id: g.id,
    label: g.label,
    categories: categories
      .filter((c) => groupForCategoryCode(c.code) === g.id)
      .map((c) => ({
        code: c.code,
        slug: c.slug,
        label: c.label,
        items: CALCULATORS.filter((calc) => calc.category === c.code).map((calc) => ({
          slug: calc.slug,
          name: calc.name,
          formulaStatus: calc.formulaStatus,
        })),
      })),
  }));

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">All calculators</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-2 max-w-3xl">
        {CALCULATORS.length.toLocaleString("en-US")} calculators in {DOMAIN_GROUPS.length} disciplines and{" "}
        {categories.length} categories. Expand a category to list its calculators.
      </p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
        {counts.SOURCE_VERIFIED} source-verified · {counts.RESEARCH_REQUIRED.toLocaleString("en-US")} standard formulas ·{" "}
        {counts.SPECIALIST_REVIEW_REQUIRED} specialist review.{" "}
        <Link href="/calculators" className="text-brand-600 dark:text-brand-400 hover:underline">
          Search the directory
        </Link>
      </p>

      <AllCalculatorsTree groups={groups} />
    </div>
  );
}
