import { ok, err, type Result } from "@/lib/calc/result";
import { formatNumber } from "@/lib/format/number";
import type {
  CalcField,
  CalcOutput,
  CalcRunResult,
  CalculatorSpec,
  ParsedInputs,
  SelectOption,
} from "@/lib/engine/types";

export function numF(
  key: string,
  label: string,
  defaultValue: number | string,
  unit?: string,
  opts: Partial<CalcField> = {}
): CalcField {
  return {
    key,
    label,
    kind: "number",
    unit,
    defaultValue: String(defaultValue),
    step: opts.integer ? "1" : "any",
    ...opts,
  };
}

export function posF(
  key: string,
  label: string,
  defaultValue: number | string,
  unit?: string,
  opts: Partial<CalcField> = {}
): CalcField {
  return numF(key, label, defaultValue, unit, { gt: 0, ...opts });
}

export function nnF(
  key: string,
  label: string,
  defaultValue: number | string,
  unit?: string,
  opts: Partial<CalcField> = {}
): CalcField {
  return numF(key, label, defaultValue, unit, { min: 0, ...opts });
}

export function intF(
  key: string,
  label: string,
  defaultValue: number | string,
  opts: Partial<CalcField> = {}
): CalcField {
  return numF(key, label, defaultValue, opts.unit, { integer: true, step: "1", ...opts });
}

export function selF(
  key: string,
  label: string,
  options: SelectOption[],
  defaultValue?: string
): CalcField {
  return {
    key,
    label,
    kind: "select",
    options,
    defaultValue: defaultValue ?? options[0]?.value ?? "",
  };
}

export function txtF(
  key: string,
  label: string,
  defaultValue: string,
  opts: Partial<CalcField> = {}
): CalcField {
  return {
    key,
    label,
    kind: "text",
    defaultValue,
    ...opts,
  };
}

export function outN(
  label: string,
  value: number,
  decimals = 4,
  unit?: string,
  highlight = false
): CalcOutput {
  return {
    label,
    value: Number.isFinite(value) ? formatNumber(value, decimals) : "NaN",
    unit,
    highlight,
  };
}

export function outS(
  label: string,
  value: string,
  unit?: string,
  highlight = false
): CalcOutput {
  return { label, value, unit, highlight };
}

export function done(outputs: CalcOutput[], advisory?: string): Result<CalcRunResult> {
  for (const o of outputs) {
    if (
      o.value === "NaN" ||
      o.value === "Infinity" ||
      o.value === "-Infinity" ||
      o.value.includes("NaN")
    ) {
      return err(
        `Result for "${o.label}" is undefined or outside finite numeric bounds for the entered inputs.`
      );
    }
  }
  return ok({ outputs, advisory });
}

export function validateAndRun(
  spec: CalculatorSpec,
  raw: Record<string, string>
): { fieldErrors: Record<string, string>; calcResult: Result<CalcRunResult> | null } {
  const fieldErrors: Record<string, string> = {};
  const parsed: ParsedInputs = {};

  for (const f of spec.fields) {
    const val = (raw[f.key] ?? "").trim();
    if (f.kind === "number") {
      if (val === "") {
        fieldErrors[f.key] = `Enter a value for ${f.label.toLowerCase()}.`;
        continue;
      }
      const n = Number(val.replace(/,/g, ""));
      if (!Number.isFinite(n)) {
        fieldErrors[f.key] = `${f.label} must be a valid finite number.`;
        continue;
      }
      if (f.integer && !Number.isInteger(n)) {
        fieldErrors[f.key] = `${f.label} must be a whole integer.`;
        continue;
      }
      if (f.gt !== undefined && !(n > f.gt)) {
        fieldErrors[f.key] = `${f.label} must be greater than ${f.gt}.`;
        continue;
      }
      if (f.min !== undefined && n < f.min) {
        fieldErrors[f.key] = `${f.label} must be at least ${f.min}.`;
        continue;
      }
      if (f.max !== undefined && n > f.max) {
        fieldErrors[f.key] = `${f.label} must be at most ${f.max}.`;
        continue;
      }
      if (f.nonZero && n === 0) {
        fieldErrors[f.key] = `${f.label} cannot be zero.`;
        continue;
      }
      parsed[f.key] = n;
    } else if (f.kind === "select") {
      const allowed = f.options?.map((o) => o.value) ?? [];
      if (allowed.length > 0 && !allowed.includes(val)) {
        fieldErrors[f.key] = `Select a valid option for ${f.label.toLowerCase()}.`;
        continue;
      }
      parsed[f.key] = val;
    } else {
      if (val === "") {
        fieldErrors[f.key] = `Enter ${f.label.toLowerCase()}.`;
        continue;
      }
      parsed[f.key] = val;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, calcResult: null };
  }

  try {
    const res = spec.compute(parsed);
    return { fieldErrors: {}, calcResult: res };
  } catch (e) {
    return {
      fieldErrors: {},
      calcResult: err(e instanceof Error ? e.message : "Calculation failed."),
    };
  }
}

export function getDefaultRawInputs(spec: CalculatorSpec): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of spec.fields) {
    out[f.key] = f.defaultValue;
  }
  return out;
}

// ── Shared Mathematical, Statistical, Financial & Domain Primitives ──────────

export function parseNumList(raw: string, minLen = 1): Result<number[]> {
  const parts = raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < minLen) {
    return err(`Enter at least ${minLen} number${minLen === 1 ? "" : "s"} separated by commas.`);
  }
  const nums: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (!Number.isFinite(n)) {
      return err(`"${p}" is not a valid finite number.`);
    }
    nums.push(n);
  }
  return ok(nums);
}

export function gcdInt(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function gcdBig(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x === 0n ? 1n : x;
}

export function combNum(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return res;
}

export function permNum(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let res = 1;
  for (let i = 0; i < r; i++) res *= n - i;
  return res;
}

/** Abramowitz & Stegun 7.1.26 error function approximation (max error 1.5e-7). */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const poly =
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
    t;
  return sign * (1 - poly * Math.exp(-ax * ax));
}

export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

/** Acklam rational inverse normal approximation (~1.15e-9 relative accuracy). */
export function normalInv(p: number): number {
  if (p <= 0 || p >= 1) return NaN;
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const plow = 0.02425;
  const phigh = 1 - plow;
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (p <= phigh) {
    const q = p - 0.5;
    const r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

/** Standard amortising periodic payment: handles i = 0 removable singularity cleanly. */
export function pmt(principal: number, periodicRate: number, periods: number): number {
  if (periods <= 0) return NaN;
  if (Math.abs(periodicRate) < 1e-12) return principal / periods;
  return (principal * periodicRate) / (1 - Math.pow(1 + periodicRate, -periods));
}

export function npv(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);
}

export function solveIrr(cashFlows: number[]): { rate: number; iterations: number } | null {
  let hasPos = false;
  let hasNeg = false;
  for (const c of cashFlows) {
    if (c > 0) hasPos = true;
    if (c < 0) hasNeg = true;
  }
  if (!hasPos || !hasNeg) return null;

  let r = 0.1;
  for (let iter = 1; iter <= 100; iter++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      const denom = Math.pow(1 + r, t);
      f += cashFlows[t] / denom;
      if (t > 0) df -= (t * cashFlows[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(f) < 1e-8) return { rate: r, iterations: iter };
    if (Math.abs(df) < 1e-14) break;
    const next = r - f / df;
    if (next <= -0.9999 || !Number.isFinite(next)) break;
    if (Math.abs(next - r) < 1e-9) return { rate: next, iterations: iter };
    r = next;
  }

  // Fallback bracketed bisection on [-0.95, 10]
  let lo = -0.95;
  let hi = 10.0;
  let flo = npv(lo, cashFlows);
  const fhi = npv(hi, cashFlows);
  if (flo * fhi > 0) return null;
  for (let iter = 1; iter <= 100; iter++) {
    const mid = (lo + hi) / 2;
    const fmid = npv(mid, cashFlows);
    if (Math.abs(fmid) < 1e-8 || (hi - lo) / 2 < 1e-9) {
      return { rate: mid, iterations: iter };
    }
    if (flo * fmid <= 0) {
      hi = mid;
    } else {
      lo = mid;
      flo = fmid;
    }
  }
  return { rate: (lo + hi) / 2, iterations: 100 };
}

export function parseISODateUTC(raw: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== mo - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return dt;
}

export function formatISODateUTC(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseHexRGB(raw: string): [number, number, number] | null {
  const clean = raw.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }
  return null;
}

export function parseIPv4(raw: string): number[] | null {
  const parts = raw.trim().split(".");
  if (parts.length !== 4) return null;
  const nums: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n < 0 || n > 255) return null;
    nums.push(n);
  }
  return nums;
}

export function ipv4ToInt(octets: number[]): number {
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}

export function intToIPv4(val: number): string {
  const u = val >>> 0;
  return `${(u >>> 24) & 255}.${(u >>> 16) & 255}.${(u >>> 8) & 255}.${u & 255}`;
}

export function toRoman(n: number): string {
  const table: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let rem = Math.trunc(n);
  let out = "";
  for (const [v, sym] of table) {
    while (rem >= v) {
      out += sym;
      rem -= v;
    }
  }
  return out;
}

export function numberToWordsEn(n: number): string {
  if (!Number.isInteger(n) || Math.abs(n) > 999_999_999_999) {
    return String(n);
  }
  if (n === 0) return "zero";
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
  ];
  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
  ];
  const chunkWords = (x: number): string => {
    const parts: string[] = [];
    if (x >= 100) {
      parts.push(`${ones[Math.floor(x / 100)]} hundred`);
      x %= 100;
    }
    if (x >= 20) {
      const t = Math.floor(x / 10);
      const o = x % 10;
      parts.push(o ? `${tens[t]}-${ones[o]}` : tens[t]);
    } else if (x > 0) {
      parts.push(ones[x]);
    }
    return parts.join(" ");
  };
  let rem = Math.abs(n);
  const scales = ["", "thousand", "million", "billion"];
  const segs: string[] = [];
  let s = 0;
  while (rem > 0) {
    const c = rem % 1000;
    if (c > 0) {
      segs.unshift(scales[s] ? `${chunkWords(c)} ${scales[s]}` : chunkWords(c));
    }
    rem = Math.floor(rem / 1000);
    s++;
  }
  return (n < 0 ? "negative " : "") + segs.join(" ");
}

/** Safe recursive-descent arithmetic parser supporting +, -, *, /, ^, parentheses, unary -. */
export function evalArithmeticExpr(expr: string): Result<number> {
  const s = expr.replace(/\s+/g, "");
  if (!s) return err("Enter an arithmetic expression.");
  let pos = 0;

  function parseAddSub(): number {
    let left = parseMulDiv();
    while (pos < s.length && (s[pos] === "+" || s[pos] === "-")) {
      const op = s[pos++];
      const right = parseMulDiv();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  function parseMulDiv(): number {
    let left = parsePow();
    while (pos < s.length && (s[pos] === "*" || s[pos] === "/")) {
      const op = s[pos++];
      const right = parsePow();
      if (op === "/") {
        if (right === 0) throw new Error("Division by zero in expression.");
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  function parsePow(): number {
    const base = parseUnary();
    if (pos < s.length && s[pos] === "^") {
      pos++;
      const exp = parsePow();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseUnary(): number {
    if (s[pos] === "-") {
      pos++;
      return -parseUnary();
    }
    if (s[pos] === "+") {
      pos++;
      return parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    if (s[pos] === "(") {
      pos++;
      const v = parseAddSub();
      if (s[pos] !== ")") throw new Error("Unmatched parenthesis in expression.");
      pos++;
      return v;
    }
    const m = /^\d+(\.\d+)?/.exec(s.slice(pos));
    if (!m) throw new Error(`Unexpected token at "${s.slice(pos, pos + 10)}".`);
    pos += m[0].length;
    return Number(m[0]);
  }

  try {
    const val = parseAddSub();
    if (pos < s.length) {
      return err(`Unexpected trailing token "${s.slice(pos)}".`);
    }
    if (!Number.isFinite(val)) {
      return err("Expression evaluated outside finite numeric bounds.");
    }
    return ok(val);
  } catch (e) {
    return err(e instanceof Error ? e.message : "Invalid expression.");
  }
}

/** Smooth 1-D math function preset evaluator for calculus & root-finding calculators. */
export const MATH_FUNCTIONS: Record<
  string,
  { label: string; expr: string; fn: (x: number) => number; dfn: (x: number) => number }
> = {
  poly: {
    label: "x³ - 2x - 5",
    expr: "x³ - 2x - 5",
    fn: (x) => x * x * x - 2 * x - 5,
    dfn: (x) => 3 * x * x - 2,
  },
  quad: {
    label: "x² - 4",
    expr: "x² - 4",
    fn: (x) => x * x - 4,
    dfn: (x) => 2 * x,
  },
  sin: {
    label: "sin(x)",
    expr: "sin(x)",
    fn: (x) => Math.sin(x),
    dfn: (x) => Math.cos(x),
  },
  cos: {
    label: "cos(x) - x",
    expr: "cos(x) - x",
    fn: (x) => Math.cos(x) - x,
    dfn: (x) => -Math.sin(x) - 1,
  },
  exp: {
    label: "e^x - 3x",
    expr: "e^x - 3x",
    fn: (x) => Math.exp(x) - 3 * x,
    dfn: (x) => Math.exp(x) - 3,
  },
};

export const MATH_FN_OPTIONS: SelectOption[] = Object.entries(MATH_FUNCTIONS).map(
  ([value, meta]) => ({ value, label: meta.label })
);
