---

## 9. Formula Verification Standards

### 9.1 Status model

| Status | Meaning in this project | What it licenses |
|---|---|---|
| `DISCOVERED` | Candidate identified, nothing else | Nothing; discovery only. Not used in §8 (every entry has at least a documented family) |
| `RESEARCH_REQUIRED` | Method documented as a family; **no inspected citation** | Implementation may be prototyped behind a flag; must not be published |
| `SOURCE_VERIFIED` | Method checked against an inspected authoritative source | Implementation allowed; publication still requires tests + editorial gate |
| `INDEPENDENTLY_VALIDATED` | A second, independent calculation (second source, reference implementation, or hand-derived closed form) reproduces the result | Publication allowed for low/medium-risk entries |
| `SPECIALIST_REVIEW_REQUIRED` | Licensed standard, clinical, legal, or safety consequence | Must not be published without a named qualified reviewer's sign-off |
| `IMPLEMENTED` | Working typed module exists | — |
| `TESTED` | The §15 test set passes in CI | — |
| `PUBLISHED` | Approved for public release | Only this state may be indexed |
| `NEEDS_REVIEW` | Defect, source conflict or upstream change | Page must be `noindex` or removed until cleared |
| `RETIRED` | Intentionally withdrawn (duplicate, superseded, unsupported) | 301 to the closest replacement; never a 404 |

Statuses are **not** interchangeable and are **not** cumulative by assertion: `SOURCE_VERIFIED`
plus a passing test does not equal `PUBLISHED`. The publication gate in §15 is a separate,
human-owned decision.

### 9.2 Four separate verification responsibilities

| # | Question | Owner | Evidence |
|---|---|---|---|
| V1 | Is the **mathematics** right? | Formula researcher | Inspected source(s) + independent derivation |
| V2 | Is the **implementation** faithful? | Implementer + reviewer | Known-answer tests against V1 worked examples; property tests |
| V3 | Is the method **appropriate** for this user's situation? | Domain reviewer | Stated assumptions, validity domain, refusal cases in the UI |
| V4 | Are the **regulatory/time-dependent assumptions current**? | Maintainer | Effective date, source version, review cadence (§19) |

A defect report must state which of V1-V4 failed. "The calculator is wrong" is not actionable;
"V4: the 2026 bend points were replaced in the 2027 COLA release" is.

### 9.3 Per-entry verification record (required before `TESTED`)

```ts
// calculators/<slug>/meta.ts
export interface FormulaVerification {
  formulaId: string;            // e.g. "F-LOAN-01"
  status: FormulaStatus;        // see §9.1
  references: Reference[];      // { code, url, title, publisher, edition, accessed }
  workedExamples: WorkedExample[]; // { inputs, expected, tolerance, source }
  assumptions: string[];        // rendered in the UI, not just in code comments
  invalidInputs: string[];      // explicitly refused, with the message shown
  jurisdiction?: { code: string; effectiveFrom: string; reviewBy: string };
  reviewer?: { role: string; date: string; scope: string };
  changeLog: ChangeLogEntry[];
}
```

The build must fail if a calculator is routed/indexable without a `FormulaVerification` whose
`status` is one of `INDEPENDENTLY_VALIDATED` / `TESTED` / `PUBLISHED`.

### 9.4 Verification method by risk class

| Risk class | Examples in this catalog | Minimum verification |
|---|---|---|
| R0 Trivial | `percentage-of-a-number`, `length-converter` | One inspected factor/definition + 3 known-answer tests + property test |
| R1 Standard | loan payment, geometry, statistics, unit conversion | Inspected source + hand-derived example + 2 independent calculators cross-checked **and understood**, not copied |
| R2 Consequential | tax, APR, pension, nutrition, dosage, structural | Two independent references **or** one authoritative standard + an independent implementation; worked examples from the source; specialist sign-off not required but reviewer named |
| R3 Regulated/high-risk | eGFR, BAC, paediatric dose, rebar design, wind load, child support | Named qualified reviewer, prominent limitations, jurisdiction + edition, refuse-to-answer cases, annual re-review |

### 9.5 Anti-patterns explicitly banned

- Copying a formula from a competitor site and calling it verified.
- Implementing a rule-of-thumb and labelling it with the name of the standard it approximates.
- Presenting an iterative solver's converged value without iteration count/residual.
- Using binary floating point for money without a stated rounding policy (§14.3).
- Silently clamping or coercing invalid input into a valid-looking answer.
- Hiding the jurisdiction behind a default (e.g. assuming US tax for everyone).

### 9.6 Reference examples already reproduced from inspected sources

These were computed independently while writing this plan and match the published examples in
the inspected sources. They are the seed known-answer tests (T1) for the corresponding entries —
they must be transcribed into the test suite, not re-derived from the implementation.

| Entry | Input | Implementation result | Published value (source) |
|---|---|---|---|
| `heat-index` (CALC-0848) | T = 100 °F, RH = 55% | 123.6 °F | 124 °F (R-009 page example) |
| `heat-index` | T = 100 °F, RH = 15% | 95.8 °F | 96 °F (R-009 page example) |
| `wind-chill` (CALC-0847) | T = 0 °F, V = 15 mph | -19.4 °F | -19 °F (R-008 page example) |
| `bmi` (CALC-0897) | 124 lb, 5 ft 9 in | 18.31 kg/m² (<18.5 → underweight) | "124 lb or less" is underweight (R-011) |
| `bmi` | 169 lb, 5 ft 9 in | 24.95 kg/m² (not yet overweight) | "169 lb" begins overweight (R-011) |
| `bmi` | 203 lb, 5 ft 9 in | 29.97 kg/m² (not yet obesity class 1) | "203 lb" begins obesity (R-011) |
| `percentage-difference` (CALC-0003) | A = 100, B = 120 | 18.18% | Symmetric definition in F-ARI-02 |
| `percentage-change` (CALC-0002) | A = 100, B = 120 | 20.00% | Relative-change definition in F-ARI-02 |

The three BMI rows are instructive: each published threshold sits *just* above the computed
value, which is what a correct unit constant (703 for lb/in²) and the correct inequality
direction produce. Any implementation that returns 25.00 for 169 lb has a rounding or
constant defect — this is exactly the kind of boundary test (T2) that catches it.

---

## 10. High-Risk Calculator Review Policy

### 10.1 Triggers

An entry is high-risk if **any** of these is true: the output could inform a medical decision,
a legal position, a structural/safety design, a tax filing, a lending disclosure, or a
child-safety action; or the entry depends on a licensed standard; or an error of one unit would
change a decision (dose per kg, ampacity, egress width, APR disclosure).

{{SPECIALIST}} entries are pre-marked `SPECIALIST_REVIEW_REQUIRED` in §8 (`X` status). The pattern is
visible: structural codes, electrical codes, clinical equations, statutory entitlements.

### 10.2 Requirements before publication of an `X` entry

1. A **named reviewer** with the relevant credential or documented equivalent competence,
   recorded with date and scope of review.
2. **Licensed-standard access** confirmed (edition, year). No reconstruction from memory.
3. A prominent, non-dismissible **limitation notice** in the page body — not only in a footer.
4. **Refusal behaviour**: where inputs fall outside the validated domain, the tool must refuse
   and explain, rather than extrapolate.
5. **Explicit non-claims**: "not medical advice", "not a design calculation", "not tax advice",
   matched to the domain, plus what the user should do instead (consult a professional).
6. **Re-review cadence** recorded (§19). Clinical and statutory content: at most 12 months.
7. **No ads above the calculator result** and no interstitial that delays the tool (§18).

### 10.3 Categories that may never be published as standalone "answers"

- Any structural member sizing (`rebar-area-required`, `slab-thickness`, `pile-capacity`,
  `glass-thickness-selection`, `glass-deflection`) — output must be a *check* against a
  user-supplied design, or a preliminary estimate with the code clause cited and a warning.
- Clinical dosing (`pediatric-dose-weight`, `insulin-correction`, `pet-medication-dose`).
- Legal entitlements (`child-support-estimate`, `redundancy-pay`, `inheritance-share`).
- BAC for any decision purpose (`blood-alcohol-widmark`).

### 10.4 Refusal design

Refusals are first-class UI states, not exceptions: a red inline message naming the violated
constraint, the valid range, and why. Analytics may count refusals (privacy-safe aggregate) —
a high refusal rate is a content bug, not a user error.

---

## 11. Duplicate Detection and Resolution Register

### 11.1 Method applied to all {{TOTAL}} entries

For every candidate: (1) normalise the name (case, punctuation, synonyms); (2) compare purpose;
(3) compare the formula family and the actual equation; (4) compare inputs, units and outputs;
(5) compare assumptions and workflow; (6) decide. Two entries are the **same tool** if a user
with the same intent would accept the same output from either. They are **different tools** if
the equation, the input basis, the output, the assumption set or the compliance requirement
differs materially.

Automated checks in `tools/build_master_plan.py`: unique slugs, unique names, slug format, and
non-empty IO for all entries. Semantic checks are manual and recorded here.

### 11.2 Resolution register

| # | Entries | Relation | Decision | Rationale |
|---|---|---|---|---|
| D1 | `percentage-change` (CALC-0002) vs `percentage-difference` (CALC-0003) | Similar name, different mathematics | **Keep both** | Change is relative to a base (`(B-A)/abs(A)`); symmetric difference uses the mean. 100→120 is +20.00% change but 18.18% difference. Different answers = different tools. |
| D2 | `percentage-change` vs `percentage-point-change` (CALC-0004) | Often confused by users | **Keep both, cross-link prominently** | Points are an absolute difference of two percentages; cannot be derived from relative change without the base. |
| D3 | `gross-margin` (CALC-0254) vs `margin` (CALC-0267) | Same algebra, different input basis | **Keep both, document basis** | Accounting uses revenue and COGS for a reporting KPI; pricing uses price and unit cost. Input sets and audience differ; the page must show the other's link. |
| D4 | `break-even-units` (CALC-0264) vs `break-even-revenue` (CALC-0265) | Related outputs | **Keep both** | One returns a quantity, the other a revenue figure; contribution-margin-% basis differs. |
| D5 | `simple-interest` (CALC-0156) vs `add-on-interest` (CALC-0187) | Superficially similar | **Keep both** | Add-on applies simple interest to the original principal for the whole term and then converts to a payment stream; it must also output the true amortising rate. |
| D6 | `loan-payment` (CALC-0176) vs `amortisation-schedule` (CALC-0177) | Same formula, different output | **Keep both** | The schedule is a table product with per-row rounding, truncation and a final-payment adjustment — a distinct engineering problem. |
| D7 | `apr-from-fees` (CALC-0185) vs `loan-payment` | Related | **Keep both** | APR is the inverse problem (solve for the rate), regulated by Reg Z Appendix J, with unit-period rules. Not a re-parameterisation. |
| D8 | `mortgage-payment` (CALC-0196) vs `mortgage-piti` (CALC-0197) | Subset relationship | **Keep both** | PITI adds escrow components with independent bases and rounding; the extra inputs change the workflow. |
| D9 | `annuity-future-value` (CALC-0163) vs `retirement-corpus-projection` (CALC-0238) | Same core equation | **Keep both** | Retirement adds real vs nominal returns, contribution escalation and inflation adjustment; the family reference is shared but assumptions differ visibly. |
| D10 | `retirement-savings-goal` (CALC-0237) vs `goal-savings-timeline` (CALC-1207) | Related solver direction | **Keep both** | One solves for the required corpus from an income need; the other solves for time given a target and a contribution. Different unknowns. |
| D11 | `safety-stock` (CALC-0650) vs `safety-lead-time` (CALC-0670) | Same purpose, different model | **Keep both** | Demand-variability vs lead-time-variability models; different variance terms and different inputs. |
| D12 | `concrete-volume` (CALC-0378) vs `concrete-mix-ratio` (CALC-0380) vs `cement-bags` (CALC-0381) | Pipeline stages | **Keep all three** | Volume → mix proportions → bag count are three workflows with different inputs; merging them would force users to answer questions they cannot. Pages must link in sequence. |
| D13 | `wind-chill` (CALC-0847) vs `heat-index` (CALC-0848) | Both "feels like" | **Keep both** | Different regressions, different units, disjoint validity domains (≤50 °F vs ≥80 °F). |
| D14 | `risk-ratio` (CALC-1104) vs `odds-ratio` (CALC-1105) | Related statistics | **Keep both** | Different estimands; they diverge when the outcome is common. Reporting one as the other is an error. |
| D15 | `progressive-income-tax` (CALC-0287) vs `us-federal-income-tax` (CALC-0288) vs `marginal-effective-rate` (CALC-0296) | Overlapping scope | **Keep all three, with strict labels** | The first is a generic bracket engine (user-supplied brackets), the second is a jurisdiction- and year-pinned implementation with verified thresholds, the third is a two-number summary output. The generic engine must never be indexed as a US tax calculator. |
| D16 | `inventory-days-supply` vs `days-of-inventory` (CALC-0651) | **True duplicate** | **Consolidated — one entry removed** | Identical formula (365/turnover) and identical inputs. The supply-chain variant was deleted from the catalog; the surviving page will carry both query phrasings in its content. |
| D17 | `length-converter` etc. (16 conversion entries) vs "a converter for every unit pair" | Scale trap | **One entry per quantity, not per pair** | Per-pair pages (metres-to-feet, feet-to-metres, …) are doorway-style near-duplicates. The brief's own example forbids this. Unit pairs are handled inside one tool with deep-linkable state. |

**Unresolved high-confidence duplicates at time of writing: 0.** One true duplicate was found and
consolidated (D16). The catalog count reflects the post-consolidation state.

### 11.3 Standing duplicate rule for future agents

Before adding a calculator: search `catalog.csv` by slug fragment, by formula family, and by
output noun. If a candidate shares the family **and** the input basis **and** the output, it is
a mode of the existing tool — add a mode, not a page. If it differs on any of the three, add the
entry, and record the distinction in this register.

---

## 12. SEO and Search Intent Strategy

### 12.1 Principles

The goal is *sustainable* organic traffic. Google's spam policies (R-005, inspected) name
"scaled content abuse", "keyword stuffing", "doorway abuse" and "misleading functionality" as
violations; the helpful-content guidance (R-006, inspected) asks whether content provides
original information, a substantial description, and a descriptive title. A {{TOTAL}}-page
calculator site therefore has exactly one defensible strategy: **every page is a working tool
with original explanation and a reason to be separate.** If a page cannot pass the "would a user
be glad they landed here?" test, it does not get published.

### 12.2 Search intent per entry

Each entry in §8 has a name and IO line that define its intent. At implementation time, the
`meta.ts` for each calculator records:

```ts
interface SeoMeta {
  primaryIntent: "calculate" | "compare" | "convert" | "estimate" | "explain-then-calculate";
  primaryQueryPattern: string;   // e.g. "concrete volume calculator"
  secondaryQueries: string[];    // user phrasings, not keyword-stuffed variants
  seasonality?: "none" | "tax-season" | "summer" | "year-end";
  regionality?: "global" | { country: string; subdivision?: string };
  timeSensitivity?: { changesAnnually: boolean; nextReview: string };
  related: string[];             // slug[] for internal links (3-8)
}
```

Rules: a calculator page targets **one** intent. "Calculate" and "compare" are different
pages when the second requires multiple scenarios. Regional variants (US/UK/EU/GCC tax) are
**separate URLs with distinct rules and citations**, never the same content with a swapped
constant — and only when the jurisdiction actually changes the answer.

### 12.3 Page template (mandatory order)

1. `H1` naming the tool and, where useful, the unit/jurisdiction ("Concrete Volume Calculator (metric)").
2. A one-sentence description of what the tool does and does not do.
3. **The calculator itself** — above the fold, no interstitial, no ad between H1 and inputs.
4. Result with units, precision, and a copy/share affordance; result updates without reload.
5. "How it works": the formula in readable notation, variable definitions and units.
6. "Worked example" with arithmetic shown step by step and a checked result.
7. "Assumptions and limitations" — including invalid inputs and domain restrictions.
8. "Related calculators" — 3-8 contextual internal links, bidirectional with the related set.
9. References — the sources from `FormulaVerification.references`, with edition and access date.
10. Last reviewed / last updated dates, and the formula version.

Content minimums for indexability: ≥150 words of unique prose besides labels; ≥1 worked example;
≥1 statement of limitation; ≥3 internal links. Anything thinner stays `noindex`.

### 12.4 Technical SEO requirements

- Server-rendered or statically generated HTML containing the formula and worked example — the
  calculator must not be the only content in JavaScript (see Google's JavaScript SEO guidance;
  not inspected, listed as ORQ-07 before implementation).
- One canonical URL per tool; deep-linked state (units, inputs) uses query params with
  `rel=canonical` to the clean URL.
- `sitemap.xml` generated from published entries only — never from `RESEARCH_REQUIRED` or
  planned entries.
- `robots.txt` disallows staging and blocks indexing of any `NEEDS_REVIEW` page.
- Title/meta description generated from the tool name + intent, unique per page; no templated
  near-duplicates across {{TOTAL}} pages.
- Structured data only where genuine and supported: `SoftwareApplication`/`WebApplication` for
  the tool, `FAQPage` only for real FAQs visible on the page, `BreadcrumbList` for hierarchy.
  Never `HowTo` markup for a calculator, and never markup that claims ratings the page does not
  have.
- Internal link graph: each category page links to its tools; each tool links to 3-8 siblings
  and 1 parent. No orphan tools.

### 12.5 What this plan refuses to do

- No "calculator for every city/country" multiplier pages.
- No auto-generated near-duplicate copy with synonym swaps (explicitly "scaled content abuse").
- No fake precision, no invented statistics, no fabricated "1,000,000+ users" claims.
- No promises about indexing, ranking, traffic or ad approval. Those are Google's and the ad
  network's decisions, not ours.

### 12.6 Internationalisation (deferred)

Slugs are English and stable. Localised pages require a translated *UI and explanation*, not
machine-translated formula text; numbers/units and decimal separators must be locale-aware.
Localisation is out of scope until the English catalog is stable (P3).

---

## 13. Recommended Technical Architecture

> **Context:** the repository contains only `README.md` — no manifest, no framework, no CI, no
> service credentials (§3). Every technology named in this section is **planned**, not present.
> The stack itself is **confirmed by the project owner** (13.1); the design decisions that follow
> are proposals for how to use it, and each carries an explicit "installed / configured?" status.

### 13.1 Decision record — confirmed stack

| Layer | Decision (confirmed) | Status in repository | Where the decision lives |
|---|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, strict mode | **Not present** — no `package.json` | This section; implement in wave W0 (§16.2) |
| Styling | **Tailwind CSS** + a small design-token layer | **Not present** | §13.9, §14.5 |
| Hosting | **Vercel** | **Not linked** — no project, no domain | §17 |
| Backend/DB | **Supabase**, introduced only when a genuine need appears | **Not created** — no project, no keys | §13.5 (boundary + preconditions) |
| Version control | **GitHub** (this repository) | Repository exists; **no CI workflows** | §15.2 |
| Unit/calc tests | **Vitest** | **Not installed** | §15.1 |
| Browser/E2E | **Playwright** | **Not installed** | §15.1 |
| Validation | **Zod** | **Not installed** | §14.1 |
| Analytics | **Google Analytics 4** | **No property, no tag** | §18.3 |
| Search monitoring | **Google Search Console** | **Not verified** | §18.4 |
| Advertising | **Google AdSense**, subject to eligibility and approval | **Not applied for** | §18.2 |

### 13.2 Planned vs actually configured — the distinction this plan enforces

Every future agent must be able to tell aspiration from reality. This table is the authoritative
status list; it may only be changed by a commit that also records the configuration step taken.

| Item | Planned | Configured / working today | Evidence required before changing the status |
|---|---|---|---|
| Next.js app scaffold | Yes | **No** | `package.json` with `next`, `app/layout.tsx` present, `npm run build` succeeds |
| TypeScript strict | Yes | **No** | `tsconfig.json` with `"strict": true`, typecheck in CI |
| Tailwind + tokens | Yes | **No** | `tailwind.config.ts`, tokens file, one page rendering |
| Vitest | Yes | **No** | `vitest.config.ts`, at least one passing test in CI |
| Playwright | Yes | **No** | `playwright.config.ts`, one passing E2E run in CI |
| Zod | Yes | **No** | dependency + one schema used by a calculator |
| GitHub Actions CI | Yes | **No** | `.github/workflows/ci.yml` green on a PR |
| Vercel project | Yes | **No** | a preview deployment URL |
| Custom domain | Yes | **No** | DNS record + HTTPS certificate |
| Supabase project | **Only when needed** | **No** | a documented need (§13.5), a project, env vars, RLS policies |
| GA4 property | Yes | **No** | measurement ID in env, consent-gated tag firing |
| Search Console | Yes | **No** | verified ownership + sitemap submitted |
| AdSense account/ads.txt | Later, after eligibility work | **No** | an approved account and a served `ads.txt` |
| Any paid plan | Not authorised | **No** | explicit owner authorisation recorded in the PR |

**Rule:** no row may move to "configured" in a planning document. Configuration is proven by code,
config files or a live URL — never by a sentence in Markdown.

### 13.3 Rendering strategy: static by default, server only when it earns its cost

| Page type | Mode | Rationale |
|---|---|---|
| Calculator page (arithmetic) | **SSG** (`generateStaticParams`) | Deterministic output at build time; no server needed; fastest TTFB and cheapest hosting. ~99% of the catalog is this shape. |
| Category hub / home / index | **SSG** | Same content for every visitor. |
| Static content (about, policies, methodology) | **SSG** (MDX) | Rarely changes; ships with the build. |
| Sitemap, `robots.txt` | **Generated at build** | Must list only published slugs (§12.4) — generated from the same registry that renders pages. |
| Time-sensitive data pages (e.g. FX rates, grid emission factors, carrier divisors) | **ISR with an explicit `revalidate`** and a visible "as of" timestamp | The *page* is static; only the *dataset* refreshes. Revalidation interval must match the data's actual update cadence, not a guess. |
| Search results / filtered catalogue lists | **SSG + client filtering** | Filtering over an in-memory index; no server round-trip. |
| Any future account area (saved calculations) | **SSR/dynamic** with Supabase session cookies | Only if §13.5's preconditions are met. |
| OG images | **Static assets or edge-generated** | Cacheable; avoid regenerating per request. |

Arithmetic never runs on the server: the calculation module is imported by a client island, so
inputs stay in the browser (§18.5) and a Vercel function is never on the critical path.

### 13.4 Component and route layout

```
app/
  layout.tsx                     # fonts, tokens, consent banner, skip link
  page.tsx                       # home + search
  [category]/page.tsx            # category hub (SSG)
  [category]/[slug]/page.tsx     # calculator page (SSG; ISR only for data pages)
  sitemap.ts  robots.ts  manifest.ts
components/
  calculator/  CalculatorShell, NumberField, UnitField, ResultCard, RefusalNotice,
               WorkedExample, Assumptions, References, RelatedTools
  ui/          Button, Select, Table, Disclosure, Callout
lib/
  units/       registry.ts (NIST-sourced factors), convert.ts
  money/       decimal.ts, rounding.ts
  format/      number.ts, currency.ts, locale.ts
  validation/  schema.ts (Zod helpers: positive, finite, range, required-unit)
  analytics/   track.ts (consent-gated, no PII)
calculators/
  <slug>/{meta.ts, formula.ts, formula.test.ts, schema.ts, page.tsx, content.mdx}
registry.ts                      # generated index; feeds routes + sitemap
tests/e2e/                       # Playwright
supabase/                        # only when needed (§13.5)
```

Server Components are the default; exactly one `"use client"` boundary per calculator (the
interactive form/result island). No global state library, no data-fetching library — the catalog
is a generated module, not a runtime API.

### 13.5 Supabase: the boundary, not the default

**Use it only if all three hold:** (a) the feature needs state that must survive a device or user;
(b) that state cannot be derived from the URL; (c) the privacy and operational cost is justified.
Concrete triggers: saved/favourite calculations, user accounts, server-side API keys that must not
ship to the browser (FX, irradiance), editorial workflow replacing MDX, aggregate feedback that
needs a database.

**Do not use it for:** arithmetic (client-side), the calculator catalog (versioned in git — a
database here would silently diverge from the plan), page content (MDX + git review), analytics
(GA4), or "just in case".

If introduced, the non-negotiables are: RLS enabled on every table with policies written before
any data exists; anon key only in the browser and never a service-role key; email/OTP auth rather
than hand-rolled passwords; no calculation inputs stored by default (only an opt-in saved record);
a documented schema in `supabase/migrations/`; free-tier limits noted in §17; and a written
retention/deletion policy in the privacy page. Until those exist, any account feature stays
unbuilt.

### 13.6 Static generation at 1,248-page scale

- **Build shape:** one route template + `generateStaticParams()` over the published registry.
  Keep per-page JS small by importing only that calculator's module (no barrel imports of the
  whole catalog into the client bundle).
- **Build time control:** if the full build becomes slow, split by category (multiple build
  invocations or Vercel "Ignored Build Step" per category folder) rather than degrading page
  quality. Measure before optimising; record the number.
- **Content colocation:** `content.mdx` per calculator keeps prose reviewable in git and
  prevents a 1,248-page CMS migration later.
- **Sitemap discipline:** generated from `status === "PUBLISHED"`; `noindex` for research-stage
  pages; a build-time assertion fails if an unpublished slug appears in the sitemap.
- **Link integrity:** a build step resolves every `related[]` slug and fails on a dangling link —
  at this catalogue size, dead internal links are inevitable without automation.

### 13.7 Performance and delivery budgets (per page, enforced in CI where measurable)

| Metric | Budget | How it is protected |
|---|---|---|
| JS shipped to a calculator page | ≤ 120 KB gzipped (target), hard cap 170 KB | No UI framework beyond React; no chart library on first paint; lazy-load anything >20 KB |
| LCP (mobile, field) | < 2.5 s at p75 | Static HTML, system/1 font subset, no blocking third-party script |
| INP | < 200 ms | Result updates are synchronous arithmetic; no layout thrash |
| CLS | < 0.1 | Reserved ad slots, fixed result height, no late-injected banners |
| Fonts | ≤ 2 families, subset, `font-display: swap`, self-hosted | Avoids third-party font round-trips |
| Third-party scripts | Consent-gated, ≤ 1 analytics + ≤ 1 ad stack | GA4 and AdSense load only after consent where required |
| Images | AVIF/WebP, explicit dimensions, lazy below the fold | Prevents CLS and over-fetch |

Budgets are *targets set now*: they must be re-measured against real traffic in Search Console /
CrUX and adjusted with evidence, not silently relaxed.

### 13.8 Scaling path

| Stage | Trigger | Change |
|---|---|---|
| S1 Static site | Launch to ~10k visits/month | Vercel static hosting; no database |
| S2 Data-refresh | Time-sensitive calculators need daily data | Scheduled job writes a JSON artefact; ISR revalidates; "as of" shown |
| S3 Accounts | Users ask to save calculations | Introduce Supabase (13.5) with RLS and retention policy |
| S4 i18n | Documented non-English demand | Route-based locales; translated UI + reviewed prose (never machine-translated formula text) |
| S5 Catalogue growth past ~3,000 | Build times and review load both rise | Partition builds; require category owners; stricter automated gates |

### 13.9 Deliberately rejected (and why)

- **A backend for arithmetic.** Cost, latency, privacy exposure, zero benefit.
- **Database-backed catalog.** The catalog is a reviewed artefact; git gives history, diffs and
  rollback that a table does not.
- **Client-rendered-only pages with no static content.** Bad for crawlers, slow devices and
  First Contentful Paint.
- **A CMS before the content stabilises.** MDX in git is cheaper and reviewable.
- **Third-party calculator widgets.** They inject unknown scripts, harm CWV, and put the payload
  and the ad stack in someone else's control.
- **Supabase on day one.** An unused database is a standing security and privacy liability.
- **A component-per-slug mega-switch.** Every calculator is a small pure module (§14).

## 14. Calculator Component and Formula Module Conventions

### 14.1 Separation of concerns

`formula.ts` is **pure**: no JSX, no `window`, no locale-dependent formatting, no `Date.now()`.
Time-dependent logic takes the date as an argument. This is what makes the tests meaningful.

```ts
// calculators/loan-payment/formula.ts
export interface LoanPaymentInput {
  principal: number;      // major currency units, > 0
  annualRatePct: number;  // nominal APR in percent, >= 0
  months: number;         // integer >= 1
}
export interface LoanPaymentOutput {
  monthlyPayment: string; // decimal string, 2 dp, currency-agnostic
  totalPaid: string;
  totalInterest: string;
  periodicRatePct: string;
}
export function loanPayment(i: LoanPaymentInput): Result<LoanPaymentOutput, InputError>;
```

Rules: all money values are decimal strings at the boundary; all physical quantities are SI
inside the module and converted at the UI boundary; every function returns a discriminated
`Result` (never `NaN`, never `null`, never a silently clamped value).

### 14.2 Unit boundary

The UI may offer mm/in/ft/m; the module accepts SI only. Conversion happens once, at the edge,
through `lib/units`. A formula module that contains the constant `25.4` is a defect.

### 14.3 Rounding policy (project-wide)

| Context | Rule | Where |
|---|---|---|
| Money display | Round half-up to minor unit **at the end**; amortisation rows rounded per row with the final row absorbing the residue | `lib/money` |
| Tax/bracket arithmetic | Platform-defined statutory rounding (e.g. SSA PIA rounds **down** to the next lower $0.10) | Per-family, documented |
| Physical quantities | Significant figures matched to the least precise input; default display 4 sig figs | `lib/format` |
| Intermediate values | **Never rounded** | All modules |
| Tests | Compare rounded strings (display) and use `toBeCloseTo` with explicit tolerance for intermediates | Test suite |

### 14.4 Input conventions

- Every input has: label, unit, required/optional, valid range, default (only where a default is
  defensible), and a validation message naming the constraint.
- Invalid input produces a visible inline error and **no result** (never a stale or zero result).
- Zero, negative, and empty are three distinct states and are handled distinctly.
- Text inputs accept locale decimal separators (`,` and `.`) but normalise before parsing.

### 14.5 Accessibility requirements (per calculator)

Keyboard-operable end to end; visible focus; `label for` on every input; `aria-describedby` for
hints and errors; `role="status"`/`aria-live="polite"` on the result; no colour-only meaning
(state WCAG 2.2, R-013); 44×44 px minimum targets; contrast ≥4.5:1 for text and ≥3:1 for UI
components; no motion that cannot be disabled; the tool works at 320 px width and at 200% zoom.

### 14.6 Naming

`slug` is kebab-case, ≤4 words where possible, no stop words, no unit suffixes unless the units
are the point ("concrete-volume", not "concrete-volume-calculator-metric"). IDs are permanent;
if a calculator is retired, its ID is never reused.

---

## 15. Testing and Release Gates

### 15.1 Required test set per calculator

| Code | Test | Example |
|---|---|---|
| T1 | Known-answer tests from an inspected source or a hand-derived worked example | `loanPayment(20000, 6.5, 60)` = the value printed in the page's worked example, asserted to 2 dp |
| T2 | Boundary values | rate = 0; months = 1; zero-length side; exactly-at-threshold BMI category |
| T3 | Invalid input | negative length, `NaN`, empty string, division by zero, triangle inequality violated → refusal, not a number |
| T4 | Unit/dimension consistency | same physical input in mm and in ft yields equal SI results within tolerance |
| T5 | Precision/rounding | 0.1+0.2 money case; final amortisation row clears the balance exactly; rounding mode honoured |
| T6 | Property/invariant | probabilities in [0,1]; area scaling quadratic; conversion round-trip identity (`to(from(x)) ≈ x`) |
| T7 | UI integration (Playwright) | enter inputs → result appears; invalid input → error, no result; result announced to assistive tech |
| T8 | Regression | every corrected defect adds a test named after the issue |

### 15.2 CI gates

`G1` typecheck → `G2` lint → `G3` unit tests (coverage floor on `lib/` and `calculators/`) →
`G4` production build → `G5` Playwright smoke for every changed calculator →
`G6` link checker + axe a11y scan → `G7` catalog integrity (build script) → `G8` sitemap only
contains published slugs. A red gate blocks merge; no `--no-verify`, no skipped tests committed.

### 15.3 Publication gate (human + automated)

A calculator may move to `PUBLISHED` only when **all** hold:

1. `FormulaVerification.status` ≥ `INDEPENDENTLY_VALIDATED`, or an `X` entry has recorded
   reviewer sign-off.
2. T1-T8 pass, and CI is green on the release commit.
3. Assumptions, invalid inputs and limitations are rendered on the page (not just in code).
4. References list resolves, and every `SOURCE_VERIFIED` claim names an inspected source.
5. Jurisdiction and effective date are visible where the answer is region/time dependent.
6. Content checklist (§12.3) met; no lorem, no placeholder examples.
7. A second person (or an independent agent pass) has reviewed the arithmetic of the worked
   example by hand.
8. No unresolved source conflict affects the result.

Failure of any item keeps the page `noindex` and out of the sitemap. The gate is intentionally
expensive: it is cheaper than publishing a wrong tax or dose figure.

---

## 16. Implementation Priorities and Batches

### 16.1 Priority definitions

These assignments are **judgement calls from structure, not search data** (§4.5): universality
of need, whether the query is clearly a tool query, formula tractability, and whether an
inspected source already exists.

- **P0 ({{P0}})** Foundation and universal, low-risk, high-frequency tools: percentages,
  arithmetic, unit conversion, basic geometry, core finance, OEE basics. Ship first because they
  exercise the whole pipeline with the least verification risk.
- **P1 ({{P1}})** High-value general and business tools: full finance suite, taxation (with
  jurisdiction discipline), construction quantities, statistics, health screening basics.
- **P2 ({{P2}})** Technical and professional: engineering, manufacturing, logistics, media,
  networking, science.
- **P3 ({{P3}})** Advanced, regional, data-dependent, licensed or optimiser-based: structural
  design, licensed-code tools, live-data tools, cutting-stock/nesting, specialist finance.

### 16.2 Batches with completion criteria

| Wave | Scope | Entry gate | Completion criteria |
|---|---|---|---|
| W0 | Foundation | this plan approved; stack confirmed (§13.1) | Repo scaffolded with the confirmed stack (Next.js App Router + TS strict, Tailwind, Vitest, Playwright, Zod); `lib/units`, `lib/money`, `lib/format`, `CalculatorShell`; CI with G1-G8; **no** database, analytics or ad code yet; one P0 calculator end-to-end as the reference implementation |
| W0b | Measurement setup | W0 green | Vercel project + preview deploys (owner authorisation), GA4 property with consent-gated tag, Search Console verification and first sitemap submission. Supabase remains unbuilt. AdSense application only after §18.2's eligibility checklist passes |
| W1 | First 50-100 calculators | W0 done | All W1 calculators `TESTED`; sitemap generated; Lighthouse mobile ≥90 on the 5 heaviest pages; no `noindex` leaks |
| W2 | General-purpose categories (C01-C09, C60-C61) | W1 done | Category hubs live; internal link graph complete; math families verified against inspected textbooks |
| W3 | Finance and business (C10-C22) | W2 done + data tables for the supported jurisdiction | Every tax/APR/benefit page shows effective date + source; APR implements Reg Z Appendix J; PIA matches SSA example |
| W4 | Construction and engineering (C23-C31) | W3 done + licensed-standard decisions | Non-licensed quantity tools published; licensed design tools either withheld or `X`-reviewed |
| W5 | Computing, science, education (C62-C73) | W4 in progress | Conversion and statistics families cross-validated; a11y audit passed site-wide |
| W6 | Manufacturing and professional (C32-C44, C83) | W5 done | Optimiser tools labelled heuristic with lower bounds shown |
| W7 | Regional and specialist (C17 extended, C75-C77, C82) | Legal/clinical reviews secured | Only reviewed jurisdictions published; refusal behaviour tested |
| W8 | Catalog-wide QA and SEO | W1-W7 | Duplicate audit re-run; thin-content audit; Core Web Vitals budgets; sitemap hygiene |
| W9 | Maintenance and expansion | continuous | Review cadence running (§19); status dashboard from `catalog.csv` |

### 16.3 Status vocabulary — do not conflate

`Cataloged` (in §8) → `Researched` (family + citation plan) → `Formula verified` (V1) →
`Implemented` (V2) → `Tested` (T1-T8) → `Published` (gate §15.3). An entry in this document is
at **Cataloged**, and at most `Researched` where a family block exists. Nothing is further along.

---

## 17. Hosting and Operating Cost Considerations

> No service is configured today (§13.2). Figures below are **structural expectations, not
> quotes**; vendor pricing changes and must be verified before any commitment. No paid plan may be
> purchased without explicit authorisation.

| Item | Planned approach | Cost shape | Notes / risks |
|---|---|---|---|
| Hosting | Vercel, static-first | Free/entry tier likely sufficient initially; scales with bandwidth and function invocations | Only data-refresh functions and optional OG generation consume invocations |
| Compute | None for arithmetic | £0 | Calculations run in the browser by design |
| Database | Supabase, only when §13.5 is satisfied | Free tier has row/storage/bandwidth caps; paused projects on inactivity are a real operational surprise | Budget for a paid tier only when a feature genuinely depends on it |
| Content | MDX + git | £0 | Reviewable; no CMS licence |
| CI | GitHub Actions | Free minutes on public repos; watch Playwright runtime | Shard E2E if the suite exceeds the free allowance |
| Analytics | GA4 | Free; data-retention limits apply | Consent management is a legal cost, not a licence cost (§18) |
| Search monitoring | Search Console | Free | Requires domain verification |
| Advertising | AdSense | Revenue share, not a cost — but approval is not guaranteed | Ad scripts add bytes and CWV risk (§18.6) |
| Domain / TLS | Registrar + managed certificate | Small annual fee | Not purchased in this task |

**Cost drivers to watch:** ad-stack weight (the main CWV and bandwidth risk), image/OG generation,
any external API (per-call pricing and rate limits), and Supabase growth if accounts ship.
**Deliberately excluded from the architecture:** a database on day one, a search service (a static
index suffices), server-side rendering of arithmetic, and per-calculation API calls.

## 18. Advertising and Privacy Readiness

> Status: **nothing is configured.** No GA4 property, no Search Console verification, no AdSense
> application, no consent platform. Everything here is a requirement set for the implementation
> waves, not a description of the current site.

### 18.1 Policy alignment (inspected evidence)

Google's "misleading functionality" spam policy (R-005, §23) names sites that advertise a tool but
route users to deceptive ads. The binding consequence for this project: **the calculator must be
fully functional before any ad loads**, an ad may never occupy the result position, and no
interstitial may delay the tool.

### 18.2 Google AdSense — preconditions before any code

1. **Eligibility work first:** original, useful content; real pages (not placeholders); privacy
   policy, cookie policy, terms, disclaimer, contact page; clear navigation. Approval is
   Google's decision — this plan makes **no** claim that a site built from it will be accepted.
2. **`ads.txt`** served at the domain root with the publisher ID once (and only once) an account
   exists.
3. **Ad placement rules:** below the result and after the explanation; never between the `H1` and
   the inputs; never sticky over the mobile keyboard; no auto-play video; no "download the result"
   gates; no ads that mimic calculator controls.
4. **Sensitive pages:** no ads on clinical (`C59`), legal (`C76`) or hardship-related pages
   (debt, benefits). If monetisation is wanted there later, it requires a separate policy review.
5. **Invalid-traffic protection:** no incentives to click, no automated refreshes, no ad reload on
   input change.
6. **Policy drift:** ad-network policies change; compliance is a recurring review item (§19), not
   a one-off setting.

### 18.3 Google Analytics 4

- Measurement ID supplied by environment variable; **no ID committed to the repository**.
- Consent-gated: no analytics cookies before consent in opt-in jurisdictions; GA4 **Consent Mode**
  signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) wired to the
  consent banner.
- Events are **aggregate and slug-level only**: page view, `calculator_used`, `input_refused`,
  `error`. Never the input values, never free-text, never a user identifier.
- Data retention configured to the shortest period that still answers product questions.
- GA4 is an enhancement, not a dependency: the site must work with analytics blocked.

### 18.4 Google Search Console

- Domain verification (DNS or HTML file) recorded in the repository only as a value, never as a
  secret.
- `sitemap.xml` submitted; coverage monitored; a recurring task reviews "Crawled – not indexed"
  for thin-content signals (§12.3) and "Soft 404" for retired tools (§19.2).
- Core Web Vitals and mobile-usability reports feed the §13.7 budgets.

### 18.5 Privacy architecture

- **Inputs never leave the browser.** No calculation payload is sent to a server, logged, or
  attached to an analytics event. This is a design property, not a policy promise: the arithmetic
  module is client-side and has no network access.
- No accounts on day one; if Supabase is introduced (§13.5), data minimisation, RLS, and a written
  retention/deletion policy are preconditions.
- Privacy policy, cookie policy, terms and a per-domain disclaimer (medical/legal/financial/
  engineering) are launch blockers, not afterthoughts.
- A visible "how this calculator works and what it cannot do" block on every high-risk page.

### 18.6 Advertising effect on performance and trust

Ad slots are **reserved** with fixed height (CLS = 0 contribution), lazy-loaded, and capped in
number. If field data shows ads pushing LCP/INP beyond budget, the ad configuration changes — not
the budget. A page whose tool is degraded by monetisation fails the §15.3 gate regardless of
revenue.

### 18.7 Children and sensitive data

No child-directed content is planned. No behavioural advertising on pages concerning health,
finance hardship, or legal entitlement. If any such page is added, ad serving is disabled there by
default.

## 19. Maintenance and Versioning Policy

### 19.1 What must be versioned

| Class | Examples | Version carrier | Review cadence |
|---|---|---|---|
| Statutory/tax | US brackets, standard deduction, bend points, FICA limits | `effectiveFrom`/`effectiveTo` in a rule module | Annual, immediately after the official announcement (US: Oct/Nov for the next tax year; SSA: Oct COLA) |
| Benefit/credit rules | PIA bend points, EITC maxima | Rule module + test with the published example | Annual |
| Conversion factors | NIST SP 811 / CODATA | `units/registry.ts` with source + edition | On new CODATA release (next: 2026 adjustment) and on SP 811 revision |
| Emission factors | Grid intensity, fuel factors | Dataset with country + year | Annual |
| Freight divisors | Carrier dim-weight divisors | User-editable defaults with citation | Quarterly check |
| Clinical equations | CKD-EPI, BSA, dosing references | Formula module + version string | Annual + on guideline update |
| Licensed standards | ACI/AISC/ASCE/NEC/ASHRAE/IEC | Recorded edition, no text reproduced | On edition change; tool may need withdrawal |

### 19.2 Process

1. A calculator's `meta.ts` carries `formulaId`, `version`, `effectiveFrom`, `reviewBy`,
   `references[]` and `changeLog[]`.
2. `catalog.csv` is regenerated by the build; the git diff of that file is the audit trail of
   catalog changes.
3. Any formula change requires: a test reproducing the defect, the corrected test, a changelog
   entry naming the source, and a version bump. The page shows "last reviewed".
4. Retiring: status → `RETIRED`, page returns 301 to the nearest replacement, sitemap updated,
   ID never reused.
5. Reviews that find a wrong number must be treated as **incidents**: fix, add regression test,
   note in the changelog, and check sibling calculators built on the same family.

### 19.3 Ownership

A named maintainer (or role) is required per category before that category is published. A
category without an owner stays `noindex` — an unowned tax page will silently rot.

---

## 20. Unresolved Research Questions

| ID | Question / blocker | Affected entries | Impact | Proposed resolution |
|---|---|---|---|---|
| ORQ-01 | Full NIST SP 811 Appendix B factor set not transcribed (chunks 0 and 2 only) | all `C61` converters | Cannot implement without exact factors for pound, mile, psi, ton, etc. | Fetch remaining chunks; transcribe into `units/registry.ts` with exactness flags |
| ORQ-02 | Individual CODATA 2022 values not extracted (index page only) | physics/astronomy constants (`C45`, `C51`) | Risk of stale constants | Open each value page; store with uncertainty and year |
| ORQ-03 | FAO 56 equations render as images; coefficients not text-verified | `irrigation-requirement`, `crop-coefficient-etc` | ET0 could be implemented with wrong coefficients | Use the FAO 56 PDF (ISBN 92-5-104219-5) and verify Eq. 6 term by term |
| ORQ-04 | Licensed standards (ACI 318/211, AISC 360, ASCE 7, NEC, ASHRAE, ISO 2859-1, ASTM E1300/E140, IPC-2221, AIAG-VDA) not accessible | all `X` entries in `C25`, `C27`, `C34`, `C73`, `C83` | These cannot be published as design tools | Purchase/licence or withhold; do not reconstruct from memory |
| ORQ-05 | NREL PVWatts and NREL SPA pages failed to fetch (twice) | `C49`, `solar-position`, `sunrise-sunset` | No verified solar-yield method | Retry from another network; use NOAA solar calculator as an interim inspected reference |
| ORQ-06 | US state tax rules, non-US tax systems (VAT/GST/GCC), payroll withholding | `C17`, `C18` | Only US federal TY2026 is verified | Choose launch jurisdictions; add one at a time with statutory citations |
| ORQ-07 | Google JavaScript-SEO and structured-data guidance not yet inspected | all pages | Rendering/markup decisions could be wrong | Inspect Search Central JS-SEO, sitemaps, canonicalisation, structured-data policies before W2 |
| ORQ-08 | Clinical equations (CKD-EPI 2021, Friedewald limits, paediatric dosing) not verified against primary sources | `C59` | High-risk; cannot publish | KDIGO/NIH/WHO primary sources + clinician review |
| ORQ-09 | Construction material standards and yields (concrete bag yield, mortar, tile adhesive coverage) not verified | `C23` | Quantity answers could be materially wrong | Use NRMCA/PCI/manufacturer technical data sheets per product |
| ORQ-10 | Freight carrier divisors and container payloads change and are carrier-specific | `C41` | Stale defaults | Cite carrier publications with a date; expose as inputs |
| ORQ-11 | Nutrition/energy equations (Mifflin vs Harris-Benedict, activity factors, DRI values) not verified | `C57` | Moderate; often overstated | Inspect the primary publications and DRI tables; label as estimates |
| ORQ-12 | Pet age and energy equations (WSAVA/AAHA) not verified | `C82` | Low clinical risk but reputational | Use veterinary-body sources; delete folklore rules |
| ORQ-13 | Legal/statutory tables (child support, redundancy, inheritance, limitation periods) unverified | `C76` | Cannot publish | Jurisdiction-specific legal review only |
| ORQ-14 | No keyword/demand dataset inspected | priority ordering | Priorities are structural, not demand-based | Add a licensed keyword source later and re-rank batches |
| ORQ-15 | ISO 8601 / locale date rules not inspected | `C60` | Edge-case date bugs | Inspect ISO 8601 (paid) or use a documented library with its own citations |

### 20.1 Conflict register (open)

| ID | Conflict | Current position |
|---|---|---|
| CF-01 | BMI cut-points (WHO vs CDC vs national) | CDC used for US-facing pages; scheme shown on page (ORQ) |
| CF-02 | "APR" (US nominal, Reg Z) vs EU effective APR | Separate labelled outputs; never one field |
| CF-03 | Variance/σ: population vs sample | Tool asks; label names the estimator |
| CF-04 | ET0 coefficient sets across FAO 56 editions/software | Blocked pending ORQ-03 |
| CF-05 | Heat index: NWS regression vs Steadman tables | NWS regression with ±1.3 °F stated |
| CF-06 | Horsepower definitions (mechanical vs metric vs electric) | Must be selected explicitly in every power page |
| CF-07 | Gallon/ton/tonne/barrel definitions by system | Unit must be qualified in the label, always |
| CF-08 | Month-length conventions in interest/amortisation | Reg Z "all months equal /30" for Reg Z pages; actual/actual elsewhere, labelled |

---

## 21. Audit Checklist

Run before any release of this plan or of a batch. `A` = automated by
`tools/build_master_plan.py` or CI; `M` = manual.

**File and structure**

- [x] `A` File exists at `docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`
- [x] `M` Renders as valid Markdown on GitHub (tables, headings, code fences balanced)
- [x] `M` All 23 required sections present, in order, numbered
- [x] `M` Internal TOC anchors resolve to real headings
- [x] `M` Companion `catalog.csv` present and consistent with §8
- [x] `M` No pre-existing file was modified or deleted (verified with `git status`)

**Catalog**

- [x] `A` {{TOTAL}} ≥ 1,200 individually numbered entries
- [x] `A` All IDs unique and sequential (`CALC-0001` … `CALC-{{TOTAL}}`)
- [x] `A` All slugs unique, kebab-case, no stop words
- [x] `A` Every entry has a non-empty inputs→outputs definition
- [x] `A` Category totals reconcile with the entry list
- [x] `M` Every entry has a meaningful purpose (reviewed category by category)
- [x] `M` No unresolved high-confidence duplicates (register §11, D16 consolidated)
- [x] `M` Each category's formula block states variables, assumptions and edge cases

**Research**

- [x] `M` References point to sources actually opened (13 inspected; flagged in §23)
- [x] `M` Identified-but-uninspected sources are labelled as such, never as verified
- [x] `M` Conflicting formulas/rules documented (§4.4, §20.1)
- [x] `M` High-risk entries carry review requirements (§10)
- [x] `M` No fabricated keyword, traffic or approval metrics anywhere

**Implementation planning**

- [x] `M` Architecture fits a greenfield repo and states its assumptions
- [x] `M` Phases actionable, with entry and completion criteria (§16.2)
- [x] `M` Test protocol and release gate explicit (§15)
- [x] `M` Time-sensitive dependencies and cadence documented (§19)
- [x] `M` SEO, accessibility and advertising requirements covered (§12, §14.5, §18)

**Not satisfied (by design, and stated)**

- [ ] Formula research complete — {{RESEARCH}} entries still need citations
- [ ] Independent validation complete — 0 entries validated
- [ ] Licensed standards secured — blocks all `X` entries
- [ ] Any calculator implemented, tested or published

---

## 22. Final Completion Report

1. **Exact Markdown file path** — `docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`
   (repository `JUBERSALEEM/Calculators`, branch `arena/fd9c69ce-calculators`).
2. **Individually identified entries** — **{{TOTAL}}** (sequential IDs `CALC-0001`–`CALC-{{TOTAL}}`).
3. **Unique entries after duplicate review** — **{{TOTAL}}**. One true duplicate was found and
   consolidated (`inventory-days-supply` removed in favour of `days-of-inventory`, register D16);
   fifteen related pairs were retained with documented distinctions (D1-D15).
4. **Entries with an inspected formula reference** — **{{VERIFIED}}** (`SOURCE_VERIFIED`),
   supported by 13 inspected authoritative documents. A further set shares families whose
   constants are partly supported by those same documents but are not themselves verified.
5. **Entries independently validated** — **0**. No second-source or reference-implementation
   validation has been performed. Nothing may be labelled `INDEPENDENTLY_VALIDATED` yet.
6. **Entries requiring further research** — **{{RESEARCH}}** (`RESEARCH_REQUIRED`: method
   documented, citation not yet inspected).
7. **Entries requiring specialist review** — **{{SPECIALIST}}** (`SPECIALIST_REVIEW_REQUIRED`:
   licensed standard, clinical, legal or safety consequence).
8. **Unresolved duplicate candidates** — **0** high-confidence duplicates. Related-but-distinct
   pairs are documented (D1-D15) with the reason each is not a duplicate.
9. **Categories** — all {{CATS}} categories are complete as *catalogs* (formula block + entries).
   Categories needing further research before implementation, in priority order: `C17` taxation
   beyond US federal TY2026, `C18` payroll, `C23` construction quantities, `C25` structural,
   `C27`/`C34` electrical and glazing, `C49` solar, `C57` nutrition, `C59` clinical, `C73`
   quality standards, `C76` legal, `C82` pets.
10. **Technology and configuration status** — stack **confirmed by the owner**: Next.js
    App Router + TypeScript, Tailwind CSS, Vercel, Supabase (when needed), GitHub, Vitest,
    Playwright, Zod, GA4, Search Console, AdSense (subject to approval). **Configured and
    working: none of it.** No `package.json`, no dependencies installed, no Vercel project, no
    Supabase project, no CI workflow, no GA4 property, no Search Console verification, no AdSense
    account, and no paid service enabled. The planned-vs-configured matrix in §13.2 is the
    authoritative status list, and each row names the evidence required before it may change.
11. **Tests / automated audits actually run** —
    `tools/build_master_plan.py` on every build: unique ID check, unique slug check, unique name
    check, slug-format regex, status-enum check, inputs→outputs non-empty check, minimum-count
    check (≥1,200), category-total reconciliation, and generation of `catalog.csv`.
    Manual verification performed: repository inventory (`git log`, `git status`, `ls`,
    branch list), Markdown structure review, Markdown table/anchor integrity checks (0 malformed
    tables, 0 unresolved internal anchors), and independent reproduction of eight published
    reference values from four inspected sources — recorded in §9.6. **No calculator test suite exists yet**, and
    none could exist — nothing is implemented.
12. **Limitations, blockers, recommended next action.**
    - Only 13 sources were inspected; 4 research batches were completed out of roughly 20
      planned subject areas. NREL pages were unreachable; FAO equations are images in the HTML;
      NIST's factor table is only partially transcribed. All three are recorded as open items.
    - Licensed standards (ACI, AISC, ASCE, NEC, ASHRAE, ISO, ASTM, IPC) are not accessible and
      must not be reconstructed. This blocks every `X` entry in structural, electrical, glazing
      and quality categories.
    - No keyword data was consulted, so priorities are structural judgements and are labelled as
      such; they should be re-ranked once a licensed dataset is available.
    - **Recommended next action:** approve §13's architecture, then build the W0 foundation in
      the confirmed stack with CI gates G1-G8 and one reference calculator implemented end-to-end
      (suggested:
      `percentage-change`, `loan-payment`, `length-converter` as three distinct shapes — simple,
      money, unit-based), then start the research batches that unblock the P0/P1 cohorts before
      writing more calculators. Do not commission bulk implementation until at least one
      calculator has passed the full publication gate — that gate is the template for the
      remaining {{TOTAL}}.

---

## 23. References

### 23.1 Inspected during this research pass (may support `SOURCE_VERIFIED`)

| Code | Source | Title / section | Publisher | Date / edition | URL | Accessed |
|---|---|---|---|---|---|---|
| R-001 | NIST SP 811 | *Guide for the Use of the International System of Units (SI)*, Appendix B.8 (factors listed alphabetically); landing page + chunks 0, 2 | NIST | 2008 ed.; page updated 2025-12-08 | https://www.nist.gov/pml/special-publication-811 · https://www.nist.gov/physical-measurement-laboratory/nist-guide-si-appendix-b8 | 2026-10-22 |
| R-002 | NIST CODATA | *Fundamental Physical Constants* (CODATA 2022), NIST SRD 121 | NIST | Data content updated May 2024 | https://physics.nist.gov/cuu/Constants/index.html | 2026-10-22 |
| R-003 | FAO | *Crop evapotranspiration* (Irrigation & Drainage Paper 56), Chapter 2 | FAO (UN) | 1998, ISBN 92-5-104219-5 | https://www.fao.org/4/x0490e/x0490e06.htm | 2026-10-22 |
| R-004 | US SSA | *Primary Insurance Amount* (2027 bend points) | Social Security Administration | 2027 eligibility year | https://www.ssa.gov/oact/cola/piaformula.html | 2026-10-22 |
| R-005 | Google Search Central | *Spam policies for Google web search* (scaled content abuse; misleading functionality; keyword stuffing) | Google | as published | https://developers.google.com/search/docs/essentials/spam-policies | 2026-10-22 |
| R-006 | Google Search Central | *Creating helpful, reliable, people-first content* | Google | as published | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | 2026-10-22 |
| R-007 | CFPB | Regulation Z, 12 CFR 1026, **Appendix J** — *Annual Percentage Rate Computations for Closed-End Credit Transactions* | Consumer Financial Protection Bureau | current regulation | https://www.consumerfinance.gov/rules-policy/regulations/1026/J/ | 2026-10-22 |
| R-008 | NOAA / NWS | *Understanding Wind Chill* (wind-chill formula, validity, caveats) | National Weather Service | as published | https://www.weather.gov/safety/cold-wind-chill-chart | 2026-10-22 |
| R-009 | NOAA / NWS | *What is the heat index?* (Rothfusz regression, ±1.3 °F, classification bands) | NWS Amarillo | as published | https://www.weather.gov/ama/heatindex | 2026-10-22 |
| R-010 | US IRS | *IRS releases tax inflation adjustments for tax year 2026* (IR-2025-103, Rev. Proc. 2025-32) | Internal Revenue Service | TY 2026 (published 2025-10-09) | https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill | 2026-10-22 |
| R-011 | US CDC | *Adult BMI Categories* | Centers for Disease Control and Prevention | reviewed 2024-03-19 | https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html | 2026-10-22 |
| R-012 | US DOL | *Overtime Pay* (FLSA: 40-hour workweek, 1.5×, no averaging) | Department of Labor, WHD | as published | https://www.dol.gov/agencies/whd/overtime | 2026-10-22 |
| R-013 | W3C | *Web Content Accessibility Guidelines (WCAG) 2.2* | W3C | Recommendation, 12 Dec 2024 | https://www.w3.org/TR/WCAG22/ | 2026-10-22 |

**Secondary reference cited via R-001 (not opened directly):** BIPM, *The International System of
Units (SI)*, 9th edition (2019), referenced by the NIST SP 811 page as the current authority for
SI definitions.

### 23.2 Identified but **not** inspected (may support `RESEARCH_REQUIRED` / `SPECIALIST_REVIEW_REQUIRED` only)

| Code | Authority | Intended use | Status |
|---|---|---|---|
| REF-MATH-ELEM | Standard algebra/arithmetic definitions (school/university level) | Arithmetic, proportion, rounding | Citation to be selected per family |
| REF-IEEE754 | IEEE 754 floating point | Rounding, representation | Not read |
| REF-ACI318 / REF-ACI211 | ACI 318, ACI 211.1 | Structural concrete, mix design | Licensed — blocked |
| REF-AISC360 | AISC 360 | Steel design | Licensed — blocked |
| REF-EUROCODE | EN 1990-1999 series | Alternative structural basis | Licensed — blocked |
| REF-ASCE7 | ASCE 7 | Wind/snow/seismic loads | Licensed — blocked |
| REF-NEC | NFPA 70 (NEC) | Ampacity, breaker sizing | Licensed — blocked |
| REF-ASHRAE | ASHRAE Handbook (Fundamentals) | Psychrometrics, cooling load, U-values | Licensed — blocked |
| REF-ASTM | ASTM E1300, E140, etc. | Glass design, hardness conversion | Licensed — blocked |
| REF-IPC2221 | IPC-2221 | PCB trace width | Licensed — blocked |
| REF-ISO2859 | ISO 2859-1 | Acceptance sampling | Licensed — blocked |
| REF-ISO8601 / REF-ISO80000 | ISO | Dates, quantities and units | Licensed |
| REF-RFC1918 / REF-RFC4632 / REF-RFC3021 | IETF | Private addressing, CIDR, /31 links | Not read |
| REF-NREL-PVWATTS / REF-NREL-SPA | NREL | PV yield, solar position | **Unreachable from this environment** (ORQ-05) |
| REF-NOAA-SOLAR | NOAA GML solar calculator | Sunrise/sunset, solar position | Not read |
| REF-WHO / REF-CDC-GROWTH | WHO, CDC | Growth standards, BMI schemes | CDC BMI page read; growth LMS tables not read |
| REF-KDIGO | KDIGO | CKD-EPI 2021 eGFR | Not read |
| REF-USDA-FDC / REF-DRI | USDA / NASEM | Food composition, DRI | Not read |
| REF-ACSM | ACSM | Exercise prescription, METs | Not read |
| REF-WIDMARK | Published forensic literature | BAC estimation | Not read |
| REF-EPA / REF-DEFRA | US EPA, UK DEFRA | Emission factors, fuel CO₂ | Not read |
| REF-GHG-PROTOCOL | GHG Protocol | Scope 1/2/3 boundaries | Not read |
| REF-WMO / REF-IPCC | WMO, IPCC | GWP sets, climate norms | Not read |
| REF-IATA / REF-IMO / REF-ICAO | IATA, IMO, ICAO | Air freight, maritime, aviation rules | Not read |
| REF-UPS-DIM / REF-FEDEX-DIM | Carriers | Dimensional weight divisors | Not read (and changes) |
| REF-IFRS / REF-GAAP | IFRS Foundation, FASB | Accounting treatments | Not read |
| REF-HMRC / REF-EU-VAT / REF-GCC-VAT | Tax authorities | Non-US VAT/GST | Not read |
| REF-NRMCA / REF-PCA / REF-CIB | Concrete and construction institutes | Mix yields, material data | Not read |
| REF-MEEUS | *Astronomical Algorithms* (Meeus) | Solar/lunar positions | Not read |
| REF-USGS / REF-NOAA | USGS, NOAA | Geodesy, tides | Not read |

### 23.3 Note on reference completeness

The catalog uses `REF-…` codes as **pointers to an intended authority**, not as claims of
verification. The build marks a row `SOURCE_VERIFIED` only where the source in §23.1 was read and
directly supports it; every other row is `RESEARCH_REQUIRED` or `SPECIALIST_REVIEW_REQUIRED`.
A future agent must move codes from §23.2 into §23.1 — with the exact passage, edition and access
date recorded in `research/research-log.md` — before changing any status.
