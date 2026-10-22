import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { it, mk, mkx, n, p, s, t, z } from "@/lib/engine/dsl";
import { erf, parseNumList } from "@/lib/engine/helpers";

const G = 9.80665;

export const M06_SPECS: CalculatorSpec[] = [
  // ── C32 Manufacturing Operations (16) ──────────────────────────────────────
  mk("oee", [p("Availability", 92, "%", { max: 100 }), p("Performance", 88, "%", { max: 100 }), p("Quality", 98.5, "%", { max: 100 })],
    "OEE = Availability × Performance × Quality", "A, P, Q as percentages",
    (v) => [["Overall Equipment Effectiveness", (v.availability * v.performance * v.quality) / 10000, 2, "%", true],
      ["World-class gap (85% target)", 85 - (v.availability * v.performance * v.quality) / 10000, 2, "pp"]]),

  mk("availability-rate", [p("Planned production time", 480, "min"), p("Downtime", 38, "min")],
    "A% = (planned − downtime) / planned × 100", "Planned time and downtime",
    (v) => [["Availability", ((v["planned-production-time"] - v.downtime) / v["planned-production-time"]) * 100, 2, "%", true],
      ["Run time", v["planned-production-time"] - v.downtime, 0, "min"]]),

  mk("performance-rate", [p("Units produced", 4200), p("Ideal cycle time", 5.5, "s/unit"), p("Run time", 240, "min")],
    "P% = (units × ideal cycle) / run time × 100", "Output, ideal cycle, actual run time",
    (v) => [["Performance", ((v["units-produced"] * v["ideal-cycle-time"]) / (v["run-time"] * 60)) * 100, 2, "%", true]]),

  mk("quality-rate", [p("Good units", 4120), p("Total units", 4200)],
    "Q% = good / total × 100", "Good and total produced units",
    (v) => [["Quality rate", (v["good-units"] / v["total-units"]) * 100, 2, "%", true], ["Defects", v["total-units"] - v["good-units"], 0, "units"]]),

  mk("takt-time", [p("Available time", 27000, "s"), p("Customer demand", 450, "units")],
    "Takt = available time / demand", "Shift time and demand volume",
    (v) => [["Takt time", v["available-time"] / v["customer-demand"], 2, "s/unit", true], ["Line rate required", 3600 / (v["available-time"] / v["customer-demand"]), 1, "units/h"]]),

  mk("cycle-time", [p("Time per unit", 45, "s")],
    "Throughput = 3600 / cycle time", "Cycle time per unit",
    (v) => [["Throughput", 3600 / v["time-per-unit"], 1, "units/h", true], ["Throughput per shift (8 h)", (3600 / v["time-per-unit"]) * 8, 0, "units"]]),

  mk("production-capacity", [p("Machine rate", 60, "units/h"), p("Operating hours", 16, "h"), p("OEE", 78, "%", { max: 100 })],
    "Capacity = rate × hours × OEE", "Nominal rate, available hours and OEE",
    (v) => [["Effective capacity", v["machine-rate"] * v["operating-hours"] * (v.oee / 100), 0, "units", true],
      ["Nominal capacity", v["machine-rate"] * v["operating-hours"], 0, "units"]]),

  mk("capacity-utilisation", [p("Actual output", 7800), p("Available capacity", 9000)],
    "Utilisation% = actual / capacity × 100", "Actual versus available capacity",
    (v) => [["Capacity utilisation", (v["actual-output"] / v["available-capacity"]) * 100, 2, "%", true], ["Idle capacity", v["available-capacity"] - v["actual-output"], 0, "units"]]),

  mk("production-yield", [p("Good output", 9400), p("Units started", 10000)],
    "Yield% = good / started × 100", "Good units over units started",
    (v) => [["First-pass yield", (v["good-output"] / v["units-started"]) * 100, 2, "%", true]]),

  mk("scrap-rate", [p("Scrap units", 320), p("Units produced", 10000)],
    "Scrap% = scrap / produced × 100", "Scrapped quantity over total production",
    (v) => [["Scrap rate", (v["scrap-units"] / v["units-produced"]) * 100, 2, "%", true]]),

  mk("labour-productivity", [p("Output", 4200, "units"), p("Labour hours", 210, "h")],
    "Productivity = output / labour hours", "Units per labour hour",
    (v) => [["Labour productivity", v.output / v["labour-hours"], 2, "units/h", true]]),

  mk("machine-hour-rate", [p("Annual machine cost", 48000, "$"), p("Annual operating hours", 2400, "h")],
    "Rate = cost / hours", "Machine cost absorption rate",
    (v) => [["Machine-hour rate", v["annual-machine-cost"] / v["annual-operating-hours"], 2, "$/h", true]]),

  mk("standard-cost", [p("Material cost", 26, "$"), p("Labour cost", 14, "$"), p("Overhead", 9.5, "$")],
    "Standard cost = material + labour + overhead", "Per-unit standard cost build-up",
    (v) => [["Standard unit cost", v["material-cost"] + v["labour-cost"] + v.overhead, 2, "$", true]]),

  mkx("line-balance-efficiency", [p("Stations", 5, undefined, { min: 1 }), t("Task times", "45, 38, 52, 41, 36, 44")],
    "Efficiency% = Σ task times / (stations × bottleneck time) × 100", "Task time list and station count",
    (v) => {
      const times = parseNumList(String(v["task-times"]), 1);
      if (!times.ok) return times;
      const sum = times.value.reduce((a, b) => a + b, 0), cycle = Math.max(...times.value);
      return [["Line balance efficiency", (sum / (v.stations * cycle)) * 100, 2, "%", true],
        ["Bottleneck (cycle) time", cycle, 1, "s"], ["Total work content", sum, 1, "s"],
        ["Minimum theoretical stations", Math.ceil(sum / cycle), 0, "stations"]];
    }),

  mk("little-law-wip", [p("Throughput", 120, "units/day"), p("Flow time", 4.5, "days")],
    "WIP = throughput × flow time", "Little's Law",
    (v) => [["Average work in process", v.throughput * v["flow-time"], 1, "units", true]]),

  mk("kanban-size", [p("Daily demand", 480, "units/day"), p("Replenishment lead time", 1.5, "days"), p("Container size", 40, "units"), z("Safety factor", 15, "%")],
    "Cards = ceil(demand × lead time × (1 + safety) / container)", "Kanban card count",
    (v) => [["Kanban cards required", Math.ceil((v["daily-demand"] * v["replenishment-lead-time"] * (1 + v["safety-factor"] / 100)) / v["container-size"]), 0, "cards", true]]),

  // ── C33 Cutting Optimisation (12) ──────────────────────────────────────────
  mkx("cutting-stock-1d", [p("Stock length", 6000, "mm"), t("Pieces", "2400, 1800, 1800, 1200, 900, 2400")],
    "First-fit-decreasing bin packing over stock bars", "Stock length and required piece lengths",
    (v) => {
      const pieces = parseNumList(String(v.pieces), 1);
      if (!pieces.ok) return pieces;
      const stock = Number(v["stock-length"]);
      if (pieces.value.some((x) => x <= 0 || x > stock)) return err("Every piece length must be > 0 and no longer than the stock bar.");
      const bins: number[] = [];
      for (const len of [...pieces.value].sort((a, b) => b - a)) {
        let placed = false;
        for (let i = 0; i < bins.length; i++) {
          if (bins[i] + len <= stock) { bins[i] += len; placed = true; break; }
        }
        if (!placed) bins.push(len);
      }
      const used = bins.reduce((a, b) => a + b, 0);
      return [["Stock bars required", bins.length, 0, "bars", true],
        ["Material utilisation", (used / (bins.length * stock)) * 100, 2, "%"],
        ["Offcut per bar (approx.)", (bins.length * stock - used) / bins.length, 0, "mm"]];
    }),

  mkx("sheet-nesting-2d", [p("Sheet area", 2.98, "m²"), p("Part count", 120), p("Part area", 0.021, "m²")],
    "Waste% = 1 − (parts × part area) / sheet area", "Area-based nesting estimate (no geometric placement)",
    (v) => {
      const partsArea = v["part-count"] * v["part-area"];
      if (partsArea > v["sheet-area"]) return err("Total part area exceeds the sheet area.");
      return [["Sheet utilisation", (partsArea / v["sheet-area"]) * 100, 2, "%", true], ["Waste area", v["sheet-area"] - partsArea, 4, "m²"]];
    }),

  mk("cut-list-waste", [p("Purchased length", 48, "m"), p("Used length", 41, "m")],
    "Waste% = (purchased − used) / purchased × 100", "Cut-list waste",
    (v) => [["Waste", ((v["purchased-length"] - v["used-length"]) / v["purchased-length"]) * 100, 2, "%", true], ["Offcut length", v["purchased-length"] - v["used-length"], 2, "m"]]),

  mk("kerf-compensation", [p("Number of cuts", 24), p("Blade kerf", 3.2, "mm")],
    "Extra length = cuts × kerf", "Saw kerf allowance",
    (v) => [["Extra length consumed by kerf", v["number-of-cuts"] * v["blade-kerf"], 1, "mm", true]]),

  mkx("rebar-cutting-plan", [p("Stock bar", 12000, "mm"), t("Required lengths", "3600, 3600, 3600, 2400, 2400, 1800, 1800, 1800")],
    "First-fit-decreasing packing with lap allowance ignored", "Bar stock and cut lengths",
    (v) => {
      const pieces = parseNumList(String(v["required-lengths"]), 1);
      if (!pieces.ok) return pieces;
      const stock = Number(v["stock-bar"]);
      if (pieces.value.some((x) => x <= 0 || x > stock)) return err("Each cut length must be > 0 and ≤ stock bar length.");
      const bins: number[] = [];
      for (const len of [...pieces.value].sort((a, b) => b - a)) {
        let placed = false;
        for (let i = 0; i < bins.length; i++) if (bins[i] + len <= stock) { bins[i] += len; placed = true; break; }
        if (!placed) bins.push(len);
      }
      return [["Stock bars required", bins.length, 0, "bars", true],
        ["Total length cut", pieces.value.reduce((a, b) => a + b, 0) / 1000, 2, "m"],
        ["Yield", (pieces.value.reduce((a, b) => a + b, 0) / (bins.length * stock)) * 100, 2, "%"]];
    }),

  mkx("pipe-cutting-plan", [p("Stock pipe", 6500, "mm"), t("Lengths", "2400, 1200, 1200, 900, 2400, 1800")],
    "First-fit-decreasing packing", "Pipe stock and cut lengths",
    (v) => {
      const pieces = parseNumList(String(v.lengths), 1);
      if (!pieces.ok) return pieces;
      const stock = Number(v["stock-pipe"]);
      if (pieces.value.some((x) => x <= 0 || x > stock)) return err("Each cut length must be > 0 and ≤ stock length.");
      const bins: number[] = [];
      for (const len of [...pieces.value].sort((a, b) => b - a)) {
        let placed = false;
        for (let i = 0; i < bins.length; i++) if (bins[i] + len <= stock) { bins[i] += len; placed = true; break; }
        if (!placed) bins.push(len);
      }
      return [["Stock pipes required", bins.length, 0, "pipes", true], ["Total cut length", pieces.value.reduce((a, b) => a + b, 0) / 1000, 2, "m"]];
    }),

  mkx("plank-cut-plan", [p("Board length", 2400, "mm"), t("Part lengths", "800, 800, 600, 600, 450")],
    "First-fit-decreasing packing", "Board stock and part lengths",
    (v) => {
      const pieces = parseNumList(String(v["part-lengths"]), 1);
      if (!pieces.ok) return pieces;
      const stock = Number(v["board-length"]);
      if (pieces.value.some((x) => x <= 0 || x > stock)) return err("Each part must be > 0 and ≤ board length.");
      const bins: number[] = [];
      for (const len of [...pieces.value].sort((a, b) => b - a)) {
        let placed = false;
        for (let i = 0; i < bins.length; i++) if (bins[i] + len <= stock) { bins[i] += len; placed = true; break; }
        if (!placed) bins.push(len);
      }
      return [["Boards required", bins.length, 0, "boards", true], ["Utilisation", (pieces.value.reduce((a, b) => a + b, 0) / (bins.length * stock)) * 100, 2, "%"]];
    }),

  mk("coil-slitting-plan", [p("Coil width", 1250, "mm"), p("Slit width", 300, "mm"), p("Required strips", 4)],
    "Strips per coil = floor(coil width / slit width); coils = ceil(required / strips)", "Slitting plan",
    (v) => {
      const per = Math.floor(v["coil-width"] / v["slit-width"]);
      if (per < 1) return err("Slit width exceeds the coil width.");
      return [["Maximum strips per coil", per, 0, "strips", true], ["Coils required", Math.ceil(v["required-strips"] / per), 0, "coils"],
        ["Edge trim waste", v["coil-width"] - per * v["slit-width"], 0, "mm"]];
    }),

  mk("sheet-count-from-area", [p("Total area", 46, "m²"), p("Sheet area", 2.98, "m²"), z("Waste", 8, "%")],
    "Sheets = ceil(area × (1 + waste%) / sheet area)", "Area-based sheet count",
    (v) => [["Sheets required", Math.ceil((v["total-area"] * (1 + v.waste / 100)) / v["sheet-area"]), 0, "sheets", true]]),

  mk("offcut-value", [p("Offcut mass", 240, "kg"), p("Material price", 1.85, "$/kg")],
    "Value = mass × price", "Recoverable offcut value",
    (v) => [["Offcut value", v["offcut-mass"] * v["material-price"], 2, "$", true]]),

  mk("cutting-yield", [p("Material used", 41, "m"), p("Material purchased", 48, "m")],
    "Yield% = used / purchased × 100", "Cutting yield",
    (v) => [["Cutting yield", (v["material-used"] / v["material-purchased"]) * 100, 2, "%", true]]),

  mk("cuts-required", [p("Pieces", 24), p("Cuts per piece", 1), p("Cut time", 25, "s")],
    "Cuts = pieces × cuts per piece; time = cuts × cut time", "Cut count and machining time",
    (v) => {
      const cuts = v.pieces * v["cuts-per-piece"];
      return [["Total cuts", cuts, 0, "cuts", true], ["Total cutting time", (cuts * v["cut-time"]) / 60, 1, "min"]];
    }),

  // ── C34 Glass and Glazing (14) ─────────────────────────────────────────────
  mk("glass-weight", [p("Width", 1.2, "m"), p("Height", 2.1, "m"), p("Thickness", 6, "mm"), p("Density", 2500, "kg/m³")],
    "Mass = width × height × thickness × density", "Flat glass weight (2500 kg/m³ typical soda-lime)",
    (v) => {
      const area = v.width * v.height, mass = area * (v.thickness / 1000) * v.density;
      return [["Area", area, 3, "m²", true], ["Glass mass", mass, 2, "kg"], ["Mass per m²", mass / area, 2, "kg/m²"]];
    }),

  mk("glass-area-cost", [p("Width", 1.4, "m"), p("Height", 2.0, "m"), p("Rate", 85, "$/m²"), it("Panels", 1, { min: 1 })],
    "Cost = width × height × rate × panels", "Glass area pricing",
    (v) => {
      const area = v.width * v.height * v.panels;
      return [["Total glazed area", area, 3, "m²", true], ["Cost", area * v.rate, 2, "$"]];
    }),

  mk("glass-thickness-selection", [p("Panel area", 3.0, "m²"), p("Design wind pressure", 1.5, "kPa"), p("Allowable stress", 16, "MPa")],
    "Parametric: σ = 0.75 q b²/t² (plate bending) solved for t", "Parametric glazing thickness",
    (v) => {
      const t = Math.sqrt((0.75 * v["design-wind-pressure"] * 1000 * Math.sqrt(v["panel-area"])) / (v["allowable-stress"] * 1e6)) * 1000 * 3;
      return [["Indicative minimum thickness", t, 1, "mm", true]];
    },
    { limitations: ["ASTM E1300 / EN 16612 glass design methods, load-duration factors and breakage probabilities are licensed and non-linear. This parametric plate-bending estimate is for preliminary sizing only — specialist glazing engineering is required."] }),

  mk("glass-cutting-yield", [p("Sheet area", 3.2, "m²"), p("Parts area", 2.65, "m²")],
    "Yield% = parts area / sheet area × 100", "Cutting yield",
    (v) => [["Cutting yield", (v["parts-area"] / v["sheet-area"]) * 100, 2, "%", true], ["Waste area", v["sheet-area"] - v["parts-area"], 3, "m²"]]),

  mk("glass-cutting-optimiser", [p("Sheet width", 3210, "mm"), p("Sheet height", 2250, "mm"), p("Part width", 900, "mm"), p("Part height", 600, "mm")],
    "Grid placement: floor(sheet W / part W) × floor(sheet H / part H)", "Simple grid nesting (orientation fixed)",
    (v) => {
      const cols = Math.floor(v["sheet-width"] / v["part-width"]), rows = Math.floor(v["sheet-height"] / v["part-height"]);
      const parts = cols * rows;
      const util = (parts * v["part-width"] * v["part-height"]) / (v["sheet-width"] * v["sheet-height"]);
      return [["Parts per sheet", parts, 0, "parts", true], ["Sheet utilisation", util * 100, 2, "%"],
        ["Parts per sheet (rotated)", Math.floor(v["sheet-width"] / v["part-height"]) * Math.floor(v["sheet-height"] / v["part-width"]), 0, "parts"]];
    }),

  mk("mirror-size-cost", [p("Width", 0.9, "m"), p("Height", 1.8, "m"), p("Rate", 95, "$/m²"), p("Edge finishing", 12, "$/m")],
    "Cost = area × rate + perimeter × edge rate", "Mirror pricing with edgework",
    (v) => {
      const area = v.width * v.height, per = 2 * (v.width + v.height);
      return [["Total cost", area * v.rate + per * v["edge-finishing"], 2, "$", true],
        ["Area", area, 3, "m²"], ["Perimeter", per, 2, "m"]];
    }),

  mk("igu-u-value", [p("Pane U-value", 5.8, "W/m²·K"), p("Cavity gap", 16, "mm"), p("Gas conductivity", 0.016, "W/m·K")],
    "1/U_total = 1/U_pane1 + R_cavity + 1/U_pane2", "Insulating glass unit centre-of-glass U-value",
    (v) => {
      const rcav = (v["cavity-gap"] / 1000) / v["gas-conductivity"];
      const u = 1 / (2 / v["pane-u-value"] + rcav);
      return [["Centre-of-glass U-value", u, 3, "W/m²·K", true], ["Cavity thermal resistance", rcav, 4, "m²·K/W"]];
    },
    { limitations: ["Centre-of-glass only; edge and frame effects dominate whole-window U-values. Convective/radiative cavity heat transfer depends on gas, tilt and temperature."] }),

  mk("glass-deflection", [p("Short span", 1.2, "m"), p("Thickness", 6, "mm"), p("Wind pressure", 1.5, "kPa"), p("Young modulus", 70, "GPa")],
    "δ = 0.142 q b⁴ / (E t³) (simply supported plate approximation)", "Parametric plate deflection",
    (v) => {
      const d = (0.142 * v["wind-pressure"] * 1000 * v["short-span"] ** 4) / (v["young-modulus"] * 1e9 * (v.thickness / 1000) ** 3);
      return [["Centre deflection", d * 1000, 2, "mm", true], ["Deflection ratio (span/δ)", v["short-span"] / d, 1, undefined]];
    },
    { limitations: ["Simplified isotropic plate formula. ASTM E1300 requires glass-specific nonlinear analysis and load-duration factors; specialist review required."] }),

  mk("glazing-wind-load", [p("Wind speed", 45, "m/s"), p("Height factor", 1.2), p("Pressure coefficient", 1.8)],
    "p = 0.613 V² × height factor × Cp", "Parametric glazing wind pressure",
    (v) => {
      const q = 0.613 * v["wind-speed"] ** 2 * v["height-factor"] * v["pressure-coefficient"];
      return [["Design pressure", q / 1000, 3, "kPa", true]];
    },
    { limitations: ["ASCE 7 / EN 1991-1-4 pressure coefficients and exposure factors are code-licensed; user must supply them from the governing code."] }),

  mk("glass-edgework-cost", [p("Perimeter", 5.4, "m"), p("Edge rate", 12, "$/m"), it("Edges finished", 4, { min: 1, max: 4 })],
    "Cost = perimeter × rate × (edges/4)", "Edge polishing cost",
    (v) => [["Edgework cost", v.perimeter * v["edge-rate"] * (v["edges-finished"] / 4), 2, "$", true],
      ["Finished edge length", v.perimeter * (v["edges-finished"] / 4), 2, "m"]]),

  mk("glass-offcut-value", [p("Offcut area", 0.8, "m²"), p("Rate", 85, "$/m²")],
    "Value = area × rate", "Reusable offcut value",
    (v) => [["Offcut value", v["offcut-area"] * v.rate, 2, "$", true]]),

  mk("shower-panel-size", [p("Opening width", 1200, "mm"), p("Clearance", 30, "mm"), p("Glass thickness", 8, "mm")],
    "Panel = opening − clearance; door leaf ≈ panel / 2", "Shower enclosure panel sizing",
    (v) => {
      const panel = v["opening-width"] - v.clearance;
      return [["Fixed panel width", panel * 0.5, 0, "mm", true], ["Door leaf width", panel * 0.5, 0, "mm"], ["Total enclosure width", panel, 0, "mm"]];
    }),

  mk("glass-balustrade-load", [p("Line load", 0.75, "kN/m"), p("Panel height", 1.1, "m"), p("Panel width", 1.2, "m")],
    "Design moment = line load × height² / 2 (cantilever)", "Balustrade base moment",
    (v) => {
      const m = (v["line-load"] * v["panel-height"] ** 2) / 2;
      return [["Design moment", m, 3, "kN·m/m", true], ["Panel load", v["line-load"] * v["panel-width"], 3, "kN"]];
    },
    { limitations: ["Glass balustrade design (line-load requirements, interlayer design, fixing capacity) is governed by licensed codes and requires structural glass engineering. Specialist review required."] }),

  mk("laminated-vs-tempered", [p("Area", 3.2, "m²"), p("Tempered rate", 120, "$/m²"), p("Laminated rate", 165, "$/m²")],
    "Compares cost per m² and total for two glazing build-ups", "Glass type cost comparison",
    (v) => [["Tempered cost", v.area * v["tempered-rate"], 2, "$", true], ["Laminated cost", v.area * v["laminated-rate"], 2, "$"],
      ["Laminated premium", v.area * (v["laminated-rate"] - v["tempered-rate"]), 2, "$"]]),

  // ── C35 Wood and Timber (12) ───────────────────────────────────────────────
  mk("board-feet", [p("Thickness", 1, "in"), p("Width", 6, "in"), p("Length", 8, "ft"), it("Quantity", 10, { min: 1 })],
    "BF = (T × W × L) / 12 per piece", "Nominal lumber board footage",
    (v) => {
      const bf = (v.thickness * v.width * v.length) / 12;
      return [["Board feet per piece", bf, 3, "bf", true], ["Total board feet", bf * v.quantity, 2, "bf"],
        ["Volume", bf * v.quantity * 0.002359737216, 4, "m³"]];
    }),

  mk("lumber-weight", [p("Volume", 0.15, "m³"), p("Density", 550, "kg/m³"), z("Moisture content", 12, "%")],
    "Mass = volume × basic density × (1 + MC% adjusted)", "Lumber mass estimate",
    (v) => {
      const mass = v.volume * v.density * (1 + (v["moisture-content"] / 100) * 0.3);
      return [["Estimated mass", mass, 2, "kg", true], ["Mass per m³", mass / v.volume, 1, "kg/m³"]];
    },
    { assumptions: ["Moisture adds roughly 0.3 kg per kg of dry wood per 100% MC; exact values depend on species and fibre saturation point."] }),

  mk("plywood-sheets", [p("Area", 64, "m²"), p("Sheet area", 2.9768, "m²"), z("Waste", 10, "%")],
    "Sheets = ceil(area × (1 + waste%) / sheet area)", "Plywood sheet count (2440 × 1220 mm)",
    (v) => [["Sheets required", Math.ceil((v.area * (1 + v.waste / 100)) / v["sheet-area"]), 0, "sheets", true]]),

  mk("timber-beam-size", [p("Span", 4, "m"), p("Uniform load", 3, "kN/m"), p("Bending stress", 8, "MPa"), p("Section width", 100, "mm")],
    "Parametric: required section modulus S = wL²/8 / σ; depth from S = bd²/6", "Parametric timber beam sizing",
    (v) => {
      const m = (v["uniform-load"] * v.span ** 2) / 8;
      const sReq = (m * 1e6) / (v["bending-stress"] * 1e6) * 1000;
      const d = Math.sqrt((6 * sReq * 1000) / v["section-width"]);
      return [["Design moment", m, 3, "kN·m", true], ["Required section modulus", sReq * 1000, 0, "mm³"],
        ["Indicative depth for given width", d, 0, "mm"]];
    },
    { limitations: ["Timber design requires species grade, service class, load duration (k_mod) and stability checks per the governing code (e.g. Eurocode 5 / NDS). Parametric sizing only — specialist review required."] }),

  mk("wood-shrinkage", [p("Dimension", 200, "mm"), p("Initial moisture", 18, "%"), p("Final moisture", 8, "%"), p("Shrinkage coefficient", 0.24, "% per % MC")],
    "ΔD = D × coefficient × ΔMC", "Tangential/radial shrinkage estimate",
    (v) => {
      const dm = v["initial-moisture"] - v["final-moisture"];
      return [["Dimensional change", v.dimension * (v["shrinkage-coefficient"] / 100) * dm, 3, "mm", true],
        ["Final dimension", v.dimension + v.dimension * (v["shrinkage-coefficient"] / 100) * dm, 3, "mm"]];
    }),

  mk("decking-boards", [p("Deck width", 4, "m"), p("Deck length", 6, "m"), p("Board width", 140, "mm"), p("Gap", 5, "mm")],
    "Boards = ceil(deck width / (board width + gap))", "Decking board count",
    (v) => {
      const boards = Math.ceil((v["deck-width"] * 1000) / (v["board-width"] + v.gap));
      const linear = boards * v["deck-length"];
      return [["Boards required", boards, 0, "boards", true], ["Total linear length", linear, 1, "m"],
        ["Deck area", v["deck-width"] * v["deck-length"], 2, "m²"]];
    }),

  mk("fence-pickets", [p("Fence run", 24, "m"), p("Picket width", 90, "mm"), p("Gap", 20, "mm"), p("Rails", 2)],
    "Pickets = ceil(run / (picket + gap)); rails = pickets × rails", "Picket fence take-off",
    (v) => {
      const count = Math.ceil((v["fence-run"] * 1000) / (v["picket-width"] + v.gap));
      return [["Pickets required", count, 0, "pickets", true], ["Post spacing (2.4 m typical)", Math.ceil(v["fence-run"] / 2.4) + 1, 0, "posts"],
        ["Rail length", v["fence-run"] * v.rails, 1, "m"]];
    }),

  mk("screw-nail-quantity", [p("Area", 60, "m²"), p("Fasteners", 12, "per m²")],
    "Count = area × density", "Fastener take-off",
    (v) => [["Fasteners required", Math.ceil(v.area * v.fasteners), 0, "pieces", true]]),

  mk("stain-coverage", [p("Area", 85, "m²"), it("Coats", 2, { min: 1 }), p("Coverage", 8, "m²/L")],
    "Litres = area × coats / coverage", "Stain/finish volume",
    (v) => [["Stain required", (v.area * v.coats) / v.coverage, 2, "L", true]]),

  mk("cabinet-cut-list", [p("Carcass width", 600, "mm"), p("Carcass height", 720, "mm"), p("Carcass depth", 560, "mm")],
    "Panels: 2 sides, top/bottom, back, shelves", "Box cabinet panel sizes",
    (v) => {
      const t = 18;
      const area = 2 * (v["carcass-height"] * v["carcass-depth"]) + 2 * (v["carcass-width"] * v["carcass-depth"]) + v["carcass-width"] * v["carcass-height"];
      return [["2 sides", `${v["carcass-height"]} × ${v["carcass-depth"]} mm`, "2 pcs", true],
        ["Top + bottom", `${v["carcass-width"] - 2 * t} × ${v["carcass-depth"]} mm`, "2 pcs"],
        ["Back panel", `${v["carcass-width"]} × ${v["carcass-height"]} mm`, "1 pc"],
        ["Panel area", area / 1e6, 3, "m²"]];
    }),

  mk("lumber-cost-boardfoot", [p("Board feet", 120, "bf"), p("Price", 9.5, "$/bf")],
    "Cost = board feet × price", "Lumber cost",
    (v) => [["Total cost", v["board-feet"] * v.price, 2, "$", true]]),

  mk("glue-coverage", [p("Joint area", 4.5, "m²"), p("Spread rate", 180, "g/m²")],
    "Mass = area × spread rate", "Adhesive consumption",
    (v) => [["Adhesive required", v["joint-area"] * v["spread-rate"], 0, "g", true], ["Adhesive required", (v["joint-area"] * v["spread-rate"]) / 1000, 2, "kg"]]),

  // ── C36 Metal Fabrication (16) ─────────────────────────────────────────────
  mk("steel-plate-weight", [p("Length", 2.4, "m"), p("Width", 1.2, "m"), p("Thickness", 10, "mm"), p("Density", 7850, "kg/m³")],
    "Mass = L × W × t × ρ", "Steel plate mass",
    (v) => {
      const mass = v.length * v.width * (v.thickness / 1000) * v.density;
      return [["Plate mass", mass, 2, "kg", true], ["Mass per m²", mass / (v.length * v.width), 2, "kg/m²"]];
    }),

  mk("pipe-weight", [p("Outer diameter", 168.3, "mm"), p("Wall thickness", 7.11, "mm"), p("Length", 6, "m"), p("Density", 7850, "kg/m³")],
    "Mass = π(OD − t)·t·L·ρ", "Steel pipe mass",
    (v) => {
      const od = v["outer-diameter"] / 1000, t = v["wall-thickness"] / 1000;
      const mass = Math.PI * (od - t) * t * v.length * v.density;
      return [["Pipe mass", mass, 2, "kg", true], ["Mass per metre", mass / v.length, 2, "kg/m"]];
    }),

  mk("sheet-metal-weight", [p("Gauge thickness", 1.5, "mm"), p("Length", 1.2, "m"), p("Width", 0.6, "m"), p("Density", 7850, "kg/m³")],
    "Mass = area × thickness × density", "Sheet metal mass",
    (v) => {
      const mass = v.length * v.width * (v["gauge-thickness"] / 1000) * v.density;
      return [["Sheet mass", mass, 3, "kg", true]];
    }),

  mk("bend-allowance", [p("Bend angle", 90, "°"), p("Inside radius", 3, "mm"), p("Thickness", 2, "mm"), p("K factor", 0.44)],
    "BA = θ(rad) × (R + K·T)", "Sheet-metal bend allowance",
    (v) => {
      const ba = ((v["bend-angle"] * Math.PI) / 180) * (v["inside-radius"] + v["k-factor"] * v.thickness);
      return [["Bend allowance", ba, 3, "mm", true], ["Bend deduction", 2 * (v["inside-radius"] + v.thickness) * Math.tan(((v["bend-angle"] * Math.PI) / 180) / 2) - ba, 3, "mm"]];
    }),

  mk("bend-deduction", [p("Bend angle", 90, "°"), p("Inside radius", 3, "mm"), p("Thickness", 2, "mm"), p("K factor", 0.44)],
    "BD = 2(R + T)tan(θ/2) − BA", "Sheet-metal bend deduction",
    (v) => {
      const rad = (v["bend-angle"] * Math.PI) / 180;
      const ba = rad * (v["inside-radius"] + v["k-factor"] * v.thickness);
      return [["Bend deduction", 2 * (v["inside-radius"] + v.thickness) * Math.tan(rad / 2) - ba, 3, "mm", true]];
    }),

  mk("flat-pattern", [p("Leg 1", 50, "mm"), p("Leg 2", 80, "mm"), p("Bend deduction", 3.4, "mm"), it("Bends", 1, { min: 1 })],
    "Flat length = Σ flange lengths − bends × deduction", "Sheet-metal flat pattern",
    (v) => [["Flat blank length", v["leg-1"] + v["leg-2"] - v.bends * v["bend-deduction"], 2, "mm", true]]),

  mk("weld-consumable", [p("Joint area", 60, "mm²"), p("Weld length", 3.5, "m"), p("Deposition efficiency", 0.85), p("Density", 7850, "kg/m³")],
    "Mass = area × length × density / efficiency", "Filler metal consumption",
    (v) => {
      const mass = (v["joint-area"] * 1e-6 * v["weld-length"] * v.density) / v["deposition-efficiency"];
      return [["Filler metal required", mass, 3, "kg", true]];
    }),

  mk("weld-heat-input", [p("Voltage", 26, "V"), p("Current", 220, "A"), p("Travel speed", 4.5, "mm/s")],
    "HI = (V × I) / travel speed / 1000", "Weld heat input",
    (v) => [["Heat input", (v.voltage * v.current) / v["travel-speed"] / 1000, 4, "kJ/mm", true]]),

  mk("cutting-speed-rpm", [p("Cutting speed", 120, "m/min"), p("Tool diameter", 12, "mm")],
    "N = 1000 Vc / (π D)", "Spindle speed for milling/drilling",
    (v) => [["Spindle speed", (1000 * v["cutting-speed"]) / (Math.PI * v["tool-diameter"]), 0, "rpm", true]]),

  mk("machining-time", [p("Cut length", 320, "mm"), p("Feed rate", 0.15, "mm/rev"), p("Spindle speed", 1200, "rpm"), it("Passes", 1, { min: 1 })],
    "t = length × passes / (feed × rpm)", "Turning/milling time",
    (v) => [["Machining time", (v["cut-length"] * v.passes) / (v["feed-rate"] * v["spindle-speed"]) / 60, 2, "min", true]]),

  mk("drilling-time", [p("Hole depth", 25, "mm"), p("Feed rate", 0.2, "mm/rev"), p("Spindle speed", 800, "rpm")],
    "t = depth / (feed × rpm)", "Drilling time",
    (v) => [["Drilling time", v["hole-depth"] / (v["feed-rate"] * v["spindle-speed"]) / 60, 3, "min", true]]),

  mk("metal-cost", [p("Mass", 42, "kg"), p("Rate", 2.85, "$/kg"), z("Scrap", 8, "%")],
    "Cost = mass × rate × (1 + scrap%)", "Metal material cost",
    (v) => [["Material cost", v.mass * v.rate * (1 + v.scrap / 100), 2, "$", true]]),

  mk("hardness-conversion", [p("Hardness value", 45), s("Scale", [["HRC", "Rockwell C"], ["HV", "Vickers"], ["HB", "Brinell"]], "HRC")],
    "Parametric approximate conversion between HRC, HV and HB (steel)", "Approximate hardness conversion",
    (v) => {
      const scale = String(v.scale), val = v["hardness-value"];
      const hv = scale === "HRC" ? 0.5 * val ** 1.6 : scale === "HV" ? val : val * 1.05;
      return [["Approximate Vickers", hv, 0, "HV", true], ["Approximate Rockwell C", Math.pow(hv / 0.5, 1 / 1.6), 1, "HRC"],
        ["Approximate Brinell", hv / 1.05, 0, "HB"]];
    },
    { limitations: ["Hardness conversions are material-specific and empirical; ASTM E140 conversion tables are licensed and must be used for specification compliance. Indicative only."] }),

  mk("press-tonnage", [p("Cut perimeter", 320, "mm"), p("Thickness", 2, "mm"), p("Shear strength", 350, "MPa")],
    "F = perimeter × thickness × shear strength", "Punching/blanking force",
    (v) => {
      const f = v["cut-perimeter"] * v.thickness * v["shear-strength"];
      return [["Punching force", f / 1000, 1, "kN", true], ["Punching force", f / 9806.65, 1, "tonne-force"]];
    }),

  mk("springback", [p("Inside radius", 6, "mm"), p("Thickness", 2, "mm"), p("Springback factor", 0.06)],
    "Springback angle ≈ factor × (R/T) × bend angle", "Bend springback estimate",
    (v) => [["Radius-to-thickness ratio", v["inside-radius"] / v.thickness, 2, undefined, true],
      ["Springback per 90° bend", v["springback-factor"] * (v["inside-radius"] / v.thickness) * 90, 2, "°"]]),

  mk("galvanizing-zinc", [p("Surface area", 45, "m²"), p("Coating mass", 610, "g/m²")],
    "Zinc = area × coating mass", "Hot-dip galvanising zinc consumption",
    (v) => [["Zinc required", (v["surface-area"] * v["coating-mass"]) / 1000, 2, "kg", true],
      ["Coating thickness equivalent", (v["coating-mass"] / 7.14) / 1000, 3, "mm"]]),

  // ── C37 Textile and Apparel (15) ───────────────────────────────────────────
  mk("fabric-gsm", [p("Mass", 0.42, "kg"), p("Area", 1.5, "m²")],
    "GSM = mass (g) / area (m²); oz/yd² = GSM / 33.9057", "Fabric weight",
    (v) => {
      const gsm = (v.mass * 1000) / v.area;
      return [["GSM", gsm, 1, "g/m²", true], ["Ounces per square yard", gsm / 33.90574744, 2, "oz/yd²"]];
    }),

  mk("yarn-count-conversion", [p("Tex", 20, "g/1000m"), s("Input", [["tex", "Tex"], ["ne", "Ne (cotton count)"], ["nm", "Nm (metric)"], ["den", "Denier"]], "tex")],
    "Tex = 1000/Nm; Tex = 590.5/Ne; Tex = den/9", "Yarn linear density conversion",
    (v) => {
      const tex = v.input === "ne" ? 590.5 / v.tex : v.input === "nm" ? 1000 / v.tex : v.input === "den" ? v.tex / 9 : v.tex;
      return [["Tex", tex, 2, "tex", true], ["Nm", 1000 / tex, 2, "Nm"], ["Ne (cotton)", 590.5 / tex, 2, "Ne"], ["Denier", tex * 9, 1, "den"]];
    }),

  mk("fabric-weight", [p("Consumption", 1.8, "m"), p("GSM", 180, "g/m²"), p("Width", 1.6, "m")],
    "Mass = length × width × GSM / 1000", "Fabric mass from consumption",
    (v) => [["Fabric mass", (v.consumption * v.width * v.gsm) / 1000, 3, "kg", true], ["Mass per garment", (v.consumption * v.width * v.gsm) / 1000, 3, "kg"]]),

  mk("fabric-consumption-garment", [p("Pattern area", 1.05, "m²"), p("Fabric width", 1.5, "m"), z("Waste", 12, "%")],
    "Consumption = pattern area / width × (1 + waste%)", "Garment fabric consumption",
    (v) => [["Fabric consumption", (v["pattern-area"] / v["fabric-width"]) * (1 + v.waste / 100), 3, "m", true]]),

  mk("marker-efficiency", [p("Garment area", 8.4, "m²"), p("Marker area", 10.2, "m²")],
    "Efficiency% = garment area / marker area × 100", "Marker making efficiency",
    (v) => [["Marker efficiency", (v["garment-area"] / v["marker-area"]) * 100, 2, "%", true]]),

  mk("thread-consumption", [p("Seam length", 5.2, "m"), p("Stitch factor", 3.5)],
    "Thread = seam length × stitch factor", "Thread consumption estimate",
    (v) => [["Thread required", v["seam-length"] * v["stitch-factor"], 2, "m", true]]),

  mk("stitch-density", [p("Stitches", 42), p("Seam length", 2.5, "cm")],
    "SPI = stitches / length (inches)", "Stitch density",
    (v) => [["Stitches per inch", v.stitches / (v["seam-length"] / 2.54), 1, "SPI", true], ["Stitch length", (v["seam-length"] / v.stitches) * 10, 1, "mm"]]),

  mk("fabric-shrinkage", [p("Before wash", 100, "cm"), p("After wash", 96.5, "cm")],
    "Shrinkage% = (before − after) / before × 100", "Fabric shrinkage",
    (v) => [["Shrinkage", ((v["before-wash"] - v["after-wash"]) / v["before-wash"]) * 100, 2, "%", true]]),

  mk("roll-to-metres", [p("Roll mass", 22, "kg"), p("GSM", 180, "g/m²"), p("Width", 1.6, "m")],
    "Length = mass × 1000 / (GSM × width)", "Fabric roll length",
    (v) => [["Roll length", (v["roll-mass"] * 1000) / (v.gsm * v.width), 1, "m", true]]),

  mk("fabric-cost-garment", [p("Consumption", 1.8, "m"), p("Rate", 4.25, "$/m"), p("Waste", 8, "%")],
    "Cost = consumption × rate × (1 + waste%)", "Fabric cost per garment",
    (v) => [["Fabric cost", v.consumption * v.rate * (1 + v.waste / 100), 2, "$", true]]),

  mk("cutting-waste-textile", [p("Fabric issued", 1200, "m"), p("Fabric used", 1085, "m")],
    "Waste% = (issued − used) / issued × 100", "Cutting waste",
    (v) => [["Cutting waste", ((v["fabric-issued"] - v["fabric-used"]) / v["fabric-issued"]) * 100, 2, "%", true]]),

  mk("embroidery-stitches", [p("Stitch count", 8500), p("Machine speed", 750, "spm"), it("Heads", 1, { min: 1 })],
    "Time = stitches / (speed × heads)", "Embroidery run time",
    (v) => [["Run time", v["stitch-count"] / (v["machine-speed"] * v.heads) / 60, 2, "min", true]]),

  mk("gsm-to-oz", [p("GSM", 180, "g/m²")],
    "oz/yd² = GSM / 33.90574744", "Fabric weight unit conversion",
    (v) => [["Ounces per square yard", v.gsm / 33.90574744, 2, "oz/yd²", true], ["GSM", v.gsm, 1, "g/m²"]]),

  mk("fabric-width-conversion", [p("Tube width", 1.6, "m"), p("Usable fraction", 0.98)],
    "Open width = 2 × tube width; usable width applies selvedge allowance", "Fabric width conversion",
    (v) => [["Open width", v["tube-width"] * 2, 2, "m", true], ["Usable width", v["tube-width"] * 2 * v["usable-fraction"], 2, "m"]]),

  mk("garment-costing", [p("Fabric cost", 7.65, "$"), p("Trims", 2.4, "$"), p("Labour", 3.1, "$"), z("Overhead", 12, "%")],
    "FOB cost = (fabric + trims + labour) × (1 + overhead%)", "Garment FOB costing",
    (v) => {
      const base = v["fabric-cost"] + v.trims + v.labour;
      return [["FOB cost", base * (1 + v.overhead / 100), 2, "$", true], ["Base cost", base, 2, "$"]];
    }),

  // ── C38 Packaging and Print (15) ───────────────────────────────────────────
  mk("box-volume", [p("Length", 400, "mm"), p("Width", 300, "mm"), p("Height", 250, "mm")],
    "V = L × W × H; board area ≈ 2(LW + LH + WH)", "Box internal volume and board area",
    (v) => {
      const l = v.length / 1000, w = v.width / 1000, h = v.height / 1000;
      return [["Internal volume", l * w * h * 1000, 1, "L", true], ["Board area", 2 * (l * w + l * h + w * h), 3, "m²"],
        ["Volume", l * w * h, 4, "m³"]];
    }),

  mk("corrugated-weight", [p("Area", 12, "m²"), p("GSM", 640, "g/m²")],
    "Mass = area × GSM / 1000", "Corrugated board mass",
    (v) => [["Board mass", (v.area * v.gsm) / 1000, 2, "kg", true]]),

  mk("box-blank-size", [p("Length", 400, "mm"), p("Width", 300, "mm"), p("Height", 250, "mm"), p("Flap", 30, "mm")],
    "RSC blank: length = 2(L + W) + glue flap; height = H + W/2 + trim", "Regular slotted carton blank",
    (v) => [["Blank length", 2 * (v.length + v.width) + v.flap, 0, "mm", true], ["Blank height", v.height + v.width / 2, 0, "mm"],
      ["Blank area", ((2 * (v.length + v.width) + v.flap) * (v.height + v.width / 2)) / 1e6, 3, "m²"]]),

  mk("carton-pallet-count", [p("Pallet length", 1200, "mm"), p("Pallet width", 1000, "mm"), p("Carton length", 400, "mm"), p("Carton width", 300, "mm")],
    "Layers = floor(pallet L / carton L) × floor(pallet W / carton W)", "Cartons per pallet layer",
    (v) => {
      const a = Math.floor(v["pallet-length"] / v["carton-length"]) * Math.floor(v["pallet-width"] / v["carton-width"]);
      const b = Math.floor(v["pallet-length"] / v["carton-width"]) * Math.floor(v["pallet-width"] / v["carton-length"]);
      return [["Cartons per layer (orientation A)", a, 0, "cartons", true], ["Cartons per layer (orientation B)", b, 0, "cartons"],
        ["Best orientation", a >= b ? "A" : "B"], ["Pallet footprint utilisation", (Math.max(a, b) * v["carton-length"] * v["carton-width"]) / (v["pallet-length"] * v["pallet-width"]) * 100, 1, "%"]];
    }),

  mk("void-fill", [p("Box volume", 0.03, "m³"), p("Contents volume", 0.019, "m³")],
    "Void volume = box − contents", "Void fill requirement",
    (v) => {
      const voidV = v["box-volume"] - v["contents-volume"];
      if (voidV < 0) return err("Contents volume cannot exceed the box volume.");
      return [["Void volume to fill", voidV * 1000, 2, "L", true], ["Void fraction", (voidV / v["box-volume"]) * 100, 1, "%"]];
    }),

  mk("shrink-film", [p("Bundle width", 300, "mm"), p("Bundle height", 200, "mm")],
    "Film width ≈ (W + H) × 2 × (1 + overlap)", "Shrink film width",
    (v) => [["Required film width", (v["bundle-width"] + v["bundle-height"]) * 2, 0, "mm", true],
      ["Film width incl. 10% overlap", (v["bundle-width"] + v["bundle-height"]) * 2.2, 0, "mm"]]),

  mk("label-count", [p("Roll length", 500, "m"), p("Label pitch", 0.08, "m")],
    "Labels = floor(roll length / pitch)", "Labels per roll",
    (v) => [["Labels per roll", Math.floor(v["roll-length"] / v["label-pitch"]), 0, "labels", true]]),

  mk("print-imposition", [p("Sheet size", 720, "mm"), p("Trim size", 210, "mm"), p("Quantity", 5000)],
    "Ups = floor(sheet / trim) per axis; sheets = quantity / ups", "Print imposition",
    (v) => {
      const ups = Math.floor(v["sheet-size"] / v["trim-size"]) ** 2;
      return [["Number up per sheet", ups, 0, "up", true], ["Sheets required", Math.ceil(v.quantity / ups), 0, "sheets"]];
    }),

  mk("paper-ream-weight", [p("GSM", 80, "g/m²"), p("Sheet area", 0.0625, "m²"), it("Sheets", 500, { min: 1 })],
    "Ream mass = GSM × sheet area × sheets", "Paper ream weight",
    (v) => [["Ream weight", (v.gsm * v["sheet-area"] * v.sheets) / 1000, 3, "kg", true]]),

  mk("ink-coverage", [p("Area", 5000, "m²"), p("Coverage", 35, "%", { max: 100 }), p("Ink rate", 1.2, "g/m²")],
    "Ink = area × coverage% × rate", "Ink consumption",
    (v) => [["Ink required", v.area * (v.coverage / 100) * v["ink-rate"], 1, "g", true], ["Ink required", (v.area * (v.coverage / 100) * v["ink-rate"]) / 1000, 3, "kg"]]),

  mk("print-cost-page", [p("Cartridge cost", 62, "$"), p("Page yield", 2600), p("Coverage", 5, "%", { max: 100 })],
    "Cost/page = cartridge cost / (yield × coverage/5%)", "Print cost per page",
    (v) => {
      const adj = v["page-yield"] * (v.coverage / 5);
      return [["Cost per page", v["cartridge-cost"] / adj, 4, "$", true], ["Pages at this coverage", adj, 0, "pages"]];
    }),

  mk("bleed-trim", [p("Trim width", 210, "mm"), p("Trim height", 297, "mm"), p("Bleed", 3, "mm")],
    "Document = trim + 2 × bleed", "Bleed and trim document size",
    (v) => [["Document width", v["trim-width"] + 2 * v.bleed, 1, "mm", true], ["Document height", v["trim-height"] + 2 * v.bleed, 1, "mm"]]),

  mk("booklet-creep", [p("Page count", 64), p("Paper thickness", 0.1, "mm")],
    "Creep per section = (pages/4) × thickness", "Saddle-stitch creep",
    (v) => [["Maximum creep (outermost to innermost)", ((v["page-count"] / 4) * v["paper-thickness"]) / 2, 2, "mm", true],
      ["Total spine thickness", ((v["page-count"] / 2) * v["paper-thickness"]), 2, "mm"]]),

  mk("packaging-cost", [p("Materials", 0.85, "$"), p("Labour", 0.32, "$"), z("Overhead", 15, "%")],
    "Cost = (materials + labour) × (1 + overhead%)", "Packaging unit cost",
    (v) => [["Packaging cost per unit", (v.materials + v.labour) * (1 + v.overhead / 100), 3, "$", true]]),

  mk("cushioning-thickness", [p("Drop height", 0.8, "m"), p("Fragility", 40, "g"), p("Cushion factor", 3.5)],
    "Parametric: t = C × h / (G_allow) using empirical cushion curve factor", "Cushion thickness estimate",
    (v) => {
      const t = (v["cushion-factor"] * v["drop-height"] * 1000) / v.fragility;
      return [["Indicative cushion thickness", t, 1, "mm", true]];
    },
    { limitations: ["Cushion curves are material-specific empirical data supplied by the converter. This is a parametric estimate only."] }),

  // ── C39 Inventory Management (12) ──────────────────────────────────────────
  mk("eoq", [p("Annual demand", 24000, "units"), p("Order cost", 45, "$"), p("Holding cost", 6, "$/unit·yr")],
    "EOQ = √(2DS / H)", "Economic order quantity",
    (v) => {
      const q = Math.sqrt((2 * v["annual-demand"] * v["order-cost"]) / v["holding-cost"]);
      return [["Economic order quantity", q, 0, "units", true], ["Orders per year", v["annual-demand"] / q, 1, "orders"],
        ["Total annual cost", (v["annual-demand"] / q) * v["order-cost"] + (q / 2) * v["holding-cost"], 2, "$"]];
    }),

  mk("reorder-point", [p("Daily demand", 120, "units/day"), p("Lead time", 6, "days"), p("Safety stock", 300, "units")],
    "ROP = demand × lead time + safety stock", "Reorder point",
    (v) => [["Reorder point", v["daily-demand"] * v["lead-time"] + v["safety-stock"], 0, "units", true]]),

  mk("safety-stock", [p("Service level factor", 1.65), p("Demand SD", 40, "units/day"), p("Lead time", 6, "days")],
    "SS = z × σ_d × √LT", "Statistical safety stock",
    (v) => [["Safety stock", v["service-level-factor"] * v["demand-sd"] * Math.sqrt(v["lead-time"]), 0, "units", true]]),

  mk("days-of-inventory", [p("Average inventory", 180000, "$"), p("Annual COGS", 1450000, "$")],
    "DIO = inventory / COGS × 365", "Days inventory outstanding",
    (v) => [["Days of inventory", (v["average-inventory"] / v["annual-cogs"]) * 365, 1, "days", true]]),

  mkx("abc-analysis", [t("Values", "42000, 18000, 9000, 5000, 3000, 1500, 900")],
    "Sort descending; class A ≤ 80% cumulative value, B ≤ 95%, C the remainder", "Item annual values",
    (v) => {
      const vals = parseNumList(String(v.values), 1);
      if (!vals.ok) return vals;
      if (vals.value.some((x) => x < 0)) return err("Item values cannot be negative.");
      const total = vals.value.reduce((a, b) => a + b, 0);
      if (total <= 0) return err("Total item value must be positive.");
      const sorted = [...vals.value].sort((a, b) => b - a);
      let cum = 0, a = 0, b = 0;
      for (const x of sorted) {
        cum += x;
        const share = (cum / total) * 100;
        if (share <= 80) a += 1;
        else if (share <= 95) b += 1;
      }
      return [["Class A items (≤80% of value)", a, 0, "items", true],
        ["Class B items (80–95%)", b, 0, "items"],
        ["Class C items (top 5%)", sorted.length - a - b, 0, "items"],
        ["Total annual value", total, 2, "$"]];
    }),

  mk("stockout-probability", [p("Safety stock", 300, "units"), p("Demand SD", 40, "units/day"), p("Lead time", 6, "days")],
    "z = SS / (σ√LT); P(stockout) = 1 − Φ(z)", "Stockout risk from safety stock",
    (v) => {
      const z = v["safety-stock"] / (v["demand-sd"] * Math.sqrt(v["lead-time"]));
      const cdf = 0.5 * (1 + erf(z / Math.SQRT2));
      return [["Stockout probability per cycle", (1 - cdf) * 100, 3, "%", true], ["Cycle service level", cdf * 100, 3, "%"]];
    }),

  mk("cycle-count-sample", [p("Population", 5000), p("Confidence factor", 1.96), p("Tolerable error", 2, "%")],
    "n = z² p(1 − p) / E² (p = 0.5)", "Cycle-count sample size",
    (v) => {
      const n = (v["confidence-factor"] ** 2 * 0.25) / (v["tolerable-error"] / 100) ** 2;
      return [["Sample size", Math.ceil(Math.min(n, v.population)), 0, "items", true], ["Sampling fraction", (Math.min(n, v.population) / v.population) * 100, 2, "%"]];
    }),

  mk("min-max-levels", [p("Daily demand", 120, "units/day"), p("Lead time", 6, "days"), p("Review period", 7, "days"), z("Safety", 15, "%")],
    "Min = demand × LT; Max = demand × (LT + review) × (1 + safety)", "Min/max replenishment levels",
    (v) => [["Minimum level (reorder point)", v["daily-demand"] * v["lead-time"], 0, "units", true],
      ["Maximum level", v["daily-demand"] * (v["lead-time"] + v["review-period"]) * (1 + v.safety / 100), 0, "units"]]),

  mk("eoq-quantity-discount", [p("Annual demand", 24000), p("Order cost", 45, "$"), p("Base price", 6, "$/unit"), p("Discount price", 5.4, "$/unit"), p("Holding rate", 20, "%"), p("Discount quantity", 2000)],
    "Compares total cost at EOQ versus discount threshold", "Quantity-discount EOQ comparison",
    (v) => {
      const holdRate = v["holding-rate"] / 100;
      const total = (q: number, price: number) => (v["annual-demand"] / q) * v["order-cost"] + (q / 2) * price * holdRate + v["annual-demand"] * price;
      const eoq = Math.sqrt((2 * v["annual-demand"] * v["order-cost"]) / (v["base-price"] * holdRate));
      const c1 = total(eoq, v["base-price"]), c2 = total(Math.max(v["discount-quantity"], eoq), v["discount-price"]);
      return [["Cost at EOQ (base price)", c1, 2, "$", true], ["Cost at discount quantity", c2, 2, "$"],
        ["Cheaper strategy", c2 < c1 ? "Take the discount" : "Order at EOQ"]];
    }),

  mk("carrying-cost", [p("Inventory value", 450000, "$"), p("Carrying rate", 22, "%")],
    "Annual carrying cost = value × rate", "Inventory carrying cost",
    (v) => [["Annual carrying cost", (v["inventory-value"] * v["carrying-rate"]) / 100, 2, "$/yr", true]]),

  mk("dead-stock-value", [p("Quantity", 850), p("Unit cost", 12.4, "$"), p("Write-down", 70, "%")],
    "Write-down = quantity × cost × write-down%", "Obsolete stock write-down",
    (v) => [["Write-down value", (v.quantity * v["unit-cost"] * v["write-down"]) / 100, 2, "$", true],
      ["Remaining book value", (v.quantity * v["unit-cost"] * (100 - v["write-down"])) / 100, 2, "$"]]),

  mk("inventory-valuation", [p("Units", 1200), p("Unit cost", 8.5, "$"), z("Method uplift", 0, "%")],
    "Value = units × unit cost × (1 + method adjustment%)", "Inventory valuation",
    (v) => [["Inventory value", (v.units * v["unit-cost"]) * (1 + v["method-uplift"] / 100), 2, "$", true]]),

  // ── C40 Supply Chain Performance (13) ──────────────────────────────────────
  mk("lead-time", [p("Process time", 3.5, "days"), p("Queue time", 2.0, "days"), p("Transport time", 4.5, "days")],
    "Lead time = process + queue + transport", "Cumulative lead time",
    (v) => [["Total lead time", v["process-time"] + v["queue-time"] + v["transport-time"], 1, "days", true]]),

  mk("fill-rate", [p("Shipped units", 9400), p("Ordered units", 10000)],
    "Fill rate = shipped / ordered × 100", "Unit fill rate",
    (v) => [["Fill rate", (v["shipped-units"] / v["ordered-units"]) * 100, 2, "%", true], ["Shortfall", v["ordered-units"] - v["shipped-units"], 0, "units"]]),

  mk("perfect-order-rate", [p("Total orders", 5000), p("Orders with defects", 260)],
    "Perfect order rate = (total − defective) / total × 100", "Perfect order rate",
    (v) => [["Perfect order rate", ((v["total-orders"] - v["orders-with-defects"]) / v["total-orders"]) * 100, 2, "%", true]]),

  mk("otif", [p("Orders delivered", 4800), p("On-time orders", 4500), p("In-full orders", 4600), p("On-time and in-full", 4350)],
    "OTIF = on-time AND in-full / total × 100", "On-time in-full",
    (v) => [["OTIF", (v["on-time-and-in-full"] / v["orders-delivered"]) * 100, 2, "%", true],
      ["On-time rate", (v["on-time-orders"] / v["orders-delivered"]) * 100, 2, "%"],
      ["In-full rate", (v["in-full-orders"] / v["orders-delivered"]) * 100, 2, "%"]]),

  mk("supplier-scorecard", [p("Quality score", 92), p("Quality weight", 40, "%"), p("Delivery score", 85), p("Delivery weight", 35, "%"), p("Cost score", 78), p("Cost weight", 25, "%")],
    "Weighted score = Σ(score × weight) / Σweights", "Weighted supplier scorecard",
    (v) => {
      const wSum = v["quality-weight"] + v["delivery-weight"] + v["cost-weight"];
      const score = (v["quality-score"] * v["quality-weight"] + v["delivery-score"] * v["delivery-weight"] + v["cost-score"] * v["cost-weight"]) / wSum;
      return [["Weighted supplier score", score, 2, "points", true], ["Total weight", wSum, 0, "%"]];
    }),

  mk("total-cost-of-ownership", [p("Purchase price", 48000, "$"), p("Annual logistics", 6200, "$"), p("Annual quality cost", 3400, "$"), p("Lifetime", 5, "years")],
    "TCO = price + (logistics + quality) × life", "Total cost of ownership",
    (v) => {
      const tco = v["purchase-price"] + (v["annual-logistics"] + v["annual-quality-cost"]) * v["lifetime"];
      return [["Total cost of ownership", tco, 2, "$", true], ["Annualised cost", tco / v.lifetime, 2, "$/yr"]];
    }),

  mk("logistics-cost-unit", [p("Logistics cost", 180000, "$"), p("Units shipped", 24000)],
    "Cost per unit = cost / units", "Logistics cost per unit",
    (v) => [["Logistics cost per unit", v["logistics-cost"] / v["units-shipped"], 3, "$/unit", true]]),

  mk("warehouse-capacity", [p("Floor area", 5000, "m²"), p("Rack density", 2.5, "pallets/m²"), p("Aisle factor", 0.65)],
    "Positions = area × density × aisle factor", "Pallet position estimate",
    (v) => [["Pallet positions", Math.floor(v["floor-area"] * v["rack-density"] * v["aisle-factor"]), 0, "positions", true]]),

  mk("freight-cost-allocation", [p("Total freight cost", 4200, "$"), p("Shipment A weight", 1800, "kg"), p("Shipment B weight", 3200, "kg")],
    "Allocation by weight share", "Freight cost allocation",
    (v) => {
      const tot = v["shipment-a-weight"] + v["shipment-b-weight"];
      return [["Allocated to shipment A", (v["total-freight-cost"] * v["shipment-a-weight"]) / tot, 2, "$", true],
        ["Allocated to shipment B", (v["total-freight-cost"] * v["shipment-b-weight"]) / tot, 2, "$"]];
    }),

  mk("forecast-error", [p("Actual", 1040), p("Forecast", 980), p("Absolute error", 60)],
    "MAE = mean|e|; MAPE = mean(|e| / actual) × 100", "Forecast accuracy metrics",
    (v) => [["Absolute percentage error", (v["absolute-error"] / v.actual) * 100, 2, "%", true],
      ["Bias", v.actual - v.forecast, 1, "units"], ["Absolute error", Math.abs(v.actual - v.forecast), 1, "units"]]),

  mk("safety-lead-time", [p("Lead-time SD", 1.8, "days"), p("Daily demand", 120, "units/day"), p("Service factor", 1.65)],
    "SS = z × demand × σ_LT", "Safety stock from lead-time variability",
    (v) => [["Safety stock", v["service-factor"] * v["daily-demand"] * v["lead-time-sd"], 0, "units", true]]),

  mk("reverse-logistics-cost", [p("Returns", 380), p("Handling cost", 12.4, "$/unit"), p("Resale recovery", 0.35)],
    "Net cost = returns × handling × (1 − recovery)", "Reverse logistics cost",
    (v) => {
      const gross = v.returns * v["handling-cost"];
      return [["Net reverse-logistics cost", gross * (1 - v["resale-recovery"]), 2, "$", true], ["Gross handling cost", gross, 2, "$"]];
    }),

  mk("shelf-life", [p("Production date day", 1), p("Shelf life", 180, "days")],
    "Expiry day-of-year = production + shelf life", "Shelf-life expiry",
    (v) => [["Expiry day of year", v["production-date-day"] + v["shelf-life"], 0, "day", true],
      ["Remaining shelf life", v["shelf-life"], 0, "days"]]),

  // ── C41 Freight and Shipping (16) ──────────────────────────────────────────
  mk("dimensional-weight", [p("Length", 60, "cm"), p("Width", 40, "cm"), p("Height", 30, "cm"), p("Divisor", 5000)],
    "Volumetric weight = L × W × H / divisor", "Dimensional weight",
    (v) => {
      const dim = (v.length * v.width * v.height) / v.divisor;
      return [["Volumetric weight", dim, 2, "kg", true], ["Volume", (v.length * v.width * v.height) / 1e6, 3, "m³"]];
    }),

  mk("chargeable-weight-air", [p("Actual gross weight", 22, "kg"), p("Length", 60, "cm"), p("Width", 45, "cm"), p("Height", 35, "cm"), p("Divisor", 6000)],
    "Chargeable = max(gross, volumetric)", "Air freight chargeable weight",
    (v) => {
      const vol = (v.length * v.width * v.height) / v.divisor;
      return [["Chargeable weight", Math.max(v["actual-gross-weight"], vol), 2, "kg", true],
        ["Volumetric weight", vol, 2, "kg"],
        ["Basis", vol > v["actual-gross-weight"] ? "Volumetric" : "Actual gross"]];
    }),

  mk("container-capacity", [p("Internal volume", 33.2, "m³"), p("Payload", 28000, "kg"), p("Cargo density", 320, "kg/m³")],
    "Limited by volume or payload, whichever binds first", "Container fill limit",
    (v) => {
      const volMass = v["internal-volume"] * v["cargo-density"];
      return [["Binding limit", volMass < v.payload ? "Volume-limited" : "Payload-limited", undefined, true],
        ["Mass at full volume", volMass, 0, "kg"], ["Payload utilisation", Math.min(100, (volMass / v.payload) * 100), 1, "%"]];
    }),

  mk("container-fill-rate", [p("Cargo volume", 26.5, "m³"), p("Container volume", 33.2, "m³")],
    "Fill% = cargo / container × 100", "Container fill rate",
    (v) => [["Volume fill rate", (v["cargo-volume"] / v["container-volume"]) * 100, 2, "%", true], ["Empty volume", v["container-volume"] - v["cargo-volume"], 2, "m³"]]),

  mk("pallet-loading", [p("Pallet length", 1200, "mm"), p("Pallet width", 1000, "mm"), p("Carton length", 400, "mm"), p("Carton width", 300, "mm"), it("Layers", 5, { min: 1 })],
    "Cartons = per-layer × layers", "Pallet carton loading",
    (v) => {
      const per = Math.max(Math.floor(v["pallet-length"] / v["carton-length"]) * Math.floor(v["pallet-width"] / v["carton-width"]),
        Math.floor(v["pallet-length"] / v["carton-width"]) * Math.floor(v["pallet-width"] / v["carton-length"]));
      return [["Cartons per layer", per, 0, "cartons", true], ["Cartons per pallet", per * v.layers, 0, "cartons"]];
    }),

  mk("pallet-count", [p("Units", 4800), p("Units per pallet", 120)],
    "Pallets = ceil(units / per pallet)", "Pallet count",
    (v) => [["Pallets required", Math.ceil(v.units / v["units-per-pallet"]), 0, "pallets", true]]),

  mk("lcl-freight-cost", [p("Chargeable volume", 8.5, "m³"), p("Rate per W/M", 62, "$/W/M"), p("Minimum charge", 180, "$")],
    "Cost = max(minimum, volume × rate)", "LCL freight cost",
    (v) => [["Freight cost", Math.max(v["minimum-charge"], v["chargeable-volume"] * v["rate-per-w-m"]), 2, "$", true]]),

  mk("shipping-cost-unit", [p("Freight cost", 2600, "$"), p("Units", 1400)],
    "Cost per unit = freight / units", "Shipping cost per unit",
    (v) => [["Shipping cost per unit", v["freight-cost"] / v.units, 3, "$/unit", true]]),

  mk("freight-density", [p("Weight", 8400, "kg"), p("Volume", 28, "m³")],
    "Density = weight / volume", "Cargo density",
    (v) => [["Freight density", v.weight / v.volume, 1, "kg/m³", true], ["Density", (v.weight / v.volume) / 16.01846337, 2, "lb/ft³"]]),

  mk("truck-load-plan", [p("Pallets", 26), p("Truck capacity", 33, "pallets")],
    "Utilisation = pallets / capacity × 100", "Truck load utilisation",
    (v) => [["Trailer utilisation", (v.pallets / v["truck-capacity"]) * 100, 2, "%", true], ["Spare positions", v["truck-capacity"] - v.pallets, 0, "pallets"]]),

  mk("demurrage-cost", [p("Free days", 5), p("Days held", 9), p("Daily rate", 85, "$/day")],
    "Demurrage = max(0, days held − free days) × rate", "Demurrage/detention cost",
    (v) => [["Demurrage cost", Math.max(0, v["days-held"] - v["free-days"]) * v["daily-rate"], 2, "$", true],
      ["Chargeable days", Math.max(0, v["days-held"] - v["free-days"]), 0, "days"]]),

  mk("last-mile-cost", [p("Total cost", 14500, "$"), p("Stops", 1200)],
    "Cost per stop = cost / stops", "Last-mile cost per delivery",
    (v) => [["Cost per delivery", v["total-cost"] / v.stops, 2, "$", true]]),

  mk("returns-shipping-cost", [p("Returns", 380), p("Cost per return", 9.75, "$")],
    "Cost = returns × per-return cost", "Returns shipping cost",
    (v) => [["Total returns shipping cost", v.returns * v["cost-per-return"], 2, "$", true]]),

  mk("export-packing-cost", [p("Materials", 6.4, "$/unit"), p("Labour", 2.8, "$/unit"), it("Units", 500, { min: 1 })],
    "Cost = (materials + labour) × units", "Export packing cost",
    (v) => [["Total packing cost", (v.materials + v.labour) * v.units, 2, "$", true]]),

  mk("cargo-insurance", [p("Cargo value", 85000, "$"), p("Rate", 0.4, "%"), p("Route factor", 1.15)],
    "Premium = value × rate × route factor", "Cargo insurance premium",
    (v) => [["Premium", (v["cargo-value"] * v.rate * v["route-factor"]) / 100, 2, "$", true]]),

  mk("teu-conversion", [p("40 ft containers", 12), p("20 ft containers", 8)],
    "TEU = 2 × 40 ft + 1 × 20 ft; FEU = TEU / 2", "Container TEU/FEU conversion",
    (v) => {
      const teu = v["40-ft-containers"] * 2 + v["20-ft-containers"];
      return [["TEU", teu, 0, "TEU", true], ["FEU equivalent", teu / 2, 0, "FEU"]];
    }),

  // ── C42 Automotive (16) ────────────────────────────────────────────────────
  mk("fuel-cost-trip", [p("Distance", 420, "km"), p("Consumption", 7.2, "L/100km"), p("Fuel price", 1.85, "$/L")],
    "Cost = distance × consumption / 100 × price", "Trip fuel cost",
    (v) => {
      const litres = (v.distance * v.consumption) / 100;
      return [["Fuel cost", litres * v["fuel-price"], 2, "$", true], ["Fuel used", litres, 2, "L"]];
    }),

  mk("mpg-l100km", [p("MPG", 32, "mpg (US)")],
    "L/100km = 235.214583 / MPG", "Fuel consumption unit conversion",
    (v) => [["Litres per 100 km", 235.2145833 / v.mpg, 2, "L/100km", true], ["MPG (UK)", v.mpg * 1.20095, 1, "mpg"]]),

  mk("ev-efficiency", [p("Battery energy", 60, "kWh"), p("Distance", 380, "km")],
    "Consumption = kWh / distance × 100", "EV efficiency",
    (v) => [["Consumption", (v["battery-energy"] / v.distance) * 100, 2, "kWh/100km", true],
      ["Consumption", (v["battery-energy"] * 1000) / v.distance, 1, "Wh/km"]]),

  mk("ev-charging-cost", [p("Energy delivered", 55, "kWh"), p("Tariff", 0.28, "$/kWh"), p("Charging losses", 10, "%")],
    "Cost = energy / (1 − losses) × tariff", "EV charging cost",
    (v) => {
      const drawn = v["energy-delivered"] / (1 - v["charging-losses"] / 100);
      return [["Charging cost", drawn * v.tariff, 2, "$", true], ["Energy drawn from grid", drawn, 2, "kWh"]];
    }),

  mk("ev-range", [p("Usable battery", 64, "kWh"), p("Consumption", 16.5, "kWh/100km")],
    "Range = battery / consumption × 100", "EV range estimate",
    (v) => [["Estimated range", (v["usable-battery"] / v.consumption) * 100, 0, "km", true],
      ["Range", ((v["usable-battery"] / v.consumption) * 100) / 1.609344, 0, "mi"]]),

  mk("tire-size-conversion", [p("Width", 225, "mm"), p("Aspect ratio", 45, "%"), p("Rim diameter", 18, "in")],
    "Sidewall = width × aspect%; diameter = rim + 2 × sidewall", "Tyre dimension calculation",
    (v) => {
      const side = (v.width * v["aspect-ratio"]) / 100;
      const dia = v["rim-diameter"] * 25.4 + 2 * side;
      return [["Overall diameter", dia, 1, "mm", true], ["Sidewall height", side, 1, "mm"],
        ["Circumference", (Math.PI * dia) / 1000, 3, "m"]];
    }),

  mk("wheel-offset", [p("Wheel width", 8.0, "in"), p("Offset", 35, "mm")],
    "Backspace = width × 25.4 / 2 + offset", "Wheel backspace",
    (v) => [["Backspace", (v["wheel-width"] * 25.4) / 2 + v.offset, 1, "mm", true], ["Front space", (v["wheel-width"] * 25.4) / 2 - v.offset, 1, "mm"]]),

  mk("speed-gear-ratio", [p("Engine speed", 3000, "rpm"), p("Gear ratio", 3.5), p("Final drive", 3.9), p("Tire circumference", 2.1, "m")],
    "Speed (km/h) = rpm × circumference × 60 / (gear × final × 1000)", "Road speed from gearing",
    (v) => [["Road speed", (v["engine-speed"] * v["tire-circumference"] * 60) / (v["gear-ratio"] * v["final-drive"] * 1000), 1, "km/h", true]]),

  mk("engine-displacement", [p("Bore", 86, "mm"), p("Stroke", 86, "mm"), it("Cylinders", 4, { min: 1, max: 16 })],
    "V = π/4 × bore² × stroke × cylinders", "Engine swept volume",
    (v) => {
      const cc = ((Math.PI / 4) * v.bore ** 2 * v.stroke * v.cylinders) / 1000;
      return [["Displacement", cc, 0, "cc", true], ["Displacement", cc / 1000, 2, "L"]];
    }),

  mk("engine-compression-ratio", [p("Swept volume", 500, "cc"), p("Clearance volume", 55, "cc")],
    "CR = (swept + clearance) / clearance", "Compression ratio",
    (v) => [["Compression ratio", (v["swept-volume"] + v["clearance-volume"]) / v["clearance-volume"], 2, ": 1", true]]),

  mk("hp-torque-conversion", [p("Torque", 350, "N·m"), p("Speed", 4000, "rpm")],
    "P(kW) = τ × 2πN / 60000; P(hp) = kW / 0.7457", "Power and torque conversion",
    (v) => {
      const kw = (v.torque * 2 * Math.PI * v.speed) / 60000;
      return [["Power", kw, 2, "kW", true], ["Power", kw / 0.7456998716, 2, "hp"]];
    }),

  mk("vehicle-depreciation", [p("Purchase price", 32000, "$"), p("Annual rate", 15, "%", { max: 100 }), it("Years", 5, { min: 1, max: 30 })],
    "Value = price × (1 − rate)^years", "Straight-line-percentage depreciation",
    (v) => {
      const val = v["purchase-price"] * Math.pow(1 - v["annual-rate"] / 100, v.years);
      return [["Residual value", val, 2, "$", true], ["Total depreciation", v["purchase-price"] - val, 2, "$"]];
    }),

  mk("cost-per-mile", [p("Annual cost", 9800, "$"), p("Annual distance", 18000, "mi")],
    "Cost per mile = annual cost / distance", "Running cost per mile",
    (v) => [["Cost per mile", v["annual-cost"] / v["annual-distance"], 3, "$/mi", true],
      ["Cost per km", v["annual-cost"] / (v["annual-distance"] * 1.609344), 3, "$/km"]]),

  mk("idling-fuel", [p("Idle hours", 120, "h"), p("Burn rate", 1.2, "L/h"), p("Fuel price", 1.85, "$/L")],
    "Fuel = hours × rate; cost = fuel × price", "Idling fuel waste",
    (v) => {
      const l = v["idle-hours"] * v["burn-rate"];
      return [["Fuel wasted", l, 1, "L", true], ["Cost", l * v["fuel-price"], 2, "$"]];
    }),

  mk("payload-capacity", [p("GVWR", 3500, "kg"), p("Curb weight", 2100, "kg"), p("Occupants", 2), p("Occupant mass", 80, "kg")],
    "Payload = GVWR − curb − occupants × mass", "Vehicle payload",
    (v) => [["Available payload", Math.max(0, v.gvwr - v["curb-weight"] - v.occupants * v["occupant-mass"]), 0, "kg", true]]),

  mk("towing-load", [p("Trailer mass", 1400, "kg"), p("Cargo", 600, "kg"), p("Rated towing", 2500, "kg")],
    "Total = trailer + cargo; margin vs rating", "Towing capacity margin",
    (v) => {
      const tot = v["trailer-mass"] + v.cargo;
      return [["Total towed mass", tot, 0, "kg", true], ["Remaining margin", v["rated-towing"] - tot, 0, "kg"],
        ["Status", tot <= v["rated-towing"] ? "Within rating" : "Exceeds rating"]];
    }),

  // ── C43 Aviation Calculations (13) ─────────────────────────────────────────
  mk("density-altitude", [p("Field elevation", 1500, "ft"), p("Altimeter setting", 29.82, "inHg"), p("Temperature", 30, "°C")],
    "DA ≈ PA + 120 × (OAT − ISA temp at PA)", "Density altitude estimate",
    (v) => {
      const pa = v["field-elevation"] + (29.92 - v["altimeter-setting"]) * 1000;
      const isa = 15 - 1.98 * (pa / 1000);
      return [["Pressure altitude", pa, 0, "ft", true], ["ISA temperature at PA", isa, 1, "°C"],
        ["Density altitude", pa + 120 * (v.temperature - isa), 0, "ft"]];
    }),

  mk("pressure-altitude", [p("Field elevation", 1200, "ft"), p("Altimeter setting", 30.12, "inHg")],
    "PA = elevation + (29.92 − QNH) × 1000", "Pressure altitude",
    (v) => [["Pressure altitude", v["field-elevation"] + (29.92 - v["altimeter-setting"]) * 1000, 0, "ft", true]]),

  mk("true-airspeed", [p("Indicated airspeed", 120, "kt"), p("Pressure altitude", 8000, "ft"), p("Temperature", 5, "°C")],
    "TAS ≈ IAS × (1 + 0.02 × altitude/1000 ft), temperature corrected", "True airspeed estimate",
    (v) => [["Approximate true airspeed", v["indicated-airspeed"] * (1 + 0.02 * (v["pressure-altitude"] / 1000)) * (1 + (v.temperature - 15) * 0.0018), 0, "kt", true]]),

  mk("mach-number", [p("True airspeed", 480, "kt"), n("Temperature", -45, "°C")],
    "M = TAS / (39.0 × √T_K)", "Mach number from TAS and temperature",
    (v) => {
      const a = 39.0 * Math.sqrt(v.temperature + 273.15);
      return [["Speed of sound", a, 0, "kt", true], ["Mach number", v["true-airspeed"] / a, 3, undefined]];
    }),

  mk("wind-triangle", [p("True course", 90, "°"), p("True airspeed", 130, "kt"), p("Wind direction", 45, "°"), p("Wind speed", 25, "kt")],
    "Vector sum of air vector and wind vector", "Wind triangle solution",
    (v) => {
      const cr = (v["true-course"] * Math.PI) / 180, wd = (v["wind-direction"] * Math.PI) / 180;
      const wx = v["wind-speed"] * Math.sin(wd), wy = v["wind-speed"] * Math.cos(wd);
      const ax = v["true-airspeed"] * Math.sin(cr), ay = v["true-airspeed"] * Math.cos(cr);
      const gx = ax + wx, gy = ay + wy;
      const gs = Math.hypot(gx, gy);
      const trk = ((Math.atan2(gx, gy) * 180) / Math.PI + 360) % 360;
      return [["Ground speed", gs, 0, "kt", true], ["Track", trk, 0, "°"], ["Drift / crab angle", trk - v["true-course"], 0, "°"]];
    }),

  mk("fuel-endurance", [p("Fuel on board", 240, "L"), p("Burn rate", 32, "L/h"), p("Ground speed", 135, "kt")],
    "Endurance = fuel / burn; range = endurance × GS", "Fuel endurance and range",
    (v) => {
      const e = v["fuel-on-board"] / v["burn-rate"];
      return [["Endurance", e, 2, "h", true], ["Still-air range", e * v["ground-speed"], 0, "nm"],
        ["Endurance reserve at 30 min", Math.max(0, e - 0.5), 2, "h"]];
    }),

  mk("crosswind-component", [p("Wind speed", 22, "kt"), p("Wind angle", 40, "°"), p("Runway heading", 90, "°")],
    "Crosswind = V × sin(angle); headwind = V × cos(angle)", "Runway wind components",
    (v) => {
      const rad = (v["wind-angle"] * Math.PI) / 180;
      return [["Crosswind component", Math.abs(v["wind-speed"] * Math.sin(rad)), 1, "kt", true],
        ["Headwind component", v["wind-speed"] * Math.cos(rad), 1, "kt"]];
    }),

  mk("weight-balance-cg", [p("Empty weight", 900, "lb"), p("Empty arm", 38, "in"), p("Fuel weight", 300, "lb"), p("Fuel arm", 48, "in"), p("Payload weight", 400, "lb"), p("Payload arm", 55, "in")],
    "CG = Σ(weight × arm) / Σweight", "Centre of gravity",
    (v) => {
      const w = v["empty-weight"] + v["fuel-weight"] + v["payload-weight"];
      const m = v["empty-weight"] * v["empty-arm"] + v["fuel-weight"] * v["fuel-arm"] + v["payload-weight"] * v["payload-arm"];
      return [["Total weight", w, 0, "lb", true], ["Centre of gravity", m / w, 2, "in aft of datum"]];
    }),

  mk("climb-gradient", [p("Altitude gain", 1200, "ft"), p("Horizontal distance", 3.5, "nm")],
    "Gradient% = gain / (distance × 6076.12) × 100", "Climb gradient",
    (v) => [["Climb gradient", (v["altitude-gain"] / (v["horizontal-distance"] * 6076.12)) * 100, 2, "%", true],
      ["Climb angle", (Math.atan2(v["altitude-gain"], v["horizontal-distance"] * 6076.12) * 180) / Math.PI, 2, "°"]]),

  mk("descent-rate", [p("Altitude to lose", 6000, "ft"), p("Ground speed", 120, "kt"), p("Descent angle", 3, "°")],
    "Required rate = GS × tan(angle) × 6076.12 / 60", "Descent rate",
    (v) => {
      const fpm = (v["ground-speed"] * Math.tan((v["descent-angle"] * Math.PI) / 180) * 6076.12) / 60;
      return [["Required descent rate", fpm, 0, "ft/min", true], ["Distance to descend", v["altitude-to-lose"] / Math.tan((v["descent-angle"] * Math.PI) / 180) / 6076.12, 1, "nm"]];
    }),

  mk("flight-time", [p("Distance", 420, "nm"), p("Ground speed", 135, "kt"), z("Reserve", 30, "min")],
    "Time = distance / GS + reserve", "Flight time",
    (v) => {
      const t = v.distance / v["ground-speed"] * 60;
      return [["En-route time", t, 0, "min", true], ["Total with reserve", t + v.reserve, 0, "min"], ["Total", (t + v.reserve) / 60, 2, "h"]];
    }),

  mk("takeoff-distance", [p("Sea-level distance", 1500, "ft"), p("Density altitude", 4000, "ft"), p("Headwind", 10, "kt"), p("Weight", 2800, "lb"), p("Max weight", 3100, "lb")],
    "Parametric: distance increases ~10% per 1000 ft DA, ~10% per 100 lb, decreases 10% per 9 kt headwind", "Parametric takeoff distance",
    (v) => {
      let d = v["sea-level-distance"] * Math.pow(1.1, v["density-altitude"] / 1000);
      d *= 1 + 0.1 * ((v.weight - v["max-weight"]) / 100);
      d *= Math.max(0.4, 1 - 0.1 * (v.headwind / 9));
      return [["Estimated takeoff distance", Math.round(d), 0, "ft", true]];
    },
    { limitations: ["Aircraft flight manuals (AFM/POH) are the only authoritative source for takeoff performance. This parametric approximation must never be used for flight planning — specialist/operational review required."] }),

  mk("qnh-qfe", [p("Station pressure", 1013, "hPa"), p("Field elevation", 350, "ft")],
    "QNH ≈ QFE × (1 + elevation/ (44330))^5.255 reduced to sea level", "Altimeter setting relationship",
    (v) => {
      const qnh = v["station-pressure"] * Math.pow(1 + (v["field-elevation"] * 0.3048) / 44330, 5.2559);
      return [["Approximate QNH", qnh, 1, "hPa", true], ["Approximate QNH", qnh * 0.0295299830714, 2, "inHg"]];
    }),

  // ── C44 Marine and Maritime (13) ───────────────────────────────────────────
  mk("displacement", [p("Length", 180, "m"), p("Beam", 28, "m"), p("Draft", 9.5, "m"), p("Block coefficient", 0.72), p("Water density", 1025, "kg/m³")],
    "Δ = L × B × T × C_b × ρ", "Ship displacement from hull form",
    (v) => {
      const vol = v.length * v.beam * v.draft * v["block-coefficient"];
      const mass = vol * v["water-density"];
      return [["Displacement mass", mass / 1000, 0, "t", true], ["Displacement volume", vol, 0, "m³"]];
    }),

  mk("deadweight-tonnage", [p("Loaded displacement", 52000, "t"), p("Light displacement", 12500, "t")],
    "DWT = loaded − light displacement", "Deadweight tonnage",
    (v) => [["Deadweight tonnage", v["loaded-displacement"] - v["light-displacement"], 0, "t", true]]),

  mk("hull-speed", [p("Waterline length", 32, "m")],
    "v = 1.34 × √L (knots, L in feet); 2.44 × √L (m/s)", "Hull speed",
    (v) => {
      const ft = v["waterline-length"] * 3.28084;
      return [["Hull speed", 1.34 * Math.sqrt(ft), 2, "kt", true], ["Hull speed", 1.34 * Math.sqrt(ft) * 0.514444, 2, "m/s"]];
    }),

  mk("propeller-slip", [p("Pitch", 1.2, "m"), p("Shaft speed", 120, "rpm"), p("Vessel speed", 2.4, "m/s")],
    "Theoretical speed = pitch × rpm / 60; slip% = (theoretical − actual) / theoretical × 100", "Propeller slip",
    (v) => {
      const theo = (v.pitch * v["shaft-speed"]) / 60;
      if (theo <= 0) return err("Theoretical advance must be positive.");
      return [["Theoretical speed", theo, 3, "m/s", true], ["Slip", ((theo - v["vessel-speed"]) / theo) * 100, 2, "%"],
        ["Vessel speed", v["vessel-speed"], 2, "m/s"]];
    }),

  mk("marine-fuel-consumption", [p("Engine power", 8500, "kW"), p("Specific consumption", 175, "g/kWh"), p("Hours", 24, "h"), p("Fuel density", 0.85, "kg/L")],
    "Fuel = power × SFOC × hours / density", "Marine fuel consumption",
    (v) => {
      const kg = v["engine-power"] * v["specific-consumption"] * v.hours / 1000;
      return [["Fuel consumed", kg / v["fuel-density"], 0, "L", true], ["Fuel mass", kg / 1000, 2, "t"]];
    }),

  mk("gm-stability", [p("KM", 9.8, "m"), p("KG", 8.9, "m"), p("Free surface correction", 0.15, "m")],
    "GM = KM − KG − FSC", "Metacentric height",
    (v) => [["Effective GM", v.km - v.kg - v["free-surface-correction"], 3, "m", true],
      ["Stability", v.km - v.kg - v["free-surface-correction"] > 0 ? "Positive (stable)" : "Negative (unstable)"]],
    { limitations: ["A single GM value does not establish seaworthiness. Intact/damage stability requires a full hydrostatic and loading analysis under the applicable IMO/flag-state code."] }),

  mk("anchor-scope", [p("Water depth", 12, "m"), p("Scope ratio", 5)],
    "Rode length = depth × scope", "Anchor rode length",
    (v) => [["Rode to deploy", v["water-depth"] * v["scope-ratio"], 1, "m", true]]),

  mk("draft-change-cargo", [p("Cargo mass", 900, "t"), p("Tonnes per cm immersion", 18.5, "t/cm")],
    "Draft change = cargo / TPC", "Draft change from cargo",
    (v) => [["Draft change", v["cargo-mass"] / v["tonnes-per-cm-immersion"], 2, "cm", true]]),

  mk("bilge-pump-time", [p("Flood volume", 45, "m³"), p("Pump rate", 60, "m³/h")],
    "Time = volume / pump rate", "Bilge pump run time",
    (v) => [["Pumping time", v["flood-volume"] / v["pump-rate"], 2, "h", true], ["Pumping time", (v["flood-volume"] / v["pump-rate"]) * 60, 0, "min"]]),

  mk("tide-window", [p("Required depth", 3.5, "m"), p("Current depth", 2.8, "m"), p("Tide rate", 0.25, "m/h")],
    "Time = depth shortfall / tide rate", "Tidal window estimate",
    (v) => {
      const short = v["required-depth"] - v["current-depth"];
      if (short <= 0) return [["Window status", "Already afloat under current depth", undefined, true]];
      return [["Time until sufficient depth", short / v["tide-rate"], 1, "h", true]];
    }),

  mk("maritime-distance-time", [p("Distance", 320, "nm"), p("Speed", 14, "kt")],
    "Time = distance / speed", "Passage time",
    (v) => [["Passage time", v.distance / v.speed, 2, "h", true], ["Arrival delay in days", v.distance / v.speed / 24, 2, "days"]]),

  mkx("ballast-water", [t("Tank capacities", "2500, 1800, 3200, 900"), p("Fill fraction", 65, "%", { max: 100 })],
    "Ballast volume = Σ tank capacities × fill fraction", "Tank capacity list and fill level",
    (v) => {
      const caps = parseNumList(String(v["tank-capacities"]), 1);
      if (!caps.ok) return caps;
      if (caps.value.some((x) => x < 0)) return err("Tank capacities cannot be negative.");
      const total = caps.value.reduce((a, b) => a + b, 0);
      return [["Total ballast volume", total * (v["fill-fraction"] / 100), 1, "m³", true],
        ["Total tank capacity", total, 1, "m³"],
        ["Number of tanks", caps.value.length, 0, "tanks"]];
    }),

  mk("vessel-utilisation", [p("Slots used", 16200, "TEU"), p("Slots available", 18000, "TEU")],
    "Utilisation% = used / available × 100", "Vessel slot utilisation",
    (v) => [["Slot utilisation", (v["slots-used"] / v["slots-available"]) * 100, 2, "%", true]]),

  // ── C45 Physics (20) ───────────────────────────────────────────────────────
  mk("projectile-motion", [p("Launch speed", 25, "m/s"), p("Launch angle", 40, "°"), p("Launch height", 1.5, "m")],
    "Range/apex/time for ideal projectile (no air resistance)", "v₀, θ, h₀",
    (v) => {
      const rad = (v["launch-angle"] * Math.PI) / 180;
      const vx = v["launch-speed"] * Math.cos(rad), vy = v["launch-speed"] * Math.sin(rad);
      const t = (vy + Math.sqrt(vy * vy + 2 * G * v["launch-height"])) / G;
      return [["Time of flight", t, 3, "s", true], ["Horizontal range", vx * t, 2, "m"],
        ["Apex height", v["launch-height"] + (vy * vy) / (2 * G), 2, "m"]];
    }),

  mk("momentum-impulse", [p("Mass", 1200, "kg"), p("Velocity change", 14, "m/s"), p("Time", 3.5, "s")],
    "p = m Δv; J = p; F = p / t", "Momentum and impulse",
    (v) => {
      const p0 = v.mass * v["velocity-change"];
      return [["Momentum change", p0, 0, "kg·m/s", true], ["Average force", p0 / v.time, 0, "N"]];
    }),

  mk("kinetic-energy", [p("Mass", 1500, "kg"), p("Velocity", 22, "m/s")],
    "KE = ½mv²", "Kinetic energy",
    (v) => [["Kinetic energy", 0.5 * v.mass * v.velocity ** 2 / 1000, 1, "kJ", true],
      ["Kinetic energy", (0.5 * v.mass * v.velocity ** 2) / 3.6e6, 3, "kWh"]]),

  mk("potential-energy", [p("Mass", 75, "kg"), p("Height", 12, "m")],
    "PE = mgh", "Gravitational potential energy",
    (v) => [["Potential energy", v.mass * G * v.height, 1, "J", true], ["Potential energy", (v.mass * G * v.height) / 1000, 3, "kJ"]]),

  mk("work-energy", [p("Force", 250, "N"), p("Distance", 12, "m"), p("Time", 6, "s")],
    "W = F·d; P = W/t", "Work and power",
    (v) => {
      const w = v.force * v.distance;
      return [["Work done", w, 1, "J", true], ["Power", w / v.time, 1, "W"], ["Power", w / v.time / 745.6998716, 3, "hp"]];
    }),

  mk("circular-motion", [p("Velocity", 12, "m/s"), p("Radius", 40, "m"), p("Mass", 800, "kg")],
    "a_c = v²/r; F_c = m a_c", "Uniform circular motion",
    (v) => [["Centripetal acceleration", v.velocity ** 2 / v.radius, 3, "m/s²", true],
      ["Centripetal force", (v.mass * v.velocity ** 2) / v.radius, 1, "N"]]),

  mk("gravitation", [p("Mass 1", 5.972e24, "kg"), p("Mass 2", 70, "kg"), p("Distance", 6.371e6, "m")],
    "F = G m₁m₂ / r²; g = G M / r²", "Newtonian gravitation",
    (v) => {
      const bigG = 6.6743e-11;
      return [["Gravitational force", (bigG * v["mass-1"] * v["mass-2"]) / v.distance ** 2, 1, "N", true],
        ["Field strength g", (bigG * v["mass-1"]) / v.distance ** 2, 3, "m/s²"]];
    }),

  mk("shm-spring", [p("Stiffness", 250, "N/m"), p("Mass", 1.5, "kg"), p("Amplitude", 0.08, "m")],
    "T = 2π√(m/k); v_max = A√(k/m)", "Simple harmonic motion",
    (v) => {
      const w = Math.sqrt(v.stiffness / v.mass);
      return [["Period", (2 * Math.PI) / w, 3, "s", true], ["Frequency", w / (2 * Math.PI), 3, "Hz"],
        ["Maximum velocity", v.amplitude * w, 3, "m/s"], ["Maximum acceleration", v.amplitude * w * w, 3, "m/s²"]];
    }),

  mk("pendulum-period", [p("Length", 1.2, "m"), p("Gravity", G, "m/s²")],
    "T = 2π√(L/g) (small-angle)", "Simple pendulum",
    (v) => [["Period", 2 * Math.PI * Math.sqrt(v.length / v.gravity), 4, "s", true],
      ["Frequency", 1 / (2 * Math.PI * Math.sqrt(v.length / v.gravity)), 3, "Hz"]]),

  mk("wave-speed", [p("Frequency", 440, "Hz"), p("Wavelength", 0.78, "m")],
    "v = f · λ", "Wave speed",
    (v) => [["Wave speed", v.frequency * v.wavelength, 2, "m/s", true], ["Period", 1 / v.frequency, 4, "s"]]),

  mk("doppler-effect", [p("Source frequency", 500, "Hz"), p("Source speed", 25, "m/s"), z("Observer speed", 0, "m/s"), p("Sound speed", 343, "m/s")],
    "f' = f (c ± v_o)/(c ∓ v_s) — approaching source raises pitch", "Doppler effect",
    (v) => {
      const f = v["source-frequency"] * ((v["sound-speed"] + v["observer-speed"]) / (v["sound-speed"] - v["source-speed"]));
      return [["Observed frequency (approaching)", f, 2, "Hz", true], ["Pitch shift", f - v["source-frequency"], 1, "Hz"]];
    }),

  mk("snell-refraction", [p("Incident index", 1.0), p("Incident angle", 35, "°"), p("Refracted index", 1.5)],
    "n₁ sin θ₁ = n₂ sin θ₂; θ_c = asin(n₂/n₁)", "Snell's law",
    (v) => {
      const sin2 = (v["incident-index"] * Math.sin((v["incident-angle"] * Math.PI) / 180)) / v["refracted-index"];
      const critical = v["incident-index"] > v["refracted-index"] ? (Math.asin(v["refracted-index"] / v["incident-index"]) * 180) / Math.PI : NaN;
      const out: Array<[string, string | number, ...Array<string | number | boolean | undefined>]> = [];
      if (sin2 > 1) out.push(["Refraction", "Total internal reflection", undefined]);
      else out.push(["Refracted angle", (Math.asin(sin2) * 180) / Math.PI, 2, "°", true]);
      if (Number.isFinite(critical)) out.push(["Critical angle", critical, 2, "°"]);
      return out;
    }),

  mk("time-dilation", [p("Velocity", 0.8, "c"), p("Proper time", 1, "s")],
    "γ = 1/√(1 − v²/c²); Δt = γ Δτ", "Special-relativistic time dilation",
    (v) => {
      if (v.velocity >= 1) return err("Velocity must be below 1.0 c.");
      const gamma = 1 / Math.sqrt(1 - v.velocity ** 2);
      return [["Lorentz factor γ", gamma, 4, undefined, true], ["Dilated time", gamma * v["proper-time"], 4, "s"],
        ["Observed speed", v.velocity * 299792.458, 0, "km/s"]];
    }),

  mk("photon-energy", [p("Wavelength", 500, "nm")],
    "E = hc/λ", "Photon energy",
    (v) => {
      const e = (6.62607015e-34 * 299792458) / (v.wavelength * 1e-9);
      return [["Photon energy", e, 4, "J", true], ["Photon energy", e / 1.602176634e-19, 3, "eV"],
        ["Frequency", 299792458 / (v.wavelength * 1e-9), 0, "Hz"]];
    }),

  mk("de-broglie-wavelength", [p("Mass", 9.1093837e-31, "kg"), p("Velocity", 2.0e6, "m/s")],
    "λ = h / (mv)", "de Broglie wavelength",
    (v) => [["de Broglie wavelength", (6.62607015e-34 / (v.mass * v.velocity)) * 1e12, 4, "pm", true]]),

  mk("radioactive-decay", [p("Initial activity", 100, "%"), p("Half life", 8, "days"), p("Elapsed time", 30, "days")],
    "N = N₀ (1/2)^(t/t½); λ = ln2/t½", "Radioactive decay",
    (v) => {
      const frac = Math.pow(0.5, v["elapsed-time"] / v["half-life"]);
      return [["Remaining fraction", frac * 100, 3, "%", true], ["Decay constant", Math.LN2 / v["half-life"], 4, "1/day"],
        ["Half-lives elapsed", v["elapsed-time"] / v["half-life"], 2, undefined]];
    }),

  mk("density-specific-gravity", [p("Mass", 780, "kg"), p("Volume", 0.1, "m³"), p("Reference density", 1000, "kg/m³")],
    "ρ = m/V; SG = ρ / ρ_reference", "Density and specific gravity",
    (v) => [["Density", v.mass / v.volume, 1, "kg/m³", true],
      ["Specific gravity", v.mass / v.volume / v["reference-density"], 4]]),

  mk("pressure-depth", [p("Depth", 35, "m"), p("Density", 1025, "kg/m³")],
    "p = ρgh", "Hydrostatic pressure at depth",
    (v) => [["Gauge pressure", (v.density * G * v.depth) / 1000, 1, "kPa", true],
      ["Absolute pressure", (v.density * G * v.depth) / 1000 + 101.325, 1, "kPa"],
      ["Pressure in bar", (v.density * G * v.depth) / 100000, 3, "bar"]]),

  mk("spring-constant", [p("Force", 120, "N"), p("Extension", 0.08, "m")],
    "k = F / x", "Hooke's law spring constant",
    (v) => [["Spring constant", v.force / v.extension, 1, "N/m", true],
      ["Elastic potential energy", 0.5 * v.force * v.extension, 3, "J"]]),

  mk("restitution", [p("Approach velocity", 8, "m/s"), p("Separation velocity", 5.2, "m/s")],
    "e = separation / approach", "Coefficient of restitution",
    (v) => [["Coefficient of restitution", v["separation-velocity"] / v["approach-velocity"], 3, undefined, true],
      ["Kinetic energy retained", ((v["separation-velocity"] / v["approach-velocity"]) ** 2) * 100, 1, "%"]]),
];
