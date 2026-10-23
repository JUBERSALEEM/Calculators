import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { adsConfigured, analyticsConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What this site does and does not collect. Calculator inputs never leave your browser, and no tracking script loads unless explicitly configured.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ href: "/privacy", label: "Privacy" }]} />

      <article className="max-w-3xl pb-16">
        <header className="pt-4">
          <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Privacy policy</h1>
          <p className="mt-3 text-sm text-muted">Last updated: 22 October 2026</p>
        </header>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">The short version</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Calculators run entirely in your browser. The numbers you type are not sent to a server, not
            stored, and not attached to any account. There is no sign-up, and no personal information is
            required to use any tool on this site.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Calculator inputs</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Every calculation is performed locally by JavaScript already loaded on the page. Inputs exist
            only in the memory of the current tab and disappear when you close or reload it. They are never
            transmitted, logged or analysed.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Cookies and local storage</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            The site stores one preference in your browser&rsquo;s local storage: your choice of light or dark
            theme. It contains no identifier and is not readable by any third party. There are no advertising
            or analytics cookies unless the integrations described below are enabled.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Analytics</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            {analyticsConfigured
              ? "Analytics is configured for this deployment. It records page views and aggregate, anonymous interaction counts (for example, that a calculator was used or that an input was rejected). It never records the values you enter."
              : "No analytics service is configured for this deployment. If one is enabled in future, this policy will name the provider, list what is measured, and — where consent is legally required — ask for consent before any measurement cookie is set."}
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Advertising</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            {adsConfigured
              ? "Advertising is enabled for this deployment. Ad units are placed below the calculator and after the explanatory content; they never cover the result or interrupt input. Where required by law, consent is collected before personalised advertising cookies are set."
              : "No advertising is enabled for this deployment. If advertising is introduced, it will be clearly labelled, kept out of the way of the calculator itself, and disclosed here. Pages about health, legal or financial hardship will not carry behavioural advertising."}
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Hosting logs</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Like any website, the hosting provider processes standard request data (IP address, user agent,
            requested path) to serve pages and prevent abuse. That data is governed by the provider&rsquo;s own
            policy and is not combined with anything you enter into a calculator.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Children</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            This site is not directed at children and does not knowingly collect information from them
            beyond ordinary server logs.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Changes</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            If this policy changes materially — for example, when analytics or advertising is introduced —
            the date at the top of this page will change and the new practice will be described here before
            it is enabled.
          </p>
        </section>
      </article>
    </>
  );
}
