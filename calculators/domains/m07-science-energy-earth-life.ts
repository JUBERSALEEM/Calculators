import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { it, mk, mkx, n, p, s, t, z } from "@/lib/engine/dsl";
import { erf, parseISODateUTC, parseNumList } from "@/lib/engine/helpers";

const R_GAS = 8.314462618;
const D2R = Math.PI / 180;
const FT2 = 10.7639104167097;

export const M07_SPECS: CalculatorSpec[] = [
  // ── C46 Chemistry and Laboratory Methods (20) ──────────────────────────────
  mk("molarity", [p("Moles", 0.25, "mol"), p("Volume", 2.5, "L")],
    "M = n / V(L)", "Moles of solute and solution volume",
    (v) => [["Molarity", v.moles / v.volume, 4, "mol/L", true], ["Millimolarity", (v.moles / v.volume) * 1000, 2, "mmol/L"]]),

  mk("molality", [p("Moles", 0.5, "mol"), p("Solvent mass", 2.0, "kg")],
    "m = n / kg solvent", "Moles of solute and solvent mass",
    (v) => [["Molality", v.moles / v["solvent-mass"], 4, "mol/kg", true]]),

  mk("dilution-c1v1", [p("C1", 2.0, "M"), p("V1", 50, "mL"), p("C2", 0.5, "M")],
    "C₁V₁ = C₂V₂ ⇒ V₂ = C₁V₁ / C₂", "Stock and target concentration",
    (v) => [["Required final volume", (v.c1 * v.v1) / v.c2, 2, "mL", true],
      ["Diluent to add", (v.c1 * v.v1) / v.c2 - v.v1, 2, "mL"]],
    { assumptions: ["Assumes the solute is conserved and volumes are additive — invalid for reacting solutes or strongly non-ideal mixtures."] }),

  mk("mass-percent", [p("Solute mass", 25, "g"), p("Solution mass", 200, "g")],
    "w/w% = solute / solution × 100", "Mass percentage concentration",
    (v) => [["Mass percent (w/w)", (v["solute-mass"] / v["solution-mass"]) * 100, 3, "%", true]]),

  mk("ppm-ppb", [p("Solute mass", 0.012, "g"), p("Solution mass", 1000, "g")],
    "ppm = mg/kg; ppb = µg/kg (dilute aqueous)", "Trace concentration",
    (v) => {
      const mg = v["solute-mass"] * 1000, kg = v["solution-mass"] / 1000;
      return [["ppm", mg / kg, 3, "mg/kg", true], ["ppb", (mg * 1000) / kg, 1, "µg/kg"]];
    }),

  mk("normality", [p("Molarity", 0.5, "M"), p("Equivalents", 2)],
    "N = M × equivalents per mole", "Normality from molarity",
    (v) => [["Normality", v.molarity * v.equivalents, 4, "N", true]]),

  mk("ph-strong-acid", [p("Concentration", 0.01, "M")],
    "pH = −log₁₀[H⁺] (strong acid fully dissociated)", "Strong monoprotic acid concentration",
    (v) => [["pH", -Math.log10(v.concentration), 3, undefined, true], ["pOH", 14 + Math.log10(v.concentration), 3],
      ["[H⁺]", v.concentration, 6, "M"]],
    { assumptions: ["Complete dissociation assumed; activity coefficients neglected (valid only in dilute solutions)."] }),

  mk("ph-weak-acid", [p("Ka", 1.8e-5), p("Concentration", 0.1, "M")],
    "Solve Ka = x²/(C − x) quadratically for x = [H⁺]", "Weak monoprotic acid pH",
    (v) => {
      const ka = v.ka, c = v.concentration;
      const x = (-ka + Math.sqrt(ka * ka + 4 * ka * c)) / 2;
      return [["pH", -Math.log10(x), 3, undefined, true], ["[H⁺]", x, 8, "M"], ["Degree of dissociation", (x / c) * 100, 3, "%"]];
    }),

  mk("buffer-henderson", [p("pKa", 4.76), p("Base concentration", 0.1, "M"), p("Acid concentration", 0.1, "M")],
    "pH = pKa + log₁₀([A⁻]/[HA])", "Henderson–Hasselbalch buffer pH",
    (v) => [["pH", v.pka + Math.log10(v["base-concentration"] / v["acid-concentration"]), 3, undefined, true],
      ["Concentration ratio", v["base-concentration"] / v["acid-concentration"], 3, undefined]],
    { assumptions: ["Valid within ~±1 pH unit of pKa and at moderate ionic strength; activities approximated by concentrations."] }),

  mk("titration-calculation", [p("Titrant concentration", 0.1, "M"), p("Titrant volume", 24.5, "mL"), p("Analyte volume", 25, "mL"), p("Stoichiometric ratio", 1)],
    "C_a = (C_t V_t ν) / V_a", "Titration equivalence calculation",
    (v) => [["Analyte concentration", (v["titrant-concentration"] * v["titrant-volume"] * v["stoichiometric-ratio"]) / v["analyte-volume"], 4, "M", true],
      ["Moles titrated", (v["titrant-concentration"] * v["titrant-volume"]) / 1000, 5, "mol"]]),

  mk("stoichiometry", [p("Reactant mass", 120, "g"), p("Reactant molar mass", 46, "g/mol"), p("Product molar mass", 88, "g/mol"), p("Stoichiometric ratio", 1)],
    "mol product = mol reactant × ratio; mass = mol × M_product", "Stoichiometric product mass",
    (v) => {
      const mol = (v["reactant-mass"] / v["reactant-molar-mass"]) * v["stoichiometric-ratio"];
      return [["Product mass (theoretical)", mol * v["product-molar-mass"], 2, "g", true], ["Product moles", mol, 4, "mol"]];
    }),

  mk("limiting-reagent", [p("Moles A", 3.5, "mol"), p("Coefficient A", 2), p("Moles B", 2.0, "mol"), p("Coefficient B", 1)],
    "Limiting reagent = smallest n/ν; extent of reaction ξ = min(nᵢ/νᵢ)", "Two co-reactants with stoichiometric coefficients",
    (v) => {
      const a = v["moles-a"] / v["coefficient-a"], b = v["moles-b"] / v["coefficient-b"];
      return [["Extent of reaction ξ", Math.min(a, b), 4, "mol", true],
        ["Limiting reagent", a < b ? "Reactant A" : a > b ? "Reactant B" : "Stoichiometric mixture"],
        ["Excess n/ν", Math.abs(a - b), 4, "mol"]];
    }),

  mk("theoretical-yield", [p("Actual yield", 84.5, "g"), p("Theoretical yield", 105.0, "g")],
    "Yield% = actual / theoretical × 100", "Percent yield",
    (v) => [["Percent yield", (v["actual-yield"] / v["theoretical-yield"]) * 100, 2, "%", true],
      ["Loss", v["theoretical-yield"] - v["actual-yield"], 2, "g"]]),

  mkx("molar-mass", [p("Formula mass units", 180, "g/mol"), s("Basis", [["mono", "Monatomic / as written"], ["diatomic", "Diatomic (×2)"]], "mono")],
    "Molar mass = Σ atomic masses (supplied from a periodic table)", "User-supplied atomic sum",
    (v) => [["Molar mass", v["formula-mass-units"] * (v.basis === "diatomic" ? 2 : 1), 3, "g/mol", true]],
    { limitations: ["Atomic weights are not embedded; enter the sum from IUPAC standard atomic weights for the exact formula."] }),

  mk("mole-conversion", [p("Mass", 36, "g"), p("Molar mass", 18, "g/mol")],
    "n = m / M; N = n × N_A", "Mass ↔ mole ↔ particle conversion",
    (v) => {
      const mol = v.mass / v["molar-mass"];
      return [["Moles", mol, 5, "mol", true], ["Particles", mol * 6.02214076e23, 4, "×10²³? "], ["Molecules", (mol * 6.02214076e23) / 1e23, 4, "×10²³"]];
    }),

  mk("combined-gas-law", [p("P1", 101.325, "kPa"), p("V1", 2.0, "L"), p("T1", 298.15, "K"), p("P2", 202.65, "kPa"), p("T2", 310.15, "K")],
    "P₁V₁/T₁ = P₂V₂/T₂", "Ideal gas between two states",
    (v) => [["Final volume V₂", (v.p1 * v.v1 * v.t2) / (v.t1 * v.p2), 4, "L", true]]),

  mk("equilibrium-constant", [p("Product concentration", 0.8, "M"), p("Reactant concentration", 0.2, "M"), p("Product coefficient", 1), p("Reactant coefficient", 1)],
    "Kc = [products]^νp / [reactants]^νr", "Equilibrium constant from concentrations",
    (v) => [["Kc", Math.pow(v["product-concentration"], v["product-coefficient"]) / Math.pow(v["reactant-concentration"], v["reactant-coefficient"]), 5, undefined, true],
      ["ΔG° (at 298.15 K)", -R_GAS * 298.15 * Math.log(Math.pow(v["product-concentration"], v["product-coefficient"]) / Math.pow(v["reactant-concentration"], v["reactant-coefficient"])) / 1000, 3, "kJ/mol"]]),

  mkx("half-life-reaction", [s("Order", [["first", "First order"], ["zero", "Zero order"], ["second", "Second order"]], "first"), p("Rate constant", 0.05), p("Initial concentration", 1.0, "M")],
    "First: t½ = ln2/k; Zero: C₀/2k; Second: 1/(kC₀)", "Reaction half-life by order",
    (v) => {
      const k = v["rate-constant"], c0 = v["initial-concentration"];
      const t = v.order === "first" ? Math.LN2 / k : v.order === "zero" ? c0 / (2 * k) : 1 / (k * c0);
      return [["Half-life", t, 4, "s", true], ["Order", String(v.order)]];
    }),

  mk("arrhenius-rate", [p("Activation energy", 75, "kJ/mol"), p("T1", 298.15, "K"), p("T2", 318.15, "K")],
    "k₂/k₁ = exp(−Ea/R (1/T₂ − 1/T₁))", "Arrhenius temperature acceleration",
    (v) => {
      const ratio = Math.exp((-v["activation-energy"] * 1000) / R_GAS * (1 / v.t2 - 1 / v.t1));
      return [["Rate constant ratio k₂/k₁", ratio, 3, "×", true], ["Activation energy", v["activation-energy"], 1, "kJ/mol"]];
    }),

  mkx("empirical-formula", [t("Mass percents", "40.0, 6.7, 53.3"), t("Atomic masses", "12.011, 1.008, 15.999")],
    "Divide each mass % by its atomic mass, then divide all quotients by the smallest", "Elemental mass percentages and atomic masses",
    (v) => {
      const pct = parseNumList(String(v["mass-percents"]), 1);
      const am = parseNumList(String(v["atomic-masses"]), 1);
      if (!pct.ok) return pct;
      if (!am.ok) return am;
      if (pct.value.length !== am.value.length) return err("Mass percentages and atomic masses must have equal length.");
      if (am.value.some((x) => x <= 0)) return err("Atomic masses must be positive.");
      const quot = pct.value.map((p0, i) => p0 / am.value[i]);
      const min = Math.min(...quot);
      const ratio = quot.map((q) => Math.round(q / min));
      return [["Empirical ratio", ratio.join(" : "), undefined, true],
        ["Normalised quotients", quot.map((q) => (q / min).toFixed(2)).join(", ")],
        ["Smallest quotient", min, 4]];
    }),

  // ── C47 Biology and Life Sciences (10) ─────────────────────────────────────
  mk("population-growth", [p("Initial population", 500), p("Growth rate", 0.08, "per year"), p("Time", 12, "years")],
    "N(t) = N₀ e^(rt)", "Exponential population growth",
    (v) => [["Population at t", v["initial-population"] * Math.exp(v["growth-rate"] * v.time), 0, "individuals", true],
      ["Doubling time", Math.LN2 / v["growth-rate"], 2, "years"]]),

  mk("logistic-growth", [p("Initial population", 100), p("Growth rate", 0.35), p("Carrying capacity", 5000), p("Time", 10, "years")],
    "N(t) = K / (1 + ((K − N₀)/N₀) e^(−rt))", "Logistic growth with supplied carrying capacity",
    (v) => {
      const k = v["carrying-capacity"];
      const n = k / (1 + ((k - v["initial-population"]) / v["initial-population"]) * Math.exp(-v["growth-rate"] * v.time));
      return [["Population at t", n, 0, "individuals", true], ["Share of carrying capacity", (n / k) * 100, 1, "%"]];
    }),

  mk("hardy-weinberg", [p("Allele frequency p", 0.6, undefined, { max: 1 })],
    "p² + 2pq + q² = 1, q = 1 − p", "Hardy–Weinberg genotype frequencies",
    (v) => {
      const q = 1 - v["allele-frequency-p"];
      return [["Homozygous dominant p²", v["allele-frequency-p"] * v["allele-frequency-p"], 4, undefined, true],
        ["Heterozygous 2pq", 2 * v["allele-frequency-p"] * q, 4], ["Homozygous recessive q²", q * q, 4], ["q", q, 4]];
    },
    { assumptions: ["Assumes no selection, mutation, migration, drift and random mating in a large population."] }),

  mkx("punnett-ratio", [s("Cross", [["mono", "Monohybrid Aa × Aa"], ["dihybrid", "Dihybrid AaBb × AaBb"]], "mono")],
    "Monohybrid 3:1; dihybrid 9:3:3:1 for independent assortment", "Mendelian phenotype ratios",
    (v) => (v.cross === "mono"
      ? [["Dominant : recessive", "3 : 1", undefined, true], ["Recessive frequency", 25, 1, "%"]]
      : [["Phenotype ratio", "9 : 3 : 3 : 1", undefined, true], ["Fully recessive frequency", 6.25, 2, "%"]]),
    { assumptions: ["Assumes complete dominance, independent assortment and no linkage."] }),

  mk("cell-doubling-time", [p("Initial count", 1.0e5, "cells/mL"), p("Final count", 8.0e5, "cells/mL"), p("Elapsed time", 6, "h")],
    "t_d = t · ln2 / ln(N/N₀)", "Cell doubling time",
    (v) => {
      const gens = Math.log(v["final-count"] / v["initial-count"]) / Math.LN2;
      return [["Doubling time", v["elapsed-time"] / gens, 2, "h", true], ["Generations", gens, 2, undefined]];
    }),

  mk("bacterial-growth", [p("Lag time", 2, "h"), p("Growth rate", 0.6, "/h"), p("Time", 10, "h"), p("Initial count", 1.0e4)],
    "N = N₀ e^(μ(t − lag)) for t > lag", "Bacterial growth with lag phase",
    (v) => {
      const t = Math.max(0, v.time - v["lag-time"]);
      return [["Population", v["initial-count"] * Math.exp(v["growth-rate"] * t), 0, "CFU", true],
        ["Log increase", (v["growth-rate"] * t) / Math.LN2, 2, "generations"]];
    }),

  mk("dna-concentration", [p("A260 absorbance", 0.85), p("Dilution factor", 50), p("Extinction coefficient", 50, "ng·mL/µL")],
    "[dsDNA] = A260 × dilution × 50 ng/µL", "DNA concentration from absorbance",
    (v) => [["DNA concentration", v["a260-absorbance"] * v["dilution-factor"] * v["extinction-coefficient"], 1, "ng/µL", true],
      ["A260/A280 purity check needs a second reading", "—"]]),

  mk("protein-molecular-weight", [p("Residue count", 350), p("Mean residue mass", 110, "Da")],
    "MW ≈ residues × mean residue mass (110 Da typical)", "Protein molecular weight estimate",
    (v) => [["Molecular weight", (v["residue-count"] * v["mean-residue-mass"]) / 1000, 2, "kDa", true]],
    { assumptions: ["Mean residue mass approximates composition; use exact sequence summation for precise mass spectrometry work."] }),

  mk("enzyme-kinetics-mm", [p("Vmax", 120, "µmol/min"), p("Km", 2.5, "mM"), p("Substrate", 5, "mM")],
    "v = Vmax·S / (Km + S)", "Michaelis–Menten kinetics",
    (v) => [["Reaction velocity", (v.vmax * v.substrate) / (v.km + v.substrate), 2, "µmol/min", true],
      ["Fraction of Vmax", (v.substrate / (v.km + v.substrate)) * 100, 1, "%"]]),

  mk("dilution-series", [p("Stock concentration", 1.0, "M"), p("Dilution factor", 10), it("Steps", 5, { min: 1, max: 20 })],
    "C_n = C₀ / factor^n", "Serial dilution series",
    (v) => {
      const last = v["stock-concentration"] / Math.pow(v["dilution-factor"], v.steps);
      return [["Final concentration", last, 8, "M", true], ["Cumulative dilution", Math.pow(v["dilution-factor"], v.steps), 0, "×"]];
    }),

  // ── C48 Environmental Science and Emissions (14) ───────────────────────────
  mk("co2-electricity", [p("Energy", 3500, "kWh"), p("Grid factor", 0.71, "kg CO₂e/kWh")],
    "Emissions = kWh × grid emission factor", "Scope 2 electricity emissions",
    (v) => [["Emissions", (v.energy * v["grid-factor"]) / 1000, 3, "t CO₂e", true],
      ["Emissions", v.energy * v["grid-factor"], 0, "kg CO₂e"]],
    { assumptions: ["The grid emission factor must come from a versioned inventory (e.g. IEA/EPA/DEFRA) for your region and year."] }),

  mk("co2-per-km", [p("Fuel used", 6.5, "L/100km"), p("Emission factor", 2.31, "kg CO₂/L")],
    "g CO₂/km = (L/100km × factor) × 10", "Vehicle tailpipe emissions intensity",
    (v) => [["Emissions intensity", v["fuel-used"] * v["emission-factor"] * 10, 1, "g CO₂/km", true],
      ["Per 100 km", v["fuel-used"] * v["emission-factor"], 2, "kg CO₂"]]),

  mkx("co2-per-litre-fuel", [p("Litres", 45, "L"), s("Fuel", [["diesel", "Diesel (2.68 kg/L)"], ["petrol", "Petrol (2.31 kg/L)"], ["lpg", "LPG (1.51 kg/L)"]], "diesel")],
    "kg CO₂ = litres × fuel-specific factor", "Combustion CO₂ by fuel",
    (v) => {
      const factor = v.fuel === "diesel" ? 2.68 : v.fuel === "petrol" ? 2.31 : 1.51;
      return [["CO₂ emitted", v.litres * factor, 2, "kg", true], ["Factor used", factor, 2, "kg CO₂/L"]];
    },
    { assumptions: ["Factors are typical stoichiometric values; use your national inventory factor (DEFRA/EPA) for reporting."] }),

  mk("tree-offset", [p("Emissions", 12, "t CO₂"), p("Sequestration", 22, "kg CO₂/tree/yr")],
    "Trees = emissions / annual sequestration", "Tree-equivalent offset",
    (v) => [["Tree-years required", (v.emissions * 1000) / v.sequestration, 0, "tree-years", true],
      ["Trees for a 10-year horizon", (v.emissions * 1000) / (v.sequestration * 10), 0, "trees"]],
    { limitations: ["Sequestration varies with species, age, climate and survival. Tree equivalents are illustrative, not a verified offset."] }),

  mk("water-footprint", [p("Showers per week", 7), p("Minutes per shower", 8), p("Flow rate", 9, "L/min"), p("Laundry loads", 4), p("Load volume", 50, "L")],
    "Weekly litres = showers × minutes × flow + loads × volume", "Household water footprint",
    (v) => {
      const weekly = v["showers-per-week"] * v["minutes-per-shower"] * v["flow-rate"] + v["laundry-loads"] * v["load-volume"];
      return [["Weekly water use", weekly, 0, "L", true], ["Annual water use", (weekly * 52) / 1000, 1, "m³"]];
    }),

  mk("waste-diversion-rate", [p("Diverted", 320, "t"), p("Disposed", 180, "t")],
    "Diversion% = diverted / (diverted + disposed) × 100", "Waste diversion rate",
    (v) => [["Diversion rate", (v.diverted / (v.diverted + v.disposed)) * 100, 2, "%", true]]),

  mk("recycling-rate", [p("Recycled", 260, "t"), p("Generated", 500, "t")],
    "Recycling% = recycled / generated × 100", "Recycling rate",
    (v) => [["Recycling rate", (v.recycled / v.generated) * 100, 2, "%", true], ["Residual waste", v.generated - v.recycled, 1, "t"]]),

  mk("emission-factor", [p("Activity", 12000, "units"), p("Factor", 0.42, "kg CO₂e/unit")],
    "Emissions = activity × factor", "Activity × emission factor",
    (v) => [["Emissions", (v.activity * v.factor) / 1000, 3, "t CO₂e", true]]),

  mk("aqi-category", [p("PM2.5 concentration", 28, "µg/m³")],
    "Piecewise-linear interpolation of US EPA PM2.5 breakpoints", "US EPA AQI for PM2.5",
    (v) => {
      const c = v["pm2-5-concentration"];
      const bp: Array<[number, number, number, number]> = [
        [0, 12.0, 0, 50], [12.1, 35.4, 51, 100], [35.5, 55.4, 101, 150],
        [55.5, 150.4, 151, 200], [150.5, 250.4, 201, 300], [250.5, 350.4, 301, 400], [350.5, 500.4, 401, 500],
      ];
      if (c < 0) return err("Concentration cannot be negative.");
      if (c > 500.4) return err("Concentration exceeds the AQI table range (500.4 µg/m³).");
      for (const [cLo, cHi, iLo, iHi] of bp) {
        if (c <= cHi) {
          const aqi = Math.round(((iHi - iLo) / (cHi - cLo)) * (c - cLo) + iLo);
          const cat = aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "Unhealthy for sensitive groups"
            : aqi <= 200 ? "Unhealthy" : aqi <= 300 ? "Very unhealthy" : "Hazardous";
          return [["AQI", aqi, 0, undefined, true], ["Category", cat], ["Basis", "US EPA PM2.5 breakpoints"]];
        }
      }
      return err("Unreachable AQI range.");
    },
    { assumptions: ["US EPA AQI breakpoints (public regulatory table). WHO and other national indices use different breakpoints."] }),

  mkx("carbon-credit", [p("Emissions reduced", 250, "t CO₂e")],
    "Credits = 1 per tonne CO₂e reduced", "Carbon credit equivalent",
    (v) => [["Credits (t CO₂e)", v["emissions-reduced"], 0, "credits", true]],
    { limitations: ["Registry eligibility, additionality and verification determine whether a reduction is creditable; this is a unit conversion only."] }),

  mk("energy-intensity", [p("Energy", 4800, "MWh"), p("Output", 1200, "t")],
    "Intensity = energy / output", "Energy intensity",
    (v) => [["Energy per unit output", v.energy / v.output, 3, "MWh/t", true],
      ["Energy per unit output", (v.energy * 1000) / v.output, 1, "kWh/t"]]),

  mk("gwp-conversion", [p("Gas mass", 12, "kg"), p("GWP factor", 28)],
    "CO₂e = mass × GWP", "Global warming potential conversion",
    (v) => [["CO₂ equivalent", (v["gas-mass"] * v["gwp-factor"]) / 1000, 3, "t CO₂e", true]],
    { assumptions: ["GWP depends on the assessment report (AR5 CH₄ = 28, AR6 fossil CH₄ = 29.8). Display the factor used."] }),

  mk("compost-cn-ratio", [p("Browns mass", 30, "kg"), p("Browns C:N", 60), p("Greens mass", 20, "kg"), p("Greens C:N", 15)],
    "C:N = Σ(mᵢ × C:Nᵢ) / Σmᵢ (mass-weighted)", "Compost feedstock carbon-to-nitrogen ratio",
    (v) => {
      const tot = v["browns-mass"] + v["greens-mass"];
      const ratio = (v["browns-mass"] * v["browns-c-n"] + v["greens-mass"] * v["greens-c-n"]) / tot;
      return [["Blended C:N ratio", ratio, 1, ": 1", true], ["Total feedstock mass", tot, 1, "kg"]];
    }),

  mk("scope-emissions", [p("Scope 1 direct", 850, "t CO₂e"), p("Scope 2 electricity", 420, "t CO₂e"), p("Scope 3 value chain", 5600, "t CO₂e")],
    "Totals by GHG Protocol scope boundary", "Scope 1/2/3 inventory summary",
    (v) => {
      const tot = v["scope-1-direct"] + v["scope-2-electricity"] + v["scope-3-value-chain"];
      return [["Total footprint", tot, 1, "t CO₂e", true], ["Scope 1 share", (v["scope-1-direct"] / tot) * 100, 1, "%"],
        ["Scope 2 share", (v["scope-2-electricity"] / tot) * 100, 1, "%"], ["Scope 3 share", (v["scope-3-value-chain"] / tot) * 100, 1, "%"]];
    }),

  // ── C49 Renewable Energy and Solar (15) ────────────────────────────────────
  mk("pv-system-size", [p("Daily demand", 18, "kWh/day"), p("Peak sun hours", 4.8, "kWh/m²/day"), p("Performance ratio", 0.8)],
    "kWp = demand / (H × PR)", "PV array sizing",
    (v) => [["Required array size", v["daily-demand"] / (v["peak-sun-hours"] * v["performance-ratio"]), 2, "kWp", true],
      ["Annual yield", v["daily-demand"] * 365, 0, "kWh/yr"]]),

  mk("pv-daily-yield", [p("Array size", 6.5, "kWp"), p("Peak sun hours", 4.8, "kWh/m²/day"), p("Performance ratio", 0.8)],
    "E = kWp × H × PR", "PV daily energy yield",
    (v) => [["Daily yield", v["array-size"] * v["peak-sun-hours"] * v["performance-ratio"], 2, "kWh/day", true],
      ["Annual yield", v["array-size"] * v["peak-sun-hours"] * v["performance-ratio"] * 365, 0, "kWh/yr"]]),

  mk("panel-count", [p("Array size", 6.5, "kWp"), p("Panel wattage", 400, "Wp"), p("Panel area", 1.95, "m²")],
    "Panels = ceil(kWp × 1000 / Wp)", "Module count and area",
    (v) => {
      const n0 = Math.ceil((v["array-size"] * 1000) / v["panel-wattage"]);
      return [["Panels required", n0, 0, "panels", true], ["Total module area", n0 * v["panel-area"], 2, "m²"]];
    }),

  mk("inverter-sizing", [p("Array kWp", 6.5, "kWp"), p("DC AC ratio", 1.25)],
    "Inverter kW = array kWp / DC:AC ratio", "Inverter sizing from DC/AC ratio",
    (v) => [["Recommended inverter size", v["array-kwp"] / v["dc-ac-ratio"], 2, "kW", true],
      ["DC:AC ratio", v["dc-ac-ratio"], 2, undefined]]),

  mk("pv-payback", [p("System cost", 9500, "$"), p("Annual savings", 1450, "$")],
    "Payback = capex / annual savings", "Simple PV payback",
    (v) => [["Simple payback", v["system-cost"] / v["annual-savings"], 2, "years", true]],
    { limitations: ["Ignores panel degradation, tariff escalation, inverter replacement and financing cost."] }),

  mk("pv-roi", [p("System cost", 9500, "$"), p("Annual savings", 1450, "$"), p("Lifetime", 25, "years")],
    "ROI% = (lifetime savings − capex) / capex × 100", "PV lifetime ROI",
    (v) => {
      const gain = v["annual-savings"] * v.lifetime - v["system-cost"];
      return [["Lifetime ROI", (gain / v["system-cost"]) * 100, 1, "%", true], ["Net lifetime benefit", gain, 0, "$"]];
    }),

  mkx("tilt-angle", [p("Latitude", 28, "°"), s("Season", [["year", "Year-round"], ["summer", "Summer"], ["winter", "Winter"]], "year")],
    "Rule of thumb: year-round ≈ latitude; summer ≈ latitude − 15°; winter ≈ latitude + 15°", "Tilt estimate",
    (v) => {
      const adj = v.season === "summer" ? -15 : v.season === "winter" ? 15 : 0;
      return [["Recommended tilt", Math.max(0, Math.min(90, v.latitude + adj)), 1, "°", true]];
    },
    { limitations: ["Site-specific optimisation with irradiance data (PVWatts/SAM) supersedes this rule of thumb; local shading and albedo matter."] }),

  mk("irradiance-to-kwh", [p("Area", 40, "m²"), p("Irradiance", 5.2, "kWh/m²/day"), p("Efficiency", 18, "%")],
    "E = area × irradiance × efficiency", "Incident energy to electrical output",
    (v) => [["Daily electrical energy", v.area * v.irradiance * (v.efficiency / 100), 2, "kWh/day", true],
      ["Installed capacity equivalent", (v.area * (v.efficiency / 100)) * 1, 2, "kWp"]]),

  mk("string-voltage", [p("Voc per module", 41.2, "V"), p("Modules per string", 10), n("Voc temp coefficient", -0.29, "%/°C"), n("Record low temperature", -10, "°C")],
    "V_string = N × Voc × (1 + β(T_min − 25))", "Cold-weather string voltage",
    (v) => {
      const vStr = v["modules-per-string"] * v["voc-per-module"] * (1 + (v["voc-temp-coefficient"] / 100) * (v["record-low-temperature"] - 25));
      return [["Maximum string voltage (record cold)", vStr, 1, "V", true], ["Voltage at STC", v["modules-per-string"] * v["voc-per-module"], 1, "V"]];
    },
    { limitations: ["Compare against the inverter maximum system voltage; also verify start voltage at high cell temperature."] }),

  mk("pv-cable-sizing", [p("Current", 12, "A"), p("One-way length", 18, "m"), p("Voltage drop limit", 1, "%"), p("System voltage", 400, "V"), p("Resistivity", 1.724e-8, "Ω·m")],
    "A = 2 L I ρ / (ΔV_limit × V)", "DC cable cross-section for a voltage-drop budget",
    (v) => {
      const dv = (v["voltage-drop-limit"] / 100) * v["system-voltage"];
      const area = (2 * v["one-way-length"] * v.current * v.resistivity) / dv;
      return [["Minimum conductor area", area * 1e6, 2, "mm²", true], ["Allowed voltage drop", dv, 2, "V"]];
    }),

  mk("shading-loss", [p("Shaded fraction", 15, "%", { max: 100 }), p("Irradiance reduction", 80, "%", { max: 100 })],
    "Loss% = shaded fraction × reduction in that area", "Simple shading loss",
    (v) => [["Energy loss", (v["shaded-fraction"] * v["irradiance-reduction"]) / 100, 1, "%", true],
      ["Retained yield", 100 - (v["shaded-fraction"] * v["irradiance-reduction"]) / 100, 1, "%"]],
    { limitations: ["String-level shading loss can far exceed the shaded area share because of series-cell mismatch; use a module-level simulation for design."] }),

  mk("solar-row-spacing", [p("Module height", 2.0, "m"), p("Tilt", 25, "°"), p("Latitude", 28, "°")],
    "Row pitch from solar geometry at winter solstice noon", "Minimum row spacing",
    (v) => {
      const solarAlt = 90 - v.latitude - 23.45;
      const shadow = v["module-height"] * Math.cos(v.tilt * D2R) + (v["module-height"] * Math.sin(v.tilt * D2R)) / Math.tan(Math.max(5, solarAlt) * D2R);
      return [["Minimum row pitch", shadow, 2, "m", true], ["Winter-solstice solar altitude", solarAlt, 1, "°"]];
    }),

  mk("solar-water-heating", [p("Daily hot water demand", 200, "L/day"), p("Temperature rise", 40, "K"), p("Collector efficiency", 55, "%"), p("Irradiance", 5.0, "kWh/m²/day")],
    "Area = (demand × 4.186 × ΔT)/(3600 × irradiance × efficiency)", "Solar thermal collector area",
    (v) => {
      const energy = (v["daily-hot-water-demand"] * 4.186 * v["temperature-rise"]) / 3600;
      return [["Daily energy demand", energy, 2, "kWh", true], ["Collector area required", energy / (v.irradiance * (v["collector-efficiency"] / 100)), 2, "m²"]];
    }),

  mk("net-metering-savings", [p("Generation", 7200, "kWh/yr"), p("Consumption", 5800, "kWh/yr"), p("Import tariff", 0.30, "$/kWh"), p("Export tariff", 0.09, "$/kWh")],
    "Savings = self-consumed × import + exported × export", "Net metering savings",
    (v) => {
      const selfUse = Math.min(v.generation, v.consumption);
      const exp = Math.max(0, v.generation - v.consumption);
      const sav = selfUse * v["import-tariff"] + exp * v["export-tariff"];
      return [["Annual savings", sav, 2, "$", true], ["Self-consumed", selfUse, 0, "kWh"], ["Exported", exp, 0, "kWh"]];
    }),

  mk("performance-ratio", [p("Actual yield", 7400, "kWh"), p("Expected yield", 8600, "kWh")],
    "PR = actual / expected", "PV performance ratio",
    (v) => [["Performance ratio", v["actual-yield"] / v["expected-yield"], 3, undefined, true],
      ["Underperformance", (1 - v["actual-yield"] / v["expected-yield"]) * 100, 1, "%"]]),

  // ── C50 Batteries and Storage (10) ─────────────────────────────────────────
  mk("battery-runtime", [p("Capacity", 100, "Ah"), p("Voltage", 12, "V"), p("Depth of discharge", 80, "%", { max: 100 }), p("Load", 150, "W"), p("Inverter efficiency", 90, "%")],
    "t = (Ah × V × DoD% × η) / load", "Battery runtime",
    (v) => {
      const wh = v.capacity * v.voltage * (v["depth-of-discharge"] / 100) * (v["inverter-efficiency"] / 100);
      return [["Runtime", wh / v.load, 2, "h", true], ["Usable energy", wh, 0, "Wh"]];
    },
    { limitations: ["Ideal energy balance; Peukert losses, temperature derating and age reduce real runtime."] }),

  mk("ah-wh-conversion", [p("Capacity", 100, "Ah"), p("Voltage", 12, "V")],
    "Wh = Ah × V", "Amp-hour to watt-hour",
    (v) => [["Energy", v.capacity * v.voltage, 0, "Wh", true], ["Energy", (v.capacity * v.voltage) / 1000, 3, "kWh"]]),

  mk("c-rate", [p("Capacity", 50, "Ah"), p("Current", 100, "A")],
    "C-rate = I / capacity", "Battery C-rate",
    (v) => [["C-rate", v.current / v.capacity, 2, "C", true], ["Time at this rate", v.capacity / v.current, 2, "h"]]),

  mk("charge-time", [p("Capacity", 100, "Ah"), p("Charging current", 20, "A"), p("Charge efficiency", 90, "%")],
    "t = capacity / (current × efficiency)", "Battery charge time",
    (v) => [["Charge time", v.capacity / (v["charging-current"] * (v["charge-efficiency"] / 100)), 2, "h", true],
      ["C-rate", v["charging-current"] / v.capacity, 2, "C"]],
    { limitations: ["Assumes constant-current charging; real chargers taper in the absorption phase. Respect the chemistry's C-rate limits."] }),

  mk("pack-series-parallel", [p("Cell voltage", 3.7, "V"), p("Cell capacity", 5, "Ah"), it("Series", 4, { min: 1 }), it("Parallel", 3, { min: 1 })],
    "Series adds voltage; parallel adds capacity", "Battery pack configuration",
    (v) => [["Pack voltage", v["cell-voltage"] * v.series, 2, "V", true],
      ["Pack capacity", v["cell-capacity"] * v.parallel, 1, "Ah"],
      ["Pack energy", v["cell-voltage"] * v.series * v["cell-capacity"] * v.parallel, 0, "Wh"],
      ["Cells required", v.series * v.parallel, 0, "cells"]]),

  mk("peukert-capacity", [p("Rated capacity", 100, "Ah"), p("Rated hours", 20, "h"), p("Discharge current", 20, "A"), p("Peukert exponent", 1.2)],
    "t = H (C/(I·H))^k; effective capacity = I·t", "Peukert behaviour (lead-acid)",
    (v) => {
      const t = v["rated-hours"] * Math.pow(v["rated-capacity"] / (v["discharge-current"] * v["rated-hours"]), v["peukert-exponent"]);
      return [["Runtime", t, 2, "h", true], ["Effective capacity", v["discharge-current"] * t, 1, "Ah"]];
    },
    { limitations: ["Peukert exponents are chemistry-specific (≈1.1–1.3 lead-acid, ≈1.0–1.05 lithium); the exponent must be supplied."] }),

  mk("dod-cycle-life", [p("Depth of discharge", 60, "%", { max: 100 }), p("Base cycle life", 6000, "cycles"), p("Cycle exponent", 1.5)],
    "Cycles ≈ base × (nominal DoD / DoD)^exponent (parametric)", "Cycle-life estimate",
    (v) => [["Estimated cycles", v["base-cycle-life"] * Math.pow(0.8 / (v["depth-of-discharge"] / 100), v["cycle-exponent"]), 0, "cycles", true]],
    { limitations: ["Manufacturer cycle-life curves vary with chemistry, temperature and C-rate; exponent is a fit parameter."] }),

  mk("ups-runtime", [p("UPS battery capacity", 9, "Ah"), p("Battery voltage", 12, "V"), p("Load", 300, "W"), p("Efficiency", 85, "%")],
    "Minutes = (Ah × V × η) / load × 60", "UPS runtime estimate",
    (v) => [["Runtime", (((v["ups-battery-capacity"] * v["battery-voltage"] * (v.efficiency / 100)) / v.load) * 60), 1, "min", true]]),

  mk("soc-from-voltage", [p("Measured voltage", 12.35, "V"), p("Empty voltage", 11.8, "V"), p("Full voltage", 12.8, "V")],
    "Parametric linear interpolation between user-supplied empty/full voltages", "State of charge estimate",
    (v) => {
      const soc = ((v["measured-voltage"] - v["empty-voltage"]) / (v["full-voltage"] - v["empty-voltage"])) * 100;
      return [["Estimated state of charge", Math.max(0, Math.min(100, soc)), 1, "%", true]];
    },
    { limitations: ["Voltage-based SoC is only indicative for rested lead-acid batteries. Lithium flat OCV curves make this unreliable — use a BMS."] }),

  mk("battery-cost-kwh", [p("Price", 4800, "$"), p("Capacity", 10, "kWh")],
    "Cost per kWh = price / capacity", "Battery cost per kWh",
    (v) => [["Cost per kWh", v.price / v.capacity, 2, "$/kWh", true]]),

  // ── C51 Astronomy and Orbital Mechanics (13) ───────────────────────────────
  mkx("julian-date", [t("Date", "2026-10-22"), n("UTC hour", 12, "h")],
    "JD from Gregorian calendar date and fractional day", "UTC date and hour",
    (v) => {
      const dt = parseISODateUTC(String(v.date));
      if (!dt) return err("Enter the date as YYYY-MM-DD.");
      const y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate() + Number(v["utc-hour"]) / 24;
      let yy = y, mm = m;
      if (mm <= 2) { yy -= 1; mm += 12; }
      const A = Math.floor(yy / 100), B = 2 - A + Math.floor(A / 4);
      const jd = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
      return [["Julian Date (JD)", jd, 5, "days", true], ["Modified Julian Date (MJD)", jd - 2400000.5, 5],
        ["Days since J2000.0", jd - 2451545.0, 3, "days"]];
    }),

  mkx("moon-phase", [t("Date", "2026-10-22")],
    "Elapsed synodic cycles from 2000-01-06 18:14 UTC (mean synodic month 29.530588853 d)", "UTC date",
    (v) => {
      const dt = parseISODateUTC(String(v.date));
      if (!dt) return err("Enter the date as YYYY-MM-DD.");
      const days = (dt.getTime() / 86400000) + 0.5 - (Date.UTC(2000, 0, 6, 18, 14) / 86400000);
      const phase = ((days % 29.530588853) + 29.530588853) % 29.530588853;
      const illum = (1 - Math.cos((phase / 29.530588853) * 2 * Math.PI)) / 2;
      const name = phase < 1.85 ? "New moon" : phase < 5.54 ? "Waxing crescent" : phase < 9.23 ? "First quarter"
        : phase < 12.91 ? "Waxing gibbous" : phase < 16.61 ? "Full moon" : phase < 20.30 ? "Waning gibbous"
        : phase < 23.99 ? "Last quarter" : phase < 27.68 ? "Waning crescent" : "New moon";
      return [["Phase age", phase, 2, "days", true], ["Illumination", illum * 100, 1, "%"], ["Phase name", name]];
    }),

  mkx("sunrise-sunset", [t("Date", "2026-06-21"), n("Latitude", 51.5, "°"), n("Longitude", 0.1, "°")],
    "Declination + hour-angle approximation (±15 min typical error)", "Date and observer position",
    (v) => {
      const dt = parseISODateUTC(String(v.date));
      if (!dt) return err("Enter the date as YYYY-MM-DD.");
      const nDay = Math.floor((dt.getTime() - Date.UTC(dt.getUTCFullYear(), 0, 0)) / 86400000);
      const decl = 23.44 * Math.sin(((360 / 365) * (nDay - 81)) * D2R);
      const cosH = -Math.tan(v.latitude * D2R) * Math.tan(decl * D2R);
      if (cosH > 1) return [["Daylight", "Polar night (no sunrise)", undefined, true]];
      if (cosH < -1) return [["Daylight", "Midnight sun (no sunset)", undefined, true]];
      const hHours = (Math.acos(cosH) / D2R) / 15;
      const solarNoon = 12 - v.longitude / 15;
      const fmt = (h: number) => `${String(Math.floor(((h % 24) + 24) % 24)).padStart(2, "0")}:${String(Math.round((((h % 1) + 1) % 1) * 60)).padStart(2, "0")}`;
      return [["Sunrise (UTC)", fmt(solarNoon - hHours), undefined, true], ["Sunset (UTC)", fmt(solarNoon + hHours)],
        ["Day length", hHours * 2, 2, "h"], ["Solar declination", decl, 2, "°"]];
    },
    { limitations: ["Uses a mean declination model without refraction, equation of time or nutation; expect ±15 minutes. Use NOAA's solar calculator for navigation or legal sunrise/sunset times."] }),

  mkx("solar-position", [t("Date", "2026-06-21"), n("UTC hour", 12, "h"), n("Latitude", 28, "°"), n("Longitude", 77, "°")],
    "Declination + hour angle → altitude and azimuth (approximate)", "Date, time and observer position",
    (v) => {
      const dt = parseISODateUTC(String(v.date));
      if (!dt) return err("Enter the date as YYYY-MM-DD.");
      const nDay = Math.floor((dt.getTime() - Date.UTC(dt.getUTCFullYear(), 0, 0)) / 86400000);
      const decl = 23.44 * Math.sin(((360 / 365) * (nDay - 81)) * D2R);
      const lst = Number(v["utc-hour"]) + v.longitude / 15;
      const H = (lst - 12) * 15 * D2R;
      const alt = Math.asin(Math.sin(v.latitude * D2R) * Math.sin(decl * D2R) + Math.cos(v.latitude * D2R) * Math.cos(decl * D2R) * Math.cos(H));
      const az = Math.atan2(-Math.sin(H), Math.tan(decl * D2R) * Math.cos(v.latitude * D2R) - Math.sin(v.latitude * D2R) * Math.cos(H)) / D2R + 180;
      return [["Solar altitude", alt / D2R, 2, "°", true], ["Solar azimuth", (az + 360) % 360, 2, "°"], ["Declination", decl, 2, "°"]];
    },
    { limitations: ["Approximate solar position (±1°). NREL SPA / Meeus algorithms with refraction and nutation are required for precise tracking or shading analysis."] }),

  mk("escape-velocity", [p("Mass", 5.972e24, "kg"), p("Radius", 6.371e6, "m")],
    "v_esc = √(2GM/r)", "Escape velocity",
    (v) => {
      const bigG = 6.6743e-11;
      const vesc = Math.sqrt((2 * bigG * v.mass) / v.radius);
      return [["Escape velocity", vesc / 1000, 3, "km/s", true], ["Orbital velocity at surface", Math.sqrt((bigG * v.mass) / v.radius) / 1000, 3, "km/s"]];
    }),

  mk("orbital-period", [p("Semi-major axis", 42164000, "m"), p("Central mass", 5.972e24, "kg")],
    "T = 2π √(a³ / GM)", "Kepler's third law",
    (v) => {
      const bigG = 6.6743e-11;
      const T = 2 * Math.PI * Math.sqrt(v["semi-major-axis"] ** 3 / (bigG * v["central-mass"]));
      return [["Orbital period", T / 3600, 3, "h", true], ["Orbital period", T / 86400, 3, "days"]];
    }),

  mk("hohmann-transfer", [p("Start radius", 6771000, "m"), p("Target radius", 42164000, "m"), p("Central mass", 5.972e24, "kg")],
    "Δv₁ = √(μ/r₁)(√(2r₂/(r₁+r₂)) − 1), mirrored for Δv₂", "Hohmann transfer (coplanar circular orbits)",
    (v) => {
      const mu = 6.6743e-11 * v["central-mass"], r1 = v["start-radius"], r2 = v["target-radius"];
      const dv1 = Math.sqrt(mu / r1) * (Math.sqrt((2 * r2) / (r1 + r2)) - 1);
      const dv2 = Math.sqrt(mu / r2) * (1 - Math.sqrt((2 * r1) / (r1 + r2)));
      const t = Math.PI * Math.sqrt(((r1 + r2) / 2) ** 3 / mu);
      return [["Δv₁ (departure burn)", dv1, 1, "m/s", true], ["Δv₂ (arrival burn)", dv2, 1, "m/s"],
        ["Total Δv", dv1 + dv2, 1, "m/s"], ["Transfer time", t / 3600, 2, "h"]];
    }),

  mk("star-magnitude", [p("Flux ratio", 100)],
    "Δm = −2.5 log₁₀(F₁/F₂)", "Magnitude difference from flux ratio",
    (v) => [["Magnitude difference", -2.5 * Math.log10(v["flux-ratio"]), 3, "mag", true]]),

  mk("angular-size", [p("Body diameter", 3474000, "m"), p("Distance", 384400000, "m")],
    "θ = 2 arctan(d / 2D)", "Angular size",
    (v) => {
      const rad = 2 * Math.atan(v["body-diameter"] / (2 * v.distance));
      return [["Angular size", (rad * 180) / Math.PI, 4, "°", true], ["Angular size", (rad * 180) / Math.PI * 60, 2, "arcmin"]];
    }),

  mk("redshift", [p("Observed wavelength", 656.5, "nm"), p("Rest wavelength", 486.1, "nm")],
    "z = (λ_obs − λ_emit) / λ_emit; v ≈ cz for z ≪ 1", "Cosmological redshift",
    (v) => {
      const z = (v["observed-wavelength"] - v["rest-wavelength"]) / v["rest-wavelength"];
      return [["Redshift z", z, 5, undefined, true], ["Radial velocity (low-z)", z * 299792.458, 1, "km/s"]];
    }),

  mk("light-year-distance", [p("Light-years", 4.2465)],
    "1 ly = 9.4607304725808e15 m", "Light-year conversion",
    (v) => {
      const m = v["light-years"] * 9.4607304725808e15;
      return [["Metres", m, 4, "×10¹⁵ m", true], ["Astronomical units", m / 1.495978707e11, 4, "AU"],
        ["Parsecs", m / 3.0856775814913673e16, 4, "pc"]];
    }),

  mkx("sidereal-time", [t("Date", "2026-10-22"), n("UTC hour", 12, "h"), n("Longitude", 77, "°")],
    "GMST = 280.46061837 + 360.98564736629 (JD − 2451545) ; LST = GMST + longitude", "UTC date/time and longitude",
    (v) => {
      const dt = parseISODateUTC(String(v.date));
      if (!dt) return err("Enter the date as YYYY-MM-DD.");
      const y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate() + Number(v["utc-hour"]) / 24;
      let yy = y, mm = m;
      if (mm <= 2) { yy -= 1; mm += 12; }
      const A = Math.floor(yy / 100), B = 2 - A + Math.floor(A / 4);
      const jd = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5;
      const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545)) % 360;
      const lst = ((gmst + v.longitude) % 360 + 360) % 360;
      const hours = lst / 15;
      return [["Local sidereal time", `${String(Math.floor(hours)).padStart(2, "0")}:${String(Math.floor((hours % 1) * 60)).padStart(2, "0")}`, undefined, true],
        ["LST in degrees", lst, 3, "°"], ["GMST", ((gmst % 360) + 360) % 360, 3, "°"]];
    }),

  mk("satellite-look-angle", [p("Observer latitude", 28.6, "°"), p("Observer longitude", 77.2, "°"), p("Satellite longitude", 83.0, "°"), p("Satellite altitude", 35786, "km")],
    "Spherical-Earth look angles to a geostationary satellite", "Observer position and satellite sub-point",
    (v) => {
      const re = 6378.137, rs = re + v["satellite-altitude"];
      const dl = (v["observer-longitude"] - v["satellite-longitude"]) * D2R;
      const lat = v["observer-latitude"] * D2R;
      const r1 = rs * Math.cos(dl) - re * Math.cos(lat);
      const r2 = rs * Math.sin(dl);
      const r3 = -re * Math.sin(lat);
      const range = Math.sqrt(r1 * r1 + r2 * r2 + r3 * r3);
      const el = Math.acos((r1 * Math.cos(lat) * Math.cos(dl) + r2 * Math.cos(lat) * Math.sin(dl) + r3 * Math.sin(lat)) / range) / D2R;
      return [["Elevation angle", 90 - el, 2, "°", true], ["Slant range", range, 0, "km"]];
    }),

  // ── C52 Geography, Mapping and Surveying (14) ──────────────────────────────
  mk("haversine-distance", [n("Latitude 1", 19.076, "°"), n("Longitude 1", 72.8777, "°"), n("Latitude 2", 28.6139, "°"), n("Longitude 2", 77.209, "°"), p("Earth radius", 6371.0088, "km")],
    "d = 2R asin√(sin²(Δφ/2) + cosφ₁cosφ₂ sin²(Δλ/2))", "Great-circle distance (haversine)",
    (v) => {
      const dLat = (v["latitude-2"] - v["latitude-1"]) * D2R, dLon = (v["longitude-2"] - v["longitude-1"]) * D2R;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(v["latitude-1"] * D2R) * Math.cos(v["latitude-2"] * D2R) * Math.sin(dLon / 2) ** 2;
      const d = 2 * v["earth-radius"] * Math.asin(Math.min(1, Math.sqrt(a)));
      return [["Great-circle distance", d, 3, "km", true], ["Distance", d / 1.609344, 3, "mi"],
        ["Initial bearing", ((Math.atan2(Math.sin(dLon) * Math.cos(v["latitude-2"] * D2R), Math.cos(v["latitude-1"] * D2R) * Math.sin(v["latitude-2"] * D2R) - Math.sin(v["latitude-1"] * D2R) * Math.cos(v["latitude-2"] * D2R) * Math.cos(dLon)) / D2R) + 360) % 360, 2, "°"]];
    },
    { assumptions: ["Spherical Earth with the stated mean radius; ellipsoidal (Vincenty) distances differ by up to ~0.5%."] }),

  mk("initial-bearing", [n("Latitude 1", 51.5074, "°"), n("Longitude 1", -0.1278, "°"), n("Latitude 2", 40.7128, "°"), n("Longitude 2", -74.006, "°")],
    "θ = atan2(sinΔλ cosφ₂, cosφ₁ sinφ₂ − sinφ₁ cosφ₂ cosΔλ)", "Initial bearing on a great circle",
    (v) => {
      const dLon = (v["longitude-2"] - v["longitude-1"]) * D2R;
      const y = Math.sin(dLon) * Math.cos(v["latitude-2"] * D2R);
      const x = Math.cos(v["latitude-1"] * D2R) * Math.sin(v["latitude-2"] * D2R) - Math.sin(v["latitude-1"] * D2R) * Math.cos(v["latitude-2"] * D2R) * Math.cos(dLon);
      return [["Initial bearing", ((Math.atan2(y, x) / D2R) + 360) % 360, 2, "°", true]];
    }),

  mk("latlong-midpoint", [n("Latitude 1", 19.076, "°"), n("Longitude 1", 72.8777, "°"), n("Latitude 2", 28.6139, "°"), n("Longitude 2", 77.209, "°")],
    "Great-circle midpoint via Cartesian mean of unit vectors", "Geographic midpoint",
    (v) => {
      const lat1 = v["latitude-1"] * D2R, lon1 = v["longitude-1"] * D2R, lat2 = v["latitude-2"] * D2R, lon2 = v["longitude-2"] * D2R;
      const bx = Math.cos(lat2) * Math.cos(lon2), by = Math.cos(lat2) * Math.sin(lon2);
      const x = Math.cos(lat1) * Math.cos(lon1) + bx, y = Math.cos(lat1) * Math.sin(lon1) + by, zz = Math.sin(lat1) + Math.sin(lat2);
      const lon = Math.atan2(y, x), lat = Math.atan2(zz, Math.hypot(x, y));
      return [["Midpoint latitude", lat / D2R, 5, "°", true], ["Midpoint longitude", lon / D2R, 5, "°"]];
    }),

  mkx("coordinate-area", [t("Vertices", "77.20,28.61; 77.35,28.61; 77.35,28.70; 77.20,28.70")],
    "Spherical excess area of a polygon on a sphere (R = 6371.0088 km)", "lon,lat vertex list",
    (v) => {
      const pairs = String(v.vertices).split(";").map((x) => x.trim()).filter(Boolean);
      if (pairs.length < 3) return err("Enter at least 3 vertices as lon,lat; lon,lat; …");
      const pts: Array<[number, number]> = [];
      for (const pr of pairs) {
        const [lonS, latS] = pr.split(",");
        const lon = Number(lonS), lat = Number(latS);
        if (!Number.isFinite(lon) || !Number.isFinite(lat)) return err(`Invalid vertex "${pr}".`);
        pts.push([lon * D2R, lat * D2R]);
      }
      let sum = 0;
      for (let i = 0; i < pts.length; i++) {
        const [lon1, lat1] = pts[i], [lon2, lat2] = pts[(i + 1) % pts.length];
        sum += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
      }
      const area = Math.abs(sum * 6371.0088 ** 2 / 2);
      return [["Spherical polygon area", area, 3, "km²", true], ["Area", area * 0.386102159, 2, "mi²"]];
    }),

  mk("slope-gradient", [n("Rise", 4, "m"), p("Run", 20, "m")],
    "Slope% = rise/run × 100; angle = atan(rise/run)", "Slope and gradient",
    (v) => [["Slope", (v.rise / v.run) * 100, 2, "%", true], ["Ratio", `1 : ${(v.run / v.rise).toFixed(2)}`],
      ["Angle", (Math.atan2(v.rise, v.run) * 180) / Math.PI, 2, "°"]]),

  mk("contour-interval", [p("Map scale denominator", 25000), p("Contour interval", 10, "m")],
    "Contour spacing on map = interval / scale; recommended interval from terrain relief", "Contour interval and map spacing",
    (v) => [["Contour spacing on map", (v["contour-interval"] * 1000) / v["map-scale-denominator"], 2, "mm", true],
      ["Ground spacing between contours", v["contour-interval"], 1, "m"]]),

  mkx("traverse-closure", [t("Legs", "120.5@45, 98.2@120, 145.0@210, 110.3@300")],
    "ΣΔE, ΣΔN; misclosure = √(ΣΔE² + ΣΔN²); precision = perimeter / misclosure", "Bearing@distance legs",
    (v) => {
      const legs = String(v.legs).split(",").map((x) => x.trim()).filter(Boolean);
      if (legs.length < 2) return err("Enter at least 2 legs as bearing@distance.");
      let de = 0, dn = 0, per = 0;
      for (const leg of legs) {
        const [bS, dS] = leg.split("@");
        const brg = Number(bS), dist = Number(dS);
        if (!Number.isFinite(brg) || !Number.isFinite(dist)) return err(`Invalid leg "${leg}".`);
        de += dist * Math.sin(brg * D2R);
        dn += dist * Math.cos(brg * D2R);
        per += dist;
      }
      const mis = Math.hypot(de, dn);
      return [["Linear misclosure", mis, 3, "m", true], ["ΔE", de, 3, "m"], ["ΔN", dn, 3, "m"],
        ["Relative precision", mis < 1e-9 ? "Perfect closure" : `1 : ${Math.round(per / mis)}`]];
    }),

  mk("distance-to-horizon", [p("Eye height", 1.7, "m"), p("Earth radius", 6371, "km")],
    "d = √(2Rh + h²)", "Distance to the visible horizon",
    (v) => {
      const hh = v["eye-height"] / 1000;
      const d = Math.sqrt(2 * v["earth-radius"] * hh + hh * hh);
      return [["Distance to horizon", d, 2, "km", true], ["Distance", d / 1.609344, 2, "mi"]];
    },
    { assumptions: ["Geometric horizon with no atmospheric refraction; refraction typically extends the visible horizon by ~8%."] }),

  mk("map-scale", [p("Map distance", 4.5, "cm"), p("Scale denominator", 50000)],
    "Ground distance = map distance × scale", "Map scale conversion",
    (v) => [["Ground distance", (v["map-distance"] * v["scale-denominator"]) / 100, 3, "m", true],
      ["Ground distance", (v["map-distance"] * v["scale-denominator"]) / 100000, 3, "km"]]),

  mkx("dms-decimal", [it("Degrees", 28), it("Minutes", 36, { min: 0, max: 59 }), z("Seconds", 50.4), s("Hemisphere", [["N", "North / East (+)"], ["S", "South / West (−)"]], "N")],
    "dd = d + m/60 + s/3600, signed by hemisphere", "Degrees-minutes-seconds to decimal",
    (v) => {
      const dd = Number(v.degrees) + Number(v.minutes) / 60 + Number(v.seconds) / 3600;
      const signed = v.hemisphere === "S" ? -dd : dd;
      return [["Decimal degrees", signed, 6, "°", true], ["Absolute value", dd, 6, "°"]];
    }),

  mk("utm-conversion", [n("Latitude", 28.6139, "°"), n("Longitude", 77.209, "°")],
    "Transverse Mercator series (WGS84, k₀ = 0.9996)", "Geodetic to UTM",
    (v) => {
      const lat = v.latitude * D2R, lon = v.longitude;
      const zone = Math.floor((lon + 180) / 6) + 1;
      const lon0 = ((zone - 1) * 6 - 180 + 3) * D2R;
      const a = 6378137, f = 1 / 298.257223563;
      const e2 = f * (2 - f), ep2 = e2 / (1 - e2), k0 = 0.9996;
      const N = a / Math.sqrt(1 - e2 * Math.sin(lat) ** 2);
      const T = Math.tan(lat) ** 2, C = ep2 * Math.cos(lat) ** 2, A = (lon * D2R - lon0) * Math.cos(lat);
      const e4 = e2 * e2, e6 = e4 * e2;
      const M = a * ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * lat
        - ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * lat)
        + ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * lat)
        - ((35 * e6) / 3072) * Math.sin(6 * lat));
      const easting = k0 * N * (A + ((1 - T + C) * A ** 3) / 6 + ((5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5) / 120) + 500000;
      let northing = k0 * (M + N * Math.tan(lat) * (A ** 2 / 2 + ((5 - T + 9 * C + 4 * C * C) * A ** 4) / 24 + ((61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6) / 720));
      if (v.latitude < 0) northing += 10000000;
      return [["UTM zone", `${zone}${v.latitude >= 0 ? "N" : "S"}`, undefined, true],
        ["Easting", easting, 2, "m"], ["Northing", northing, 2, "m"]];
    },
    { assumptions: ["WGS84 ellipsoid, standard Transverse Mercator series. Accuracy degrades outside the zone or near the poles."] }),

  mk("timezone-from-longitude", [n("Longitude", 77.2, "°")],
    "Approximate offset = round(longitude / 15) hours (solar time, not political boundaries)", "Longitude to nominal time offset",
    (v) => {
      const off = Math.round(v.longitude / 15);
      return [["Nominal UTC offset", `UTC${off >= 0 ? "+" : ""}${off}:00`, undefined, true],
        ["Solar noon at this longitude", `${(12 - v.longitude / 15).toFixed(2)} UTC`, undefined]];
    },
    { limitations: ["Political time zones, daylight saving and country boundaries routinely diverge from solar longitude. Use the IANA tz database for legal local time."] }),

  mkx("elevation-profile", [t("Elevations", "120, 145, 190, 230, 215, 260")],
    "Σ ascent and Σ descent; average grade needs distance", "Ordered elevation samples",
    (v) => {
      const els = parseNumList(String(v.elevations), 2);
      if (!els.ok) return els;
      let gain = 0, loss = 0;
      for (let i = 1; i < els.value.length; i++) {
        const d = els.value[i] - els.value[i - 1];
        if (d > 0) gain += d; else loss -= d;
      }
      return [["Total ascent", gain, 1, "m", true], ["Total descent", loss, 1, "m"],
        ["Net elevation change", els.value[els.value.length - 1] - els.value[0], 1, "m"]];
    }),

  mk("north-reference", [p("True bearing", 45, "°"), n("Declination", 2.5, "°"), n("Grid convergence", -0.8, "°")],
    "Magnetic = true − declination; grid = true − convergence", "Bearing reference conversion",
    (v) => [["Magnetic bearing", ((v["true-bearing"] - v.declination) % 360 + 360) % 360, 2, "°", true],
      ["Grid bearing", ((v["true-bearing"] - v["grid-convergence"]) % 360 + 360) % 360, 2, "°"]]),

  // ── C53 Meteorology and Climate (12) ───────────────────────────────────────
  mk("wind-chill", [n("Temperature", 0, "°F"), p("Wind speed", 15, "mph")],
    "T_wc = 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16 (T °F, V mph)", "NWS/Canada wind chill (R-008)",
    (v) => {
      const t = v.temperature, wind = v["wind-speed"];
      if (t > 50) return err("The NWS wind-chill formula is defined only for temperatures at or below 50 °F.");
      if (wind <= 3) return err("The NWS wind-chill formula requires wind above 3 mph; below that the air temperature is used.");
      const f = Math.pow(wind, 0.16);
      const wc = 35.74 + 0.6215 * t - 35.75 * f + 0.4275 * t * f;
      return [["Wind chill", wc, 1, "°F", true], ["Wind chill", ((wc - 32) * 5) / 9, 1, "°C"],
        ["Equivalent calm-air difference", wc - t, 1, "°F"]];
    },
    { assumptions: ["NWS/Environment Canada wind chill (weather.gov): valid for T ≤ 50 °F and V > 3 mph.", "Applies to exposed human/animal skin, not inanimate objects, and assumes a clear night sky (sun can add 10–18 °F)."] }),

  mk("heat-index", [p("Temperature", 100, "°F"), z("Relative humidity", 55, "%", { max: 100 })],
    "Rothfusz regression with NWS humidity adjustments (T °F, RH %)", "NWS heat index (R-009)",
    (v) => {
      const t = v.temperature, rh = v["relative-humidity"];
      if (t < 80) return err("The NWS heat-index regression is intended for temperatures of 80 °F and above; below that, report the air temperature.");
      let hi = -42.379 + 2.04901523 * t + 10.14333127 * rh - 0.22475541 * t * rh
        - 0.00683783 * t * t - 0.05481717 * rh * rh + 0.00122874 * t * t * rh
        + 0.00085282 * t * rh * rh - 0.00000199 * t * t * rh * rh;
      if (rh < 13 && t >= 80 && t <= 112) hi -= ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(t - 95)) / 17);
      else if (rh > 85 && t >= 80 && t <= 87) hi += ((rh - 85) / 10) * ((87 - t) / 5);
      return [["Heat index", hi, 1, "°F", true], ["Heat index", ((hi - 32) * 5) / 9, 1, "°C"],
        ["Feels-like above air temperature", hi - t, 1, "°F"]];
    },
    { assumptions: ["NWS Rothfusz regression (weather.gov), stated error ±1.3 °F, shade conditions. Direct sun can add up to 15 °F."] }),

  mk("dew-point", [n("Temperature", 25, "°C"), z("Relative humidity", 60, "%", { max: 100 })],
    "Magnus–Tetens: α = ln(RH/100) + aT/(b+T); Td = bα/(a−α), a = 17.625, b = 243.04 °C", "Dew point from temperature and RH",
    (v) => {
      const rh = v["relative-humidity"];
      if (rh <= 0) return err("Relative humidity must be greater than zero.");
      const a = 17.625, b = 243.04;
      const alpha = Math.log(rh / 100) + (a * v.temperature) / (b + v.temperature);
      const td = (b * alpha) / (a - alpha);
      return [["Dew point", td, 2, "°C", true], ["Dew point", (td * 9) / 5 + 32, 2, "°F"],
        ["Dew point depression", v.temperature - td, 2, "K"]];
    },
    { assumptions: ["Magnus–Tetens coefficients a = 17.625 °C, b = 243.04 °C; valid ≈ −40 to 50 °C with about 1% RH error."] }),

  mk("relative-humidity", [n("Temperature", 25, "°C"), n("Dew point", 16.7, "°C")],
    "RH = 100 · e^(aTd/(b+Td)) / e^(aT/(b+T))", "Relative humidity from temperature and dew point",
    (v) => {
      const a = 17.625, b = 243.04;
      const eTd = Math.exp((a * v["dew-point"]) / (b + v["dew-point"]));
      const eT = Math.exp((a * v.temperature) / (b + v.temperature));
      if (v["dew-point"] > v.temperature) return err("Dew point cannot exceed the air temperature.");
      return [["Relative humidity", Math.min(100, (eTd / eT) * 100), 2, "%", true]];
    }),

  mk("wet-bulb", [n("Temperature", 32, "°C"), z("Relative humidity", 55, "%", { max: 100 }), p("Pressure", 101.325, "kPa")],
    "Stull (2011) psychrometric approximation for wet-bulb temperature", "Wet-bulb from dry-bulb and RH",
    (v) => {
      const t = v.temperature, rh = v["relative-humidity"];
      const tw = t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) + Math.atan(t + rh)
        - Math.atan(rh - 1.676331) + 0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) - 4.686035;
      return [["Wet-bulb temperature", tw, 2, "°C", true], ["Wet-bulb depression", t - tw, 2, "K"]];
    },
    { assumptions: ["Stull (2011) empirical fit, valid at standard sea-level pressure for −20 to 50 °C and 5–99% RH; not exact at altitude."] }),

  mk("humidex", [n("Temperature", 30, "°C"), n("Dew point", 22, "°C")],
    "Humidex = T + 0.5555(6.11 e^(5417.7530(1/273.16 − 1/Td_K)) − 10)", "Canadian humidex",
    (v) => {
      const tdK = v["dew-point"] + 273.15;
      const e = 6.11 * Math.exp(5417.753 * (1 / 273.16 - 1 / tdK));
      const h = v.temperature + 0.5555 * (e - 10);
      const cat = h < 30 ? "Comfortable" : h < 40 ? "Some discomfort" : h < 46 ? "Great discomfort" : h < 54 ? "Dangerous" : "Heat stroke risk";
      return [["Humidex", h, 1, undefined, true], ["Comfort category", cat], ["Vapour pressure", e, 2, "hPa"]];
    }),

  mk("cloud-base", [n("Surface temperature", 28, "°C"), n("Dew point", 18, "°C")],
    "Base ≈ 125 × (T − Td) metres (spread rule)", "Cloud base from temperature–dew-point spread",
    (v) => {
      const spread = v["surface-temperature"] - v["dew-point"];
      if (spread < 0) return err("Dew point cannot exceed the surface temperature.");
      return [["Estimated cloud base", spread * 125, 0, "m", true], ["Estimated cloud base", spread * 400, 0, "ft"],
        ["Temperature–dew-point spread", spread, 1, "K"]];
    }),

  mk("rainfall-volume", [p("Catchment area", 250, "m²"), p("Rain depth", 22, "mm")],
    "Volume = area × depth; 1 mm over 1 m² = 1 L", "Rainfall volume",
    (v) => {
      const litres = v["catchment-area"] * v["rain-depth"];
      return [["Rainfall volume", litres, 0, "L", true], ["Rainfall volume", litres / 1000, 2, "m³"]];
    }),

  mk("snow-water-equivalent", [p("Snow depth", 40, "cm"), p("Snow density", 0.3, "g/cm³")],
    "SWE = depth × density ratio (water equivalent)", "Snow water equivalent",
    (v) => [["Water equivalent", v["snow-depth"] * v["snow-density"] * 10, 1, "mm", true],
      ["Water equivalent", v["snow-depth"] * v["snow-density"], 2, "cm"]]),

  mk("wind-load-pressure", [p("Wind speed", 32, "m/s"), p("Area", 12, "m²"), p("Drag coefficient", 1.2), p("Air density", 1.225, "kg/m³")],
    "q = ½ρV²; F = q A C_d", "Dynamic wind pressure and drag force",
    (v) => {
      const q = 0.5 * v["air-density"] * v["wind-speed"] ** 2;
      return [["Dynamic pressure", q, 1, "Pa", true], ["Drag force", q * v.area * v["drag-coefficient"], 0, "N"],
        ["Drag force", (q * v.area * v["drag-coefficient"]) / 1000, 2, "kN"]];
    }),

  mk("station-pressure", [p("Station elevation", 350, "m"), p("QNH", 1013.25, "hPa")],
    "p = QNH (1 − 2.25577e-5 h)^5.25588", "Station pressure from elevation and QNH",
    (v) => [["Station pressure", v.qnh * Math.pow(1 - 2.25577e-5 * v["station-elevation"], 5.25588), 2, "hPa", true]]),

  mk("barometric-formula", [n("Elevation", 1200, "m"), p("Sea-level pressure", 1013.25, "hPa"), n("Temperature", 15, "°C")],
    "p = p₀ (1 − 2.25577e-5 h)^5.25588 (ISA); temperature shown for reference", "Barometric pressure at altitude",
    (v) => [["Pressure at altitude", v["sea-level-pressure"] * Math.pow(1 - 2.25577e-5 * v.elevation, 5.25588), 2, "hPa", true],
      ["Pressure ratio", Math.pow(1 - 2.25577e-5 * v.elevation, 5.25588), 4]],
    { assumptions: ["International Standard Atmosphere; real soundings differ with weather and temperature."] }),

  // ── C54 Agriculture and Horticulture (12) ──────────────────────────────────
  mk("crop-yield", [p("Production", 380, "t"), p("Area", 42, "ha")],
    "Yield = production / area", "Crop yield",
    (v) => [["Yield", v.production / v.area, 2, "t/ha", true], ["Yield", (v.production * 1000) / (v.area * 10000), 3, "kg/m²"]]),

  mk("seed-rate", [p("Target plants", 250, "plants/m²"), p("Thousand grain weight", 42, "g"), p("Germination", 92, "%", { max: 100 }), p("Field establishment", 90, "%", { max: 100 })],
    "kg/ha = plants/m² × TGW(g) / 1000 / (germination × establishment) × 10", "Seed rate",
    (v) => {
      const rate = (v["target-plants"] * v["thousand-grain-weight"]) / 1000 / ((v.germination / 100) * (v["field-establishment"] / 100)) * 10;
      return [["Seed rate", rate, 1, "kg/ha", true], ["Seeds per m² sown", v["target-plants"] / ((v.germination / 100) * (v["field-establishment"] / 100)), 0, "seeds/m²"]];
    }),

  mk("plant-population", [p("Row spacing", 0.75, "m"), p("Plant spacing", 0.2, "m")],
    "plants/ha = 10,000 / (row × plant spacing)", "Plant population",
    (v) => [["Plants per hectare", 10000 / (v["row-spacing"] * v["plant-spacing"]), 0, "plants/ha", true],
      ["Plants per m²", 1 / (v["row-spacing"] * v["plant-spacing"]), 2, "plants/m²"]]),

  mk("row-spacing", [p("Bed width", 1.2, "m"), it("Rows", 3, { min: 1 })],
    "Row spacing = bed width / rows", "Row spacing from bed width",
    (v) => [["Row spacing", v["bed-width"] / v.rows, 3, "m", true], ["Plants per metre of row at 0.15 m spacing", 1 / 0.15, 1, "plants/m"]]),

  mk("growing-degree-days", [n("Daily max", 28, "°C"), n("Daily min", 14, "°C"), n("Base temperature", 10, "°C"), it("Days", 30, { min: 1 })],
    "GDD = max(0, (Tmax + Tmin)/2 − Tbase) × days", "Growing degree days",
    (v) => {
      const daily = Math.max(0, (v["daily-max"] + v["daily-min"]) / 2 - v["base-temperature"]);
      return [["Daily GDD", daily, 2, "°C·day", true], ["Accumulated GDD", daily * v.days, 1, "°C·day"]];
    },
    { assumptions: ["Base temperature is crop-specific and must come from an extension source for that crop."] }),

  mk("grain-moisture-shrink", [p("Initial moisture", 18.5, "%", { max: 99 }), p("Target moisture", 13.5, "%", { max: 99 })],
    "Shrink% = (MCᵢ − MCₜ)/(100 − MCₜ) × 100", "Grain moisture shrink",
    (v) => [["Moisture shrink", ((v["initial-moisture"] - v["target-moisture"]) / (100 - v["target-moisture"])) * 100, 3, "%", true],
      ["Weight after drying per 100 kg", 100 * (1 - (v["initial-moisture"] - v["target-moisture"]) / (100 - v["target-moisture"])), 2, "kg"]]),

  mk("harvest-loss", [p("Potential yield", 9.5, "t/ha"), p("Harvested yield", 8.9, "t/ha")],
    "Loss% = (potential − harvested) / potential × 100", "Harvest loss",
    (v) => [["Harvest loss", ((v["potential-yield"] - v["harvested-yield"]) / v["potential-yield"]) * 100, 2, "%", true],
      ["Lost yield", v["potential-yield"] - v["harvested-yield"], 2, "t/ha"]]),

  mk("stocking-rate", [p("Forage production", 3200, "kg/ha/yr"), p("Utilisation", 60, "%", { max: 100 }), p("Daily intake", 12, "kg/day"), it("Grazing days", 180, { min: 1 })],
    "AU/ha = forage × utilisation / (intake × days)", "Stocking rate",
    (v) => {
      const usable = v["forage-production"] * (v.utilisation / 100);
      return [["Stocking rate", usable / (v["daily-intake"] * v["grazing-days"]), 2, "AU/ha", true],
        ["Usable forage", usable, 0, "kg/ha/yr"]];
    },
    { limitations: ["Carrying capacity depends on a site-specific forage assessment, rainfall and rotation; this is an arithmetic conversion of your inputs."] }),

  mk("hay-bale-count", [p("Hay quantity", 24000, "kg"), p("Bale weight", 25, "kg")],
    "Bales = mass / bale weight", "Hay bale count",
    (v) => [["Bales", Math.ceil(v["hay-quantity"] / v["bale-weight"]), 0, "bales", true], ["Exact bales", v["hay-quantity"] / v["bale-weight"], 2]]),

  mk("land-area-conversion", [p("Area", 10, "acres")],
    "1 acre = 4046.8564224 m² = 0.40468564224 ha", "Land area conversion",
    (v) => {
      const m2 = v.area * 4046.8564224;
      return [["Hectares", m2 / 10000, 4, "ha", true], ["Square metres", m2, 0, "m²"],
        ["Square feet", m2 * FT2, 0, "ft²"], ["Square miles", m2 / 2589988.110336, 4, "mi²"]];
    }),

  mk("field-capacity-time", [p("Field area", 12, "ha"), p("Implement width", 6, "m"), p("Speed", 7, "km/h"), p("Efficiency", 80, "%")],
    "t = area / (width × speed × efficiency)", "Field operation time",
    (v) => {
      const haPerHour = (v["implement-width"] * v.speed * 1000 * (v.efficiency / 100)) / 10000;
      return [["Time required", v["field-area"] / haPerHour, 2, "h", true], ["Work rate", haPerHour, 2, "ha/h"]];
    }),

  mk("livestock-feed", [p("Animals", 120), p("Daily ration", 12, "kg/head/day")],
    "Daily feed = animals × ration", "Livestock feed requirement",
    (v) => [["Daily feed", v.animals * v["daily-ration"], 1, "kg/day", true],
      ["Annual feed", (v.animals * v["daily-ration"] * 365) / 1000, 2, "t/yr"]]),

  // ── C55 Irrigation and Fertilisers (12) ────────────────────────────────────
  mk("irrigation-requirement", [p("Reference ET", 5.4, "mm/day"), p("Crop coefficient Kc", 0.85), p("Effective rainfall", 1.2, "mm/day"), p("Application efficiency", 85, "%")],
    "ETc = ET₀ × Kc; net = max(0, ETc − Peff); gross = net / efficiency", "FAO-56 crop water requirement (R-003)",
    (v) => {
      const etc = v["reference-et"] * v["crop-coefficient-kc"];
      const net = Math.max(0, etc - v["effective-rainfall"]);
      const gross = net / (v["application-efficiency"] / 100);
      return [["Crop evapotranspiration ETc", etc, 2, "mm/day", true],
        ["Net irrigation requirement", net, 2, "mm/day"],
        ["Gross irrigation requirement", gross, 2, "mm/day"],
        ["Gross water per hectare", gross * 10, 0, "m³/ha/day"]];
    },
    { assumptions: ["FAO Irrigation and Drainage Paper 56: ETc = ET₀ × Kc. Kc must be sourced from FAO-56 tables for the specific crop and growth stage.", "Application efficiency is an exposed input (drip ≈ 0.90, sprinkler ≈ 0.75, surface ≈ 0.60 typical published ranges)."] }),

  mk("crop-coefficient-etc", [p("Reference ET", 5.0, "mm/day"), p("Crop coefficient Kc", 1.05), p("Area", 2.5, "ha")],
    "ETc = ET₀ × Kc; volume = ETc × area", "Crop water use and volume",
    (v) => {
      const etc = v["reference-et"] * v["crop-coefficient-kc"];
      return [["Crop ET", etc, 2, "mm/day", true], ["Daily volume", etc * v.area * 10, 1, "m³/day"]];
    }),

  mk("drip-emitter-count", [p("Area", 1.0, "ha"), p("Emitter spacing", 0.4, "m"), p("Row spacing", 1.2, "m"), p("Emitter flow", 2.0, "L/h")],
    "Emitters = area / (spacing × row); flow = emitters × emitter flow", "Drip system emitter count",
    (v) => {
      const count = (v.area * 10000) / (v["emitter-spacing"] * v["row-spacing"]);
      return [["Emitter count", Math.round(count), 0, "emitters", true], ["System flow rate", (count * v["emitter-flow"]) / 1000, 2, "m³/h"]];
    }),

  mk("sprinkler-spacing", [p("Wetted diameter", 24, "m"), p("Wind speed", 3, "m/s")],
    "Spacing = 0.55 × wetted diameter (with wind adjustment)", "Sprinkler head spacing",
    (v) => {
      const adj = v["wind-speed"] > 4 ? 0.45 : v["wind-speed"] > 2 ? 0.5 : 0.55;
      return [["Recommended spacing", v["wetted-diameter"] * adj, 1, "m", true], ["Spacing factor", adj, 2, undefined]];
    },
    { limitations: ["Manufacturer spacing charts and field uniformity tests supersede this rule of thumb."] }),

  mk("irrigation-interval", [p("Available water capacity", 120, "mm/m"), p("Root depth", 0.6, "m"), p("Management allowed depletion", 50, "%"), p("Crop ET", 5.5, "mm/day")],
    "Interval = (AWC × root depth × MAD) / ETc", "Irrigation interval",
    (v) => {
      const taw = v["available-water-capacity"] * v["root-depth"];
      const raw = taw * (v["management-allowed-depletion"] / 100);
      return [["Readily available water", raw, 1, "mm", true], ["Irrigation interval", raw / v["crop-et"], 2, "days"]];
    }),

  mk("soil-moisture-depletion", [p("Field capacity", 0.32, "m³/m³"), p("Wilting point", 0.14, "m³/m³"), p("Root depth", 0.6, "m")],
    "Depletion = (FC − PWP) × root depth × 1000 mm/m", "Soil moisture depletion",
    (v) => {
      const awc = (v["field-capacity"] - v["wilting-point"]) * v["root-depth"] * 1000;
      return [["Available water capacity", awc, 1, "mm", true], ["Per metre of soil", (v["field-capacity"] - v["wilting-point"]) * 1000, 1, "mm/m"]];
    }),

  mk("leaching-requirement", [p("Irrigation water EC", 1.2, "dS/m"), p("Target soil EC", 4.0, "dS/m")],
    "LR = ECw / (5 ECe − ECw)", "Leaching requirement",
    (v) => {
      const lr = v["irrigation-water-ec"] / (5 * v["target-soil-ec"] - v["irrigation-water-ec"]);
      return [["Leaching requirement", lr * 100, 2, "%", true]];
    },
    { assumptions: ["Standard FAO leaching-fraction relationship for steady-state salinity; EC must be in the same units (dS/m)."] }),

  mk("npk-blend", [p("Target N", 20, "%"), p("Target P2O5", 10, "%"), p("Target K2O", 10, "%"), p("Filler", 60, "%")],
    "Blend percentages must sum to 100", "NPK blend proportions",
    (v) => {
      const sum = v["target-n"] + v["target-p2o5"] + v["target-k2o"] + v.filler;
      return [["Total blend", sum, 1, "%", true], ["Status", Math.abs(sum - 100) < 0.01 ? "Balanced to 100%" : "Does not sum to 100%"]];
    }),

  mk("fertilizer-rate-nutrient", [p("Nutrient target", 120, "kg/ha"), p("Product nutrient content", 46, "%")],
    "Product = nutrient target / nutrient fraction", "Fertiliser rate from nutrient target",
    (v) => [["Product required", (v["nutrient-target"] * 100) / v["product-nutrient-content"], 1, "kg/ha", true]]),

  mk("oxide-conversion", [p("Elemental P", 20, "kg"), p("Elemental K", 30, "kg"), p("Elemental Ca", 10, "kg")],
    "P₂O₅ = P × 2.2914; K₂O = K × 1.2046; CaO = Ca × 1.3992", "Elemental to oxide-basis conversion",
    (v) => [["P₂O₅ equivalent", v["elemental-p"] * 2.2914, 2, "kg", true],
      ["K₂O equivalent", v["elemental-k"] * 1.2046, 2, "kg"],
      ["CaO equivalent", v["elemental-ca"] * 1.3992, 2, "kg"]]),

  mk("lime-requirement", [p("Soil test buffer index", 6.8), p("Target pH", 6.5), p("Calibration factor", 1.8, "t/ha per unit")],
    "Parametric: lime = (buffer index − target pH) × calibration factor", "Lime requirement from a soil-test buffer method",
    (v) => {
      const need = Math.max(0, (v["soil-test-buffer-index"] - v["target-ph"]) * v["calibration-factor"]);
      return [["Indicative lime requirement", need, 2, "t/ha", true]];
    },
    { limitations: ["Lime requirement cannot be derived from target pH alone. The calibration factor must come from the specific soil-test laboratory's buffer method for your region — specialist agronomic review required."] }),

  mk("compost-application", [p("Area", 500, "m²"), p("Depth", 30, "mm"), p("Bulk density", 550, "kg/m³")],
    "Volume = area × depth; mass = volume × density", "Compost application rate",
    (v) => {
      const vol = v.area * (v.depth / 1000);
      return [["Compost volume", vol, 2, "m³", true], ["Compost mass", vol * v["bulk-density"], 0, "kg"]];
    }),

  // ── C56 Food and Recipe Scaling (14) ───────────────────────────────────────
  mk("recipe-scaling", [p("Original servings", 4), p("New servings", 7)],
    "factor = new / original", "Recipe scaling factor",
    (v) => [["Scaling factor", v["new-servings"] / v["original-servings"], 4, "×", true],
      ["Percentage change", ((v["new-servings"] / v["original-servings"]) - 1) * 100, 1, "%"]],
    { assumptions: ["Linear scaling is invalid for leavening, salt, alcohol and cooking times; adjust these separately."] }),

  mk("serving-conversion", [p("Total yield", 1800, "g"), p("Servings", 6)],
    "Portion = yield / servings", "Serving size",
    (v) => [["Portion size", v["total-yield"] / v.servings, 1, "g", true]]),

  mkx("pan-size-conversion", [p("Original width", 20, "cm"), p("Original length", 20, "cm"), p("Original depth", 6, "cm"), p("New width", 23, "cm"), p("New length", 23, "cm"), p("New depth", 6, "cm")],
    "factor = (new area × depth) / (old area × depth)", "Baking pan conversion",
    (v) => {
      const oldVol = v["original-width"] * v["original-length"] * v["original-depth"];
      const newVol = v["new-width"] * v["new-length"] * v["new-depth"];
      return [["Volume scaling factor", newVol / oldVol, 3, "×", true],
        ["Area-only factor", (v["new-width"] * v["new-length"]) / (v["original-width"] * v["original-length"]), 3, "×"]];
    },
    { assumptions: ["Depth changes bake time independently of area; use the volume factor for batter quantity and expect timing differences."] }),

  mk("baker-percentage", [p("Flour mass", 1000, "g"), p("Water mass", 720, "g"), p("Salt mass", 20, "g"), p("Yeast mass", 8, "g")],
    "Each ingredient % = mass / flour mass × 100", "Baker's percentage",
    (v) => {
      const f = v["flour-mass"];
      return [["Hydration", (v["water-mass"] / f) * 100, 1, "%", true],
        ["Salt", (v["salt-mass"] / f) * 100, 2, "%"], ["Yeast", (v["yeast-mass"] / f) * 100, 3, "%"],
        ["Total dough mass", v["water-mass"] + v["salt-mass"] + v["yeast-mass"] + f, 0, "g"]];
    }),

  mk("dough-hydration", [p("Water mass", 750, "g"), p("Flour mass", 1000, "g")],
    "Hydration% = water / flour × 100", "Dough hydration",
    (v) => [["Hydration", (v["water-mass"] / v["flour-mass"]) * 100, 1, "%", true]]),

  mk("coffee-ratio", [p("Coffee mass", 18, "g"), p("Water mass", 288, "g")],
    "Ratio = water / coffee; strength% = coffee / water × 100", "Brew ratio",
    (v) => [["Brew ratio", `1 : ${(v["water-mass"] / v["coffee-mass"]).toFixed(1)}`, undefined, true],
      ["Strength (TDS proxy)", (v["coffee-mass"] / v["water-mass"]) * 100, 2, "%"]]),

  mk("brine-concentration", [p("Salt mass", 200, "g"), p("Water mass", 1000, "g")],
    "w/w% = salt / (water + salt) × 100; salt/water = salt / water × 100", "Brine concentration",
    (v) => [["Concentration (w/w of total)", (v["salt-mass"] / (v["water-mass"] + v["salt-mass"])) * 100, 2, "%", true],
      ["Salt per water (w/w)", (v["salt-mass"] / v["water-mass"]) * 100, 2, "%"]],
    { assumptions: ["Distinguishes percentage of total mass from salt-to-water ratio — these differ materially and must be labelled."] }),

  mk("alcohol-dilution", [p("Volume", 700, "mL"), p("ABV", 40, "%"), p("Target ABV", 25, "%")],
    "V_water = V_s (C_s/C_t − 1)", "Alcohol dilution (approximate)",
    (v) => {
      if (v["target-abv"] >= v.abv) return err("Target ABV must be lower than the starting ABV.");
      const vw = v.volume * (v.abv / v["target-abv"] - 1);
      return [["Water to add", vw, 1, "mL", true], ["Final volume", v.volume + vw, 0, "mL"]];
    },
    { limitations: ["Volume contraction on mixing means the result is approximate (±1–2%)."] }),

  mk("abv-proof", [p("ABV", 40, "%")],
    "US proof = 2 × ABV; British proof = ABV × 1.75", "ABV to proof",
    (v) => [["US proof", v.abv * 2, 1, "proof", true], ["British (imperial) proof", v.abv * 1.75, 2, "°proof"]]),

  mk("cooking-time-weight", [p("Mass", 2.4, "kg"), p("Time per kg", 20, "min/kg"), z("Base time", 15, "min")],
    "Time = mass × rate + base time", "Cooking time by weight",
    (v) => [["Total cooking time", v.mass * v["time-per-kg"] + v["base-time"], 0, "min", true]],
    { limitations: ["Oven calibration, shape and starting temperature dominate; always verify with a food thermometer."] }),

  mk("meat-cooking-loss", [p("Raw mass", 1200, "g"), p("Cooked mass", 890, "g")],
    "Loss% = (raw − cooked) / raw × 100", "Cooking loss",
    (v) => [["Cooking loss", ((v["raw-mass"] - v["cooked-mass"]) / v["raw-mass"]) * 100, 2, "%", true],
      ["Yield factor", v["cooked-mass"] / v["raw-mass"], 3, "×"]]),

  mkx("recipe-cost", [t("Ingredient costs", "4.20, 1.85, 3.10, 0.95"), p("Servings", 6)],
    "Total = Σ costs; per serving = total / servings", "Recipe cost",
    (v) => {
      const costs = parseNumList(String(v["ingredient-costs"]), 1);
      if (!costs.ok) return costs;
      const tot = costs.value.reduce((a, b) => a + b, 0);
      return [["Total recipe cost", tot, 2, "$", true], ["Cost per serving", tot / v.servings, 2, "$"]];
    }),

  mk("portion-size", [p("Guests", 45), p("Per portion", 180, "g")],
    "Total = guests × portion", "Portion size planning",
    (v) => [["Total food required", (v.guests * v["per-portion"]) / 1000, 2, "kg", true]]),

  mk("food-waste-cost", [p("Waste per week", 12, "kg"), p("Food cost", 6.5, "$/kg")],
    "Annual = weekly waste × cost × 52", "Food waste cost",
    (v) => [["Annual waste cost", v["waste-per-week"] * v["food-cost"] * 52, 2, "$/yr", true],
      ["Weekly cost", v["waste-per-week"] * v["food-cost"], 2, "$"]]),

  // ── C57 Nutrition and Dietary Calculations (15) ────────────────────────────
  mk("bmi", [p("Weight", 56.2459, "kg"), p("Height", 175.26, "cm")],
    "BMI = kg / m²; US customary = 703 × lb / in²", "Body mass index (adults 20+)",
    (v) => {
      const bmi = v.weight / (v.height / 100) ** 2;
      const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy weight" : bmi < 30 ? "Overweight" : bmi < 35 ? "Obesity class 1" : bmi < 40 ? "Obesity class 2" : "Obesity class 3";
      return [["BMI", bmi, 2, "kg/m²", true], ["CDC adult category", cat],
        ["Healthy weight range for this height", `${(18.5 * (v.height / 100) ** 2).toFixed(1)} – ${(24.9 * (v.height / 100) ** 2).toFixed(1)} kg`]];
    },
    { limitations: ["CDC (R-011): BMI is a screening measure, not a diagnosis. It applies to adults 20+ regardless of age, sex or race; children require age- and sex-specific percentiles. Muscularity and body composition are not captured."] }),

  mkx("bmr-mifflin", [p("Weight", 70, "kg"), p("Height", 175, "cm"), it("Age", 32, { min: 15, max: 110 }), s("Sex", [["male", "Male"], ["female", "Female"]], "male")],
    "Mifflin–St Jeor: 10kg + 6.25cm − 5age + (5 male / −161 female)", "Basal metabolic rate",
    (v) => {
      const bmr = 10 * v.weight + 6.25 * v.height - 5 * v.age + (v.sex === "male" ? 5 : -161);
      return [["BMR (Mifflin–St Jeor)", bmr, 0, "kcal/day", true]];
    },
    { assumptions: ["Mifflin–St Jeor equation. Harris–Benedict (revised) differs by roughly 5% — the choice must be shown."] }),

  mkx("tdee", [p("BMR", 1650, "kcal/day"), s("Activity", [["sed", "Sedentary (1.2)"], ["light", "Light (1.375)"], ["mod", "Moderate (1.55)"], ["high", "Very active (1.725)"]], "light")],
    "TDEE = BMR × activity factor", "Total daily energy expenditure",
    (v) => {
      const f = v.activity === "sed" ? 1.2 : v.activity === "light" ? 1.375 : v.activity === "mod" ? 1.55 : 1.725;
      return [["TDEE", v.bmr * f, 0, "kcal/day", true], ["Activity factor", f, 3, "×"]];
    },
    { limitations: ["Activity multipliers are population averages with large individual variance (±20% or more)."] }),

  mk("calorie-deficit-plan", [p("TDEE", 2400, "kcal/day"), p("Target intake", 1900, "kcal/day")],
    "Weekly deficit = (TDEE − intake) × 7; 7,700 kcal ≈ 1 kg fat", "Calorie deficit plan",
    (v) => {
      const daily = v.tdee - v["target-intake"];
      return [["Daily deficit", daily, 0, "kcal/day", true], ["Expected loss rate", (daily * 7) / 7700, 2, "kg/week"],
        ["Weekly deficit", daily * 7, 0, "kcal"]];
    },
    { limitations: ["7,700 kcal/kg is a planning approximation; real weight change involves water, glycogen and adaptive thermogenesis."] }),

  mk("macro-split", [p("Calories", 2200, "kcal/day"), p("Protein", 30, "%"), p("Carbohydrate", 40, "%"), p("Fat", 30, "%")],
    "grams = calories × share / kcal-per-gram (P4, C4, F9)", "Macronutrient split",
    (v) => {
      const sum = v.protein + v.carbohydrate + v.fat;
      return [["Protein", (v.calories * (v.protein / 100)) / 4, 0, "g/day", true],
        ["Carbohydrate", (v.calories * (v.carbohydrate / 100)) / 4, 0, "g/day"],
        ["Fat", (v.calories * (v.fat / 100)) / 9, 0, "g/day"],
        ["Share sum", sum, 1, "%"]];
    }),

  mk("protein-requirement", [p("Body mass", 70, "kg"), p("Grams per kg", 1.6, "g/kg")],
    "Protein = mass × g/kg", "Protein requirement",
    (v) => [["Daily protein", v["body-mass"] * v["grams-per-kg"], 0, "g/day", true],
      ["Energy from protein", v["body-mass"] * v["grams-per-kg"] * 4, 0, "kcal"]],
    { limitations: ["Requirement depends on age, activity, pregnancy and clinical status; ranges are guidance, not prescription."] }),

  mk("fiber-intake", [p("Calories", 2200, "kcal/day"), p("Grams per 1000 kcal", 14, "g")],
    "Fibre = calories / 1000 × g per 1000 kcal", "Fibre intake target",
    (v) => [["Daily fibre target", (v.calories / 1000) * v["grams-per-1000-kcal"], 0, "g/day", true]]),

  mk("water-intake", [p("Body mass", 70, "kg"), p("mL per kg", 35, "mL/kg")],
    "Water = mass × mL/kg", "Fluid intake estimate",
    (v) => [["Daily fluid estimate", (v["body-mass"] * v["ml-per-kg"]) / 1000, 2, "L/day", true]],
    { limitations: ["Excludes climate, exercise, pregnancy and medical fluid restrictions; not clinical advice."] }),

  mkx("body-fat-navy", [p("Waist", 86, "cm"), p("Neck", 38, "cm"), p("Hip", 95, "cm"), p("Height", 175, "cm"), s("Sex", [["male", "Male"], ["female", "Female"]], "male")],
    "US Navy circumference regression (log₁₀ of tape measurements)", "Body fat estimate",
    (v) => {
      const inWaist = v.waist / 2.54, inNeck = v.neck / 2.54, inHip = v.hip / 2.54, inHt = v.height / 2.54;
      const bf = v.sex === "male"
        ? 495 / (1.0324 - 0.19077 * Math.log10(inWaist - inNeck) + 0.15456 * Math.log10(inHt)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(inWaist + inHip - inNeck) + 0.221 * Math.log10(inHt)) - 450;
      return [["Estimated body fat", bf, 1, "%", true]];
    },
    { limitations: ["Circumference regression is an estimate (±3–4%) and is population-specific; it is not a measurement of body composition."] }),

  mk("waist-hip-ratio", [p("Waist", 86, "cm"), p("Hip", 98, "cm")],
    "WHR = waist / hip", "Waist-to-hip ratio",
    (v) => {
      const whr = v.waist / v.hip;
      return [["Waist-to-hip ratio", whr, 3, undefined, true],
        ["Band", whr < 0.9 ? "Lower risk band" : whr < 1.0 ? "Elevated band" : "High risk band"]];
    },
    { limitations: ["WHO risk thresholds differ by sex (≥0.90 men, ≥0.85 women) and are screening bands, not diagnoses."] }),

  mkx("ideal-body-weight", [p("Height", 175, "cm"), s("Sex", [["male", "Male"], ["female", "Female"]], "male")],
    "Devine: 50 kg (male) / 45.5 kg (female) + 2.3 kg per inch over 5 ft", "Ideal body weight (Devine)",
    (v) => {
      const inches = v.height / 2.54;
      const base = v.sex === "male" ? 50 : 45.5;
      const ibw = base + 2.3 * Math.max(0, inches - 60);
      return [["Ideal body weight (Devine)", ibw, 1, "kg", true], ["Range (±10%)", `${(ibw * 0.9).toFixed(1)} – ${(ibw * 1.1).toFixed(1)} kg`]];
    },
    { limitations: ["Devine formula was derived for drug dosing in adults and does not define health; it ignores frame and body composition."] }),

  mk("bmi-percentile-child", [p("BMI", 17.2, "kg/m²"), n("Box-Cox power", -1.2), p("M (median)", 16.8), p("S (CV)", 0.085)],
    "LMS z = ((BMI/M)^L − 1) / (L·S); percentile = Φ(z)", "LMS-based paediatric BMI z-score",
    (v) => {
      const z = (Math.pow(v.bmi / v["m-median"], v["box-cox-power"]) - 1) / (v["box-cox-power"] * v["s-cv"]);
      const pct = 0.5 * (1 + erf(z / Math.SQRT2)) * 100;
      return [["z-score", z, 3, undefined, true], ["Percentile", pct, 2, "%"]];
    },
    { limitations: ["CDC/WHO paediatric growth references are published as age- and sex-specific LMS tables. This tool computes the LMS transform from parameters you supply and must not be used without the official table values and paediatric review — specialist review required."] }),

  mkx("sodium-intake", [t("Food sodium mg", "480, 320, 610, 180"), it("Servings", 1, { min: 1 })],
    "Total sodium = Σ items × servings", "Sodium intake",
    (v) => {
      const items = parseNumList(String(v["food-sodium-mg"]), 1);
      if (!items.ok) return items;
      const tot = items.value.reduce((a, b) => a + b, 0) * v.servings;
      return [["Total sodium", tot, 0, "mg", true], ["Salt equivalent", (tot * 2.5) / 1000, 2, "g"]];
    }),

  mk("added-sugar-limit", [p("Calories", 2000, "kcal/day"), p("Limit share", 10, "%", { max: 100 })],
    "Sugar limit = calories × share / 4 kcal/g", "Added sugar limit",
    (v) => [["Added sugar limit", (v.calories * (v["limit-share"] / 100)) / 4, 0, "g/day", true],
      ["Limit share", v["limit-share"], 1, "% of energy"]]),

  mk("alcohol-calories", [p("Volume", 330, "mL"), p("ABV", 5, "%")],
    "Ethanol grams = volume × ABV% × 0.789; calories = g × 7", "Alcohol calories",
    (v) => {
      const g = v.volume * (v.abv / 100) * 0.789;
      return [["Ethanol", g, 2, "g", true], ["Calories from alcohol", g * 7, 0, "kcal"],
        ["Standard drinks (10 g)", g / 10, 2, "drinks"]];
    }),
];
