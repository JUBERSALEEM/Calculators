import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { it, mk, mkx, n, p, s, t, z } from "@/lib/engine/dsl";
import {
  combNum,
  normalCdf,
  normalInv,
  numberToWordsEn,
  parseNumList,
  toRoman,
  pmt,
} from "@/lib/engine/helpers";

const D2R = Math.PI / 180;

export const M09_SPECS: CalculatorSpec[] = [
  // ── C72 Research Methodology (12) ──────────────────────────────────────────
  mk("power-analysis", [p("Effect size", 0.5), p("Significance level", 5, "%", { max: 50 }), p("Power", 80, "%", { max: 99.9 }), p("Standard deviation", 1)],
    "n per group ≈ 2(z₁₋α/₂ + z₁₋β)² σ² / Δ²", "Two-sample t-test power analysis",
    (v) => {
      const zα = normalInv(1 - v["significance-level"] / 200);
      const zβ = normalInv(v.power / 100);
      const n = Math.ceil((2 * Math.pow(zα + zβ, 2) * v["standard-deviation"] ** 2) / (v["effect-size"] ** 2));
      return [["Sample size per group", n, 0, "subjects", true], ["Total sample", n * 2, 0, "subjects"],
        ["zα/2", zα, 3], ["zβ", zβ, 3]];
    },
    { limitations: ["Post-hoc power computed from an observed effect is uninformative; use this only for prospective design."] }),

  mk("effect-size-cohen", [p("Mean 1", 12), p("Mean 2", 10), p("Pooled SD", 2.5)],
    "d = (m₁ − m₂) / s_pooled; Hedges' g applies a small-sample correction", "Cohen's d",
    (v) => {
      const d = (v["mean-1"] - v["mean-2"]) / v["pooled-sd"];
      return [["Cohen's d", d, 3, undefined, true],
        ["Magnitude (conventional)", Math.abs(d) < 0.2 ? "Negligible" : Math.abs(d) < 0.5 ? "Small" : Math.abs(d) < 0.8 ? "Medium" : "Large"]];
    },
    { limitations: ["0.2/0.5/0.8 are conventions, not thresholds of practical importance."] }),

  mkx("cronbach-alpha", [t("Item variances", "1.2, 0.9, 1.4, 1.1, 0.8"), p("Total score variance", 14.5)],
    "α = (k/(k−1))(1 − Σσᵢ²/σ²_total)", "Cronbach's alpha",
    (v) => {
      const vars = parseNumList(String(v["item-variances"]), 2);
      if (!vars.ok) return vars;
      const k = vars.value.length;
      const sum = vars.value.reduce((a, b) => a + b, 0);
      const alpha = (k / (k - 1)) * (1 - sum / Number(v["total-score-variance"]));
      return [["Cronbach's alpha", alpha, 3, undefined, true], ["Number of items", k, 0],
        ["Sum of item variances", sum, 3]];
    },
    { limitations: ["α is not a measure of unidimensionality; high α can coexist with multidimensionality."] }),

  mk("cohens-kappa", [it("Both positive", 40, { min: 0 }), it("A only", 10, { min: 0 }), it("B only", 8, { min: 0 }), it("Both negative", 42, { min: 0 })],
    "κ = (p_o − p_e)/(1 − p_e)", "Cohen's kappa (2×2 agreement)",
    (v) => {
      const a = v["both-positive"], b = v["a-only"], c = v["b-only"], d = v["both-negative"];
      const n0 = a + b + c + d;
      const po = (a + d) / n0;
      const pe = (((a + b) * (a + c)) + ((c + d) * (b + d))) / (n0 * n0);
      if (pe >= 1) return err("Perfect chance agreement makes kappa undefined.");
      const kappa = (po - pe) / (1 - pe);
      return [["Cohen's kappa", kappa, 3, undefined, true], ["Observed agreement", po * 100, 2, "%"],
        ["Chance agreement", pe * 100, 2, "%"]];
    },
    { limitations: ["Interpret with prevalence caution: high agreement can yield low kappa when one category dominates."] }),

  mk("response-rate", [p("Responses", 420), p("Invited", 2000)],
    "Response rate = responses / invited × 100", "Survey response rate",
    (v) => [["Response rate", (v.responses / v.invited) * 100, 2, "%", true],
      ["Non-response", v.invited - v.responses, 0, "invitations"]]),

  mk("dropout-adjustment", [p("Target evaluable n", 200), p("Expected attrition", 18, "%", { max: 90 })],
    "Recruit n = target / (1 − attrition)", "Attrition-adjusted recruitment",
    (v) => [["Recruit", Math.ceil(v["target-evaluable-n"] / (1 - v["expected-attrition"] / 100)), 0, "participants", true],
      ["Expected dropouts", Math.ceil(v["target-evaluable-n"] / (1 - v["expected-attrition"] / 100)) - v["target-evaluable-n"], 0]]),

  mkx("randomisation-list", [it("Participants", 40, { min: 2, max: 500 }), it("Block size", 4, { min: 2, max: 20 }), it("Seed", 12345)],
    "Deterministic seeded block randomisation with balanced blocks", "Participant count, block size and seed",
    (v) => {
      const n0 = Number(v.participants), block = Number(v["block-size"]);
      if (block % 2 !== 0) return err("Block size must be even for 1:1 allocation.");
      let seed = Number(v.seed) % 2147483647;
      const rand = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
      const seq: string[] = [];
      while (seq.length < n0) {
        const half = block / 2;
        const blk = [...Array(half).fill("A"), ...Array(half).fill("B")];
        for (let i = blk.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [blk[i], blk[j]] = [blk[j], blk[i]];
        }
        seq.push(...blk);
      }
      const alloc = seq.slice(0, n0);
      return [["Allocation sequence", alloc.join(" "), undefined, true],
        ["Group A", alloc.filter((x) => x === "A").length, 0, "participants"],
        ["Group B", alloc.filter((x) => x === "B").length, 0, "participants"]];
    },
    { limitations: ["Reproducible deterministic sequence for planning only; a trial must use an audited randomisation service and allocation concealment."] }),

  mk("survey-length", [p("Questions", 30), p("Seconds per question", 18, "s/question"), p("Target completion rate", 80, "%", { max: 100 })],
    "Completion time = questions × seconds; expected completions given drop-off", "Survey length and completion",
    (v) => {
      const minutes = (v.questions * v["seconds-per-question"]) / 60;
      return [["Estimated completion time", minutes, 1, "min", true],
        ["Respondents finishing", Math.round(v["target-completion-rate"]), 0, "%"],
        ["Median-time rule", minutes > 15 ? "Long — consider shortening" : "Within a typical attention window"]];
    }),

  mkx("likert-scoring", [t("Responses", "4, 5, 3, 4, 2, 5, 4"), z("Reverse-coded items", 0)],
    "Mean of item scores; reverse-coding transforms x → 6 − x on a 5-point scale", "Likert response list",
    (v) => {
      const r = parseNumList(String(v.responses), 1);
      if (!r.ok) return r;
      if (r.value.some((x) => x < 1 || x > 5)) return err("Likert responses must be between 1 and 5.");
      const rev = Math.min(v["reverse-coded-items"], r.value.length);
      const coded = r.value.map((x, i) => (i < rev ? 6 - x : x));
      const mean = coded.reduce((a, b) => a + b, 0) / coded.length;
      return [["Mean score", mean, 3, undefined, true], ["Sum score", coded.reduce((a, b) => a + b, 0), 1],
        ["Coded responses", coded.join(", ")]];
    },
    { limitations: ["Treats Likert items as interval data, which is a common but debatable assumption. Report the coding scheme used."] }),

  mkx("meta-analysis-weight", [t("Effect sizes", "0.42, 0.18, 0.65, 0.31"), t("Variances", "0.04, 0.09, 0.03, 0.05")],
    "Fixed-effect weight = 1 / variance", "Inverse-variance weighting",
    (v) => {
      const es = parseNumList(String(v["effect-sizes"]), 1);
      const va = parseNumList(String(v.variances), 1);
      if (!es.ok) return es;
      if (!va.ok) return va;
      if (es.value.length !== va.value.length) return err("Effect sizes and variances must have equal length.");
      if (va.value.some((x) => x <= 0)) return err("Variances must be positive.");
      const w = va.value.map((x) => 1 / x);
      const wSum = w.reduce((a, b) => a + b, 0);
      const pooled = es.value.reduce((a, e, i) => a + e * w[i], 0) / wSum;
      return [["Pooled effect size", pooled, 4, undefined, true], ["Pooled SE", Math.sqrt(1 / wSum), 4],
        ["Weights", w.map((x) => (x / wSum).toFixed(3)).join(", ")]];
    },
    { assumptions: ["Fixed-effect inverse-variance model; heterogeneity (I², τ²) requires a random-effects model."] }),

  mk("risk-ratio", [it("Exposed events", 40, { min: 0 }), it("Exposed total", 500, { min: 1 }), it("Unexposed events", 20, { min: 0 }), it("Unexposed total", 500, { min: 1 })],
    "RR = (a/(a+b)) / (c/(c+d)); CI via log RR", "Risk ratio with 95% CI",
    (v) => {
      const a = v["exposed-events"], b = v["exposed-total"] - a, c = v["unexposed-events"], d = v["unexposed-total"] - c;
      if (b < 0 || d < 0) return err("Events cannot exceed the group totals.");
      if (a === 0 || c === 0) return err("A zero cell makes the log CI undefined (add 0.5 correction or use exact methods).");
      const rr = (a / (a + b)) / (c / (c + d));
      const se = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
      return [["Risk ratio", rr, 3, undefined, true], ["95% CI", `[${(rr * Math.exp(-1.96 * se)).toFixed(3)}, ${(rr * Math.exp(1.96 * se)).toFixed(3)}]`]];
    }),

  mk("odds-ratio", [it("Cases exposed", 60, { min: 0 }), it("Cases unexposed", 40, { min: 0 }), it("Controls exposed", 30, { min: 0 }), it("Controls unexposed", 70, { min: 0 })],
    "OR = (a·d)/(b·c); CI via log OR", "Odds ratio with 95% CI",
    (v) => {
      const a = v["cases-exposed"], b = v["cases-unexposed"], c = v["controls-exposed"], d = v["controls-unexposed"];
      if (Math.min(a, b, c, d) === 0) return err("A zero cell makes the log CI undefined (add 0.5 correction or use exact methods).");
      const or = (a * d) / (b * c);
      const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
      return [["Odds ratio", or, 3, undefined, true], ["95% CI", `[${(or * Math.exp(-1.96 * se)).toFixed(3)}, ${(or * Math.exp(1.96 * se)).toFixed(3)}]`]];
    },
    { limitations: ["Odds ratios diverge from risk ratios when the outcome is common (>10%)."] }),

  // ── C73 Quality Control and Reliability (18) ───────────────────────────────
  mk("cp-cpk", [p("Upper spec limit", 105), p("Lower spec limit", 95), p("Process mean", 99.2), p("Process sigma", 1.4)],
    "Cp = (USL − LSL)/(6σ); Cpk = min(USL − μ, μ − LSL)/(3σ)", "Process capability",
    (v) => {
      if (v["upper-spec-limit"] <= v["lower-spec-limit"]) return err("USL must exceed LSL.");
      const cp = (v["upper-spec-limit"] - v["lower-spec-limit"]) / (6 * v["process-sigma"]);
      const cpk = Math.min(v["upper-spec-limit"] - v["process-mean"], v["process-mean"] - v["lower-spec-limit"]) / (3 * v["process-sigma"]);
      return [["Cp", cp, 3, undefined, true], ["Cpk", cpk, 3], ["Centring", cp > 0 ? (cpk / cp) * 100 : 0, 1, "%"],
        ["PPM outside specs", (1 - (normalCdf((v["upper-spec-limit"] - v["process-mean"]) / v["process-sigma"]) - normalCdf((v["lower-spec-limit"] - v["process-mean"]) / v["process-sigma"]))) * 1e6, 0, "ppm"]];
    },
    { assumptions: ["Cp assumes a stable, normally distributed process. Cpk measures centring; both use within-subgroup σ."] }),

  mk("pp-ppk", [p("Upper spec limit", 105), p("Lower spec limit", 95), p("Process mean", 99.2), p("Overall sigma", 1.8)],
    "Pp = (USL − LSL)/(6σ_overall); Ppk = min(USL − μ, μ − LSL)/(3σ_overall)", "Process performance (overall σ)",
    (v) => {
      const pp = (v["upper-spec-limit"] - v["lower-spec-limit"]) / (6 * v["overall-sigma"]);
      const ppk = Math.min(v["upper-spec-limit"] - v["process-mean"], v["process-mean"] - v["lower-spec-limit"]) / (3 * v["overall-sigma"]);
      return [["Pp", pp, 3, undefined, true], ["Ppk", ppk, 3]];
    },
    { limitations: ["Uses overall σ, unlike Cp/Cpk which use within-subgroup σ — mixing the two is invalid."] }),

  mk("xbar-r-chart", [p("Grand mean", 50.2), p("Mean range", 3.6), p("Constant A2", 0.577), z("Constant D3", 0), p("Constant D4", 2.114)],
    "X̄ limits = X̄̄ ± A₂R̄; R limits = D₃R̄, D₄R̄", "X̄–R control chart limits",
    (v) => {
      const cl = 0.5 * 3.6;
      return [["X̄ UCL", v["grand-mean"] + v["constant-a2"] * v["mean-range"], 3, undefined, true],
        ["X̄ LCL", v["grand-mean"] - v["constant-a2"] * v["mean-range"], 3],
        ["R UCL", v["constant-d4"] * v["mean-range"], 3],
        ["R LCL", v["constant-d3"] * v["mean-range"], 3],
        ["R centre line", cl, 3]];
    },
    { limitations: ["A₂, D₃ and D₄ depend on subgroup size and come from published constant tables; enter the values for your subgroup size from your SPC reference."] }),

  mk("p-chart", [p("Total defectives", 84), p("Total inspected", 4000), it("Subgroups", 20, { min: 1 }), p("Subgroup size", 200)],
    "p̄ = defectives / inspected; UCL = p̄ ± 3√(p̄(1−p̄)/n)", "p-chart for proportion defective",
    (v) => {
      const pbar = v["total-defectives"] / v["total-inspected"];
      const sigma = Math.sqrt((pbar * (1 - pbar)) / v["subgroup-size"]);
      return [["Centre line p̄", pbar, 5, undefined, true], ["UCL", pbar + 3 * sigma, 5], ["LCL", Math.max(0, pbar - 3 * sigma), 5]];
    }),

  mk("c-chart", [p("Total defects", 96), it("Units", 24, { min: 1 })],
    "c̄ = defects / units; limits = c̄ ± 3√c̄", "c-chart for defect counts",
    (v) => {
      const c = v["total-defects"] / v.units;
      return [["Centre line c̄", c, 3, undefined, true], ["UCL", c + 3 * Math.sqrt(c), 3], ["LCL", Math.max(0, c - 3 * Math.sqrt(c)), 3]];
    }),

  mk("mtbf", [p("Failures", 4), p("Total operating time", 12000, "h")],
    "MTBF = operating time / failures", "Mean time between failures",
    (v) => [["MTBF", v["total-operating-time"] / v.failures, 1, "h", true],
      ["Failure rate λ", v.failures / v["total-operating-time"], 6, "per hour"]]),

  mk("mttr", [p("Total repair time", 36, "h"), p("Repair events", 4)],
    "MTTR = repair time / events", "Mean time to repair",
    (v) => [["MTTR", v["total-repair-time"] / v["repair-events"], 2, "h", true]]),

  mk("availability-reliability", [p("MTBF", 3000, "h"), p("MTTR", 36, "h")],
    "A = MTBF / (MTBF + MTTR)", "Operational availability",
    (v) => [["Availability", (v.mtbf / (v.mtbf + v.mttr)) * 100, 3, "%", true],
      ["Downtime per year", (v.mttr / (v.mtbf + v.mttr)) * 8760, 1, "h/yr"]]),

  mk("reliability-function", [p("Characteristic life", 10000, "h"), p("Shape factor", 1.6), p("Time", 2000, "h")],
    "Weibull: R(t) = exp(−(t/η)^β); exponential is the β = 1 case", "Reliability at time t",
    (v) => {
      const r = Math.exp(-Math.pow(v.time / v["characteristic-life"], v["shape-factor"]));
      return [["Reliability R(t)", r * 100, 3, "%", true], ["Failure probability F(t)", (1 - r) * 100, 3, "%"],
        ["Hazard rate h(t)", (v["shape-factor"] / v["characteristic-life"]) * Math.pow(v.time / v["characteristic-life"], v["shape-factor"] - 1), 8, "per hour"]];
    }),

  mk("fmea-rpn", [it("Severity", 7, { min: 1, max: 10 }), it("Occurrence", 4, { min: 1, max: 10 }), it("Detection", 5, { min: 1, max: 10 })],
    "RPN = S × O × D", "FMEA risk priority number",
    (v) => [["Risk Priority Number", v.severity * v.occurrence * v.detection, 0, undefined, true],
      ["Band", v.severity * v.occurrence * v.detection >= 200 ? "High" : v.severity * v.occurrence * v.detection >= 100 ? "Medium" : "Low"]],
    { limitations: ["RPN is ordinal; treating it as a prioritisation scalar is criticised. AIAG-VDA action priority tables are preferred and licensed."] }),

  mk("sigma-level", [p("DPMO", 3200, "defects per million")],
    "Z = Φ⁻¹(1 − DPMO/10⁶); sigma level = Z + 1.5 (conventional shift)", "Sigma level including 1.5σ shift",
    (v) => {
      if (v.dpmo <= 0) return err("DPMO must be greater than zero.");
      if (v.dpmo >= 1e6) return err("DPMO must be below 1,000,000.");
      const z = normalInv(1 - v.dpmo / 1e6);
      return [["Z (no shift)", z, 3, undefined, true], ["Sigma level (1.5σ shift)", z + 1.5, 2],
        ["Yield", (1 - v.dpmo / 1e6) * 100, 4, "%"]];
    }),

  mk("dpmo", [p("Defects", 145), p("Units", 2000), p("Opportunities per unit", 25)],
    "DPMO = defects / (units × opportunities) × 10⁶", "Defects per million opportunities",
    (v) => {
      const dpmo = (v.defects / (v.units * v["opportunities-per-unit"])) * 1e6;
      return [["DPMO", dpmo, 0, undefined, true], ["Equivalent sigma (with 1.5 shift)", normalInv(1 - Math.min(dpmo, 999999) / 1e6) + 1.5, 2]];
    }),

  mk("sampling-plan", [it("Sample size", 50, { min: 1, max: 5000 }), it("Acceptance number", 2, { min: 0, max: 100 }), p("Incoming defect rate", 2, "%")],
    "Probability of acceptance = P(X ≤ c) for X ~ Binomial(n, p)", "Operating characteristic of a sampling plan",
    (v) => {
      const n0 = v["sample-size"], c = v["acceptance-number"], d = v["incoming-defect-rate"] / 100;
      const pmf = (k: number) => combNum(n0, k) * Math.pow(d, k) * Math.pow(1 - d, n0 - k);
      let pa = 0;
      for (let k = 0; k <= c; k++) pa += pmf(k);
      return [["Probability of acceptance", pa * 100, 2, "%", true], ["Probability of rejection", (1 - pa) * 100, 2, "%"],
        ["Average outgoing quality", d * (1 - pa) * 100, 4, "% defective"]];
    },
    { limitations: ["Sample sizes and acceptance numbers from ISO 2859-1 are licensed tables and are not embedded. Supply your own n and c; this computes the operating characteristic."] }),

  mk("gage-rr", [p("Repeatability SD", 0.035), p("Reproducibility SD", 0.028), p("Total variation SD", 0.12)],
    "%GRR = √(EV² + AV²) / TV × 100", "Gauge R&R",
    (v) => {
      const grr = Math.sqrt(v["repeatability-sd"] ** 2 + v["reproducibility-sd"] ** 2);
      const pct = (grr / v["total-variation-sd"]) * 100;
      return [["GRR standard deviation", grr, 5, undefined, true], ["%GRR of total variation", pct, 2, "%"],
        ["Verdict", pct < 10 ? "Acceptable" : pct < 30 ? "Conditional" : "Unacceptable"],
        ["Number of distinct categories", Math.max(1, Math.floor(1.41 * (v["total-variation-sd"] / grr))), 0]];
    }),

  mk("arrhenius-life", [p("Activation energy", 0.7, "eV"), p("Use temperature", 55, "°C"), p("Stress temperature", 125, "°C")],
    "AF = exp(Ea/k (1/T_use − 1/T_stress)), k = 8.617333e-5 eV/K", "Arrhenius acceleration factor",
    (v) => {
      const k = 8.617333262e-5;
      const af = Math.exp((v["activation-energy"] / k) * (1 / (v["use-temperature"] + 273.15) - 1 / (v["stress-temperature"] + 273.15)));
      return [["Acceleration factor", af, 2, "×", true], ["1 stress hour equals", af, 2, "use hours"]];
    }),

  mkx("weibull-shape", [t("Failure times", "1200, 1600, 2100, 2600, 3300, 4200, 5400")],
    "Two-parameter Weibull MLE via Newton iteration on the shape equation", "Failure time list",
    (v) => {
      const ts = parseNumList(String(v["failure-times"]), 2);
      if (!ts.ok) return ts;
      if (ts.value.some((x) => x <= 0)) return err("Failure times must be positive.");
      const xs = ts.value, nX = xs.length;
      const meanLn = xs.reduce((a, x) => a + Math.log(x), 0) / nX;
      let beta = 1.2 / (Math.sqrt(xs.reduce((a, x) => a + (Math.log(x) - meanLn) ** 2, 0) / nX) || 1);
      for (let iter = 0; iter < 50; iter++) {
        const w = xs.reduce((a, x) => a + Math.pow(x, beta) * Math.log(x), 0);
        const s = xs.reduce((a, x) => a + Math.pow(x, beta), 0);
        const f = w / s - meanLn - 1 / beta;
        const ws = xs.reduce((a, x) => a + Math.pow(x, beta) * Math.log(x) ** 2, 0);
        const df = ws / s - (w / s) ** 2 + 1 / (beta * beta);
        if (Math.abs(df) < 1e-12) break;
        const next = beta - f / df;
        if (!Number.isFinite(next) || next <= 0) break;
        if (Math.abs(next - beta) < 1e-8) { beta = next; break; }
        beta = next;
      }
      const eta = Math.pow(xs.reduce((a, x) => a + Math.pow(x, beta), 0) / nX, 1 / beta);
      return [["Shape β", beta, 3, undefined, true], ["Scale η", eta, 1, "h"],
        ["Mean life", eta * (1 + 1 / beta) * 1.0, 1, "h (approx.)"]];
    },
    { assumptions: ["Maximum-likelihood fit with no censoring. Censored data require survival-analysis software."] }),

  mkx("tolerance-stack", [t("Dimensions", "25, 40, 15, 20"), t("Tolerances", "0.1, 0.15, 0.05, 0.1")],
    "Worst case = Σd ± Σt; statistical (RSS) = Σd ± √Σt²", "Tolerance stack-up",
    (v) => {
      const d = parseNumList(String(v.dimensions), 1);
      const tol = parseNumList(String(v.tolerances), 1);
      if (!d.ok) return d;
      if (!tol.ok) return tol;
      if (d.value.length !== tol.value.length) return err("Dimensions and tolerances must have equal length.");
      const nominal = d.value.reduce((a, b) => a + b, 0);
      const worst = tol.value.reduce((a, b) => a + b, 0);
      const rss = Math.sqrt(tol.value.reduce((a, b) => a + b * b, 0));
      return [["Nominal assembly", nominal, 4, undefined, true], ["Worst-case limits", `${(nominal - worst).toFixed(4)} – ${(nominal + worst).toFixed(4)}`],
        ["Statistical (RSS) ±", rss, 4], ["RSS savings vs worst case", (1 - rss / worst) * 100, 1, "%"]];
    },
    { assumptions: ["RSS assumes independent, centred, normally distributed component errors with a 3σ mapping."] }),

  mk("hazard-rate", [p("Characteristic life", 10000, "h"), p("Shape factor", 2.2), p("Time", 3000, "h")],
    "h(t) = (β/η)(t/η)^(β−1)", "Weibull hazard rate",
    (v) => [["Hazard rate", (v["shape-factor"] / v["characteristic-life"]) * Math.pow(v.time / v["characteristic-life"], v["shape-factor"] - 1), 8, "per hour", true],
      ["Failure mode", v["shape-factor"] < 1 ? "Decreasing (infant mortality)" : v["shape-factor"] > 1 ? "Increasing (wear-out)" : "Constant (random)"]],
    { limitations: ["The bathtub curve is a conceptual model; real hazard functions mix failure modes."] }),

  // ── C74 Human Resources (12) ───────────────────────────────────────────────
  mk("headcount-plan", [p("Current headcount", 120), p("Growth", 15, "%"), p("Attrition", 12, "%"), p("Internal mobility", 3, "%")],
    "Hires = current × (growth + attrition − internal mobility) / 100", "Headcount planning",
    (v) => {
      const hires = (v["current-headcount"] * (v.growth + v.attrition - v["internal-mobility"])) / 100;
      return [["Hires required", Math.ceil(hires), 0, "people", true],
        ["End headcount", Math.round(v["current-headcount"] * (1 + v.growth / 100)), 0, "people"],
        ["Exits", Math.round(v["current-headcount"] * v.attrition / 100), 0, "people"]];
    }),

  mk("turnover-rate", [p("Leavers", 18), p("Starting headcount", 118), p("Ending headcount", 126)],
    "Turnover% = leavers / average headcount × 100", "Employee turnover",
    (v) => {
      const avg = (v["starting-headcount"] + v["ending-headcount"]) / 2;
      return [["Turnover rate", (v.leavers / avg) * 100, 2, "%", true], ["Average headcount", avg, 0, "people"]];
    }),

  mk("attrition-cost", [p("Annual salary", 68000, "$"), p("Recruiting cost", 4200, "$"), p("Ramp-up cost", 8500, "$"), it("Departures", 14, { min: 1 })],
    "Cost per departure = recruiting + ramp-up + salary-based productivity loss", "Attrition cost",
    (v) => {
      const per = v["recruiting-cost"] + v["ramp-up-cost"] + v["annual-salary"] * 0.2;
      return [["Cost per departure", per, 0, "$", true], ["Annual attrition cost", per * v.departures, 0, "$"]];
    },
    { assumptions: ["Uses a 20% salary productivity-loss assumption; inflate or deflate it to match your own measurement."] }),

  mk("cost-per-hire", [p("Internal recruiting cost", 28000, "$"), p("External agency fees", 16000, "$"), it("Hires", 12, { min: 1 })],
    "Cost per hire = (internal + external) / hires", "Cost per hire",
    (v) => [["Cost per hire", (v["internal-recruiting-cost"] + v["external-agency-fees"]) / v.hires, 2, "$", true]],
    { limitations: ["Whether recruiter salaries are included changes the result by an order of magnitude — state the definition."] }),

  mk("time-to-hire", [p("Sourcing days", 12), p("Screening days", 5), p("Interview days", 9), p("Offer days", 4)],
    "Time to hire = Σ stage durations", "Recruitment stage durations",
    (v) => [["Total time to hire", v["sourcing-days"] + v["screening-days"] + v["interview-days"] + v["offer-days"], 0, "days", true]]),

  mk("absenteeism-rate", [p("Days absent", 210, "days"), p("Headcount", 120), p("Working days", 250, "days")],
    "Absence% = absence days / (headcount × working days) × 100", "Absence rate",
    (v) => [["Absence rate", (v["days-absent"] / (v.headcount * v["working-days"])) * 100, 2, "%", true],
      ["Days lost per employee", v["days-absent"] / v.headcount, 1, "days"]]),

  mk("span-of-control", [p("Direct reports", 42), p("Managers", 7)],
    "Span = reports / managers", "Span of control",
    (v) => [["Span of control", v["direct-reports"] / v.managers, 1, "reports per manager", true]]),

  mk("fte-calculation", [p("Total paid hours", 24000, "h"), p("Full-time hours", 2080, "h")],
    "FTE = paid hours / full-time hours", "Full-time equivalent",
    (v) => [["FTE", v["total-paid-hours"] / v["full-time-hours"], 2, undefined, true]]),

  mk("leave-entitlement", [p("Completed service", 4, "years"), p("Statutory days per year", 20, "days"), p("Additional days per year of service", 0.5), p("Maximum statutory days", 28, "days")],
    "Entitlement = base + (service − 1) × increment, capped", "Parametric leave entitlement",
    (v) => {
      const raw = v["statutory-days-per-year"] + Math.max(0, v["completed-service"] - 1) * v["additional-days-per-year-of-service"];
      return [["Indicative entitlement", Math.min(raw, v["maximum-statutory-days"]), 1, "days", true]];
    },
    { limitations: ["Leave entitlement is statutory and jurisdiction-specific. Enter your own statutory parameters; this tool does not provide legal entitlement — specialist/legal review required."] }),

  mk("training-hours", [p("Total training hours", 2600, "h"), p("Headcount", 120)],
    "Hours per employee = total / headcount", "Training hours per employee",
    (v) => [["Training hours per employee", v["total-training-hours"] / v.headcount, 1, "h", true]]),

  mkx("engagement-score", [t("Response scores", "4, 5, 3, 4, 4, 2, 5, 4")],
    "Mean score normalised to a 0–100 index", "Engagement survey responses",
    (v) => {
      const r = parseNumList(String(v["response-scores"]), 1);
      if (!r.ok) return r;
      if (r.value.some((x) => x < 1 || x > 5)) return err("Scores must be between 1 and 5.");
      const mean = r.value.reduce((a, b) => a + b, 0) / r.value.length;
      const favourable = (r.value.filter((x) => x >= 4).length / r.value.length) * 100;
      return [["Engagement index (0–100)", ((mean - 1) / 4) * 100, 1, undefined, true],
        ["Favourable share (4–5)", favourable, 1, "%"], ["Mean score", mean, 2]];
    }),

  mk("recruitment-funnel", [p("Applications", 1200), p("Screened", 420), p("Interviews", 96), p("Offers", 18), p("Hires", 14)],
    "Stage conversion rates through the hiring funnel", "Recruitment stage counts",
    (v) => {
      const s0 = [v.applications, v.screened, v.interviews, v.offers, v.hires];
      const rates = s0.slice(1).map((x, i) => (x / s0[i]) * 100);
      return [["Application → hire", (v.hires / v.applications) * 100, 2, "%", true],
        ["Stage conversions", rates.map((x) => `${x.toFixed(1)}%`).join(" → ")],
        ["Offer acceptance", (v.hires / v.offers) * 100, 1, "%"]];
    }),

  // ── C75 Insurance and Risk (14) ────────────────────────────────────────────
  mk("life-insurance-need", [p("Debts", 120000, "$"), p("Annual income", 85000, "$"), it("Income years", 12, { min: 1 }), p("Mortgage balance", 240000, "$"), p("Education fund", 60000, "$"), p("Existing assets", 90000, "$")],
    "DIME = debts + income×years + mortgage + education − assets", "Life insurance needs analysis",
    (v) => {
      const need = v.debts + v["annual-income"] * v["income-years"] + v["mortgage-balance"] + v["education-fund"] - v["existing-assets"];
      return [["Cover needed (DIME)", Math.max(0, need), 0, "$", true],
        ["Income replacement component", v["annual-income"] * v["income-years"], 0, "$"]];
    },
    { limitations: ["A needs analysis, not a recommendation or financial advice."] }),

  mk("deductible-breakeven", [p("Plan A premium", 420, "$/mo"), p("Plan A deductible", 1500, "$"), p("Plan B premium", 310, "$/mo"), p("Plan B deductible", 4000, "$")],
    "Break-even spend where total annual cost is equal", "Deductible plan comparison",
    (v) => {
      const premDiff = (v["plan-a-premium"] - v["plan-b-premium"]) * 12;
      const dedDiff = v["plan-b-deductible"] - v["plan-a-deductible"];
      if (premDiff <= 0) return err("Plan A must cost more in premium for a break-even point to exist.");
      return [["Break-even claim spend", (premDiff * dedDiff) / Math.max(1, dedDiff), 0, "$", true],
        ["Annual premium difference", premDiff, 0, "$"], ["Deductible difference", dedDiff, 0, "$"]];
    },
    { assumptions: ["Compares premium plus deductible only; coinsurance, networks and out-of-pocket maximums also matter."] }),

  mk("coinsurance-cost", [p("Billed amount", 8000, "$"), p("Deductible", 1500, "$"), p("Coinsurance rate", 20, "%", { max: 100 }), p("OOP maximum", 6000, "$")],
    "OOP = min(maximum, deductible + coinsurance × max(0, bill − deductible))", "Coinsurance member share",
    (v) => {
      const afterDed = Math.max(0, v["billed-amount"] - v.deductible);
      const oop = Math.min(v["oop-maximum"], v.deductible + (v["coinsurance-rate"] / 100) * afterDed);
      return [["Member out-of-pocket", oop, 2, "$", true], ["Plan pays", v["billed-amount"] - oop, 2, "$"]];
    },
    { assumptions: ["In-network covered services only. Plan rules vary widely — display and verify the actual benefit terms."] }),

  mkx("out-of-pocket-max", [t("Service costs", "1200, 3400, 2800, 900"), p("Deductible", 1500, "$"), p("Coinsurance", 20, "%", { max: 100 }), p("OOP maximum", 6000, "$")],
    "Accumulates deductible, then coinsurance, capped at the maximum", "Out-of-pocket maximum tracking",
    (v) => {
      const costs = parseNumList(String(v["service-costs"]), 1);
      if (!costs.ok) return costs;
      let remainingDed = v.deductible, oop = 0;
      for (const c of costs.value) {
        if (oop >= v["oop-maximum"]) break;
        const used = Math.min(remainingDed, c);
        remainingDed -= used;
        const coins = (c - used) * (v.coinsurance / 100);
        oop = Math.min(v["oop-maximum"], oop + used + coins);
      }
      return [["Member out-of-pocket total", oop, 2, "$", true],
        ["Total billed", costs.value.reduce((a, b) => a + b, 0), 2, "$"],
        ["Cap reached", oop >= v["oop-maximum"] ? "Yes" : "No"]];
    }),

  mk("claim-payout", [p("Loss amount", 45000, "$"), p("Deductible", 2000, "$"), p("Coverage limit", 80000, "$")],
    "Payout = min(limit, max(0, loss − deductible))", "Claim payout",
    (v) => [["Payout", Math.min(v["coverage-limit"], Math.max(0, v["loss-amount"] - v.deductible)), 2, "$", true],
      ["Uncovered amount", Math.max(0, v["loss-amount"] - Math.min(v["coverage-limit"], Math.max(0, v["loss-amount"] - v.deductible))), 2, "$"]]),

  mk("expected-loss", [p("Probability", 4, "%", { max: 100 }), p("Severity", 60000, "$")],
    "EL = probability × severity", "Expected loss",
    (v) => [["Expected loss", (v.probability / 100) * v.severity, 2, "$", true],
      ["Expected loss", ((v.probability / 100) * v.severity) / 12, 2, "$/mo"]],
    { assumptions: ["An expected value only — premiums add loading, expenses and profit."] }),

  mk("loss-ratio", [p("Claims incurred", 780000, "$"), p("Earned premium", 1000000, "$")],
    "Loss ratio = claims / premium × 100", "Loss ratio",
    (v) => [["Loss ratio", (v["claims-incurred"] / v["earned-premium"]) * 100, 2, "%", true]]),

  mk("combined-ratio", [p("Loss ratio", 78, "%"), p("Expense ratio", 24, "%")],
    "Combined = loss ratio + expense ratio", "Combined ratio",
    (v) => [["Combined ratio", v["loss-ratio"] + v["expense-ratio"], 2, "%", true],
      ["Underwriting result", v["loss-ratio"] + v["expense-ratio"] < 100 ? "Profit before investment income" : "Underwriting loss"]]),

  mk("premium-per-1000", [p("Annual premium", 480, "$"), p("Sum assured", 250000, "$")],
    "Rate per 1,000 of cover = premium / (sum assured / 1000)", "Premium rate per 1,000",
    (v) => [["Premium per 1,000 of cover", (v["annual-premium"] / (v["sum-assured"] / 1000)), 3, "$", true]]),

  mk("replacement-cost", [p("Floor area", 180, "m²"), p("Build rate", 1850, "$/m²"), p("Contents value", 60000, "$")],
    "Sum insured = area × rate + contents", "Replacement cost estimate",
    (v) => [["Sum insured", v["floor-area"] * v["build-rate"] + v["contents-value"], 0, "$", true],
      ["Buildings component", v["floor-area"] * v["build-rate"], 0, "$"]]),

  mk("business-interruption", [p("Annual gross profit", 420000, "$"), it("Indemnity months", 9, { min: 1, max: 24 }), z("Increased cost of working", 25000, "$")],
    "Sum insured = gross profit × months/12 + increased costs", "Business interruption cover",
    (v) => [["Sum insured", (v["annual-gross-profit"] * v["indemnity-months"]) / 12 + v["increased-cost-of-working"], 0, "$", true]]),

  mk("risk-of-ruin", [p("Win probability", 55, "%", { max: 100 }), p("Bankroll units", 20), p("Bet size", 1)],
    "Even-money gambler's ruin: P(ruin) = ((1−p)/p)^units when p > 0.5", "Risk of ruin",
    (v) => {
      const pr = v["win-probability"] / 100;
      const units = v["bankroll-units"] / v["bet-size"];
      const ruin = pr > 0.5 ? Math.pow((1 - pr) / pr, units) : pr === 0.5 ? 1 : 1;
      return [["Risk of ruin", ruin * 100, 4, "%", true], ["Bankroll units", units, 0]];
    },
    { assumptions: ["Even-money, fixed-stake betting with independent trials. Positive-EV games still carry variance and drawdown risk."] }),

  mk("coverage-gap", [p("Cover needed", 500000, "$"), p("Existing cover", 320000, "$")],
    "Gap = need − existing", "Coverage gap",
    (v) => [["Coverage gap", Math.max(0, v["cover-needed"] - v["existing-cover"]), 0, "$", true],
      ["Adequately covered", v["existing-cover"] >= v["cover-needed"] ? "Yes" : "No"]]),

  mk("premium-financing", [p("Annual premium", 2400, "$"), p("Financing APR", 9.5, "%"), it("Months", 10, { min: 1, max: 24 })],
    "Cost = total instalments − premium", "Premium financing cost",
    (v) => {
      const pay = pmt(v["annual-premium"], v["financing-apr"] / 100 / 12, v.months);
      return [["Monthly instalment", pay, 2, "$", true], ["Total finance cost", pay * v.months - v["annual-premium"], 2, "$"]];
    }),

  // ── C76 Legal and Regulatory (9) ───────────────────────────────────────────
  mk("judgment-interest", [p("Principal", 50000, "$"), p("Annual rate", 7, "%"), p("Days", 420, "days"), p("Year basis", 365, "days")],
    "Simple statutory interest = principal × rate × days / basis", "Judgment interest (simple)",
    (v) => [["Interest accrued", (v.principal * (v["annual-rate"] / 100) * v.days) / v["year-basis"], 2, "$", true],
      ["Total with principal", v.principal + (v.principal * (v["annual-rate"] / 100) * v.days) / v["year-basis"], 2, "$"]],
    { limitations: ["Interest rates, compounding basis and accrual rules are set by jurisdiction and by the court. This is an arithmetic calculator on your inputs, not legal advice — legal review required."] }),

  mkx("contract-notice-period", [t("Event date", "2026-03-01"), it("Notice days", 30, { min: 0 })],
    "Notice deadline = event date − notice days (calendar days)", "Event date and contractual notice period",
    (v) => {
      const d = new Date(`${String(v["event-date"])}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return err("Enter the event date as YYYY-MM-DD.");
      const out = new Date(d.getTime() - Number(v["notice-days"]) * 86400000);
      return [["Notice deadline", out.toISOString().slice(0, 10), undefined, true]];
    },
    { limitations: ["Whether notice days are calendar or business days, and how service is effected, comes from the contract and applicable law — not legal advice."] }),

  mkx("limitation-period", [t("Accrual date", "2025-06-15"), it("Limitation years", 6, { min: 1, max: 30 })],
    "Deadline = accrual date + limitation years", "Accrual date and limitation period",
    (v) => {
      const d = new Date(`${String(v["accrual-date"])}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return err("Enter the accrual date as YYYY-MM-DD.");
      const out = new Date(Date.UTC(d.getUTCFullYear() + Number(v["limitation-years"]), d.getUTCMonth(), d.getUTCDate()));
      return [["Indicative limitation deadline", out.toISOString().slice(0, 10), undefined, true]];
    },
    { limitations: ["Limitation periods are procedural rules that vary by claim type, jurisdiction and can be paused or tolled. This tool does not determine whether a claim is time-barred and is not legal advice — legal review required."] }),

  mk("inheritance-share", [p("Estate value", 500000, "$"), it("Heirs", 4, { min: 1 }), p("Fixed share total", 33.3, "%", { max: 100 })],
    "Parametric: fixed shares first, residue split equally", "Estate distribution",
    (v) => {
      const fixed = v["estate-value"] * (v["fixed-share-total"] / 100);
      const residue = (v["estate-value"] - fixed) / v.heirs;
      return [["Residuary share per heir", residue, 2, "$", true], ["Fixed-share pool", fixed, 2, "$"]];
    },
    { limitations: ["Forced-heirship and intestacy rules vary by jurisdiction and school of law. This is simple arithmetic on your own assumptions and is not legal advice — specialist legal review required."] }),

  mkx("damages-calculation", [t("Annual loss stream", "60000, 60000, 60000, 60000, 60000"), p("Discount rate", 4, "%", { min: -50 })],
    "PV = Σ CF_t / (1 + r)^t", "Discounted damages",
    (v) => {
      const cfs = parseNumList(String(v["annual-loss-stream"]), 1);
      if (!cfs.ok) return cfs;
      const r = v["discount-rate"] / 100;
      const pv = cfs.value.reduce((a, cf, t) => a + cf / Math.pow(1 + r, t), 0);
      return [["Present value of losses", pv, 2, "$", true], ["Undiscounted total", cfs.value.reduce((a, b) => a + b, 0), 2, "$"],
        ["Discount effect", pv - cfs.value.reduce((a, b) => a + b, 0), 2, "$"]];
    },
    { limitations: ["Discount rate selection is a legal and economic judgment; this is arithmetic on your inputs, not legal advice."] }),

  mkx("lease-notice-period", [t("Lease end date", "2027-06-30"), it("Notice months", 3, { min: 0, max: 24 })],
    "Notice date = lease end − notice months (day-of-month clamped)", "Lease end and notice period",
    (v) => {
      const d = new Date(`${String(v["lease-end-date"])}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return err("Enter the lease end date as YYYY-MM-DD.");
      const targetMonth = d.getUTCMonth() - Number(v["notice-months"]);
      const out = new Date(Date.UTC(d.getUTCFullYear(), targetMonth, 1));
      const lastDay = new Date(Date.UTC(out.getUTCFullYear(), out.getUTCMonth() + 1, 0)).getUTCDate();
      out.setUTCDate(Math.min(d.getUTCDate(), lastDay));
      return [["Latest notice date", out.toISOString().slice(0, 10), undefined, true]];
    },
    { limitations: ["Break rights, service requirements and statutory notice rules come from the lease and local law — not legal advice."] }),

  mk("child-support-estimate", [p("Gross annual income", 72000, "$"), it("Children", 2, { min: 1, max: 10 }), p("Guideline percentage per child", 12, "%", { max: 50 })],
    "Parametric: income × percentage × children", "Child support estimate",
    (v) => [["Indicative annual support", v["gross-annual-income"] * (v["guideline-percentage-per-child"] / 100) * Math.min(v.children, 3), 2, "$", true],
      ["Monthly", (v["gross-annual-income"] * (v["guideline-percentage-per-child"] / 100) * Math.min(v.children, 3)) / 12, 2, "$"]],
    { limitations: ["Child support formulas are statutory, jurisdiction-specific and depend on custody, other children and add-ons. This parametric estimate is not a legal entitlement — specialist legal review required."] }),

  mk("redundancy-pay", [p("Weekly pay", 800, "$"), p("Completed years", 9), p("Statutory weeks per year", 1.5, "weeks"), p("Statutory cap per week", 700, "$")],
    "Pay = min(weekly pay, cap) × weeks/year × years", "Statutory redundancy pay",
    (v) => [["Redundancy payment", Math.min(v["weekly-pay"], v["statutory-cap-per-week"]) * v["statutory-weeks-per-year"] * v["completed-years"], 2, "$", true]],
    { limitations: ["Statutory redundancy tables (age bands, weekly caps, service caps) are jurisdiction-specific and change with legislation. Enter your own parameters — this is not an entitlement determination. Specialist legal review required."] }),

  mkx("legal-deadline", [t("Service date", "2026-05-01"), it("Days allowed", 28, { min: 0 }), s("Day counting", [["calendar", "Calendar days"], ["business", "Business days (Mon–Fri)"]], "calendar")],
    "Deadline = service date + allowed days under the selected counting rule", "Procedural deadline",
    (v) => {
      const d = new Date(`${String(v["service-date"])}T00:00:00Z`);
      if (Number.isNaN(d.getTime())) return err("Enter the service date as YYYY-MM-DD.");
      let remaining = Number(v["days-allowed"]);
      const cur = new Date(d.getTime());
      if (v["day-counting"] === "business") {
        while (remaining > 0) {
          cur.setUTCDate(cur.getUTCDate() + 1);
          const dow = cur.getUTCDay();
          if (dow !== 0 && dow !== 6) remaining--;
        }
      } else {
        cur.setUTCDate(cur.getUTCDate() + remaining);
      }
      return [["Deadline", cur.toISOString().slice(0, 10), undefined, true]];
    },
    { limitations: ["Court rules define how days are counted, service methods, holidays and extensions. Verify against the applicable rules — not legal advice."] }),

  // ── C77 Gaming, Odds and Probability (12) ──────────────────────────────────
  mk("expected-value-bet", [p("Decimal odds", 2.5), p("Stake", 100, "$"), p("Win probability", 45, "%", { max: 100 })],
    "EV = stake × (p × (odds − 1) − (1 − p))", "Expected value of a bet",
    (v) => {
      const p = v["win-probability"] / 100;
      const ev = v.stake * (p * (v["decimal-odds"] - 1) - (1 - p));
      return [["Expected value", ev, 2, "$", true], ["Expected ROI", (ev / v.stake) * 100, 2, "%"],
        ["Break-even probability", (1 / v["decimal-odds"]) * 100, 2, "%"]];
    },
    { limitations: ["Positive EV still carries variance and risk of ruin — report both."] }),

  mk("house-edge", [p("Win probability", 48.6, "%", { max: 100 }), p("Decimal payout", 2.0)],
    "Edge = 1 − [p × payout + (1 − p) × 0]", "House / player edge",
    (v) => {
      const p = v["win-probability"] / 100;
      const rtp = p * v["decimal-payout"];
      return [["Return to player", rtp * 100, 2, "%", true], ["House edge", (1 - rtp) * 100, 2, "%"]];
    }),

  mk("pot-odds", [p("Pot size", 300, "$"), p("Bet to call", 100, "$")],
    "Pot odds = call / (pot + call); break-even equity = call / (pot + call)", "Poker pot odds",
    (v) => {
      const eq = v["bet-to-call"] / (v["pot-size"] + v["bet-to-call"]);
      return [["Pot odds", `${(v["bet-to-call"] / v["pot-size"]).toFixed(2)} : 1`, undefined, true],
        ["Break-even equity", eq * 100, 2, "%"]];
    }),

  mk("implied-probability", [p("Decimal odds", 2.5)],
    "Implied probability = 1 / decimal odds", "Implied probability",
    (v) => [["Implied probability", (1 / v["decimal-odds"]) * 100, 2, "%", true],
      ["Fair decimal odds for 50%", 2, 2, undefined]]),

  mkx("odds-conversion", [n("Value", 2.5), s("Format", [["decimal", "Decimal"], ["fractional", "Fractional (e.g. 1.5 = 3/2)"], ["american", "American (+150 / −200)"]], "decimal")],
    "Decimal d = 1 + a/b; American +m → 1 + m/100, −m → 1 + 100/m", "Odds value and format",
    (v) => {
      const value = Number(v.value);
      let dec: number;
      if (v.format === "decimal") dec = value;
      else if (v.format === "fractional") dec = 1 + value;
      else dec = value > 0 ? 1 + value / 100 : 1 + 100 / Math.abs(value);
      if (!(dec > 1)) return err("Odds must imply a decimal price greater than 1.00.");
      return [["Decimal", dec, 3, undefined, true],
        ["Fractional", `${((dec - 1) * 100).toFixed(0)}/100`, undefined],
        ["American", dec >= 2 ? `+${Math.round((dec - 1) * 100)}` : `${Math.round(-100 / (dec - 1))}`, undefined],
        ["Implied probability", (1 / dec) * 100, 2, "%"]];
    }),

  mkx("parlay-odds", [t("Leg decimal odds", "1.91, 2.05, 1.75")],
    "Combined decimal odds = ∏ leg odds", "Parlay / accumulator odds",
    (v) => {
      const legs = parseNumList(String(v["leg-decimal-odds"]), 1);
      if (!legs.ok) return legs;
      if (legs.value.some((x) => x <= 1)) return err("Each leg must have decimal odds above 1.00.");
      const comb = legs.value.reduce((a, b) => a * b, 1);
      return [["Combined decimal odds", comb, 3, undefined, true],
        ["Implied probability", (1 / comb) * 100, 3, "%"],
        ["Number of legs", legs.value.length, 0]];
    }),

  mkx("kelly-criterion", [p("Win probability", 55, "%", { max: 100 }), p("Decimal odds", 2.1), p("Fractional Kelly", 50, "%", { max: 100 })],
    "f* = (b p − q) / b with b = odds − 1; fractional Kelly scales the stake", "Kelly criterion stake",
    (v) => {
      const p = Number(v["win-probability"]) / 100, odds = Number(v["decimal-odds"]);
      const b = odds - 1, q = 1 - p;
      const f = (b * p - q) / b;
      const frac = Math.max(0, f) * (Number(v["fractional-kelly"]) / 100);
      return [["Full Kelly fraction", Math.max(0, f) * 100, 2, "% of bankroll", true],
        ["Recommended (fractional) stake", frac * 100, 2, "% of bankroll"],
        ["Edge", (p * odds - 1) * 100, 2, "%"]];
    },
    { limitations: ["Full Kelly is growth-optimal but has large drawdowns; fractional Kelly is common practice. Estimates of p are themselves uncertain."] }),

  mk("vig-removal", [p("Outcome A decimal odds", 1.91), p("Outcome B decimal odds", 1.95)],
    "Fair probability = (1/dᵢ) / Σ(1/dⱼ)", "Two-way vig removal",
    (v) => {
      const a = 1 / v["outcome-a-decimal-odds"], b = 1 / v["outcome-b-decimal-odds"];
      const total = a + b;
      return [["Overround (vig)", (total - 1) * 100, 2, "%", true],
        ["Fair probability A", (a / total) * 100, 2, "%"], ["Fair probability B", (b / total) * 100, 2, "%"]];
    }),

  mk("poker-outs", [p("Outs", 9), s("Street", [["flop", "Flop (2 cards to come)"], ["turn", "Turn (1 card to come)"]], "flop")],
    "Rule of 2 and 4: equity ≈ outs × 4 (flop) or × 2 (turn)", "Poker outs to equity",
    (v) => [["Approximate equity", v.outs * (v.street === "flop" ? 4 : 2), 1, "%", true],
      ["Exact (flop, 2 cards)", (1 - combNum(47 - v.outs, 2) / combNum(47, 2)) * 100, 2, "%"],
      ["Exact (turn, 1 card)", (v.outs / 46) * 100, 2, "%"]]),

  mk("lottery-odds", [it("Numbers in pool", 49, { min: 1, max: 100 }), it("Numbers drawn", 6, { min: 1, max: 20 })],
    "Probability of exact match = 1 / C(n, k)", "Lottery odds",
    (v) => {
      if (v["numbers-drawn"] > v["numbers-in-pool"]) return err("Numbers drawn cannot exceed the pool size.");
      const combos = combNum(v["numbers-in-pool"], v["numbers-drawn"]);
      return [["Odds", `1 in ${combos.toLocaleString("en-US")}`, undefined, true], ["Combinations", combos, 0]];
    }),

  mk("break-even-win-rate", [p("Decimal odds", 2.5)],
    "Break-even win rate = 1 / decimal odds", "Break-even win rate",
    (v) => [["Break-even win rate", (1 / v["decimal-odds"]) * 100, 2, "%", true]]),

  mk("betting-variance", [p("Bets", 500), p("Stake", 10, "$"), p("Win probability", 52, "%", { max: 100 }), p("Decimal odds", 2.0)],
    "σ = stake × √(n p (1 − p)) × (odds) — standard deviation of outcomes", "Betting variance",
    (v) => {
      const p = v["win-probability"] / 100;
      const ev = v.bets * (p * (v["decimal-odds"] - 1) - (1 - p)) * v.stake;
      const sd = v.stake * (v["decimal-odds"] - 1) * Math.sqrt(v.bets * p * (1 - p));
      return [["Expected profit", ev, 2, "$", true], ["Standard deviation", sd, 2, "$"],
        ["Typical range (±1σ)", `${(ev - sd).toFixed(0)} to ${(ev + sd).toFixed(0)} $`]];
    }),

  // ── C78 Sports Metrics (12) ────────────────────────────────────────────────
  mk("batting-average", [p("Hits", 145), p("At bats", 480)],
    "AVG = hits / at-bats", "Baseball batting average",
    (v) => [["Batting average", v.hits / v["at-bats"], 3, undefined, true]]),

  mk("earned-run-average", [p("Earned runs", 48), p("Innings pitched", 162)],
    "ERA = 9 × earned runs / innings", "Baseball ERA",
    (v) => [["ERA", (9 * v["earned-runs"]) / v["innings-pitched"], 2, undefined, true]]),

  mk("whip", [p("Walks", 42), p("Hits allowed", 130), p("Innings pitched", 162)],
    "WHIP = (BB + H) / IP", "Baseball WHIP",
    (v) => [["WHIP", (v.walks + v["hits-allowed"]) / v["innings-pitched"], 3, undefined, true]]),

  mk("slugging-percentage", [p("Total bases", 240), p("At bats", 480)],
    "SLG = total bases / at-bats", "Baseball slugging percentage",
    (v) => [["Slugging percentage", v["total-bases"] / v["at-bats"], 3, undefined, true]]),

  mk("on-base-percentage", [p("Hits", 145), p("Walks", 60), p("Hit by pitch", 8), p("At bats", 480), p("Sacrifice flies", 5)],
    "OBP = (H + BB + HBP) / (AB + BB + HBP + SF)", "Baseball on-base percentage",
    (v) => {
      const num0 = v.hits + v.walks + v["hit-by-pitch"];
      const den = v["at-bats"] + v.walks + v["hit-by-pitch"] + v["sacrifice-flies"];
      return [["On-base percentage", num0 / den, 3, undefined, true]];
    }),

  mk("true-shooting", [p("Points", 1850), p("Field goal attempts", 1350), p("Free throw attempts", 450)],
    "TS% = PTS / (2 × (FGA + 0.44 × FTA))", "Basketball true shooting",
    (v) => [["True shooting percentage", v.points / (2 * (v["field-goal-attempts"] + 0.44 * v["free-throw-attempts"])), 4, undefined, true]]),

  mk("elo-rating", [p("Rating A", 1600), p("Rating B", 1500), p("Score", 1), p("K-factor", 32)],
    "E_A = 1/(1 + 10^((R_B − R_A)/400)); R' = R + K(S − E)", "Elo rating change",
    (v) => {
      const ea = 1 / (1 + Math.pow(10, (v["rating-b"] - v["rating-a"]) / 400));
      const delta = v["k-factor"] * (v.score - ea);
      return [["Expected score A", ea, 4, undefined, true], ["New rating A", v["rating-a"] + delta, 1],
        ["New rating B", v["rating-b"] - delta, 1], ["Rating change", delta, 1]];
    }),

  mk("win-probability", [n("Rating gap", 120)],
    "P(win) = 1 / (1 + 10^(−gap/400))", "Win probability from rating gap",
    (v) => [["Win probability (higher-rated)", (1 / (1 + Math.pow(10, -v["rating-gap"] / 400))) * 100, 2, "%", true],
      ["Underdog win probability", (1 / (1 + Math.pow(10, v["rating-gap"] / 400))) * 100, 2, "%"]]),

  mkx("tournament-points", [t("Placements", "1, 3, 2, 5"), t("Points per place", "100, 80, 60, 50, 40")],
    "Total = Σ points(placement)", "Tournament series points",
    (v) => {
      const places = parseNumList(String(v.placements), 1);
      const table = parseNumList(String(v["points-per-place"]), 1);
      if (!places.ok) return places;
      if (!table.ok) return table;
      let total = 0;
      for (const pl of places.value) {
        const idx = Math.round(pl) - 1;
        if (idx < 0 || idx >= table.value.length) return err(`Placement ${pl} is outside the points table.`);
        total += table.value[idx];
      }
      return [["Total points", total, 0, undefined, true], ["Events", places.value.length, 0]];
    }),

  mk("handicap-index", [p("Handicap index", 14.2), p("Slope rating", 128), p("Course rating", 71.8), p("Par", 72)],
    "CH = index × slope/113 + (CR − par)", "Golf course handicap",
    (v) => [["Course handicap", Math.round(v["handicap-index"] * (v["slope-rating"] / 113) + (v["course-rating"] - v.par)), 0, "strokes", true],
      ["Unrounded value", v["handicap-index"] * (v["slope-rating"] / 113) + (v["course-rating"] - v.par), 2]]),

  mk("cricket-run-rate", [p("Runs scored", 268), p("Overs faced", 50), p("Runs conceded", 245), p("Overs bowled", 48)],
    "RR = runs / overs; NRR = scored rate − conceded rate", "Cricket run rate",
    (v) => {
      const scored = v["runs-scored"] / v["overs-faced"];
      const conceded = v["runs-conceded"] / v["overs-bowled"];
      return [["Run rate", scored, 2, "runs/over", true], ["Net run rate", scored - conceded, 2, "runs/over"],
        ["Required rate for 300", 300 / v["overs-faced"], 2, "runs/over"]];
    }),

  mk("football-goal-difference", [it("Wins", 18, { min: 0 }), it("Draws", 8, { min: 0 }), it("Losses", 12, { min: 0 }), it("Goals for", 62, { min: 0 }), it("Goals against", 45, { min: 0 })],
    "Points = 3W + D; GD = GF − GA", "Football league table",
    (v) => [["Points", v.wins * 3 + v.draws, 0, "pts", true], ["Goal difference", v["goals-for"] - v["goals-against"], 0],
      ["Matches played", v.wins + v.draws + v.losses, 0]]),

  // ── C79 Travel and Trip Planning (12) ──────────────────────────────────────
  mk("trip-cost", [p("Transport", 850, "$"), p("Accommodation per night", 140, "$/night"), it("Nights", 6, { min: 0 }), p("Daily food", 60, "$/day"), it("Days", 7, { min: 1 }), p("Activities", 300, "$"), z("Contingency", 10, "%")],
    "Total = transport + lodging + food + activities, plus contingency", "Trip cost",
    (v) => {
      const base = v.transport + v["accommodation-per-night"] * v.nights + v["daily-food"] * v.days + v.activities;
      return [["Total trip cost", base * (1 + v.contingency / 100), 2, "$", true], ["Base cost", base, 2, "$"],
        ["Cost per day", (base * (1 + v.contingency / 100)) / v.days, 2, "$/day"]];
    }),

  mk("cost-per-person-share", [p("Total cost", 1800, "$"), it("People", 4, { min: 1 }), it("Sharing people", 2, { min: 1 })],
    "Per person = total / people, adjusted for unequal shares", "Cost sharing",
    (v) => {
      const per = v["total-cost"] / v.people;
      return [["Equal share per person", per, 2, "$", true], ["Sharing pair share each", (per * v.people) / v["sharing-people"] / (v.people / v["sharing-people"]) , 2, "$"]];
    }),

  mk("travel-budget-per-day", [p("Total budget", 3000, "$"), it("Days", 9, { min: 1 })],
    "Per day = budget / days", "Travel budget per day",
    (v) => [["Daily budget", v["total-budget"] / v.days, 2, "$/day", true]]),

  mk("jet-lag-recovery", [it("Time zones crossed", 8, { min: 0, max: 14 }), s("Direction", [["east", "Eastbound"], ["west", "Westbound"]], "east")],
    "Rule of thumb: ≈1 day per zone eastbound, ≈0.75 day per zone westbound", "Jet lag recovery estimate",
    (v) => [["Estimated recovery", v["time-zones-crossed"] * (v.direction === "east" ? 1 : 0.75), 1, "days", true]],
    { limitations: ["Empirical rule of thumb, not clinical guidance; individual recovery varies with age, sleep and schedule."] }),

  mkx("flight-distance", [t("Departure lat,lon", "19.09,72.87"), t("Arrival lat,lon", "51.47,-0.45"), p("Cruise speed", 850, "km/h")],
    "Haversine great-circle distance between two coordinates", "Airport coordinates",
    (v) => {
      const parse = (s: string) => {
        const [a, b] = s.split(",").map((x) => Number(x.trim()));
        return Number.isFinite(a) && Number.isFinite(b) ? [a, b] as [number, number] : null;
      };
      const p1 = parse(String(v["departure-lat-lon"])), p2 = parse(String(v["arrival-lat-lon"]));
      if (!p1 || !p2) return err("Enter coordinates as lat,lon in decimal degrees.");
      const dLat = (p2[0] - p1[0]) * D2R, dLon = (p2[1] - p1[1]) * D2R;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(p1[0] * D2R) * Math.cos(p2[0] * D2R) * Math.sin(dLon / 2) ** 2;
      const d = 2 * 6371.0088 * Math.asin(Math.sqrt(a));
      return [["Great-circle distance", d, 0, "km", true], ["In nautical miles", d / 1.852, 0, "nm"],
        ["Flight time at cruise speed", d / v["cruise-speed"], 2, "h"]];
    }),

  mk("driving-time", [p("Distance", 420, "km"), p("Average speed", 85, "km/h"), z("Breaks", 45, "min"), p("Consumption", 7.2, "L/100km"), p("Fuel price", 1.85, "$/L")],
    "Time = distance / speed + breaks; cost = litres × price", "Driving time and cost",
    (v) => {
      const hours = v.distance / v["average-speed"];
      const litres = (v.distance * v.consumption) / 100;
      return [["Driving time", hours, 2, "h", true], ["Total time", hours + v.breaks / 60, 2, "h"],
        ["Fuel cost", litres * v["fuel-price"], 2, "$"]];
    }),

  mk("rest-stop-planning", [p("Driving duration", 480, "min"), p("Stop interval", 120, "min"), p("Stop length", 15, "min")],
    "Stops = floor(duration / interval)", "Rest stop planning",
    (v) => {
      const stops = Math.floor(v["driving-duration"] / v["stop-interval"]);
      return [["Stops", stops, 0, "stops", true], ["Total elapsed", v["driving-duration"] + stops * v["stop-length"], 0, "min"]];
    }),

  mkx("luggage-weight", [t("Item weights", "12, 8, 6.5, 4, 3.2"), p("Airline limit", 30, "kg")],
    "Total = Σ items; excess = max(0, total − limit)", "Baggage weight",
    (v) => {
      const items = parseNumList(String(v["item-weights"]), 1);
      if (!items.ok) return items;
      const total = items.value.reduce((a, b) => a + b, 0);
      return [["Total weight", total, 2, "kg", true], ["Excess weight", Math.max(0, total - v["airline-limit"]), 2, "kg"]];
    }),

  mk("hotel-cost-per-night", [p("Total hotel cost", 1260, "$"), it("Nights", 6, { min: 1 }), z("Taxes", 8, "%")],
    "Per night = total / nights; tax-inclusive per night = per night × (1 + tax)", "Hotel cost per night",
    (v) => [["Cost per night", v["total-hotel-cost"] / v.nights, 2, "$", true],
      ["Tax-inclusive per night", (v["total-hotel-cost"] / v.nights) * (1 + v.taxes / 100), 2, "$"]]),

  mk("travel-insurance-cost", [p("Trip cost", 2400, "$"), it("Days", 9, { min: 1 }), p("Daily rate", 4.5, "$/day")],
    "Premium = days × daily rate (+ optional value-based component)", "Travel insurance premium",
    (v) => {
      const prem = v.days * v["daily-rate"] + v["trip-cost"] * 0.01;
      return [["Estimated premium", prem, 2, "$", true], ["As share of trip cost", (prem / v["trip-cost"]) * 100, 2, "%"]];
    },
    { limitations: ["Exclusions dominate real risk; a premium estimate does not imply coverage."] }),

  mkx("multi-city-distance", [t("Leg distances", "1200, 3400, 850, 2200")],
    "Total = Σ leg distances", "Multi-city route",
    (v) => {
      const legs = parseNumList(String(v["leg-distances"]), 1);
      if (!legs.ok) return legs;
      return [["Total distance", legs.value.reduce((a, b) => a + b, 0), 0, "km", true], ["Legs", legs.value.length, 0]];
    }),

  mk("timezone-difference", [n("Offset A", 5.5), n("Offset B", -5)],
    "Difference = offset A − offset B", "Time zone difference",
    (v) => {
      const diff = v["offset-a"] - v["offset-b"];
      return [["Difference", diff, 2, "h", true], ["Call window from A (09:00–17:00)", `A 09:00 = B ${(9 - diff).toFixed(1).padStart(5, "0")}`, undefined]];
    }),

  // ── C80 Household Budgets (14) ─────────────────────────────────────────────
  mk("fifty-thirty-twenty", [p("Monthly net income", 5200, "$/mo")],
    "Needs 50%, wants 30%, savings 20% of net income", "50/30/20 budget split",
    (v) => [["Needs", v["monthly-net-income"] * 0.5, 2, "$/mo", true],
      ["Wants", v["monthly-net-income"] * 0.3, 2, "$/mo"],
      ["Savings / debt", v["monthly-net-income"] * 0.2, 2, "$/mo"]],
    { limitations: ["The 50/30/20 rule is a popular heuristic, not a standard; category mapping is household-specific."] }),

  mk("savings-rate", [p("Monthly savings", 720, "$/mo"), p("Gross monthly income", 5200, "$/mo")],
    "Savings rate = savings / income × 100", "Savings rate",
    (v) => [["Savings rate", (v["monthly-savings"] / v["gross-monthly-income"]) * 100, 2, "%", true],
      ["Annual savings", v["monthly-savings"] * 12, 2, "$/yr"]]),

  mk("emergency-fund", [p("Essential monthly expenses", 3100, "$/mo"), it("Months", 6, { min: 1, max: 24 })],
    "Target = essential expenses × months", "Emergency fund target",
    (v) => [["Target emergency fund", v["essential-monthly-expenses"] * v.months, 0, "$", true],
      ["Target at 3 months", v["essential-monthly-expenses"] * 3, 0, "$"]],
    { limitations: ["3–6 months is guidance, not a rule; it depends on income stability and obligations."] }),

  mk("net-worth", [p("Assets", 320000, "$"), p("Liabilities", 180000, "$")],
    "Net worth = assets − liabilities", "Net worth",
    (v) => [["Net worth", v.assets - v.liabilities, 2, "$", true], ["Liabilities share", (v.liabilities / v.assets) * 100, 1, "%"]]),

  mkx("subscription-cost", [t("Monthly subscriptions", "15.99, 10.99, 22.50, 7.99")],
    "Annual = Σ monthly × 12", "Subscription cost tracker",
    (v) => {
      const subs = parseNumList(String(v["monthly-subscriptions"]), 1);
      if (!subs.ok) return subs;
      const monthly = subs.value.reduce((a, b) => a + b, 0);
      return [["Monthly total", monthly, 2, "$/mo", true], ["Annual total", monthly * 12, 2, "$/yr"],
        ["Five-year total", monthly * 60, 0, "$"]];
    }),

  mk("utility-split", [p("Bill", 240, "$"), it("Occupants", 4, { min: 1 }), it("Extra shares", 0, { min: 0 })],
    "Equal split = bill / (occupants + extra shares)", "Utility bill split",
    (v) => [["Per share", v.bill / (v.occupants + v["extra-shares"]), 2, "$", true],
      ["Total shares", v.occupants + v["extra-shares"], 0]]),

  mk("rent-affordability", [p("Monthly gross income", 6000, "$/mo"), p("Rent ratio", 30, "%", { max: 100 })],
    "Max rent = income × ratio", "Rent affordability",
    (v) => [["Maximum rent", v["monthly-gross-income"] * (v["rent-ratio"] / 100), 2, "$/mo", true],
      ["Annual rent", v["monthly-gross-income"] * (v["rent-ratio"] / 100) * 12, 0, "$/yr"]]),

  mk("grocery-budget", [p("Household size", 4), p("Per person weekly", 65, "$"), p("Weeks", 4.33)],
    "Weekly = size × per person; monthly = weekly × weeks", "Grocery budget",
    (v) => {
      const weekly = v["household-size"] * v["per-person-weekly"];
      return [["Weekly grocery budget", weekly, 2, "$", true], ["Monthly groceries", weekly * v.weeks, 2, "$"]];
    }),

  mk("sinking-fund", [p("Target amount", 4800, "$"), it("Months", 12, { min: 1 })],
    "Monthly set-aside = target / months", "Sinking fund",
    (v) => [["Monthly set-aside", v["target-amount"] / v.months, 2, "$/mo", true]]),

  mk("cash-flow-monthly", [p("Income", 6400, "$/mo"), p("Expenses", 5100, "$/mo")],
    "Net cash flow = income − expenses", "Monthly cash flow",
    (v) => [["Net cash flow", v.income - v.expenses, 2, "$/mo", true],
      ["Savings rate", ((v.income - v.expenses) / v.income) * 100, 1, "%"]]),

  mk("cost-of-living-index", [p("Income", 6000, "$/mo"), p("Current index", 100), p("Target index", 132)],
    "Equivalent income = income × target index / current index", "Cost of living comparison",
    (v) => [["Equivalent income needed", (v.income * v["target-index"]) / v["current-index"], 2, "$/mo", true],
      ["Required raise", ((v["target-index"] / v["current-index"]) - 1) * 100, 1, "%"]]),

  mkx("envelope-budget", [p("Monthly income", 5200, "$/mo"), t("Category weights", "35, 20, 15, 10, 10, 10")],
    "Envelope = income × weight / Σweights", "Envelope budgeting",
    (v) => {
      const w = parseNumList(String(v["category-weights"]), 1);
      if (!w.ok) return w;
      const sum = w.value.reduce((a, b) => a + b, 0);
      return [["Envelopes", w.value.map((x) => ((v["monthly-income"] * x) / sum).toFixed(2)).join(", "), undefined, true],
        ["Total allocated", v["monthly-income"], 2, "$"]];
    }),

  mk("goal-savings-timeline", [p("Target amount", 25000, "$"), p("Monthly contribution", 600, "$/mo"), p("Annual return", 5, "%")],
    "n = ln(FV·i/PMT + 1)/ln(1 + i); if PMT ≤ FV·i the goal is never reached", "Goal savings timeline",
    (v) => {
      const i = v["annual-return"] / 100 / 12, fv = v["target-amount"], pmt0 = v["monthly-contribution"];
      if (pmt0 <= fv * i) return err("With this contribution the goal is never reached — the monthly amount does not cover the required growth.");
      const n = Math.log((fv * i) / pmt0 + 1) / Math.log(1 + i);
      return [["Months to goal", Math.ceil(n), 0, "months", true], ["Years", n / 12, 2, "years"]];
    }),

  mkx("home-budget-variance", [t("Budget", "800, 350, 200, 150"), t("Actual", "845, 310, 260, 130")],
    "Variance = actual − budget per category", "Budget variance",
    (v) => {
      const b = parseNumList(String(v.budget), 1), a = parseNumList(String(v.actual), 1);
      if (!b.ok) return b;
      if (!a.ok) return a;
      if (b.value.length !== a.value.length) return err("Budget and actual lists must have equal length.");
      const diffs = a.value.map((x, i) => x - b.value[i]);
      return [["Total variance", diffs.reduce((x, y) => x + y, 0), 2, "$", true],
        ["Per-category variance", diffs.map((d) => d.toFixed(2)).join(", ")],
        ["Over budget categories", diffs.filter((d) => d > 0).length, 0]];
    }),

  // ── C81 Retail Pricing and Shopping (10) ───────────────────────────────────
  mk("sale-price", [p("Price", 89.99, "$"), p("Discount", 25, "%", { max: 100 })],
    "Sale = price × (1 − discount)", "Sale price",
    (v) => [["Sale price", v.price * (1 - v.discount / 100), 2, "$", true],
      ["Amount saved", v.price * (v.discount / 100), 2, "$"]]),

  mk("percent-off", [p("Price", 120, "$"), p("Percent off", 30, "%", { max: 100 })],
    "Saving = price × percent/100", "Percent off",
    (v) => [["Saving", v.price * (v["percent-off"] / 100), 2, "$", true],
      ["Final price", v.price * (1 - v["percent-off"] / 100), 2, "$"]]),

  mkx("bogo-value", [p("Unit price", 40, "$"), it("Units bought", 3, { min: 1 }), s("Offer", [["bogo_free", "Buy one get one free (2nd free)"], ["bogo_half", "Buy one get one 50% off"]], "bogo_half")],
    "Effective discount depends on how many items are purchased", "BOGO offer value",
    (v) => {
      const n0 = Number(v["units-bought"]);
      const full = n0 * Number(v["unit-price"]);
      const halfPrice = Number(v["unit-price"]) / 2;
      let paid = 0;
      for (let i = 0; i < n0; i++) {
        const isSecond = Math.floor(i / 2) * 2 + 1 === i;
        paid += isSecond ? (v.offer === "bogo_free" ? 0 : halfPrice) : Number(v["unit-price"]);
      }
      return [["Total paid", paid, 2, "$", true],
        ["Effective discount", ((full - paid) / full) * 100, 2, "%"],
        ["Saving", full - paid, 2, "$"]];
    },
    { assumptions: ["'Buy one get one 50% off' is 25% off when two items are purchased, not 50% off."] }),

  mk("tip-calculator", [p("Bill", 84.5, "$"), p("Tip", 18, "%", { max: 100 }), it("People", 4, { min: 1 })],
    "Tip = bill × tip%; per person = (bill + tip)/people", "Tip calculator",
    (v) => {
      const tip = v.bill * (v.tip / 100);
      return [["Tip amount", tip, 2, "$", true], ["Total", v.bill + tip, 2, "$"], ["Per person", (v.bill + tip) / v.people, 2, "$"]];
    },
    { assumptions: ["Whether tax and service charge are included in the base changes the total; this uses the pre-tax bill."] }),

  mk("bill-split", [p("Total", 240, "$"), it("People", 5, { min: 1 }), z("Tax and service", 12, "%")],
    "Per person = total × (1 + tax/service) / people", "Bill split",
    (v) => [["Per person", (v.total * (1 + v["tax-and-service"] / 100)) / v.people, 2, "$", true],
      ["Grand total", v.total * (1 + v["tax-and-service"] / 100), 2, "$"]]),

  mk("service-charge", [p("Bill", 200, "$"), p("Service charge", 12.5, "%"), p("Tax", 8, "%")],
    "Total = bill × (1 + service) × (1 + tax)", "Service charge and tax",
    (v) => {
      const svc = v.bill * (v["service-charge"] / 100);
      const tax = (v.bill + svc) * (v.tax / 100);
      return [["Total", v.bill + svc + tax, 2, "$", true], ["Service", svc, 2, "$"], ["Tax", tax, 2, "$"]];
    }),

  mk("price-match-savings", [p("Price paid", 149.99, "$"), p("Lower price found", 119.99, "$")],
    "Saving = paid − lower price", "Price match savings",
    (v) => [["Saving", Math.max(0, v["price-paid"] - v["lower-price-found"]), 2, "$", true],
      ["Saving percentage", Math.max(0, ((v["price-paid"] - v["lower-price-found"]) / v["price-paid"]) * 100), 2, "%"]]),

  mk("clearance-price", [p("Original price", 200, "$"), it("Steps", 3, { min: 1, max: 10 }), p("Reduction per step", 20, "%", { max: 90 })],
    "Each step multiplies the price by (1 − reduction)", "Clearance price ladder",
    (v) => {
      const prices = Array.from({ length: v.steps }, (_, i) => (v["original-price"] * Math.pow(1 - v["reduction-per-step"] / 100, i + 1)).toFixed(2));
      return [["Final clearance price", Number(prices[prices.length - 1]), 2, "$", true], ["Ladder", prices.join(" → "), undefined, "$"]];
    }),

  mk("cashback-value", [p("Spend", 1200, "$"), p("Cashback rate", 2, "%"), it("Expiry months", 12, { min: 1, max: 60 })],
    "Cashback = spend × rate; value decays if it expires unused", "Cashback value",
    (v) => {
      const cb = v.spend * (v["cashback-rate"] / 100);
      return [["Cashback earned", cb, 2, "$", true],
        ["Effective discount", (cb / v.spend) * 100, 2, "%"],
        ["Value if unused by expiry", 0, 2, "$"]];
    },
    { limitations: ["Cashback is not equivalent to a discount if it expires or is paid in restricted points."] }),

  mk("landed-retail-price", [p("Cost", 45, "$"), p("Shipping", 6.5, "$"), p("Import tax", 12, "%"), z("Handling", 2, "$")],
    "Total = (cost + shipping) × (1 + tax) + handling", "Landed retail price",
    (v) => {
      const base = v.cost + v.shipping;
      return [["Landed cost", base * (1 + v["import-tax"] / 100) + v.handling, 2, "$", true],
        ["Tax paid", base * (v["import-tax"] / 100), 2, "$"]];
    }),

  // ── C82 Pets and Animal Care (8) ───────────────────────────────────────────
  mkx("pet-age-human-years", [s("Species", [["dog_small", "Dog (under 20 lb)"], ["dog_medium", "Dog (20–50 lb)"], ["dog_large", "Dog (over 50 lb)"], ["cat", "Cat"]], "dog_medium"), p("Pet age", 4, "years")],
    "Year 1 ≈ 15 human years, year 2 ≈ +9, then size-specific annual increments (AAHA/AVMA convention)", "Pet age conversion",
    (v) => {
      const a = Number(v["pet-age"]);
      const cat = v.species === "cat";
      const perYear = cat ? 4 : v.species === "dog_small" ? 4 : v.species === "dog_medium" ? 5 : 6;
      const human = a <= 1 ? a * 15 : a <= 2 ? 15 + (a - 1) * 9 : 24 + (a - 2) * perYear;
      return [["Equivalent human age", human, 1, "years", true]];
    },
    { limitations: ["The ×7 rule is a myth. Species- and size-specific curves are estimates; body condition matters more than calendar age. Not veterinary advice."] }),

  mk("pet-calorie-mer", [p("Body weight", 12, "kg"), p("Life-stage factor", 1.6)],
    "RER = 70 × kg^0.75; MER = RER × factor", "Resting and maintenance energy",
    (v) => {
      const rer = 70 * Math.pow(v["body-weight"], 0.75);
      return [["Resting energy requirement (RER)", rer, 0, "kcal/day", true],
        ["Maintenance energy (MER)", rer * v["life-stage-factor"], 0, "kcal/day"]];
    },
    { limitations: ["Life-stage and neuter factors come from WSAVA/AAHA guidance and vary; body condition score should guide feeding more than a formula. Not veterinary advice."] }),

  mk("pet-food-portion", [p("Daily calories", 700, "kcal/day"), p("Food energy density", 3600, "kcal/kg")],
    "Grams = calories / (kcal per kg) × 1000", "Pet food portion",
    (v) => [["Daily food", (v["daily-calories"] / v["food-energy-density"]) * 1000, 0, "g/day", true],
      ["Per meal (2 meals)", (v["daily-calories"] / v["food-energy-density"]) * 500, 0, "g"]]),

  mk("pet-water-intake", [p("Body weight", 12, "kg"), p("mL per kg per day", 55)],
    "Water ≈ 50–60 mL/kg/day for dogs and cats", "Pet water intake estimate",
    (v) => [["Daily water estimate", (v["body-weight"] * v["ml-per-kg-per-day"]) / 1000, 2, "L/day", true]],
    { limitations: ["A clinical rule of thumb; illness, heat and diet change it. Never use it for diagnosis."] }),

  mk("aquarium-volume", [p("Length", 90, "cm"), p("Width", 40, "cm"), p("Height", 50, "cm"), p("Substrate and decor displacement", 8, "%", { max: 60 })],
    "Litres = L × W × H / 1000, minus displacement", "Aquarium volume",
    (v) => {
      const litres = (v.length * v.width * v.height) / 1000;
      return [["Gross volume", litres, 1, "L", true],
        ["Usable water volume", litres * (1 - v["substrate-and-decor-displacement"] / 100), 1, "L"],
        ["Volume in US gallons", litres / 3.785411784, 1, "gal"]];
    },
    { assumptions: ["Internal dimensions; glass thickness reduces usable volume slightly."] }),

  mk("fish-stocking-density", [p("Water volume", 100, "L"), p("Adult fish length", 6, "cm"), p("Surface area per cm of fish", 30, "cm²/cm")],
    "Advisory capacity = water surface area / surface-area ratio", "Stocking density advisory",
    (v) => {
      const litres = v["water-volume"];
      const surface = Math.pow(litres, 2 / 3) * 100;
      const capacity = surface / v["surface-area-per-cm-of-fish"];
      return [["Advisory total fish length", capacity, 0, "cm"],
        ["Advisory number of fish", Math.floor(capacity / v["adult-fish-length"]), 0, "fish", true]];
    },
    { limitations: ["Stocking rules (including 'one inch per gallon') are folklore with no welfare basis. Filtration, species behaviour and water chemistry dominate. This is arithmetic on your own ratio, not welfare guidance — specialist review required."] }),

  mk("pet-medication-dose", [p("Body weight", 12, "kg"), p("Prescribed dose", 2.5, "mg/kg"), p("Maximum daily dose", 100, "mg")],
    "Dose = weight × mg/kg, capped at the prescribed maximum", "Pet medication dose",
    (v) => {
      const raw = v["body-weight"] * v["prescribed-dose"];
      return [["Calculated dose", Math.min(raw, v["maximum-daily-dose"]), 2, "mg", true],
        ["Capped by maximum", raw > v["maximum-daily-dose"] ? "Yes" : "No"]];
    },
    { limitations: ["Prescription-only. The dose must come from the treating veterinarian for the specific species, indication and formulation. This tool does not provide veterinary dosing advice — specialist review required."] }),

  mk("pet-insurance-cost", [p("Base premium", 320, "$/yr"), p("Age loading", 25, "%"), p("Cover level factor", 1.2)],
    "Premium = base × (1 + age loading) × cover factor", "Pet insurance estimate",
    (v) => [["Estimated annual premium", v["base-premium"] * (1 + v["age-loading"] / 100) * v["cover-level-factor"], 2, "$/yr", true],
      ["Monthly equivalent", (v["base-premium"] * (1 + v["age-loading"] / 100) * v["cover-level-factor"]) / 12, 2, "$/mo"]]),

  // ── C83 Specialised Trades and Building Services (14) ──────────────────────
  mk("occupancy-load", [p("Floor area", 420, "m²"), p("Area per occupant", 9.3, "m²/person")],
    "Occupants = floor area / area per occupant from the applicable code table", "Occupancy load",
    (v) => [["Occupant load", Math.ceil(v["floor-area"] / v["area-per-occupant"]), 0, "persons", true],
      ["Area per occupant used", v["area-per-occupant"], 2, "m²"]],
    { limitations: ["Occupant-load factors come from the applicable building code table (function of use) and are code-licensed. Enter the factor from your jurisdiction's code — specialist code review required."] }),

  mk("egress-width", [p("Occupant load", 260), p("Width per person", 5, "mm/person")],
    "Required clear width = occupants × width per person", "Egress width",
    (v) => [["Required clear egress width", v["occupant-load"] * v["width-per-person"], 0, "mm", true],
      ["In metres", (v["occupant-load"] * v["width-per-person"]) / 1000, 2, "m"]],
    { limitations: ["Width factors, minimums, door-leaf rules and travel distances are code-specific and licensed. Enter the factor from your code — specialist code review required."] }),

  mk("parking-space-count", [p("Gross floor area", 2400, "m²"), p("Area per space", 40, "m²/space")],
    "Spaces = floor area / area per space from the zoning schedule", "Parking space count",
    (v) => [["Required parking spaces", Math.ceil(v["gross-floor-area"] / v["area-per-space"]), 0, "spaces", true]],
    { limitations: ["Parking ratios come from local zoning ordinances and vary by use, transit access and district. Enter your local ratio — specialist code review required."] }),

  mk("restroom-fixture-count", [p("Occupant load", 240), p("Occupants per fixture", 25)],
    "Fixtures = ceil(occupant load / occupants per fixture)", "Restroom fixture count",
    (v) => [["Required fixtures", Math.ceil(v["occupant-load"] / v["occupants-per-fixture"]), 0, "fixtures", true]],
    { limitations: ["Fixture ratios come from the plumbing code table and depend on use group and gender split. Enter your code values — specialist code review required."] }),

  mk("fire-extinguisher-coverage", [p("Floor area", 1200, "m²"), p("Max area per extinguisher", 280, "m²")],
    "Units = ceil(area / maximum travel-area coverage)", "Fire extinguisher coverage",
    (v) => [["Minimum extinguishers", Math.ceil(v["floor-area"] / v["max-area-per-extinguisher"]), 0, "units", true]],
    { limitations: ["NFPA 10 coverage rules, hazard classes and travel distances are licensed and mandatory. Enter the values from your adopted code and fire-engineer review."] }),

  mk("lighting-level", [p("Luminous flux", 3200, "lm"), p("Utilisation factor", 0.65), p("Maintenance factor", 0.8), p("Area", 24, "m²")],
    "E = Φ × CU × MF / A (lumen method)", "Illuminance by the lumen method",
    (v) => [["Maintained illuminance", (v["luminous-flux"] * v["utilisation-factor"] * v["maintenance-factor"]) / v.area, 0, "lux", true],
      ["Lumens installed", v["luminous-flux"], 0, "lm"]],
    { assumptions: ["CU and MF are project-specific; defaults are illustrative and should be replaced with manufacturer/room-index data."] }),

  mkx("pool-volume", [p("Length", 12, "m"), p("Width", 6, "m"), s("Shape", [["rect_flat", "Rectangular, constant depth"], ["rect_slope", "Rectangular, shallow to deep"], ["round", "Round"]], "rect_flat"), p("Shallow depth", 1.2, "m"), p("Deep depth", 2.0, "m")],
    "Volume = area × depth (average depth for sloped floors)", "Swimming pool volume",
    (v) => {
      let litres: number;
      if (v.shape === "round") litres = Math.PI * (v.length / 2) ** 2 * v["shallow-depth"] * 1000;
      else if (v.shape === "rect_slope") litres = v.length * v.width * ((v["shallow-depth"] + v["deep-depth"]) / 2) * 1000;
      else litres = v.length * v.width * v["shallow-depth"] * 1000;
      return [["Volume", litres / 1000, 1, "m³", true], ["Volume", litres, 0, "L"],
        ["US gallons", litres / 3.785411784, 0, "gal"]];
    }),

  mk("pool-chlorine-dose", [p("Pool volume", 60000, "L"), p("Current free chlorine", 0.5, "ppm"), p("Target free chlorine", 3.0, "ppm"), p("Product strength", 65, "%")],
    "Mass = volume × Δppm / (1000 × product strength)", "Pool chlorine dose",
    (v) => {
      if (v["target-free-chlorine"] <= v["current-free-chlorine"]) return err("Target free chlorine must exceed the current reading.");
      const delta = v["target-free-chlorine"] - v["current-free-chlorine"];
      const grams = (v["pool-volume"] * delta) / (1000 * (v["product-strength"] / 100));
      return [["Product to add", grams, 1, "g", true], ["Free chlorine increase", delta, 2, "ppm"]];
    },
    { limitations: ["Free chlorine effectiveness depends on cyanuric acid (FC/CYA ratio); simple ppm targets without CYA are misleading. Follow local pool-operator guidance."] }),

  mk("septic-tank-size", [it("Bedrooms", 4, { min: 1, max: 10 }), p("Daily flow per bedroom", 750, "L/day"), it("Retention days", 2, { min: 1, max: 5 })],
    "Volume = bedrooms × flow per bedroom × retention days", "Septic tank sizing",
    (v) => [["Required tank volume", v.bedrooms * v["daily-flow-per-bedroom"] * v["retention-days"], 0, "L", true],
      ["Daily design flow", v.bedrooms * v["daily-flow-per-bedroom"], 0, "L/day"]],
    { limitations: ["Septic sizing rules are local regulation (setbacks, soil testing, percolation). Enter your local parameters — specialist review required."] }),

  mk("fence-post-spacing", [p("Fence run", 48, "m"), p("Post spacing", 2.4, "m"), it("Rails", 2, { min: 1, max: 4 })],
    "Posts = ceil(run / spacing) + 1; rails = bays × rails", "Fence post spacing",
    (v) => {
      const bays = Math.ceil(v["fence-run"] / v["post-spacing"]);
      return [["Posts required", bays + 1, 0, "posts", true], ["Bays (rail spans)", bays, 0],
        ["Rail length", bays * v["post-spacing"] * v.rails, 1, "m"]];
    }),

  mk("driveway-slope", [p("Rise", 0.45, "m"), p("Run", 9.0, "m")],
    "Slope% = rise / run × 100; ratio and angle", "Driveway slope",
    (v) => [["Slope", (v.rise / v.run) * 100, 1, "%", true],
      ["Ratio", `1 : ${(v.run / v.rise).toFixed(1)}`],
      ["Angle", (Math.atan2(v.rise, v.run) * 180) / Math.PI, 1, "°"]]),

  mk("acoustic-panel-count", [p("Room volume", 108, "m³"), p("Target RT60", 0.5, "s"), p("Panel absorption", 0.9, "m² Sabine per m²"), p("Panel area", 1.2, "m²")],
    "Sabine: A = 0.161 V / RT60; panels = (A − existing) / (α × panel area)", "Acoustic panel count",
    (v) => {
      const required = (0.161 * v["room-volume"]) / v["target-rt60"];
      const perPanel = v["panel-absorption"] * v["panel-area"];
      return [["Required total absorption", required, 1, "m² Sabine", true],
        ["Panels required", Math.ceil(required / perPanel), 0, "panels"]];
    },
    { assumptions: ["Sabine equation assumes a diffuse field and uniform absorption; it is unreliable in heavily treated or odd-shaped rooms."] }),

  mk("kitchen-ventilation", [p("Appliance load", 12, "kW"), p("CFM per kW", 100, "CFM/kW"), p("Hood capture factor", 1.1)],
    "CFM = appliance load × CFM per kW × capture factor", "Kitchen ventilation",
    (v) => [["Required exhaust airflow", v["appliance-load"] * v["cfm-per-kw"] * v["hood-capture-factor"], 0, "CFM", true],
      ["In m³/h", v["appliance-load"] * v["cfm-per-kw"] * v["hood-capture-factor"] * 1.699, 0, "m³/h"]],
    { limitations: ["Commercial kitchen ventilation is governed by licensed mechanical codes and hood-listing requirements; enter your code factors."] }),

  mk("sign-area-permit", [p("Sign width", 3.0, "m"), p("Sign height", 1.2, "m"), p("Street frontage", 20, "m"), p("Permitted area per frontage", 0.1, "ratio")],
    "Sign area vs permitted area = frontage × ratio", "Sign area and permit limit",
    (v) => {
      const area = v["sign-width"] * v["sign-height"];
      const allowed = v["street-frontage"] * v["permitted-area-per-frontage"];
      return [["Sign area", area, 2, "m²", true], ["Permitted area", allowed, 2, "m²"],
        ["Status", area <= allowed ? "Within limit" : "Exceeds limit"]];
    },
    { limitations: ["Sign codes are jurisdiction-specific (area, height, illumination, historic districts). Enter your local ratio — specialist code review required."] }),

  // ── C84 Cross-Domain Utilities (8) ─────────────────────────────────────────
  mk("number-to-words", [it("Number", 1234567, { min: -999999999, max: 999999999 })],
    "English scale words (thousand, million, billion) with hyphenated tens", "Integer to words",
    (v) => [["In words", numberToWordsEn(v.number), undefined, true],
      ["Digits", v.number.toLocaleString("en-US"), undefined]]),

  mkx("roman-numerals", [t("Value", "2026"), s("Direction", [["toRoman", "Number → Roman"], ["fromRoman", "Roman → number"]], "toRoman")],
    "Standard subtractive notation; maximum three repeats (no IIII)", "Number or Roman numeral",
    (v) => {
      if (v.direction === "toRoman") {
        const num0 = Number(v.value);
        if (!Number.isInteger(num0) || num0 < 1 || num0 > 3999) return err("Standard Roman numerals cover integers 1–3999.");
        return [["Roman numeral", toRoman(num0), undefined, true]];
      }
      const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      const s0 = String(v.value).toUpperCase().trim();
      if (!/^[IVXLCDM]+$/.test(s0)) return err("Enter a Roman numeral using I, V, X, L, C, D, M.");
      let total = 0;
      for (let i = 0; i < s0.length; i++) {
        const cur = map[s0[i]], next = map[s0[i + 1]] ?? 0;
        total += cur < next ? -cur : cur;
      }
      if (toRoman(total) !== s0) return err("That numeral is not in standard subtractive form.");
      return [["Numeric value", total, 0, undefined, true]];
    }),

  mk("reading-time", [p("Words", 1200), p("Reading speed", 230, "words/min")],
    "Time = words / WPM", "Reading time",
    (v) => [["Reading time", v.words / v["reading-speed"], 1, "min", true],
      ["Reading time", `${Math.floor(v.words / v["reading-speed"])}m ${Math.round(((v.words / v["reading-speed"]) % 1) * 60)}s`]],
    { assumptions: ["200–250 wpm is a convention; technical content is slower. The rate is exposed as an input."] }),

  mk("typing-speed", [p("Words", 450), p("Minutes", 5, "min"), it("Errors", 9, { min: 0 })],
    "Gross WPM = words / minutes; accuracy = (words − errors) / words", "Typing speed",
    (v) => {
      const gross = v.words / v.minutes;
      return [["Gross WPM", gross, 1, "wpm", true], ["Net WPM", gross - v.errors / v.minutes, 1, "wpm"],
        ["Accuracy", ((v.words - v.errors) / v.words) * 100, 2, "%"]];
    }),

  mkx("character-count", [t("Text", "Calculate with confidence — every result is explained.")],
    "Counts Unicode code points, UTF-8 bytes, words and lines", "Any text",
    (v) => {
      const text = String(v.text);
      const bytes = new TextEncoder().encode(text).length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return [["Characters (code points)", Array.from(text).length, 0, "chars", true],
        ["UTF-8 bytes", bytes, 0, "bytes"],
        ["Words (whitespace-delimited)", words, 0, "words"],
        ["Lines", text.split("\n").length, 0, "lines"]];
    },
    { assumptions: ["Word count uses whitespace boundaries; Unicode word boundaries give different counts for hyphenated and CJK text."] }),

  mkx("word-count", [t("Text", "One two three. Four five! Six seven?")],
    "Words via whitespace split; sentences via terminal punctuation", "Any text",
    (v) => {
      const text = String(v.text).trim();
      if (!text) return err("Enter some text.");
      const words = text.split(/\s+/).length;
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;
      return [["Words", words, 0, "words", true], ["Sentences", sentences, 0],
        ["Average words per sentence", words / sentences, 1]];
    }),

  mk("password-entropy", [it("Length", 16, { min: 1, max: 256 }), p("Alphabet size", 94, "characters")],
    "H = L × log₂(alphabet size) for a truly random password", "Password entropy",
    (v) => {
      const bits = v.length * Math.log2(v["alphabet-size"]);
      return [["Entropy", bits, 1, "bits", true],
        ["Search-space exponent", Math.pow(2, Math.min(bits, 1024)).toExponential(2), undefined]];
    },
    { limitations: ["Entropy assumes uniform random generation. Human-chosen passwords have far lower effective entropy — this must not be read as real-world strength."] }),

  mkx("qr-code-capacity", [it("Version", 10, { min: 1, max: 40 }), s("Error correction", [["L", "L (≈7%)"], ["M", "M (≈15%)"], ["Q", "Q (≈25%)"], ["H", "H (≈30%)"]], "M"), s("Mode", [["byte", "Byte"], ["numeric", "Numeric"], ["alphanumeric", "Alphanumeric"]], "byte")],
    "Approximate data capacity from the QR version and EC level", "QR code parameters",
    (v) => {
      const v0 = Number(v.version);
      const totalCodewords = Math.floor((16 * v0 * v0 + 128 * v0 + 64) / 25) * 1;
      const ecFactor = v["error-correction"] === "L" ? 0.93 : v["error-correction"] === "M" ? 0.85 : v["error-correction"] === "Q" ? 0.75 : 0.65;
      const dataCodewords = Math.floor(totalCodewords * ecFactor);
      const bytes = dataCodewords - 3;
      const cap = v.mode === "numeric" ? Math.floor(bytes * 3) : v.mode === "alphanumeric" ? Math.floor(bytes * 2) : bytes;
      return [["Approximate character capacity", Math.max(0, cap), 0, "characters", true],
        ["Data codewords", Math.max(0, dataCodewords), 0], ["Version", v0, 0]];
    },
    { limitations: ["Approximation from total-codeword counts; exact capacities per version/EC block structure are tabulated in ISO/IEC 18004 (licensed). Verify with an encoder."] }),
];
