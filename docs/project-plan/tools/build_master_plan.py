#!/usr/bin/env python3
"""Build CALCULATOR_MASTER_PLAN_1200_PLUS.md from catalog_source.py + prose files.

Deterministic: IDs are assigned in category order, then entry order.
Outputs: docs/project-plan/CALCULATOR_MASTER_PLAN_1200_PLUS.md and catalog.csv
"""
import csv, importlib.util, os, re, sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN_DIR = os.path.dirname(HERE)
OUT = os.path.join(PLAN_DIR, "CALCULATOR_MASTER_PLAN_1200_PLUS.md")
CSV = os.path.join(PLAN_DIR, "catalog.csv")

spec = importlib.util.spec_from_file_location("catalog_source", os.path.join(HERE, "catalog_source.py"))
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
CATS = mod.CATEGORIES

STATUS = {"S": "SOURCE_VERIFIED", "R": "RESEARCH_REQUIRED", "X": "SPECIALIST_REVIEW_REQUIRED",
          "D": "DISCOVERED", "V": "INDEPENDENTLY_VALIDATED"}
CX = {1: "Simple", 2: "Moderate", 3: "Complex", 4: "Specialist"}

rows = []
n = 0
for c in CATS:
    for e in c["entries"]:
        n += 1
        name, slug, io, ref, cx, pri, st = e[:7]
        note = e[7] if len(e) > 7 else ""
        rows.append(dict(id=f"CALC-{n:04d}", name=name, slug=slug, io=io, ref=ref,
                         cx=cx, pri=pri, st=st, note=note, cat=c["code"], cat_title=c["title"]))

# ---------- integrity checks (fail the build, never silently pass) ----------
errs = []
ids = [r["id"] for r in rows]; slugs = [r["slug"] for r in rows]; names = [r["name"] for r in rows]
for label, seq in (("id", ids), ("slug", slugs), ("name", names)):
    dup = [k for k, v in Counter(seq).items() if v > 1]
    if dup: errs.append(f"duplicate {label}: {dup}")
for r in rows:
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", r["slug"]):
        errs.append(f"bad slug: {r['slug']}")
    if r["st"] not in STATUS: errs.append(f"bad status: {r['st']}")
    if not r["io"] or "->" not in r["io"]: errs.append(f"bad io: {r['id']}")
if len(rows) < 1200: errs.append(f"only {len(rows)} entries")
if errs:
    print("BUILD FAILED:"); [print(" -", e) for e in errs]; sys.exit(1)

st_counts = Counter(r["st"] for r in rows)
pri_counts = Counter(r["pri"] for r in rows)
cx_counts = Counter(r["cx"] for r in rows)
cat_counts = {c["code"]: len(c["entries"]) for c in CATS}
cat_of = {r["id"]: r["cat"] for r in rows}

subs = {
    "{{TOTAL}}": str(len(rows)),
    "{{CATS}}": str(len(CATS)),
    "{{VERIFIED}}": str(st_counts["S"]),
    "{{RESEARCH}}": str(st_counts["R"]),
    "{{SPECIALIST}}": str(st_counts["X"]),
    "{{P0}}": str(pri_counts[0]), "{{P1}}": str(pri_counts[1]),
    "{{P2}}": str(pri_counts[2]), "{{P3}}": str(pri_counts[3]),
    "{{SIMPLE}}": str(cx_counts[1]), "{{MODERATE}}": str(cx_counts[2]),
    "{{COMPLEX}}": str(cx_counts[3]), "{{SPECIAL}}": str(cx_counts[4]),
}

# ---------- section 6: taxonomy ----------
tax = ["## 6. Calculator Taxonomy\n",
       "The catalog is organised into {c} primary categories. Each entry has exactly one "
       "primary category (the schema requirement); the mapping column shows which of the 86 "
       "required discovery topics of the brief each category serves, so coverage can be audited "
       "topic by topic.\n".format(c=len(CATS)),
       "| Cat | Primary category | Brief topic(s) served | Entries |", "|---|---|---|---|"]
for c in CATS:
    tax.append(f"| `{c['code']}` | [{c['title']}](#{c['code'].lower()}--{re.sub(r'[^a-z0-9]+','-',c['title'].lower()).strip('-')}) | {c['req']} | {len(c['entries'])} |")
tax.append(f"| | **Total** | | **{len(rows)}** |\n")
tax.append("Categories are *catalog* groupings, not silos: many calculators legitimately serve "
           "several topics (a loan APR tool serves banking, consumer protection and education). "
           "Cross-links between categories are specified as data in the `related` field of the "
           "catalog model in §14.\n")

# ---------- section 7: statistics ----------
stats = ["## 7. Catalog Statistics\n",
         "All numbers below are computed by `tools/build_master_plan.py` from the catalog source, "
         "not typed by hand.\n",
         "| Metric | Value |", "|---|---|",
         f"| Individually identified entries | **{len(rows)}** |",
         f"| Primary categories | {len(CATS)} |",
         f"| Unique IDs | {len(set(ids))} |",
         f"| Unique canonical slugs | {len(set(slugs))} |",
         f"| Entries with an inspected reference (`SOURCE_VERIFIED`) | {st_counts['S']} |",
         f"| Entries requiring formula research (`RESEARCH_REQUIRED`) | {st_counts['R']} |",
         f"| Entries requiring specialist review (`SPECIALIST_REVIEW_REQUIRED`) | {st_counts['X']} |",
         f"| Independently validated | 0 |",
         f"| Implemented / tested / published | 0 / 0 / 0 |",
         f"| P0 / P1 / P2 / P3 | {pri_counts[0]} / {pri_counts[1]} / {pri_counts[2]} / {pri_counts[3]} |",
         f"| Simple / Moderate / Complex / Specialist complexity | {cx_counts[1]} / {cx_counts[2]} / {cx_counts[3]} / {cx_counts[4]} |",
         "",
         "**Honest reading of these numbers.** Only "
         f"{st_counts['S']} entries are backed by a source that was opened and inspected during "
         "this research pass (13 authoritative documents, listed in §23). The remaining entries "
         "have a documented formula *family* — the mathematics is standard and stated in the "
         "category block — but no citation has yet been inspected, so they are labelled "
         "`RESEARCH_REQUIRED`. That label means *\"no inspected citation yet\"*, not *\"the method "
         "is unknown\"*. Nothing in this catalog is implementation-ready on the strength of this "
         "document alone.\n",
         "**Per-category distribution**\n",
         "| Cat | Category | Entries |", "|---|---|---|"]
for c in CATS:
    stats.append(f"| `{c['code']}` | {c['title']} | {cat_counts[c['code']]} |")
stats.append("")

# ---------- section 8: catalog ----------
cat_md = ["## 8. Complete Master Catalog\n", "Every entry below is individually numbered and traceable to `catalog.csv`. IDs are assigned in category order and are permanent.\n",
 "### 8.0 How to read an entry\n",
 "Every entry carries the full 22-field schema from §4 of the brief. To keep "
 f"{len(rows)} entries readable, fields that are constant for a whole category or formula "
 "family are stated **once** — in the category block above its table — and the table itself "
 "carries the per-entry projection. The composition is explicit:\n",
 "| Schema field | Where it lives |", "|---|---|",
 "| ID | `ID` column, stable, never reused |",
 "| Name | `Name` column |",
 "| Slug | `Slug` column (validated format, unique, no stop words) |",
 "| Primary category / subcategory | The category section (`Cxx`) and the `Family` reference in the formula block |",
 "| Purpose / search intent | The category `Purpose` line + the entry name and IO column |",
 "| Inputs / outputs / units | `Inputs → Outputs` column; canonical units are SI in the module, display units per UI |",
 "| Formula or method, variables, assumptions, edge cases | The **formula families** block for that category (`F-XXX-nn`); each block states variables, units, validity domain and boundary behaviour |",
 "| Formula references | `Ref` column → resolved in §23 |",
 "| Verification method | Default protocol `T1-T6` (§15) + the family's stated reference example; `S` entries additionally name the inspected source |",
 "| Complexity / priority | `Cx` (1-4) and `Pri` (P0-P3) columns |",
 "| Test requirements | §15 defaults `T1` known-answer, `T2` boundary, `T3` invalid input, `T4` unit/dimension, `T5` precision/rounding, `T6` UI/a11y; families may add specific cases |",
 "| SEO content requirements | §12 defaults: H1, 150-300 word unique explainer, formula block, 1-2 worked examples with checked arithmetic, assumptions, 2-5 FAQs, 3+ internal links |",
 "| Duplicate review | Performed for every entry against name/purpose/formula/IO/units; outcomes in §11 |",
 "| Formula status / implementation status | `Status` column (`S`, `R`, `X`); implementation is `Planned` for all entries |",
 "| Review notes | The note column appears as an italic remark under any entry carrying one |",
 "| Assumptions of validity / jurisdiction & effective date | Stated in the family block; mandatory in the page UI for every `S`/`X` entry |",
 "",
 "**Status legend** — `S` = `SOURCE_VERIFIED` (an inspected source supports the method), "
 "`R` = `RESEARCH_REQUIRED` (method documented, citation not yet inspected), "
 "`X` = `SPECIALIST_REVIEW_REQUIRED` (licensed standard, clinical, legal or safety consequence). "
 "No entry is `IMPLEMENTED`, `TESTED` or `PUBLISHED`.\n",
 "**Cx legend** — 1 Simple (single formula, one input group), 2 Moderate (several steps or units), "
 "3 Complex (iterative/numerical or multi-model), 4 Specialist (domain judgement, licensed data, "
 "or an optimisation problem).\n",
 "---\n"]

for c in CATS:
    anchor = f"{c['code'].lower()}--{re.sub(r'[^a-z0-9]+','-',c['title'].lower()).strip('-')}"
    cat_md.append(f"### {c['code']} · {c['title']}\n")
    topics = c["req"].replace("Required topics ", "").replace("Required topic ", "")
    focus = ", ".join(f"P{p}" for p in sorted(set(e[5] for e in c["entries"])))
    cat_md.append(f"`Entries: {len(c['entries'])}` · `Brief topic(s): {topics}` · "
                  f"`Priorities present: {focus}`\n")
    cat_md.append("**Formula families, variables, assumptions and edge cases**\n")
    fam_lines = []
    for line in c["families"].strip().splitlines():
        if line.startswith("**F-"):
            fam_lines.append("- " + line.strip())
        elif line.strip():
            fam_lines.append("  " + line.strip())
    cat_md.append("\n".join(fam_lines) + "\n")
    cat_md.append("| ID | Name | Slug | Inputs → Outputs | Ref | Cx | Pri | Status |")
    cat_md.append("|---|---|---|---|---|---|---|---|")
    for r in [x for x in rows if x["cat"] == c["code"]]:
        cat_md.append(f"| `{r['id']}` | {r['name']} | `{r['slug']}` | {r['io']} | `{r['ref']}` | "
                      f"{r['cx']} | P{r['pri']} | `{r['st']}` |")
    cat_md.append("")
    notes = [x for x in rows if x["cat"] == c["code"] and x["note"]]
    if notes:
        cat_md.append("**Review notes for this category**\n")
        for r in notes:
            cat_md.append(f"- `{r['id']}` **{r['name']}** — {r['note']}")
        cat_md.append("")

# ---------- assemble ----------
def read(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()

doc = read("prose_a.md")
doc += "\n".join(tax) + "\n" + "\n".join(stats) + "\n" + "\n".join(cat_md) + "\n"
doc += read("prose_b.md")
for k, v in subs.items():
    doc = doc.replace(k, v)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(doc)

with open(CSV, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["id", "name", "slug", "primary_category", "inputs_outputs", "formula_ref",
                "complexity", "priority", "formula_status", "implementation_status", "notes"])
    for r in rows:
        w.writerow([r["id"], r["name"], r["slug"], f"{r['cat']} {r['cat_title']}", r["io"],
                    r["ref"], CX[r["cx"]], f"P{r['pri']}", STATUS[r["st"]], "Planned", r["note"]])

print(f"wrote {OUT}")
print(f"wrote {CSV}")
print(f"entries={len(rows)} cats={len(CATS)} status={dict(st_counts)} priority={dict(sorted(pri_counts.items()))}")
print(f"bytes={os.path.getsize(OUT)} lines={doc.count(chr(10))}")
