import Link from "next/link";
import { CALCULATORS, getCategories, verificationCounts } from "@/calculators/registry";
import { EXPANSION_TARGET_TOTAL, ROADMAP_PHASES, type PhaseStatus } from "@/calculators/roadmap-data";

export const metadata = {
  title: "Roadmap — how the calculator catalog grows",
  description:
    "Phases, targets and acceptance gates for expanding the calculator catalog, with live counts of implemented and verified calculators.",
  alternates: { canonical: "/roadmap" },
};

const STATUS_LABEL: Record<PhaseStatus, string> = {
  complete: "Complete",
  "in-progress": "In progress",
  planned: "Planned",
  gated: "Gated (specialist review)",
};

const STATUS_CLASS: Record<PhaseStatus, string> = {
  complete: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  planned: "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  gated: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};

const pct = (n: number, d: number) => (d > 0 ? Math.min(100, Math.round((n / d) * 100)) : 0);

export default function RoadmapPage() {
  const counts = verificationCounts();
  const categories = getCategories().length;
  const implementedPct = pct(CALCULATORS.length, EXPANSION_TARGET_TOTAL);
  const verifiedPct = pct(counts.verified, CALCULATORS.length);

  return (
    <div className="container-page">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">Catalog roadmap</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-3xl">
        How the calculator catalog grows, phase by phase. Targets are planning estimates. Every calculator must pass the
        same gate before it is marked verified.
      </p>

      <section aria-labelledby="progress" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <h2 id="progress" className="sr-only">Progress</h2>
        <div className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Calculators implemented</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {CALCULATORS.length.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            across {categories} categories · {implementedPct}% of the {EXPANSION_TARGET_TOTAL.toLocaleString("en-US")} target
          </p>
          <div className="mt-3 h-2 rounded bg-neutral-200 dark:bg-neutral-800" role="progressbar" aria-valuenow={implementedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress toward the target size">
            <div className="h-2 rounded bg-brand-600" style={{ width: `${implementedPct}%` }} />
          </div>
        </div>
        <div className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Verified by known-answer tests</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">{counts.verified}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{verifiedPct}% of implemented calculators</p>
          <div className="mt-3 h-2 rounded bg-neutral-200 dark:bg-neutral-800" role="progressbar" aria-valuenow={verifiedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Share of calculators verified">
            <div className="h-2 rounded bg-emerald-600" style={{ width: `${verifiedPct}%` }} />
          </div>
        </div>
        <div className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Smoke-tested only · specialist review</p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            {counts.smokeOnly.toLocaleString("en-US")} · {counts.specialist}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Smoke-tested means finite, labelled results; the formula has not been checked against independent values.
          </p>
        </div>
      </section>

      <ol className="space-y-6">
        {ROADMAP_PHASES.map((p) => (
          <li key={p.id} className="rounded-calc border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{p.id}</span>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">{p.title}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${STATUS_CLASS[p.status]}`}>
                {STATUS_LABEL[p.status]}
              </span>
              {p.targetAdded !== null && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Planned additions: {p.targetAdded.toLocaleString("en-US")}
                </span>
              )}
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">{p.goal}</p>
            <ul className="list-disc pl-6 text-sm text-neutral-700 dark:text-neutral-300 mb-3 space-y-1">
              {p.scope.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              <strong className="font-medium">Acceptance gate:</strong> {p.gate}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-sm text-neutral-500 dark:text-neutral-400">
        Browse what exists now in the <Link href="/all-calculators" className="text-brand-600 dark:text-brand-400 hover:underline">full list</Link> or the{" "}
        <Link href="/calculators" className="text-brand-600 dark:text-brand-400 hover:underline">directory</Link>.
      </p>
    </div>
  );
}
