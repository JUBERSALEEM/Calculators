import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import {
  done,
  evalArithmeticExpr,
  gcdBig,
  gcdInt,
  intF,
  numF,
  outN,
  outS,
  parseNumList,
  posF,
  selF,
  txtF,
} from "@/lib/engine/helpers";

export const M01_SPECS: CalculatorSpec[] = [
  // ── C01 Basic Arithmetic and Percentages (14) ─────────────────────────────
  {
    slug: "percentage-of-a-number",
    fields: [numF("amount", "Base amount", 250), numF("percent", "Percentage", 18, "%")],
    formulaPlain: "portion = (percent / 100) × amount",
    variables: [{ symbol: "amount", description: "Base numeric quantity" }, { symbol: "percent", description: "Percentage rate (%)" }],
    compute: (v) => done([
      outN("Portion", (Number(v.amount) * Number(v.percent)) / 100, 4, undefined, true),
      outN("Remaining after subtraction", Number(v.amount) * (1 - Number(v.percent) / 100), 4),
    ]),
  },
  {
    slug: "percentage-change",
    fields: [numF("oldVal", "Original value (old)", 100, undefined, { nonZero: true }), numF("newVal", "New value", 120)],
    formulaPlain: "change% = ((new − old) / |old|) × 100",
    variables: [{ symbol: "old", description: "Initial reference value (non-zero)" }, { symbol: "new", description: "Final value" }],
    compute: (v) => {
      const a = Number(v.oldVal), b = Number(v.newVal);
      if (a === 0) return err("Percentage change from 0 is undefined (division by zero).");
      return done([
        outN("Percentage change", ((b - a) / Math.abs(a)) * 100, 2, "%", true),
        outN("Absolute change", b - a, 4),
      ]);
    },
  },
  {
    slug: "percentage-difference",
    fields: [posF("a", "Value A", 100), posF("b", "Value B", 120)],
    formulaPlain: "difference% = |A − B| / ((A + B) / 2) × 100",
    variables: [{ symbol: "A, B", description: "Positive quantities compared symmetrically against their mean" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b);
      const mean = (a + b) / 2;
      return done([
        outN("Symmetric difference", (Math.abs(a - b) / mean) * 100, 2, "%", true),
        outN("Arithmetic mean", mean, 4),
      ]);
    },
  },
  {
    slug: "percentage-point-change",
    fields: [numF("p1", "Initial percentage (p₁)", 12.5, "%"), numF("p2", "New percentage (p₂)", 15.0, "%")],
    formulaPlain: "Δpp = p₂ − p₁",
    variables: [{ symbol: "p₁, p₂", description: "Percentages expressed on the same scale" }],
    compute: (v) => {
      const p1 = Number(v.p1), p2 = Number(v.p2);
      const rel = p1 !== 0 ? ((p2 - p1) / Math.abs(p1)) * 100 : 0;
      return done([
        outN("Percentage point change", p2 - p1, 3, "pp", true),
        ...(p1 !== 0 ? [outN("Relative % change", rel, 2, "%")] : []),
      ]);
    },
  },
  {
    slug: "reverse-percentage",
    fields: [
      numF("finalVal", "Final value", 118),
      numF("pct", "Percentage applied (+ increase / − discount)", 18, "%"),
    ],
    formulaPlain: "original = final / (1 + pct / 100)",
    variables: [{ symbol: "final", description: "Resulting value after percentage was applied" }, { symbol: "pct", description: "Signed rate (%)" }],
    compute: (v) => {
      const f = Number(v.finalVal), p = Number(v.pct);
      const factor = 1 + p / 100;
      if (Math.abs(factor) < 1e-12) return err("A −100% reduction reduces every original value to 0 and cannot be reversed.");
      const orig = f / factor;
      return done([outN("Original value", orig, 4, undefined, true), outN("Change amount", f - orig, 4)]);
    },
  },
  {
    slug: "add-percentage",
    fields: [numF("val", "Starting value", 200), numF("pct", "Percentage to add", 15, "%")],
    formulaPlain: "increased = value × (1 + pct / 100)",
    variables: [{ symbol: "value", description: "Initial quantity" }, { symbol: "pct", description: "Percentage added (%)" }],
    compute: (v) => {
      const x = Number(v.val), p = Number(v.pct);
      const inc = (x * p) / 100;
      return done([outN("Increased value", x + inc, 4, undefined, true), outN("Added amount", inc, 4)]);
    },
  },
  {
    slug: "subtract-percentage",
    fields: [numF("val", "Starting value", 200), numF("pct", "Percentage to subtract", 20, "%")],
    formulaPlain: "reduced = value × (1 − pct / 100)",
    variables: [{ symbol: "value", description: "Initial quantity" }, { symbol: "pct", description: "Percentage subtracted (%)" }],
    compute: (v) => {
      const x = Number(v.val), p = Number(v.pct);
      const sub = (x * p) / 100;
      return done([outN("Reduced value", x - sub, 4, undefined, true), outN("Subtracted amount", sub, 4)]);
    },
  },
  {
    slug: "successive-percentage-change",
    fields: [txtF("rates", "Successive percentage changes (comma-separated %)", "10, -10, 25")],
    formulaPlain: "net% = (∏(1 + rᵢ / 100) − 1) × 100",
    variables: [{ symbol: "rᵢ", description: "Each sequential percentage change (%)" }],
    compute: (v) => {
      const parsed = parseNumList(String(v.rates), 1);
      if (!parsed.ok) return parsed;
      const mult = parsed.value.reduce((acc, r) => acc * (1 + r / 100), 1);
      return done([
        outN("Net cumulative change", (mult - 1) * 100, 4, "%", true),
        outN("Cumulative multiplier", mult, 6, "×"),
      ]);
    },
  },
  {
    slug: "percent-error",
    fields: [numF("measured", "Measured / experimental value", 9.85), numF("accepted", "Accepted / true value", 9.80665, undefined, { nonZero: true })],
    formulaPlain: "% error = |measured − accepted| / |accepted| × 100",
    variables: [{ symbol: "measured", description: "Observed value" }, { symbol: "accepted", description: "Reference true value (non-zero)" }],
    compute: (v) => {
      const m = Number(v.measured), a = Number(v.accepted);
      return done([
        outN("Absolute percent error", (Math.abs(m - a) / Math.abs(a)) * 100, 4, "%", true),
        outN("Signed percent error", ((m - a) / Math.abs(a)) * 100, 4, "%"),
        outN("Absolute residual", m - a, 6),
      ]);
    },
  },
  {
    slug: "percent-of-total",
    fields: [numF("part", "Part amount", 45), posF("total", "Total amount", 180)],
    formulaPlain: "share% = (part / total) × 100",
    variables: [{ symbol: "part", description: "Component quantity" }, { symbol: "total", description: "Whole total (> 0)" }],
    compute: (v) => {
      const part = Number(v.part), total = Number(v.total);
      return done([
        outN("Share of total", (part / total) * 100, 3, "%", true),
        outN("Remainder share", ((total - part) / total) * 100, 3, "%"),
      ]);
    },
  },
  {
    slug: "percent-of-percent",
    fields: [numF("base", "Base value", 1000), numF("pa", "First percentage (%A)", 40, "%"), numF("pb", "Second percentage (%B)", 25, "%")],
    formulaPlain: "combined% = (%A / 100) × (%B / 100) × 100; portion = base × combined% / 100",
    variables: [{ symbol: "%A, %B", description: "Nested percentages" }, { symbol: "base", description: "Base quantity" }],
    compute: (v) => {
      const b = Number(v.base), pa = Number(v.pa), pb = Number(v.pb);
      const comb = (pa * pb) / 100;
      return done([
        outN("Portion of base", (b * comb) / 100, 4, undefined, true),
        outN("Combined percentage", comb, 4, "%"),
      ]);
    },
  },
  {
    slug: "recover-loss-gain",
    fields: [posF("loss", "Percentage loss", 25, "%", { max: 99.9999 })],
    formulaPlain: "gain% = (loss% / (100 − loss%)) × 100",
    variables: [{ symbol: "loss%", description: "Drawdown percentage (0 < loss% < 100)" }],
    compute: (v) => {
      const l = Number(v.loss);
      if (l >= 100) return err("A 100% loss leaves zero capital and cannot be recovered by percentage return.");
      return done([
        outN("Gain required to break even", (l / (100 - l)) * 100, 2, "%", true),
        outN("Remaining fraction of capital", 100 - l, 2, "%"),
      ]);
    },
  },
  {
    slug: "order-of-operations",
    fields: [txtF("expr", "Arithmetic expression (+, −, *, /, ^, parentheses)", "(12 + 8) * 3 - 4^2 / 2")],
    formulaPlain: "PEMDAS / BODMAS: Parentheses → Exponents (right-associative) → Multiply/Divide → Add/Subtract",
    variables: [{ symbol: "expr", description: "Infix numeric arithmetic expression" }],
    compute: (v) => {
      const res = evalArithmeticExpr(String(v.expr));
      if (!res.ok) return res;
      return done([outN("Evaluated result", res.value, 6, undefined, true)]);
    },
  },
  {
    slug: "rounding-modes",
    fields: [
      numF("x", "Number to round", 2.345),
      intF("places", "Decimal places", 2, { min: 0, max: 10 }),
      selF("mode", "Rounding mode", [
        { value: "half-up", label: "Round half away from zero (standard)" },
        { value: "half-even", label: "Round half to even (banker's IEEE 754)" },
        { value: "floor", label: "Floor (−∞)" },
        { value: "ceil", label: "Ceiling (+∞)" },
        { value: "trunc", label: "Truncate toward zero" },
      ]),
    ],
    formulaPlain: "Scaled by 10^places under selected tie-breaking rule",
    variables: [{ symbol: "x", description: "Input real number" }, { symbol: "places", description: "Decimal digits kept" }],
    compute: (v) => {
      const x = Number(v.x), p = Number(v.places), mode = String(v.mode);
      const scale = Math.pow(10, p);
      const s = Number((x * scale).toPrecision(15));
      let r: number;
      if (mode === "floor") r = Math.floor(s);
      else if (mode === "ceil") r = Math.ceil(s);
      else if (mode === "trunc") r = Math.trunc(s);
      else if (mode === "half-up") r = Math.sign(s) * Math.floor(Math.abs(s) + 0.5 + 1e-14);
      else {
        const fl = Math.floor(s);
        const diff = s - fl;
        if (Math.abs(diff - 0.5) < 1e-12) r = fl % 2 === 0 ? fl : fl + 1;
        else r = Math.round(s);
      }
      const val = r / scale;
      return done([outS("Rounded result", val.toFixed(p), undefined, true), outN("Rounding difference", val - x, 8)]);
    },
  },

  // ── C02 Fractions, Ratios, Proportions and Averages (17) ──────────────────
  {
    slug: "fraction-arithmetic",
    fields: [
      intF("n1", "Numerator 1", 3), intF("d1", "Denominator 1", 4, { nonZero: true }),
      selF("op", "Operation", [
        { value: "add", label: "Add (+)" }, { value: "sub", label: "Subtract (−)" },
        { value: "mul", label: "Multiply (×)" }, { value: "div", label: "Divide (÷)" },
      ]),
      intF("n2", "Numerator 2", 2), intF("d2", "Denominator 2", 3, { nonZero: true }),
    ],
    formulaPlain: "a/b ± c/d = (ad ± bc)/(bd), reduced via gcd(|num|, den)",
    variables: [{ symbol: "a/b, c/d", description: "Exact rational fractions (BigInt arithmetic)" }],
    compute: (v) => {
      const a = BigInt(Number(v.n1)), b = BigInt(Number(v.d1));
      const c = BigInt(Number(v.n2)), d = BigInt(Number(v.d2));
      const op = String(v.op);
      let num: bigint, den: bigint;
      if (op === "add") { num = a * d + c * b; den = b * d; }
      else if (op === "sub") { num = a * d - c * b; den = b * d; }
      else if (op === "mul") { num = a * c; den = b * d; }
      else {
        if (c === 0n) return err("Cannot divide by a zero fraction (0/d).");
        num = a * d; den = b * c;
      }
      if (den < 0n) { num = -num; den = -den; }
      const g = gcdBig(num, den);
      num /= g; den /= g;
      return done([
        outS("Exact reduced fraction", `${num}/${den}`, undefined, true),
        outN("Decimal equivalent", Number(num) / Number(den), 6),
      ]);
    },
  },
  {
    slug: "simplify-fraction",
    fields: [intF("num", "Numerator", 84), intF("den", "Denominator", 126, { nonZero: true })],
    formulaPlain: "(num ÷ g) / (den ÷ g), where g = gcd(|num|, |den|)",
    variables: [{ symbol: "g", description: "Greatest common divisor" }],
    compute: (v) => {
      let n = BigInt(Number(v.num)), d = BigInt(Number(v.den));
      if (d < 0n) { n = -n; d = -d; }
      const g = gcdBig(n, d);
      return done([
        outS("Simplified fraction", `${n / g}/${d / g}`, undefined, true),
        outS("Greatest common divisor", String(g)),
        outN("Decimal value", Number(n) / Number(d), 6),
      ]);
    },
  },
  {
    slug: "mixed-number-converter",
    fields: [intF("num", "Improper numerator", 23), intF("den", "Denominator", 6, { gt: 0 })],
    formulaPlain: "num / den = q + r / den, where q = trunc(num / den)",
    variables: [{ symbol: "q", description: "Whole integer part" }, { symbol: "r", description: "Remainder" }],
    compute: (v) => {
      const n = Number(v.num), d = Number(v.den);
      const sign = n < 0 ? "-" : "";
      const an = Math.abs(n);
      const q = Math.floor(an / d);
      const r = an % d;
      const g = gcdInt(r, d);
      return done([
        outS("Mixed number", r === 0 ? `${sign}${q}` : `${sign}${q} ${r / g}/${d / g}`, undefined, true),
        outN("Decimal value", n / d, 6),
      ]);
    },
  },
  {
    slug: "fraction-to-decimal",
    fields: [intF("num", "Numerator", 7), intF("den", "Denominator", 8, { nonZero: true }), intF("places", "Decimal places", 6, { min: 1, max: 12 })],
    formulaPlain: "decimal = numerator ÷ denominator",
    variables: [{ symbol: "num, den", description: "Integer numerator and non-zero denominator" }],
    compute: (v) => {
      const dec = Number(v.num) / Number(v.den);
      return done([
        outS("Decimal", dec.toFixed(Number(v.places)), undefined, true),
        outN("Percentage", dec * 100, 4, "%"),
      ]);
    },
  },
  {
    slug: "decimal-to-fraction",
    fields: [numF("dec", "Terminating decimal", 0.375)],
    formulaPlain: "x = round(dec × 10^k) / 10^k reduced by gcd",
    variables: [{ symbol: "dec", description: "Finite decimal number" }],
    compute: (v) => {
      const raw = String(v.dec).trim();
      const dec = Number(v.dec);
      const fracDigits = raw.includes(".") ? Math.min(9, raw.split(".")[1].replace(/e.*/i, "").length) : 0;
      const den = BigInt(Math.round(Math.pow(10, Math.max(fracDigits, 6))));
      const num = BigInt(Math.round(dec * Number(den)));
      const g = gcdBig(num, den);
      return done([
        outS("Exact reduced fraction", `${num / g}/${den / g}`, undefined, true),
        outN("Percentage", dec * 100, 4, "%"),
      ]);
    },
  },
  {
    slug: "repeating-decimal-to-fraction",
    fields: [txtF("nonRep", "Non-repeating digits after decimal (optional, e.g. 1 for 0.1666...)", "1"), txtF("rep", "Repeating digits (e.g. 6 for 0.1666...)", "6")],
    formulaPlain: "x = (prefix·10^k + rep − prefix) / (10^m · (10^k − 1))",
    variables: [{ symbol: "m", description: "Non-repeating digit count" }, { symbol: "k", description: "Repeating cycle length" }],
    compute: (v) => {
      const preRaw = String(v.nonRep).trim();
      const repRaw = String(v.rep).trim();
      if (!/^\d*$/.test(preRaw) || !/^\d+$/.test(repRaw)) {
        return err("Enter digits 0–9 only for prefix and repeating block.");
      }
      const m = BigInt(preRaw.length);
      const k = BigInt(repRaw.length);
      const pre = preRaw ? BigInt(preRaw) : 0n;
      const rep = BigInt(repRaw);
      const tenM = 10n ** m;
      const tenK = 10n ** k;
      const num = pre * tenK + rep - pre;
      const den = tenM * (tenK - 1n);
      const g = gcdBig(num, den);
      return done([
        outS("Exact fraction", `${num / g}/${den / g}`, undefined, true),
        outN("Decimal approximation", Number(num / g) / Number(den / g), 8),
      ]);
    },
  },
  {
    slug: "ratio-simplifier",
    fields: [txtF("terms", "Positive integer ratio terms (comma or colon separated)", "24, 36, 60")],
    formulaPlain: "a : b : c → (a/g) : (b/g) : (c/g), g = gcd(terms)",
    variables: [{ symbol: "g", description: "Greatest common divisor of all terms" }],
    compute: (v) => {
      const parsed = parseNumList(String(v.terms).replace(/:/g, ","), 2);
      if (!parsed.ok) return parsed;
      if (parsed.value.some((n) => !Number.isInteger(n) || n <= 0)) {
        return err("Enter positive whole integers for exact ratio reduction.");
      }
      const g = parsed.value.reduce((acc, n) => gcdInt(acc, n));
      return done([
        outS("Reduced ratio", parsed.value.map((n) => n / g).join(" : "), undefined, true),
        outN("Divisor (GCD)", g, 0),
      ]);
    },
  },
  {
    slug: "ratio-to-decimal",
    fields: [numF("a", "Antecedent (A)", 3), numF("b", "Consequent (B)", 5, undefined, { nonZero: true })],
    formulaPlain: "quotient = A / B; share of whole = A / (A + B)",
    variables: [{ symbol: "A : B", description: "Two-part ratio" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b);
      const q = a / b;
      return done([
        outN("Decimal ratio (A ÷ B)", q, 6, undefined, true),
        outN("As percentage of B", q * 100, 3, "%"),
        ...(a + b !== 0 ? [outN("Share of total A/(A+B)", (a / (a + b)) * 100, 3, "%")] : []),
      ]);
    },
  },
  {
    slug: "proportion-solver",
    fields: [numF("a", "A (numerator left)", 4, undefined, { nonZero: true }), numF("b", "B (denominator left)", 7, undefined, { nonZero: true }), numF("c", "C (numerator right)", 12)],
    formulaPlain: "A / B = C / x  ⇒  x = (B × C) / A",
    variables: [{ symbol: "A, B, C", description: "Known terms of proportion A/B = C/x" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      return done([
        outN("Unknown term x", (b * c) / a, 6, undefined, true),
        outN("Common ratio (A/B)", a / b, 6),
      ]);
    },
  },
  {
    slug: "drawing-scale",
    fields: [posF("scale", "Scale denominator n (1 : n)", 50), posF("measured", "Drawing measurement", 6.4, "cm")],
    formulaPlain: "real length = measured × n",
    variables: [{ symbol: "1:n", description: "Scale ratio" }, { symbol: "measured", description: "Length on plan (cm)" }],
    compute: (v) => {
      const realCm = Number(v.measured) * Number(v.scale);
      return done([
        outN("Real-world length (metres)", realCm / 100, 4, "m", true),
        outN("Real-world length (cm)", realCm, 2, "cm"),
      ]);
    },
  },
  {
    slug: "arithmetic-mean",
    fields: [txtF("values", "Numbers (comma-separated)", "12, 18, 24, 30, 36")],
    formulaPlain: "x̄ = (∑ xᵢ) / n",
    variables: [{ symbol: "xᵢ", description: "Dataset values" }, { symbol: "n", description: "Sample size" }],
    compute: (v) => {
      const p = parseNumList(String(v.values), 1);
      if (!p.ok) return p;
      const sum = p.value.reduce((a, b) => a + b, 0);
      return done([
        outN("Arithmetic mean", sum / p.value.length, 6, undefined, true),
        outN("Sum", sum, 6),
        outN("Count (n)", p.value.length, 0),
      ]);
    },
  },
  {
    slug: "weighted-average",
    fields: [txtF("values", "Values (comma-separated)", "85, 92, 78"), txtF("weights", "Weights (comma-separated)", "0.2, 0.5, 0.3")],
    formulaPlain: "x̄_w = (∑ wᵢ·xᵢ) / (∑ wᵢ)",
    variables: [{ symbol: "xᵢ", description: "Values" }, { symbol: "wᵢ", description: "Non-negative weights" }],
    compute: (v) => {
      const xs = parseNumList(String(v.values), 1);
      const ws = parseNumList(String(v.weights), 1);
      if (!xs.ok) return xs;
      if (!ws.ok) return ws;
      if (xs.value.length !== ws.value.length) return err("Values and weights must have the exact same length.");
      if (ws.value.some((w) => w < 0)) return err("Weights must be non-negative.");
      const wSum = ws.value.reduce((a, b) => a + b, 0);
      if (wSum <= 0) return err("Sum of weights must be greater than zero.");
      const wx = xs.value.reduce((acc, x, i) => acc + x * ws.value[i], 0);
      return done([outN("Weighted mean", wx / wSum, 6, undefined, true), outN("Total weight", wSum, 4)]);
    },
  },
  {
    slug: "average-of-averages",
    fields: [txtF("means", "Subgroup means (comma-separated)", "74, 82, 91"), txtF("sizes", "Subgroup sample sizes (comma-separated)", "30, 45, 25")],
    formulaPlain: "x̄_pooled = (∑ nᵢ·x̄ᵢ) / (∑ nᵢ)",
    variables: [{ symbol: "x̄ᵢ", description: "Group means" }, { symbol: "nᵢ", description: "Group sample sizes (> 0)" }],
    compute: (v) => {
      const ms = parseNumList(String(v.means), 1);
      const ns = parseNumList(String(v.sizes), 1);
      if (!ms.ok) return ms;
      if (!ns.ok) return ns;
      if (ms.value.length !== ns.value.length) return err("Group means and group sizes must have equal count.");
      if (ns.value.some((n) => n <= 0)) return err("Each subgroup size must be greater than zero.");
      const totN = ns.value.reduce((a, b) => a + b, 0);
      const weighted = ms.value.reduce((acc, m, i) => acc + m * ns.value[i], 0);
      return done([outN("Pooled overall mean", weighted / totN, 6, undefined, true), outN("Total combined count", totN, 0)]);
    },
  },
  {
    slug: "harmonic-mean",
    fields: [txtF("values", "Positive rates / values (comma-separated)", "60, 40")],
    formulaPlain: "H = n / ∑(1 / xᵢ)",
    variables: [{ symbol: "xᵢ", description: "Strictly positive numbers (e.g., speeds over equal distance)" }],
    compute: (v) => {
      const xs = parseNumList(String(v.values), 1);
      if (!xs.ok) return xs;
      if (xs.value.some((x) => x <= 0)) return err("Harmonic mean is defined only for strictly positive values.");
      const invSum = xs.value.reduce((acc, x) => acc + 1 / x, 0);
      return done([
        outN("Harmonic mean", xs.value.length / invSum, 6, undefined, true),
        outN("Arithmetic mean (for comparison)", xs.value.reduce((a, b) => a + b, 0) / xs.value.length, 6),
      ]);
    },
  },
  {
    slug: "geometric-mean",
    fields: [txtF("values", "Positive values / growth factors (comma-separated)", "1.10, 1.25, 0.96")],
    formulaPlain: "G = exp((1 / n) · ∑ ln(xᵢ))",
    variables: [{ symbol: "xᵢ", description: "Strictly positive numbers" }],
    compute: (v) => {
      const xs = parseNumList(String(v.values), 1);
      if (!xs.ok) return xs;
      if (xs.value.some((x) => x <= 0)) return err("Geometric mean requires strictly positive inputs.");
      const logMean = xs.value.reduce((acc, x) => acc + Math.log(x), 0) / xs.value.length;
      return done([outN("Geometric mean", Math.exp(logMean), 6, undefined, true)]);
    },
  },
  {
    slug: "unit-rate",
    fields: [numF("total", "Total cost / output", 14.4), posF("qty", "Quantity / units", 6)],
    formulaPlain: "unit rate = total ÷ quantity",
    variables: [{ symbol: "total", description: "Total amount" }, { symbol: "qty", description: "Number of units (> 0)" }],
    compute: (v) => done([
      outN("Rate per single unit", Number(v.total) / Number(v.qty), 4, "per unit", true),
      ...(Number(v.total) !== 0 ? [outN("Units per 1 unit of cost", Number(v.qty) / Number(v.total), 4)] : []),
    ]),
  },
  {
    slug: "proportional-split",
    fields: [numF("total", "Total amount to split", 1200), txtF("ratios", "Positive ratio parts (comma-separated)", "2, 3, 5")],
    formulaPlain: "shareᵢ = total × (rᵢ / ∑ r)",
    variables: [{ symbol: "total", description: "Total sum distributed" }, { symbol: "rᵢ", description: "Relative share weights" }],
    compute: (v) => {
      const rs = parseNumList(String(v.ratios), 2);
      if (!rs.ok) return rs;
      if (rs.value.some((r) => r < 0)) return err("Ratio weights cannot be negative.");
      const sum = rs.value.reduce((a, b) => a + b, 0);
      if (sum <= 0) return err("At least one ratio weight must be positive.");
      const shares = rs.value.map((r) => (Number(v.total) * r) / sum);
      return done([
        outS("Allocated shares", shares.map((s) => s.toFixed(2)).join(" | "), undefined, true),
        outN("Largest share", Math.max(...shares), 4),
        outN("Smallest share", Math.min(...shares), 4),
      ]);
    },
  },

  // ── C03 Algebra and Equation Solving (14) ──────────────────────────────────
  {
    slug: "quadratic-solver",
    fields: [numF("a", "Coefficient a (x²)", 1, undefined, { nonZero: true }), numF("b", "Coefficient b (x)", -5), numF("c", "Constant c", 6)],
    formulaPlain: "ax² + bx + c = 0; D = b² − 4ac; q = −½(b + sign(b)√D), x₁ = q/a, x₂ = c/q",
    variables: [{ symbol: "a, b, c", description: "Quadratic coefficients (a ≠ 0)" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      const D = b * b - 4 * a * c;
      if (D > 0) {
        const sgn = b >= 0 ? 1 : -1;
        const q = -0.5 * (b + sgn * Math.sqrt(D));
        const x1 = q / a;
        const x2 = q === 0 ? 0 : c / q;
        return done([
          outS("Real roots", `x₁ = ${x1.toFixed(6)}, x₂ = ${x2.toFixed(6)}`, undefined, true),
          outN("Discriminant (Δ)", D, 6),
        ]);
      }
      if (Math.abs(D) <= 1e-14) {
        return done([outN("Repeated real root x", -b / (2 * a), 6, undefined, true), outN("Discriminant (Δ)", 0, 6)]);
      }
      const re = -b / (2 * a), im = Math.sqrt(-D) / Math.abs(2 * a);
      return done([
        outS("Complex conjugate roots", `${re.toFixed(6)} ± ${im.toFixed(6)}i`, undefined, true),
        outN("Discriminant (Δ)", D, 6),
      ]);
    },
  },
  {
    slug: "cubic-solver",
    fields: [numF("a", "a (x³)", 1, undefined, { nonZero: true }), numF("b", "b (x²)", -6), numF("c", "c (x)", 11), numF("d", "d (constant)", -6)],
    formulaPlain: "ax³ + bx² + cx + d = 0 depressed via x = t − b/(3a) (Cardano / Viète)",
    variables: [{ symbol: "a, b, c, d", description: "Cubic polynomial coefficients (a ≠ 0)" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b) / a, c = Number(v.c) / a, d = Number(v.d) / a;
      const p = (3 * c - b * b) / 3;
      const q = (2 * b * b * b - 9 * b * c + 27 * d) / 27;
      const disc = (q * q) / 4 + (p * p * p) / 27;
      const shift = b / 3;
      if (disc > 1e-12) {
        const sq = Math.sqrt(disc);
        const r1 = Math.cbrt(-q / 2 + sq) + Math.cbrt(-q / 2 - sq) - shift;
        return done([outN("Unique real root x₁", r1, 6, undefined, true), outN("Cubic discriminant", disc, 6)]);
      }
      if (Math.abs(disc) <= 1e-12) {
        const u = Math.cbrt(-q / 2);
        return done([outS("Real roots", `${(2 * u - shift).toFixed(5)}, ${(-u - shift).toFixed(5)}`, undefined, true)]);
      }
      const r = 2 * Math.sqrt(-p / 3);
      const phi = Math.acos(Math.max(-1, Math.min(1, (3 * q) / (2 * p * Math.sqrt(-p / 3)))));
      const roots = [0, 1, 2].map((k) => r * Math.cos((phi - 2 * Math.PI * k) / 3) - shift).sort((x, y) => x - y);
      return done([outS("Three real roots", roots.map((z) => z.toFixed(6)).join(", "), undefined, true)]);
    },
  },
  {
    slug: "linear-equation-solver",
    fields: [numF("a", "Coefficient a", 4, undefined, { nonZero: true }), numF("b", "Constant b", -7), numF("c", "Right-hand side c", 13)],
    formulaPlain: "ax + b = c  ⇒  x = (c − b) / a",
    variables: [{ symbol: "a, b, c", description: "Linear equation parameters (a ≠ 0)" }],
    compute: (v) => done([outN("Solution x", (Number(v.c) - Number(v.b)) / Number(v.a), 6, undefined, true)]),
  },
  {
    slug: "two-equation-system",
    fields: [
      numF("a1", "a₁ (x in eq 1)", 2), numF("b1", "b₁ (y in eq 1)", 3), numF("c1", "c₁ (RHS eq 1)", 13),
      numF("a2", "a₂ (x in eq 2)", 5), numF("b2", "b₂ (y in eq 2)", -2), numF("c2", "c₂ (RHS eq 2)", 4),
    ],
    formulaPlain: "Cramer's rule: det = a₁b₂ − a₂b₁; x = (c₁b₂ − c₂b₁)/det, y = (a₁c₂ − a₂c₁)/det",
    variables: [{ symbol: "det", description: "2×2 system determinant" }],
    compute: (v) => {
      const a1 = Number(v.a1), b1 = Number(v.b1), c1 = Number(v.c1);
      const a2 = Number(v.a2), b2 = Number(v.b2), c2 = Number(v.c2);
      const det = a1 * b2 - a2 * b1;
      if (Math.abs(det) < 1e-12) return err("Singular 2×2 system (determinant = 0): lines are parallel or coincident.");
      return done([
        outN("x", (c1 * b2 - c2 * b1) / det, 6, undefined, true),
        outN("y", (a1 * c2 - a2 * c1) / det, 6, undefined, true),
        outN("Determinant", det, 6),
      ]);
    },
  },
  {
    slug: "three-equation-system",
    fields: [
      txtF("r1", "Row 1 [a1, b1, c1, rhs1]", "2, 1, -1, 8"),
      txtF("r2", "Row 2 [a2, b2, c2, rhs2]", "-3, -1, 2, -11"),
      txtF("r3", "Row 3 [a3, b3, c3, rhs3]", "-2, 1, 2, -3"),
    ],
    formulaPlain: "Gaussian elimination with partial pivoting on augmented 3×4 matrix [A | b]",
    variables: [{ symbol: "[A | b]", description: "Three linear equations in x, y, z" }],
    compute: (v) => {
      const rows = [v.r1, v.r2, v.r3].map((s) => parseNumList(String(s), 4));
      for (const r of rows) if (!r.ok) return r;
      const M = rows.map((r) => (r.ok ? r.value.slice(0, 4) : []));
      for (let col = 0; col < 3; col++) {
        let piv = col;
        for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
        if (Math.abs(M[piv][col]) < 1e-11) return err("Singular 3×3 system: no unique solution.");
        [M[col], M[piv]] = [M[piv], M[col]];
        for (let r = col + 1; r < 3; r++) {
          const f = M[r][col] / M[col][col];
          for (let j = col; j < 4; j++) M[r][j] -= f * M[col][j];
        }
      }
      const sol = [0, 0, 0];
      for (let i = 2; i >= 0; i--) {
        let s = M[i][3];
        for (let j = i + 1; j < 3; j++) s -= M[i][j] * sol[j];
        sol[i] = s / M[i][i];
      }
      return done([
        outN("x", sol[0], 6, undefined, true),
        outN("y", sol[1], 6, undefined, true),
        outN("z", sol[2], 6, undefined, true),
      ]);
    },
  },
  {
    slug: "polynomial-evaluator",
    fields: [txtF("coeffs", "Coefficients descending (aₙ ... a₀)", "2, -3, 0, 5"), numF("x", "Point x", 3)],
    formulaPlain: "Horner's method: P(x) = (...((aₙx + aₙ₋₁)x + ...)x + a₀)",
    variables: [{ symbol: "aᵢ", description: "Polynomial coefficients highest degree first" }, { symbol: "x", description: "Evaluation point" }],
    compute: (v) => {
      const cs = parseNumList(String(v.coeffs), 1);
      if (!cs.ok) return cs;
      const x = Number(v.x);
      let acc = 0, deriv = 0;
      for (const c of cs.value) { deriv = deriv * x + acc; acc = acc * x + c; }
      return done([outN("P(x)", acc, 6, undefined, true), outN("Derivative P'(x)", deriv, 6)]);
    },
  },
  {
    slug: "nth-root",
    fields: [numF("x", "Radicand x", -27), intF("n", "Root index n", 3, { gt: 0 })],
    formulaPlain: "x^(1/n); real for negative x iff n is an odd positive integer",
    variables: [{ symbol: "x", description: "Radicand" }, { symbol: "n", description: "Positive integer root order" }],
    compute: (v) => {
      const x = Number(v.x), n = Number(v.n);
      if (x < 0 && n % 2 === 0) return err(`Even root (n = ${n}) of a negative real number (${x}) has no real value.`);
      const root = x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
      return done([outN(`${n}th real root`, root, 8, undefined, true)]);
    },
  },
  {
    slug: "exponent-power",
    fields: [numF("base", "Base (b)", 2.5), numF("exp", "Exponent (y)", 4)],
    formulaPlain: "power = b^y",
    variables: [{ symbol: "b", description: "Base" }, { symbol: "y", description: "Exponent" }],
    compute: (v) => {
      const b = Number(v.base), y = Number(v.exp);
      if (b === 0 && y < 0) return err("0 raised to a negative power implies division by zero.");
      if (b < 0 && !Number.isInteger(y)) return err("Negative base with non-integer exponent has no real result.");
      return done([outN("b^y", Math.pow(b, y), 8, undefined, true)]);
    },
  },
  {
    slug: "logarithm",
    fields: [posF("x", "Argument x", 1024), posF("base", "Base b", 2)],
    formulaPlain: "log_b(x) = ln(x) / ln(b), x > 0, b > 0, b ≠ 1",
    variables: [{ symbol: "x", description: "Positive argument" }, { symbol: "b", description: "Positive base ≠ 1" }],
    compute: (v) => {
      const x = Number(v.x), b = Number(v.base);
      if (Math.abs(b - 1) < 1e-12) return err("Logarithm base cannot equal 1.");
      return done([
        outN("log_b(x)", Math.log(x) / Math.log(b), 8, undefined, true),
        outN("Natural log ln(x)", Math.log(x), 8),
        outN("Common log log₁₀(x)", Math.log10(x), 8),
      ]);
    },
  },
  {
    slug: "antilog-exponential",
    fields: [numF("y", "Logarithm value y", 3), posF("base", "Base b", 10)],
    formulaPlain: "x = b^y",
    variables: [{ symbol: "y", description: "Exponent / log value" }, { symbol: "b", description: "Positive base" }],
    compute: (v) => done([outN("Antilog (b^y)", Math.pow(Number(v.base), Number(v.y)), 8, undefined, true)]),
  },
  {
    slug: "radical-simplifier",
    fields: [intF("n", "Positive integer under √n", 72, { gt: 0, max: 100000000 })],
    formulaPlain: "√n = a·√b where a² is the largest square divisor of n",
    variables: [{ symbol: "n", description: "Positive integer radicand" }],
    compute: (v) => {
      const n = Number(v.n);
      let a = 1, b = n;
      for (let d = 2; d * d <= b; d++) {
        while (b % (d * d) === 0) { a *= d; b /= d * d; }
      }
      return done([
        outS("Exact simplified form", b === 1 ? `${a}` : a === 1 ? `√${b}` : `${a}√${b}`, undefined, true),
        outN("Decimal value", Math.sqrt(n), 8),
      ]);
    },
  },
  {
    slug: "linear-inequality",
    fields: [numF("a", "Coefficient a", -3, undefined, { nonZero: true }), numF("b", "Constant b", 5), numF("c", "Right-hand side c", 14)],
    formulaPlain: "ax + b < c  ⇒  x < (c−b)/a if a > 0, or x > (c−b)/a if a < 0",
    variables: [{ symbol: "a, b, c", description: "Linear inequality ax + b < c (a ≠ 0)" }],
    compute: (v) => {
      const a = Number(v.a), boundary = (Number(v.c) - Number(v.b)) / a;
      return done([
        outS("Solution interval", a > 0 ? `(-∞, ${boundary.toFixed(6)})` : `(${boundary.toFixed(6)}, +∞)`, undefined, true),
        outN("Boundary point", boundary, 6),
      ]);
    },
  },
  {
    slug: "absolute-value-equation",
    fields: [numF("a", "Coefficient a", 2, undefined, { nonZero: true }), numF("b", "Offset b", -5), numF("c", "Target c (≥ 0)", 9)],
    formulaPlain: "|ax + b| = c  ⇒  ax + b = ±c (no solution when c < 0)",
    variables: [{ symbol: "a, b, c", description: "Parameters of |ax + b| = c" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      if (c < 0) return err("No real solutions exist because |ax + b| ≥ 0 cannot equal a negative number.");
      if (c === 0) return done([outN("Unique root x", -b / a, 6, undefined, true)]);
      const x1 = (c - b) / a, x2 = (-c - b) / a;
      return done([outS("Two real roots", `x₁ = ${Math.min(x1, x2).toFixed(6)}, x₂ = ${Math.max(x1, x2).toFixed(6)}`, undefined, true)]);
    },
  },
  {
    slug: "variation-solver",
    fields: [
      selF("kind", "Variation model", [{ value: "direct", label: "Direct (y = k·x)" }, { value: "inverse", label: "Inverse (y = k / x)" }]),
      numF("k", "Constant of variation k", 24),
      numF("x", "Input variable x", 6, undefined, { nonZero: true }),
    ],
    formulaPlain: "Direct: y = k·x; Inverse: y = k / x",
    variables: [{ symbol: "k", description: "Proportionality constant" }, { symbol: "x", description: "Independent variable" }],
    compute: (v) => {
      const k = Number(v.k), x = Number(v.x);
      const y = v.kind === "direct" ? k * x : k / x;
      return done([outN("Result y", y, 6, undefined, true)]);
    },
  },

  // ── C04 Geometry and Mensuration (23) ──────────────────────────────────────
  {
    slug: "circle-area",
    fields: [posF("r", "Radius (r)", 7.5, "units")],
    formulaPlain: "A = πr²; C = 2πr; d = 2r",
    variables: [{ symbol: "r", description: "Circle radius (> 0)" }],
    compute: (v) => {
      const r = Number(v.r);
      return done([outN("Area (A)", Math.PI * r * r, 4, "sq units", true), outN("Circumference (C)", 2 * Math.PI * r, 4, "units"), outN("Diameter (d)", 2 * r, 4, "units")]);
    },
  },
  {
    slug: "triangle-area-heron",
    fields: [posF("a", "Side a", 5), posF("b", "Side b", 6), posF("c", "Side c", 7)],
    formulaPlain: "s = (a + b + c)/2; A = √(s(s − a)(s − b)(s − c))",
    variables: [{ symbol: "a, b, c", description: "Side lengths satisfying triangle inequality" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      if (a + b <= c || a + c <= b || b + c <= a) return err("Sides violate the strict triangle inequality (sum of any two sides must exceed the third).");
      const s = (a + b + c) / 2;
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
      const angA = (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
      return done([outN("Area (A)", area, 4, "sq units", true), outN("Perimeter", a + b + c, 4, "units"), outN("Angle opposite a", angA, 2, "°")]);
    },
  },
  {
    slug: "pythagorean-theorem",
    fields: [
      selF("solveFor", "Solve for", [{ value: "hyp", label: "Hypotenuse c from legs a, b" }, { value: "leg", label: "Unknown leg b from leg a & hypotenuse c" }]),
      posF("a", "Leg a", 3), posF("other", "Leg b (or Hypotenuse c)", 4),
    ],
    formulaPlain: "a² + b² = c²",
    variables: [{ symbol: "a, b", description: "Perpendicular legs" }, { symbol: "c", description: "Hypotenuse" }],
    compute: (v) => {
      const a = Number(v.a), o = Number(v.other);
      if (v.solveFor === "hyp") {
        const c = Math.hypot(a, o);
        return done([outN("Hypotenuse c", c, 6, undefined, true), outN("Right triangle area", 0.5 * a * o, 4)]);
      }
      if (o <= a) return err("Hypotenuse c must be strictly greater than leg a.");
      const b = Math.sqrt(o * o - a * a);
      return done([outN("Unknown leg b", b, 6, undefined, true), outN("Right triangle area", 0.5 * a * b, 4)]);
    },
  },
  {
    slug: "rectangle-area",
    fields: [posF("l", "Length (L)", 12), posF("w", "Width (W)", 8)],
    formulaPlain: "A = L·W; P = 2(L + W); d = √(L² + W²)",
    variables: [{ symbol: "L, W", description: "Adjacent side lengths" }],
    compute: (v) => {
      const l = Number(v.l), w = Number(v.w);
      return done([outN("Area", l * w, 4, "sq units", true), outN("Perimeter", 2 * (l + w), 4, "units"), outN("Diagonal", Math.hypot(l, w), 4, "units")]);
    },
  },
  {
    slug: "parallelogram-area",
    fields: [posF("b", "Base (b)", 10), posF("h", "Perpendicular height (h)", 6), posF("s", "Side length (a)", 7)],
    formulaPlain: "A = b·h; P = 2(a + b)",
    variables: [{ symbol: "b, h, a", description: "Base, altitude, and oblique side (a ≥ h)" }],
    compute: (v) => {
      const b = Number(v.b), h = Number(v.h), s = Number(v.s);
      if (s < h) return err("Oblique side length cannot be shorter than perpendicular height.");
      return done([outN("Area", b * h, 4, "sq units", true), outN("Perimeter", 2 * (b + s), 4, "units")]);
    },
  },
  {
    slug: "trapezoid-area",
    fields: [posF("a", "Parallel base a", 8), posF("b", "Parallel base b", 14), posF("h", "Height h", 5)],
    formulaPlain: "A = ½ · (a + b) · h",
    variables: [{ symbol: "a, b", description: "Parallel bases" }, { symbol: "h", description: "Perpendicular altitude" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), h = Number(v.h);
      return done([outN("Trapezoid area", 0.5 * (a + b) * h, 4, "sq units", true), outN("Median (midsegment)", 0.5 * (a + b), 4, "units")]);
    },
  },
  {
    slug: "kite-rhombus-area",
    fields: [posF("d1", "Diagonal p", 12), posF("d2", "Diagonal q", 16)],
    formulaPlain: "A = (p · q) / 2; rhombus perimeter = 2√(p² + q²)",
    variables: [{ symbol: "p, q", description: "Perpendicular diagonals" }],
    compute: (v) => {
      const p = Number(v.d1), q = Number(v.d2);
      return done([outN("Area", (p * q) / 2, 4, "sq units", true), outN("Rhombus perimeter", 2 * Math.hypot(p, q), 4, "units")]);
    },
  },
  {
    slug: "regular-polygon",
    fields: [intF("n", "Number of sides (n ≥ 3)", 6, { min: 3, max: 10000 }), posF("s", "Side length (s)", 5)],
    formulaPlain: "A = (n · s²) / (4 · tan(π / n)); P = n · s",
    variables: [{ symbol: "n", description: "Number of equal sides" }, { symbol: "s", description: "Edge length" }],
    compute: (v) => {
      const n = Number(v.n), s = Number(v.s);
      const apothem = s / (2 * Math.tan(Math.PI / n));
      return done([outN("Area", 0.5 * n * s * apothem, 4, "sq units", true), outN("Perimeter", n * s, 4, "units"), outN("Apothem", apothem, 4, "units")]);
    },
  },
  {
    slug: "sector-arc",
    fields: [posF("r", "Radius (r)", 10), posF("deg", "Central angle", 60, "°", { max: 360 })],
    formulaPlain: "s = r·θ; A_sector = ½·r²·θ (θ in radians)",
    variables: [{ symbol: "r", description: "Circle radius" }, { symbol: "θ", description: "Central angle" }],
    compute: (v) => {
      const r = Number(v.r), rad = (Number(v.deg) * Math.PI) / 180;
      return done([outN("Sector area", 0.5 * r * r * rad, 4, "sq units", true), outN("Arc length", r * rad, 4, "units")]);
    },
  },
  {
    slug: "ellipse",
    fields: [posF("a", "Semi-major axis (a)", 8), posF("b", "Semi-minor axis (b)", 5)],
    formulaPlain: "A = πab; P ≈ π(a + b)(1 + 3h / (10 + √(4 − 3h))), h = (a−b)²/(a+b)² (Ramanujan II)",
    variables: [{ symbol: "a, b", description: "Semi-axes of ellipse" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b);
      const h = ((a - b) * (a - b)) / ((a + b) * (a + b));
      const perim = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
      const hi = Math.max(a, b), lo = Math.min(a, b);
      return done([outN("Exact area", Math.PI * a * b, 4, "sq units", true), outN("Perimeter (Ramanujan II)", perim, 4, "units"), outN("Eccentricity", Math.sqrt(1 - (lo * lo) / (hi * hi)), 6)]);
    },
  },
  {
    slug: "sphere",
    fields: [posF("r", "Radius (r)", 6)],
    formulaPlain: "V = (4/3)πr³; S = 4πr²",
    variables: [{ symbol: "r", description: "Sphere radius" }],
    compute: (v) => {
      const r = Number(v.r);
      return done([outN("Volume (V)", (4 / 3) * Math.PI * r * r * r, 4, "cu units", true), outN("Surface area (S)", 4 * Math.PI * r * r, 4, "sq units")]);
    },
  },
  {
    slug: "cylinder",
    fields: [posF("r", "Radius (r)", 4), posF("h", "Height (h)", 10)],
    formulaPlain: "V = πr²h; S_lateral = 2πrh; S_total = 2πr(r + h)",
    variables: [{ symbol: "r, h", description: "Base radius and height" }],
    compute: (v) => {
      const r = Number(v.r), h = Number(v.h);
      return done([outN("Volume", Math.PI * r * r * h, 4, "cu units", true), outN("Lateral area", 2 * Math.PI * r * h, 4, "sq units"), outN("Total surface area", 2 * Math.PI * r * (r + h), 4, "sq units")]);
    },
  },
  {
    slug: "cone",
    fields: [posF("r", "Base radius (r)", 3), posF("h", "Height (h)", 4)],
    formulaPlain: "V = ⅓πr²h; s = √(r² + h²); S = πr(r + s)",
    variables: [{ symbol: "r, h", description: "Right circular cone base radius and height" }],
    compute: (v) => {
      const r = Number(v.r), h = Number(v.h), s = Math.hypot(r, h);
      return done([outN("Volume", (Math.PI * r * r * h) / 3, 4, "cu units", true), outN("Slant height", s, 4, "units"), outN("Total surface area", Math.PI * r * (r + s), 4, "sq units")]);
    },
  },
  {
    slug: "frustum-cone",
    fields: [posF("R", "Bottom radius (R)", 6), posF("r", "Top radius (r)", 3), posF("h", "Height (h)", 8)],
    formulaPlain: "V = (πh/3)(R² + Rr + r²); s = √((R − r)² + h²)",
    variables: [{ symbol: "R, r, h", description: "Radii and perpendicular height" }],
    compute: (v) => {
      const R = Number(v.R), r = Number(v.r), h = Number(v.h);
      const s = Math.hypot(R - r, h);
      return done([
        outN("Volume", (Math.PI * h * (R * R + R * r + r * r)) / 3, 4, "cu units", true),
        outN("Lateral surface area", Math.PI * (R + r) * s, 4, "sq units"),
        outN("Total surface area", Math.PI * ((R + r) * s + R * R + r * r), 4, "sq units"),
      ]);
    },
  },
  {
    slug: "pyramid",
    fields: [posF("baseArea", "Base area (A_b)", 36), posF("h", "Apex height (h)", 8)],
    formulaPlain: "V = (A_b · h) / 3",
    variables: [{ symbol: "A_b", description: "Polygon base area" }, { symbol: "h", description: "Perpendicular height" }],
    compute: (v) => {
      const ab = Number(v.baseArea), h = Number(v.h);
      const side = Math.sqrt(ab);
      const surfSquare = ab + 2 * side * Math.hypot(side / 2, h);
      return done([outN("Pyramid volume", (ab * h) / 3, 4, "cu units", true), outN("Surface area (if square base)", surfSquare, 4, "sq units")]);
    },
  },
  {
    slug: "cuboid-prism",
    fields: [posF("l", "Length (L)", 10), posF("w", "Width (W)", 6), posF("h", "Height (H)", 4)],
    formulaPlain: "V = L·W·H; S = 2(LW + LH + WH)",
    variables: [{ symbol: "L, W, H", description: "Orthogonal box dimensions" }],
    compute: (v) => {
      const l = Number(v.l), w = Number(v.w), h = Number(v.h);
      return done([outN("Volume", l * w * h, 4, "cu units", true), outN("Surface area", 2 * (l * w + l * h + w * h), 4, "sq units")]);
    },
  },
  {
    slug: "torus",
    fields: [posF("R", "Major radius (R)", 10), posF("r", "Minor tube radius (r)", 3)],
    formulaPlain: "V = 2π²Rr²; S = 4π²Rr (requires R > r)",
    variables: [{ symbol: "R, r", description: "Major ring radius and minor tube radius" }],
    compute: (v) => {
      const R = Number(v.R), r = Number(v.r);
      if (R <= r) return err("Major radius R must exceed tube radius r for a standard non-self-intersecting ring torus.");
      return done([outN("Volume", 2 * Math.PI * Math.PI * R * r * r, 4, "cu units", true), outN("Surface area", 4 * Math.PI * Math.PI * R * r, 4, "sq units")]);
    },
  },
  {
    slug: "polygon-shoelace",
    fields: [txtF("coords", "Vertices x,y pairs separated by semicolons", "0,0; 6,0; 6,4; 0,4")],
    formulaPlain: "A = ½ |∑ (xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)| (Shoelace formula for simple non-self-intersecting polygon)",
    variables: [{ symbol: "(xᵢ, yᵢ)", description: "Ordered 2D vertices" }],
    compute: (v) => {
      const pairs = String(v.coords).split(";").map((s) => s.trim()).filter(Boolean);
      if (pairs.length < 3) return err("Enter at least 3 vertices separated by semicolons (e.g. 0,0; 4,0; 0,3).");
      const pts: Array<[number, number]> = [];
      for (const p of pairs) {
        const parts = p.split(",").map((t) => Number(t.trim()));
        if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
          return err(`Invalid coordinate pair "${p}". Use x,y format.`);
        }
        pts.push([parts[0], parts[1]]);
      }
      let shoelace = 0, perim = 0;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        shoelace += x1 * y2 - x2 * y1;
        perim += Math.hypot(x2 - x1, y2 - y1);
      }
      return done([outN("Polygon area", 0.5 * Math.abs(shoelace), 4, "sq units", true), outN("Perimeter", perim, 4, "units")]);
    },
  },
  {
    slug: "distance-midpoint",
    fields: [numF("x1", "x₁", 1), numF("y1", "y₁", 2), numF("x2", "x₂", 7), numF("y2", "y₂", 10)],
    formulaPlain: "d = √((x₂ − x₁)² + (y₂ − y₁)²); M = ((x₁ + x₂)/2, (y₁ + y₂)/2)",
    variables: [{ symbol: "(x₁,y₁), (x₂,y₂)", description: "Cartesian coordinates" }],
    compute: (v) => {
      const x1 = Number(v.x1), y1 = Number(v.y1), x2 = Number(v.x2), y2 = Number(v.y2);
      return done([
        outN("Euclidean distance", Math.hypot(x2 - x1, y2 - y1), 6, undefined, true),
        outS("Midpoint", `(${((x1 + x2) / 2).toFixed(4)}, ${((y1 + y2) / 2).toFixed(4)})`),
      ]);
    },
  },
  {
    slug: "box-diagonal",
    fields: [posF("l", "Length (L)", 12), posF("w", "Width (W)", 4), posF("h", "Height (H)", 3)],
    formulaPlain: "d = √(L² + W² + H²)",
    variables: [{ symbol: "L, W, H", description: "Orthogonal box edges" }],
    compute: (v) => done([outN("Space diagonal", Math.hypot(Number(v.l), Number(v.w), Number(v.h)), 6, "units", true)]),
  },
  {
    slug: "triangle-inradius",
    fields: [posF("a", "Side a", 5), posF("b", "Side b", 12), posF("c", "Side c", 13)],
    formulaPlain: "r = A / s; R = (a·b·c) / (4·A)",
    variables: [{ symbol: "r, R", description: "Inscribed and circumscribed radii" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Number(v.c);
      if (a + b <= c || a + c <= b || b + c <= a) return err("Sides must form a non-degenerate triangle.");
      const s = (a + b + c) / 2;
      const A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      return done([outN("Inradius (r)", A / s, 6, "units", true), outN("Circumradius (R)", (a * b * c) / (4 * A), 6, "units"), outN("Triangle area", A, 4)]);
    },
  },
  {
    slug: "circle-segment",
    fields: [posF("r", "Radius (r)", 10), posF("deg", "Central angle", 90, "°", { max: 360 })],
    formulaPlain: "A_segment = ½ r² (θ − sin θ), θ in radians",
    variables: [{ symbol: "r, θ", description: "Radius and central angle" }],
    compute: (v) => {
      const r = Number(v.r), th = (Number(v.deg) * Math.PI) / 180;
      return done([
        outN("Circular segment area", 0.5 * r * r * (th - Math.sin(th)), 4, "sq units", true),
        outN("Chord length", 2 * r * Math.sin(th / 2), 4, "units"),
      ]);
    },
  },
  {
    slug: "annulus",
    fields: [posF("R", "Outer radius (R)", 10), posF("r", "Inner radius (r)", 6)],
    formulaPlain: "A = π (R² − r²), R > r",
    variables: [{ symbol: "R, r", description: "Concentric outer and inner radii" }],
    compute: (v) => {
      const R = Number(v.R), r = Number(v.r);
      if (R <= r) return err("Outer radius R must be strictly larger than inner radius r.");
      return done([outN("Annulus area", Math.PI * (R * R - r * r), 4, "sq units", true), outN("Ring width", R - r, 4, "units")]);
    },
  },

  // ── C05 Trigonometry (12) ──────────────────────────────────────────────────
  {
    slug: "right-triangle-solver",
    fields: [posF("a", "Leg a (opposite A)", 6), posF("b", "Leg b (adjacent A)", 8)],
    formulaPlain: "c = √(a² + b²); A = atan2(a, b); B = 90° − A",
    variables: [{ symbol: "a, b, c", description: "Legs and hypotenuse of right triangle" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), c = Math.hypot(a, b);
      const A = (Math.atan2(a, b) * 180) / Math.PI;
      return done([outN("Hypotenuse c", c, 6, undefined, true), outN("Angle A", A, 4, "°"), outN("Angle B", 90 - A, 4, "°"), outN("Area", 0.5 * a * b, 4)]);
    },
  },
  {
    slug: "law-of-sines",
    fields: [posF("A", "Known angle A", 42, "°", { max: 179.99 }), posF("a", "Opposite side a", 10), posF("B", "Target angle B", 68, "°", { max: 179.99 })],
    formulaPlain: "a / sin A = b / sin B = c / sin C = 2R",
    variables: [{ symbol: "A, B, C", description: "Interior angles (A + B < 180°)" }],
    compute: (v) => {
      const A = Number(v.A), a = Number(v.a), B = Number(v.B);
      if (A + B >= 180) return err("Sum of angles A + B must be strictly less than 180°.");
      const C = 180 - A - B;
      const ratio = a / Math.sin((A * Math.PI) / 180);
      return done([
        outN("Side b", ratio * Math.sin((B * Math.PI) / 180), 6, undefined, true),
        outN("Side c", ratio * Math.sin((C * Math.PI) / 180), 6),
        outN("Angle C", C, 4, "°"),
      ]);
    },
  },
  {
    slug: "law-of-cosines",
    fields: [posF("a", "Side a", 8), posF("b", "Side b", 11), posF("C", "Included angle C", 37, "°", { max: 179.999 })],
    formulaPlain: "c = √(a² + b² − 2ab cos C)",
    variables: [{ symbol: "a, b, C", description: "Two sides and included angle C" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b), rad = (Number(v.C) * Math.PI) / 180;
      const c = Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * Math.cos(rad)));
      const cosA = Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)));
      return done([outN("Opposite side c", c, 6, undefined, true), outN("Angle A", (Math.acos(cosA) * 180) / Math.PI, 4, "°")]);
    },
  },
  {
    slug: "triangle-area-sas",
    fields: [posF("a", "Side a", 9), posF("b", "Side b", 12), posF("C", "Included angle C", 45, "°", { max: 179.999 })],
    formulaPlain: "A = ½ · a · b · sin(C)",
    variables: [{ symbol: "a, b, C", description: "Adjacent sides and included angle" }],
    compute: (v) => done([outN("Triangle area", 0.5 * Number(v.a) * Number(v.b) * Math.sin((Number(v.C) * Math.PI) / 180), 6, "sq units", true)]),
  },
  {
    slug: "angle-unit-converter",
    fields: [
      numF("val", "Angle value", 180),
      selF("unit", "Input unit", [
        { value: "deg", label: "Degrees (°)" }, { value: "rad", label: "Radians (rad)" },
        { value: "grad", label: "Gradians / gon" }, { value: "turn", label: "Turns (revolutions)" },
      ]),
    ],
    formulaPlain: "rad = deg·π/180; grad = deg·10/9; turn = deg/360",
    variables: [{ symbol: "deg, rad, grad, turn", description: "Exact angular units (gon = 0.9° exact, NIST SP 811)" }],
    compute: (v) => {
      const x = Number(v.val), u = String(v.unit);
      const deg = u === "deg" ? x : u === "rad" ? (x * 180) / Math.PI : u === "grad" ? x * 0.9 : x * 360;
      return done([
        outN("Degrees", deg, 6, "°", true),
        outN("Radians", (deg * Math.PI) / 180, 8, "rad"),
        outN("Gradians (gon)", deg / 0.9, 6, "gon"),
        outN("Turns", deg / 360, 8, "rev"),
      ]);
    },
  },
  {
    slug: "trig-function-values",
    fields: [numF("angle", "Angle", 30), selF("unit", "Angle unit", [{ value: "deg", label: "Degrees (°)" }, { value: "rad", label: "Radians" }])],
    formulaPlain: "sin θ, cos θ, tan θ = sin θ / cos θ",
    variables: [{ symbol: "θ", description: "Input angle" }],
    compute: (v) => {
      const th = v.unit === "deg" ? (Number(v.angle) * Math.PI) / 180 : Number(v.angle);
      const s = Math.sin(th), c = Math.cos(th);
      return done([
        outN("sin(θ)", s, 8, undefined, true),
        outN("cos(θ)", c, 8),
        outS("tan(θ)", Math.abs(c) < 1e-12 ? "Undefined (asymptote)" : (s / c).toFixed(8)),
      ]);
    },
  },
  {
    slug: "inverse-trig",
    fields: [
      selF("fn", "Function", [{ value: "asin", label: "arcsin(x)" }, { value: "acos", label: "arccos(x)" }, { value: "atan", label: "arctan(x)" }]),
      numF("x", "Ratio x", 0.5),
    ],
    formulaPlain: "Principal inverse value in radians and degrees",
    variables: [{ symbol: "x", description: "Ratio (−1 ≤ x ≤ 1 for arcsin/arccos)" }],
    compute: (v) => {
      const x = Number(v.x), fn = String(v.fn);
      if ((fn === "asin" || fn === "acos") && Math.abs(x) > 1) return err(`${fn}(x) requires −1 ≤ x ≤ 1.`);
      const rad = fn === "asin" ? Math.asin(x) : fn === "acos" ? Math.acos(x) : Math.atan(x);
      return done([outN("Principal angle (degrees)", (rad * 180) / Math.PI, 6, "°", true), outN("Principal angle (radians)", rad, 8, "rad")]);
    },
  },
  {
    slug: "hyperbolic-functions",
    fields: [numF("x", "Real argument x", 1.0, undefined, { min: -700, max: 700 })],
    formulaPlain: "sinh x = ½(e^x − e^−x), cosh x = ½(e^x + e^−x), tanh x = sinh x / cosh x",
    variables: [{ symbol: "x", description: "Real number" }],
    compute: (v) => {
      const x = Number(v.x);
      return done([outN("sinh(x)", Math.sinh(x), 8, undefined, true), outN("cosh(x)", Math.cosh(x), 8), outN("tanh(x)", Math.tanh(x), 8)]);
    },
  },
  {
    slug: "oblique-triangle-solver",
    fields: [posF("A", "Angle A (SSA)", 30, "°", { max: 179.9 }), posF("a", "Side a (opposite A)", 7), posF("b", "Side b (adjacent)", 10)],
    formulaPlain: "sin B = b·sin(A)/a — surfaces 0, 1, or 2 valid SSA solutions explicitly",
    variables: [{ symbol: "A, a, b", description: "Ambiguous SSA oblique triangle parameters" }],
    compute: (v) => {
      const A = Number(v.A), a = Number(v.a), b = Number(v.b);
      const sinB = (b * Math.sin((A * Math.PI) / 180)) / a;
      if (sinB > 1 + 1e-12) return err("No valid triangle exists (side a is shorter than altitude b·sin A).");
      const B1 = (Math.asin(Math.min(1, sinB)) * 180) / Math.PI;
      const B2 = 180 - B1;
      const sols: string[] = [];
      if (A + B1 < 180) sols.push(`B₁=${B1.toFixed(2)}°, C₁=${(180 - A - B1).toFixed(2)}°`);
      if (Math.abs(B2 - B1) > 1e-6 && A + B2 < 180) sols.push(`B₂=${B2.toFixed(2)}°, C₂=${(180 - A - B2).toFixed(2)}°`);
      if (sols.length === 0) return err("No valid triangle satisfies A + B < 180°.");
      return done([outN("Number of valid triangles", sols.length, 0, undefined, true), outS("Solutions", sols.join("  |  "))]);
    },
  },
  {
    slug: "chord-sagitta",
    fields: [posF("r", "Circle radius (r)", 15), posF("deg", "Central angle", 60, "°", { max: 359.999 })],
    formulaPlain: "chord c = 2r sin(θ/2); sagitta h = r(1 − cos(θ/2)); arc = rθ",
    variables: [{ symbol: "r, θ", description: "Radius and subtended angle" }],
    compute: (v) => {
      const r = Number(v.r), th = (Number(v.deg) * Math.PI) / 180;
      return done([outN("Chord length (c)", 2 * r * Math.sin(th / 2), 6, "units", true), outN("Sagitta height (h)", r * (1 - Math.cos(th / 2)), 6, "units"), outN("Arc length", r * th, 6, "units")]);
    },
  },
  {
    slug: "sine-wave-params",
    fields: [posF("amp", "Amplitude (A)", 5), posF("period", "Period (T)", 0.02, "s"), numF("phase", "Phase shift (φ)", 30, "°")],
    formulaPlain: "y(t) = A · sin(2πf·t + φ); f = 1/T; ω = 2πf; RMS = A/√2",
    variables: [{ symbol: "A, T, φ", description: "Peak amplitude, period, phase angle" }],
    compute: (v) => {
      const A = Number(v.amp), T = Number(v.period), f = 1 / T;
      return done([outN("Frequency (f)", f, 4, "Hz", true), outN("Angular frequency (ω)", 2 * Math.PI * f, 4, "rad/s"), outN("RMS amplitude", A / Math.SQRT2, 4), outN("Peak-to-peak", 2 * A, 4)]);
    },
  },
  {
    slug: "trig-identity-check",
    fields: [numF("deg", "Test angle θ", 37, "°")],
    formulaPlain: "Verifies sin²θ + cos²θ = 1, sin(2θ) = 2 sin θ cos θ, cos(2θ) = cos²θ − sin²θ",
    variables: [{ symbol: "θ", description: "Angle evaluated to IEEE-754 precision" }],
    compute: (v) => {
      const th = (Number(v.deg) * Math.PI) / 180;
      const pyth = Math.sin(th) ** 2 + Math.cos(th) ** 2;
      const dbl = Math.sin(2 * th) - 2 * Math.sin(th) * Math.cos(th);
      return done([outN("sin²θ + cos²θ", pyth, 12, undefined, true), outN("Double-angle residual", dbl, 15), outN("sin(2θ)", Math.sin(2 * th), 8)]);
    },
  },
];
