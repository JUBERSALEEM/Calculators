/**
 * Unit conversion registry.
 *
 * Factors express how many SI base units one unit equals (canonical base = SI).
 * Conversion happens through SI only; a formula module never contains a raw
 * factor such as 25.4.
 *
 * Source: NIST SP 811, Guide for the Use of the International System of Units,
 * Appendix B.8 (factors marked "exact" in the source are flagged exact).
 * Inspected chunks: A-B (R-001, 2026-10-22) and D-G (R-014, 2026-10-22).
 * Factors below marked exact trace to those inspected entries; derived units
 * (inch, yard, mile) use exact defined relationships to the foot.
 *
 * Open item ORQ-01: H-Z factors (pound, mile, psi, ton, quart, ...) are not
 * yet transcribed from the inspected source — only length units needed for the
 * launch batch are included.
 */

export interface UnitDefinition {
  /** Unit symbol shown in the UI. */
  symbol: string;
  /** Human-readable name. */
  name: string;
  /** Multiply a value in this unit by `toSi` to get SI. */
  toSi: number;
  /** Whether the factor is exact per the inspected source. */
  exact: boolean;
  /** Source line reference for the factor. */
  source: string;
}

interface QuantityRegistry {
  siUnit: string;
  units: Record<string, UnitDefinition>;
}

/** Length, canonical SI base = metre. Exact per NIST SP 811 B.8. */
export const LENGTH: QuantityRegistry = {
  siUnit: "m",
  units: {
    m: {
      symbol: "m",
      name: "metre",
      toSi: 1,
      exact: true,
      source: "SI base unit (BIPM SI Brochure via NIST SP 330, as flagged in R-001)",
    },
    cm: {
      symbol: "cm",
      name: "centimetre",
      toSi: 0.01,
      exact: true,
      source: "SI prefix, exact (R-001)",
    },
    mm: {
      symbol: "mm",
      name: "millimetre",
      toSi: 0.001,
      exact: true,
      source: "SI prefix, exact (R-001)",
    },
    km: {
      symbol: "km",
      name: "kilometre",
      toSi: 1000,
      exact: true,
      source: "SI prefix, exact (R-001)",
    },
    ft: {
      symbol: "ft",
      name: "foot",
      toSi: 0.3048,
      exact: true,
      source: "NIST SP 811 App. B.8, boldface exact factor (R-014)",
    },
    in: {
      symbol: "in",
      name: "inch",
      toSi: 0.3048 / 12,
      exact: true,
      source: "Derived: 1 foot = 12 inches exactly; foot factor from R-014",
    },
    yd: {
      symbol: "yd",
      name: "yard",
      toSi: 0.3048 * 3,
      exact: true,
      source: "Derived: 1 yard = 3 feet exactly; foot factor from R-014",
    },
    mi: {
      symbol: "mi",
      name: "mile",
      toSi: 0.3048 * 5280,
      exact: true,
      source: "Derived: 1 mile = 5280 feet exactly; foot factor from R-014",
    },
  },
};

export const QUANTITIES: Record<string, QuantityRegistry> = {
  length: LENGTH,
};

export function getQuantity(name: string): QuantityRegistry {
  const q = QUANTITIES[name];
  if (!q) throw new Error(`Unknown quantity: ${name}`);
  return q;
}

export function getUnit(quantity: string, symbol: string): UnitDefinition {
  const u = getQuantity(quantity).units[symbol];
  if (!u) throw new Error(`Unknown unit ${symbol} for quantity ${quantity}`);
  return u;
}

/**
 * Convert a value from one unit to another within the same quantity, via SI.
 * Never rounds — rounding is the UI's responsibility.
 */
export function convertUnits(
  quantity: string,
  value: number,
  from: string,
  to: string,
): number {
  const { toSi: fromSi } = getUnit(quantity, from);
  const { toSi: toSi } = getUnit(quantity, to);
  const si = value * fromSi;
  return si / toSi;
}
