# Calculators

A working, production-oriented calculator site built with Next.js (App Router), TypeScript in strict mode,
and Tailwind CSS v4. Twelve calculators are implemented, each with a documented formula, stated assumptions,
cited sources and unit tests. Everything runs in the browser: no account, no upload, no server-side storage of
inputs.

This repository also contains the earlier research and planning deliverables, which are preserved unchanged:
a 1,248-entry catalogue, a master plan, and a research log. An entry appears on the website **only** when it
has a verified formula and passing tests, so the catalogue is much larger than the live site.

- Live calculator count: **12**
- Categories with at least one working tool: **6**
- Catalogued candidates: **1,248** (see `docs/project-plan/catalog.csv`)

---

## Implemented calculators

| ID | Calculator | Category | Verification | Known-answer test |
| --- | --- | --- | --- | --- |
| CALC-0001 | Percentage of a Number | Basic Arithmetic & Percentages | standard math (derivation on page) | 15% of 200 = 30 |
| CALC-0002 | Percentage Change | Basic Arithmetic & Percentages | standard math (derivation on page) | 100 → 120 = +20% |
| CALC-0003 | Percentage Difference | Basic Arithmetic & Percentages | standard math (derivation on page) | 100 vs 120 = 18.1818% |
| CALC-0004 | Percentage Point Change | Basic Arithmetic & Percentages | standard math (derivation on page) | 10% → 12% = +2 pp and +20% |
| CALC-0111 | Mean | Statistics & Probability | standard math (derivation on page) | 4,8,15,16,23,42 → 18 |
| CALC-0114 | Standard Deviation & Variance | Statistics & Probability | source-verified definitions | 2,4,4,4,5,5,7,9 → σ = 2 |
| CALC-0157 | Compound Interest | Money & Interest | standard math (derivation on page) | 10,000 @ 5% for 10 y monthly = 16,470.09 |
| CALC-0847 | Wind Chill | Weather & Climate | source-verified (NWS) | 0 °F at 15 mph = −19.4 °F |
| CALC-0848 | Heat Index | Weather & Climate | source-verified (NWS) | 100 °F at 55% RH = 123.6 °F |
| CALC-0897 | BMI | Health & Nutrition | source-verified (CDC) | 169 lb at 5 ft 9 in = 25.0 (overweight) |
| CALC-0957 | Length Converter | Unit Conversion | source-verified (NIST) | 1 mi = 1.609344 km |
| CALC-0961 | Temperature Converter | Unit Conversion | source-verified (NIST/SI) | 100 °C = 212 °F = 373.15 K |

"Standard math" means the formula is a mathematical definition and is derived in full on its own page rather
than taken from an external document. Nothing is presented as clinically or professionally validated.

Each calculator page contains: the interactive tool, an explanation, the formula with defined variables, a
worked example, assumptions, limitations, and links to the sources that were actually read.

---

## Pages and URLs

| Route | Purpose |
| --- | --- |
| `/` | Homepage: hero, live search, popular tools, categories, method |
| `/calculators` | Directory with client-side filtering |
| `/calculators/[slug]` | Individual calculator (static, one page per implemented tool) |
| `/categories` | Category index |
| `/categories/[slug]` | Category listing (only categories with real tools) |
| `/about` | Verification method and current state |
| `/privacy` | What is and is not collected |
| `/terms` | Terms of use |
| `/sitemap.xml`, `/robots.txt` | Generated from the registry, so they only ever list real pages |
| *(any unknown path)* | Custom 404 with search-free navigation back to the directory |

---

## Getting started

Requires Node.js 20.9 or newer (developed on Node 22.22.3 / npm 10.9.8).

```bash
npm install
cp .env.example .env.local   # optional; every variable is optional
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (prerenders every calculator and category page) |
| `npm run start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` under strict mode |
| `npm run lint` | ESLint 9 flat config with `eslint-config-next` |
| `npm test` | Vitest unit and formula tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Playwright end-to-end suite |
| `npm run test:e2e:install` | Install the Chromium browser binary Playwright needs |
| `npm run catalog:build` | Regenerate the planning master plan from the catalogue sources |

### Environment variables

All optional; with none set, the site builds and runs with no analytics, no ad slots, and `localhost`
canonicals. See `.env.example`. Nothing here is a secret — these are public identifiers that ship to the
browser.

| Variable | Effect when set | Effect when empty |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OG URLs, sitemap, robots point at this origin | Falls back to `http://localhost:3000` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Loads GA4 with `anonymize_ip` | No analytics script is rendered at all |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Renders reserved, labelled ad slots | No ad slot markup is rendered at all |

No tracking or advertising IDs are committed to this repository, and none are fabricated at runtime. Before
enabling either integration for real traffic in the EEA/UK, a consent mechanism must gate it.

---

## Architecture

```
app/
  layout.tsx                 Root layout: theme bootstrap, skip link, header, footer, analytics
  page.tsx                   Homepage
  calculators/page.tsx       Directory (client-side filter)
  calculators/[slug]/page.tsx  Calculator template: metadata, JSON-LD, form, prose, sources
  categories/page.tsx        Category index
  categories/[slug]/page.tsx Category listing
  about|privacy|terms/       Trust pages
  not-found.tsx              Custom 404
  sitemap.ts, robots.ts      Generated discovery files
  globals.css                Design tokens, dark palette, reduced-motion rules
components/
  calculator-form.tsx        Client form: validation, results, copy, reset, live region
  calculator-search.tsx      Client search box (no network)
  theme-toggle.tsx           Light/dark with pre-paint script and localStorage
  site-header/footer, cards, icons, breadcrumbs, json-ld, analytics, ad-slot
lib/
  calculators/definitions/   One file per calculator: metadata, fields, compute, prose, sources
  calculators/registry.ts    Catalogue of implemented tools, categories, runCalculator()
  calculators/validation.ts  Zod schema generated from field metadata
  calculators/types.ts       Shared types
  calculators/testing.ts     Test-only helpers
  format.ts, search.ts       Number formatting/parsing, search ranking
docs/project-plan/           Preserved research and planning deliverables
tests/e2e/                   Playwright specs
```

Design decisions worth knowing:

- **The registry is the single source of truth.** A calculator cannot appear in navigation, the sitemap or a
  category unless it is implemented, because all of those are derived from the same array.
- **Validation is generated from field metadata.** Ranges and options shown in the UI are the same ones
  enforced by Zod, so the two cannot drift apart. Blank input is rejected rather than coerced to `0`.
- **Calculators refuse to extrapolate.** Wind chill above 50 °F or at ≤ 3 mph, a percentage change from zero,
  a BMI with zero height, a temperature below absolute zero: each returns a written explanation of why the
  question is not well posed.
- **Results are derived, not stored,** so a stale result cannot survive an input change.
- **Theme is applied before first paint** by a small inline script, avoiding a flash of the wrong palette.
  `prefers-reduced-motion` disables smooth scrolling and transitions.
- **No page exists for an unimplemented catalogue entry.** The sitemap contains exactly the routes that
  exist (24 URLs: 6 static, 6 categories, 12 calculators).

---

## Testing

`npm test` runs 111 Vitest tests across 10 files:

- One known-answer suite per calculator family, using values published by the source or computed
  independently by hand (for example 1 mi = 1.609344 km, and the Wikipedia eight-value example σ = 2).
- Edge cases: zero denominators, empty input, out-of-domain values, absolute zero, list-size caps, duplicate
  separators, negative starting values.
- Validation behaviour: distinct messages for blank vs non-numeric input, per-field errors reported together.
- Registry integrity: unique slugs and IDs, description lengths, https sources, cross-links that resolve,
  category membership, and a sweep asserting no output ever contains `NaN` or `Infinity`.
- Search ranking behaviour, including empty-query and no-match cases.

`npm run test:e2e` runs Playwright against a production build (`next start`), covering the homepage,
search, calculator flows, validation errors, theming persistence, category pages, the 404 page, and
`robots.txt`/`sitemap.xml`. Browser binaries are not committed; install them once with
`npm run test:e2e:install`.

---

## Accessibility and performance notes

- Semantic landmarks (`header`, `nav`, `main`, `footer`, `aside`), one `h1` per page, labelled forms.
- Every input has a visible label, and hints/errors are wired up with `aria-describedby` and `aria-invalid`.
- Results live in an `aria-live="polite"` region so screen-reader users hear the answer appear.
- Skip link, visible focus rings that are never removed, `aria-pressed` on the theme toggle.
- Colour pairs are defined once as tokens for light and dark mode; text uses the ink/muted ramp on paper or
  surface backgrounds.
- No web fonts, no icon fonts, no images in the critical path; the hero grid is CSS, and the favicon is SVG.
- Static rendering for every calculator and category page; the only client JavaScript is the form, search,
  and theme toggle.

---

## Privacy

Calculator inputs are never transmitted. The only browser storage is the `theme` preference. Analytics and
advertising are off unless the corresponding environment variable is configured, and both are documented in
`/privacy`. See also `/terms`.

---

## Status, limits and next steps

Implemented and verified in this repository: the app, all 12 calculators, validation, tests (unit), SEO
metadata, sitemap/robots, theme, search, documentation, and a passing production build.

Not done, and not claimed:

- **No deployment has been performed.** No hosting account was configured and no URL is claimed. The build is
  Vercel-compatible (standard Next.js App Router) but nothing was deployed.
- **E2E tests were not executed in this environment.** The specs and configuration are written, but the
  Chromium binary download was blocked here, so the last recorded run of `npm run test:e2e` is not a pass.
  Run `npm run test:e2e:install && npm run build && npm run test:e2e` in an environment with network access.
- **Analytics, AdSense and Search Console are not configured** — no IDs exist, so no scripts load.
- **Supabase is not used.** Nothing in this scope needs a database or authentication.
- **Lighthouse was not run** (no browser available here), so no performance or accessibility score is claimed.
- The remaining catalogue entries (1,236 of them) are unimplemented; each needs a verified formula, tests and
  prose before it can be published.

## Repository history

The planning deliverables were merged to `main` first, then the implementation was developed on a dedicated
branch. Planning artefacts (`docs/project-plan/**`, the master plan, catalogue, research log) are preserved
unchanged by the implementation work.
