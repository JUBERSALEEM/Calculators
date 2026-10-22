# Calculator Master Plan — 1,200+ Calculators

**Repository:** `JUBERSALEEM/Calculators` · **Branch:** `arena/fd9c69ce-calculators`
**Document status:** Research + catalog + roadmap. **No calculator is implemented.**
**Catalog size:** {{TOTAL}} individually identified entries · {{CATS}} categories ·
{{VERIFIED}} source-verified · {{SPECIALIST}} specialist-review-required · {{RESEARCH}} research-required
**Research access date:** 22 October 2026 (UTC)
**Companion artefact:** [`catalog.csv`](catalog.csv) — machine-readable projection of §8
**Generator:** [`tools/build_master_plan.py`](tools/build_master_plan.py) (IDs, tables, statistics and
integrity checks are generated, so numbers in this file cannot drift from the data)
**Raw research log:** [`research/research-log.md`](research/research-log.md)

> **Read this first.** This plan is deliberately honest about what has and has not been
> verified. It contains a defensible catalog of {{TOTAL}} distinct tools and a full research
> and verification *process*, but only {{VERIFIED}} entries are backed by a source that was
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
a catalog of {{TOTAL}} genuinely distinct tools in {{CATS}} categories, each with a defined formula,
stated assumptions, tested implementation and a reason to exist as its own URL.

**What has been produced.** A complete, machine-checked catalog of **{{TOTAL}} entries** across
**{{CATS}} categories**, each with a stable ID (`CALC-0001` … `CALC-{{TOTAL}}`), a unique slug,
typed inputs/outputs, a formula-family reference, complexity, priority, verification status and
review notes. Every category carries a formula-family block that states the mathematics, the
variable definitions, the validity domain and the boundary behaviour — the parts that are
usually missing from calculator sites and are the usual cause of wrong answers.

**What is genuinely verified.** 13 authoritative documents were opened and inspected
(§4, §23): NIST SP 811 conversion factors, NIST CODATA 2022, FAO Irrigation & Drainage Paper 56,
the US SSA PIA page, CFPB Regulation Z Appendix J, Google's spam and helpful-content
documentation, NWS wind-chill and heat-index pages, IRS tax-year-2026 inflation adjustments,
CDC adult BMI categories, US DOL overtime rules, and WCAG 2.2. Those support {{VERIFIED}}
entries at `SOURCE_VERIFIED` and inform dozens more partly. **{{RESEARCH}} entries remain
`RESEARCH_REQUIRED`** — the method is documented, the citation has not been inspected — and
**{{SPECIALIST}} are `SPECIALIST_REVIEW_REQUIRED`** because they depend on licensed standards,
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
3. Because there is no prior catalog, **all {{TOTAL}} entries are new** and the duplicate
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
