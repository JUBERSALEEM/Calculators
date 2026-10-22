# Calculators

Production-ready web calculator foundation built with Next.js 15 App Router, TypeScript (`strict`), Tailwind CSS, Zod, and Vitest, governed by [`docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`](docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md) and [`docs/project-plan/catalog.csv`](docs/project-plan/catalog.csv).

## Implemented Calculators (Phase 1)

| Catalog ID | Route | Name | Source / Standard |
| --- | --- | --- | --- |
| `CALC-0001` | `/calculators/percentage-of-a-number` | Percentage of a Number | Elementary arithmetic (`REF-MATH-ELEM`) |
| `CALC-0002` | `/calculators/percentage-change` | Percentage Change | Elementary arithmetic (`REF-MATH-ELEM`) |
| `CALC-0003` | `/calculators/percentage-difference` | Percentage Difference | Elementary arithmetic (`REF-MATH-ELEM`) |
| `CALC-0025` | `/calculators/arithmetic-mean` | Arithmetic Mean | Elementary statistics (`REF-MATH-ELEM`) |
| `CALC-0847` | `/calculators/wind-chill` | Wind Chill Calculator | NOAA / NWS (`R-008`) |
| `CALC-0848` | `/calculators/heat-index` | Heat Index Calculator | NOAA / NWS (`R-009`, Rothfusz regression) |
| `CALC-0897` | `/calculators/bmi` | Adult BMI Calculator | CDC Adult BMI (`R-011`) |
| `CALC-0957` | `/calculators/length-converter` | Length Converter | NIST SP 811 (`R-001` / `R-014`) |

All arithmetic runs deterministically client-side with typed `Result` models, input validation, explicit domain checks, server-rendered formula explanations, worked examples, assumptions, limitations, and source references.

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
