# Calculator Master Plan — 1,200+ Calculators

**Repository:** `JUBERSALEEM/Calculators` · **Branch:** `arena/fd9c69ce-calculators`
**Document status:** Research + catalog + roadmap. **No calculator is implemented.**
**Catalog size:** 1248 individually identified entries · 84 categories ·
21 source-verified · 59 specialist-review-required · 1168 research-required
**Research access date:** 22 October 2026 (UTC)
**Companion artefact:** [`catalog.csv`](catalog.csv) — machine-readable projection of §8
**Generator:** [`tools/build_master_plan.py`](tools/build_master_plan.py) (IDs, tables, statistics and
integrity checks are generated, so numbers in this file cannot drift from the data)
**Raw research log:** [`research/research-log.md`](research/research-log.md)

> **Read this first.** This plan is deliberately honest about what has and has not been
> verified. It contains a defensible catalog of 1248 distinct tools and a full research
> and verification *process*, but only 21 entries are backed by a source that was
> actually opened during this pass. Nothing here is production-ready, and no page may be
> published until it passes the release gates in §15.

---

## Table of contents

1. [Executive Summary](#1-executive-summary)
2. [Project Objectives and Non-Goals](#2-project-objectives-and-non-goals)
3. [Existing Repository Findings](#3-existing-repository-findings)
4. [Research Methodology](#4-research-methodology)
5. [Source Quality and Citation Policy](#5-source-quality-and-citation-policy)
6. [Calculator Taxonomy](#6-calculator-taxonomy)
7. [Catalog Statistics](#7-catalog-statistics)
8. [Complete Master Catalog](#8-complete-master-catalog)
9. [Formula Verification Standards](#9-formula-verification-standards)
10. [High-Risk Calculator Review Policy](#10-high-risk-calculator-review-policy)
11. [Duplicate Detection and Resolution Register](#11-duplicate-detection-and-resolution-register)
12. [SEO and Search Intent Strategy](#12-seo-and-search-intent-strategy)
13. [Recommended Technical Architecture](#13-recommended-technical-architecture)
14. [Calculator Component and Formula Module Conventions](#14-calculator-component-and-formula-module-conventions)
15. [Testing and Release Gates](#15-testing-and-release-gates)
16. [Implementation Priorities and Batches](#16-implementation-priorities-and-batches)
17. [Hosting and Operating Cost Considerations](#17-hosting-and-operating-cost-considerations)
18. [Advertising and Privacy Readiness](#18-advertising-and-privacy-readiness)
19. [Maintenance and Versioning Policy](#19-maintenance-and-versioning-policy)
20. [Unresolved Research Questions](#20-unresolved-research-questions)
21. [Audit Checklist](#21-audit-checklist)
22. [Final Completion Report](#22-final-completion-report)
23. [References](#23-references)

---

## 1. Executive Summary

**The business problem.** A calculator site earns organic traffic only if each page is the best
available answer to a specific query. Page count alone is a liability: Google's spam policies
(name "scaled content abuse", "keyword stuffing", "doorway abuse", "thin affiliation") exist
precisely to demote large volumes of low-value generated pages, and its "misleading
functionality" policy explicitly targets sites that claim a tool but lead users to ads instead
(R-005, §23). The strategy of this plan is therefore *fewer, better, verified* — but still large:
a catalog of 1248 genuinely distinct tools in 84 categories, each with a defined formula,
stated assumptions, tested implementation and a reason to exist as its own URL.

**What has been produced.** A complete, machine-checked catalog of **1248 entries** across
**84 categories**, each with a stable ID (`CALC-0001` … `CALC-1248`), a unique slug,
typed inputs/outputs, a formula-family reference, complexity, priority, verification status and
review notes. Every category carries a formula-family block that states the mathematics, the
variable definitions, the validity domain and the boundary behaviour — the parts that are
usually missing from calculator sites and are the usual cause of wrong answers.

**What is genuinely verified.** 13 authoritative documents were opened and inspected
(§4, §23): NIST SP 811 conversion factors, NIST CODATA 2022, FAO Irrigation & Drainage Paper 56,
the US SSA PIA page, CFPB Regulation Z Appendix J, Google's spam and helpful-content
documentation, NWS wind-chill and heat-index pages, IRS tax-year-2026 inflation adjustments,
CDC adult BMI categories, US DOL overtime rules, and WCAG 2.2. Those support 21
entries at `SOURCE_VERIFIED` and inform dozens more partly. **1168 entries remain
`RESEARCH_REQUIRED`** — the method is documented, the citation has not been inspected — and
**59 are `SPECIALIST_REVIEW_REQUIRED`** because they depend on licensed standards,
clinical judgement or legal rules that no calculator should present as settled truth.

**What must not be claimed.** No search volume, keyword difficulty, traffic forecast or revenue
estimate appears anywhere in this document. No ranking, indexing or ad-approval outcome is
promised. No entry is marked `IMPLEMENTED`, `TESTED` or `PUBLISHED`. No calculator is described
as medically, legally, financially or structurally certified.

**Highest-value next actions, in order.** (1) Approve the architecture in §13 and scaffold the
calculation engine and design system; (2) implement the P0 batch (§16) with the release gates of
§15 wired from the first commit; (3) run the research batches in §4 for the P1 cohorts, closing
`RESEARCH_REQUIRED` statuses in front of implementation rather than behind it; (4) publish
nothing until §15's gate passes for that specific entry.

---

## 2. Project Objectives and Non-Goals

### 2.1 Objectives

| # | Objective | Measure of success |
|---|---|---|
| O1 | A catalog of ≥1,200 genuinely distinct calculators with no keyword-inflated variants | Counted, deduplicated, audit script passes (§21) |
| O2 | Every calculator's formula traceable to an inspected source **or** explicitly flagged | 0 entries with an unmarked citation gap |
| O3 | Correctness before breadth | Release gate blocks publication on failed tests (§15) |
| O4 | Every page useful as a standalone answer | Content checklist (§12) applied per page |
| O5 | Accessible, mobile-first, fast | WCAG 2.2 AA target; Core Web Vitals budgets (§13) |
| O6 | Low running cost with a clear scaling path | Static-first hosting; no server needed for arithmetic (§17) |
| O7 | Maintainable by successive agents without prior context | Catalog as data, conventions in §14, changelog in §19 |
| O8 | Compliant, non-deceptive monetisation | Ad policy in §18; no ad-induced degradation of the tool |

### 2.2 Non-goals

- **Not** implementing 1,200 calculators in this task. This document is the roadmap.
- **Not** a claim that any listed formula has been validated for a specific user's legal,
  financial, medical or structural decision.
- **Not** keyword-volume research: we hold no licensed keyword dataset, so no demand metric is
  asserted (see §4.5).
- **Not** a brand, domain, logo or copy deck.
- **Not** a multilingual plan beyond stating that slugs and content must be localisable (§12.6).
- **Not** an affiliate/ad network application. Rates, approval and policy are outside our control.

---

## 3. Existing Repository Findings

Inspected before creating anything, as required.

| Path | Finding |
|---|---|
| `/home/user/Calculators` (repo root) | Contains only `.git/` and `README.md` |
| `README.md` | 13 bytes, single line `# Calculators` — no instructions, no stack |
| `git log` | One commit: `bea6976 Initial commit` (author JUBER SALEEM MALIK, 22 Oct 2026) |
| `git branch -a` | `main` + `origin/main` only; working branch `arena/fd9c69ce-calculators` |
| `package.json`, lockfiles, `pnpm-workspace.yaml` | **Absent** — no framework, no dependency graph |
| `next.config.*`, `vite.config.*`, `astro.config.*`, `nuxt.config.*` | **Absent** |
| `tsconfig.json`, `.eslintrc*`, `prettier.config.*` | **Absent** — no coding standard in force |
| `docs/`, `plan/`, `project-plan/`, `roadmap*`, `*.md` (other) | **Absent** — no prior planning convention |
| `.github/workflows/`, CI config | **Absent** |
| `.gitignore`, `.editorconfig` | **Absent** |
| Tests, fixtures, calculator inventories, formula libraries | **Absent** |
| Git history search for prior calculator ideas | Only the initial commit — nothing to deduplicate against |

**Conclusions.**

1. The project is **greenfield**. There is no existing architecture, so §13 recommends one
   rather than adapting to one — and the recommendation is explicitly marked as a proposal,
   not an established fact about the repo.
2. There is **no existing documentation directory**, so the brief's fallback applies: a clearly
   named `docs/project-plan/` was created. Nothing was deleted, renamed or reorganised; the
   single existing file (`README.md`) is untouched.
3. Because there is no prior catalog, **all 1248 entries are new** and the duplicate
   review in §11 is internal to this catalog.
4. Because there is no coding standard, §14 defines one. Because there is no test
   infrastructure, §15 defines it. Both are proposals for the first implementation batch.

**Files created by this task** (no other file was modified):

```
docs/project-plan/
├── CALCULATOR_MASTER_PLAN_1200_PLUS.md   ← the deliverable
├── catalog.csv                            ← machine-readable catalog (§8)
├── research/research-log.md               ← raw evidence trail per source
└── tools/
    ├── catalog_source.py                  ← catalog as data (single source of truth)
    ├── build_master_plan.py               ← generator + integrity checks
    ├── prose_a.md                         ← sections 1-5
    └── prose_b.md                         ← sections 9-23
```

---

## 4. Research Methodology

### 4.1 Process used

For each research batch: (1) state the topic and the questions; (2) open the candidate source
and read it; (3) record issuing organisation, URL, document title, edition/date and access date;
(4) extract the formula, factor or rule **verbatim enough to re-derive it**; (5) record units,
assumptions, rounding, exceptions and validity domain; (6) note conflicts and how they resolve;
(7) record what could not be resolved instead of guessing. The raw output is kept in
`research/research-log.md` with an explicit `Inspected: yes/no` flag per source.

### 4.2 Batches completed in this pass

| Batch | Topic | Questions investigated | Sources inspected |
|---|---|---|---|
| B1 | SI units, conversion factors, physical constants | Which factors are exact? Which edition is current? How often do constants change? | R-001, R-002 |
| B1 | Agro-meteorology | What is the standard reference-ET method, its constants and its limits? | R-003 |
| B1 | Social insurance | What is the exact benefit formula and rounding rule, and for which year? | R-004 |
| B2 | Search quality policy | What content patterns are penalised, and how does that constrain a 1,200-page plan? | R-005, R-006 |
| B2 | Consumer credit | What is the legally specified APR method (equation, unit-period rules)? | R-007 |
| B3 | Meteorology | Exact wind-chill and heat-index formulae, validity domains, error bounds | R-008, R-009 |
| B3 | Taxation | Current bracket thresholds, standard deduction, effective tax year | R-010 |
| B3 | Health screening | BMI formula, adult category cut-points, stated limitations | R-011 |
| B3 | Employment law | Overtime rate, workweek definition, averaging prohibition | R-012 |
| B3 | Accessibility | Current WCAG version and contrast requirement basis | R-013 |
| B4 | Unit conversion depth | Exact factors for length, volume, temperature, pressure, energy, power, force, torque, flow, illuminance, acceleration | R-001 (chunks 0, 2) |

Batches **not** completed, and therefore left as `RESEARCH_REQUIRED`: construction materials
(each material standard), structural codes, mechanical/electrical design codes, chemistry and
lab methods, nutrition and clinical equations, tax jurisdictions beyond the US federal 2026
brackets, and all jurisdiction-specific legal/HR tables. §20 lists these as open questions.

### 4.3 Source hierarchy applied

1. Government/regulator (NIST, IRS, SSA, CFPB, DOL, CDC, NOAA/NWS) — used for anything with a
   legal or safety consequence.
2. Standards bodies (BIPM/SI, W3C, ISO, IEEE, ASTM, ACI, ASHRAE, NFPA, NEC) — used where a
   professional would cite a standard. **Where the standard is paywalled, the plan records the
   dependency instead of reconstructing the text** (§20, ORQ-04).
3. Peer-reviewed literature and university texts — for methods without a regulator (FAO 56 is
   the canonical reference-ET method; NWS heat index is a published multiple regression).
4. Professional bodies and manufacturer data — only with an identified publisher and a version.
5. Reference works/encyclopaedias — discovery only, never the sole citation.

Calculator websites and AI-generated answers were treated as **discovery inputs only** and are
never cited as evidence for a formula.

### 4.4 Conflict handling (worked examples)

| Conflict | Resolution adopted |
|---|---|
| NIST SP 811 (2008) predates the 2019 SI redefinition; NIST SP 330 (2019) and BIPM SI Brochure 9th ed. supersede it for *definitions* | Use SP 811 Appendix B **only for conversion factors** (still authoritative), and SP 330/BIPM for unit definitions. Flagged in every unit page's references. |
| "APR" means nominal-rate × periods (US Reg Z) vs effective annual rate (EU CCD) | Two distinct outputs, two distinct labels, never one "APR" field. Reg Z entries must implement Appendix J. |
| BMI: WHO vs CDC cut-points (WHO adds "pre-obese"; CDC classes obesity 1-3) | CDC cut-points used where the audience is US-facing; the page must show which scheme is displayed. |
| Simple vs sample variance; population vs sample standard deviation | The tool must ask; the output label names the estimator. No silent default. |
| Grey area "gross margin" (accounting KPI) vs "margin" (pricing) | Kept distinct with documented input basis (revenue/COGS vs price/unit cost); see §11. |
| Heat index: NWS Rothfusz regression vs Steadman's original tables | NWS regression used (error stated as ±1.3 °F, shade-only, +up to 15 °F in sun). |

### 4.5 Deliberate omission: keyword metrics

No search-volume, difficulty, CPC or traffic figure is recorded anywhere. We did not inspect a
licensed keyword dataset, and inventing plausible numbers is exactly the failure mode the brief
forbids. Priority ordering in §16 therefore rests on **structural** signals only: universality of
the need, formula simplicity, availability of an inspected source, and whether the query is
likely transactional/utilitarian (a calculator) rather than informational (an article). Those
signals are stated per batch so a future agent can revisit them with real data.

### 4.6 Research limitations encountered

- `pvwatts.nrel.gov` and `nrel.gov/grid/solar-resource/spa.html` **failed to fetch** from this
  environment (twice). Solar-position and PV-yield methods are therefore `RESEARCH_REQUIRED`
  with NREL named as the intended authority (ORQ-05). We did not substitute a blog source.
- FAO 56's HTML renders equations as **images**, so the numeric coefficients of Eq. 6 could not
  be text-verified; only the reference-surface constants (h, LAI, r_l, k) were. The PDF must be
  used before coding ET0 (ORQ-03).
- NIST SP 811 Appendix B.8 is a 6-chunk table; chunks 0 and 2 were retrieved (A-B, D-G). Factors
  for C and H-Z (e.g. pound, mile, psi, ton) are **not yet transcribed** (ORQ-01).
- Individual CODATA 2022 constant values were not extracted (index page only) — each constant
  page must be opened before a constant is hard-coded (ORQ-02).

---

## 5. Source Quality and Citation Policy

### 5.1 Reference codes

Every catalog row carries a `Ref` code. Codes resolve in §23. Two classes exist, and the
distinction is enforced in the build:

- **`REF-…` with `Inspected: yes`** — the source was opened and the relevant passage read.
  Only these may support a `SOURCE_VERIFIED` status.
- **`REF-…` with `Inspected: no (identified)`** — the authority is named because it is the
  right authority, but it has not been read. These may support `RESEARCH_REQUIRED` or
  `SPECIALIST_REVIEW_REQUIRED` only.

### 5.2 Rules for future agents

1. **Never** cite a source you did not open. A search-result snippet is not evidence.
2. **Never** invent a URL, standard number, section, publication date or quotation. If the
   section number is unknown, cite the document, not a fabricated clause.
3. **Never** upgrade a status without recording the evidence: the reference code, the passage,
   and the date read, in `research/research-log.md`.
4. **One citation is not verification.** A formula's *mathematical* correctness, its
   *implementation* correctness, its *appropriateness* for a user's scenario, and the *current
   validity* of its regulatory assumptions are four separate checks (§9.2).
5. **Licensed standards are not reproduced.** Record the dependency, the edition, and the
   implementation consequence. Paraphrasing a paywalled table into a "free" calculator is both a
   licensing risk and an accuracy risk (ORQ-04).
6. **Time-sensitive values carry a date.** Tax brackets, benefit bend points, freight divisors,
   emission factors, statutory thresholds — each must show its effective period and a review
   date in the UI, not just in the code.
7. **Approximations are labelled.** If a closed form is an approximation (Swamee-Jain for
   Colebrook, rule-of-72 for doubling time, "×7" for pet age), the page states the error and the
   range of validity. An approximation may never be silently substituted for an exact method.
8. **Prefer primary over secondary.** A textbook quoting a standard is weaker than the standard;
   a blog quoting a textbook is not admissible.
## 6. Calculator Taxonomy

The catalog is organised into 84 primary categories. Each entry has exactly one primary category (the schema requirement); the mapping column shows which of the 86 required discovery topics of the brief each category serves, so coverage can be audited topic by topic.

| Cat | Primary category | Brief topic(s) served | Entries |
|---|---|---|---|
| `C01` | [Basic Arithmetic and Percentages](#c01--basic-arithmetic-and-percentages) | Required topic 1 | 14 |
| `C02` | [Fractions, Ratios, Proportions and Averages](#c02--fractions-ratios-proportions-and-averages) | Required topic 2 | 17 |
| `C03` | [Algebra and Equation Solving](#c03--algebra-and-equation-solving) | Required topic 3 | 14 |
| `C04` | [Geometry and Mensuration](#c04--geometry-and-mensuration) | Required topic 4 | 23 |
| `C05` | [Trigonometry](#c05--trigonometry) | Required topic 5 | 12 |
| `C06` | [Calculus and Numerical Methods](#c06--calculus-and-numerical-methods) | Required topic 6 | 16 |
| `C07` | [Matrices, Vectors and Linear Algebra](#c07--matrices-vectors-and-linear-algebra) | Required topic 7 | 14 |
| `C08` | [Statistics and Probability](#c08--statistics-and-probability) | Required topic 8 | 25 |
| `C09` | [Discrete Mathematics, Combinatorics and Number Theory](#c09--discrete-mathematics-combinatorics-and-number-theory) | Required topics 9, 10 | 20 |
| `C10` | [Interest, Time Value of Money and Discounting](#c10--interest-time-value-of-money-and-discounting) | Required topic 11 | 20 |
| `C11` | [Loans, Amortisation and Credit](#c11--loans-amortisation-and-credit) | Required topic 12 | 20 |
| `C12` | [Mortgages and Property Finance](#c12--mortgages-and-property-finance) | Required topic 21 | 16 |
| `C13` | [Investments, Returns and Portfolio Analysis](#c13--investments-returns-and-portfolio-analysis) | Required topic 13 | 25 |
| `C14` | [Retirement and Pension Planning](#c14--retirement-and-pension-planning) | Required topic 14 | 12 |
| `C15` | [Accounting and Bookkeeping](#c15--accounting-and-bookkeeping) | Required topic 15 | 17 |
| `C16` | [Business Pricing, Margin and Profitability](#c16--business-pricing-margin-and-profitability) | Required topic 16 | 17 |
| `C17` | [Taxation](#c17--taxation) | Required topic 17 | 18 |
| `C18` | [Payroll, Salary and Compensation](#c18--payroll-salary-and-compensation) | Required topic 76 | 18 |
| `C19` | [Economics and Business Analytics](#c19--economics-and-business-analytics) | Required topic 18 | 13 |
| `C20` | [Marketing and Advertising Metrics](#c20--marketing-and-advertising-metrics) | Required topic 19 | 17 |
| `C21` | [E-commerce and Online Selling](#c21--e-commerce-and-online-selling) | Required topic 20 | 13 |
| `C22` | [Real Estate and Property Investment](#c22--real-estate-and-property-investment) | Required topic 21 | 16 |
| `C23` | [Construction Materials and Quantity Takeoff](#c23--construction-materials-and-quantity-takeoff) | Required topic 22 | 25 |
| `C24` | [Architecture, Building Geometry and Interiors](#c24--architecture-building-geometry-and-interiors) | Required topics 23, 24 | 17 |
| `C25` | [Civil and Structural Engineering](#c25--civil-and-structural-engineering) | Required topics 25 | 20 |
| `C26` | [Mechanical Engineering and Machine Design](#c26--mechanical-engineering-and-machine-design) | Required topic 26 | 20 |
| `C27` | [Electrical Engineering and Power Systems](#c27--electrical-engineering-and-power-systems) | Required topic 27 | 22 |
| `C28` | [Electronics and Circuit Analysis](#c28--electronics-and-circuit-analysis) | Required topic 28 | 20 |
| `C29` | [Chemical Engineering and Process Calculations](#c29--chemical-engineering-and-process-calculations) | Required topic 29 | 12 |
| `C30` | [Fluid Mechanics and Hydraulics](#c30--fluid-mechanics-and-hydraulics) | Required topic 30 | 16 |
| `C31` | [Thermodynamics and Heat Transfer](#c31--thermodynamics-and-heat-transfer) | Required topic 31 | 18 |
| `C32` | [Manufacturing, Production and OEE](#c32--manufacturing-production-and-oee) | Required topic 32 | 16 |
| `C33` | [Cutting Stock, Nesting and Optimisation](#c33--cutting-stock-nesting-and-optimisation) | Required topic 33 | 12 |
| `C34` | [Glass Manufacturing and Glazing](#c34--glass-manufacturing-and-glazing) | Required topic 34 | 14 |
| `C35` | [Woodworking, Joinery and Timber](#c35--woodworking-joinery-and-timber) | Required topic 35 | 12 |
| `C36` | [Metal Fabrication and Machining](#c36--metal-fabrication-and-machining) | Required topic 36 | 16 |
| `C37` | [Textile, Fabric and Garment Production](#c37--textile-fabric-and-garment-production) | Required topic 37 | 15 |
| `C38` | [Packaging and Printing](#c38--packaging-and-printing) | Required topic 38 | 15 |
| `C39` | [Inventory and Stock Control](#c39--inventory-and-stock-control) | Required topic 39 | 12 |
| `C40` | [Supply Chain and Logistics](#c40--supply-chain-and-logistics) | Required topic 40 | 13 |
| `C41` | [Shipping, Freight and Container Loading](#c41--shipping-freight-and-container-loading) | Required topic 41 | 16 |
| `C42` | [Automotive and Vehicle Operation](#c42--automotive-and-vehicle-operation) | Required topic 42 | 16 |
| `C43` | [Aviation and Flight Planning](#c43--aviation-and-flight-planning) | Required topic 43 | 13 |
| `C44` | [Marine and Maritime Calculations](#c44--marine-and-maritime-calculations) | Required topic 44 | 13 |
| `C45` | [Physics and Mechanics](#c45--physics-and-mechanics) | Required topic 45 | 20 |
| `C46` | [Chemistry and Laboratory Methods](#c46--chemistry-and-laboratory-methods) | Required topic 46 | 20 |
| `C47` | [Biology and Life Sciences](#c47--biology-and-life-sciences) | Required topic 47 | 10 |
| `C48` | [Environmental Science and Emissions](#c48--environmental-science-and-emissions) | Required topic 48 | 14 |
| `C49` | [Renewable Energy and Solar Systems](#c49--renewable-energy-and-solar-systems) | Required topic 49 | 15 |
| `C50` | [Batteries and Electrical Energy Storage](#c50--batteries-and-electrical-energy-storage) | Required topic 50 | 10 |
| `C51` | [Astronomy and Orbital Mechanics](#c51--astronomy-and-orbital-mechanics) | Required topic 51 | 13 |
| `C52` | [Geography, Mapping and Surveying](#c52--geography-mapping-and-surveying) | Required topic 52 | 14 |
| `C53` | [Meteorology and Climate](#c53--meteorology-and-climate) | Required topic 53 | 12 |
| `C54` | [Agriculture and Horticulture](#c54--agriculture-and-horticulture) | Required topic 54 | 12 |
| `C55` | [Irrigation, Fertilisers and Crop Production](#c55--irrigation-fertilisers-and-crop-production) | Required topic 55 | 12 |
| `C56` | [Food Preparation and Recipe Scaling](#c56--food-preparation-and-recipe-scaling) | Required topic 56 | 14 |
| `C57` | [Nutrition and Dietary Calculations](#c57--nutrition-and-dietary-calculations) | Required topic 57 | 15 |
| `C58` | [Fitness and Exercise](#c58--fitness-and-exercise) | Required topic 58 | 14 |
| `C59` | [General Health and Clinical Screening](#c59--general-health-and-clinical-screening) | Required topic 59 | 16 |
| `C60` | [Date, Time and Calendar](#c60--date-time-and-calendar) | Required topic 60 | 15 |
| `C61` | [Unit Conversion and Measurement](#c61--unit-conversion-and-measurement) | Required topic 61 | 16 |
| `C62` | [Computer Science and Algorithms](#c62--computer-science-and-algorithms) | Required topic 62 | 12 |
| `C63` | [Programming and Software Development](#c63--programming-and-software-development) | Required topic 63 | 12 |
| `C64` | [Networking, IP Addressing and Subnetting](#c64--networking-ip-addressing-and-subnetting) | Required topic 64 | 14 |
| `C65` | [Data Storage and File Size](#c65--data-storage-and-file-size) | Required topic 65 | 9 |
| `C66` | [Web Development and Digital Design](#c66--web-development-and-digital-design) | Required topic 66 | 10 |
| `C67` | [Image, Video and Media](#c67--image-video-and-media) | Required topic 67 | 14 |
| `C68` | [Photography and Optics](#c68--photography-and-optics) | Required topic 68 | 14 |
| `C69` | [Audio and Acoustics](#c69--audio-and-acoustics) | Required topic 69 | 12 |
| `C70` | [Telecommunications](#c70--telecommunications) | Required topic 70 | 10 |
| `C71` | [Education, Grades and Examination Scoring](#c71--education-grades-and-examination-scoring) | Required topic 71 | 14 |
| `C72` | [Research Methodology and Experimental Design](#c72--research-methodology-and-experimental-design) | Required topic 72 | 12 |
| `C73` | [Quality Control and Reliability Engineering](#c73--quality-control-and-reliability-engineering) | Required topic 73 | 18 |
| `C74` | [Human Resources and Employment](#c74--human-resources-and-employment) | Required topic 75 | 12 |
| `C75` | [Insurance and Risk Analysis](#c75--insurance-and-risk-analysis) | Required topic 77 | 14 |
| `C76` | [Legal and Regulatory Calculations](#c76--legal-and-regulatory-calculations) | Required topic 78 | 9 |
| `C77` | [Gaming, Odds and Probability](#c77--gaming-odds-and-probability) | Required topic 79 | 12 |
| `C78` | [Sports and Athletic Performance Metrics](#c78--sports-and-athletic-performance-metrics) | Required topic 80 | 12 |
| `C79` | [Travel and Trip Planning](#c79--travel-and-trip-planning) | Required topic 81 | 12 |
| `C80` | [Household Budgets and Personal Finance](#c80--household-budgets-and-personal-finance) | Required topic 82 | 14 |
| `C81` | [Retail Pricing and Shopping](#c81--retail-pricing-and-shopping) | Required topic 83 | 10 |
| `C82` | [Pets and Animal Care](#c82--pets-and-animal-care) | Required topic 84 | 8 |
| `C83` | [Specialised Trades and Building Services](#c83--specialised-trades-and-building-services) | Required topics 85, 86 | 14 |
| `C84` | [Cross-Domain Utilities](#c84--cross-domain-utilities) | Required topic 86 | 8 |
| | **Total** | | **1248** |

Categories are *catalog* groupings, not silos: many calculators legitimately serve several topics (a loan APR tool serves banking, consumer protection and education). Cross-links between categories are specified as data in the `related` field of the catalog model in §14.

## 7. Catalog Statistics

All numbers below are computed by `tools/build_master_plan.py` from the catalog source, not typed by hand.

| Metric | Value |
|---|---|
| Individually identified entries | **1248** |
| Primary categories | 84 |
| Unique IDs | 1248 |
| Unique canonical slugs | 1248 |
| Entries with an inspected reference (`SOURCE_VERIFIED`) | 21 |
| Entries requiring formula research (`RESEARCH_REQUIRED`) | 1168 |
| Entries requiring specialist review (`SPECIALIST_REVIEW_REQUIRED`) | 59 |
| Independently validated | 0 |
| Implemented / tested / published | 0 / 0 / 0 |
| P0 / P1 / P2 / P3 | 125 / 360 / 538 / 225 |
| Simple / Moderate / Complex / Specialist complexity | 413 / 527 / 263 / 45 |

**Honest reading of these numbers.** Only 21 entries are backed by a source that was opened and inspected during this research pass (13 authoritative documents, listed in §23). The remaining entries have a documented formula *family* — the mathematics is standard and stated in the category block — but no citation has yet been inspected, so they are labelled `RESEARCH_REQUIRED`. That label means *"no inspected citation yet"*, not *"the method is unknown"*. Nothing in this catalog is implementation-ready on the strength of this document alone.

**Per-category distribution**

| Cat | Category | Entries |
|---|---|---|
| `C01` | Basic Arithmetic and Percentages | 14 |
| `C02` | Fractions, Ratios, Proportions and Averages | 17 |
| `C03` | Algebra and Equation Solving | 14 |
| `C04` | Geometry and Mensuration | 23 |
| `C05` | Trigonometry | 12 |
| `C06` | Calculus and Numerical Methods | 16 |
| `C07` | Matrices, Vectors and Linear Algebra | 14 |
| `C08` | Statistics and Probability | 25 |
| `C09` | Discrete Mathematics, Combinatorics and Number Theory | 20 |
| `C10` | Interest, Time Value of Money and Discounting | 20 |
| `C11` | Loans, Amortisation and Credit | 20 |
| `C12` | Mortgages and Property Finance | 16 |
| `C13` | Investments, Returns and Portfolio Analysis | 25 |
| `C14` | Retirement and Pension Planning | 12 |
| `C15` | Accounting and Bookkeeping | 17 |
| `C16` | Business Pricing, Margin and Profitability | 17 |
| `C17` | Taxation | 18 |
| `C18` | Payroll, Salary and Compensation | 18 |
| `C19` | Economics and Business Analytics | 13 |
| `C20` | Marketing and Advertising Metrics | 17 |
| `C21` | E-commerce and Online Selling | 13 |
| `C22` | Real Estate and Property Investment | 16 |
| `C23` | Construction Materials and Quantity Takeoff | 25 |
| `C24` | Architecture, Building Geometry and Interiors | 17 |
| `C25` | Civil and Structural Engineering | 20 |
| `C26` | Mechanical Engineering and Machine Design | 20 |
| `C27` | Electrical Engineering and Power Systems | 22 |
| `C28` | Electronics and Circuit Analysis | 20 |
| `C29` | Chemical Engineering and Process Calculations | 12 |
| `C30` | Fluid Mechanics and Hydraulics | 16 |
| `C31` | Thermodynamics and Heat Transfer | 18 |
| `C32` | Manufacturing, Production and OEE | 16 |
| `C33` | Cutting Stock, Nesting and Optimisation | 12 |
| `C34` | Glass Manufacturing and Glazing | 14 |
| `C35` | Woodworking, Joinery and Timber | 12 |
| `C36` | Metal Fabrication and Machining | 16 |
| `C37` | Textile, Fabric and Garment Production | 15 |
| `C38` | Packaging and Printing | 15 |
| `C39` | Inventory and Stock Control | 12 |
| `C40` | Supply Chain and Logistics | 13 |
| `C41` | Shipping, Freight and Container Loading | 16 |
| `C42` | Automotive and Vehicle Operation | 16 |
| `C43` | Aviation and Flight Planning | 13 |
| `C44` | Marine and Maritime Calculations | 13 |
| `C45` | Physics and Mechanics | 20 |
| `C46` | Chemistry and Laboratory Methods | 20 |
| `C47` | Biology and Life Sciences | 10 |
| `C48` | Environmental Science and Emissions | 14 |
| `C49` | Renewable Energy and Solar Systems | 15 |
| `C50` | Batteries and Electrical Energy Storage | 10 |
| `C51` | Astronomy and Orbital Mechanics | 13 |
| `C52` | Geography, Mapping and Surveying | 14 |
| `C53` | Meteorology and Climate | 12 |
| `C54` | Agriculture and Horticulture | 12 |
| `C55` | Irrigation, Fertilisers and Crop Production | 12 |
| `C56` | Food Preparation and Recipe Scaling | 14 |
| `C57` | Nutrition and Dietary Calculations | 15 |
| `C58` | Fitness and Exercise | 14 |
| `C59` | General Health and Clinical Screening | 16 |
| `C60` | Date, Time and Calendar | 15 |
| `C61` | Unit Conversion and Measurement | 16 |
| `C62` | Computer Science and Algorithms | 12 |
| `C63` | Programming and Software Development | 12 |
| `C64` | Networking, IP Addressing and Subnetting | 14 |
| `C65` | Data Storage and File Size | 9 |
| `C66` | Web Development and Digital Design | 10 |
| `C67` | Image, Video and Media | 14 |
| `C68` | Photography and Optics | 14 |
| `C69` | Audio and Acoustics | 12 |
| `C70` | Telecommunications | 10 |
| `C71` | Education, Grades and Examination Scoring | 14 |
| `C72` | Research Methodology and Experimental Design | 12 |
| `C73` | Quality Control and Reliability Engineering | 18 |
| `C74` | Human Resources and Employment | 12 |
| `C75` | Insurance and Risk Analysis | 14 |
| `C76` | Legal and Regulatory Calculations | 9 |
| `C77` | Gaming, Odds and Probability | 12 |
| `C78` | Sports and Athletic Performance Metrics | 12 |
| `C79` | Travel and Trip Planning | 12 |
| `C80` | Household Budgets and Personal Finance | 14 |
| `C81` | Retail Pricing and Shopping | 10 |
| `C82` | Pets and Animal Care | 8 |
| `C83` | Specialised Trades and Building Services | 14 |
| `C84` | Cross-Domain Utilities | 8 |

## 8. Complete Master Catalog

Every entry below is individually numbered and traceable to `catalog.csv`. IDs are assigned in category order and are permanent.

### 8.0 How to read an entry

Every entry carries the full 22-field schema from §4 of the brief. To keep 1248 entries readable, fields that are constant for a whole category or formula family are stated **once** — in the category block above its table — and the table itself carries the per-entry projection. The composition is explicit:

| Schema field | Where it lives |
|---|---|
| ID | `ID` column, stable, never reused |
| Name | `Name` column |
| Slug | `Slug` column (validated format, unique, no stop words) |
| Primary category / subcategory | The category section (`Cxx`) and the `Family` reference in the formula block |
| Purpose / search intent | The category `Purpose` line + the entry name and IO column |
| Inputs / outputs / units | `Inputs → Outputs` column; canonical units are SI in the module, display units per UI |
| Formula or method, variables, assumptions, edge cases | The **formula families** block for that category (`F-XXX-nn`); each block states variables, units, validity domain and boundary behaviour |
| Formula references | `Ref` column → resolved in §23 |
| Verification method | Default protocol `T1-T6` (§15) + the family's stated reference example; `S` entries additionally name the inspected source |
| Complexity / priority | `Cx` (1-4) and `Pri` (P0-P3) columns |
| Test requirements | §15 defaults `T1` known-answer, `T2` boundary, `T3` invalid input, `T4` unit/dimension, `T5` precision/rounding, `T6` UI/a11y; families may add specific cases |
| SEO content requirements | §12 defaults: H1, 150-300 word unique explainer, formula block, 1-2 worked examples with checked arithmetic, assumptions, 2-5 FAQs, 3+ internal links |
| Duplicate review | Performed for every entry against name/purpose/formula/IO/units; outcomes in §11 |
| Formula status / implementation status | `Status` column (`S`, `R`, `X`); implementation is `Planned` for all entries |
| Review notes | The note column appears as an italic remark under any entry carrying one |
| Assumptions of validity / jurisdiction & effective date | Stated in the family block; mandatory in the page UI for every `S`/`X` entry |

**Status legend** — `S` = `SOURCE_VERIFIED` (an inspected source supports the method), `R` = `RESEARCH_REQUIRED` (method documented, citation not yet inspected), `X` = `SPECIALIST_REVIEW_REQUIRED` (licensed standard, clinical, legal or safety consequence). No entry is `IMPLEMENTED`, `TESTED` or `PUBLISHED`.

**Cx legend** — 1 Simple (single formula, one input group), 2 Moderate (several steps or units), 3 Complex (iterative/numerical or multi-model), 4 Specialist (domain judgement, licensed data, or an optimisation problem).

---

### C01 · Basic Arithmetic and Percentages

`Entries: 14` · `Brief topic(s): 1` · `Priorities present: P0, P1`

**Formula families, variables, assumptions and edge cases**

- **F-ARI-01 Percent of a base** `part = p/100 * base`; reverse form `base = part / (p/100)`.
  Edge cases: p may be negative; base = 0 is undefined for the reverse form.
- **F-ARI-02 Relative change** `change% = (B-A)/|A|*100` (asymmetric, base = A) vs
  `symmetric difference% = |A-B|/((A+B)/2)*100`. These are different quantities and must never
  be merged: a change from 100 to 120 is +20% change but 18.18% symmetric difference.
- **F-ARI-03 Percentage points** `pp = p2 - p1` where p1,p2 are already percentages; cannot be
  derived from relative change without the original base.
- **F-ARI-04 Successive changes** `net = (1+r1)(1+r2)...-1`; order-independent for multiplication
  but NOT for mixed add/subtract-percent workflows applied to a running balance.
- **F-ARI-05 Rounding** half-up vs half-even (banker's) vs truncation differ on exact ties;
  see REF-IEEE754 for binary floating-point tie behaviour.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0001` | Percentage of a Number | `percentage-of-a-number` | amount, percent -> portion | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0002` | Percentage Change | `percentage-change` | old, new -> % change vs old | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0003` | Percentage Difference | `percentage-difference` | A, B -> % difference vs mean | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0004` | Percentage Point Change | `percentage-point-change` | p1%, p2% -> pp | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0005` | Reverse Percentage | `reverse-percentage` | final value, % applied -> original | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0006` | Add Percentage to Value | `add-percentage` | value, % -> increased value | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0007` | Subtract Percentage from Value | `subtract-percentage` | value, % -> reduced value | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0008` | Successive Percentage Change | `successive-percentage-change` | list of % changes -> net % | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0009` | Percent Error | `percent-error` | measured, accepted -> % error | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0010` | Percent of Total (Share) | `percent-of-total` | parts, total -> shares % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0011` | Percentage of a Percentage | `percent-of-percent` | base, %A, %B -> portion | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0012` | Gain Needed to Recover a Loss | `recover-loss-gain` | loss % -> required gain % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0013` | Order of Operations Evaluator | `order-of-operations` | expression -> value | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0014` | Rounding Mode Calculator | `rounding-modes` | number, places, mode -> rounded | `REF-MATH-ELEM` | 1 | P1 | `R` |

**Review notes for this category**

- `CALC-0003` **Percentage Difference** — Distinct from change: symmetric, no base year. Reviewed: not a duplicate.

### C02 · Fractions, Ratios, Proportions and Averages

`Entries: 17` · `Brief topic(s): 2` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-FRA-01 Exact rational arithmetic** `a/b + c/d = (ad+cb)/(bd)`, reduced by
  `g = gcd(|num|,den)`. Implementation must use exact integers (or BigInt) and only round at
  display, otherwise 1/3+1/3+1/3 != 1.
- **F-FRA-02 Repeating decimal -> fraction** for `0.\overline{d}` with k repeating digits:
  `x = d/(10^k - 1)`; mixed forms require shifting by the non-repeating prefix length.
- **F-FRA-03 Means** arithmetic `(Σx)/n`, weighted `Σw·x/Σw`, harmonic `n/Σ(1/x)`,
  geometric `(Πx)^(1/n)`. Harmonic is required for averaging rates (e.g. speeds) and geometric
  for growth factors; using arithmetic mean there is a documented error.
- **F-FRA-04 Proportional sharing** split total T in ratio a:b:c -> `T·a/(a+b+c)`; rounding
  residue must be allocated by a stated rule so parts still sum to T.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0015` | Fraction Arithmetic | `fraction-arithmetic` | two fractions, op -> exact fraction | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0016` | Simplify Fraction | `simplify-fraction` | num, den -> reduced fraction | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0017` | Mixed Number Converter | `mixed-number-converter` | mixed <-> improper | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0018` | Fraction to Decimal | `fraction-to-decimal` | num/den -> decimal, rounding mode | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0019` | Decimal to Fraction | `decimal-to-fraction` | decimal -> exact fraction | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0020` | Repeating Decimal to Fraction | `repeating-decimal-to-fraction` | 0.dddd... -> fraction | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0021` | Ratio Simplifier | `ratio-simplifier` | a:b:c -> reduced ratio | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0022` | Ratio to Decimal and Percent | `ratio-to-decimal` | a:b -> decimal, % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0023` | Proportion Solver | `proportion-solver` | a/b = c/x -> x | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0024` | Drawing Scale Converter | `drawing-scale` | scale 1:n, measured -> real length | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0025` | Arithmetic Mean | `arithmetic-mean` | numbers -> mean, sum, count | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0026` | Weighted Average | `weighted-average` | values, weights -> weighted mean | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0027` | Average of Averages | `average-of-averages` | group means, sizes -> pooled mean | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0028` | Harmonic Mean | `harmonic-mean` | rates/values -> harmonic mean | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0029` | Geometric Mean | `geometric-mean` | growth factors -> geometric mean | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0030` | Unit Rate | `unit-rate` | quantity, cost/time -> per-unit rate | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0031` | Proportional Share Split | `proportional-split` | total, ratio -> shares | `REF-MATH-ELEM` | 1 | P1 | `R` |

### C03 · Algebra and Equation Solving

`Entries: 14` · `Brief topic(s): 3` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-ALG-01 Quadratic** `x = (-b ± sqrt(b²-4ac))/(2a)`, discriminant `D = b²-4ac` decides
  0/1/2 real roots; a=0 is not quadratic and must be rejected, not silently linear-solved.
  Use the numerically stable form (`q = -(b + sign(b)sqrt(D))/2`) to avoid catastrophic
  cancellation when `b² >> 4ac`.
- **F-ALG-02 Linear systems** Gaussian elimination with partial pivoting; singular or
  near-singular matrices must report condition, not a fake answer.
- **F-ALG-03 Logarithms** `log_b(x)` defined only for x>0, b>0, b≠1; implement as
  `ln x / ln b` and special-case b=10, b=2, b=e.
- **F-ALG-04 nth roots** odd roots of negative reals are real (`(-8)^(1/3) = -2`); even roots
  are not. JavaScript `Math.pow` returns NaN for negative base with fractional exponent.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0032` | Quadratic Equation Solver | `quadratic-solver` | a,b,c -> roots, discriminant | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0033` | Cubic Equation Solver | `cubic-solver` | a,b,c,d -> real/complex roots | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0034` | Linear Equation Solver | `linear-equation-solver` | ax+b=c -> x | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0035` | Two-Variable Linear System | `two-equation-system` | 2 equations -> x,y | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0036` | Three-Variable Linear System | `three-equation-system` | 3 equations -> x,y,z | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0037` | Polynomial Evaluator | `polynomial-evaluator` | coefficients, x -> value | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0038` | Nth Root Calculator | `nth-root` | x, n -> real root | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0039` | Exponent and Power Calculator | `exponent-power` | base, exponent -> power | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0040` | Logarithm Calculator | `logarithm` | x, base -> log | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0041` | Antilog / Exponential Solver | `antilog-exponential` | log value, base -> x | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0042` | Radical Simplifier | `radical-simplifier` | sqrt(n) -> a·sqrt(b) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0043` | Linear Inequality Solver | `linear-inequality` | ax+b < c -> interval | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0044` | Absolute Value Equation Solver | `absolute-value-equation` | abs(ax+b) = c -> roots | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0045` | Direct and Inverse Variation | `variation-solver` | k, x -> y (direct/inverse) | `REF-MATH-ELEM` | 1 | P2 | `R` |

### C04 · Geometry and Mensuration

`Entries: 23` · `Brief topic(s): 4` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-GEO-01 Circle** `A = πr²`, `C = 2πr`, `d = 2r`; use r>0. Sector:
  `A = ½r²θ` with θ in radians, arc `s = rθ`.
- **F-GEO-02 Triangle** Heron `A = sqrt(s(s-a)(s-b)(s-c))`, `s=(a+b+c)/2`; validity requires
  the triangle inequality `a+b>c` etc. A degenerate (collinear) input returns 0, not an error
  value from a negative radicand.
- **F-GEO-03 Solids** sphere `V=4/3πr³, S=4πr²`; cylinder `V=πr²h`; cone `V=1/3πr²h`;
  frustum `V = (πh/3)(R²+Rr+r²)`; pyramid `V=Ah/3`; torus `V=2π²Rr²`.
- **F-GEO-04 Polygon by coordinates** shoelace `A = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|`;
  self-intersecting polygons must be rejected or documented.
  Rounding policy: state significant figures and never round intermediate values.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0046` | Circle Area and Circumference | `circle-area` | radius/diameter -> A, C | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0047` | Triangle Area (Heron) | `triangle-area-heron` | 3 sides -> area, angles | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0048` | Pythagorean Theorem | `pythagorean-theorem` | 2 sides -> hypotenuse/leg | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0049` | Rectangle and Square | `rectangle-area` | sides -> A, P, diagonal | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0050` | Parallelogram | `parallelogram-area` | base, height, side -> A, P | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0051` | Trapezoid | `trapezoid-area` | parallel sides, height -> A | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0052` | Kite and Rhombus | `kite-rhombus-area` | diagonals -> A, P | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0053` | Regular Polygon | `regular-polygon` | n sides, side/apothem -> A, P | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0054` | Sector and Arc | `sector-arc` | radius, angle -> arc, sector A | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0055` | Ellipse | `ellipse` | a, b -> A, P (Ramanujan) | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0056` | Sphere | `sphere` | r -> V, S | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0057` | Cylinder | `cylinder` | r, h -> V, lateral, total S | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0058` | Cone | `cone` | r, h -> V, slant, S | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0059` | Conical Frustum | `frustum-cone` | R, r, h -> V, S | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0060` | Pyramid | `pyramid` | base area, h -> V, S | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0061` | Cuboid and Prism | `cuboid-prism` | dimensions -> V, S | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0062` | Torus | `torus` | R, r -> V, S | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0063` | Polygon Area from Coordinates | `polygon-shoelace` | vertices -> area, perimeter | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0064` | Distance and Midpoint | `distance-midpoint` | 2 points -> distance, midpoint | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0065` | Box Space Diagonal | `box-diagonal` | l,w,h -> diagonal | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0066` | Triangle Inradius and Circumradius | `triangle-inradius` | 3 sides, area -> r, R | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0067` | Circle Segment Area | `circle-segment` | radius, chord/angle -> segment A | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0068` | Annulus | `annulus` | outer, inner radius -> A | `REF-MATH-ELEM` | 1 | P1 | `R` |

### C05 · Trigonometry

`Entries: 12` · `Brief topic(s): 5` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TRI-01 Right triangle** `sin θ = opp/hyp`, `cos θ = adj/hyp`, `tan θ = opp/adj`;
  inverse functions return a principal value — the caller must resolve the quadrant.
- **F-TRI-02 Law of sines** `a/sin A = b/sin B = c/sin C = 2R`; the ambiguous SSA case has
  0, 1 or 2 solutions and must be surfaced explicitly.
- **F-TRI-03 Law of cosines** `c² = a² + b² - 2ab cos C`; angle from
  `cos C = (a²+b²-c²)/(2ab)`; guard `|cos|>1` from floating-point error.
- **F-TRI-04 Degree/radian/grad** `rad = deg·π/180`, `grad = deg·10/9`. Never mix angle units
  between an input field and a trig function — the classic unit bug.
- **F-TRI-05 Chord/sagitta** `c = 2r sin(θ/2)`, sagitta `h = r(1 - cos(θ/2))`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0069` | Right Triangle Solver | `right-triangle-solver` | 2 of (a,b,c,angle) -> all | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0070` | Law of Sines | `law-of-sines` | angles, side -> unknown sides | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0071` | Law of Cosines | `law-of-cosines` | 3 sides or SAS -> angle/side | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0072` | Triangle Area from SAS | `triangle-area-sas` | 2 sides, included angle -> A | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0073` | Angle Unit Converter | `angle-unit-converter` | deg/rad/grad/turn -> all | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0074` | Trigonometric Function Values | `trig-function-values` | angle -> sin..tan, exact | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0075` | Inverse Trigonometric Functions | `inverse-trig` | ratio -> angle (principal) | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0076` | Hyperbolic Functions | `hyperbolic-functions` | x -> sinh, cosh, tanh... | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0077` | Oblique Triangle Solver | `oblique-triangle-solver` | any 3 parts -> all (SSA cases) | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0078` | Chord, Sagitta and Arc | `chord-sagitta` | radius, angle -> chord, sagitta | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0079` | Sine Wave Parameters | `sine-wave-params` | amplitude, period, phase -> equation | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0080` | Trigonometric Identity Checker | `trig-identity-check` | expression pair -> equal? | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C06 · Calculus and Numerical Methods

`Entries: 16` · `Brief topic(s): 6` · `Priorities present: P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CAL-01 Numerical derivative** central difference
  `f'(x) ≈ (f(x+h) - f(x-h))/(2h)` with h scaled to `sqrt(ε)·max(1,|x|)`; forward difference
  is O(h) and must not be presented as equally accurate.
- **F-CAL-02 Quadrature** composite Simpson `h/3[f0+4Σodd+2Σeven+fn]` requires an even number
  of intervals; trapezoid `h/2[f0+2Σf+fn]`. Report the method and n, because the result is
  method-dependent.
- **F-CAL-03 Root finding** bisection needs a sign change on [a,b]; Newton-Raphson needs f'
  and can diverge or cycle; always return iteration count and residual.
- **F-CAL-04 ODE** explicit Euler `y_{n+1}=y_n+h·f(t,y)` is first order; RK4 is fourth order.
  Do not label Euler output as "the solution" — it is an approximation with stated step size.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0081` | Numerical Derivative | `numerical-derivative` | f(x), x -> f'(x) | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0082` | Symbolic Derivative | `symbolic-derivative` | expression -> derivative | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0083` | Definite Integral (Simpson) | `integral-simpson` | f, a, b, n -> area | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0084` | Definite Integral (Trapezoid) | `integral-trapezoid` | f, a, b, n -> area | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0085` | Riemann Sum | `riemann-sum` | f, interval, rule -> estimate | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0086` | Limit Estimate | `limit-numeric` | f, approach point -> L | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0087` | Taylor Series Expansion | `taylor-series` | f, centre, order -> polynomial | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0088` | Newton-Raphson Root | `newton-raphson` | f, f', x0 -> root, iterations | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0089` | Bisection Root | `bisection-root` | f, [a,b] -> root, iterations | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0090` | Secant Method Root | `secant-root` | f, x0, x1 -> root | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0091` | Function Extremum Finder | `extremum-finder` | f, interval -> min/max | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0092` | Arc Length of a Curve | `arc-length-curve` | f, interval -> length | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0093` | Volume of Revolution | `volume-revolution` | f, interval, axis -> volume | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0094` | Euler Method ODE | `euler-ode` | y'=f, y0, h, steps -> y(t) | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0095` | Runge-Kutta 4 ODE | `rk4-ode` | y'=f, y0, h, steps -> y(t) | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0096` | Lagrange Interpolation | `lagrange-interpolation` | points -> polynomial value | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C07 · Matrices, Vectors and Linear Algebra

`Entries: 14` · `Brief topic(s): 7` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-LIN-01 Matrix product** `C_ij = Σ_k A_ik·B_kj`, defined only when
  cols(A) = rows(B); dimensions must be validated before the loop.
- **F-LIN-02 Determinant** 2x2 `ad-bc`; general case via LU with partial pivoting — the product
  of pivots equals det up to sign flips from row swaps. Never use the cofactor expansion
  recursively for n>6 (O(n!)).
- **F-LIN-03 Inverse** `A⁻¹ = adj(A)/det(A)` exists iff det ≠ 0; report the condition number
  rather than a numerically meaningless inverse for ill-conditioned matrices.
- **F-LIN-04 Dot/cross** `a·b = |a||b|cos θ`; `|a×b| = |a||b|sin θ` gives the parallelogram
  area; cross product is 3-D only.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0097` | Matrix Multiplication | `matrix-multiply` | A(m×n), B(n×p) -> C | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0098` | Matrix Addition and Subtraction | `matrix-add-subtract` | same-shape matrices -> sum | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0099` | Matrix Determinant | `matrix-determinant` | square matrix -> det | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0100` | Matrix Inverse | `matrix-inverse` | square matrix -> A^-1, det | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0101` | Matrix Transpose and Trace | `matrix-transpose-trace` | matrix -> A^T, trace | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0102` | Matrix Rank | `matrix-rank` | matrix -> rank, basis | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0103` | Solve Linear System by Matrix | `matrix-solve-system` | A, b -> x | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0104` | Eigenvalues 2x2 | `eigenvalues-2x2` | 2x2 -> λ1, λ2, vectors | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0105` | Eigenvalues 3x3 | `eigenvalues-3x3` | 3x3 -> λ, vectors | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0106` | Vector Dot Product | `vector-dot` | 2 vectors -> dot, angle | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0107` | Vector Cross Product | `vector-cross` | 2 3-D vectors -> cross vector, magnitude | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0108` | Vector Magnitude and Unit Vector | `vector-magnitude` | vector -> magnitude, unit vector | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0109` | Vector Projection and Angle | `vector-projection` | a, b -> proj, angle | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0110` | Matrix Power | `matrix-power` | A, n -> A^n | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C08 · Statistics and Probability

`Entries: 25` · `Brief topic(s): 8` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-STA-01 Dispersion** population `σ² = Σ(x-μ)²/N` vs sample `s² = Σ(x-x̄)²/(n-1)`.
  Mixing the two is the most common statistics defect; the UI must ask which is intended and
  state it in the output label.
- **F-STA-02 Correlation/regression** Pearson `r = Σ(x-x̄)(y-ȳ) / sqrt(Σ(x-x̄)²Σ(y-ȳ)²)`;
  slope `b1 = r·sy/sx`, intercept `b0 = ȳ - b1x̄`. r is not causation and r² is the explained
  variance, not the model's validity.
- **F-STA-03 Normal distribution** `Φ(z)` has no elementary closed form; use an erfc-based
  implementation, not a lookup table with linear interpolation. Inverse normal needs a
  rational approximation (Acklam/Moro) with stated accuracy.
- **F-STA-04 Confidence interval for a mean** `x̄ ± t_{α/2,n-1}·s/√n`; use z only when σ is
  known or n is large, and say which was used.
- **F-STA-05 Sample size** `n = (z²·p(1-p))/E²` for a proportion (Cochran); finite-population
  correction `n_adj = n / (1 + (n-1)/N)`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0111` | Mean Calculator | `mean` | dataset -> mean, sum, n | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0112` | Median and Quartiles | `median-quartiles` | dataset -> Q1, Q2, Q3 | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0113` | Mode and Frequency | `mode-frequency` | dataset -> mode(s), counts | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0114` | Variance and Standard Deviation | `variance-stddev` | dataset, pop/sample -> s², s | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0115` | Coefficient of Variation | `coefficient-of-variation` | dataset -> CV% | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0116` | Z-Score | `z-score` | x, mean, sd -> z, percentile | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0117` | Percentile Rank | `percentile-rank` | dataset, value -> percentile | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0118` | Skewness and Kurtosis | `skewness-kurtosis` | dataset -> skew, kurtosis | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0119` | Covariance | `covariance` | paired data -> cov (pop/sample) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0120` | Pearson Correlation | `pearson-correlation` | x, y -> r, r², p | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0121` | Spearman Rank Correlation | `spearman-correlation` | x, y -> ρ | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0122` | Simple Linear Regression | `linear-regression` | x, y -> slope, intercept, r² | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0123` | Multiple Linear Regression | `multiple-regression` | X, y -> coefficients | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0124` | Outlier Detection (IQR Rule) | `outlier-iqr` | dataset -> outliers, fences | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0125` | Normal Distribution CDF | `normal-cdf` | x, μ, σ -> P, percentile | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0126` | Inverse Normal | `inverse-normal` | p, μ, σ -> x | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0127` | Student t Distribution | `t-distribution` | t, df -> p | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0128` | Chi-Square Test | `chi-square-test` | observed, expected -> χ², p | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0129` | Binomial Probability | `binomial-probability` | n, k, p -> P(X=k) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0130` | Poisson Probability | `poisson-probability` | λ, k -> P(X=k) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0131` | Exponential Distribution | `exponential-distribution` | λ, x -> pdf, cdf | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0132` | Confidence Interval for a Mean | `confidence-interval-mean` | x̄, s, n, CL -> CI | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0133` | Confidence Interval for a Proportion | `confidence-interval-proportion` | p̂, n, CL -> CI | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0134` | Sample Size Calculator | `sample-size` | margin, CL, p -> n | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0135` | Margin of Error | `margin-of-error` | n, CL, p -> ±E | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C09 · Discrete Mathematics, Combinatorics and Number Theory

`Entries: 20` · `Brief topic(s): 9, 10` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-DIS-01 Counting** permutations `P(n,r)=n!/(n-r)!`; combinations `C(n,r)=n!/(r!(n-r)!)`;
  with repetition `C(n+r-1,r)`. Use log-gamma or iterative products — direct factorials
  overflow IEEE-754 doubles at 171!.
- **F-DIS-02 Divisibility** `gcd(a,b)` by Euclid; `lcm = |ab|/gcd`; prime factorisation by
  trial division to sqrt(n) is adequate only for n below the stated bound (state it).
- **F-DIS-03 Modular arithmetic** `modpow` by square-and-multiply so results stay exact in
  BigInt; modular inverse exists iff gcd(a,m)=1.
- **F-DIS-04 Sequences** arithmetic `a_n = a_1+(n-1)d`; geometric `a_n = a_1 r^(n-1)`;
  sum forms differ and both must guard r=1.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0136` | Permutations | `permutations` | n, r -> P(n,r) | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0137` | Combinations | `combinations` | n, r -> C(n,r) | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0138` | Combinations with Repetition | `combinations-repetition` | n, r -> C(n+r-1,r) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0139` | Factorial | `factorial` | n -> n! | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0140` | Multinomial Coefficient | `multinomial` | group sizes -> count | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0141` | GCD and LCM | `gcd-lcm` | 2+ integers -> gcd, lcm | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0142` | Prime Factorisation | `prime-factorisation` | integer -> factors, exponents | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0143` | Primality Test | `primality-test` | integer -> prime? | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0144` | Primes in a Range | `primes-in-range` | limit -> prime list, count | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0145` | Divisor Count and Sum | `divisors-count` | integer -> τ(n), σ(n) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0146` | Euler Totient | `euler-totient` | n -> φ(n) | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0147` | Modular Exponentiation | `modular-exponentiation` | base, exp, mod -> result | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0148` | Modular Inverse | `modular-inverse` | a, m -> a^-1 mod m | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0149` | Integer Division and Remainder | `integer-division` | a, b -> q, r | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0150` | Arithmetic Sequence | `arithmetic-sequence` | a1, d, n -> a_n, sum | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0151` | Geometric Sequence | `geometric-sequence` | a1, r, n -> a_n, sum | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0152` | Fibonacci Sequence | `fibonacci` | n -> F(n), list | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0153` | Catalan Number | `catalan` | n -> C_n | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0154` | Derangements | `derangements` | n -> !n | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0155` | Power Set Size | `power-set-size` | set size -> subsets | `REF-MATH-ELEM` | 1 | P2 | `R` |

### C10 · Interest, Time Value of Money and Discounting

`Entries: 20` · `Brief topic(s): 11` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-FIN-01 Simple interest** `I = P·r·t` with t in years; simple discount uses
  `P = F/(1+rt)`. Only valid when interest is not capitalised.
- **F-FIN-02 Compound interest** `FV = P(1+r/m)^(mt)`; continuous `FV = Pe^(rt)`;
  effective annual rate `EAR = (1+r/m)^m - 1`, continuous `EAR = e^r - 1`.
- **F-FIN-03 Annuities** ordinary `FV = PMT[((1+i)^n - 1)/i]`,
  `PV = PMT[(1-(1+i)^-n)/i]`; annuity-due multiplies by (1+i); `i=0` is a removable
  singularity that must be special-cased or the formula divides by zero.
- **F-FIN-04 NPV/IRR** `NPV = Σ CF_t/(1+r)^t`; IRR solves NPV=0 by iteration and may have
  multiple roots when cash flows change sign more than once — report all roots in range.
- **F-FIN-05 Fisher relation** real return `(1+r_nom)/(1+π) - 1`, not `r_nom - π` (that is
  only an approximation, accurate to ~1% when rates are low).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0156` | Simple Interest | `simple-interest` | P, r, t -> interest, total | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0157` | Compound Interest | `compound-interest` | P, r, compounding, t -> FV | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0158` | Continuous Compounding | `continuous-compounding` | P, r, t -> FV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0159` | Effective Annual Rate | `effective-annual-rate` | nominal, m -> EAR | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0160` | Nominal Rate Converter | `nominal-rate-converter` | EAR <-> nominal | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0161` | Future Value of Lump Sum | `future-value-lumpsum` | PV, r, n -> FV | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0162` | Present Value of Lump Sum | `present-value-lumpsum` | FV, r, n -> PV | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0163` | Future Value of Annuity | `annuity-future-value` | PMT, r, n -> FV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0164` | Present Value of Annuity | `annuity-present-value` | PMT, r, n -> PV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0165` | Annuity Payment | `annuity-payment` | PV, r, n -> PMT | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0166` | Perpetuity Present Value | `perpetuity-present-value` | PMT, r -> PV | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0167` | Growing Perpetuity | `growing-perpetuity` | PMT, r, g -> PV | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0168` | Annuity Due | `annuity-due` | PMT, r, n -> FV, PV | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0169` | Net Present Value | `npv` | cash flows, discount rate -> NPV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0170` | Internal Rate of Return | `irr` | cash flows -> IRR | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0171` | CAGR | `cagr` | begin, end, years -> CAGR | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0172` | Doubling Time | `doubling-time` | growth rate -> exact t, rule of 72 | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0173` | Real Return (Fisher) | `real-return` | nominal, inflation -> real | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0174` | Inflation-Adjusted Value | `inflation-adjusted-value` | amount, rate, years -> real | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0175` | Discount Factor | `discount-factor` | rate, period -> DF, PV | `REF-MATH-ELEM` | 1 | P1 | `R` |

### C11 · Loans, Amortisation and Credit

`Entries: 20` · `Brief topic(s): 12` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-LOAN-01 Amortising payment** `PMT = P·i/(1-(1+i)^-n)` where `i = APR/12` is the
  monthly periodic rate. The nominal-APR-to-periodic-rate convention differs by jurisdiction
  (US nominal APR/12 vs EU effective/compounded) — the calculator must state which it uses.
- **F-LOAN-02 Amortisation table** each row: interest = balance·i; principal = PMT - interest;
  balance' = balance - principal. Final payment must be truncated to clear the balance exactly
  (floating-point residue otherwise leaves ±1 cent).
- **F-LOAN-03 APR vs flat rate** flat (add-on) rate applies interest to the original principal
  for the full term, so a 5% flat rate ≈ 1.8× the true annual cost at 60 months. Converting
  flat -> APR requires solving for the rate that amortises the same payment.
- **F-LOAN-04 US APR disclosure** follows Reg Z Appendix J: actuarial method, unit-period rules,
  APR = unit-period rate × unit-periods per year. Any calculator labelled "APR (US Reg Z)" must
  implement Appendix J, not an approximation.
- **F-LOAN-05 Affordability** DTI = total monthly debt / gross monthly income; thresholds are
  lender-specific and must not be presented as approval criteria.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0176` | Loan Payment | `loan-payment` | principal, rate, term -> PMT | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0177` | Amortisation Schedule | `amortisation-schedule` | loan -> per-period table | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0178` | Total Interest Paid | `total-interest-paid` | loan -> total interest | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0179` | Loan Payoff with Extra Payments | `extra-payment-payoff` | loan, extra -> months saved | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0180` | Biweekly Payment | `biweekly-payment` | loan -> biweekly, savings | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0181` | Balloon Payment Loan | `balloon-payment` | loan, balloon -> PMT, final | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0182` | Interest-Only Payment | `interest-only-payment` | principal, rate -> monthly | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0183` | Credit Card Payoff Time | `credit-card-payoff` | balance, APR, payment -> months | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0184` | Minimum Payment Payoff | `minimum-payment-time` | balance, APR, %min -> months, interest | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0185` | APR from Fees | `apr-from-fees` | amount, fees, schedule -> APR | `REF-MATH-ELEM` | 3 | P2 | `S` |
| `CALC-0186` | APR to Periodic Rate | `apr-periodic-rate` | APR, frequency -> monthly rate | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0187` | Add-On Interest Rate | `add-on-interest` | principal, flat rate, term -> payment, true APR | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0188` | Flat vs Reducing Balance | `flat-vs-reducing` | loan terms -> cost comparison | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0189` | Loan Affordability (DTI) | `loan-affordability` | income, debts -> max payment | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0190` | Debt Snowball | `debt-snowball` | debts, extra -> payoff order, date | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0191` | Debt Avalanche | `debt-avalanche` | debts, extra -> interest saved | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0192` | Student Loan Repayment | `student-loan-payment` | balance, rate, plan -> payment | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0193` | Auto Lease Payment | `auto-lease-payment` | cap cost, residual, money factor -> PMT | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0194` | HELOC Payment | `heloc-payment` | draw, rate, period -> payment | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0195` | Prepayment Penalty Cost | `prepayment-penalty` | balance, penalty -> cost | `REF-MATH-ELEM` | 1 | P2 | `R` |

**Review notes for this category**

- `CALC-0185` **APR from Fees** — Anchored on CFPB Reg Z App. J method; full numeric solver still to be validated.

### C12 · Mortgages and Property Finance

`Entries: 16` · `Brief topic(s): 21` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MTG-01 P&I** uses F-LOAN-01 with monthly compounding; PITI adds property tax,
  homeowner insurance and (if applicable) mortgage insurance, each with its own basis
  (annual/12, loan-to-value dependent).
- **F-MTG-02 PMI** conventional US mortgage insurance is typically required above 80% LTV and
  removable at 78-80% LTV by servicer/statute; the rate is credit- and program-specific, so the
  calculator must expose the rate as an input, not invent one.
- **F-MTG-03 Refinance break-even** `months = total closing costs / monthly saving`; ignores
  term extension, which changes total interest even when the payment falls.
- **F-MTG-04 Points** one point = 1% of loan amount; break-even months = cost / monthly saving.
- **F-MTG-05 Rent vs buy** requires an opportunity-cost assumption, holding period and
  transaction costs; output must be labelled a model, not advice.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0196` | Mortgage Payment (P&I) | `mortgage-payment` | loan, rate, term -> monthly P&I | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0197` | Mortgage Payment with Taxes and Insurance | `mortgage-piti` | loan + tax + ins + PMI -> PITI | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0198` | PMI Cost | `pmi-cost` | loan, LTV, rate -> monthly PMI | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0199` | Loan-to-Value Ratio | `ltv` | loan, value -> LTV% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0200` | Combined LTV | `cltv` | first, second lien, value -> CLTV | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0201` | Home Affordability | `home-affordability` | income, debts, rate -> max price | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0202` | Refinance Break-Even | `refinance-breakeven` | costs, payment saving -> months | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0203` | Refinance Lifetime Savings | `refinance-savings` | old/new loan -> total saving | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0204` | Cash-Out Refinance | `cash-out-refinance` | value, LTV, balance -> cash available | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0205` | Mortgage Points Break-Even | `mortgage-points` | points, rate change -> months | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0206` | ARM Payment Reset | `arm-reset` | balance, new rate, remaining -> new PMT | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0207` | Mortgage Payoff Date | `mortgage-payoff-date` | loan, extra -> payoff date | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0208` | Extra Principal Savings | `extra-principal-savings` | loan, extra -> interest saved | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0209` | Rent vs Buy | `rent-vs-buy` | rent, price, horizon -> comparison | `REF-MATH-ELEM` | 4 | P2 | `X` |
| `CALC-0210` | Closing Costs Estimate | `closing-costs` | price, rate, fees -> total cash | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0211` | Down Payment Calculator | `down-payment` | price, LTV -> cash needed | `REF-MATH-ELEM` | 1 | P0 | `R` |

**Review notes for this category**

- `CALC-0209` **Rent vs Buy** — Assumption-heavy model; requires editorial review of default assumptions.

### C13 · Investments, Returns and Portfolio Analysis

`Entries: 25` · `Brief topic(s): 13` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-INV-01 Holding period return** `HPR = (End - Begin + Income)/Begin`; annualise with
  `(1+HPR)^(1/years) - 1`. Do not annualise a sub-year return by simple multiplication without
  saying so.
- **F-INV-02 Risk-adjusted** Sharpe `(Rp - Rf)/σp` (σ of excess returns), Sortino uses
  downside deviation, Treynor uses beta. Their inputs are not interchangeable.
- **F-INV-03 CAPM** `E(R) = Rf + β(E(Rm) - Rf)`; beta from regression of asset on market
  returns. WACC `= E/V·Re + D/V·Rd(1-T)`.
- **F-INV-04 Bonds** price `= Σ C/(1+y)^t + F/(1+y)^n`; YTM by root-finding; Macaulay duration
  `= Σ t·PV(CF_t)/Price`, modified duration `= D/(1+y/f)`. Clean vs dirty price and day-count
  convention (30/360, ACT/365) must be stated.
- **F-INV-05 Fee drag** a 1% annual fee compounds: over 30 years it removes ~26% of terminal
  value at 7% gross — calculators must compound fees, not subtract them once.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0212` | Return on Investment | `roi` | gain, cost -> ROI% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0213` | Holding Period Return | `holding-period-return` | begin, end, income -> HPR | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0214` | Annualised Return | `annualized-return` | HPR, years -> CAGR | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0215` | Sharpe Ratio | `sharpe-ratio` | returns, Rf -> Sharpe | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0216` | Sortino Ratio | `sortino-ratio` | returns, target -> Sortino | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0217` | Beta | `beta` | asset, market returns -> β | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0218` | Jensen Alpha | `jensen-alpha` | returns, β, market -> α | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0219` | Maximum Drawdown | `max-drawdown` | price series -> MDD, dates | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0220` | Portfolio Expected Return | `portfolio-expected-return` | weights, returns -> E(R) | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0221` | Two-Asset Portfolio Variance | `portfolio-variance-2asset` | weights, σ, ρ -> σp | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0222` | CAPM Required Return | `capm` | Rf, β, Rm -> E(R) | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0223` | WACC | `wacc` | E, D, Re, Rd, tax -> WACC | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0224` | Dividend Yield | `dividend-yield` | dividend, price -> yield% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0225` | Gordon Growth Model | `gordon-growth` | D1, r, g -> value | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0226` | Price-to-Earnings Ratio | `pe-ratio` | price, EPS -> P/E | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0227` | PEG Ratio | `peg-ratio` | P/E, growth -> PEG | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0228` | Earnings Per Share | `eps` | net income, shares -> EPS | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0229` | Return on Equity | `roe` | net income, equity -> ROE% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0230` | Bond Price | `bond-price` | face, coupon, y, n -> price | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0231` | Bond Yield to Maturity | `ytm` | price, coupon, n -> YTM | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0232` | Current Yield | `current-yield` | coupon, price -> yield% | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0233` | Macaulay Duration | `macaulay-duration` | cash flows, y -> duration | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0234` | Modified Duration | `modified-duration` | Macaulay, y, f -> modified | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0235` | Dollar-Cost Averaging | `dollar-cost-averaging` | contribution, prices -> shares, avg | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0236` | Portfolio Rebalance Trade | `rebalancing-trade` | holdings, targets -> trades | `REF-MATH-ELEM` | 3 | P2 | `R` |

### C14 · Retirement and Pension Planning

`Entries: 12` · `Brief topic(s): 14` · `Priorities present: P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-RET-01 Accumulation** `FV = PMT[((1+i)^n-1)/i] + PV(1+i)^n` with real or nominal
  returns, stated explicitly. Withdrawal phase is the same formula solved for PMT.
- **F-RET-02 Safe withdrawal** the 4% rule is a historical US result for a 30-year horizon with
  a specific asset mix; it is a planning heuristic, not a guarantee, and must be labelled so.
- **F-RET-03 US Social Security PIA** verified against SSA for 2027 eligibility:
  `0.90·min(AIME,1340) + 0.32·clamp(AIME,1340,8077) + 0.15·max(AIME-8077,0)`, then rounded
  DOWN to the next lower $0.10. Bend points are indexed each year and depend on the year of
  first eligibility, not the claim year.
- **F-RET-04 RMD** `balance / IRS Uniform Lifetime Table factor(age)`; table version and tax
  year must be shown.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0237` | Retirement Savings Goal | `retirement-savings-goal` | income need, years -> corpus | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0238` | Retirement Corpus Projection | `retirement-corpus-projection` | contributions, return -> FV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0239` | Safe Withdrawal Rate Test | `safe-withdrawal-4pct` | corpus, rate, years -> sustainability | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-0240` | Pension Lump Sum vs Annuity | `pension-lumpsum-vs-annuity` | lump, annuity, rate -> comparison | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0241` | Annuity Payout | `annuity-payout` | premium, rate, term -> income | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0242` | US Social Security PIA (2027) | `ss-pia` | AIME, eligibility year -> PIA | `REF-MATH-ELEM` | 3 | P1 | `S` |
| `CALC-0243` | Social Security Claim Age Benefit | `ss-claim-age` | PIA, claim age -> benefit | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0244` | Employer Match Optimiser | `employer-match` | salary, match formula -> free money | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0245` | Retirement Age Solver | `retirement-age-solver` | savings, target income -> earliest age | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0246` | Inflation-Adjusted Retirement Income | `inflation-adjusted-income` | today income, years, CPI -> future | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0247` | Required Minimum Distribution | `rmd` | balance, age -> RMD | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0248` | Retirement Income Gap | `retirement-income-gap` | needs, sources -> shortfall | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0239` **Safe Withdrawal Rate Test** — Historical heuristic; assumptions must be user-visible.
- `CALC-0242` **US Social Security PIA (2027)** — Formula and bend points verified on ssa.gov (2027 table); annual refresh required.
- `CALC-0243` **Social Security Claim Age Benefit** — Reduction/increase factors vary by birth year; needs SSA table.

### C15 · Accounting and Bookkeeping

`Entries: 17` · `Brief topic(s): 15` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ACC-01 Straight-line depreciation** `(cost - salvage)/life`; declining balance
  `opening_book_value · (rate/life)` with the rate stated (e.g. 2.0 for double declining);
  switch to straight line when it is larger. Sum-of-years `(cost-salvage)·(n-k+1)/S`.
- **F-ACC-02 Margins** gross `(revenue-COGS)/revenue`; operating adds opex; net adds
  interest and tax. All are ratios of revenue and must not be mixed.
- **F-ACC-03 Liquidity** current `CA/CL`; quick `(CA - inventory - prepaid)/CL`.
- **F-ACC-04 Turnover and DSO** inventory turnover `COGS/avg inventory`;
  DSO `= AR/revenue×days`; cash conversion cycle `= DIO + DSO - DPO`.
  Tax depreciation (e.g. MACRS) is a separate statutory schedule and is not interchangeable
  with book depreciation.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0249` | Straight-Line Depreciation | `depreciation-straight-line` | cost, salvage, life -> annual | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0250` | Declining Balance Depreciation | `depreciation-declining-balance` | cost, rate, life -> schedule | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0251` | Sum-of-Years-Digits Depreciation | `depreciation-sum-of-years` | cost, salvage, life -> schedule | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0252` | Units-of-Production Depreciation | `depreciation-units` | cost, units -> per-unit | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0253` | Intangible Amortisation | `intangible-amortisation` | cost, life -> annual | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0254` | Gross Margin | `gross-margin` | revenue, COGS -> GM% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0255` | Operating Margin | `operating-margin` | revenue, opex -> OM% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0256` | Net Margin | `net-margin` | revenue, net income -> NM% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0257` | Current Ratio | `current-ratio` | current assets/liabilities -> ratio | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0258` | Quick Ratio | `quick-ratio` | cash, AR, CL -> acid test | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0259` | Debt-to-Equity Ratio | `debt-to-equity` | liabilities, equity -> D/E | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0260` | Inventory Turnover | `inventory-turnover` | COGS, avg inventory -> turns | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0261` | Receivables Turnover and DSO | `receivables-turnover` | revenue, AR, days -> turns, DSO | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0262` | Cash Conversion Cycle | `cash-conversion-cycle` | DIO, DSO, DPO -> CCC | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0263` | Working Capital | `working-capital` | current assets/liabilities -> WC | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0264` | Break-Even Units | `break-even-units` | fixed cost, price, VC -> units | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0265` | Break-Even Revenue | `break-even-revenue` | fixed cost, CM% -> revenue | `REF-MATH-ELEM` | 2 | P1 | `R` |

### C16 · Business Pricing, Margin and Profitability

`Entries: 17` · `Brief topic(s): 16` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-PRC-01 Markup vs margin** markup is on cost, margin on price:
  `margin = markup/(1+markup)`; `markup = margin/(1-margin)`. Confusing them is the single
  most common pricing error; the calculator must show both.
- **F-PRC-02 Discount stacking** successive discounts multiply: `net = 1 - Π(1-d_i)`;
  20%+10% is 28% off, not 30%.
- **F-PRC-03 Break-even with contribution** `Q* = FC/(P - VC)`; requires `P > VC`; if
  `P ≤ VC` the answer is "no break-even", not a negative or infinite quantity.
- **F-PRC-04 Price elasticity** `E = (%ΔQ)/(%ΔP)`; revenue rises with a price cut only when
  `|E| > 1`. Revenue-maximising price is not profit-maximising — margin must be included.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0266` | Markup Calculator | `markup` | cost, markup% -> price, profit | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0267` | Margin Calculator | `margin` | price, cost -> margin% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0268` | Markup to Margin Converter | `markup-margin-converter` | markup% <-> margin% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0269` | Cost-Plus Price | `cost-plus-price` | cost, overhead, margin -> price | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0270` | Target-Margin Price | `target-margin-price` | cost, target margin -> price | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0271` | Discount Price | `discount-price` | price, discount% -> sale price | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0272` | Double Discount | `double-discount` | price, d1, d2 -> net price | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0273` | Contribution Margin per Unit | `contribution-margin-unit` | price, VC -> CM | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0274` | Price Elasticity of Revenue | `price-elasticity-revenue` | elasticity, price change -> revenue | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0275` | Price Increase Impact | `price-increase-impact` | volume, price, elasticity -> profit | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0276` | Wholesale to Retail Price | `wholesale-retail-price` | cost, channel margins -> retail | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0277` | Margin Chain (Multi-Tier) | `margin-chain` | tier margins -> cumulative | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0278` | Commission-Based Price | `commission-price` | cost, commission% -> price | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0279` | Minimum Viable Price | `minimum-price` | cost, fees, target profit -> floor | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0280` | Unit Economics | `unit-economics` | revenue, variable, CAC -> contribution | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0281` | Gross Profit | `gross-profit` | revenue, COGS -> GP | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0282` | Net Profit | `net-profit` | revenue, all costs -> NP | `REF-MATH-ELEM` | 1 | P0 | `R` |

### C17 · Taxation

`Entries: 18` · `Brief topic(s): 17` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TAX-01 Sales tax / VAT (single stage)** `tax = price × rate`; tax-inclusive reverse
  `base = total/(1+rate)`. Rates are jurisdiction- and date-specific: store them as versioned
  data, never hard-code one country's rate into the component.
- **F-TAX-02 Progressive income tax** bracket walk:
  `tax = Σ_j rate_j × max(0, min(income, top_j) - bottom_j)`; the marginal rate is the top
  bracket touched, the effective rate is tax/income. Deductions apply to the base before the
  walk. Verified 2026 US single thresholds (10% to $12,400; 12% to $50,400; 22% to $105,700;
  24% to $201,775; 32% to $256,225; 35% to $640,600; 37% above) from IRS IR-2025-103.
- **F-TAX-03 Capital gains** holding period determines short- vs long-term treatment; the
  statutory split and rates differ by jurisdiction and by income.
- **F-TAX-04 Never present a tax output as advice.** Every tax page requires: jurisdiction
  selector or fixed-jurisdiction label, effective tax year, source URL, last-reviewed date.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0283` | Sales Tax | `sales-tax` | price, rate -> tax, total | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0284` | VAT Inclusive Price | `vat-inclusive` | net, rate -> gross | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0285` | VAT Exclusive Price | `vat-exclusive` | gross, rate -> net, VAT | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0286` | Reverse Tax (From Total) | `reverse-tax` | total, rate -> base, tax | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0287` | Progressive Income Tax (Generic) | `progressive-income-tax` | income, brackets -> tax | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0288` | US Federal Income Tax 2026 | `us-federal-income-tax` | income, filing status -> tax | `REF-MATH-ELEM` | 3 | P1 | `S` |
| `CALC-0289` | US Self-Employment Tax | `self-employment-tax` | net earnings -> SE tax | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0290` | US Corporate Income Tax | `corporate-income-tax` | taxable income -> tax | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0291` | Capital Gains Tax | `capital-gains-tax` | proceeds, basis, holding -> tax | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0292` | Dividend Tax | `dividend-tax` | dividends, bracket -> tax | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0293` | Property Tax | `property-tax` | assessed value, mill rate -> annual | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0294` | Import Duty | `import-duty` | value, duty rate, freight -> duty | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0295` | Excise Tax | `excise-tax` | quantity, specific rate -> tax | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0296` | Marginal vs Effective Rate | `marginal-effective-rate` | income, brackets -> both | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0297` | After-Tax Return | `after-tax-return` | return, tax rate -> net | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0298` | Tax Withholding Estimate | `withholding-estimate` | wage, W-4 params -> withholding | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0299` | VAT Recovery | `vat-recovery` | input VAT, output VAT -> recoverable | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0300` | Stamp Duty / Transfer Tax | `stamp-duty` | price, jurisdiction -> duty | `REF-MATH-ELEM` | 2 | P2 | `X` |

**Review notes for this category**

- `CALC-0288` **US Federal Income Tax 2026** — Bracket thresholds verified on irs.gov IR-2025-103 (TY2026); standard deduction verified.
- `CALC-0298` **Tax Withholding Estimate** — US W-4 algorithm changes frequently; needs SSA/IRS Pub 15-T validation.
- `CALC-0300` **Stamp Duty / Transfer Tax** — Regional and banded; jurisdiction table required before publication.

### C18 · Payroll, Salary and Compensation

`Entries: 18` · `Brief topic(s): 76` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-PAY-01 FLSA overtime (US)** verified on dol.gov: non-exempt employees receive
  1.5× the regular rate for hours over 40 in a fixed 168-hour workweek; averaging across weeks
  is not permitted; the regular rate includes non-discretionary bonuses (so a blended rate may
  apply), which is why a blended-rate calculator is a distinct tool.
- **F-PAY-02 Conversions** annual = hourly × hours/week × 52 (state the 52-week convention);
  monthly = annual/12; biweekly = annual/26 (not /24). A 4-week month is a different (and
  wrong) convention that must be offered only as an explicitly labelled variant.
- **F-PAY-03 Net pay** gross − statutory deductions − voluntary deductions; deduction order and
  rounding rules are payroll-system specific and must be shown.
- **F-PAY-04 Employer cost** gross + employer contributions (social insurance, pension,
  insurance); not the same as employee gross cost.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0301` | Gross Pay from Hours | `gross-pay-hourly` | hours, rate -> gross | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0302` | FLSA Overtime Pay | `overtime-flsa` | hours, rate -> regular + OT | `REF-MATH-ELEM` | 2 | P0 | `S` |
| `CALC-0303` | Blended Overtime Rate | `overtime-blended-rate` | base, bonus, hours -> blended OT | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0304` | Salary to Hourly | `salary-to-hourly` | annual, hours/week -> hourly | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0305` | Hourly to Salary | `hourly-to-salary` | hourly, hours -> annual | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0306` | Pay Period Converter | `pay-period-converter` | any frequency -> all | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0307` | Net Pay | `net-pay` | gross, deductions -> net | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0308` | FICA Payroll Tax | `fica-payroll-tax` | wages -> employee/employer | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0309` | Take-Home Pay | `take-home-pay` | salary, state, allowances -> net | `REF-MATH-ELEM` | 4 | P1 | `X` |
| `CALC-0310` | Bonus Tax | `bonus-tax` | bonus, method -> net | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0311` | Commission Pay | `commission-pay` | sales, rate, tier -> pay | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0312` | Shift Differential | `shift-differential` | hours, base, differential -> pay | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0313` | PTO Accrual | `pto-accrual` | rate, hours worked -> balance | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0314` | PTO Payout | `pto-payout` | balance, rate -> payout | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0315` | Severance Pay | `severance-pay` | tenure, salary, policy -> amount | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0316` | Final Paycheck | `final-paycheck` | hours, PTO, deductions -> total | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0317` | Pay Raise | `pay-raise` | current, raise% -> new pay | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0318` | Employer Cost of Employee | `employer-cost` | salary, contributions -> total cost | `REF-MATH-ELEM` | 2 | P1 | `R` |

**Review notes for this category**

- `CALC-0302` **FLSA Overtime Pay** — 40-hour/1.5× rule verified on dol.gov; state premium-pay rules are separate.
- `CALC-0309` **Take-Home Pay** — Requires jurisdiction-specific withholding tables.

### C19 · Economics and Business Analytics

`Entries: 13` · `Brief topic(s): 18` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ECO-01 Inflation** `CPI ratio`: `rate = (CPI_t/CPI_{t-1} - 1)×100`; purchasing power
  `PP = amount × CPI_base/CPI_current`. CPI is an index with a base period and a basket — state
  the series and base year.
- **F-ECO-02 Elasticity** `E = (ΔQ/Q)/(ΔP/P)`; use the midpoint (arc) form for large changes:
  `E = (ΔQ/((Q1+Q2)/2))/(ΔP/((P1+P2)/2))`.
- **F-ECO-03 Surplus** consumer `∫(D(p)-p*)`, approximated for linear demand by
  `½×base×height`; state the linearity assumption.
- **F-ECO-04 GDP** expenditure identity `Y = C + I + G + (X - M)`; growth is real (deflated),
  not nominal.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0319` | Inflation Rate (CPI) | `inflation-rate` | CPI values -> rate | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0320` | Real Wage | `real-wage` | nominal wage, CPI -> real | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0321` | Purchasing Power | `purchasing-power` | amount, CPI -> equivalent | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0322` | Price Index | `price-index` | basket, base year -> index | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0323` | Demand Elasticity (Arc) | `demand-elasticity` | P1,P2,Q1,Q2 -> E | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0324` | Supply Elasticity | `supply-elasticity` | P1,P2,Q1,Q2 -> E | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0325` | Consumer Surplus | `consumer-surplus` | demand line, price -> surplus | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0326` | Producer Surplus | `producer-surplus` | supply line, price -> surplus | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0327` | GDP Growth Rate | `gdp-growth` | GDP series -> growth% | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0328` | Unemployment Rate | `unemployment-rate` | labour force data -> rate | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0329` | PPP Conversion | `ppp-conversion` | amount, PPP ratio -> equivalent | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0330` | Currency Conversion | `currency-conversion` | amount, rate -> converted | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0331` | Fiscal Multiplier Effect | `multiplier-effect` | injection, MPC -> total impact | `REF-MATH-ELEM` | 2 | P3 | `R` |

**Review notes for this category**

- `CALC-0330` **Currency Conversion** — Static rate input only; live FX requires a licensed data feed.

### C20 · Marketing and Advertising Metrics

`Entries: 17` · `Brief topic(s): 19` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-MKT-01 Cost metrics** CPM `= cost/impressions×1000`; CPC `= cost/clicks`;
  CPA `= cost/conversions`. Each is a ratio with a different denominator — never convert
  between them without impressions, clicks and conversions.
- **F-MKT-02 Funnel** CTR `= clicks/impressions`; CVR `= conversions/clicks`;
  end-to-end `= conversions/impressions = CTR×CVR`.
- **F-MKT-03 Unit economics** CAC `= total S&M spend / new customers`;
  LTV (simple) `= ARPU × gross margin × average lifetime`; LTV:CAC is a ratio, not a currency.
- **F-MKT-04 Churn and retention** churn `= lost customers / starting customers` over a stated
  period; retention `= 1 - churn` only for that same period and cohort definition.
- **F-MKT-05 Break-even ROAS** `= 1/gross margin`. At 40% margin, break-even ROAS is 2.5.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0332` | CPM | `cpm` | cost, impressions -> CPM | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0333` | CPC | `cpc` | cost, clicks -> CPC | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0334` | CPA | `cpa` | cost, conversions -> CPA | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0335` | CTR | `ctr` | clicks, impressions -> CTR% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0336` | Conversion Rate | `conversion-rate` | conversions, visits -> CVR% | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0337` | ROAS | `roas` | revenue, ad spend -> ROAS | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0338` | Marketing ROI | `marketing-roi` | gross profit, spend -> ROI% | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0339` | Customer Acquisition Cost | `cac` | spend, new customers -> CAC | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0340` | Customer Lifetime Value | `customer-lifetime-value` | ARPU, margin, lifetime -> LTV | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0341` | LTV to CAC Ratio | `ltv-cac-ratio` | LTV, CAC -> ratio | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0342` | Churn Rate | `churn-rate` | lost, starting -> churn% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0343` | Retention Rate | `retention-rate` | cohort -> retention% | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0344` | MRR and ARR | `mrr-arr` | subscribers, price -> MRR, ARR | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0345` | ARPU | `arpu` | revenue, users -> ARPU | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0346` | Break-Even ROAS | `breakeven-roas` | margin -> ROAS needed | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0347` | Funnel Conversion | `funnel-conversion` | stage counts -> rates | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0348` | Ad Budget from Target CPA | `ad-budget-cpa` | target CPA, volume -> budget | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C21 · E-commerce and Online Selling

`Entries: 13` · `Brief topic(s): 20` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ECM-01 Post-fee profit** `net = price - COGS - referral fee - fulfilment - payment fee
  - ad cost`. Marketplace fees are category- and region-specific percentages plus fixed
  per-order components; they must be user inputs with sourced defaults, not invented constants.
- **F-ECM-02 Landed cost** `= goods + freight + duty + insurance + handling`; duty depends on
  HS code and origin (jurisdiction-specific).
- **F-ECM-03 Break-even units with ad spend** `Q* = (FC + ad spend)/(price - variable cost)`.
- **F-ECM-04 Free-shipping threshold** choose the order value where contribution after
  shipping still meets the target margin.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0349` | Marketplace Fee Profit | `marketplace-fee-profit` | price, fees -> net profit | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0350` | Landed Cost | `landed-cost` | goods, freight, duty -> total | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0351` | Dropshipping Margin | `dropshipping-margin` | price, supplier, fees -> margin | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0352` | Break-Even Units with Ad Spend | `breakeven-units-ads` | FC, ads, CM -> units | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0353` | Discount Profit Impact | `discount-profit-impact` | price, discount, cost -> profit | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0354` | Bundle Pricing | `bundle-pricing` | component prices -> bundle price | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0355` | Free Shipping Threshold | `free-shipping-threshold` | AOV, shipping, margin -> threshold | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0356` | Return Rate Cost | `return-rate-cost` | returns, shipping -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0357` | Coupon Stacking | `coupon-stacking` | coupons -> effective discount | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0358` | Unit Price Comparison | `unit-price-comparison` | packages -> price per unit | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0359` | Psychological Price Rounding | `price-rounding` | price, strategy -> rounded | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0360` | Digital Goods VAT | `digital-vat` | price, buyer country -> VAT | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0361` | Product Cost Markup for Marketplaces | `product-cost-markup` | target net, fees -> list price | `REF-MATH-ELEM` | 3 | P2 | `R` |

**Review notes for this category**

- `CALC-0360` **Digital Goods VAT** — Place-of-supply rules differ per jurisdiction (EU OSS, UK, GCC).

### C22 · Real Estate and Property Investment

`Entries: 16` · `Brief topic(s): 21` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-RE-01 Income metrics** NOI `= gross rent - vacancy - operating expenses` (excludes debt
  service and capex); cap rate `= NOI/price`; cash-on-cash `= pre-tax cash flow/cash invested`.
  These are different denominators and are frequently conflated.
- **F-RE-02 Rule-of-thumb filters** the 1% rule (monthly rent ≥ 1% of price) and 70% rule
  (offer ≤ 0.70×ARV − repairs) are screening heuristics from US investor practice, not
  valuation methods — label them.
- **F-RE-03 Flip profit** `= ARV - purchase - rehab - holding - selling costs - financing`;
  holding cost must include taxes, insurance, utilities and interest.
- **F-RE-04 Proration** for lease/closing splits use actual days in the month
  (`daily = monthly/days_in_month`) — the 30-day convention is a different, jurisdiction-specific
  rule and must be selected explicitly.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0362` | Cap Rate | `cap-rate` | NOI, price -> cap rate | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0363` | Net Operating Income | `noi` | rent, vacancy, opex -> NOI | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0364` | Gross Rent Multiplier | `gross-rent-multiplier` | price, gross rent -> GRM | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0365` | Cash-on-Cash Return | `cash-on-cash-return` | cash flow, invested -> CoC% | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0366` | Rental Yield | `rental-yield` | rent, price, costs -> gross/net yield | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0367` | Vacancy-Adjusted Income | `vacancy-adjusted-income` | gross rent, vacancy% -> effective | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0368` | Rental Cash Flow | `rental-cash-flow` | rent, expenses, debt -> cash flow | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0369` | Property ROI | `property-roi` | cash flow, appreciation, equity -> ROI | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0370` | Fix-and-Flip Profit | `flip-profit` | ARV, costs -> profit | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0371` | 70% Rule Maximum Offer | `seventy-percent-rule` | ARV, repairs -> max offer | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0372` | 1% Rule Screen | `one-percent-rule` | rent, price -> pass/fail | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0373` | Rent Increase | `rent-increase` | current, % -> new rent | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0374` | Agent Commission | `agent-commission` | price, rate, split -> commission | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0375` | Lease Proration | `lease-proration` | rent, move dates -> prorated amount | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0376` | Security Deposit Interest | `security-deposit` | deposit, rate, months -> interest | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0377` | Leveraged Property Return | `leverage-roi` | equity, mortgage -> levered return | `REF-MATH-ELEM` | 3 | P2 | `R` |

### C23 · Construction Materials and Quantity Takeoff

`Entries: 25` · `Brief topic(s): 22` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-CON-01 Volume** `V = L×W×D` with unit consistency; slab volume in m³ then convert to
  bags/yards using the supplier's yield. Waste factor `×(1+w)` is a user input (typical 5-10%),
  never a hidden constant.
- **F-CON-02 Concrete mix** by mass or volume per a stated mix design (e.g. 1:2:4 cement:sand:
  aggregate). Nominal mixes are NOT the same as designed mixes to a strength standard; the tool
  must say which. Dry-volume method: `cement bags = V_dry × cement_fraction / bag_yield`.
- **F-CON-03 Rebar** unit mass `= (d²/162) kg/m` for steel in mm (derived from π/4·d²·7850);
  total `= count × length × unit mass × (1+lap%)`.
- **F-CON-04 Masonry** bricks per m² depends on brick + mortar joint size:
  `n = 1/((l+j)(h+j))`; always expose joint thickness.
- **F-CON-05 Paint/coverage** `litres = area × coats / coverage_per_litre`; coverage is a
  manufacturer property (state product assumption), and porosity/primer changes it.
- **F-CON-06 Roofing** one "square" = 100 sq ft (US) — a unit that must be converted explicitly
  for metric users.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0378` | Concrete Volume | `concrete-volume` | L, W, D, waste -> m3/yd3 | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0379` | Concrete Weight | `concrete-weight` | volume, density -> mass | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0380` | Concrete Mix Ratio | `concrete-mix-ratio` | volume, mix ratio -> cement/sand/aggregate | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0381` | Cement Bags Required | `cement-bags` | volume, mix -> bags | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0382` | Rebar Quantity | `rebar-quantity` | spacing, area -> bars, length | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0383` | Rebar Weight | `rebar-weight` | diameter, length, count -> mass | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0384` | Brick Quantity | `brick-quantity` | wall area, brick, joint -> count | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0385` | Mortar Quantity | `mortar-quantity` | brickwork volume -> mortar | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0386` | Concrete Block Quantity | `block-quantity` | wall area, block size -> count | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0387` | Plaster Quantity | `plaster-quantity` | area, thickness -> cement, sand | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0388` | Paint Coverage | `paint-coverage` | area, coats, coverage -> litres | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0389` | Tile Count | `tile-count` | area, tile size, waste -> tiles, boxes | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0390` | Tile Adhesive and Grout | `tile-adhesive-grout` | area, trowel, joint -> kg | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0391` | Drywall Sheets | `drywall-sheets` | area, sheet size -> sheets, screws | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0392` | Insulation Quantity | `insulation-quantity` | area, R-value, product -> rolls | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0393` | Asphalt Tonnage | `asphalt-tonnage` | area, depth, density -> tonnes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0394` | Aggregate Tonnage | `aggregate-tonnage` | volume, bulk density -> tonnes | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0395` | Sand Volume | `sand-volume` | area, depth, compaction -> m3 | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0396` | Screed Material | `screed-material` | area, thickness, mix -> cement, sand | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0397` | Water-Cement Ratio | `water-cement-ratio` | cement mass, ratio -> water | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0398` | Formwork Plywood | `formwork-plywood` | concrete area, reuse -> sheets | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0399` | Roofing Squares | `roofing-squares` | area -> squares, bundles | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0400` | Shingle Bundles | `shingle-bundles` | roof area, waste -> bundles | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0401` | Excavation Volume | `excavation-volume` | L, W, D, swell -> loose volume | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0402` | Backfill Volume | `backfill-volume` | excavation, structure -> fill, compaction | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C24 · Architecture, Building Geometry and Interiors

`Entries: 17` · `Brief topic(s): 23, 24` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ARC-01 Areas** built-up vs carpet vs super built-up differ by wall thickness and common-
  area loading factor; the loading factor is a local convention and must be an input.
- **F-ARC-02 FAR/FSI** `FAR = total floor area / plot area`; permissible FAR is a zoning rule,
  not a calculation — the tool computes the achieved value and compares with a user-entered limit.
- **F-ARC-03 Stairs** comfort rule `2R + T = 600-640 mm` (Blondel-based practice, stated as a
  design guideline); stringer length `= sqrt(rise² + run²)` per flight.
- **F-ARC-04 Wall area** net = gross − openings; openings must be subtracted before paint/tile
  quantities to avoid systematic over-ordering.
- **F-ARC-05 Ventilation** `ACH = Q/V` where Q is supply/extract volume flow per hour; required
  ACH values for a space type come from local building codes or ASHRAE 62.1 (licensed).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0403` | Floor Area Calculator | `floor-area` | dimensions -> area, perimeter | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0404` | Carpet vs Built-Up Area | `carpet-vs-builtup` | carpet area, loading -> built-up | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0405` | FAR / FSI | `far-fsi` | plot, floor areas -> FAR | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0406` | Plot Coverage | `plot-coverage` | footprint, plot -> coverage% | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0407` | Room Volume | `room-volume` | L, W, H -> volume, air changes | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0408` | Staircase Rise and Run | `staircase-rise-run` | floor height, riser -> treads, run | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0409` | Stair Stringer Length | `stair-stringer` | rise, run -> stringer, angle | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0410` | Ramp Slope Compliance | `ramp-slope` | rise, run -> slope, ratio | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0411` | Net Wall Area | `wall-area-openings` | gross wall, openings -> net | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0412` | Wallpaper Rolls | `wallpaper-rolls` | wall area, roll, repeat -> rolls | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0413` | Curtain Fabric Quantity | `curtain-fabric` | window, fullness, drop -> metres | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0414` | Flooring Wastage | `flooring-wastage` | area, pattern, waste -> order qty | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0415` | Skirting Length | `skirting-length` | room perimeter, openings -> metres | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0416` | False Ceiling Area | `false-ceiling-area` | room, border -> area, tiles | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0417` | Ceiling Height Clearance | `ceiling-height` | floor height, services -> clear height | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0418` | Fenestration Ratio | `fenestration-ratio` | window area, floor area -> ratio | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-0419` | Room Air Changes | `room-ach` | flow, volume -> ACH | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C25 · Civil and Structural Engineering

`Entries: 20` · `Brief topic(s): 25` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CIV-01 Statics** simply supported UDL: `M_max = wL²/8`, `V_max = wL/2`; cantilever UDL:
  `M = wL²/2`. These are linear-elastic, small-deflection, prismatic-section results only.
- **F-CIV-02 Section properties** rectangle `I = bh³/12`, `S = bh²/6`; circle `I = πd⁴/64`.
  Deflection of a simply supported UDL beam at midspan: `5wL⁴/(384EI)`.
- **F-CIV-03 Bearing** `q = P/A`; allowable bearing pressure is a geotechnical determination,
  never a calculator output — the tool compares demand with a user-supplied allowable.
- **F-CIV-04 Regulatory design (LRFD/ASD, wind, seismic, snow, rebar detailing, pavement
  thickness) requires licensed standards** (ASCE 7, ACI 318, AISC 360, AASHTO, Eurocodes).
  Licensed text is not reproduced here; these entries are marked SPECIALIST_REVIEW_REQUIRED
  and must not be published as design tools without a chartered engineer's sign-off and a
  licensed copy of the code. Output must be labelled "preliminary estimate, not design".
- **F-CIV-05 Soil** Rankine active pressure `Ka = (1-sin φ)/(1+sin φ)`, `p = Ka·γ·z` —
  valid for dry, cohesionless backfill and horizontal surface only.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0420` | Soil Bearing Pressure | `soil-bearing-pressure` | load, footing area -> pressure | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0421` | Footing Size | `footing-size` | load, allowable bearing -> area, side | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0422` | Column Axial Load | `column-axial-load` | tributary area, load -> kN | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0423` | Simply Supported Beam Moment | `beam-moment-udl` | w, L -> M, V | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0424` | Cantilever Beam Moment | `cantilever-moment` | w, L -> M, V | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0425` | Beam Shear Force | `beam-shear` | loads, supports -> V diagram | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0426` | Beam Deflection | `beam-deflection` | w, L, E, I -> δ | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0427` | Slab Thickness Rule of Thumb | `slab-thickness` | span, support -> thickness | `REF-MATH-ELEM` | 2 | P3 | `X` |
| `CALC-0428` | Rebar Area Required | `rebar-area-required` | moment, fy, d -> As | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0429` | Cube to Cylinder Strength | `cube-cylinder-strength` | cube MPa -> cylinder MPa | `REF-MATH-ELEM` | 1 | P3 | `X` |
| `CALC-0430` | Rankine Earth Pressure | `rankine-earth-pressure` | φ, γ, H -> Ka, p, force | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0431` | Retaining Wall Stability | `retaining-wall-stability` | geometry, loads -> FS overturning/sliding | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0432` | Wind Load (ASCE 7) | `wind-load` | velocity, exposure, height -> pressure | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0433` | Snow Load | `snow-load` | ground snow, exposure -> roof load | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0434` | LRFD Load Combination | `load-combination-lrfd` | dead, live, wind -> factored | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0435` | Pile Capacity | `pile-capacity` | skin friction, end bearing -> capacity | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0436` | Pavement Thickness (AASHTO) | `pavement-thickness` | ESAL, soil, materials -> thickness | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0437` | ESAL Traffic Loading | `esal-traffic` | axle loads, counts -> ESAL | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0438` | Concrete Curing Time | `concrete-curing` | mix, temperature -> strength gain | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0439` | Trench Excavation Safety | `trench-excavation` | depth, soil -> benching requirement | `REF-MATH-ELEM` | 2 | P3 | `X` |

**Review notes for this category**

- `CALC-0427` **Slab Thickness Rule of Thumb** — Span/depth ratios are code-specific (ACI/Eurocode); licensed reference needed.
- `CALC-0428` **Rebar Area Required** — Requires ACI 318 / Eurocode 2 provisions and licensed access.
- `CALC-0429` **Cube to Cylinder Strength** — Conversion factor is code- and region-specific; must cite the code.
- `CALC-0431` **Retaining Wall Stability** — Requires geotechnical input and code factors.
- `CALC-0432` **Wind Load (ASCE 7)** — Licensed standard; coefficients not reproduced.
- `CALC-0433` **Snow Load** — Code-specific (ASCE 7 Ch.7 / EN 1991-1-3).
- `CALC-0434` **LRFD Load Combination** — Combination sets are code-specific and change by edition.
- `CALC-0435` **Pile Capacity** — Geotechnical specialist review mandatory.
- `CALC-0436` **Pavement Thickness (AASHTO)** — AASHTO guide is licensed; equations not reproduced.
- `CALC-0439` **Trench Excavation Safety** — OSHA 1926 Subpart P soil classification rules apply.

### C26 · Mechanical Engineering and Machine Design

`Entries: 20` · `Brief topic(s): 26` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MEC-01 Newtonian mechanics** `F = ma`, `W = mg` with `g = 9.80665 m/s²` (exact, NIST
  SP 811 App. B.8); torque `T = F·r`; rotational power `P = T·ω`, `ω = 2πn/60`.
- **F-MEC-02 Transmission** gear ratio `= N_driven/N_driver = ω_in/ω_out`; belt speed
  `v = πDn/60`; pulley pairs `n1D1 = n2D2` (ideal, no slip).
- **F-MEC-03 Machine elements** bearing life `L10 = (C/P)^p × 10⁶ rev` (p=3 ball, 10/3 roller);
  spring rate `k = Gd⁴/(8D³N)`; bolt torque `T = K·F·d` with K a friction factor (0.2 typical,
  must be an input, not a constant).
- **F-MEC-04 Section properties** `I`, `Z`, radius of gyration `r = sqrt(I/A)`;
  Euler buckling `P_cr = π²EI/(KL)²` — valid only in the elastic range and with stated K.
- **F-MEC-05 Thermal expansion** `ΔL = α·L·ΔT`; α is material-specific and temperature-dependent.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0440` | Force Calculator | `force-newton` | mass, acceleration -> force | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0441` | Torque Calculator | `torque` | force, radius -> torque | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0442` | Rotational Power | `rotational-power` | torque, rpm -> power | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0443` | Gear Ratio | `gear-ratio` | teeth, rpm -> ratio, output rpm | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0444` | Belt and Pulley Speed | `belt-pulley-speed` | diameters, rpm -> speeds | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0445` | Bearing Life L10 | `bearing-life` | C, P, speed -> hours | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0446` | Spring Rate | `spring-rate` | wire, coil, turns, G -> k | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0447` | Bolt Tightening Torque | `bolt-torque` | preload, diameter, K -> torque | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0448` | Friction Force | `friction-force` | normal, μ -> friction | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0449` | Inclined Plane | `inclined-plane` | mass, angle, μ -> forces | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0450` | Lever Mechanical Advantage | `mechanical-advantage` | arms -> MA, force | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0451` | Pulley System Advantage | `pulley-system` | ropes -> MA, effort | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0452` | Area Moment of Inertia | `area-moment-inertia` | shape, dims -> I | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0453` | Section Modulus | `section-modulus` | shape, dims -> S | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0454` | Thermal Expansion | `thermal-expansion` | L, α, ΔT -> ΔL | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0455` | Natural Frequency | `natural-frequency` | k, m -> fn | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0456` | Shaft Critical Speed | `critical-speed` | E, I, m, L -> rpm | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0457` | Flywheel Energy | `flywheel-energy` | I, rpm -> energy | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0458` | Motor Torque and Slip | `motor-slip` | sync speed, rpm, power -> T, slip | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0459` | Hoist Capacity | `hoist-capacity` | load, reeving, efficiency -> required | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C27 · Electrical Engineering and Power Systems

`Entries: 22` · `Brief topic(s): 27` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ELE-01 DC** `V = IR`, `P = VI = I²R = V²/R`; series `R = ΣR_i`; parallel
  `1/R = Σ1/R_i`.
- **F-ELE-02 AC single phase** `P = VI·cos φ` (real), `S = VI` (apparent), `Q = VI·sin φ`;
  power-factor correction `Qc = P(tan φ1 - tan φ2)`.
- **F-ELE-03 Three phase** `P = √3·V_LL·I·cos φ`; the √3 arises from line-to-line vs phase
  voltage and must not be used for single-phase circuits.
- **F-ELE-04 Voltage drop** single phase `ΔV = 2LI(R cos φ + X sin φ)` (go and return);
  three phase `ΔV = √3LI(...)`. Conductor resistance depends on temperature and material.
- **F-ELE-05 Ampacity, breaker sizing and earthing are governed by licensed codes** (NEC/
  NFPA 70, IEC 60364, BS 7671). Tables are not reproduced; calculators expose the table value
  as a user input or licensed-data dependency and are marked SPECIALIST_REVIEW_REQUIRED.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0460` | Ohm's Law | `ohms-law` | any 2 of V,I,R -> third | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0461` | DC Power | `dc-power` | V, I, R -> P | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0462` | Three-Phase Power | `three-phase-power` | V, I, PF -> kW, kVA, kVAR | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0463` | Power Factor Correction | `power-factor-correction` | kW, PF1, PF2 -> kVAR | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0464` | Voltage Drop Single Phase | `voltage-drop-single-phase` | current, length, cable -> ΔV | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0465` | Voltage Drop Three Phase | `voltage-drop-three-phase` | current, length, cable -> ΔV | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0466` | Wire Ampacity Selection | `wire-ampacity` | load, insulation, method -> size | `REF-MATH-ELEM` | 4 | P1 | `X` |
| `CALC-0467` | Cable Resistance | `cable-resistance` | material, area, length, temp -> R | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0468` | Energy Consumption kWh | `energy-consumption-kwh` | watts, hours, days -> kWh | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0469` | Electricity Cost | `electricity-cost` | kWh, tariff, tiers -> bill | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0470` | Breaker Sizing | `breaker-sizing` | load, continuous factor -> breaker | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-0471` | Transformer kVA | `transformer-kva` | load kW, PF, margin -> kVA | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0472` | Motor Full-Load Current | `motor-flc` | kW, voltage, PF, eff -> FLC | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0473` | Motor Efficiency | `motor-efficiency` | input, output -> η, losses | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0474` | Star-Delta Conversion | `star-delta-conversion` | impedances -> equivalent | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0475` | Resistors in Series and Parallel | `resistors-series-parallel` | network -> Req | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0476` | Capacitors in Series and Parallel | `capacitors-series-parallel` | network -> Ceq | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0477` | Impedance of RLC | `impedance-rlc` | R, L, C, f -> Z, phase | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0478` | Resonant Frequency | `resonant-frequency` | L, C -> f0 | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0479` | RMS and Peak Values | `rms-value` | waveform -> RMS, peak, avg | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0480` | Transformer Turns Ratio | `turns-ratio` | turns, voltages -> ratio | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0481` | Earthing Resistance | `earthing-resistance` | rod, soil, config -> R | `REF-MATH-ELEM` | 4 | P3 | `X` |

**Review notes for this category**

- `CALC-0466` **Wire Ampacity Selection** — Code tables (NEC/IEC) licensed; inputs must come from a cited table edition.
- `CALC-0470` **Breaker Sizing** — Continuous-load 125% rule is code-specific.
- `CALC-0481` **Earthing Resistance** — Depends on soil model and code; specialist review.

### C28 · Electronics and Circuit Analysis

`Entries: 20` · `Brief topic(s): 28` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ELX-01 Dividers** voltage `Vout = Vin·R2/(R1+R2)` (unloaded); loading effect changes it,
  so the load resistance must be an input when significant. Current divider
  `I1 = Itot·R2/(R1+R2)` for two parallel resistors.
- **F-ELX-02 RC/RL** time constant `τ = RC` or `L/R`; charge `V(t) = V∞(1-e^{-t/τ})`;
  cutoff `f_c = 1/(2πRC)`.
- **F-ELX-03 Op-amp** inverting `Av = -Rf/Rin`; non-inverting `Av = 1 + Rf/R1`; these ignore
  bandwidth and slew limits.
- **F-ELX-04 LED resistor** `R = (Vs - Vf)/If`; power `P = If²R` — both must be reported.
- **F-ELX-05 dB** `dB = 20log10(V2/V1) = 10log10(P2/P1)`; using 10log for voltage is a common
  factor-of-two error.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0482` | Voltage Divider | `voltage-divider` | Vin, R1, R2 -> Vout | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0483` | Current Divider | `current-divider` | Itot, resistors -> branch currents | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0484` | LED Series Resistor | `led-resistor` | Vs, Vf, If -> R, power | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0485` | RC Time Constant | `rc-time-constant` | R, C -> τ, charge curve | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0486` | RL Time Constant | `rl-time-constant` | R, L -> τ | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0487` | LC Resonance | `lc-resonance` | L, C -> f0, Q | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0488` | Op-Amp Gain | `opamp-gain` | config, resistors -> Av | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0489` | Transistor Bias | `transistor-bias` | Vcc, Rb, Rc, β -> Q-point | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0490` | Rectifier Ripple | `rectifier-ripple` | C, load, f -> ripple | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0491` | Zener Regulator | `zener-regulator` | Vin, Vz, load -> Rs, current | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0492` | PCB Trace Width | `pcb-trace-width` | current, rise, copper -> width | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0493` | Resistor Colour Code | `resistor-colour-code` | bands -> value, tolerance | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0494` | Capacitor Code | `capacitor-code` | 3-digit code -> value | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0495` | RC Filter Cutoff | `filter-cutoff` | R, C -> fc, response | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0496` | Gain in Decibels | `gain-db` | ratio -> dB | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0497` | Signal-to-Noise Ratio | `snr` | signal, noise -> SNR dB | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0498` | NE555 Timer | `ne555-timer` | R, C -> frequency, duty | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0499` | PWM Duty Cycle | `pwm-duty` | on time, period -> duty%, avg V | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0500` | ADC Resolution | `adc-resolution` | bits, Vref -> LSB, codes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0501` | Pull-Up Resistor | `pullup-resistor` | bus capacitance, speed -> R range | `REF-MATH-ELEM` | 2 | P3 | `R` |

**Review notes for this category**

- `CALC-0492` **PCB Trace Width** — Based on IPC-2221 charts; licensed reference required before publish.

### C29 · Chemical Engineering and Process Calculations

`Entries: 12` · `Brief topic(s): 29` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CHE-01 Material balance** steady state: `Σin = Σout + accumulation(=0)`; conversion
  `X = (F_in - F_out)/F_in`; selectivity `= desired/(undesired produced)`.
- **F-CHE-02 Reactor sizing** CSTR `V = F_A0·X/(-r_A)`; PFR `V = F_A0∫dX/(-r_A)`;
  space time `τ = V/v0`.
- **F-CHE-03 Gas laws** ideal `PV = nRT` (R = 8.314462618 J/(mol·K), exact in SI);
  van der Waals `(P + a n²/V²)(V - nb) = nRT` — coefficients are substance-specific and must be
  tabulated, not invented.
- **F-CHE-04 Psychrometry** humidity ratio `W = 0.621945·p_w/(P - p_w)`; enthalpy of moist air
  `h = 1.006T + W(2501 + 1.86T)` (kJ/kg dry air, ASHRAE formulation — licensed handbook).
- **F-CHE-05 Yield** `%yield = actual/theoretical×100`; limiting reagent determined by
  `min(n_i/ν_i)`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0502` | Reactor Residence Time | `reactor-residence-time` | volume, flow -> τ | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0503` | Conversion and Selectivity | `conversion-selectivity` | in/out flows -> X, S | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0504` | Steady-State Mass Balance | `mass-balance` | streams -> unknown flow | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0505` | Mole Fraction and Partial Pressure | `mole-fraction-partial-pressure` | composition, P -> p_i | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0506` | Ideal Gas Law | `ideal-gas-law` | P,V,T,n -> unknown | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0507` | Van der Waals Gas | `van-der-waals` | P,V,T, a, b -> state | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0508` | Psychrometric Humidity Ratio | `humidity-ratio` | T, RH, P -> W | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0509` | Moist Air Enthalpy | `moist-air-enthalpy` | T, W -> h | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0510` | Distillation Material Balance | `distillation-balance` | feed, compositions -> products | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0511` | Crystallisation Yield | `crystallisation-yield` | feed, solubility, temp -> yield | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0512` | Drying Rate | `drying-rate` | moisture, air, area -> rate | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0513` | Blending Composition | `blending-composition` | streams -> blend | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0508` **Psychrometric Humidity Ratio** — ASHRAE formulation; handbook licensed.
- `CALC-0509` **Moist Air Enthalpy** — ASHRAE formulation; handbook licensed.

### C30 · Fluid Mechanics and Hydraulics

`Entries: 16` · `Brief topic(s): 30` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-FLU-01 Continuity** `Q = A·v`; in a filled pipe `v1A1 = v2A2`.
- **F-FLU-02 Reynolds** `Re = ρvD/μ = vD/ν`; laminar `<2300`, transitional 2300-4000,
  turbulent `>4000` (values are convention, not physics constants).
- **F-FLU-03 Head loss** Darcy-Weisbach `h_f = f(L/D)(v²/2g)`; Colebrook
  `1/√f = -2log10(ε/(3.7D) + 2.51/(Re√f))` solved iteratively (Swamee-Jain is an explicit
  approximation with ~1% error — state it). Hazen-Williams `h_f = 10.67 L Q^1.852/(C^1.852 D^4.87)`
  (SI, water at ~20 °C) is empirical and material-specific.
- **F-FLU-04 Pump power** hydraulic `P_h = ρgQH`; shaft `P_s = P_h/η`.
- **F-FLU-05 Hydrostatics** `p = ρgh`; buoyancy `F = ρ_fluid·g·V_displaced`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0514` | Flow Rate from Area and Velocity | `flow-rate-av` | A, v -> Q | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0515` | Reynolds Number | `reynolds-number` | ρ, v, D, μ -> Re, regime | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0516` | Darcy-Weisbach Head Loss | `darcy-weisbach` | f, L, D, v -> h_f | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0517` | Hazen-Williams Head Loss | `hazen-williams` | Q, C, D, L -> h_f | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0518` | Manning Equation | `manning-equation` | n, R, S -> velocity, Q | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0519` | Colebrook Friction Factor | `colebrook-friction-factor` | Re, ε/D -> f | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0520` | Bernoulli Equation | `bernoulli` | p, v, z at 2 points -> unknown | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0521` | Pump Power | `pump-power` | Q, H, η -> kW | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0522` | Pump Head | `pump-head` | pressure rise, ρ -> head | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0523` | Pipe Volume | `pipe-volume` | D, L -> volume, fill time | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0524` | Pipe Diameter Sizing | `pipe-diameter-sizing` | Q, v_max -> D | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0525` | Orifice Flow | `orifice-flow` | area, Δp, Cd -> Q | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0526` | Rectangular Weir Flow | `rectangular-weir` | head, width -> Q | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0527` | Hydrostatic Pressure | `hydrostatic-pressure` | depth, ρ -> p | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0528` | Buoyancy | `buoyancy` | volume, ρ -> force, draft | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0529` | Terminal Velocity | `terminal-velocity` | mass, area, Cd, ρ -> v_t | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C31 · Thermodynamics and Heat Transfer

`Entries: 18` · `Brief topic(s): 31` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-THT-01 Conduction** 1-D steady `q = kAΔT/L`; plane wall resistance `R = L/(kA)`;
  cylindrical `R = ln(r2/r1)/(2πkL)`.
- **F-THT-02 Convection** Newton `q = hAΔT`; h is empirical and depends on geometry and flow —
  it must be an input or derived from a cited correlation with its validity range.
- **F-THT-03 Radiation** `q = εσA(T_s⁴ - T_surr⁴)` with σ = 5.670374419e-8 W/(m²·K⁴) and
  T in kelvin (using °C is a physically wrong but common bug).
- **F-THT-04 HX** LMTD `ΔT_lm = (ΔT1-ΔT2)/ln(ΔT1/ΔT2)`; if ΔT1 = ΔT2 use the limit = ΔT1.
- **F-THT-05 HVAC sizing** 1 ton of refrigeration = 12,000 Btu/h = 3.5168528421 kW;
  cooling-load estimates are approximations and must be labelled, with a room-by-room
  Manual J-type calculation distinguished from a rule-of-thumb.
- **F-THT-06 COP and Carnot** `COP_R = Q_c/W`; `COP_Carnot = T_c/(T_h - T_c)` in kelvin —
  an upper bound, never achievable.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0530` | Fourier Conduction | `conduction-fourier` | k, A, ΔT, L -> q | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0531` | Newton Convection | `convection-newton` | h, A, ΔT -> q | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0532` | Stefan-Boltzmann Radiation | `radiation-stefan` | ε, A, T -> q | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0533` | Log Mean Temperature Difference | `lmtd` | inlet/outlet temps -> LMTD | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0534` | Overall Heat Transfer Coefficient | `overall-heat-transfer` | resistances -> U | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0535` | Heat Exchanger Area | `heat-exchanger-area` | Q, U, LMTD -> A | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0536` | Sensible Heat | `sensible-heat` | mass, cp, ΔT -> energy | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0537` | Latent Heat | `latent-heat` | mass, h_fg -> energy | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0538` | HVAC Tonnage Sizing | `hvac-tonnage` | area, climate, insulation -> tons | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0539` | U-Value and R-Value | `u-value-r-value` | layers -> U, R | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0540` | Refrigeration COP | `cop-refrigeration` | Q_c, W -> COP | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0541` | Carnot Efficiency | `carnot-efficiency` | T_hot, T_cold -> η, COP | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0542` | Cooling Load Estimate | `cooling-load-simple` | area, occupancy, equipment -> kW | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0543` | Duct Sizing | `duct-sizing` | CFM, velocity -> duct size | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0544` | Pipe Insulation Thickness | `pipe-insulation` | ΔT, k, h -> thickness | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0545` | Specific Heat Energy | `specific-heat-energy` | m, c, ΔT -> Q | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0546` | Thermal Expansion of Fluids | `fluid-thermal-expansion` | V, β, ΔT -> ΔV | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0547` | Heat Pump Balance Point | `heat-pump-balance` | capacity curve, load -> balance | `REF-MATH-ELEM` | 4 | P3 | `R` |

**Review notes for this category**

- `CALC-0538` **HVAC Tonnage Sizing** — Rule-of-thumb sizing; must be labelled approximate.

### C32 · Manufacturing, Production and OEE

`Entries: 16` · `Brief topic(s): 32` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MFG-01 OEE** `OEE = Availability × Performance × Quality` where
  `A = runtime/planned time`, `P = (ideal cycle × units)/runtime`,
  `Q = good units/total units`. OEE is multiplicative — averaging the three components or
  adding them is invalid and produces >100% results.
- **F-MFG-02 Takt** `= available time/customer demand`; cycle time is a measured process value
  and is not interchangeable with takt.
- **F-MFG-03 Little's law** `WIP = throughput × flow time`; applies to stable systems only.
- **F-MFG-04 Line balance** efficiency `= Σ task times/(stations × cycle time)`.
- **F-MFG-05 Capacity** `= units/hour × available hours × OEE`; planned vs available time must
  be separated from downtime.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0548` | OEE | `oee` | availability, performance, quality -> OEE | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0549` | Availability Rate | `availability-rate` | runtime, planned time -> A% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0550` | Performance Rate | `performance-rate` | ideal cycle, units, runtime -> P% | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0551` | Quality Rate | `quality-rate` | good, total units -> Q% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0552` | Takt Time | `takt-time` | available time, demand -> takt | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0553` | Cycle Time and Throughput | `cycle-time` | time per unit -> units/hour | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0554` | Production Capacity | `production-capacity` | rate, hours, OEE -> units | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0555` | Capacity Utilisation | `capacity-utilisation` | actual, capacity -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0556` | Production Yield | `production-yield` | good, started -> yield% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0557` | Scrap Rate | `scrap-rate` | scrap, produced -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0558` | Labour Productivity | `labour-productivity` | output, labour hours -> units/hr | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0559` | Machine Hour Rate | `machine-hour-rate` | costs, hours -> rate | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0560` | Standard Cost | `standard-cost` | material, labour, overhead -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0561` | Line Balance Efficiency | `line-balance-efficiency` | task times, stations -> % | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0562` | Little's Law WIP | `little-law-wip` | throughput, flow time -> WIP | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0563` | Kanban Size | `kanban-size` | demand, lead time, container -> cards | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C33 · Cutting Stock, Nesting and Optimisation

`Entries: 12` · `Brief topic(s): 33` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CUT-01 1-D cutting stock** minimise stock length used for a demand list; first-fit
  decreasing is a heuristic with a known worst case (`FFD ≤ 11/9·OPT + 6/9`), not an optimum.
  The tool must state that the plan is heuristic and show the lower bound.
- **F-CUT-02 Kerf** every cut consumes blade width: usable length must be reduced by
  `(pieces-1)×kerf`; ignoring kerf systematically under-orders material.
- **F-CUT-03 2-D nesting** rectangle bin packing is NP-hard; report used area, waste % and the
  shelf/guillotine algorithm used. Do not present an approximate nesting as optimal.
- **F-CUT-04 Yield** `yield% = used area/length ÷ purchased × 100`; offcut value is
  `offcut area × unit price × resale factor`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0564` | 1-D Cutting Stock Planner | `cutting-stock-1d` | stock length, piece list -> cut plan | `REF-MATH-ELEM` | 4 | P2 | `R` |
| `CALC-0565` | 2-D Sheet Nesting Estimator | `sheet-nesting-2d` | sheet, rectangles -> layout, waste | `REF-MATH-ELEM` | 4 | P2 | `R` |
| `CALC-0566` | Cut List Waste | `cut-list-waste` | pieces, stock -> waste% | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0567` | Kerf Compensation | `kerf-compensation` | pieces, kerf -> extra length | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0568` | Rebar Cutting Plan | `rebar-cutting-plan` | bar length, demands -> plan | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0569` | Pipe Cutting Plan | `pipe-cutting-plan` | stock, lengths -> plan | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0570` | Plank Cut Optimiser | `plank-cut-plan` | boards, parts -> plan | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0571` | Coil Slitting Plan | `coil-slitting-plan` | coil width, slits -> plan | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0572` | Sheet Count from Area | `sheet-count-from-area` | area, sheet size, waste -> sheets | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0573` | Offcut Inventory Value | `offcut-value` | offcuts, price -> value | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0574` | Cutting Yield Percentage | `cutting-yield` | used, purchased -> yield% | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0575` | Number of Cuts Required | `cuts-required` | pieces, stock -> cuts, time | `REF-MATH-ELEM` | 1 | P2 | `R` |

### C34 · Glass Manufacturing and Glazing

`Entries: 14` · `Brief topic(s): 34` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-GLS-01 Weight** `mass = area × thickness × density`; soda-lime glass density
  ≈2500 kg/m³, so 1 m² of 6 mm glass ≈ 15 kg. Density varies by glass type — expose it.
- **F-GLS-02 Cutting yield** `yield% = Σ piece areas / sheet area × 100`, minus kerf/edge trim;
  glass cannot be re-joined, so offcut value is only realised if a future order uses it.
- **F-GLS-03 Structural glazing** thickness selection for wind load and deflection follows
  ASTM E1300 / EN 16612, which are licensed and involve load-duration factors — SPECIALIST
  REVIEW REQUIRED. Never compute "required thickness" from area alone and present it as safe.
- **F-GLS-04 U-value** IGU centre-of-glass `U ≈ (1/U1 + 1/U2)⁻¹` ignoring gas and frame;
  whole-window Uw requires frame and spacer data (EN 14351-1 / NFRC).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0576` | Glass Weight | `glass-weight` | area, thickness, density -> kg | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0577` | Glass Area and Cost | `glass-area-cost` | dimensions, rate -> area, price | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0578` | Glass Thickness Selection | `glass-thickness-selection` | area, wind load -> nominal | `REF-MATH-ELEM` | 4 | P1 | `X` |
| `CALC-0579` | Glass Cutting Yield | `glass-cutting-yield` | sheet, pieces -> yield% | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0580` | Glass Cutting Optimiser | `glass-cutting-optimiser` | sheet sizes, pieces -> plan | `REF-MATH-ELEM` | 4 | P2 | `R` |
| `CALC-0581` | Mirror Size and Cost | `mirror-size-cost` | dimensions, edgework -> price | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0582` | IGU U-Value | `igu-u-value` | pane U, gap, gas -> centre U | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0583` | Glass Deflection Check | `glass-deflection` | thickness, span, load -> deflection | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0584` | Glazing Wind Load | `glazing-wind-load` | velocity, height, exposure -> pressure | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0585` | Glass Edgework Cost | `glass-edgework-cost` | perimeter, finish -> cost | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0586` | Glass Offcut Value | `glass-offcut-value` | offcuts, rate -> value | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0587` | Shower Panel Sizing | `shower-panel-size` | opening, clearance -> panel dims | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0588` | Glass Balustrade Load | `glass-balustrade-load` | height, line load -> moment | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0589` | Laminated vs Tempered Cost | `laminated-vs-tempered` | area, options -> cost, properties | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0578` **Glass Thickness Selection** — ASTM E1300 / EN 16612 licensed; requires engineer sign-off.
- `CALC-0583` **Glass Deflection Check** — ASTM E1300 procedure; licensed standard.
- `CALC-0584` **Glazing Wind Load** — ASCE 7 / EN 1991-1-4 coefficients required.
- `CALC-0588` **Glass Balustrade Load** — Requires structural engineer; code line loads vary.

### C35 · Woodworking, Joinery and Timber

`Entries: 12` · `Brief topic(s): 35` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-WDW-01 Board foot** (US/Canada) `bf = t(in)×w(in)×L(ft)/12`; a "board foot" is a volume,
  not an area, and metric users need m³ conversion.
- **F-WDW-02 Sheet goods** `sheets = ceil(area/sheet area × (1+waste))`; panel thickness and
  nominal vs actual dimensions differ (a "3/4 inch" plywood is 18 mm-ish, not 19.05 mm).
- **F-WDW-03 Moisture movement** dimensional change is anisotropic:
  `ΔL ≈ L × (MC2 - MC1) × coefficient` with different coefficients for tangential, radial and
  longitudinal directions — a single shrinkage number is wrong.
- **F-WDW-04 Span tables** joist/rafter sizes come from species-grade-span tables (e.g. IRC
  R502, EN 338/1995); they are code documents and cannot be approximated by a formula.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0590` | Board Feet | `board-feet` | thickness, width, length, qty -> bf | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0591` | Lumber Weight | `lumber-weight` | volume, species density, MC -> kg | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0592` | Plywood Sheet Count | `plywood-sheets` | area, sheet, waste -> sheets | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0593` | Timber Beam Size | `timber-beam-size` | span, load -> section (table) | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0594` | Wood Moisture Shrinkage | `wood-shrinkage` | MC change, dimension -> Δdim | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0595` | Decking Board Count | `decking-boards` | deck area, board, gap -> boards | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0596` | Fence Picket Count | `fence-pickets` | run, picket, gap -> pickets, rails | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0597` | Screw and Nail Quantity | `screw-nail-quantity` | area, spacing -> fasteners | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0598` | Stain and Finish Coverage | `stain-coverage` | area, coats, coverage -> litres | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0599` | Cabinet Cut List | `cabinet-cut-list` | carcass dims -> parts list | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0600` | Lumber Cost per Board Foot | `lumber-cost-boardfoot` | price, dims -> cost | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0601` | Wood Glue Coverage | `glue-coverage` | joint area -> grams | `REF-MATH-ELEM` | 1 | P3 | `R` |

**Review notes for this category**

- `CALC-0593` **Timber Beam Size** — Requires span tables (IRC/EN); not a formula.

### C36 · Metal Fabrication and Machining

`Entries: 16` · `Brief topic(s): 36` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MET-01 Mass of steel sections** plate `m = L×W×t×ρ` (ρ = 7850 kg/m³ for carbon steel);
  pipe `m = π(D-t)t·L·ρ`; the widely used `d²/162` kg/m for rebar is the same identity with
  ρ = 7850 and d in mm.
- **F-MET-02 Bend allowance** `BA = θ(π/180)(R + K·T)` with θ in degrees, K the K-factor
  (0.33-0.50 depending on R/T and material) — K must be an input, not a constant.
  Bend deduction `BD = 2(R+T)tan(θ/2) - BA`.
- **F-MET-03 Speeds and feeds** `n = 1000·Vc/(πD)` rpm with Vc in m/min (surface speed);
  feed rate `vf = fz·z·n`.
- **F-MET-04 Welding** heat input `HI = (V·I·60)/(1000·TS)` kJ/mm; consumable mass depends on
  joint geometry and deposition efficiency.
- **F-MET-05 Hardness conversion** (HRC/HV/HB) is empirical and standard-specific (ASTM E140);
  conversions are not exact and must not be extrapolated.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0602` | Steel Plate Weight | `steel-plate-weight` | L, W, t, ρ -> kg | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0603` | Pipe Weight | `pipe-weight` | OD, wall, length -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0604` | Sheet Metal Weight | `sheet-metal-weight` | gauge, dims, ρ -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0605` | Bend Allowance | `bend-allowance` | angle, R, T, K -> BA | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0606` | Bend Deduction | `bend-deduction` | angle, R, T, K -> BD | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0607` | Flat Pattern Development | `flat-pattern` | bends, dims -> flat length | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0608` | Weld Consumable Quantity | `weld-consumable` | joint, length, efficiency -> kg | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0609` | Weld Heat Input | `weld-heat-input` | V, I, travel speed -> kJ/mm | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0610` | Cutting Speed (RPM) | `cutting-speed-rpm` | Vc, diameter -> rpm | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0611` | Machining Time | `machining-time` | length, feed, passes -> minutes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0612` | Drilling Time | `drilling-time` | depth, feed, rpm -> minutes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0613` | Metal Cost Estimate | `metal-cost` | mass, rate, waste -> cost | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0614` | Hardness Conversion | `hardness-conversion` | HRC/HV/HB -> equivalent | `REF-MATH-ELEM` | 2 | P3 | `X` |
| `CALC-0615` | Press Tonnage | `press-tonnage` | perimeter, thickness, shear -> tons | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0616` | Springback Estimate | `springback` | R/T, material -> angle | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0617` | Galvanising Zinc Weight | `galvanizing-zinc` | area, coating class -> kg | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0614` **Hardness Conversion** — ASTM E140 tables are licensed; conversions are empirical.

### C37 · Textile, Fabric and Garment Production

`Entries: 15` · `Brief topic(s): 37` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TEX-01 Areal density** `GSM = mass(g)/area(m²)`; `oz/yd² = GSM/33.906`.
- **F-TEX-02 Yarn count** Ne (cotton) `= 590.5/tex`; Nm `= 1000/tex`; denier `= 9×tex`.
  These are reciprocal systems — converting by multiplication is a common defect.
- **F-TEX-03 Fabric consumption per garment** `= Σ(pattern area) × (1+waste) × GSM`;
  marker efficiency `= garment area/marker area`.
- **F-TEX-04 Thread consumption** is stitch-type dependent (301 lockstitch ≠ 504 overlock);
  ratios must be sourced per stitch class, not guessed.
- **F-TEX-05 Shrinkage** `% = (before-after)/before×100`; apply to pattern dimensions BEFORE
  costing, and state the test method (e.g. ISO 6330).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0618` | Fabric GSM | `fabric-gsm` | mass, area -> GSM, oz/yd² | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0619` | Yarn Count Conversion | `yarn-count-conversion` | Ne/Nm/tex/denier -> all | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0620` | Fabric Weight for Garment | `fabric-weight` | consumption, GSM -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0621` | Fabric Consumption per Garment | `fabric-consumption-garment` | pattern, width, waste -> metres | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0622` | Marker Efficiency | `marker-efficiency` | garment area, marker -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0623` | Thread Consumption | `thread-consumption` | seam length, stitch -> metres | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0624` | Stitch Density | `stitch-density` | stitches, length -> SPI | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0625` | Fabric Shrinkage | `fabric-shrinkage` | before, after -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0626` | Roll to Metres | `roll-to-metres` | roll weight, GSM, width -> metres | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0627` | Fabric Cost per Garment | `fabric-cost-garment` | consumption, rate -> cost | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0628` | Textile Cutting Waste | `cutting-waste-textile` | used, issued -> waste% | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0629` | Embroidery Stitch Count and Time | `embroidery-stitches` | design, speed -> stitches, time | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0630` | GSM to Ounces | `gsm-to-oz` | GSM -> oz/yd² | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0631` | Fabric Width Conversion | `fabric-width-conversion` | width, tube/open -> usable | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0632` | Garment Costing | `garment-costing` | fabric, trim, labour -> FOB cost | `REF-MATH-ELEM` | 3 | P1 | `R` |

### C38 · Packaging and Printing

`Entries: 15` · `Brief topic(s): 38` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-PKG-01 Box volume and blank** internal volume `= l×w×h`; blank length for an RSC
  `= 2(l+w) + glue flap`; board area must include flap depth.
- **F-PKG-02 Corrugated weight** `= board area × gsm_total/1000` where gsm_total is the sum of
  liner and fluting grades (ECT/BCT strength is a separate, test-based property).
- **F-PKG-03 Imposition** `sheets = ceil(quantity/(per-sheet × (1-waste)))`; print sheet count
  is driven by press sheet size, not finished size.
- **F-PKG-04 Paper weight** `ream weight = gsm × sheet area × sheets/ream`; a US ream is 500
  sheets, and "basis weight" (lb/ream of a *basis size*) is not gsm.
- **F-PKG-05 Bleed/trim** add bleed on all sides before imposition; creep in saddle-stitch
  shifts inner pages by `creep = (pages/4)×paper thickness`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0633` | Box Volume | `box-volume` | internal dims -> volume, board area | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0634` | Corrugated Board Weight | `corrugated-weight` | area, gsm -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0635` | Box Blank Size | `box-blank-size` | dims, style -> blank, board | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0636` | Cartons per Pallet | `carton-pallet-count` | pallet, carton, pattern -> count | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0637` | Void Fill Requirement | `void-fill` | box, contents -> fill volume | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0638` | Shrink Film Size | `shrink-film` | bundle dims -> film width | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0639` | Label Count per Roll | `label-count` | roll length, label pitch -> labels | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0640` | Print Imposition | `print-imposition` | sheet, trim, quantity -> sheets | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0641` | Paper Ream Weight | `paper-ream-weight` | gsm, size, sheets -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0642` | Ink Coverage Cost | `ink-coverage` | area, coverage%, rate -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0643` | Print Cost per Page | `print-cost-page` | cartridge, yield, coverage -> cost | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0644` | Bleed and Trim Size | `bleed-trim` | trim size, bleed -> document size | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0645` | Booklet Creep | `booklet-creep` | pages, paper thickness -> creep | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0646` | Packaging Cost per Unit | `packaging-cost` | materials, labour -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0647` | Cushioning Thickness | `cushioning-thickness` | drop height, fragility -> thickness | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C39 · Inventory and Stock Control

`Entries: 12` · `Brief topic(s): 39` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-INV-01 EOQ** `Q* = sqrt(2DS/H)` with D annual demand, S order cost, H holding cost per
  unit-year; assumes constant demand and no quantity discounts — state it.
- **F-INV-02 Reorder point** `ROP = d̄·LT + SS` (SS = z·σ_d·√LT for independent demand).
- **F-INV-03 Turnover** `COGS/avg inventory`; days of inventory `= 365/turnover`.
- **F-INV-04 ABC** classification by cumulative annual value (Pareto), typically 80/15/5 —
  thresholds are policy, not law.
- **F-INV-05 Cycle counting** sample size for a desired confidence uses the binomial/hypergeometric
  formula, not a fixed "count 10 items" rule.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0648` | Economic Order Quantity | `eoq` | demand, order cost, holding -> Q* | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0649` | Reorder Point | `reorder-point` | demand, lead time, safety -> ROP | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0650` | Safety Stock | `safety-stock` | service level, σ, lead time -> SS | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0651` | Days of Inventory | `days-of-inventory` | COGS, inventory -> days | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0652` | ABC Analysis | `abc-analysis` | items, values -> A/B/C classes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0653` | Stockout Probability | `stockout-probability` | SS, σ, LT -> probability | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0654` | Cycle Count Sample Size | `cycle-count-sample` | population, confidence -> sample | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0655` | Min-Max Levels | `min-max-levels` | demand, lead time -> min, max | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0656` | EOQ with Quantity Discount | `eoq-quantity-discount` | price breaks -> optimal Q | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0657` | Carrying Cost | `carrying-cost` | inventory value, rate -> annual cost | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0658` | Dead Stock Value | `dead-stock-value` | items, age, price -> write-down | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0659` | Inventory Valuation | `inventory-valuation` | units, method (FIFO/avg) -> value | `REF-MATH-ELEM` | 3 | P2 | `R` |

### C40 · Supply Chain and Logistics

`Entries: 13` · `Brief topic(s): 40` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-SCM-01 Service metrics** fill rate `= units shipped/units ordered`;
  OTIF `= orders on time AND in full / total`; perfect order rate further requires damage-free
  and correct documentation — these are nested, not alternative, measures.
- **F-SCM-02 Lead time** total `= processing + production + transit + customs + receiving`;
  variability matters more than the mean for safety stock (see F-INV-02).
- **F-SCM-03 Forecast error** MAPE `= mean(|A-F|/A)×100` fails when A=0; prefer MAE/RMSE and
  state the horizon.
- **F-SCM-04 Total cost of ownership** sum of unit price, freight, duty, inventory carrying,
  quality and administration — comparing unit price alone is a documented procurement error.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0660` | Lead Time Calculator | `lead-time` | process steps -> total lead time | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0661` | Fill Rate | `fill-rate` | shipped, ordered -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0662` | Perfect Order Rate | `perfect-order-rate` | orders, defects -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0663` | OTIF | `otif` | on-time, in-full -> OTIF% | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0664` | Supplier Scorecard | `supplier-scorecard` | weighted metrics -> score | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0665` | Total Cost of Ownership | `total-cost-of-ownership` | price, logistics, quality -> TCO | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0666` | Logistics Cost per Unit | `logistics-cost-unit` | costs, units -> per unit | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0667` | Warehouse Capacity | `warehouse-capacity` | volume, racking -> pallet positions | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0668` | Freight Cost Allocation | `freight-cost-allocation` | shipments, weight -> allocation | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0669` | Demand Forecast Error | `forecast-error` | actual, forecast -> MAE, MAPE | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0670` | Safety Stock with Lead-Time Variability | `safety-lead-time` | σ_LT, demand -> SS | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0671` | Reverse Logistics Cost | `reverse-logistics-cost` | returns, handling -> cost | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0672` | Shelf Life and Expiry | `shelf-life` | production, shelf life -> expiry | `REF-MATH-ELEM` | 1 | P2 | `R` |

### C41 · Shipping, Freight and Container Loading

`Entries: 16` · `Brief topic(s): 41` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-SHP-01 Dimensional weight** `dim weight = L×W×H/divisor` in the carrier's units; the
  divisor differs by carrier, service and unit system (e.g. 139 in³/lb, 5000 cm³/kg, 6000 cm³/kg)
  and changes over time — it MUST be a user-editable, source-cited field. Chargeable weight
  `= max(actual, dimensional)`, rounded up to the carrier's increment.
- **F-SHP-02 Air freight chargeable weight** volumetric `= volume(m³)×167 kg` (IATA 6000 cm³/kg);
  chargeable `= max(gross, volumetric)`.
- **F-SHP-03 Container capacity** nominal vs practical: 20 ft ≈33 m³, 40 ft ≈67 m³,
  40 ft HC ≈76 m³; usable volume is lower after packing efficiency (typically 80-90%) and
  payload limits are weight-driven, not volume-driven.
- **F-SHP-04 Load planning** is 3-D bin packing (NP-hard); report packing efficiency and state
  the algorithm.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0673` | Dimensional Weight | `dimensional-weight` | dims, divisor -> dim weight | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0674` | Chargeable Weight (Air) | `chargeable-weight-air` | gross, volume -> chargeable | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0675` | Container Capacity | `container-capacity` | container type, cargo -> volume, payload | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0676` | Container Fill Rate | `container-fill-rate` | cargo volume, container -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0677` | Pallet Loading | `pallet-loading` | carton, pallet, pattern -> cartons | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0678` | Pallet Count for Shipment | `pallet-count` | units, per pallet -> pallets | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0679` | LCL Freight Cost | `lcl-freight-cost` | volume/weight, rate -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0680` | Shipping Cost per Unit | `shipping-cost-unit` | freight, units -> per unit | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0681` | Freight Density | `freight-density` | weight, volume -> kg/m³ | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0682` | Truck Load Plan | `truck-load-plan` | pallets, truck -> utilisation | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0683` | Demurrage and Detention | `demurrage-cost` | days, rate -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0684` | Last-Mile Cost per Delivery | `last-mile-cost` | costs, stops -> per delivery | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0685` | Return Shipping Cost | `returns-shipping-cost` | returns, rate -> cost | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0686` | Export Packing Cost | `export-packing-cost` | materials, labour -> cost | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0687` | Cargo Insurance Premium | `cargo-insurance` | value, rate, route -> premium | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0688` | TEU Conversion | `teu-conversion` | containers -> TEU/FEU | `REF-MATH-ELEM` | 1 | P3 | `R` |

### C42 · Automotive and Vehicle Operation

`Entries: 16` · `Brief topic(s): 42` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-AUT-01 Fuel cost** `cost = distance/consumption × price`; unit systems
  (L/100 km vs mpg) are reciprocal — convert via `mpg(US) = 235.214583/L per 100 km`.
- **F-AUT-02 EV energy** `kWh = distance × consumption(kWh/100 km)/100`; charging cost adds a
  charging-loss factor (typically 5-15%, must be an input).
- **F-AUT-03 Tire sizing** `section width (mm) / aspect ratio % R rim (in)`; overall diameter
  `= rim×25.4 + 2×(width×aspect/100)`. A size change alters speedometer reading by
  `new/old - 1`.
- **F-AUT-04 Speed from gearing** `v = (rpm × 60 × circumference)/(gear ratio × final drive)`.
- **F-AUT-05 Depreciation** straight-line, declining-balance and market-data curves differ; a
  calculator using a formula must say it is an estimate, not a valuation.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0689` | Fuel Cost for a Trip | `fuel-cost-trip` | distance, consumption, price -> cost | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0690` | MPG to L/100 km | `mpg-l100km` | consumption -> other unit | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0691` | EV Efficiency | `ev-efficiency` | kWh, distance -> kWh/100 km | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0692` | EV Charging Cost | `ev-charging-cost` | kWh, tariff, losses -> cost | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0693` | EV Range Estimate | `ev-range` | battery kWh, consumption -> range | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0694` | Tire Size Conversion | `tire-size-conversion` | size code -> diameter, width | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0695` | Wheel Offset and Backspace | `wheel-offset` | width, offset -> backspace | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0696` | Speed from Gear Ratio | `speed-gear-ratio` | rpm, ratios, tire -> speed | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0697` | Engine Displacement | `engine-displacement` | bore, stroke, cylinders -> cc | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0698` | Engine Compression Ratio | `engine-compression-ratio` | swept, clearance volume -> CR | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0699` | Horsepower and Torque Conversion | `hp-torque-conversion` | hp <-> kW <-> torque | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0700` | Vehicle Depreciation | `vehicle-depreciation` | price, years, rate -> value | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0701` | Cost per Mile | `cost-per-mile` | costs, distance -> per mile | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0702` | Idling Fuel Consumption | `idling-fuel` | idle hours, rate -> fuel, cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0703` | Payload Capacity | `payload-capacity` | GVWR, curb, occupants -> payload | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0704` | Towing Load Check | `towing-load` | trailer, cargo, limits -> margin | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C43 · Aviation and Flight Planning

`Entries: 13` · `Brief topic(s): 43` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-AVI-01 Atmosphere** pressure altitude `≈ elevation + 30(1013.25 - QNH_hPa)` ft;
  density altitude `≈ PA + 120(T - ISA_temp)` °C. Both are approximations — label them.
- **F-AVI-02 Airspeed** TAS `≈ IAS × (1 + altitude/1000 × 0.02)` is a rough rule; the
  proper relation uses density ratio `TAS = IAS/√σ`, and CAS/EAS distinctions matter.
- **F-AVI-03 Wind triangle** ground speed and drift from TAS, true course and wind:
  `GS = √(TAS² + W² - 2·TAS·W·cos(Δ))`, `drift = asin(W·sin(Δ)/TAS)`.
- **F-AVI-04 Weight and balance** `CG = Σ(moment)/Σ(weight)`; must be checked against an
  envelope, not just a single limit.
- **F-AVI-05 Regulatory values** (takeoff distances, fuel reserves, minima) come from the
  AFM/POH and ICAO/FAA rules — never generated by a calculator.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0705` | Density Altitude | `density-altitude` | elevation, QNH, temp -> DA | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0706` | Pressure Altitude | `pressure-altitude` | elevation, QNH -> PA | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0707` | True Airspeed | `true-airspeed` | IAS, altitude, temp -> TAS | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0708` | Mach Number | `mach-number` | TAS, temperature -> Mach | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0709` | Wind Triangle | `wind-triangle` | course, TAS, wind -> GS, drift | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0710` | Fuel Endurance | `fuel-endurance` | fuel, burn rate -> endurance, range | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0711` | Crosswind Component | `crosswind-component` | wind, runway -> crosswind | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0712` | Weight and Balance CG | `weight-balance-cg` | weights, arms -> CG | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0713` | Climb Gradient | `climb-gradient` | altitude gain, distance -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0714` | Descent Rate | `descent-rate` | altitude, ground speed, angle -> fpm | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0715` | Flight Time | `flight-time` | distance, GS -> time | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0716` | Takeoff Distance Estimate | `takeoff-distance` | weight, DA, wind -> distance | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0717` | QNH and QFE Conversion | `qnh-qfe` | pressure, elevation -> values | `REF-MATH-ELEM` | 2 | P3 | `R` |

**Review notes for this category**

- `CALC-0716` **Takeoff Distance Estimate** — AFM/POH data required; must not be generated.

### C44 · Marine and Maritime Calculations

`Entries: 13` · `Brief topic(s): 44` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MAR-01 Displacement** `Δ = L×B×T×Cb×ρ`; block coefficient Cb is hull-form specific.
- **F-MAR-02 Hull speed** `v(kn) ≈ 1.34√LWL(ft)` = `2.43√LWL(m)`; a planing-hull approximation
  limit, not a physical maximum.
- **F-MAR-03 Propeller slip** `slip% = (theoretical - actual)/theoretical ×100`.
- **F-MAR-04 Stability** `GM = KM - KG`; a positive GM is necessary but not sufficient for
  seaworthiness — free-surface effect reduces GM by `FSM/Δ`.
- **F-MAR-05 Load line / draft change** `Δdraft = weight/(TPC)` where TPC is tonnes per cm
  immersion from the hydrostatic table. Never interpolate a hydrostatic table without stating it.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0718` | Displacement | `displacement` | L, B, T, Cb -> tonnes | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0719` | Deadweight Tonnage | `deadweight-tonnage` | loaded, light displacement -> DWT | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0720` | Hull Speed | `hull-speed` | waterline length -> knots | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0721` | Propeller Slip | `propeller-slip` | pitch, rpm, speed -> slip% | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0722` | Marine Fuel Consumption | `marine-fuel-consumption` | power, SFOC, hours -> litres | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0723` | Metacentric Height | `gm-stability` | KM, KG, FSC -> GM | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-0724` | Anchor Scope | `anchor-scope` | depth, ratio -> rode length | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0725` | Draft Change with Cargo | `draft-change-cargo` | weight, TPC -> change | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0726` | Bilge Pump Time | `bilge-pump-time` | volume, pump rate -> time | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0727` | Tide Window | `tide-window` | depth, tide curve -> window | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0728` | Distance, Speed and Time at Sea | `maritime-distance-time` | any 2 -> third | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0729` | Ballast Water Volume | `ballast-water` | tanks, trim -> volume | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0730` | Container Vessel Utilisation | `vessel-utilisation` | slots, TEU -> % | `REF-MATH-ELEM` | 2 | P3 | `R` |

**Review notes for this category**

- `CALC-0723` **Metacentric Height** — Requires hydrostatic tables from the vessel.
- `CALC-0725` **Draft Change with Cargo** — Hydrostatic table interpolation required.

### C45 · Physics and Mechanics

`Entries: 20` · `Brief topic(s): 45` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-PHY-01 Kinematics** `v = u + at`, `s = ut + ½at²`, `v² = u² + 2as`; valid for constant
  acceleration only.
- **F-PHY-02 Energy and momentum** `KE = ½mv²`, `PE = mgh`, `p = mv`, impulse `J = FΔt = Δp`;
  energy is conserved only in the absence of non-conservative work.
- **F-PHY-03 Circular motion** `a_c = v²/r`, `F_c = mv²/r`; centripetal force is a resultant,
  not an extra applied force.
- **F-PHY-04 Gravity** `F = Gm₁m₂/r²` with `G = 6.67430e-11 m³kg⁻¹s⁻²` (CODATA); surface
  `g = GM/r²`.
- **F-PHY-05 Waves** `v = fλ`; pendulum `T = 2π√(L/g)` valid for small angles only
  (error ~0.2% at 10°, ~2% at 20°).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0731` | Projectile Motion | `projectile-motion` | v, angle -> range, apex, time | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0732` | Momentum and Impulse | `momentum-impulse` | mass, velocity, time -> p, J | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0733` | Kinetic Energy | `kinetic-energy` | mass, velocity -> KE | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0734` | Potential Energy | `potential-energy` | mass, height -> PE | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0735` | Work and Power | `work-energy` | force, distance, time -> W, P | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0736` | Circular Motion | `circular-motion` | v, r, m -> a_c, F_c | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0737` | Gravitational Force | `gravitation` | masses, distance -> F, g | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0738` | Simple Harmonic Motion | `shm-spring` | k, m, amplitude -> T, f, v_max | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0739` | Pendulum Period | `pendulum-period` | length, g -> T | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0740` | Wave Speed | `wave-speed` | frequency, wavelength -> v | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0741` | Doppler Effect | `doppler-effect` | source/observer speeds -> f' | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0742` | Snell's Law Refraction | `snell-refraction` | n1, θ1, n2 -> θ2, critical | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0743` | Time Dilation | `time-dilation` | velocity -> γ, Δt' | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0744` | Photon Energy | `photon-energy` | wavelength -> E | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0745` | de Broglie Wavelength | `de-broglie-wavelength` | mass, velocity -> λ | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0746` | Radioactive Decay | `radioactive-decay` | half-life, time -> remaining | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0747` | Density and Specific Gravity | `density-specific-gravity` | mass, volume -> ρ, SG | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0748` | Pressure at Depth | `pressure-depth` | depth, ρ -> p | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0749` | Spring Constant | `spring-constant` | force, extension -> k | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0750` | Coefficient of Restitution | `restitution` | velocities -> e | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C46 · Chemistry and Laboratory Methods

`Entries: 20` · `Brief topic(s): 46` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CHM-01 Concentration** molarity `M = n/V(L)`; molality `m = n/kg solvent`;
  mass percent `= m_solute/m_solution×100`; ppm `= mg/kg` (aqueous, dilute).
- **F-CHM-02 Dilution** `C1V1 = C2V2` (moles conserved); does not hold when the solute reacts
  or when volumes are not additive — state the assumption.
- **F-CHM-03 pH** `pH = -log10(a_H+)`; for strong acid `[H+] = C`; for weak acid solve
  `Ka = x²/(C-x)`. Buffer `pH = pKa + log([A-]/[HA])` (Henderson-Hasselbalch) — valid near pKa
  and at moderate ionic strength.
- **F-CHM-04 Stoichiometry** balance the equation, then limiting reagent
  `min(n_i/ν_i)`; theoretical yield from that reagent.
- **F-CHM-05 Half-life** first order `t½ = ln2/k`; zero and second order have different forms —
  never apply ln2/k outside first order.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0751` | Molarity | `molarity` | moles, volume -> M | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0752` | Molality | `molality` | moles, solvent mass -> m | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0753` | Dilution (C1V1) | `dilution-c1v1` | C1, V1, C2 -> V2 | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0754` | Mass Percent | `mass-percent` | solute, solution -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0755` | ppm and ppb | `ppm-ppb` | mass ratio -> ppm/ppb | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0756` | Normality | `normality` | molarity, equivalents -> N | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0757` | pH of Strong Acid | `ph-strong-acid` | concentration -> pH | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0758` | pH of Weak Acid | `ph-weak-acid` | Ka, C -> pH | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0759` | Buffer pH (Henderson-Hasselbalch) | `buffer-henderson` | pKa, ratio -> pH | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0760` | Titration Calculation | `titration-calculation` | C, V, stoichiometry -> unknown | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0761` | Stoichiometry | `stoichiometry` | equation, amounts -> product mass | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0762` | Limiting Reagent | `limiting-reagent` | reactant amounts -> limiting, excess | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0763` | Theoretical Yield | `theoretical-yield` | actual, theoretical -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0764` | Molar Mass | `molar-mass` | formula -> g/mol | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0765` | Mole Conversion | `mole-conversion` | mass, moles, particles -> all | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0766` | Combined Gas Law | `combined-gas-law` | P,V,T states -> unknown | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0767` | Equilibrium Constant | `equilibrium-constant` | concentrations -> Kc, Kp | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0768` | Reaction Half-Life | `half-life-reaction` | order, k -> t½ | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0769` | Arrhenius Rate | `arrhenius-rate` | Ea, T -> k ratio | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0770` | Empirical Formula | `empirical-formula` | mass % -> formula | `REF-MATH-ELEM` | 3 | P2 | `R` |

### C47 · Biology and Life Sciences

`Entries: 10` · `Brief topic(s): 47` · `Priorities present: P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-BIO-01 Population growth** exponential `N(t) = N0 e^{rt}`; logistic
  `N(t) = K/(1 + ((K-N0)/N0)e^{-rt})` — K must be supplied, not inferred.
- **F-BIO-02 Hardy-Weinberg** `p² + 2pq + q² = 1`; assumes no selection, mutation, migration,
  drift and random mating — state the assumption explicitly.
- **F-BIO-03 Mendelian ratios** monohybrid 3:1, dihybrid 9:3:3:1 for independent assorting
  heterozygotes; deviation requires a chi-square test (see C08), not eyeballing.
- **F-BIO-04 Growth kinetics** doubling time `t_d = ln2/μ`; Monod `μ = μ_max S/(Ks+S)`.
- **F-BIO-05 Enzyme kinetics** Michaelis-Menten `v = Vmax S/(Km+S)`; Lineweaver-Burk is a
  linearisation that distorts error structure — prefer non-linear fitting.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0771` | Exponential Population Growth | `population-growth` | N0, r, t -> N | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0772` | Logistic Growth | `logistic-growth` | N0, r, K, t -> N | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0773` | Hardy-Weinberg Equilibrium | `hardy-weinberg` | allele freq -> genotype freq | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0774` | Punnett Ratio | `punnett-ratio` | cross -> phenotype ratio | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0775` | Cell Doubling Time | `cell-doubling-time` | counts, time -> t_d | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0776` | Bacterial Growth | `bacterial-growth` | lag, μ, time -> CFU | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0777` | DNA Concentration | `dna-concentration` | A260, dilution -> ng/µL | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0778` | Protein Molecular Weight | `protein-molecular-weight` | sequence -> kDa | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0779` | Michaelis-Menten Kinetics | `enzyme-kinetics-mm` | Vmax, Km, S -> v | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0780` | Serial Dilution | `dilution-series` | stock, factor, steps -> concentrations | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C48 · Environmental Science and Emissions

`Entries: 14` · `Brief topic(s): 48` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-ENV-01 Activity × factor** `emissions = activity × emission factor`; factors are
  jurisdiction- and year-specific (e.g. grid intensity), so they must be versioned data with a
  cited source. Scope 1/2/3 boundaries must be stated.
- **F-ENV-02 Combustion CO₂** stoichiometric for a fuel: diesel ≈2.68 kg CO₂/L, petrol
  ≈2.31 kg CO₂/L, natural gas ≈1.9 kg CO₂/m³ — these are standard factors but must be sourced
  per inventory (e.g. DEFRA/EPA), not hard-coded from memory.
- **F-ENV-03 Waste diversion** `= diverted/(diverted+disposed)×100`; contamination reduces
  effective diversion and should be an input.
- **F-ENV-04 AQI** is a piecewise-linear index from pollutant concentration breakpoints; the
  breakpoint table is pollutant- and jurisdiction-specific (US EPA vs WHO vs national).
- **F-ENV-05 GWP** converts non-CO₂ gases using 100-year factors (AR5/AR6 differ: CH₄ 28 vs
  29.8 fossil) — the assessment report must be selectable and displayed.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0781` | Electricity CO2 Emissions | `co2-electricity` | kWh, grid factor -> kg CO2e | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0782` | Vehicle CO2 per km | `co2-per-km` | fuel, distance -> g CO2/km | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0783` | CO2 per Litre of Fuel | `co2-per-litre-fuel` | fuel type, litres -> kg CO2 | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0784` | Tree Offset Equivalent | `tree-offset` | CO2, sequestration rate -> trees | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0785` | Water Footprint | `water-footprint` | use items -> litres | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0786` | Waste Diversion Rate | `waste-diversion-rate` | diverted, total -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0787` | Recycling Rate | `recycling-rate` | recycled, generated -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0788` | Emission Factor Application | `emission-factor` | activity, factor -> emissions | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0789` | AQI Category | `aqi-category` | concentration -> AQI, category | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0790` | Carbon Credit Equivalent | `carbon-credit` | emissions -> credits | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0791` | Energy Intensity | `energy-intensity` | energy, output -> intensity | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0792` | GWP Conversion | `gwp-conversion` | gas mass, GWP -> CO2e | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0793` | Compost Carbon-Nitrogen Ratio | `compost-cn-ratio` | inputs -> C:N | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0794` | Scope 1-2-3 Emissions Summary | `scope-emissions` | activities -> scopes | `REF-MATH-ELEM` | 3 | P2 | `R` |

### C49 · Renewable Energy and Solar Systems

`Entries: 15` · `Brief topic(s): 49` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-SOL-01 Yield** `E(kWh) = P(kW) × H(kWh/m²/day) × PR` where PR (performance ratio)
  ≈0.75-0.85 includes temperature, soiling, inverter and wiring losses; PR must be an input.
- **F-SOL-02 Sizing** `PV kWp = daily demand / (H × PR)`; battery days of autonomy multiply
  the required storage, not the array.
- **F-SOL-03 Tilt/azimuth** yield depends on latitude, season and azimuth; the optimum tilt
  is a site-specific optimisation, not a fixed "latitude" rule — any simple rule must be labelled
  an approximation. NREL SAM/PVWatts (fetch failed from this environment) is the reference tool.
- **F-SOL-04 Strings** `V_string = N × Voc × (1 + β(T_min - 25))` must stay below inverter
  max voltage at record low temperature and above start voltage at high temperature.
- **F-SOL-05 Payback** `= capex / annual savings`; ignoring degradation, tariff escalation and
  inverter replacement overstates the result.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0795` | PV System Size | `pv-system-size` | demand, irradiance, PR -> kWp | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0796` | PV Daily Energy Yield | `pv-daily-yield` | kWp, irradiance, PR -> kWh | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0797` | Panel Count | `panel-count` | kWp, panel wattage -> panels, area | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0798` | Inverter Sizing | `inverter-sizing` | array kWp, DC:AC -> inverter | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0799` | Solar Payback Period | `pv-payback` | capex, savings -> years | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0800` | Solar ROI | `pv-roi` | capex, cash flows -> ROI | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0801` | Optimal Tilt Estimate | `tilt-angle` | latitude, season -> tilt | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0802` | Irradiance to kWh | `irradiance-to-kwh` | area, irradiance, efficiency -> kWh | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0803` | String Voltage | `string-voltage` | Voc, count, temperature -> V range | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0804` | PV Cable Sizing | `pv-cable-sizing` | current, length, drop -> mm² | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0805` | Shading Loss | `shading-loss` | shaded fraction, config -> loss% | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0806` | Solar Row Pitch | `solar-row-spacing` | tilt, latitude, height -> pitch | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0807` | Solar Water Heating | `solar-water-heating` | demand, collector -> area, saving | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0808` | Net Metering Savings | `net-metering-savings` | generation, consumption, tariff -> saving | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0809` | Performance Ratio | `performance-ratio` | actual, expected -> PR | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0801` **Optimal Tilt Estimate** — Rule-of-thumb methods only; must be labelled approximate.

### C50 · Batteries and Electrical Energy Storage

`Entries: 10` · `Brief topic(s): 50` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-BAT-01 Runtime** ideal `t = C·V·DoD/P` hours; real runtime is reduced by Peukert
  behaviour, inverter efficiency and temperature — an ideal-only answer must be labelled.
- **F-BAT-02 Peukert** `t = H(C/(I·H))^k` with k typically 1.1-1.3 for lead-acid, 1.0-1.05 for
  lithium; k is chemistry-specific, not universal.
- **F-BAT-03 Packs** series adds voltage, parallel adds capacity; `Wh = Ah × V` only for a
  single nominal voltage.
- **F-BAT-04 Charge time** `t = capacity/(charge current × efficiency)`, and C-rate limits
  apply per chemistry; exceeding them damages cells.
- **F-BAT-05 SoC from voltage** is only reliable for rested lead-acid; lithium flat OCV curves
  make voltage-based SoC unreliable — the tool must say so.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0810` | Battery Runtime | `battery-runtime` | capacity, load, efficiency -> hours | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0811` | Ah to Wh Conversion | `ah-wh-conversion` | Ah, voltage -> Wh | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0812` | C-Rate | `c-rate` | capacity, current -> C | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0813` | Charge Time | `charge-time` | capacity, current, efficiency -> hours | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0814` | Series and Parallel Packs | `pack-series-parallel` | cells, config -> V, Ah, Wh | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0815` | Peukert Capacity | `peukert-capacity` | C, I, k -> effective capacity | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0816` | Depth of Discharge and Cycles | `dod-cycle-life` | DoD, chemistry -> life | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0817` | UPS Runtime | `ups-runtime` | VA, load, battery -> minutes | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0818` | State of Charge from Voltage | `soc-from-voltage` | chemistry, V -> SoC | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0819` | Battery Cost per kWh | `battery-cost-kwh` | price, capacity -> $/kWh | `REF-MATH-ELEM` | 1 | P2 | `R` |

**Review notes for this category**

- `CALC-0818` **State of Charge from Voltage** — Chemistry-specific OCV tables required.

### C51 · Astronomy and Orbital Mechanics

`Entries: 13` · `Brief topic(s): 51` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-AST-01 Time** Julian Date from the Gregorian calendar; `JD 2451545.0 = 2000-01-01 12:00 TT`
  (J2000.0 epoch). Calendar conversion must use the Julian/Gregorian switch rule for dates
  before 1582-10-15.
- **F-AST-02 Kepler** `T² = 4π²a³/(GM)`; circular orbital speed `v = √(GM/r)`.
- **F-AST-03 Geometry** angular size `θ ≈ 2·arctan(d/(2D))`; magnitude difference
  `m1 - m2 = -2.5·log10(F1/F2)`; redshift `z = (λ_obs - λ_emit)/λ_emit`.
- **F-AST-04 Solar position** accurate solar altitude/azimuth requires the NREL SPA (or Meeus)
  algorithm with refraction and nutation terms; simple declination formulas carry ~1° error and
  must be labelled approximate.
- **F-AST-05 Hohmann transfer** `Δv1 = √(μ/r1)(√(2r2/(r1+r2)) - 1)` — impulsive, coplanar,
  circular-to-circular only.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0820` | Julian Date | `julian-date` | calendar date/time -> JD, MJD | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0821` | Moon Phase | `moon-phase` | date -> phase, illumination | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0822` | Sunrise and Sunset | `sunrise-sunset` | date, lat, lon -> times | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-0823` | Solar Position | `solar-position` | date, time, lat, lon -> alt, az | `REF-MATH-ELEM` | 4 | P2 | `R` |
| `CALC-0824` | Escape Velocity | `escape-velocity` | mass, radius -> v_esc | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0825` | Orbital Period (Kepler) | `orbital-period` | semi-major axis, mass -> T | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0826` | Hohmann Transfer | `hohmann-transfer` | r1, r2 -> Δv, time | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0827` | Apparent Magnitude | `star-magnitude` | flux ratio -> Δm | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0828` | Angular Size | `angular-size` | diameter, distance -> angle | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0829` | Redshift | `redshift` | wavelengths -> z, velocity | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0830` | Light-Year Distance | `light-year-distance` | years -> metres, AU, pc | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0831` | Sidereal Time | `sidereal-time` | date, longitude -> LST | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0832` | Satellite Look Angle | `satellite-look-angle` | observer, satellite -> az, el, range | `REF-MATH-ELEM` | 4 | P3 | `R` |

**Review notes for this category**

- `CALC-0822` **Sunrise and Sunset** — NOAA solar calculator algorithm; verify against gml.noaa.gov.

### C52 · Geography, Mapping and Surveying

`Entries: 14` · `Brief topic(s): 52` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-GEO-05 Great-circle distance** haversine
  `d = 2R·asin(√(sin²(Δφ/2) + cosφ1·cosφ2·sin²(Δλ/2)))` with R = 6 371.0088 km (mean) —
  different Earth models change results by up to ~0.5%, so the radius must be stated.
- **F-GEO-06 Bearing** initial bearing
  `θ = atan2(sinΔλ·cosφ2, cosφ1·sinφ2 - sinφ1·cosφ2·cosΔλ)`, normalised to 0-360°.
- **F-GEO-07 Coordinate area** spherical excess for geodesic polygons; planar shoelace on
  projected coordinates only for small areas.
- **F-GEO-08 DMS** `dd = d + m/60 + s/3600` with sign from hemisphere; parsing must reject
  `m ≥ 60`, `s ≥ 60`.
- **F-GEO-09 Traverse closure** `ΣΔE, ΣΔN`; linear misclosure
  `= √(ΣΔE² + ΣΔN²)`, relative precision `= misclosure/perimeter`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0833` | Haversine Distance | `haversine-distance` | lat/lon pair -> km | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0834` | Initial Bearing | `initial-bearing` | lat/lon pair -> bearing | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0835` | Latitude Longitude Midpoint | `latlong-midpoint` | 2 points -> midpoint | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0836` | Area from Coordinates | `coordinate-area` | polygon vertices -> area | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0837` | Slope and Gradient | `slope-gradient` | rise, run -> %, ratio, degrees | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0838` | Contour Interval | `contour-interval` | scale, terrain -> interval | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0839` | Traverse Closure | `traverse-closure` | legs, bearings -> misclosure | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0840` | Distance to Horizon | `distance-to-horizon` | eye height -> km | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0841` | Map Scale Conversion | `map-scale` | scale, map distance -> ground | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0842` | DMS to Decimal Degrees | `dms-decimal` | d, m, s -> decimal | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0843` | UTM Coordinate Conversion | `utm-conversion` | lat/lon -> UTM | `REF-MATH-ELEM` | 4 | P2 | `R` |
| `CALC-0844` | Timezone from Longitude | `timezone-from-longitude` | longitude -> offset | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0845` | Elevation Profile | `elevation-profile` | points, elevations -> gain, grade | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0846` | North Reference Conversion | `north-reference` | true/magnetic/grid -> bearings | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C53 · Meteorology and Climate

`Entries: 12` · `Brief topic(s): 53` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MET-01 Wind chill (NWS/Canada)** verified on weather.gov:
  `T_wc(°F) = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275T·V^0.16`, T in °F, V in mph.
  Defined ONLY for T ≤ 50 °F and V > 3 mph; the index applies to human/animal skin, not objects,
  and assumes a clear night sky (sun can add 10-18 °F). Inanimate objects cannot be cooled below
  air temperature.
- **F-MET-02 Heat index (Rothfusz regression, NWS)** verified on weather.gov:
  `HI = -42.379 + 2.04901523T + 10.14333127RH - 0.22475541·T·RH - 0.00683783T²
  - 0.05481717RH² + 0.00122874T²RH + 0.00085282TRH² - 0.00000199T²RH²`, T °F, RH %.
  Stated regression error ±1.3 °F; values are for shade; add up to 15 °F in direct sun.
- **F-MET-03 Dew point / humidity** Magnus-Tetens:
  `Td = (b·α)/(a - α)`, `α = ln(RH/100) + aT/(b+T)` with a = 17.625 °C, b = 243.04 °C
  (valid ~ -40..50 °C, ~1% RH error); state the coefficient set.
- **F-MET-04 Wet bulb** requires solving the psychrometric energy balance or a validated
  approximation (Stull 2011); do not present a linear rule as exact.
- **F-MET-05 Rainfall** `volume = area × depth`; 1 mm over 1 m² = 1 litre.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0847` | Wind Chill | `wind-chill` | temp °F/°C, wind -> wind chill | `REF-MATH-ELEM` | 1 | P0 | `S` |
| `CALC-0848` | Heat Index | `heat-index` | temp, RH -> feels-like, category | `REF-MATH-ELEM` | 2 | P0 | `S` |
| `CALC-0849` | Dew Point | `dew-point` | temp, RH -> dew point | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0850` | Relative Humidity | `relative-humidity` | temp, dew point -> RH | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0851` | Wet Bulb Temperature | `wet-bulb` | temp, RH, pressure -> Tw | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0852` | Humidex | `humidex` | temp, dew point -> humidex | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0853` | Cloud Base Height | `cloud-base` | temp, dew point -> base | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0854` | Rainfall Volume | `rainfall-volume` | area, depth -> litres, m3 | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0855` | Snow Water Equivalent | `snow-water-equivalent` | snow depth, density -> mm water | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0856` | Wind Pressure on a Surface | `wind-load-pressure` | speed, area, Cd -> force | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0857` | Station Pressure from Altitude | `station-pressure` | elevation, QNH -> pressure | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0858` | Barometric Formula | `barometric-formula` | altitude -> pressure | `REF-MATH-ELEM` | 3 | P3 | `R` |

**Review notes for this category**

- `CALC-0847` **Wind Chill** — Formula, validity limits (T<=50F, V>3mph) and caveats verified on weather.gov.
- `CALC-0848` **Heat Index** — Rothfusz coefficients and +/-1.3F error and sun adjustment verified on weather.gov.

### C54 · Agriculture and Horticulture

`Entries: 12` · `Brief topic(s): 54` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-AGR-01 Plant population** `plants/ha = 10 000/(row_spacing_m × plant_spacing_m)`.
- **F-AGR-02 Seed rate** `kg/ha = target_plants/m² × thousand_grain_weight(g)/1000 / germination`.
- **F-AGR-03 Growing degree days** `GDD = Σ max(0, (T_max+T_min)/2 - T_base)`; base temperature
  is crop-specific and must come from an extension source for that crop.
- **F-AGR-04 Grain moisture shrink** `shrink% = (MC_initial - MC_target)/(100 - MC_target)×100`
  (the standard "wet-bushel" shrink formula) — different from a simple linear subtraction.
- **F-AGR-05 Stocking rate** `AU/ha = forage_production × utilisation/(animal intake × days)`;
  carrying capacity depends on the local forage assessment.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0859` | Crop Yield | `crop-yield` | area, production -> t/ha | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0860` | Seed Rate | `seed-rate` | target plants, TGW, germination -> kg/ha | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0861` | Plant Population | `plant-population` | row, plant spacing -> plants/ha | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0862` | Row Spacing and Plant Count | `row-spacing` | bed width, rows -> spacing | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0863` | Growing Degree Days | `growing-degree-days` | temps, base -> GDD | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0864` | Grain Moisture Shrink | `grain-moisture-shrink` | moistures -> shrink% | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0865` | Harvest Loss | `harvest-loss` | yield, loss -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0866` | Stocking Rate | `stocking-rate` | forage, intake -> AU/ha | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0867` | Hay Bale Count | `hay-bale-count` | yield, bale weight -> bales | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0868` | Land Area Conversion | `land-area-conversion` | acres/hectares/m2 -> all | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0869` | Field Capacity Time | `field-capacity-time` | area, implement width, speed -> hours | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0870` | Livestock Feed Requirement | `livestock-feed` | animals, ration -> daily feed | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C55 · Irrigation, Fertilisers and Crop Production

`Entries: 12` · `Brief topic(s): 55` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-IRR-01 Crop water use** `ETc = ET0 × Kc` (FAO 56). ET0 from the FAO Penman-Monteith
  reference surface (h = 0.12 m grass, 2 m measurement height, r_l = 100 s/m, LAI = 24h);
  Kc is crop- and stage-specific and must be sourced from FAO 56 tables.
  FAO 56 Chapter 2 (inspected) warns the resistance formulation assumes neutral stability and
  hourly steps may need stability corrections.
- **F-IRR-02 Net irrigation** `d_net = ETc - effective rainfall`; gross `= d_net/application
  efficiency` (drip 0.90, sprinkler 0.75, surface 0.60 are typical published ranges — expose them).
- **F-IRR-03 Emitters** `count = area/(emitter_spacing × row_spacing)`; run time
  `t = volume_required/(emitters × emitter_flow)`.
- **F-IRR-04 Fertiliser** nutrient mass `= product mass × nutrient%`; converting elemental P to
  P₂O₅ multiplies by 2.2914, K to K₂O by 1.2046, Ca to CaO by 1.3992 — oxide-basis conversions
  are a frequent source of gross dosing errors.
- **F-IRR-05 Lime requirement** requires soil test buffer pH; it is not derivable from target pH
  alone.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0871` | Irrigation Requirement (ETc) | `irrigation-requirement` | ET0, Kc -> ETc | `REF-MATH-ELEM` | 2 | P1 | `S` |
| `CALC-0872` | Crop Coefficient Calculator | `crop-coefficient-etc` | ET0, Kc, area -> volume | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0873` | Drip Emitter Count | `drip-emitter-count` | area, spacing -> emitters, flow | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0874` | Sprinkler Spacing and Coverage | `sprinkler-spacing` | head, pressure, wind -> spacing | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0875` | Irrigation Interval | `irrigation-interval` | soil water, ETc -> days | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0876` | Soil Moisture Depletion | `soil-moisture-depletion` | FC, PWP, root depth -> depletion | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0877` | Leaching Requirement | `leaching-requirement` | ECw, ECe -> fraction | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0878` | NPK Blend Formulation | `npk-blend` | target grades, products -> blend | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0879` | Fertiliser Rate by Nutrient | `fertilizer-rate-nutrient` | nutrient target, product% -> kg | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0880` | Elemental to Oxide Conversion | `oxide-conversion` | P/K/Ca -> P2O5/K2O/CaO | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0881` | Lime Requirement | `lime-requirement` | soil pH, buffer -> tonnes | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0882` | Compost Application Rate | `compost-application` | area, depth, density -> volume | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0871` **Irrigation Requirement (ETc)** — FAO 56 method and reference-surface constants inspected; Kc tables still to be sourced.
- `CALC-0881` **Lime Requirement** — Requires soil-test buffer method; region-specific.

### C56 · Food Preparation and Recipe Scaling

`Entries: 14` · `Brief topic(s): 56` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-FOD-01 Scaling** every ingredient multiplies by `factor = new_yield/old_yield`; but
  leavening, salt, and alcohol do not scale linearly in practice — the tool must warn and offer a
  non-linear mode for those categories rather than silently scaling.
- **F-FOD-02 Baker's percentage** flour = 100%; `ingredient% = mass/flour_mass×100`;
  hydration `= water/flour×100`. Percentages can exceed 100% and sum above 100%.
- **F-FOD-03 Pan conversion** compare by area (round: `πr²`; square: `l×w`) and scale by
  `new_area/old_area`; depth changes bake time independently of area.
- **F-FOD-04 Brine** `% = salt_mass/(water_mass + salt_mass)×100` (w/w) vs salt/water (w/v) —
  these differ materially and must be labelled.
- **F-FOD-05 Alcohol dilution** `V_w = V_s(C_s/C_t - 1)`; volume contraction on mixing means
  the result is approximate (state ±).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0883` | Recipe Scaling | `recipe-scaling` | servings, factor -> scaled ingredients | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0884` | Serving Size Conversion | `serving-conversion` | recipe yield, portions -> portion size | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0885` | Baking Pan Size Conversion | `pan-size-conversion` | pan shapes -> factor | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0886` | Baker's Percentage | `baker-percentage` | flour, ingredients -> % | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0887` | Dough Hydration | `dough-hydration` | water, flour -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0888` | Coffee Brew Ratio | `coffee-ratio` | coffee, water -> ratio, strength | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0889` | Brine Concentration | `brine-concentration` | salt, water -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0890` | Alcohol Dilution | `alcohol-dilution` | volume, ABV -> water to add | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0891` | ABV to Proof | `abv-proof` | ABV <-> proof | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0892` | Cooking Time by Weight | `cooking-time-weight` | mass, rate -> time | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0893` | Meat Cooking Loss | `meat-cooking-loss` | raw, cooked -> loss% | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0894` | Recipe Cost | `recipe-cost` | ingredient costs -> cost per serving | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0895` | Portion Size Planning | `portion-size` | guests, per-portion -> total | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0896` | Food Waste Cost | `food-waste-cost` | waste, cost -> annual loss | `REF-MATH-ELEM` | 1 | P3 | `R` |

### C57 · Nutrition and Dietary Calculations

`Entries: 15` · `Brief topic(s): 57` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-NUT-01 BMI** `BMI = kg/m²`; US customary `703×lb/in²`. CDC adult categories verified:
  <18.5 underweight; 18.5-<25 healthy; 25-<30 overweight; 30-<35 class 1; 35-<40 class 2;
  ≥40 class 3. CDC states BMI is a screening measure, not a diagnosis, and applies to adults
  20+ regardless of age, sex or race; children need age-sex percentiles.
- **F-NUT-02 BMR** Mifflin-St Jeor: men `10kg + 6.25cm - 5age + 5`; women `-161`.
  Harris-Benedict (revised) is a different, older equation — results differ ~5%, so the choice
  must be shown.
- **F-NUT-03 TDEE** `BMR × activity factor`; activity multipliers are population averages with
  large individual variance (±20%+).
- **F-NUT-04 Macros** `protein 4 kcal/g, carbohydrate 4, fat 9, alcohol 7`; the sum must
  reconcile with total energy within rounding.
- **F-NUT-05 Body fat (US Navy)** circumference regression; accuracy ±3-4% and population
  specific — must be labelled an estimate.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0897` | BMI Calculator | `bmi` | height, weight -> BMI, category | `REF-MATH-ELEM` | 1 | P0 | `S` |
| `CALC-0898` | BMR (Mifflin-St Jeor) | `bmr-mifflin` | age, sex, height, weight -> kcal | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0899` | TDEE | `tdee` | BMR, activity -> kcal | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0900` | Calorie Deficit Plan | `calorie-deficit-plan` | TDEE, target -> intake, timeline | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0901` | Macro Split | `macro-split` | calories, ratios -> grams | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0902` | Protein Requirement | `protein-requirement` | weight, goal -> grams | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0903` | Fibre Intake | `fiber-intake` | age, sex -> grams | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-0904` | Water Intake | `water-intake` | weight, activity -> litres | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0905` | Body Fat (US Navy) | `body-fat-navy` | circumferences -> body fat% | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0906` | Waist-to-Hip Ratio | `waist-hip-ratio` | waist, hip -> WHR, risk band | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0907` | Ideal Body Weight | `ideal-body-weight` | height, sex -> range | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0908` | Child BMI Percentile | `bmi-percentile-child` | age, sex, BMI -> percentile | `REF-MATH-ELEM` | 3 | P1 | `X` |
| `CALC-0909` | Sodium Intake | `sodium-intake` | foods -> mg sodium | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0910` | Added Sugar Limit | `added-sugar-limit` | calories -> grams limit | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-0911` | Alcohol Calories | `alcohol-calories` | drink, volume, ABV -> kcal | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-0897` **BMI Calculator** — Formula and adult categories verified on cdc.gov; adult-only limitation stated.
- `CALC-0908` **Child BMI Percentile** — Requires CDC growth-chart LMS tables; paediatric review.

### C58 · Fitness and Exercise

`Entries: 14` · `Brief topic(s): 58` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-FIT-01 One-rep max** Epley `1RM = w(1 + reps/30)`; Brzycki `w×36/(37-reps)`. These
  estimates diverge above ~10 reps; never present as a measured maximum and require a safety note.
- **F-FIT-02 Pace** `pace = time/distance`; conversions must keep min/km vs min/mile explicit.
- **F-FIT-03 Heart rate zones** percent-of-max: `HR_max` from 220-age is a population average
  with ±10-12 bpm SD; Tanaka (`208 - 0.7age`) is an alternative — the formula must be selectable.
- **F-FIT-04 MET calories** `kcal = MET × 3.5 × kg / 200 × minutes`; MET values come from the
  Compendium of Physical Activities and are averages.
- **F-FIT-05 VO2max (Cooper)** `= (distance_m - 504.9)/44.73` for the 12-minute run — a field
  estimate, not a lab measurement.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0912` | One-Rep Max | `one-rep-max` | weight, reps -> 1RM (Epley/Brzycki) | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0913` | Training Volume | `training-volume` | sets, reps, load -> tonnage | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0914` | Running Pace | `running-pace` | distance, time -> pace, speed | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0915` | Split Times | `split-times` | target time, splits -> per-km | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0916` | VO2max (Cooper) | `vo2max-cooper` | 12-min distance -> VO2max | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0917` | Heart Rate Zones | `heart-rate-zones` | age, resting HR -> zones | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0918` | Calories Burned (MET) | `met-calorie-burn` | MET, weight, time -> kcal | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0919` | Steps to Distance | `steps-to-distance` | steps, stride -> km | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0920` | Race Time Prediction (Riegel) | `riegel-prediction` | race 1, race 2 -> predicted | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0921` | Swim Pace | `swim-pace` | distance, time -> per 100 m | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0922` | Cycling Speed and Power | `cycling-speed-power` | power, weight, grade -> speed | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0923` | Weight Loss Rate | `weight-loss-rate` | deficit -> kg/week | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0924` | Body Recomposition Tracker | `body-recomp` | weight, body fat -> lean mass change | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0925` | Treadmill Incline Equivalent | `treadmill-incline` | speed, incline -> outdoor effort | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C59 · General Health and Clinical Screening

`Entries: 16` · `Brief topic(s): 59` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

  These are screening/estimation tools, NOT diagnostic devices. Every page requires a medical
  disclaimer, the validated equation name and version, its intended population, and a clear
  statement of what the tool cannot do.
- **F-HLT-01 eGFR (CKD-EPI 2021)** creatinine-based, race-free:
  `eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1.200 × 0.9938^age × 1.012 [if female]`
  with κ = 0.7 (F)/0.9 (M), α = -0.241 (F)/-0.302 (M). Requires the 2021 equation; older
  MDRD/CKD-EPI-2009 variants give different numbers and must not be mixed.
- **F-HLT-02 Cockcroft-Gault** `CrCl = ((140-age)×weight)/(72×Scr) ×0.85 if female` — still used
  for drug dosing, but it is NOT eGFR.
- **F-HLT-03 Widmark** `BAC% = (A×5.14/W×r) - 0.015t`; r ≈0.73 male/0.66 female; ignores
  absorption kinetics and is unsuitable for legal or driving decisions.
- **F-HLT-04 Due date** Naegele `LMP + 280 days`; only valid for a regular 28-day cycle —
  ultrasound dating supersedes it.
- **F-HLT-05 IV rate** `mL/h = volume/time`; `drops/min = (volume×drop_factor)/(time_min)`.
- **F-HLT-06 Paediatric dosing** mg/kg requires a verified weight and a stated maximum dose;
  the tool must refuse to output a dose without an explicit mg/kg source.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0926` | eGFR (CKD-EPI 2021) | `egfr-ckdepi` | creatinine, age, sex -> eGFR | `REF-MATH-ELEM` | 3 | P1 | `X` |
| `CALC-0927` | Creatinine Clearance (Cockcroft-Gault) | `creatinine-clearance` | age, weight, Scr -> CrCl | `REF-MATH-ELEM` | 2 | P2 | `X` |
| `CALC-0928` | Blood Alcohol (Widmark) | `blood-alcohol-widmark` | drinks, weight, time -> BAC | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-0929` | Due Date (Naegele) | `due-date-naegele` | LMP, cycle length -> EDD | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0930` | Ovulation Window | `ovulation-window` | cycle length, LMP -> fertile days | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0931` | Paediatric Dose by Weight | `pediatric-dose-weight` | weight, mg/kg, max -> dose | `REF-MATH-ELEM` | 3 | P1 | `X` |
| `CALC-0932` | IV Drip Rate | `iv-drip-rate` | volume, time, drop factor -> gtt/min | `REF-MATH-ELEM` | 2 | P1 | `X` |
| `CALC-0933` | Mean Arterial Pressure | `map-calculation` | SBP, DBP -> MAP | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0934` | Anion Gap | `anion-gap` | Na, Cl, HCO3 -> gap | `REF-MATH-ELEM` | 1 | P3 | `X` |
| `CALC-0935` | Corrected Calcium | `corrected-calcium` | Ca, albumin -> corrected | `REF-MATH-ELEM` | 2 | P3 | `X` |
| `CALC-0936` | LDL Cholesterol (Friedewald) | `ldl-friedewald` | TC, HDL, TG -> LDL | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0937` | Serum Osmolality | `serum-osmolality` | Na, glucose, BUN -> osmolality | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0938` | Pack-Years | `pack-years` | cigarettes/day, years -> pack-years | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0939` | Daily Fluid Requirement | `fluid-requirement` | weight, age -> mL/day | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0940` | Insulin Correction Dose | `insulin-correction` | BG, target, ISF -> units | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-0941` | Cardiovascular Risk Score | `cardiovascular-risk` | risk factors -> 10-year risk | `REF-MATH-ELEM` | 4 | P2 | `X` |

**Review notes for this category**

- `CALC-0926` **eGFR (CKD-EPI 2021)** — Renal equation; clinical review and KDIGO citation required before publish.
- `CALC-0927` **Creatinine Clearance (Cockcroft-Gault)** — Drug-dosing context; pharmacist review.
- `CALC-0928` **Blood Alcohol (Widmark)** — Estimate only; legally unreliable; disclaimer mandatory.
- `CALC-0931` **Paediatric Dose by Weight** — Requires prescriber oversight; high-risk.
- `CALC-0932` **IV Drip Rate** — Nursing calculation; double-check policy required.
- `CALC-0934` **Anion Gap** — Clinical interpretation required.
- `CALC-0935` **Corrected Calcium** — Clinical use.
- `CALC-0936` **LDL Cholesterol (Friedewald)** — Invalid when TG > 400 mg/dL; limitation must be enforced.
- `CALC-0940` **Insulin Correction Dose** — High-risk; requires clinician-defined parameters.
- `CALC-0941` **Cardiovascular Risk Score** — Requires a specific validated model (e.g. ASCVD PCE) and population caveats.

### C60 · Date, Time and Calendar

`Entries: 15` · `Brief topic(s): 60` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-DTM-01 Date difference** use calendar arithmetic, not `(ms2-ms1)/86400000`, because DST
  transitions and leap seconds make civil days unequal. Define inclusivity explicitly
  (days between vs days inclusive) — users assume different conventions.
- **F-DTM-02 Add/subtract** `Date + n days` in UTC then convert for display; adding months must
  clamp the day-of-month (31 Jan + 1 month = 28/29 Feb).
- **F-DTM-03 Business days** require a holiday calendar (jurisdiction/year specific); weekends
  alone are not business days in many countries.
- **F-DTM-04 ISO week** weeks start Monday, week 1 is the week containing the first Thursday;
  naive `weekOfYear` implementations are off by one at year boundaries.
- **F-DTM-05 Age** completed years = calendar difference minus one if the birthday has not yet
  occurred this year; do not divide days by 365.25 for a stated age.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0942` | Date Difference | `date-difference` | two dates -> days, months, years | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0943` | Add or Subtract Days | `add-days` | date, offset -> new date | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0944` | Business Days Between | `business-days` | dates, holidays -> working days | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0945` | Age Calculator | `age-calculator` | birth date -> age | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0946` | Day of Week | `weekday` | date -> weekday | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0947` | ISO Week Number | `iso-week-number` | date -> ISO week | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0948` | Leap Year Check | `leap-year` | year -> leap? | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0949` | Time Duration | `time-duration` | start, end -> h:m:s | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0950` | Timezone Shift | `timezone-shift` | time, from, to -> converted | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0951` | Work Hours | `work-hours` | start, end, breaks -> hours | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0952` | Countdown | `countdown` | target date -> remaining | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0953` | Day of Year | `day-of-year` | date -> ordinal day | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0954` | ISO 8601 Format Converter | `iso-date-format` | date -> ISO string | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0955` | Timesheet Total | `timesheet-total` | entries -> total hours, pay | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0956` | Date of Easter (Computus) | `date-of-easter` | year -> date | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C61 · Unit Conversion and Measurement

`Entries: 16` · `Brief topic(s): 61` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-UNI-01 Exact factors only.** Conversion factors come from NIST SP 811 Appendix B.
  The inspected table marks exact factors in bold, e.g. inch = 25.4 mm (exact), pound =
  0.453 592 37 kg (exact), standard gravity 9.806 65 m/s² (exact), standard atmosphere
  101 325 Pa (exact), Btu_IT = 1.055 056 kJ (not exact). Convert via a single canonical base unit
  (SI) and never round intermediates; round only the displayed result.
- **F-UNI-02 Temperature is affine, not multiplicative**: `°F = °C×9/5 + 32`, `K = °C + 273.15`
  (exact), `°R = °F + 459.67`. Applying a ratio factor to temperatures is wrong.
- **F-UNI-03 Significant figures** must be preserved: a 3-significant-figure input cannot
  legitimately produce 10 significant figures of output. Display rounding rules belong in the
  shared formatting layer, not in each calculator.
- **F-UNI-04 US vs imperial** gallons (US 3.785 411 784 L exact vs imperial 4.546 09 L),
  tons (short 907.184 74 kg vs long 1016.046 908 8 kg vs metric 1000 kg) differ — never offer
  "gallon" or "ton" without a system qualifier.
- **F-UNI-05 SI prefixes** are powers of 10 (kibi/mebi are powers of 2 for data, see C65).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0957` | Length Converter | `length-converter` | any length unit -> all | `REF-MATH-ELEM` | 1 | P0 | `S` |
| `CALC-0958` | Mass Converter | `mass-converter` | any mass unit -> all | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0959` | Area Converter | `area-converter` | m2/ft2/acre/ha -> all | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0960` | Volume Converter | `volume-converter` | L/gal/m3 -> all | `REF-MATH-ELEM` | 1 | P0 | `S` |
| `CALC-0961` | Temperature Converter | `temperature-converter` | C/F/K/R -> all | `REF-MATH-ELEM` | 1 | P1 | `S` |
| `CALC-0962` | Speed Converter | `speed-converter` | m/s, km/h, mph, kn -> all | `REF-MATH-ELEM` | 1 | P0 | `S` |
| `CALC-0963` | Pressure Converter | `pressure-converter` | Pa, bar, psi, atm -> all | `REF-MATH-ELEM` | 1 | P1 | `S` |
| `CALC-0964` | Energy Converter | `energy-converter` | J, cal, kWh, Btu -> all | `REF-MATH-ELEM` | 1 | P1 | `S` |
| `CALC-0965` | Power Converter | `power-converter` | W, hp, BTU/h -> all | `REF-MATH-ELEM` | 1 | P1 | `S` |
| `CALC-0966` | Force Converter | `force-converter` | N, lbf, kgf -> all | `REF-MATH-ELEM` | 1 | P1 | `S` |
| `CALC-0967` | Torque Converter | `torque-converter` | N·m, lbf·ft -> all | `REF-MATH-ELEM` | 1 | P2 | `S` |
| `CALC-0968` | Flow Rate Converter | `flow-rate-converter` | L/s, m3/h, gpm -> all | `REF-MATH-ELEM` | 2 | P2 | `S` |
| `CALC-0969` | Acceleration Converter | `acceleration-converter` | m/s2, g, ft/s2 -> all | `REF-MATH-ELEM` | 1 | P3 | `S` |
| `CALC-0970` | Density Converter | `density-converter` | kg/m3, lb/ft3 -> all | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0971` | Viscosity Converter | `viscosity-converter` | cP, Pa·s, cSt -> all | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0972` | Illuminance Converter | `illuminance-converter` | lux, fc, cd/m2 -> all | `REF-MATH-ELEM` | 2 | P3 | `S` |

### C62 · Computer Science and Algorithms

`Entries: 12` · `Brief topic(s): 62` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-CSC-01 Radix conversion** repeated division; negative values need two's-complement
  semantics stated explicitly (e.g. 8-bit `-1 = 11111111`).
- **F-CSC-02 IEEE-754** double: 1 sign, 11 exponent (bias 1023), 52 fraction; value
  `(-1)^s × 2^(e-1023) × 1.f`. Only ~15-17 significant decimal digits are representable, which
  is why money must not use binary floats.
- **F-CSC-03 Hash table load factor** `α = n/m`; expected probe cost grows sharply above
  α ≈ 0.7 for open addressing.
- **F-CSC-04 Binary search** worst case `⌈log2(n+1)⌉` comparisons; requires sorted input —
  stating the complexity without the precondition is a common error.
- **F-CSC-05 Complexity** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!);
  a calculator can only classify a supplied function, not measure runtime.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0973` | Number Base Conversion | `number-base-conversion` | value, base -> others | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0974` | Bitwise Operations | `bitwise-operations` | integers, op -> result | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0975` | Boolean Truth Table | `boolean-truth-table` | expression -> table | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-0976` | ASCII and Unicode Converter | `ascii-unicode` | text <-> codes | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0977` | Two's Complement | `twos-complement` | value, bits -> binary | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0978` | IEEE-754 Representation | `ieee754-representation` | number -> sign/exp/frac | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0979` | Base64 Encoded Size | `base64-length` | bytes -> encoded length | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0980` | Binary Search Steps | `binary-search-steps` | n, target -> comparisons | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0981` | Hash Load Factor | `hash-load-factor` | entries, buckets -> α | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-0982` | Recursion Depth Limit | `recursion-depth` | input size, branching -> depth | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0983` | Algorithm Complexity Classifier | `algorithm-complexity` | operation counts -> O() | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-0984` | Checksum and CRC Estimate | `checksum-crc` | data length, polynomial -> bits | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C63 · Programming and Software Development

`Entries: 12` · `Brief topic(s): 63` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-PRG-01 COCOMO** basic effort `E = a·(KLOC)^b` person-months with mode-specific a,b
  (organic/semi-detached/embedded); the coefficients are from the 1981 COCOMO model and its
  accuracy on modern projects is poor — label it a historical model.
- **F-PRG-02 Function points** weighted sum of inputs/outputs/queries/files/interfaces with
  complexity adjustments; the weighting tables are method-specific (IFPUG).
- **F-PRG-03 Velocity** `completed points/sprint`; only valid within a stable team and
  definition of done. Story points are not time and cannot be converted by a constant factor.
- **F-PRG-04 Cyclomatic complexity** `M = E - N + 2P` from the control-flow graph; it measures
  branching, not readability.
- **F-PRG-05 Coverage** `= executed lines/total lines`; 100% line coverage does not imply
  correctness.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0985` | COCOMO Effort Estimate | `cocomo-effort` | KLOC, mode -> effort, time | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0986` | Function Point Estimate | `function-points` | components -> FP | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-0987` | Sprint Capacity | `sprint-capacity` | team, days, focus -> points | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0988` | Team Velocity | `velocity` | completed, sprints -> average | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0989` | Story Point Conversion | `story-point-conversion` | points, hours -> ratio | `REF-MATH-ELEM` | 2 | P3 | `X` |
| `CALC-0990` | Bug Density | `bug-density` | bugs, KLOC -> density | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-0991` | Test Coverage | `test-coverage` | executed, total -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-0992` | Cyclomatic Complexity | `cyclomatic-complexity` | edges, nodes -> M | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0993` | Technical Debt Ratio | `technical-debt-ratio` | remediation, dev cost -> % | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-0994` | API Rate Limit Budget | `api-rate-limit` | requests, window -> safe rate | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-0995` | Development Time Estimate | `dev-time-estimate` | tasks, uncertainty -> range | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-0996` | Code Review Time | `code-review-time` | diff size, rate -> minutes | `REF-MATH-ELEM` | 1 | P3 | `R` |

**Review notes for this category**

- `CALC-0989` **Story Point Conversion** — Non-linear in reality; must be presented as team-specific only.

### C64 · Networking, IP Addressing and Subnetting

`Entries: 14` · `Brief topic(s): 64` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-NET-01 IPv4 subnetting** mask `/p` gives `2^(32-p)` addresses,
  `2^(32-p) - 2` usable hosts (network and broadcast reserved) — except /31 (RFC 3021 point-to-
  point, 2 usable) and /32. Block size `= 2^(8 - (p mod 8))` within the relevant octet.
- **F-NET-02 Network/broadcast** network `= ip AND mask`; broadcast `= network OR NOT mask`.
- **F-NET-03 Private ranges** RFC 1918: 10/8, 172.16/12, 192.168/16; loopback 127/8;
  link-local 169.254/16. These must be flagged as non-routable.
- **F-NET-04 IPv6** a /64 is the standard host subnet; `2^64` addresses; `2^(128-p)` subnets.
- **F-NET-05 Transfer time** `t = size/throughput` with consistent units (Mbps vs MB/s is a
  factor-of-8 trap), plus protocol overhead and latency-bandwidth product for realistic estimates.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-0997` | CIDR Subnet Calculator | `cidr-subnet` | CIDR, ip -> mask, hosts | `REF-MATH-ELEM` | 2 | P0 | `R` |
| `CALC-0998` | Hosts per Subnet | `hosts-per-subnet` | prefix -> usable hosts | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-0999` | Subnet Split (VLSM) | `subnet-split` | network, requirements -> subnets | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1000` | IP Range from CIDR | `ip-range` | CIDR -> first, last, count | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1001` | Wildcard Mask | `wildcard-mask` | subnet mask -> wildcard | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1002` | Network and Broadcast Address | `network-broadcast` | ip, mask -> addresses | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1003` | IPv6 Subnet Calculator | `ipv6-subnet` | prefix, /n -> subnets | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1004` | Subnet Overlap Check | `subnet-overlap-check` | two CIDRs -> overlap? | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1005` | DHCP Range Size | `dhcp-range-size` | start, end, exclusions -> pool | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1006` | Bandwidth Transfer Time | `bandwidth-transfer-time` | size, speed -> time | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1007` | Throughput Efficiency | `throughput-efficiency` | goodput, line rate -> % | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1008` | MTU and Fragmentation | `mtu-fragmentation` | MTU, packet size -> fragments | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1009` | Latency-Bandwidth Product | `latency-bandwidth-product` | RTT, bandwidth -> bytes in flight | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1010` | Port Range Reference | `port-range` | service -> port | `REF-MATH-ELEM` | 1 | P3 | `R` |

### C65 · Data Storage and File Size

`Entries: 9` · `Brief topic(s): 65` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-STO-01 Decimal vs binary prefixes** kB = 10³, KiB = 2¹⁰; a "500 GB" drive is
  500×10⁹ bytes = 465.7 GiB, which is the entire basis of the "missing space" complaint.
- **F-STO-02 Media size** `bytes = bitrate(bps) × duration(s)/8`; audio/video containers add
  per-track overhead and metadata — the result is an estimate.
- **F-STO-03 RAID capacity** RAID 0 `= n×min`, RAID 1 `= min`, RAID 5 `= (n-1)×min`,
  RAID 6 `= (n-2)×min`, RAID 10 `= n/2×min` (usable, assuming equal disks). Rebuild time and
  failure risk grow with disk size.
- **F-STO-04 Compression ratio** `= original/compressed`; entropy limits mean ratios above
  ~2-4× for already-compressed media indicate lossy processing.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1011` | File Size from Bitrate | `file-size-bitrate` | bitrate, duration -> MB | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1012` | Storage Unit Conversion | `storage-unit-conversion` | decimal <-> binary | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1013` | RAID Capacity | `raid-capacity` | disks, level -> usable | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1014` | Backup Size Estimate | `backup-size` | data, retention, dedupe -> size | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1015` | Compression Ratio (Data) | `data-compression-ratio` | original, compressed -> ratio | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1016` | Storage Transfer Time | `transfer-time-storage` | size, interface speed -> time | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1017` | Database Size Estimate | `database-size` | rows, row size, indexes -> GB | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1018` | Log Volume Estimate | `log-volume` | events/s, event size -> GB/day | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1019` | Tape Rotation Schedule | `tape-rotation` | retention, media -> media count | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C66 · Web Development and Digital Design

`Entries: 10` · `Brief topic(s): 66` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-WEB-01 Aspect ratio** `w/h`; resizing keeps the ratio, and "16:9" is a ratio, not a size.
- **F-WEB-02 Typographic scale** modular scale `size_n = base × ratio^n`; ratio choices
  (1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618) are design decisions, not laws.
- **F-WEB-03 Colour contrast** WCAG 2.2 (W3C Recommendation, 12 December 2024) requires
  `(L1 + 0.05)/(L2 + 0.05)` where L is relative luminance with sRGB linearisation; thresholds
  4.5:1 normal text, 3:1 large text (≥18pt or 14pt bold) and UI components.
- **F-WEB-04 Performance budgets** page weight, LCP/INP/CLS thresholds are user-defined targets;
  there is no universal "passing" byte count — only published Core Web Vitals thresholds for
  timing metrics.
- **F-WEB-05 rem/px** conversion depends on the root font size (usually but not always 16px),
  so the root size must be an input.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1020` | Aspect Ratio | `aspect-ratio` | width, height -> ratio | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1021` | PX to REM | `px-rem-conversion` | px, root size -> rem | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1022` | Colour Contrast Ratio | `color-contrast` | two colours -> ratio, WCAG | `REF-MATH-ELEM` | 2 | P1 | `S` |
| `CALC-1023` | Hex to RGB | `hex-rgb` | hex -> rgb, hsl | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1024` | Modular Type Scale | `modular-scale` | base, ratio, steps -> sizes | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1025` | Grid Column Calculator | `grid-columns` | container, gutter, cols -> width | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1026` | Responsive Image Sizes | `responsive-image-sizes` | viewport, DPR -> srcset | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1027` | Page Weight Budget | `page-weight-budget` | assets -> total, budget | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1028` | Performance Budget | `performance-budget` | targets, current -> variance | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1029` | Breakpoint Calculator | `breakpoint-calculator` | content width, gaps -> breakpoints | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-1022` **Colour Contrast Ratio** — Contrast formula and thresholds align with WCAG 2.2 (inspected); exact hue math still to be unit-tested.

### C67 · Image, Video and Media

`Entries: 14` · `Brief topic(s): 67` · `Priorities present: P0, P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-MED-01 Resolution** `pixels = width × height`; megapixels `= pixels/1e6`.
- **F-MED-02 Storage** `size = bitrate × duration/8`; bitrate in Mbps yields MB.
- **F-MED-03 Frame rate conversion** retiming changes duration (`frames/old_fps` vs
  `frames/new_fps`); audio must be resampled or pitch-shifted — a calculator cannot silently
  assume either.
- **F-MED-04 Bandwidth** `required = bitrate × concurrent viewers`; adaptive streaming uses
  multiple renditions, so per-viewer average differs from top rendition.
- **F-MED-05 Print resolution** effective PPI `= pixels/print_inches`; 300 PPI is a common
  photo-print convention, not a universal requirement (large-format viewing distance reduces it).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1030` | Video Storage Size | `video-storage-size` | bitrate, duration -> GB | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1031` | Video Bitrate Target | `video-bitrate` | resolution, fps, quality -> Mbps | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1032` | Streaming Bandwidth | `streaming-bandwidth` | bitrate, viewers -> Mbps | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1033` | Video Duration from Size | `video-duration` | size, bitrate -> duration | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1034` | Frame Rate Conversion | `frame-rate-conversion` | fps, frames -> duration | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1035` | Video Aspect Conversion | `video-aspect-conversion` | source, target -> crop/pad | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1036` | Render Time Estimate | `render-time` | frames, seconds/frame -> hours | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1037` | GIF Size Estimate | `gif-size` | frames, size, palette -> MB | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1038` | Podcast File Size | `podcast-file-size` | bitrate, minutes -> MB | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1039` | Megapixel Resolution | `megapixel-resolution` | width, height -> MP | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1040` | Slideshow Duration | `slideshow-duration` | slides, per-slide -> total | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1041` | Media Archive Size | `media-archive-size` | assets, duration -> TB | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1042` | Upload Time | `upload-time` | file size, uplink -> time | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1043` | Transcode Storage Multiplier | `transcode-multiplier` | renditions, bitrates -> total | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C68 · Photography and Optics

`Entries: 14` · `Brief topic(s): 68` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-PHO-01 Depth of field** hyperfocal `H = f²/(N·c) + f`; near limit
  `s = H·d/(H + (d-f))`, far `= H·d/(H - (d-f))`; circle of confusion c is format-dependent and
  must be an input (0.03 mm for 35 mm full frame is a convention, not physics).
- **F-PHO-02 Exposure** `EV = log2(N²/t)` at ISO 100; the exposure triangle scales with ISO:
  `EV_ISO = EV_100 - log2(ISO/100)`. Stops are base-2: 1 stop = ×2 light.
- **F-PHO-03 ND filters** `stops = log2(t_with/t_without)`; a 10-stop ND multiplies exposure
  time by 1024.
- **F-PHO-04 Crop factor** `equivalent_focal = f × crop`; it changes field of view, NOT
  perspective or exposure (f-number equivalence is a separate, often-misapplied concept).
- **F-PHO-05 Print size** `inches = pixels/PPI`; resampling does not add real detail.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1044` | Depth of Field | `depth-of-field` | focal, aperture, distance, CoC -> DoF | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1045` | Hyperfocal Distance | `hyperfocal-distance` | focal, aperture, CoC -> H | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1046` | Exposure Value | `exposure-ev` | aperture, shutter, ISO -> EV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1047` | ND Filter Stops | `nd-filter-stops` | shutter before/after -> stops | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1048` | Flash Guide Number | `flash-guide-number` | GN, distance -> aperture | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1049` | Crop Factor and Equivalent Focal Length | `crop-factor` | focal, sensor -> equivalent | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1050` | Print Size and PPI | `print-size-ppi` | pixels, print size -> PPI | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1051` | Field of View | `field-of-view` | focal, sensor -> angle | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1052` | Sunny 16 Exposure | `sunny-16` | conditions -> exposure | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1053` | Shutter Angle | `shutter-angle` | fps, angle -> shutter speed | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1054` | Star Trail Exposure | `star-trail-exposure` | focal, declination -> max time | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1055` | Time-Lapse Interval | `timelapse-interval` | event duration, clip length -> interval | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1056` | Macro Magnification | `macro-magnification` | extension, focal -> magnification | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1057` | Lens Aperture Area | `lens-aperture-area` | focal, f-number -> area | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C69 · Audio and Acoustics

`Entries: 12` · `Brief topic(s): 69` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-AUD-01 Decibels** power `dB = 10log10(P1/P2)`; amplitude `20log10(A1/A2)`;
  digital full scale dBFS, analog dBu (`0 dBu = 0.775 V`) and SPL (dB re 20 µPa) are DIFFERENT
  references and must not be mixed.
- **F-AUD-02 Summing levels** incoherent sources add as power: `L_total = 10log10(Σ10^(Li/10))`;
  two equal 80 dB sources give 83 dB, not 160 dB.
- **F-AUD-03 Room modes** axial `f = 343/(2L)` for a rigid-walled rectangular room; real rooms
  with absorption and non-parallel walls differ.
- **F-AUD-04 Speaker delay** `t = distance/343` m/s (at 20 °C, 343 m/s; temperature-dependent).
- **F-AUD-05 Digital audio** dynamic range ≈ `6.02×bits` dB; file size
  `= sample_rate × bits × channels × seconds/8`.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1058` | Decibel Addition | `db-spl-addition` | multiple levels -> combined | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1059` | Decibel Conversion (dBu/dBV/SPL/dBFS) | `decibel-conversion` | level, reference -> other | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1060` | Speaker Impedance and Power | `speaker-impedance` | amp, speakers -> load, power | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1061` | Amplifier Power Requirement | `amplifier-power` | sensitivity, distance, SPL -> watts | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1062` | Room Mode Frequency | `room-mode-frequency` | room dims -> axial modes | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1063` | Wavelength and Frequency | `wavelength-frequency` | f or λ -> other | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1064` | Speaker Delay and Distance | `speaker-delay-distance` | distance, temp -> delay | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1065` | Dynamic Range | `dynamic-range` | bit depth -> dB | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1066` | Bit Depth and Resolution | `bit-depth-resolution` | bits, range -> LSB | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1067` | Sample Rate Requirement | `sample-rate-requirement` | max frequency -> Nyquist | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1068` | Audio Latency | `audio-latency` | buffer, sample rate -> ms | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1069` | Perceived Loudness Change | `loudness-perception` | dB change -> perceived | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C70 · Telecommunications

`Entries: 10` · `Brief topic(s): 70` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TEL-01 Shannon-Hartley** `C = B·log2(1 + S/N)`; S/N is a linear power ratio, not dB —
  passing dB directly is the classic error (convert: `SNR_linear = 10^(SNR_dB/10)`).
- **F-TEL-02 Friis** `FSPL(dB) = 20log10(d) + 20log10(f) + 20log10(4π/c)`; in the common form
  `FSPL(dB) = 32.45 + 20log10(f_MHz) + 20log10(d_km)`.
- **F-TEL-03 Link budget** `P_rx = P_tx + G_tx - L + G_rx`; the result must be compared with
  receiver sensitivity and a stated fade margin.
- **F-TEL-04 Fresnel zone** first zone radius `r = 17.32√(d1·d2/(f·D))` (metres, km, GHz);
  60% clearance is the usual planning criterion.
- **F-TEL-05 Erlang B** blocking probability from traffic intensity; the recursion is
  numerically stable and must be implemented iteratively, not from a lookup table.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1070` | Shannon Capacity | `shannon-capacity` | bandwidth, SNR -> capacity | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1071` | Free Space Path Loss | `friis-path-loss` | distance, frequency -> dB | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1072` | Link Budget | `link-budget` | tx power, gains, losses -> rx power | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1073` | Fresnel Zone Radius | `fresnel-zone` | distance, frequency -> radius | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1074` | EIRP | `eirp` | tx power, antenna gain, loss -> EIRP | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1075` | Erlang B Blocking | `erlang-traffic` | traffic, channels -> blocking | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-1076` | Antenna Gain | `antenna-gain` | aperture, frequency -> gain | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1077` | Fibre Loss Budget | `fiber-loss-budget` | length, loss/km, splices -> budget | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1078` | Bandwidth per User | `bandwidth-per-user` | capacity, users, oversubscription -> per user | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1079` | Spectral Efficiency | `spectral-efficiency` | throughput, bandwidth -> b/s/Hz | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C71 · Education, Grades and Examination Scoring

`Entries: 14` · `Brief topic(s): 71` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-EDU-01 GPA** `GPA = Σ(credits × grade_points)/Σcredits`; grade-point scales differ
  (4.0, 4.3, 5.0, 10-point, percentage bands) and are institution-specific — never assume 4.0.
- **F-EDU-02 Final grade needed** `needed = (target - current×(1-w))/(w)` where w is the final's
  weight; if `needed > 100` the target is unattainable and the tool must say so rather than
  printing a number above 100.
- **F-EDU-03 Weighted average** `Σ(w_i·x_i)/Σw_i`, with weights summing to 1 or 100% (validate).
- **F-EDU-04 Curving** linear `new = old×scale + offset`; square-root and z-score curves are
  different transformations with different fairness properties — label the method.
- **F-EDU-05 Percentile and standard scores** `T = 50 + 10z`, `stanine`, `z` — these assume a
  reference distribution which must be stated.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1080` | GPA Calculator | `gpa` | courses, credits, grades -> GPA | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1081` | Weighted GPA | `weighted-gpa` | honours weighting -> GPA | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1082` | CGPA Conversion | `cgpa-conversion` | scale -> percentage | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1083` | Grade Needed on Final | `grade-needed-final` | current, target, weight -> needed | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1084` | Test Score Percentage | `test-percentage` | correct, total -> % | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1085` | Standard Score Conversion | `standard-score` | raw, mean, sd -> z, T, stanine | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1086` | Class Rank | `class-rank` | position, class size -> rank, percentile | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1087` | Grading Curve | `grading-curve` | scores, method -> curved | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1088` | Rubric Score | `rubric-score` | criteria, weights -> total | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1089` | Attendance Rate | `attendance-rate` | present, sessions -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1090` | Study Time Planner | `study-time-plan` | topics, deadline -> hours/day | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1091` | Reading Speed | `reading-speed` | words, minutes -> wpm, time | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1092` | Quiz Average | `quiz-average` | scores, drop-lowest -> average | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1093` | Degree Classification | `degree-classification` | module marks -> class | `REF-MATH-ELEM` | 2 | P2 | `X` |

**Review notes for this category**

- `CALC-1093` **Degree Classification** — UK/other classification rules are institution-specific.

### C72 · Research Methodology and Experimental Design

`Entries: 12` · `Brief topic(s): 72` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-RES-01 Power** for a two-sample t-test
  `n per group ≈ 2(z_{1-α/2} + z_{1-β})²σ²/Δ²`; power `= 1-β`. Post-hoc power from an observed
  effect is uninformative and must be discouraged in the tool text.
- **F-RES-02 Effect size** Cohen's d `= (m1-m2)/s_pooled`; Hedges' g applies a small-sample
  correction. Benchmarks (0.2/0.5/0.8) are conventions, not thresholds of importance.
- **F-RES-03 Reliability** Cronbach's α `= (k/(k-1))(1 - Σσ²_i/σ²_total)`; α is not a measure
  of unidimensionality, and high α can coexist with multidimensionality.
- **F-RES-04 Agreement** Cohen's κ `= (po - pe)/(1 - pe)`; interpret with prevalence caution.
- **F-RES-05 Epidemiology** risk ratio `= a/(a+b) ÷ c/(c+d)`; odds ratio
  `= (a·d)/(b·c)`; they diverge when the outcome is common (>10%).

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1094` | Power Analysis | `power-analysis` | effect, α, power -> n | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1095` | Effect Size (Cohen's d) | `effect-size-cohen` | means, sd -> d | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1096` | Cronbach's Alpha | `cronbach-alpha` | item variances -> α | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1097` | Cohen's Kappa | `cohens-kappa` | agreement table -> κ | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1098` | Survey Response Rate | `response-rate` | responses, invited -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1099` | Dropout Adjustment | `dropout-adjustment` | target n, attrition -> recruit n | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1100` | Randomisation List | `randomisation-list` | n, blocks -> sequence | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1101` | Survey Length and Completion | `survey-length` | questions, time -> completion | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1102` | Likert Scoring | `likert-scoring` | responses, weights -> score | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1103` | Meta-Analysis Weight | `meta-analysis-weight` | effect, variance -> weight | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-1104` | Risk Ratio | `risk-ratio` | 2x2 table -> RR, CI | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1105` | Odds Ratio | `odds-ratio` | 2x2 table -> OR, CI | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C73 · Quality Control and Reliability Engineering

`Entries: 18` · `Brief topic(s): 73` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-QC-01 Capability** `Cp = (USL-LSL)/(6σ)`; `Cpk = min(USL-μ, μ-LSL)/(3σ)`.
  Cp says nothing about centring; Cpk does. Pp/Ppk use overall σ instead of within-subgroup σ —
  mixing them is invalid.
- **F-QC-02 Control limits** X̄-R chart: `UCL_X = X̿ + A2·R̄`, `LCL_X = X̿ - A2·R̄`,
  `UCL_R = D4·R̄`, `LCL_R = D3·R̄`; A2/D3/D4 depend on subgroup size (constant tables).
- **F-QC-03 Reliability** exponential `R(t) = e^{-λt}`, `MTBF = 1/λ`; Weibull
  `R(t) = e^{-(t/η)^β}`; Weibull reduces to exponential only when β = 1.
- **F-QC-04 Availability** `A = MTBF/(MTBF+MTTR)`.
- **F-QC-05 FMEA RPN** `S×O×D`; RPN is ordinal and its use as a prioritisation scalar is
  criticised — action priority tables are preferred in AIAG-VDA, which is licensed.
- **F-QC-06 Sigma level** from DPMO via the inverse normal, including the conventional 1.5σ
  shift — state whether the shift is applied.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1106` | Cp and Cpk | `cp-cpk` | USL, LSL, μ, σ -> Cp, Cpk | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1107` | Pp and Ppk | `pp-ppk` | overall σ -> Pp, Ppk | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1108` | X-bar and R Control Chart | `xbar-r-chart` | subgroups -> limits | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1109` | p-Chart | `p-chart` | defectives, sample -> limits | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1110` | c-Chart | `c-chart` | defects per unit -> limits | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1111` | MTBF | `mtbf` | failures, time -> MTBF | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1112` | MTTR | `mttr` | repair time, events -> MTTR | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1113` | Availability | `availability-reliability` | MTBF, MTTR -> A | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1114` | Reliability Function | `reliability-function` | λ or Weibull, t -> R(t) | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1115` | FMEA RPN | `fmea-rpn` | S, O, D -> RPN | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1116` | Sigma Level | `sigma-level` | DPMO -> σ level | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1117` | DPMO | `dpmo` | defects, opportunities -> DPMO | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1118` | Acceptance Sampling Plan | `sampling-plan` | AQL, lot, level -> n, c | `REF-MATH-ELEM` | 4 | P3 | `X` |
| `CALC-1119` | Gage R&R | `gage-rr` | measurements -> %GRR | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-1120` | Arrhenius Life Acceleration | `arrhenius-life` | Ea, temps -> acceleration factor | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1121` | Weibull Shape and Scale | `weibull-shape` | failure times -> β, η | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-1122` | Tolerance Stack-Up | `tolerance-stack` | dimensions, tolerances -> worst case/RSS | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1123` | Bathtub Curve Hazard Rate | `hazard-rate` | λ(t) -> hazard | `REF-MATH-ELEM` | 3 | P3 | `R` |

**Review notes for this category**

- `CALC-1118` **Acceptance Sampling Plan** — ISO 2859-1 tables are licensed.

### C74 · Human Resources and Employment

`Entries: 12` · `Brief topic(s): 75` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-HR-01 Turnover** `= leavers/average headcount ×100` (average `= (start+end)/2`); the
  period and population must be stated or the number is meaningless.
- **F-HR-02 FTE** `= Σ(paid hours)/full-time hours`; part-time, contractor and seasonal
  conversions differ and must be declared.
- **F-HR-03 Cost per hire** `= (internal + external recruiting costs)/hires`; the definition
  (does it include recruiter salary?) changes the result by an order of magnitude — expose it.
- **F-HR-04 Absence** `= absence days/(headcount × working days)×100`; Bradford factor
  `= S²×D` is a policy index, not a legal measure.
- **F-HR-05 Leave** entitlement is statutory and jurisdiction-specific; entitlement calculators
  must select a jurisdiction and show the statute, and must not generalise across countries.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1124` | Headcount Plan | `headcount-plan` | growth, attrition -> hires needed | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1125` | Turnover Rate | `turnover-rate` | leavers, headcount -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1126` | Attrition Cost | `attrition-cost` | salary, replacement cost -> total | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1127` | Cost per Hire | `cost-per-hire` | recruiting costs, hires -> cost | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1128` | Time to Hire | `time-to-hire` | stages -> days | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1129` | Absence Rate | `absenteeism-rate` | days absent, workdays -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1130` | Span of Control | `span-of-control` | reports, managers -> ratio | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1131` | FTE Calculation | `fte-calculation` | hours, full-time hours -> FTE | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1132` | Leave Entitlement | `leave-entitlement` | jurisdiction, service -> days | `REF-MATH-ELEM` | 2 | P2 | `X` |
| `CALC-1133` | Training Hours per Employee | `training-hours` | hours, headcount -> per employee | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1134` | Engagement Score | `engagement-score` | survey responses -> index | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1135` | Recruitment Funnel Conversion | `recruitment-funnel` | stage counts -> rates | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-1132` **Leave Entitlement** — Statutory; jurisdiction tables required.

### C75 · Insurance and Risk Analysis

`Entries: 14` · `Brief topic(s): 77` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-INS-01 Expected loss** `= probability × severity`; for a portfolio `Σ p_i·s_i`. This is
  an expected value, not a premium: loading, expenses and profit are added by the insurer.
- **F-INS-02 Out-of-pocket** with deductible D, coinsurance c, out-of-pocket maximum M:
  `OOP = min(M, D + c×max(0, cost - D))` for in-network covered services — plan rules vary
  widely and the calculator must display its assumptions.
- **F-INS-03 Deductible break-even** compare plans by total cost at the user's expected spend:
  `total = premium×12 + OOP(expense)`. Comparing premiums alone is a known consumer error.
- **F-INS-04 Life insurance need (DIME)** `debt + income×years + mortgage + education -
  assets`; a needs analysis, not a recommendation, and it must not be presented as advice.
- **F-INS-05 Loss ratio** `= claims/premium`; combined ratio `= loss ratio + expense ratio`;
  <100% indicates underwriting profit before investment income.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1136` | Life Insurance Needs (DIME) | `life-insurance-need` | debt, income, assets -> cover | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1137` | Deductible Break-Even | `deductible-breakeven` | plans, expected spend -> cheaper | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1138` | Coinsurance Cost | `coinsurance-cost` | bill, deductible, rate -> share | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1139` | Out-of-Pocket Maximum | `out-of-pocket-max` | costs, plan -> OOP | `REF-MATH-ELEM` | 3 | P1 | `R` |
| `CALC-1140` | Claim Payout | `claim-payout` | loss, deductible, limit -> payout | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1141` | Expected Loss | `expected-loss` | probability, severity -> EL | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1142` | Loss Ratio | `loss-ratio` | claims, premium -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1143` | Combined Ratio | `combined-ratio` | loss, expense -> % | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1144` | Premium per 1000 of Cover | `premium-per-1000` | premium, sum assured -> rate | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1145` | Replacement Cost | `replacement-cost` | area, rate, contents -> sum insured | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1146` | Business Interruption Cover | `business-interruption` | profit, period -> sum insured | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1147` | Risk of Ruin | `risk-of-ruin` | edge, bankroll -> probability | `REF-MATH-ELEM` | 4 | P3 | `R` |
| `CALC-1148` | Coverage Gap | `coverage-gap` | need, existing -> gap | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1149` | Premium Financing Cost | `premium-financing` | premium, APR, months -> cost | `REF-MATH-ELEM` | 2 | P3 | `R` |

### C76 · Legal and Regulatory Calculations

`Entries: 9` · `Brief topic(s): 78` · `Priorities present: P2, P3`

**Formula families, variables, assumptions and edge cases**

  **WARNING: this category is informational only.** Nothing here is legal advice, and no output
  may be presented as a legal entitlement. Every calculator requires: jurisdiction selector,
  statute/rule citation, effective date, and a prominent "not legal advice" notice. Where a rule
  is discretionary (courts, tribunals), the tool must refuse to output a figure or must label it
  a range with the governing discretion stated.
- **F-LEG-01 Judgment interest** simple or compound per the governing statute; the rate and
  compounding basis are jurisdictional, and post-judgment rates often differ from pre-judgment.
- **F-LEG-02 Limitation periods** are procedural rules that vary by claim type and can be
  paused/tolled; a date arithmetic tool must not imply a claim is time-barred.
- **F-LEG-03 Statutory payments** (redundancy, notice, child support) come from tables/formulas
  in statute; the version and jurisdiction must be displayed and updated on a review cadence.
- **F-LEG-04 Damages** expectation = loss of bargain; compounding of lost profits requires a
  discount rate assumption which must be user-supplied and displayed.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1150` | Judgment Interest | `judgment-interest` | principal, rate, period -> interest | `REF-MATH-ELEM` | 2 | P2 | `X` |
| `CALC-1151` | Contract Notice Period | `contract-notice-period` | dates, clause -> notice date | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1152` | Limitation Period Deadline | `limitation-period` | claim type, accrual -> deadline | `REF-MATH-ELEM` | 2 | P2 | `X` |
| `CALC-1153` | Inheritance Share | `inheritance-share` | estate, heirs, rules -> shares | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1154` | Damages with Discounting | `damages-calculation` | loss stream, discount rate -> PV | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1155` | Lease Notice and Break Date | `lease-notice-period` | term, notice -> dates | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1156` | Child Support Estimate | `child-support-estimate` | income, children -> amount | `REF-MATH-ELEM` | 4 | P2 | `X` |
| `CALC-1157` | Redundancy Pay | `redundancy-pay` | age, service, wage -> statutory pay | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1158` | Court Deadline (Days) | `legal-deadline` | service date, days, rules -> deadline | `REF-MATH-ELEM` | 2 | P2 | `R` |

**Review notes for this category**

- `CALC-1150` **Judgment Interest** — Jurisdiction-specific; legal review required.
- `CALC-1152` **Limitation Period Deadline** — Procedural law varies; not legal advice.
- `CALC-1153` **Inheritance Share** — Forced-heirship and intestacy rules vary by jurisdiction and school of law.
- `CALC-1156` **Child Support Estimate** — Statutory guidelines; jurisdiction-specific; legal review mandatory.
- `CALC-1157` **Redundancy Pay** — Statutory table required per jurisdiction.

### C77 · Gaming, Odds and Probability

`Entries: 12` · `Brief topic(s): 79` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-GAM-01 Expected value** `EV = Σ p_i·payoff_i`; a positive EV game still has variance and
  risk of ruin — the two must be reported together.
- **F-GAM-02 Odds conversion** decimal `d`; fractional `a/b` -> `d = 1 + a/b`;
  American: positive `+m` -> `d = 1 + m/100`, negative `-m` -> `d = 1 + 100/m`;
  implied probability `= 1/d` (before removing vig).
- **F-GAM-03 Vig removal** for two-way markets: `p_i' = (1/d_i)/Σ(1/d_j)`.
- **F-GAM-04 Kelly** `f* = (bp - q)/b` for fractional odds b, win prob p, q = 1-p; full Kelly is
  growth-optimal but has large drawdowns, so fractional Kelly is common practice.
- **F-GAM-05 House edge** `= 1 - Σ(p_i·payout_i)` per unit staked; lottery odds
  `= 1/C(n,k)` for an exact-match draw.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1159` | Expected Value of a Bet | `expected-value-bet` | odds, stake, prob -> EV | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1160` | House Edge | `house-edge` | payouts, probabilities -> edge | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1161` | Pot Odds | `pot-odds` | pot, bet -> odds, break-even equity | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1162` | Implied Probability | `implied-probability` | odds -> probability | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1163` | Odds Format Conversion | `odds-conversion` | decimal/fractional/american -> all | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1164` | Parlay Odds | `parlay-odds` | legs -> combined odds | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1165` | Kelly Criterion | `kelly-criterion` | edge, odds -> stake | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1166` | Vig Removal | `vig-removal` | two-way odds -> fair probability | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1167` | Poker Outs and Equity | `poker-outs` | outs, cards left -> equity | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1168` | Lottery Odds | `lottery-odds` | numbers, draws -> probability | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1169` | Break-Even Win Rate | `break-even-win-rate` | odds -> win% needed | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1170` | Betting Variance | `betting-variance` | bets, stake, p -> σ, drawdown | `REF-MATH-ELEM` | 3 | P3 | `R` |

### C78 · Sports and Athletic Performance Metrics

`Entries: 12` · `Brief topic(s): 80` · `Priorities present: P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-SPT-01 Baseball** batting average `= H/AB`; OBP `= (H+BB+HBP)/(AB+BB+HBP+SF)`;
  SLG `= TB/AB`; OPS `= OBP+SLG`; ERA `= 9×ER/IP`; WHIP `= (BB+H)/(IP)`.
  These are defined conventions (official scoring rules) and denominators must not be swapped.
- **F-SPT-02 Cricket** run rate `= runs/overs`; required run rate and net run rate use different
  denominators (NRR uses runs per over minus conceded rate).
- **F-SPT-03 Elo** `E_a = 1/(1 + 10^((R_b-R_a)/400))`; K-factor choice drives responsiveness;
  the 400 constant is a convention of the chess implementation.
- **F-SPT-04 Basketball** TS% `= PTS/(2×(FGA + 0.44×FTA))`; the 0.44 coefficient is an empirical
  estimate of free-throw possessions.
- **F-SPT-05 Handicap (golf)** course handicap uses slope rating:
  `CH = index × slope/113 + (CR - par)`; the 113 is a defined standard slope.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1171` | Batting Average | `batting-average` | hits, at-bats -> AVG | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1172` | Earned Run Average | `earned-run-average` | earned runs, innings -> ERA | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1173` | WHIP | `whip` | walks, hits, innings -> WHIP | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1174` | Slugging Percentage | `slugging-percentage` | total bases, at-bats -> SLG | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1175` | On-Base Percentage | `on-base-percentage` | hits, walks, PA -> OBP | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1176` | True Shooting Percentage | `true-shooting` | points, FGA, FTA -> TS% | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1177` | Elo Rating Change | `elo-rating` | ratings, result, K -> new ratings | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1178` | Win Probability from Rating | `win-probability` | rating gap -> probability | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1179` | Tournament Points | `tournament-points` | placements, weights -> total | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1180` | Golf Course Handicap | `handicap-index` | index, slope, CR, par -> CH | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1181` | Cricket Run Rate | `cricket-run-rate` | runs, overs -> RR, NRR | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1182` | Goal Difference and Points | `football-goal-difference` | results -> GD, points | `REF-MATH-ELEM` | 1 | P3 | `R` |

### C79 · Travel and Trip Planning

`Entries: 12` · `Brief topic(s): 81` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TRV-01 Trip cost** `= transport + accommodation×nights + per-diem×days + activities`
  plus a contingency percentage; currency conversion must use a user-supplied or dated rate.
- **F-TRV-02 Driving time** `= distance/average speed + breaks`; average speed must reflect road
  type, and fuel/charging cost should use consumption, not a flat rate.
- **F-TRV-03 Jet lag** recovery estimates (≈1 day per time zone eastbound, ~0.75 westbound) are
  empirical rules of thumb and must be labelled as such — they are not clinical guidance.
- **F-TRV-04 Baggage** `total = Σ item weights`; airline limits are per-carrier and per-fare-class,
  so limit values must be user inputs with cited defaults.
- **F-TRV-05 Travel insurance** premium ≈ rate × trip cost × days, but exclusions dominate real
  risk; the tool must not imply coverage.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1183` | Trip Cost | `trip-cost` | transport, lodging, food -> total | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1184` | Cost Sharing per Person | `cost-per-person-share` | total, people, shares -> per person | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1185` | Daily Travel Budget | `travel-budget-per-day` | budget, days -> per day | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1186` | Jet Lag Recovery | `jet-lag-recovery` | time zones, direction -> days | `REF-MATH-ELEM` | 2 | P3 | `R` |
| `CALC-1187` | Great-Circle Flight Distance | `flight-distance` | airports -> km, time | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1188` | Driving Time and Cost | `driving-time` | distance, speed, consumption -> time, cost | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1189` | Rest Stop Planning | `rest-stop-planning` | duration, interval -> stops | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1190` | Baggage Weight Total | `luggage-weight` | items, limit -> total, excess | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1191` | Hotel Cost per Night | `hotel-cost-per-night` | total, nights, taxes -> per night | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1192` | Travel Insurance Cost | `travel-insurance-cost` | trip cost, days, rate -> premium | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1193` | Multi-City Route Distance | `multi-city-distance` | legs -> total distance | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1194` | Time Zone Difference | `timezone-difference` | zones -> offset, call window | `REF-MATH-ELEM` | 1 | P1 | `R` |

### C80 · Household Budgets and Personal Finance

`Entries: 14` · `Brief topic(s): 82` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-HHD-01 Budget split** the 50/30/20 rule is a popular heuristic, not a standard; needs,
  wants and savings definitions vary by household, so category mapping must be user-editable.
- **F-HHD-02 Savings rate** `= savings/gross income` (state gross vs net; both are used).
- **F-HHD-03 Emergency fund** `= essential monthly expenses × months`; "3-6 months" is guidance,
  not a rule, and depends on income stability.
- **F-HHD-04 Net worth** `= assets - liabilities`; illiquid assets and pension entitlements must
  be handled per the stated definition.
- **F-HHD-05 Goal timeline** `n = ln(FV·i/PMT + 1)/ln(1+i)`; if `PMT ≤ FV·i` the goal is never
  reached — the tool must say so explicitly rather than returning an enormous number.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1195` | 50/30/20 Budget | `fifty-thirty-twenty` | income -> needs, wants, savings | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1196` | Savings Rate | `savings-rate` | savings, income -> % | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1197` | Emergency Fund | `emergency-fund` | expenses, months -> target | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1198` | Net Worth | `net-worth` | assets, liabilities -> net worth | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1199` | Subscription Cost Tracker | `subscription-cost` | subscriptions -> annual total | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1200` | Utility Bill Split | `utility-split` | bill, occupants -> shares | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1201` | Rent Affordability | `rent-affordability` | income, ratio -> max rent | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1202` | Grocery Budget | `grocery-budget` | household, weeks -> budget | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1203` | Sinking Fund | `sinking-fund` | target, months -> monthly set-aside | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1204` | Monthly Cash Flow | `cash-flow-monthly` | income, expenses -> net | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1205` | Cost of Living Comparison | `cost-of-living-index` | index, income -> equivalent | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1206` | Envelope Budget | `envelope-budget` | income, categories -> envelopes | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1207` | Goal Savings Timeline | `goal-savings-timeline` | target, rate, return -> months | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1208` | Budget Variance | `home-budget-variance` | budget, actual -> variance | `REF-MATH-ELEM` | 1 | P2 | `R` |

### C81 · Retail Pricing and Shopping

`Entries: 10` · `Brief topic(s): 83` · `Priorities present: P0, P1, P2`

**Formula families, variables, assumptions and edge cases**

- **F-RTL-01 Sale price** `= price×(1-discount)`; stacked discounts multiply (see F-PRC-02).
- **F-RTL-02 Unit price** `= price/quantity`; comparing across packs requires the same unit and
  the same tax basis, otherwise the comparison is invalid.
- **F-RTL-03 Tip** `= bill×tip%`; splitting must define whether tax and service charge are
  included in the base — three reasonable conventions produce different totals.
- **F-RTL-04 BOGO** "buy one get one 50% off" is 25% off two items, not 50% off — the effective
  discount depends on how many items are purchased.
- **F-RTL-05 Cashback** `= spend × rate`, and it is not equivalent to a discount if it expires
  or is paid in restricted points.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1209` | Sale Price | `sale-price` | price, discount -> final | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1210` | Percent Off | `percent-off` | price, % -> saving | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1211` | Buy-One-Get-One Value | `bogo-value` | price, offer -> effective discount | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1212` | Tip Calculator | `tip-calculator` | bill, tip%, split -> per person | `REF-MATH-ELEM` | 1 | P0 | `R` |
| `CALC-1213` | Bill Split | `bill-split` | total, people, tax -> shares | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1214` | Service Charge and Tax | `service-charge` | bill, service, tax -> total | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1215` | Price Match Savings | `price-match-savings` | prices -> saving | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1216` | Clearance Price Ladder | `clearance-price` | original, steps -> prices | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1217` | Cashback Value | `cashback-value` | spend, rate, expiry -> value | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1218` | Landed Retail Price | `landed-retail-price` | cost, shipping, tax -> total | `REF-MATH-ELEM` | 2 | P2 | `R` |

### C82 · Pets and Animal Care

`Entries: 8` · `Brief topic(s): 84` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-PET-01 Pet age** the "×7" rule is a myth; the AVMA/AAHA approach uses species- and
  size-specific curves (e.g. a 1-year-old dog ≈15 human years). Any conversion must cite its
  source table and be labelled an estimate.
- **F-PET-02 Energy requirement** resting energy `RER = 70×(kg)^0.75` kcal/day;
  maintenance `MER = RER × factor` where the factor depends on life stage and neuter status
  (WSAVA/AAHA guidance). Body condition score matters more than the formula.
- **F-PET-03 Water intake** ≈50-60 mL/kg/day for dogs and cats is a clinical rule of thumb;
  illness changes it, so it must not be used for diagnosis.
- **F-PET-04 Aquarium volume** `= L×W×H/1000` litres (internal dimensions), then subtract
  substrate and decor displacement; stocking rules ("1 inch per gallon") are folklore with no
  welfare basis and must be labelled as such.
- **F-PET-05 Medication** dosing is prescription-only; the tool may compute a mg/kg amount but
  must require a prescriber-supplied dose and show a hard warning.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1219` | Pet Age in Human Years | `pet-age-human-years` | species, age -> human years | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1220` | Pet Calorie Requirement | `pet-calorie-mer` | weight, life stage -> kcal/day | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1221` | Pet Food Portion | `pet-food-portion` | kcal/day, food density -> grams | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1222` | Pet Water Intake | `pet-water-intake` | weight -> mL/day | `REF-MATH-ELEM` | 1 | P3 | `R` |
| `CALC-1223` | Aquarium Volume | `aquarium-volume` | dims, displacement -> litres | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1224` | Fish Stocking Density | `fish-stocking-density` | volume, species -> advisory | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-1225` | Pet Medication Dose | `pet-medication-dose` | weight, mg/kg -> dose | `REF-MATH-ELEM` | 3 | P3 | `X` |
| `CALC-1226` | Pet Insurance Cost | `pet-insurance-cost` | species, age, cover -> premium | `REF-MATH-ELEM` | 2 | P3 | `R` |

**Review notes for this category**

- `CALC-1219` **Pet Age in Human Years** — Species/size curves must be sourced; the x7 rule is invalid.
- `CALC-1224` **Fish Stocking Density** — Folklore rules; must not be presented as welfare guidance.
- `CALC-1225` **Pet Medication Dose** — Prescription-only; veterinary review required.

### C83 · Specialised Trades and Building Services

`Entries: 14` · `Brief topic(s): 85, 86` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-TRD-01 Occupancy load** `= floor area/area per occupant` from the applicable building
  code table (function of use). The table values are code-specific and licensed — they must be
  supplied as cited data, never invented.
- **F-TRD-02 Egress width** `= occupant load × width per person`; clear width, not nominal, and
  minimums apply. Code-dependent → SPECIALIST_REVIEW_REQUIRED.
- **F-TRD-03 Lighting** `E = Φ×CU×MF/A` (lumen method); CU and MF are project-specific, so
  defaults must be stated and ranges shown.
- **F-TRD-04 Pool chemistry** free chlorine depends on cyanuric acid (FC/CYA ratio); simple
  "ppm" targets without CYA are misleading — state the model used.
- **F-TRD-05 Septic sizing** `= bedrooms × daily flow × retention` per local regulation; the
  rule set is jurisdictional.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1227` | Occupancy Load | `occupancy-load` | area, use -> occupants | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1228` | Egress Width | `egress-width` | occupants, rate -> width | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1229` | Parking Space Count | `parking-space-count` | floor area, ratio -> spaces | `REF-MATH-ELEM` | 2 | P2 | `X` |
| `CALC-1230` | Restroom Fixture Count | `restroom-fixture-count` | occupants, sex split -> fixtures | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1231` | Fire Extinguisher Coverage | `fire-extinguisher-coverage` | area, hazard -> units | `REF-MATH-ELEM` | 2 | P3 | `X` |
| `CALC-1232` | Lighting Level (Lumen Method) | `lighting-level` | lumens, CU, MF, area -> lux | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1233` | Swimming Pool Volume | `pool-volume` | dims, shape -> m3, litres | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1234` | Pool Chlorine Dose | `pool-chlorine-dose` | volume, target ppm -> grams | `REF-MATH-ELEM` | 3 | P2 | `R` |
| `CALC-1235` | Septic Tank Size | `septic-tank-size` | bedrooms, flow -> litres | `REF-MATH-ELEM` | 3 | P2 | `X` |
| `CALC-1236` | Fence Post Spacing | `fence-post-spacing` | run, spacing -> posts, rails | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1237` | Driveway Slope | `driveway-slope` | rise, run -> %, grade | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1238` | Acoustic Panel Count | `acoustic-panel-count` | room, RT target -> panels | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1239` | Kitchen Ventilation | `kitchen-ventilation` | appliance load, hood -> CFM | `REF-MATH-ELEM` | 3 | P3 | `R` |
| `CALC-1240` | Sign Area and Permit Limit | `sign-area-permit` | dims, frontage -> area, ratio | `REF-MATH-ELEM` | 2 | P3 | `X` |

**Review notes for this category**

- `CALC-1227` **Occupancy Load** — Building-code table data required.
- `CALC-1228` **Egress Width** — Code-dependent.
- `CALC-1229` **Parking Space Count** — Zoning-dependent.
- `CALC-1230` **Restroom Fixture Count** — Plumbing-code table data required.
- `CALC-1231` **Fire Extinguisher Coverage** — NFPA 10 licensed.
- `CALC-1235` **Septic Tank Size** — Local regulation.
- `CALC-1240` **Sign Area and Permit Limit** — Sign-code dependent.

### C84 · Cross-Domain Utilities

`Entries: 8` · `Brief topic(s): 86` · `Priorities present: P1, P2, P3`

**Formula families, variables, assumptions and edge cases**

- **F-XD-01 Number to words** requires language-specific grammar (scale words, pluralisation,
  hyphenation, "and"); output must be localisation-aware, not English-hardcoded.
- **F-XD-02 Roman numerals** standard form is subtractive with a maximum of three repeats
  (IIII is invalid); values above 3999 traditionally require an overbar — state the convention.
- **F-XD-03 Reading time** `= words/wpm`; 200-250 wpm is a convention, and technical content is
  slower; expose the rate.
- **F-XD-04 Password entropy** `H = L·log2(alphabet size)` for random passwords only; human-chosen
  passwords have far lower effective entropy, so the tool must not imply real-world strength.
- **F-XD-05 Character and word counts** must define what counts as a word (whitespace-delimited
  vs Unicode word boundaries) — the two disagree on hyphenated and CJK text.

| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |
|---|---|---|---|---|---|---|---|
| `CALC-1241` | Number to Words | `number-to-words` | number, language -> words | `REF-MATH-ELEM` | 2 | P1 | `R` |
| `CALC-1242` | Roman Numeral Conversion | `roman-numerals` | number <-> numeral | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1243` | Reading Time | `reading-time` | words, wpm -> minutes | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1244` | Typing Speed | `typing-speed` | words, time, errors -> WPM, accuracy | `REF-MATH-ELEM` | 1 | P2 | `R` |
| `CALC-1245` | Character Count | `character-count` | text -> chars, bytes, lines | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1246` | Word Count | `word-count` | text -> words, sentences | `REF-MATH-ELEM` | 1 | P1 | `R` |
| `CALC-1247` | Password Entropy | `password-entropy` | length, charset -> bits | `REF-MATH-ELEM` | 2 | P2 | `R` |
| `CALC-1248` | QR Code Capacity | `qr-code-capacity` | version, EC level -> bytes | `REF-MATH-ELEM` | 3 | P3 | `R` |

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

59 entries are pre-marked `SPECIALIST_REVIEW_REQUIRED` in §8 (`X` status). The pattern is
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

### 11.1 Method applied to all 1248 entries

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
original information, a substantial description, and a descriptive title. A 1248-page
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
  near-duplicates across 1248 pages.
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

> **Context:** the repository is greenfield (§3). Everything below is a **proposal**, chosen so
> that it can be adopted incrementally and so that no calculator requires a server.

### 13.1 Stack

| Layer | Recommendation | Why (and what it costs) |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript, strict mode** | Static generation for 1248 pages, per-page metadata, image optimisation, ISR only where a data refresh is genuinely needed. Cost: framework churn — pin versions, upgrade deliberately. |
| Rendering | **SSG by default**, ISR for time-sensitive data pages | No server for arithmetic. Server only for sitemap generation and (optionally) OG images. |
| Styling | Tailwind CSS + a small design-token layer | Consistency across hundreds of pages without bespoke CSS per page. |
| Components | Accessible primitives (native inputs, `fieldset`/`legend`, labels tied to inputs) | WCAG 2.2 AA is a requirement, not a nice-to-have (R-013). |
| Numeric core | Pure TS modules; **decimal.js (or big.js) for money**; plain `number` for physical quantities | Money in binary floats produces 0.1+0.2 errors that surface as cents in amortisation tables. |
| Validation | Zod schemas per calculator (input parse, range, unit) | One place to define inputs; feeds both the form and the tests. |
| Unit handling | Shared unit registry with NIST-sourced factors (§23 R-014) | Prevents per-calculator factor drift; single point of audit. |
| Tests | **Vitest** (unit/property) + **Playwright** (E2E, a11y via axe) | Fast unit feedback plus real-browser checks for the input/output path. |
| Catalog | `catalog.csv`/typed registry generated from the same data that produced §8 | The plan and the site cannot diverge. |
| CI | GitHub Actions: typecheck → lint → unit → build → Playwright → link/a11y checks | Every gate in §15 is automated except human review. |
| Hosting | **Vercel** (or any static host) | Preview deploys per PR; negligible cost at low traffic (§17). |
| Monitoring | Privacy-friendly analytics + error reporting (Sentry or equivalent) | Track real failures per calculator slug; no PII in events. |

### 13.2 Directory proposal

```
app/
  (marketing)/page.tsx                  # home, category index
  [category]/page.tsx                   # category hub
  [category]/[slug]/page.tsx            # calculator page (SSG)
  sitemap.ts, robots.ts
components/
  calculator/  CalculatorShell, Field, UnitSelect, ResultCard, WorkedExample, Limitations
  ui/          Button, Tabs, Table, Disclosure
lib/
  units/       registry.ts, convert.ts            # NIST-sourced factors only
  money/       decimal.ts, rounding.ts            # half-up vs half-even explicit
  format/      number.ts, currency.ts, locale.ts
  validation/  schema.ts
calculators/
  <slug>/
    meta.ts            # FormulaVerification + SeoMeta + catalog fields
    formula.ts         # pure function(s): inputs -> outputs, no React, no DOM
    formula.test.ts    # T1-T6 cases
    schema.ts          # Zod input/output schema
    page.tsx
    content.mdx        # explanation, worked example, FAQs, references
registry.ts            # generated index of all calculators
```

### 13.3 Which families need more than static arithmetic

| Family | Need | Implication |
|---|---|---|
| Tax, payroll, benefits (§C17, C18, C14) | Versioned rule tables per jurisdiction/year | Data files with `effectiveFrom`/`reviewBy`; build-time validation; annual update task (§19) |
| Currency conversion (`currency-conversion`) | Live FX | Paid or free-tier API, cached daily, with a visible "as of" timestamp and a manual-rate fallback. Currently static-rate only. |
| Solar yield (§C49), weather (`wind-chill` is static) | Irradiance/weather datasets | External API or offline TMY dataset; NREL PVWatts is the intended reference (ORQ-05). Adds a dependency and rate limits. |
| Freight (`dimensional-weight`) | Carrier divisors change | User-editable divisor with cited defaults; never hard-coded silently |
| Emissions (§C48) | Grid factors per country/year | Versioned dataset with source and year |
| Mortgage/tax (§C11, C12, C17) | Jurisdiction rules | Per-jurisdiction modules; explicit "US only" labelling |
| Structural/electrical (§C25, C27) | Licensed tables | Do **not** ship until licensed access and reviewer sign-off; consider not shipping at all |

### 13.4 Deliberately rejected

- A backend/database for arithmetic. It adds cost, latency, attack surface and privacy exposure
  for zero benefit.
- Client-side-only rendering with no static content (bad for crawlers and for slow devices).
- A single mega-component that branches on slug. Each calculator is a small pure module.
- A shared "generic percentage" component reused for 40 different pages — that is exactly the
  thin-content pattern we are avoiding.

---

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

- **P0 (125)** Foundation and universal, low-risk, high-frequency tools: percentages,
  arithmetic, unit conversion, basic geometry, core finance, OEE basics. Ship first because they
  exercise the whole pipeline with the least verification risk.
- **P1 (360)** High-value general and business tools: full finance suite, taxation (with
  jurisdiction discipline), construction quantities, statistics, health screening basics.
- **P2 (538)** Technical and professional: engineering, manufacturing, logistics, media,
  networking, science.
- **P3 (225)** Advanced, regional, data-dependent, licensed or optimiser-based: structural
  design, licensed-code tools, live-data tools, cutting-stock/nesting, specialist finance.

### 16.2 Batches with completion criteria

| Wave | Scope | Entry gate | Completion criteria |
|---|---|---|---|
| W0 | Foundation | this plan approved | Repo scaffolded; `lib/units`, `lib/money`, `lib/format`, `CalculatorShell`, CI with G1-G8, one P0 calculator end-to-end as the reference implementation |
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

| Item | Low-cost approach | Scaling note |
|---|---|---|
| Hosting | Vercel Hobby/Pro or a static host (Cloudflare Pages, Netlify) | Static pages scale with CDN; cost grows with bandwidth, not CPU |
| Compute | None for arithmetic — all client-side | Only ISR/OG-image functions are server-side |
| Data | JSON/TS tables in-repo, versioned | A DB is needed only if user accounts or saved calculations are added (not planned) |
| External APIs | Avoid initially; add only where the calculation genuinely needs live data (FX, irradiance) with caching and a manual fallback | Each API is a cost, a rate limit, an outage mode and a privacy question |
| CI | GitHub Actions free tier | Watch minutes; Playwright shards if slow |
| Monitoring | Privacy-friendly analytics + error tracking free tiers | Per-slug error dashboards drive maintenance |
| Backups | Git is the source of truth; content in MDX | Add off-repo snapshots only if a CMS is introduced |

Cost drivers to watch: bandwidth from heavy ad scripts (§18), image/OG generation, and any
external API. Deliberately excluded: a database, a search service (static index suffices), and
per-calculation server calls.

---

## 18. Advertising and Privacy Readiness

### 18.1 Policy alignment (inspected evidence)

Google's "misleading functionality" policy (R-005) names sites that claim a tool but route users
to deceptive ads. Therefore: **the calculator must be fully functional before any ad loads**,
and an ad must never occupy the position of the result or intercept input.

### 18.2 Requirements

1. **Consent management** for EEA/UK (GDPR/ePrivacy) and other opt-in jurisdictions; no
   non-essential cookies before consent; consent state readable by the ad layer.
2. **Privacy policy + cookie policy + terms + disclaimer** pages, linked in the footer and in
   the calculator result area where the output could be mistaken for advice.
3. **No personal data in calculations** — inputs never leave the browser; no logging of raw
   input values. Analytics events are aggregate and slug-level.
4. **Ad placement**: below the result and after the explanation; never between H1 and the
   inputs; never sticky-over the mobile keyboard; no interstitials; no auto-playing video.
5. **Core Web Vitals protection**: lazy-load all ad slots, reserve space (no layout shift),
   cap total ad bytes, and exclude ad scripts from the critical path.
6. **Sensitive contexts**: no ads on clinical (`C59`), legal (`C76`) and bereavement/financial-
   hardship pages beyond a single standard slot; consider no ads at all there.
7. **No incentive to click**: no fake buttons, no "download results" gates, no obscured
   "calculate" controls.
8. **Children's content**: none planned; if added, no behavioural advertising.
9. **Ad-network policies** are external and can change; compliance is a recurring review item,
   not a one-time setting. No claim is made that any site built from this plan will be approved.

### 18.3 Analytics

Privacy-first (e.g. Plausible/Umami or GA4 with consent mode): page views, calculator
engagement (a calculation was performed), refusals (invalid input), and error events. **No**
input values, no per-user profiles, no cross-site identifiers.

---

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

- [x] `A` 1248 ≥ 1,200 individually numbered entries
- [x] `A` All IDs unique and sequential (`CALC-0001` … `CALC-1248`)
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

- [ ] Formula research complete — 1168 entries still need citations
- [ ] Independent validation complete — 0 entries validated
- [ ] Licensed standards secured — blocks all `X` entries
- [ ] Any calculator implemented, tested or published

---

## 22. Final Completion Report

1. **Exact Markdown file path** — `docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md`
   (repository `JUBERSALEEM/Calculators`, branch `arena/fd9c69ce-calculators`).
2. **Individually identified entries** — **1248** (sequential IDs `CALC-0001`–`CALC-1248`).
3. **Unique entries after duplicate review** — **1248**. One true duplicate was found and
   consolidated (`inventory-days-supply` removed in favour of `days-of-inventory`, register D16);
   fifteen related pairs were retained with documented distinctions (D1-D15).
4. **Entries with an inspected formula reference** — **21** (`SOURCE_VERIFIED`),
   supported by 13 inspected authoritative documents. A further set shares families whose
   constants are partly supported by those same documents but are not themselves verified.
5. **Entries independently validated** — **0**. No second-source or reference-implementation
   validation has been performed. Nothing may be labelled `INDEPENDENTLY_VALIDATED` yet.
6. **Entries requiring further research** — **1168** (`RESEARCH_REQUIRED`: method
   documented, citation not yet inspected).
7. **Entries requiring specialist review** — **59** (`SPECIALIST_REVIEW_REQUIRED`:
   licensed standard, clinical, legal or safety consequence).
8. **Unresolved duplicate candidates** — **0** high-confidence duplicates. Related-but-distinct
   pairs are documented (D1-D15) with the reason each is not a duplicate.
9. **Categories** — all 84 categories are complete as *catalogs* (formula block + entries).
   Categories needing further research before implementation, in priority order: `C17` taxation
   beyond US federal TY2026, `C18` payroll, `C23` construction quantities, `C25` structural,
   `C27`/`C34` electrical and glazing, `C49` solar, `C57` nutrition, `C59` clinical, `C73`
   quality standards, `C76` legal, `C82` pets.
10. **Tests / automated audits actually run** —
    `tools/build_master_plan.py` on every build: unique ID check, unique slug check, unique name
    check, slug-format regex, status-enum check, inputs→outputs non-empty check, minimum-count
    check (≥1,200), category-total reconciliation, and generation of `catalog.csv`.
    Manual verification performed: repository inventory (`git log`, `git status`, `ls`,
    branch list), Markdown structure review, Markdown table/anchor integrity checks (0 malformed
    tables, 0 unresolved internal anchors), and independent reproduction of eight published
    reference values from four inspected sources — recorded in §9.6. **No calculator test suite exists yet**, and
    none could exist — nothing is implemented.
11. **Limitations, blockers, recommended next action.**
    - Only 13 sources were inspected; 4 research batches were completed out of roughly 20
      planned subject areas. NREL pages were unreachable; FAO equations are images in the HTML;
      NIST's factor table is only partially transcribed. All three are recorded as open items.
    - Licensed standards (ACI, AISC, ASCE, NEC, ASHRAE, ISO, ASTM, IPC) are not accessible and
      must not be reconstructed. This blocks every `X` entry in structural, electrical, glazing
      and quality categories.
    - No keyword data was consulted, so priorities are structural judgements and are labelled as
      such; they should be re-ranked once a licensed dataset is available.
    - **Recommended next action:** approve §13's architecture, build the W0 foundation with CI
      gates G1-G8 and one reference calculator implemented end-to-end (suggested:
      `percentage-change`, `loan-payment`, `length-converter` as three distinct shapes — simple,
      money, unit-based), then start the research batches that unblock the P0/P1 cohorts before
      writing more calculators. Do not commission bulk implementation until at least one
      calculator has passed the full publication gate — that gate is the template for the
      remaining 1248.

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
