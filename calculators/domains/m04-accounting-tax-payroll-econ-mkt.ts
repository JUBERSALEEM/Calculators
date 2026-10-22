import { err } from "@/lib/calc/result";
import type { CalculatorSpec } from "@/lib/engine/types";
import {
  done,
  intF,
  nnF,
  numF,
  outN,
  outS,
  parseNumList,
  posF,
  selF,
  txtF,
} from "@/lib/engine/helpers";

export const M04_SPECS: CalculatorSpec[] = [
  // ── C15 Accounting and Bookkeeping (17) ────────────────────────────────────
  {
    slug: "depreciation-straight-line",
    fields: [posF("cost", "Asset cost", 50000, "$"), nnF("salvage", "Salvage value", 5000, "$"), posF("life", "Useful life", 5, "years")],
    formulaPlain: "Annual Depreciation = (Cost − Salvage) / Useful Life",
    variables: [{ symbol: "Cost, Salvage, Life", description: "Book straight-line depreciation inputs" }],
    compute: (v) => {
      const c = Number(v.cost), s = Number(v.salvage), l = Number(v.life);
      if (s > c) return err("Salvage value cannot exceed asset cost.");
      const ann = (c - s) / l;
      return done([outN("Annual depreciation expense", ann, 2, "$/yr", true), outN("Monthly depreciation", ann / 12, 2, "$/mo"), outN("Depreciable base", c - s, 2, "$")]);
    },
  },
  {
    slug: "depreciation-declining-balance",
    fields: [posF("cost", "Asset cost", 50000, "$"), nnF("salvage", "Salvage floor", 5000, "$"), intF("life", "Useful life", 5, { min: 1, max: 50, unit: "years" }), posF("mult", "Declining factor (2 = Double DB)", 2.0)],
    formulaPlain: "Rate = mult / Life; Year k = min(Book − Salvage, Book · Rate)",
    variables: [{ symbol: "mult, Life", description: "Declining-balance multiplier and life in years" }],
    compute: (v) => {
      let bv = Number(v.cost);
      const sal = Number(v.salvage), n = Number(v.life), rate = Number(v.mult) / n;
      if (sal > bv) return err("Salvage cannot exceed cost.");
      const yr1 = Math.max(0, Math.min(bv - sal, bv * rate));
      for (let y = 1; y <= n; y++) bv -= Math.max(0, Math.min(bv - sal, bv * rate));
      return done([outN("Year-1 depreciation", yr1, 2, "$", true), outN("Annual DB rate", rate * 100, 2, "%"), outN("Ending book value", bv, 2, "$")]);
    },
  },
  {
    slug: "depreciation-sum-of-years",
    fields: [posF("cost", "Asset cost", 50000, "$"), nnF("salvage", "Salvage value", 5000, "$"), intF("life", "Useful life n", 5, { min: 1, max: 50 })],
    formulaPlain: "S = n(n + 1)/2; Year k expense = (Cost − Salvage) · (n − k + 1) / S",
    variables: [{ symbol: "S", description: "Sum of years' digits" }],
    compute: (v) => {
      const base = Number(v.cost) - Number(v.salvage), n = Number(v.life);
      if (base < 0) return err("Salvage cannot exceed cost.");
      const S = (n * (n + 1)) / 2;
      return done([outN("Year-1 SYD expense", (base * n) / S, 2, "$", true), outN("Final-year SYD expense", base / S, 2, "$"), outN("Sum of digits S", S, 0)]);
    },
  },
  {
    slug: "depreciation-units",
    fields: [posF("cost", "Asset cost", 80000, "$"), nnF("salvage", "Salvage value", 8000, "$"), posF("lifeUnits", "Total lifetime capacity", 120000, "units"), nnF("periodUnits", "Period units produced", 18000, "units")],
    formulaPlain: "Rate/unit = (Cost − Salvage) / Lifetime Units; Period Expense = Rate × Period Units",
    variables: [{ symbol: "Rate/unit", description: "Activity-based unit charge" }],
    compute: (v) => {
      const base = Number(v.cost) - Number(v.salvage);
      if (base < 0) return err("Salvage cannot exceed cost.");
      const perUnit = base / Number(v.lifeUnits);
      return done([outN("Period depreciation expense", perUnit * Number(v.periodUnits), 2, "$", true), outN("Depreciation per unit", perUnit, 4, "$/unit")]);
    },
  },
  {
    slug: "intangible-amortisation",
    fields: [posF("cost", "Intangible acquisition cost", 120000, "$"), nnF("residual", "Residual value", 0, "$"), posF("life", "Finite legal/economic life", 10, "years")],
    formulaPlain: "Annual Amortisation = (Cost − Residual) / Useful Life",
    variables: [{ symbol: "Cost, Life", description: "Finite-lived patent/software amortisation" }],
    compute: (v) => {
      const ann = (Number(v.cost) - Number(v.residual)) / Number(v.life);
      if (ann < 0) return err("Residual value cannot exceed cost.");
      return done([outN("Annual amortisation", ann, 2, "$/yr", true), outN("Monthly charge", ann / 12, 2, "$/mo")]);
    },
  },
  {
    slug: "gross-margin",
    fields: [posF("rev", "Net revenue", 250000, "$"), nnF("cogs", "Cost of goods sold (COGS)", 145000, "$")],
    formulaPlain: "Gross Margin% = ((Revenue − COGS) / Revenue) × 100",
    variables: [{ symbol: "Revenue, COGS", description: "Top-line sales and direct cost of goods" }],
    compute: (v) => {
      const gp = Number(v.rev) - Number(v.cogs);
      return done([outN("Gross margin", (gp / Number(v.rev)) * 100, 2, "%", true), outN("Gross profit", gp, 2, "$")]);
    },
  },
  {
    slug: "operating-margin",
    fields: [posF("rev", "Revenue", 250000, "$"), nnF("cogs", "COGS", 140000, "$"), nnF("opex", "Operating expenses (SG&A + D&A)", 65000, "$")],
    formulaPlain: "Operating Margin% = ((Revenue − COGS − OpEx) / Revenue) × 100",
    variables: [{ symbol: "EBIT", description: "Operating profit before interest and tax" }],
    compute: (v) => {
      const ebit = Number(v.rev) - Number(v.cogs) - Number(v.opex);
      return done([outN("Operating margin", (ebit / Number(v.rev)) * 100, 2, "%", true), outN("Operating income (EBIT)", ebit, 2, "$")]);
    },
  },
  {
    slug: "net-margin",
    fields: [posF("rev", "Total revenue", 250000, "$"), numF("netInc", "Net income (after tax)", 31250, "$")],
    formulaPlain: "Net Margin% = (Net Income / Revenue) × 100",
    variables: [{ symbol: "Net Income, Revenue", description: "Bottom-line net earnings divided by revenue" }],
    compute: (v) => done([outN("Net profit margin", (Number(v.netInc) / Number(v.rev)) * 100, 2, "%", true)]),
  },
  {
    slug: "current-ratio",
    fields: [nnF("ca", "Current assets", 180000, "$"), posF("cl", "Current liabilities", 95000, "$")],
    formulaPlain: "Current Ratio = Current Assets / Current Liabilities",
    variables: [{ symbol: "CA, CL", description: "Short-term assets and short-term obligations" }],
    compute: (v) => done([outN("Current ratio", Number(v.ca) / Number(v.cl), 3, "×", true), outN("Net working capital", Number(v.ca) - Number(v.cl), 2, "$")]),
  },
  {
    slug: "quick-ratio",
    fields: [nnF("cash", "Cash & marketable securities", 65000, "$"), nnF("ar", "Accounts receivable", 55000, "$"), posF("cl", "Current liabilities", 95000, "$")],
    formulaPlain: "Quick (Acid-Test) Ratio = (Cash + Marketable Securities + AR) / Current Liabilities",
    variables: [{ symbol: "Liquid Assets, CL", description: "Excludes inventory and prepaid expenses" }],
    compute: (v) => done([outN("Quick ratio (acid test)", (Number(v.cash) + Number(v.ar)) / Number(v.cl), 3, "×", true)]),
  },
  {
    slug: "debt-to-equity",
    fields: [nnF("liab", "Total liabilities", 420000, "$"), posF("eq", "Total shareholders' equity", 350000, "$")],
    formulaPlain: "D/E = Total Liabilities / Total Equity",
    variables: [{ symbol: "Liabilities, Equity", description: "Balance-sheet financial leverage" }],
    compute: (v) => done([outN("Debt-to-Equity ratio", Number(v.liab) / Number(v.eq), 3, "×", true), outN("Debt ratio D/(D+E)", (Number(v.liab) / (Number(v.liab) + Number(v.eq))) * 100, 2, "%")]),
  },
  {
    slug: "inventory-turnover",
    fields: [nnF("cogs", "Annual COGS", 600000, "$"), posF("inv", "Average inventory", 100000, "$")],
    formulaPlain: "Turnover = COGS / Average Inventory; DIO = 365 / Turnover",
    variables: [{ symbol: "COGS, Avg Inventory", description: "Cost of goods sold over mean stock value" }],
    compute: (v) => {
      const t = Number(v.cogs) / Number(v.inv);
      return done([outN("Inventory turnover", t, 2, "turns/yr", true), ...(t > 0 ? [outN("Days inventory outstanding (DIO)", 365 / t, 1, "days")] : [])]);
    },
  },
  {
    slug: "receivables-turnover",
    fields: [posF("sales", "Net credit sales", 900000, "$"), posF("ar", "Average accounts receivable", 110000, "$"), posF("days", "Period length", 365, "days")],
    formulaPlain: "AR Turnover = Credit Sales / Avg AR; DSO = (Avg AR / Credit Sales) × Days",
    variables: [{ symbol: "DSO", description: "Days Sales Outstanding" }],
    compute: (v) => {
      const turns = Number(v.sales) / Number(v.ar);
      return done([outN("Days Sales Outstanding (DSO)", Number(v.days) / turns, 1, "days", true), outN("Receivables turnover", turns, 2, "×")]);
    },
  },
  {
    slug: "cash-conversion-cycle",
    fields: [nnF("dio", "Days Inventory Outstanding (DIO)", 48, "days"), nnF("dso", "Days Sales Outstanding (DSO)", 35, "days"), nnF("dpo", "Days Payable Outstanding (DPO)", 40, "days")],
    formulaPlain: "CCC = DIO + DSO − DPO",
    variables: [{ symbol: "DIO, DSO, DPO", description: "Working-capital cash cycle components" }],
    compute: (v) => done([outN("Cash Conversion Cycle (CCC)", Number(v.dio) + Number(v.dso) - Number(v.dpo), 1, "days", true)]),
  },
  {
    slug: "working-capital",
    fields: [nnF("ca", "Current assets", 320000, "$"), nnF("cl", "Current liabilities", 195000, "$")],
    formulaPlain: "Net Working Capital = Current Assets − Current Liabilities",
    variables: [{ symbol: "CA, CL", description: "Short-term liquidity balance" }],
    compute: (v) => done([outN("Net working capital", Number(v.ca) - Number(v.cl), 2, "$", true)]),
  },
  {
    slug: "break-even-units",
    fields: [nnF("fc", "Fixed costs (FC)", 45000, "$"), posF("price", "Selling price per unit (P)", 50, "$"), nnF("vc", "Variable cost per unit (VC)", 32, "$")],
    formulaPlain: "Q* = Fixed Costs / (Price − Variable Cost), requires Price > Variable Cost",
    variables: [{ symbol: "FC, P, VC", description: "Fixed overhead, unit price, unit variable cost" }],
    compute: (v) => {
      const cm = Number(v.price) - Number(v.vc);
      if (cm <= 0) return err("No break-even volume exists when unit selling price ≤ unit variable cost.");
      const q = Number(v.fc) / cm;
      return done([outN("Break-even units", Math.ceil(q), 0, "units", true), outN("Exact fractional threshold", q, 2, "units"), outN("Break-even sales revenue", q * Number(v.price), 2, "$")]);
    },
  },
  {
    slug: "break-even-revenue",
    fields: [nnF("fc", "Fixed costs", 60000, "$"), posF("cmPct", "Contribution margin ratio (CM%)", 40, "%", { max: 100 })],
    formulaPlain: "Break-even Revenue = Fixed Costs / (CM% / 100)",
    variables: [{ symbol: "FC, CM%", description: "Fixed cost divided by contribution margin percentage" }],
    compute: (v) => done([outN("Break-even revenue", Number(v.fc) / (Number(v.cmPct) / 100), 2, "$", true)]),
  },

  // ── C16 Business Pricing, Margin and Profitability (17) ────────────────────
  {
    slug: "markup",
    fields: [posF("cost", "Unit cost", 40, "$"), nnF("markup", "Markup % on cost", 50, "%")],
    formulaPlain: "Price = Cost × (1 + Markup%); Profit = Price − Cost; Margin = Markup / (1 + Markup)",
    variables: [{ symbol: "Cost, Markup%", description: "Cost basis pricing" }],
    compute: (v) => {
      const c = Number(v.cost), m = Number(v.markup) / 100, p = c * (1 + m);
      return done([outN("Selling price", p, 2, "$", true), outN("Gross profit", p - c, 2, "$"), outN("Equivalent gross margin", (m / (1 + m)) * 100, 2, "%")]);
    },
  },
  {
    slug: "margin",
    fields: [posF("price", "Selling price", 60, "$"), nnF("cost", "Unit cost", 40, "$")],
    formulaPlain: "Margin% = ((Price − Cost) / Price) × 100; Markup% = ((Price − Cost) / Cost) × 100",
    variables: [{ symbol: "Price, Cost", description: "Selling price and unit cost" }],
    compute: (v) => {
      const p = Number(v.price), c = Number(v.cost);
      return done([outN("Gross margin (on price)", ((p - c) / p) * 100, 2, "%", true), ...(c > 0 ? [outN("Equivalent markup (on cost)", ((p - c) / c) * 100, 2, "%")] : []), outN("Gross profit", p - c, 2, "$")]);
    },
  },
  {
    slug: "markup-margin-converter",
    fields: [
      selF("dir", "Convert from", [{ value: "mu", label: "Markup % → Margin %" }, { value: "mg", label: "Margin % → Markup %" }]),
      posF("pct", "Input percentage", 50, "%"),
    ],
    formulaPlain: "margin = markup / (1 + markup); markup = margin / (1 − margin)",
    variables: [{ symbol: "markup, margin", description: "Exact algebraic identity between cost markup and price margin" }],
    compute: (v) => {
      const r = Number(v.pct) / 100;
      if (v.dir === "mu") return done([outN("Gross margin %", (r / (1 + r)) * 100, 3, "%", true)]);
      if (r >= 1) return err("Gross margin must be strictly below 100% for finite cost markup.");
      return done([outN("Cost markup %", (r / (1 - r)) * 100, 3, "%", true)]);
    },
  },
  {
    slug: "cost-plus-price",
    fields: [posF("directCost", "Direct material + labour", 30, "$"), nnF("overheadPct", "Allocated overhead %", 20, "%"), nnF("markupPct", "Profit markup %", 25, "%")],
    formulaPlain: "Full Cost = Direct × (1 + Overhead%); Price = Full Cost × (1 + Markup%)",
    variables: [{ symbol: "Direct, Overhead%, Markup%", description: "Full-absorption cost-plus pricing" }],
    compute: (v) => {
      const full = Number(v.directCost) * (1 + Number(v.overheadPct) / 100);
      return done([outN("Cost-plus selling price", full * (1 + Number(v.markupPct) / 100), 2, "$", true), outN("Full absorbed cost", full, 2, "$")]);
    },
  },
  {
    slug: "target-margin-price",
    fields: [posF("cost", "Unit cost", 42, "$"), posF("margin", "Target gross margin %", 40, "%", { max: 99.99 })],
    formulaPlain: "Target Price = Cost / (1 − Target Margin%)",
    variables: [{ symbol: "Cost, Margin%", description: "Price achieving exact target gross margin" }],
    compute: (v) => {
      const p = Number(v.cost) / (1 - Number(v.margin) / 100);
      return done([outN("Required selling price", p, 2, "$", true), outN("Unit gross profit", p - Number(v.cost), 2, "$")]);
    },
  },
  {
    slug: "discount-price",
    fields: [posF("price", "List price", 120, "$"), nnF("disc", "Discount", 25, "%", { max: 100 })],
    formulaPlain: "Sale Price = List × (1 − d / 100)",
    variables: [{ symbol: "List, d", description: "Original price and percentage markdown" }],
    compute: (v) => {
      const sav = Number(v.price) * (Number(v.disc) / 100);
      return done([outN("Sale price", Number(v.price) - sav, 2, "$", true), outN("Amount saved", sav, 2, "$")]);
    },
  },
  {
    slug: "double-discount",
    fields: [posF("price", "Original price", 100, "$"), nnF("d1", "First discount", 20, "%", { max: 100 }), nnF("d2", "Additional discount", 10, "%", { max: 100 })],
    formulaPlain: "Net = Price × (1 − d₁)(1 − d₂); Effective Discount = 1 − (1 − d₁)(1 − d₂)",
    variables: [{ symbol: "d₁, d₂", description: "Sequential stacked markdowns (20% + 10% = 28%, not 30%)" }],
    compute: (v) => {
      const mult = (1 - Number(v.d1) / 100) * (1 - Number(v.d2) / 100);
      return done([outN("Net stacked price", Number(v.price) * mult, 2, "$", true), outN("Effective combined discount", (1 - mult) * 100, 2, "%")]);
    },
  },
  {
    slug: "contribution-margin-unit",
    fields: [posF("price", "Unit selling price", 75, "$"), nnF("vc", "Unit variable cost", 42, "$")],
    formulaPlain: "CM = Price − Variable Cost; CM% = CM / Price × 100",
    variables: [{ symbol: "P, VC", description: "Unit revenue minus variable cost" }],
    compute: (v) => {
      const cm = Number(v.price) - Number(v.vc);
      return done([outN("Unit contribution margin", cm, 2, "$/unit", true), outN("Contribution margin ratio", (cm / Number(v.price)) * 100, 2, "%")]);
    },
  },
  {
    slug: "price-elasticity-revenue",
    fields: [posF("rev0", "Baseline revenue", 100000, "$"), numF("elas", "Price elasticity E_d (e.g. −1.5)", -1.5), numF("dp", "Price change %", -10, "%", { gt: -100 })],
    formulaPlain: "%ΔQ ≈ E_d · %ΔP; New Revenue = R₀ · (1 + ΔP)(1 + ΔQ)",
    variables: [{ symbol: "E_d, %ΔP", description: "Own-price elasticity of demand and percentage price shift" }],
    compute: (v) => {
      const dp = Number(v.dp) / 100, dq = Number(v.elas) * dp;
      if (1 + dq < 0) return err("Implied demand change reduces volume below zero.");
      const r1 = Number(v.rev0) * (1 + dp) * (1 + dq);
      return done([outN("Projected new revenue", r1, 2, "$", true), outN("Implied volume change", dq * 100, 2, "%")]);
    },
  },
  {
    slug: "price-increase-impact",
    fields: [posF("vol", "Baseline units", 10000), posF("price", "Current unit price", 50, "$"), nnF("vc", "Unit variable cost", 30, "$"), numF("incPct", "Price increase %", 10, "%"), numF("elas", "Price elasticity E_d", -1.2)],
    formulaPlain: "Compares total gross contribution (P₁ − VC)·Q₁ vs (P₀ − VC)·Q₀",
    variables: [{ symbol: "Q, P, VC, E_d", description: "Volume-profit trade-off on price change" }],
    compute: (v) => {
      const q0 = Number(v.vol), p0 = Number(v.price), vc = Number(v.vc);
      const dp = Number(v.incPct) / 100, p1 = p0 * (1 + dp), q1 = Math.max(0, q0 * (1 + Number(v.elas) * dp));
      const gp0 = (p0 - vc) * q0, gp1 = (p1 - vc) * q1;
      return done([outN("Profit change", gp1 - gp0, 2, "$", true), outN("New contribution profit", gp1, 2, "$"), outN("New unit volume", q1, 0, "units")]);
    },
  },
  {
    slug: "wholesale-retail-price",
    fields: [posF("mfgCost", "Manufacturer unit cost", 18, "$"), posF("whMargin", "Wholesale margin %", 30, "%", { max: 99 }), posF("retMargin", "Retail margin %", 50, "%", { max: 99 })],
    formulaPlain: "Wholesale = Cost / (1 − m_wh); Retail MSRP = Wholesale / (1 − m_ret)",
    variables: [{ symbol: "m_wh, m_ret", description: "Distributor and retailer margin percentages" }],
    compute: (v) => {
      const wh = Number(v.mfgCost) / (1 - Number(v.whMargin) / 100);
      const ret = wh / (1 - Number(v.retMargin) / 100);
      return done([outN("Suggested Retail Price (MSRP)", ret, 2, "$", true), outN("Wholesale price", wh, 2, "$")]);
    },
  },
  {
    slug: "margin-chain",
    fields: [txtF("margins", "Channel tier margins % (comma-separated)", "25, 20, 45")],
    formulaPlain: "Price Multiplier = ∏ 1 / (1 − mᵢ)",
    variables: [{ symbol: "mᵢ", description: "Sequential channel gross margins (< 100%)" }],
    compute: (v) => {
      const p = parseNumList(String(v.margins), 1);
      if (!p.ok) return p;
      if (p.value.some((m) => m < 0 || m >= 100)) return err("Each tier margin must be in [0%, 100%).");
      const mult = p.value.reduce((acc, m) => acc / (1 - m / 100), 1);
      return done([outN("Cumulative end-to-cost multiple", mult, 4, "×", true), outN("Total channel margin share", (1 - 1 / mult) * 100, 2, "%")]);
    },
  },
  {
    slug: "commission-price",
    fields: [posF("netTarget", "Desired net proceeds after commission", 85, "$"), nnF("commPct", "Commission rate %", 15, "%", { max: 99.9 })],
    formulaPlain: "List Price = Desired Net / (1 − Commission%)",
    variables: [{ symbol: "Net, Commission%", description: "Gross-up price keeping seller net whole" }],
    compute: (v) => {
      const gross = Number(v.netTarget) / (1 - Number(v.commPct) / 100);
      return done([outN("Required gross list price", gross, 2, "$", true), outN("Commission fee", gross - Number(v.netTarget), 2, "$")]);
    },
  },
  {
    slug: "minimum-price",
    fields: [posF("cost", "COGS + fulfillment", 22, "$"), nnF("fixedFee", "Fixed payment fee", 0.3, "$"), nnF("pctFee", "Variable fee %", 12.9, "%", { max: 99 }), nnF("minProfit", "Minimum target profit", 8, "$")],
    formulaPlain: "Floor Price = (Cost + Fixed Fee + Target Profit) / (1 − Variable Fee%)",
    variables: [{ symbol: "Floor Price", description: "Minimum viable selling price" }],
    compute: (v) => done([outN("Minimum viable price", (Number(v.cost) + Number(v.fixedFee) + Number(v.minProfit)) / (1 - Number(v.pctFee) / 100), 2, "$", true)]),
  },
  {
    slug: "unit-economics",
    fields: [posF("rev", "Average order / customer revenue", 120, "$"), nnF("vc", "Variable fulfillment & COGS", 48, "$"), posF("cac", "Customer acquisition cost (CAC)", 36, "$")],
    formulaPlain: "Net Unit Contribution = Revenue − Variable Cost − CAC",
    variables: [{ symbol: "Revenue, VC, CAC", description: "First-order unit profitability" }],
    compute: (v) => {
      const cm = Number(v.rev) - Number(v.vc);
      return done([outN("Net post-CAC unit contribution", cm - Number(v.cac), 2, "$", true), outN("Pre-CAC contribution", cm, 2, "$"), outN("Contribution / CAC ratio", cm / Number(v.cac), 2, "×")]);
    },
  },
  {
    slug: "gross-profit",
    fields: [nnF("rev", "Revenue", 185000, "$"), nnF("cogs", "Cost of goods sold", 105000, "$")],
    formulaPlain: "Gross Profit = Revenue − COGS",
    variables: [{ symbol: "Revenue, COGS", description: "Sales minus direct cost of goods" }],
    compute: (v) => done([outN("Gross profit", Number(v.rev) - Number(v.cogs), 2, "$", true)]),
  },
  {
    slug: "net-profit",
    fields: [nnF("rev", "Total revenue", 185000, "$"), nnF("cogs", "COGS", 105000, "$"), nnF("opex", "Operating expenses", 45000, "$"), nnF("intTax", "Interest & taxes", 9500, "$")],
    formulaPlain: "Net Profit = Revenue − COGS − OpEx − Interest & Tax",
    variables: [{ symbol: "Net Profit", description: "All-in bottom-line earnings" }],
    compute: (v) => done([outN("Net profit", Number(v.rev) - Number(v.cogs) - Number(v.opex) - Number(v.intTax), 2, "$", true)]),
  },

  // ── C17 Taxation (18) ──────────────────────────────────────────────────────
  {
    slug: "sales-tax",
    fields: [nnF("price", "Pre-tax price", 89.99, "$"), nnF("rate", "Sales tax rate", 8.25, "%")],
    formulaPlain: "Tax = Price × Rate; Total = Price + Tax",
    variables: [{ symbol: "Price, Rate", description: "Single-stage retail sales tax" }],
    compute: (v) => {
      const p = Number(v.price), tax = p * (Number(v.rate) / 100);
      return done([outN("Total with tax", p + tax, 2, "$", true), outN("Sales tax amount", tax, 2, "$")]);
    },
  },
  {
    slug: "vat-inclusive",
    fields: [nnF("net", "Net (ex-VAT) amount", 200, "$"), nnF("rate", "VAT / GST rate", 20, "%")],
    formulaPlain: "Gross = Net × (1 + VAT%); VAT = Gross − Net",
    variables: [{ symbol: "Net, VAT%", description: "Adds VAT to net invoice amount" }],
    compute: (v) => {
      const net = Number(v.net), vat = net * (Number(v.rate) / 100);
      return done([outN("Gross (VAT-inclusive) price", net + vat, 2, "$", true), outN("VAT amount", vat, 2, "$")]);
    },
  },
  {
    slug: "vat-exclusive",
    fields: [nnF("gross", "Gross (VAT-inclusive) amount", 240, "$"), nnF("rate", "VAT / GST rate", 20, "%")],
    formulaPlain: "Net = Gross / (1 + VAT%); Embedded VAT = Gross − Net",
    variables: [{ symbol: "Gross, VAT%", description: "Extracts net base and VAT from gross total" }],
    compute: (v) => {
      const g = Number(v.gross), net = g / (1 + Number(v.rate) / 100);
      return done([outN("Ex-VAT net price", net, 2, "$", true), outN("Embedded VAT", g - net, 2, "$")]);
    },
  },
  {
    slug: "reverse-tax",
    fields: [nnF("total", "Tax-inclusive receipt total", 108.25, "$"), nnF("rate", "Tax rate", 8.25, "%")],
    formulaPlain: "Pre-tax Base = Total / (1 + Rate); Tax = Total − Base",
    variables: [{ symbol: "Total, Rate", description: "Reverse tax extraction" }],
    compute: (v) => {
      const tot = Number(v.total), base = tot / (1 + Number(v.rate) / 100);
      return done([outN("Pre-tax base amount", base, 2, "$", true), outN("Tax portion", tot - base, 2, "$")]);
    },
  },
  {
    slug: "progressive-income-tax",
    fields: [nnF("inc", "Taxable income", 85000, "$"), txtF("tops", "Bracket ceilings ascending (comma-separated)", "15000, 50000, 100000"), txtF("rates", "Marginal rates % (one extra for top bracket)", "0, 15, 25, 35")],
    formulaPlain: "Tax = ∑ rate_j × max(0, min(Income, top_j) − bottom_j)",
    variables: [{ symbol: "tops, rates", description: "Generic progressive marginal bracket table" }],
    compute: (v) => {
      const tops = parseNumList(String(v.tops), 1), rates = parseNumList(String(v.rates), 2);
      if (!tops.ok) return tops; if (!rates.ok) return rates;
      if (rates.value.length !== tops.value.length + 1) return err("Supply exactly one more rate than bracket ceilings (for income above top threshold).");
      const inc = Number(v.inc);
      let tax = 0, prev = 0;
      const bounds = [...tops.value, Infinity];
      for (let i = 0; i < bounds.length; i++) {
        if (inc > prev) tax += (Math.min(inc, bounds[i]) - prev) * (rates.value[i] / 100);
        prev = bounds[i];
      }
      return done([outN("Total progressive tax", tax, 2, "$", true), outN("Effective rate", inc > 0 ? (tax / inc) * 100 : 0, 2, "%")]);
    },
  },
  {
    slug: "us-federal-income-tax",
    fields: [
      nnF("gross", "Adjusted Gross Income (AGI)", 95000, "$"),
      selF("status", "Filing status (TY2026 IRS Rev. Proc. 2025-32)", [
        { value: "single", label: "Single ($16,100 standard deduction)" },
        { value: "mfj", label: "Married Filing Jointly ($32,200 standard deduction)" },
      ]),
    ],
    formulaPlain: "IRS TY2026 standard deduction ($16,100 Single / $32,200 MFJ) + 10%/12%/22%/24%/32%/35%/37% brackets (IR-2025-103)",
    variables: [{ symbol: "AGI, Status", description: "Tax Year 2026 federal regular income tax (informational estimate, not tax advice)" }],
    assumptions: ["Applies TY2026 IRS IR-2025-103 / Rev. Proc. 2025-32 ordinary income brackets and standard deductions.", "Excludes credits, AMT, NIIT, and state taxes."],
    compute: (v) => {
      const agi = Number(v.gross), mfj = v.status === "mfj";
      const std = mfj ? 32200 : 16100;
      const taxable = Math.max(0, agi - std);
      const brackets: Array<[number, number]> = mfj
        ? [[24800, 0.1], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [Infinity, 0.37]]
        : [[12400, 0.1], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [Infinity, 0.37]];
      let tax = 0, prev = 0, marg = 0.1;
      for (const [top, r] of brackets) {
        if (taxable > prev) { tax += (Math.min(taxable, top) - prev) * r; marg = r; }
        prev = top;
      }
      return done([
        outN("TY2026 Federal income tax", tax, 2, "$", true),
        outN("Taxable income after std deduction", taxable, 2, "$"),
        outN("Marginal bracket", marg * 100, 1, "%"),
        outN("Effective rate on AGI", agi > 0 ? (tax / agi) * 100 : 0, 2, "%"),
      ]);
    },
  },
  {
    slug: "self-employment-tax",
    fields: [posF("netSe", "Net Schedule C earnings", 110000, "$"), posF("ssCap", "OASDI wage base cap", 176100, "$")],
    formulaPlain: "Taxable base = 92.35% × Net Earnings; 12.4% OASDI up to cap + 2.9% Medicare",
    variables: [{ symbol: "92.35%", description: "Statutory SECA base multiplier (informational estimate)" }],
    compute: (v) => {
      const base = Number(v.netSe) * 0.9235;
      const ss = Math.min(base, Number(v.ssCap)) * 0.124, med = base * 0.029;
      return done([outN("Total SE tax", ss + med, 2, "$", true), outN("Deductible half of SE tax", (ss + med) / 2, 2, "$")]);
    },
  },
  {
    slug: "corporate-income-tax",
    fields: [nnF("taxable", "Corporate taxable income", 500000, "$"), nnF("rate", "Statutory corporate tax rate", 21.0, "%", { max: 100 })],
    formulaPlain: "Corporate Tax = Taxable Income × Rate; After-Tax Earnings = Income − Tax",
    variables: [{ symbol: "Income, Rate", description: "Corporate flat/blended statutory rate" }],
    compute: (v) => {
      const inc = Number(v.taxable), tax = inc * (Number(v.rate) / 100);
      return done([outN("Corporate tax liability", tax, 2, "$", true), outN("After-tax corporate income", inc - tax, 2, "$")]);
    },
  },
  {
    slug: "capital-gains-tax",
    fields: [nnF("proceeds", "Net sale proceeds", 145000, "$"), nnF("basis", "Adjusted cost basis", 95000, "$"), nnF("rate", "Applicable capital gains tax rate", 15, "%", { max: 100 })],
    formulaPlain: "Gain = Proceeds − Cost Basis; Tax = max(0, Gain) × Rate",
    variables: [{ symbol: "Proceeds, Basis, Rate", description: "Realised gain/loss and user-selected statutory rate" }],
    compute: (v) => {
      const gain = Number(v.proceeds) - Number(v.basis), tax = Math.max(0, gain) * (Number(v.rate) / 100);
      return done([outN("Estimated capital gains tax", tax, 2, "$", true), outN("Net realised gain / loss", gain, 2, "$"), outN("After-tax proceeds", Number(v.proceeds) - tax, 2, "$")]);
    },
  },
  {
    slug: "dividend-tax",
    fields: [nnF("divs", "Gross dividend income", 12000, "$"), nnF("rate", "Applicable dividend tax rate", 15, "%", { max: 100 })],
    formulaPlain: "Tax = Dividends × Rate; Net Dividend = Dividends × (1 − Rate)",
    variables: [{ symbol: "Dividends, Rate", description: "Gross distribution and marginal dividend rate" }],
    compute: (v) => {
      const d = Number(v.divs), t = d * (Number(v.rate) / 100);
      return done([outN("Net after-tax dividends", d - t, 2, "$", true), outN("Dividend tax", t, 2, "$")]);
    },
  },
  {
    slug: "property-tax",
    fields: [posF("assessed", "Assessed property value", 350000, "$"), nnF("mills", "Mill levy (per $1,000 assessed)", 14.5, "mills")],
    formulaPlain: "Annual Tax = Assessed Value × (Mill Rate / 1,000)",
    variables: [{ symbol: "Assessed, Mills", description: "1 mill = $1 per $1,000 assessed value" }],
    compute: (v) => {
      const ann = (Number(v.assessed) * Number(v.mills)) / 1000;
      return done([outN("Annual property tax", ann, 2, "$/yr", true), outN("Monthly escrow equivalent", ann / 12, 2, "$/mo")]);
    },
  },
  {
    slug: "import-duty",
    fields: [nnF("fob", "Goods value (FOB)", 15000, "$"), nnF("freightIns", "Freight & insurance (CIF add-on)", 1800, "$"), nnF("dutyRate", "Customs tariff rate", 6.5, "%"), nnF("vatRate", "Import VAT/GST rate", 20, "%")],
    formulaPlain: "CIF = FOB + Freight/Ins; Duty = CIF × Duty%; Import VAT = (CIF + Duty) × VAT%",
    variables: [{ symbol: "CIF, Duty, VAT", description: "Customs valuation basis" }],
    compute: (v) => {
      const cif = Number(v.fob) + Number(v.freightIns), duty = cif * (Number(v.dutyRate) / 100);
      const vat = (cif + duty) * (Number(v.vatRate) / 100);
      return done([outN("Total customs duty + import VAT", duty + vat, 2, "$", true), outN("Customs duty", duty, 2, "$"), outN("CIF customs value", cif, 2, "$")]);
    },
  },
  {
    slug: "excise-tax",
    fields: [nnF("qty", "Taxable volume / quantity", 1000, "units"), nnF("specRate", "Specific duty per unit", 0.55, "$/unit"), nnF("adVal", "Ad-valorem excise %", 0, "%"), nnF("unitVal", "Unit wholesale value", 5, "$")],
    formulaPlain: "Excise = Quantity × Specific Rate + (Quantity × Value × Ad-Valorem%)",
    variables: [{ symbol: "Specific, Ad-Valorem", description: "Combined specific and ad-valorem excise duty" }],
    compute: (v) => {
      const q = Number(v.qty);
      return done([outN("Total excise duty", q * Number(v.specRate) + q * Number(v.unitVal) * (Number(v.adVal) / 100), 2, "$", true)]);
    },
  },
  {
    slug: "marginal-effective-rate",
    fields: [posF("income", "Gross income", 100000, "$"), nnF("taxPaid", "Total tax paid", 14260, "$"), nnF("margRate", "Top bracket rate", 22, "%")],
    formulaPlain: "Effective Rate = Total Tax / Gross Income; Spread = Marginal − Effective",
    variables: [{ symbol: "Effective vs Marginal", description: "Average tax burden vs tax on next $1 earned" }],
    compute: (v) => {
      const eff = (Number(v.taxPaid) / Number(v.income)) * 100;
      return done([outN("Effective average tax rate", eff, 2, "%", true), outN("Marginal rate", Number(v.margRate), 2, "%"), outN("Marginal − Effective spread", Number(v.margRate) - eff, 2, "pp")]);
    },
  },
  {
    slug: "after-tax-return",
    fields: [numF("grossRet", "Pre-tax investment yield", 6.5, "%"), nnF("taxRate", "Marginal tax rate", 24, "%", { max: 99.9 })],
    formulaPlain: "After-Tax Return = Pre-Tax Return × (1 − T); Tax-Equivalent Yield = Tax-Free / (1 − T)",
    variables: [{ symbol: "r, T", description: "Taxable vs tax-exempt comparison" }],
    compute: (v) => {
      const r = Number(v.grossRet), t = Number(v.taxRate) / 100;
      return done([outN("After-tax yield", r * (1 - t), 3, "%", true), outN("Tax-equivalent yield if r were tax-free", r / (1 - t), 3, "%")]);
    },
  },
  {
    slug: "withholding-estimate",
    fields: [posF("payPeriodGross", "Gross pay per paycheck", 3500, "$"), intF("periods", "Pay periods per year", 26, { min: 1, max: 365 }), nnF("deduction", "Annual standard/itemised deduction", 16100, "$"), nnF("effRate", "Estimated effective federal rate on taxable pay", 15.5, "%", { max: 100 }), nnF("extraWithhold", "Extra withholding per period", 0, "$")],
    formulaPlain: "Parametric periodic withholding = max(0, Annual Gross − Deduction) × Rate / Periods + Extra (not official IRS Pub 15-T payroll table)",
    variables: [{ symbol: "Periods, Rate", description: "User-entered payroll parameters — consult IRS Tax Withholding Estimator / Pub 15-T" }],
    compute: (v) => {
      const ann = Number(v.payPeriodGross) * Number(v.periods);
      const annTax = Math.max(0, ann - Number(v.deduction)) * (Number(v.effRate) / 100);
      const perPay = annTax / Number(v.periods) + Number(v.extraWithhold);
      return done([outN("Estimated per-paycheck withholding", perPay, 2, "$", true), outN("Projected annual withholding", perPay * Number(v.periods), 2, "$")]);
    },
  },
  {
    slug: "vat-recovery",
    fields: [nnF("outputVat", "Output VAT collected on sales", 18000, "$"), nnF("inputVat", "Input VAT paid on purchases", 11500, "$"), nnF("recovPct", "Taxable recovery ratio", 100, "%", { max: 100 })],
    formulaPlain: "Recoverable Input VAT = Input VAT × Recovery%; Net Remittance = Output VAT − Recoverable",
    variables: [{ symbol: "Output, Input", description: "Net VAT payable (+) or refund due (−)" }],
    compute: (v) => {
      const rec = Number(v.inputVat) * (Number(v.recovPct) / 100);
      const net = Number(v.outputVat) - rec;
      return done([outN("Net VAT payable (+ remit / − refund)", net, 2, "$", true), outN("Recoverable input VAT", rec, 2, "$")]);
    },
  },
  {
    slug: "stamp-duty",
    fields: [posF("price", "Property consideration", 450000, "$"), nnF("exempt", "Zero-rate threshold (user jurisdiction)", 250000, "$"), nnF("rate", "Applicable band rate above threshold", 5.0, "%")],
    formulaPlain: "Parametric Transfer Duty = max(0, Price − Threshold) × Band Rate (jurisdiction tables vary)",
    variables: [{ symbol: "Price, Threshold, Rate", description: "User-supplied regional transfer-tax parameters" }],
    compute: (v) => {
      const duty = Math.max(0, Number(v.price) - Number(v.exempt)) * (Number(v.rate) / 100);
      return done([outN("Parametric stamp / transfer duty", duty, 2, "$", true), outN("Effective duty % of price", (duty / Number(v.price)) * 100, 2, "%")]);
    },
  },

  // ── C18 Payroll, Salary and Compensation (18) ──────────────────────────────
  {
    slug: "gross-pay-hourly",
    fields: [nnF("hours", "Regular hours worked", 40, "hrs"), nnF("rate", "Hourly wage rate", 28.5, "$/hr")],
    formulaPlain: "Gross Pay = Hours × Hourly Rate",
    variables: [{ symbol: "Hours, Rate", description: "Straight-time wage earnings" }],
    compute: (v) => done([outN("Gross straight-time pay", Number(v.hours) * Number(v.rate), 2, "$", true)]),
  },
  {
    slug: "overtime-flsa",
    fields: [nnF("hours", "Hours worked in single 168-hr workweek", 46, "hrs"), posF("rate", "Regular hourly rate", 25, "$/hr")],
    formulaPlain: "FLSA (R-012 dol.gov): Regular = min(H, 40)·R; Overtime = max(0, H − 40)·1.5R",
    variables: [{ symbol: "H, R", description: "Workweek hours and regular rate (averaging across weeks prohibited)" }],
    assumptions: ["Federal FLSA 40-hour / 1.5× non-exempt standard (U.S. DOL WHD).", "State daily overtime rules (e.g. California) are separate."],
    compute: (v) => {
      const h = Number(v.hours), r = Number(v.rate);
      const reg = Math.min(h, 40) * r, ot = Math.max(0, h - 40) * r * 1.5;
      return done([outN("Total weekly FLSA gross pay", reg + ot, 2, "$", true), outN("Regular pay (up to 40h)", reg, 2, "$"), outN("Overtime pay (1.5× above 40h)", ot, 2, "$")]);
    },
  },
  {
    slug: "overtime-blended-rate",
    fields: [posF("hours", "Total workweek hours (> 40)", 48, "hrs"), posF("baseRate", "Base hourly wage", 22, "$/hr"), nnF("bonus", "Non-discretionary weekly bonus", 120, "$")],
    formulaPlain: "Regular Rate = (Hours·Base + Bonus) / Hours; OT Premium = 0.5 × Regular Rate × (Hours − 40)",
    variables: [{ symbol: "Blended Rate", description: "FLSA weighted regular rate including non-discretionary bonus" }],
    compute: (v) => {
      const h = Number(v.hours), st = h * Number(v.baseRate) + Number(v.bonus);
      const regRate = st / h, otPrem = 0.5 * regRate * Math.max(0, h - 40);
      return done([outN("Total weekly pay", st + otPrem, 2, "$", true), outN("Blended regular rate", regRate, 2, "$/hr"), outN("Half-time OT premium", otPrem, 2, "$")]);
    },
  },
  {
    slug: "salary-to-hourly",
    fields: [posF("annual", "Annual salary", 78000, "$/yr"), posF("hoursWk", "Hours per week", 40, "hrs"), posF("weeksYr", "Paid weeks per year", 52, "wks")],
    formulaPlain: "Hourly = Annual / (Hours/week × Weeks/year)",
    variables: [{ symbol: "Annual, Hours, Weeks", description: "52-week payroll conversion" }],
    compute: (v) => {
      const a = Number(v.annual), hr = a / (Number(v.hoursWk) * Number(v.weeksYr));
      return done([outN("Equivalent hourly wage", hr, 2, "$/hr", true), outN("Biweekly (÷26)", a / 26, 2, "$"), outN("Monthly (÷12)", a / 12, 2, "$")]);
    },
  },
  {
    slug: "hourly-to-salary",
    fields: [posF("hourly", "Hourly rate", 37.5, "$/hr"), posF("hoursWk", "Hours per week", 40, "hrs"), posF("weeksYr", "Paid weeks per year", 52, "wks")],
    formulaPlain: "Annual Salary = Hourly × Hours/week × Weeks/year",
    variables: [{ symbol: "Hourly, Hours, Weeks", description: "Annualised gross compensation" }],
    compute: (v) => {
      const ann = Number(v.hourly) * Number(v.hoursWk) * Number(v.weeksYr);
      return done([outN("Annual gross salary", ann, 2, "$/yr", true), outN("Monthly gross (÷12)", ann / 12, 2, "$/mo"), outN("Biweekly gross (÷26)", ann / 26, 2, "$")]);
    },
  },
  {
    slug: "pay-period-converter",
    fields: [
      posF("amt", "Pay amount", 3000, "$"),
      selF("freq", "Entered frequency", [
        { value: "26", label: "Biweekly (26 / yr)" }, { value: "24", label: "Semi-monthly (24 / yr)" },
        { value: "12", label: "Monthly (12 / yr)" }, { value: "52", label: "Weekly (52 / yr)" }, { value: "1", label: "Annual (1 / yr)" },
      ]),
    ],
    formulaPlain: "Annual = Amount × Periods/yr; converts cleanly between 52/26/24/12/1 conventions",
    variables: [{ symbol: "26 vs 24", description: "Distinguishes true biweekly (26) from semi-monthly (24)" }],
    compute: (v) => {
      const ann = Number(v.amt) * Number(v.freq);
      return done([outN("Annual (1/yr)", ann, 2, "$", true), outN("Monthly (12/yr)", ann / 12, 2, "$"), outN("Semi-monthly (24/yr)", ann / 24, 2, "$"), outN("Biweekly (26/yr)", ann / 26, 2, "$"), outN("Weekly (52/yr)", ann / 52, 2, "$")]);
    },
  },
  {
    slug: "net-pay",
    fields: [posF("gross", "Gross pay", 4000, "$"), nnF("preTax", "Pre-tax deductions (401k/health)", 350, "$"), nnF("taxes", "Statutory taxes withheld", 720, "$"), nnF("postTax", "Post-tax deductions", 80, "$")],
    formulaPlain: "Net Pay = Gross − Pre-Tax Deductions − Taxes − Post-Tax Deductions",
    variables: [{ symbol: "Net Pay", description: "Take-home check amount" }],
    compute: (v) => {
      const net = Number(v.gross) - Number(v.preTax) - Number(v.taxes) - Number(v.postTax);
      return done([outN("Net take-home pay", net, 2, "$", true), outN("Taxable wage base", Math.max(0, Number(v.gross) - Number(v.preTax)), 2, "$")]);
    },
  },
  {
    slug: "fica-payroll-tax",
    fields: [nnF("wages", "Annual FICA-subject wages", 95000, "$"), posF("ssCap", "OASDI wage base limit", 176100, "$")],
    formulaPlain: "Employee: 6.2% OASDI up to cap + 1.45% Medicare (+0.9% Additional Medicare > $200k)",
    variables: [{ symbol: "OASDI, Medicare", description: "Employee vs employer FICA shares" }],
    compute: (v) => {
      const w = Number(v.wages);
      const ss = Math.min(w, Number(v.ssCap)) * 0.062;
      const medEmp = w * 0.0145 + Math.max(0, w - 200000) * 0.009;
      const medEr = w * 0.0145;
      return done([outN("Employee total FICA", ss + medEmp, 2, "$", true), outN("Employer total FICA", ss + medEr, 2, "$")]);
    },
  },
  {
    slug: "take-home-pay",
    fields: [posF("salary", "Annual gross salary", 85000, "$"), nnF("fedPct", "Effective federal tax rate (user input)", 12.5, "%", { max: 100 }), nnF("statePct", "Effective state/local tax rate (user input)", 4.5, "%", { max: 100 }), nnF("ficaPct", "Payroll insurance rate", 7.65, "%", { max: 100 }), nnF("retPct", "Retirement contribution %", 5.0, "%", { max: 100 })],
    formulaPlain: "Parametric Take-Home = Gross × (1 − Fed% − State% − FICA% − Retirement%)",
    variables: [{ symbol: "User tax rates", description: "Parametric estimate — actual payroll requires jurisdiction withholding tables" }],
    compute: (v) => {
      const totDed = (Number(v.fedPct) + Number(v.statePct) + Number(v.ficaPct) + Number(v.retPct)) / 100;
      if (totDed >= 1) return err("Combined deduction rates cannot reach or exceed 100%.");
      const netAnn = Number(v.salary) * (1 - totDed);
      return done([outN("Annual net take-home", netAnn, 2, "$/yr", true), outN("Monthly net (÷12)", netAnn / 12, 2, "$/mo"), outN("Biweekly net (÷26)", netAnn / 26, 2, "$")]);
    },
  },
  {
    slug: "bonus-tax",
    fields: [posF("bonus", "Gross supplemental bonus", 10000, "$"), nnF("suppFed", "Supplemental federal flat rate", 22.0, "%", { max: 100 }), nnF("stateFica", "Combined state + FICA rate", 11.65, "%", { max: 100 })],
    formulaPlain: "Net Bonus = Bonus × (1 − Supplemental Fed% − State/FICA%)",
    variables: [{ symbol: "Bonus", description: "Withholding at payment vs final return reconciliation" }],
    compute: (v) => {
      const rate = (Number(v.suppFed) + Number(v.stateFica)) / 100;
      if (rate >= 1) return err("Combined withholding rate must be under 100%.");
      const b = Number(v.bonus);
      return done([outN("Net bonus payout", b * (1 - rate), 2, "$", true), outN("Total tax withheld", b * rate, 2, "$")]);
    },
  },
  {
    slug: "commission-pay",
    fields: [nnF("base", "Base salary per period", 3000, "$"), nnF("sales", "Period sales volume", 80000, "$"), nnF("quota", "Commission threshold / quota", 50000, "$"), nnF("rate1", "Commission % up to quota", 4, "%"), nnF("rate2", "Accelerator % above quota", 8, "%")],
    formulaPlain: "Commission = min(Sales, Quota)·r₁ + max(0, Sales − Quota)·r₂",
    variables: [{ symbol: "Quota, r₁, r₂", description: "Two-tier sales commission structure" }],
    compute: (v) => {
      const s = Number(v.sales), q = Number(v.quota);
      const comm = Math.min(s, q) * (Number(v.rate1) / 100) + Math.max(0, s - q) * (Number(v.rate2) / 100);
      return done([outN("Total compensation", Number(v.base) + comm, 2, "$", true), outN("Commission earned", comm, 2, "$")]);
    },
  },
  {
    slug: "shift-differential",
    fields: [nnF("hours", "Shift hours worked", 36, "hrs"), posF("base", "Base hourly wage", 32, "$/hr"), nnF("diffPct", "Shift differential %", 15, "%")],
    formulaPlain: "Effective Rate = Base × (1 + Diff%); Total = Hours × Effective Rate",
    variables: [{ symbol: "Base, Diff%", description: "Night/weekend differential premium" }],
    compute: (v) => {
      const eff = Number(v.base) * (1 + Number(v.diffPct) / 100);
      return done([outN("Total shift pay", Number(v.hours) * eff, 2, "$", true), outN("Effective hourly rate", eff, 2, "$/hr")]);
    },
  },
  {
    slug: "pto-accrual",
    fields: [nnF("hoursWorked", "Hours worked in period", 80, "hrs"), posF("annualPtoHours", "Annual PTO entitlement", 120, "hrs"), posF("stdHoursYr", "Standard full-time annual hours", 2080, "hrs")],
    formulaPlain: "Accrual Rate = Annual PTO / Standard Hours; Period Accrued = Hours Worked × Rate",
    variables: [{ symbol: "Accrual Rate", description: "PTO hours earned per hour worked" }],
    compute: (v) => {
      const rate = Number(v.annualPtoHours) / Number(v.stdHoursYr);
      return done([outN("PTO accrued this period", Number(v.hoursWorked) * rate, 3, "hrs", true), outN("Accrual factor", rate, 5, "hr/hr")]);
    },
  },
  {
    slug: "pto-payout",
    fields: [nnF("ptoHours", "Unused accrued PTO balance", 56, "hrs"), posF("hourlyRate", "Applicable hourly wage", 42, "$/hr")],
    formulaPlain: "Gross PTO Payout = Unused Hours × Hourly Rate",
    variables: [{ symbol: "Hours, Rate", description: "Accrued vacation payout prior to withholding" }],
    compute: (v) => done([outN("Gross PTO cash-out", Number(v.ptoHours) * Number(v.hourlyRate), 2, "$", true)]),
  },
  {
    slug: "severance-pay",
    fields: [posF("annualSalary", "Annual base salary", 91000, "$"), nnF("years", "Completed years of service", 6), posF("weeksPerYr", "Policy weeks per year of service", 2, "wks")],
    formulaPlain: "Severance = (Annual Salary / 52) × Weeks/Year × Tenure",
    variables: [{ symbol: "Salary, Weeks/Yr, Tenure", description: "Employer severance policy formula" }],
    compute: (v) => {
      const wks = Number(v.weeksPerYr) * Number(v.years);
      return done([outN("Gross severance package", (Number(v.annualSalary) / 52) * wks, 2, "$", true), outN("Weeks of pay", wks, 1, "wks")]);
    },
  },
  {
    slug: "final-paycheck",
    fields: [nnF("hours", "Unpaid hours worked", 32, "hrs"), posF("rate", "Hourly rate", 35, "$/hr"), nnF("ptoHours", "Payable unused PTO hours", 24, "hrs"), nnF("deductions", "Taxes & final deductions", 480, "$")],
    formulaPlain: "Final Net = (Hours + PTO Hours) × Rate − Deductions",
    variables: [{ symbol: "Hours, PTO, Deductions", description: "Separation paycheck summary" }],
    compute: (v) => {
      const gross = (Number(v.hours) + Number(v.ptoHours)) * Number(v.rate);
      return done([outN("Estimated final net check", gross - Number(v.deductions), 2, "$", true), outN("Final gross earnings", gross, 2, "$")]);
    },
  },
  {
    slug: "pay-raise",
    fields: [posF("current", "Current salary / rate", 75000, "$"), numF("pct", "Raise percentage", 6.5, "%")],
    formulaPlain: "New Pay = Current × (1 + Raise% / 100)",
    variables: [{ symbol: "Current, Raise%", description: "Compensation before and after raise" }],
    compute: (v) => {
      const cur = Number(v.current), inc = cur * (Number(v.pct) / 100);
      return done([outN("New pay", cur + inc, 2, "$", true), outN("Increase amount", inc, 2, "$")]);
    },
  },
  {
    slug: "employer-cost",
    fields: [posF("salary", "Employee gross annual salary", 85000, "$"), nnF("payrollTaxPct", "Employer payroll taxes %", 8.5, "%"), nnF("benefits", "Annual health/pension benefits", 12000, "$"), nnF("overhead", "Equipment / workspace overhead", 3600, "$")],
    formulaPlain: "Total Employer Cost = Gross + Gross·Tax% + Benefits + Overhead",
    variables: [{ symbol: "Burden Multiplier", description: "Total cost divided by base salary" }],
    compute: (v) => {
      const sal = Number(v.salary), tot = sal * (1 + Number(v.payrollTaxPct) / 100) + Number(v.benefits) + Number(v.overhead);
      return done([outN("Total annual cost to employer", tot, 2, "$/yr", true), outN("Burden multiplier", tot / sal, 3, "×")]);
    },
  },

  // ── C19 Economics and Business Analytics (13) ──────────────────────────────
  {
    slug: "inflation-rate",
    fields: [posF("cpi0", "Starting CPI index", 296.8), posF("cpi1", "Ending CPI index", 314.5)],
    formulaPlain: "Inflation% = ((CPI₁ − CPI₀) / CPI₀) × 100",
    variables: [{ symbol: "CPI₀, CPI₁", description: "Consumer Price Index levels (same base basket)" }],
    compute: (v) => done([outN("Period inflation rate", ((Number(v.cpi1) - Number(v.cpi0)) / Number(v.cpi0)) * 100, 3, "%", true)]),
  },
  {
    slug: "real-wage",
    fields: [posF("wage", "Nominal wage", 38.0, "$/hr"), posF("cpiNow", "Current CPI", 315.0), posF("cpiBase", "Reference base CPI", 100.0)],
    formulaPlain: "Real Wage (base dollars) = Nominal Wage × (CPI_base / CPI_current)",
    variables: [{ symbol: "Wage, CPI", description: "Deflated wage in base-period dollars" }],
    compute: (v) => done([outN("Real wage in base-year dollars", (Number(v.wage) * Number(v.cpiBase)) / Number(v.cpiNow), 2, "$", true)]),
  },
  {
    slug: "purchasing-power",
    fields: [posF("amt", "Base-year dollar amount", 1000, "$"), posF("cpiFrom", "CPI in original year", 172.2), posF("cpiTo", "CPI in target year", 314.5)],
    formulaPlain: "Equivalent Amount = Amount × (CPI_target / CPI_source)",
    variables: [{ symbol: "CPI ratio", description: "Purchasing-power parity across years" }],
    compute: (v) => done([outN("Equivalent target-year value", (Number(v.amt) * Number(v.cpiTo)) / Number(v.cpiFrom), 2, "$", true)]),
  },
  {
    slug: "price-index",
    fields: [posF("basketNow", "Current basket cost", 268.4, "$"), posF("basketBase", "Base-year basket cost", 220.0, "$")],
    formulaPlain: "Laspeyres Index = (Cost_t / Cost_0) × 100",
    variables: [{ symbol: "Cost_t, Cost_0", description: "Fixed-weight basket expenditure" }],
    compute: (v) => done([outN("Price index (base = 100)", (Number(v.basketNow) / Number(v.basketBase)) * 100, 2, undefined, true)]),
  },
  {
    slug: "demand-elasticity",
    fields: [posF("p1", "Initial price P₁", 20, "$"), posF("p2", "New price P₂", 24, "$"), posF("q1", "Initial quantity Q₁", 500), posF("q2", "New quantity Q₂", 420)],
    formulaPlain: "Midpoint (arc) E_d = ((Q₂ − Q₁)/((Q₁ + Q₂)/2)) ÷ ((P₂ − P₁)/((P₁ + P₂)/2))",
    variables: [{ symbol: "E_d", description: "Symmetric midpoint arc price elasticity of demand" }],
    compute: (v) => {
      const p1 = Number(v.p1), p2 = Number(v.p2), q1 = Number(v.q1), q2 = Number(v.q2);
      if (p1 === p2) return err("Prices P₁ and P₂ must differ to compute elasticity.");
      const e = ((q2 - q1) / ((q1 + q2) / 2)) / ((p2 - p1) / ((p1 + p2) / 2));
      return done([outN("Arc elasticity E_d", e, 4, undefined, true), outS("Classification", Math.abs(e) > 1 ? "Elastic (|E| > 1)" : Math.abs(e) < 1 ? "Inelastic (|E| < 1)" : "Unit elastic (|E| = 1)")]);
    },
  },
  {
    slug: "supply-elasticity",
    fields: [posF("p1", "Price P₁", 15, "$"), posF("p2", "Price P₂", 18, "$"), posF("q1", "Quantity supplied Q₁", 300), posF("q2", "Quantity supplied Q₂", 390)],
    formulaPlain: "Midpoint E_s = ((Q₂ − Q₁)/Q̄) ÷ ((P₂ − P₁)/P̄)",
    variables: [{ symbol: "E_s", description: "Arc price elasticity of supply" }],
    compute: (v) => {
      const p1 = Number(v.p1), p2 = Number(v.p2), q1 = Number(v.q1), q2 = Number(v.q2);
      if (p1 === p2) return err("P₁ and P₂ must differ.");
      const e = ((q2 - q1) / ((q1 + q2) / 2)) / ((p2 - p1) / ((p1 + p2) / 2));
      return done([outN("Arc supply elasticity E_s", e, 4, undefined, true)]);
    },
  },
  {
    slug: "consumer-surplus",
    fields: [posF("choke", "Max willingness-to-pay choke price", 80, "$"), nnF("price", "Market clearing price P*", 35, "$"), posF("qty", "Equilibrium quantity Q*", 200)],
    formulaPlain: "CS = ½ × Q* × (P_max − P*) (linear demand curve assumption)",
    variables: [{ symbol: "P_max, P*, Q*", description: "Demand choke intercept, price, and quantity" }],
    compute: (v) => {
      if (Number(v.price) > Number(v.choke)) return err("Market price exceeds maximum willingness to pay (zero demand).");
      return done([outN("Consumer surplus", 0.5 * Number(v.qty) * (Number(v.choke) - Number(v.price)), 2, "$", true)]);
    },
  },
  {
    slug: "producer-surplus",
    fields: [posF("price", "Market clearing price P*", 50, "$"), nnF("minSupply", "Minimum supply intercept P_min", 15, "$"), posF("qty", "Equilibrium quantity Q*", 200)],
    formulaPlain: "PS = ½ × Q* × (P* − P_min) (linear supply curve assumption)",
    variables: [{ symbol: "P*, P_min, Q*", description: "Market price, supply intercept, quantity" }],
    compute: (v) => {
      if (Number(v.price) < Number(v.minSupply)) return err("Market price is below minimum supply price.");
      return done([outN("Producer surplus", 0.5 * Number(v.qty) * (Number(v.price) - Number(v.minSupply)), 2, "$", true)]);
    },
  },
  {
    slug: "gdp-growth",
    fields: [posF("gdp0", "Prior real GDP", 22400, "$B"), posF("gdp1", "Current real GDP", 23050, "$B")],
    formulaPlain: "Real GDP Growth% = ((GDP₁ − GDP₀) / GDP₀) × 100",
    variables: [{ symbol: "GDP₀, GDP₁", description: "Inflation-deflated real output" }],
    compute: (v) => done([outN("Real GDP growth rate", ((Number(v.gdp1) - Number(v.gdp0)) / Number(v.gdp0)) * 100, 3, "%", true)]),
  },
  {
    slug: "unemployment-rate",
    fields: [nnF("unemp", "Unemployed persons", 6.8, "M"), posF("emp", "Employed persons", 161.2, "M"), posF("pop", "Working-age civilian population", 268.0, "M")],
    formulaPlain: "U-3 Rate = Unemployed / (Employed + Unemployed) × 100; LFPR = Labour Force / Population",
    variables: [{ symbol: "U-3, LFPR", description: "ILO / BLS labour force definitions" }],
    compute: (v) => {
      const lf = Number(v.unemp) + Number(v.emp);
      return done([outN("Unemployment rate", (Number(v.unemp) / lf) * 100, 2, "%", true), outN("Labour force participation", (lf / Number(v.pop)) * 100, 2, "%")]);
    },
  },
  {
    slug: "ppp-conversion",
    fields: [posF("localAmt", "Amount in Country A currency", 85000), posF("pppRate", "PPP conversion factor (Country A units per international $)", 22.5)],
    formulaPlain: "International PPP Dollars = Local Amount / PPP Factor",
    variables: [{ symbol: "PPP Factor", description: "Purchasing Power Parity conversion factor" }],
    compute: (v) => done([outN("International PPP value", Number(v.localAmt) / Number(v.pppRate), 2, "Int'l $", true)]),
  },
  {
    slug: "currency-conversion",
    fields: [nnF("amt", "Source amount", 1000), posF("rate", "Exchange rate (target per 1 source unit)", 0.92)],
    formulaPlain: "Converted = Source Amount × Static Exchange Rate (live FX feeds require external licensing)",
    variables: [{ symbol: "Amount, Rate", description: "User-entered FX rate" }],
    compute: (v) => done([outN("Converted amount", Number(v.amt) * Number(v.rate), 2, undefined, true), outN("Inverse rate", 1 / Number(v.rate), 6)]),
  },
  {
    slug: "multiplier-effect",
    fields: [posF("inj", "Autonomous spending injection ΔG", 50, "$B"), nnF("mpc", "Marginal propensity to consume (MPC < 1)", 0.75, undefined, { max: 0.9999 })],
    formulaPlain: "k = 1 / (1 − MPC); ΔY = k · ΔG (closed-economy Keynesian model)",
    variables: [{ symbol: "MPC, k", description: "Marginal propensity to consume and spending multiplier" }],
    compute: (v) => {
      const k = 1 / (1 - Number(v.mpc));
      return done([outN("Total output impact ΔY", Number(v.inj) * k, 2, "$B", true), outN("Fiscal multiplier k", k, 3, "×")]);
    },
  },

  // ── C20 Marketing and Advertising Metrics (17) ─────────────────────────────
  {
    slug: "cpm",
    fields: [nnF("cost", "Ad spend", 1250, "$"), posF("imp", "Impressions", 250000)],
    formulaPlain: "CPM = (Ad Spend / Impressions) × 1,000",
    variables: [{ symbol: "CPM", description: "Cost per 1,000 impressions" }],
    compute: (v) => done([outN("Cost per Mille (CPM)", (Number(v.cost) / Number(v.imp)) * 1000, 2, "$", true)]),
  },
  {
    slug: "cpc",
    fields: [nnF("cost", "Ad spend", 840, "$"), posF("clicks", "Total clicks", 480)],
    formulaPlain: "CPC = Ad Spend / Clicks",
    variables: [{ symbol: "CPC", description: "Average cost per click" }],
    compute: (v) => done([outN("Cost per Click (CPC)", Number(v.cost) / Number(v.clicks), 3, "$", true)]),
  },
  {
    slug: "cpa",
    fields: [nnF("cost", "Campaign cost", 2400, "$"), posF("conv", "Conversions", 60)],
    formulaPlain: "CPA = Spend / Conversions",
    variables: [{ symbol: "CPA", description: "Cost per action / acquisition" }],
    compute: (v) => done([outN("Cost per Acquisition (CPA)", Number(v.cost) / Number(v.conv), 2, "$", true)]),
  },
  {
    slug: "ctr",
    fields: [nnF("clicks", "Clicks", 3200), posF("imp", "Impressions", 128000)],
    formulaPlain: "CTR% = (Clicks / Impressions) × 100",
    variables: [{ symbol: "CTR", description: "Click-through rate" }],
    compute: (v) => done([outN("Click-Through Rate (CTR)", (Number(v.clicks) / Number(v.imp)) * 100, 3, "%", true)]),
  },
  {
    slug: "conversion-rate",
    fields: [nnF("conv", "Completed conversions", 145), posF("visits", "Sessions / clicks", 4200)],
    formulaPlain: "CVR% = (Conversions / Visits) × 100",
    variables: [{ symbol: "CVR", description: "Conversion rate" }],
    compute: (v) => done([outN("Conversion rate (CVR)", (Number(v.conv) / Number(v.visits)) * 100, 3, "%", true)]),
  },
  {
    slug: "roas",
    fields: [nnF("rev", "Attributed ad revenue", 22000, "$"), posF("spend", "Ad spend", 5000, "$")],
    formulaPlain: "ROAS = Attributed Revenue / Ad Spend",
    variables: [{ symbol: "ROAS", description: "Return on ad spend multiple" }],
    compute: (v) => done([outN("ROAS multiple", Number(v.rev) / Number(v.spend), 2, "×", true), outN("ROAS %", (Number(v.rev) / Number(v.spend)) * 100, 1, "%")]),
  },
  {
    slug: "marketing-roi",
    fields: [numF("gp", "Incremental gross profit from campaign", 18000, "$"), posF("spend", "Total marketing cost", 6000, "$")],
    formulaPlain: "Marketing ROI% = ((Gross Profit − Marketing Spend) / Marketing Spend) × 100",
    variables: [{ symbol: "Gross Profit, Spend", description: "Profit-based ROI (distinct from top-line ROAS)" }],
    compute: (v) => done([outN("Marketing ROI", ((Number(v.gp) - Number(v.spend)) / Number(v.spend)) * 100, 2, "%", true), outN("Net contribution", Number(v.gp) - Number(v.spend), 2, "$")]),
  },
  {
    slug: "cac",
    fields: [nnF("spend", "Total sales & marketing spend", 45000, "$"), posF("cust", "New customers acquired", 300)],
    formulaPlain: "CAC = Total S&M Spend / New Customers",
    variables: [{ symbol: "CAC", description: "Fully loaded customer acquisition cost" }],
    compute: (v) => done([outN("Customer Acquisition Cost (CAC)", Number(v.spend) / Number(v.cust), 2, "$", true)]),
  },
  {
    slug: "customer-lifetime-value",
    fields: [posF("arpu", "Monthly ARPU", 79, "$/mo"), posF("gm", "Gross margin %", 75, "%", { max: 100 }), posF("months", "Average customer lifetime", 24, "months")],
    formulaPlain: "LTV = ARPU × Gross Margin% × Average Lifetime",
    variables: [{ symbol: "ARPU, GM%, Lifetime", description: "Gross-margin-adjusted lifetime value" }],
    compute: (v) => done([outN("Customer Lifetime Value (LTV)", Number(v.arpu) * (Number(v.gm) / 100) * Number(v.months), 2, "$", true)]),
  },
  {
    slug: "ltv-cac-ratio",
    fields: [posF("ltv", "Customer Lifetime Value (LTV)", 1422, "$"), posF("cac", "Customer Acquisition Cost (CAC)", 380, "$")],
    formulaPlain: "Ratio = LTV / CAC",
    variables: [{ symbol: "LTV : CAC", description: "Unit-economics efficiency ratio" }],
    compute: (v) => done([outN("LTV : CAC ratio", Number(v.ltv) / Number(v.cac), 2, ": 1", true)]),
  },
  {
    slug: "churn-rate",
    fields: [nnF("lost", "Customers lost in period", 42), posF("start", "Customers at start of period", 1200)],
    formulaPlain: "Churn% = (Lost / Starting Cohort) × 100",
    variables: [{ symbol: "Lost, Start", description: "Cohort attrition over period" }],
    compute: (v) => {
      const ch = (Number(v.lost) / Number(v.start)) * 100;
      return done([outN("Period churn rate", ch, 2, "%", true), outN("Implied retention rate", 100 - ch, 2, "%")]);
    },
  },
  {
    slug: "retention-rate",
    fields: [posF("start", "Starting customers", 1200), nnF("end", "Ending customers", 1260), nnF("newCust", "New customers added in period", 110)],
    formulaPlain: "Retention% = ((Ending − New) / Starting) × 100",
    variables: [{ symbol: "End, New, Start", description: "Isolates retained cohort by excluding new acquisitions" }],
    compute: (v) => {
      const retained = Number(v.end) - Number(v.newCust);
      if (retained < 0) return err("New customers exceed ending total.");
      return done([outN("Cohort retention rate", (retained / Number(v.start)) * 100, 2, "%", true), outN("Retained customers", retained, 0)]);
    },
  },
  {
    slug: "mrr-arr",
    fields: [nnF("subs", "Active subscribers", 420), posF("arpa", "Average monthly subscription", 49, "$/mo")],
    formulaPlain: "MRR = Subscribers × Monthly Price; ARR = 12 × MRR",
    variables: [{ symbol: "MRR, ARR", description: "Recurring subscription run-rate" }],
    compute: (v) => {
      const mrr = Number(v.subs) * Number(v.arpa);
      return done([outN("Monthly Recurring Revenue (MRR)", mrr, 2, "$/mo", true), outN("Annual Recurring Revenue (ARR)", mrr * 12, 2, "$/yr")]);
    },
  },
  {
    slug: "arpu",
    fields: [nnF("rev", "Period recurring revenue", 58000, "$"), posF("users", "Active users", 1450)],
    formulaPlain: "ARPU = Period Revenue / Active Users",
    variables: [{ symbol: "ARPU", description: "Average revenue per user" }],
    compute: (v) => done([outN("ARPU", Number(v.rev) / Number(v.users), 2, "$/user", true)]),
  },
  {
    slug: "breakeven-roas",
    fields: [posF("margin", "Contribution margin % before ads", 40, "%", { max: 100 })],
    formulaPlain: "Break-even ROAS = 1 / (Margin% / 100)",
    variables: [{ symbol: "Margin%", description: "E.g. 40% contribution margin requires 2.50× ROAS to break even" }],
    compute: (v) => done([outN("Break-even ROAS", 1 / (Number(v.margin) / 100), 3, "×", true)]),
  },
  {
    slug: "funnel-conversion",
    fields: [posF("visitors", "Top-of-funnel visitors", 50000), nnF("leads", "Signups / leads", 4000), nnF("customers", "Paid customers", 320)],
    formulaPlain: "Stage CVRᵢ = Stageᵢ / Stageᵢ₋₁; End-to-End = Paid / Visitors",
    variables: [{ symbol: "Visitors → Leads → Paid", description: "Multi-stage conversion rates" }],
    compute: (v) => {
      const vis = Number(v.visitors), l = Number(v.leads), c = Number(v.customers);
      if (l > vis || c > l) return err("Downstream stage count cannot exceed upstream funnel count.");
      return done([outN("End-to-end conversion", (c / vis) * 100, 3, "%", true), outN("Visitor → Lead", (l / vis) * 100, 2, "%"), outN("Lead → Paid", l > 0 ? (c / l) * 100 : 0, 2, "%")]);
    },
  },
  {
    slug: "ad-budget-cpa",
    fields: [posF("targetCpa", "Target CPA", 45, "$"), posF("targetConv", "Target conversions", 250)],
    formulaPlain: "Budget = Target CPA × Target Conversions",
    variables: [{ symbol: "CPA, Volume", description: "Required media spend for target acquisition volume" }],
    compute: (v) => done([outN("Required ad budget", Number(v.targetCpa) * Number(v.targetConv), 2, "$", true)]),
  },

  // ── C21 E-commerce and Online Selling (13) ─────────────────────────────────
  {
    slug: "marketplace-fee-profit",
    fields: [posF("price", "Item sale price", 39.99, "$"), nnF("cogs", "Landed COGS", 11.5, "$"), nnF("refPct", "Marketplace referral fee %", 15, "%"), nnF("fulfill", "FBA / fulfillment + shipping", 6.2, "$"), nnF("adCost", "Ad spend per order", 3.5, "$")],
    formulaPlain: "Net = Price − COGS − Price·Referral% − Fulfillment − Ad Cost",
    variables: [{ symbol: "Net Profit, Margin%", description: "Per-order marketplace unit profit" }],
    compute: (v) => {
      const p = Number(v.price);
      const net = p - Number(v.cogs) - p * (Number(v.refPct) / 100) - Number(v.fulfill) - Number(v.adCost);
      return done([outN("Net profit per unit", net, 2, "$", true), outN("Net margin", (net / p) * 100, 2, "%")]);
    },
  },
  {
    slug: "landed-cost",
    fields: [posF("units", "Shipment quantity", 500, "units"), posF("unitFob", "Ex-factory price / unit", 8.5, "$"), nnF("freight", "Total freight & insurance", 950, "$"), nnF("dutyPct", "Customs duty %", 6.5, "%"), nnF("broker", "Customs brokerage & drayage", 280, "$")],
    formulaPlain: "Total Landed = Goods + Freight + (Goods + Freight)·Duty% + Brokerage",
    variables: [{ symbol: "Landed / unit", description: "Fully landed warehouse cost per unit" }],
    compute: (v) => {
      const q = Number(v.units), goods = q * Number(v.unitFob), cif = goods + Number(v.freight);
      const tot = cif + cif * (Number(v.dutyPct) / 100) + Number(v.broker);
      return done([outN("Landed cost per unit", tot / q, 3, "$/unit", true), outN("Total shipment landed cost", tot, 2, "$")]);
    },
  },
  {
    slug: "dropshipping-margin",
    fields: [posF("price", "Store selling price", 49.99, "$"), nnF("supplier", "Supplier + shipping cost", 18.5, "$"), nnF("payFeePct", "Payment processing %", 2.9, "%"), nnF("payFixed", "Fixed gateway fee", 0.3, "$"), nnF("ads", "CPA ad spend", 12, "$")],
    formulaPlain: "Net = Price − Supplier − (Price·Gateway% + Fixed) − CPA",
    variables: [{ symbol: "Net, Margin%", description: "Dropshipping order profitability" }],
    compute: (v) => {
      const p = Number(v.price), net = p - Number(v.supplier) - (p * (Number(v.payFeePct) / 100) + Number(v.payFixed)) - Number(v.ads);
      return done([outN("Net order profit", net, 2, "$", true), outN("Net margin", (net / p) * 100, 2, "%")]);
    },
  },
  {
    slug: "breakeven-units-ads",
    fields: [nnF("fc", "Monthly fixed overhead", 4000, "$"), nnF("ads", "Fixed campaign ad spend", 2500, "$"), posF("cm", "Unit contribution margin (Price − VC)", 25, "$")],
    formulaPlain: "Q* = (Fixed Costs + Ad Spend) / Unit Contribution Margin",
    variables: [{ symbol: "Q*", description: "Units needed to cover both overhead and campaign spend" }],
    compute: (v) => {
      const q = (Number(v.fc) + Number(v.ads)) / Number(v.cm);
      return done([outN("Break-even units", Math.ceil(q), 0, "units", true), outN("Exact units", q, 2)]);
    },
  },
  {
    slug: "discount-profit-impact",
    fields: [posF("price", "Full retail price", 80, "$"), nnF("cost", "Variable cost", 36, "$"), nnF("disc", "Promo discount %", 20, "%", { max: 99 })],
    formulaPlain: "Volume Lift Needed = Old Unit Profit / New Unit Profit − 1",
    variables: [{ symbol: "Volume Lift", description: "Required % sales volume increase to match pre-discount profit" }],
    compute: (v) => {
      const p = Number(v.price), c = Number(v.cost), oldP = p - c, newP = p * (1 - Number(v.disc) / 100) - c;
      if (newP <= 0) return err("Discounted price does not exceed variable cost — every unit loses money.");
      return done([outN("Unit volume lift needed to break even", (oldP / newP - 1) * 100, 1, "%", true), outN("New unit profit", newP, 2, "$")]);
    },
  },
  {
    slug: "bundle-pricing",
    fields: [txtF("prices", "Standalone item prices ($)", "29, 19, 15"), nnF("disc", "Bundle discount %", 15, "%", { max: 100 }), nnF("totalCost", "Combined COGS", 24, "$")],
    formulaPlain: "Bundle Price = (∑ Item Prices) × (1 − Discount%)",
    variables: [{ symbol: "Bundle Price", description: "Discounted bundle price and margin" }],
    compute: (v) => {
      const p = parseNumList(String(v.prices), 2);
      if (!p.ok) return p;
      const sum = p.value.reduce((a, b) => a + b, 0), bp = sum * (1 - Number(v.disc) / 100);
      return done([outN("Bundle price", bp, 2, "$", true), outN("Customer saving", sum - bp, 2, "$"), outN("Bundle margin", ((bp - Number(v.totalCost)) / bp) * 100, 2, "%")]);
    },
  },
  {
    slug: "free-shipping-threshold",
    fields: [posF("grossMargin", "Product gross margin %", 55, "%", { max: 99.9 }), posF("shipCost", "Seller shipping cost", 8.5, "$"), nnF("minNetMargin", "Minimum target order margin %", 35, "%", { max: 99 })],
    formulaPlain: "Min Order Value = Shipping Cost / (Gross Margin% − Target Margin%)",
    variables: [{ symbol: "Threshold", description: "Minimum cart size absorbing free shipping while keeping target margin" }],
    compute: (v) => {
      const diff = (Number(v.grossMargin) - Number(v.minNetMargin)) / 100;
      if (diff <= 0) return err("Product gross margin must exceed target post-shipping margin.");
      return done([outN("Minimum free-shipping cart threshold", Number(v.shipCost) / diff, 2, "$", true)]);
    },
  },
  {
    slug: "return-rate-cost",
    fields: [posF("orders", "Total orders", 1000), nnF("retPct", "Return rate %", 12, "%", { max: 100 }), nnF("revShip", "Return shipping + restocking cost", 9.5, "$"), nnF("writeOff", "Damaged/unsellable COGS write-off per return", 6.0, "$")],
    formulaPlain: "Cost per Shipped Order = Return% × (Reverse Shipping + Write-Off)",
    variables: [{ symbol: "Return drag", description: "Hidden return cost per shipped order" }],
    compute: (v) => {
      const rets = Number(v.orders) * (Number(v.retPct) / 100);
      const total = rets * (Number(v.revShip) + Number(v.writeOff));
      return done([outN("Return cost per shipped order", total / Number(v.orders), 2, "$/order", true), outN("Total returns cost", total, 2, "$")]);
    },
  },
  {
    slug: "coupon-stacking",
    fields: [posF("cart", "Cart subtotal", 150, "$"), txtF("coupons", "Sequential percentage coupons", "20, 15"), nnF("cashOff", "Flat voucher applied last ($)", 10, "$")],
    formulaPlain: "Final = max(0, Cart × ∏(1 − cᵢ) − Flat Voucher)",
    variables: [{ symbol: "Effective %", description: "Combined percentage saved" }],
    compute: (v) => {
      const p = parseNumList(String(v.coupons), 1);
      if (!p.ok) return p;
      if (p.value.some((c) => c < 0 || c > 100)) return err("Percentage coupons must lie between 0% and 100%.");
      const cart = Number(v.cart);
      const finalP = Math.max(0, cart * p.value.reduce((a, c) => a * (1 - c / 100), 1) - Number(v.cashOff));
      return done([outN("Final checkout total", finalP, 2, "$", true), outN("Effective total discount", ((cart - finalP) / cart) * 100, 2, "%")]);
    },
  },
  {
    slug: "unit-price-comparison",
    fields: [posF("pA", "Pack A price", 5.49, "$"), posF("qA", "Pack A quantity", 500, "g"), posF("pB", "Pack B price", 8.99, "$"), posF("qB", "Pack B quantity", 1000, "g")],
    formulaPlain: "Compares unit price P_A / Q_A vs P_B / Q_B in identical units",
    variables: [{ symbol: "Pack A, Pack B", description: "Must share the exact same physical unit" }],
    compute: (v) => {
      const uA = Number(v.pA) / Number(v.qA), uB = Number(v.pB) / Number(v.qB);
      return done([outS("Cheaper per unit", uA < uB ? "Pack A" : uB < uA ? "Pack B" : "Equal unit price", undefined, true), outN("Pack A per 100 units", uA * 100, 3, "$"), outN("Pack B per 100 units", uB * 100, 3, "$")]);
    },
  },
  {
    slug: "price-rounding",
    fields: [
      posF("raw", "Calculated raw price", 43.27, "$"),
      selF("ending", "Charm ending strategy", [
        { value: "0.99", label: ".99 charm pricing" }, { value: "0.95", label: ".95 charm pricing" }, { value: "0.00", label: "Whole prestige integer (.00)" },
      ]),
    ],
    formulaPlain: "Rounds nearest integer floor/round + chosen psychological ending",
    variables: [{ symbol: "Ending", description: "Retail price point convention" }],
    compute: (v) => {
      const r = Number(v.raw), end = Number(v.ending);
      const rounded = end === 0 ? Math.round(r) : Math.floor(r) + end;
      return done([outS("Rounded retail price", `$${rounded.toFixed(2)}`, undefined, true), outN("Delta vs raw price", rounded - r, 2, "$")]);
    },
  },
  {
    slug: "digital-vat",
    fields: [posF("amount", "Digital product amount", 29.0, "$"), nnF("vatRate", "Applicable buyer-country VAT/GST rate", 20.0, "%"), selF("mode", "Pricing basis", [{ value: "incl", label: "Tax-inclusive consumer price" }, { value: "excl", label: "Tax-exclusive net price" }])],
    formulaPlain: "Parametric VAT using user-supplied buyer destination VAT rate (EU OSS / UK / GCC rules vary by jurisdiction)",
    variables: [{ symbol: "Destination Rate", description: "User-supplied statutory rate for buyer jurisdiction" }],
    compute: (v) => {
      const a = Number(v.amount), r = Number(v.vatRate) / 100;
      const net = v.mode === "incl" ? a / (1 + r) : a;
      const vat = net * r;
      return done([outN("Seller net revenue", net, 2, "$", true), outN("Destination VAT due", vat, 2, "$"), outN("Gross buyer total", net + vat, 2, "$")]);
    },
  },
  {
    slug: "product-cost-markup",
    fields: [posF("targetNet", "Desired net payout after fees", 28, "$"), nnF("refFeePct", "Marketplace commission %", 15, "%", { max: 95 }), nnF("payFeePct", "Payment gateway %", 2.9, "%", { max: 95 }), nnF("fixedFee", "Fixed per-order fee", 0.3, "$")],
    formulaPlain: "List Price = (Desired Net + Fixed Fee) / (1 − Referral% − Gateway%)",
    variables: [{ symbol: "List Price", description: "Gross marketplace listing price" }],
    compute: (v) => {
      const keep = 1 - (Number(v.refFeePct) + Number(v.payFeePct)) / 100;
      if (keep <= 0) return err("Combined percentage fees must be strictly below 100%.");
      return done([outN("Required marketplace list price", (Number(v.targetNet) + Number(v.fixedFee)) / keep, 2, "$", true)]);
    },
  },

  // ── C22 Real Estate and Property Investment (16) ───────────────────────────
  {
    slug: "cap-rate",
    fields: [numF("noi", "Annual Net Operating Income (NOI)", 31500, "$"), posF("price", "Property market value / price", 450000, "$")],
    formulaPlain: "Cap Rate% = (NOI / Property Price) × 100",
    variables: [{ symbol: "NOI, Price", description: "Unlevered annual property yield" }],
    compute: (v) => done([outN("Capitalisation rate (Cap Rate)", (Number(v.noi) / Number(v.price)) * 100, 2, "%", true)]),
  },
  {
    slug: "noi",
    fields: [posF("grossRent", "Gross scheduled annual rent", 48000, "$"), nnF("vacPct", "Vacancy & credit loss %", 5, "%", { max: 100 }), nnF("opex", "Annual operating expenses (excl. debt service)", 14100, "$")],
    formulaPlain: "NOI = Gross Rent × (1 − Vacancy%) − Operating Expenses",
    variables: [{ symbol: "NOI", description: "Excludes mortgage principal/interest and income taxes" }],
    compute: (v) => {
      const egi = Number(v.grossRent) * (1 - Number(v.vacPct) / 100);
      return done([outN("Net Operating Income (NOI)", egi - Number(v.opex), 2, "$/yr", true), outN("Effective gross income", egi, 2, "$/yr")]);
    },
  },
  {
    slug: "gross-rent-multiplier",
    fields: [posF("price", "Property price", 420000, "$"), posF("grossRent", "Annual gross scheduled rent", 42000, "$/yr")],
    formulaPlain: "GRM = Property Price / Annual Gross Rent",
    variables: [{ symbol: "GRM", description: "Years of gross rent equal to purchase price" }],
    compute: (v) => done([outN("Gross Rent Multiplier (GRM)", Number(v.price) / Number(v.grossRent), 2, "×", true)]),
  },
  {
    slug: "cash-on-cash-return",
    fields: [numF("cf", "Annual pre-tax cash flow (after debt service)", 8400, "$"), posF("cashInv", "Total cash invested (down + closing + rehab)", 95000, "$")],
    formulaPlain: "Cash-on-Cash% = (Annual Pre-Tax Cash Flow / Total Cash Invested) × 100",
    variables: [{ symbol: "Cash Flow, Cash Invested", description: "Levered first-year cash yield" }],
    compute: (v) => done([outN("Cash-on-Cash return", (Number(v.cf) / Number(v.cashInv)) * 100, 2, "%", true)]),
  },
  {
    slug: "rental-yield",
    fields: [posF("monthlyRent", "Monthly rent", 2400, "$"), posF("price", "Property purchase price", 380000, "$"), nnF("annualCosts", "Annual operating costs", 7200, "$")],
    formulaPlain: "Gross Yield = 12·Rent / Price; Net Yield = (12·Rent − Costs) / Price",
    variables: [{ symbol: "Gross vs Net Yield", description: "Unlevered gross and net rental yields" }],
    compute: (v) => {
      const ann = Number(v.monthlyRent) * 12, p = Number(v.price);
      return done([outN("Gross rental yield", (ann / p) * 100, 2, "%", true), outN("Net rental yield", ((ann - Number(v.annualCosts)) / p) * 100, 2, "%")]);
    },
  },
  {
    slug: "vacancy-adjusted-income",
    fields: [posF("monthlyRent", "Gross monthly rent", 2600, "$"), nnF("vacPct", "Expected vacancy rate", 6.5, "%", { max: 100 })],
    formulaPlain: "Effective Rent = Gross Rent × (1 − Vacancy%)",
    variables: [{ symbol: "Vacancy%", description: "Expected occupancy loss allowance" }],
    compute: (v) => {
      const eff = Number(v.monthlyRent) * (1 - Number(v.vacPct) / 100);
      return done([outN("Effective monthly income", eff, 2, "$/mo", true), outN("Effective annual income", eff * 12, 2, "$/yr")]);
    },
  },
  {
    slug: "rental-cash-flow",
    fields: [posF("rent", "Monthly rent", 2500, "$"), nnF("vacPct", "Vacancy %", 5, "%", { max: 100 }), nnF("opex", "Monthly taxes, insurance, maint & mgmt", 650, "$"), nnF("debt", "Monthly mortgage P&I", 1380, "$")],
    formulaPlain: "Monthly Cash Flow = Rent·(1 − Vacancy%) − OpEx − Debt Service",
    variables: [{ symbol: "Cash Flow", description: "Pre-tax monthly & annual net cash flow" }],
    compute: (v) => {
      const cf = Number(v.rent) * (1 - Number(v.vacPct) / 100) - Number(v.opex) - Number(v.debt);
      return done([outN("Monthly net cash flow", cf, 2, "$/mo", true), outN("Annual net cash flow", cf * 12, 2, "$/yr")]);
    },
  },
  {
    slug: "property-roi",
    fields: [numF("annualCf", "Annual net cash flow", 6500, "$"), numF("apprec", "Annual appreciation gain", 12000, "$"), nnF("prinPaydown", "Annual principal paydown", 4200, "$"), posF("equity", "Total equity invested", 100000, "$")],
    formulaPlain: "Total Return% = (Cash Flow + Appreciation + Principal Paydown) / Equity × 100",
    variables: [{ symbol: "Total Return", description: "Combined yield from cash flow, appreciation, and amortisation" }],
    compute: (v) => {
      const tot = Number(v.annualCf) + Number(v.apprec) + Number(v.prinPaydown);
      return done([outN("Total annual return on equity", (tot / Number(v.equity)) * 100, 2, "%", true), outN("Dollar wealth gain", tot, 2, "$")]);
    },
  },
  {
    slug: "flip-profit",
    fields: [posF("arv", "After-Repair Value (ARV)", 420000, "$"), posF("purchase", "Purchase price", 265000, "$"), nnF("rehab", "Rehab budget", 55000, "$"), nnF("holding", "Holding & financing costs", 14000, "$"), nnF("sellPct", "Selling & closing costs % of ARV", 8, "%")],
    formulaPlain: "Flip Profit = ARV − Purchase − Rehab − Holding − ARV·Selling%",
    variables: [{ symbol: "ARV, Rehab, Holding", description: "House-flipping net profit estimate" }],
    compute: (v) => {
      const arv = Number(v.arv), sell = arv * (Number(v.sellPct) / 100);
      const prof = arv - Number(v.purchase) - Number(v.rehab) - Number(v.holding) - sell;
      return done([outN("Net flip profit", prof, 2, "$", true), outN("Return on total project cost", (prof / (arv - prof)) * 100, 2, "%")]);
    },
  },
  {
    slug: "seventy-percent-rule",
    fields: [posF("arv", "Estimated After-Repair Value (ARV)", 350000, "$"), nnF("repairs", "Estimated renovation cost", 45000, "$")],
    formulaPlain: "Max Offer = 0.70 × ARV − Repairs (investor screening heuristic, not an appraisal)",
    variables: [{ symbol: "ARV, Repairs", description: "70% rule quick deal screen" }],
    compute: (v) => done([outN("Maximum 70%-rule offer", 0.7 * Number(v.arv) - Number(v.repairs), 2, "$", true)]),
  },
  {
    slug: "one-percent-rule",
    fields: [posF("rent", "Monthly gross rent", 2600, "$"), posF("price", "All-in property price", 250000, "$")],
    formulaPlain: "Monthly Rent / Price ≥ 1.0% screening heuristic",
    variables: [{ symbol: "Rent/Price", description: "Investor screening heuristic (ignores taxes/HOA/capex)" }],
    compute: (v) => {
      const pct = (Number(v.rent) / Number(v.price)) * 100;
      return done([outN("Monthly rent-to-price ratio", pct, 2, "%", true), outS("1% Rule Screen", pct >= 1 ? "Passes (≥ 1.00%)" : "Below 1% threshold")]);
    },
  },
  {
    slug: "rent-increase",
    fields: [posF("current", "Current monthly rent", 1950, "$"), numF("pct", "Increase percentage", 4.5, "%")],
    formulaPlain: "New Rent = Current × (1 + % / 100)",
    variables: [{ symbol: "Current, %", description: "Lease renewal rent adjustment" }],
    compute: (v) => {
      const inc = Number(v.current) * (Number(v.pct) / 100);
      return done([outN("New monthly rent", Number(v.current) + inc, 2, "$/mo", true), outN("Annual increase", inc * 12, 2, "$/yr")]);
    },
  },
  {
    slug: "agent-commission",
    fields: [posF("salePrice", "Sale price", 480000, "$"), nnF("totalRate", "Total gross commission %", 5.5, "%"), nnF("agentSplit", "Agent brokerage split %", 70, "%", { max: 100 })],
    formulaPlain: "Gross Commission = Price × Rate%; Side Share = ½ Gross × Broker Split%",
    variables: [{ symbol: "Sale Price, Rate%, Split%", description: "Real-estate brokerage commission split" }],
    compute: (v) => {
      const gross = Number(v.salePrice) * (Number(v.totalRate) / 100);
      return done([outN("Total gross commission", gross, 2, "$", true), outN("Agent net share (assuming 50/50 co-broke)", 0.5 * gross * (Number(v.agentSplit) / 100), 2, "$")]);
    },
  },
  {
    slug: "lease-proration",
    fields: [posF("monthlyRent", "Monthly rent", 2100, "$"), intF("occupiedDays", "Occupied days in month", 17, { min: 1, max: 31 }), intF("daysInMonth", "Actual days in month (or 30 banker convention)", 31, { min: 28, max: 31 })],
    formulaPlain: "Prorated Rent = (Monthly Rent / Days Basis) × Occupied Days",
    variables: [{ symbol: "Occupied, Basis", description: "Actual-days vs 30-day lease proration" }],
    compute: (v) => {
      if (Number(v.occupiedDays) > Number(v.daysInMonth)) return err("Occupied days cannot exceed days in month.");
      return done([outN("Prorated rent due", (Number(v.monthlyRent) / Number(v.daysInMonth)) * Number(v.occupiedDays), 2, "$", true), outN("Daily rate", Number(v.monthlyRent) / Number(v.daysInMonth), 2, "$/day")]);
    },
  },
  {
    slug: "security-deposit",
    fields: [posF("deposit", "Security deposit held", 2400, "$"), nnF("rate", "Annual statutory/escrow rate", 2.5, "%"), posF("months", "Tenancy duration", 24, "months")],
    formulaPlain: "Simple Interest = Deposit × Rate × (Months / 12)",
    variables: [{ symbol: "Deposit, Rate, Months", description: "Escrow deposit interest calculation" }],
    compute: (v) => {
      const intr = Number(v.deposit) * (Number(v.rate) / 100) * (Number(v.months) / 12);
      return done([outN("Accrued deposit interest", intr, 2, "$", true), outN("Deposit + interest refund", Number(v.deposit) + intr, 2, "$")]);
    },
  },
  {
    slug: "leverage-roi",
    fields: [posF("price", "Property value", 400000, "$"), posF("noi", "Annual NOI", 28000, "$"), nnF("ltv", "Loan-to-Value %", 75, "%", { max: 95 }), nnF("interestRate", "Debt cost (annual %)", 6.0, "%"), numF("apprec", "Appreciation %", 3.0, "%")],
    formulaPlain: "Levered ROE = (NOI − Debt·i + Price·Appreciation) / Equity",
    variables: [{ symbol: "LTV, Cap vs Debt Cost", description: "Positive vs negative financial leverage on real estate" }],
    compute: (v) => {
      const p = Number(v.price), loan = p * (Number(v.ltv) / 100), eq = p - loan;
      const levered = Number(v.noi) - loan * (Number(v.interestRate) / 100) + p * (Number(v.apprec) / 100);
      return done([outN("Levered return on equity", (levered / eq) * 100, 2, "%", true), outN("Unlevered return", ((Number(v.noi) + p * (Number(v.apprec) / 100)) / p) * 100, 2, "%")]);
    },
  },
];
