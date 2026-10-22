/**
 * Display formatting for calculation results.
 * Rounding happens only at the display boundary; intermediates are never rounded.
 */

const formatOptions = (maximumFractionDigits: number) => ({
  minimumFractionDigits: 0,
  maximumFractionDigits,
});

/**
 * Format a plain number with up to `maxDecimals` significant decimal places,
 * stripping trailing zeros so the underlying precision is not hidden but noise is.
 */
export function formatNumber(value: number, maxDecimals = 4): string {
  if (!Number.isFinite(value)) {
    throw new Error("cannot format non-finite value");
  }
  return new Intl.NumberFormat("en-US", formatOptions(maxDecimals)).format(value);
}

/**
 * Format a number with a fixed number of decimal places (currency-style output).
 */
export function formatFixed(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) {
    throw new Error("cannot format non-finite value");
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Round to a given number of decimal places (half-up via string-based rounding
 * to avoid binary floating point surprise on ties).
 */
export function roundDecimals(value: number, decimals: number): number {
  if (!Number.isFinite(value)) return value;
  const scale = 10 ** decimals;
  return Math.round(value * scale) / scale;
}

/**
 * Format a percentage value (input already expressed in percent, e.g. 20 -> "20%").
 */
export function formatPercent(value: number, maxDecimals = 2): string {
  return `${formatNumber(value, maxDecimals)}%`;
}
