import { describe, expect, it } from "vitest";
import { SPEC_BY_SLUG } from "@/calculators/specs-all";
import { getDefaultRawInputs, validateAndRun } from "@/lib/engine/helpers";
import type { CalculatorSpec } from "@/lib/engine/types";

/**
 * Known-answer tests for the remaining source-verified catalog entries that had no
 * independent check: nine unit converters, the Reg Z actuarial APR and the WCAG
 * contrast ratio. Expected values were computed in Python from SI / NIST SP 811
 * definitions, the WCAG 2.x relative-luminance formula and a bisection APR solver,
 * never from the implementation. Tolerance = half the last displayed digit, or 1e-9 relative for large values.
 *
 * Converters are checked at their default input of 1 in the base unit.
 * "Speed of light (c)" is excluded: 1 m/s displays as 0 and cannot be checked at this precision.
 */
const ROWS: [slug: string, label: string, expected: number, tolerance: number][] = [
  ["speed-converter", "Metres per second (m/s)", 1, 0.500000000001],
  ["speed-converter", "Kilometres per hour (km/h)", 3.6, 0.050000000001],
  ["speed-converter", "Miles per hour (mph)", 2.236936292054402, 5.00001e-07],
  ["speed-converter", "Knots (kn)", 1.9438444924406046, 5.00001e-07],
  ["speed-converter", "Feet per second (ft/s)", 3.280839895013123, 5.000001000000001e-06],
  ["pressure-converter", "Kilopascals (kPa)", 0.001, 0.000500000001],
  ["pressure-converter", "Megapascals (MPa)", 1e-06, 5.00001e-07],
  ["pressure-converter", "Bar", 1e-05, 5.000001000000001e-06],
  ["pressure-converter", "Millibar (mbar)", 0.01, 0.0050000000010000005],
  ["pressure-converter", "Standard atmospheres (atm)", 9.869232667160129e-06, 5.001e-09],
  ["pressure-converter", "Pounds per square inch (psi)", 0.00014503773773021683, 5.00001e-07],
  ["pressure-converter", "Torr / mmHg", 0.007500615758456563, 5.00001e-07],
  ["pressure-converter", "Inches of mercury (inHg)", 0.0002952998016471232, 5.00001e-07],
  ["energy-converter", "Kilojoules (kJ)", 0.001, 0.000500000001],
  ["energy-converter", "Megajoules (MJ)", 1e-06, 5.00001e-07],
  ["energy-converter", "Kilowatt-hours (kWh)", 2.7777777777777776e-07, 5.001e-09],
  ["energy-converter", "Calories (cal, thermochemical)", 0.2390057361376673, 5.00001e-07],
  ["energy-converter", "Kilocalories (kcal)", 0.0002390057361376673, 5.00001e-07],
  ["energy-converter", "BTU (IT)", 0.0009478171203133172, 5.00001e-07],
  ["energy-converter", "Electronvolts (eV)", 6.241509074460763e+18, 0.500000000001],
  ["energy-converter", "Watt-hours (Wh)", 0.0002777777777777778, 5.00001e-07],
  ["power-converter", "Kilowatts (kW)", 0.001, 0.000500000001],
  ["power-converter", "Megawatts (MW)", 1e-06, 5.00001e-07],
  ["power-converter", "Mechanical horsepower (hp)", 0.0013410220895950279, 5.00001e-07],
  ["power-converter", "Metric horsepower (PS)", 0.0013596216173039043, 5.000001000000001e-06],
  ["power-converter", "BTU per hour", 3.4121416331279417, 5.00001e-07],
  ["power-converter", "Refrigeration tons", 0.00028434513609399515, 5.00001e-07],
  ["force-converter", "Kilonewtons (kN)", 0.001, 0.000500000001],
  ["force-converter", "Kilogram-force (kgf)", 0.10197162129779283, 5.00001e-07],
  ["force-converter", "Pound-force (lbf)", 0.2248089430997105, 5.00001e-07],
  ["force-converter", "Dynes (dyn)", 100000.0, 0.500000000001],
  ["force-converter", "Short ton-force", 0.00011240447154985525, 5.00001e-07],
  ["torque-converter", "Kilonewton-metres (kN·m)", 0.001, 0.000500000001],
  ["torque-converter", "Pound-force feet (lbf·ft)", 0.7375621492772654, 5.00001e-07],
  ["torque-converter", "Pound-force inches (lbf·in)", 8.850745791327185, 5.00001e-07],
  ["torque-converter", "Kilogram-force metres (kgf·m)", 0.10197162129779283, 5.00001e-07],
  ["flow-rate-converter", "Cubic metres per hour (m³/h)", 3600, 0.500000000001],
  ["flow-rate-converter", "Litres per second (L/s)", 1000, 0.500000000001],
  ["flow-rate-converter", "Litres per minute (L/min)", 60000, 0.500000000001],
  ["flow-rate-converter", "US gallons per minute (gpm)", 15850.323141488903, 5.00001e-07],
  ["flow-rate-converter", "US gallons per hour", 951019.3884893343, 5.00001e-07],
  ["flow-rate-converter", "Cubic feet per minute (cfm)", 2118.880003289315, 5.00001e-07],
  ["acceleration-converter", "Standard gravity (g₀)", 0.10197162129779283, 5.00001e-07],
  ["acceleration-converter", "Feet per second squared (ft/s²)", 3.280839895013123, 5.000001000000001e-06],
  ["acceleration-converter", "Galileo (Gal)", 100, 0.500000000001],
  ["acceleration-converter", "km/h per second", 3.6, 0.050000000001],
  ["illuminance-converter", "Foot-candles (fc)", 0.09290303999999759, 5.00001e-07],
  ["illuminance-converter", "Kilolux (klx)", 0.001, 0.000500000001],
  ["illuminance-converter", "Phot", 0.0001, 5.0000001000000005e-05],
  ["illuminance-converter", "Nox", 1000, 0.500000000001],
  ["apr-from-fees", "Actuarial APR (Reg Z)", 6.466853499832414, 0.000500000001],
  ["color-contrast", "Contrast ratio", 14.67911847763172, 0.0050000000010000005],
];

function outputs(slug: string) {
  const spec = SPEC_BY_SLUG.get(slug) as CalculatorSpec | undefined;
  if (!spec) throw new Error(`missing spec: ${slug}`);
  const out = validateAndRun(spec, getDefaultRawInputs(spec));
  if (!out.calcResult || !out.calcResult.ok) throw new Error(`${slug}: did not compute`);
  return out.calcResult.value.outputs;
}

describe("source-verified converters, APR and contrast — known-answer values", () => {
  for (const [slug, label, expected, tol] of ROWS) {
    it(`${slug} → ${label} ≈ ${expected}`, () => {
      const row = outputs(slug).find((r) => r.label === label);
      expect(row, `${slug}: no output "${label}"`).toBeDefined();
      const got = Number(String(row!.value).replace(/,/g, ""));
      expect(Number.isFinite(got)).toBe(true);
      // Accept the display half-unit, or a relative 1e-9 for very large values (differences far below display precision).
      expect(Math.abs(got - expected)).toBeLessThanOrEqual(Math.max(tol, 1e-9 * Math.abs(expected)));
    });
  }
});
