import { describe, expect, it } from "vitest";
import { ALL_SPECS } from "@/calculators/specs-all";
import { ALL_ENTRIES, CALCULATORS } from "@/calculators/registry";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";

describe("calculator engine coverage", () => {
  it("implements exactly one spec per catalog slug", () => {
    const slugs = ALL_SPECS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const catalogSlugs = new Set(ALL_ENTRIES.map((e) => e.slug));
    const missing = [...catalogSlugs].filter((s) => !slugs.includes(s));
    const extra = slugs.filter((s) => !catalogSlugs.has(s));
    expect({ missing, extra }).toEqual({ missing: [], extra: [] });
  });

  it("projects every catalog row into the public registry", () => {
    expect(CALCULATORS.length).toBe(ALL_ENTRIES.length);
  });
});

describe("every calculator spec", () => {
  it("declares unique field keys, a formula and variables", () => {
    for (const spec of ALL_SPECS) {
      const keys = spec.fields.map((f) => f.key);
      expect(new Set(keys).size, `${spec.slug} duplicate field keys`).toBe(keys.length);
      expect(spec.fields.length, `${spec.slug} has no inputs`).toBeGreaterThan(0);
      expect(spec.formulaPlain.trim().length, `${spec.slug} formula`).toBeGreaterThan(3);
      expect(spec.variables.length, `${spec.slug} variables`).toBeGreaterThan(0);
    }
  });

  it("produces finite, labelled results from its default inputs", () => {
    const failures: string[] = [];
    for (const spec of ALL_SPECS) {
      const raw = getDefaultRawInputs(spec);
      const { fieldErrors, calcResult } = validateAndRun(spec, raw);
      if (Object.keys(fieldErrors).length > 0) {
        failures.push(`${spec.slug}: default validation failed ${JSON.stringify(fieldErrors)}`);
        continue;
      }
      if (!calcResult) {
        failures.push(`${spec.slug}: no result`);
        continue;
      }
      if (!calcResult.ok) {
        failures.push(`${spec.slug}: ${calcResult.error}`);
        continue;
      }
      if (calcResult.value.outputs.length === 0) {
        failures.push(`${spec.slug}: empty output list`);
        continue;
      }
      for (const o of calcResult.value.outputs) {
        if (/NaN|Infinity|undefined/.test(o.value)) {
          failures.push(`${spec.slug}: non-finite output "${o.label}" = ${o.value}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("never throws and never returns NaN for perturbed inputs", () => {
    const failures: string[] = [];
    for (const spec of ALL_SPECS) {
      for (const factor of [1.1, 0.5, 3]) {
        const raw = getDefaultRawInputs(spec);
        for (const f of spec.fields) {
          if (f.kind !== "number") continue;
          const base = Number(raw[f.key]);
          if (!Number.isFinite(base) || base === 0) continue;
          raw[f.key] = String(Number((base * factor).toPrecision(6)));
        }
        let outcome: ReturnType<typeof validateAndRun>;
        try {
          outcome = validateAndRun(spec, raw);
        } catch (e) {
          failures.push(`${spec.slug} x${factor}: threw ${(e as Error).message}`);
          continue;
        }
        const res = outcome.calcResult;
        if (res && res.ok) {
          for (const o of res.value.outputs) {
            if (/NaN|Infinity/.test(o.value)) {
              failures.push(`${spec.slug} x${factor}: non-finite ${o.label}=${o.value}`);
            }
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });
});

describe("lazy domain grouping", () => {
  it("maps every catalog slug to a group that actually contains its spec", async () => {
    const { groupForSlug } = await import("@/calculators/registry");
    const { loadSpecGroup } = await import("@/calculators/spec-loader");
    const byGroup = new Map<number, Set<string>>();
    const groups = new Set<number>();
    for (const entry of ALL_ENTRIES) groups.add(groupForSlug(entry.slug));
    for (const g of groups) {
      const specs = await loadSpecGroup(g as never);
      byGroup.set(g, new Set(specs.map((s) => s.slug)));
    }
    const missing: string[] = [];
    for (const entry of ALL_ENTRIES) {
      const g = groupForSlug(entry.slug);
      if (!byGroup.get(g)?.has(entry.slug)) missing.push(`${entry.slug} → group ${g}`);
    }
    expect(missing).toEqual([]);
    expect(groups.size).toBe(9);
  });
});
