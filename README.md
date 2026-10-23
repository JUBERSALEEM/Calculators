# Calculators

Production-ready web calculator foundation built with Next.js 15 App Router, TypeScript (`strict`), Tailwind CSS, Zod, and Vitest, governed by [`docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`](docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md) and [`docs/project-plan/catalog.csv`](docs/project-plan/catalog.csv).

## Implemented Calculators

**All 1,248 catalog entries across 84 categories are implemented.** 58 are independently verified by known-answer tests (`calculators/reference-values.test.ts`, `calculators/known-answers-*.test.ts`), including all 21 source-verified entries; the other entries are smoke-tested (defaults and perturbed inputs produce finite, labelled results) but their formulas have not yet been checked against independent reference values.

| Cohort | Entries | Implementation |
| --- | --- | --- |
| `SOURCE_VERIFIED` | 21 | Formula parameters verified against the inspected authoritative source cited on each page (NIST SP 811, FAO-56, NOAA/NWS, CDC, SSA, IRS, US DOL, CFPB Reg Z, W3C WCAG 2.2). |
| `RESEARCH_REQUIRED` | 1,168 | Standard closed-form, engineering or user-parameterised arithmetic. Every formula is printed on the page with its variables, assumptions and limitations. |
| `SPECIALIST_REVIEW_REQUIRED` | 59 | Code-governed, licensed-table or clinically-gated tools (building codes, NEC, ACI/ASCE, pediatric LMS, prescribing). **No licensed table or clinical claim is embedded** — every regulated constant is a user input, the page carries a specialist-review banner, and the tool is excluded from `sitemap.xml` and marked `noindex`. |
| **Total** | **1,248** | — |

`docs/project-plan/catalog.csv` records `Verified (known-answer tested)` for 58 entries, `Implemented (smoke-tested; formula not independently verified)` for 1,131 entries, and
`Implemented (parametric; specialist review pending)` for the 59 specialist-gated
entries. No `formula_status` was upgraded without an inspected source.

### Architecture

| Path | Role |
| --- | --- |
| `calculators/catalog-data.ts` | Verbatim projection of the 1,248 catalog rows (ID, slug, category, formula status, notes, related tools). |
| `calculators/domains/m01…m09` | Nine discipline modules holding every executable spec: fields, units, constraints, formula, variables, assumptions, limitations and `compute`. |
| `lib/engine/{types,helpers,dsl}.ts` | Shared engine: validation, `Result` plumbing, `BigInt` fraction arithmetic, statistics primitives, financial solvers (IRR/APR, amortisation), date and unit helpers, and a strict input proxy that fails loudly on unknown keys. |
| `calculators/spec-loader.ts` | Lazily imports exactly one discipline chunk per route, so a page ships ~150 specs, not 1,248. |
| `components/calculator/engine-runtime.tsx` | Accessible client island: typed inputs, per-field validation messages, multi-metric results, formula disclosure. |

### Guarantees

- Every calculator is runnable with zero network calls, accounts, API keys or database.
- Inputs are validated (finite, integer, min/max, non-zero, domain limits) with human-readable errors; zero denominators return explicit messages instead of `Infinity`.
- Results never surface `NaN` or `Infinity` — enforced by `done()` and by the test suite.
- Formula, variables, assumptions, limitations and (where inspected) references are shown on every page.

### Test coverage

`calculators/engine.test.ts` verifies, for **every** one of the 1,248 specs:

1. exactly one spec per catalog slug (no gaps, no duplicates);
2. unique field keys, non-empty formula and variables;
3. default inputs produce finite, labelled outputs;
4. perturbed inputs (×1.1, ×0.5, ×3) never throw and never yield `NaN`/`Infinity`.

`calculators/reference-values.test.ts` pins independently hand-calculated reference
values (NWS wind chill −19.4 °F, NWS heat index 123.6 °F, CDC BMI 18.31 / 24.96,
SSA 2027 PIA $2,537.20, TY2026 federal tax $12,070, FLSA overtime $1,225, FAO-56
ETc, NIST unit factors) plus explicit domain-error cases.

## Local Development

```bash
npm install
npm run dev          # Starts dev server bound to 0.0.0.0:3000
```

## Verification & Production Build

```bash
npm run typecheck    # TypeScript strict check (tsc --noEmit)
npm run lint         # ESLint check (next lint)
npm test             # Unit tests across all calculator modules (Vitest)
npm run build        # Production Next.js build
npm start            # Production server bound to 0.0.0.0:3000
```

### Browser E2E Tests (Playwright)

Playwright browser binaries are installed on demand so `npm install` never fails in restricted or CI build environments:

```bash
npm run e2e:install  # Installs Chromium browser binary
npm run e2e          # Runs Playwright tests
```

## Environment Variables (Optional)

No environment variables, API keys, accounts, or database connections are required to build or run calculators.

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for metadata, `sitemap.xml`, and `robots.txt` | `http://localhost:3000` |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Optional GA4 measurement ID (not active unless explicitly configured) | _unset_ |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Optional AdSense client ID (not active unless explicitly configured) | _unset_ |
