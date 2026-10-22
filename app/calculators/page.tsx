import { CALCULATORS, getCategories } from "@/calculators/registry";
import { CalculatorSearch } from "@/components/calculator/search";
import { CalculatorCard } from "@/components/calculator/calculator-card";

export const metadata = {
  title: "Calculator Directory",
  description: "Browse all verified calculators, grouped by category.",
  alternates: { canonical: "/calculators" },
};

export default function DirectoryPage() {
  const categories = getCategories();
  const implemented = CALCULATORS.filter((c) => c.status === "Implemented");

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
        Calculator directory
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">
        {implemented.length} verified calculators across {categories.length}
        categories. All formulas are documented with sources and limitations.
      </p>

      <div className="mb-8">
        <CalculatorSearch />
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const calcs = CALCULATORS.filter(
            (c) => c.category === cat.slug.toUpperCase()
          );
          return (
            <section key={cat.slug} className="mb-10">
              <h2
                id={`category-${cat.slug}`}
                className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 flex items-center gap-2"
              >
                {cat.label}
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {cat.count}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {calcs.map((calc) => (
                  <CalculatorCard key={calc.slug} calc={calc} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
