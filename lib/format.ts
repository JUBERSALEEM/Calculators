/** Numeric formatting helpers shared by every calculator. */

const MINUS = "\u2212";

export interface FormatOptions {
  /** Maximum digits after the decimal point. Display rounding only. */
  maxFractionDigits?: number;
  /** Minimum digits after the decimal point. */
  minFractionDigits?: number;
}

/**
 * Format a finite number for display with thousands separators.
 * Falls back to exponential notation for magnitudes outside the readable range
 * so that a result is never rendered as "0" or a wall of digits.
 */
export function formatNumber(value: number, options: FormatOptions = {}): string {
  if (!Number.isFinite(value)) return "—";
  const { maxFractionDigits = 6, minFractionDigits = 0 } = options;

  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude >= 1e15 || magnitude < 1e-6)) {
    // Only the leading sign is typographic; the exponent keeps its ASCII hyphen.
    return value.toExponential(4).replace("e+", "e").replace(/^-/, MINUS);
  }

  // Intl emits an ASCII hyphen; the site uses a true minus sign everywhere so
  // that signs line up in tabular columns and read correctly to screen readers.
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: minFractionDigits,
    useGrouping: true,
  })
    .format(value)
    .replace(/^-/, MINUS);
}

/** Format with a unit suffix, using a non-breaking space. */
export function formatWithUnit(value: number, unit: string, options: FormatOptions = {}): string {
  return `${formatNumber(value, options)}\u00A0${unit}`;
}

/** Format a signed percentage, e.g. "+25%" / "−4.5%". Uses a true minus sign. */
export function formatSignedPercent(value: number, maxFractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const formatted = formatNumber(Math.abs(value), { maxFractionDigits });
  if (value === 0) return `${formatted}%`;
  return `${value > 0 ? "+" : "−"}${formatted}%`;
}

/**
 * Parse a user-entered decimal string.
 * Accepts a leading sign, decimal point, exponent and thousands separators.
 * Returns null when the text is not a number (the caller decides the message).
 */
export function parseLocaleNumber(raw: string): number | null {
  const trimmed = raw.trim().replace(/\u2212/g, "-").replace(/\u00A0/g, "");
  if (trimmed === "") return null;
  // Reject partial numeric prefixes such as "12abc".
  if (!/^[+-]?(\d{1,3}(,\d{3})+|\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(trimmed)) return null;
  const normalised = trimmed.replace(/,/g, "");
  const value = Number(normalised);
  return Number.isFinite(value) ? value : null;
}

/** Split a free-text list of numbers on commas, semicolons, spaces or newlines. */
export function splitNumberList(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter((token) => token !== "");
}

/** Clamp a number into an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
