# Expansion plan — from the 1,248-entry catalog toward about 4,000 calculators

Status: adopted 2026-10-23. Mirrors `calculators/roadmap-data.ts` (rendered at `/roadmap`).
The generated `CALCULATOR_MASTER_PLAN_1200_PLUS.md` is not edited by hand; this file records the
decisions that supersede it.

## 1. Decisions

| # | Decision | Source |
|---|----------|--------|
| D1 | Target size is about 4,000 calculators, including close variants. | User instruction, 2026-10-23 |
| D2 | Objective O1 is revised: close variants that people search for may have separate pages, provided each states how it differs from its base calculator. The original rule "no keyword-inflated variants" no longer applies. | User instruction, 2026-10-23 |
| D3 | A calculator is marked **Verified** only when a known-answer test asserts its outputs against values computed independently of the code. | Standing rule (no unsupported accuracy claims) |
| D4 | Specialist-review entries (building codes, clinical dosing, statutory tax, licensed tables) stay gated. They are never marked verified without licensed data and a recorded sign-off. | Standing rule |

## 2. Where the gap is

The baseline catalog was written from the master plan's topic list, not from an inventory of
existing calculators. Biology was allotted 10 entries (C47).

External evidence of scale (recorded from earlier web searches; re-check before quoting publicly):

- Omnicalculator reports about **3,938 calculators** in total, with **112 biology** calculators.
- calculat.online reports **139 biology** and **98 ecology** calculators.

These counts are used only to size the gap. No formulas were copied from these sites.

## 3. Phases

| Phase | Goal | Status | Planned additions |
|-------|------|--------|-------------------|
| P0 | Baseline catalog (1,248 entries, 84 categories) | Complete | — |
| P1 | Biology and ecology batch 1: allele frequency, Shannon and Simpson diversity, Lincoln–Petersen, net reproductive rate, Jaccard and Sørensen | Complete (6 added, all verified) | 6 |
| P2 | Life sciences, lab and animal calculators: linkage, inbreeding, osmolarity, plate dilutions, species–area, maintenance energy (published equations) | In progress: batch 2 added 16 (CALC-1255–1270); batch 3 added 6 genetics (CALC-1271–1276); animal energy not started | ~150 (estimate) |
| P3 | Verify the planned catalog: known-answer tests for every closed-form RESEARCH_REQUIRED entry, starting with C01–C16 | Planned | — |
| P4 | Expansion to about 4,000: unit-pair converters, domain variants with distinct inputs, remaining everyday and environmental calculators | Planned | ~2,700 (estimate) |
| P5 | Specialist-review tools (60) | Gated | — |

The P2 and P4 numbers are planning estimates. Actual additions depend on which candidates pass the gate.

## 4. Acceptance gate (every calculator)

1. **Formula source.** A cited standard, or a derivation from a stated textbook result. Write the formula in the spec.
2. **Typed inputs** with units, ranges and integer or positive constraints.
3. **Validation.** Zero denominators, domain limits and impossible inputs return readable errors, never `NaN` or `Infinity`.
4. **Known-answer test.** Expected values computed independently (outside the implementation, for example in Python from the textbook formula). The test lives in `calculators/known-answers-*.test.ts`.
5. **Edge-case tests** for each error path.
6. **Catalog update.** The CSV row gets `Verified (known-answer tested)` only after steps 1–5 pass. `calculators/verification.test.ts` checks that the CSV and `calculators/verified-slugs.ts` agree.
7. **Duplicate check.** Search `docs/project-plan/catalog.csv` by slug and by name first. Batch 1 dropped four candidates because the catalog already had them (`dilution-c1v1`, `molarity`, `chi-square-test`, `punnett-ratio`).

## 5. How a batch is added

1. Choose candidates from the gap list and check each against the catalog for duplicates.
2. Write the spec in `calculators/expansion/specs-expansion.ts` and the catalog entry in `calculators/expansion/catalog-expansion.ts`.
3. Append the CSV rows to `docs/project-plan/catalog.csv` (`formula_ref` is `UNREFERENCED-TEXTBOOK` unless a source is inspected).
4. Compute expected values in Python. Write the known-answer test.
5. Run typecheck, tests, lint and the production build. Regenerate `verified-slugs.ts` from the test files.
6. Update `roadmap-data.ts` counts only if the phase changes.

## 6. Current state (after batch 3)

- 1,276 calculators implemented (1,248 baseline + 28 expansion: batch 1 = 6, batch 2 = 16, batch 3 = 6).
- 86 verified by known-answer tests (58 baseline + 28 expansion).
- 1,130 smoke-tested only; 60 specialist review (serum osmolality moved here from research-required).
- Balance to the 4,000 target: 2,724 calculators.
- All 21 source-verified entries are verified.
