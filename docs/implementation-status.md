# Implementation status — Phase 1

This file records what was **actually built and executed** in this repository. It is deliberately separate
from `docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`, which is a planning artefact and is preserved
unchanged: the plan's §13.2 matrix describes the state before implementation began.

Last verified: 23 October 2026.

## Environment used for these results

| Item | Value |
| --- | --- |
| Node.js | v22.22.3 |
| npm | 10.9.8 |
| Next.js | 16.4.3 |
| React | 19.3.1 |
| TypeScript | 5.9.3 (strict, `noUncheckedIndexedAccess`) |
| Tailwind CSS | 4.3.3 |
| Zod | 4.6.7 |
| Vitest | 5.0.5 |
| Playwright | 1.64.1 |

## Commands executed, with real outcomes

| Command | Result |
| --- | --- |
| `npm install` | 394 packages installed, 0 vulnerabilities reported by npm's audit summary |
| `npm run typecheck` | Passed (`tsc --noEmit`, no output) |
| `npm run lint` | Passed (ESLint 9, no warnings or errors) |
| `npm test` | **111 tests passed** in 10 files |
| `npm run build` | Passed; 29 routes generated (12 calculator pages, 6 category pages, 11 fixed routes) |
| `npm run start` | Serves the production build; all routes returned HTTP 200, unknown route returned 404 |
| `npm run test:e2e` | **Not executed.** Playwright's browser download is blocked in this environment (`Failed to download Chrome for Testing`). 36 tests in 3 files are collected by `npx playwright test --list`. |

## What is actually implemented

- Next.js App Router application, TypeScript strict, Tailwind v4 with a token-based light/dark design system.
- 12 calculators: see the table in `README.md`. Each has metadata, typed fields, validation, a compute
  function, formula, explanation, assumptions, cautions, sources and a worked example.
- Reusable calculator template at `/calculators/[slug]`, prerendered per calculator.
- Homepage, directory, category index, category pages, about, privacy, terms, custom 404.
- Client-side search (`lib/search.ts`, unit-tested) used on the homepage and directory.
- Theme toggle applied before first paint, persisted in `localStorage`, honouring
  `prefers-reduced-motion`.
- SEO: per-page titles and descriptions, canonicals from `NEXT_PUBLIC_SITE_URL`, Open Graph and Twitter
  metadata, generated `sitemap.xml` (24 URLs, all real), generated `robots.txt`, JSON-LD
  (`WebApplication` + `BreadcrumbList`) on calculator pages only.
- GA4 and AdSense are **off by default**; both render nothing unless public IDs are supplied at build time.

## What is not done

- **No deployment.** No Vercel (or other) deployment was created, and no URL is claimed. The app is a
  standard Next.js App Router project and is expected to deploy to Vercel, but that was not tested here.
- **No end-to-end run.** See above. The specs exist and are ready to run where Chromium can be installed.
- **No Lighthouse/axe audit.** No browser, therefore no measured performance or accessibility score. The
  accessibility features described in the README are implemented, not certified.
- **No analytics, AdSense, Search Console or consent platform configured.** No IDs exist in this repository.
- **No database.** Supabase was evaluated and not needed: there is no account system, no saved state and no
  server-side data.
- **1,236 catalogue entries remain unimplemented.** They are intentionally unpublished rather than
  generated as thin pages.
- **No professional review** of medical or financial content; pages state this explicitly.

## Known limitations in the shipped calculators

- Wind chill and heat index refuse or warn outside the ranges published by the NWS rather than
  extrapolating; the heat index regression's ±1.3 °F error and shade assumption are stated on the page.
- BMI is adult-only and classifies from the value rounded to one decimal place, matching CDC tables.
- Compound interest models a single deposit with no additional contributions, fees or taxes. It is not a
  loan amortisation schedule and does not use the Reg Z Appendix J rounding convention.
- Percentage change is undefined at a zero starting value; percentage difference is undefined when the two
  values average to zero. Both return an explicit error instead of a number.
