import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { VERIFIED_SLUGS } from "./verified-slugs";
import { ALL_SPECS } from "./specs-all";

const VERIFIED = "Verified (known-answer tested)";

/** Minimal RFC 4180 parser (handles quoted commas, quotes and newlines). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\r") { /* ignore */ }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header!.map((h, i) => [h, r[i] ?? ""])));
}

const csv = parseCsv(readFileSync(join(process.cwd(), "docs/project-plan/catalog.csv"), "utf8"));

describe("catalog.csv ↔ code agreement", () => {
  it("has one CSV row per calculator and one spec per row", () => {
    expect(csv.length).toBe(ALL_SPECS.length);
    const csvSlugs = new Set(csv.map((r) => r.slug));
    expect(csvSlugs.size).toBe(csv.length);
    expect(ALL_SPECS.filter((s) => !csvSlugs.has(s.slug))).toEqual([]);
  });

  it("VERIFIED_SLUGS matches the CSV rows marked as verified", () => {
    const fromCsv = csv.filter((r) => r.implementation_status === VERIFIED).map((r) => r.slug).sort();
    expect([...VERIFIED_SLUGS].sort()).toEqual(fromCsv);
  });

  it("every verified calculator has a known-answer test (listed in VERIFIED_SLUGS)", () => {
    for (const slug of VERIFIED_SLUGS) expect(ALL_SPECS.some((s) => s.slug === slug)).toBe(true);
  });

  it("every source-verified entry is verified by a test", () => {
    const sourceVerified = csv.filter((r) => r.formula_status === "SOURCE_VERIFIED").map((r) => r.slug);
    expect(sourceVerified.length).toBe(21);
    expect(sourceVerified.filter((s) => !VERIFIED_SLUGS.has(s))).toEqual([]);
  });

  it("specialist-review entries are never marked verified", () => {
    const specialist = csv.filter((r) => r.formula_status === "SPECIALIST_REVIEW_REQUIRED");
    expect(specialist.length).toBe(59);
    expect(specialist.filter((r) => VERIFIED_SLUGS.has(r.slug))).toEqual([]);
  });
});
