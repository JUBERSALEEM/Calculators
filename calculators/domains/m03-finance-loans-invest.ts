import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import {
  done,
  formatISODateUTC,
  intF,
  nnF,
  npv,
  numF,
  outN,
  outS,
  parseNumList,
  pmt,
  posF,
  selF,
  solveIrr,
  txtF,
} from "@/lib/engine/helpers";

export const M03_SPECS: CalculatorSpec[] = [
  // ── C10 Interest, Time Value of Money and Discounting (20) ─────────────────
  {
    slug: "simple-interest",
    fields: [posF("P", "Principal (P)", 10000, "$"), nnF("r", "Annual rate (r)", 6, "%"), posF("t", "Time (t)", 3, "years")],
    formulaPlain: "I = P · (r / 100) · t; Total = P + I",
    variables: [{ symbol: "P, r, t", description: "Principal, annual rate %, years" }],
    compute: (v) => {
      const P = Number(v.P), I = P * (Number(v.r) / 100) * Number(v.t);
      return done([outN("Simple interest earned", I, 2, "$", true), outN("Maturity total", P + I, 2, "$")]);
    },
  },
  {
    slug: "compound-interest",
    fields: [
      posF("P", "Principal (P)", 10000, "$"), nnF("r", "Nominal annual rate (r)", 7, "%"),
      selF("m", "Compounding frequency", [
        { value: "12", label: "Monthly (12/yr)" }, { value: "4", label: "Quarterly (4/yr)" },
        { value: "1", label: "Annually (1/yr)" }, { value: "365", label: "Daily (365/yr)" },
      ]),
      posF("t", "Years (t)", 10, "years"),
    ],
    formulaPlain: "FV = P · (1 + r / m)^(m·t)",
    variables: [{ symbol: "P, r, m, t", description: "Principal, annual nominal rate, periods/yr, years" }],
    compute: (v) => {
      const P = Number(v.P), r = Number(v.r) / 100, m = Number(v.m), t = Number(v.t);
      const fv = P * Math.pow(1 + r / m, m * t);
      return done([outN("Future value (FV)", fv, 2, "$", true), outN("Total compound interest", fv - P, 2, "$")]);
    },
  },
  {
    slug: "continuous-compounding",
    fields: [posF("P", "Principal (P)", 10000, "$"), numF("r", "Annual rate (r)", 6, "%"), posF("t", "Time (t)", 5, "years")],
    formulaPlain: "FV = P · e^(r·t); EAR = e^r − 1",
    variables: [{ symbol: "P, r, t", description: "Principal, continuous force of interest, years" }],
    compute: (v) => {
      const P = Number(v.P), r = Number(v.r) / 100, t = Number(v.t);
      const fv = P * Math.exp(r * t);
      return done([outN("Future value", fv, 2, "$", true), outN("Effective annual yield", (Math.exp(r) - 1) * 100, 4, "%")]);
    },
  },
  {
    slug: "effective-annual-rate",
    fields: [nnF("nom", "Nominal annual rate", 12, "%"), intF("m", "Compounding periods / year (m)", 12, { min: 1, max: 3650 })],
    formulaPlain: "EAR = (1 + i_nom / m)^m − 1",
    variables: [{ symbol: "i_nom, m", description: "Stated nominal rate and annual frequency" }],
    compute: (v) => {
      const ear = (Math.pow(1 + Number(v.nom) / 100 / Number(v.m), Number(v.m)) - 1) * 100;
      return done([outN("Effective Annual Rate (EAR / APY)", ear, 4, "%", true), outN("Spread over nominal", ear - Number(v.nom), 4, "pp")]);
    },
  },
  {
    slug: "nominal-rate-converter",
    fields: [posF("ear", "Effective Annual Rate (EAR)", 12.6825, "%"), intF("m", "Compounding periods / year (m)", 12, { min: 1, max: 3650 })],
    formulaPlain: "i_nom = m · [(1 + EAR)^(1/m) − 1]",
    variables: [{ symbol: "EAR, m", description: "Effective annual yield and compounding frequency" }],
    compute: (v) => {
      const m = Number(v.m), per = Math.pow(1 + Number(v.ear) / 100, 1 / m) - 1;
      return done([outN("Equivalent nominal annual rate", per * m * 100, 4, "%", true), outN("Periodic rate", per * 100, 4, "%")]);
    },
  },
  {
    slug: "future-value-lumpsum",
    fields: [posF("pv", "Present value (PV)", 5000, "$"), numF("r", "Periodic rate", 8, "%"), posF("n", "Periods (n)", 12)],
    formulaPlain: "FV = PV · (1 + r)^n",
    variables: [{ symbol: "PV, r, n", description: "Present sum, rate per period, period count" }],
    compute: (v) => done([outN("Future value (FV)", Number(v.pv) * Math.pow(1 + Number(v.r) / 100, Number(v.n)), 2, "$", true)]),
  },
  {
    slug: "present-value-lumpsum",
    fields: [posF("fv", "Future value (FV)", 10000, "$"), numF("r", "Discount rate per period", 7, "%", { min: -99 }), posF("n", "Periods (n)", 10)],
    formulaPlain: "PV = FV / (1 + r)^n",
    variables: [{ symbol: "FV, r, n", description: "Future cash sum, discount rate, periods" }],
    compute: (v) => {
      const pv = Number(v.fv) / Math.pow(1 + Number(v.r) / 100, Number(v.n));
      return done([outN("Present value (PV)", pv, 2, "$", true), outN("Discount amount", Number(v.fv) - pv, 2, "$")]);
    },
  },
  {
    slug: "annuity-future-value",
    fields: [posF("pmt", "Periodic payment (PMT)", 500, "$"), nnF("r", "Periodic interest rate", 0.5, "%"), intF("n", "Number of periods (n)", 120, { min: 1 })],
    formulaPlain: "FV = PMT · [((1 + i)^n − 1) / i] (or PMT·n if i = 0)",
    variables: [{ symbol: "PMT, i, n", description: "End-of-period contribution, periodic rate, count" }],
    compute: (v) => {
      const c = Number(v.pmt), i = Number(v.r) / 100, n = Number(v.n);
      const fv = i === 0 ? c * n : c * ((Math.pow(1 + i, n) - 1) / i);
      return done([outN("Ordinary annuity FV", fv, 2, "$", true), outN("Total contributed", c * n, 2, "$"), outN("Investment growth", fv - c * n, 2, "$")]);
    },
  },
  {
    slug: "annuity-present-value",
    fields: [posF("pmt", "Periodic payment (PMT)", 1000, "$"), nnF("r", "Periodic discount rate", 0.5, "%"), intF("n", "Number of periods (n)", 60, { min: 1 })],
    formulaPlain: "PV = PMT · [(1 − (1 + i)^−n) / i]",
    variables: [{ symbol: "PMT, i, n", description: "End-of-period cash flow, periodic discount rate, count" }],
    compute: (v) => {
      const c = Number(v.pmt), i = Number(v.r) / 100, n = Number(v.n);
      const pv = i === 0 ? c * n : c * ((1 - Math.pow(1 + i, -n)) / i);
      return done([outN("Ordinary annuity PV", pv, 2, "$", true), outN("Undiscounted cash sum", c * n, 2, "$")]);
    },
  },
  {
    slug: "annuity-payment",
    fields: [posF("pv", "Present value (PV)", 50000, "$"), nnF("r", "Periodic rate", 0.5, "%"), intF("n", "Number of payments (n)", 60, { min: 1 })],
    formulaPlain: "PMT = PV · i / (1 − (1 + i)^−n)",
    variables: [{ symbol: "PV, i, n", description: "Present principal, periodic rate, periods" }],
    compute: (v) => {
      const pay = pmt(Number(v.pv), Number(v.r) / 100, Number(v.n));
      return done([outN("Periodic payment (PMT)", pay, 2, "$", true), outN("Total payments", pay * Number(v.n), 2, "$")]);
    },
  },
  {
    slug: "perpetuity-present-value",
    fields: [posF("pmt", "Level periodic payment", 2500, "$"), posF("r", "Discount rate per period", 5, "%")],
    formulaPlain: "PV = PMT / r",
    variables: [{ symbol: "PMT, r", description: "Perpetual cash flow and strictly positive discount rate" }],
    compute: (v) => done([outN("Perpetuity present value", Number(v.pmt) / (Number(v.r) / 100), 2, "$", true)]),
  },
  {
    slug: "growing-perpetuity",
    fields: [posF("pmt", "Next period payment (PMT₁)", 2500, "$"), posF("r", "Discount rate (r)", 8, "%"), numF("g", "Perpetual growth rate (g)", 3, "%")],
    formulaPlain: "PV = PMT₁ / (r − g), valid strictly when r > g",
    variables: [{ symbol: "PMT₁, r, g", description: "First cash flow, discount rate, growth rate (r > g)" }],
    compute: (v) => {
      const r = Number(v.r) / 100, g = Number(v.g) / 100;
      if (r <= g) return err("Discount rate r must be strictly greater than growth rate g for finite convergence.");
      return done([outN("Growing perpetuity PV", Number(v.pmt) / (r - g), 2, "$", true)]);
    },
  },
  {
    slug: "annuity-due",
    fields: [posF("pmt", "Beginning-of-period payment", 500, "$"), nnF("r", "Periodic rate", 0.5, "%"), intF("n", "Periods (n)", 60, { min: 1 })],
    formulaPlain: "FV_due = FV_ordinary · (1 + i); PV_due = PV_ordinary · (1 + i)",
    variables: [{ symbol: "PMT, i, n", description: "Start-of-period payment, rate, period count" }],
    compute: (v) => {
      const c = Number(v.pmt), i = Number(v.r) / 100, n = Number(v.n);
      const fvOrd = i === 0 ? c * n : c * ((Math.pow(1 + i, n) - 1) / i);
      const pvOrd = i === 0 ? c * n : c * ((1 - Math.pow(1 + i, -n)) / i);
      return done([outN("Annuity-due Future Value", fvOrd * (1 + i), 2, "$", true), outN("Annuity-due Present Value", pvOrd * (1 + i), 2, "$")]);
    },
  },
  {
    slug: "npv",
    fields: [numF("rate", "Discount rate per period", 10, "%", { min: -99 }), txtF("cfs", "Cash flows t = 0, 1, 2… (comma-separated)", "-10000, 3500, 4200, 4800")],
    formulaPlain: "NPV = ∑_{t=0}^T CF_t / (1 + r)^t",
    variables: [{ symbol: "CF_t, r", description: "Signed periodic cash flows starting at t = 0 and discount rate" }],
    compute: (v) => {
      const p = parseNumList(String(v.cfs), 2);
      if (!p.ok) return p;
      const val = npv(Number(v.rate) / 100, p.value);
      return done([outN("Net Present Value (NPV)", val, 2, "$", true), outS("Decision rule", val >= 0 ? "Positive / value-adding (NPV ≥ 0)" : "Negative (NPV < 0)")]);
    },
  },
  {
    slug: "irr",
    fields: [txtF("cfs", "Cash flows t = 0, 1, 2… (must change sign)", "-10000, 3500, 4200, 4800")],
    formulaPlain: "Solves ∑ CF_t / (1 + IRR)^t = 0 via Newton-Raphson + bracketed bisection",
    variables: [{ symbol: "CF_t", description: "Periodic cash flows with initial outlay and inflows" }],
    compute: (v) => {
      const p = parseNumList(String(v.cfs), 2);
      if (!p.ok) return p;
      const solved = solveIrr(p.value);
      if (!solved) return err("No real IRR found — cash flows must include at least one negative and one positive entry.");
      return done([
        outN("Internal Rate of Return (IRR)", solved.rate * 100, 4, "%", true),
        outN("Solver iterations", solved.iterations, 0),
        outN("NPV residual at IRR", npv(solved.rate, p.value), 8, "$"),
      ]);
    },
  },
  {
    slug: "cagr",
    fields: [posF("begin", "Beginning value", 10000, "$"), posF("end", "Ending value", 19671.51, "$"), posF("years", "Horizon", 7, "years")],
    formulaPlain: "CAGR = (Ending / Beginning)^(1 / years) − 1",
    variables: [{ symbol: "Begin, End, years", description: "Positive start value, end value, and duration" }],
    compute: (v) => {
      const b = Number(v.begin), e = Number(v.end), y = Number(v.years);
      return done([outN("Compound Annual Growth Rate", (Math.pow(e / b, 1 / y) - 1) * 100, 4, "%", true), outN("Total multiple", e / b, 4, "×")]);
    },
  },
  {
    slug: "doubling-time",
    fields: [posF("rate", "Annual growth rate", 8, "%")],
    formulaPlain: "Exact t = ln(2) / ln(1 + r); Rule of 72 ≈ 72 / (100r)",
    variables: [{ symbol: "r", description: "Positive annual growth rate" }],
    compute: (v) => {
      const pct = Number(v.rate);
      return done([outN("Exact doubling time", Math.LN2 / Math.log(1 + pct / 100), 4, "years", true), outN("Rule of 72 estimate", 72 / pct, 2, "years")]);
    },
  },
  {
    slug: "real-return",
    fields: [numF("nom", "Nominal return", 8.5, "%"), numF("inf", "Inflation rate", 3.0, "%", { min: -99 })],
    formulaPlain: "Fisher equation: r_real = (1 + r_nom) / (1 + π) − 1",
    variables: [{ symbol: "r_nom, π", description: "Nominal return and inflation rate" }],
    compute: (v) => {
      const rn = Number(v.nom) / 100, pi = Number(v.inf) / 100;
      return done([outN("Exact Fisher real return", (((1 + rn) / (1 + pi)) - 1) * 100, 4, "%", true), outN("Linear approximation (r − π)", (rn - pi) * 100, 4, "%")]);
    },
  },
  {
    slug: "inflation-adjusted-value",
    fields: [posF("amt", "Nominal amount", 100000, "$"), numF("inf", "Annual inflation rate", 3.2, "%", { min: -99 }), nnF("years", "Horizon", 15, "years")],
    formulaPlain: "Real value today = Nominal / (1 + π)^t; Future nominal needed = Amount · (1 + π)^t",
    variables: [{ symbol: "π, t", description: "Annual inflation rate and years" }],
    compute: (v) => {
      const a = Number(v.amt), f = Math.pow(1 + Number(v.inf) / 100, Number(v.years));
      return done([outN("Today's purchasing power of future sum", a / f, 2, "$", true), outN("Future nominal sum needed for same power", a * f, 2, "$")]);
    },
  },
  {
    slug: "discount-factor",
    fields: [numF("rate", "Periodic discount rate", 6.5, "%", { min: -99 }), nnF("n", "Period t", 5)],
    formulaPlain: "DF = (1 + r)^−t; PV per $1,000 = 1000 · DF",
    variables: [{ symbol: "r, t", description: "Discount rate and period count" }],
    compute: (v) => {
      const df = Math.pow(1 + Number(v.rate) / 100, -Number(v.n));
      return done([outN("Discount factor DF", df, 6, undefined, true), outN("PV per $1,000", 1000 * df, 2, "$")]);
    },
  },

  // ── C11 Loans, Amortisation and Credit (20) ────────────────────────────────
  {
    slug: "loan-payment",
    fields: [posF("P", "Loan principal", 25000, "$"), nnF("apr", "Nominal APR", 6.5, "%"), intF("months", "Term", 60, { min: 1, unit: "months" })],
    formulaPlain: "PMT = P · (i / (1 − (1 + i)^−n)), i = APR / 12",
    variables: [{ symbol: "P, APR, n", description: "Principal, annual nominal rate (US monthly convention), months" }],
    compute: (v) => {
      const P = Number(v.P), n = Number(v.months), pay = pmt(P, Number(v.apr) / 100 / 12, n);
      return done([outN("Monthly payment", pay, 2, "$", true), outN("Total interest", pay * n - P, 2, "$"), outN("Total repaid", pay * n, 2, "$")]);
    },
  },
  {
    slug: "amortisation-schedule",
    fields: [posF("P", "Loan principal", 200000, "$"), nnF("apr", "Annual interest rate", 6.0, "%"), intF("months", "Term", 360, { min: 1, unit: "months" })],
    formulaPlain: "Month k: interest_k = balance_{k−1}·i; principal_k = PMT − interest_k",
    variables: [{ symbol: "P, i, n", description: "Amortising loan schedule summary" }],
    compute: (v) => {
      const P = Number(v.P), i = Number(v.apr) / 100 / 12, n = Number(v.months);
      const pay = pmt(P, i, n);
      let bal = P, yr1Int = 0, yr1Prin = 0;
      for (let m = 1; m <= Math.min(12, n); m++) {
        const intr = bal * i, prin = Math.min(bal, pay - intr);
        yr1Int += intr; yr1Prin += prin; bal -= prin;
      }
      return done([
        outN("Scheduled monthly payment", pay, 2, "$", true),
        outN("Year-1 principal paid", yr1Prin, 2, "$"),
        outN("Year-1 interest paid", yr1Int, 2, "$"),
        outN("Balance after 12 months", Math.max(0, bal), 2, "$"),
      ]);
    },
  },
  {
    slug: "total-interest-paid",
    fields: [posF("P", "Loan amount", 35000, "$"), nnF("apr", "Nominal APR", 7.2, "%"), intF("months", "Term", 72, { min: 1, unit: "months" })],
    formulaPlain: "Total Interest = n · PMT − P",
    variables: [{ symbol: "P, APR, n", description: "Loan amount, APR %, months" }],
    compute: (v) => {
      const P = Number(v.P), n = Number(v.months), pay = pmt(P, Number(v.apr) / 100 / 12, n);
      return done([outN("Total interest over life of loan", pay * n - P, 2, "$", true), outN("Monthly payment", pay, 2, "$")]);
    },
  },
  {
    slug: "extra-payment-payoff",
    fields: [posF("P", "Loan balance", 200000, "$"), nnF("apr", "Annual rate", 6.5, "%"), intF("months", "Original months", 360, { min: 1 }), nnF("extra", "Extra monthly principal", 250, "$")],
    formulaPlain: "Simulates monthly balance reduction with PMT + extra principal",
    variables: [{ symbol: "extra", description: "Additional monthly principal applied each month" }],
    compute: (v) => {
      const P = Number(v.P), i = Number(v.apr) / 100 / 12, n = Number(v.months), ex = Number(v.extra);
      const basePay = pmt(P, i, n);
      let bal = P, m = 0, totInt = 0;
      while (bal > 0.005 && m < n + 12) {
        m++;
        const intr = bal * i;
        totInt += intr;
        bal -= Math.min(bal, basePay + ex - intr);
      }
      const baseInt = basePay * n - P;
      return done([outN("Months saved", n - m, 0, "months", true), outN("Interest saved", Math.max(0, baseInt - totInt), 2, "$"), outN("New payoff term", m, 0, "months")]);
    },
  },
  {
    slug: "biweekly-payment",
    fields: [posF("P", "Loan amount", 250000, "$"), posF("apr", "Annual rate", 6.5, "%"), intF("years", "Term", 30, { min: 1, unit: "years" })],
    formulaPlain: "26 half-monthly payments/year (= 13 monthly payments/year) amortised at APR/26",
    variables: [{ symbol: "P, APR, years", description: "Principal, annual rate, loan years" }],
    compute: (v) => {
      const P = Number(v.P), r = Number(v.apr) / 100, nMonths = Number(v.years) * 12;
      const mPay = pmt(P, r / 12, nMonths);
      const bwPay = mPay / 2;
      let bal = P, periods = 0, bwInt = 0;
      while (bal > 0.01 && periods < 2600) {
        periods++;
        const intr = bal * (r / 26);
        bwInt += intr;
        if (bwPay <= intr) return err("Biweekly payment does not cover periodic interest.");
        bal -= Math.min(bal, bwPay - intr);
      }
      return done([outN("Biweekly payment", bwPay, 2, "$", true), outN("Interest saved vs monthly", Math.max(0, mPay * nMonths - P - bwInt), 2, "$"), outN("Payoff time", periods / 26, 2, "years")]);
    },
  },
  {
    slug: "balloon-payment",
    fields: [posF("P", "Loan amount", 150000, "$"), nnF("balloon", "Balloon balance at maturity", 50000, "$"), posF("apr", "Annual rate", 6.8, "%"), intF("months", "Term", 60, { min: 1 })],
    formulaPlain: "PMT = (P − B·(1 + i)^−n) · i / (1 − (1 + i)^−n)",
    variables: [{ symbol: "P, B, i, n", description: "Principal, final balloon lump sum, monthly rate, months" }],
    compute: (v) => {
      const P = Number(v.P), B = Number(v.balloon), i = Number(v.apr) / 100 / 12, n = Number(v.months);
      if (B >= P) return err("Balloon balance must be smaller than loan principal.");
      const pvAmort = P - B * Math.pow(1 + i, -n);
      const pay = pmt(pvAmort, i, n);
      return done([outN("Monthly payment before balloon", pay, 2, "$", true), outN("Final balloon due at month n", B, 2, "$"), outN("Total interest paid", pay * n + B - P, 2, "$")]);
    },
  },
  {
    slug: "interest-only-payment",
    fields: [posF("P", "Principal balance", 300000, "$"), nnF("apr", "Annual interest rate", 6.25, "%")],
    formulaPlain: "Monthly IO Payment = P · (APR / 12)",
    variables: [{ symbol: "P, APR", description: "Unamortised principal and nominal rate" }],
    compute: (v) => {
      const m = (Number(v.P) * (Number(v.apr) / 100)) / 12;
      return done([outN("Monthly interest-only payment", m, 2, "$", true), outN("Annual interest cost", m * 12, 2, "$")]);
    },
  },
  {
    slug: "credit-card-payoff",
    fields: [posF("bal", "Card balance", 6500, "$"), posF("apr", "Card APR", 21.99, "%"), posF("pay", "Fixed monthly payment", 250, "$")],
    formulaPlain: "n = −ln(1 − B·i / PMT) / ln(1 + i), requires PMT > B·i",
    variables: [{ symbol: "B, i, PMT", description: "Balance, monthly rate APR/12, fixed payment" }],
    compute: (v) => {
      const B = Number(v.bal), i = Number(v.apr) / 100 / 12, pay = Number(v.pay);
      if (pay <= B * i) return err(`Monthly payment ($${pay}) does not cover monthly interest ($${(B * i).toFixed(2)}); balance grows indefinitely.`);
      const n = Math.ceil(-Math.log(1 - (B * i) / pay) / Math.log(1 + i));
      let rem = B, totInt = 0;
      for (let k = 0; k < n; k++) { const intr = rem * i; totInt += intr; rem -= Math.min(rem, pay - intr); }
      return done([outN("Months to pay off", n, 0, "months", true), outN("Total interest paid", totInt, 2, "$")]);
    },
  },
  {
    slug: "minimum-payment-time",
    fields: [posF("bal", "Card balance", 5000, "$"), posF("apr", "Card APR", 19.99, "%"), posF("minPct", "Minimum payment % of balance", 2.5, "%", { max: 100 }), posF("floor", "Dollar minimum floor", 25, "$")],
    formulaPlain: "Month-by-month simulation with payment_k = max(floor, minPct · balance_k)",
    variables: [{ symbol: "minPct, floor", description: "Issuer minimum payment schedule" }],
    compute: (v) => {
      let bal = Number(v.bal);
      const i = Number(v.apr) / 100 / 12, pct = Number(v.minPct) / 100, fl = Number(v.floor);
      let months = 0, totInt = 0;
      while (bal > 0.01 && months < 1200) {
        months++;
        const intr = bal * i;
        const pay = Math.max(fl, bal * pct);
        if (pay <= intr) return err("Minimum payment is lower than monthly interest accrued; balance will never amortise.");
        totInt += intr;
        bal -= Math.min(bal, pay - intr);
      }
      return done([outN("Payoff time", months, 0, "months", true), outN("Total interest paid", totInt, 2, "$")]);
    },
  },
  {
    slug: "apr-from-fees",
    fields: [posF("amount", "Loan principal advanced", 200000, "$"), nnF("fees", "Upfront prepaid finance charges", 4500, "$"), posF("rate", "Note interest rate", 6.25, "%"), intF("months", "Term", 360, { min: 1, unit: "months" })],
    formulaPlain: "CFPB Reg Z Appendix J actuarial equation: solves Net Advance = ∑_{k=1}^n PMT / (1 + j)^k, APR = 12·j",
    variables: [{ symbol: "Net Advance", description: "Principal minus prepaid finance charges (R-007 US closed-end credit)" }],
    assumptions: ["Equal monthly unit-periods per 12 CFR Part 1026 Appendix J (US closed-end credit).", "Solved iteratively by Newton-Raphson with residual reported."],
    compute: (v) => {
      const P = Number(v.amount), fees = Number(v.fees), n = Number(v.months);
      if (fees >= P) return err("Prepaid fees must be strictly less than loan amount.");
      const netAdv = P - fees;
      const monthlyPmt = pmt(P, Number(v.rate) / 100 / 12, n);
      let j = Number(v.rate) / 100 / 12 + 0.001;
      let iter = 0;
      for (iter = 1; iter <= 80; iter++) {
        let pv = 0, dpv = 0;
        for (let k = 1; k <= n; k++) {
          const d = Math.pow(1 + j, k);
          pv += monthlyPmt / d;
          dpv -= (k * monthlyPmt) / (d * (1 + j));
        }
        const f = pv - netAdv;
        if (Math.abs(f) < 1e-7) break;
        j -= f / dpv;
      }
      return done([
        outN("Actuarial APR (Reg Z)", j * 12 * 100, 3, "%", true),
        outN("Monthly payment", monthlyPmt, 2, "$"),
        outN("Solver iterations", iter, 0),
      ]);
    },
  },
  {
    slug: "apr-periodic-rate",
    fields: [nnF("apr", "Stated APR", 18.0, "%"), intF("freq", "Periods per year", 12, { min: 1, max: 365 })],
    formulaPlain: "Nominal periodic = APR / m; Effective APY = (1 + APR/m)^m − 1",
    variables: [{ symbol: "APR, m", description: "Annual percentage rate and billing periods per year" }],
    compute: (v) => {
      const apr = Number(v.apr) / 100, m = Number(v.freq);
      return done([outN("Periodic rate", (apr / m) * 100, 4, "%", true), outN("Compounded APY", (Math.pow(1 + apr / m, m) - 1) * 100, 4, "%")]);
    },
  },
  {
    slug: "add-on-interest",
    fields: [posF("P", "Principal", 10000, "$"), posF("flat", "Flat add-on annual rate", 5, "%"), intF("months", "Term", 60, { min: 1, unit: "months" })],
    formulaPlain: "PMT = (P + P·r_flat·years)/n; solves actuarial APR amortising the same payment",
    variables: [{ symbol: "r_flat", description: "Add-on rate applied to original principal" }],
    compute: (v) => {
      const P = Number(v.P), rf = Number(v.flat) / 100, n = Number(v.months);
      const totInt = P * rf * (n / 12);
      const pay = (P + totInt) / n;
      const cfs = [-P, ...Array<number>(n).fill(pay)];
      const irr = solveIrr(cfs);
      return done([
        outN("True equivalent APR", (irr ? irr.rate * 12 * 100 : 0), 3, "%", true),
        outN("Monthly payment", pay, 2, "$"),
        outN("Total add-on interest", totInt, 2, "$"),
      ]);
    },
  },
  {
    slug: "flat-vs-reducing",
    fields: [posF("P", "Loan amount", 20000, "$"), posF("rate", "Quoted annual rate", 6, "%"), intF("months", "Term", 48, { min: 1, unit: "months" })],
    formulaPlain: "Compares total interest under flat add-on rate vs reducing-balance amortisation",
    variables: [{ symbol: "P, r, n", description: "Loan principal, rate %, months" }],
    compute: (v) => {
      const P = Number(v.P), r = Number(v.rate) / 100, n = Number(v.months);
      const flatInt = P * r * (n / 12);
      const redInt = pmt(P, r / 12, n) * n - P;
      return done([outN("Extra cost of flat vs reducing", flatInt - redInt, 2, "$", true), outN("Flat-rate interest", flatInt, 2, "$"), outN("Reducing-balance interest", redInt, 2, "$")]);
    },
  },
  {
    slug: "loan-affordability",
    fields: [posF("income", "Gross monthly income", 7500, "$"), nnF("debts", "Existing monthly debt payments", 450, "$"), posF("dti", "Max total DTI threshold", 36, "%", { max: 90 }), posF("apr", "Loan APR", 6.5, "%"), intF("months", "Term", 60, { min: 1 })],
    formulaPlain: "Max PMT = Income·DTI − Existing Debts; PV from amortising annuity",
    variables: [{ symbol: "DTI", description: "User-selected total debt-to-income cap (lender-specific)" }],
    compute: (v) => {
      const maxPmt = Number(v.income) * (Number(v.dti) / 100) - Number(v.debts);
      if (maxPmt <= 0) return err("Existing monthly debts already meet or exceed the selected DTI cap.");
      const i = Number(v.apr) / 100 / 12, n = Number(v.months);
      const maxLoan = maxPmt * ((1 - Math.pow(1 + i, -n)) / i);
      return done([outN("Maximum affordable loan", maxLoan, 2, "$", true), outN("Maximum new monthly payment", maxPmt, 2, "$")]);
    },
  },
  {
    slug: "debt-snowball",
    fields: [txtF("bals", "Balances smallest to largest", "1200, 3800, 9500"), txtF("aprs", "Corresponding APRs (%)", "18, 22, 9"), posF("budget", "Total monthly debt budget", 650, "$")],
    formulaPlain: "Orders payoff smallest balance first; rolls freed payments into next balance",
    variables: [{ symbol: "bals, aprs, budget", description: "Debt balances, APRs %, total monthly budget" }],
    compute: (v) => {
      const b = parseNumList(String(v.bals), 1), r = parseNumList(String(v.aprs), 1);
      if (!b.ok) return b; if (!r.ok) return r;
      if (b.value.length !== r.value.length || b.value.some((x) => x <= 0)) return err("Provide matching positive balances and APRs.");
      const items = b.value.map((bal, idx) => ({ bal, i: Math.max(0, r.value[idx]) / 100 / 12 })).sort((x, y) => x.bal - y.bal);
      let months = 0, totInt = 0;
      const bud = Number(v.budget);
      while (items.some((d) => d.bal > 0.01) && months < 1200) {
        months++;
        let remBud = bud;
        for (const d of items) {
          if (d.bal <= 0.01) continue;
          const intr = d.bal * d.i;
          totInt += intr;
          d.bal += intr;
          const minP = Math.min(d.bal, Math.max(25, intr + d.bal * 0.01));
          d.bal -= minP; remBud -= minP;
        }
        if (remBud < -0.01) return err("Monthly budget does not cover combined minimum interest + 1% principal across debts.");
        for (const d of items) {
          if (d.bal > 0.01 && remBud > 0) { const p = Math.min(d.bal, remBud); d.bal -= p; remBud -= p; }
        }
      }
      return done([outN("Months until debt-free (Snowball)", months, 0, "months", true), outN("Total interest paid", totInt, 2, "$")]);
    },
  },
  {
    slug: "debt-avalanche",
    fields: [txtF("bals", "Debt balances", "1200, 3800, 9500"), txtF("aprs", "Corresponding APRs (%)", "18, 22, 9"), posF("budget", "Total monthly debt budget", 650, "$")],
    formulaPlain: "Targets highest APR first to minimise total interest paid",
    variables: [{ symbol: "bals, aprs, budget", description: "Debt balances, APRs %, monthly budget" }],
    compute: (v) => {
      const b = parseNumList(String(v.bals), 1), r = parseNumList(String(v.aprs), 1);
      if (!b.ok) return b; if (!r.ok) return r;
      if (b.value.length !== r.value.length || b.value.some((x) => x <= 0)) return err("Provide matching positive balances and APRs.");
      const items = b.value.map((bal, idx) => ({ bal, i: Math.max(0, r.value[idx]) / 100 / 12 })).sort((x, y) => y.i - x.i);
      let months = 0, totInt = 0;
      const bud = Number(v.budget);
      while (items.some((d) => d.bal > 0.01) && months < 1200) {
        months++;
        let remBud = bud;
        for (const d of items) {
          if (d.bal <= 0.01) continue;
          const intr = d.bal * d.i; totInt += intr; d.bal += intr;
          const minP = Math.min(d.bal, Math.max(25, intr + d.bal * 0.01));
          d.bal -= minP; remBud -= minP;
        }
        if (remBud < -0.01) return err("Monthly budget does not cover combined minimum payments.");
        for (const d of items) {
          if (d.bal > 0.01 && remBud > 0) { const p = Math.min(d.bal, remBud); d.bal -= p; remBud -= p; }
        }
      }
      return done([outN("Months until debt-free (Avalanche)", months, 0, "months", true), outN("Total interest paid", totInt, 2, "$")]);
    },
  },
  {
    slug: "student-loan-payment",
    fields: [posF("bal", "Student loan balance", 38000, "$"), nnF("apr", "Interest rate", 5.5, "%"), intF("years", "Repayment plan term", 10, { min: 1, max: 30, unit: "years" })],
    formulaPlain: "Standard level amortisation over selected term",
    variables: [{ symbol: "B, r, years", description: "Balance, annual rate, repayment years" }],
    compute: (v) => {
      const B = Number(v.bal), n = Number(v.years) * 12, pay = pmt(B, Number(v.apr) / 100 / 12, n);
      return done([outN("Monthly payment", pay, 2, "$", true), outN("Total interest", pay * n - B, 2, "$")]);
    },
  },
  {
    slug: "auto-lease-payment",
    fields: [posF("cap", "Net capitalised cost", 36000, "$"), nnF("res", "Residual value at lease end", 21600, "$"), posF("mf", "Money factor (APR / 2400)", 0.0025), intF("months", "Lease term", 36, { min: 1 })],
    formulaPlain: "Depreciation = (Cap − Residual)/n; Finance = (Cap + Residual)·MF; PMT = Dep + Fin",
    variables: [{ symbol: "Cap, Residual, MF, n", description: "Standard automotive lease formula" }],
    compute: (v) => {
      const cap = Number(v.cap), res = Number(v.res), mf = Number(v.mf), n = Number(v.months);
      if (res > cap) return err("Residual value cannot exceed net capitalised cost.");
      const dep = (cap - res) / n, fin = (cap + res) * mf;
      return done([outN("Pre-tax monthly lease payment", dep + fin, 2, "$", true), outN("Implied APR (MF × 2400)", mf * 2400, 2, "%"), outN("Monthly finance charge", fin, 2, "$")]);
    },
  },
  {
    slug: "heloc-payment",
    fields: [posF("draw", "HELOC draw balance", 60000, "$"), posF("apr", "Variable APR", 8.25, "%"), intF("repayYears", "Repayment phase years", 15, { min: 1 })],
    formulaPlain: "Draw phase IO = B·(APR/12); Repayment phase = amortising PMT over repayment years",
    variables: [{ symbol: "B, APR, years", description: "Drawn credit line, rate, amortising repayment horizon" }],
    compute: (v) => {
      const B = Number(v.draw), i = Number(v.apr) / 100 / 12;
      return done([outN("Draw-period interest-only payment", B * i, 2, "$", true), outN("Repayment-period amortising payment", pmt(B, i, Number(v.repayYears) * 12), 2, "$")]);
    },
  },
  {
    slug: "prepayment-penalty",
    fields: [posF("bal", "Prepaid principal balance", 180000, "$"), posF("pct", "Penalty rate", 2.0, "%")],
    formulaPlain: "Penalty = Balance × (Penalty% / 100)",
    variables: [{ symbol: "Balance, Penalty%", description: "Remaining loan balance and contractual fee %" }],
    compute: (v) => done([outN("Prepayment penalty fee", Number(v.bal) * (Number(v.pct) / 100), 2, "$", true)]),
  },

  // ── C12 Mortgages and Property Finance (16) ────────────────────────────────
  {
    slug: "mortgage-payment",
    fields: [posF("loan", "Mortgage principal", 350000, "$"), nnF("rate", "Annual rate", 6.5, "%"), intF("years", "Term", 30, { min: 1, unit: "years" })],
    formulaPlain: "Monthly P&I = L · i / (1 − (1 + i)^−12Y)",
    variables: [{ symbol: "L, i, Y", description: "Mortgage loan, monthly rate, term in years" }],
    compute: (v) => {
      const L = Number(v.loan), n = Number(v.years) * 12, pay = pmt(L, Number(v.rate) / 100 / 12, n);
      return done([outN("Monthly Principal & Interest", pay, 2, "$", true), outN("Total lifetime interest", pay * n - L, 2, "$")]);
    },
  },
  {
    slug: "mortgage-piti",
    fields: [posF("loan", "Loan amount", 360000, "$"), nnF("rate", "Interest rate", 6.5, "%"), intF("years", "Term", 30, { min: 1 }), nnF("tax", "Annual property tax", 4800, "$"), nnF("ins", "Annual homeowners insurance", 1800, "$"), nnF("pmi", "Monthly PMI / HOA", 120, "$")],
    formulaPlain: "PITI = P&I + Tax/12 + Insurance/12 + Monthly PMI/HOA",
    variables: [{ symbol: "PITI", description: "Principal, interest, taxes, insurance" }],
    compute: (v) => {
      const pi = pmt(Number(v.loan), Number(v.rate) / 100 / 12, Number(v.years) * 12);
      const escrow = Number(v.tax) / 12 + Number(v.ins) / 12 + Number(v.pmi);
      return done([outN("Total monthly PITI", pi + escrow, 2, "$", true), outN("Principal & Interest (P&I)", pi, 2, "$"), outN("Tax + Insurance + PMI", escrow, 2, "$")]);
    },
  },
  {
    slug: "pmi-cost",
    fields: [posF("loan", "Loan amount", 360000, "$"), posF("val", "Property value", 400000, "$"), posF("pmiRate", "Annual PMI rate", 0.65, "%")],
    formulaPlain: "LTV = Loan / Value; Monthly PMI = (Loan × rate) / 12 when LTV > 80%",
    variables: [{ symbol: "LTV, rate", description: "Loan-to-value ratio and insurer annual PMI factor" }],
    compute: (v) => {
      const loan = Number(v.loan), val = Number(v.val), ltv = (loan / val) * 100;
      const monthly = ltv > 80 ? (loan * (Number(v.pmiRate) / 100)) / 12 : 0;
      return done([outN("Monthly PMI", monthly, 2, "$", true), outN("Current LTV", ltv, 2, "%"), outN("Principal needed for 80% LTV", Math.max(0, loan - 0.8 * val), 2, "$")]);
    },
  },
  {
    slug: "ltv",
    fields: [nnF("loan", "First mortgage balance", 320000, "$"), posF("val", "Appraised property value", 400000, "$")],
    formulaPlain: "LTV% = (Loan / Property Value) × 100",
    variables: [{ symbol: "Loan, Value", description: "Mortgage amount and appraised value" }],
    compute: (v) => {
      const ltv = (Number(v.loan) / Number(v.val)) * 100;
      return done([outN("Loan-to-Value (LTV)", ltv, 2, "%", true), outN("Equity percentage", 100 - ltv, 2, "%")]);
    },
  },
  {
    slug: "cltv",
    fields: [nnF("first", "First mortgage", 280000, "$"), nnF("second", "Second lien / HELOC", 50000, "$"), posF("val", "Property value", 400000, "$")],
    formulaPlain: "CLTV% = ((First + Second Lien) / Value) × 100",
    variables: [{ symbol: "First, Second, Value", description: "Combined liens over property value" }],
    compute: (v) => done([outN("Combined LTV (CLTV)", ((Number(v.first) + Number(v.second)) / Number(v.val)) * 100, 2, "%", true), outN("Total liens", Number(v.first) + Number(v.second), 2, "$")]),
  },
  {
    slug: "home-affordability",
    fields: [posF("income", "Annual gross household income", 120000, "$"), nnF("debts", "Monthly non-housing debts", 500, "$"), nnF("down", "Down payment cash", 60000, "$"), posF("rate", "Mortgage rate", 6.5, "%"), nnF("taxIns", "Monthly property tax + insurance", 450, "$")],
    formulaPlain: "28% front-end / 36% back-end guideline bound + down payment",
    variables: [{ symbol: "Income, Down", description: "Household gross income and down payment" }],
    compute: (v) => {
      const gmi = Number(v.income) / 12;
      const maxHousing = Math.min(0.28 * gmi, 0.36 * gmi - Number(v.debts)) - Number(v.taxIns);
      if (maxHousing <= 0) return err("Monthly debts and taxes/insurance exceed the 28%/36% housing budget.");
      const i = Number(v.rate) / 100 / 12;
      const maxLoan = maxHousing * ((1 - Math.pow(1 + i, -360)) / i);
      return done([outN("Estimated max home price", maxLoan + Number(v.down), 0, "$", true), outN("Max mortgage principal", maxLoan, 0, "$"), outN("Max P&I payment", maxHousing, 2, "$")]);
    },
  },
  {
    slug: "refinance-breakeven",
    fields: [posF("costs", "Total refinance closing costs", 4800, "$"), posF("saving", "Monthly payment reduction", 200, "$")],
    formulaPlain: "Break-even months = Closing Costs / Monthly Saving",
    variables: [{ symbol: "Costs, Saving", description: "Upfront refi fees and monthly cash saving" }],
    compute: (v) => {
      const m = Number(v.costs) / Number(v.saving);
      return done([outN("Break-even period", m, 1, "months", true), outN("Break-even in years", m / 12, 2, "years")]);
    },
  },
  {
    slug: "refinance-savings",
    fields: [posF("bal", "Remaining balance", 280000, "$"), posF("oldRate", "Current rate", 7.25, "%"), intF("oldMonths", "Remaining months", 312, { min: 1 }), posF("newRate", "New rate", 5.875, "%"), intF("newMonths", "New loan months", 360, { min: 1 }), nnF("costs", "Closing costs", 4500, "$")],
    formulaPlain: "Net lifetime saving = Remaining Old Payments − (New Payments + Closing Costs)",
    variables: [{ symbol: "Old, New", description: "Total remaining cash outflows including term difference" }],
    compute: (v) => {
      const B = Number(v.bal), om = Number(v.oldMonths), nm = Number(v.newMonths);
      const oldP = pmt(B, Number(v.oldRate) / 100 / 12, om);
      const newP = pmt(B, Number(v.newRate) / 100 / 12, nm);
      const net = oldP * om - (newP * nm + Number(v.costs));
      return done([outN("Net lifetime interest & cost saving", net, 2, "$", true), outN("Monthly payment change", newP - oldP, 2, "$")]);
    },
  },
  {
    slug: "cash-out-refinance",
    fields: [posF("val", "Property value", 450000, "$"), posF("maxLtv", "Max cash-out LTV", 80, "%", { max: 100 }), nnF("bal", "Current mortgage payoff", 240000, "$"), nnF("fees", "Closing costs", 5000, "$")],
    formulaPlain: "Cash Out = Value × MaxLTV − Current Balance − Fees",
    variables: [{ symbol: "Value, MaxLTV, Balance", description: "Appraised value, cap %, existing payoff" }],
    compute: (v) => {
      const maxLoan = Number(v.val) * (Number(v.maxLtv) / 100);
      const cash = maxLoan - Number(v.bal) - Number(v.fees);
      return done([outN("Net cash available at closing", Math.max(0, cash), 2, "$", true), outN("Max new loan", maxLoan, 2, "$")]);
    },
  },
  {
    slug: "mortgage-points",
    fields: [posF("loan", "Loan amount", 350000, "$"), posF("points", "Discount points paid", 1.5, "pts"), posF("baseRate", "Par rate (0 points)", 6.75, "%"), posF("buyRate", "Bought-down rate", 6.375, "%"), intF("years", "Term", 30, { min: 1 })],
    formulaPlain: "Point cost = Loan × (points / 100); Break-even = Cost / (PMT_par − PMT_bought)",
    variables: [{ symbol: "points", description: "1 point = 1% of loan principal upfront" }],
    compute: (v) => {
      const L = Number(v.loan), n = Number(v.years) * 12;
      const cost = L * (Number(v.points) / 100);
      const diff = pmt(L, Number(v.baseRate) / 100 / 12, n) - pmt(L, Number(v.buyRate) / 100 / 12, n);
      if (diff <= 0) return err("Bought-down rate must be strictly lower than par rate to produce monthly savings.");
      return done([outN("Break-even months", cost / diff, 1, "months", true), outN("Upfront cost of points", cost, 2, "$"), outN("Monthly saving", diff, 2, "$")]);
    },
  },
  {
    slug: "arm-reset",
    fields: [posF("bal", "Remaining balance at reset", 295000, "$"), posF("newRate", "Reset interest rate", 7.5, "%"), intF("remMonths", "Remaining months", 300, { min: 1 })],
    formulaPlain: "New PMT = Balance_reset · i_new / (1 − (1 + i_new)^−n_rem)",
    variables: [{ symbol: "Balance_reset, i_new, n_rem", description: "Unpaid principal at adjustment date, reset rate, remaining term" }],
    compute: (v) => done([outN("Reset monthly payment", pmt(Number(v.bal), Number(v.newRate) / 100 / 12, Number(v.remMonths)), 2, "$", true)]),
  },
  {
    slug: "mortgage-payoff-date",
    fields: [posF("bal", "Current balance", 260000, "$"), posF("rate", "Annual rate", 6.25, "%"), posF("pmt", "Current P&I payment", 1850, "$"), nnF("extra", "Extra monthly principal", 200, "$"), intF("startYear", "Start year", 2026, { min: 2000, max: 2100 })],
    formulaPlain: "n = ⌈−ln(1 − B·i / (PMT + Extra)) / ln(1 + i)⌉ added to start date",
    variables: [{ symbol: "B, i, PMT, Extra", description: "Amortisation countdown from start year" }],
    compute: (v) => {
      const B = Number(v.bal), i = Number(v.rate) / 100 / 12, tot = Number(v.pmt) + Number(v.extra);
      if (tot <= B * i) return err("Total monthly payment does not cover monthly interest.");
      const months = Math.ceil(-Math.log(1 - (B * i) / tot) / Math.log(1 + i));
      const dt = new Date(Date.UTC(Number(v.startYear), months, 1));
      return done([outS("Estimated payoff date", formatISODateUTC(dt), undefined, true), outN("Months remaining", months, 0, "months")]);
    },
  },
  {
    slug: "extra-principal-savings",
    fields: [posF("loan", "Mortgage principal", 320000, "$"), posF("rate", "Annual rate", 6.5, "%"), intF("years", "Term", 30, { min: 1 }), posF("extra", "Extra monthly principal", 300, "$")],
    formulaPlain: "Interest saved = Baseline total interest − Accelerated total interest",
    variables: [{ symbol: "Extra", description: "Recurring monthly extra principal payment" }],
    compute: (v) => {
      const L = Number(v.loan), i = Number(v.rate) / 100 / 12, n = Number(v.years) * 12;
      const base = pmt(L, i, n);
      let bal = L, m = 0, accInt = 0;
      while (bal > 0.01 && m < n) { m++; const intr = bal * i; accInt += intr; bal -= Math.min(bal, base + Number(v.extra) - intr); }
      return done([outN("Interest saved", Math.max(0, base * n - L - accInt), 2, "$", true), outN("Years shaved off loan", (n - m) / 12, 2, "years")]);
    },
  },
  {
    slug: "rent-vs-buy",
    fields: [posF("rent", "Monthly rent", 2200, "$"), posF("price", "Home purchase price", 400000, "$"), posF("downPct", "Down payment", 20, "%", { max: 100 }), posF("rate", "Mortgage rate", 6.5, "%"), numF("apprec", "Annual home appreciation", 3.0, "%"), intF("years", "Holding horizon", 7, { min: 1, max: 40 })],
    formulaPlain: "Parametric net-cost comparison over holding horizon (explicitly model-dependent, not financial advice)",
    variables: [{ symbol: "Horizon, Appreciation", description: "User-assumed holding years and appreciation rate" }],
    compute: (v) => {
      const rentTotal = Number(v.rent) * 12 * Number(v.years);
      const price = Number(v.price), down = price * (Number(v.downPct) / 100), loan = price - down;
      const i = Number(v.rate) / 100 / 12, pay = loan > 0 ? pmt(loan, i, 360) : 0;
      let bal = loan;
      for (let m = 0; m < Number(v.years) * 12; m++) { const intr = bal * i; bal = Math.max(0, bal - (pay - intr)); }
      const saleVal = price * Math.pow(1 + Number(v.apprec) / 100, Number(v.years));
      const netBuyCost = down + pay * 12 * Number(v.years) + 0.015 * price * Number(v.years) - (saleVal * 0.94 - bal);
      return done([
        outN("Estimated net buying cost over horizon", netBuyCost, 0, "$", true),
        outN("Cumulative rent outflow", rentTotal, 0, "$"),
        outS("Lower model cost", netBuyCost < rentTotal ? "Buying (under entered assumptions)" : "Renting (under entered assumptions)"),
      ]);
    },
  },
  {
    slug: "closing-costs",
    fields: [posF("price", "Purchase price", 400000, "$"), nnF("downPct", "Down payment %", 20, "%", { max: 100 }), nnF("feePct", "Origination & title fees % of price", 2.5, "%"), nnF("prepaids", "Prepaid escrow / inspection flat", 1800, "$")],
    formulaPlain: "Cash to close = Down Payment + Price × Fee% + Prepaids",
    variables: [{ symbol: "Cash to close", description: "Total buyer funds needed at settlement" }],
    compute: (v) => {
      const p = Number(v.price), down = p * (Number(v.downPct) / 100), fees = p * (Number(v.feePct) / 100) + Number(v.prepaids);
      return done([outN("Total cash needed to close", down + fees, 2, "$", true), outN("Estimated closing fees", fees, 2, "$")]);
    },
  },
  {
    slug: "down-payment",
    fields: [posF("price", "Home price", 425000, "$"), nnF("pct", "Down payment percentage", 20, "%", { max: 100 })],
    formulaPlain: "Down payment = Price × (pct / 100); Loan = Price − Down payment",
    variables: [{ symbol: "Price, pct", description: "Purchase price and down-payment share" }],
    compute: (v) => {
      const d = Number(v.price) * (Number(v.pct) / 100);
      return done([outN("Down payment cash required", d, 2, "$", true), outN("Mortgage amount", Number(v.price) - d, 2, "$")]);
    },
  },

  // ── C13 Investments, Returns and Portfolio Analysis (25) ───────────────────
  {
    slug: "roi",
    fields: [posF("cost", "Initial investment cost", 10000, "$"), numF("finalVal", "Final value / proceeds", 13400, "$")],
    formulaPlain: "ROI% = ((Final − Cost) / Cost) × 100",
    variables: [{ symbol: "Cost, Final", description: "Capital invested and total proceeds" }],
    compute: (v) => {
      const gain = Number(v.finalVal) - Number(v.cost);
      return done([outN("Return on Investment (ROI)", (gain / Number(v.cost)) * 100, 2, "%", true), outN("Net profit / loss", gain, 2, "$")]);
    },
  },
  {
    slug: "holding-period-return",
    fields: [posF("begin", "Beginning value", 10000, "$"), nnF("end", "Ending value", 11800, "$"), nnF("inc", "Dividends / income received", 450, "$")],
    formulaPlain: "HPR = (End − Begin + Income) / Begin",
    variables: [{ symbol: "Begin, End, Income", description: "Total return components" }],
    compute: (v) => {
      const hpr = ((Number(v.end) - Number(v.begin) + Number(v.inc)) / Number(v.begin)) * 100;
      return done([outN("Holding Period Return (HPR)", hpr, 3, "%", true), outN("Total dollar gain", Number(v.end) - Number(v.begin) + Number(v.inc), 2, "$")]);
    },
  },
  {
    slug: "annualized-return",
    fields: [numF("hpr", "Total cumulative return", 45, "%", { gt: -100 }), posF("years", "Holding period", 3.5, "years")],
    formulaPlain: "Annualised Return = (1 + HPR)^(1 / years) − 1",
    variables: [{ symbol: "HPR, years", description: "Cumulative holding return and years held" }],
    compute: (v) => done([outN("Compound annualised return", (Math.pow(1 + Number(v.hpr) / 100, 1 / Number(v.years)) - 1) * 100, 4, "%", true)]),
  },
  {
    slug: "sharpe-ratio",
    fields: [numF("rp", "Portfolio return (R_p)", 11.5, "%"), numF("rf", "Risk-free rate (R_f)", 4.2, "%"), posF("sd", "Excess return volatility (σ_p)", 14.0, "%")],
    formulaPlain: "Sharpe = (R_p − R_f) / σ_p",
    variables: [{ symbol: "R_p, R_f, σ_p", description: "Portfolio return, risk-free return, standard deviation" }],
    compute: (v) => done([outN("Sharpe ratio", (Number(v.rp) - Number(v.rf)) / Number(v.sd), 4, undefined, true), outN("Excess return", Number(v.rp) - Number(v.rf), 3, "%")]),
  },
  {
    slug: "sortino-ratio",
    fields: [txtF("rets", "Periodic returns (%)", "12, -4, 8, -7, 15, 9, -2"), numF("target", "Minimum acceptable return (MAR)", 3, "%")],
    formulaPlain: "Sortino = (R̄ − MAR) / √(∑ min(0, Rᵢ − MAR)² / n)",
    variables: [{ symbol: "MAR", description: "Target return threshold for downside deviation" }],
    compute: (v) => {
      const p = parseNumList(String(v.rets), 2);
      if (!p.ok) return p;
      const mar = Number(v.target), xs = p.value;
      const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
      const dd = Math.sqrt(xs.reduce((s, r) => s + Math.min(0, r - mar) ** 2, 0) / xs.length);
      if (dd === 0) return err("Downside deviation is 0 (no returns fell below MAR).");
      return done([outN("Sortino ratio", (mean - mar) / dd, 4, undefined, true), outN("Downside deviation", dd, 4, "%")]);
    },
  },
  {
    slug: "beta",
    fields: [txtF("asset", "Asset returns (%)", "4, -2, 6, 3, -5, 7"), txtF("mkt", "Market benchmark returns (%)", "3, -1.5, 4, 2, -4, 5")],
    formulaPlain: "β = Cov(R_a, R_m) / Var(R_m)",
    variables: [{ symbol: "R_a, R_m", description: "Paired asset and market periodic returns" }],
    compute: (v) => {
      const a = parseNumList(String(v.asset), 2), m = parseNumList(String(v.mkt), 2);
      if (!a.ok) return a; if (!m.ok) return m;
      if (a.value.length !== m.value.length) return err("Asset and market return series must match in length.");
      const n = a.value.length, ma = a.value.reduce((x, y) => x + y, 0) / n, mm = m.value.reduce((x, y) => x + y, 0) / n;
      let cov = 0, vm = 0;
      for (let i = 0; i < n; i++) { cov += (a.value[i] - ma) * (m.value[i] - mm); vm += (m.value[i] - mm) ** 2; }
      if (vm === 0) return err("Market variance cannot be zero.");
      return done([outN("Portfolio Beta (β)", cov / vm, 4, undefined, true)]);
    },
  },
  {
    slug: "jensen-alpha",
    fields: [numF("rp", "Realised portfolio return", 13.2, "%"), numF("rf", "Risk-free rate", 4.0, "%"), numF("beta", "Portfolio beta (β)", 1.15), numF("rm", "Market return", 10.5, "%")],
    formulaPlain: "α = R_p − [R_f + β(R_m − R_f)]",
    variables: [{ symbol: "α", description: "CAPM risk-adjusted excess return" }],
    compute: (v) => {
      const capm = Number(v.rf) + Number(v.beta) * (Number(v.rm) - Number(v.rf));
      return done([outN("Jensen's Alpha (α)", Number(v.rp) - capm, 4, "%", true), outN("CAPM benchmark return", capm, 4, "%")]);
    },
  },
  {
    slug: "max-drawdown",
    fields: [txtF("prices", "Equity / price curve (> 0)", "100, 115, 108, 125, 95, 110, 130")],
    formulaPlain: "MDD = max_t ((Peak_t − Price_t) / Peak_t)",
    variables: [{ symbol: "Prices", description: "Chronological positive portfolio/asset values" }],
    compute: (v) => {
      const p = parseNumList(String(v.prices), 2);
      if (!p.ok) return p;
      if (p.value.some((x) => x <= 0)) return err("Asset prices must be strictly positive.");
      let peak = p.value[0], mdd = 0;
      for (const x of p.value) { if (x > peak) peak = x; mdd = Math.max(mdd, (peak - x) / peak); }
      return done([outN("Maximum Drawdown (MDD)", -mdd * 100, 3, "%", true)]);
    },
  },
  {
    slug: "portfolio-expected-return",
    fields: [txtF("weights", "Portfolio weights (%)", "60, 30, 10"), txtF("rets", "Expected asset returns (%)", "9.0, 4.5, 3.0")],
    formulaPlain: "E(R_p) = (∑ wᵢ · E(Rᵢ)) / ∑ wᵢ",
    variables: [{ symbol: "wᵢ, E(Rᵢ)", description: "Asset weights and expected returns" }],
    compute: (v) => {
      const w = parseNumList(String(v.weights), 1), r = parseNumList(String(v.rets), 1);
      if (!w.ok) return w; if (!r.ok) return r;
      if (w.value.length !== r.value.length) return err("Weights and returns must have equal length.");
      const wSum = w.value.reduce((a, b) => a + b, 0);
      if (wSum <= 0) return err("Sum of weights must be positive.");
      const er = w.value.reduce((s, wi, i) => s + wi * r.value[i], 0) / wSum;
      return done([outN("Expected portfolio return", er, 4, "%", true), outN("Weight sum", wSum, 2, "%")]);
    },
  },
  {
    slug: "portfolio-variance-2asset",
    fields: [nnF("w1", "Weight of Asset 1", 60, "%", { max: 100 }), posF("sd1", "Volatility σ₁", 16, "%"), posF("sd2", "Volatility σ₂", 6, "%"), numF("rho", "Correlation ρ₁₂ (−1 to 1)", 0.2, undefined, { min: -1, max: 1 })],
    formulaPlain: "σ_p = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂σ₁σ₂ρ)",
    variables: [{ symbol: "w₁, w₂, σ₁, σ₂, ρ", description: "Two-asset Markowitz portfolio risk" }],
    compute: (v) => {
      const w1 = Number(v.w1) / 100, w2 = 1 - w1, s1 = Number(v.sd1) / 100, s2 = Number(v.sd2) / 100, rho = Number(v.rho);
      const varP = w1 * w1 * s1 * s1 + w2 * w2 * s2 * s2 + 2 * w1 * w2 * s1 * s2 * rho;
      return done([outN("Portfolio volatility (σ_p)", Math.sqrt(Math.max(0, varP)) * 100, 4, "%", true), outN("Portfolio variance", varP, 6)]);
    },
  },
  {
    slug: "capm",
    fields: [numF("rf", "Risk-free rate (R_f)", 4.25, "%"), numF("beta", "Asset beta (β)", 1.2), numF("rm", "Expected market return E(R_m)", 10.0, "%")],
    formulaPlain: "E(R_i) = R_f + β · (E(R_m) − R_f)",
    variables: [{ symbol: "R_f, β, E(R_m)", description: "Capital Asset Pricing Model inputs" }],
    compute: (v) => {
      const erp = Number(v.rm) - Number(v.rf);
      return done([outN("CAPM required return", Number(v.rf) + Number(v.beta) * erp, 4, "%", true), outN("Equity risk premium", erp, 3, "%")]);
    },
  },
  {
    slug: "wacc",
    fields: [nnF("E", "Market value of equity (E)", 700, "$M"), nnF("D", "Market value of debt (D)", 300, "$M"), numF("Re", "Cost of equity (R_e)", 10.5, "%"), numF("Rd", "Pre-tax cost of debt (R_d)", 6.0, "%"), nnF("tax", "Marginal corporate tax rate (T)", 21, "%", { max: 100 })],
    formulaPlain: "WACC = (E/V)·R_e + (D/V)·R_d·(1 − T), V = E + D",
    variables: [{ symbol: "E, D, R_e, R_d, T", description: "Weighted Average Cost of Capital" }],
    compute: (v) => {
      const E = Number(v.E), D = Number(v.D), V = E + D;
      if (V <= 0) return err("Total firm value E + D must be strictly positive.");
      const wacc = (E / V) * Number(v.Re) + (D / V) * Number(v.Rd) * (1 - Number(v.tax) / 100);
      return done([outN("WACC", wacc, 4, "%", true), outN("Equity weight", (E / V) * 100, 2, "%")]);
    },
  },
  {
    slug: "dividend-yield",
    fields: [nnF("div", "Annual dividend per share", 3.2, "$"), posF("price", "Share price", 80, "$")],
    formulaPlain: "Dividend Yield% = (Annual Dividend / Share Price) × 100",
    variables: [{ symbol: "DPS, Price", description: "Annual dividend per share and market share price" }],
    compute: (v) => done([outN("Dividend yield", (Number(v.div) / Number(v.price)) * 100, 3, "%", true)]),
  },
  {
    slug: "gordon-growth",
    fields: [posF("d1", "Next year expected dividend D₁", 2.5, "$"), posF("r", "Required return on equity r", 9.0, "%"), numF("g", "Perpetual dividend growth g", 4.0, "%")],
    formulaPlain: "P₀ = D₁ / (r − g), valid for r > g",
    variables: [{ symbol: "D₁, r, g", description: "Gordon constant-growth DDM" }],
    compute: (v) => {
      const diff = (Number(v.r) - Number(v.g)) / 100;
      if (diff <= 0) return err("Required return r must exceed dividend growth rate g.");
      return done([outN("Intrinsic share value P₀", Number(v.d1) / diff, 2, "$", true)]);
    },
  },
  {
    slug: "pe-ratio",
    fields: [posF("price", "Share price", 150, "$"), posF("eps", "Earnings per share (EPS)", 7.5, "$")],
    formulaPlain: "P/E = Price / EPS; Earnings Yield = EPS / Price",
    variables: [{ symbol: "Price, EPS", description: "Market share price and positive EPS" }],
    compute: (v) => done([outN("P/E Ratio", Number(v.price) / Number(v.eps), 2, "×", true), outN("Earnings yield (E/P)", (Number(v.eps) / Number(v.price)) * 100, 2, "%")]),
  },
  {
    slug: "peg-ratio",
    fields: [posF("pe", "P/E Ratio", 22, "×"), posF("growth", "Expected annual EPS growth", 15, "%")],
    formulaPlain: "PEG = (P/E) / EPS Growth%",
    variables: [{ symbol: "P/E, Growth%", description: "Price-earnings multiple divided by percentage growth rate" }],
    compute: (v) => done([outN("PEG Ratio", Number(v.pe) / Number(v.growth), 3, undefined, true)]),
  },
  {
    slug: "eps",
    fields: [numF("netInc", "Net income", 12500000, "$"), nnF("prefDiv", "Preferred dividends", 500000, "$"), posF("shares", "Weighted avg shares", 4000000)],
    formulaPlain: "Basic EPS = (Net Income − Preferred Dividends) / Weighted Shares",
    variables: [{ symbol: "Net Income, Shares", description: "Earnings available to common shareholders per share" }],
    compute: (v) => done([outN("Earnings Per Share (EPS)", (Number(v.netInc) - Number(v.prefDiv)) / Number(v.shares), 4, "$/sh", true)]),
  },
  {
    slug: "roe",
    fields: [numF("netInc", "Net income", 2400000, "$"), posF("equity", "Shareholders' equity", 15000000, "$")],
    formulaPlain: "ROE% = (Net Income / Average Shareholders' Equity) × 100",
    variables: [{ symbol: "Net Income, Equity", description: "Bottom-line profit over equity book value" }],
    compute: (v) => done([outN("Return on Equity (ROE)", (Number(v.netInc) / Number(v.equity)) * 100, 3, "%", true)]),
  },
  {
    slug: "bond-price",
    fields: [posF("face", "Par / face value (F)", 1000, "$"), nnF("coupon", "Annual coupon rate", 5, "%"), nnF("ytm", "Yield to maturity (y)", 6, "%"), intF("years", "Years to maturity", 10, { min: 1 }), intF("freq", "Coupons / year", 2, { min: 1, max: 12 })],
    formulaPlain: "P = ∑_{t=1}^{n} C/(1 + y/f)^t + F/(1 + y/f)^n",
    variables: [{ symbol: "F, C, y, n", description: "Clean bond price at coupon reset" }],
    compute: (v) => {
      const F = Number(v.face), f = Number(v.freq), n = Number(v.years) * f;
      const c = (F * (Number(v.coupon) / 100)) / f, yi = Number(v.ytm) / 100 / f;
      const pvCoupons = yi === 0 ? c * n : c * ((1 - Math.pow(1 + yi, -n)) / yi);
      const pvPar = F * Math.pow(1 + yi, -n);
      return done([outN("Bond clean price", pvCoupons + pvPar, 2, "$", true), outN("PV of coupons", pvCoupons, 2, "$"), outN("PV of principal", pvPar, 2, "$")]);
    },
  },
  {
    slug: "ytm",
    fields: [posF("price", "Market bond price", 928.94, "$"), posF("face", "Face value", 1000, "$"), nnF("coupon", "Annual coupon rate", 5, "%"), intF("years", "Years to maturity", 10, { min: 1 }), intF("freq", "Coupons / year", 2, { min: 1, max: 12 })],
    formulaPlain: "Solves Price = ∑ C/(1 + y/f)^t + F/(1 + y/f)^n via IRR solver",
    variables: [{ symbol: "YTM", description: "Bond-equivalent annualised yield to maturity" }],
    compute: (v) => {
      const P = Number(v.price), F = Number(v.face), f = Number(v.freq), n = Number(v.years) * f;
      const c = (F * (Number(v.coupon) / 100)) / f;
      const cfs = [-P, ...Array<number>(n - 1).fill(c), c + F];
      const solved = solveIrr(cfs);
      if (!solved) return err("Could not solve YTM for these parameters.");
      return done([outN("Yield to Maturity (annualised)", solved.rate * f * 100, 4, "%", true), outN("Effective annual yield", (Math.pow(1 + solved.rate, f) - 1) * 100, 4, "%")]);
    },
  },
  {
    slug: "current-yield",
    fields: [nnF("couponAmt", "Annual coupon payment", 50, "$"), posF("price", "Clean market price", 960, "$")],
    formulaPlain: "Current Yield% = (Annual Coupon / Clean Price) × 100",
    variables: [{ symbol: "Coupon, Price", description: "Annual coupon dollars divided by market price" }],
    compute: (v) => done([outN("Current yield", (Number(v.couponAmt) / Number(v.price)) * 100, 3, "%", true)]),
  },
  {
    slug: "macaulay-duration",
    fields: [posF("face", "Face value", 1000, "$"), nnF("coupon", "Annual coupon rate", 5, "%"), posF("ytm", "Annual yield", 6, "%"), intF("years", "Years to maturity", 5, { min: 1 })],
    formulaPlain: "D_Mac = [∑ t · PV(CF_t)] / Price",
    variables: [{ symbol: "D_Mac", description: "Present-value-weighted average time to cash flows (years)" }],
    compute: (v) => {
      const F = Number(v.face), c = F * (Number(v.coupon) / 100), y = Number(v.ytm) / 100, n = Number(v.years);
      let price = 0, wSum = 0;
      for (let t = 1; t <= n; t++) {
        const cf = t === n ? c + F : c;
        const pv = cf / Math.pow(1 + y, t);
        price += pv; wSum += t * pv;
      }
      return done([outN("Macaulay duration", wSum / price, 4, "years", true), outN("Bond price", price, 2, "$")]);
    },
  },
  {
    slug: "modified-duration",
    fields: [posF("mac", "Macaulay duration", 4.4651, "years"), nnF("ytm", "Yield to maturity", 6, "%"), intF("freq", "Coupons per year (f)", 1, { min: 1, max: 12 })],
    formulaPlain: "D_Mod = D_Mac / (1 + y / f)",
    variables: [{ symbol: "D_Mod", description: "Approximate % bond price sensitivity per 100 bps yield shift" }],
    compute: (v) => {
      const mod = Number(v.mac) / (1 + Number(v.ytm) / 100 / Number(v.freq));
      return done([outN("Modified duration", mod, 4, "years", true), outN("Price change for +100 bps", -mod, 2, "%")]);
    },
  },
  {
    slug: "dollar-cost-averaging",
    fields: [posF("contrib", "Fixed contribution per period", 500, "$"), txtF("prices", "Share prices across periods (> 0)", "50, 42, 48, 55, 60")],
    formulaPlain: "Shares = ∑ (Contribution / P_t); Average Cost = Total Invested / Total Shares (harmonic mean of prices)",
    variables: [{ symbol: "Contribution, P_t", description: "Periodic dollar investment and share prices" }],
    compute: (v) => {
      const p = parseNumList(String(v.prices), 1);
      if (!p.ok) return p;
      if (p.value.some((x) => x <= 0)) return err("Share prices must be strictly positive.");
      const c = Number(v.contrib), shares = p.value.reduce((s, px) => s + c / px, 0);
      const tot = c * p.value.length, lastPx = p.value[p.value.length - 1];
      return done([outN("Average cost per share", tot / shares, 2, "$", true), outN("Total shares accumulated", shares, 4), outN("Ending value", shares * lastPx, 2, "$")]);
    },
  },
  {
    slug: "rebalancing-trade",
    fields: [txtF("vals", "Current holdings ($)", "68000, 22000, 10000"), txtF("targets", "Target weights (%)", "60, 30, 10")],
    formulaPlain: "Trade_i = Total · (Target_i / 100) − Current_i",
    variables: [{ symbol: "Trade_i", description: "Buy (+) or Sell (−) dollars to restore target allocation" }],
    compute: (v) => {
      const cur = parseNumList(String(v.vals), 2), tgt = parseNumList(String(v.targets), 2);
      if (!cur.ok) return cur; if (!tgt.ok) return tgt;
      if (cur.value.length !== tgt.value.length) return err("Holdings and target weights must have matching length.");
      const totW = tgt.value.reduce((a, b) => a + b, 0);
      if (Math.abs(totW - 100) > 0.01) return err("Target allocation percentages must sum to 100%.");
      const total = cur.value.reduce((a, b) => a + b, 0);
      const trades = cur.value.map((x, i) => ((total * tgt.value[i]) / 100 - x).toFixed(2));
      return done([outS("Buy (+) / Sell (−) trades ($)", trades.join(" | "), undefined, true), outN("Total portfolio", total, 2, "$")]);
    },
  },

  // ── C14 Retirement and Pension Planning (12) ───────────────────────────────
  {
    slug: "retirement-savings-goal",
    fields: [posF("income", "Annual retirement spending need", 60000, "$"), posF("swr", "Withdrawal rate assumption", 4.0, "%"), intF("years", "Years until retirement", 25, { min: 1 }), nnF("ret", "Expected annual return", 7.0, "%")],
    formulaPlain: "Target Corpus = Annual Need / SWR; Monthly Savings solved via ordinary annuity FV",
    variables: [{ symbol: "Corpus, SWR", description: "Target retirement nest egg and assumed withdrawal rate" }],
    compute: (v) => {
      const corpus = Number(v.income) / (Number(v.swr) / 100);
      const n = Number(v.years) * 12, i = Number(v.ret) / 100 / 12;
      const monthly = i === 0 ? corpus / n : corpus / ((Math.pow(1 + i, n) - 1) / i);
      return done([outN("Target retirement corpus", corpus, 0, "$", true), outN("Required monthly contribution", monthly, 2, "$")]);
    },
  },
  {
    slug: "retirement-corpus-projection",
    fields: [nnF("pv", "Current savings", 50000, "$"), nnF("monthly", "Monthly contribution", 1000, "$"), nnF("ret", "Annual return", 7.0, "%"), intF("years", "Years to grow", 25, { min: 1 })],
    formulaPlain: "FV = PV(1 + i)^n + PMT[((1 + i)^n − 1) / i]",
    variables: [{ symbol: "PV, PMT, i, n", description: "Starting balance, monthly contribution, monthly rate, months" }],
    compute: (v) => {
      const pv = Number(v.pv), c = Number(v.monthly), i = Number(v.ret) / 100 / 12, n = Number(v.years) * 12;
      const fv = pv * Math.pow(1 + i, n) + (i === 0 ? c * n : c * ((Math.pow(1 + i, n) - 1) / i));
      return done([outN("Projected retirement balance", fv, 0, "$", true), outN("Total principal contributed", pv + c * n, 0, "$")]);
    },
  },
  {
    slug: "safe-withdrawal-4pct",
    fields: [posF("corpus", "Starting portfolio", 1000000, "$"), posF("rate", "Initial withdrawal rate", 4.0, "%"), numF("realRet", "Assumed real portfolio return", 3.5, "%"), intF("years", "Retirement horizon", 30, { min: 1 })],
    formulaPlain: "Real-dollar drawdown simulation (historical planning heuristic, not a guarantee)",
    variables: [{ symbol: "Corpus, Rate, Real Return", description: "Constant real spending vs deterministic real return" }],
    compute: (v) => {
      let bal = Number(v.corpus);
      const w = bal * (Number(v.rate) / 100), r = Number(v.realRet) / 100;
      let yrsLasted = 0;
      for (let y = 1; y <= Number(v.years); y++) {
        bal = bal * (1 + r) - w;
        if (bal >= 0) yrsLasted = y; else { bal = 0; break; }
      }
      return done([outN("Initial annual real withdrawal", w, 2, "$", true), outN("Ending real balance at horizon", Math.max(0, bal), 0, "$"), outN("Full years sustained", yrsLasted, 0, "years")]);
    },
  },
  {
    slug: "pension-lumpsum-vs-annuity",
    fields: [posF("lump", "Lump-sum offer", 400000, "$"), posF("monthly", "Monthly life pension offer", 2400, "$"), nnF("disc", "Assumed discount return", 5.5, "%"), intF("years", "Expected payout years", 25, { min: 1 })],
    formulaPlain: "Compares lump-sum offer with PV of monthly annuity stream over assumed horizon",
    variables: [{ symbol: "PV_annuity", description: "Present value of monthly pension payments" }],
    compute: (v) => {
      const i = Number(v.disc) / 100 / 12, n = Number(v.years) * 12, m = Number(v.monthly);
      const pvAnn = i === 0 ? m * n : m * ((1 - Math.pow(1 + i, -n)) / i);
      return done([outN("Present value of pension stream", pvAnn, 0, "$", true), outN("Difference (Annuity PV − Lump Sum)", pvAnn - Number(v.lump), 0, "$")]);
    },
  },
  {
    slug: "annuity-payout",
    fields: [posF("premium", "Single premium corpus", 300000, "$"), nnF("rate", "Annual payout rate", 5.2, "%"), intF("years", "Payout period", 20, { min: 1 })],
    formulaPlain: "Monthly income = pmt(Premium, r/12, 12·years)",
    variables: [{ symbol: "Premium, r, years", description: "Fixed-period immediate annuity income" }],
    compute: (v) => {
      const m = pmt(Number(v.premium), Number(v.rate) / 100 / 12, Number(v.years) * 12);
      return done([outN("Monthly payout income", m, 2, "$", true), outN("Annual payout income", m * 12, 2, "$")]);
    },
  },
  {
    slug: "ss-pia",
    fields: [nnF("aime", "Average Indexed Monthly Earnings (AIME)", 5500, "$")],
    formulaPlain: "2027 SSA formula: 90% of first $1,340 + 32% of ($1,340 to $8,077) + 15% above $8,077, rounded DOWN to $0.10",
    variables: [{ symbol: "AIME", description: "Average Indexed Monthly Earnings for 2027 first eligibility (R-004 ssa.gov)" }],
    assumptions: ["Uses official 2027 SSA bend points ($1,340 and $8,077) for workers first reaching age 62 in 2027.", "Result truncated down to next lower multiple of $0.10 per SSA statute."],
    compute: (v) => {
      const a = Math.floor(Number(v.aime));
      const t1 = 0.9 * Math.min(a, 1340);
      const t2 = 0.32 * Math.max(0, Math.min(a, 8077) - 1340);
      const t3 = 0.15 * Math.max(0, a - 8077);
      const pia = Math.floor((t1 + t2 + t3 + 1e-9) * 10) / 10;
      return done([outN("Primary Insurance Amount (PIA, 2027)", pia, 2, "$/mo", true), outN("Replacement share of AIME", a > 0 ? (pia / a) * 100 : 0, 2, "%")]);
    },
  },
  {
    slug: "ss-claim-age",
    fields: [posF("pia", "Monthly PIA at Full Retirement Age 67", 2400, "$"), intF("claimAge", "Claiming age (62–70)", 67, { min: 62, max: 70 })],
    formulaPlain: "FRA = 67 (born ≥ 1960): −5/9% per month for first 36 early months, −5/12% beyond 36; +8%/yr delayed to 70",
    variables: [{ symbol: "PIA, Claim Age", description: "Standard SSA NRA=67 adjustment schedule" }],
    compute: (v) => {
      const pia = Number(v.pia), diffMonths = (Number(v.claimAge) - 67) * 12;
      let factor = 1;
      if (diffMonths < 0) {
        const early = -diffMonths;
        factor = 1 - Math.min(early, 36) * (5 / 900) - Math.max(0, early - 36) * (5 / 1200);
      } else if (diffMonths > 0) {
        factor = 1 + diffMonths * (8 / 1200);
      }
      return done([outN("Adjusted monthly benefit", Math.floor(pia * factor * 10) / 10, 2, "$/mo", true), outN("Adjustment factor", factor * 100, 2, "%")]);
    },
  },
  {
    slug: "employer-match",
    fields: [posF("salary", "Annual salary", 95000, "$"), nnF("empPct", "Employee contribution %", 6, "%", { max: 100 }), nnF("matchRate", "Employer match % per dollar", 50, "%"), nnF("capPct", "Salary % cap eligible for match", 6, "%", { max: 100 })],
    formulaPlain: "Match = Salary × min(Employee%, Cap%) × MatchRate%",
    variables: [{ symbol: "Salary, MatchRate, Cap%", description: "401(k)/workplace pension match formula" }],
    compute: (v) => {
      const sal = Number(v.salary), emp = sal * (Number(v.empPct) / 100);
      const matched = sal * (Math.min(Number(v.empPct), Number(v.capPct)) / 100) * (Number(v.matchRate) / 100);
      const maxMatch = sal * (Number(v.capPct) / 100) * (Number(v.matchRate) / 100);
      return done([outN("Annual employer match", matched, 2, "$", true), outN("Combined annual contribution", emp + matched, 2, "$"), outN("Unclaimed match left on table", Math.max(0, maxMatch - matched), 2, "$")]);
    },
  },
  {
    slug: "retirement-age-solver",
    fields: [intF("curAge", "Current age", 32, { min: 18, max: 85 }), nnF("pv", "Current nest egg", 45000, "$"), posF("monthly", "Monthly savings", 1200, "$"), posF("target", "Target corpus", 1200000, "$"), posF("ret", "Assumed real annual return", 6.5, "%")],
    formulaPlain: "Solves PV(1+i)^n + PMT[((1+i)^n − 1)/i] ≥ Target for earliest month n",
    variables: [{ symbol: "Age, Target", description: "Earliest retirement age reaching target nest egg" }],
    compute: (v) => {
      let bal = Number(v.pv);
      const c = Number(v.monthly), i = Number(v.ret) / 100 / 12, tgt = Number(v.target);
      let m = 0;
      while (bal < tgt && m < 840) { m++; bal = bal * (1 + i) + c; }
      if (bal < tgt) return err("Target corpus is not reached within 70 years under these parameters.");
      return done([outN("Estimated retirement age", Number(v.curAge) + m / 12, 1, "years", true), outN("Years until target", m / 12, 2, "years")]);
    },
  },
  {
    slug: "inflation-adjusted-income",
    fields: [posF("today", "Desired annual income in today's dollars", 65000, "$"), nnF("cpi", "Assumed annual inflation", 3.0, "%"), nnF("years", "Years until retirement", 22)],
    formulaPlain: "Future Nominal Income = Today Income × (1 + CPI)^years",
    variables: [{ symbol: "Today, CPI, years", description: "Inflation-indexed retirement income target" }],
    compute: (v) => done([outN("Equivalent future annual income", Number(v.today) * Math.pow(1 + Number(v.cpi) / 100, Number(v.years)), 2, "$/yr", true)]),
  },
  {
    slug: "rmd",
    fields: [posF("balance", "Prior Dec 31 retirement account balance", 500000, "$"), posF("factor", "IRS Uniform Lifetime Table factor", 24.6)],
    formulaPlain: "RMD = Account Balance / Life Expectancy Distribution Period Factor",
    variables: [{ symbol: "Balance, Factor", description: "Account balance and applicable IRS table factor (e.g. 24.6 at age 75)" }],
    compute: (v) => done([outN("Required Minimum Distribution (RMD)", Number(v.balance) / Number(v.factor), 2, "$", true)]),
  },
  {
    slug: "retirement-income-gap",
    fields: [posF("need", "Target monthly retirement budget", 5500, "$"), nnF("pension", "Monthly pension + Social Security", 2600, "$"), nnF("other", "Other monthly income", 500, "$")],
    formulaPlain: "Monthly Shortfall = max(0, Target Need − Assured Income)",
    variables: [{ symbol: "Need, Sources", description: "Monthly spending need minus guaranteed income streams" }],
    compute: (v) => {
      const gap = Number(v.need) - Number(v.pension) - Number(v.other);
      return done([outN("Monthly portfolio income needed", Math.max(0, gap), 2, "$/mo", true), outN("Annualised gap", Math.max(0, gap) * 12, 2, "$/yr")]);
    },
  },
];
