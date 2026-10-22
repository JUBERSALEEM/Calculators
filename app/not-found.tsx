import Link from "next/link";
import { CalculatorSearch } from "@/components/calculator/search";

export const metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  alternates: { canonical: "/404" },
};

export default function NotFound() {
  return (
    <div className="container-page">
      <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">404 — Page not found</h1>
      <p className="text-neutral-700 dark:text-neutral-300 mb-6">
        We couldn&rsquo;t find the page you&rsquo;re looking for. It may have a different URL now,
        or it may not exist yet.
      </p>

      <div className="max-w-2xl">
        <CalculatorSearch />
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/" className="btn-primary w-full">Go to homepage</Link>
        <Link href="/calculators" className="btn-outline w-full">Browse calculators</Link>
        <Link href="/about" className="btn-outline w-full">About</Link>
      </div>
    </div>
  );
}
