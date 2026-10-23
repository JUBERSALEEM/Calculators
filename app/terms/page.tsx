import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms of use for this calculator site: information only, no professional advice, no warranty of fitness for a particular purpose.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/terms", label: "Terms" }]} />

      <article className="max-w-3xl pb-16">
        <header className="pt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Terms of use</h1>
          <p className="mt-3 text-sm text-muted">Last updated: 22 October 2026</p>
        </header>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Information, not advice</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            The calculators and explanations on this site are provided for general information. They are not
            medical, legal, financial, tax, engineering or safety advice, and they do not create a
            professional relationship of any kind. Decisions with real consequences should be checked by a
            suitably qualified professional who knows your circumstances.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Accuracy</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Formulas are researched and tested, and each page documents its assumptions and sources. Even so,
            no warranty is given that a result is accurate, complete or suitable for a particular purpose.
            Methods, standards and regulations change, and a calculator may lag behind a change. Where a
            result matters, verify it against the cited primary source.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Third-party sources</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Links to regulators, standards bodies and other organisations are provided so you can check the
            method. Those organisations do not endorse this site, and their terms govern the use of their
            material.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Acceptable use</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            You may use the calculators freely for personal or commercial purposes. You may not attempt to
            disrupt the site, scrape it at a volume that degrades service for others, or present its output
            as advice to third parties without independently verifying it.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Liability</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            To the extent permitted by law, the site is provided &ldquo;as is&rdquo; without warranties of any kind,
            and no liability is accepted for loss arising from reliance on a result. Nothing in these terms
            limits liability that cannot lawfully be limited.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Privacy</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            See the{" "}
            <Link href="/privacy" className="text-accent-ink underline underline-offset-2">
              privacy policy
            </Link>{" "}
            for what the site does and does not collect.
          </p>
        </section>
      </article>
    </>
  );
}
