import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import {
  combNum,
  done,
  gcdBig,
  gcdInt,
  intF,
  MATH_FN_OPTIONS,
  MATH_FUNCTIONS,
  nnF,
  normalCdf,
  normalInv,
  numF,
  outN,
  outS,
  parseNumList,
  permNum,
  posF,
  selF,
  txtF,
} from "@/lib/engine/helpers";

export const M02_SPECS: CalculatorSpec[] = [
  // ── C06 Calculus and Numerical Methods (16) ───────────────────────────────
  {
    slug: "numerical-derivative",
    fields: [selF("fn", "Function f(x)", MATH_FN_OPTIONS), numF("x", "Point x", 2)],
    formulaPlain: "f'(x) ≈ (f(x + h) − f(x − h)) / (2h), h = √ε · max(1, |x|)",
    variables: [{ symbol: "h", description: "Scaled step size balancing truncation and round-off error" }],
    compute: (v) => {
      const m = MATH_FUNCTIONS[String(v.fn)];
      const x = Number(v.x);
      const h = 1e-6 * Math.max(1, Math.abs(x));
      const approx = (m.fn(x + h) - m.fn(x - h)) / (2 * h);
      const exact = m.dfn(x);
      return done([outN("Central difference f'(x)", approx, 8, undefined, true), outN("Exact analytic derivative", exact, 8), outN("Truncation error", Math.abs(approx - exact), 12)]);
    },
  },
  {
    slug: "symbolic-derivative",
    fields: [txtF("coeffs", "Polynomial coefficients descending (aₙ ... a₀)", "3, -4, 7, -2"), numF("x", "Evaluate at x", 2)],
    formulaPlain: "d/dx (∑ cₖ xᵏ) = ∑ k · cₖ x^(k−1)",
    variables: [{ symbol: "cₖ", description: "Polynomial coefficients" }],
    compute: (v) => {
      const cs = parseNumList(String(v.coeffs), 1);
      if (!cs.ok) return cs;
      const deg = cs.value.length - 1;
      if (deg === 0) return done([outS("Symbolic derivative", "0", undefined, true), outN("Value at x", 0, 6)]);
      const terms: string[] = [];
      let val = 0;
      cs.value.slice(0, -1).forEach((c, i) => {
        const power = deg - i;
        const dc = c * power;
        val += dc * Math.pow(Number(v.x), power - 1);
        if (dc !== 0) terms.push(`${dc}x^${power - 1}`);
      });
      return done([outS("f'(x)", terms.join(" + ") || "0", undefined, true), outN("f'(x) at x", val, 6)]);
    },
  },
  {
    slug: "integral-simpson",
    fields: [selF("fn", "Integrand f(x)", MATH_FN_OPTIONS), numF("a", "Lower limit a", 0), numF("b", "Upper limit b", 3), intF("n", "Even subintervals n", 100, { min: 2, max: 10000 })],
    formulaPlain: "∫ f(x) dx ≈ (h/3)[f(x₀) + 4∑f(x_odd) + 2∑f(x_even) + f(xₙ)], n even",
    variables: [{ symbol: "a, b, n", description: "Bounds and even partition count" }],
    compute: (v) => {
      const n = Number(v.n);
      if (n % 2 !== 0) return err("Composite Simpson's 1/3 rule requires an even number of subintervals n.");
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const a = Number(v.a), b = Number(v.b), h = (b - a) / n;
      let sum = f(a) + f(b);
      for (let i = 1; i < n; i++) sum += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
      return done([outN("Simpson integral estimate", (h / 3) * sum, 8, undefined, true), outN("Step size h", h, 6)]);
    },
  },
  {
    slug: "integral-trapezoid",
    fields: [selF("fn", "Integrand f(x)", MATH_FN_OPTIONS), numF("a", "Lower limit a", 0), numF("b", "Upper limit b", 3), intF("n", "Subintervals n", 100, { min: 1, max: 10000 })],
    formulaPlain: "∫ f(x) dx ≈ (h/2)[f(a) + 2∑f(xᵢ) + f(b)]",
    variables: [{ symbol: "a, b, n", description: "Integration bounds and subintervals" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const a = Number(v.a), b = Number(v.b), n = Number(v.n), h = (b - a) / n;
      let sum = 0.5 * (f(a) + f(b));
      for (let i = 1; i < n; i++) sum += f(a + i * h);
      return done([outN("Trapezoidal integral", sum * h, 8, undefined, true), outN("Step size h", h, 6)]);
    },
  },
  {
    slug: "riemann-sum",
    fields: [
      selF("fn", "Function f(x)", MATH_FN_OPTIONS),
      numF("a", "Start a", 0), numF("b", "End b", 2), intF("n", "Rectangles n", 50, { min: 1, max: 10000 }),
      selF("rule", "Sampling point", [{ value: "mid", label: "Midpoint rule" }, { value: "left", label: "Left Riemann" }, { value: "right", label: "Right Riemann" }]),
    ],
    formulaPlain: "∑ f(xᵢ*) · Δx",
    variables: [{ symbol: "xᵢ*", description: "Left, midpoint, or right sample point in subinterval i" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const a = Number(v.a), b = Number(v.b), n = Number(v.n), dx = (b - a) / n;
      const off = v.rule === "left" ? 0 : v.rule === "right" ? 1 : 0.5;
      let sum = 0;
      for (let i = 0; i < n; i++) sum += f(a + (i + off) * dx);
      return done([outN("Riemann sum", sum * dx, 8, undefined, true), outN("Δx", dx, 6)]);
    },
  },
  {
    slug: "limit-numeric",
    fields: [selF("fn", "Function f(x)", MATH_FN_OPTIONS), numF("x0", "Approach point x₀", 1)],
    formulaPlain: "Compares f(x₀ − δ) and f(x₀ + δ) for δ = 10⁻⁶",
    variables: [{ symbol: "x₀", description: "Target point" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const x0 = Number(v.x0), d = 1e-6;
      const left = f(x0 - d), right = f(x0 + d);
      if (Math.abs(left - right) > 1e-3) return err(`Two-sided limit mismatch: left ≈ ${left.toFixed(4)}, right ≈ ${right.toFixed(4)}.`);
      return done([outN("Estimated two-sided limit", 0.5 * (left + right), 8, undefined, true), outN("|Left − Right|", Math.abs(left - right), 10)]);
    },
  },
  {
    slug: "taylor-series",
    fields: [
      selF("fn", "Analytic function", [{ value: "exp", label: "e^x about 0" }, { value: "sin", label: "sin(x) about 0" }, { value: "cos", label: "cos(x) about 0" }]),
      numF("x", "Point x", 0.5),
      intF("order", "Degree N", 6, { min: 0, max: 30 }),
    ],
    formulaPlain: "T_N(x) = ∑_{k=0}^N f^(k)(0) · x^k / k!",
    variables: [{ symbol: "N", description: "Truncation degree" }],
    compute: (v) => {
      const x = Number(v.x), N = Number(v.order), fn = String(v.fn);
      let sum = 0, fact = 1;
      for (let k = 0; k <= N; k++) {
        if (k > 0) fact *= k;
        let deriv0 = 1;
        if (fn === "sin") deriv0 = k % 2 === 0 ? 0 : (k % 4 === 1 ? 1 : -1);
        else if (fn === "cos") deriv0 = k % 2 === 1 ? 0 : (k % 4 === 0 ? 1 : -1);
        sum += (deriv0 * Math.pow(x, k)) / fact;
      }
      const exact = fn === "exp" ? Math.exp(x) : fn === "sin" ? Math.sin(x) : Math.cos(x);
      return done([outN(`Taylor polynomial T_${N}(x)`, sum, 10, undefined, true), outN("Exact function value", exact, 10), outN("Remainder |R_N(x)|", Math.abs(exact - sum), 12)]);
    },
  },
  {
    slug: "newton-raphson",
    fields: [selF("fn", "Equation f(x) = 0", MATH_FN_OPTIONS), numF("x0", "Initial guess x₀", 2)],
    formulaPlain: "x_{k+1} = x_k − f(x_k) / f'(x_k)",
    variables: [{ symbol: "x₀", description: "Starting estimate" }],
    compute: (v) => {
      const m = MATH_FUNCTIONS[String(v.fn)];
      let x = Number(v.x0);
      for (let i = 1; i <= 60; i++) {
        const fx = m.fn(x), dfx = m.dfn(x);
        if (Math.abs(fx) < 1e-12) return done([outN("Root x*", x, 10, undefined, true), outN("Iterations", i, 0), outN("|f(x*)| residual", Math.abs(fx), 14)]);
        if (Math.abs(dfx) < 1e-14) return err("Zero derivative encountered; Newton-Raphson step undefined.");
        x -= fx / dfx;
        if (!Number.isFinite(x)) return err("Iteration diverged from this starting point.");
      }
      return err("Did not converge within 60 iterations.");
    },
  },
  {
    slug: "bisection-root",
    fields: [selF("fn", "Equation f(x) = 0", MATH_FN_OPTIONS), numF("a", "Left bracket a", 1), numF("b", "Right bracket b", 3)],
    formulaPlain: "Halves [a, b] where f(a)·f(b) ≤ 0 until |b − a|/2 < 10⁻¹⁰",
    variables: [{ symbol: "[a, b]", description: "Sign-change bracket" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      let a = Number(v.a), b = Number(v.b);
      if (a >= b) return err("Require a < b.");
      let fa = f(a), fb = f(b);
      if (fa * fb > 0) return err("f(a) and f(b) have the same sign; bisection requires opposite signs on [a, b].");
      let iter = 0;
      while ((b - a) / 2 > 1e-10 && iter < 80) {
        iter++;
        const mid = 0.5 * (a + b), fm = f(mid);
        if (Math.abs(fm) < 1e-13) { a = b = mid; break; }
        if (fa * fm <= 0) { b = mid; fb = fm; } else { a = mid; fa = fm; }
      }
      const root = 0.5 * (a + b);
      return done([outN("Bracketed root", root, 10, undefined, true), outN("Iterations", iter, 0), outN("|f(root)| residual", Math.abs(f(root)), 13)]);
    },
  },
  {
    slug: "secant-root",
    fields: [selF("fn", "Equation f(x) = 0", MATH_FN_OPTIONS), numF("x0", "First point x₀", 1.5), numF("x1", "Second point x₁", 2.5)],
    formulaPlain: "x_{k+1} = x_k − f(x_k)(x_k − x_{k−1}) / (f(x_k) − f(x_{k−1}))",
    variables: [{ symbol: "x₀, x₁", description: "Two distinct starting estimates" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      let x0 = Number(v.x0), x1 = Number(v.x1);
      if (x0 === x1) return err("x₀ and x₁ must be distinct.");
      for (let i = 1; i <= 60; i++) {
        const f0 = f(x0), f1 = f(x1);
        if (Math.abs(f1) < 1e-11) return done([outN("Root", x1, 10, undefined, true), outN("Iterations", i, 0), outN("|f(root)|", Math.abs(f1), 13)]);
        if (Math.abs(f1 - f0) < 1e-15) return err("Secant slope vanished.");
        const next = x1 - (f1 * (x1 - x0)) / (f1 - f0);
        x0 = x1; x1 = next;
      }
      return err("Secant iteration did not converge within 60 steps.");
    },
  },
  {
    slug: "extremum-finder",
    fields: [selF("fn", "Function f(x)", MATH_FN_OPTIONS), numF("a", "Interval start a", -2), numF("b", "Interval end b", 2)],
    formulaPlain: "Golden-section + dense grid search for min/max on [a, b]",
    variables: [{ symbol: "[a, b]", description: "Closed bounded search interval" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const a = Number(v.a), b = Number(v.b);
      if (a >= b) return err("Require a < b.");
      let minX = a, maxX = a, minY = f(a), maxY = f(a);
      const N = 2000;
      for (let i = 1; i <= N; i++) {
        const x = a + ((b - a) * i) / N, y = f(x);
        if (y < minY) { minY = y; minX = x; }
        if (y > maxY) { maxY = y; maxX = x; }
      }
      return done([outS("Minimum on [a, b]", `f(${minX.toFixed(4)}) = ${minY.toFixed(6)}`, undefined, true), outS("Maximum on [a, b]", `f(${maxX.toFixed(4)}) = ${maxY.toFixed(6)}`)]);
    },
  },
  {
    slug: "arc-length-curve",
    fields: [selF("fn", "Curve y = f(x)", MATH_FN_OPTIONS), numF("a", "Start x = a", 0), numF("b", "End x = b", 2)],
    formulaPlain: "L = ∫ₐᵇ √(1 + [f'(x)]²) dx (200-panel composite Simpson)",
    variables: [{ symbol: "a, b", description: "Curve interval endpoints" }],
    compute: (v) => {
      const df = MATH_FUNCTIONS[String(v.fn)].dfn;
      const a = Number(v.a), b = Number(v.b);
      if (b <= a) return err("Require b > a.");
      const n = 200, h = (b - a) / n;
      const g = (x: number) => Math.sqrt(1 + df(x) ** 2);
      let s = g(a) + g(b);
      for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * g(a + i * h);
      return done([outN("Arc length L", (h / 3) * s, 8, "units", true)]);
    },
  },
  {
    slug: "volume-revolution",
    fields: [selF("fn", "Profile y = f(x)", MATH_FN_OPTIONS), numF("a", "Start x = a", 0), numF("b", "End x = b", 2)],
    formulaPlain: "V = π ∫ₐᵇ [f(x)]² dx (disk method around x-axis)",
    variables: [{ symbol: "a, b", description: "Bounds along axis of revolution" }],
    compute: (v) => {
      const f = MATH_FUNCTIONS[String(v.fn)].fn;
      const a = Number(v.a), b = Number(v.b);
      if (b <= a) return err("Require b > a.");
      const n = 200, h = (b - a) / n;
      const g = (x: number) => Math.PI * f(x) ** 2;
      let s = g(a) + g(b);
      for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * g(a + i * h);
      return done([outN("Volume of revolution V", (h / 3) * s, 6, "cu units", true)]);
    },
  },
  {
    slug: "euler-ode",
    fields: [numF("k", "Growth/decay rate k (y' = k·y)", -0.5), numF("y0", "Initial y(0)", 100), posF("h", "Step size h", 0.1), intF("steps", "Steps N", 20, { min: 1, max: 5000 })],
    formulaPlain: "y_{n+1} = y_n + h · k · y_n (first-order explicit Euler approximation)",
    variables: [{ symbol: "h, N", description: "Step size and step count" }],
    compute: (v) => {
      const k = Number(v.k), y0 = Number(v.y0), h = Number(v.h), N = Number(v.steps);
      let y = y0;
      for (let i = 0; i < N; i++) y += h * k * y;
      const exact = y0 * Math.exp(k * h * N);
      return done([outN(`Euler y(${(h * N).toFixed(2)})`, y, 6, undefined, true), outN("Exact solution y₀e^(kt)", exact, 6), outN("Global error", Math.abs(y - exact), 8)]);
    },
  },
  {
    slug: "rk4-ode",
    fields: [numF("k", "Rate k (y' = k·y)", -0.5), numF("y0", "Initial y(0)", 100), posF("h", "Step size h", 0.1), intF("steps", "Steps N", 20, { min: 1, max: 5000 })],
    formulaPlain: "y_{n+1} = y_n + (h/6)(k₁ + 2k₂ + 2k₃ + k₄) (classical 4th-order Runge-Kutta)",
    variables: [{ symbol: "h, N", description: "Step size and step count" }],
    compute: (v) => {
      const k = Number(v.k), y0 = Number(v.y0), h = Number(v.h), N = Number(v.steps);
      let y = y0;
      for (let i = 0; i < N; i++) {
        const k1 = k * y;
        const k2 = k * (y + 0.5 * h * k1);
        const k3 = k * (y + 0.5 * h * k2);
        const k4 = k * (y + h * k3);
        y += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      }
      const exact = y0 * Math.exp(k * h * N);
      return done([outN(`RK4 y(${(h * N).toFixed(2)})`, y, 8, undefined, true), outN("Exact solution", exact, 8), outN("Global error", Math.abs(y - exact), 12)]);
    },
  },
  {
    slug: "lagrange-interpolation",
    fields: [txtF("xs", "Known x nodes", "0, 1, 2, 3"), txtF("ys", "Known y values", "1, 2, 5, 10"), numF("xq", "Query point x", 1.5)],
    formulaPlain: "P(x) = ∑ yⱼ · ∏_{m≠j} (x − xₘ)/(xⱼ − xₘ)",
    variables: [{ symbol: "(xⱼ, yⱼ)", description: "Distinct interpolation nodes" }],
    compute: (v) => {
      const xs = parseNumList(String(v.xs), 2), ys = parseNumList(String(v.ys), 2);
      if (!xs.ok) return xs;
      if (!ys.ok) return ys;
      if (xs.value.length !== ys.value.length) return err("x nodes and y values must have equal length.");
      const xq = Number(v.xq);
      let sum = 0;
      for (let j = 0; j < xs.value.length; j++) {
        let basis = 1;
        for (let m = 0; m < xs.value.length; m++) {
          if (m === j) continue;
          const denom = xs.value[j] - xs.value[m];
          if (Math.abs(denom) < 1e-12) return err("Interpolation x nodes must be strictly distinct.");
          basis *= (xq - xs.value[m]) / denom;
        }
        sum += ys.value[j] * basis;
      }
      return done([outN("Interpolated value P(x)", sum, 8, undefined, true), outN("Polynomial degree ≤", xs.value.length - 1, 0)]);
    },
  },

  // ── C07 Matrices, Vectors and Linear Algebra (14) ─────────────────────────
  {
    slug: "matrix-multiply",
    fields: [txtF("A", "2×2 Matrix A [a11, a12, a21, a22]", "1, 2, 3, 4"), txtF("B", "2×2 Matrix B [b11, b12, b21, b22]", "5, 6, 7, 8")],
    formulaPlain: "C_ij = ∑_k A_ik · B_kj",
    variables: [{ symbol: "A, B", description: "Row-major 2×2 matrices" }],
    compute: (v) => {
      const A = parseNumList(String(v.A), 4), B = parseNumList(String(v.B), 4);
      if (!A.ok) return A; if (!B.ok) return B;
      const a = A.value, b = B.value;
      const c = [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
      return done([outS("Product C = A·B", `[[${c[0]}, ${c[1]}], [${c[2]}, ${c[3]}]]`, undefined, true), outN("det(C)", c[0] * c[3] - c[1] * c[2], 6)]);
    },
  },
  {
    slug: "matrix-add-subtract",
    fields: [
      txtF("A", "2×2 Matrix A", "4, -1, 2, 7"), txtF("B", "2×2 Matrix B", "3, 5, -2, 1"),
      selF("op", "Operation", [{ value: "add", label: "A + B" }, { value: "sub", label: "A − B" }]),
    ],
    formulaPlain: "C_ij = A_ij ± B_ij",
    variables: [{ symbol: "A, B", description: "Same-dimension matrices" }],
    compute: (v) => {
      const A = parseNumList(String(v.A), 4), B = parseNumList(String(v.B), 4);
      if (!A.ok) return A; if (!B.ok) return B;
      const sgn = v.op === "add" ? 1 : -1;
      const c = [0, 1, 2, 3].map((i) => A.value[i] + sgn * B.value[i]);
      return done([outS("Result matrix", `[[${c[0]}, ${c[1]}], [${c[2]}, ${c[3]}]]`, undefined, true)]);
    },
  },
  {
    slug: "matrix-determinant",
    fields: [txtF("M", "Square matrix entries row-major (4 for 2×2, 9 for 3×3)", "2, -1, 0, -1, 2, -1, 0, -1, 2")],
    formulaPlain: "det(2×2) = ad − bc; det(3×3) via Sarrus / LU elimination",
    variables: [{ symbol: "M", description: "2×2 (4 values) or 3×3 (9 values) square matrix" }],
    compute: (v) => {
      const m = parseNumList(String(v.M), 4);
      if (!m.ok) return m;
      const x = m.value;
      if (x.length === 4) return done([outN("Determinant", x[0] * x[3] - x[1] * x[2], 6, undefined, true)]);
      if (x.length === 9) {
        const det = x[0] * (x[4] * x[8] - x[5] * x[7]) - x[1] * (x[3] * x[8] - x[5] * x[6]) + x[2] * (x[3] * x[7] - x[4] * x[6]);
        return done([outN("Determinant", det, 6, undefined, true)]);
      }
      return err("Enter exactly 4 numbers (2×2) or 9 numbers (3×3).");
    },
  },
  {
    slug: "matrix-inverse",
    fields: [txtF("A", "2×2 Matrix [a, b, c, d]", "4, 7, 2, 6")],
    formulaPlain: "A⁻¹ = (1 / (ad − bc)) · [[d, −b], [−c, a]]",
    variables: [{ symbol: "A", description: "Invertible 2×2 matrix (det ≠ 0)" }],
    compute: (v) => {
      const m = parseNumList(String(v.A), 4);
      if (!m.ok) return m;
      const [a, b, c, d] = m.value;
      const det = a * d - b * c;
      if (Math.abs(det) < 1e-12) return err("Matrix is singular (determinant = 0) and has no inverse.");
      return done([
        outS("Inverse A⁻¹", `[[${(d / det).toFixed(4)}, ${(-b / det).toFixed(4)}], [${(-c / det).toFixed(4)}, ${(a / det).toFixed(4)}]]`, undefined, true),
        outN("Determinant", det, 6),
      ]);
    },
  },
  {
    slug: "matrix-transpose-trace",
    fields: [txtF("M", "2×2 Matrix [a, b, c, d]", "3, 8, -2, 5")],
    formulaPlain: "(Aᵀ)_ij = A_ji; tr(A) = ∑ A_ii",
    variables: [{ symbol: "A", description: "2×2 square matrix" }],
    compute: (v) => {
      const m = parseNumList(String(v.M), 4);
      if (!m.ok) return m;
      const [a, b, c, d] = m.value;
      return done([outN("Trace tr(A)", a + d, 6, undefined, true), outS("Transpose Aᵀ", `[[${a}, ${c}], [${b}, ${d}]]`)]);
    },
  },
  {
    slug: "matrix-rank",
    fields: [txtF("M", "2×2 Matrix [a, b, c, d]", "2, 4, 1, 2")],
    formulaPlain: "Gaussian elimination pivot count (tolerance 10⁻¹⁰)",
    variables: [{ symbol: "A", description: "2×2 real matrix" }],
    compute: (v) => {
      const m = parseNumList(String(v.M), 4);
      if (!m.ok) return m;
      const [a, b, c, d] = m.value;
      const allZero = [a, b, c, d].every((z) => Math.abs(z) < 1e-10);
      if (allZero) return done([outN("Matrix rank", 0, 0, undefined, true), outN("Nullity", 2, 0)]);
      const rank = Math.abs(a * d - b * c) > 1e-10 ? 2 : 1;
      return done([outN("Matrix rank", rank, 0, undefined, true), outN("Nullity", 2 - rank, 0)]);
    },
  },
  {
    slug: "matrix-solve-system",
    fields: [txtF("A", "2×2 Matrix A [a11, a12, a21, a22]", "3, 2, 1, 4"), txtF("b", "RHS vector b [b1, b2]", "16, 12")],
    formulaPlain: "Ax = b solved by LU / Cramer",
    variables: [{ symbol: "A, b", description: "Coefficient matrix and constant vector" }],
    compute: (v) => {
      const A = parseNumList(String(v.A), 4), b = parseNumList(String(v.b), 2);
      if (!A.ok) return A; if (!b.ok) return b;
      const [a11, a12, a21, a22] = A.value;
      const det = a11 * a22 - a12 * a21;
      if (Math.abs(det) < 1e-12) return err("Singular matrix A (det = 0).");
      return done([
        outN("x₁", (b.value[0] * a22 - b.value[1] * a12) / det, 6, undefined, true),
        outN("x₂", (a11 * b.value[1] - a21 * b.value[0]) / det, 6, undefined, true),
      ]);
    },
  },
  {
    slug: "eigenvalues-2x2",
    fields: [txtF("A", "2×2 Matrix [a, b, c, d]", "5, 2, 2, 2")],
    formulaPlain: "λ² − tr(A)λ + det(A) = 0",
    variables: [{ symbol: "λ₁, λ₂", description: "Characteristic eigenvalues" }],
    compute: (v) => {
      const A = parseNumList(String(v.A), 4);
      if (!A.ok) return A;
      const [a, b, c, d] = A.value;
      const tr = a + d, det = a * d - b * c, disc = tr * tr - 4 * det;
      if (disc >= 0) {
        return done([outS("Eigenvalues", `λ₁ = ${(0.5 * (tr + Math.sqrt(disc))).toFixed(6)}, λ₂ = ${(0.5 * (tr - Math.sqrt(disc))).toFixed(6)}`, undefined, true), outN("Trace", tr, 4), outN("Determinant", det, 4)]);
      }
      return done([outS("Complex eigenvalues", `${(0.5 * tr).toFixed(6)} ± ${(0.5 * Math.sqrt(-disc)).toFixed(6)}i`, undefined, true)]);
    },
  },
  {
    slug: "eigenvalues-3x3",
    fields: [txtF("A", "3×3 Matrix row-major (9 entries)", "4, 1, 0, 1, 4, 1, 0, 1, 4")],
    formulaPlain: "Characteristic cubic λ³ − I₁λ² + I₂λ − I₃ = 0",
    variables: [{ symbol: "I₁, I₂, I₃", description: "Principal matrix invariants (trace, minor sum, determinant)" }],
    compute: (v) => {
      const m = parseNumList(String(v.A), 9);
      if (!m.ok) return m;
      const x = m.value;
      const i1 = x[0] + x[4] + x[8];
      const i2 = (x[0] * x[4] - x[1] * x[3]) + (x[0] * x[8] - x[2] * x[6]) + (x[4] * x[8] - x[5] * x[7]);
      const i3 = x[0] * (x[4] * x[8] - x[5] * x[7]) - x[1] * (x[3] * x[8] - x[5] * x[6]) + x[2] * (x[3] * x[7] - x[4] * x[6]);
      const p = (3 * i2 - i1 * i1) / 3;
      const q = (-2 * i1 ** 3 + 9 * i1 * i2 - 27 * i3) / 27;
      const disc = (q * q) / 4 + (p ** 3) / 27;
      if (disc <= 1e-10) {
        const r = 2 * Math.sqrt(Math.max(0, -p / 3));
        const denom = 2 * p * Math.sqrt(Math.max(1e-30, -p / 3));
        const phi = denom === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, (3 * q) / denom)));
        const lams = [0, 1, 2].map((k) => r * Math.cos((phi - 2 * Math.PI * k) / 3) + i1 / 3);
        return done([outS("Eigenvalues", lams.map((l) => l.toFixed(5)).join(", "), undefined, true), outN("Trace", i1, 4), outN("Determinant", i3, 4)]);
      }
      const sq = Math.sqrt(disc);
      const realLam = Math.cbrt(-q / 2 + sq) + Math.cbrt(-q / 2 - sq) + i1 / 3;
      return done([outN("Real eigenvalue λ₁", realLam, 6, undefined, true), outN("Trace", i1, 4), outN("Determinant", i3, 4)]);
    },
  },
  {
    slug: "vector-dot",
    fields: [txtF("a", "Vector a", "3, 4, 0"), txtF("b", "Vector b", "4, 0, 3")],
    formulaPlain: "a · b = ∑ aᵢbᵢ = |a||b| cos θ",
    variables: [{ symbol: "a, b", description: "Equal-length Euclidean vectors" }],
    compute: (v) => {
      const a = parseNumList(String(v.a), 2), b = parseNumList(String(v.b), 2);
      if (!a.ok) return a; if (!b.ok) return b;
      if (a.value.length !== b.value.length) return err("Vectors must have the same dimension.");
      const dot = a.value.reduce((s, x, i) => s + x * b.value[i], 0);
      const ma = Math.hypot(...a.value), mb = Math.hypot(...b.value);
      const ang = ma > 0 && mb > 0 ? (Math.acos(Math.max(-1, Math.min(1, dot / (ma * mb)))) * 180) / Math.PI : 0;
      return done([outN("Dot product a · b", dot, 6, undefined, true), outN("Angle between vectors", ang, 4, "°")]);
    },
  },
  {
    slug: "vector-cross",
    fields: [txtF("a", "3D Vector a (ax, ay, az)", "1, 0, 0"), txtF("b", "3D Vector b (bx, by, bz)", "0, 1, 0")],
    formulaPlain: "a × b = (ay·bz − az·by, az·bx − ax·bz, ax·by − ay·bx)",
    variables: [{ symbol: "a, b", description: "3-dimensional vectors" }],
    compute: (v) => {
      const a = parseNumList(String(v.a), 3), b = parseNumList(String(v.b), 3);
      if (!a.ok) return a; if (!b.ok) return b;
      if (a.value.length !== 3 || b.value.length !== 3) return err("Cross product is defined for 3D vectors (exact 3 components each).");
      const [ax, ay, az] = a.value, [bx, by, bz] = b.value;
      const c = [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
      return done([outS("a × b", `(${c.map((n) => n.toFixed(4)).join(", ")})`, undefined, true), outN("Parallelogram area |a × b|", Math.hypot(...c), 6)]);
    },
  },
  {
    slug: "vector-magnitude",
    fields: [txtF("a", "Vector components", "3, 4, 12")],
    formulaPlain: "|v| = √(∑ vᵢ²); û = v / |v|",
    variables: [{ symbol: "v", description: "Real vector" }],
    compute: (v) => {
      const a = parseNumList(String(v.a), 1);
      if (!a.ok) return a;
      const mag = Math.hypot(...a.value);
      if (mag === 0) return done([outN("Magnitude |v|", 0, 6, undefined, true), outS("Unit vector", "Undefined for zero vector")]);
      return done([outN("Magnitude |v|", mag, 6, undefined, true), outS("Unit vector û", `(${a.value.map((x) => (x / mag).toFixed(4)).join(", ")})`)]);
    },
  },
  {
    slug: "vector-projection",
    fields: [txtF("a", "Vector a (projected)", "3, 4"), txtF("b", "Non-zero vector b (onto)", "1, 0")],
    formulaPlain: "proj_b(a) = ((a · b) / |b|²) · b",
    variables: [{ symbol: "a, b", description: "Same-dimension vectors (b ≠ 0)" }],
    compute: (v) => {
      const a = parseNumList(String(v.a), 2), b = parseNumList(String(v.b), 2);
      if (!a.ok) return a; if (!b.ok) return b;
      if (a.value.length !== b.value.length) return err("Vectors must share the same dimension.");
      const b2 = b.value.reduce((s, x) => s + x * x, 0);
      if (b2 === 0) return err("Target vector b cannot be the zero vector.");
      const scale = a.value.reduce((s, x, i) => s + x * b.value[i], 0) / b2;
      return done([
        outS("Vector projection proj_b(a)", `(${b.value.map((x) => (scale * x).toFixed(4)).join(", ")})`, undefined, true),
        outN("Scalar component", scale * Math.sqrt(b2), 6),
      ]);
    },
  },
  {
    slug: "matrix-power",
    fields: [txtF("A", "2×2 Matrix [a, b, c, d]", "1, 1, 1, 0"), intF("n", "Non-negative integer exponent n", 6, { min: 0, max: 50 })],
    formulaPlain: "A^n computed by repeated binary squaring",
    variables: [{ symbol: "A, n", description: "2×2 matrix and non-negative integer power" }],
    compute: (v) => {
      const m = parseNumList(String(v.A), 4);
      if (!m.ok) return m;
      const mul = (x: number[], y: number[]) => [x[0] * y[0] + x[1] * y[2], x[0] * y[1] + x[1] * y[3], x[2] * y[0] + x[3] * y[2], x[2] * y[1] + x[3] * y[3]];
      let base = m.value.slice(0, 4), res = [1, 0, 0, 1], k = Number(v.n);
      while (k > 0) { if (k & 1) res = mul(res, base); base = mul(base, base); k >>= 1; }
      return done([outS(`A^${v.n}`, `[[${res[0]}, ${res[1]}], [${res[2]}, ${res[3]}]]`, undefined, true)]);
    },
  },

  // ── C08 Statistics and Probability (25) ────────────────────────────────────
  {
    slug: "mean",
    fields: [txtF("data", "Dataset values", "10, 14, 18, 22, 26")],
    formulaPlain: "x̄ = (∑ xᵢ) / n",
    variables: [{ symbol: "xᵢ, n", description: "Observations and sample size" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 1);
      if (!p.ok) return p;
      const sum = p.value.reduce((a, b) => a + b, 0);
      return done([outN("Mean", sum / p.value.length, 6, undefined, true), outN("Sum", sum, 4), outN("n", p.value.length, 0)]);
    },
  },
  {
    slug: "median-quartiles",
    fields: [txtF("data", "Dataset values", "7, 15, 36, 39, 40, 41")],
    formulaPlain: "Sorted order statistics Q₁ (25th), Q₂ median (50th), Q₃ (75th), IQR = Q₃ − Q₁",
    variables: [{ symbol: "Q₁, Q₂, Q₃", description: "Quartiles" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 2);
      if (!p.ok) return p;
      const s = [...p.value].sort((a, b) => a - b);
      const qAt = (q: number) => {
        const pos = (s.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
        return s[lo] + (s[hi] - s[lo]) * (pos - lo);
      };
      const q1 = qAt(0.25), q2 = qAt(0.5), q3 = qAt(0.75);
      return done([outN("Median (Q₂)", q2, 4, undefined, true), outN("Q₁ (25%)", q1, 4), outN("Q₃ (75%)", q3, 4), outN("IQR (Q₃ − Q₁)", q3 - q1, 4)]);
    },
  },
  {
    slug: "mode-frequency",
    fields: [txtF("data", "Dataset values", "4, 7, 7, 9, 12, 7, 4")],
    formulaPlain: "Most frequent observation(s) in dataset",
    variables: [{ symbol: "xᵢ", description: "Sample elements" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 1);
      if (!p.ok) return p;
      const counts = new Map<number, number>();
      p.value.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
      const maxC = Math.max(...counts.values());
      const modes = [...counts.entries()].filter(([, c]) => c === maxC).map(([k]) => k);
      return done([outS("Mode(s)", modes.join(", "), undefined, true), outN("Peak frequency", maxC, 0)]);
    },
  },
  {
    slug: "variance-stddev",
    fields: [
      txtF("data", "Dataset values", "2, 4, 4, 4, 5, 5, 7, 9"),
      selF("kind", "Population vs Sample", [{ value: "sample", label: "Sample (n − 1 Bessel denominator)" }, { value: "pop", label: "Population (N denominator)" }]),
    ],
    formulaPlain: "Sample s² = ∑(x − x̄)²/(n − 1); Population σ² = ∑(x − μ)²/N",
    variables: [{ symbol: "s², σ²", description: "Dispersion around arithmetic mean" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), v.kind === "sample" ? 2 : 1);
      if (!p.ok) return p;
      const xs = p.value, mean = xs.reduce((a, b) => a + b, 0) / xs.length;
      const ss = xs.reduce((a, x) => a + (x - mean) ** 2, 0);
      const variance = ss / (v.kind === "sample" ? xs.length - 1 : xs.length);
      return done([outN("Standard deviation", Math.sqrt(variance), 6, undefined, true), outN("Variance", variance, 6), outN("Mean", mean, 6)]);
    },
  },
  {
    slug: "coefficient-of-variation",
    fields: [txtF("data", "Ratio-scale dataset (mean ≠ 0)", "48, 50, 52, 55, 45")],
    formulaPlain: "CV% = (s / |x̄|) × 100",
    variables: [{ symbol: "s, x̄", description: "Sample standard deviation and mean" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 2);
      if (!p.ok) return p;
      const xs = p.value, mean = xs.reduce((a, b) => a + b, 0) / xs.length;
      if (Math.abs(mean) < 1e-12) return err("Coefficient of variation is undefined when the sample mean is zero.");
      const s = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / (xs.length - 1));
      return done([outN("Coefficient of variation", (s / Math.abs(mean)) * 100, 4, "%", true), outN("Sample SD (s)", s, 6), outN("Mean (x̄)", mean, 6)]);
    },
  },
  {
    slug: "z-score",
    fields: [numF("x", "Raw score (x)", 130), numF("mean", "Mean (μ)", 100), posF("sd", "Standard deviation (σ)", 15)],
    formulaPlain: "z = (x − μ) / σ; cumulative percentile Φ(z)",
    variables: [{ symbol: "x, μ, σ", description: "Observation, mean, and standard deviation (> 0)" }],
    compute: (v) => {
      const z = (Number(v.x) - Number(v.mean)) / Number(v.sd);
      return done([outN("Z-score", z, 6, undefined, true), outN("Cumulative percentile Φ(z)", normalCdf(z) * 100, 3, "%")]);
    },
  },
  {
    slug: "percentile-rank",
    fields: [txtF("data", "Dataset values", "55, 62, 70, 74, 80, 88, 95"), numF("val", "Target value", 74)],
    formulaPlain: "PR% = ((count below + 0.5 × count equal) / n) × 100",
    variables: [{ symbol: "val", description: "Score evaluated within dataset" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 1);
      if (!p.ok) return p;
      const x = Number(v.val);
      const below = p.value.filter((d) => d < x).length;
      const eq = p.value.filter((d) => d === x).length;
      return done([outN("Percentile rank", ((below + 0.5 * eq) / p.value.length) * 100, 2, "%", true)]);
    },
  },
  {
    slug: "skewness-kurtosis",
    fields: [txtF("data", "Dataset (≥ 3 observations)", "10, 11, 12, 13, 14, 28")],
    formulaPlain: "Moment skewness g₁ = m₃/m₂^(3/2); excess kurtosis g₂ = m₄/m₂² − 3",
    variables: [{ symbol: "mₖ", description: "Central k-th sample moments" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 3);
      if (!p.ok) return p;
      const xs = p.value, n = xs.length, mean = xs.reduce((a, b) => a + b, 0) / n;
      const m2 = xs.reduce((a, x) => a + (x - mean) ** 2, 0) / n;
      if (m2 === 0) return err("All values are identical (zero variance); skewness and kurtosis are undefined.");
      const m3 = xs.reduce((a, x) => a + (x - mean) ** 3, 0) / n;
      const m4 = xs.reduce((a, x) => a + (x - mean) ** 4, 0) / n;
      return done([outN("Skewness (g₁)", m3 / Math.pow(m2, 1.5), 6, undefined, true), outN("Excess kurtosis (g₂)", m4 / (m2 * m2) - 3, 6)]);
    },
  },
  {
    slug: "covariance",
    fields: [txtF("x", "Series X", "2, 4, 6, 8"), txtF("y", "Series Y", "3, 7, 10, 15")],
    formulaPlain: "cov_s(X, Y) = ∑(xᵢ − x̄)(yᵢ − ȳ) / (n − 1)",
    variables: [{ symbol: "X, Y", description: "Paired observations of equal length ≥ 2" }],
    compute: (v) => {
      const x = parseNumList(String(v.x), 2), y = parseNumList(String(v.y), 2);
      if (!x.ok) return x; if (!y.ok) return y;
      if (x.value.length !== y.value.length) return err("Series X and Y must contain the same number of observations.");
      const n = x.value.length;
      const mx = x.value.reduce((a, b) => a + b, 0) / n, my = y.value.reduce((a, b) => a + b, 0) / n;
      const sum = x.value.reduce((s, xi, i) => s + (xi - mx) * (y.value[i] - my), 0);
      return done([outN("Sample covariance", sum / (n - 1), 6, undefined, true), outN("Population covariance", sum / n, 6)]);
    },
  },
  {
    slug: "pearson-correlation",
    fields: [txtF("x", "Series X", "1, 2, 3, 4, 5"), txtF("y", "Series Y", "2, 4, 5, 4, 5")],
    formulaPlain: "r = ∑(xᵢ − x̄)(yᵢ − ȳ) / √(∑(xᵢ − x̄)² · ∑(yᵢ − ȳ)²)",
    variables: [{ symbol: "r, r²", description: "Linear correlation coefficient and explained variance" }],
    compute: (v) => {
      const x = parseNumList(String(v.x), 2), y = parseNumList(String(v.y), 2);
      if (!x.ok) return x; if (!y.ok) return y;
      if (x.value.length !== y.value.length) return err("X and Y must have matching lengths.");
      const n = x.value.length, mx = x.value.reduce((a, b) => a + b, 0) / n, my = y.value.reduce((a, b) => a + b, 0) / n;
      let num = 0, dx2 = 0, dy2 = 0;
      for (let i = 0; i < n; i++) {
        const dx = x.value[i] - mx, dy = y.value[i] - my;
        num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
      }
      if (dx2 === 0 || dy2 === 0) return err("Correlation is undefined when either variable has zero variance.");
      const r = num / Math.sqrt(dx2 * dy2);
      return done([outN("Pearson r", r, 6, undefined, true), outN("Coefficient of determination (r²)", r * r, 6)]);
    },
  },
  {
    slug: "spearman-correlation",
    fields: [txtF("x", "Series X", "10, 20, 30, 50, 80"), txtF("y", "Series Y", "5, 9, 8, 14, 22")],
    formulaPlain: "Pearson correlation computed on average-tie ranks of X and Y",
    variables: [{ symbol: "ρ", description: "Spearman rank correlation (−1 ≤ ρ ≤ 1)" }],
    compute: (v) => {
      const x = parseNumList(String(v.x), 2), y = parseNumList(String(v.y), 2);
      if (!x.ok) return x; if (!y.ok) return y;
      if (x.value.length !== y.value.length) return err("X and Y must have equal length.");
      const rank = (arr: number[]) => {
        const idx = arr.map((val, i) => ({ val, i })).sort((a, b) => a.val - b.val);
        const r = new Array<number>(arr.length);
        for (let i = 0; i < idx.length; ) {
          let j = i;
          while (j < idx.length && idx[j].val === idx[i].val) j++;
          const avg = (i + 1 + j) / 2;
          for (let k = i; k < j; k++) r[idx[k].i] = avg;
          i = j;
        }
        return r;
      };
      const rx = rank(x.value), ry = rank(y.value);
      const n = rx.length, mx = (n + 1) / 2;
      let num = 0, dx2 = 0, dy2 = 0;
      for (let i = 0; i < n; i++) { num += (rx[i] - mx) * (ry[i] - mx); dx2 += (rx[i] - mx) ** 2; dy2 += (ry[i] - mx) ** 2; }
      if (dx2 === 0 || dy2 === 0) return err("Rank variance is zero.");
      return done([outN("Spearman ρ", num / Math.sqrt(dx2 * dy2), 6, undefined, true)]);
    },
  },
  {
    slug: "linear-regression",
    fields: [txtF("x", "Predictor X", "1, 2, 3, 4, 5"), txtF("y", "Response Y", "2.1, 3.9, 6.2, 8.0, 9.9")],
    formulaPlain: "ŷ = b₀ + b₁x; b₁ = S_xy / S_xx; b₀ = ȳ − b₁x̄",
    variables: [{ symbol: "b₁, b₀, r²", description: "OLS slope, intercept, and R²" }],
    compute: (v) => {
      const x = parseNumList(String(v.x), 2), y = parseNumList(String(v.y), 2);
      if (!x.ok) return x; if (!y.ok) return y;
      if (x.value.length !== y.value.length) return err("X and Y must have equal length.");
      const n = x.value.length, mx = x.value.reduce((a, b) => a + b, 0) / n, my = y.value.reduce((a, b) => a + b, 0) / n;
      let sxy = 0, sxx = 0, syy = 0;
      for (let i = 0; i < n; i++) { sxy += (x.value[i] - mx) * (y.value[i] - my); sxx += (x.value[i] - mx) ** 2; syy += (y.value[i] - my) ** 2; }
      if (sxx === 0) return err("All X values are identical; OLS slope is undefined.");
      const b1 = sxy / sxx, b0 = my - b1 * mx, r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
      return done([outN("Slope (b₁)", b1, 6, undefined, true), outN("Intercept (b₀)", b0, 6), outN("R²", r2, 6)]);
    },
  },
  {
    slug: "multiple-regression",
    fields: [txtF("x1", "Predictor X₁", "1, 2, 3, 4, 5"), txtF("x2", "Predictor X₂", "2, 1, 4, 3, 5"), txtF("y", "Response Y", "5, 6, 11, 12, 16")],
    formulaPlain: "Normal equations (XᵀX)β = Xᵀy for ŷ = β₀ + β₁x₁ + β₂x₂",
    variables: [{ symbol: "β₀, β₁, β₂", description: "Intercept and partial slopes" }],
    compute: (v) => {
      const x1 = parseNumList(String(v.x1), 4), x2 = parseNumList(String(v.x2), 4), y = parseNumList(String(v.y), 4);
      if (!x1.ok) return x1; if (!x2.ok) return x2; if (!y.ok) return y;
      const n = y.value.length;
      if (x1.value.length !== n || x2.value.length !== n) return err("X₁, X₂, and Y must have the same length (≥ 4).");
      const X = y.value.map((_, i) => [1, x1.value[i], x2.value[i]]);
      const M: number[][] = [0, 1, 2].map((r) => [
        ...[0, 1, 2].map((c) => X.reduce((s, row) => s + row[r] * row[c], 0)),
        X.reduce((s, row, i) => s + row[r] * y.value[i], 0),
      ]);
      for (let col = 0; col < 3; col++) {
        let piv = col;
        for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
        if (Math.abs(M[piv][col]) < 1e-10) return err("Collinear predictors: XᵀX is singular.");
        [M[col], M[piv]] = [M[piv], M[col]];
        for (let r = col + 1; r < 3; r++) {
          const f = M[r][col] / M[col][col];
          for (let j = col; j < 4; j++) M[r][j] -= f * M[col][j];
        }
      }
      const b = [0, 0, 0];
      for (let i = 2; i >= 0; i--) { let s = M[i][3]; for (let j = i + 1; j < 3; j++) s -= M[i][j] * b[j]; b[i] = s / M[i][i]; }
      return done([outN("β₀ (Intercept)", b[0], 5, undefined, true), outN("β₁ (X₁ slope)", b[1], 5), outN("β₂ (X₂ slope)", b[2], 5)]);
    },
  },
  {
    slug: "outlier-iqr",
    fields: [txtF("data", "Dataset values", "10, 12, 13, 14, 15, 16, 42")],
    formulaPlain: "Tukey fences: [Q₁ − 1.5·IQR, Q₃ + 1.5·IQR]",
    variables: [{ symbol: "IQR", description: "Interquartile range Q₃ − Q₁" }],
    compute: (v) => {
      const p = parseNumList(String(v.data), 4);
      if (!p.ok) return p;
      const s = [...p.value].sort((a, b) => a - b);
      const qAt = (q: number) => { const pos = (s.length - 1) * q, l = Math.floor(pos), h = Math.ceil(pos); return s[l] + (s[h] - s[l]) * (pos - l); };
      const q1 = qAt(0.25), q3 = qAt(0.75), iqr = q3 - q1;
      const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
      const outs = s.filter((x) => x < lo || x > hi);
      return done([outS("Detected outliers", outs.length ? outs.join(", ") : "None", undefined, true), outS("Tukey fences", `[${lo.toFixed(2)}, ${hi.toFixed(2)}]`)]);
    },
  },
  {
    slug: "normal-cdf",
    fields: [numF("x", "Value x", 1.96), numF("mu", "Mean μ", 0), posF("sd", "Standard deviation σ", 1)],
    formulaPlain: "P(X ≤ x) = ½ [1 + erf((x − μ) / (σ√2))]",
    variables: [{ symbol: "x, μ, σ", description: "Normal random variable parameters" }],
    compute: (v) => {
      const z = (Number(v.x) - Number(v.mu)) / Number(v.sd);
      const p = normalCdf(z);
      return done([outN("Lower tail P(X ≤ x)", p, 6, undefined, true), outN("Upper tail P(X > x)", 1 - p, 6), outN("Z-score", z, 4)]);
    },
  },
  {
    slug: "inverse-normal",
    fields: [posF("p", "Cumulative probability p", 0.975, undefined, { max: 0.9999999 }), numF("mu", "Mean μ", 0), posF("sd", "Standard deviation σ", 1)],
    formulaPlain: "x = μ + σ · Φ⁻¹(p) (Acklam rational approximation)",
    variables: [{ symbol: "p", description: "Probability strictly inside (0, 1)" }],
    compute: (v) => {
      const z = normalInv(Number(v.p));
      return done([outN("Quantile x", Number(v.mu) + Number(v.sd) * z, 6, undefined, true), outN("Standard normal z", z, 6)]);
    },
  },
  {
    slug: "t-distribution",
    fields: [numF("t", "t-statistic", 2.228), intF("df", "Degrees of freedom ν", 10, { min: 1, max: 5000 })],
    formulaPlain: "Numerical Simpson integration of Student-t density for two-tailed p-value",
    variables: [{ symbol: "t, ν", description: "Student t value and degrees of freedom" }],
    compute: (v) => {
      const t = Math.abs(Number(v.t)), df = Number(v.df);
      const logGammaHalf = (k: number) => {
        // exact recurrence from Γ(1)=1 or Γ(1/2)=√π for half-integers k/2
        let res = k % 2 === 1 ? 0.5 * Math.log(Math.PI) : 0;
        for (let m = k - 2; m >= 1; m -= 2) res += Math.log(m / 2);
        return res;
      };
      const logC = logGammaHalf(df + 1) - logGammaHalf(df) - 0.5 * Math.log(df * Math.PI);
      const pdf = (u: number) => Math.exp(logC - 0.5 * (df + 1) * Math.log(1 + (u * u) / df));
      const n = 400, h = t / n;
      let s = pdf(0) + pdf(t);
      for (let i = 1; i < n; i++) s += (i % 2 === 1 ? 4 : 2) * pdf(i * h);
      const area0t = t === 0 ? 0 : (h / 3) * s;
      const pTwo = Math.max(0, Math.min(1, 1 - 2 * area0t));
      return done([outN("Two-tailed p-value", pTwo, 6, undefined, true), outN("One-tailed p-value", pTwo / 2, 6)]);
    },
  },
  {
    slug: "chi-square-test",
    fields: [txtF("obs", "Observed counts Oᵢ", "28, 22, 31, 19"), txtF("exp", "Expected counts Eᵢ (> 0)", "25, 25, 25, 25")],
    formulaPlain: "χ² = ∑ (Oᵢ − Eᵢ)² / Eᵢ; df = k − 1",
    variables: [{ symbol: "Oᵢ, Eᵢ", description: "Observed and expected cell counts" }],
    compute: (v) => {
      const o = parseNumList(String(v.obs), 2), e = parseNumList(String(v.exp), 2);
      if (!o.ok) return o; if (!e.ok) return e;
      if (o.value.length !== e.value.length) return err("Observed and expected arrays must match in length.");
      if (e.value.some((x) => x <= 0)) return err("Expected counts must be strictly positive.");
      const chi2 = o.value.reduce((s, oi, i) => s + ((oi - e.value[i]) ** 2) / e.value[i], 0);
      return done([outN("Chi-square statistic (χ²)", chi2, 6, undefined, true), outN("Degrees of freedom", o.value.length - 1, 0)]);
    },
  },
  {
    slug: "binomial-probability",
    fields: [intF("n", "Trials n", 10, { min: 1, max: 1000 }), intF("k", "Successes k", 4, { min: 0 }), nnF("p", "Success probability p", 0.5, undefined, { max: 1 })],
    formulaPlain: "P(X = k) = C(n, k) · p^k · (1 − p)^(n − k)",
    variables: [{ symbol: "n, k, p", description: "Independent Bernoulli trials" }],
    compute: (v) => {
      const n = Number(v.n), k = Number(v.k), p = Number(v.p);
      if (k > n) return err("Successes k cannot exceed total trials n.");
      const pmf = (i: number) => combNum(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      let cdf = 0;
      for (let i = 0; i <= k; i++) cdf += pmf(i);
      return done([outN("Exact P(X = k)", pmf(k), 6, undefined, true), outN("Cumulative P(X ≤ k)", cdf, 6), outN("Mean (np)", n * p, 4)]);
    },
  },
  {
    slug: "poisson-probability",
    fields: [posF("lam", "Mean rate λ", 3.5), intF("k", "Events k", 4, { min: 0, max: 170 })],
    formulaPlain: "P(X = k) = e^−λ · λ^k / k!",
    variables: [{ symbol: "λ, k", description: "Rate parameter and event count" }],
    compute: (v) => {
      const lam = Number(v.lam), k = Number(v.k);
      let term = Math.exp(-lam), cdf = term;
      for (let i = 1; i <= k; i++) { term *= lam / i; cdf += term; }
      return done([outN("Exact P(X = k)", term, 6, undefined, true), outN("Cumulative P(X ≤ k)", cdf, 6)]);
    },
  },
  {
    slug: "exponential-distribution",
    fields: [posF("lam", "Rate parameter λ", 0.25), nnF("x", "Time / value x", 3)],
    formulaPlain: "f(x) = λe^(−λx); F(x) = 1 − e^(−λx)",
    variables: [{ symbol: "λ, x", description: "Event rate (> 0) and non-negative wait time" }],
    compute: (v) => {
      const lam = Number(v.lam), x = Number(v.x);
      return done([outN("CDF P(X ≤ x)", 1 - Math.exp(-lam * x), 6, undefined, true), outN("PDF f(x)", lam * Math.exp(-lam * x), 6), outN("Mean (1/λ)", 1 / lam, 4)]);
    },
  },
  {
    slug: "confidence-interval-mean",
    fields: [numF("mean", "Sample mean x̄", 52.4), posF("sd", "Standard deviation σ/s", 6.2), intF("n", "Sample size n", 40, { min: 2 }), posF("cl", "Confidence level", 95, "%", { max: 99.99 })],
    formulaPlain: "x̄ ± z_{α/2} · (s / √n)",
    variables: [{ symbol: "x̄, s, n, CL", description: "Mean, dispersion, sample count, confidence %" }],
    compute: (v) => {
      const mean = Number(v.mean), sd = Number(v.sd), n = Number(v.n), cl = Number(v.cl) / 100;
      const z = normalInv(0.5 + cl / 2);
      const me = z * (sd / Math.sqrt(n));
      return done([outS(`${v.cl}% Confidence Interval`, `[${(mean - me).toFixed(4)}, ${(mean + me).toFixed(4)}]`, undefined, true), outN("Margin of error (±)", me, 4)]);
    },
  },
  {
    slug: "confidence-interval-proportion",
    fields: [nnF("phat", "Sample proportion p̂ (0–1)", 0.62, undefined, { max: 1 }), intF("n", "Sample size n", 250, { min: 1 }), posF("cl", "Confidence level", 95, "%", { max: 99.99 })],
    formulaPlain: "p̂ ± z_{α/2} · √(p̂(1 − p̂) / n) (Wald normal interval)",
    variables: [{ symbol: "p̂, n", description: "Observed proportion and sample size" }],
    compute: (v) => {
      const p = Number(v.phat), n = Number(v.n), z = normalInv(0.5 + Number(v.cl) / 200);
      const me = z * Math.sqrt((p * (1 - p)) / n);
      return done([outS(`${v.cl}% Proportion CI`, `[${Math.max(0, p - me).toFixed(4)}, ${Math.min(1, p + me).toFixed(4)}]`, undefined, true), outN("Margin of error", me * 100, 3, "%")]);
    },
  },
  {
    slug: "sample-size",
    fields: [posF("margin", "Target margin of error E", 5, "%", { max: 50 }), posF("cl", "Confidence level", 95, "%", { max: 99.99 }), posF("p", "Estimated proportion p", 50, "%", { max: 99.99 })],
    formulaPlain: "n = ⌈z² · p(1 − p) / E²⌉ (Cochran formula)",
    variables: [{ symbol: "E, CL, p", description: "Margin %, confidence %, estimated proportion %" }],
    compute: (v) => {
      const E = Number(v.margin) / 100, z = normalInv(0.5 + Number(v.cl) / 200), p = Number(v.p) / 100;
      const n = Math.ceil((z * z * p * (1 - p)) / (E * E));
      return done([outN("Required sample size n", n, 0, "subjects", true)]);
    },
  },
  {
    slug: "margin-of-error",
    fields: [intF("n", "Sample size n", 400, { min: 1 }), posF("cl", "Confidence level", 95, "%", { max: 99.99 }), posF("p", "Proportion p", 50, "%", { max: 99.99 })],
    formulaPlain: "E = z_{α/2} · √(p(1 − p) / n)",
    variables: [{ symbol: "n, CL, p", description: "Sample size, confidence %, proportion %" }],
    compute: (v) => {
      const n = Number(v.n), z = normalInv(0.5 + Number(v.cl) / 200), p = Number(v.p) / 100;
      return done([outN("Margin of error (±)", z * Math.sqrt((p * (1 - p)) / n) * 100, 3, "%", true)]);
    },
  },

  // ── C09 Discrete Mathematics, Combinatorics and Number Theory (20) ─────────
  {
    slug: "permutations",
    fields: [intF("n", "Total items n", 10, { min: 0, max: 170 }), intF("r", "Selected ordered items r", 3, { min: 0, max: 170 })],
    formulaPlain: "P(n, r) = n! / (n − r)!",
    variables: [{ symbol: "n, r", description: "Total distinct elements and selection length (r ≤ n)" }],
    compute: (v) => {
      const n = Number(v.n), r = Number(v.r);
      if (r > n) return err("Selection count r cannot exceed total items n.");
      return done([outN("Permutations P(n, r)", permNum(n, r), 0, undefined, true)]);
    },
  },
  {
    slug: "combinations",
    fields: [intF("n", "Total items n", 52, { min: 0, max: 1000 }), intF("r", "Chosen items r", 5, { min: 0, max: 1000 })],
    formulaPlain: "C(n, r) = n! / (r! · (n − r)!)",
    variables: [{ symbol: "n, r", description: "Unordered subset count (r ≤ n)" }],
    compute: (v) => {
      const n = Number(v.n), r = Number(v.r);
      if (r > n) return err("r cannot exceed n.");
      return done([outN("Combinations C(n, r)", combNum(n, r), 0, undefined, true)]);
    },
  },
  {
    slug: "combinations-repetition",
    fields: [intF("n", "Distinct types n", 5, { min: 1, max: 500 }), intF("r", "Selections with replacement r", 3, { min: 0, max: 500 })],
    formulaPlain: "C(n + r − 1, r) (stars and bars)",
    variables: [{ symbol: "n, r", description: "Types and selections allowing repetition" }],
    compute: (v) => done([outN("Multiset combinations", combNum(Number(v.n) + Number(v.r) - 1, Number(v.r)), 0, undefined, true)]),
  },
  {
    slug: "factorial",
    fields: [intF("n", "Non-negative integer n", 10, { min: 0, max: 170 })],
    formulaPlain: "n! = ∏_{k=1}^n k (0! = 1)",
    variables: [{ symbol: "n", description: "Integer 0 ≤ n ≤ 170" }],
    compute: (v) => {
      let f = 1n;
      for (let i = 2n; i <= BigInt(Number(v.n)); i++) f *= i;
      return done([outS(`${v.n}! (exact)`, String(f), undefined, true), outN("Decimal digits", String(f).length, 0)]);
    },
  },
  {
    slug: "multinomial",
    fields: [txtF("groups", "Non-negative group sizes (comma-separated)", "2, 2, 1")],
    formulaPlain: "n! / (k₁! · k₂! · ... · kₘ!), where n = ∑ kᵢ",
    variables: [{ symbol: "kᵢ", description: "Partition sizes" }],
    compute: (v) => {
      const p = parseNumList(String(v.groups), 1);
      if (!p.ok) return p;
      if (p.value.some((k) => !Number.isInteger(k) || k < 0)) return err("Group sizes must be non-negative integers.");
      const fact = (m: number) => { let r = 1n; for (let i = 2n; i <= BigInt(m); i++) r *= i; return r; };
      const tot = p.value.reduce((a, b) => a + b, 0);
      if (tot > 170) return err("Total size ∑kᵢ exceeds limit 170.");
      const den = p.value.reduce((acc, k) => acc * fact(k), 1n);
      return done([outS("Multinomial coefficient", String(fact(tot) / den), undefined, true), outN("Total items n", tot, 0)]);
    },
  },
  {
    slug: "gcd-lcm",
    fields: [txtF("nums", "Non-zero integers (comma-separated)", "24, 36, 60")],
    formulaPlain: "Euclid's algorithm: gcd(a, b); lcm(a, b) = |a·b| / gcd(a, b)",
    variables: [{ symbol: "nums", description: "Two or more non-zero integers" }],
    compute: (v) => {
      const p = parseNumList(String(v.nums), 2);
      if (!p.ok) return p;
      if (p.value.some((n) => !Number.isInteger(n) || n === 0)) return err("Enter non-zero whole integers.");
      const bigs = p.value.map((n) => BigInt(Math.abs(n)));
      const g = bigs.reduce((a, b) => gcdBig(a, b));
      const l = bigs.reduce((a, b) => (a / gcdBig(a, b)) * b);
      return done([outS("GCD", String(g), undefined, true), outS("LCM", String(l), undefined, true)]);
    },
  },
  {
    slug: "prime-factorisation",
    fields: [intF("n", "Integer n (≥ 2)", 360, { min: 2, max: 1000000000 })],
    formulaPlain: "Fundamental theorem of arithmetic: n = ∏ pᵢ^(eᵢ)",
    variables: [{ symbol: "n", description: "Integer 2 ≤ n ≤ 10⁹" }],
    compute: (v) => {
      let rem = Number(v.n);
      const parts: string[] = [];
      for (let p = 2; p * p <= rem; p++) {
        let e = 0;
        while (rem % p === 0) { rem /= p; e++; }
        if (e > 0) parts.push(e === 1 ? `${p}` : `${p}^${e}`);
      }
      if (rem > 1) parts.push(`${rem}`);
      return done([outS("Prime factorisation", parts.join(" × "), undefined, true)]);
    },
  },
  {
    slug: "primality-test",
    fields: [intF("n", "Integer n (≥ 1)", 7919, { min: 1, max: 1000000000 })],
    formulaPlain: "Deterministic 6k ± 1 trial division up to ⌊√n⌋",
    variables: [{ symbol: "n", description: "Positive integer ≤ 10⁹" }],
    compute: (v) => {
      const n = Number(v.n);
      if (n < 2) return done([outS("Primality", "Neither prime nor composite (1)", undefined, true)]);
      for (let d = 2; d * d <= n; d++) {
        if (n % d === 0) return done([outS("Primality", "Composite", undefined, true), outN("Smallest prime factor", d, 0)]);
      }
      return done([outS("Primality", "Prime", undefined, true)]);
    },
  },
  {
    slug: "primes-in-range",
    fields: [intF("limit", "Upper bound N", 100, { min: 2, max: 100000 })],
    formulaPlain: "Sieve of Eratosthenes on [2, N]",
    variables: [{ symbol: "N", description: "Upper bound (2 ≤ N ≤ 100,000)" }],
    compute: (v) => {
      const N = Number(v.limit);
      const sieve = new Uint8Array(N + 1).fill(1);
      sieve[0] = sieve[1] = 0;
      for (let i = 2; i * i <= N; i++) if (sieve[i]) for (let j = i * i; j <= N; j += i) sieve[j] = 0;
      const primes: number[] = [];
      for (let i = 2; i <= N; i++) if (sieve[i]) primes.push(i);
      return done([
        outN("Prime count π(N)", primes.length, 0, undefined, true),
        outS("Sample primes", primes.slice(0, 12).join(", ") + (primes.length > 12 ? " …" : "")),
      ]);
    },
  },
  {
    slug: "divisors-count",
    fields: [intF("n", "Positive integer n", 72, { min: 1, max: 100000000 })],
    formulaPlain: "τ(n) = count of positive divisors; σ(n) = sum of positive divisors",
    variables: [{ symbol: "τ(n), σ(n)", description: "Number-theoretic divisor functions" }],
    compute: (v) => {
      const n = Number(v.n);
      let cnt = 0, sum = 0;
      for (let d = 1; d * d <= n; d++) {
        if (n % d === 0) { cnt++; sum += d; if (d !== n / d) { cnt++; sum += n / d; } }
      }
      return done([outN("Divisor count τ(n)", cnt, 0, undefined, true), outN("Divisor sum σ(n)", sum, 0)]);
    },
  },
  {
    slug: "euler-totient",
    fields: [intF("n", "Positive integer n", 36, { min: 1, max: 1000000000 })],
    formulaPlain: "φ(n) = n · ∏_{p | n} (1 − 1/p)",
    variables: [{ symbol: "φ(n)", description: "Count of integers in [1, n] coprime to n" }],
    compute: (v) => {
      let rem = Number(v.n), res = rem;
      for (let p = 2; p * p <= rem; p++) {
        if (rem % p === 0) { while (rem % p === 0) rem /= p; res -= res / p; }
      }
      if (rem > 1) res -= res / rem;
      return done([outN("Euler's totient φ(n)", res, 0, undefined, true)]);
    },
  },
  {
    slug: "modular-exponentiation",
    fields: [intF("base", "Base a", 7), intF("exp", "Non-negative exponent e", 256, { min: 0 }), intF("mod", "Modulus m (≥ 1)", 13, { min: 1 })],
    formulaPlain: "a^e mod m via exact BigInt binary square-and-multiply",
    variables: [{ symbol: "a, e, m", description: "Integer base, exponent, and positive modulus" }],
    compute: (v) => {
      const m = BigInt(Number(v.mod));
      let b = ((BigInt(Number(v.base)) % m) + m) % m, e = BigInt(Number(v.exp)), r = 1n % m;
      while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; }
      return done([outS("a^e mod m", String(r), undefined, true)]);
    },
  },
  {
    slug: "modular-inverse",
    fields: [intF("a", "Integer a", 17), intF("m", "Modulus m (≥ 2)", 43, { min: 2 })],
    formulaPlain: "Extended Euclidean algorithm solving a·x ≡ 1 (mod m), iff gcd(a, m) = 1",
    variables: [{ symbol: "a, m", description: "Coprime integer and modulus" }],
    compute: (v) => {
      const m0 = Number(v.m);
      let a = ((Number(v.a) % m0) + m0) % m0, m = m0;
      if (gcdInt(a, m) !== 1) return err(`No modular inverse exists because gcd(${v.a}, ${m0}) ≠ 1.`);
      let x0 = 0, x1 = 1;
      while (a > 1) { const q = Math.floor(a / m); [a, m] = [m, a % m]; [x0, x1] = [x1 - q * x0, x0]; }
      const inv = ((x1 % m0) + m0) % m0;
      return done([outN("Modular inverse a⁻¹ mod m", inv, 0, undefined, true)]);
    },
  },
  {
    slug: "integer-division",
    fields: [intF("a", "Dividend a", 47), intF("b", "Divisor b (≠ 0)", 6, { nonZero: true })],
    formulaPlain: "a = b·q + r with Euclidean remainder 0 ≤ r < |b|",
    variables: [{ symbol: "q, r", description: "Quotient and non-negative remainder" }],
    compute: (v) => {
      const a = Number(v.a), b = Number(v.b);
      const r = ((a % Math.abs(b)) + Math.abs(b)) % Math.abs(b);
      const q = (a - r) / b;
      return done([outN("Euclidean quotient q", q, 0, undefined, true), outN("Remainder r", r, 0, undefined, true)]);
    },
  },
  {
    slug: "arithmetic-sequence",
    fields: [numF("a1", "First term a₁", 5), numF("d", "Common difference d", 3), intF("n", "Term index n (≥ 1)", 20, { min: 1 })],
    formulaPlain: "aₙ = a₁ + (n − 1)d; Sₙ = (n/2)(a₁ + aₙ)",
    variables: [{ symbol: "a₁, d, n", description: "Initial term, step, and term count" }],
    compute: (v) => {
      const a1 = Number(v.a1), d = Number(v.d), n = Number(v.n);
      const an = a1 + (n - 1) * d;
      return done([outN(`n-th term a_${n}`, an, 6, undefined, true), outN(`Partial sum S_${n}`, (n * (a1 + an)) / 2, 6)]);
    },
  },
  {
    slug: "geometric-sequence",
    fields: [numF("a1", "First term a₁", 3), numF("r", "Common ratio r", 2), intF("n", "Term index n (≥ 1)", 10, { min: 1, max: 500 })],
    formulaPlain: "aₙ = a₁ · r^(n − 1); Sₙ = n·a₁ if r = 1 else a₁(1 − r^n)/(1 − r)",
    variables: [{ symbol: "a₁, r, n", description: "Initial term, common ratio, count" }],
    compute: (v) => {
      const a1 = Number(v.a1), r = Number(v.r), n = Number(v.n);
      const an = a1 * Math.pow(r, n - 1);
      const sn = Math.abs(r - 1) < 1e-12 ? n * a1 : (a1 * (1 - Math.pow(r, n))) / (1 - r);
      return done([outN(`n-th term a_${n}`, an, 6, undefined, true), outN(`Partial sum S_${n}`, sn, 6)]);
    },
  },
  {
    slug: "fibonacci",
    fields: [intF("n", "Index n (0 ≤ n ≤ 100)", 15, { min: 0, max: 100 })],
    formulaPlain: "F₀ = 0, F₁ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂",
    variables: [{ symbol: "n", description: "Non-negative term index" }],
    compute: (v) => {
      const n = Number(v.n);
      let a = 0n, b = 1n;
      const seq: string[] = ["0"];
      for (let i = 1; i <= n; i++) { [a, b] = [b, a + b]; if (i <= 10) seq.push(String(a)); }
      return done([outS(`F(${n})`, String(a), undefined, true), outS("Leading terms", seq.join(", ") + (n > 10 ? " …" : ""))]);
    },
  },
  {
    slug: "catalan",
    fields: [intF("n", "Order n (0 ≤ n ≤ 30)", 6, { min: 0, max: 30 })],
    formulaPlain: "Cₙ = (2n)! / ((n + 1)! · n!)",
    variables: [{ symbol: "Cₙ", description: "n-th Catalan number" }],
    compute: (v) => {
      const n = Number(v.n);
      return done([outN(`Catalan number C_${n}`, combNum(2 * n, n) / (n + 1), 0, undefined, true)]);
    },
  },
  {
    slug: "derangements",
    fields: [intF("n", "Items n (0 ≤ n ≤ 20)", 5, { min: 0, max: 20 })],
    formulaPlain: "!n = n! · ∑_{k=0}^n (−1)^k / k! (subfactorial)",
    variables: [{ symbol: "!n", description: "Permutations with zero fixed points" }],
    compute: (v) => {
      const n = Number(v.n);
      let d = n === 0 ? 1n : 0n;
      for (let i = 2n; i <= BigInt(n); i++) d = i * d + (i % 2n === 0n ? 1n : -1n);
      if (n === 1) d = 0n;
      return done([outS(`Derangements !${n}`, String(d), undefined, true)]);
    },
  },
  {
    slug: "power-set-size",
    fields: [intF("n", "Set cardinality |S|", 10, { min: 0, max: 100 })],
    formulaPlain: "|𝒫(S)| = 2^n; proper subsets = 2^n − 1",
    variables: [{ symbol: "n", description: "Number of elements in set S" }],
    compute: (v) => {
      const p = 1n << BigInt(Number(v.n));
      return done([outS("Total subsets (2^n)", String(p), undefined, true), outS("Proper subsets (2^n − 1)", String(p - 1n))]);
    },
  },
];
