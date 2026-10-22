import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import type { CalcField } from "@/lib/engine/types";
import { it, mk, mkx, n, p, s, t, z } from "@/lib/engine/dsl";
import {
  erf,
  formatISODateUTC,
  gcdInt,
  parseHexRGB,
  parseISODateUTC,
  parseIPv4,
  ipv4ToInt,
  intToIPv4,
  parseNumList,
} from "@/lib/engine/helpers";

const D2R = Math.PI / 180;

/** Generic multiplicative unit converter: factor = value in base units. */
function converter(
  slug: string,
  quantity: string,
  units: Array<[string, string, number]>,
  note?: string
): CalculatorSpec {
  const fields: CalcField[] = [
    n("Value", 1),
    s("Unit", units.map(([v, l]) => [v, l]), units[0][0]),
  ];
  return mkx(
    slug,
    fields,
    "result = value × factor(from) / factor(to), via the base unit",
    `${quantity} units`,
    (v) => {
      const value = Number(v.value);
      const from = units.find(([u]) => u === v.unit);
      if (!from) return err("Select a valid input unit.");
      const base = value * from[2];
      return units.map(([u, label, f]) => {
        const out = base / f;
        const dp = Math.abs(out) >= 1e6 || (Math.abs(out) < 1e-4 && out !== 0) ? 8 : 6;
        return [label, out, dp, u] as [string, number, number, string];
      });
    },
    { limitations: note ? [note] : ["Factors are exact SI definitions; rounding is applied only to the displayed result."] }
  );
}

export const M08_SPECS: CalculatorSpec[] = [
  // ── C58 Fitness and Exercise (14) ──────────────────────────────────────────
  mkx("one-rep-max", [p("Weight", 80, "kg"), it("Reps", 5, { min: 1, max: 20 }), s("Formula", [["epley", "Epley"], ["brzycki", "Brzycki"]], "epley")],
    "Epley: 1RM = w(1 + reps/30); Brzycki: 1RM = w × 36/(37 − reps)", "Load and repetitions",
    (v) => {
      const w = Number(v.weight), r = Number(v.reps);
      const epley = w * (1 + r / 30);
      const brzycki = w * (36 / (37 - r));
      return [["Estimated 1RM (Epley)", epley, 1, "kg", true], ["Estimated 1RM (Brzycki)", brzycki, 1, "kg"],
        ["Formula spread", Math.abs(epley - brzycki), 1, "kg"]];
    },
    { limitations: ["Estimates diverge above ~10 reps and are not a measured maximum. Warm up and use a spotter; never test a true 1RM without supervision."] }),

  mk("training-volume", [p("Sets", 4), p("Reps", 8), p("Load", 80, "kg")],
    "Tonnage = sets × reps × load", "Weekly training volume",
    (v) => [["Total volume", v.sets * v.reps * v.load, 0, "kg", true], ["Total reps", v.sets * v.reps, 0, "reps"]]),

  mk("running-pace", [p("Distance", 10, "km"), p("Time", 50, "min")],
    "Pace = time / distance; speed = distance / time", "Pace and speed",
    (v) => {
      const pace = v.time / v.distance;
      const mm = Math.floor(pace), ss = Math.round((pace - mm) * 60);
      return [["Pace", `${mm}:${String(ss).padStart(2, "0")} min/km`, undefined, true],
        ["Speed", (v.distance / v.time) * 60, 2, "km/h"],
        ["Pace per mile", `${Math.floor(pace * 1.609344)}:${String(Math.round((pace * 1.609344 % 1) * 60)).padStart(2, "0")} min/mi`]];
    }),

  mk("split-times", [p("Target time", 90, "min"), it("Splits", 6, { min: 1 })],
    "Split = target / splits", "Even split pacing",
    (v) => {
      const sp = v["target-time"] / v.splits;
      return [["Time per split", sp, 2, "min", true], ["Split in min:sec", `${Math.floor(sp)}:${String(Math.round((sp % 1) * 60)).padStart(2, "0")}`]];
    }),

  mk("vo2max-cooper", [p("12-minute distance", 2400, "m")],
    "VO₂max = (distance − 504.9) / 44.73", "Cooper 12-minute run test",
    (v) => {
      const vo2 = (v["12-minute-distance"] - 504.9) / 44.73;
      return [["Estimated VO₂max", vo2, 1, "mL/kg/min", true]];
    },
    { limitations: ["Field estimate, not a laboratory measurement; accuracy is roughly ±10–15%."] }),

  mk("heart-rate-zones", [p("Age", 35, "years", { max: 110 }), z("Resting heart rate", 60, "bpm")],
    "HRmax = 220 − age (population average); zones as % of HRmax", "Percent-of-max heart-rate zones",
    (v) => {
      const max = 220 - v.age;
      return [["Maximum heart rate (220 − age)", max, 0, "bpm", true],
        ["Zone 1 (50–60%)", `${Math.round(max * 0.5)} – ${Math.round(max * 0.6)} bpm`],
        ["Zone 2 (60–70%)", `${Math.round(max * 0.6)} – ${Math.round(max * 0.7)} bpm`],
        ["Zone 3 (70–80%)", `${Math.round(max * 0.7)} – ${Math.round(max * 0.8)} bpm`],
        ["Zone 4 (80–90%)", `${Math.round(max * 0.8)} – ${Math.round(max * 0.9)} bpm`],
        ["Reserve-based max (Tanaka 208 − 0.7age)", 208 - 0.7 * v.age, 0, "bpm"]];
    },
    { limitations: ["220 − age is a population average with ±10–12 bpm standard deviation; Tanaka (208 − 0.7 × age) is offered as an alternative."] }),

  mk("met-calorie-burn", [p("MET value", 7.0), p("Body mass", 70, "kg"), p("Minutes", 45, "min")],
    "kcal = MET × 3.5 × kg / 200 × minutes", "Calories from MET values",
    (v) => [["Calories burned", (v["met-value"] * 3.5 * v["body-mass"] * v.minutes) / 200, 0, "kcal", true]],
    { assumptions: ["MET values come from the Compendium of Physical Activities and are population averages."] }),

  mk("steps-to-distance", [p("Steps", 8000), p("Stride length", 0.74, "m")],
    "Distance = steps × stride", "Steps to distance",
    (v) => [["Distance", (v.steps * v["stride-length"]) / 1000, 2, "km", true], ["Distance", (v.steps * v["stride-length"]) / 1609.344, 2, "mi"]]),

  mk("riegel-prediction", [p("Known distance", 10, "km"), p("Known time", 50, "min"), p("Target distance", 21.0975, "km"), p("Riegel exponent", 1.06)],
    "T₂ = T₁ × (D₂/D₁)^1.06", "Riegel race-time prediction",
    (v) => {
      const t = v["known-time"] * Math.pow(v["target-distance"] / v["known-distance"], v["riegel-exponent"]);
      return [["Predicted time", t, 1, "min", true], ["Predicted pace", t / v["target-distance"], 2, "min/km"]];
    },
    { limitations: ["Riegel's exponent assumes comparable training and conditions; ultra distances and heat deviate significantly."] }),

  mk("swim-pace", [p("Distance", 1500, "m"), p("Time", 25, "min")],
    "Pace per 100 m = time / distance × 100", "Swim pace",
    (v) => {
      const per100 = (v.time / v.distance) * 100;
      return [["Pace per 100 m", `${Math.floor(per100)}:${String(Math.round((per100 % 1) * 60)).padStart(2, "0")}`, undefined, true],
        ["Speed", (v.distance / v.time) * 60 / 1000, 3, "km/h"]];
    }),

  mk("cycling-speed-power", [p("Power", 220, "W"), p("Total mass", 85, "kg"), p("Grade", 2, "%"), p("Drivetrain efficiency", 97, "%")],
    "Steady-state power balance (rolling + gravity + aero), solved for speed", "Cycling speed estimate",
    (v) => {
      const eff = v["drivetrain-efficiency"] / 100;
      const crr = 0.005, rho = 1.225, cdA = 0.36, g = 9.80665;
      const gradeRad = Math.atan(v.grade / 100);
      const pAvail = v.power * eff;
      const speed = Math.cbrt(pAvail / (0.5 * rho * cdA + crr * v["total-mass"] * g / 10)) ;
      const flat = Math.sqrt(pAvail / (0.5 * rho * cdA + crr * v["total-mass"] * g));
      return [["Estimated speed", flat * 3.6, 1, "km/h", true],
        ["Gravity resistance at this grade", v["total-mass"] * g * Math.sin(gradeRad), 1, "N"],
        ["Approximate climbing speed", speed * 3.6, 1, "km/h"]];
    },
    { limitations: ["Simplified steady-state physics model with assumed Crr 0.005 and CdA 0.36 m²; use a power meter and a proper model for training decisions."] }),

  mk("weight-loss-rate", [p("Daily deficit", 500, "kcal/day")],
    "kg/week = deficit × 7 / 7,700", "Weight-loss rate from energy deficit",
    (v) => [["Expected loss", (v["daily-deficit"] * 7) / 7700, 2, "kg/week", true],
      ["Expected loss", (v["daily-deficit"] * 7) / 7700 / 0.45359237, 2, "lb/week"]]),

  mk("body-recomp", [p("Weight", 82, "kg"), p("Body fat", 24, "%", { max: 70 }), p("Target body fat", 18, "%", { max: 70 })],
    "Lean mass = weight × (1 − BF%); target weight at constant lean mass", "Body recomposition tracker",
    (v) => {
      const lean = v.weight * (1 - v["body-fat"] / 100);
      const targetW = lean / (1 - v["target-body-fat"] / 100);
      return [["Current lean mass", lean, 1, "kg", true], ["Weight at target body fat", targetW, 1, "kg"],
        ["Fat mass to lose", v.weight - targetW, 1, "kg"]];
    },
    { assumptions: ["Assumes lean mass is preserved; real recomposition involves water and glycogen shifts."] }),

  mk("treadmill-incline", [p("Treadmill speed", 10, "km/h"), p("Incline", 5, "%")],
    "Outdoor-equivalent effort adds vertical gain work", "Treadmill incline equivalence",
    (v) => {
      const vert = v["treadmill-speed"] * 1000 * (v.incline / 100) / 60;
      return [["Vertical gain", vert, 1, "m/min", true], ["Flat-equivalent speed (approx.)", v["treadmill-speed"] * (1 + v.incline * 0.05), 2, "km/h"],
        ["Equivalent 1% rule speed", v["treadmill-speed"] + v["treadmill-speed"] * v.incline * 0.02, 2, "km/h"]];
    },
    { limitations: ["Treadmill running lacks air resistance and uses a belt; equivalence rules vary by pace and body mass."] }),

  // ── C59 Health and Clinical Screening (16) ─────────────────────────────────
  mkx("egfr-ckdepi", [p("Serum creatinine", 0.9, "mg/dL"), it("Age", 45, { min: 18, max: 110 }), s("Sex", [["female", "Female"], ["male", "Male"]], "female")],
    "CKD-EPI 2021 (race-free): 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.200 × 0.9938^age × (1.012 if female)", "Creatinine, age, sex",
    (v) => {
      const female = v.sex === "female";
      const kappa = female ? 0.7 : 0.9, alpha = female ? -0.241 : -0.302;
      const scr = Number(v["serum-creatinine"]);
      const ratio = scr / kappa;
      const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2)
        * Math.pow(0.9938, Number(v.age)) * (female ? 1.012 : 1);
      const stage = egfr >= 90 ? "G1 (≥90)" : egfr >= 60 ? "G2 (60–89)" : egfr >= 45 ? "G3a (45–59)" : egfr >= 30 ? "G3b (30–44)" : egfr >= 15 ? "G4 (15–29)" : "G5 (<15)";
      return [["eGFR", egfr, 1, "mL/min/1.73 m²", true], ["KDIGO GFR category", stage],
        ["Screening note", "Requires clinical interpretation; single values are not a diagnosis"]];
    },
    { limitations: ["CKD-EPI 2021 creatinine equation (race-free). Do not mix with MDRD or CKD-EPI 2009 values. Not validated in acute kidney injury, extremes of muscle mass, or pregnancy — clinical review required."] }),

  mk("creatinine-clearance", [it("Age", 62, { min: 18, max: 110 }), p("Weight", 78, "kg"), p("Serum creatinine", 1.1, "mg/dL"), s("Sex", [["male", "Male"], ["female", "Female"]], "male")],
    "Cockcroft–Gault: CrCl = ((140 − age) × weight) / (72 × Scr) × 0.85 if female", "Estimated creatinine clearance",
    (v) => {
      const crcl = (((140 - Number(v.age)) * Number(v.weight)) / (72 * Number(v["serum-creatinine"]))) * (v.sex === "female" ? 0.85 : 1);
      return [["Creatinine clearance", crcl, 1, "mL/min", true], ["Note", "CrCl is not eGFR"]];
    },
    { limitations: ["Cockcroft–Gault estimates creatinine clearance for drug-dosing contexts and is not interchangeable with eGFR. Pharmacist/clinician review required."] }),

  mkx("blood-alcohol-widmark", [p("Alcohol mass", 28, "g"), p("Body mass", 70, "kg"), p("Hours since first drink", 2, "h"), s("Sex", [["male", "Male (r = 0.73)"], ["female", "Female (r = 0.66)"]], "male")],
    "Widmark: BAC% = (A × 5.14 / (W × r)) − 0.015t", "Estimated blood alcohol (Widmark)",
    (v) => {
      const r = v.sex === "female" ? 0.66 : 0.73;
      const bac = ((Number(v["alcohol-mass"]) * 5.14) / (Number(v["body-mass"]) * r)) - 0.015 * Number(v["hours-since-first-drink"]);
      return [["Estimated BAC", Math.max(0, bac), 3, "% w/v", true], ["Status", bac <= 0 ? "Estimated sober" : "Above zero — do not drive"]];
    },
    { limitations: ["Widmark is a coarse estimate that ignores absorption kinetics, food and liver function. It is unsuitable for legal, driving or safety decisions — never rely on it."] }),

  mkx("due-date-naegele", [t("Last menstrual period", "2026-01-15"), it("Cycle length", 28, { min: 20, max: 45 })],
    "EDD = LMP + 280 days, adjusted by (cycle − 28) days", "Estimated due date",
    (v) => {
      const lmp = parseISODateUTC(String(v["last-menstrual-period"]));
      if (!lmp) return err("Enter the LMP date as YYYY-MM-DD.");
      const edd = new Date(lmp.getTime() + (280 + (Number(v["cycle-length"]) - 28)) * 86400000);
      const today = new Date();
      const days = Math.floor((edd.getTime() - Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())) / 86400000);
      return [["Estimated due date", formatISODateUTC(edd), undefined, true], ["Days from today", days, 0, "days"]];
    },
    { limitations: ["Naegele's rule is valid only for a regular 28-day cycle; ultrasound dating supersedes it. Not medical advice."] }),

  mkx("ovulation-window", [t("Last menstrual period", "2026-01-15"), it("Cycle length", 28, { min: 20, max: 45 })],
    "Ovulation ≈ cycle length − 14; fertile window = ovulation − 5 to +1 days", "Estimated fertile window",
    (v) => {
      const lmp = parseISODateUTC(String(v["last-menstrual-period"]));
      if (!lmp) return err("Enter the LMP date as YYYY-MM-DD.");
      const ov = new Date(lmp.getTime() + (Number(v["cycle-length"]) - 14) * 86400000);
      const start = new Date(ov.getTime() - 5 * 86400000);
      const end = new Date(ov.getTime() + 86400000);
      return [["Estimated ovulation", formatISODateUTC(ov), undefined, true],
        ["Fertile window", `${formatISODateUTC(start)} → ${formatISODateUTC(end)}`]];
    },
    { limitations: ["Calendar estimates only; cycle variability, illness and ovulation tracking methods change the window materially. Not contraception or fertility advice."] }),

  mk("pediatric-dose-weight", [p("Child weight", 18, "kg"), p("Dose per kg", 10, "mg/kg"), p("Maximum single dose", 500, "mg")],
    "Dose = weight × mg/kg, capped at the stated maximum", "Paediatric weight-based dose",
    (v) => {
      const raw = v["child-weight"] * v["dose-per-kg"];
      return [["Calculated dose", Math.min(raw, v["maximum-single-dose"]), 1, "mg", true],
        ["Capped by maximum", raw > v["maximum-single-dose"] ? "Yes" : "No"]];
    },
    { limitations: ["Requires a prescriber-supplied mg/kg dose and a verified weight. This tool does not provide dosing advice — specialist prescriber oversight is mandatory."] }),

  mk("iv-drip-rate", [p("Volume", 500, "mL"), p("Duration", 4, "h"), p("Drop factor", 20, "gtt/mL")],
    "mL/h = volume / hours; gtt/min = volume × drop factor / minutes", "IV infusion rate",
    (v) => {
      const hours = v.duration;
      return [["Flow rate", v.volume / hours, 1, "mL/h", true],
        ["Drops per minute", (v.volume * v["drop-factor"]) / (hours * 60), 1, "gtt/min"]];
    },
    { limitations: ["Nursing calculation aid only. Independent double-check and local infusion policy are mandatory before administration."] }),

  mk("map-calculation", [p("Systolic", 120, "mmHg"), p("Diastolic", 80, "mmHg")],
    "MAP = DBP + (SBP − DBP)/3", "Mean arterial pressure",
    (v) => [["Mean arterial pressure", v.diastolic + (v.systolic - v.diastolic) / 3, 1, "mmHg", true],
      ["Pulse pressure", v.systolic - v.diastolic, 1, "mmHg"]]),

  mk("anion-gap", [p("Sodium", 140, "mmol/L"), p("Chloride", 102, "mmol/L"), p("Bicarbonate", 24, "mmol/L")],
    "AG = Na⁺ − (Cl⁻ + HCO₃⁻)", "Serum anion gap",
    (v) => [["Anion gap", v.sodium - (v.chloride + v.bicarbonate), 1, "mmol/L", true],
      ["Status", "Requires clinical interpretation with albumin"]],
    { limitations: ["Clinical interpretation is required (albumin correction, lactate, ketones). Not a diagnosis."] }),

  mk("corrected-calcium", [p("Total calcium", 2.35, "mmol/L"), p("Albumin", 40, "g/L")],
    "Corrected Ca = measured Ca + 0.02 × (40 − albumin g/L)", "Albumin-corrected calcium",
    (v) => [["Albumin-corrected calcium", v["total-calcium"] + 0.02 * (40 - v.albumin), 3, "mmol/L", true]],
    { limitations: ["Correction formulas are approximations; ionised calcium is preferred where available. Clinical review required."] }),

  mkx("ldl-friedewald", [p("Total cholesterol", 200, "mg/dL"), p("HDL", 50, "mg/dL"), p("Triglycerides", 150, "mg/dL")],
    "LDL = TC − HDL − TG/5 (valid only when TG < 400 mg/dL)", "Friedewald LDL cholesterol",
    (v) => {
      const tg = Number(v.triglycerides);
      if (tg >= 400) return err("Friedewald is invalid when triglycerides are ≥ 400 mg/dL — use a direct LDL assay.");
      const ldl = Number(v["total-cholesterol"]) - Number(v.hdl) - tg / 5;
      return [["LDL cholesterol", ldl, 0, "mg/dL", true], ["Non-HDL cholesterol", Number(v["total-cholesterol"]) - Number(v.hdl), 0, "mg/dL"]];
    },
    { limitations: ["Friedewald estimation is invalid at TG ≥ 400 mg/dL and less accurate at low LDL. Interpret with clinical context."] }),

  mk("serum-osmolality", [p("Sodium", 140, "mmol/L"), p("Glucose", 5.0, "mmol/L"), p("Urea", 5.0, "mmol/L")],
    "Osmolality ≈ 2Na + glucose + urea (mmol/L)", "Serum osmolality estimate",
    (v) => [["Calculated osmolality", 2 * v.sodium + v.glucose + v.urea, 1, "mOsm/kg", true]],
    { assumptions: ["SI units (mmol/L). The US conventional formula uses glucose/18 + BUN/2.8 in mg/dL."] }),

  mk("pack-years", [p("Cigarettes per day", 20), p("Years smoked", 15, "years")],
    "Pack-years = (cigarettes/day ÷ 20) × years", "Smoking pack-years",
    (v) => [["Pack-years", (v["cigarettes-per-day"] / 20) * v["years-smoked"], 1, "pack-years", true]]),

  mk("fluid-requirement", [p("Body mass", 70, "kg"), p("mL per kg per day", 30, "mL/kg/day")],
    "Maintenance estimate = mass × mL/kg/day", "Daily fluid requirement estimate",
    (v) => [["Daily fluid", (v["body-mass"] * v["ml-per-kg-per-day"]) / 1000, 2, "L/day", true]],
    { limitations: ["Maintenance estimates do not apply in heart failure, renal impairment or other fluid-restricted states. Not clinical advice."] }),

  mk("insulin-correction", [p("Blood glucose", 14, "mmol/L"), p("Target glucose", 7, "mmol/L"), p("Insulin sensitivity factor", 2.5, "mmol/L per unit")],
    "Units = (BG − target) / ISF", "Insulin correction dose",
    (v) => {
      const units = (v["blood-glucose"] - v["target-glucose"]) / v["insulin-sensitivity-factor"];
      return [["Correction dose", Math.max(0, units), 2, "units", true]];
    },
    { limitations: ["Requires clinician-defined ISF and target. Insulin is high-risk; never calculate or administer a dose without the prescribed regimen and clinical oversight."] }),

  mk("cardiovascular-risk", [p("Age", 55, "years"), p("Systolic blood pressure", 135, "mmHg"), p("Total cholesterol", 5.5, "mmol/L"), p("HDL", 1.2, "mmol/L"), z("Smoker", 0)],
    "Parametric 10-year risk estimate from user-supplied coefficients (not a validated published model)", "Cardiovascular risk inputs",
    (v) => {
      const score = 0.05 * (v.age - 40) + 0.02 * (v["systolic-blood-pressure"] - 120) + 0.03 * (v["total-cholesterol"] - 5)
        - 0.05 * (v.hdl - 1.2) + 0.1 * (v.smoker >= 1 ? 1 : 0);
      return [["Parametric risk index", Math.max(0, Math.min(1, score)) * 100, 1, "% (illustrative)", true]];
    },
    { limitations: ["No validated risk equation is embedded. Published models (e.g. ASCVD Pooled Cohort Equations, SCORE2) are population- and region-specific and must be sourced and validated — specialist review required. This index is arithmetic on user-supplied weights only and must not guide treatment."] }),

  // ── C60 Date, Time and Calendar (15) ───────────────────────────────────────
  mkx("date-difference", [t("Start date", "2026-01-15"), t("End date", "2026-10-22")],
    "Calendar difference in days, then completed months and years (UTC calendar arithmetic)", "Two calendar dates",
    (v) => {
      const a = parseISODateUTC(String(v["start-date"])), b = parseISODateUTC(String(v["end-date"]));
      if (!a || !b) return err("Enter both dates as YYYY-MM-DD.");
      const days = Math.round((b.getTime() - a.getTime()) / 86400000);
      let years = b.getUTCFullYear() - a.getUTCFullYear();
      let months = b.getUTCMonth() - a.getUTCMonth();
      let dd = b.getUTCDate() - a.getUTCDate();
      if (dd < 0) { months -= 1; dd += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate(); }
      if (months < 0) { years -= 1; months += 12; }
      return [["Calendar days between", days, 0, "days", true], ["Completed years/months/days", `${years}y ${months}m ${dd}d`],
        ["Weeks and days", `${Math.floor(Math.abs(days) / 7)}w ${Math.abs(days) % 7}d`],
        ["Days inclusive of both endpoints", Math.abs(days) + 1, 0, "days"]];
    }),

  mkx("add-days", [t("Start date", "2026-01-31"), it("Days offset", 45)],
    "Date + offset days using UTC arithmetic", "Start date and day offset",
    (v) => {
      const d = parseISODateUTC(String(v["start-date"]));
      if (!d) return err("Enter the date as YYYY-MM-DD.");
      const out = new Date(d.getTime() + Number(v["days-offset"]) * 86400000);
      const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][out.getUTCDay()];
      return [["New date", formatISODateUTC(out), undefined, true], ["Weekday", weekday]];
    }),

  mkx("business-days", [t("Start date", "2026-01-01"), t("End date", "2026-03-31"), t("Holidays", "2026-01-26, 2026-03-04")],
    "Counts Monday–Friday between dates, excluding listed holidays", "Date range and holiday list",
    (v) => {
      const a = parseISODateUTC(String(v["start-date"])), b = parseISODateUTC(String(v["end-date"]));
      if (!a || !b) return err("Enter both dates as YYYY-MM-DD.");
      if (b < a) return err("End date must not precede the start date.");
      const hols = String(v.holidays).split(",").map((x) => x.trim()).filter(Boolean);
      const holidaySet = new Set(hols.map((h) => h).filter((h) => parseISODateUTC(h)));
      let business = 0, total = 0;
      for (let d = new Date(a); d <= b; d = new Date(d.getTime() + 86400000)) {
        total++;
        const dow = d.getUTCDay();
        if (dow === 0 || dow === 6) continue;
        if (holidaySet.has(formatISODateUTC(d))) continue;
        business++;
      }
      return [["Business days", business, 0, "days", true], ["Calendar days", total, 0, "days"],
        ["Weekend days", total - business - holidaySet.size, 0, "days"]];
    },
    { assumptions: ["Weekend = Saturday/Sunday only. Many jurisdictions use different weekends and holiday calendars — supply your own holiday list."] }),

  mkx("age-calculator", [t("Birth date", "1990-05-17"), t("As of date", "2026-10-22")],
    "Completed years from calendar difference (birthday-adjusted)", "Birth date and reference date",
    (v) => {
      const b = parseISODateUTC(String(v["birth-date"])), r = parseISODateUTC(String(v["as-of-date"]));
      if (!b || !r) return err("Enter both dates as YYYY-MM-DD.");
      if (r < b) return err("Reference date must not precede the birth date.");
      let years = r.getUTCFullYear() - b.getUTCFullYear();
      const beforeBirthday = r.getUTCMonth() < b.getUTCMonth() || (r.getUTCMonth() === b.getUTCMonth() && r.getUTCDate() < b.getUTCDate());
      if (beforeBirthday) years -= 1;
      const days = Math.floor((r.getTime() - b.getTime()) / 86400000);
      const next = new Date(Date.UTC(r.getUTCFullYear() + (beforeBirthday ? 0 : 1), b.getUTCMonth(), b.getUTCDate()));
      return [["Completed age", years, 0, "years", true], ["Total days lived", days, 0, "days"],
        ["Days until next birthday", Math.ceil((next.getTime() - r.getTime()) / 86400000), 0, "days"]];
    }),

  mkx("weekday", [t("Date", "2026-10-22")],
    "Gregorian weekday from the calendar date", "Calendar date",
    (v) => {
      const d = parseISODateUTC(String(v.date));
      if (!d) return err("Enter the date as YYYY-MM-DD.");
      return [["Weekday", ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getUTCDay()], undefined, true],
        ["ISO weekday (1 = Monday)", ((d.getUTCDay() + 6) % 7) + 1, 0]];
    }),

  mkx("iso-week-number", [t("Date", "2026-01-01")],
    "ISO 8601: weeks start Monday; week 1 contains the first Thursday", "Calendar date",
    (v) => {
      const d = parseISODateUTC(String(v.date));
      if (!d) return err("Enter the date as YYYY-MM-DD.");
      const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const dayNum = (target.getUTCDay() + 6) % 7;
      target.setUTCDate(target.getUTCDate() - dayNum + 3);
      const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
      const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
      firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
      const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 86400000));
      return [["ISO week", week, 0, undefined, true], ["ISO week-year", target.getUTCFullYear(), 0]];
    }),

  mk("leap-year", [it("Year", 2028, { min: 1, max: 9999 })],
    "Leap if divisible by 4, except centuries not divisible by 400", "Gregorian leap year test",
    (v) => {
      const y = v.year;
      const leap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
      return [["Leap year", leap ? "Yes" : "No", undefined, true], ["Days in year", leap ? 366 : 365, 0, "days"]];
    }),

  mk("time-duration", [n("Start hour", 9), n("Start minute", 15), n("End hour", 17), n("End minute", 45)],
    "Duration = end − start (same-day, 24-hour clock)", "Clock times",
    (v) => {
      const mins = (v["end-hour"] * 60 + v["end-minute"]) - (v["start-hour"] * 60 + v["start-minute"]);
      if (mins < 0) return err("End time precedes start time; use start/end on the same day or add 24 hours.");
      return [["Duration", mins, 0, "minutes", true], ["Duration", `${Math.floor(mins / 60)}h ${mins % 60}m`],
        ["Decimal hours", mins / 60, 2, "h"]];
    }),

  mk("timezone-shift", [n("Hour", 14), n("Minute", 30), n("Source offset", 5.5), n("Target offset", -5)],
    "Target time = source time + (target offset − source offset)", "Clock time and UTC offsets",
    (v) => {
      const total = v.hour * 60 + v.minute + (v["target-offset"] - v["source-offset"]) * 60;
      const wrapped = ((total % 1440) + 1440) % 1440;
      const dayShift = Math.floor(total / 1440);
      return [["Converted time", `${String(Math.floor(wrapped / 60)).padStart(2, "0")}:${String(wrapped % 60).padStart(2, "0")}`, undefined, true],
        ["Day shift", dayShift, 0, "days"]];
    },
    { assumptions: ["Offsets must be supplied (e.g. +5.5 for IST, −5 for EST). Daylight saving is not applied automatically."] }),

  mk("work-hours", [n("Start hour", 9), n("End hour", 17.5), z("Break minutes", 45, "min")],
    "Hours = (end − start) − breaks", "Worked hours",
    (v) => {
      const raw = v["end-hour"] - v["start-hour"];
      if (raw < 0) return err("End time must be after the start time.");
      const net = raw - v["break-minutes"] / 60;
      return [["Net hours", Math.max(0, net), 2, "h", true], ["Gross hours", raw, 2, "h"],
        ["Minutes worked", Math.max(0, net * 60), 0, "min"]];
    }),

  mkx("countdown", [t("Target date", "2026-12-31"), t("From date", "2026-10-22")],
    "Remaining calendar days between two dates", "Target and reference dates",
    (v) => {
      const a = parseISODateUTC(String(v["from-date"])), b = parseISODateUTC(String(v["target-date"]));
      if (!a || !b) return err("Enter both dates as YYYY-MM-DD.");
      const days = Math.round((b.getTime() - a.getTime()) / 86400000);
      return [["Days remaining", days, 0, "days", true], ["Weeks", (days / 7).toFixed(1), 1, "weeks"],
        ["Status", days > 0 ? "Upcoming" : days === 0 ? "Today" : "Passed"]];
    }),

  mkx("day-of-year", [t("Date", "2026-10-22")],
    "Ordinal day = days since 31 December of the prior year", "Calendar date",
    (v) => {
      const d = parseISODateUTC(String(v.date));
      if (!d) return err("Enter the date as YYYY-MM-DD.");
      const start = Date.UTC(d.getUTCFullYear(), 0, 1);
      const doy = Math.floor((d.getTime() - start) / 86400000) + 1;
      return [["Day of year", doy, 0, "days", true], ["Days remaining in year", (d.getUTCFullYear() % 4 === 0 ? 366 : 365) - doy, 0, "days"]];
    }),

  mkx("iso-date-format", [t("Date", "2026-10-22"), n("Hour", 14), n("Minute", 30), n("UTC offset", 5.5)],
    "ISO 8601 / RFC 3339 representation with explicit offset", "Date/time and offset",
    (v) => {
      const d = parseISODateUTC(String(v.date));
      if (!d) return err("Enter the date as YYYY-MM-DD.");
      const sign = Number(v["utc-offset"]) >= 0 ? "+" : "-";
      const abs = Math.abs(Number(v["utc-offset"]));
      const hh = String(Math.floor(abs)).padStart(2, "0"), mm = String(Math.round((abs % 1) * 60)).padStart(2, "0");
      const iso = `${formatISODateUTC(d)}T${String(Number(v.hour)).padStart(2, "0")}:${String(Number(v.minute)).padStart(2, "0")}:00${sign}${hh}:${mm}`;
      const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), Number(v.hour), Number(v.minute)) - Number(v["utc-offset"]) * 3600000);
      return [["ISO 8601 with offset", iso, undefined, true], ["Equivalent UTC", utc.toISOString()]];
    }),

  mkx("timesheet-total", [t("Daily hours", "8, 7.5, 8, 9, 6.5"), p("Hourly rate", 25, "$/hr")],
    "Total hours × rate", "Timesheet entries",
    (v) => {
      const hours = parseNumList(String(v["daily-hours"]), 1);
      if (!hours.ok) return hours;
      const total = hours.value.reduce((a, b) => a + b, 0);
      return [["Total hours", total, 2, "h", true], ["Gross pay", total * Number(v["hourly-rate"]), 2, "$"],
        ["Overtime hours above 40", Math.max(0, total - 40), 2, "h"]];
    }),

  mkx("date-of-easter", [it("Year", 2026, { min: 1583, max: 4099 })],
    "Anonymous Gregorian computus algorithm", "Gregorian year (1583+)",
    (v) => {
      const y = Number(v.year);
      const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
      const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
      const h = (19 * a + b - d - g + 15) % 30;
      const i = Math.floor(c / 4), k = c % 4;
      const l = (32 + 2 * e + 2 * i - h - k) % 7;
      const m = Math.floor((a + 11 * h + 22 * l) / 451);
      const month = Math.floor((h + l - 7 * m + 114) / 31);
      const day = ((h + l - 7 * m + 114) % 31) + 1;
      return [["Easter Sunday", `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`, undefined, true]];
    },
    { assumptions: ["Gregorian computus (Western Easter). Orthodox Easter uses the Julian computus and usually differs."] }),

  // ── C61 Unit Conversion (16) ───────────────────────────────────────────────
  converter("length-converter", "Length", [
    ["m", "Metres (m)", 1], ["km", "Kilometres (km)", 1000], ["cm", "Centimetres (cm)", 0.01],
    ["mm", "Millimetres (mm)", 0.001], ["um", "Micrometres (µm)", 1e-6],
    ["in", "Inches (in)", 0.0254], ["ft", "Feet (ft)", 0.3048], ["yd", "Yards (yd)", 0.9144],
    ["mi", "Miles (mi)", 1609.344], ["nmi", "Nautical miles (nmi)", 1852],
  ]),

  converter("mass-converter", "Mass", [
    ["kg", "Kilograms (kg)", 1], ["g", "Grams (g)", 0.001], ["mg", "Milligrams (mg)", 1e-6],
    ["t", "Metric tonnes (t)", 1000], ["lb", "Pounds (lb)", 0.45359237], ["oz", "Ounces (oz)", 0.028349523125],
    ["st", "Stones (st)", 6.35029318], ["short_ton", "Short tons (US)", 907.18474], ["long_ton", "Long tons (UK)", 1016.0469088],
  ]),

  converter("area-converter", "Area", [
    ["m2", "Square metres (m²)", 1], ["km2", "Square kilometres (km²)", 1e6],
    ["cm2", "Square centimetres (cm²)", 1e-4], ["ha", "Hectares (ha)", 10000],
    ["acre", "Acres", 4046.8564224], ["ft2", "Square feet (ft²)", 0.09290304],
    ["in2", "Square inches (in²)", 0.00064516], ["yd2", "Square yards (yd²)", 0.83612736],
    ["mi2", "Square miles (mi²)", 2589988.110336],
  ]),

  converter("volume-converter", "Volume", [
    ["m3", "Cubic metres (m³)", 1], ["L", "Litres (L)", 0.001], ["mL", "Millilitres (mL)", 1e-6],
    ["cm3", "Cubic centimetres (cm³)", 1e-6], ["ft3", "Cubic feet (ft³)", 0.028316846592],
    ["in3", "Cubic inches (in³)", 1.6387064e-5],
    ["gal_us", "US gallons (gal)", 0.003785411784], ["qt_us", "US quarts (qt)", 0.000946352946],
    ["pt_us", "US pints (pt)", 0.000473176473], ["floz_us", "US fluid ounces (fl oz)", 2.95735295625e-5],
    ["gal_imp", "Imperial gallons (gal)", 0.00454609], ["tbsp", "Tablespoons (US)", 1.478676478125e-5],
    ["tsp", "Teaspoons (US)", 4.92892159375e-6],
  ]),

  converter("speed-converter", "Speed", [
    ["mps", "Metres per second (m/s)", 1], ["kmh", "Kilometres per hour (km/h)", 0.277777777777778],
    ["mph", "Miles per hour (mph)", 0.44704], ["kn", "Knots (kn)", 0.514444444444444],
    ["fps", "Feet per second (ft/s)", 0.3048], ["c", "Speed of light (c)", 299792458],
  ]),

  converter("pressure-converter", "Pressure", [
    ["Pa", "Pascals (Pa)", 1], ["kPa", "Kilopascals (kPa)", 1000], ["MPa", "Megapascals (MPa)", 1e6],
    ["bar", "Bar", 100000], ["mbar", "Millibar (mbar)", 100], ["atm", "Standard atmospheres (atm)", 101325],
    ["psi", "Pounds per square inch (psi)", 6894.757293168], ["torr", "Torr / mmHg", 133.322387415],
    ["inHg", "Inches of mercury (inHg)", 3386.389],
  ]),

  converter("energy-converter", "Energy", [
    ["J", "Joules (J)", 1], ["kJ", "Kilojoules (kJ)", 1000], ["MJ", "Megajoules (MJ)", 1e6],
    ["kWh", "Kilowatt-hours (kWh)", 3.6e6], ["cal", "Calories (cal, thermochemical)", 4.184],
    ["kcal", "Kilocalories (kcal)", 4184], ["Btu", "BTU (IT)", 1055.056],
    ["eV", "Electronvolts (eV)", 1.602176634e-19], ["Wh", "Watt-hours (Wh)", 3600],
  ]),

  converter("power-converter", "Power", [
    ["W", "Watts (W)", 1], ["kW", "Kilowatts (kW)", 1000], ["MW", "Megawatts (MW)", 1e6],
    ["hp_mech", "Mechanical horsepower (hp)", 745.699871582], ["hp_metric", "Metric horsepower (PS)", 735.49875],
    ["Btu_h", "BTU per hour", 0.293071070172222], ["ton_ref", "Refrigeration tons", 3516.8528420667],
  ]),

  converter("force-converter", "Force", [
    ["N", "Newtons (N)", 1], ["kN", "Kilonewtons (kN)", 1000], ["kgf", "Kilogram-force (kgf)", 9.80665],
    ["lbf", "Pound-force (lbf)", 4.4482216152605], ["dyn", "Dynes (dyn)", 1e-5], ["tonf", "Short ton-force", 8896.443230521],
  ]),

  converter("torque-converter", "Torque", [
    ["Nm", "Newton-metres (N·m)", 1], ["kNm", "Kilonewton-metres (kN·m)", 1000],
    ["lbf_ft", "Pound-force feet (lbf·ft)", 1.3558179483314004],
    ["lbf_in", "Pound-force inches (lbf·in)", 0.1129848290276167],
    ["kgf_m", "Kilogram-force metres (kgf·m)", 9.80665],
  ]),

  converter("flow-rate-converter", "Volumetric flow rate", [
    ["m3s", "Cubic metres per second (m³/s)", 1], ["m3h", "Cubic metres per hour (m³/h)", 1 / 3600],
    ["Ls", "Litres per second (L/s)", 0.001], ["Lmin", "Litres per minute (L/min)", 1 / 60000],
    ["gpm_us", "US gallons per minute (gpm)", 6.30901964e-5],
    ["gph_us", "US gallons per hour", 1.051503273e-6],
    ["cfm", "Cubic feet per minute (cfm)", 0.0004719474432],
  ]),

  converter("acceleration-converter", "Acceleration", [
    ["mps2", "Metres per second squared (m/s²)", 1], ["g0", "Standard gravity (g₀)", 9.80665],
    ["fps2", "Feet per second squared (ft/s²)", 0.3048], ["gal", "Galileo (Gal)", 0.01],
    ["kmhs", "km/h per second", 0.277777777777778],
  ]),

  converter("density-converter", "Density", [
    ["kgm3", "Kilograms per cubic metre (kg/m³)", 1], ["gcm3", "Grams per cubic centimetre (g/cm³)", 1000],
    ["kgL", "Kilograms per litre (kg/L)", 1000], ["lbft3", "Pounds per cubic foot (lb/ft³)", 16.01846337396],
    ["lbin3", "Pounds per cubic inch (lb/in³)", 27679.904710203],
    ["lbgal", "Pounds per US gallon", 119.826427],
  ]),

  converter("viscosity-converter", "Dynamic viscosity", [
    ["Pas", "Pascal-seconds (Pa·s)", 1], ["mPas", "Millipascal-seconds (mPa·s)", 0.001],
    ["cP", "Centipoise (cP)", 0.001], ["P", "Poise (P)", 0.1],
    ["lbfts", "Pound per foot-second", 1.48816394356955],
  ]),

  converter("illuminance-converter", "Illuminance", [
    ["lux", "Lux (lx)", 1], ["fc", "Foot-candles (fc)", 10.7639104167097],
    ["klx", "Kilolux (klx)", 1000], ["phot", "Phot", 10000], ["nox", "Nox", 0.001],
  ]),

  mkx("temperature-converter", [n("Value", 100), s("Unit", [["C", "Celsius (°C)"], ["F", "Fahrenheit (°F)"], ["K", "Kelvin (K)"], ["R", "Rankine (°R)"]], "C")],
    "Affine: °F = °C × 9/5 + 32; K = °C + 273.15; °R = °F + 459.67 (temperature is not multiplicative)",
    "Temperature units",
    (v) => {
      const value = Number(v.value);
      const unit = String(v.unit);
      const celsius = unit === "C" ? value : unit === "F" ? ((value - 32) * 5) / 9 : unit === "K" ? value - 273.15 : ((value - 491.67) * 5) / 9;
      if (celsius < -273.15) return err("Temperature is below absolute zero.");
      return [["Celsius (°C)", celsius, 2, "°C", true],
        ["Fahrenheit (°F)", (celsius * 9) / 5 + 32, 2, "°F"],
        ["Kelvin (K)", celsius + 273.15, 2, "K"],
        ["Rankine (°R)", (celsius + 273.15) * 1.8, 2, "°R"]];
    },
    { assumptions: ["Affine conversions with exact offsets (0 °C = 273.15 K = 32 °F); applying a ratio factor to temperatures is wrong."] }),

  // ── C62 Computer Science and Algorithms (12) ───────────────────────────────
  mkx("number-base-conversion", [t("Value", "255"), it("Source base", 10, { min: 2, max: 36 })],
    "Repeated division for integer part; positional expansion for parsing", "Integer value and source base",
    (v) => {
      const raw = String(v.value).trim().toLowerCase();
      const base = Number(v["source-base"]);
      const parsed = parseInt(raw, base);
      if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return err("Value is not valid in the selected base.");
      return [["Binary", parsed.toString(2), undefined, true], ["Octal", parsed.toString(8)],
        ["Decimal", parsed.toString(10)], ["Hexadecimal", parsed.toString(16).toUpperCase()],
        ["Base 36", parsed.toString(36).toUpperCase()]];
    }),

  mk("bitwise-operations", [it("A", 12), it("B", 10), s("Operation", [["and", "AND (&)"], ["or", "OR (|)"], ["xor", "XOR (^)"], ["shl", "Shift left"], ["shr", "Shift right"]], "and")],
    "32-bit two's-complement bitwise operation", "Operands and operator",
    (v) => {
      const a = Math.trunc(v.a), b = Math.trunc(v.b);
      const res = v.operation === "and" ? a & b : v.operation === "or" ? a | b : v.operation === "xor" ? a ^ b : v.operation === "shl" ? a << b : a >> b;
      return [["Result (decimal)", res, 0, undefined, true], ["Result (binary)", (res >>> 0).toString(2)],
        ["Result (hex)", (res >>> 0).toString(16).toUpperCase()]];
    }),

  mkx("boolean-truth-table", [t("Expression", "A AND NOT B")],
    "Enumerates all input assignments for up to 3 variables", "Boolean expression using A, B, C, AND, OR, NOT",
    (v) => {
      const expr = String(v.expression).toUpperCase();
      if (!/^[ABC\s()]*$/.test(expr.replace(/AND|OR|NOT/g, ""))) return err("Use only A, B, C, AND, OR, NOT and parentheses.");
      const evalExpr = (a: boolean, b: boolean, c: boolean): boolean => {
        let js = expr.replace(/\bAND\b/g, "&&").replace(/\bOR\b/g, "||").replace(/\bNOT\b/g, "!");
        js = js.replace(/\bA\b/g, String(a)).replace(/\bB\b/g, String(b)).replace(/\bC\b/g, String(c));
        return !!Function(`"use strict";return (${js})`)();
      };
      const rows: string[] = [];
      let trueCount = 0;
      for (let i = 0; i < 8; i++) {
        const a = !!(i & 4), b = !!(i & 2), c = !!(i & 1);
        const r = evalExpr(a, b, c);
        if (r) trueCount++;
        rows.push(`${a ? 1 : 0}${b ? 1 : 0}${c ? 1 : 0} → ${r ? 1 : 0}`);
      }
      return [["Truth table (ABC → result)", rows.join(" | "), undefined, true], ["Rows where true", trueCount, 0, "of 8"]];
    }),

  mkx("ascii-unicode", [t("Text", "Calc")],
    "Code points via Unicode scalar values (UTF-16 code units for non-BMP)", "Text or code points",
    (v) => {
      const text = String(v.text);
      const cps = Array.from(text).map((ch) => ch.codePointAt(0) ?? 0);
      return [["Code points (decimal)", cps.join(", "), undefined, true],
        ["Code points (hex)", cps.map((c) => `U+${c.toString(16).toUpperCase().padStart(4, "0")}`).join(", ")],
        ["UTF-8 bytes", String(new TextEncoder().encode(text).length), 0, "bytes"]];
    }),

  mk("twos-complement", [n("Value", -12), it("Bits", 8, { min: 2, max: 32 })],
    "Two's complement: value mod 2^bits encoded in exactly `bits` bits", "Signed integer and bit width",
    (v) => {
      const bits = v.bits, mod = Math.pow(2, bits);
      const enc = ((Math.trunc(v.value) % mod) + mod) % mod;
      const min = -Math.pow(2, bits - 1), max = Math.pow(2, bits - 1) - 1;
      return [["Bit pattern", enc.toString(2).padStart(bits, "0"), undefined, true],
        ["Unsigned interpretation", enc, 0], ["Representable range", `${min} … ${max}`]];
    }),

  mk("ieee754-representation", [n("Value", -12.375)],
    "IEEE-754 binary64: 1 sign, 11 exponent (bias 1023), 52 fraction bits", "Double-precision value",
    (v) => {
      const buf = new ArrayBuffer(8);
      new DataView(buf).setFloat64(0, v.value, false);
      const bytes = new Uint8Array(buf);
      const bits = Array.from(bytes).map((b) => b.toString(2).padStart(8, "0")).join("");
      const sign = bits[0], exp = bits.slice(1, 12), frac = bits.slice(12);
      const expVal = parseInt(exp, 2);
      return [["Sign bit", sign, 0, undefined, true], ["Exponent (biased)", expVal, 0],
        ["Exponent (unbiased)", expVal - 1023, 0], ["Fraction hex", parseInt(frac.slice(0, 13), 2).toString(16).toUpperCase()],
        ["Binary64 hex", Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase()]];
    }),

  mk("base64-length", [p("Byte length", 1000, "bytes")],
    "Encoded length = 4 × ceil(n / 3)", "Raw byte length",
    (v) => [["Base64 length", 4 * Math.ceil(v["byte-length"] / 3), 0, "chars", true],
      ["Overhead", ((4 * Math.ceil(v["byte-length"] / 3)) / v["byte-length"] - 1) * 100, 2, "%"]]),

  mk("binary-search-steps", [p("Array size", 1000000), nn("Target index", 500000)],
    "Worst case ⌈log₂(n + 1)⌉ comparisons; best case 1", "Sorted array size",
    (v) => [["Worst-case comparisons", Math.ceil(Math.log2(v["array-size"] + 1)), 0, "comparisons", true],
      ["Best-case comparisons", 1, 0], ["Linear scan worst case", v["array-size"], 0, "comparisons"]],
    { assumptions: ["Requires the array to be sorted; the complexity claim is invalid otherwise."] }),

  mk("hash-load-factor", [p("Entries", 750), p("Buckets", 1000)],
    "α = n / m", "Hash table occupancy",
    (v) => [["Load factor", v.entries / v.buckets, 3, undefined, true],
      ["Status", v.entries / v.buckets > 0.7 ? "Above 0.7 — probe cost rises sharply" : "Within typical open-addressing range"]]),

  mk("recursion-depth", [p("Input size", 1000000), p("Branching factor", 2)],
    "Depth = log_b(n) for balanced divide-and-conquer", "Input size and branching factor",
    (v) => [["Recursion depth", Math.ceil(Math.log(v["input-size"]) / Math.log(v["branching-factor"])), 0, "levels", true],
      ["Total calls (worst case)", Math.pow(v["branching-factor"], Math.ceil(Math.log(v["input-size"]) / Math.log(v["branching-factor"]))), 0]]),

  mkx("algorithm-complexity", [t("Operation counts", "16, 64, 256, 1024")],
    "Estimates growth order by comparing doubling ratios of operation counts", "Operation counts at n = 1,2,4,8…",
    (v) => {
      const counts = parseNumList(String(v["operation-counts"]), 2);
      if (!counts.ok) return counts;
      if (counts.value.some((x) => x <= 0)) return err("Operation counts must be positive.");
      const ratios: number[] = [];
      for (let i = 1; i < counts.value.length; i++) ratios.push(counts.value[i] / counts.value[i - 1]);
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      const cls = avg < 1.5 ? "O(1) / O(log n)" : avg < 2.5 ? "O(n)" : avg < 4.5 ? "O(n log n)" : avg < 8 ? "O(n²)" : "Super-quadratic";
      return [["Estimated class (doubling ratios)", cls, undefined, true], ["Mean growth ratio", avg, 3, "×"]];
    },
    { limitations: ["Classifies supplied operation counts only; it cannot measure runtime or prove a complexity bound."] }),

  mk("checksum-crc", [p("Data length", 1500, "bytes"), it("CRC width", 32, { min: 8, max: 64 })],
    "CRC of width w detects all bursts ≤ w bits; overhead = w bits per frame", "Frame length and CRC width",
    (v) => [["CRC overhead", (v["crc-width"] * v["data-length"]) / (8 * v["data-length"]) , 2, "bits/byte", true],
      ["Total frame size", v["data-length"] + v["crc-width"] / 8, 1, "bytes"],
      ["Undetected burst bound", `${v["crc-width"]} bits`, undefined]]),

  // ── C63 Programming and Software Development (12) ──────────────────────────
  mkx("cocomo-effort", [p("KLOC", 25, "thousand lines"), s("Mode", [["organic", "Organic (a=2.4, b=1.05)"], ["semi", "Semi-detached (a=3.0, b=1.12)"], ["embedded", "Embedded (a=3.6, b=1.20)"]], "organic")],
    "Basic COCOMO: E = a × KLOC^b person-months; D = 2.5 × E^0.38", "Size in KLOC and mode",
    (v) => {
      const a = v.mode === "organic" ? 2.4 : v.mode === "semi" ? 3.0 : 3.6;
      const b = v.mode === "organic" ? 1.05 : v.mode === "semi" ? 1.12 : 1.20;
      const e = a * Math.pow(Number(v.kloc), b);
      return [["Effort", e, 1, "person-months", true], ["Development time", 2.5 * Math.pow(e, 0.38), 1, "months"],
        ["Average staff", e / (2.5 * Math.pow(e, 0.38)), 1, "FTE"]];
    },
    { limitations: ["COCOMO (1981) coefficients describe historical projects; accuracy on modern software is poor. Label it a historical model."] }),

  mk("function-points", [p("External inputs", 12), p("External outputs", 8), p("External queries", 6), p("Internal files", 5), p("External interfaces", 3), p("Complexity adjustment", 1.0)],
    "FP = 35·EI + 15·EO + 10·EQ + 10·ILF + 7·EIF (simplified average weights)", "Component counts",
    (v) => {
      const ufp = 4 * v["external-inputs"] + 5 * v["external-outputs"] + 4 * v["external-queries"] + 10 * v["internal-files"] + 7 * v["external-interfaces"];
      return [["Unadjusted function points", ufp, 0, "FP", true], ["Adjusted FP", ufp * v["complexity-adjustment"], 1, "FP"]];
    },
    { limitations: ["IFPUG weighting tables are method-specific and licensed; this uses simplified average weights and must be labelled an estimate."] }),

  mk("sprint-capacity", [p("Team size", 6), p("Sprint days", 10), p("Hours per day", 6), p("Focus factor", 0.75), p("Hours per point", 8)],
    "Capacity = team × days × hours × focus / hours per point", "Sprint capacity",
    (v) => [["Sprint capacity", (v["team-size"] * v["sprint-days"] * v["hours-per-day"] * v["focus-factor"]) / v["hours-per-point"], 0, "points", true],
      ["Available hours", v["team-size"] * v["sprint-days"] * v["hours-per-day"] * v["focus-factor"], 0, "h"]]),

  mk("velocity", [p("Completed points", 120), it("Sprints", 3, { min: 1 })],
    "Velocity = completed points / sprints", "Average team velocity",
    (v) => [["Average velocity", v["completed-points"] / v.sprints, 1, "points/sprint", true]]),

  mk("story-point-conversion", [p("Story points", 40), p("Hours", 320, "h")],
    "Team-specific ratio only; points are not time", "Points and hours for this team",
    (v) => [["Hours per point", v.hours / v["story-points"], 2, "h/point", true]],
    { limitations: ["Story points are team-relative; converting them by a constant factor across teams is invalid."] }),

  mk("bug-density", [p("Defects", 45), p("KLOC", 30, "thousand lines")],
    "Density = defects / KLOC", "Defect density",
    (v) => [["Defect density", v.defects / v.kloc, 2, "defects/KLOC", true]]),

  mk("test-coverage", [p("Executed lines", 8400), p("Total lines", 10000)],
    "Coverage% = executed / total × 100", "Line coverage",
    (v) => [["Line coverage", (v["executed-lines"] / v["total-lines"]) * 100, 2, "%", true],
      ["Uncovered lines", v["total-lines"] - v["executed-lines"], 0, "lines"]]),

  mk("cyclomatic-complexity", [p("Graph edges", 24), p("Graph nodes", 18), p("Connected components", 1)],
    "M = E − N + 2P", "Cyclomatic complexity",
    (v) => {
      const m = v["graph-edges"] - v["graph-nodes"] + 2 * v["connected-components"];
      return [["Cyclomatic complexity M", m, 0, undefined, true],
        ["Independent paths", m, 0], ["Risk band", m <= 10 ? "Low" : m <= 20 ? "Moderate" : m <= 50 ? "High" : "Very high"]];
    },
    { assumptions: ["Measures branching in a control-flow graph, not readability or correctness."] }),

  mk("technical-debt-ratio", [p("Remediation cost", 45000, "$"), p("Development cost", 300000, "$")],
    "Debt ratio = remediation / development cost × 100", "Technical debt ratio",
    (v) => [["Technical debt ratio", (v["remediation-cost"] / v["development-cost"]) * 100, 2, "%", true]]),

  mk("api-rate-limit", [p("Quota", 10000, "requests"), p("Window", 3600, "s"), p("Safety margin", 20, "%")],
    "Safe rate = quota × (1 − margin) / window", "API rate-limit budget",
    (v) => {
      const safe = (v.quota * (1 - v["safety-margin"] / 100)) / v.window;
      return [["Safe request rate", safe, 3, "req/s", true], ["Requests per minute", safe * 60, 1, "req/min"]];
    }),

  mk("dev-time-estimate", [p("Base estimate", 40, "days"), p("Optimistic factor", 0.8), p("Pessimistic factor", 1.6)],
    "PERT: (O + 4M + P)/6; σ = (P − O)/6", "Three-point estimate",
    (v) => {
      const o = v["base-estimate"] * v["optimistic-factor"], m = v["base-estimate"], p0 = v["base-estimate"] * v["pessimistic-factor"];
      const mean = (o + 4 * m + p0) / 6;
      return [["PERT expected duration", mean, 1, "days", true], ["Standard deviation", (p0 - o) / 6, 2, "days"],
        ["90% confidence bound", mean + 1.282 * (p0 - o) / 6, 1, "days"]];
    }),

  mk("code-review-time", [p("Lines changed", 450), p("Lines per minute", 12, "lines/min")],
    "Time = lines / review rate", "Code review effort",
    (v) => [["Review time", v["lines-changed"] / v["lines-per-minute"], 1, "min", true]],
    { limitations: ["Review rates fall sharply with diff size; reviewers reliably catch far fewer defects above ~400 lines."] }),

  // ── C64 Networking (14) ────────────────────────────────────────────────────
  mkx("cidr-subnet", [t("IPv4 address", "192.168.10.34"), it("Prefix length", 24, { min: 0, max: 32 })],
    "network = ip AND mask; broadcast = network OR NOT mask", "IPv4 address and CIDR prefix",
    (v) => {
      const octets = parseIPv4(String(v["ipv4-address"]));
      if (!octets) return err("Enter a valid dotted-quad IPv4 address.");
      const pfx = Number(v["prefix-length"]);
      const ip = ipv4ToInt(octets);
      const mask = pfx === 0 ? 0 : (0xffffffff << (32 - pfx)) >>> 0;
      const network = ip & mask, broadcast = (network | (~mask >>> 0)) >>> 0;
      const size = Math.pow(2, 32 - pfx);
      const usable = pfx === 32 ? 1 : pfx === 31 ? 2 : size - 2;
      return [["Subnet mask", intToIPv4(mask), undefined, true], ["Network address", intToIPv4(network)],
        ["Broadcast address", pfx >= 31 ? "n/a" : intToIPv4(broadcast)],
        ["Address count", size, 0], ["Usable hosts", usable, 0]];
    }),

  mk("hosts-per-subnet", [it("Prefix length", 24, { min: 0, max: 32 })],
    "Usable = 2^(32 − p) − 2, except /31 (2) and /32 (1)", "CIDR prefix length",
    (v) => {
      const p = v["prefix-length"], size = Math.pow(2, 32 - p);
      const usable = p >= 32 ? 1 : p === 31 ? 2 : size - 2;
      return [["Addresses", size, 0, undefined, true], ["Usable hosts", usable, 0], ["Subnet mask", intToIPv4(p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0)]];
    }),

  mkx("subnet-split", [t("Network", "10.0.0.0/16"), it("New prefix", 20, { min: 0, max: 32 })],
    "Subnet count = 2^(new prefix − old prefix)", "Base network and target prefix",
    (v) => {
      const m = /^(.+)\/(\d{1,2})$/.exec(String(v.network).trim());
      if (!m) return err("Enter a network in CIDR form, e.g. 10.0.0.0/16.");
      const octets = parseIPv4(m[1]);
      if (!octets) return err("Invalid network address.");
      const oldP = Number(m[2]), newP = Number(v["new-prefix"]);
      if (newP < oldP) return err("New prefix must be longer (smaller) than the base prefix.");
      const count = Math.pow(2, newP - oldP);
      return [["Subnets", count, 0, "subnets", true], ["Addresses per subnet", Math.pow(2, 32 - newP), 0],
        ["New mask", intToIPv4((0xffffffff << (32 - newP)) >>> 0)]];
    }),

  mkx("ip-range", [t("CIDR", "203.0.113.0/26")],
    "First/last usable addresses and block size from the prefix", "Network in CIDR form",
    (v) => {
      const m = /^(.+)\/(\d{1,2})$/.exec(String(v.cidr).trim());
      if (!m) return err("Enter a network in CIDR form.");
      const octets = parseIPv4(m[1]);
      if (!octets) return err("Invalid IPv4 address.");
      const p0 = Number(m[2]), size = Math.pow(2, 32 - p0);
      const mask = p0 === 0 ? 0 : (0xffffffff << (32 - p0)) >>> 0;
      const net = ipv4ToInt(octets) & mask;
      return [["First usable", p0 >= 31 ? intToIPv4(net) : intToIPv4(net + 1), undefined, true],
        ["Last usable", p0 >= 31 ? intToIPv4(net + size - 1) : intToIPv4(net + size - 2)],
        ["Usable addresses", p0 >= 32 ? 1 : p0 === 31 ? 2 : size - 2, 0]];
    }),

  mkx("wildcard-mask", [t("Subnet mask", "255.255.255.0")],
    "Wildcard = bitwise NOT of the subnet mask (Cisco ACL syntax)", "Dotted-quad subnet mask",
    (v) => {
      const octets = parseIPv4(String(v["subnet-mask"]));
      if (!octets) return err("Enter a valid dotted-quad subnet mask.");
      const inv = (~ipv4ToInt(octets)) >>> 0;
      return [["Wildcard mask", intToIPv4(inv), undefined, true], ["Mask", intToIPv4(ipv4ToInt(octets))]];
    }),

  mkx("network-broadcast", [t("IPv4 address", "172.16.45.200"), it("Prefix length", 20, { min: 0, max: 32 })],
    "network = ip AND mask; broadcast = network | ~mask", "Address and prefix",
    (v) => {
      const octets = parseIPv4(String(v["ipv4-address"]));
      if (!octets) return err("Enter a valid IPv4 address.");
      const p0 = Number(v["prefix-length"]);
      const mask = p0 === 0 ? 0 : (0xffffffff << (32 - p0)) >>> 0;
      const net = ipv4ToInt(octets) & mask;
      return [["Network address", intToIPv4(net), undefined, true],
        ["Broadcast address", intToIPv4(((net | (~mask >>> 0)) >>> 0))]];
    }),

  mk("ipv6-subnet", [it("Subnet bits", 64, { min: 1, max: 128 }), it("Sub-subnet bits", 72, { min: 1, max: 128 })],
    "Subnets = 2^(new prefix − base prefix); /64 = 2^64 host addresses", "IPv6 prefix and subnetting",
    (v) => {
      if (v["sub-subnet-bits"] < v["subnet-bits"]) return err("New prefix must be longer than the base prefix.");
      const subnets = Math.pow(2, v["sub-subnet-bits"] - v["subnet-bits"]);
      return [["Subnets", subnets, 0, "subnets", true], ["/64 host addresses", "2^64 ≈ 1.845×10¹⁹", undefined]];
    }),

  mkx("subnet-overlap-check", [t("Network A", "10.1.0.0/16"), t("Network B", "10.1.128.0/17")],
    "Compares network/broadcast integer ranges for intersection", "Two CIDR networks",
    (v) => {
      const parse = (s: string) => {
        const m = /^(.+)\/(\d{1,2})$/.exec(s.trim());
        if (!m) return null;
        const oct = parseIPv4(m[1]);
        if (!oct) return null;
        const p0 = Number(m[2]);
        const mask = p0 === 0 ? 0 : (0xffffffff << (32 - p0)) >>> 0;
        const net = ipv4ToInt(oct) & mask;
        return { start: net, end: ((net | (~mask >>> 0)) >>> 0) };
      };
      const a = parse(String(v["network-a"])), b = parse(String(v["network-b"]));
      if (!a || !b) return err("Enter both networks in CIDR form.");
      const overlap = a.start <= b.end && b.start <= a.end;
      return [["Overlap", overlap ? "Yes" : "No", undefined, true],
        ["Range A", `${intToIPv4(a.start)} – ${intToIPv4(a.end)}`], ["Range B", `${intToIPv4(b.start)} – ${intToIPv4(b.end)}`]];
    }),

  mk("dhcp-range-size", [p("Pool size", 254), z("Exclusions", 12), z("Reservations", 8)],
    "Available leases = pool − exclusions − reservations", "DHCP pool accounting",
    (v) => [["Usable leases", Math.max(0, v["pool-size"] - v.exclusions - v.reservations), 0, "leases", true],
      ["Utilisation reserve", ((v.exclusions + v.reservations) / v["pool-size"]) * 100, 1, "%"]]),

  mk("bandwidth-transfer-time", [p("File size", 5, "GB"), p("Link speed", 100, "Mbps"), p("Efficiency", 85, "%")],
    "Time = size × 8 / (speed × efficiency)", "Transfer time",
    (v) => {
      const bits = v["file-size"] * 8e9;
      const secs = bits / (v["link-speed"] * 1e6 * (v.efficiency / 100));
      return [["Transfer time", secs, 1, "s", true], ["Transfer time", secs / 60, 2, "min"],
        ["Effective throughput", v["link-speed"] * (v.efficiency / 100), 1, "Mbps"]];
    }),

  mk("throughput-efficiency", [p("Goodput", 850, "Mbps"), p("Line rate", 1000, "Mbps")],
    "Efficiency% = goodput / line rate × 100", "Protocol overhead",
    (v) => [["Throughput efficiency", (v.goodput / v["line-rate"]) * 100, 2, "%", true],
      ["Overhead", 100 - (v.goodput / v["line-rate"]) * 100, 2, "%"]]),

  mk("mtu-fragmentation", [p("MTU", 1500, "bytes"), p("Payload size", 4000, "bytes"), p("IP header", 20, "bytes")],
    "Fragments = ceil(payload / (MTU − header))", "IP fragmentation count",
    (v) => {
      const per = v.mtu - v["ip-header"];
      if (per <= 0) return err("MTU must exceed the IP header size.");
      return [["Fragments required", Math.ceil(v["payload-size"] / per), 0, "fragments", true],
        ["Payload per fragment", per, 0, "bytes"], ["Last fragment", v["payload-size"] % per || per, 0, "bytes"]];
    }),

  mk("latency-bandwidth-product", [p("Round-trip time", 40, "ms"), p("Bandwidth", 100, "Mbps")],
    "BDP = RTT × bandwidth (bytes in flight)", "Bandwidth-delay product",
    (v) => {
      const bdp = (v["round-trip-time"] / 1000) * v.bandwidth * 1e6 / 8;
      return [["Bytes in flight", bdp, 0, "bytes", true], ["In kilobytes", bdp / 1024, 1, "KiB"]];
    }),

  mkx("port-range", [s("Service", [["http", "HTTP"], ["https", "HTTPS"], ["ssh", "SSH"], ["dns", "DNS"], ["smtp", "SMTP"], ["mysql", "MySQL"], ["postgres", "PostgreSQL"], ["rdp", "RDP"]], "https")],
    "IANA well-known port assignments", "Service name",
    (v) => {
      const map: Record<string, [string, number, string]> = {
        http: ["TCP", 80, "Hypertext Transfer Protocol"], https: ["TCP", 443, "HTTP over TLS"],
        ssh: ["TCP", 22, "Secure Shell"], dns: ["TCP/UDP", 53, "Domain Name System"],
        smtp: ["TCP", 25, "Simple Mail Transfer Protocol"], mysql: ["TCP", 3306, "MySQL"],
        postgres: ["TCP", 5432, "PostgreSQL"], rdp: ["TCP/UDP", 3389, "Remote Desktop Protocol"],
      };
      const entry = map[String(v.service)];
      if (!entry) return err("Unknown service.");
      return [["Port", entry[1], 0, undefined, true], ["Transport", entry[0]], ["Service", entry[2]]];
    }),

  // ── C65 Data Storage and File Size (9) ─────────────────────────────────────
  mk("file-size-bitrate", [p("Bitrate", 8, "Mbps"), p("Duration", 120, "min")],
    "bytes = bitrate × duration / 8", "Media file size",
    (v) => {
      const bytes = (v.bitrate * 1e6 * v.duration * 60) / 8;
      return [["File size", bytes / 1e9, 2, "GB", true], ["File size", bytes / (1024 ** 3), 2, "GiB"]];
    }),

  mk("storage-unit-conversion", [p("Capacity", 500, "GB (decimal)")],
    "1 kB = 10³ B; 1 KiB = 2¹⁰ B", "Decimal to binary storage units",
    (v) => {
      const bytes = v.capacity * 1e9;
      return [["In GiB (binary)", bytes / 1024 ** 3, 2, "GiB", true], ["In TiB", bytes / 1024 ** 4, 4, "TiB"],
        ["Raw bytes", bytes, 0, "B"]];
    }),

  mkx("raid-capacity", [p("Disk count", 6, undefined, { min: 2 }), p("Disk size", 8, "TB"), s("RAID level", [["0", "RAID 0 (stripe)"], ["1", "RAID 1 (mirror)"], ["5", "RAID 5"], ["6", "RAID 6"], ["10", "RAID 10"]], "5")],
    "RAID 0: n; 1: 1; 5: n−1; 6: n−2; 10: n/2", "Drive count and level",
    (v) => {
      const n = Number(v["disk-count"]), size = Number(v["disk-size"]);
      const level = String(v["raid-level"]);
      let usable: number;
      let faults: number;
      if (level === "0") { usable = n * size; faults = 0; }
      else if (level === "1") { usable = size; faults = n - 1; }
      else if (level === "5") { usable = (n - 1) * size; faults = 1; }
      else if (level === "6") { usable = (n - 2) * size; faults = 2; }
      else {
        if (n % 2 !== 0) return err("RAID 10 requires an even number of disks.");
        usable = (n / 2) * size; faults = n / 2;
      }
      if (usable <= 0) return err("Not enough disks for this RAID level.");
      return [["Usable capacity", usable, 2, "TB", true], ["Raw capacity", n * size, 2, "TB"],
        ["Fault tolerance", faults, 0, "disk(s)"], ["Efficiency", (usable / (n * size)) * 100, 1, "%"]];
    },
    { limitations: ["Assumes equal-sized disks and no hot spares. Rebuild time and failure risk grow with disk size."] }),

  mk("backup-size", [p("Source data", 12, "TB"), it("Retention", 30, { min: 1 }), p("Daily change rate", 3, "%"), p("Dedupe ratio", 2.5)],
    "Full + incremental chain divided by the dedupe/compression ratio", "Backup capacity estimate",
    (v) => {
      const full = v["source-data"];
      const incr = (v["source-data"] * (v["daily-change-rate"] / 100) * (v.retention - 1)) / v["dedupe-ratio"];
      return [["Estimated backup footprint", (full / v["dedupe-ratio"]) + incr, 2, "TB", true],
        ["Full backup size (after dedupe)", full / v["dedupe-ratio"], 2, "TB"]];
    }),

  mk("data-compression-ratio", [p("Original size", 1200, "MB"), p("Compressed size", 420, "MB")],
    "Ratio = original / compressed; saving = 1 − compressed/original", "Compression ratio",
    (v) => [["Compression ratio", v["original-size"] / v["compressed-size"], 2, ": 1", true],
      ["Space saving", (1 - v["compressed-size"] / v["original-size"]) * 100, 1, "%"]]),

  mk("transfer-time-storage", [p("Data size", 500, "GB"), p("Interface speed", 550, "MB/s"), p("Efficiency", 80, "%")],
    "Time = size / (speed × efficiency)", "Storage transfer time",
    (v) => {
      const secs = (v["data-size"] * 1000) / (v["interface-speed"] * (v.efficiency / 100));
      return [["Transfer time", secs, 1, "s", true], ["Transfer time", secs / 60, 2, "min"]];
    }),

  mk("database-size", [p("Rows", 50000000), p("Row size", 480, "bytes"), p("Index overhead", 30, "%")],
    "Size = rows × row size × (1 + index overhead)", "Database size estimate",
    (v) => {
      const bytes = v.rows * v["row-size"] * (1 + v["index-overhead"] / 100);
      return [["Estimated size", bytes / 1e9, 2, "GB", true], ["Data only", (v.rows * v["row-size"]) / 1e9, 2, "GB"]];
    }),

  mk("log-volume", [p("Events per second", 2500), p("Event size", 800, "bytes"), p("Retention", 30, "days")],
    "Volume = eps × size × seconds × retention", "Log volume",
    (v) => {
      const perDay = v["events-per-second"] * v["event-size"] * 86400;
      return [["Daily volume", perDay / 1e9, 2, "GB/day", true], ["Retained volume", (perDay * v.retention) / 1e12, 2, "TB"]];
    }),

  mk("tape-rotation", [p("Retention", 365, "days"), p("Media capacity", 12, "TB"), p("Backup size", 8, "TB"), p("Rotation sets", 4)],
    "Media = rotation sets + ceil(retention / set period)", "Tape rotation schedule",
    (v) => [["Media required", Math.ceil(v.retention / 7) + v["rotation-sets"], 0, "tapes", true],
      ["Weekly tapes for a year", 52, 0, "tapes"],
      ["Media capacity per set", v["media-capacity"], 1, "TB"]]),

  // ── C66 Web Development and Digital Design (10) ────────────────────────────
  mk("aspect-ratio", [p("Width", 1920, "px"), p("Height", 1080, "px")],
    "ratio = w / h, reduced by the greatest common divisor", "Width and height",
    (v) => {
      const g = gcdInt(Math.round(v.width), Math.round(v.height));
      return [["Aspect ratio", `${Math.round(v.width) / g} : ${Math.round(v.height) / g}`, undefined, true],
        ["Decimal ratio", v.width / v.height, 4],
        ["Scaled to 1000 px width", `${Math.round((1000 * v.height) / v.width)} px height`]];
    }),

  mk("px-rem-conversion", [p("Pixel value", 24, "px"), p("Root font size", 16, "px")],
    "rem = px / root font size", "Pixels and root font size",
    (v) => [["Value in rem", v["pixel-value"] / v["root-font-size"], 4, "rem", true],
      ["Value in em (same root)", v["pixel-value"] / v["root-font-size"], 4, "em"]]),

  mkx("color-contrast", [t("Foreground", "#1f2937"), t("Background", "#ffffff")],
    "WCAG 2.2: L = 0.2126R + 0.7152G + 0.0722B (linearised); ratio = (L1 + 0.05)/(L2 + 0.05)", "Two sRGB hex colours",
    (v) => {
      const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      const lum = (hex: string) => {
        const rgb = parseHexRGB(hex);
        if (!rgb) return null;
        const [r, g, b] = rgb.map((x) => lin(x / 255)) as [number, number, number];
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const l1 = lum(String(v.foreground)), l2 = lum(String(v.background));
      if (l1 === null || l2 === null) return err("Enter colours as #rrggbb or #rgb.");
      const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
      const ratio = (hi + 0.05) / (lo + 0.05);
      return [["Contrast ratio", ratio, 2, ": 1", true],
        ["AA normal text (4.5:1)", ratio >= 4.5 ? "Pass" : "Fail"],
        ["AA large text (3:1)", ratio >= 3 ? "Pass" : "Fail"],
        ["AAA normal text (7:1)", ratio >= 7 ? "Pass" : "Fail"]];
    },
    { assumptions: ["W3C WCAG 2.2 relative-luminance formula with sRGB linearisation; thresholds 4.5:1 normal, 3:1 large text."] }),

  mkx("hex-rgb", [t("Hex colour", "#2f80ed")],
    "Hex → 0–255 RGB channels and HSL", "Hex colour code",
    (v) => {
      const rgb = parseHexRGB(String(v["hex-colour"]));
      if (!rgb) return err("Enter a colour as #rrggbb or #rgb.");
      const [r, g, b] = rgb.map((x) => x / 255) as [number, number, number];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const l = (max + min) / 2;
      const s0 = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
      let h = 0;
      if (max !== min) {
        if (max === r) h = ((g - b) / (max - min)) % 6;
        else if (max === g) h = (b - r) / (max - min) + 2;
        else h = (r - g) / (max - min) + 4;
      }
      h = ((h * 60) + 360) % 360;
      return [["RGB", `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`, undefined, true],
        ["HSL", `hsl(${Math.round(h)}, ${Math.round(s0 * 100)}%, ${Math.round(l * 100)}%)`],
        ["Hex", `#${rgb.map((x) => x.toString(16).padStart(2, "0")).join("")}`]];
    }),

  mk("modular-scale", [p("Base size", 16, "px"), p("Ratio", 1.25), it("Steps", 5, { min: 0, max: 12 })],
    "size_n = base × ratio^n", "Modular typographic scale",
    (v) => {
      const sizes = Array.from({ length: v.steps + 1 }, (_, i) => (v["base-size"] * Math.pow(v.ratio, i - 1)).toFixed(2));
      return [["Step 0", (v["base-size"] * Math.pow(v.ratio, 0)).toFixed(2), 2, "px", true],
        ["Scale ladder", sizes.join(", "), undefined, "px"]];
    }),

  mk("grid-columns", [p("Container width", 1200, "px"), it("Columns", 12, { min: 1 }), p("Gutter", 24, "px")],
    "Column width = (container − gutters × (n − 1)) / n", "CSS grid column width",
    (v) => {
      const col = (v["container-width"] - v.gutter * (v.columns - 1)) / v.columns;
      return [["Column width", col, 2, "px", true], ["Total gutter space", v.gutter * (v.columns - 1), 1, "px"]];
    }),

  mk("responsive-image-sizes", [p("Viewport width", 1440, "px"), p("Device pixel ratio", 2)],
    "Required source width = viewport × DPR", "Responsive image source widths",
    (v) => {
      const need = v["viewport-width"] * v["device-pixel-ratio"];
      return [["Required intrinsic width", need, 0, "px", true], ["1× source", v["viewport-width"], 0, "px"],
        ["Suggested srcset", `${v["viewport-width"]}w, ${need}w`]];
    }),

  mk("page-weight-budget", [p("HTML", 60, "KB"), p("CSS", 45, "KB"), p("JavaScript", 320, "KB"), p("Images", 900, "KB"), p("Fonts", 180, "KB"), p("Third parties", 210, "KB")],
    "Total = Σ asset weights", "Page weight budget",
    (v) => {
      const tot = v.html + v.css + v.javascript + v.images + v.fonts + v["third-parties"];
      return [["Total page weight", tot, 0, "KB", true], ["JavaScript share", (v.javascript / tot) * 100, 1, "%"],
        ["Budget status", tot <= 1700 ? "Within a common 1.7 MB budget" : "Above a common 1.7 MB budget"]];
    },
    { limitations: ["There is no universal passing byte count. Core Web Vitals thresholds apply to timing metrics (LCP/INP/CLS), not page weight."] }),

  mk("performance-budget", [p("LCP target", 2.5, "s"), p("LCP actual", 2.1, "s"), p("INP target", 200, "ms"), p("INP actual", 240, "ms"), p("CLS target", 0.1), p("CLS actual", 0.06)],
    "Compares each metric against its published threshold", "Core Web Vitals comparison",
    (v) => [["LCP", `${v["lcp-actual"]} s vs ${v["lcp-target"]} s target`, v["lcp-actual"] <= v["lcp-target"] ? "Pass" : "Fail", true],
      ["INP", `${v["inp-actual"]} ms vs ${v["inp-target"]} ms target`, v["inp-actual"] <= v["inp-target"] ? "Pass" : "Fail"],
      ["CLS", `${v["cls-actual"]} vs ${v["cls-target"]} target`, v["cls-actual"] <= v["cls-target"] ? "Pass" : "Fail"]]),

  mk("breakpoint-calculator", [p("Content width", 720, "px"), p("Minimum margin", 24, "px"), it("Breakpoints", 4, { min: 1 })],
    "Breakpoint = content + 2 × margin, scaled by column reflow", "Layout breakpoints",
    (v) => [["Single-column minimum width", v["content-width"] + 2 * v["minimum-margin"], 0, "px", true],
      ["Per additional column", (v["content-width"] + 2 * v["minimum-margin"]) / v.breakpoints, 0, "px"],
      ["Suggested breakpoint ladder", Array.from({ length: v.breakpoints }, (_, i) => Math.round((v["content-width"] + 2 * v["minimum-margin"]) * (i + 1))).join(", "), undefined, "px"]]),

  // ── C67 Image, Video and Media (14) ────────────────────────────────────────
  mk("video-storage-size", [p("Bitrate", 16, "Mbps"), p("Duration", 90, "min"), p("Audio bitrate", 0.128, "Mbps")],
    "bytes = (video + audio bitrate) × duration / 8", "Video storage size",
    (v) => {
      const bits = (v.bitrate + v["audio-bitrate"]) * 1e6 * v.duration * 60;
      return [["File size", bits / 8 / 1e9, 2, "GB", true], ["File size", bits / 8 / 1024 ** 3, 2, "GiB"]];
    }),

  mkx("video-bitrate", [s("Resolution", [["1080p", "1080p"], ["1440p", "1440p"], ["2160p", "4K UHD"]], "1080p"), p("Frame rate", 30, "fps"), p("Bits per pixel", 0.08)],
    "Target bitrate ≈ width × height × fps × bits-per-pixel", "Resolution and frame rate",
    (v) => {
      const [w, h] = v.resolution === "1080p" ? [1920, 1080] : v.resolution === "1440p" ? [2560, 1440] : [3840, 2160];
      const mbps = (w * h * v["frame-rate"] * v["bits-per-pixel"]) / 1e6;
      return [["Target bitrate", mbps, 2, "Mbps", true], ["Per hour", (mbps * 3600) / 8, 2, "MB/h"]];
    }),

  mk("streaming-bandwidth", [p("Bitrate per viewer", 6, "Mbps"), p("Concurrent viewers", 1500), p("Overhead", 15, "%")],
    "Bandwidth = bitrate × viewers × (1 + overhead)", "Streaming bandwidth",
    (v) => {
      const total = v["bitrate-per-viewer"] * v["concurrent-viewers"] * (1 + v.overhead / 100);
      return [["Required egress bandwidth", total, 0, "Mbps", true], ["In Gbps", total / 1000, 2, "Gbps"]];
    }),

  mk("video-duration", [p("File size", 4.5, "GB"), p("Bitrate", 12, "Mbps")],
    "Duration = size × 8 / bitrate", "Video duration from size",
    (v) => {
      const secs = (v["file-size"] * 8e9) / (v.bitrate * 1e6);
      return [["Duration", secs / 60, 2, "min", true], ["Duration", secs, 0, "s"]];
    }),

  mk("frame-rate-conversion", [p("Frame count", 7200), p("Original fps", 24), p("Target fps", 30)],
    "Retimed duration = frames / target fps", "Frame rate conversion",
    (v) => [["Original duration", v["frame-count"] / v["original-fps"], 2, "s", true],
      ["Retimed duration", v["frame-count"] / v["target-fps"], 2, "s"],
      ["Speed change", ((v["original-fps"] / v["target-fps"]) - 1) * 100, 2, "%"]],
    { limitations: ["Retiming changes duration; audio must be resampled or pitch-shifted, which a calculator cannot choose for you."] }),

  mk("video-aspect-conversion", [p("Source width", 1920, "px"), p("Source height", 1080, "px"), p("Target ratio", 16 / 9)],
    "Crop: preserve height, reduce width; pad: preserve both and add bars", "Aspect ratio conversion",
    (v) => {
      const src = v["source-width"] / v["source-height"];
      const cropW = Math.min(v["source-width"], v["source-height"] * v["target-ratio"]);
      return [["Source ratio", src.toFixed(3), 3, undefined],
        ["Crop width at target ratio", cropW, 0, "px", true],
        ["Padding required", Math.abs(v["target-ratio"] - src) > 1e-6 ? "Yes" : "No"]];
    }),

  mk("render-time", [p("Frames", 5400), p("Seconds per frame", 2.4, "s/frame"), it("Nodes", 1, { min: 1 })],
    "Time = frames × seconds per frame / nodes", "Render time estimate",
    (v) => [["Render time", (v.frames * v["seconds-per-frame"]) / (v.nodes * 3600), 2, "h", true],
      ["Frames per hour", (3600 / v["seconds-per-frame"]) * v.nodes, 0, "frames/h"]]),

  mk("gif-size", [p("Frames", 60), p("Frame size", 320, "KB"), p("Palette overhead", 5, "%")],
    "Size = frames × frame size × (1 + overhead)", "GIF size estimate",
    (v) => [["Estimated GIF size", (v.frames * v["frame-size"] * (1 + v["palette-overhead"] / 100)) / 1024, 2, "MB", true]]),

  mk("podcast-file-size", [p("Bitrate", 128, "kbps"), p("Minutes", 45, "min")],
    "MB = bitrate × seconds / 8 / 1000", "Podcast file size",
    (v) => [["File size", (v.bitrate * v.minutes * 60) / 8 / 1000, 2, "MB", true]]),

  mk("megapixel-resolution", [p("Width", 6000, "px"), p("Height", 4000, "px")],
    "Megapixels = width × height / 1e6", "Camera resolution",
    (v) => [["Megapixels", (v.width * v.height) / 1e6, 1, "MP", true], ["Aspect ratio", `${(v.width / gcdInt(Math.round(v.width), Math.round(v.height)))}:${(v.height / gcdInt(Math.round(v.width), Math.round(v.height)))}`]]),

  mk("slideshow-duration", [p("Slides", 40), p("Seconds per slide", 4.5, "s/slide")],
    "Total = slides × seconds", "Slideshow duration",
    (v) => [["Total duration", (v.slides * v["seconds-per-slide"]) / 60, 2, "min", true]]),

  mk("media-archive-size", [p("Assets", 25000), p("Average size", 18, "MB")],
    "Total = assets × average size", "Media archive size",
    (v) => [["Archive size", (v.assets * v["average-size"]) / 1e6, 2, "TB", true],
      ["Archive size", (v.assets * v["average-size"]) / 1000, 1, "GB"]],
    { limitations: ["Ignores proxies, versions and duplicated masters, which typically multiply archive size."] }),

  mk("upload-time", [p("File size", 2.5, "GB"), p("Uplink speed", 40, "Mbps"), p("Efficiency", 85, "%")],
    "Time = size × 8 / (uplink × efficiency)", "Upload time",
    (v) => {
      const secs = (v["file-size"] * 8e9) / (v["uplink-speed"] * 1e6 * (v.efficiency / 100));
      return [["Upload time", secs / 60, 2, "min", true], ["Effective upload rate", v["uplink-speed"] * (v.efficiency / 100), 1, "Mbps"]];
    }),

  mkx("transcode-multiplier", [t("Rendition bitrates", "8, 5, 3, 1.5, 0.8"), p("Source duration", 60, "min")],
    "Total storage = Σ rendition bitrates × duration / 8", "Transcode storage multiplier",
    (v) => {
      const rates = parseNumList(String(v["rendition-bitrates"]), 1);
      if (!rates.ok) return rates;
      const sum = rates.value.reduce((a, b) => a + b, 0);
      return [["Combined bitrate", sum, 2, "Mbps", true],
        ["Storage for duration", (sum * v["source-duration"] * 60) / 8 / 1000, 2, "GB"],
        ["Multiplier vs top rendition", sum / Math.max(...rates.value), 2, "×"]];
    }),

  // ── C68 Photography and Optics (14) ────────────────────────────────────────
  mk("depth-of-field", [p("Focal length", 50, "mm"), p("Aperture", 2.8), p("Focus distance", 3, "m"), p("Circle of confusion", 0.03, "mm")],
    "Hyperfocal H = f²/(Nc) + f; near = Hd/(H + d − f); far = Hd/(H − d + f)", "Depth of field",
    (v) => {
      const f = v["focal-length"], n = v.aperture, c = v["circle-of-confusion"], d = v["focus-distance"] * 1000;
      const h = (f * f) / (n * c) + f;
      const near = (h * d) / (h + (d - f));
      const far = (h * d) / (h - (d - f));
      return [["Hyperfocal distance", h / 1000, 2, "m", true],
        ["Near limit", near / 1000, 3, "m"], ["Far limit", far > 0 ? `${(far / 1000).toFixed(2)} m` : "Infinity"],
        ["Total DoF", far > 0 ? ((far - near) / 1000).toFixed(3) + " m" : "Infinite"]];
    },
    { assumptions: ["Circle of confusion is format-dependent and supplied (0.03 mm is a full-frame convention, not physics)."] }),

  mk("hyperfocal-distance", [p("Focal length", 24, "mm"), p("Aperture", 8), p("Circle of confusion", 0.03, "mm")],
    "H = f²/(N c) + f", "Hyperfocal distance",
    (v) => {
      const h = (v["focal-length"] ** 2) / (v.aperture * v["circle-of-confusion"]) + v["focal-length"];
      return [["Hyperfocal distance", h / 1000, 2, "m", true], ["Focus at half of H", h / 2000, 2, "m"]];
    }),

  mk("exposure-ev", [p("Aperture", 8), p("Shutter seconds", 1 / 125), p("ISO", 100)],
    "EV₁₀₀ = log₂(N²/t) − log₂(ISO/100)", "Exposure value",
    (v) => {
      const ev = Math.log2((v.aperture ** 2) / v["shutter-seconds"]);
      return [["EV at ISO 100", ev, 2, undefined, true],
        ["EV at selected ISO", ev - Math.log2(v.iso / 100), 2],
        ["Light level", ev > 12 ? "Bright daylight" : ev > 8 ? "Daylight" : ev > 4 ? "Indoor" : "Low light"]];
    }),

  mk("nd-filter-stops", [p("Shutter without filter", 1 / 500, "s"), p("Shutter with filter", 1 / 8, "s")],
    "stops = log₂(t_with / t_without)", "ND filter strength",
    (v) => [["Stops", Math.log2(v["shutter-with-filter"] / v["shutter-without-filter"]), 2, "stops", true],
      ["ND density", Math.log10(v["shutter-with-filter"] / v["shutter-without-filter"]) * 1, 2, "OD"]]),

  mk("flash-guide-number", [p("Guide number", 36, "m at ISO 100"), p("Distance", 4.5, "m")],
    "N = GN / distance", "Flash exposure",
    (v) => [["Aperture", v["guide-number"] / v.distance, 1, "f/", true],
      ["Aperture at twice the distance", v["guide-number"] / (v.distance * 2), 1, "f/"]]),

  mk("crop-factor", [p("Focal length", 35, "mm"), p("Crop factor", 1.5)],
    "Equivalent focal length = f × crop", "Crop factor and field of view",
    (v) => [["Full-frame equivalent focal length", v["focal-length"] * v["crop-factor"], 1, "mm", true],
      ["Horizontal field of view", (2 * Math.atan(36 / (2 * v["focal-length"] * v["crop-factor"])) * 180) / Math.PI, 1, "°"]],
    { assumptions: ["Crop factor changes field of view, not perspective or exposure (f-number equivalence is a separate concept)."] }),

  mk("print-size-ppi", [p("Pixel width", 6000), p("Pixel height", 4000), p("Print width", 12, "in")],
    "PPI = pixels / print inches", "Print resolution",
    (v) => {
      const ppi = v["pixel-width"] / v["print-width"];
      return [["Effective PPI", ppi, 1, "ppi", true],
        ["Print height", v["pixel-height"] / ppi, 2, "in"],
        ["Status", ppi >= 300 ? "Meets the 300 ppi photo convention" : "Below the 300 ppi convention"]];
    },
    { limitations: ["300 PPI is a common photo-print convention, not a universal requirement; viewing distance reduces the need."] }),

  mk("field-of-view", [p("Focal length", 50, "mm"), p("Sensor width", 36, "mm"), p("Sensor height", 24, "mm")],
    "FOV = 2 atan(dimension / 2f)", "Angle of view",
    (v) => [["Horizontal FOV", (2 * Math.atan(v["sensor-width"] / (2 * v["focal-length"])) * 180) / Math.PI, 2, "°", true],
      ["Vertical FOV", (2 * Math.atan(v["sensor-height"] / (2 * v["focal-length"])) * 180) / Math.PI, 2, "°"],
      ["Diagonal FOV", (2 * Math.atan(Math.hypot(v["sensor-width"], v["sensor-height"]) / (2 * v["focal-length"])) * 180) / Math.PI, 2, "°"]]),

  mkx("sunny-16", [s("Conditions", [["sunny16", "Sunny (Sunny 16)"], ["slight_over", "Slight overcast"], ["overcast", "Overcast"], ["shade", "Open shade"]], "sunny16"), p("ISO", 100), p("Aperture", 16)],
    "Sunny 16 baseline EV 15; each stop of cloud reduces exposure by one stop", "Sunny-16 exposure rule",
    (v) => {
      const baseEv = v.conditions === "sunny16" ? 15 : v.conditions === "slight_over" ? 14 : v.conditions === "overcast" ? 13 : 12;
      const ev = baseEv - Math.log2(v.iso / 100);
      const t = (v.aperture ** 2) / Math.pow(2, ev);
      return [["Scene EV", ev, 2, undefined, true], ["Shutter speed", t >= 1 ? `${t.toFixed(1)} s` : `1/${Math.round(1 / t)} s`]];
    }),

  mk("shutter-angle", [p("Frame rate", 24, "fps"), p("Shutter angle", 180, "°", { max: 360 })],
    "t = angle / (360 × fps)", "Shutter angle to shutter speed",
    (v) => {
      const t = v["shutter-angle"] / (360 * v["frame-rate"]);
      return [["Shutter speed", t, 5, "s", true], ["Shutter speed as fraction", `1/${Math.round(1 / t)} s`]];
    }),

  mk("star-trail-exposure", [p("Focal length", 24, "mm"), n("Declination", 45, "°"), p("Crop factor", 1)],
    "500-rule: t = 500 / (f × crop) × cos-ish declination factor", "Maximum star-trail-free exposure",
    (v) => {
      const t = (500 / (v["focal-length"] * v["crop-factor"])) * Math.cos(v.declination * D2R);
      return [["Maximum exposure", Math.max(1, t), 1, "s", true]];
    },
    { limitations: ["The 500 rule is a rough guideline for acceptable trailing; megapixel density and print size change the threshold."] }),

  mk("timelapse-interval", [p("Event duration", 120, "min"), p("Clip length", 20, "s"), p("Clip fps", 24, "fps")],
    "Frames needed = clip × fps; interval = event seconds / frames", "Time-lapse interval",
    (v) => {
      const frames = v["clip-length"] * v["clip-fps"];
      return [["Frames required", Math.ceil(frames), 0, "frames", true],
        ["Interval", (v["event-duration"] * 60) / frames, 2, "s", true]];
    }),

  mk("macro-magnification", [p("Extension", 36, "mm"), p("Focal length", 50, "mm")],
    "Magnification = extension / focal length", "Macro magnification",
    (v) => [["Magnification", v.extension / v["focal-length"], 3, "×", true],
      ["Effective aperture increase", Math.log2(1 + v.extension / v["focal-length"]), 2, "stops"]]),

  mk("lens-aperture-area", [p("Focal length", 50, "mm"), p("F-number", 2.8)],
    "Entrance pupil diameter = f / N; area = π(d/2)²", "Lens aperture area",
    (v) => {
      const d = v["focal-length"] / v["f-number"];
      return [["Entrance pupil diameter", d, 2, "mm", true], ["Aperture area", Math.PI * (d / 2) ** 2, 2, "mm²"]];
    }),

  // ── C69 Audio and Acoustics (12) ───────────────────────────────────────────
  mkx("db-spl-addition", [t("Levels", "80, 80, 74")],
    "L_total = 10 log₁₀(Σ 10^(Lᵢ/10))", "Incoherent sound-source summation",
    (v) => {
      const ls = parseNumList(String(v.levels), 1);
      if (!ls.ok) return ls;
      const total = 10 * Math.log10(ls.value.reduce((a, l) => a + Math.pow(10, l / 10), 0));
      return [["Combined level", total, 1, "dB SPL", true], ["Increase over loudest", total - Math.max(...ls.value), 1, "dB"]];
    },
    { assumptions: ["Incoherent sources add as power. Two equal 80 dB sources give 83 dB, not 160 dB."] }),

  mkx("decibel-conversion", [num("Level", 0), s("Reference", [["dbu", "dBu (0.775 V)"], ["dbv", "dBV (1 V)"], ["dbfs", "dBFS (digital full scale)"], ["spl", "dB SPL (20 µPa)"]], "dbu")],
    "dB are ratios against a stated reference; references are not interchangeable", "Level and reference",
    (v) => {
      const level = Number(v.level), ref = String(v.reference);
      if (ref === "dbu") return [["Voltage", 0.775 * Math.pow(10, level / 20), 4, "V", true], ["Reference", "0 dBu = 0.775 V"]];
      if (ref === "dbv") return [["Voltage", Math.pow(10, level / 20), 4, "V", true], ["Reference", "0 dBV = 1 V"]];
      if (ref === "dbfs") return [["Linear full-scale ratio", Math.pow(10, level / 20), 4, undefined, true], ["Reference", "0 dBFS = digital full scale"]];
      return [["Sound pressure", 20e-6 * Math.pow(10, level / 20), 6, "Pa", true], ["Reference", "0 dB SPL = 20 µPa"]];
    }),

  mk("speaker-impedance", [p("Amplifier voltage", 30, "V"), p("Speaker impedance", 8, "Ω"), it("Speakers in parallel", 2, { min: 1 }), p("Amplifier minimum load", 4, "Ω")],
    "Parallel load = Z / n; power = V² / Z", "Speaker load and power",
    (v) => {
      const z = v["speaker-impedance"] / v["speakers-in-parallel"];
      return [["Combined load", z, 2, "Ω", true], ["Power delivered", (v["amplifier-voltage"] ** 2) / z, 1, "W"],
        ["Status", z >= v["amplifier-minimum-load"] ? "Safe for amplifier" : "Below minimum load — risk of damage"]];
    }),

  mk("amplifier-power", [p("Speaker sensitivity", 88, "dB/W/m"), p("Listening distance", 3, "m"), p("Target SPL", 95, "dB")],
    "Required power = 10^((SPL_target − sensitivity + 20log₁₀(distance))/10)", "Amplifier power requirement",
    (v) => {
      const loss = 20 * Math.log10(v["listening-distance"]);
      const power = Math.pow(10, (v["target-spl"] - v["speaker-sensitivity"] + loss) / 10);
      return [["Required amplifier power", power, 1, "W", true], ["Distance loss", loss, 1, "dB"],
        ["Headroom (+3 dB)", power * 2, 1, "W"]];
    }),

  mk("room-mode-frequency", [p("Room length", 5.2, "m"), p("Speed of sound", 343, "m/s")],
    "Axial mode f = n × c / (2L)", "Room axial modes",
    (v) => {
      const f1 = v["speed-of-sound"] / (2 * v["room-length"]);
      return [["First axial mode", f1, 1, "Hz", true], ["Second mode", f1 * 2, 1, "Hz"], ["Third mode", f1 * 3, 1, "Hz"]];
    },
    { assumptions: ["Rigid-walled rectangular room; absorption and non-parallel walls shift real modes."] }),

  mk("wavelength-frequency", [p("Frequency", 440, "Hz"), p("Speed of sound", 343, "m/s")],
    "λ = c / f", "Wavelength and frequency",
    (v) => [["Wavelength", v["speed-of-sound"] / v.frequency, 4, "m", true],
      ["Period", 1 / v.frequency, 5, "s"]]),

  mk("speaker-delay-distance", [p("Distance", 12, "m"), p("Temperature", 20, "°C")],
    "c ≈ 331.3 + 0.606T; delay = distance / c", "Speaker delay alignment",
    (v) => {
      const c = 331.3 + 0.606 * v.temperature;
      return [["Speed of sound", c, 1, "m/s", true], ["Delay", ((v.distance / c) * 1000), 2, "ms"]];
    }),

  mk("dynamic-range", [it("Bit depth", 16, { min: 1, max: 32 })],
    "DR ≈ 6.02 × bits dB", "Digital dynamic range",
    (v) => [["Dynamic range", 6.02 * v["bit-depth"], 1, "dB", true], ["Quantisation levels", Math.pow(2, v["bit-depth"]), 0]]),

  mk("bit-depth-resolution", [it("Bits", 16, { min: 1, max: 32 }), p("Full-scale voltage", 2.0, "V")],
    "LSB = FS / 2^bits", "Bit depth resolution",
    (v) => [["LSB size", (v["full-scale-voltage"] / Math.pow(2, v["bits"])) * 1e6, 3, "µV", true],
      ["Quantisation SNR", 6.02 * v["bits"] + 1.76, 2, "dB"]]),

  mk("sample-rate-requirement", [p("Maximum frequency", 20000, "Hz")],
    "Nyquist: f_s ≥ 2 f_max", "Sample rate requirement",
    (v) => [["Minimum sample rate", v["maximum-frequency"] * 2, 0, "Hz", true],
      ["Minimum sample rate", (v["maximum-frequency"] * 2) / 1000, 1, "kHz"]]),

  mk("audio-latency", [p("Buffer size", 256, "samples"), p("Sample rate", 48000, "Hz")],
    "Latency = buffer / sample rate", "Audio buffer latency",
    (v) => [["Latency", (v["buffer-size"] / v["sample-rate"]) * 1000, 2, "ms", true],
      ["Round-trip (input + output)", (v["buffer-size"] / v["sample-rate"]) * 2000, 2, "ms"]]),

  mk("loudness-perception", [n("Level change", 10, "dB")],
    "Perceived loudness roughly doubles per +10 dB (Stevens' power law exponent ≈ 0.3)", "Perceived loudness change",
    (v) => [["Approximate perceived loudness ratio", Math.pow(10, v["level-change"] / 10 * 3.322 * 0.3), 2, "×", true],
      ["Rule of thumb", `≈ ${(v["level-change"] / 10).toFixed(1)} loudness doublings`]]),

  // ── C70 Telecommunications (10) ────────────────────────────────────────────
  mk("shannon-capacity", [p("Bandwidth", 20, "MHz"), p("SNR", 20, "dB")],
    "C = B log₂(1 + S/N), with S/N as a linear power ratio", "Shannon–Hartley capacity",
    (v) => {
      const snrLin = Math.pow(10, v.snr / 10);
      const c = v.bandwidth * 1e6 * Math.log2(1 + snrLin);
      return [["Channel capacity", c / 1e6, 2, "Mbps", true], ["Linear SNR", snrLin, 2, undefined],
        ["Spectral efficiency", Math.log2(1 + snrLin), 2, "b/s/Hz"]];
    }),

  mk("friis-path-loss", [p("Distance", 5, "km"), p("Frequency", 2400, "MHz")],
    "FSPL(dB) = 32.45 + 20log₁₀(f_MHz) + 20log₁₀(d_km)", "Free-space path loss",
    (v) => [["Free-space path loss", 32.45 + 20 * Math.log10(v.frequency) + 20 * Math.log10(v.distance), 2, "dB", true]]),

  mk("link-budget", [p("Transmit power", 20, "dBm"), p("TX antenna gain", 6, "dBi"), p("Path loss", 110, "dB"), p("RX antenna gain", 3, "dBi"), p("Other losses", 2, "dB")],
    "P_rx = P_tx + G_tx − L + G_rx − L_other", "Radio link budget",
    (v) => {
      const rx = v["transmit-power"] + v["tx-antenna-gain"] - v["path-loss"] + v["rx-antenna-gain"] - v["other-losses"];
      return [["Received power", rx, 2, "dBm", true]];
    }),

  mk("fresnel-zone", [p("Distance 1", 2, "km"), p("Distance 2", 3, "km"), p("Frequency", 5.8, "GHz")],
    "r = 17.32 √(d₁d₂ / (f D)) with d in km, f in GHz, r in metres", "First Fresnel zone radius",
    (v) => {
      const r = 17.32 * Math.sqrt((v["distance-1"] * v["distance-2"]) / (v.frequency * (v["distance-1"] + v["distance-2"])));
      return [["First Fresnel radius", r, 2, "m", true], ["60% clearance needed", r * 0.6, 2, "m"]];
    }),

  mk("eirp", [p("Transmit power", 30, "dBm"), p("Antenna gain", 12, "dBi"), p("Cable loss", 1.5, "dB")],
    "EIRP = P_tx + G − L", "Effective isotropic radiated power",
    (v) => [["EIRP", v["transmit-power"] + gain(v) - v["cable-loss"], 2, "dBm", true],
      ["EIRP in watts", Math.pow(10, (v["transmit-power"] + gain(v) - v["cable-loss"]) / 10) / 1000, 3, "W"]]),

  mk("erlang-traffic", [p("Traffic intensity", 12, "Erlang"), it("Channels", 16, { min: 1, max: 200 })],
    "Erlang B recursion: B(0) = 1; B(n) = E·B(n−1)/(n + E·B(n−1))", "Erlang B blocking probability",
    (v) => {
      let b = 1;
      for (let n = 1; n <= v.channels; n++) b = (v["traffic-intensity"] * b) / (n + v["traffic-intensity"] * b);
      return [["Blocking probability", b * 100, 3, "%", true], ["Grade of service", b < 0.01 ? "Better than 1%" : b < 0.02 ? "≈1–2%" : "Above 2%"],
        ["Channels", v.channels, 0]];
    },
    { assumptions: ["Iterative Erlang B recursion (no lookup tables) assuming Poisson arrivals and blocked-calls-cleared."] }),

  mk("antenna-gain", [p("Aperture diameter", 1.2, "m"), p("Frequency", 11, "GHz"), p("Efficiency", 65, "%")],
    "G = η (πD f / c)²", "Parabolic dish antenna gain",
    (v) => {
      const c = 299792458;
      const g = (v.efficiency / 100) * Math.pow((Math.PI * v["aperture-diameter"] * v.frequency * 1e9) / c, 2);
      return [["Gain (linear)", g, 1, "×", true], ["Gain", 10 * Math.log10(g), 2, "dBi"],
        ["Half-power beamwidth", (70 * c) / (v.frequency * 1e9 * v["aperture-diameter"]), 2, "°"]];
    }),

  mk("fiber-loss-budget", [p("Length", 12, "km"), p("Loss per km", 0.35, "dB/km"), it("Splices", 8, { min: 0 }), p("Splice loss", 0.1, "dB"), it("Connectors", 2, { min: 0 }), p("Connector loss", 0.5, "dB"), p("Margin", 3, "dB")],
    "Budget = length × loss/km + splices + connectors + margin", "Optical fibre link budget",
    (v) => {
      const total = v.length * v["loss-per-km"] + v.splices * v["splice-loss"] + v.connectors * v["connector-loss"] + v.margin;
      return [["Total link loss", total, 2, "dB", true],
        ["Fibre loss only", v.length * v["loss-per-km"], 2, "dB"]];
    }),

  mk("bandwidth-per-user", [p("Capacity", 10, "Gbps"), p("Users", 500), p("Oversubscription", 4)],
    "Per-user committed = capacity / (users × oversubscription)", "Bandwidth per user",
    (v) => {
      const per = (v.capacity * 1000) / (v.users * v.oversubscription);
      return [["Committed per user", per, 2, "Mbps", true], ["Contended per user", (v.capacity * 1000) / v.users, 2, "Mbps"]];
    }),

  mk("spectral-efficiency", [p("Throughput", 850, "Mbps"), p("Bandwidth", 100, "MHz")],
    "Efficiency = throughput / bandwidth", "Spectral efficiency",
    (v) => [["Spectral efficiency", v.throughput / v.bandwidth, 3, "b/s/Hz", true]]),

  // ── C71 Education and Grades (14) ──────────────────────────────────────────
  mkx("gpa", [t("Courses", "3:4.0, 4:3.7, 3:3.3, 2:3.0")],
    "GPA = Σ(credits × grade points) / Σcredits", "credits:grade pairs",
    (v) => {
      const items = String(v.courses).split(",").map((x) => x.trim()).filter(Boolean);
      if (items.length === 0) return err("Enter at least one course as credits:grade.");
      let cr = 0, pts = 0;
      for (const it of items) {
        const [c, g] = it.split(":").map((x) => Number(x));
        if (!Number.isFinite(c) || !Number.isFinite(g) || c <= 0) return err(`Invalid course entry "${it}".`);
        cr += c; pts += c * g;
      }
      return [["GPA", pts / cr, 3, undefined, true], ["Total credits", cr, 1], ["Quality points", pts, 1]];
    },
    { limitations: ["Grade-point scales are institution-specific (4.0, 4.3, 5.0, 10-point, percentage bands). Never assume 4.0."] }),

  mkx("weighted-gpa", [t("Courses", "4:4.0:1, 3:3.7:1, 3:3.3:2")],
    "GPA = Σ(credits × points × weight) / Σ(credits × weight)", "credits:grade:weight triples",
    (v) => {
      const items = String(v.courses).split(",").map((x) => x.trim()).filter(Boolean);
      let cr = 0, pts = 0;
      for (const it of items) {
        const [c, g, w] = it.split(":").map((x) => Number(x));
        if (![c, g, w].every(Number.isFinite) || c <= 0 || w <= 0) return err(`Invalid entry "${it}".`);
        cr += c * w; pts += c * g * w;
      }
      return [["Weighted GPA", pts / cr, 3, undefined, true], ["Weighted credits", cr, 1]];
    }),

  mk("cgpa-conversion", [p("CGPA", 8.1, undefined, { max: 10 }), p("Scale maximum", 10)],
    "Percentage ≈ CGPA / scale × 100 (institution-specific multiplier)", "CGPA to percentage",
    (v) => [["Percentage equivalent", (v.cgpa / v["scale-maximum"]) * 100, 2, "%", true]],
    { limitations: ["Conversion factors are institution-specific (e.g. ×9.5 for some Indian universities); use your own formula."] }),

  mk("grade-needed-final", [p("Current grade", 78, "%", { max: 100 }), p("Target grade", 80, "%", { max: 100 }), p("Final weight", 30, "%", { max: 100 })],
    "needed = (target − current × (1 − w)) / w", "Grade needed on the final",
    (v) => {
      const w = v["final-weight"] / 100;
      const needed = (v["target-grade"] - v["current-grade"] * (1 - w)) / w;
      if (needed > 100) return err(`Target is unattainable: it would require ${needed.toFixed(1)}% on the final, above the 100% maximum.`);
      return [["Grade needed on final", Math.max(0, needed), 1, "%", true],
        ["Status", needed <= 0 ? "Already secured" : "Achievable"]];
    }),

  mk("test-percentage", [p("Correct answers", 42), p("Total questions", 50)],
    "Score% = correct / total × 100", "Test score percentage",
    (v) => [["Score", (v["correct-answers"] / v["total-questions"]) * 100, 2, "%", true], ["Incorrect", v["total-questions"] - v["correct-answers"], 0, "questions"]]),

  mk("standard-score", [p("Raw score", 78), p("Mean", 70), p("Standard deviation", 8)],
    "z = (x − μ)/σ; T = 50 + 10z; stanine from z bands", "Standard score conversion",
    (v) => {
      const z = (v["raw-score"] - v.mean) / v["standard-deviation"];
      const stanine = z < -1.75 ? 1 : z < -1.25 ? 2 : z < -0.75 ? 3 : z < -0.25 ? 4 : z < 0.25 ? 5 : z < 0.75 ? 6 : z < 1.25 ? 7 : z < 1.75 ? 8 : 9;
      return [["z-score", z, 3, undefined, true], ["T-score", 50 + 10 * z, 1], ["Stanine", stanine, 0],
        ["Percentile (normal reference)", 0.5 * (1 + erf(z / Math.SQRT2)) * 100, 1, "%"]];
    },
    { assumptions: ["Assumes a normal reference distribution; percentiles are only meaningful against the stated norm group."] }),

  mk("class-rank", [p("Position", 12), p("Class size", 120)],
    "Percentile = (1 − position / size) × 100", "Class rank",
    (v) => [["Rank percentile (top %)", (v.position / v["class-size"]) * 100, 2, "%", true],
      ["Students below", v["class-size"] - v.position, 0]]),

  mkx("grading-curve", [t("Scores", "62, 71, 75, 80, 88"), s("Method", [["linear", "Linear scale to 100"], ["sqrt", "Square-root curve"], ["zscore", "Z-score standardisation"]], "linear")],
    "Linear: new = old × (100/max); sqrt: new = √(old × 100); z-score: 50 + 10z", "Score list and curve method",
    (v) => {
      const scores = parseNumList(String(v.scores), 1);
      if (!scores.ok) return scores;
      const max = Math.max(...scores.value);
      const mean = scores.value.reduce((a, b) => a + b, 0) / scores.value.length;
      const sd = Math.sqrt(scores.value.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.value.length);
      const curved = scores.value.map((s) => {
        if (v.method === "linear") return (s * 100) / max;
        if (v.method === "sqrt") return Math.sqrt(s * 100);
        if (sd === 0) return 50;
        return 50 + 10 * ((s - mean) / sd);
      });
      return [["Curved scores", curved.map((c) => c.toFixed(1)).join(", "), undefined, true],
        ["Highest", Math.max(...curved), 1], ["New mean", curved.reduce((a, b) => a + b, 0) / curved.length, 1]];
    },
    { limitations: ["Linear, square-root and z-score curves are different transformations with different fairness properties; the method must be labelled."] }),

  mkx("rubric-score", [t("Criterion scores", "3, 4, 2, 3"), t("Weights", "0.3, 0.3, 0.2, 0.2")],
    "Weighted rubric total = Σ(score × weight) / Σweights", "Rubric criteria",
    (v) => {
      const sc = parseNumList(String(v["criterion-scores"]), 1);
      const w = parseNumList(String(v.weights), 1);
      if (!sc.ok) return sc;
      if (!w.ok) return w;
      if (sc.value.length !== w.value.length) return err("Scores and weights must have equal length.");
      const ws = w.value.reduce((a, b) => a + b, 0);
      return [["Weighted rubric score", sc.value.reduce((a, s, i) => a + s * w.value[i], 0) / ws, 2, undefined, true],
        ["Total weight", ws, 2]];
    }),

  mk("attendance-rate", [p("Sessions attended", 82), p("Sessions held", 90)],
    "Attendance% = attended / held × 100", "Attendance rate",
    (v) => [["Attendance rate", (v["sessions-attended"] / v["sessions-held"]) * 100, 2, "%", true], ["Sessions missed", v["sessions-held"] - v["sessions-attended"], 0]]),

  mk("study-time-plan", [p("Topics", 12), p("Days until deadline", 9), p("Hours per topic", 2.5, "h/topic")],
    "Hours per day = topics × hours per topic / days", "Study time planner",
    (v) => [["Daily study time", (v.topics * v["hours-per-topic"]) / v["days-until-deadline"], 2, "h/day", true],
      ["Total study hours", v.topics * v["hours-per-topic"], 1, "h"]]),

  mk("reading-speed", [p("Words", 900), p("Minutes", 4.5, "min")],
    "WPM = words / minutes; time = words / WPM", "Reading speed",
    (v) => [["Reading speed", v.words / v.minutes, 0, "words/min", true],
      ["Time for 1,000 words", 1000 / (v.words / v.minutes), 1, "min"]]),

  mkx("quiz-average", [t("Scores", "88, 76, 92, 70, 95"), s("Drop", [["none", "Use all scores"], ["lowest", "Drop lowest"], ["two", "Drop two lowest"]], "lowest")],
    "Average of remaining scores", "Quiz score list and drop rule",
    (v) => {
      const s0 = parseNumList(String(v.scores), 1);
      if (!s0.ok) return s0;
      const sorted = [...s0.value].sort((a, b) => b - a);
      const drop = v.drop === "none" ? 0 : v.drop === "lowest" ? 1 : 2;
      if (sorted.length - drop < 1) return err("Not enough scores to drop that many.");
      const kept = sorted.slice(0, sorted.length - drop);
      return [["Average", kept.reduce((a, b) => a + b, 0) / kept.length, 2, "%", true],
        ["Scores used", kept.length, 0]];
    }),

  mk("degree-classification", [p("Weighted average", 68, "%", { max: 100 }), it("Modules", 9, { min: 1 })],
    "Parametric UK-style band mapping from the weighted average", "Degree classification",
    (v) => {
      const a = v["weighted-average"];
      const cls = a >= 70 ? "First-class honours" : a >= 60 ? "Upper second (2:1)" : a >= 50 ? "Lower second (2:2)" : a >= 40 ? "Third-class honours" : "Below honours threshold";
      return [["Indicative classification", cls, undefined, true], ["Weighted average", a, 1, "%"]];
    },
    { limitations: ["Classification rules are institution- and country-specific (module weighting, borderline committees, compensation). Parametric mapping only — specialist review required."] }),
];

// ── Small local helpers ──────────────────────────────────────────────────────
function nn(label: string, def: number) {
  return { key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, kind: "number" as const, defaultValue: String(def), min: 0, step: "any" };
}
function num(label: string, def: number) {
  return { key: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label, kind: "number" as const, defaultValue: String(def), step: "any" };
}
function gain(v: { "antenna-gain": number }): number {
  return v["antenna-gain"];
}
