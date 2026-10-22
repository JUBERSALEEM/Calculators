import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";

/** Independently calculated expected values (worked by hand, not by the implementation). */
function run(slug: string, overrides: Record<string, string> = {}) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const raw = { ...getDefaultRawInputs(spec), ...overrides };
  const out = validateAndRun(spec, raw);
  if (!out.calcResult) throw new Error(`${slug}: field errors ${JSON.stringify(out.fieldErrors)}`);
  if (!out.calcResult.ok) throw new Error(`${slug}: ${out.calcResult.error}`);
  return out.calcResult.value.outputs;
}

function value(slug: string, label: string, overrides: Record<string, string> = {}) {
  const rows = run(slug, overrides);
  const row = rows.find((r) => r.label === label);
  if (!row) throw new Error(`${slug}: no output labelled ${label}`);
  return row.value;
}

/** Parses a formatted display value (strips thousands separators and units). */
function num(slug: string, label: string, overrides: Record<string, string> = {}) {
  return Number(value(slug, label, overrides).replace(/,/g, ""));
}

describe("source-verified reference values", () => {
  it("wind chill matches the NWS chart for 0 °F at 15 mph (-19.4 °F)", () => {
    expect(num("wind-chill", "Wind chill", { temperature: "0", "wind-speed": "15" })).toBeCloseTo(-19.4, 1);
  });

  it("heat index matches the NWS Rothfusz result for 100 °F / 55% (123.6 °F)", () => {
    expect(num("heat-index", "Heat index", { temperature: "100", "relative-humidity": "55" })).toBeCloseTo(123.6, 1);
  });

  it("heat index matches the dry-air case 100 °F / 15% (95.8 °F near the NWS value)", () => {
    const hi = Number(value("heat-index", "Heat index", { temperature: "100", "relative-humidity": "15" }));
    expect(hi).toBeGreaterThan(94.5);
    expect(hi).toBeLessThan(97);
  });

  it("refuses wind chill outside its stated domain", () => {
    const spec = SPEC_BY_SLUG.get("wind-chill")!;
    const warm = validateAndRun(spec, { ...getDefaultRawInputs(spec), temperature: "60" });
    expect(warm.calcResult && !warm.calcResult.ok).toBe(true);
    const calm = validateAndRun(spec, { ...getDefaultRawInputs(spec), "wind-speed": "2" });
    expect(calm.calcResult && !calm.calcResult.ok).toBe(true);
  });

  it("BMI reproduces the reference conversions (124 lb at 5 ft 9 in = 18.31)", () => {
    // 124 lb = 56.2455 kg; 5 ft 9 in = 175.26 cm
    expect(num("bmi", "BMI", { weight: "56.2455", height: "175.26" })).toBeCloseTo(18.31, 2);
    // 169 lb = 76.657 kg → 24.95 ; 203 lb = 92.08 kg → 29.97
    expect(num("bmi", "BMI", { weight: "76.657", height: "175.26" })).toBeCloseTo(24.96, 2);
    expect(num("bmi", "BMI", { weight: "92.2", height: "175.26" })).toBeCloseTo(30.02, 2);
  });

  it("BMI uses CDC adult categories", () => {
    expect(value("bmi", "CDC adult category", { weight: "56.2455", height: "175.26" })).toBe("Underweight");
    expect(value("bmi", "CDC adult category", { weight: "76.657", height: "175.26" })).toBe("Healthy weight");
    expect(value("bmi", "CDC adult category", { weight: "92.2", height: "175.26" })).toBe("Obesity class 1");
    expect(value("bmi", "CDC adult category", { weight: "92.08", height: "175.26" })).toBe("Overweight");
  });

  it("percentage change 100 → 120 is +20%", () => {
    expect(num("percentage-change", "Percentage change", { oldVal: "100", newVal: "120" })).toBeCloseTo(20, 6);
  });

  it("percentage difference of 100 and 120 is 18.18%", () => {
    expect(num("percentage-difference", "Symmetric difference", { a: "100", b: "120" })).toBeCloseTo(18.18, 2);
  });
});

describe("authoritative parameter sets", () => {
  it("2027 SSA PIA bend points: AIME 5,500 → $2,537.20", () => {
    // 0.90 × 1,340 = 1,206.00 ; 0.32 × (5,500 − 1,340) = 1,331.20 ; total 2,537.20
    expect(num("ss-pia", "Primary Insurance Amount (PIA, 2027)", { aime: "5500" })).toBeCloseTo(2537.2, 1);
  });

  it("FLSA overtime: 46 hours at $25/hr = $1,225.00", () => {
    // 40 × 25 = 1,000 ; 6 × 37.50 = 225
    expect(num("overtime-flsa", "Total weekly FLSA gross pay", { hours: "46", rate: "25" })).toBeCloseTo(1225, 2);
  });

  it("TY2026 federal tax: single, AGI $95,000 → $12,070", () => {
    // taxable 78,900: 1,240 + 12%×38,000 (4,560) + 22%×28,500 (6,270)
    expect(num("us-federal-income-tax", "TY2026 Federal income tax", { gross: "95000" })).toBeCloseTo(12070, 2);
  });

  it("FAO-56 irrigation: ET0 5.4, Kc 0.85, Peff 1.2, 85% efficiency", () => {
    // ETc 4.59 ; net 3.39 ; gross 3.9882
    expect(num("irrigation-requirement", "Crop evapotranspiration ETc")).toBeCloseTo(4.59, 2);
    expect(num("irrigation-requirement", "Gross irrigation requirement")).toBeCloseTo(3.99, 2);
  });
});

describe("unit conversion exactness (NIST SP 811)", () => {
  it("converts 1 metre into every length unit", () => {
    const rows = run("length-converter", { value: "1", unit: "m" });
    const get = (l: string) => Number(rows.find((r) => r.label === l)!.value.replace(/,/g, ""));
    expect(get("Centimetres (cm)")).toBeCloseTo(100, 6);
    expect(get("Millimetres (mm)")).toBeCloseTo(1000, 6);
    expect(get("Inches (in)")).toBeCloseTo(39.3700787, 6);
    expect(get("Feet (ft)")).toBeCloseTo(3.2808399, 6);
    expect(get("Miles (mi)")).toBeCloseTo(0.000621, 6);
  });

  it("uses affine temperature conversion and rejects below absolute zero", () => {
    const rows = run("temperature-converter", { value: "100", unit: "C" });
    const get = (l: string) => Number(rows.find((r) => r.label === l)!.value.replace(/,/g, ""));
    expect(get("Fahrenheit (°F)")).toBeCloseTo(212, 6);
    expect(get("Kelvin (K)")).toBeCloseTo(373.15, 6);
    const spec = SPEC_BY_SLUG.get("temperature-converter")!;
    const bad = validateAndRun(spec, { value: "-500", unit: "C" });
    expect(bad.calcResult && !bad.calcResult.ok).toBe(true);
  });

  it("distinguishes US and imperial gallons", () => {
    const rows = run("volume-converter", { value: "1", unit: "gal_us" });
    const imp = Number(rows.find((r) => r.label === "Imperial gallons (gal)")!.value.replace(/,/g, ""));
    expect(imp).toBeCloseTo(0.832674185, 6);
  });

  it("converts 0 °C to 32 °F and 273.15 K", () => {
    const rows = run("temperature-converter", { value: "0", unit: "C" });
    const get = (l: string) => Number(rows.find((r) => r.label === l)!.value.replace(/,/g, ""));
    expect(get("Fahrenheit (°F)")).toBeCloseTo(32, 9);
    expect(get("Kelvin (K)")).toBeCloseTo(273.15, 9);
  });
});

describe("error handling on invalid domains", () => {
  it("rejects percentage change from zero", () => {
    const spec = SPEC_BY_SLUG.get("percentage-change")!;
    const res = validateAndRun(spec, { ...getDefaultRawInputs(spec), oldVal: "0", newVal: "10" });
    // Zero as a percentage-change base is rejected during validation with a readable message.
    expect(Object.keys(res.fieldErrors)).toContain("oldVal");
    expect(res.fieldErrors.oldVal).toMatch(/cannot be zero/i);
  });

  it("rejects a mortgage-style case where the payment cannot amortise", () => {
    const spec = SPEC_BY_SLUG.get("credit-card-payoff")!;
    const res = validateAndRun(spec, { ...getDefaultRawInputs(spec), pay: "10" });
    expect(res.calcResult && !res.calcResult.ok).toBe(true);
  });

  it("reports immortelle-style missing values as field errors, not NaN", () => {
    const spec = SPEC_BY_SLUG.get("bmi")!;
    const res = validateAndRun(spec, { weight: "", height: "175" });
    expect(Object.keys(res.fieldErrors).length).toBeGreaterThan(0);
    expect(res.calcResult).toBeNull();
  });
});
