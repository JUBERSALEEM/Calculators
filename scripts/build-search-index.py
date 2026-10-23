#!/usr/bin/env python3
"""Regenerate calculators/search-index.ts from docs/project-plan/catalog.csv.

The client search index is kept as a static string so the search box does not ship the
full catalog. Run after adding catalog rows:  python3 scripts/build-search-index.py
calculators/search-index.test.ts fails if the generated file drifts from the registry.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "docs/project-plan/catalog.csv"
OUT = ROOT / "calculators/search-index.ts"

rows = list(csv.DictReader(CSV_PATH.open(encoding="utf-8", newline="")))
lines = []
for r in rows:
    category = re.sub(r"^C\d+\s+", "", r["primary_category"])
    lines.append("\x1f".join([r["slug"], r["name"], category]))
raw = "\n".join(lines)
# JSON-escape the string, then write the unit separator as \u001f (readable in source).
literal = json.dumps(raw, ensure_ascii=False).replace("\x1f", "\\u001f")[1:-1]

src = OUT.read_text(encoding="utf-8")
head, sep, rest = src.partition('const RAW = "')
assert sep, "RAW declaration not found"
_, end, tail = rest.partition('";\n')
assert end, "end of RAW declaration not found"
OUT.write_text(f'{head}const RAW = "{literal}";\n{tail}', encoding="utf-8")
print(f"wrote {len(lines)} search rows to {OUT.relative_to(ROOT)}")
