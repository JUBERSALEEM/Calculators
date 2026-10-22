import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import { it, mk, mkx, n, p, s, t, z } from "@/lib/engine/dsl";

const G = 9.80665;
const YD3_PER_M3 = 1.30795061931439;
const FT2_PER_M2 = 10.7639104167097;

export const M05_SPECS: CalculatorSpec[] = [
  // ── C23 Construction Materials and Quantity Take-off (25) ──────────────────
  mk("concrete-volume", [p("Length", 6, "m"), p("Width", 4, "m"), p("Depth", 0.15, "m"), z("Waste", 5, "%")],
    "V = L × W × D × (1 + waste%)", "L, W, D, waste",
    (v) => [["Volume (waste included)", v.length * v.width * v.depth * (1 + v.waste / 100), 4, "m³", true],
      ["Volume in cubic yards", v.length * v.width * v.depth * (1 + v.waste / 100) * YD3_PER_M3, 3, "yd³"]]),

  mk("concrete-weight", [p("Volume", 2.5, "m³"), p("Density", 2400, "kg/m³")],
    "Mass = Volume × Density", "Volume, density",
    (v) => [["Mass", v.volume * v.density, 1, "kg", true], ["Mass in tonnes", (v.volume * v.density) / 1000, 3, "t"]]),

  mk("concrete-mix-ratio", [p("Wet volume", 1, "m³"), p("Cement parts", 1), p("Sand parts", 2), p("Aggregate parts", 4), p("Dry factor", 1.54)],
    "Dry volume = wet × 1.54; each component = dry × parts / Σparts", "Cement : sand : aggregate parts",
    (v) => {
      const dry = v["wet-volume"] * v["dry-factor"], sum = v["cement-parts"] + v["sand-parts"] + v["aggregate-parts"];
      return [["Cement", (dry * v["cement-parts"]) / sum, 3, "m³", true],
        ["Sand", (dry * v["sand-parts"]) / sum, 3, "m³"],
        ["Aggregate", (dry * v["aggregate-parts"]) / sum, 3, "m³"]];
    },
    { assumptions: ["Dry-volume factor 1.54 applies to nominal-volume batching and must be confirmed against the mix design."] }),

  mk("cement-bags", [p("Wet volume", 1, "m³"), p("Mix parts total", 7), p("Bag mass", 50, "kg"), p("Dry factor", 1.54)],
    "Bags = (wet × 1.54 / parts) × 1440 kg/m³ / bag mass", "Cement bags at 1440 kg/m³ loose bulk density",
    (v) => {
      const cementVol = (v["wet-volume"] * v["dry-factor"]) / v["mix-parts-total"];
      const bags = (cementVol * 1440) / v["bag-mass"];
      return [["Cement bags required", Math.ceil(bags), 0, "bags", true], ["Cement mass", (cementVol * 1440), 1, "kg"]];
    }),

  mk("rebar-quantity", [p("Length", 8, "m"), p("Width", 5, "m"), p("Spacing", 200, "mm")],
    "Bars per direction = floor(span / spacing) + 1; total length = Σ bars × span", "Length, width, centre spacing",
    (v) => {
      const sp = v.spacing / 1000;
      const along = Math.floor(v.width / sp) + 1, across = Math.floor(v.length / sp) + 1;
      return [["Total bars", along + across, 0, "bars", true],
        ["Total bar length", along * v.length + across * v.width, 2, "m"],
        ["Bar length per direction", `${(along * v.length).toFixed(2)} m + ${(across * v.width).toFixed(2)} m`]];
    }),

  mk("rebar-weight", [p("Diameter", 12, "mm"), p("Bar length", 6, "m"), p("Count", 40, undefined, { integer: true })],
    "Mass = (d² / 162) kg/m × length × count (steel, 7850 kg/m³)", "d, L, count",
    (v) => {
      const perM = (v.diameter * v.diameter) / 162;
      return [["Total rebar mass", perM * v["bar-length"] * v.count, 2, "kg", true], ["Mass per metre", perM, 4, "kg/m"]];
    }),

  mk("brick-quantity", [p("Wall area", 25, "m²"), p("Brick length", 190, "mm"), p("Brick height", 90, "mm"), z("Mortar joint", 10, "mm"), z("Waste", 5, "%")],
    "Count = area / ((brick L + joint) × (brick H + joint)) × (1 + waste%)", "Wall area, brick module, joint, waste",
    (v) => {
      const mod = ((v["brick-length"] + v["mortar-joint"]) / 1000) * ((v["brick-height"] + v["mortar-joint"]) / 1000);
      const n0 = v["wall-area"] / mod;
      return [["Bricks required", Math.ceil(n0 * (1 + v.waste / 100)), 0, "bricks", true], ["Bricks per m²", Math.ceil(1 / mod), 0, "bricks/m²"]];
    }),

  mk("mortar-quantity", [p("Brickwork volume", 10, "m³"), z("Mortar share", 30, "%"), p("Dry factor", 1.33)],
    "Mortar volume = brickwork volume × mortar share × dry factor", "Brickwork volume, mortar percentage",
    (v) => {
      const mv = v["brickwork-volume"] * (v["mortar-share"] / 100) * v["dry-factor"];
      return [["Mortar volume (dry)", mv, 3, "m³", true], ["Mortar volume (wet)", mv / v["dry-factor"], 3, "m³"]];
    }),

  mk("block-quantity", [p("Wall area", 40, "m²"), p("Block length", 440, "mm"), p("Block height", 215, "mm"), z("Joint", 10, "mm"), z("Waste", 4, "%")],
    "Count = area / ((block L + joint) × (block H + joint)) × (1 + waste%)", "Wall area, block module, joint",
    (v) => {
      const mod = ((v["block-length"] + v.joint) / 1000) * ((v["block-height"] + v.joint) / 1000);
      return [["Blocks required", Math.ceil((v["wall-area"] / mod) * (1 + v.waste / 100)), 0, "blocks", true], ["Blocks per m²", Math.ceil(1 / mod), 0, "blocks/m²"]];
    }),

  mk("plaster-quantity", [p("Area", 30, "m²"), p("Thickness", 12, "mm"), p("Cement parts", 1), p("Sand parts", 4), p("Dry factor", 1.33)],
    "Dry volume = area × thickness × 1.33; cement = dry × c/Σ; sand = dry × s/Σ", "Area, thickness, mix ratio",
    (v) => {
      const dry = v.area * (v.thickness / 1000) * v["dry-factor"], sum = v["cement-parts"] + v["sand-parts"];
      const cementVol = (dry * v["cement-parts"]) / sum;
      return [["Cement bags (50 kg)", Math.ceil((cementVol * 1440) / 50), 0, "bags", true], ["Sand volume", (dry * v["sand-parts"]) / sum, 3, "m³"], ["Dry mortar volume", dry, 3, "m³"]];
    }),

  mk("paint-coverage", [p("Area", 120, "m²"), it("Coats", 2, { min: 1, max: 10 }), p("Coverage", 10, "m²/L")],
    "Litres = (area × coats) / coverage", "Area, coats, product coverage",
    (v) => [["Paint required", (v.area * v.coats) / v.coverage, 2, "L", true], ["Paint required incl. 10% margin", ((v.area * v.coats) / v.coverage) * 1.1, 2, "L"]]),

  mk("tile-count", [p("Area", 18, "m²"), p("Tile length", 600, "mm"), p("Tile width", 600, "mm"), z("Waste", 10, "%"), it("Tiles per box", 4, { min: 1 })],
    "Count = area / tile area × (1 + waste%)", "Area, tile size, waste",
    (v) => {
      const tile = (v["tile-length"] / 1000) * (v["tile-width"] / 1000);
      const n0 = Math.ceil((v.area / tile) * (1 + v.waste / 100));
      return [["Tiles required", n0, 0, "tiles", true], ["Boxes required", Math.ceil(n0 / v["tiles-per-box"]), 0, "boxes"], ["Tiles per m²", Math.ceil(1 / tile), 0, "tiles/m²"]];
    }),

  mk("tile-adhesive-grout", [p("Area", 20, "m²"), p("Adhesive rate", 4, "kg/m²"), p("Joint length", 200, "m"), p("Joint width", 3, "mm"), p("Joint depth", 8, "mm"), p("Grout density", 1600, "kg/m³")],
    "Adhesive = area × rate; Grout = joint length × width × depth × density", "Adhesive spread rate plus joint geometry",
    (v) => {
      const grout = v["joint-length"] * (v["joint-width"] / 1000) * (v["joint-depth"] / 1000) * v["grout-density"];
      return [["Adhesive required", v.area * v["adhesive-rate"], 1, "kg", true], ["Grout required", grout, 2, "kg"]];
    }),

  mk("drywall-sheets", [p("Area", 150, "m²"), p("Sheet area", 2.88, "m²"), z("Waste", 8, "%"), p("Screws rate", 25, "per m²")],
    "Sheets = ceil(area × (1 + waste%) / sheet area)", "Area, sheet size, waste",
    (v) => {
      const sheets = Math.ceil((v.area * (1 + v.waste / 100)) / v["sheet-area"]);
      return [["Sheets required", sheets, 0, "sheets", true], ["Screws required", Math.ceil(v.area * v["screws-rate"]), 0, "screws"]];
    }),

  mk("insulation-quantity", [p("Area", 120, "m²"), p("Roll coverage", 8, "m²"), z("Waste", 5, "%")],
    "Rolls = ceil(area × (1 + waste%) / roll coverage)", "Area, roll coverage",
    (v) => [["Rolls required", Math.ceil((v.area * (1 + v.waste / 100)) / v["roll-coverage"]), 0, "rolls", true]]),

  mk("asphalt-tonnage", [p("Area", 800, "m²"), p("Depth", 50, "mm"), p("Density", 2.4, "t/m³")],
    "Tonnes = area × depth × density", "Area, layer depth, compacted density",
    (v) => [["Asphalt mass", v.area * (v.depth / 1000) * v.density, 2, "t", true], ["Asphalt volume", v.area * (v.depth / 1000), 2, "m³"]]),

  mk("aggregate-tonnage", [p("Volume", 30, "m³"), p("Bulk density", 1600, "kg/m³")],
    "Tonnes = volume × bulk density / 1000", "Volume, loose bulk density",
    (v) => [["Aggregate mass", (v.volume * v["bulk-density"]) / 1000, 2, "t", true]]),

  mk("sand-volume", [p("Area", 100, "m²"), p("Depth", 100, "mm"), p("Compaction", 1.2)],
    "Order volume = area × depth × compaction factor", "Area, loose depth, compaction factor",
    (v) => [["Loose sand volume to order", v.area * (v.depth / 1000) * v.compaction, 3, "m³", true]]),

  mk("screed-material", [p("Area", 60, "m²"), p("Thickness", 50, "mm"), p("Cement parts", 1), p("Sand parts", 4), p("Dry factor", 1.33)],
    "Dry volume = area × thickness × 1.33, split by mix parts", "Screed area, thickness, mix",
    (v) => {
      const dry = v.area * (v.thickness / 1000) * v["dry-factor"], sum = v["cement-parts"] + v["sand-parts"];
      return [["Cement bags (50 kg)", Math.ceil(((dry * v["cement-parts"]) / sum * 1440) / 50), 0, "bags", true], ["Sand volume", (dry * v["sand-parts"]) / sum, 3, "m³"]];
    }),

  mk("water-cement-ratio", [p("Cement mass", 350, "kg"), p("Water cement ratio", 0.5)],
    "Water = cement mass × w/c ratio", "Cement mass, w/c ratio",
    (v) => [["Water required", v["cement-mass"] * v["water-cement-ratio"], 1, "L", true], ["Cement mass", v["cement-mass"], 1, "kg"]]),

  mk("formwork-plywood", [p("Concrete area", 200, "m²"), it("Reuses", 5, { min: 1, max: 30 }), p("Sheet area", 2.88, "m²")],
    "Sheets = ceil(area / (sheet area × reuse count))", "Formwork area, sheet size, reuse cycles",
    (v) => [["Plywood sheets required", Math.ceil(v["concrete-area"] / (v["sheet-area"] * v.reuses)), 0, "sheets", true]]),

  mk("roofing-squares", [p("Roof area", 180, "m²")],
    "Squares = area / 9.290304 m² (100 ft²); bundles = 3 per square", "Roof area (plan-projected area must be slope-corrected upstream)",
    (v) => {
      const squares = v["roof-area"] / 9.290304;
      return [["Roofing squares", squares, 2, "squares", true], ["Shingle bundles (3/square)", Math.ceil(squares * 3), 0, "bundles"], ["Roof area in ft²", v["roof-area"] * FT2_PER_M2, 0, "ft²"]];
    }),

  mk("shingle-bundles", [p("Roof area", 180, "m²"), z("Waste", 10, "%"), p("Bundles per square", 3)],
    "Bundles = ceil(area / 9.290304 × bundles-per-square × (1 + waste%))", "Roof area, waste, bundle coverage",
    (v) => [["Shingle bundles", Math.ceil((v["roof-area"] / 9.290304) * v["bundles-per-square"] * (1 + v.waste / 100)), 0, "bundles", true]]),

  mk("excavation-volume", [p("Length", 12, "m"), p("Width", 8, "m"), p("Depth", 2.5, "m"), z("Swell", 25, "%")],
    "Bank volume = L × W × D; loose volume = bank × (1 + swell%)", "L, W, D, soil swell",
    (v) => {
      const bank = v.length * v.width * v.depth;
      return [["Bank volume (in situ)", bank, 2, "m³", true], ["Loose volume (haulage)", bank * (1 + v.swell / 100), 2, "m³"]];
    }),

  mk("backfill-volume", [p("Excavation volume", 240, "m³"), p("Structure volume", 85, "m³"), z("Compaction", 15, "%")],
    "Fill = (excavation − structure) × (1 + compaction%)", "Excavation, displaced structure, compaction allowance",
    (v) => {
      const net = Math.max(0, v["excavation-volume"] - v["structure-volume"]);
      return [["Backfill volume required", net * (1 + v.compaction / 100), 2, "m³", true], ["Net void volume", net, 2, "m³"]];
    }),

  // ── C24 Space Planning and Architectural Quantities (17) ───────────────────
  mk("floor-area", [p("Length", 5.2, "m"), p("Width", 4.1, "m")],
    "A = L × W; P = 2(L + W)", "Room length and width",
    (v) => [["Floor area", v.length * v.width, 3, "m²", true], ["Perimeter", 2 * (v.length + v.width), 2, "m"], ["Area in ft²", v.length * v.width * FT2_PER_M2, 1, "ft²"]]),

  mk("carpet-vs-builtup", [p("Carpet area", 80, "m²"), z("Loading", 25, "%")],
    "Built-up area = carpet area × (1 + loading%)", "Carpet area and common-area loading",
    (v) => [["Built-up area", v["carpet-area"] * (1 + v.loading / 100), 2, "m²", true], ["Common-area addition", (v["carpet-area"] * v.loading) / 100, 2, "m²"]]),

  mk("far-fsi", [p("Plot area", 500, "m²"), p("Total floor area", 900, "m²")],
    "FAR = total floor area / plot area", "Plot area and aggregate floor area",
    (v) => [["Floor Area Ratio (FAR / FSI)", v["total-floor-area"] / v["plot-area"], 3, undefined, true]]),

  mk("plot-coverage", [p("Building footprint", 275, "m²"), p("Plot area", 500, "m²")],
    "Coverage% = footprint / plot area × 100", "Footprint and plot area",
    (v) => [["Ground coverage", (v["building-footprint"] / v["plot-area"]) * 100, 2, "%", true], ["Open area", v["plot-area"] - v["building-footprint"], 1, "m²"]]),

  mk("room-volume", [p("Length", 5, "m"), p("Width", 4, "m"), p("Height", 2.7, "m"), z("Airflow", 216, "m³/h")],
    "V = L × W × H; ACH = airflow / V", "Room dimensions and ventilation airflow",
    (v) => {
      const vol = v.length * v.width * v.height;
      return [["Room volume", vol, 2, "m³", true], ["Air changes per hour", v.airflow / vol, 2, "ACH"]];
    }),

  mk("staircase-rise-run", [p("Floor height", 3.0, "m"), p("Riser height", 0.175, "m"), p("Tread depth", 0.28, "m")],
    "Risers = ceil(height / riser); going = (risers − 1) × tread", "Floor-to-floor height, riser, tread",
    (v) => {
      const risers = Math.ceil(v["floor-height"] / v["riser-height"]);
      const actual = v["floor-height"] / risers, going = (risers - 1) * v["tread-depth"];
      return [["Number of risers", risers, 0, "risers", true], ["Actual riser height", actual * 1000, 1, "mm"],
        ["Number of treads", risers - 1, 0, "treads"], ["Total going (run)", going, 2, "m"],
        ["2R + T (comfort check)", 2 * actual * 1000 + v["tread-depth"] * 1000, 1, "mm"]];
    },
    { limitations: ["Riser/tread comfort rules and statutory maxima are jurisdiction-specific; verify against the governing building code."] }),

  mk("stair-stringer", [p("Total rise", 3.0, "m"), p("Total run", 4.2, "m")],
    "Stringer = √(rise² + run²); θ = atan(rise / run)", "Rise and run of the stair flight",
    (v) => [["Stringer length", Math.hypot(v["total-rise"], v["total-run"]), 3, "m", true],
      ["Pitch angle", (Math.atan2(v["total-rise"], v["total-run"]) * 180) / Math.PI, 2, "°"]]),

  mk("ramp-slope", [p("Rise", 0.6, "m"), p("Run", 9.0, "m")],
    "Slope% = rise / run × 100; ratio 1 : run/rise", "Vertical rise over horizontal run",
    (v) => [["Slope", (v["rise"] / v.run) * 100, 2, "%", true], ["Ratio", `1 : ${(v.run / v.rise).toFixed(2)}`],
      ["Angle", (Math.atan2(v["rise"], v.run) * 180) / Math.PI, 2, "°"]],
    { limitations: ["Accessible-ramp gradients and landing requirements are code-specific; this is geometry only."] }),

  mk("wall-area-openings", [p("Gross wall", 96, "m²"), p("Openings", 14, "m²")],
    "Net area = gross − openings", "Gross wall area and total opening area",
    (v) => [["Net wall area", Math.max(0, v["gross-wall"] - v.openings), 2, "m²", true]]),

  mk("wallpaper-rolls", [p("Wall area", 78, "m²"), p("Roll coverage", 5.2, "m²"), z("Pattern waste", 15, "%")],
    "Rolls = ceil(area × (1 + waste%) / roll coverage)", "Wall area, roll coverage, pattern repeat allowance",
    (v) => [["Rolls required", Math.ceil((v["wall-area"] * (1 + v["pattern-waste"] / 100)) / v["roll-coverage"]), 0, "rolls", true]]),

  mk("curtain-fabric", [p("Window width", 2.4, "m"), p("Finished drop", 2.2, "m"), p("Fullness", 2.0), p("Fabric width", 1.4, "m")],
    "Panels = ceil(width × fullness / fabric width); metres = panels × drop", "Window width, fullness ratio, fabric width",
    (v) => {
      const panels = Math.ceil((v["window-width"] * v.fullness) / v["fabric-width"]);
      return [["Fabric panels required", panels, 0, "panels", true], ["Fabric length required", panels * v["finished-drop"], 2, "m"]];
    }),

  mk("flooring-wastage", [p("Area", 65, "m²"), z("Waste", 8, "%")],
    "Order quantity = area × (1 + waste%)", "Net area and cutting waste",
    (v) => [["Order quantity", v.area * (1 + v.waste / 100), 2, "m²", true], ["Allowance", (v.area * v.waste) / 100, 2, "m²"]]),

  mk("skirting-length", [p("Room perimeter", 18.6, "m"), p("Openings", 2.4, "m")],
    "Length = perimeter − openings", "Perimeter and door openings",
    (v) => [["Skirting length", Math.max(0, v["room-perimeter"] - v.openings), 2, "m", true]]),

  mk("false-ceiling-area", [p("Room area", 42, "m²"), p("Border loss", 5, "%"), p("Tile area", 0.36, "m²")],
    "Tiles = ceil(area × (1 + border%) / tile area)", "Room area, border allowance, tile size",
    (v) => {
      const net = v["room-area"] * (1 + v["border-loss"] / 100);
      return [["Ceiling tiles required", Math.ceil(net / v["tile-area"]), 0, "tiles", true], ["Ceiling area to cover", net, 2, "m²"]];
    }),

  mk("ceiling-height", [p("Floor height", 3.2, "m"), p("Services zone", 0.45, "m"), p("Finish thickness", 0.05, "m")],
    "Clear height = floor height − services − finishes", "Structural height minus service and finish zones",
    (v) => [["Clear ceiling height", v["floor-height"] - v["services-zone"] - v["finish-thickness"], 3, "m", true]]),

  mk("fenestration-ratio", [p("Window area", 18, "m²"), p("Floor area", 85, "m²")],
    "Ratio% = window area / floor area × 100", "Glazed area and conditioned floor area",
    (v) => [["Fenestration ratio", (v["window-area"] / v["floor-area"]) * 100, 2, "%", true]]),

  mk("room-ach", [p("Airflow", 340, "m³/h"), p("Room volume", 48, "m³")],
    "ACH = airflow / volume", "Supply airflow and room volume",
    (v) => [["Air changes per hour", v.airflow / v["room-volume"], 2, "ACH", true], ["Airflow per minute", v.airflow / 60, 1, "m³/min"]]),

  // ── C25 Structural Engineering (20) ────────────────────────────────────────
  mk("soil-bearing-pressure", [p("Load", 850, "kN"), p("Footing area", 2.5, "m²")],
    "q = P / A", "Service load and footing contact area",
    (v) => [["Bearing pressure", v.load / v["footing-area"], 1, "kPa", true], ["Pressure in psi", (v.load / v["footing-area"]) / 6.894757, 2, "psi"]]),

  mk("footing-size", [p("Load", 850, "kN"), p("Allowable bearing", 150, "kPa")],
    "A = P / q_allow; square side = √A", "Service load and allowable bearing pressure",
    (v) => {
      const a = v.load / v["allowable-bearing"];
      return [["Required footing area", a, 3, "m²", true], ["Square footing side", Math.sqrt(a), 3, "m"]];
    },
    { limitations: ["Sizing uses service loads only. Settlement, eccentricity, uplift and code load combinations require a geotechnical/structural engineer."] }),

  mk("column-axial-load", [p("Tributary area", 30, "m²"), p("Area load", 8, "kN/m²")],
    "N = tributary area × distributed load", "Tributary area and total factored area load",
    (v) => [["Axial load", v["tributary-area"] * v["area-load"], 1, "kN", true]]),

  mk("beam-moment-udl", [p("Load", 12, "kN/m"), p("Span", 6, "m")],
    "M_max = wL²/8; V_max = wL/2 (simply supported)", "Uniformly distributed load and span",
    (v) => [["Maximum bending moment", (v.load * v.span * v.span) / 8, 2, "kN·m", true], ["Maximum shear force", (v.load * v.span) / 2, 2, "kN"]]),

  mk("cantilever-moment", [p("Load", 8, "kN/m"), p("Length", 2.5, "m")],
    "M_root = wL²/2; V_root = wL (cantilever UDL)", "Cantilever UDL and projection",
    (v) => [["Root bending moment", (v.load * v.length * v.length) / 2, 2, "kN·m", true], ["Root shear", v.load * v.length, 2, "kN"]]),

  mk("beam-shear", [p("Span", 8, "m"), p("Point load", 40, "kN"), p("Load position", 3, "m")],
    "R_A = P(L − a)/L; R_B = Pa/L", "Single point load position from left support",
    (v) => {
      if (v["load-position"] > v.span) return err("Load position cannot exceed the span.");
      const ra = (v["point-load"] * (v.span - v["load-position"])) / v.span;
      return [["Left support reaction", ra, 2, "kN", true], ["Right support reaction", (v["point-load"] * v["load-position"]) / v.span, 2, "kN"],
        ["Maximum shear", Math.max(ra, v["point-load"] - ra), 2, "kN"]];
    }),

  mk("beam-deflection", [p("Load", 12, "kN/m"), p("Span", 6, "m"), p("Young modulus", 200, "GPa"), p("Second moment", 8.5e-5, "m⁴")],
    "δ = 5wL⁴ / (384EI) (simply supported, UDL, service loads)", "w, L, E, I",
    (v) => {
      const w = v.load * 1000, e = v["young-modulus"] * 1e9;
      const d = (5 * w * Math.pow(v.span, 4)) / (384 * e * v["second-moment"]);
      return [["Mid-span deflection", d * 1000, 2, "mm", true], ["Deflection ratio L/δ", v.span / d, 0, undefined]];
    }),

  mk("slab-thickness", [p("Span", 5, "m"), p("Span depth ratio", 26)],
    "Effective depth = span / ratio; thickness ≈ d + cover allowance", "Parametric span/depth rule (code-specific)",
    (v) => [["Minimum effective depth", (v.span / v["span-depth-ratio"]) * 1000, 1, "mm", true],
      ["Indicative slab thickness (d + 25 mm)", (v.span / v["span-depth-ratio"]) * 1000 + 25, 0, "mm"]],
    { limitations: ["Span/depth ratios are a preliminary sizing rule of thumb only. Final slab thickness requires code-based flexure, shear and deflection checks by a licensed engineer."] }),

  mk("rebar-area-required", [p("Design moment", 120, "kN·m"), p("Yield strength", 500, "MPa"), p("Effective depth", 0.44, "m"), p("Lever arm factor", 0.9)],
    "A_s = M / (φ · f_y · j · d)", "Parametric flexural steel requirement",
    (v) => {
      const as = (v["design-moment"] * 1e6) / (v["lever-arm-factor"] * v["yield-strength"] * v["effective-depth"] * 1000);
      return [["Required steel area", as, 1, "mm²", true], ["Required steel area", as / 100, 2, "cm²"]];
    },
    { limitations: ["Simplified lever-arm estimate for preliminary checking only. Design must follow the governing code (e.g. ACI 318 / Eurocode 2) including minimum/maximum steel, ductility and detailing — specialist structural review required."] }),

  mk("cube-cylinder-strength", [p("Cube strength", 30, "MPa"), p("Conversion factor", 0.8)],
    "f_cyl ≈ factor × f_cube (parametric conversion)", "Cube-to-cylinder conversion factor",
    (v) => [["Equivalent cylinder strength", v["cube-strength"] * v["conversion-factor"], 1, "MPa", true]],
    { limitations: ["The cube-to-cylinder relationship depends on specimen size, aggregate and standard; the 0.8 factor is a commonly quoted approximation, not a code rule."] }),

  mk("rankine-earth-pressure", [p("Friction angle", 30, "°", { max: 45 }), p("Unit weight", 18, "kN/m³"), p("Wall height", 4, "m")],
    "K_a = (1 − sin φ)/(1 + sin φ); p = K_a γ H; F = ½ K_a γ H²", "Rankine active earth pressure",
    (v) => {
      const rad = (v["friction-angle"] * Math.PI) / 180;
      const ka = (1 - Math.sin(rad)) / (1 + Math.sin(rad));
      return [["Active pressure coefficient K_a", ka, 4, undefined, true],
        ["Base pressure", ka * v["unit-weight"] * v["wall-height"], 1, "kPa"],
        ["Total lateral thrust", 0.5 * ka * v["unit-weight"] * v["wall-height"] ** 2, 1, "kN/m"]];
    },
    { limitations: ["Rankine theory assumes dry, cohesionless, homogeneous backfill with a smooth vertical wall and no surcharge. Real designs need site-specific geotechnics."] }),

  mk("retaining-wall-stability", [p("Overturning moment", 95, "kN·m"), p("Resisting moment", 210, "kN·m"), p("Sliding force", 60, "kN"), p("Friction resistance", 105, "kN")],
    "FS_overturning = M_resist / M_overturn; FS_sliding = R_friction / H", "Parametric stability factors",
    (v) => [["Factor of safety — overturning", v["resisting-moment"] / v["overturning-moment"], 2, undefined, true],
      ["Factor of safety — sliding", v["friction-resistance"] / v["sliding-force"], 2]],
    { limitations: ["Inputs must come from a full geotechnical and structural analysis. Required factors of safety are set by the governing code and are not evaluated here."] }),

  mk("wind-load", [p("Basic wind speed", 45, "m/s"), p("Velocity pressure coefficient", 1.1), p("Exposure factor", 1.0), p("Gust factor", 0.85)],
    "q_z = 0.613 · K_z · K_zt · K_d · V² (N/m²)", "Parametric velocity pressure",
    (v) => {
      const q = 0.613 * v["velocity-pressure-coefficient"] * v["exposure-factor"] * v["gust-factor"] * v["basic-wind-speed"] ** 2;
      return [["Velocity pressure q_z", q, 1, "N/m²", true], ["Velocity pressure", q / 1000, 3, "kPa"]];
    },
    { limitations: ["ASCE 7 / Eurocode wind provisions include exposure categories, topography, internal pressure and pressure coefficients that are code-licensed. This computes velocity pressure only from user-supplied factors."] }),

  mk("snow-load", [p("Ground snow load", 1.2, "kPa"), p("Exposure factor", 1.0), p("Thermal factor", 1.0), p("Importance factor", 1.0)],
    "p_f = 0.7 · C_e · C_t · I · p_g", "Parametric roof snow load",
    (v) => [["Flat roof snow load", 0.7 * v["exposure-factor"] * v["thermal-factor"] * v["importance-factor"] * v["ground-snow-load"], 3, "kPa", true]],
    { limitations: ["Roof snow provisions (slope, sliding, drift, rain-on-snow) are code-specific and licensed. Values here are parametric estimates from user-supplied factors."] }),

  mk("load-combination-lrfd", [p("Dead load", 4.5, "kPa"), p("Live load", 2.4, "kPa"), p("Wind load", 1.1, "kPa")],
    "w_u = 1.2D + 1.6L + 0.5W (parametric LRFD-style combination)", "Dead, live and wind components",
    (v) => [["Factored load (D+L+W combo)", 1.2 * v["dead-load"] + 1.6 * v["live-load"] + 0.5 * v["wind-load"], 3, "kPa", true],
      ["Unfactored service load", v["dead-load"] + v["live-load"] + v["wind-load"], 3, "kPa"]],
    { limitations: ["Only one illustrative combination is evaluated. The governing code's complete load-combination set and load factors must be applied by a qualified engineer."] }),

  mk("pile-capacity", [p("Skin friction", 420, "kN"), p("End bearing", 680, "kN"), p("Factor of safety", 2.5)],
    "Q_ult = skin + end; Q_allow = Q_ult / FS", "Ultimate pile resistance components",
    (v) => {
      const ult = v["skin-friction"] + v["end-bearing"];
      return [["Ultimate pile capacity", ult, 1, "kN", true], ["Allowable capacity", ult / v["factor-of-safety"], 1, "kN"]];
    },
    { limitations: ["Capacity components must be derived from site-specific geotechnical investigation and the governing foundation code."] }),

  mk("pavement-thickness", [p("Design ESAL", 2500000, "ESAL"), p("Subgrade modulus", 45, "MPa"), p("Layer coefficient", 0.42)],
    "Parametric: SN required from user-supplied structural number per unit ESAL", "Pavement design parameters",
    (v) => {
      const sn = 0.4 * Math.log10(v["design-esal"]) - 0.2;
      return [["Indicative structural number", sn, 2, undefined, true], ["Indicative layer thickness", (sn / v["layer-coefficient"]) * 25.4, 0, "mm"]];
    },
    { limitations: ["AASHTO pavement design equations and layer coefficients are licensed and empirical. This is a parametric approximation only; designs require a pavement engineer."] }),

  mk("esal-traffic", [p("Axle load", 80, "kN"), p("Axle passes", 1000000), p("Standard axle", 80, "kN"), z("Growth", 2, "%", { max: 20 }), p("Design years", 20, "years")],
    "ESAL = passes × (load / standard)⁴ × growth factor (fourth-power law)", "Axle load equivalency estimate",
    (v) => {
      const per = Math.pow(v["axle-load"] / v["standard-axle"], 4);
      const gf = (Math.pow(1 + v.growth / 100, v["design-years"]) - 1) / (v.growth / 100 || 1);
      return [["Load equivalency factor", per, 4, undefined, true], ["Design ESALs", v["axle-passes"] * per * gf, 0, "ESAL"]];
    },
    { limitations: ["Fourth-power approximation of AASHTO axle equivalency; official tables also depend on axle configuration and structural number."] }),

  mk("concrete-curing", [p("Curing temperature", 20, "°C"), p("Curing time", 7, "days"), n("Datum temperature", -10, "°C")],
    "Nurse–Saul maturity: M = Σ (T − T₀) · Δt; strength % from user-supplied maturity–strength slope", "Maturity index method",
    (v) => {
      const maturity = (v["curing-temperature"] - v["datum-temperature"]) * v["curing-time"] * 24;
      return [["Maturity index", maturity, 0, "°C·h", true], ["Equivalent 20 °C curing days", maturity / (20 - v["datum-temperature"]) / 24, 2, "days"]];
    },
    { limitations: ["Maturity–strength relationships must be established by trial mixes; this returns the maturity index only, not a strength prediction."] }),

  mk("trench-excavation", [p("Trench depth", 2.4, "m"), p("Trench width", 0.8, "m"), p("Soil cohesion class", 2)],
    "Parametric depth-based protection selection", "Depth, width and user soil class",
    (v) => [["Depth-to-width ratio", v["trench-depth"] / v["trench-width"], 2, undefined, true],
      ["Spoil volume per metre", v["trench-depth"] * v["trench-width"], 2, "m³/m"]],
    { limitations: ["Trench protection (sloping, benching, shoring, boxes) is mandated by OSHA 29 CFR 1926 Subpart P and local rules and depends on soil classification and inspection. This tool does not determine a legal benching requirement — specialist review required."] }),

  // ── C26 Mechanical Engineering (20) ────────────────────────────────────────
  mk("force-newton", [p("Mass", 12, "kg"), p("Acceleration", 2.5, "m/s²")],
    "F = m · a", "Mass and acceleration",
    (v) => [["Force", v.mass * v.acceleration, 3, "N", true], ["Force in kgf", (v.mass * v.acceleration) / G, 3, "kgf"]]),

  mk("torque", [p("Force", 120, "N"), p("Radius", 0.25, "m"), p("Angle", 90, "°")],
    "τ = F · r · sin θ", "Force, lever arm, angle between them",
    (v) => {
      const t = v.force * v.radius * Math.sin((v.angle * Math.PI) / 180);
      return [["Torque", t, 3, "N·m", true], ["Torque in lbf·ft", t / 1.3558179483314004, 3, "lbf·ft"]];
    }),

  mk("rotational-power", [p("Torque", 250, "N·m"), p("Speed", 1800, "rpm")],
    "P = τ · ω, ω = 2πN/60", "Torque and rotational speed",
    (v) => {
      const w = (2 * Math.PI * v.speed) / 60, p0 = v.torque * w;
      return [["Power", p0 / 1000, 3, "kW", true], ["Power", p0 / 745.699871582, 3, "hp"], ["Angular velocity", w, 3, "rad/s"]];
    }),

  mk("gear-ratio", [p("Driver teeth", 20), p("Driven teeth", 60), p("Input speed", 1500, "rpm")],
    "i = driven / driver; N_out = N_in / i", "Teeth counts and input speed",
    (v) => {
      const i = v["driven-teeth"] / v["driver-teeth"];
      return [["Gear ratio", i, 4, ": 1", true], ["Output speed", v["input-speed"] / i, 2, "rpm"], ["Output torque multiple", i, 4, "×"]];
    }),

  mk("belt-pulley-speed", [p("Driver diameter", 100, "mm"), p("Driven diameter", 250, "mm"), p("Driver speed", 1450, "rpm")],
    "N₂ = N₁ · D₁ / D₂", "Pulley diameters and driver speed",
    (v) => [["Driven pulley speed", (v["driver-speed"] * v["driver-diameter"]) / v["driven-diameter"], 2, "rpm", true],
      ["Speed ratio", v["driven-diameter"] / v["driver-diameter"], 3, ": 1"]]),

  mk("bearing-life", [p("Dynamic capacity", 32000, "N"), p("Equivalent load", 4500, "N"), p("Speed", 1200, "rpm"), p("Exponent", 3)],
    "L10 = (C/P)^p million revs; hours = L10 × 10⁶ / (60 N)", "ISO 281 basic rating life",
    (v) => {
      const l10 = Math.pow(v["dynamic-capacity"] / v["equivalent-load"], v.exponent);
      return [["L10 rating life", l10, 1, "million rev", true], ["L10 life in hours", (l10 * 1e6) / (60 * v.speed), 0, "h"]];
    }),

  mk("spring-rate", [p("Wire diameter", 2, "mm"), p("Mean coil diameter", 20, "mm"), p("Active coils", 10), p("Shear modulus", 79.3, "GPa")],
    "k = G d⁴ / (8 D³ n)", "Helical compression spring geometry (Wahl factor excluded)",
    (v) => {
      const d = v["wire-diameter"] / 1000, dm = v["mean-coil-diameter"] / 1000, g = v["shear-modulus"] * 1e9;
      return [["Spring rate", (g * d ** 4) / (8 * dm ** 3 * v["active-coils"]), 2, "N/m", true],
        ["Spring rate", (g * d ** 4) / (8 * dm ** 3 * v["active-coils"]) / 1000, 3, "N/mm"]];
    }),

  mk("bolt-torque", [p("Preload", 25000, "N"), p("Nominal diameter", 12, "mm"), p("Nut factor", 0.2)],
    "T = K · F · d", "Torque–preload relationship with empirical nut factor",
    (v) => [["Tightening torque", v["nut-factor"] * v.preload * (v["nominal-diameter"] / 1000), 2, "N·m", true],
      ["Torque in lbf·ft", (v["nut-factor"] * v.preload * (v["nominal-diameter"] / 1000)) / 1.3558179483314004, 2, "lbf·ft"]],
    { limitations: ["Nut factor K varies with lubrication, thread and material (0.1–0.3 typical). Always follow the fastener manufacturer's specification."] }),

  mk("friction-force", [p("Normal force", 400, "N"), p("Friction coefficient", 0.45)],
    "F_f = μ · N (dry Coulomb friction)", "Normal force and coefficient of friction",
    (v) => [["Friction force", v["normal-force"] * v["friction-coefficient"], 2, "N", true]]),

  mk("inclined-plane", [p("Mass", 20, "kg"), p("Incline angle", 25, "°"), p("Friction coefficient", 0.3)],
    "F_parallel = mg sinθ; N = mg cosθ; F_friction = μN", "Block on a rough incline",
    (v) => {
      const rad = (v["incline-angle"] * Math.PI) / 180;
      const w = v.mass * G, par = w * Math.sin(rad), nor = w * Math.cos(rad);
      return [["Driving force along incline", par, 2, "N", true], ["Normal force", nor, 2, "N"],
        ["Friction force", v["friction-coefficient"] * nor, 2, "N"],
        ["Net force (down-slope)", par - v["friction-coefficient"] * nor, 2, "N"]];
    }),

  mk("mechanical-advantage", [p("Effort arm", 1.2, "m"), p("Load arm", 0.2, "m"), p("Applied effort", 150, "N")],
    "MA = L_effort / L_load; load lifted = MA × effort", "Lever arm geometry",
    (v) => {
      const ma = v["effort-arm"] / v["load-arm"];
      return [["Mechanical advantage", ma, 3, undefined, true], ["Load liftable", ma * v["applied-effort"], 1, "N"]];
    }),

  mk("pulley-system", [p("Supporting rope segments", 4), p("Load", 800, "N"), p("Efficiency", 90, "%")],
    "MA = n (ideal); effort = load / (n × efficiency)", "Ideal and friction-corrected pulley advantage",
    (v) => [["Ideal mechanical advantage", v["supporting-rope-segments"], 2, undefined, true],
      ["Effort required", v.load / (v["supporting-rope-segments"] * (v.efficiency / 100)), 1, "N"]]),

  mkx("area-moment-inertia", [s("Shape", [["rect", "Rectangle b×h"], ["circle", "Solid circle"], ["tube", "Hollow circle"]], "rect"), p("Dimension A", 100, "mm"), p("Dimension B", 50, "mm")],
    "Rectangle I = b h³/12; Circle I = πd⁴/64; Annulus I = π(D⁴ − d⁴)/64", "Section geometry",
    (v) => {
      const shape = String(v.shape), a = v["dimension-a"] / 1000, b = v["dimension-b"] / 1000;
      let i = 0;
      if (shape === "rect") i = (a * b ** 3) / 12;
      else if (shape === "circle") i = (Math.PI * a ** 4) / 64;
      else i = (Math.PI * (a ** 4 - b ** 4)) / 64;
      return [["Second moment of area", i, 8, "m⁴", true], ["Second moment of area", i * 1e12, 1, "mm⁴"]];
    }),

  mkx("section-modulus", [s("Shape", [["rect", "Rectangle b×h"], ["circle", "Solid circle"]], "rect"), p("Dimension A", 100, "mm"), p("Dimension B", 50, "mm")],
    "S = I / (h/2)", "Elastic section modulus from first principles",
    (v) => {
      const a = v["dimension-a"] / 1000, b = v["dimension-b"] / 1000;
      const i = v.shape === "rect" ? (a * b ** 3) / 12 : (Math.PI * a ** 4) / 64;
      const c = v.shape === "rect" ? b / 2 : a / 2;
      return [["Elastic section modulus", i / c, 8, "m³", true], ["Section modulus", (i / c) * 1e9, 1, "mm³"]];
    }),

  mk("thermal-expansion", [p("Original length", 12, "m"), p("Expansion coefficient", 12, "µm/m·°C"), p("Temperature change", 35, "°C")],
    "ΔL = α · L · ΔT", "Linear thermal expansion",
    (v) => [["Change in length", v["original-length"] * (v["expansion-coefficient"] * 1e-6) * v["temperature-change"] * 1000, 3, "mm", true],
      ["New length", v["original-length"] * (1 + v["expansion-coefficient"] * 1e-6 * v["temperature-change"]), 6, "m"]]),

  mk("natural-frequency", [p("Stiffness", 12000, "N/m"), p("Mass", 5, "kg")],
    "f_n = (1/2π) √(k/m)", "Single degree-of-freedom undamped natural frequency",
    (v) => {
      const wn = Math.sqrt(v.stiffness / v.mass);
      return [["Natural frequency", wn / (2 * Math.PI), 3, "Hz", true], ["Angular frequency", wn, 3, "rad/s"]];
    }),

  mk("critical-speed", [p("Young modulus", 200, "GPa"), p("Second moment", 1.2e-6, "m⁴"), p("Mass per length", 12, "kg/m"), p("Span", 4, "m")],
    "ω_cr = π² √(EI / (m L⁴)); N_cr = 60ω/2π", "Shaft whirling critical speed",
    (v) => {
      const w = Math.PI ** 2 * Math.sqrt((v["young-modulus"] * 1e9 * v["second-moment"]) / (v["mass-per-length"] * v.span ** 4));
      return [["Critical speed", (w * 60) / (2 * Math.PI), 1, "rpm", true], ["Critical angular speed", w, 2, "rad/s"]];
    }),

  mk("flywheel-energy", [p("Moment of inertia", 25, "kg·m²"), p("Rotational speed", 3000, "rpm")],
    "E = ½ I ω²", "Rotational kinetic energy",
    (v) => {
      const w = (2 * Math.PI * v["rotational-speed"]) / 60;
      return [["Rotational energy", 0.5 * v["moment-of-inertia"] * w * w, 1, "J", true],
        ["Energy", (0.5 * v["moment-of-inertia"] * w * w) / 3600, 3, "Wh"]];
    }),

  mk("motor-slip", [p("Synchronous speed", 1500, "rpm"), p("Rated speed", 1440, "rpm"), p("Rated power", 15, "kW")],
    "s = (N_s − N) / N_s; T = P / ω", "Induction motor slip and shaft torque",
    (v) => {
      const slip = (v["synchronous-speed"] - v["rated-speed"]) / v["synchronous-speed"];
      const w = (2 * Math.PI * v["rated-speed"]) / 60;
      return [["Slip", slip * 100, 2, "%", true], ["Shaft torque", (v["rated-power"] * 1000) / w, 1, "N·m"]];
    }),

  mk("hoist-capacity", [p("Load", 5000, "kg"), p("Reeving parts", 4), p("System efficiency", 88, "%")],
    "Required line pull = mg / (n × η)", "Multi-part reeving hoist",
    (v) => {
      const load = v.load * G;
      return [["Required line pull", load / (v["reeving-parts"] * (v["system-efficiency"] / 100)), 1, "N", true],
        ["Load in kN", load / 1000, 1, "kN"], ["Mechanical advantage", v["reeving-parts"] * (v["system-efficiency"] / 100), 2, undefined]];
    }),

  // ── C27 Electrical Power (22) ──────────────────────────────────────────────
  mkx("ohms-law", [s("Solve", [["vi", "Given V and I"], ["vr", "Given V and R"], ["ir", "Given I and R"]], "vr"), p("Voltage", 12, "V"), p("Current", 2, "A"), p("Resistance", 4, "Ω")],
    "V = I·R; I = V/R; R = V/I", "Any two of V, I, R",
    (v) => {
      let volt = v.voltage, cur = v.current, res = v.resistance;
      const mode = String(v.solve);
      if (mode === "vi") res = volt / cur;
      else if (mode === "vr") cur = volt / res;
      else volt = cur * res;
      return [["Voltage", volt, 4, "V", true], ["Current", cur, 4, "A"], ["Resistance", res, 4, "Ω"], ["Power", volt * cur, 4, "W"]];
    }),

  mk("dc-power", [p("Voltage", 24, "V"), p("Current", 3.5, "A"), p("Resistance", 6.86, "Ω")],
    "P = V·I = I²R = V²/R", "DC power relationships",
    (v) => [["Power", v.voltage * v.current, 3, "W", true], ["Power from V²/R", (v.voltage ** 2) / v.resistance, 3, "W"], ["Energy in 1 hour", (v.voltage * v.current) / 1000, 4, "kWh"]]),

  mk("three-phase-power", [p("Line voltage", 400, "V"), p("Line current", 50, "A"), p("Power factor", 0.9)],
    "P = √3 · V_L · I_L · PF; S = √3 V I; Q = √(S² − P²)", "Balanced three-phase load",
    (v) => {
      const s0 = Math.sqrt(3) * v["line-voltage"] * v["line-current"];
      const p0 = s0 * v["power-factor"];
      return [["Active power", p0 / 1000, 3, "kW", true], ["Apparent power", s0 / 1000, 3, "kVA"], ["Reactive power", Math.sqrt(Math.max(0, s0 * s0 - p0 * p0)) / 1000, 3, "kVAR"]];
    }),

  mk("power-factor-correction", [p("Active power", 120, "kW"), p("Initial power factor", 0.78), p("Target power factor", 0.95), p("Frequency", 50, "Hz"), p("Voltage", 400, "V")],
    "kVAR = P (tan φ₁ − tan φ₂); C = kVAR / (2πf V²)", "Capacitor sizing for PF correction",
    (v) => {
      if (!(v["target-power-factor"] > v["initial-power-factor"])) return err("Target power factor must exceed the initial power factor.");
      const t1 = Math.tan(Math.acos(v["initial-power-factor"])), t2 = Math.tan(Math.acos(v["target-power-factor"]));
      const kvar = v["active-power"] * (t1 - t2);
      const c = (kvar * 1000) / (2 * Math.PI * v.frequency * v.voltage ** 2);
      return [["Reactive power to add", kvar, 2, "kVAR", true], ["Capacitance per phase", c * 1e6, 1, "µF"]];
    }),

  mk("voltage-drop-single-phase", [p("Current", 20, "A"), p("Cable length", 35, "m"), p("Resistance", 0.727, "Ω/km"), p("Voltage", 230, "V")],
    "ΔV = 2 · I · L · R (go and return conductor)", "Single-phase two-wire voltage drop",
    (v) => {
      const dv = 2 * v.current * (v["cable-length"] / 1000) * v.resistance;
      return [["Voltage drop", dv, 3, "V", true], ["Drop percentage", (dv / v.voltage) * 100, 2, "%"], ["Voltage at load", v.voltage - dv, 2, "V"]];
    }),

  mk("voltage-drop-three-phase", [p("Current", 60, "A"), p("Cable length", 120, "m"), p("Resistance", 0.161, "Ω/km"), p("Voltage", 400, "V")],
    "ΔV = √3 · I · L · R", "Three-phase voltage drop",
    (v) => {
      const dv = Math.sqrt(3) * v.current * (v["cable-length"] / 1000) * v.resistance;
      return [["Voltage drop", dv, 3, "V", true], ["Drop percentage", (dv / v.voltage) * 100, 2, "%"]];
    }),

  mk("wire-ampacity", [p("Design current", 42, "A"), p("Breaker multiplier", 1.25), p("Installed capacity", 50, "A")],
    "Required capacity = I × multiplier; compare with user-entered cable ampacity", "Parametric ampacity check",
    (v) => {
      const req = v["design-current"] * v["breaker-multiplier"];
      return [["Required circuit capacity", req, 2, "A", true], ["Status", req <= v["installed-capacity"] ? "Within entered capacity" : "Exceeds entered capacity"]];
    },
    { limitations: ["Ampacity tables (NEC 310.16, IEC 60364, BS 7671) are licensed and depend on insulation, installation method, ambient temperature and grouping. Sizes must be chosen from the governing wiring regulation by a licensed electrician."] }),

  mk("cable-resistance", [p("Length", 50, "m"), p("Area", 2.5, "mm²"), p("Resistivity", 1.724e-8, "Ω·m"), p("Temperature", 20, "°C"), p("Temp coefficient", 0.00393, "/°C")],
    "R = ρL/A × (1 + α(T − 20))", "Conductor resistance from resistivity",
    (v) => {
      const r20 = (v.resistivity * v.length) / (v.area * 1e-6);
      const r = r20 * (1 + v["temp-coefficient"] * (v.temperature - 20));
      return [["Conductor resistance", r, 4, "Ω", true], ["Resistance at 20 °C", r20, 4, "Ω"]];
    }),

  mk("energy-consumption-kwh", [p("Power", 1500, "W"), p("Hours per day", 6, "h"), p("Days", 30, "days")],
    "kWh = W × h × days / 1000", "Appliance energy consumption",
    (v) => [["Energy consumed", (v.power * v["hours-per-day"] * v.days) / 1000, 2, "kWh", true],
      ["Average daily energy", (v.power * v["hours-per-day"]) / 1000, 3, "kWh/day"]]),

  mk("electricity-cost", [p("Energy", 350, "kWh"), p("Rate", 0.28, "$/kWh"), z("Standing charge", 12, "$")],
    "Bill = kWh × rate + standing charge", "Single-rate tariff",
    (v) => [["Electricity bill", v.energy * v.rate + v["standing-charge"], 2, "$", true], ["Energy charge", v.energy * v.rate, 2, "$"]]),

  mk("breaker-sizing", [p("Continuous load", 32, "A"), p("Continuous factor", 1.25), p("Next standard size", 40, "A")],
    "Required = I_cont × 1.25; select standard rating ≥ required", "Parametric breaker selection",
    (v) => {
      const req = v["continuous-load"] * v["continuous-factor"];
      return [["Required ampacity", req, 1, "A", true], ["Selected rating adequate", req <= v["next-standard-size"] ? "Yes" : "No"]];
    },
    { limitations: ["Breaker and conductor sizing rules are mandated by licensed wiring codes (NEC 210.20, IEC 60364) and require licensed electrical design."] }),

  mk("transformer-kva", [p("Load", 320, "kW"), p("Power factor", 0.9), z("Design margin", 20, "%")],
    "kVA = kW / PF × (1 + margin%)", "Transformer sizing from load and power factor",
    (v) => [["Required transformer rating", (v.load / v["power-factor"]) * (1 + v["design-margin"] / 100), 2, "kVA", true],
      ["Apparent load", v.load / v["power-factor"], 2, "kVA"]]),

  mkx("motor-flc", [p("Rated power", 22, "kW"), p("Voltage", 400, "V"), p("Power factor", 0.86), p("Efficiency", 92, "%"), s("Phase", [["3", "Three-phase"], ["1", "Single-phase"]], "3")],
    "I = P / (√3 · V · PF · η) for three-phase", "Full-load current from nameplate data",
    (v) => {
      const denom = (Number(v.phase) === 3 ? Math.sqrt(3) : 1) * v.voltage * v["power-factor"] * (v.efficiency / 100);
      return [["Full-load current", (v["rated-power"] * 1000) / denom, 2, "A", true]];
    }),

  mk("motor-efficiency", [p("Input power", 18.5, "kW"), p("Output power", 16.2, "kW")],
    "η = P_out / P_in; losses = P_in − P_out", "Motor efficiency and losses",
    (v) => [["Efficiency", (v["output-power"] / v["input-power"]) * 100, 2, "%", true],
      ["Total losses", v["input-power"] - v["output-power"], 3, "kW"]]),

  mk("star-delta-conversion", [p("R1", 10, "Ω"), p("R2", 20, "Ω"), p("R3", 30, "Ω")],
    "Δ→Y: R_a = R_b R_c / (R_a + R_b + R_c) style transformation", "Balanced/unbalanced three-terminal networks",
    (v) => {
      const sum = v.r1 + v.r2 + v.r3;
      return [["Star equivalent Ra", (v.r2 * v.r3) / sum, 4, "Ω", true],
        ["Star equivalent Rb", (v.r1 * v.r3) / sum, 4, "Ω"],
        ["Star equivalent Rc", (v.r1 * v.r2) / sum, 4, "Ω"],
        ["Sum of delta resistors", sum, 2, "Ω"]];
    }),

  mkx("resistors-series-parallel", [s("Configuration", [["series", "Series"], ["parallel", "Parallel"]], "series"), p("R1", 100, "Ω"), p("R2", 220, "Ω"), p("R3", 470, "Ω")],
    "Series: ΣR; Parallel: 1/Σ(1/R)", "Three-resistor network",
    (v) => {
      const rs = [v.r1, v.r2, v.r3];
      const eq = v.configuration === "series" ? rs.reduce((a, b) => a + b, 0) : 1 / rs.reduce((a, b) => a + 1 / b, 0);
      return [["Equivalent resistance", eq, 3, "Ω", true]];
    }),

  mkx("capacitors-series-parallel", [s("Configuration", [["series", "Series"], ["parallel", "Parallel"]], "parallel"), n("C1", 10, "µF"), n("C2", 22, "µF"), n("C3", 47, "µF")],
    "Parallel: ΣC; Series: 1/Σ(1/C)", "Three-capacitor network (µF)",
    (v) => {
      const cs = [v.c1, v.c2, v.c3];
      if (cs.some((c) => c <= 0)) return err("Capacitance values must be positive.");
      const eq = v.configuration === "series" ? 1 / cs.reduce((a, b) => a + 1 / b, 0) : cs.reduce((a, b) => a + b, 0);
      return [["Equivalent capacitance", eq, 3, "µF", true]];
    }),

  mk("impedance-rlc", [p("Resistance", 100, "Ω"), p("Inductance", 150, "mH"), n("Capacitance", 22, "µF"), p("Frequency", 50, "Hz")],
    "X_L = 2πfL; X_C = 1/(2πfC); Z = √(R² + (X_L − X_C)²)", "Series RLC impedance",
    (v) => {
      if (v.capacitance <= 0) return err("Capacitance must be positive.");
      const xl = 2 * Math.PI * v.frequency * (v.inductance / 1000);
      const xc = 1 / (2 * Math.PI * v.frequency * (v.capacitance * 1e-6));
      const z = Math.hypot(v.resistance, xl - xc);
      return [["Impedance |Z|", z, 3, "Ω", true], ["Inductive reactance", xl, 3, "Ω"], ["Capacitive reactance", xc, 3, "Ω"],
        ["Phase angle", (Math.atan2(xl - xc, v.resistance) * 180) / Math.PI, 2, "°"]];
    }),

  mk("resonant-frequency", [p("Inductance", 10, "mH"), p("Capacitance", 100, "nF")],
    "f₀ = 1 / (2π√(LC))", "LC resonance",
    (v) => {
      const f = 1 / (2 * Math.PI * Math.sqrt((v.inductance / 1000) * (v.capacitance * 1e-9)));
      return [["Resonant frequency", f, 2, "Hz", true], ["Angular resonant frequency", 2 * Math.PI * f, 2, "rad/s"]];
    }),

  mkx("rms-value", [s("Waveform", [["sine", "Sine"], ["square", "Square"], ["triangle", "Triangle"]], "sine"), p("Peak amplitude", 325, "V")],
    "Sine: RMS = A/√2; Square: RMS = A; Triangle: RMS = A/√3", "AC waveform RMS and average",
    (v) => {
      const a = v["peak-amplitude"];
      const rms = v.waveform === "sine" ? a / Math.SQRT2 : v.waveform === "square" ? a : a / Math.sqrt(3);
      const avg = v.waveform === "sine" ? (2 * a) / Math.PI : v.waveform === "square" ? a : a / 2;
      return [["RMS value", rms, 3, "V", true], ["Average (rectified) value", avg, 3, "V"], ["Peak-to-peak", 2 * a, 3, "V"]];
    }),

  mk("turns-ratio", [p("Primary turns", 500), p("Secondary turns", 100), p("Primary voltage", 400, "V")],
    "N₁/N₂ = V₁/V₂ = I₂/I₁", "Ideal transformer turns ratio",
    (v) => {
      const ratio = v["primary-turns"] / v["secondary-turns"];
      return [["Turns ratio", ratio, 4, ": 1", true], ["Secondary voltage", v["primary-voltage"] / ratio, 2, "V"]];
    }),

  mk("earthing-resistance", [p("Soil resistivity", 100, "Ω·m"), p("Rod length", 3, "m"), p("Rod diameter", 16, "mm")],
    "R = (ρ / 2πL) · [ln(4L/d) − 1] (single driven rod)", "Dwight formula for a vertical earth rod",
    (v) => {
      const l = v["rod-length"], d = v["rod-diameter"] / 1000;
      const r = (v["soil-resistivity"] / (2 * Math.PI * l)) * (Math.log((4 * l) / d) - 1);
      return [["Single rod resistance", r, 2, "Ω", true]];
    },
    { limitations: ["Soil resistivity is highly variable and layered; actual earthing systems require field measurement and code-compliant design (IEEE 80 / IEC 62305) by a specialist."] }),

  // ── C28 Electronics Design (20) ────────────────────────────────────────────
  mk("voltage-divider", [p("Input voltage", 12, "V"), p("R1", 1000, "Ω"), p("R2", 470, "Ω")],
    "V_out = V_in · R2 / (R1 + R2)", "Unloaded resistive divider",
    (v) => [["Output voltage", (v["input-voltage"] * v.r2) / (v.r1 + v.r2), 4, "V", true],
      ["Divider current", v["input-voltage"] / (v.r1 + v.r2) * 1000, 3, "mA"]]),

  mk("current-divider", [p("Total current", 2, "A"), p("R1", 10, "Ω"), p("R2", 40, "Ω")],
    "I₁ = I_tot · R2/(R1 + R2); I₂ = I_tot · R1/(R1 + R2)", "Parallel branch currents",
    (v) => {
      const sum = v.r1 + v.r2;
      return [["Branch 1 current", (v["total-current"] * v.r2) / sum, 4, "A", true], ["Branch 2 current", (v["total-current"] * v.r1) / sum, 4, "A"]];
    }),

  mk("led-resistor", [p("Supply voltage", 5, "V"), p("LED forward voltage", 2.0, "V"), p("LED current", 15, "mA")],
    "R = (V_s − V_f) / I_f; P_R = I²R", "LED series resistor sizing",
    (v) => {
      if (v["supply-voltage"] <= v["led-forward-voltage"]) return err("Supply voltage must exceed the LED forward voltage.");
      const r = (v["supply-voltage"] - v["led-forward-voltage"]) / (v["led-current"] / 1000);
      return [["Series resistance", r, 1, "Ω", true], ["Nearest E24 value above", Math.ceil(r / 10) * 10, 0, "Ω"],
        ["Resistor dissipation", (v["led-current"] / 1000) ** 2 * r * 1000, 1, "mW"]];
    }),

  mk("rc-time-constant", [p("Resistance", 10, "kΩ"), n("Capacitance", 100, "µF")],
    "τ = R·C; V(t) = V₀(1 − e^(−t/τ))", "RC charging time constant",
    (v) => {
      if (v.capacitance <= 0) return err("Capacitance must be positive.");
      const tau = v.resistance * 1000 * v.capacitance * 1e-6;
      return [["Time constant τ", tau * 1000, 3, "ms", true], ["Time to 63.2% (1τ)", tau * 1000, 3, "ms"], ["Time to 99.3% (5τ)", tau * 5 * 1000, 2, "ms"]];
    }),

  mk("rl-time-constant", [p("Resistance", 100, "Ω"), p("Inductance", 10, "mH")],
    "τ = L / R", "RL current rise time constant",
    (v) => [["Time constant τ", ((v.inductance / 1000) / v.resistance) * 1e6, 2, "µs", true]]),

  mk("lc-resonance", [p("Inductance", 100, "µH"), p("Capacitance", 100, "pF"), p("Series resistance", 5, "Ω")],
    "f₀ = 1/(2π√LC); Q = (1/R)√(L/C)", "Series LC tank quality factor",
    (v) => {
      const l = v.inductance * 1e-6, c = v.capacitance * 1e-12;
      const f = 1 / (2 * Math.PI * Math.sqrt(l * c));
      return [["Resonant frequency", f, 0, "Hz", true], ["Quality factor Q", (1 / v["series-resistance"]) * Math.sqrt(l / c), 2],
        ["Bandwidth", f / ((1 / v["series-resistance"]) * Math.sqrt(l / c)), 0, "Hz"]];
    }),

  mkx("opamp-gain", [s("Configuration", [["inv", "Inverting"], ["noninv", "Non-inverting"]], "noninv"), p("R1", 1000, "Ω"), p("R2", 9000, "Ω")],
    "Inverting: −R2/R1; Non-inverting: 1 + R2/R1", "Ideal op-amp gain",
    (v) => {
      const g = v.configuration === "inv" ? -(v.r2 / v.r1) : 1 + v.r2 / v.r1;
      return [["Closed-loop gain", g, 3, "×", true], ["Gain in dB", 20 * Math.log10(Math.abs(g)), 2, "dB"]];
    }),

  mk("transistor-bias", [p("Supply voltage", 12, "V"), p("Base resistance", 220, "kΩ"), p("Collector resistance", 2.2, "kΩ"), p("Current gain beta", 150)],
    "Fixed-bias Q-point: I_B = (Vcc − 0.7)/R_B; I_C = βI_B", "Simple NPN fixed-bias analysis",
    (v) => {
      const ib = (v["supply-voltage"] - 0.7) / (v["base-resistance"] * 1000);
      const ic = v["current-gain-beta"] * ib;
      const vce = v["supply-voltage"] - ic * v["collector-resistance"] * 1000;
      return [["Base current", ib * 1e6, 2, "µA", true], ["Collector current", ic * 1000, 2, "mA"],
        ["V_CE (Q-point)", vce, 2, "V"], ["Operating region", vce > 0.3 ? "Active" : "Saturation"]];
    }),

  mk("rectifier-ripple", [p("Capacitance", 1000, "µF"), p("Load current", 1, "A"), p("Frequency", 50, "Hz"), p("Full wave", 1)],
    "V_ripple ≈ I / (2 f C) for full-wave", "Capacitor-input rectifier ripple estimate",
    (v) => {
      const div = v["full-wave"] >= 1 ? 2 : 1;
      return [["Peak-to-peak ripple", v["load-current"] / (div * v.frequency * (v.capacitance * 1e-6)), 3, "V", true]];
    }),

  mk("zener-regulator", [p("Input voltage", 15, "V"), p("Zener voltage", 9, "V"), p("Load current", 20, "mA"), p("Minimum zener current", 5, "mA")],
    "R_s = (V_in − V_z) / (I_L + I_Z)", "Series resistor for a shunt zener regulator",
    (v) => {
      const r = (v["input-voltage"] - v["zener-voltage"]) / ((v["load-current"] + v["minimum-zener-current"]) / 1000);
      return [["Series resistance", r, 1, "Ω", true], ["Power dissipated in resistor", (v["input-voltage"] - v["zener-voltage"]) ** 2 / r, 2, "W"]];
    }),

  mk("pcb-trace-width", [p("Current", 3, "A"), z("Temperature rise", 10, "°C"), p("Copper thickness", 1, "oz")],
    "IPC-2221 style parametric: A = (I / (k · ΔT^0.44))^(1/0.725); width = A / thickness", "Parametric trace sizing",
    (v) => {
      const tMm = v["copper-thickness"] * 0.0348;
      const area = Math.pow(v.current / (0.048 * Math.pow(v["temperature-rise"], 0.44)), 1 / 0.725);
      return [["Trace cross-section", area, 1, "mil²", true], ["Indicative trace width", (area / 1000) * 25.4 / tMm, 2, "mm"]];
    },
    { limitations: ["IPC-2221 nominal charts are an industry standard; this reproduces the published curve-fit parametically. Verify against the current IPC standard and your fabricator's capability."] }),

  mkx("resistor-colour-code", [t("Bands", "brown black red gold", { helper: "Four or five colour bands, e.g. brown black red gold" })],
    "Digit colours: black0 brown1 red2 orange3 yellow4 green5 blue6 violet7 grey8 white9", "band colours",
    (v) => {
      const map: Record<string, number> = { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, grey: 8, gray: 8, white: 9 };
      const mult: Record<string, number> = { ...map, gold: -1, silver: -2 };
      const parts = String(v.bands).toLowerCase().trim().split(/[\s,]+/).filter(Boolean);
      if (parts.length < 4 || parts.length > 5) return err("Enter 4 or 5 colour bands (e.g. brown black red gold).");
      const digits = parts.slice(0, parts.length - 2).map((c) => map[c]);
      if (digits.some((d) => d === undefined)) return err("Unrecognised digit band colour.");
      const m = mult[parts[parts.length - 2]];
      if (m === undefined) return err("Unrecognised multiplier band colour.");
      const value = Number(digits.join("")) * Math.pow(10, m);
      const tol = parts[parts.length - 1] === "gold" ? 5 : parts[parts.length - 1] === "silver" ? 10 : 20;
      return [["Resistance", value, 2, "Ω", true], ["Tolerance", tol, 0, "%"], ["Range", `${(value * (1 - tol / 100)).toFixed(1)} – ${(value * (1 + tol / 100)).toFixed(1)} Ω`]];
    }),

  mkx("capacitor-code", [t("Code", "104", { helper: "3-digit code: first two digits × 10^third, in pF" })],
    "3-digit code: value = (d₁d₂) × 10^d₃ pF", "printed capacitor code",
    (v) => {
      const code = String(v.code).trim();
      if (!/^\d{3}$/.test(code)) return err("Enter exactly three digits (e.g. 104).");
      const pf = Number(code.slice(0, 2)) * Math.pow(10, Number(code[2]));
      return [["Capacitance", pf / 1e6, 4, "µF", true], ["Capacitance", pf, 0, "pF"], ["Capacitance", pf / 1e9, 6, "mF"]];
    }),

  mk("filter-cutoff", [p("Resistance", 10, "kΩ"), p("Capacitance", 10, "nF")],
    "f_c = 1 / (2πRC)", "First-order RC filter cutoff",
    (v) => {
      const f = 1 / (2 * Math.PI * v.resistance * 1000 * v.capacitance * 1e-9);
      return [["Cutoff frequency (−3 dB)", f, 2, "Hz", true], ["Time constant", 1 / (2 * Math.PI * f) * 1000, 3, "ms"]];
    }),

  mkx("gain-db", [s("Convert", [["ratio", "Ratio → dB"], ["db", "dB → Ratio"]], "ratio"), p("Value", 10)],
    "dB = 20 log₁₀(A) for amplitude; 10 log₁₀(P) for power", "Amplitude/power decibel conversion",
    (v) => [["Decibels (amplitude)", 20 * Math.log10(v.value), 3, "dB", true], ["Decibels (power)", 10 * Math.log10(v.value), 3, "dB"]]),

  mk("snr", [p("Signal power", 1, "mW"), p("Noise power", 0.000001, "mW")],
    "SNR_dB = 10 log₁₀(P_signal / P_noise)", "Signal-to-noise ratio",
    (v) => [["SNR", 10 * Math.log10(v["signal-power"] / v["noise-power"]), 2, "dB", true],
      ["Shannon capacity per Hz", Math.log2(1 + v["signal-power"] / v["noise-power"]), 3, "b/s/Hz"]]),

  mk("ne555-timer", [p("R1", 10, "kΩ"), p("R2", 47, "kΩ"), p("Capacitance", 10, "nF")],
    "Astable: f = 1.44 / ((R1 + 2R2)C); duty = (R1 + R2)/(R1 + 2R2)", "555 astable oscillator",
    (v) => {
      const r1 = v.r1 * 1000, r2 = v.r2 * 1000, c = v.capacitance * 1e-9;
      const f = 1.44 / ((r1 + 2 * r2) * c);
      return [["Frequency", f, 2, "Hz", true], ["Duty cycle", ((r1 + r2) / (r1 + 2 * r2)) * 100, 2, "%"], ["Period", (1 / f) * 1000, 3, "ms"]];
    }),

  mk("pwm-duty", [p("On time", 1.5, "ms"), p("Period", 10, "ms"), p("Supply voltage", 12, "V")],
    "D = t_on / T; V_avg = D · V_supply", "Pulse-width modulation duty cycle",
    (v) => {
      if (v["on-time"] > v.period) return err("On time cannot exceed the PWM period.");
      const d = v["on-time"] / v.period;
      return [["Duty cycle", d * 100, 2, "%", true], ["Average voltage", d * v["supply-voltage"], 3, "V"], ["Frequency", 1000 / v.period, 2, "Hz"]];
    }),

  mk("adc-resolution", [it("Bits", 12, { min: 1, max: 32 }), p("Reference voltage", 3.3, "V")],
    "LSB = V_ref / 2^n; codes = 2^n", "ADC quantisation",
    (v) => {
      const codes = Math.pow(2, v.bits);
      return [["Number of codes", codes, 0, undefined, true], ["LSB size", (v["reference-voltage"] / codes) * 1e6, 2, "µV"], ["LSB size", (v["reference-voltage"] / codes) * 1000, 4, "mV"]];
    }),

  mk("pullup-resistor", [p("Bus capacitance", 200, "pF"), p("Bus speed", 400, "kHz"), p("Supply voltage", 3.3, "V"), p("Sink current", 3, "mA")],
    "t_r ≤ 0.3/f; R_max = t_r / (0.8473 C); R_min = (V − V_OL)/I_sink", "I²C pull-up resistor window",
    (v) => {
      const tr = 0.3 / (v["bus-speed"] * 1000);
      const rmax = tr / (0.8473 * v["bus-capacitance"] * 1e-12);
      const rmin = (v["supply-voltage"] - 0.4) / (v["sink-current"] / 1000);
      return [["Maximum pull-up", rmax, 0, "Ω", true], ["Minimum pull-up", rmin, 0, "Ω"],
        ["Status", rmin <= rmax ? "Feasible window exists" : "No feasible value — reduce capacitance or bus speed"]];
    }),

  // ── C29 Chemical Engineering (12) ──────────────────────────────────────────
  mk("reactor-residence-time", [p("Reactor volume", 10, "m³"), p("Volumetric flow", 2.5, "m³/h")],
    "τ = V / Q", "CSTR mean residence time",
    (v) => [["Residence time", v["reactor-volume"] / v["volumetric-flow"], 3, "h", true], ["Residence time", (v["reactor-volume"] / v["volumetric-flow"]) * 60, 1, "min"]]),

  mk("conversion-selectivity", [p("Feed flow", 100, "mol/s"), p("Reactant in outlet", 25, "mol/s"), p("Desired product", 40, "mol/s"), p("Undesired product", 10, "mol/s")],
    "X = (F_in − F_out)/F_in; S = P_desired / (P_desired + P_undesired)", "Conversion and selectivity definitions",
    (v) => {
      const conv = (v["feed-flow"] - v["reactant-in-outlet"]) / v["feed-flow"];
      const sel = v["desired-product"] / (v["desired-product"] + v["undesired-product"]);
      return [["Conversion", conv * 100, 2, "%", true], ["Selectivity", sel * 100, 2, "%"], ["Yield", conv * sel * 100, 2, "%"]];
    }),

  mk("mass-balance", [p("Inlet stream 1", 250, "kg/h"), p("Inlet stream 2", 150, "kg/h"), p("Outlet stream", 380, "kg/h")],
    "Accumulation = Σ inflows − Σ outflows", "Steady-state overall mass balance",
    (v) => {
      const acc = v["inlet-stream-1"] + v["inlet-stream-2"] - v["outlet-stream"];
      return [["Accumulation rate", acc, 2, "kg/h", true], ["Balance status", Math.abs(acc) < 1e-9 ? "Balanced" : acc > 0 ? "Accumulating" : "Depleting"]];
    }),

  mk("mole-fraction-partial-pressure", [p("Total pressure", 101.325, "kPa"), p("Mole fraction", 0.21)],
    "p_i = y_i · P (Dalton's law)", "Ideal-gas partial pressure",
    (v) => [["Partial pressure", v["total-pressure"] * v["mole-fraction"], 3, "kPa", true]]),

  mkx("ideal-gas-law", [s("Solve", [["pvtn", "P from V,T,n"], ["np", "n from P,V,T"]], "pvtn"), p("Pressure", 101.325, "kPa"), p("Volume", 0.024, "m³"), p("Temperature", 298.15, "K"), p("Moles", 1)],
    "PV = nRT, R = 8.314462618 J/(mol·K)", "Ideal gas state",
    (v) => {
      const r = 8.314462618;
      if (v.solve === "np") {
        const n = (v.pressure * 1000 * v.volume) / (r * v.temperature);
        return [["Moles n", n, 5, "mol", true]];
      }
      const p0 = (v.moles * r * v.temperature) / v.volume / 1000;
      return [["Pressure P", p0, 4, "kPa", true], ["Molar volume", v.volume / v.moles, 5, "m³/mol"]];
    }),

  mk("van-der-waals", [p("Moles", 1), p("Temperature", 300, "K"), p("Volume", 0.0245, "m³"), p("a", 0.364, "Pa·m⁶/mol²"), p("b", 4.27e-5, "m³/mol")],
    "P = nRT/(V − nb) − an²/V²", "Van der Waals real-gas equation",
    (v) => {
      const r = 8.314462618;
      const p0 = (v.moles * r * v.temperature) / (v.volume - v.moles * v.b) - (v.a * v.moles ** 2) / v.volume ** 2;
      return [["Pressure P", p0 / 1000, 4, "kPa", true], ["Compressibility factor Z", (p0 * v.volume) / (v.moles * r * v.temperature), 4]];
    }),

  mk("humidity-ratio", [p("Temperature", 25, "°C"), p("Relative humidity", 60, "%"), p("Total pressure", 101.325, "kPa")],
    "W = 0.622 · p_w / (P − p_w); p_w = RH × p_sat (Antoine/Magnus)", "Psychrometric humidity ratio",
    (v) => {
      const psat = 0.61094 * Math.exp((17.625 * v.temperature) / (v.temperature + 243.04));
      const pw = (v["relative-humidity"] / 100) * psat;
      const w = (0.622 * pw) / (v["total-pressure"] - pw);
      return [["Humidity ratio", w * 1000, 3, "g/kg dry air", true], ["Saturation pressure", psat, 4, "kPa"]];
    },
    { assumptions: ["Magnus-Tetens saturation pressure coefficients (a = 17.625, b = 243.04 °C) apply over roughly −40 to 50 °C."] }),

  mk("moist-air-enthalpy", [p("Temperature", 25, "°C"), p("Humidity ratio", 11.9, "g/kg")],
    "h = 1.006 T + W(2501 + 1.86 T) kJ/kg dry air", "Psychrometric enthalpy",
    (v) => {
      const w = v["humidity-ratio"] / 1000;
      return [["Specific enthalpy", 1.006 * v.temperature + w * (2501 + 1.86 * v.temperature), 3, "kJ/kg", true]];
    }),

  mk("distillation-balance", [p("Feed flow", 100, "kmol/h"), p("Feed light fraction", 0.40), p("Distillate purity", 0.95), p("Bottoms light fraction", 0.02)],
    "F z = D x_D + B x_B with F = D + B", "Binary distillation material balance",
    (v) => {
      const f = v["feed-flow"], z = v["feed-light-fraction"], xd = v["distillate-purity"], xb = v["bottoms-light-fraction"];
      if (Math.abs(xd - xb) < 1e-9) return err("Distillate and bottoms compositions must differ.");
      const d = (f * (z - xb)) / (xd - xb);
      return [["Distillate flow", d, 2, "kmol/h", true], ["Bottoms flow", f - d, 2, "kmol/h"], ["Light recovery", (d * xd) / (f * z) * 100, 2, "%"]];
    }),

  mk("crystallisation-yield", [p("Feed mass", 1000, "kg"), p("Feed concentration", 30, "%"), p("Solubility at temperature", 18, "kg per 100 kg solvent")],
    "Yield = feed solute − solute remaining dissolved in mother liquor", "Cooling crystallisation estimate",
    (v) => {
      const solute = (v["feed-mass"] * v["feed-concentration"]) / 100, solvent = v["feed-mass"] - solute;
      const remaining = (solvent * v["solubility-at-temperature"]) / 100;
      const yieldKg = Math.max(0, solute - remaining);
      return [["Crystal yield", yieldKg, 2, "kg", true], ["Recovery", (yieldKg / solute) * 100, 2, "%"]];
    }),

  mk("drying-rate", [p("Initial moisture", 45, "kg"), p("Final moisture", 8, "kg"), p("Drying area", 12, "m²"), p("Drying time", 6, "h")],
    "Rate = moisture removed / (area × time)", "Average drying flux",
    (v) => {
      const removed = v["initial-moisture"] - v["final-moisture"];
      if (removed < 0) return err("Initial moisture must exceed final moisture.");
      return [["Moisture removed", removed, 2, "kg", true], ["Average drying rate", removed / (v["drying-area"] * v["drying-time"]), 4, "kg/m²·h"]];
    }),

  mk("blending-composition", [p("Stream 1 mass", 400, "kg"), p("Stream 1 assay", 92, "%"), p("Stream 2 mass", 250, "kg"), p("Stream 2 assay", 68, "%")],
    "Assay_blend = Σ(mᵢ aᵢ) / Σmᵢ", "Two-stream mass blending",
    (v) => {
      const tot = v["stream-1-mass"] + v["stream-2-mass"];
      return [["Blended assay", (v["stream-1-mass"] * v["stream-1-assay"] + v["stream-2-mass"] * v["stream-2-assay"]) / tot, 3, "%", true], ["Total blended mass", tot, 1, "kg"]];
    }),

  // ── C30 Fluid Mechanics and Hydraulics (16) ────────────────────────────────
  mk("flow-rate-av", [p("Area", 0.0314, "m²"), p("Velocity", 2.5, "m/s")],
    "Q = A · v", "Continuity equation",
    (v) => [["Volumetric flow", v.area * v.velocity, 5, "m³/s", true], ["Flow in litres/min", v.area * v.velocity * 60000, 1, "L/min"], ["Flow in m³/h", v.area * v.velocity * 3600, 2, "m³/h"]]),

  mk("reynolds-number", [p("Density", 998, "kg/m³"), p("Velocity", 2, "m/s"), p("Diameter", 0.05, "m"), p("Dynamic viscosity", 0.001002, "Pa·s")],
    "Re = ρ v D / μ", "Reynolds number and flow regime",
    (v) => {
      const re = (v.density * v.velocity * v.diameter) / v["dynamic-viscosity"];
      return [["Reynolds number", re, 0, undefined, true],
        ["Flow regime", re < 2300 ? "Laminar" : re > 4000 ? "Turbulent" : "Transitional"],
        ["Velocity head", (v.velocity ** 2) / (2 * G), 4, "m"]];
    }),

  mk("darcy-weisbach", [p("Friction factor", 0.02), p("Length", 100, "m"), p("Diameter", 0.1, "m"), p("Velocity", 2, "m/s"), p("Gravity", G, "m/s²")],
    "h_f = f (L/D)(v²/2g)", "Darcy–Weisbach head loss",
    (v) => {
      const hf = (v["friction-factor"] * (v.length / v.diameter) * v.velocity ** 2) / (2 * v.gravity);
      return [["Head loss", hf, 3, "m", true], ["Pressure drop", hf * 998 * G / 1000, 3, "kPa"]];
    }),

  mk("hazen-williams", [p("Flow", 0.05, "m³/s"), p("C factor", 130), p("Diameter", 0.25, "m"), p("Length", 500, "m")],
    "h_f = 10.67 L Q^1.852 / (C^1.852 D^4.87)", "Hazen–Williams head loss (SI)",
    (v) => [["Head loss", (10.67 * v.length * Math.pow(v.flow, 1.852)) / (Math.pow(v["c-factor"], 1.852) * Math.pow(v.diameter, 4.87)), 3, "m", true]]),

  mk("manning-equation", [p("Manning n", 0.013), p("Hydraulic radius", 0.3, "m"), p("Slope", 0.001), p("Flow area", 1.2, "m²")],
    "v = (1/n) R^(2/3) S^(1/2); Q = A v", "Manning's equation for open channels",
    (v) => {
      const vel = (1 / v["manning-n"]) * Math.pow(v["hydraulic-radius"], 2 / 3) * Math.sqrt(v.slope);
      return [["Flow velocity", vel, 3, "m/s", true], ["Discharge", vel * v["flow-area"], 3, "m³/s"]];
    }),

  mk("colebrook-friction-factor", [p("Reynolds number", 100000), p("Relative roughness", 0.0005)],
    "1/√f = −2 log₁₀(ε/3.7D + 2.51/(Re√f)) — solved iteratively", "Colebrook–White turbulent friction factor",
    (v) => {
      let f = 0.02;
      for (let i = 0; i < 60; i++) {
        const next = Math.pow(-2 * Math.log10(v["relative-roughness"] / 3.7 + 2.51 / (v["reynolds-number"] * Math.sqrt(f))), -2);
        if (Math.abs(next - f) < 1e-10) { f = next; break; }
        f = next;
      }
      return [["Darcy friction factor f", f, 5, undefined, true]];
    }),

  mk("bernoulli", [p("Pressure at 1", 200, "kPa"), p("Velocity at 1", 3, "m/s"), p("Elevation at 1", 2, "m"), p("Velocity at 2", 6, "m/s"), p("Elevation at 2", 5, "m"), p("Density", 998, "kg/m³")],
    "p₁ + ½ρv₁² + ρgz₁ = p₂ + ½ρv₂² + ρgz₂", "Steady incompressible Bernoulli (no losses)",
    (v) => {
      const total = v["pressure-at-1"] * 1000 + 0.5 * v.density * v["velocity-at-1"] ** 2 + v.density * G * v["elevation-at-1"];
      const p2 = total - 0.5 * v.density * v["velocity-at-2"] ** 2 - v.density * G * v["elevation-at-2"];
      return [["Pressure at point 2", p2 / 1000, 3, "kPa", true], ["Total head", total / (v.density * G), 3, "m"]];
    }),

  mk("pump-power", [p("Flow", 0.02, "m³/s"), p("Head", 35, "m"), p("Efficiency", 72, "%"), p("Density", 998, "kg/m³")],
    "P_shaft = ρ g Q H / η", "Pump shaft power",
    (v) => {
      const ps = (v.density * G * v.flow * v.head) / (v.efficiency / 100);
      return [["Shaft power", ps / 1000, 2, "kW", true], ["Hydraulic power", (v.density * G * v.flow * v.head) / 1000, 2, "kW"]];
    }),

  mk("pump-head", [p("Pressure rise", 350, "kPa"), p("Density", 998, "kg/m³")],
    "H = Δp / (ρ g)", "Head equivalent of a pressure rise",
    (v) => [["Equivalent head", (v["pressure-rise"] * 1000) / (v.density * G), 3, "m", true]]),

  mk("pipe-volume", [p("Diameter", 0.15, "m"), p("Length", 50, "m"), z("Flow", 0.005, "m³/s")],
    "V = πD²L/4; fill time = V/Q", "Pipe internal volume",
    (v) => {
      const vol = (Math.PI * v.diameter ** 2 * v.length) / 4;
      return [["Pipe volume", vol, 4, "m³", true], ["Volume in litres", vol * 1000, 1, "L"], ["Fill time at entered flow", vol / v.flow, 1, "s"]];
    }),

  mk("pipe-diameter-sizing", [p("Flow", 0.015, "m³/s"), p("Maximum velocity", 1.5, "m/s")],
    "D = √(4Q / (π v_max))", "Pipe sizing for a velocity limit",
    (v) => {
      const d = Math.sqrt((4 * v.flow) / (Math.PI * v["maximum-velocity"]));
      return [["Required internal diameter", d * 1000, 1, "mm", true], ["Flow area", (Math.PI * d * d) / 4, 5, "m²"]];
    }),

  mk("orifice-flow", [p("Orifice area", 0.0005, "m²"), p("Pressure drop", 50000, "Pa"), p("Discharge coefficient", 0.62), p("Density", 998, "kg/m³")],
    "Q = C_d A √(2Δp/ρ)", "Orifice discharge",
    (v) => [["Discharge", v["discharge-coefficient"] * v["orifice-area"] * Math.sqrt((2 * v["pressure-drop"]) / v.density), 6, "m³/s", true]]),

  mk("rectangular-weir", [p("Head", 0.3, "m"), p("Crest width", 1.5, "m"), p("Discharge coefficient", 0.62)],
    "Q = (2/3) C_d b √(2g) H^1.5", "Sharp-crested rectangular weir",
    (v) => [["Discharge", (2 / 3) * v["discharge-coefficient"] * v["crest-width"] * Math.sqrt(2 * G) * Math.pow(v.head, 1.5), 4, "m³/s", true]]),

  mk("hydrostatic-pressure", [p("Depth", 5, "m"), p("Density", 1025, "kg/m³")],
    "p = ρ g h", "Hydrostatic pressure at depth",
    (v) => [["Gauge pressure", (v.density * G * v.depth) / 1000, 2, "kPa", true], ["Pressure", (v.density * G * v.depth) / 1000 + 101.325, 2, "kPa abs"]]),

  mk("buoyancy", [p("Submerged volume", 0.8, "m³"), p("Fluid density", 1025, "kg/m³")],
    "F_b = ρ_fluid · V · g", "Archimedes buoyant force",
    (v) => [["Buoyant force", v["submerged-volume"] * v["fluid-density"] * G, 1, "N", true],
      ["Equivalent displaced mass", v["submerged-volume"] * v["fluid-density"], 1, "kg"]]),

  mk("terminal-velocity", [p("Mass", 0.02, "kg"), p("Area", 0.0012, "m²"), p("Drag coefficient", 0.47), p("Fluid density", 1.225, "kg/m³")],
    "v_t = √(2mg / (ρ A C_d))", "Terminal velocity for quadratic drag",
    (v) => [["Terminal velocity", Math.sqrt((2 * v.mass * G) / (v["fluid-density"] * v.area * v["drag-coefficient"])), 3, "m/s", true]]),

  // ── C31 Heat Transfer and HVAC (18) ────────────────────────────────────────
  mk("conduction-fourier", [p("Conductivity", 0.6, "W/m·K"), p("Area", 12, "m²"), p("Temperature difference", 18, "K"), p("Thickness", 0.1, "m")],
    "q = k A ΔT / L", "Fourier steady conduction through a plane wall",
    (v) => [["Heat transfer rate", (v.conductivity * v.area * v["temperature-difference"]) / v.thickness, 2, "W", true],
      ["Heat flux", (v.conductivity * v["temperature-difference"]) / v.thickness, 2, "W/m²"]]),

  mk("convection-newton", [p("Convection coefficient", 25, "W/m²·K"), p("Area", 8, "m²"), p("Temperature difference", 20, "K")],
    "q = h A ΔT", "Newton's law of cooling",
    (v) => [["Convective heat rate", v["convection-coefficient"] * v.area * v["temperature-difference"], 1, "W", true]]),

  mk("radiation-stefan", [n("Emissivity", 0.9), p("Area", 2, "m²"), p("Surface temperature", 320, "K"), p("Surroundings", 293, "K")],
    "q = ε σ A (T_s⁴ − T_surr⁴), σ = 5.670374e-8", "Stefan–Boltzmann net radiation",
    (v) => {
      const sigma = 5.670374419e-8;
      const q = v.emissivity * sigma * v.area * (v["surface-temperature"] ** 4 - v.surroundings ** 4);
      return [["Net radiative heat transfer", q, 2, "W", true]];
    }),

  mk("lmtd", [p("Hot inlet", 90, "°C"), p("Hot outlet", 60, "°C"), p("Cold inlet", 25, "°C"), p("Cold outlet", 45, "°C")],
    "LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂)", "Counter-flow log-mean temperature difference",
    (v) => {
      const d1 = v["hot-inlet"] - v["cold-outlet"], d2 = v["hot-outlet"] - v["cold-inlet"];
      if (d1 <= 0 || d2 <= 0) return err("Temperature differences must be positive (check flow arrangement and terminal temperatures).");
      const lmtd = Math.abs(d1 - d2) < 1e-9 ? d1 : (d1 - d2) / Math.log(d1 / d2);
      return [["LMTD", lmtd, 3, "K", true], ["ΔT₁", d1, 2, "K"], ["ΔT₂", d2, 2, "K"]];
    }),

  mk("overall-heat-transfer", [p("Inside film resistance", 0.0002, "m²·K/W"), p("Wall resistance", 0.0005, "m²·K/W"), p("Outside film resistance", 0.0003, "m²·K/W"), p("Fouling resistance", 0.0001, "m²·K/W")],
    "1/U = ΣR", "Overall heat-transfer coefficient",
    (v) => {
      const sum = v["inside-film-resistance"] + v["wall-resistance"] + v["outside-film-resistance"] + v["fouling-resistance"];
      return [["Overall coefficient U", 1 / sum, 2, "W/m²·K", true], ["Total resistance", sum, 6, "m²·K/W"]];
    }),

  mk("heat-exchanger-area", [p("Heat duty", 250000, "W"), p("Overall coefficient", 450, "W/m²·K"), p("LMTD", 32, "K")],
    "A = Q / (U · LMTD)", "Heat exchanger surface area",
    (v) => [["Required area", v["heat-duty"] / (v["overall-coefficient"] * v.lmtd), 3, "m²", true]]),

  mk("sensible-heat", [p("Mass", 500, "kg"), p("Specific heat", 4.186, "kJ/kg·K"), p("Temperature change", 12, "K")],
    "Q = m c ΔT", "Sensible heat transfer",
    (v) => [["Heat energy", v.mass * v["specific-heat"] * v["temperature-change"], 1, "kJ", true],
      ["Energy", (v.mass * v["specific-heat"] * v["temperature-change"]) / 3600, 3, "kWh"]]),

  mk("latent-heat", [p("Mass", 25, "kg"), p("Latent heat", 2260, "kJ/kg")],
    "Q = m · h_fg", "Latent heat of phase change",
    (v) => [["Latent heat energy", v.mass * v["latent-heat"], 1, "kJ", true], ["Energy", (v.mass * v["latent-heat"]) / 3600, 3, "kWh"]]),

  mk("hvac-tonnage", [p("Floor area", 180, "m²"), p("Cooling load", 120, "W/m²")],
    "Capacity = area × load; 1 ton refrigeration = 3.516853 kW", "Cooling tonnage from a load index",
    (v) => {
      const kw = (v["floor-area"] * v["cooling-load"]) / 1000;
      return [["Cooling capacity required", kw, 2, "kW", true], ["In refrigeration tons", kw / 3.5168525, 2, "TR"], ["In BTU/h", kw * 3412.142, 0, "BTU/h"]];
    }),

  mk("u-value-r-value", [p("Inner layer thickness", 0.1, "m"), p("Inner conductivity", 0.04, "W/m·K"), p("Outer layer thickness", 0.2, "m"), p("Outer conductivity", 0.6, "W/m·K"), p("Surface films", 0.17, "m²·K/W")],
    "R_total = Σ(L/k) + R_film; U = 1 / R_total", "Layer thicknesses, conductivities and film resistance",
    (v) => {
      const r1 = v["inner-layer-thickness"] / v["inner-conductivity"];
      const r2 = v["outer-layer-thickness"] / v["outer-conductivity"];
      const total = r1 + r2 + v["surface-films"];
      return [["Total thermal resistance R", total, 4, "m²·K/W", true],
        ["U-value", 1 / total, 4, "W/m²·K"],
        ["Inner layer R", r1, 4, "m²·K/W"],
        ["Outer layer R", r2, 4, "m²·K/W"]];
    }),

  mk("cop-refrigeration", [p("Cooling delivered", 7.5, "kW"), p("Compressor work", 2.1, "kW")],
    "COP = Q_c / W", "Coefficient of performance",
    (v) => [["COP (cooling)", v["cooling-delivered"] / v["compressor-work"], 3, undefined, true],
      ["EER (BTU/Wh)", (v["cooling-delivered"] / v["compressor-work"]) * 3.412142, 2, "BTU/Wh"]]),

  mk("carnot-efficiency", [p("Hot reservoir", 320, "K"), p("Cold reservoir", 275, "K")],
    "η = 1 − T_c/T_h; COP_HP = T_h/(T_h − T_c)", "Carnot limits",
    (v) => {
      if (v["hot-reservoir"] <= v["cold-reservoir"]) return err("Hot reservoir temperature must exceed the cold reservoir.");
      const d = v["hot-reservoir"] - v["cold-reservoir"];
      return [["Carnot efficiency", (d / v["hot-reservoir"]) * 100, 2, "%", true],
        ["Carnot COP (heat pump)", v["hot-reservoir"] / d, 3],
        ["Carnot COP (refrigerator)", v["cold-reservoir"] / d, 3]];
    }),

  mk("cooling-load-simple", [p("Floor area", 150, "m²"), p("Occupants", 20), p("Equipment load", 2.5, "kW"), p("Load per person", 75, "W"), p("Envelope load", 45, "W/m²")],
    "Q = area·envelope + occupants·person + equipment", "Parametric cooling load build-up",
    (v) => {
      const w = v["floor-area"] * v["envelope-load"] + v.occupants * v["load-per-person"] + v["equipment-load"] * 1000;
      return [["Total cooling load", w / 1000, 2, "kW", true], ["In refrigeration tons", w / 1000 / 3.5168525, 2, "TR"],
        ["Per m²", w / v["floor-area"], 1, "W/m²"]];
    }),

  mk("duct-sizing", [p("Airflow", 0.6, "m³/s"), p("Maximum velocity", 6, "m/s")],
    "A = Q / v; D = √(4A/π)", "Circular duct sizing",
    (v) => {
      const a = v.airflow / v["maximum-velocity"];
      return [["Duct cross-section", a, 4, "m²", true], ["Equivalent round diameter", Math.sqrt((4 * a) / Math.PI) * 1000, 0, "mm"],
        ["Airflow in CFM", v.airflow * 2118.880003, 0, "CFM"]];
    }),

  mk("pipe-insulation", [p("Temperature difference", 60, "K"), p("Conductivity", 0.04, "W/m·K"), p("Surface coefficient", 10, "W/m²·K")],
    "Parametric: R_ins = ΔT/q_target; thickness ≈ k / h_surface equivalent", "Insulation thickness estimate",
    (v) => [["Equivalent insulation thickness", ((v.conductivity / v["surface-coefficient"]) * 1000) * (v["temperature-difference"] / 60 + 1), 1, "mm", true]],
    { limitations: ["Simplified estimate only. Economic and condensation-limit insulation thickness requires full heat-loss and dew-point analysis."] }),

  mk("specific-heat-energy", [p("Mass", 2.5, "kg"), p("Specific heat", 0.9, "kJ/kg·K"), p("Temperature change", 40, "K")],
    "Q = m c ΔT", "Specific heat energy",
    (v) => [["Energy", v.mass * v["specific-heat"] * v["temperature-change"], 2, "kJ", true]]),

  mk("fluid-thermal-expansion", [p("Initial volume", 0.05, "m³"), p("Expansion coefficient", 0.00021, "/K"), p("Temperature change", 25, "K")],
    "ΔV = V β ΔT", "Volumetric thermal expansion",
    (v) => [["Volume change", v["initial-volume"] * v["expansion-coefficient"] * v["temperature-change"] * 1000, 3, "L", true],
      ["Expansion percentage", v["expansion-coefficient"] * v["temperature-change"] * 100, 3, "%"]]),

  mk("heat-pump-balance", [p("Building load at design", 8, "kW"), p("Rated capacity", 10, "kW"), p("Capacity slope", 0.03, "/K"), p("Load slope", 0.05, "/K"), n("Design outdoor", -5, "°C")],
    "Balance point where capacity curve crosses load curve", "Heat pump balance point",
    (v) => {
      const t = (v["rated-capacity"] - v["building-load-at-design"]) / (v["capacity-slope"] + v["load-slope"]) + v["design-outdoor"];
      return [["Balance-point outdoor temperature", t, 1, "°C", true],
        ["Balance-point capacity", v["rated-capacity"] - v["capacity-slope"] * (t - v["design-outdoor"]), 2, "kW"]];
    }),
];
