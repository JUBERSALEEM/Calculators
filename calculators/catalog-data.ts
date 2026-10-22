// Auto-generated verbatim projection of docs/project-plan/tools/catalog_source.py (1,248 calculators across 84 categories).
// Do not hand-edit IDs, slugs, categories, or formulaStatus; docs/project-plan/catalog.csv remains the planning source of truth.

export interface CatalogCategoryInfo {
  code: string;
  slug: string;
  title: string;
  label: string;
  familySummary: string;
  count: number;
}

export interface CatalogEntryRaw {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryLabel: string;
  inputsOutputs: string;
  complexity: "Simple" | "Moderate" | "Complex" | "Specialist";
  priority: "P0" | "P1" | "P2" | "P3";
  formulaStatus: "SOURCE_VERIFIED" | "RESEARCH_REQUIRED" | "SPECIALIST_REVIEW_REQUIRED";
  note: string;
  intent: "calculate" | "convert" | "estimate";
  sources: Array<{ code: string; title: string; url: string; accessed: string }>;
  related: string[];
}

export const CATALOG_CATEGORIES: CatalogCategoryInfo[] = [
  {
    "code": "C01",
    "slug": "c01",
    "title": "Basic Arithmetic and Percentages",
    "label": "C01 \u00b7 Basic Arithmetic and Percentages",
    "familySummary": "F-ARI-01 Percent of a base `part = p/100 * base`; reverse form `base = part / (p/100)`.\nEdge cases: p may be negative; base = 0 is undefined for the reverse form.\nF-ARI-02 Relative change `change% = (B-A)/|A|*100` (asymmetric, base = A) vs\n`symmetric difference% = |A-B|/((A+B)/2)*100`. These are different quantities and must never\nbe merged: a change from 100 to 120 is +20% change but 18.18% symmetric difference.\nF-ARI-03 Percentage points `pp = p2 - p1` where p1,p2 are already percentages; cannot be\nderived from relative change without the original base.\nF-ARI-04 Successive changes `net = (1+r1)(1+r2)...-1`; order-independent for multiplication\nbut NOT for mixed add/subtract-percent workflows applied to a running balance.\nF-ARI-05 Rounding half-up vs half-even (banker's) vs truncation differ on exact ties;\nsee REF-IEEE754 for binary floating-point tie behaviour.",
    "count": 14
  },
  {
    "code": "C02",
    "slug": "c02",
    "title": "Fractions, Ratios, Proportions and Averages",
    "label": "C02 \u00b7 Fractions, Ratios, Proportions and Averages",
    "familySummary": "F-FRA-01 Exact rational arithmetic `a/b + c/d = (ad+cb)/(bd)`, reduced by\n`g = gcd(|num|,den)`. Implementation must use exact integers (or BigInt) and only round at\ndisplay, otherwise 1/3+1/3+1/3 != 1.\nF-FRA-02 Repeating decimal -> fraction for `0.\\overline{d}` with k repeating digits:\n`x = d/(10^k - 1)`; mixed forms require shifting by the non-repeating prefix length.\nF-FRA-03 Means arithmetic `(\u03a3x)/n`, weighted `\u03a3w\u00b7x/\u03a3w`, harmonic `n/\u03a3(1/x)`,\ngeometric `(\u03a0x)^(1/n)`. Harmonic is required for averaging rates (e.g. speeds) and geometric\nfor growth factors; using arithmetic mean there is a documented error.\nF-FRA-04 Proportional sharing split total T in ratio a:b:c -> `T\u00b7a/(a+b+c)`; rounding\nresidue must be allocated by a stated rule so parts still sum to T.",
    "count": 17
  },
  {
    "code": "C03",
    "slug": "c03",
    "title": "Algebra and Equation Solving",
    "label": "C03 \u00b7 Algebra and Equation Solving",
    "familySummary": "F-ALG-01 Quadratic `x = (-b \u00b1 sqrt(b\u00b2-4ac))/(2a)`, discriminant `D = b\u00b2-4ac` decides\n0/1/2 real roots; a=0 is not quadratic and must be rejected, not silently linear-solved.\nUse the numerically stable form (`q = -(b + sign(b)sqrt(D))/2`) to avoid catastrophic\ncancellation when `b\u00b2 >> 4ac`.\nF-ALG-02 Linear systems Gaussian elimination with partial pivoting; singular or\nnear-singular matrices must report condition, not a fake answer.\nF-ALG-03 Logarithms `log_b(x)` defined only for x>0, b>0, b\u22601; implement as\n`ln x / ln b` and special-case b=10, b=2, b=e.\nF-ALG-04 nth roots odd roots of negative reals are real (`(-8)^(1/3) = -2`); even roots\nare not. JavaScript `Math.pow` returns NaN for negative base with fractional exponent.",
    "count": 14
  },
  {
    "code": "C04",
    "slug": "c04",
    "title": "Geometry and Mensuration",
    "label": "C04 \u00b7 Geometry and Mensuration",
    "familySummary": "F-GEO-01 Circle `A = \u03c0r\u00b2`, `C = 2\u03c0r`, `d = 2r`; use r>0. Sector:\n`A = \u00bdr\u00b2\u03b8` with \u03b8 in radians, arc `s = r\u03b8`.\nF-GEO-02 Triangle Heron `A = sqrt(s(s-a)(s-b)(s-c))`, `s=(a+b+c)/2`; validity requires\nthe triangle inequality `a+b>c` etc. A degenerate (collinear) input returns 0, not an error\nvalue from a negative radicand.\nF-GEO-03 Solids sphere `V=4/3\u03c0r\u00b3, S=4\u03c0r\u00b2`; cylinder `V=\u03c0r\u00b2h`; cone `V=1/3\u03c0r\u00b2h`;\nfrustum `V = (\u03c0h/3)(R\u00b2+Rr+r\u00b2)`; pyramid `V=Ah/3`; torus `V=2\u03c0\u00b2Rr\u00b2`.\nF-GEO-04 Polygon by coordinates shoelace `A = \u00bd|\u03a3(x_i\u00b7y_{i+1} - x_{i+1}\u00b7y_i)|`;\nself-intersecting polygons must be rejected or documented.\nRounding policy: state significant figures and never round intermediate values.",
    "count": 23
  },
  {
    "code": "C05",
    "slug": "c05",
    "title": "Trigonometry",
    "label": "C05 \u00b7 Trigonometry",
    "familySummary": "F-TRI-01 Right triangle `sin \u03b8 = opp/hyp`, `cos \u03b8 = adj/hyp`, `tan \u03b8 = opp/adj`;\ninverse functions return a principal value \u2014 the caller must resolve the quadrant.\nF-TRI-02 Law of sines `a/sin A = b/sin B = c/sin C = 2R`; the ambiguous SSA case has\n0, 1 or 2 solutions and must be surfaced explicitly.\nF-TRI-03 Law of cosines `c\u00b2 = a\u00b2 + b\u00b2 - 2ab cos C`; angle from\n`cos C = (a\u00b2+b\u00b2-c\u00b2)/(2ab)`; guard `|cos|>1` from floating-point error.\nF-TRI-04 Degree/radian/grad `rad = deg\u00b7\u03c0/180`, `grad = deg\u00b710/9`. Never mix angle units\nbetween an input field and a trig function \u2014 the classic unit bug.\nF-TRI-05 Chord/sagitta `c = 2r sin(\u03b8/2)`, sagitta `h = r(1 - cos(\u03b8/2))`.",
    "count": 12
  },
  {
    "code": "C06",
    "slug": "c06",
    "title": "Calculus and Numerical Methods",
    "label": "C06 \u00b7 Calculus and Numerical Methods",
    "familySummary": "F-CAL-01 Numerical derivative central difference\n`f'(x) \u2248 (f(x+h) - f(x-h))/(2h)` with h scaled to `sqrt(\u03b5)\u00b7max(1,|x|)`; forward difference\nis O(h) and must not be presented as equally accurate.\nF-CAL-02 Quadrature composite Simpson `h/3[f0+4\u03a3odd+2\u03a3even+fn]` requires an even number\nof intervals; trapezoid `h/2[f0+2\u03a3f+fn]`. Report the method and n, because the result is\nmethod-dependent.\nF-CAL-03 Root finding bisection needs a sign change on [a,b]; Newton-Raphson needs f'\nand can diverge or cycle; always return iteration count and residual.\nF-CAL-04 ODE explicit Euler `y_{n+1}=y_n+h\u00b7f(t,y)` is first order; RK4 is fourth order.\nDo not label Euler output as \"the solution\" \u2014 it is an approximation with stated step size.",
    "count": 16
  },
  {
    "code": "C07",
    "slug": "c07",
    "title": "Matrices, Vectors and Linear Algebra",
    "label": "C07 \u00b7 Matrices, Vectors and Linear Algebra",
    "familySummary": "F-LIN-01 Matrix product `C_ij = \u03a3_k A_ik\u00b7B_kj`, defined only when\ncols(A) = rows(B); dimensions must be validated before the loop.\nF-LIN-02 Determinant 2x2 `ad-bc`; general case via LU with partial pivoting \u2014 the product\nof pivots equals det up to sign flips from row swaps. Never use the cofactor expansion\nrecursively for n>6 (O(n!)).\nF-LIN-03 Inverse `A\u207b\u00b9 = adj(A)/det(A)` exists iff det \u2260 0; report the condition number\nrather than a numerically meaningless inverse for ill-conditioned matrices.\nF-LIN-04 Dot/cross `a\u00b7b = |a||b|cos \u03b8`; `|a\u00d7b| = |a||b|sin \u03b8` gives the parallelogram\narea; cross product is 3-D only.",
    "count": 14
  },
  {
    "code": "C08",
    "slug": "c08",
    "title": "Statistics and Probability",
    "label": "C08 \u00b7 Statistics and Probability",
    "familySummary": "F-STA-01 Dispersion population `\u03c3\u00b2 = \u03a3(x-\u03bc)\u00b2/N` vs sample `s\u00b2 = \u03a3(x-x\u0304)\u00b2/(n-1)`.\nMixing the two is the most common statistics defect; the UI must ask which is intended and\nstate it in the output label.\nF-STA-02 Correlation/regression Pearson `r = \u03a3(x-x\u0304)(y-\u0233) / sqrt(\u03a3(x-x\u0304)\u00b2\u03a3(y-\u0233)\u00b2)`;\nslope `b1 = r\u00b7sy/sx`, intercept `b0 = \u0233 - b1x\u0304`. r is not causation and r\u00b2 is the explained\nvariance, not the model's validity.\nF-STA-03 Normal distribution `\u03a6(z)` has no elementary closed form; use an erfc-based\nimplementation, not a lookup table with linear interpolation. Inverse normal needs a\nrational approximation (Acklam/Moro) with stated accuracy.\nF-STA-04 Confidence interval for a mean `x\u0304 \u00b1 t_{\u03b1/2,n-1}\u00b7s/\u221an`; use z only when \u03c3 is\nknown or n is large, and say which was used.\nF-STA-05 Sample size `n = (z\u00b2\u00b7p(1-p))/E\u00b2` for a proportion (Cochran); finite-population\ncorrection `n_adj = n / (1 + (n-1)/N)`.",
    "count": 25
  },
  {
    "code": "C09",
    "slug": "c09",
    "title": "Discrete Mathematics, Combinatorics and Number Theory",
    "label": "C09 \u00b7 Discrete Mathematics, Combinatorics and Number Theory",
    "familySummary": "F-DIS-01 Counting permutations `P(n,r)=n!/(n-r)!`; combinations `C(n,r)=n!/(r!(n-r)!)`;\nwith repetition `C(n+r-1,r)`. Use log-gamma or iterative products \u2014 direct factorials\noverflow IEEE-754 doubles at 171!.\nF-DIS-02 Divisibility `gcd(a,b)` by Euclid; `lcm = |ab|/gcd`; prime factorisation by\ntrial division to sqrt(n) is adequate only for n below the stated bound (state it).\nF-DIS-03 Modular arithmetic `modpow` by square-and-multiply so results stay exact in\nBigInt; modular inverse exists iff gcd(a,m)=1.\nF-DIS-04 Sequences arithmetic `a_n = a_1+(n-1)d`; geometric `a_n = a_1 r^(n-1)`;\nsum forms differ and both must guard r=1.",
    "count": 20
  },
  {
    "code": "C10",
    "slug": "c10",
    "title": "Interest, Time Value of Money and Discounting",
    "label": "C10 \u00b7 Interest, Time Value of Money and Discounting",
    "familySummary": "F-FIN-01 Simple interest `I = P\u00b7r\u00b7t` with t in years; simple discount uses\n`P = F/(1+rt)`. Only valid when interest is not capitalised.\nF-FIN-02 Compound interest `FV = P(1+r/m)^(mt)`; continuous `FV = Pe^(rt)`;\neffective annual rate `EAR = (1+r/m)^m - 1`, continuous `EAR = e^r - 1`.\nF-FIN-03 Annuities ordinary `FV = PMT[((1+i)^n - 1)/i]`,\n`PV = PMT[(1-(1+i)^-n)/i]`; annuity-due multiplies by (1+i); `i=0` is a removable\nsingularity that must be special-cased or the formula divides by zero.\nF-FIN-04 NPV/IRR `NPV = \u03a3 CF_t/(1+r)^t`; IRR solves NPV=0 by iteration and may have\nmultiple roots when cash flows change sign more than once \u2014 report all roots in range.\nF-FIN-05 Fisher relation real return `(1+r_nom)/(1+\u03c0) - 1`, not `r_nom - \u03c0` (that is\nonly an approximation, accurate to ~1% when rates are low).",
    "count": 20
  },
  {
    "code": "C11",
    "slug": "c11",
    "title": "Loans, Amortisation and Credit",
    "label": "C11 \u00b7 Loans, Amortisation and Credit",
    "familySummary": "F-LOAN-01 Amortising payment `PMT = P\u00b7i/(1-(1+i)^-n)` where `i = APR/12` is the\nmonthly periodic rate. The nominal-APR-to-periodic-rate convention differs by jurisdiction\n(US nominal APR/12 vs EU effective/compounded) \u2014 the calculator must state which it uses.\nF-LOAN-02 Amortisation table each row: interest = balance\u00b7i; principal = PMT - interest;\nbalance' = balance - principal. Final payment must be truncated to clear the balance exactly\n(floating-point residue otherwise leaves \u00b11 cent).\nF-LOAN-03 APR vs flat rate flat (add-on) rate applies interest to the original principal\nfor the full term, so a 5% flat rate \u2248 1.8\u00d7 the true annual cost at 60 months. Converting\nflat -> APR requires solving for the rate that amortises the same payment.\nF-LOAN-04 US APR disclosure follows Reg Z Appendix J: actuarial method, unit-period rules,\nAPR = unit-period rate \u00d7 unit-periods per year. Any calculator labelled \"APR (US Reg Z)\" must\nimplement Appendix J, not an approximation.\nF-LOAN-05 Affordability DTI = total monthly debt / gross monthly income; thresholds are\nlender-specific and must not be presented as approval criteria.",
    "count": 20
  },
  {
    "code": "C12",
    "slug": "c12",
    "title": "Mortgages and Property Finance",
    "label": "C12 \u00b7 Mortgages and Property Finance",
    "familySummary": "F-MTG-01 P&I uses F-LOAN-01 with monthly compounding; PITI adds property tax,\nhomeowner insurance and (if applicable) mortgage insurance, each with its own basis\n(annual/12, loan-to-value dependent).\nF-MTG-02 PMI conventional US mortgage insurance is typically required above 80% LTV and\nremovable at 78-80% LTV by servicer/statute; the rate is credit- and program-specific, so the\ncalculator must expose the rate as an input, not invent one.\nF-MTG-03 Refinance break-even `months = total closing costs / monthly saving`; ignores\nterm extension, which changes total interest even when the payment falls.\nF-MTG-04 Points one point = 1% of loan amount; break-even months = cost / monthly saving.\nF-MTG-05 Rent vs buy requires an opportunity-cost assumption, holding period and\ntransaction costs; output must be labelled a model, not advice.",
    "count": 16
  },
  {
    "code": "C13",
    "slug": "c13",
    "title": "Investments, Returns and Portfolio Analysis",
    "label": "C13 \u00b7 Investments, Returns and Portfolio Analysis",
    "familySummary": "F-INV-01 Holding period return `HPR = (End - Begin + Income)/Begin`; annualise with\n`(1+HPR)^(1/years) - 1`. Do not annualise a sub-year return by simple multiplication without\nsaying so.\nF-INV-02 Risk-adjusted Sharpe `(Rp - Rf)/\u03c3p` (\u03c3 of excess returns), Sortino uses\ndownside deviation, Treynor uses beta. Their inputs are not interchangeable.\nF-INV-03 CAPM `E(R) = Rf + \u03b2(E(Rm) - Rf)`; beta from regression of asset on market\nreturns. WACC `= E/V\u00b7Re + D/V\u00b7Rd(1-T)`.\nF-INV-04 Bonds price `= \u03a3 C/(1+y)^t + F/(1+y)^n`; YTM by root-finding; Macaulay duration\n`= \u03a3 t\u00b7PV(CF_t)/Price`, modified duration `= D/(1+y/f)`. Clean vs dirty price and day-count\nconvention (30/360, ACT/365) must be stated.\nF-INV-05 Fee drag a 1% annual fee compounds: over 30 years it removes ~26% of terminal\nvalue at 7% gross \u2014 calculators must compound fees, not subtract them once.",
    "count": 25
  },
  {
    "code": "C14",
    "slug": "c14",
    "title": "Retirement and Pension Planning",
    "label": "C14 \u00b7 Retirement and Pension Planning",
    "familySummary": "F-RET-01 Accumulation `FV = PMT[((1+i)^n-1)/i] + PV(1+i)^n` with real or nominal\nreturns, stated explicitly. Withdrawal phase is the same formula solved for PMT.\nF-RET-02 Safe withdrawal the 4% rule is a historical US result for a 30-year horizon with\na specific asset mix; it is a planning heuristic, not a guarantee, and must be labelled so.\nF-RET-03 US Social Security PIA verified against SSA for 2027 eligibility:\n`0.90\u00b7min(AIME,1340) + 0.32\u00b7clamp(AIME,1340,8077) + 0.15\u00b7max(AIME-8077,0)`, then rounded\nDOWN to the next lower $0.10. Bend points are indexed each year and depend on the year of\nfirst eligibility, not the claim year.\nF-RET-04 RMD `balance / IRS Uniform Lifetime Table factor(age)`; table version and tax\nyear must be shown.",
    "count": 12
  },
  {
    "code": "C15",
    "slug": "c15",
    "title": "Accounting and Bookkeeping",
    "label": "C15 \u00b7 Accounting and Bookkeeping",
    "familySummary": "F-ACC-01 Straight-line depreciation `(cost - salvage)/life`; declining balance\n`opening_book_value \u00b7 (rate/life)` with the rate stated (e.g. 2.0 for double declining);\nswitch to straight line when it is larger. Sum-of-years `(cost-salvage)\u00b7(n-k+1)/S`.\nF-ACC-02 Margins gross `(revenue-COGS)/revenue`; operating adds opex; net adds\ninterest and tax. All are ratios of revenue and must not be mixed.\nF-ACC-03 Liquidity current `CA/CL`; quick `(CA - inventory - prepaid)/CL`.\nF-ACC-04 Turnover and DSO inventory turnover `COGS/avg inventory`;\nDSO `= AR/revenue\u00d7days`; cash conversion cycle `= DIO + DSO - DPO`.\nTax depreciation (e.g. MACRS) is a separate statutory schedule and is not interchangeable\nwith book depreciation.",
    "count": 17
  },
  {
    "code": "C16",
    "slug": "c16",
    "title": "Business Pricing, Margin and Profitability",
    "label": "C16 \u00b7 Business Pricing, Margin and Profitability",
    "familySummary": "F-PRC-01 Markup vs margin markup is on cost, margin on price:\n`margin = markup/(1+markup)`; `markup = margin/(1-margin)`. Confusing them is the single\nmost common pricing error; the calculator must show both.\nF-PRC-02 Discount stacking successive discounts multiply: `net = 1 - \u03a0(1-d_i)`;\n20%+10% is 28% off, not 30%.\nF-PRC-03 Break-even with contribution `Q* = FC/(P - VC)`; requires `P > VC`; if\n`P \u2264 VC` the answer is \"no break-even\", not a negative or infinite quantity.\nF-PRC-04 Price elasticity `E = (%\u0394Q)/(%\u0394P)`; revenue rises with a price cut only when\n`|E| > 1`. Revenue-maximising price is not profit-maximising \u2014 margin must be included.",
    "count": 17
  },
  {
    "code": "C17",
    "slug": "c17",
    "title": "Taxation",
    "label": "C17 \u00b7 Taxation",
    "familySummary": "F-TAX-01 Sales tax / VAT (single stage) `tax = price \u00d7 rate`; tax-inclusive reverse\n`base = total/(1+rate)`. Rates are jurisdiction- and date-specific: store them as versioned\ndata, never hard-code one country's rate into the component.\nF-TAX-02 Progressive income tax bracket walk:\n`tax = \u03a3_j rate_j \u00d7 max(0, min(income, top_j) - bottom_j)`; the marginal rate is the top\nbracket touched, the effective rate is tax/income. Deductions apply to the base before the\nwalk. Verified 2026 US single thresholds (10% to $12,400; 12% to $50,400; 22% to $105,700;\n24% to $201,775; 32% to $256,225; 35% to $640,600; 37% above) from IRS IR-2025-103.\nF-TAX-03 Capital gains holding period determines short- vs long-term treatment; the\nstatutory split and rates differ by jurisdiction and by income.\nF-TAX-04 Never present a tax output as advice. Every tax page requires: jurisdiction\nselector or fixed-jurisdiction label, effective tax year, source URL, last-reviewed date.",
    "count": 18
  },
  {
    "code": "C18",
    "slug": "c18",
    "title": "Payroll, Salary and Compensation",
    "label": "C18 \u00b7 Payroll, Salary and Compensation",
    "familySummary": "F-PAY-01 FLSA overtime (US) verified on dol.gov: non-exempt employees receive\n1.5\u00d7 the regular rate for hours over 40 in a fixed 168-hour workweek; averaging across weeks\nis not permitted; the regular rate includes non-discretionary bonuses (so a blended rate may\napply), which is why a blended-rate calculator is a distinct tool.\nF-PAY-02 Conversions annual = hourly \u00d7 hours/week \u00d7 52 (state the 52-week convention);\nmonthly = annual/12; biweekly = annual/26 (not /24). A 4-week month is a different (and\nwrong) convention that must be offered only as an explicitly labelled variant.\nF-PAY-03 Net pay gross \u2212 statutory deductions \u2212 voluntary deductions; deduction order and\nrounding rules are payroll-system specific and must be shown.\nF-PAY-04 Employer cost gross + employer contributions (social insurance, pension,\ninsurance); not the same as employee gross cost.",
    "count": 18
  },
  {
    "code": "C19",
    "slug": "c19",
    "title": "Economics and Business Analytics",
    "label": "C19 \u00b7 Economics and Business Analytics",
    "familySummary": "F-ECO-01 Inflation `CPI ratio`: `rate = (CPI_t/CPI_{t-1} - 1)\u00d7100`; purchasing power\n`PP = amount \u00d7 CPI_base/CPI_current`. CPI is an index with a base period and a basket \u2014 state\nthe series and base year.\nF-ECO-02 Elasticity `E = (\u0394Q/Q)/(\u0394P/P)`; use the midpoint (arc) form for large changes:\n`E = (\u0394Q/((Q1+Q2)/2))/(\u0394P/((P1+P2)/2))`.\nF-ECO-03 Surplus consumer `\u222b(D(p)-p*)`, approximated for linear demand by\n`\u00bd\u00d7base\u00d7height`; state the linearity assumption.\nF-ECO-04 GDP expenditure identity `Y = C + I + G + (X - M)`; growth is real (deflated),\nnot nominal.",
    "count": 13
  },
  {
    "code": "C20",
    "slug": "c20",
    "title": "Marketing and Advertising Metrics",
    "label": "C20 \u00b7 Marketing and Advertising Metrics",
    "familySummary": "F-MKT-01 Cost metrics CPM `= cost/impressions\u00d71000`; CPC `= cost/clicks`;\nCPA `= cost/conversions`. Each is a ratio with a different denominator \u2014 never convert\nbetween them without impressions, clicks and conversions.\nF-MKT-02 Funnel CTR `= clicks/impressions`; CVR `= conversions/clicks`;\nend-to-end `= conversions/impressions = CTR\u00d7CVR`.\nF-MKT-03 Unit economics CAC `= total S&M spend / new customers`;\nLTV (simple) `= ARPU \u00d7 gross margin \u00d7 average lifetime`; LTV:CAC is a ratio, not a currency.\nF-MKT-04 Churn and retention churn `= lost customers / starting customers` over a stated\nperiod; retention `= 1 - churn` only for that same period and cohort definition.\nF-MKT-05 Break-even ROAS `= 1/gross margin`. At 40% margin, break-even ROAS is 2.5.",
    "count": 17
  },
  {
    "code": "C21",
    "slug": "c21",
    "title": "E-commerce and Online Selling",
    "label": "C21 \u00b7 E-commerce and Online Selling",
    "familySummary": "F-ECM-01 Post-fee profit `net = price - COGS - referral fee - fulfilment - payment fee\n- ad cost`. Marketplace fees are category- and region-specific percentages plus fixed\nper-order components; they must be user inputs with sourced defaults, not invented constants.\nF-ECM-02 Landed cost `= goods + freight + duty + insurance + handling`; duty depends on\nHS code and origin (jurisdiction-specific).\nF-ECM-03 Break-even units with ad spend `Q* = (FC + ad spend)/(price - variable cost)`.\nF-ECM-04 Free-shipping threshold choose the order value where contribution after\nshipping still meets the target margin.",
    "count": 13
  },
  {
    "code": "C22",
    "slug": "c22",
    "title": "Real Estate and Property Investment",
    "label": "C22 \u00b7 Real Estate and Property Investment",
    "familySummary": "F-RE-01 Income metrics NOI `= gross rent - vacancy - operating expenses` (excludes debt\nservice and capex); cap rate `= NOI/price`; cash-on-cash `= pre-tax cash flow/cash invested`.\nThese are different denominators and are frequently conflated.\nF-RE-02 Rule-of-thumb filters the 1% rule (monthly rent \u2265 1% of price) and 70% rule\n(offer \u2264 0.70\u00d7ARV \u2212 repairs) are screening heuristics from US investor practice, not\nvaluation methods \u2014 label them.\nF-RE-03 Flip profit `= ARV - purchase - rehab - holding - selling costs - financing`;\nholding cost must include taxes, insurance, utilities and interest.\nF-RE-04 Proration for lease/closing splits use actual days in the month\n(`daily = monthly/days_in_month`) \u2014 the 30-day convention is a different, jurisdiction-specific\nrule and must be selected explicitly.",
    "count": 16
  },
  {
    "code": "C23",
    "slug": "c23",
    "title": "Construction Materials and Quantity Takeoff",
    "label": "C23 \u00b7 Construction Materials and Quantity Takeoff",
    "familySummary": "F-CON-01 Volume `V = L\u00d7W\u00d7D` with unit consistency; slab volume in m\u00b3 then convert to\nbags/yards using the supplier's yield. Waste factor `\u00d7(1+w)` is a user input (typical 5-10%),\nnever a hidden constant.\nF-CON-02 Concrete mix by mass or volume per a stated mix design (e.g. 1:2:4 cement:sand:\naggregate). Nominal mixes are NOT the same as designed mixes to a strength standard; the tool\nmust say which. Dry-volume method: `cement bags = V_dry \u00d7 cement_fraction / bag_yield`.\nF-CON-03 Rebar unit mass `= (d\u00b2/162) kg/m` for steel in mm (derived from \u03c0/4\u00b7d\u00b2\u00b77850);\ntotal `= count \u00d7 length \u00d7 unit mass \u00d7 (1+lap%)`.\nF-CON-04 Masonry bricks per m\u00b2 depends on brick + mortar joint size: \n`n = 1/((l+j)(h+j))`; always expose joint thickness.\nF-CON-05 Paint/coverage `litres = area \u00d7 coats / coverage_per_litre`; coverage is a\nmanufacturer property (state product assumption), and porosity/primer changes it.\nF-CON-06 Roofing one \"square\" = 100 sq ft (US) \u2014 a unit that must be converted explicitly\nfor metric users.",
    "count": 25
  },
  {
    "code": "C24",
    "slug": "c24",
    "title": "Architecture, Building Geometry and Interiors",
    "label": "C24 \u00b7 Architecture, Building Geometry and Interiors",
    "familySummary": "F-ARC-01 Areas built-up vs carpet vs super built-up differ by wall thickness and common-\narea loading factor; the loading factor is a local convention and must be an input.\nF-ARC-02 FAR/FSI `FAR = total floor area / plot area`; permissible FAR is a zoning rule,\nnot a calculation \u2014 the tool computes the achieved value and compares with a user-entered limit.\nF-ARC-03 Stairs comfort rule `2R + T = 600-640 mm` (Blondel-based practice, stated as a\ndesign guideline); stringer length `= sqrt(rise\u00b2 + run\u00b2)` per flight.\nF-ARC-04 Wall area net = gross \u2212 openings; openings must be subtracted before paint/tile\nquantities to avoid systematic over-ordering.\nF-ARC-05 Ventilation `ACH = Q/V` where Q is supply/extract volume flow per hour; required\nACH values for a space type come from local building codes or ASHRAE 62.1 (licensed).",
    "count": 17
  },
  {
    "code": "C25",
    "slug": "c25",
    "title": "Civil and Structural Engineering",
    "label": "C25 \u00b7 Civil and Structural Engineering",
    "familySummary": "F-CIV-01 Statics simply supported UDL: `M_max = wL\u00b2/8`, `V_max = wL/2`; cantilever UDL:\n`M = wL\u00b2/2`. These are linear-elastic, small-deflection, prismatic-section results only.\nF-CIV-02 Section properties rectangle `I = bh\u00b3/12`, `S = bh\u00b2/6`; circle `I = \u03c0d\u2074/64`.\nDeflection of a simply supported UDL beam at midspan: `5wL\u2074/(384EI)`.\nF-CIV-03 Bearing `q = P/A`; allowable bearing pressure is a geotechnical determination,\nnever a calculator output \u2014 the tool compares demand with a user-supplied allowable.\nF-CIV-04 Regulatory design (LRFD/ASD, wind, seismic, snow, rebar detailing, pavement\nthickness) requires licensed standards (ASCE 7, ACI 318, AISC 360, AASHTO, Eurocodes).\nLicensed text is not reproduced here; these entries are marked SPECIALIST_REVIEW_REQUIRED\nand must not be published as design tools without a chartered engineer's sign-off and a\nlicensed copy of the code. Output must be labelled \"preliminary estimate, not design\".\nF-CIV-05 Soil Rankine active pressure `Ka = (1-sin \u03c6)/(1+sin \u03c6)`, `p = Ka\u00b7\u03b3\u00b7z` \u2014\nvalid for dry, cohesionless backfill and horizontal surface only.",
    "count": 20
  },
  {
    "code": "C26",
    "slug": "c26",
    "title": "Mechanical Engineering and Machine Design",
    "label": "C26 \u00b7 Mechanical Engineering and Machine Design",
    "familySummary": "F-MEC-01 Newtonian mechanics `F = ma`, `W = mg` with `g = 9.80665 m/s\u00b2` (exact, NIST\nSP 811 App. B.8); torque `T = F\u00b7r`; rotational power `P = T\u00b7\u03c9`, `\u03c9 = 2\u03c0n/60`.\nF-MEC-02 Transmission gear ratio `= N_driven/N_driver = \u03c9_in/\u03c9_out`; belt speed\n`v = \u03c0Dn/60`; pulley pairs `n1D1 = n2D2` (ideal, no slip).\nF-MEC-03 Machine elements bearing life `L10 = (C/P)^p \u00d7 10\u2076 rev` (p=3 ball, 10/3 roller);\nspring rate `k = Gd\u2074/(8D\u00b3N)`; bolt torque `T = K\u00b7F\u00b7d` with K a friction factor (0.2 typical,\nmust be an input, not a constant).\nF-MEC-04 Section properties `I`, `Z`, radius of gyration `r = sqrt(I/A)`;\nEuler buckling `P_cr = \u03c0\u00b2EI/(KL)\u00b2` \u2014 valid only in the elastic range and with stated K.\nF-MEC-05 Thermal expansion `\u0394L = \u03b1\u00b7L\u00b7\u0394T`; \u03b1 is material-specific and temperature-dependent.",
    "count": 20
  },
  {
    "code": "C27",
    "slug": "c27",
    "title": "Electrical Engineering and Power Systems",
    "label": "C27 \u00b7 Electrical Engineering and Power Systems",
    "familySummary": "F-ELE-01 DC `V = IR`, `P = VI = I\u00b2R = V\u00b2/R`; series `R = \u03a3R_i`; parallel\n`1/R = \u03a31/R_i`.\nF-ELE-02 AC single phase `P = VI\u00b7cos \u03c6` (real), `S = VI` (apparent), `Q = VI\u00b7sin \u03c6`;\npower-factor correction `Qc = P(tan \u03c61 - tan \u03c62)`.\nF-ELE-03 Three phase `P = \u221a3\u00b7V_LL\u00b7I\u00b7cos \u03c6`; the \u221a3 arises from line-to-line vs phase\nvoltage and must not be used for single-phase circuits.\nF-ELE-04 Voltage drop single phase `\u0394V = 2LI(R cos \u03c6 + X sin \u03c6)` (go and return);\nthree phase `\u0394V = \u221a3LI(...)`. Conductor resistance depends on temperature and material.\nF-ELE-05 Ampacity, breaker sizing and earthing are governed by licensed codes (NEC/\nNFPA 70, IEC 60364, BS 7671). Tables are not reproduced; calculators expose the table value\nas a user input or licensed-data dependency and are marked SPECIALIST_REVIEW_REQUIRED.",
    "count": 22
  },
  {
    "code": "C28",
    "slug": "c28",
    "title": "Electronics and Circuit Analysis",
    "label": "C28 \u00b7 Electronics and Circuit Analysis",
    "familySummary": "F-ELX-01 Dividers voltage `Vout = Vin\u00b7R2/(R1+R2)` (unloaded); loading effect changes it,\nso the load resistance must be an input when significant. Current divider\n`I1 = Itot\u00b7R2/(R1+R2)` for two parallel resistors.\nF-ELX-02 RC/RL time constant `\u03c4 = RC` or `L/R`; charge `V(t) = V\u221e(1-e^{-t/\u03c4})`;\ncutoff `f_c = 1/(2\u03c0RC)`.\nF-ELX-03 Op-amp inverting `Av = -Rf/Rin`; non-inverting `Av = 1 + Rf/R1`; these ignore\nbandwidth and slew limits.\nF-ELX-04 LED resistor `R = (Vs - Vf)/If`; power `P = If\u00b2R` \u2014 both must be reported.\nF-ELX-05 dB `dB = 20log10(V2/V1) = 10log10(P2/P1)`; using 10log for voltage is a common\nfactor-of-two error.",
    "count": 20
  },
  {
    "code": "C29",
    "slug": "c29",
    "title": "Chemical Engineering and Process Calculations",
    "label": "C29 \u00b7 Chemical Engineering and Process Calculations",
    "familySummary": "F-CHE-01 Material balance steady state: `\u03a3in = \u03a3out + accumulation(=0)`; conversion\n`X = (F_in - F_out)/F_in`; selectivity `= desired/(undesired produced)`.\nF-CHE-02 Reactor sizing CSTR `V = F_A0\u00b7X/(-r_A)`; PFR `V = F_A0\u222bdX/(-r_A)`;\nspace time `\u03c4 = V/v0`.\nF-CHE-03 Gas laws ideal `PV = nRT` (R = 8.314462618 J/(mol\u00b7K), exact in SI);\nvan der Waals `(P + a n\u00b2/V\u00b2)(V - nb) = nRT` \u2014 coefficients are substance-specific and must be\ntabulated, not invented.\nF-CHE-04 Psychrometry humidity ratio `W = 0.621945\u00b7p_w/(P - p_w)`; enthalpy of moist air\n`h = 1.006T + W(2501 + 1.86T)` (kJ/kg dry air, ASHRAE formulation \u2014 licensed handbook).\nF-CHE-05 Yield `%yield = actual/theoretical\u00d7100`; limiting reagent determined by\n`min(n_i/\u03bd_i)`.",
    "count": 12
  },
  {
    "code": "C30",
    "slug": "c30",
    "title": "Fluid Mechanics and Hydraulics",
    "label": "C30 \u00b7 Fluid Mechanics and Hydraulics",
    "familySummary": "F-FLU-01 Continuity `Q = A\u00b7v`; in a filled pipe `v1A1 = v2A2`.\nF-FLU-02 Reynolds `Re = \u03c1vD/\u03bc = vD/\u03bd`; laminar `<2300`, transitional 2300-4000,\nturbulent `>4000` (values are convention, not physics constants).\nF-FLU-03 Head loss Darcy-Weisbach `h_f = f(L/D)(v\u00b2/2g)`; Colebrook\n`1/\u221af = -2log10(\u03b5/(3.7D) + 2.51/(Re\u221af))` solved iteratively (Swamee-Jain is an explicit\napproximation with ~1% error \u2014 state it). Hazen-Williams `h_f = 10.67 L Q^1.852/(C^1.852 D^4.87)`\n(SI, water at ~20 \u00b0C) is empirical and material-specific.\nF-FLU-04 Pump power hydraulic `P_h = \u03c1gQH`; shaft `P_s = P_h/\u03b7`.\nF-FLU-05 Hydrostatics `p = \u03c1gh`; buoyancy `F = \u03c1_fluid\u00b7g\u00b7V_displaced`.",
    "count": 16
  },
  {
    "code": "C31",
    "slug": "c31",
    "title": "Thermodynamics and Heat Transfer",
    "label": "C31 \u00b7 Thermodynamics and Heat Transfer",
    "familySummary": "F-THT-01 Conduction 1-D steady `q = kA\u0394T/L`; plane wall resistance `R = L/(kA)`;\ncylindrical `R = ln(r2/r1)/(2\u03c0kL)`.\nF-THT-02 Convection Newton `q = hA\u0394T`; h is empirical and depends on geometry and flow \u2014\nit must be an input or derived from a cited correlation with its validity range.\nF-THT-03 Radiation `q = \u03b5\u03c3A(T_s\u2074 - T_surr\u2074)` with \u03c3 = 5.670374419e-8 W/(m\u00b2\u00b7K\u2074) and\nT in kelvin (using \u00b0C is a physically wrong but common bug).\nF-THT-04 HX LMTD `\u0394T_lm = (\u0394T1-\u0394T2)/ln(\u0394T1/\u0394T2)`; if \u0394T1 = \u0394T2 use the limit = \u0394T1.\nF-THT-05 HVAC sizing 1 ton of refrigeration = 12,000 Btu/h = 3.5168528421 kW;\ncooling-load estimates are approximations and must be labelled, with a room-by-room\nManual J-type calculation distinguished from a rule-of-thumb.\nF-THT-06 COP and Carnot `COP_R = Q_c/W`; `COP_Carnot = T_c/(T_h - T_c)` in kelvin \u2014\nan upper bound, never achievable.",
    "count": 18
  },
  {
    "code": "C32",
    "slug": "c32",
    "title": "Manufacturing, Production and OEE",
    "label": "C32 \u00b7 Manufacturing, Production and OEE",
    "familySummary": "F-MFG-01 OEE `OEE = Availability \u00d7 Performance \u00d7 Quality` where\n`A = runtime/planned time`, `P = (ideal cycle \u00d7 units)/runtime`,\n`Q = good units/total units`. OEE is multiplicative \u2014 averaging the three components or\nadding them is invalid and produces >100% results.\nF-MFG-02 Takt `= available time/customer demand`; cycle time is a measured process value\nand is not interchangeable with takt.\nF-MFG-03 Little's law `WIP = throughput \u00d7 flow time`; applies to stable systems only.\nF-MFG-04 Line balance efficiency `= \u03a3 task times/(stations \u00d7 cycle time)`.\nF-MFG-05 Capacity `= units/hour \u00d7 available hours \u00d7 OEE`; planned vs available time must\nbe separated from downtime.",
    "count": 16
  },
  {
    "code": "C33",
    "slug": "c33",
    "title": "Cutting Stock, Nesting and Optimisation",
    "label": "C33 \u00b7 Cutting Stock, Nesting and Optimisation",
    "familySummary": "F-CUT-01 1-D cutting stock minimise stock length used for a demand list; first-fit\ndecreasing is a heuristic with a known worst case (`FFD \u2264 11/9\u00b7OPT + 6/9`), not an optimum.\nThe tool must state that the plan is heuristic and show the lower bound.\nF-CUT-02 Kerf every cut consumes blade width: usable length must be reduced by\n`(pieces-1)\u00d7kerf`; ignoring kerf systematically under-orders material.\nF-CUT-03 2-D nesting rectangle bin packing is NP-hard; report used area, waste % and the\nshelf/guillotine algorithm used. Do not present an approximate nesting as optimal.\nF-CUT-04 Yield `yield% = used area/length \u00f7 purchased \u00d7 100`; offcut value is\n`offcut area \u00d7 unit price \u00d7 resale factor`.",
    "count": 12
  },
  {
    "code": "C34",
    "slug": "c34",
    "title": "Glass Manufacturing and Glazing",
    "label": "C34 \u00b7 Glass Manufacturing and Glazing",
    "familySummary": "F-GLS-01 Weight `mass = area \u00d7 thickness \u00d7 density`; soda-lime glass density\n\u22482500 kg/m\u00b3, so 1 m\u00b2 of 6 mm glass \u2248 15 kg. Density varies by glass type \u2014 expose it.\nF-GLS-02 Cutting yield `yield% = \u03a3 piece areas / sheet area \u00d7 100`, minus kerf/edge trim;\nglass cannot be re-joined, so offcut value is only realised if a future order uses it.\nF-GLS-03 Structural glazing thickness selection for wind load and deflection follows\nASTM E1300 / EN 16612, which are licensed and involve load-duration factors \u2014 SPECIALIST\nREVIEW REQUIRED. Never compute \"required thickness\" from area alone and present it as safe.\nF-GLS-04 U-value IGU centre-of-glass `U \u2248 (1/U1 + 1/U2)\u207b\u00b9` ignoring gas and frame;\nwhole-window Uw requires frame and spacer data (EN 14351-1 / NFRC).",
    "count": 14
  },
  {
    "code": "C35",
    "slug": "c35",
    "title": "Woodworking, Joinery and Timber",
    "label": "C35 \u00b7 Woodworking, Joinery and Timber",
    "familySummary": "F-WDW-01 Board foot (US/Canada) `bf = t(in)\u00d7w(in)\u00d7L(ft)/12`; a \"board foot\" is a volume,\nnot an area, and metric users need m\u00b3 conversion.\nF-WDW-02 Sheet goods `sheets = ceil(area/sheet area \u00d7 (1+waste))`; panel thickness and\nnominal vs actual dimensions differ (a \"3/4 inch\" plywood is 18 mm-ish, not 19.05 mm).\nF-WDW-03 Moisture movement dimensional change is anisotropic:\n`\u0394L \u2248 L \u00d7 (MC2 - MC1) \u00d7 coefficient` with different coefficients for tangential, radial and\nlongitudinal directions \u2014 a single shrinkage number is wrong.\nF-WDW-04 Span tables joist/rafter sizes come from species-grade-span tables (e.g. IRC\nR502, EN 338/1995); they are code documents and cannot be approximated by a formula.",
    "count": 12
  },
  {
    "code": "C36",
    "slug": "c36",
    "title": "Metal Fabrication and Machining",
    "label": "C36 \u00b7 Metal Fabrication and Machining",
    "familySummary": "F-MET-01 Mass of steel sections plate `m = L\u00d7W\u00d7t\u00d7\u03c1` (\u03c1 = 7850 kg/m\u00b3 for carbon steel);\npipe `m = \u03c0(D-t)t\u00b7L\u00b7\u03c1`; the widely used `d\u00b2/162` kg/m for rebar is the same identity with\n\u03c1 = 7850 and d in mm.\nF-MET-02 Bend allowance `BA = \u03b8(\u03c0/180)(R + K\u00b7T)` with \u03b8 in degrees, K the K-factor\n(0.33-0.50 depending on R/T and material) \u2014 K must be an input, not a constant.\nBend deduction `BD = 2(R+T)tan(\u03b8/2) - BA`.\nF-MET-03 Speeds and feeds `n = 1000\u00b7Vc/(\u03c0D)` rpm with Vc in m/min (surface speed);\nfeed rate `vf = fz\u00b7z\u00b7n`.\nF-MET-04 Welding heat input `HI = (V\u00b7I\u00b760)/(1000\u00b7TS)` kJ/mm; consumable mass depends on\njoint geometry and deposition efficiency.\nF-MET-05 Hardness conversion (HRC/HV/HB) is empirical and standard-specific (ASTM E140);\nconversions are not exact and must not be extrapolated.",
    "count": 16
  },
  {
    "code": "C37",
    "slug": "c37",
    "title": "Textile, Fabric and Garment Production",
    "label": "C37 \u00b7 Textile, Fabric and Garment Production",
    "familySummary": "F-TEX-01 Areal density `GSM = mass(g)/area(m\u00b2)`; `oz/yd\u00b2 = GSM/33.906`.\nF-TEX-02 Yarn count Ne (cotton) `= 590.5/tex`; Nm `= 1000/tex`; denier `= 9\u00d7tex`.\nThese are reciprocal systems \u2014 converting by multiplication is a common defect.\nF-TEX-03 Fabric consumption per garment `= \u03a3(pattern area) \u00d7 (1+waste) \u00d7 GSM`;\nmarker efficiency `= garment area/marker area`.\nF-TEX-04 Thread consumption is stitch-type dependent (301 lockstitch \u2260 504 overlock);\nratios must be sourced per stitch class, not guessed.\nF-TEX-05 Shrinkage `% = (before-after)/before\u00d7100`; apply to pattern dimensions BEFORE\ncosting, and state the test method (e.g. ISO 6330).",
    "count": 15
  },
  {
    "code": "C38",
    "slug": "c38",
    "title": "Packaging and Printing",
    "label": "C38 \u00b7 Packaging and Printing",
    "familySummary": "F-PKG-01 Box volume and blank internal volume `= l\u00d7w\u00d7h`; blank length for an RSC\n`= 2(l+w) + glue flap`; board area must include flap depth.\nF-PKG-02 Corrugated weight `= board area \u00d7 gsm_total/1000` where gsm_total is the sum of\nliner and fluting grades (ECT/BCT strength is a separate, test-based property).\nF-PKG-03 Imposition `sheets = ceil(quantity/(per-sheet \u00d7 (1-waste)))`; print sheet count\nis driven by press sheet size, not finished size.\nF-PKG-04 Paper weight `ream weight = gsm \u00d7 sheet area \u00d7 sheets/ream`; a US ream is 500\nsheets, and \"basis weight\" (lb/ream of a *basis size*) is not gsm.\nF-PKG-05 Bleed/trim add bleed on all sides before imposition; creep in saddle-stitch\nshifts inner pages by `creep = (pages/4)\u00d7paper thickness`.",
    "count": 15
  },
  {
    "code": "C39",
    "slug": "c39",
    "title": "Inventory and Stock Control",
    "label": "C39 \u00b7 Inventory and Stock Control",
    "familySummary": "F-INV-01 EOQ `Q* = sqrt(2DS/H)` with D annual demand, S order cost, H holding cost per\nunit-year; assumes constant demand and no quantity discounts \u2014 state it.\nF-INV-02 Reorder point `ROP = d\u0304\u00b7LT + SS` (SS = z\u00b7\u03c3_d\u00b7\u221aLT for independent demand).\nF-INV-03 Turnover `COGS/avg inventory`; days of inventory `= 365/turnover`.\nF-INV-04 ABC classification by cumulative annual value (Pareto), typically 80/15/5 \u2014\nthresholds are policy, not law.\nF-INV-05 Cycle counting sample size for a desired confidence uses the binomial/hypergeometric\nformula, not a fixed \"count 10 items\" rule.",
    "count": 12
  },
  {
    "code": "C40",
    "slug": "c40",
    "title": "Supply Chain and Logistics",
    "label": "C40 \u00b7 Supply Chain and Logistics",
    "familySummary": "F-SCM-01 Service metrics fill rate `= units shipped/units ordered`;\nOTIF `= orders on time AND in full / total`; perfect order rate further requires damage-free\nand correct documentation \u2014 these are nested, not alternative, measures.\nF-SCM-02 Lead time total `= processing + production + transit + customs + receiving`;\nvariability matters more than the mean for safety stock (see F-INV-02).\nF-SCM-03 Forecast error MAPE `= mean(|A-F|/A)\u00d7100` fails when A=0; prefer MAE/RMSE and\nstate the horizon.\nF-SCM-04 Total cost of ownership sum of unit price, freight, duty, inventory carrying,\nquality and administration \u2014 comparing unit price alone is a documented procurement error.",
    "count": 13
  },
  {
    "code": "C41",
    "slug": "c41",
    "title": "Shipping, Freight and Container Loading",
    "label": "C41 \u00b7 Shipping, Freight and Container Loading",
    "familySummary": "F-SHP-01 Dimensional weight `dim weight = L\u00d7W\u00d7H/divisor` in the carrier's units; the\ndivisor differs by carrier, service and unit system (e.g. 139 in\u00b3/lb, 5000 cm\u00b3/kg, 6000 cm\u00b3/kg)\nand changes over time \u2014 it MUST be a user-editable, source-cited field. Chargeable weight\n`= max(actual, dimensional)`, rounded up to the carrier's increment.\nF-SHP-02 Air freight chargeable weight volumetric `= volume(m\u00b3)\u00d7167 kg` (IATA 6000 cm\u00b3/kg);\nchargeable `= max(gross, volumetric)`.\nF-SHP-03 Container capacity nominal vs practical: 20 ft \u224833 m\u00b3, 40 ft \u224867 m\u00b3,\n40 ft HC \u224876 m\u00b3; usable volume is lower after packing efficiency (typically 80-90%) and\npayload limits are weight-driven, not volume-driven.\nF-SHP-04 Load planning is 3-D bin packing (NP-hard); report packing efficiency and state\nthe algorithm.",
    "count": 16
  },
  {
    "code": "C42",
    "slug": "c42",
    "title": "Automotive and Vehicle Operation",
    "label": "C42 \u00b7 Automotive and Vehicle Operation",
    "familySummary": "F-AUT-01 Fuel cost `cost = distance/consumption \u00d7 price`; unit systems\n(L/100 km vs mpg) are reciprocal \u2014 convert via `mpg(US) = 235.214583/L per 100 km`.\nF-AUT-02 EV energy `kWh = distance \u00d7 consumption(kWh/100 km)/100`; charging cost adds a\ncharging-loss factor (typically 5-15%, must be an input).\nF-AUT-03 Tire sizing `section width (mm) / aspect ratio % R rim (in)`; overall diameter\n`= rim\u00d725.4 + 2\u00d7(width\u00d7aspect/100)`. A size change alters speedometer reading by\n`new/old - 1`.\nF-AUT-04 Speed from gearing `v = (rpm \u00d7 60 \u00d7 circumference)/(gear ratio \u00d7 final drive)`.\nF-AUT-05 Depreciation straight-line, declining-balance and market-data curves differ; a\ncalculator using a formula must say it is an estimate, not a valuation.",
    "count": 16
  },
  {
    "code": "C43",
    "slug": "c43",
    "title": "Aviation and Flight Planning",
    "label": "C43 \u00b7 Aviation and Flight Planning",
    "familySummary": "F-AVI-01 Atmosphere pressure altitude `\u2248 elevation + 30(1013.25 - QNH_hPa)` ft;\ndensity altitude `\u2248 PA + 120(T - ISA_temp)` \u00b0C. Both are approximations \u2014 label them.\nF-AVI-02 Airspeed TAS `\u2248 IAS \u00d7 (1 + altitude/1000 \u00d7 0.02)` is a rough rule; the\nproper relation uses density ratio `TAS = IAS/\u221a\u03c3`, and CAS/EAS distinctions matter.\nF-AVI-03 Wind triangle ground speed and drift from TAS, true course and wind:\n`GS = \u221a(TAS\u00b2 + W\u00b2 - 2\u00b7TAS\u00b7W\u00b7cos(\u0394))`, `drift = asin(W\u00b7sin(\u0394)/TAS)`.\nF-AVI-04 Weight and balance `CG = \u03a3(moment)/\u03a3(weight)`; must be checked against an\nenvelope, not just a single limit.\nF-AVI-05 Regulatory values (takeoff distances, fuel reserves, minima) come from the\nAFM/POH and ICAO/FAA rules \u2014 never generated by a calculator.",
    "count": 13
  },
  {
    "code": "C44",
    "slug": "c44",
    "title": "Marine and Maritime Calculations",
    "label": "C44 \u00b7 Marine and Maritime Calculations",
    "familySummary": "F-MAR-01 Displacement `\u0394 = L\u00d7B\u00d7T\u00d7Cb\u00d7\u03c1`; block coefficient Cb is hull-form specific.\nF-MAR-02 Hull speed `v(kn) \u2248 1.34\u221aLWL(ft)` = `2.43\u221aLWL(m)`; a planing-hull approximation\nlimit, not a physical maximum.\nF-MAR-03 Propeller slip `slip% = (theoretical - actual)/theoretical \u00d7100`.\nF-MAR-04 Stability `GM = KM - KG`; a positive GM is necessary but not sufficient for\nseaworthiness \u2014 free-surface effect reduces GM by `FSM/\u0394`.\nF-MAR-05 Load line / draft change `\u0394draft = weight/(TPC)` where TPC is tonnes per cm\nimmersion from the hydrostatic table. Never interpolate a hydrostatic table without stating it.",
    "count": 13
  },
  {
    "code": "C45",
    "slug": "c45",
    "title": "Physics and Mechanics",
    "label": "C45 \u00b7 Physics and Mechanics",
    "familySummary": "F-PHY-01 Kinematics `v = u + at`, `s = ut + \u00bdat\u00b2`, `v\u00b2 = u\u00b2 + 2as`; valid for constant\nacceleration only.\nF-PHY-02 Energy and momentum `KE = \u00bdmv\u00b2`, `PE = mgh`, `p = mv`, impulse `J = F\u0394t = \u0394p`;\nenergy is conserved only in the absence of non-conservative work.\nF-PHY-03 Circular motion `a_c = v\u00b2/r`, `F_c = mv\u00b2/r`; centripetal force is a resultant,\nnot an extra applied force.\nF-PHY-04 Gravity `F = Gm\u2081m\u2082/r\u00b2` with `G = 6.67430e-11 m\u00b3kg\u207b\u00b9s\u207b\u00b2` (CODATA); surface\n`g = GM/r\u00b2`.\nF-PHY-05 Waves `v = f\u03bb`; pendulum `T = 2\u03c0\u221a(L/g)` valid for small angles only\n(error ~0.2% at 10\u00b0, ~2% at 20\u00b0).",
    "count": 20
  },
  {
    "code": "C46",
    "slug": "c46",
    "title": "Chemistry and Laboratory Methods",
    "label": "C46 \u00b7 Chemistry and Laboratory Methods",
    "familySummary": "F-CHM-01 Concentration molarity `M = n/V(L)`; molality `m = n/kg solvent`;\nmass percent `= m_solute/m_solution\u00d7100`; ppm `= mg/kg` (aqueous, dilute).\nF-CHM-02 Dilution `C1V1 = C2V2` (moles conserved); does not hold when the solute reacts\nor when volumes are not additive \u2014 state the assumption.\nF-CHM-03 pH `pH = -log10(a_H+)`; for strong acid `[H+] = C`; for weak acid solve\n`Ka = x\u00b2/(C-x)`. Buffer `pH = pKa + log([A-]/[HA])` (Henderson-Hasselbalch) \u2014 valid near pKa\nand at moderate ionic strength.\nF-CHM-04 Stoichiometry balance the equation, then limiting reagent\n`min(n_i/\u03bd_i)`; theoretical yield from that reagent.\nF-CHM-05 Half-life first order `t\u00bd = ln2/k`; zero and second order have different forms \u2014\nnever apply ln2/k outside first order.",
    "count": 20
  },
  {
    "code": "C47",
    "slug": "c47",
    "title": "Biology and Life Sciences",
    "label": "C47 \u00b7 Biology and Life Sciences",
    "familySummary": "F-BIO-01 Population growth exponential `N(t) = N0 e^{rt}`; logistic\n`N(t) = K/(1 + ((K-N0)/N0)e^{-rt})` \u2014 K must be supplied, not inferred.\nF-BIO-02 Hardy-Weinberg `p\u00b2 + 2pq + q\u00b2 = 1`; assumes no selection, mutation, migration,\ndrift and random mating \u2014 state the assumption explicitly.\nF-BIO-03 Mendelian ratios monohybrid 3:1, dihybrid 9:3:3:1 for independent assorting\nheterozygotes; deviation requires a chi-square test (see C08), not eyeballing.\nF-BIO-04 Growth kinetics doubling time `t_d = ln2/\u03bc`; Monod `\u03bc = \u03bc_max S/(Ks+S)`.\nF-BIO-05 Enzyme kinetics Michaelis-Menten `v = Vmax S/(Km+S)`; Lineweaver-Burk is a\nlinearisation that distorts error structure \u2014 prefer non-linear fitting.",
    "count": 10
  },
  {
    "code": "C48",
    "slug": "c48",
    "title": "Environmental Science and Emissions",
    "label": "C48 \u00b7 Environmental Science and Emissions",
    "familySummary": "F-ENV-01 Activity \u00d7 factor `emissions = activity \u00d7 emission factor`; factors are\njurisdiction- and year-specific (e.g. grid intensity), so they must be versioned data with a\ncited source. Scope 1/2/3 boundaries must be stated.\nF-ENV-02 Combustion CO\u2082 stoichiometric for a fuel: diesel \u22482.68 kg CO\u2082/L, petrol\n\u22482.31 kg CO\u2082/L, natural gas \u22481.9 kg CO\u2082/m\u00b3 \u2014 these are standard factors but must be sourced\nper inventory (e.g. DEFRA/EPA), not hard-coded from memory.\nF-ENV-03 Waste diversion `= diverted/(diverted+disposed)\u00d7100`; contamination reduces\neffective diversion and should be an input.\nF-ENV-04 AQI is a piecewise-linear index from pollutant concentration breakpoints; the\nbreakpoint table is pollutant- and jurisdiction-specific (US EPA vs WHO vs national).\nF-ENV-05 GWP converts non-CO\u2082 gases using 100-year factors (AR5/AR6 differ: CH\u2084 28 vs\n29.8 fossil) \u2014 the assessment report must be selectable and displayed.",
    "count": 14
  },
  {
    "code": "C49",
    "slug": "c49",
    "title": "Renewable Energy and Solar Systems",
    "label": "C49 \u00b7 Renewable Energy and Solar Systems",
    "familySummary": "F-SOL-01 Yield `E(kWh) = P(kW) \u00d7 H(kWh/m\u00b2/day) \u00d7 PR` where PR (performance ratio)\n\u22480.75-0.85 includes temperature, soiling, inverter and wiring losses; PR must be an input.\nF-SOL-02 Sizing `PV kWp = daily demand / (H \u00d7 PR)`; battery days of autonomy multiply\nthe required storage, not the array.\nF-SOL-03 Tilt/azimuth yield depends on latitude, season and azimuth; the optimum tilt\nis a site-specific optimisation, not a fixed \"latitude\" rule \u2014 any simple rule must be labelled\nan approximation. NREL SAM/PVWatts (fetch failed from this environment) is the reference tool.\nF-SOL-04 Strings `V_string = N \u00d7 Voc \u00d7 (1 + \u03b2(T_min - 25))` must stay below inverter\nmax voltage at record low temperature and above start voltage at high temperature.\nF-SOL-05 Payback `= capex / annual savings`; ignoring degradation, tariff escalation and\ninverter replacement overstates the result.",
    "count": 15
  },
  {
    "code": "C50",
    "slug": "c50",
    "title": "Batteries and Electrical Energy Storage",
    "label": "C50 \u00b7 Batteries and Electrical Energy Storage",
    "familySummary": "F-BAT-01 Runtime ideal `t = C\u00b7V\u00b7DoD/P` hours; real runtime is reduced by Peukert\nbehaviour, inverter efficiency and temperature \u2014 an ideal-only answer must be labelled.\nF-BAT-02 Peukert `t = H(C/(I\u00b7H))^k` with k typically 1.1-1.3 for lead-acid, 1.0-1.05 for\nlithium; k is chemistry-specific, not universal.\nF-BAT-03 Packs series adds voltage, parallel adds capacity; `Wh = Ah \u00d7 V` only for a\nsingle nominal voltage.\nF-BAT-04 Charge time `t = capacity/(charge current \u00d7 efficiency)`, and C-rate limits\napply per chemistry; exceeding them damages cells.\nF-BAT-05 SoC from voltage is only reliable for rested lead-acid; lithium flat OCV curves\nmake voltage-based SoC unreliable \u2014 the tool must say so.",
    "count": 10
  },
  {
    "code": "C51",
    "slug": "c51",
    "title": "Astronomy and Orbital Mechanics",
    "label": "C51 \u00b7 Astronomy and Orbital Mechanics",
    "familySummary": "F-AST-01 Time Julian Date from the Gregorian calendar; `JD 2451545.0 = 2000-01-01 12:00 TT`\n(J2000.0 epoch). Calendar conversion must use the Julian/Gregorian switch rule for dates\nbefore 1582-10-15.\nF-AST-02 Kepler `T\u00b2 = 4\u03c0\u00b2a\u00b3/(GM)`; circular orbital speed `v = \u221a(GM/r)`.\nF-AST-03 Geometry angular size `\u03b8 \u2248 2\u00b7arctan(d/(2D))`; magnitude difference\n`m1 - m2 = -2.5\u00b7log10(F1/F2)`; redshift `z = (\u03bb_obs - \u03bb_emit)/\u03bb_emit`.\nF-AST-04 Solar position accurate solar altitude/azimuth requires the NREL SPA (or Meeus)\nalgorithm with refraction and nutation terms; simple declination formulas carry ~1\u00b0 error and\nmust be labelled approximate.\nF-AST-05 Hohmann transfer `\u0394v1 = \u221a(\u03bc/r1)(\u221a(2r2/(r1+r2)) - 1)` \u2014 impulsive, coplanar,\ncircular-to-circular only.",
    "count": 13
  },
  {
    "code": "C52",
    "slug": "c52",
    "title": "Geography, Mapping and Surveying",
    "label": "C52 \u00b7 Geography, Mapping and Surveying",
    "familySummary": "F-GEO-05 Great-circle distance haversine\n`d = 2R\u00b7asin(\u221a(sin\u00b2(\u0394\u03c6/2) + cos\u03c61\u00b7cos\u03c62\u00b7sin\u00b2(\u0394\u03bb/2)))` with R = 6 371.0088 km (mean) \u2014\ndifferent Earth models change results by up to ~0.5%, so the radius must be stated.\nF-GEO-06 Bearing initial bearing\n`\u03b8 = atan2(sin\u0394\u03bb\u00b7cos\u03c62, cos\u03c61\u00b7sin\u03c62 - sin\u03c61\u00b7cos\u03c62\u00b7cos\u0394\u03bb)`, normalised to 0-360\u00b0.\nF-GEO-07 Coordinate area spherical excess for geodesic polygons; planar shoelace on\nprojected coordinates only for small areas.\nF-GEO-08 DMS `dd = d + m/60 + s/3600` with sign from hemisphere; parsing must reject\n`m \u2265 60`, `s \u2265 60`.\nF-GEO-09 Traverse closure `\u03a3\u0394E, \u03a3\u0394N`; linear misclosure\n`= \u221a(\u03a3\u0394E\u00b2 + \u03a3\u0394N\u00b2)`, relative precision `= misclosure/perimeter`.",
    "count": 14
  },
  {
    "code": "C53",
    "slug": "c53",
    "title": "Meteorology and Climate",
    "label": "C53 \u00b7 Meteorology and Climate",
    "familySummary": "F-MET-01 Wind chill (NWS/Canada) verified on weather.gov:\n`T_wc(\u00b0F) = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275T\u00b7V^0.16`, T in \u00b0F, V in mph.\nDefined ONLY for T \u2264 50 \u00b0F and V > 3 mph; the index applies to human/animal skin, not objects,\nand assumes a clear night sky (sun can add 10-18 \u00b0F). Inanimate objects cannot be cooled below\nair temperature.\nF-MET-02 Heat index (Rothfusz regression, NWS) verified on weather.gov:\n`HI = -42.379 + 2.04901523T + 10.14333127RH - 0.22475541\u00b7T\u00b7RH - 0.00683783T\u00b2\n- 0.05481717RH\u00b2 + 0.00122874T\u00b2RH + 0.00085282TRH\u00b2 - 0.00000199T\u00b2RH\u00b2`, T \u00b0F, RH %.\nStated regression error \u00b11.3 \u00b0F; values are for shade; add up to 15 \u00b0F in direct sun.\nF-MET-03 Dew point / humidity Magnus-Tetens:\n`Td = (b\u00b7\u03b1)/(a - \u03b1)`, `\u03b1 = ln(RH/100) + aT/(b+T)` with a = 17.625 \u00b0C, b = 243.04 \u00b0C\n(valid ~ -40..50 \u00b0C, ~1% RH error); state the coefficient set.\nF-MET-04 Wet bulb requires solving the psychrometric energy balance or a validated\napproximation (Stull 2011); do not present a linear rule as exact.\nF-MET-05 Rainfall `volume = area \u00d7 depth`; 1 mm over 1 m\u00b2 = 1 litre.",
    "count": 12
  },
  {
    "code": "C54",
    "slug": "c54",
    "title": "Agriculture and Horticulture",
    "label": "C54 \u00b7 Agriculture and Horticulture",
    "familySummary": "F-AGR-01 Plant population `plants/ha = 10 000/(row_spacing_m \u00d7 plant_spacing_m)`.\nF-AGR-02 Seed rate `kg/ha = target_plants/m\u00b2 \u00d7 thousand_grain_weight(g)/1000 / germination`.\nF-AGR-03 Growing degree days `GDD = \u03a3 max(0, (T_max+T_min)/2 - T_base)`; base temperature\nis crop-specific and must come from an extension source for that crop.\nF-AGR-04 Grain moisture shrink `shrink% = (MC_initial - MC_target)/(100 - MC_target)\u00d7100`\n(the standard \"wet-bushel\" shrink formula) \u2014 different from a simple linear subtraction.\nF-AGR-05 Stocking rate `AU/ha = forage_production \u00d7 utilisation/(animal intake \u00d7 days)`;\ncarrying capacity depends on the local forage assessment.",
    "count": 12
  },
  {
    "code": "C55",
    "slug": "c55",
    "title": "Irrigation, Fertilisers and Crop Production",
    "label": "C55 \u00b7 Irrigation, Fertilisers and Crop Production",
    "familySummary": "F-IRR-01 Crop water use `ETc = ET0 \u00d7 Kc` (FAO 56). ET0 from the FAO Penman-Monteith\nreference surface (h = 0.12 m grass, 2 m measurement height, r_l = 100 s/m, LAI = 24h);\nKc is crop- and stage-specific and must be sourced from FAO 56 tables.\nFAO 56 Chapter 2 (inspected) warns the resistance formulation assumes neutral stability and\nhourly steps may need stability corrections.\nF-IRR-02 Net irrigation `d_net = ETc - effective rainfall`; gross `= d_net/application\nefficiency` (drip 0.90, sprinkler 0.75, surface 0.60 are typical published ranges \u2014 expose them).\nF-IRR-03 Emitters `count = area/(emitter_spacing \u00d7 row_spacing)`; run time\n`t = volume_required/(emitters \u00d7 emitter_flow)`.\nF-IRR-04 Fertiliser nutrient mass `= product mass \u00d7 nutrient%`; converting elemental P to\nP\u2082O\u2085 multiplies by 2.2914, K to K\u2082O by 1.2046, Ca to CaO by 1.3992 \u2014 oxide-basis conversions\nare a frequent source of gross dosing errors.\nF-IRR-05 Lime requirement requires soil test buffer pH; it is not derivable from target pH\nalone.",
    "count": 12
  },
  {
    "code": "C56",
    "slug": "c56",
    "title": "Food Preparation and Recipe Scaling",
    "label": "C56 \u00b7 Food Preparation and Recipe Scaling",
    "familySummary": "F-FOD-01 Scaling every ingredient multiplies by `factor = new_yield/old_yield`; but\nleavening, salt, and alcohol do not scale linearly in practice \u2014 the tool must warn and offer a\nnon-linear mode for those categories rather than silently scaling.\nF-FOD-02 Baker's percentage flour = 100%; `ingredient% = mass/flour_mass\u00d7100`;\nhydration `= water/flour\u00d7100`. Percentages can exceed 100% and sum above 100%.\nF-FOD-03 Pan conversion compare by area (round: `\u03c0r\u00b2`; square: `l\u00d7w`) and scale by\n`new_area/old_area`; depth changes bake time independently of area.\nF-FOD-04 Brine `% = salt_mass/(water_mass + salt_mass)\u00d7100` (w/w) vs salt/water (w/v) \u2014\nthese differ materially and must be labelled.\nF-FOD-05 Alcohol dilution `V_w = V_s(C_s/C_t - 1)`; volume contraction on mixing means\nthe result is approximate (state \u00b1).",
    "count": 14
  },
  {
    "code": "C57",
    "slug": "c57",
    "title": "Nutrition and Dietary Calculations",
    "label": "C57 \u00b7 Nutrition and Dietary Calculations",
    "familySummary": "F-NUT-01 BMI `BMI = kg/m\u00b2`; US customary `703\u00d7lb/in\u00b2`. CDC adult categories verified:\n<18.5 underweight; 18.5-<25 healthy; 25-<30 overweight; 30-<35 class 1; 35-<40 class 2;\n\u226540 class 3. CDC states BMI is a screening measure, not a diagnosis, and applies to adults\n20+ regardless of age, sex or race; children need age-sex percentiles.\nF-NUT-02 BMR Mifflin-St Jeor: men `10kg + 6.25cm - 5age + 5`; women `-161`.\nHarris-Benedict (revised) is a different, older equation \u2014 results differ ~5%, so the choice\nmust be shown.\nF-NUT-03 TDEE `BMR \u00d7 activity factor`; activity multipliers are population averages with\nlarge individual variance (\u00b120%+).\nF-NUT-04 Macros `protein 4 kcal/g, carbohydrate 4, fat 9, alcohol 7`; the sum must\nreconcile with total energy within rounding.\nF-NUT-05 Body fat (US Navy) circumference regression; accuracy \u00b13-4% and population\nspecific \u2014 must be labelled an estimate.",
    "count": 15
  },
  {
    "code": "C58",
    "slug": "c58",
    "title": "Fitness and Exercise",
    "label": "C58 \u00b7 Fitness and Exercise",
    "familySummary": "F-FIT-01 One-rep max Epley `1RM = w(1 + reps/30)`; Brzycki `w\u00d736/(37-reps)`. These\nestimates diverge above ~10 reps; never present as a measured maximum and require a safety note.\nF-FIT-02 Pace `pace = time/distance`; conversions must keep min/km vs min/mile explicit.\nF-FIT-03 Heart rate zones percent-of-max: `HR_max` from 220-age is a population average\nwith \u00b110-12 bpm SD; Tanaka (`208 - 0.7age`) is an alternative \u2014 the formula must be selectable.\nF-FIT-04 MET calories `kcal = MET \u00d7 3.5 \u00d7 kg / 200 \u00d7 minutes`; MET values come from the\nCompendium of Physical Activities and are averages.\nF-FIT-05 VO2max (Cooper) `= (distance_m - 504.9)/44.73` for the 12-minute run \u2014 a field\nestimate, not a lab measurement.",
    "count": 14
  },
  {
    "code": "C59",
    "slug": "c59",
    "title": "General Health and Clinical Screening",
    "label": "C59 \u00b7 General Health and Clinical Screening",
    "familySummary": "These are screening/estimation tools, NOT diagnostic devices. Every page requires a medical\ndisclaimer, the validated equation name and version, its intended population, and a clear\nstatement of what the tool cannot do.\nF-HLT-01 eGFR (CKD-EPI 2021) creatinine-based, race-free:\n`eGFR = 142 \u00d7 min(Scr/\u03ba,1)^\u03b1 \u00d7 max(Scr/\u03ba,1)^-1.200 \u00d7 0.9938^age \u00d7 1.012 [if female]`\nwith \u03ba = 0.7 (F)/0.9 (M), \u03b1 = -0.241 (F)/-0.302 (M). Requires the 2021 equation; older\nMDRD/CKD-EPI-2009 variants give different numbers and must not be mixed.\nF-HLT-02 Cockcroft-Gault `CrCl = ((140-age)\u00d7weight)/(72\u00d7Scr) \u00d70.85 if female` \u2014 still used\nfor drug dosing, but it is NOT eGFR.\nF-HLT-03 Widmark `BAC% = (A\u00d75.14/W\u00d7r) - 0.015t`; r \u22480.73 male/0.66 female; ignores\nabsorption kinetics and is unsuitable for legal or driving decisions.\nF-HLT-04 Due date Naegele `LMP + 280 days`; only valid for a regular 28-day cycle \u2014\nultrasound dating supersedes it.\nF-HLT-05 IV rate `mL/h = volume/time`; `drops/min = (volume\u00d7drop_factor)/(time_min)`.\nF-HLT-06 Paediatric dosing mg/kg requires a verified weight and a stated maximum dose;\nthe tool must refuse to output a dose without an explicit mg/kg source.",
    "count": 16
  },
  {
    "code": "C60",
    "slug": "c60",
    "title": "Date, Time and Calendar",
    "label": "C60 \u00b7 Date, Time and Calendar",
    "familySummary": "F-DTM-01 Date difference use calendar arithmetic, not `(ms2-ms1)/86400000`, because DST\ntransitions and leap seconds make civil days unequal. Define inclusivity explicitly\n(days between vs days inclusive) \u2014 users assume different conventions.\nF-DTM-02 Add/subtract `Date + n days` in UTC then convert for display; adding months must\nclamp the day-of-month (31 Jan + 1 month = 28/29 Feb).\nF-DTM-03 Business days require a holiday calendar (jurisdiction/year specific); weekends\nalone are not business days in many countries.\nF-DTM-04 ISO week weeks start Monday, week 1 is the week containing the first Thursday;\nnaive `weekOfYear` implementations are off by one at year boundaries.\nF-DTM-05 Age completed years = calendar difference minus one if the birthday has not yet\noccurred this year; do not divide days by 365.25 for a stated age.",
    "count": 15
  },
  {
    "code": "C61",
    "slug": "c61",
    "title": "Unit Conversion and Measurement",
    "label": "C61 \u00b7 Unit Conversion and Measurement",
    "familySummary": "F-UNI-01 Exact factors only. Conversion factors come from NIST SP 811 Appendix B.\nThe inspected table marks exact factors in bold, e.g. inch = 25.4 mm (exact), pound =\n0.453 592 37 kg (exact), standard gravity 9.806 65 m/s\u00b2 (exact), standard atmosphere\n101 325 Pa (exact), Btu_IT = 1.055 056 kJ (not exact). Convert via a single canonical base unit\n(SI) and never round intermediates; round only the displayed result.\nF-UNI-02 Temperature is affine, not multiplicative: `\u00b0F = \u00b0C\u00d79/5 + 32`, `K = \u00b0C + 273.15`\n(exact), `\u00b0R = \u00b0F + 459.67`. Applying a ratio factor to temperatures is wrong.\nF-UNI-03 Significant figures must be preserved: a 3-significant-figure input cannot\nlegitimately produce 10 significant figures of output. Display rounding rules belong in the\nshared formatting layer, not in each calculator.\nF-UNI-04 US vs imperial gallons (US 3.785 411 784 L exact vs imperial 4.546 09 L),\ntons (short 907.184 74 kg vs long 1016.046 908 8 kg vs metric 1000 kg) differ \u2014 never offer\n\"gallon\" or \"ton\" without a system qualifier.\nF-UNI-05 SI prefixes are powers of 10 (kibi/mebi are powers of 2 for data, see C65).",
    "count": 16
  },
  {
    "code": "C62",
    "slug": "c62",
    "title": "Computer Science and Algorithms",
    "label": "C62 \u00b7 Computer Science and Algorithms",
    "familySummary": "F-CSC-01 Radix conversion repeated division; negative values need two's-complement\nsemantics stated explicitly (e.g. 8-bit `-1 = 11111111`).\nF-CSC-02 IEEE-754 double: 1 sign, 11 exponent (bias 1023), 52 fraction; value\n`(-1)^s \u00d7 2^(e-1023) \u00d7 1.f`. Only ~15-17 significant decimal digits are representable, which\nis why money must not use binary floats.\nF-CSC-03 Hash table load factor `\u03b1 = n/m`; expected probe cost grows sharply above\n\u03b1 \u2248 0.7 for open addressing.\nF-CSC-04 Binary search worst case `\u2308log2(n+1)\u2309` comparisons; requires sorted input \u2014\nstating the complexity without the precondition is a common error.\nF-CSC-05 Complexity O(1) < O(log n) < O(n) < O(n log n) < O(n\u00b2) < O(2\u207f) < O(n!);\na calculator can only classify a supplied function, not measure runtime.",
    "count": 12
  },
  {
    "code": "C63",
    "slug": "c63",
    "title": "Programming and Software Development",
    "label": "C63 \u00b7 Programming and Software Development",
    "familySummary": "F-PRG-01 COCOMO basic effort `E = a\u00b7(KLOC)^b` person-months with mode-specific a,b\n(organic/semi-detached/embedded); the coefficients are from the 1981 COCOMO model and its\naccuracy on modern projects is poor \u2014 label it a historical model.\nF-PRG-02 Function points weighted sum of inputs/outputs/queries/files/interfaces with\ncomplexity adjustments; the weighting tables are method-specific (IFPUG).\nF-PRG-03 Velocity `completed points/sprint`; only valid within a stable team and\ndefinition of done. Story points are not time and cannot be converted by a constant factor.\nF-PRG-04 Cyclomatic complexity `M = E - N + 2P` from the control-flow graph; it measures\nbranching, not readability.\nF-PRG-05 Coverage `= executed lines/total lines`; 100% line coverage does not imply\ncorrectness.",
    "count": 12
  },
  {
    "code": "C64",
    "slug": "c64",
    "title": "Networking, IP Addressing and Subnetting",
    "label": "C64 \u00b7 Networking, IP Addressing and Subnetting",
    "familySummary": "F-NET-01 IPv4 subnetting mask `/p` gives `2^(32-p)` addresses,\n`2^(32-p) - 2` usable hosts (network and broadcast reserved) \u2014 except /31 (RFC 3021 point-to-\npoint, 2 usable) and /32. Block size `= 2^(8 - (p mod 8))` within the relevant octet.\nF-NET-02 Network/broadcast network `= ip AND mask`; broadcast `= network OR NOT mask`.\nF-NET-03 Private ranges RFC 1918: 10/8, 172.16/12, 192.168/16; loopback 127/8;\nlink-local 169.254/16. These must be flagged as non-routable.\nF-NET-04 IPv6 a /64 is the standard host subnet; `2^64` addresses; `2^(128-p)` subnets.\nF-NET-05 Transfer time `t = size/throughput` with consistent units (Mbps vs MB/s is a\nfactor-of-8 trap), plus protocol overhead and latency-bandwidth product for realistic estimates.",
    "count": 14
  },
  {
    "code": "C65",
    "slug": "c65",
    "title": "Data Storage and File Size",
    "label": "C65 \u00b7 Data Storage and File Size",
    "familySummary": "F-STO-01 Decimal vs binary prefixes kB = 10\u00b3, KiB = 2\u00b9\u2070; a \"500 GB\" drive is\n500\u00d710\u2079 bytes = 465.7 GiB, which is the entire basis of the \"missing space\" complaint.\nF-STO-02 Media size `bytes = bitrate(bps) \u00d7 duration(s)/8`; audio/video containers add\nper-track overhead and metadata \u2014 the result is an estimate.\nF-STO-03 RAID capacity RAID 0 `= n\u00d7min`, RAID 1 `= min`, RAID 5 `= (n-1)\u00d7min`,\nRAID 6 `= (n-2)\u00d7min`, RAID 10 `= n/2\u00d7min` (usable, assuming equal disks). Rebuild time and\nfailure risk grow with disk size.\nF-STO-04 Compression ratio `= original/compressed`; entropy limits mean ratios above\n~2-4\u00d7 for already-compressed media indicate lossy processing.",
    "count": 9
  },
  {
    "code": "C66",
    "slug": "c66",
    "title": "Web Development and Digital Design",
    "label": "C66 \u00b7 Web Development and Digital Design",
    "familySummary": "F-WEB-01 Aspect ratio `w/h`; resizing keeps the ratio, and \"16:9\" is a ratio, not a size.\nF-WEB-02 Typographic scale modular scale `size_n = base \u00d7 ratio^n`; ratio choices\n(1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618) are design decisions, not laws.\nF-WEB-03 Colour contrast WCAG 2.2 (W3C Recommendation, 12 December 2024) requires\n`(L1 + 0.05)/(L2 + 0.05)` where L is relative luminance with sRGB linearisation; thresholds\n4.5:1 normal text, 3:1 large text (\u226518pt or 14pt bold) and UI components.\nF-WEB-04 Performance budgets page weight, LCP/INP/CLS thresholds are user-defined targets;\nthere is no universal \"passing\" byte count \u2014 only published Core Web Vitals thresholds for\ntiming metrics.\nF-WEB-05 rem/px conversion depends on the root font size (usually but not always 16px),\nso the root size must be an input.",
    "count": 10
  },
  {
    "code": "C67",
    "slug": "c67",
    "title": "Image, Video and Media",
    "label": "C67 \u00b7 Image, Video and Media",
    "familySummary": "F-MED-01 Resolution `pixels = width \u00d7 height`; megapixels `= pixels/1e6`.\nF-MED-02 Storage `size = bitrate \u00d7 duration/8`; bitrate in Mbps yields MB.\nF-MED-03 Frame rate conversion retiming changes duration (`frames/old_fps` vs\n`frames/new_fps`); audio must be resampled or pitch-shifted \u2014 a calculator cannot silently\nassume either.\nF-MED-04 Bandwidth `required = bitrate \u00d7 concurrent viewers`; adaptive streaming uses\nmultiple renditions, so per-viewer average differs from top rendition.\nF-MED-05 Print resolution effective PPI `= pixels/print_inches`; 300 PPI is a common\nphoto-print convention, not a universal requirement (large-format viewing distance reduces it).",
    "count": 14
  },
  {
    "code": "C68",
    "slug": "c68",
    "title": "Photography and Optics",
    "label": "C68 \u00b7 Photography and Optics",
    "familySummary": "F-PHO-01 Depth of field hyperfocal `H = f\u00b2/(N\u00b7c) + f`; near limit\n`s = H\u00b7d/(H + (d-f))`, far `= H\u00b7d/(H - (d-f))`; circle of confusion c is format-dependent and\nmust be an input (0.03 mm for 35 mm full frame is a convention, not physics).\nF-PHO-02 Exposure `EV = log2(N\u00b2/t)` at ISO 100; the exposure triangle scales with ISO:\n`EV_ISO = EV_100 - log2(ISO/100)`. Stops are base-2: 1 stop = \u00d72 light.\nF-PHO-03 ND filters `stops = log2(t_with/t_without)`; a 10-stop ND multiplies exposure\ntime by 1024.\nF-PHO-04 Crop factor `equivalent_focal = f \u00d7 crop`; it changes field of view, NOT\nperspective or exposure (f-number equivalence is a separate, often-misapplied concept).\nF-PHO-05 Print size `inches = pixels/PPI`; resampling does not add real detail.",
    "count": 14
  },
  {
    "code": "C69",
    "slug": "c69",
    "title": "Audio and Acoustics",
    "label": "C69 \u00b7 Audio and Acoustics",
    "familySummary": "F-AUD-01 Decibels power `dB = 10log10(P1/P2)`; amplitude `20log10(A1/A2)`;\ndigital full scale dBFS, analog dBu (`0 dBu = 0.775 V`) and SPL (dB re 20 \u00b5Pa) are DIFFERENT\nreferences and must not be mixed.\nF-AUD-02 Summing levels incoherent sources add as power: `L_total = 10log10(\u03a310^(Li/10))`;\ntwo equal 80 dB sources give 83 dB, not 160 dB.\nF-AUD-03 Room modes axial `f = 343/(2L)` for a rigid-walled rectangular room; real rooms\nwith absorption and non-parallel walls differ.\nF-AUD-04 Speaker delay `t = distance/343` m/s (at 20 \u00b0C, 343 m/s; temperature-dependent).\nF-AUD-05 Digital audio dynamic range \u2248 `6.02\u00d7bits` dB; file size\n`= sample_rate \u00d7 bits \u00d7 channels \u00d7 seconds/8`.",
    "count": 12
  },
  {
    "code": "C70",
    "slug": "c70",
    "title": "Telecommunications",
    "label": "C70 \u00b7 Telecommunications",
    "familySummary": "F-TEL-01 Shannon-Hartley `C = B\u00b7log2(1 + S/N)`; S/N is a linear power ratio, not dB \u2014\npassing dB directly is the classic error (convert: `SNR_linear = 10^(SNR_dB/10)`).\nF-TEL-02 Friis `FSPL(dB) = 20log10(d) + 20log10(f) + 20log10(4\u03c0/c)`; in the common form\n`FSPL(dB) = 32.45 + 20log10(f_MHz) + 20log10(d_km)`.\nF-TEL-03 Link budget `P_rx = P_tx + G_tx - L + G_rx`; the result must be compared with\nreceiver sensitivity and a stated fade margin.\nF-TEL-04 Fresnel zone first zone radius `r = 17.32\u221a(d1\u00b7d2/(f\u00b7D))` (metres, km, GHz);\n60% clearance is the usual planning criterion.\nF-TEL-05 Erlang B blocking probability from traffic intensity; the recursion is\nnumerically stable and must be implemented iteratively, not from a lookup table.",
    "count": 10
  },
  {
    "code": "C71",
    "slug": "c71",
    "title": "Education, Grades and Examination Scoring",
    "label": "C71 \u00b7 Education, Grades and Examination Scoring",
    "familySummary": "F-EDU-01 GPA `GPA = \u03a3(credits \u00d7 grade_points)/\u03a3credits`; grade-point scales differ\n(4.0, 4.3, 5.0, 10-point, percentage bands) and are institution-specific \u2014 never assume 4.0.\nF-EDU-02 Final grade needed `needed = (target - current\u00d7(1-w))/(w)` where w is the final's\nweight; if `needed > 100` the target is unattainable and the tool must say so rather than\nprinting a number above 100.\nF-EDU-03 Weighted average `\u03a3(w_i\u00b7x_i)/\u03a3w_i`, with weights summing to 1 or 100% (validate).\nF-EDU-04 Curving linear `new = old\u00d7scale + offset`; square-root and z-score curves are\ndifferent transformations with different fairness properties \u2014 label the method.\nF-EDU-05 Percentile and standard scores `T = 50 + 10z`, `stanine`, `z` \u2014 these assume a\nreference distribution which must be stated.",
    "count": 14
  },
  {
    "code": "C72",
    "slug": "c72",
    "title": "Research Methodology and Experimental Design",
    "label": "C72 \u00b7 Research Methodology and Experimental Design",
    "familySummary": "F-RES-01 Power for a two-sample t-test\n`n per group \u2248 2(z_{1-\u03b1/2} + z_{1-\u03b2})\u00b2\u03c3\u00b2/\u0394\u00b2`; power `= 1-\u03b2`. Post-hoc power from an observed\neffect is uninformative and must be discouraged in the tool text.\nF-RES-02 Effect size Cohen's d `= (m1-m2)/s_pooled`; Hedges' g applies a small-sample\ncorrection. Benchmarks (0.2/0.5/0.8) are conventions, not thresholds of importance.\nF-RES-03 Reliability Cronbach's \u03b1 `= (k/(k-1))(1 - \u03a3\u03c3\u00b2_i/\u03c3\u00b2_total)`; \u03b1 is not a measure\nof unidimensionality, and high \u03b1 can coexist with multidimensionality.\nF-RES-04 Agreement Cohen's \u03ba `= (po - pe)/(1 - pe)`; interpret with prevalence caution.\nF-RES-05 Epidemiology risk ratio `= a/(a+b) \u00f7 c/(c+d)`; odds ratio\n`= (a\u00b7d)/(b\u00b7c)`; they diverge when the outcome is common (>10%).",
    "count": 12
  },
  {
    "code": "C73",
    "slug": "c73",
    "title": "Quality Control and Reliability Engineering",
    "label": "C73 \u00b7 Quality Control and Reliability Engineering",
    "familySummary": "F-QC-01 Capability `Cp = (USL-LSL)/(6\u03c3)`; `Cpk = min(USL-\u03bc, \u03bc-LSL)/(3\u03c3)`.\nCp says nothing about centring; Cpk does. Pp/Ppk use overall \u03c3 instead of within-subgroup \u03c3 \u2014\nmixing them is invalid.\nF-QC-02 Control limits X\u0304-R chart: `UCL_X = X\u033f + A2\u00b7R\u0304`, `LCL_X = X\u033f - A2\u00b7R\u0304`,\n`UCL_R = D4\u00b7R\u0304`, `LCL_R = D3\u00b7R\u0304`; A2/D3/D4 depend on subgroup size (constant tables).\nF-QC-03 Reliability exponential `R(t) = e^{-\u03bbt}`, `MTBF = 1/\u03bb`; Weibull\n`R(t) = e^{-(t/\u03b7)^\u03b2}`; Weibull reduces to exponential only when \u03b2 = 1.\nF-QC-04 Availability `A = MTBF/(MTBF+MTTR)`.\nF-QC-05 FMEA RPN `S\u00d7O\u00d7D`; RPN is ordinal and its use as a prioritisation scalar is\ncriticised \u2014 action priority tables are preferred in AIAG-VDA, which is licensed.\nF-QC-06 Sigma level from DPMO via the inverse normal, including the conventional 1.5\u03c3\nshift \u2014 state whether the shift is applied.",
    "count": 18
  },
  {
    "code": "C74",
    "slug": "c74",
    "title": "Human Resources and Employment",
    "label": "C74 \u00b7 Human Resources and Employment",
    "familySummary": "F-HR-01 Turnover `= leavers/average headcount \u00d7100` (average `= (start+end)/2`); the\nperiod and population must be stated or the number is meaningless.\nF-HR-02 FTE `= \u03a3(paid hours)/full-time hours`; part-time, contractor and seasonal\nconversions differ and must be declared.\nF-HR-03 Cost per hire `= (internal + external recruiting costs)/hires`; the definition\n(does it include recruiter salary?) changes the result by an order of magnitude \u2014 expose it.\nF-HR-04 Absence `= absence days/(headcount \u00d7 working days)\u00d7100`; Bradford factor\n`= S\u00b2\u00d7D` is a policy index, not a legal measure.\nF-HR-05 Leave entitlement is statutory and jurisdiction-specific; entitlement calculators\nmust select a jurisdiction and show the statute, and must not generalise across countries.",
    "count": 12
  },
  {
    "code": "C75",
    "slug": "c75",
    "title": "Insurance and Risk Analysis",
    "label": "C75 \u00b7 Insurance and Risk Analysis",
    "familySummary": "F-INS-01 Expected loss `= probability \u00d7 severity`; for a portfolio `\u03a3 p_i\u00b7s_i`. This is\nan expected value, not a premium: loading, expenses and profit are added by the insurer.\nF-INS-02 Out-of-pocket with deductible D, coinsurance c, out-of-pocket maximum M:\n`OOP = min(M, D + c\u00d7max(0, cost - D))` for in-network covered services \u2014 plan rules vary\nwidely and the calculator must display its assumptions.\nF-INS-03 Deductible break-even compare plans by total cost at the user's expected spend:\n`total = premium\u00d712 + OOP(expense)`. Comparing premiums alone is a known consumer error.\nF-INS-04 Life insurance need (DIME) `debt + income\u00d7years + mortgage + education -\nassets`; a needs analysis, not a recommendation, and it must not be presented as advice.\nF-INS-05 Loss ratio `= claims/premium`; combined ratio `= loss ratio + expense ratio`;\n<100% indicates underwriting profit before investment income.",
    "count": 14
  },
  {
    "code": "C76",
    "slug": "c76",
    "title": "Legal and Regulatory Calculations",
    "label": "C76 \u00b7 Legal and Regulatory Calculations",
    "familySummary": "WARNING: this category is informational only. Nothing here is legal advice, and no output\nmay be presented as a legal entitlement. Every calculator requires: jurisdiction selector,\nstatute/rule citation, effective date, and a prominent \"not legal advice\" notice. Where a rule\nis discretionary (courts, tribunals), the tool must refuse to output a figure or must label it\na range with the governing discretion stated.\nF-LEG-01 Judgment interest simple or compound per the governing statute; the rate and\ncompounding basis are jurisdictional, and post-judgment rates often differ from pre-judgment.\nF-LEG-02 Limitation periods are procedural rules that vary by claim type and can be\npaused/tolled; a date arithmetic tool must not imply a claim is time-barred.\nF-LEG-03 Statutory payments (redundancy, notice, child support) come from tables/formulas\nin statute; the version and jurisdiction must be displayed and updated on a review cadence.\nF-LEG-04 Damages expectation = loss of bargain; compounding of lost profits requires a\ndiscount rate assumption which must be user-supplied and displayed.",
    "count": 9
  },
  {
    "code": "C77",
    "slug": "c77",
    "title": "Gaming, Odds and Probability",
    "label": "C77 \u00b7 Gaming, Odds and Probability",
    "familySummary": "F-GAM-01 Expected value `EV = \u03a3 p_i\u00b7payoff_i`; a positive EV game still has variance and\nrisk of ruin \u2014 the two must be reported together.\nF-GAM-02 Odds conversion decimal `d`; fractional `a/b` -> `d = 1 + a/b`;\nAmerican: positive `+m` -> `d = 1 + m/100`, negative `-m` -> `d = 1 + 100/m`;\nimplied probability `= 1/d` (before removing vig).\nF-GAM-03 Vig removal for two-way markets: `p_i' = (1/d_i)/\u03a3(1/d_j)`.\nF-GAM-04 Kelly `f* = (bp - q)/b` for fractional odds b, win prob p, q = 1-p; full Kelly is\ngrowth-optimal but has large drawdowns, so fractional Kelly is common practice.\nF-GAM-05 House edge `= 1 - \u03a3(p_i\u00b7payout_i)` per unit staked; lottery odds\n`= 1/C(n,k)` for an exact-match draw.",
    "count": 12
  },
  {
    "code": "C78",
    "slug": "c78",
    "title": "Sports and Athletic Performance Metrics",
    "label": "C78 \u00b7 Sports and Athletic Performance Metrics",
    "familySummary": "F-SPT-01 Baseball batting average `= H/AB`; OBP `= (H+BB+HBP)/(AB+BB+HBP+SF)`;\nSLG `= TB/AB`; OPS `= OBP+SLG`; ERA `= 9\u00d7ER/IP`; WHIP `= (BB+H)/(IP)`.\nThese are defined conventions (official scoring rules) and denominators must not be swapped.\nF-SPT-02 Cricket run rate `= runs/overs`; required run rate and net run rate use different\ndenominators (NRR uses runs per over minus conceded rate).\nF-SPT-03 Elo `E_a = 1/(1 + 10^((R_b-R_a)/400))`; K-factor choice drives responsiveness;\nthe 400 constant is a convention of the chess implementation.\nF-SPT-04 Basketball TS% `= PTS/(2\u00d7(FGA + 0.44\u00d7FTA))`; the 0.44 coefficient is an empirical\nestimate of free-throw possessions.\nF-SPT-05 Handicap (golf) course handicap uses slope rating:\n`CH = index \u00d7 slope/113 + (CR - par)`; the 113 is a defined standard slope.",
    "count": 12
  },
  {
    "code": "C79",
    "slug": "c79",
    "title": "Travel and Trip Planning",
    "label": "C79 \u00b7 Travel and Trip Planning",
    "familySummary": "F-TRV-01 Trip cost `= transport + accommodation\u00d7nights + per-diem\u00d7days + activities`\nplus a contingency percentage; currency conversion must use a user-supplied or dated rate.\nF-TRV-02 Driving time `= distance/average speed + breaks`; average speed must reflect road\ntype, and fuel/charging cost should use consumption, not a flat rate.\nF-TRV-03 Jet lag recovery estimates (\u22481 day per time zone eastbound, ~0.75 westbound) are\nempirical rules of thumb and must be labelled as such \u2014 they are not clinical guidance.\nF-TRV-04 Baggage `total = \u03a3 item weights`; airline limits are per-carrier and per-fare-class,\nso limit values must be user inputs with cited defaults.\nF-TRV-05 Travel insurance premium \u2248 rate \u00d7 trip cost \u00d7 days, but exclusions dominate real\nrisk; the tool must not imply coverage.",
    "count": 12
  },
  {
    "code": "C80",
    "slug": "c80",
    "title": "Household Budgets and Personal Finance",
    "label": "C80 \u00b7 Household Budgets and Personal Finance",
    "familySummary": "F-HHD-01 Budget split the 50/30/20 rule is a popular heuristic, not a standard; needs,\nwants and savings definitions vary by household, so category mapping must be user-editable.\nF-HHD-02 Savings rate `= savings/gross income` (state gross vs net; both are used).\nF-HHD-03 Emergency fund `= essential monthly expenses \u00d7 months`; \"3-6 months\" is guidance,\nnot a rule, and depends on income stability.\nF-HHD-04 Net worth `= assets - liabilities`; illiquid assets and pension entitlements must\nbe handled per the stated definition.\nF-HHD-05 Goal timeline `n = ln(FV\u00b7i/PMT + 1)/ln(1+i)`; if `PMT \u2264 FV\u00b7i` the goal is never\nreached \u2014 the tool must say so explicitly rather than returning an enormous number.",
    "count": 14
  },
  {
    "code": "C81",
    "slug": "c81",
    "title": "Retail Pricing and Shopping",
    "label": "C81 \u00b7 Retail Pricing and Shopping",
    "familySummary": "F-RTL-01 Sale price `= price\u00d7(1-discount)`; stacked discounts multiply (see F-PRC-02).\nF-RTL-02 Unit price `= price/quantity`; comparing across packs requires the same unit and\nthe same tax basis, otherwise the comparison is invalid.\nF-RTL-03 Tip `= bill\u00d7tip%`; splitting must define whether tax and service charge are\nincluded in the base \u2014 three reasonable conventions produce different totals.\nF-RTL-04 BOGO \"buy one get one 50% off\" is 25% off two items, not 50% off \u2014 the effective\ndiscount depends on how many items are purchased.\nF-RTL-05 Cashback `= spend \u00d7 rate`, and it is not equivalent to a discount if it expires\nor is paid in restricted points.",
    "count": 10
  },
  {
    "code": "C82",
    "slug": "c82",
    "title": "Pets and Animal Care",
    "label": "C82 \u00b7 Pets and Animal Care",
    "familySummary": "F-PET-01 Pet age the \"\u00d77\" rule is a myth; the AVMA/AAHA approach uses species- and\nsize-specific curves (e.g. a 1-year-old dog \u224815 human years). Any conversion must cite its\nsource table and be labelled an estimate.\nF-PET-02 Energy requirement resting energy `RER = 70\u00d7(kg)^0.75` kcal/day;\nmaintenance `MER = RER \u00d7 factor` where the factor depends on life stage and neuter status\n(WSAVA/AAHA guidance). Body condition score matters more than the formula.\nF-PET-03 Water intake \u224850-60 mL/kg/day for dogs and cats is a clinical rule of thumb;\nillness changes it, so it must not be used for diagnosis.\nF-PET-04 Aquarium volume `= L\u00d7W\u00d7H/1000` litres (internal dimensions), then subtract\nsubstrate and decor displacement; stocking rules (\"1 inch per gallon\") are folklore with no\nwelfare basis and must be labelled as such.\nF-PET-05 Medication dosing is prescription-only; the tool may compute a mg/kg amount but\nmust require a prescriber-supplied dose and show a hard warning.",
    "count": 8
  },
  {
    "code": "C83",
    "slug": "c83",
    "title": "Specialised Trades and Building Services",
    "label": "C83 \u00b7 Specialised Trades and Building Services",
    "familySummary": "F-TRD-01 Occupancy load `= floor area/area per occupant` from the applicable building\ncode table (function of use). The table values are code-specific and licensed \u2014 they must be\nsupplied as cited data, never invented.\nF-TRD-02 Egress width `= occupant load \u00d7 width per person`; clear width, not nominal, and\nminimums apply. Code-dependent \u2192 SPECIALIST_REVIEW_REQUIRED.\nF-TRD-03 Lighting `E = \u03a6\u00d7CU\u00d7MF/A` (lumen method); CU and MF are project-specific, so\ndefaults must be stated and ranges shown.\nF-TRD-04 Pool chemistry free chlorine depends on cyanuric acid (FC/CYA ratio); simple\n\"ppm\" targets without CYA are misleading \u2014 state the model used.\nF-TRD-05 Septic sizing `= bedrooms \u00d7 daily flow \u00d7 retention` per local regulation; the\nrule set is jurisdictional.",
    "count": 14
  },
  {
    "code": "C84",
    "slug": "c84",
    "title": "Cross-Domain Utilities",
    "label": "C84 \u00b7 Cross-Domain Utilities",
    "familySummary": "F-XD-01 Number to words requires language-specific grammar (scale words, pluralisation,\nhyphenation, \"and\"); output must be localisation-aware, not English-hardcoded.\nF-XD-02 Roman numerals standard form is subtractive with a maximum of three repeats\n(IIII is invalid); values above 3999 traditionally require an overbar \u2014 state the convention.\nF-XD-03 Reading time `= words/wpm`; 200-250 wpm is a convention, and technical content is\nslower; expose the rate.\nF-XD-04 Password entropy `H = L\u00b7log2(alphabet size)` for random passwords only; human-chosen\npasswords have far lower effective entropy, so the tool must not imply real-world strength.\nF-XD-05 Character and word counts must define what counts as a word (whitespace-delimited\nvs Unicode word boundaries) \u2014 the two disagree on hyphenated and CJK text.",
    "count": 8
  }
];

export const CATALOG_ENTRIES: CatalogEntryRaw[] = [
  {
    "id": "CALC-0001",
    "name": "Percentage of a Number",
    "slug": "percentage-of-a-number",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "amount, percent -> portion",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-change",
      "percentage-difference",
      "percentage-point-change",
      "reverse-percentage"
    ]
  },
  {
    "id": "CALC-0002",
    "name": "Percentage Change",
    "slug": "percentage-change",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "old, new -> % change vs old",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-difference",
      "percentage-point-change",
      "reverse-percentage"
    ]
  },
  {
    "id": "CALC-0003",
    "name": "Percentage Difference",
    "slug": "percentage-difference",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "A, B -> % difference vs mean",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Distinct from change: symmetric, no base year. Reviewed: not a duplicate.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-point-change",
      "reverse-percentage"
    ]
  },
  {
    "id": "CALC-0004",
    "name": "Percentage Point Change",
    "slug": "percentage-point-change",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "p1%, p2% -> pp",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "reverse-percentage"
    ]
  },
  {
    "id": "CALC-0005",
    "name": "Reverse Percentage",
    "slug": "reverse-percentage",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "final value, % applied -> original",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0006",
    "name": "Add Percentage to Value",
    "slug": "add-percentage",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "value, % -> increased value",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0007",
    "name": "Subtract Percentage from Value",
    "slug": "subtract-percentage",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "value, % -> reduced value",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0008",
    "name": "Successive Percentage Change",
    "slug": "successive-percentage-change",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "list of % changes -> net %",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0009",
    "name": "Percent Error",
    "slug": "percent-error",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "measured, accepted -> % error",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0010",
    "name": "Percent of Total (Share)",
    "slug": "percent-of-total",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "parts, total -> shares %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0011",
    "name": "Percentage of a Percentage",
    "slug": "percent-of-percent",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "base, %A, %B -> portion",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0012",
    "name": "Gain Needed to Recover a Loss",
    "slug": "recover-loss-gain",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "loss % -> required gain %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0013",
    "name": "Order of Operations Evaluator",
    "slug": "order-of-operations",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "expression -> value",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0014",
    "name": "Rounding Mode Calculator",
    "slug": "rounding-modes",
    "category": "C01",
    "categoryLabel": "Basic Arithmetic and Percentages",
    "inputsOutputs": "number, places, mode -> rounded",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percentage-of-a-number",
      "percentage-change",
      "percentage-difference",
      "percentage-point-change"
    ]
  },
  {
    "id": "CALC-0015",
    "name": "Fraction Arithmetic",
    "slug": "fraction-arithmetic",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "two fractions, op -> exact fraction",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal",
      "decimal-to-fraction"
    ]
  },
  {
    "id": "CALC-0016",
    "name": "Simplify Fraction",
    "slug": "simplify-fraction",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "num, den -> reduced fraction",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "mixed-number-converter",
      "fraction-to-decimal",
      "decimal-to-fraction"
    ]
  },
  {
    "id": "CALC-0017",
    "name": "Mixed Number Converter",
    "slug": "mixed-number-converter",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "mixed <-> improper",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "fraction-to-decimal",
      "decimal-to-fraction"
    ]
  },
  {
    "id": "CALC-0018",
    "name": "Fraction to Decimal",
    "slug": "fraction-to-decimal",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "num/den -> decimal, rounding mode",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "decimal-to-fraction"
    ]
  },
  {
    "id": "CALC-0019",
    "name": "Decimal to Fraction",
    "slug": "decimal-to-fraction",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "decimal -> exact fraction",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0020",
    "name": "Repeating Decimal to Fraction",
    "slug": "repeating-decimal-to-fraction",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "0.dddd... -> fraction",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0021",
    "name": "Ratio Simplifier",
    "slug": "ratio-simplifier",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "a:b:c -> reduced ratio",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0022",
    "name": "Ratio to Decimal and Percent",
    "slug": "ratio-to-decimal",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "a:b -> decimal, %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0023",
    "name": "Proportion Solver",
    "slug": "proportion-solver",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "a/b = c/x -> x",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0024",
    "name": "Drawing Scale Converter",
    "slug": "drawing-scale",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "scale 1:n, measured -> real length",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0025",
    "name": "Arithmetic Mean",
    "slug": "arithmetic-mean",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "numbers -> mean, sum, count",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0026",
    "name": "Weighted Average",
    "slug": "weighted-average",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "values, weights -> weighted mean",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0027",
    "name": "Average of Averages",
    "slug": "average-of-averages",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "group means, sizes -> pooled mean",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0028",
    "name": "Harmonic Mean",
    "slug": "harmonic-mean",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "rates/values -> harmonic mean",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0029",
    "name": "Geometric Mean",
    "slug": "geometric-mean",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "growth factors -> geometric mean",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0030",
    "name": "Unit Rate",
    "slug": "unit-rate",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "quantity, cost/time -> per-unit rate",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0031",
    "name": "Proportional Share Split",
    "slug": "proportional-split",
    "category": "C02",
    "categoryLabel": "Fractions, Ratios, Proportions and Averages",
    "inputsOutputs": "total, ratio -> shares",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fraction-arithmetic",
      "simplify-fraction",
      "mixed-number-converter",
      "fraction-to-decimal"
    ]
  },
  {
    "id": "CALC-0032",
    "name": "Quadratic Equation Solver",
    "slug": "quadratic-solver",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "a,b,c -> roots, discriminant",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system",
      "three-equation-system"
    ]
  },
  {
    "id": "CALC-0033",
    "name": "Cubic Equation Solver",
    "slug": "cubic-solver",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "a,b,c,d -> real/complex roots",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "linear-equation-solver",
      "two-equation-system",
      "three-equation-system"
    ]
  },
  {
    "id": "CALC-0034",
    "name": "Linear Equation Solver",
    "slug": "linear-equation-solver",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "ax+b=c -> x",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "two-equation-system",
      "three-equation-system"
    ]
  },
  {
    "id": "CALC-0035",
    "name": "Two-Variable Linear System",
    "slug": "two-equation-system",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "2 equations -> x,y",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "three-equation-system"
    ]
  },
  {
    "id": "CALC-0036",
    "name": "Three-Variable Linear System",
    "slug": "three-equation-system",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "3 equations -> x,y,z",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0037",
    "name": "Polynomial Evaluator",
    "slug": "polynomial-evaluator",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "coefficients, x -> value",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0038",
    "name": "Nth Root Calculator",
    "slug": "nth-root",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "x, n -> real root",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0039",
    "name": "Exponent and Power Calculator",
    "slug": "exponent-power",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "base, exponent -> power",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0040",
    "name": "Logarithm Calculator",
    "slug": "logarithm",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "x, base -> log",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0041",
    "name": "Antilog / Exponential Solver",
    "slug": "antilog-exponential",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "log value, base -> x",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0042",
    "name": "Radical Simplifier",
    "slug": "radical-simplifier",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "sqrt(n) -> a\u00b7sqrt(b)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0043",
    "name": "Linear Inequality Solver",
    "slug": "linear-inequality",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "ax+b < c -> interval",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0044",
    "name": "Absolute Value Equation Solver",
    "slug": "absolute-value-equation",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "abs(ax+b) = c -> roots",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0045",
    "name": "Direct and Inverse Variation",
    "slug": "variation-solver",
    "category": "C03",
    "categoryLabel": "Algebra and Equation Solving",
    "inputsOutputs": "k, x -> y (direct/inverse)",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "quadratic-solver",
      "cubic-solver",
      "linear-equation-solver",
      "two-equation-system"
    ]
  },
  {
    "id": "CALC-0046",
    "name": "Circle Area and Circumference",
    "slug": "circle-area",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "radius/diameter -> A, C",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area",
      "parallelogram-area"
    ]
  },
  {
    "id": "CALC-0047",
    "name": "Triangle Area (Heron)",
    "slug": "triangle-area-heron",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "3 sides -> area, angles",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "pythagorean-theorem",
      "rectangle-area",
      "parallelogram-area"
    ]
  },
  {
    "id": "CALC-0048",
    "name": "Pythagorean Theorem",
    "slug": "pythagorean-theorem",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "2 sides -> hypotenuse/leg",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "rectangle-area",
      "parallelogram-area"
    ]
  },
  {
    "id": "CALC-0049",
    "name": "Rectangle and Square",
    "slug": "rectangle-area",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "sides -> A, P, diagonal",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "parallelogram-area"
    ]
  },
  {
    "id": "CALC-0050",
    "name": "Parallelogram",
    "slug": "parallelogram-area",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "base, height, side -> A, P",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0051",
    "name": "Trapezoid",
    "slug": "trapezoid-area",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "parallel sides, height -> A",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0052",
    "name": "Kite and Rhombus",
    "slug": "kite-rhombus-area",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "diagonals -> A, P",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0053",
    "name": "Regular Polygon",
    "slug": "regular-polygon",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "n sides, side/apothem -> A, P",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0054",
    "name": "Sector and Arc",
    "slug": "sector-arc",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "radius, angle -> arc, sector A",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0055",
    "name": "Ellipse",
    "slug": "ellipse",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "a, b -> A, P (Ramanujan)",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0056",
    "name": "Sphere",
    "slug": "sphere",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "r -> V, S",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0057",
    "name": "Cylinder",
    "slug": "cylinder",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "r, h -> V, lateral, total S",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0058",
    "name": "Cone",
    "slug": "cone",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "r, h -> V, slant, S",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0059",
    "name": "Conical Frustum",
    "slug": "frustum-cone",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "R, r, h -> V, S",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0060",
    "name": "Pyramid",
    "slug": "pyramid",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "base area, h -> V, S",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0061",
    "name": "Cuboid and Prism",
    "slug": "cuboid-prism",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "dimensions -> V, S",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0062",
    "name": "Torus",
    "slug": "torus",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "R, r -> V, S",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0063",
    "name": "Polygon Area from Coordinates",
    "slug": "polygon-shoelace",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "vertices -> area, perimeter",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0064",
    "name": "Distance and Midpoint",
    "slug": "distance-midpoint",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "2 points -> distance, midpoint",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0065",
    "name": "Box Space Diagonal",
    "slug": "box-diagonal",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "l,w,h -> diagonal",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0066",
    "name": "Triangle Inradius and Circumradius",
    "slug": "triangle-inradius",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "3 sides, area -> r, R",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0067",
    "name": "Circle Segment Area",
    "slug": "circle-segment",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "radius, chord/angle -> segment A",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0068",
    "name": "Annulus",
    "slug": "annulus",
    "category": "C04",
    "categoryLabel": "Geometry and Mensuration",
    "inputsOutputs": "outer, inner radius -> A",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "circle-area",
      "triangle-area-heron",
      "pythagorean-theorem",
      "rectangle-area"
    ]
  },
  {
    "id": "CALC-0069",
    "name": "Right Triangle Solver",
    "slug": "right-triangle-solver",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "2 of (a,b,c,angle) -> all",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas",
      "angle-unit-converter"
    ]
  },
  {
    "id": "CALC-0070",
    "name": "Law of Sines",
    "slug": "law-of-sines",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "angles, side -> unknown sides",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-cosines",
      "triangle-area-sas",
      "angle-unit-converter"
    ]
  },
  {
    "id": "CALC-0071",
    "name": "Law of Cosines",
    "slug": "law-of-cosines",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "3 sides or SAS -> angle/side",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "triangle-area-sas",
      "angle-unit-converter"
    ]
  },
  {
    "id": "CALC-0072",
    "name": "Triangle Area from SAS",
    "slug": "triangle-area-sas",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "2 sides, included angle -> A",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "angle-unit-converter"
    ]
  },
  {
    "id": "CALC-0073",
    "name": "Angle Unit Converter",
    "slug": "angle-unit-converter",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "deg/rad/grad/turn -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0074",
    "name": "Trigonometric Function Values",
    "slug": "trig-function-values",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "angle -> sin..tan, exact",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0075",
    "name": "Inverse Trigonometric Functions",
    "slug": "inverse-trig",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "ratio -> angle (principal)",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0076",
    "name": "Hyperbolic Functions",
    "slug": "hyperbolic-functions",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "x -> sinh, cosh, tanh...",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0077",
    "name": "Oblique Triangle Solver",
    "slug": "oblique-triangle-solver",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "any 3 parts -> all (SSA cases)",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0078",
    "name": "Chord, Sagitta and Arc",
    "slug": "chord-sagitta",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "radius, angle -> chord, sagitta",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0079",
    "name": "Sine Wave Parameters",
    "slug": "sine-wave-params",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "amplitude, period, phase -> equation",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0080",
    "name": "Trigonometric Identity Checker",
    "slug": "trig-identity-check",
    "category": "C05",
    "categoryLabel": "Trigonometry",
    "inputsOutputs": "expression pair -> equal?",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "right-triangle-solver",
      "law-of-sines",
      "law-of-cosines",
      "triangle-area-sas"
    ]
  },
  {
    "id": "CALC-0081",
    "name": "Numerical Derivative",
    "slug": "numerical-derivative",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f(x), x -> f'(x)",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid",
      "riemann-sum"
    ]
  },
  {
    "id": "CALC-0082",
    "name": "Symbolic Derivative",
    "slug": "symbolic-derivative",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "expression -> derivative",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "integral-simpson",
      "integral-trapezoid",
      "riemann-sum"
    ]
  },
  {
    "id": "CALC-0083",
    "name": "Definite Integral (Simpson)",
    "slug": "integral-simpson",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, a, b, n -> area",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-trapezoid",
      "riemann-sum"
    ]
  },
  {
    "id": "CALC-0084",
    "name": "Definite Integral (Trapezoid)",
    "slug": "integral-trapezoid",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, a, b, n -> area",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "riemann-sum"
    ]
  },
  {
    "id": "CALC-0085",
    "name": "Riemann Sum",
    "slug": "riemann-sum",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, interval, rule -> estimate",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0086",
    "name": "Limit Estimate",
    "slug": "limit-numeric",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, approach point -> L",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0087",
    "name": "Taylor Series Expansion",
    "slug": "taylor-series",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, centre, order -> polynomial",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0088",
    "name": "Newton-Raphson Root",
    "slug": "newton-raphson",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, f', x0 -> root, iterations",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0089",
    "name": "Bisection Root",
    "slug": "bisection-root",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, [a,b] -> root, iterations",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0090",
    "name": "Secant Method Root",
    "slug": "secant-root",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, x0, x1 -> root",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0091",
    "name": "Function Extremum Finder",
    "slug": "extremum-finder",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, interval -> min/max",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0092",
    "name": "Arc Length of a Curve",
    "slug": "arc-length-curve",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, interval -> length",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0093",
    "name": "Volume of Revolution",
    "slug": "volume-revolution",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "f, interval, axis -> volume",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0094",
    "name": "Euler Method ODE",
    "slug": "euler-ode",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "y'=f, y0, h, steps -> y(t)",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0095",
    "name": "Runge-Kutta 4 ODE",
    "slug": "rk4-ode",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "y'=f, y0, h, steps -> y(t)",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0096",
    "name": "Lagrange Interpolation",
    "slug": "lagrange-interpolation",
    "category": "C06",
    "categoryLabel": "Calculus and Numerical Methods",
    "inputsOutputs": "points -> polynomial value",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "numerical-derivative",
      "symbolic-derivative",
      "integral-simpson",
      "integral-trapezoid"
    ]
  },
  {
    "id": "CALC-0097",
    "name": "Matrix Multiplication",
    "slug": "matrix-multiply",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "A(m\u00d7n), B(n\u00d7p) -> C",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse",
      "matrix-transpose-trace"
    ]
  },
  {
    "id": "CALC-0098",
    "name": "Matrix Addition and Subtraction",
    "slug": "matrix-add-subtract",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "same-shape matrices -> sum",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-determinant",
      "matrix-inverse",
      "matrix-transpose-trace"
    ]
  },
  {
    "id": "CALC-0099",
    "name": "Matrix Determinant",
    "slug": "matrix-determinant",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "square matrix -> det",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-inverse",
      "matrix-transpose-trace"
    ]
  },
  {
    "id": "CALC-0100",
    "name": "Matrix Inverse",
    "slug": "matrix-inverse",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "square matrix -> A^-1, det",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-transpose-trace"
    ]
  },
  {
    "id": "CALC-0101",
    "name": "Matrix Transpose and Trace",
    "slug": "matrix-transpose-trace",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "matrix -> A^T, trace",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0102",
    "name": "Matrix Rank",
    "slug": "matrix-rank",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "matrix -> rank, basis",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0103",
    "name": "Solve Linear System by Matrix",
    "slug": "matrix-solve-system",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "A, b -> x",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0104",
    "name": "Eigenvalues 2x2",
    "slug": "eigenvalues-2x2",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "2x2 -> \u03bb1, \u03bb2, vectors",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0105",
    "name": "Eigenvalues 3x3",
    "slug": "eigenvalues-3x3",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "3x3 -> \u03bb, vectors",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0106",
    "name": "Vector Dot Product",
    "slug": "vector-dot",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "2 vectors -> dot, angle",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0107",
    "name": "Vector Cross Product",
    "slug": "vector-cross",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "2 3-D vectors -> cross vector, magnitude",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0108",
    "name": "Vector Magnitude and Unit Vector",
    "slug": "vector-magnitude",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "vector -> magnitude, unit vector",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0109",
    "name": "Vector Projection and Angle",
    "slug": "vector-projection",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "a, b -> proj, angle",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0110",
    "name": "Matrix Power",
    "slug": "matrix-power",
    "category": "C07",
    "categoryLabel": "Matrices, Vectors and Linear Algebra",
    "inputsOutputs": "A, n -> A^n",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "matrix-multiply",
      "matrix-add-subtract",
      "matrix-determinant",
      "matrix-inverse"
    ]
  },
  {
    "id": "CALC-0111",
    "name": "Mean Calculator",
    "slug": "mean",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> mean, sum, n",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "median-quartiles",
      "mode-frequency",
      "variance-stddev",
      "coefficient-of-variation"
    ]
  },
  {
    "id": "CALC-0112",
    "name": "Median and Quartiles",
    "slug": "median-quartiles",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> Q1, Q2, Q3",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "mode-frequency",
      "variance-stddev",
      "coefficient-of-variation"
    ]
  },
  {
    "id": "CALC-0113",
    "name": "Mode and Frequency",
    "slug": "mode-frequency",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> mode(s), counts",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "variance-stddev",
      "coefficient-of-variation"
    ]
  },
  {
    "id": "CALC-0114",
    "name": "Variance and Standard Deviation",
    "slug": "variance-stddev",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset, pop/sample -> s\u00b2, s",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "coefficient-of-variation"
    ]
  },
  {
    "id": "CALC-0115",
    "name": "Coefficient of Variation",
    "slug": "coefficient-of-variation",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> CV%",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0116",
    "name": "Z-Score",
    "slug": "z-score",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x, mean, sd -> z, percentile",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0117",
    "name": "Percentile Rank",
    "slug": "percentile-rank",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset, value -> percentile",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0118",
    "name": "Skewness and Kurtosis",
    "slug": "skewness-kurtosis",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> skew, kurtosis",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0119",
    "name": "Covariance",
    "slug": "covariance",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "paired data -> cov (pop/sample)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0120",
    "name": "Pearson Correlation",
    "slug": "pearson-correlation",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x, y -> r, r\u00b2, p",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0121",
    "name": "Spearman Rank Correlation",
    "slug": "spearman-correlation",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x, y -> \u03c1",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0122",
    "name": "Simple Linear Regression",
    "slug": "linear-regression",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x, y -> slope, intercept, r\u00b2",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0123",
    "name": "Multiple Linear Regression",
    "slug": "multiple-regression",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "X, y -> coefficients",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0124",
    "name": "Outlier Detection (IQR Rule)",
    "slug": "outlier-iqr",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "dataset -> outliers, fences",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0125",
    "name": "Normal Distribution CDF",
    "slug": "normal-cdf",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x, \u03bc, \u03c3 -> P, percentile",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0126",
    "name": "Inverse Normal",
    "slug": "inverse-normal",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "p, \u03bc, \u03c3 -> x",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0127",
    "name": "Student t Distribution",
    "slug": "t-distribution",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "t, df -> p",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0128",
    "name": "Chi-Square Test",
    "slug": "chi-square-test",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "observed, expected -> \u03c7\u00b2, p",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0129",
    "name": "Binomial Probability",
    "slug": "binomial-probability",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "n, k, p -> P(X=k)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0130",
    "name": "Poisson Probability",
    "slug": "poisson-probability",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "\u03bb, k -> P(X=k)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0131",
    "name": "Exponential Distribution",
    "slug": "exponential-distribution",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "\u03bb, x -> pdf, cdf",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0132",
    "name": "Confidence Interval for a Mean",
    "slug": "confidence-interval-mean",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "x\u0304, s, n, CL -> CI",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0133",
    "name": "Confidence Interval for a Proportion",
    "slug": "confidence-interval-proportion",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "p\u0302, n, CL -> CI",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0134",
    "name": "Sample Size Calculator",
    "slug": "sample-size",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "margin, CL, p -> n",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0135",
    "name": "Margin of Error",
    "slug": "margin-of-error",
    "category": "C08",
    "categoryLabel": "Statistics and Probability",
    "inputsOutputs": "n, CL, p -> \u00b1E",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mean",
      "median-quartiles",
      "mode-frequency",
      "variance-stddev"
    ]
  },
  {
    "id": "CALC-0136",
    "name": "Permutations",
    "slug": "permutations",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n, r -> P(n,r)",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "combinations",
      "combinations-repetition",
      "factorial",
      "multinomial"
    ]
  },
  {
    "id": "CALC-0137",
    "name": "Combinations",
    "slug": "combinations",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n, r -> C(n,r)",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations-repetition",
      "factorial",
      "multinomial"
    ]
  },
  {
    "id": "CALC-0138",
    "name": "Combinations with Repetition",
    "slug": "combinations-repetition",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n, r -> C(n+r-1,r)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "factorial",
      "multinomial"
    ]
  },
  {
    "id": "CALC-0139",
    "name": "Factorial",
    "slug": "factorial",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n -> n!",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "multinomial"
    ]
  },
  {
    "id": "CALC-0140",
    "name": "Multinomial Coefficient",
    "slug": "multinomial",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "group sizes -> count",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0141",
    "name": "GCD and LCM",
    "slug": "gcd-lcm",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "2+ integers -> gcd, lcm",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0142",
    "name": "Prime Factorisation",
    "slug": "prime-factorisation",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "integer -> factors, exponents",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0143",
    "name": "Primality Test",
    "slug": "primality-test",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "integer -> prime?",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0144",
    "name": "Primes in a Range",
    "slug": "primes-in-range",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "limit -> prime list, count",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0145",
    "name": "Divisor Count and Sum",
    "slug": "divisors-count",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "integer -> \u03c4(n), \u03c3(n)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0146",
    "name": "Euler Totient",
    "slug": "euler-totient",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n -> \u03c6(n)",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0147",
    "name": "Modular Exponentiation",
    "slug": "modular-exponentiation",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "base, exp, mod -> result",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0148",
    "name": "Modular Inverse",
    "slug": "modular-inverse",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "a, m -> a^-1 mod m",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0149",
    "name": "Integer Division and Remainder",
    "slug": "integer-division",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "a, b -> q, r",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0150",
    "name": "Arithmetic Sequence",
    "slug": "arithmetic-sequence",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "a1, d, n -> a_n, sum",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0151",
    "name": "Geometric Sequence",
    "slug": "geometric-sequence",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "a1, r, n -> a_n, sum",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0152",
    "name": "Fibonacci Sequence",
    "slug": "fibonacci",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n -> F(n), list",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0153",
    "name": "Catalan Number",
    "slug": "catalan",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n -> C_n",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0154",
    "name": "Derangements",
    "slug": "derangements",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "n -> !n",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0155",
    "name": "Power Set Size",
    "slug": "power-set-size",
    "category": "C09",
    "categoryLabel": "Discrete Mathematics, Combinatorics and Number Theory",
    "inputsOutputs": "set size -> subsets",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "permutations",
      "combinations",
      "combinations-repetition",
      "factorial"
    ]
  },
  {
    "id": "CALC-0156",
    "name": "Simple Interest",
    "slug": "simple-interest",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "P, r, t -> interest, total",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate",
      "nominal-rate-converter"
    ]
  },
  {
    "id": "CALC-0157",
    "name": "Compound Interest",
    "slug": "compound-interest",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "P, r, compounding, t -> FV",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "continuous-compounding",
      "effective-annual-rate",
      "nominal-rate-converter"
    ]
  },
  {
    "id": "CALC-0158",
    "name": "Continuous Compounding",
    "slug": "continuous-compounding",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "P, r, t -> FV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "effective-annual-rate",
      "nominal-rate-converter"
    ]
  },
  {
    "id": "CALC-0159",
    "name": "Effective Annual Rate",
    "slug": "effective-annual-rate",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "nominal, m -> EAR",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "nominal-rate-converter"
    ]
  },
  {
    "id": "CALC-0160",
    "name": "Nominal Rate Converter",
    "slug": "nominal-rate-converter",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "EAR <-> nominal",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0161",
    "name": "Future Value of Lump Sum",
    "slug": "future-value-lumpsum",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PV, r, n -> FV",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0162",
    "name": "Present Value of Lump Sum",
    "slug": "present-value-lumpsum",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "FV, r, n -> PV",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0163",
    "name": "Future Value of Annuity",
    "slug": "annuity-future-value",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PMT, r, n -> FV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0164",
    "name": "Present Value of Annuity",
    "slug": "annuity-present-value",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PMT, r, n -> PV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0165",
    "name": "Annuity Payment",
    "slug": "annuity-payment",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PV, r, n -> PMT",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0166",
    "name": "Perpetuity Present Value",
    "slug": "perpetuity-present-value",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PMT, r -> PV",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0167",
    "name": "Growing Perpetuity",
    "slug": "growing-perpetuity",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PMT, r, g -> PV",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0168",
    "name": "Annuity Due",
    "slug": "annuity-due",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "PMT, r, n -> FV, PV",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0169",
    "name": "Net Present Value",
    "slug": "npv",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "cash flows, discount rate -> NPV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0170",
    "name": "Internal Rate of Return",
    "slug": "irr",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "cash flows -> IRR",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0171",
    "name": "CAGR",
    "slug": "cagr",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "begin, end, years -> CAGR",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0172",
    "name": "Doubling Time",
    "slug": "doubling-time",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "growth rate -> exact t, rule of 72",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0173",
    "name": "Real Return (Fisher)",
    "slug": "real-return",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "nominal, inflation -> real",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0174",
    "name": "Inflation-Adjusted Value",
    "slug": "inflation-adjusted-value",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "amount, rate, years -> real",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0175",
    "name": "Discount Factor",
    "slug": "discount-factor",
    "category": "C10",
    "categoryLabel": "Interest, Time Value of Money and Discounting",
    "inputsOutputs": "rate, period -> DF, PV",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "simple-interest",
      "compound-interest",
      "continuous-compounding",
      "effective-annual-rate"
    ]
  },
  {
    "id": "CALC-0176",
    "name": "Loan Payment",
    "slug": "loan-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "principal, rate, term -> PMT",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff",
      "biweekly-payment"
    ]
  },
  {
    "id": "CALC-0177",
    "name": "Amortisation Schedule",
    "slug": "amortisation-schedule",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan -> per-period table",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "total-interest-paid",
      "extra-payment-payoff",
      "biweekly-payment"
    ]
  },
  {
    "id": "CALC-0178",
    "name": "Total Interest Paid",
    "slug": "total-interest-paid",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan -> total interest",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "extra-payment-payoff",
      "biweekly-payment"
    ]
  },
  {
    "id": "CALC-0179",
    "name": "Loan Payoff with Extra Payments",
    "slug": "extra-payment-payoff",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan, extra -> months saved",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "biweekly-payment"
    ]
  },
  {
    "id": "CALC-0180",
    "name": "Biweekly Payment",
    "slug": "biweekly-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan -> biweekly, savings",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0181",
    "name": "Balloon Payment Loan",
    "slug": "balloon-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan, balloon -> PMT, final",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0182",
    "name": "Interest-Only Payment",
    "slug": "interest-only-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "principal, rate -> monthly",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0183",
    "name": "Credit Card Payoff Time",
    "slug": "credit-card-payoff",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "balance, APR, payment -> months",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0184",
    "name": "Minimum Payment Payoff",
    "slug": "minimum-payment-time",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "balance, APR, %min -> months, interest",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0185",
    "name": "APR from Fees",
    "slug": "apr-from-fees",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "amount, fees, schedule -> APR",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Anchored on CFPB Reg Z App. J method; full numeric solver still to be validated.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-007",
        "title": "CFPB Regulation Z, 12 CFR Part 1026, Appendix J \u2014 APR Computations for Closed-End Credit",
        "url": "https://www.consumerfinance.gov/rules-policy/regulations/1026/J/",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0186",
    "name": "APR to Periodic Rate",
    "slug": "apr-periodic-rate",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "APR, frequency -> monthly rate",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0187",
    "name": "Add-On Interest Rate",
    "slug": "add-on-interest",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "principal, flat rate, term -> payment, true APR",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0188",
    "name": "Flat vs Reducing Balance",
    "slug": "flat-vs-reducing",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "loan terms -> cost comparison",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0189",
    "name": "Loan Affordability (DTI)",
    "slug": "loan-affordability",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "income, debts -> max payment",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0190",
    "name": "Debt Snowball",
    "slug": "debt-snowball",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "debts, extra -> payoff order, date",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0191",
    "name": "Debt Avalanche",
    "slug": "debt-avalanche",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "debts, extra -> interest saved",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0192",
    "name": "Student Loan Repayment",
    "slug": "student-loan-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "balance, rate, plan -> payment",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0193",
    "name": "Auto Lease Payment",
    "slug": "auto-lease-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "cap cost, residual, money factor -> PMT",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0194",
    "name": "HELOC Payment",
    "slug": "heloc-payment",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "draw, rate, period -> payment",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0195",
    "name": "Prepayment Penalty Cost",
    "slug": "prepayment-penalty",
    "category": "C11",
    "categoryLabel": "Loans, Amortisation and Credit",
    "inputsOutputs": "balance, penalty -> cost",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "loan-payment",
      "amortisation-schedule",
      "total-interest-paid",
      "extra-payment-payoff"
    ]
  },
  {
    "id": "CALC-0196",
    "name": "Mortgage Payment (P&I)",
    "slug": "mortgage-payment",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan, rate, term -> monthly P&I",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-piti",
      "pmi-cost",
      "ltv",
      "cltv"
    ]
  },
  {
    "id": "CALC-0197",
    "name": "Mortgage Payment with Taxes and Insurance",
    "slug": "mortgage-piti",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan + tax + ins + PMI -> PITI",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "pmi-cost",
      "ltv",
      "cltv"
    ]
  },
  {
    "id": "CALC-0198",
    "name": "PMI Cost",
    "slug": "pmi-cost",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan, LTV, rate -> monthly PMI",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "ltv",
      "cltv"
    ]
  },
  {
    "id": "CALC-0199",
    "name": "Loan-to-Value Ratio",
    "slug": "ltv",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan, value -> LTV%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "cltv"
    ]
  },
  {
    "id": "CALC-0200",
    "name": "Combined LTV",
    "slug": "cltv",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "first, second lien, value -> CLTV",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0201",
    "name": "Home Affordability",
    "slug": "home-affordability",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "income, debts, rate -> max price",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0202",
    "name": "Refinance Break-Even",
    "slug": "refinance-breakeven",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "costs, payment saving -> months",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0203",
    "name": "Refinance Lifetime Savings",
    "slug": "refinance-savings",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "old/new loan -> total saving",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0204",
    "name": "Cash-Out Refinance",
    "slug": "cash-out-refinance",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "value, LTV, balance -> cash available",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0205",
    "name": "Mortgage Points Break-Even",
    "slug": "mortgage-points",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "points, rate change -> months",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0206",
    "name": "ARM Payment Reset",
    "slug": "arm-reset",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "balance, new rate, remaining -> new PMT",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0207",
    "name": "Mortgage Payoff Date",
    "slug": "mortgage-payoff-date",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan, extra -> payoff date",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0208",
    "name": "Extra Principal Savings",
    "slug": "extra-principal-savings",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "loan, extra -> interest saved",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0209",
    "name": "Rent vs Buy",
    "slug": "rent-vs-buy",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "rent, price, horizon -> comparison",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Assumption-heavy model; requires editorial review of default assumptions.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0210",
    "name": "Closing Costs Estimate",
    "slug": "closing-costs",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "price, rate, fees -> total cash",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0211",
    "name": "Down Payment Calculator",
    "slug": "down-payment",
    "category": "C12",
    "categoryLabel": "Mortgages and Property Finance",
    "inputsOutputs": "price, LTV -> cash needed",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mortgage-payment",
      "mortgage-piti",
      "pmi-cost",
      "ltv"
    ]
  },
  {
    "id": "CALC-0212",
    "name": "Return on Investment",
    "slug": "roi",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "gain, cost -> ROI%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio",
      "sortino-ratio"
    ]
  },
  {
    "id": "CALC-0213",
    "name": "Holding Period Return",
    "slug": "holding-period-return",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "begin, end, income -> HPR",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "annualized-return",
      "sharpe-ratio",
      "sortino-ratio"
    ]
  },
  {
    "id": "CALC-0214",
    "name": "Annualised Return",
    "slug": "annualized-return",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "HPR, years -> CAGR",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "sharpe-ratio",
      "sortino-ratio"
    ]
  },
  {
    "id": "CALC-0215",
    "name": "Sharpe Ratio",
    "slug": "sharpe-ratio",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "returns, Rf -> Sharpe",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sortino-ratio"
    ]
  },
  {
    "id": "CALC-0216",
    "name": "Sortino Ratio",
    "slug": "sortino-ratio",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "returns, target -> Sortino",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0217",
    "name": "Beta",
    "slug": "beta",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "asset, market returns -> \u03b2",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0218",
    "name": "Jensen Alpha",
    "slug": "jensen-alpha",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "returns, \u03b2, market -> \u03b1",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0219",
    "name": "Maximum Drawdown",
    "slug": "max-drawdown",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "price series -> MDD, dates",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0220",
    "name": "Portfolio Expected Return",
    "slug": "portfolio-expected-return",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "weights, returns -> E(R)",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0221",
    "name": "Two-Asset Portfolio Variance",
    "slug": "portfolio-variance-2asset",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "weights, \u03c3, \u03c1 -> \u03c3p",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0222",
    "name": "CAPM Required Return",
    "slug": "capm",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "Rf, \u03b2, Rm -> E(R)",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0223",
    "name": "WACC",
    "slug": "wacc",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "E, D, Re, Rd, tax -> WACC",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0224",
    "name": "Dividend Yield",
    "slug": "dividend-yield",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "dividend, price -> yield%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0225",
    "name": "Gordon Growth Model",
    "slug": "gordon-growth",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "D1, r, g -> value",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0226",
    "name": "Price-to-Earnings Ratio",
    "slug": "pe-ratio",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "price, EPS -> P/E",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0227",
    "name": "PEG Ratio",
    "slug": "peg-ratio",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "P/E, growth -> PEG",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0228",
    "name": "Earnings Per Share",
    "slug": "eps",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "net income, shares -> EPS",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0229",
    "name": "Return on Equity",
    "slug": "roe",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "net income, equity -> ROE%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0230",
    "name": "Bond Price",
    "slug": "bond-price",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "face, coupon, y, n -> price",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0231",
    "name": "Bond Yield to Maturity",
    "slug": "ytm",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "price, coupon, n -> YTM",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0232",
    "name": "Current Yield",
    "slug": "current-yield",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "coupon, price -> yield%",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0233",
    "name": "Macaulay Duration",
    "slug": "macaulay-duration",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "cash flows, y -> duration",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0234",
    "name": "Modified Duration",
    "slug": "modified-duration",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "Macaulay, y, f -> modified",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0235",
    "name": "Dollar-Cost Averaging",
    "slug": "dollar-cost-averaging",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "contribution, prices -> shares, avg",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0236",
    "name": "Portfolio Rebalance Trade",
    "slug": "rebalancing-trade",
    "category": "C13",
    "categoryLabel": "Investments, Returns and Portfolio Analysis",
    "inputsOutputs": "holdings, targets -> trades",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roi",
      "holding-period-return",
      "annualized-return",
      "sharpe-ratio"
    ]
  },
  {
    "id": "CALC-0237",
    "name": "Retirement Savings Goal",
    "slug": "retirement-savings-goal",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "income need, years -> corpus",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity",
      "annuity-payout"
    ]
  },
  {
    "id": "CALC-0238",
    "name": "Retirement Corpus Projection",
    "slug": "retirement-corpus-projection",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "contributions, return -> FV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity",
      "annuity-payout"
    ]
  },
  {
    "id": "CALC-0239",
    "name": "Safe Withdrawal Rate Test",
    "slug": "safe-withdrawal-4pct",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "corpus, rate, years -> sustainability",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Historical heuristic; assumptions must be user-visible.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "pension-lumpsum-vs-annuity",
      "annuity-payout"
    ]
  },
  {
    "id": "CALC-0240",
    "name": "Pension Lump Sum vs Annuity",
    "slug": "pension-lumpsum-vs-annuity",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "lump, annuity, rate -> comparison",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "annuity-payout"
    ]
  },
  {
    "id": "CALC-0241",
    "name": "Annuity Payout",
    "slug": "annuity-payout",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "premium, rate, term -> income",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0242",
    "name": "US Social Security PIA (2027)",
    "slug": "ss-pia",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "AIME, eligibility year -> PIA",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Formula and bend points verified on ssa.gov (2027 table); annual refresh required.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-004",
        "title": "US Social Security Administration \u2014 Primary Insurance Amount Formula (2027 Bend Points)",
        "url": "https://www.ssa.gov/oact/cola/piaformula.html",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0243",
    "name": "Social Security Claim Age Benefit",
    "slug": "ss-claim-age",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "PIA, claim age -> benefit",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Reduction/increase factors vary by birth year; needs SSA table.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0244",
    "name": "Employer Match Optimiser",
    "slug": "employer-match",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "salary, match formula -> free money",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0245",
    "name": "Retirement Age Solver",
    "slug": "retirement-age-solver",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "savings, target income -> earliest age",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0246",
    "name": "Inflation-Adjusted Retirement Income",
    "slug": "inflation-adjusted-income",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "today income, years, CPI -> future",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0247",
    "name": "Required Minimum Distribution",
    "slug": "rmd",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "balance, age -> RMD",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0248",
    "name": "Retirement Income Gap",
    "slug": "retirement-income-gap",
    "category": "C14",
    "categoryLabel": "Retirement and Pension Planning",
    "inputsOutputs": "needs, sources -> shortfall",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "retirement-savings-goal",
      "retirement-corpus-projection",
      "safe-withdrawal-4pct",
      "pension-lumpsum-vs-annuity"
    ]
  },
  {
    "id": "CALC-0249",
    "name": "Straight-Line Depreciation",
    "slug": "depreciation-straight-line",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cost, salvage, life -> annual",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units",
      "intangible-amortisation"
    ]
  },
  {
    "id": "CALC-0250",
    "name": "Declining Balance Depreciation",
    "slug": "depreciation-declining-balance",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cost, rate, life -> schedule",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-sum-of-years",
      "depreciation-units",
      "intangible-amortisation"
    ]
  },
  {
    "id": "CALC-0251",
    "name": "Sum-of-Years-Digits Depreciation",
    "slug": "depreciation-sum-of-years",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cost, salvage, life -> schedule",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-units",
      "intangible-amortisation"
    ]
  },
  {
    "id": "CALC-0252",
    "name": "Units-of-Production Depreciation",
    "slug": "depreciation-units",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cost, units -> per-unit",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "intangible-amortisation"
    ]
  },
  {
    "id": "CALC-0253",
    "name": "Intangible Amortisation",
    "slug": "intangible-amortisation",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cost, life -> annual",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0254",
    "name": "Gross Margin",
    "slug": "gross-margin",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "revenue, COGS -> GM%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0255",
    "name": "Operating Margin",
    "slug": "operating-margin",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "revenue, opex -> OM%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0256",
    "name": "Net Margin",
    "slug": "net-margin",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "revenue, net income -> NM%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0257",
    "name": "Current Ratio",
    "slug": "current-ratio",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "current assets/liabilities -> ratio",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0258",
    "name": "Quick Ratio",
    "slug": "quick-ratio",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "cash, AR, CL -> acid test",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0259",
    "name": "Debt-to-Equity Ratio",
    "slug": "debt-to-equity",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "liabilities, equity -> D/E",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0260",
    "name": "Inventory Turnover",
    "slug": "inventory-turnover",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "COGS, avg inventory -> turns",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0261",
    "name": "Receivables Turnover and DSO",
    "slug": "receivables-turnover",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "revenue, AR, days -> turns, DSO",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0262",
    "name": "Cash Conversion Cycle",
    "slug": "cash-conversion-cycle",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "DIO, DSO, DPO -> CCC",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0263",
    "name": "Working Capital",
    "slug": "working-capital",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "current assets/liabilities -> WC",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0264",
    "name": "Break-Even Units",
    "slug": "break-even-units",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "fixed cost, price, VC -> units",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0265",
    "name": "Break-Even Revenue",
    "slug": "break-even-revenue",
    "category": "C15",
    "categoryLabel": "Accounting and Bookkeeping",
    "inputsOutputs": "fixed cost, CM% -> revenue",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depreciation-straight-line",
      "depreciation-declining-balance",
      "depreciation-sum-of-years",
      "depreciation-units"
    ]
  },
  {
    "id": "CALC-0266",
    "name": "Markup Calculator",
    "slug": "markup",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, markup% -> price, profit",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "margin",
      "markup-margin-converter",
      "cost-plus-price",
      "target-margin-price"
    ]
  },
  {
    "id": "CALC-0267",
    "name": "Margin Calculator",
    "slug": "margin",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "price, cost -> margin%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "markup-margin-converter",
      "cost-plus-price",
      "target-margin-price"
    ]
  },
  {
    "id": "CALC-0268",
    "name": "Markup to Margin Converter",
    "slug": "markup-margin-converter",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "markup% <-> margin%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "cost-plus-price",
      "target-margin-price"
    ]
  },
  {
    "id": "CALC-0269",
    "name": "Cost-Plus Price",
    "slug": "cost-plus-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, overhead, margin -> price",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "target-margin-price"
    ]
  },
  {
    "id": "CALC-0270",
    "name": "Target-Margin Price",
    "slug": "target-margin-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, target margin -> price",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0271",
    "name": "Discount Price",
    "slug": "discount-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "price, discount% -> sale price",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0272",
    "name": "Double Discount",
    "slug": "double-discount",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "price, d1, d2 -> net price",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0273",
    "name": "Contribution Margin per Unit",
    "slug": "contribution-margin-unit",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "price, VC -> CM",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0274",
    "name": "Price Elasticity of Revenue",
    "slug": "price-elasticity-revenue",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "elasticity, price change -> revenue",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0275",
    "name": "Price Increase Impact",
    "slug": "price-increase-impact",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "volume, price, elasticity -> profit",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0276",
    "name": "Wholesale to Retail Price",
    "slug": "wholesale-retail-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, channel margins -> retail",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0277",
    "name": "Margin Chain (Multi-Tier)",
    "slug": "margin-chain",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "tier margins -> cumulative",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0278",
    "name": "Commission-Based Price",
    "slug": "commission-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, commission% -> price",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0279",
    "name": "Minimum Viable Price",
    "slug": "minimum-price",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "cost, fees, target profit -> floor",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0280",
    "name": "Unit Economics",
    "slug": "unit-economics",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "revenue, variable, CAC -> contribution",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0281",
    "name": "Gross Profit",
    "slug": "gross-profit",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "revenue, COGS -> GP",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0282",
    "name": "Net Profit",
    "slug": "net-profit",
    "category": "C16",
    "categoryLabel": "Business Pricing, Margin and Profitability",
    "inputsOutputs": "revenue, all costs -> NP",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "markup",
      "margin",
      "markup-margin-converter",
      "cost-plus-price"
    ]
  },
  {
    "id": "CALC-0283",
    "name": "Sales Tax",
    "slug": "sales-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "price, rate -> tax, total",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax",
      "progressive-income-tax"
    ]
  },
  {
    "id": "CALC-0284",
    "name": "VAT Inclusive Price",
    "slug": "vat-inclusive",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "net, rate -> gross",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-exclusive",
      "reverse-tax",
      "progressive-income-tax"
    ]
  },
  {
    "id": "CALC-0285",
    "name": "VAT Exclusive Price",
    "slug": "vat-exclusive",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "gross, rate -> net, VAT",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "reverse-tax",
      "progressive-income-tax"
    ]
  },
  {
    "id": "CALC-0286",
    "name": "Reverse Tax (From Total)",
    "slug": "reverse-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "total, rate -> base, tax",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "progressive-income-tax"
    ]
  },
  {
    "id": "CALC-0287",
    "name": "Progressive Income Tax (Generic)",
    "slug": "progressive-income-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "income, brackets -> tax",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0288",
    "name": "US Federal Income Tax 2026",
    "slug": "us-federal-income-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "income, filing status -> tax",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Bracket thresholds verified on irs.gov IR-2025-103 (TY2026); standard deduction verified.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-010",
        "title": "IRS IR-2025-103 / Rev. Proc. 2025-32 \u2014 Tax Year 2026 Inflation Adjustments",
        "url": "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0289",
    "name": "US Self-Employment Tax",
    "slug": "self-employment-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "net earnings -> SE tax",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0290",
    "name": "US Corporate Income Tax",
    "slug": "corporate-income-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "taxable income -> tax",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0291",
    "name": "Capital Gains Tax",
    "slug": "capital-gains-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "proceeds, basis, holding -> tax",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0292",
    "name": "Dividend Tax",
    "slug": "dividend-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "dividends, bracket -> tax",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0293",
    "name": "Property Tax",
    "slug": "property-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "assessed value, mill rate -> annual",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0294",
    "name": "Import Duty",
    "slug": "import-duty",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "value, duty rate, freight -> duty",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0295",
    "name": "Excise Tax",
    "slug": "excise-tax",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "quantity, specific rate -> tax",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0296",
    "name": "Marginal vs Effective Rate",
    "slug": "marginal-effective-rate",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "income, brackets -> both",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0297",
    "name": "After-Tax Return",
    "slug": "after-tax-return",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "return, tax rate -> net",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0298",
    "name": "Tax Withholding Estimate",
    "slug": "withholding-estimate",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "wage, W-4 params -> withholding",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "US W-4 algorithm changes frequently; needs SSA/IRS Pub 15-T validation.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0299",
    "name": "VAT Recovery",
    "slug": "vat-recovery",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "input VAT, output VAT -> recoverable",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0300",
    "name": "Stamp Duty / Transfer Tax",
    "slug": "stamp-duty",
    "category": "C17",
    "categoryLabel": "Taxation",
    "inputsOutputs": "price, jurisdiction -> duty",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Regional and banded; jurisdiction table required before publication.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "sales-tax",
      "vat-inclusive",
      "vat-exclusive",
      "reverse-tax"
    ]
  },
  {
    "id": "CALC-0301",
    "name": "Gross Pay from Hours",
    "slug": "gross-pay-hourly",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "hours, rate -> gross",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly",
      "hourly-to-salary"
    ]
  },
  {
    "id": "CALC-0302",
    "name": "FLSA Overtime Pay",
    "slug": "overtime-flsa",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "hours, rate -> regular + OT",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "40-hour/1.5\u00d7 rule verified on dol.gov; state premium-pay rules are separate.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-012",
        "title": "U.S. Department of Labor WHD \u2014 Fact Sheet & Overtime Pay under the FLSA",
        "url": "https://www.dol.gov/agencies/whd/overtime",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "gross-pay-hourly",
      "overtime-blended-rate",
      "salary-to-hourly",
      "hourly-to-salary"
    ]
  },
  {
    "id": "CALC-0303",
    "name": "Blended Overtime Rate",
    "slug": "overtime-blended-rate",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "base, bonus, hours -> blended OT",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "salary-to-hourly",
      "hourly-to-salary"
    ]
  },
  {
    "id": "CALC-0304",
    "name": "Salary to Hourly",
    "slug": "salary-to-hourly",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "annual, hours/week -> hourly",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "hourly-to-salary"
    ]
  },
  {
    "id": "CALC-0305",
    "name": "Hourly to Salary",
    "slug": "hourly-to-salary",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "hourly, hours -> annual",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0306",
    "name": "Pay Period Converter",
    "slug": "pay-period-converter",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "any frequency -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0307",
    "name": "Net Pay",
    "slug": "net-pay",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "gross, deductions -> net",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0308",
    "name": "FICA Payroll Tax",
    "slug": "fica-payroll-tax",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "wages -> employee/employer",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0309",
    "name": "Take-Home Pay",
    "slug": "take-home-pay",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "salary, state, allowances -> net",
    "complexity": "Specialist",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires jurisdiction-specific withholding tables.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0310",
    "name": "Bonus Tax",
    "slug": "bonus-tax",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "bonus, method -> net",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0311",
    "name": "Commission Pay",
    "slug": "commission-pay",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "sales, rate, tier -> pay",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0312",
    "name": "Shift Differential",
    "slug": "shift-differential",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "hours, base, differential -> pay",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0313",
    "name": "PTO Accrual",
    "slug": "pto-accrual",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "rate, hours worked -> balance",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0314",
    "name": "PTO Payout",
    "slug": "pto-payout",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "balance, rate -> payout",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0315",
    "name": "Severance Pay",
    "slug": "severance-pay",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "tenure, salary, policy -> amount",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0316",
    "name": "Final Paycheck",
    "slug": "final-paycheck",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "hours, PTO, deductions -> total",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0317",
    "name": "Pay Raise",
    "slug": "pay-raise",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "current, raise% -> new pay",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0318",
    "name": "Employer Cost of Employee",
    "slug": "employer-cost",
    "category": "C18",
    "categoryLabel": "Payroll, Salary and Compensation",
    "inputsOutputs": "salary, contributions -> total cost",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gross-pay-hourly",
      "overtime-flsa",
      "overtime-blended-rate",
      "salary-to-hourly"
    ]
  },
  {
    "id": "CALC-0319",
    "name": "Inflation Rate (CPI)",
    "slug": "inflation-rate",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "CPI values -> rate",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "real-wage",
      "purchasing-power",
      "price-index",
      "demand-elasticity"
    ]
  },
  {
    "id": "CALC-0320",
    "name": "Real Wage",
    "slug": "real-wage",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "nominal wage, CPI -> real",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "purchasing-power",
      "price-index",
      "demand-elasticity"
    ]
  },
  {
    "id": "CALC-0321",
    "name": "Purchasing Power",
    "slug": "purchasing-power",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "amount, CPI -> equivalent",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "price-index",
      "demand-elasticity"
    ]
  },
  {
    "id": "CALC-0322",
    "name": "Price Index",
    "slug": "price-index",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "basket, base year -> index",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "demand-elasticity"
    ]
  },
  {
    "id": "CALC-0323",
    "name": "Demand Elasticity (Arc)",
    "slug": "demand-elasticity",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "P1,P2,Q1,Q2 -> E",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0324",
    "name": "Supply Elasticity",
    "slug": "supply-elasticity",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "P1,P2,Q1,Q2 -> E",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0325",
    "name": "Consumer Surplus",
    "slug": "consumer-surplus",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "demand line, price -> surplus",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0326",
    "name": "Producer Surplus",
    "slug": "producer-surplus",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "supply line, price -> surplus",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0327",
    "name": "GDP Growth Rate",
    "slug": "gdp-growth",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "GDP series -> growth%",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0328",
    "name": "Unemployment Rate",
    "slug": "unemployment-rate",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "labour force data -> rate",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0329",
    "name": "PPP Conversion",
    "slug": "ppp-conversion",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "amount, PPP ratio -> equivalent",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0330",
    "name": "Currency Conversion",
    "slug": "currency-conversion",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "amount, rate -> converted",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Static rate input only; live FX requires a licensed data feed.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0331",
    "name": "Fiscal Multiplier Effect",
    "slug": "multiplier-effect",
    "category": "C19",
    "categoryLabel": "Economics and Business Analytics",
    "inputsOutputs": "injection, MPC -> total impact",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "inflation-rate",
      "real-wage",
      "purchasing-power",
      "price-index"
    ]
  },
  {
    "id": "CALC-0332",
    "name": "CPM",
    "slug": "cpm",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "cost, impressions -> CPM",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpc",
      "cpa",
      "ctr",
      "conversion-rate"
    ]
  },
  {
    "id": "CALC-0333",
    "name": "CPC",
    "slug": "cpc",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "cost, clicks -> CPC",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpa",
      "ctr",
      "conversion-rate"
    ]
  },
  {
    "id": "CALC-0334",
    "name": "CPA",
    "slug": "cpa",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "cost, conversions -> CPA",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "ctr",
      "conversion-rate"
    ]
  },
  {
    "id": "CALC-0335",
    "name": "CTR",
    "slug": "ctr",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "clicks, impressions -> CTR%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "conversion-rate"
    ]
  },
  {
    "id": "CALC-0336",
    "name": "Conversion Rate",
    "slug": "conversion-rate",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "conversions, visits -> CVR%",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0337",
    "name": "ROAS",
    "slug": "roas",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "revenue, ad spend -> ROAS",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0338",
    "name": "Marketing ROI",
    "slug": "marketing-roi",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "gross profit, spend -> ROI%",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0339",
    "name": "Customer Acquisition Cost",
    "slug": "cac",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "spend, new customers -> CAC",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0340",
    "name": "Customer Lifetime Value",
    "slug": "customer-lifetime-value",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "ARPU, margin, lifetime -> LTV",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0341",
    "name": "LTV to CAC Ratio",
    "slug": "ltv-cac-ratio",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "LTV, CAC -> ratio",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0342",
    "name": "Churn Rate",
    "slug": "churn-rate",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "lost, starting -> churn%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0343",
    "name": "Retention Rate",
    "slug": "retention-rate",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "cohort -> retention%",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0344",
    "name": "MRR and ARR",
    "slug": "mrr-arr",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "subscribers, price -> MRR, ARR",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0345",
    "name": "ARPU",
    "slug": "arpu",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "revenue, users -> ARPU",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0346",
    "name": "Break-Even ROAS",
    "slug": "breakeven-roas",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "margin -> ROAS needed",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0347",
    "name": "Funnel Conversion",
    "slug": "funnel-conversion",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "stage counts -> rates",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0348",
    "name": "Ad Budget from Target CPA",
    "slug": "ad-budget-cpa",
    "category": "C20",
    "categoryLabel": "Marketing and Advertising Metrics",
    "inputsOutputs": "target CPA, volume -> budget",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cpm",
      "cpc",
      "cpa",
      "ctr"
    ]
  },
  {
    "id": "CALC-0349",
    "name": "Marketplace Fee Profit",
    "slug": "marketplace-fee-profit",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "price, fees -> net profit",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads",
      "discount-profit-impact"
    ]
  },
  {
    "id": "CALC-0350",
    "name": "Landed Cost",
    "slug": "landed-cost",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "goods, freight, duty -> total",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "dropshipping-margin",
      "breakeven-units-ads",
      "discount-profit-impact"
    ]
  },
  {
    "id": "CALC-0351",
    "name": "Dropshipping Margin",
    "slug": "dropshipping-margin",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "price, supplier, fees -> margin",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "breakeven-units-ads",
      "discount-profit-impact"
    ]
  },
  {
    "id": "CALC-0352",
    "name": "Break-Even Units with Ad Spend",
    "slug": "breakeven-units-ads",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "FC, ads, CM -> units",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "discount-profit-impact"
    ]
  },
  {
    "id": "CALC-0353",
    "name": "Discount Profit Impact",
    "slug": "discount-profit-impact",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "price, discount, cost -> profit",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0354",
    "name": "Bundle Pricing",
    "slug": "bundle-pricing",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "component prices -> bundle price",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0355",
    "name": "Free Shipping Threshold",
    "slug": "free-shipping-threshold",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "AOV, shipping, margin -> threshold",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0356",
    "name": "Return Rate Cost",
    "slug": "return-rate-cost",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "returns, shipping -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0357",
    "name": "Coupon Stacking",
    "slug": "coupon-stacking",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "coupons -> effective discount",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0358",
    "name": "Unit Price Comparison",
    "slug": "unit-price-comparison",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "packages -> price per unit",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0359",
    "name": "Psychological Price Rounding",
    "slug": "price-rounding",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "price, strategy -> rounded",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0360",
    "name": "Digital Goods VAT",
    "slug": "digital-vat",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "price, buyer country -> VAT",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Place-of-supply rules differ per jurisdiction (EU OSS, UK, GCC).",
    "intent": "estimate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0361",
    "name": "Product Cost Markup for Marketplaces",
    "slug": "product-cost-markup",
    "category": "C21",
    "categoryLabel": "E-commerce and Online Selling",
    "inputsOutputs": "target net, fees -> list price",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "marketplace-fee-profit",
      "landed-cost",
      "dropshipping-margin",
      "breakeven-units-ads"
    ]
  },
  {
    "id": "CALC-0362",
    "name": "Cap Rate",
    "slug": "cap-rate",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "NOI, price -> cap rate",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return",
      "rental-yield"
    ]
  },
  {
    "id": "CALC-0363",
    "name": "Net Operating Income",
    "slug": "noi",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "rent, vacancy, opex -> NOI",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "gross-rent-multiplier",
      "cash-on-cash-return",
      "rental-yield"
    ]
  },
  {
    "id": "CALC-0364",
    "name": "Gross Rent Multiplier",
    "slug": "gross-rent-multiplier",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "price, gross rent -> GRM",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "cash-on-cash-return",
      "rental-yield"
    ]
  },
  {
    "id": "CALC-0365",
    "name": "Cash-on-Cash Return",
    "slug": "cash-on-cash-return",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "cash flow, invested -> CoC%",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "rental-yield"
    ]
  },
  {
    "id": "CALC-0366",
    "name": "Rental Yield",
    "slug": "rental-yield",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "rent, price, costs -> gross/net yield",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0367",
    "name": "Vacancy-Adjusted Income",
    "slug": "vacancy-adjusted-income",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "gross rent, vacancy% -> effective",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0368",
    "name": "Rental Cash Flow",
    "slug": "rental-cash-flow",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "rent, expenses, debt -> cash flow",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0369",
    "name": "Property ROI",
    "slug": "property-roi",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "cash flow, appreciation, equity -> ROI",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0370",
    "name": "Fix-and-Flip Profit",
    "slug": "flip-profit",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "ARV, costs -> profit",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0371",
    "name": "70% Rule Maximum Offer",
    "slug": "seventy-percent-rule",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "ARV, repairs -> max offer",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0372",
    "name": "1% Rule Screen",
    "slug": "one-percent-rule",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "rent, price -> pass/fail",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0373",
    "name": "Rent Increase",
    "slug": "rent-increase",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "current, % -> new rent",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0374",
    "name": "Agent Commission",
    "slug": "agent-commission",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "price, rate, split -> commission",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0375",
    "name": "Lease Proration",
    "slug": "lease-proration",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "rent, move dates -> prorated amount",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0376",
    "name": "Security Deposit Interest",
    "slug": "security-deposit",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "deposit, rate, months -> interest",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0377",
    "name": "Leveraged Property Return",
    "slug": "leverage-roi",
    "category": "C22",
    "categoryLabel": "Real Estate and Property Investment",
    "inputsOutputs": "equity, mortgage -> levered return",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cap-rate",
      "noi",
      "gross-rent-multiplier",
      "cash-on-cash-return"
    ]
  },
  {
    "id": "CALC-0378",
    "name": "Concrete Volume",
    "slug": "concrete-volume",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "L, W, D, waste -> m3/yd3",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags",
      "rebar-quantity"
    ]
  },
  {
    "id": "CALC-0379",
    "name": "Concrete Weight",
    "slug": "concrete-weight",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "volume, density -> mass",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-mix-ratio",
      "cement-bags",
      "rebar-quantity"
    ]
  },
  {
    "id": "CALC-0380",
    "name": "Concrete Mix Ratio",
    "slug": "concrete-mix-ratio",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "volume, mix ratio -> cement/sand/aggregate",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "cement-bags",
      "rebar-quantity"
    ]
  },
  {
    "id": "CALC-0381",
    "name": "Cement Bags Required",
    "slug": "cement-bags",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "volume, mix -> bags",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "rebar-quantity"
    ]
  },
  {
    "id": "CALC-0382",
    "name": "Rebar Quantity",
    "slug": "rebar-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "spacing, area -> bars, length",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0383",
    "name": "Rebar Weight",
    "slug": "rebar-weight",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "diameter, length, count -> mass",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0384",
    "name": "Brick Quantity",
    "slug": "brick-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "wall area, brick, joint -> count",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0385",
    "name": "Mortar Quantity",
    "slug": "mortar-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "brickwork volume -> mortar",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0386",
    "name": "Concrete Block Quantity",
    "slug": "block-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "wall area, block size -> count",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0387",
    "name": "Plaster Quantity",
    "slug": "plaster-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, thickness -> cement, sand",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0388",
    "name": "Paint Coverage",
    "slug": "paint-coverage",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, coats, coverage -> litres",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0389",
    "name": "Tile Count",
    "slug": "tile-count",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, tile size, waste -> tiles, boxes",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0390",
    "name": "Tile Adhesive and Grout",
    "slug": "tile-adhesive-grout",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, trowel, joint -> kg",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0391",
    "name": "Drywall Sheets",
    "slug": "drywall-sheets",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, sheet size -> sheets, screws",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0392",
    "name": "Insulation Quantity",
    "slug": "insulation-quantity",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, R-value, product -> rolls",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0393",
    "name": "Asphalt Tonnage",
    "slug": "asphalt-tonnage",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, depth, density -> tonnes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0394",
    "name": "Aggregate Tonnage",
    "slug": "aggregate-tonnage",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "volume, bulk density -> tonnes",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0395",
    "name": "Sand Volume",
    "slug": "sand-volume",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, depth, compaction -> m3",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0396",
    "name": "Screed Material",
    "slug": "screed-material",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area, thickness, mix -> cement, sand",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0397",
    "name": "Water-Cement Ratio",
    "slug": "water-cement-ratio",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "cement mass, ratio -> water",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0398",
    "name": "Formwork Plywood",
    "slug": "formwork-plywood",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "concrete area, reuse -> sheets",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0399",
    "name": "Roofing Squares",
    "slug": "roofing-squares",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "area -> squares, bundles",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0400",
    "name": "Shingle Bundles",
    "slug": "shingle-bundles",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "roof area, waste -> bundles",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0401",
    "name": "Excavation Volume",
    "slug": "excavation-volume",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "L, W, D, swell -> loose volume",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0402",
    "name": "Backfill Volume",
    "slug": "backfill-volume",
    "category": "C23",
    "categoryLabel": "Construction Materials and Quantity Takeoff",
    "inputsOutputs": "excavation, structure -> fill, compaction",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "concrete-volume",
      "concrete-weight",
      "concrete-mix-ratio",
      "cement-bags"
    ]
  },
  {
    "id": "CALC-0403",
    "name": "Floor Area Calculator",
    "slug": "floor-area",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "dimensions -> area, perimeter",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage",
      "room-volume"
    ]
  },
  {
    "id": "CALC-0404",
    "name": "Carpet vs Built-Up Area",
    "slug": "carpet-vs-builtup",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "carpet area, loading -> built-up",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "far-fsi",
      "plot-coverage",
      "room-volume"
    ]
  },
  {
    "id": "CALC-0405",
    "name": "FAR / FSI",
    "slug": "far-fsi",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "plot, floor areas -> FAR",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "plot-coverage",
      "room-volume"
    ]
  },
  {
    "id": "CALC-0406",
    "name": "Plot Coverage",
    "slug": "plot-coverage",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "footprint, plot -> coverage%",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "room-volume"
    ]
  },
  {
    "id": "CALC-0407",
    "name": "Room Volume",
    "slug": "room-volume",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "L, W, H -> volume, air changes",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0408",
    "name": "Staircase Rise and Run",
    "slug": "staircase-rise-run",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "floor height, riser -> treads, run",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0409",
    "name": "Stair Stringer Length",
    "slug": "stair-stringer",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "rise, run -> stringer, angle",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0410",
    "name": "Ramp Slope Compliance",
    "slug": "ramp-slope",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "rise, run -> slope, ratio",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0411",
    "name": "Net Wall Area",
    "slug": "wall-area-openings",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "gross wall, openings -> net",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0412",
    "name": "Wallpaper Rolls",
    "slug": "wallpaper-rolls",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "wall area, roll, repeat -> rolls",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0413",
    "name": "Curtain Fabric Quantity",
    "slug": "curtain-fabric",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "window, fullness, drop -> metres",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0414",
    "name": "Flooring Wastage",
    "slug": "flooring-wastage",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "area, pattern, waste -> order qty",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0415",
    "name": "Skirting Length",
    "slug": "skirting-length",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "room perimeter, openings -> metres",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0416",
    "name": "False Ceiling Area",
    "slug": "false-ceiling-area",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "room, border -> area, tiles",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0417",
    "name": "Ceiling Height Clearance",
    "slug": "ceiling-height",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "floor height, services -> clear height",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0418",
    "name": "Fenestration Ratio",
    "slug": "fenestration-ratio",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "window area, floor area -> ratio",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0419",
    "name": "Room Air Changes",
    "slug": "room-ach",
    "category": "C24",
    "categoryLabel": "Architecture, Building Geometry and Interiors",
    "inputsOutputs": "flow, volume -> ACH",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "floor-area",
      "carpet-vs-builtup",
      "far-fsi",
      "plot-coverage"
    ]
  },
  {
    "id": "CALC-0420",
    "name": "Soil Bearing Pressure",
    "slug": "soil-bearing-pressure",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "load, footing area -> pressure",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "footing-size",
      "column-axial-load",
      "beam-moment-udl",
      "cantilever-moment"
    ]
  },
  {
    "id": "CALC-0421",
    "name": "Footing Size",
    "slug": "footing-size",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "load, allowable bearing -> area, side",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "column-axial-load",
      "beam-moment-udl",
      "cantilever-moment"
    ]
  },
  {
    "id": "CALC-0422",
    "name": "Column Axial Load",
    "slug": "column-axial-load",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "tributary area, load -> kN",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "beam-moment-udl",
      "cantilever-moment"
    ]
  },
  {
    "id": "CALC-0423",
    "name": "Simply Supported Beam Moment",
    "slug": "beam-moment-udl",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "w, L -> M, V",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "cantilever-moment"
    ]
  },
  {
    "id": "CALC-0424",
    "name": "Cantilever Beam Moment",
    "slug": "cantilever-moment",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "w, L -> M, V",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0425",
    "name": "Beam Shear Force",
    "slug": "beam-shear",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "loads, supports -> V diagram",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0426",
    "name": "Beam Deflection",
    "slug": "beam-deflection",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "w, L, E, I -> \u03b4",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0427",
    "name": "Slab Thickness Rule of Thumb",
    "slug": "slab-thickness",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "span, support -> thickness",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Span/depth ratios are code-specific (ACI/Eurocode); licensed reference needed.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0428",
    "name": "Rebar Area Required",
    "slug": "rebar-area-required",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "moment, fy, d -> As",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires ACI 318 / Eurocode 2 provisions and licensed access.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0429",
    "name": "Cube to Cylinder Strength",
    "slug": "cube-cylinder-strength",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "cube MPa -> cylinder MPa",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Conversion factor is code- and region-specific; must cite the code.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0430",
    "name": "Rankine Earth Pressure",
    "slug": "rankine-earth-pressure",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "\u03c6, \u03b3, H -> Ka, p, force",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0431",
    "name": "Retaining Wall Stability",
    "slug": "retaining-wall-stability",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "geometry, loads -> FS overturning/sliding",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires geotechnical input and code factors.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0432",
    "name": "Wind Load (ASCE 7)",
    "slug": "wind-load",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "velocity, exposure, height -> pressure",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Licensed standard; coefficients not reproduced.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0433",
    "name": "Snow Load",
    "slug": "snow-load",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "ground snow, exposure -> roof load",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Code-specific (ASCE 7 Ch.7 / EN 1991-1-3).",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0434",
    "name": "LRFD Load Combination",
    "slug": "load-combination-lrfd",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "dead, live, wind -> factored",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Combination sets are code-specific and change by edition.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0435",
    "name": "Pile Capacity",
    "slug": "pile-capacity",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "skin friction, end bearing -> capacity",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Geotechnical specialist review mandatory.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0436",
    "name": "Pavement Thickness (AASHTO)",
    "slug": "pavement-thickness",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "ESAL, soil, materials -> thickness",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "AASHTO guide is licensed; equations not reproduced.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0437",
    "name": "ESAL Traffic Loading",
    "slug": "esal-traffic",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "axle loads, counts -> ESAL",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0438",
    "name": "Concrete Curing Time",
    "slug": "concrete-curing",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "mix, temperature -> strength gain",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0439",
    "name": "Trench Excavation Safety",
    "slug": "trench-excavation",
    "category": "C25",
    "categoryLabel": "Civil and Structural Engineering",
    "inputsOutputs": "depth, soil -> benching requirement",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "OSHA 1926 Subpart P soil classification rules apply.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "soil-bearing-pressure",
      "footing-size",
      "column-axial-load",
      "beam-moment-udl"
    ]
  },
  {
    "id": "CALC-0440",
    "name": "Force Calculator",
    "slug": "force-newton",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "mass, acceleration -> force",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "torque",
      "rotational-power",
      "gear-ratio",
      "belt-pulley-speed"
    ]
  },
  {
    "id": "CALC-0441",
    "name": "Torque Calculator",
    "slug": "torque",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "force, radius -> torque",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "rotational-power",
      "gear-ratio",
      "belt-pulley-speed"
    ]
  },
  {
    "id": "CALC-0442",
    "name": "Rotational Power",
    "slug": "rotational-power",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "torque, rpm -> power",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "gear-ratio",
      "belt-pulley-speed"
    ]
  },
  {
    "id": "CALC-0443",
    "name": "Gear Ratio",
    "slug": "gear-ratio",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "teeth, rpm -> ratio, output rpm",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "belt-pulley-speed"
    ]
  },
  {
    "id": "CALC-0444",
    "name": "Belt and Pulley Speed",
    "slug": "belt-pulley-speed",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "diameters, rpm -> speeds",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0445",
    "name": "Bearing Life L10",
    "slug": "bearing-life",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "C, P, speed -> hours",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0446",
    "name": "Spring Rate",
    "slug": "spring-rate",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "wire, coil, turns, G -> k",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0447",
    "name": "Bolt Tightening Torque",
    "slug": "bolt-torque",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "preload, diameter, K -> torque",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0448",
    "name": "Friction Force",
    "slug": "friction-force",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "normal, \u03bc -> friction",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0449",
    "name": "Inclined Plane",
    "slug": "inclined-plane",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "mass, angle, \u03bc -> forces",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0450",
    "name": "Lever Mechanical Advantage",
    "slug": "mechanical-advantage",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "arms -> MA, force",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0451",
    "name": "Pulley System Advantage",
    "slug": "pulley-system",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "ropes -> MA, effort",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0452",
    "name": "Area Moment of Inertia",
    "slug": "area-moment-inertia",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "shape, dims -> I",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0453",
    "name": "Section Modulus",
    "slug": "section-modulus",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "shape, dims -> S",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0454",
    "name": "Thermal Expansion",
    "slug": "thermal-expansion",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "L, \u03b1, \u0394T -> \u0394L",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0455",
    "name": "Natural Frequency",
    "slug": "natural-frequency",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "k, m -> fn",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0456",
    "name": "Shaft Critical Speed",
    "slug": "critical-speed",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "E, I, m, L -> rpm",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0457",
    "name": "Flywheel Energy",
    "slug": "flywheel-energy",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "I, rpm -> energy",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0458",
    "name": "Motor Torque and Slip",
    "slug": "motor-slip",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "sync speed, rpm, power -> T, slip",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0459",
    "name": "Hoist Capacity",
    "slug": "hoist-capacity",
    "category": "C26",
    "categoryLabel": "Mechanical Engineering and Machine Design",
    "inputsOutputs": "load, reeving, efficiency -> required",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "force-newton",
      "torque",
      "rotational-power",
      "gear-ratio"
    ]
  },
  {
    "id": "CALC-0460",
    "name": "Ohm's Law",
    "slug": "ohms-law",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "any 2 of V,I,R -> third",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dc-power",
      "three-phase-power",
      "power-factor-correction",
      "voltage-drop-single-phase"
    ]
  },
  {
    "id": "CALC-0461",
    "name": "DC Power",
    "slug": "dc-power",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "V, I, R -> P",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "three-phase-power",
      "power-factor-correction",
      "voltage-drop-single-phase"
    ]
  },
  {
    "id": "CALC-0462",
    "name": "Three-Phase Power",
    "slug": "three-phase-power",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "V, I, PF -> kW, kVA, kVAR",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "power-factor-correction",
      "voltage-drop-single-phase"
    ]
  },
  {
    "id": "CALC-0463",
    "name": "Power Factor Correction",
    "slug": "power-factor-correction",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "kW, PF1, PF2 -> kVAR",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "voltage-drop-single-phase"
    ]
  },
  {
    "id": "CALC-0464",
    "name": "Voltage Drop Single Phase",
    "slug": "voltage-drop-single-phase",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "current, length, cable -> \u0394V",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0465",
    "name": "Voltage Drop Three Phase",
    "slug": "voltage-drop-three-phase",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "current, length, cable -> \u0394V",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0466",
    "name": "Wire Ampacity Selection",
    "slug": "wire-ampacity",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "load, insulation, method -> size",
    "complexity": "Specialist",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Code tables (NEC/IEC) licensed; inputs must come from a cited table edition.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0467",
    "name": "Cable Resistance",
    "slug": "cable-resistance",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "material, area, length, temp -> R",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0468",
    "name": "Energy Consumption kWh",
    "slug": "energy-consumption-kwh",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "watts, hours, days -> kWh",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0469",
    "name": "Electricity Cost",
    "slug": "electricity-cost",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "kWh, tariff, tiers -> bill",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0470",
    "name": "Breaker Sizing",
    "slug": "breaker-sizing",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "load, continuous factor -> breaker",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Continuous-load 125% rule is code-specific.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0471",
    "name": "Transformer kVA",
    "slug": "transformer-kva",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "load kW, PF, margin -> kVA",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0472",
    "name": "Motor Full-Load Current",
    "slug": "motor-flc",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "kW, voltage, PF, eff -> FLC",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0473",
    "name": "Motor Efficiency",
    "slug": "motor-efficiency",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "input, output -> \u03b7, losses",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0474",
    "name": "Star-Delta Conversion",
    "slug": "star-delta-conversion",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "impedances -> equivalent",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0475",
    "name": "Resistors in Series and Parallel",
    "slug": "resistors-series-parallel",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "network -> Req",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0476",
    "name": "Capacitors in Series and Parallel",
    "slug": "capacitors-series-parallel",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "network -> Ceq",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0477",
    "name": "Impedance of RLC",
    "slug": "impedance-rlc",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "R, L, C, f -> Z, phase",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0478",
    "name": "Resonant Frequency",
    "slug": "resonant-frequency",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "L, C -> f0",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0479",
    "name": "RMS and Peak Values",
    "slug": "rms-value",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "waveform -> RMS, peak, avg",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0480",
    "name": "Transformer Turns Ratio",
    "slug": "turns-ratio",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "turns, voltages -> ratio",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0481",
    "name": "Earthing Resistance",
    "slug": "earthing-resistance",
    "category": "C27",
    "categoryLabel": "Electrical Engineering and Power Systems",
    "inputsOutputs": "rod, soil, config -> R",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Depends on soil model and code; specialist review.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "ohms-law",
      "dc-power",
      "three-phase-power",
      "power-factor-correction"
    ]
  },
  {
    "id": "CALC-0482",
    "name": "Voltage Divider",
    "slug": "voltage-divider",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "Vin, R1, R2 -> Vout",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "current-divider",
      "led-resistor",
      "rc-time-constant",
      "rl-time-constant"
    ]
  },
  {
    "id": "CALC-0483",
    "name": "Current Divider",
    "slug": "current-divider",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "Itot, resistors -> branch currents",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "led-resistor",
      "rc-time-constant",
      "rl-time-constant"
    ]
  },
  {
    "id": "CALC-0484",
    "name": "LED Series Resistor",
    "slug": "led-resistor",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "Vs, Vf, If -> R, power",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "rc-time-constant",
      "rl-time-constant"
    ]
  },
  {
    "id": "CALC-0485",
    "name": "RC Time Constant",
    "slug": "rc-time-constant",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "R, C -> \u03c4, charge curve",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rl-time-constant"
    ]
  },
  {
    "id": "CALC-0486",
    "name": "RL Time Constant",
    "slug": "rl-time-constant",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "R, L -> \u03c4",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0487",
    "name": "LC Resonance",
    "slug": "lc-resonance",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "L, C -> f0, Q",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0488",
    "name": "Op-Amp Gain",
    "slug": "opamp-gain",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "config, resistors -> Av",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0489",
    "name": "Transistor Bias",
    "slug": "transistor-bias",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "Vcc, Rb, Rc, \u03b2 -> Q-point",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0490",
    "name": "Rectifier Ripple",
    "slug": "rectifier-ripple",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "C, load, f -> ripple",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0491",
    "name": "Zener Regulator",
    "slug": "zener-regulator",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "Vin, Vz, load -> Rs, current",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0492",
    "name": "PCB Trace Width",
    "slug": "pcb-trace-width",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "current, rise, copper -> width",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Based on IPC-2221 charts; licensed reference required before publish.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0493",
    "name": "Resistor Colour Code",
    "slug": "resistor-colour-code",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "bands -> value, tolerance",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0494",
    "name": "Capacitor Code",
    "slug": "capacitor-code",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "3-digit code -> value",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0495",
    "name": "RC Filter Cutoff",
    "slug": "filter-cutoff",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "R, C -> fc, response",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0496",
    "name": "Gain in Decibels",
    "slug": "gain-db",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "ratio -> dB",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0497",
    "name": "Signal-to-Noise Ratio",
    "slug": "snr",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "signal, noise -> SNR dB",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0498",
    "name": "NE555 Timer",
    "slug": "ne555-timer",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "R, C -> frequency, duty",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0499",
    "name": "PWM Duty Cycle",
    "slug": "pwm-duty",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "on time, period -> duty%, avg V",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0500",
    "name": "ADC Resolution",
    "slug": "adc-resolution",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "bits, Vref -> LSB, codes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0501",
    "name": "Pull-Up Resistor",
    "slug": "pullup-resistor",
    "category": "C28",
    "categoryLabel": "Electronics and Circuit Analysis",
    "inputsOutputs": "bus capacitance, speed -> R range",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "voltage-divider",
      "current-divider",
      "led-resistor",
      "rc-time-constant"
    ]
  },
  {
    "id": "CALC-0502",
    "name": "Reactor Residence Time",
    "slug": "reactor-residence-time",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "volume, flow -> \u03c4",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure",
      "ideal-gas-law"
    ]
  },
  {
    "id": "CALC-0503",
    "name": "Conversion and Selectivity",
    "slug": "conversion-selectivity",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "in/out flows -> X, S",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "mass-balance",
      "mole-fraction-partial-pressure",
      "ideal-gas-law"
    ]
  },
  {
    "id": "CALC-0504",
    "name": "Steady-State Mass Balance",
    "slug": "mass-balance",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "streams -> unknown flow",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mole-fraction-partial-pressure",
      "ideal-gas-law"
    ]
  },
  {
    "id": "CALC-0505",
    "name": "Mole Fraction and Partial Pressure",
    "slug": "mole-fraction-partial-pressure",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "composition, P -> p_i",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "ideal-gas-law"
    ]
  },
  {
    "id": "CALC-0506",
    "name": "Ideal Gas Law",
    "slug": "ideal-gas-law",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "P,V,T,n -> unknown",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0507",
    "name": "Van der Waals Gas",
    "slug": "van-der-waals",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "P,V,T, a, b -> state",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0508",
    "name": "Psychrometric Humidity Ratio",
    "slug": "humidity-ratio",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "T, RH, P -> W",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASHRAE formulation; handbook licensed.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0509",
    "name": "Moist Air Enthalpy",
    "slug": "moist-air-enthalpy",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "T, W -> h",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASHRAE formulation; handbook licensed.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0510",
    "name": "Distillation Material Balance",
    "slug": "distillation-balance",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "feed, compositions -> products",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0511",
    "name": "Crystallisation Yield",
    "slug": "crystallisation-yield",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "feed, solubility, temp -> yield",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0512",
    "name": "Drying Rate",
    "slug": "drying-rate",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "moisture, air, area -> rate",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0513",
    "name": "Blending Composition",
    "slug": "blending-composition",
    "category": "C29",
    "categoryLabel": "Chemical Engineering and Process Calculations",
    "inputsOutputs": "streams -> blend",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reactor-residence-time",
      "conversion-selectivity",
      "mass-balance",
      "mole-fraction-partial-pressure"
    ]
  },
  {
    "id": "CALC-0514",
    "name": "Flow Rate from Area and Velocity",
    "slug": "flow-rate-av",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "A, v -> Q",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams",
      "manning-equation"
    ]
  },
  {
    "id": "CALC-0515",
    "name": "Reynolds Number",
    "slug": "reynolds-number",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "\u03c1, v, D, \u03bc -> Re, regime",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "darcy-weisbach",
      "hazen-williams",
      "manning-equation"
    ]
  },
  {
    "id": "CALC-0516",
    "name": "Darcy-Weisbach Head Loss",
    "slug": "darcy-weisbach",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "f, L, D, v -> h_f",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "hazen-williams",
      "manning-equation"
    ]
  },
  {
    "id": "CALC-0517",
    "name": "Hazen-Williams Head Loss",
    "slug": "hazen-williams",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "Q, C, D, L -> h_f",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "manning-equation"
    ]
  },
  {
    "id": "CALC-0518",
    "name": "Manning Equation",
    "slug": "manning-equation",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "n, R, S -> velocity, Q",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0519",
    "name": "Colebrook Friction Factor",
    "slug": "colebrook-friction-factor",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "Re, \u03b5/D -> f",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0520",
    "name": "Bernoulli Equation",
    "slug": "bernoulli",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "p, v, z at 2 points -> unknown",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0521",
    "name": "Pump Power",
    "slug": "pump-power",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "Q, H, \u03b7 -> kW",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0522",
    "name": "Pump Head",
    "slug": "pump-head",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "pressure rise, \u03c1 -> head",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0523",
    "name": "Pipe Volume",
    "slug": "pipe-volume",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "D, L -> volume, fill time",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0524",
    "name": "Pipe Diameter Sizing",
    "slug": "pipe-diameter-sizing",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "Q, v_max -> D",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0525",
    "name": "Orifice Flow",
    "slug": "orifice-flow",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "area, \u0394p, Cd -> Q",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0526",
    "name": "Rectangular Weir Flow",
    "slug": "rectangular-weir",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "head, width -> Q",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0527",
    "name": "Hydrostatic Pressure",
    "slug": "hydrostatic-pressure",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "depth, \u03c1 -> p",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0528",
    "name": "Buoyancy",
    "slug": "buoyancy",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "volume, \u03c1 -> force, draft",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0529",
    "name": "Terminal Velocity",
    "slug": "terminal-velocity",
    "category": "C30",
    "categoryLabel": "Fluid Mechanics and Hydraulics",
    "inputsOutputs": "mass, area, Cd, \u03c1 -> v_t",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "flow-rate-av",
      "reynolds-number",
      "darcy-weisbach",
      "hazen-williams"
    ]
  },
  {
    "id": "CALC-0530",
    "name": "Fourier Conduction",
    "slug": "conduction-fourier",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "k, A, \u0394T, L -> q",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "convection-newton",
      "radiation-stefan",
      "lmtd",
      "overall-heat-transfer"
    ]
  },
  {
    "id": "CALC-0531",
    "name": "Newton Convection",
    "slug": "convection-newton",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "h, A, \u0394T -> q",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "radiation-stefan",
      "lmtd",
      "overall-heat-transfer"
    ]
  },
  {
    "id": "CALC-0532",
    "name": "Stefan-Boltzmann Radiation",
    "slug": "radiation-stefan",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "\u03b5, A, T -> q",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "lmtd",
      "overall-heat-transfer"
    ]
  },
  {
    "id": "CALC-0533",
    "name": "Log Mean Temperature Difference",
    "slug": "lmtd",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "inlet/outlet temps -> LMTD",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "overall-heat-transfer"
    ]
  },
  {
    "id": "CALC-0534",
    "name": "Overall Heat Transfer Coefficient",
    "slug": "overall-heat-transfer",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "resistances -> U",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0535",
    "name": "Heat Exchanger Area",
    "slug": "heat-exchanger-area",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "Q, U, LMTD -> A",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0536",
    "name": "Sensible Heat",
    "slug": "sensible-heat",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "mass, cp, \u0394T -> energy",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0537",
    "name": "Latent Heat",
    "slug": "latent-heat",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "mass, h_fg -> energy",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0538",
    "name": "HVAC Tonnage Sizing",
    "slug": "hvac-tonnage",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "area, climate, insulation -> tons",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Rule-of-thumb sizing; must be labelled approximate.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0539",
    "name": "U-Value and R-Value",
    "slug": "u-value-r-value",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "layers -> U, R",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0540",
    "name": "Refrigeration COP",
    "slug": "cop-refrigeration",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "Q_c, W -> COP",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0541",
    "name": "Carnot Efficiency",
    "slug": "carnot-efficiency",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "T_hot, T_cold -> \u03b7, COP",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0542",
    "name": "Cooling Load Estimate",
    "slug": "cooling-load-simple",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "area, occupancy, equipment -> kW",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0543",
    "name": "Duct Sizing",
    "slug": "duct-sizing",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "CFM, velocity -> duct size",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0544",
    "name": "Pipe Insulation Thickness",
    "slug": "pipe-insulation",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "\u0394T, k, h -> thickness",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0545",
    "name": "Specific Heat Energy",
    "slug": "specific-heat-energy",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "m, c, \u0394T -> Q",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0546",
    "name": "Thermal Expansion of Fluids",
    "slug": "fluid-thermal-expansion",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "V, \u03b2, \u0394T -> \u0394V",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0547",
    "name": "Heat Pump Balance Point",
    "slug": "heat-pump-balance",
    "category": "C31",
    "categoryLabel": "Thermodynamics and Heat Transfer",
    "inputsOutputs": "capacity curve, load -> balance",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "conduction-fourier",
      "convection-newton",
      "radiation-stefan",
      "lmtd"
    ]
  },
  {
    "id": "CALC-0548",
    "name": "OEE",
    "slug": "oee",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "availability, performance, quality -> OEE",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "availability-rate",
      "performance-rate",
      "quality-rate",
      "takt-time"
    ]
  },
  {
    "id": "CALC-0549",
    "name": "Availability Rate",
    "slug": "availability-rate",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "runtime, planned time -> A%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "performance-rate",
      "quality-rate",
      "takt-time"
    ]
  },
  {
    "id": "CALC-0550",
    "name": "Performance Rate",
    "slug": "performance-rate",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "ideal cycle, units, runtime -> P%",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "quality-rate",
      "takt-time"
    ]
  },
  {
    "id": "CALC-0551",
    "name": "Quality Rate",
    "slug": "quality-rate",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "good, total units -> Q%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "takt-time"
    ]
  },
  {
    "id": "CALC-0552",
    "name": "Takt Time",
    "slug": "takt-time",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "available time, demand -> takt",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0553",
    "name": "Cycle Time and Throughput",
    "slug": "cycle-time",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "time per unit -> units/hour",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0554",
    "name": "Production Capacity",
    "slug": "production-capacity",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "rate, hours, OEE -> units",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0555",
    "name": "Capacity Utilisation",
    "slug": "capacity-utilisation",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "actual, capacity -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0556",
    "name": "Production Yield",
    "slug": "production-yield",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "good, started -> yield%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0557",
    "name": "Scrap Rate",
    "slug": "scrap-rate",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "scrap, produced -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0558",
    "name": "Labour Productivity",
    "slug": "labour-productivity",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "output, labour hours -> units/hr",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0559",
    "name": "Machine Hour Rate",
    "slug": "machine-hour-rate",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "costs, hours -> rate",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0560",
    "name": "Standard Cost",
    "slug": "standard-cost",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "material, labour, overhead -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0561",
    "name": "Line Balance Efficiency",
    "slug": "line-balance-efficiency",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "task times, stations -> %",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0562",
    "name": "Little's Law WIP",
    "slug": "little-law-wip",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "throughput, flow time -> WIP",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0563",
    "name": "Kanban Size",
    "slug": "kanban-size",
    "category": "C32",
    "categoryLabel": "Manufacturing, Production and OEE",
    "inputsOutputs": "demand, lead time, container -> cards",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "oee",
      "availability-rate",
      "performance-rate",
      "quality-rate"
    ]
  },
  {
    "id": "CALC-0564",
    "name": "1-D Cutting Stock Planner",
    "slug": "cutting-stock-1d",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "stock length, piece list -> cut plan",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation",
      "rebar-cutting-plan"
    ]
  },
  {
    "id": "CALC-0565",
    "name": "2-D Sheet Nesting Estimator",
    "slug": "sheet-nesting-2d",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "sheet, rectangles -> layout, waste",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "cut-list-waste",
      "kerf-compensation",
      "rebar-cutting-plan"
    ]
  },
  {
    "id": "CALC-0566",
    "name": "Cut List Waste",
    "slug": "cut-list-waste",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "pieces, stock -> waste%",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "kerf-compensation",
      "rebar-cutting-plan"
    ]
  },
  {
    "id": "CALC-0567",
    "name": "Kerf Compensation",
    "slug": "kerf-compensation",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "pieces, kerf -> extra length",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "rebar-cutting-plan"
    ]
  },
  {
    "id": "CALC-0568",
    "name": "Rebar Cutting Plan",
    "slug": "rebar-cutting-plan",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "bar length, demands -> plan",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0569",
    "name": "Pipe Cutting Plan",
    "slug": "pipe-cutting-plan",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "stock, lengths -> plan",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0570",
    "name": "Plank Cut Optimiser",
    "slug": "plank-cut-plan",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "boards, parts -> plan",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0571",
    "name": "Coil Slitting Plan",
    "slug": "coil-slitting-plan",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "coil width, slits -> plan",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0572",
    "name": "Sheet Count from Area",
    "slug": "sheet-count-from-area",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "area, sheet size, waste -> sheets",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0573",
    "name": "Offcut Inventory Value",
    "slug": "offcut-value",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "offcuts, price -> value",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0574",
    "name": "Cutting Yield Percentage",
    "slug": "cutting-yield",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "used, purchased -> yield%",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0575",
    "name": "Number of Cuts Required",
    "slug": "cuts-required",
    "category": "C33",
    "categoryLabel": "Cutting Stock, Nesting and Optimisation",
    "inputsOutputs": "pieces, stock -> cuts, time",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cutting-stock-1d",
      "sheet-nesting-2d",
      "cut-list-waste",
      "kerf-compensation"
    ]
  },
  {
    "id": "CALC-0576",
    "name": "Glass Weight",
    "slug": "glass-weight",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "area, thickness, density -> kg",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield",
      "glass-cutting-optimiser"
    ]
  },
  {
    "id": "CALC-0577",
    "name": "Glass Area and Cost",
    "slug": "glass-area-cost",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "dimensions, rate -> area, price",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-thickness-selection",
      "glass-cutting-yield",
      "glass-cutting-optimiser"
    ]
  },
  {
    "id": "CALC-0578",
    "name": "Glass Thickness Selection",
    "slug": "glass-thickness-selection",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "area, wind load -> nominal",
    "complexity": "Specialist",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASTM E1300 / EN 16612 licensed; requires engineer sign-off.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-cutting-yield",
      "glass-cutting-optimiser"
    ]
  },
  {
    "id": "CALC-0579",
    "name": "Glass Cutting Yield",
    "slug": "glass-cutting-yield",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "sheet, pieces -> yield%",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-optimiser"
    ]
  },
  {
    "id": "CALC-0580",
    "name": "Glass Cutting Optimiser",
    "slug": "glass-cutting-optimiser",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "sheet sizes, pieces -> plan",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0581",
    "name": "Mirror Size and Cost",
    "slug": "mirror-size-cost",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "dimensions, edgework -> price",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0582",
    "name": "IGU U-Value",
    "slug": "igu-u-value",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "pane U, gap, gas -> centre U",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0583",
    "name": "Glass Deflection Check",
    "slug": "glass-deflection",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "thickness, span, load -> deflection",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASTM E1300 procedure; licensed standard.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0584",
    "name": "Glazing Wind Load",
    "slug": "glazing-wind-load",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "velocity, height, exposure -> pressure",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASCE 7 / EN 1991-1-4 coefficients required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0585",
    "name": "Glass Edgework Cost",
    "slug": "glass-edgework-cost",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "perimeter, finish -> cost",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0586",
    "name": "Glass Offcut Value",
    "slug": "glass-offcut-value",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "offcuts, rate -> value",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0587",
    "name": "Shower Panel Sizing",
    "slug": "shower-panel-size",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "opening, clearance -> panel dims",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0588",
    "name": "Glass Balustrade Load",
    "slug": "glass-balustrade-load",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "height, line load -> moment",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires structural engineer; code line loads vary.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0589",
    "name": "Laminated vs Tempered Cost",
    "slug": "laminated-vs-tempered",
    "category": "C34",
    "categoryLabel": "Glass Manufacturing and Glazing",
    "inputsOutputs": "area, options -> cost, properties",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "glass-weight",
      "glass-area-cost",
      "glass-thickness-selection",
      "glass-cutting-yield"
    ]
  },
  {
    "id": "CALC-0590",
    "name": "Board Feet",
    "slug": "board-feet",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "thickness, width, length, qty -> bf",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size",
      "wood-shrinkage"
    ]
  },
  {
    "id": "CALC-0591",
    "name": "Lumber Weight",
    "slug": "lumber-weight",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "volume, species density, MC -> kg",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "plywood-sheets",
      "timber-beam-size",
      "wood-shrinkage"
    ]
  },
  {
    "id": "CALC-0592",
    "name": "Plywood Sheet Count",
    "slug": "plywood-sheets",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "area, sheet, waste -> sheets",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "timber-beam-size",
      "wood-shrinkage"
    ]
  },
  {
    "id": "CALC-0593",
    "name": "Timber Beam Size",
    "slug": "timber-beam-size",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "span, load -> section (table)",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires span tables (IRC/EN); not a formula.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "wood-shrinkage"
    ]
  },
  {
    "id": "CALC-0594",
    "name": "Wood Moisture Shrinkage",
    "slug": "wood-shrinkage",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "MC change, dimension -> \u0394dim",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0595",
    "name": "Decking Board Count",
    "slug": "decking-boards",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "deck area, board, gap -> boards",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0596",
    "name": "Fence Picket Count",
    "slug": "fence-pickets",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "run, picket, gap -> pickets, rails",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0597",
    "name": "Screw and Nail Quantity",
    "slug": "screw-nail-quantity",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "area, spacing -> fasteners",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0598",
    "name": "Stain and Finish Coverage",
    "slug": "stain-coverage",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "area, coats, coverage -> litres",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0599",
    "name": "Cabinet Cut List",
    "slug": "cabinet-cut-list",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "carcass dims -> parts list",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0600",
    "name": "Lumber Cost per Board Foot",
    "slug": "lumber-cost-boardfoot",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "price, dims -> cost",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0601",
    "name": "Wood Glue Coverage",
    "slug": "glue-coverage",
    "category": "C35",
    "categoryLabel": "Woodworking, Joinery and Timber",
    "inputsOutputs": "joint area -> grams",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "board-feet",
      "lumber-weight",
      "plywood-sheets",
      "timber-beam-size"
    ]
  },
  {
    "id": "CALC-0602",
    "name": "Steel Plate Weight",
    "slug": "steel-plate-weight",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "L, W, t, \u03c1 -> kg",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance",
      "bend-deduction"
    ]
  },
  {
    "id": "CALC-0603",
    "name": "Pipe Weight",
    "slug": "pipe-weight",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "OD, wall, length -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "sheet-metal-weight",
      "bend-allowance",
      "bend-deduction"
    ]
  },
  {
    "id": "CALC-0604",
    "name": "Sheet Metal Weight",
    "slug": "sheet-metal-weight",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "gauge, dims, \u03c1 -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "bend-allowance",
      "bend-deduction"
    ]
  },
  {
    "id": "CALC-0605",
    "name": "Bend Allowance",
    "slug": "bend-allowance",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "angle, R, T, K -> BA",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-deduction"
    ]
  },
  {
    "id": "CALC-0606",
    "name": "Bend Deduction",
    "slug": "bend-deduction",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "angle, R, T, K -> BD",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0607",
    "name": "Flat Pattern Development",
    "slug": "flat-pattern",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "bends, dims -> flat length",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0608",
    "name": "Weld Consumable Quantity",
    "slug": "weld-consumable",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "joint, length, efficiency -> kg",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0609",
    "name": "Weld Heat Input",
    "slug": "weld-heat-input",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "V, I, travel speed -> kJ/mm",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0610",
    "name": "Cutting Speed (RPM)",
    "slug": "cutting-speed-rpm",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "Vc, diameter -> rpm",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0611",
    "name": "Machining Time",
    "slug": "machining-time",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "length, feed, passes -> minutes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0612",
    "name": "Drilling Time",
    "slug": "drilling-time",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "depth, feed, rpm -> minutes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0613",
    "name": "Metal Cost Estimate",
    "slug": "metal-cost",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "mass, rate, waste -> cost",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0614",
    "name": "Hardness Conversion",
    "slug": "hardness-conversion",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "HRC/HV/HB -> equivalent",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ASTM E140 tables are licensed; conversions are empirical.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0615",
    "name": "Press Tonnage",
    "slug": "press-tonnage",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "perimeter, thickness, shear -> tons",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0616",
    "name": "Springback Estimate",
    "slug": "springback",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "R/T, material -> angle",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0617",
    "name": "Galvanising Zinc Weight",
    "slug": "galvanizing-zinc",
    "category": "C36",
    "categoryLabel": "Metal Fabrication and Machining",
    "inputsOutputs": "area, coating class -> kg",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "steel-plate-weight",
      "pipe-weight",
      "sheet-metal-weight",
      "bend-allowance"
    ]
  },
  {
    "id": "CALC-0618",
    "name": "Fabric GSM",
    "slug": "fabric-gsm",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "mass, area -> GSM, oz/yd\u00b2",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment",
      "marker-efficiency"
    ]
  },
  {
    "id": "CALC-0619",
    "name": "Yarn Count Conversion",
    "slug": "yarn-count-conversion",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "Ne/Nm/tex/denier -> all",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "fabric-gsm",
      "fabric-weight",
      "fabric-consumption-garment",
      "marker-efficiency"
    ]
  },
  {
    "id": "CALC-0620",
    "name": "Fabric Weight for Garment",
    "slug": "fabric-weight",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "consumption, GSM -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-consumption-garment",
      "marker-efficiency"
    ]
  },
  {
    "id": "CALC-0621",
    "name": "Fabric Consumption per Garment",
    "slug": "fabric-consumption-garment",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "pattern, width, waste -> metres",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "marker-efficiency"
    ]
  },
  {
    "id": "CALC-0622",
    "name": "Marker Efficiency",
    "slug": "marker-efficiency",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "garment area, marker -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0623",
    "name": "Thread Consumption",
    "slug": "thread-consumption",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "seam length, stitch -> metres",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0624",
    "name": "Stitch Density",
    "slug": "stitch-density",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "stitches, length -> SPI",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0625",
    "name": "Fabric Shrinkage",
    "slug": "fabric-shrinkage",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "before, after -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0626",
    "name": "Roll to Metres",
    "slug": "roll-to-metres",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "roll weight, GSM, width -> metres",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0627",
    "name": "Fabric Cost per Garment",
    "slug": "fabric-cost-garment",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "consumption, rate -> cost",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0628",
    "name": "Textile Cutting Waste",
    "slug": "cutting-waste-textile",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "used, issued -> waste%",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0629",
    "name": "Embroidery Stitch Count and Time",
    "slug": "embroidery-stitches",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "design, speed -> stitches, time",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0630",
    "name": "GSM to Ounces",
    "slug": "gsm-to-oz",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "GSM -> oz/yd\u00b2",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0631",
    "name": "Fabric Width Conversion",
    "slug": "fabric-width-conversion",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "width, tube/open -> usable",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0632",
    "name": "Garment Costing",
    "slug": "garment-costing",
    "category": "C37",
    "categoryLabel": "Textile, Fabric and Garment Production",
    "inputsOutputs": "fabric, trim, labour -> FOB cost",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fabric-gsm",
      "yarn-count-conversion",
      "fabric-weight",
      "fabric-consumption-garment"
    ]
  },
  {
    "id": "CALC-0633",
    "name": "Box Volume",
    "slug": "box-volume",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "internal dims -> volume, board area",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count",
      "void-fill"
    ]
  },
  {
    "id": "CALC-0634",
    "name": "Corrugated Board Weight",
    "slug": "corrugated-weight",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "area, gsm -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "box-blank-size",
      "carton-pallet-count",
      "void-fill"
    ]
  },
  {
    "id": "CALC-0635",
    "name": "Box Blank Size",
    "slug": "box-blank-size",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "dims, style -> blank, board",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "carton-pallet-count",
      "void-fill"
    ]
  },
  {
    "id": "CALC-0636",
    "name": "Cartons per Pallet",
    "slug": "carton-pallet-count",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "pallet, carton, pattern -> count",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "void-fill"
    ]
  },
  {
    "id": "CALC-0637",
    "name": "Void Fill Requirement",
    "slug": "void-fill",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "box, contents -> fill volume",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0638",
    "name": "Shrink Film Size",
    "slug": "shrink-film",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "bundle dims -> film width",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0639",
    "name": "Label Count per Roll",
    "slug": "label-count",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "roll length, label pitch -> labels",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0640",
    "name": "Print Imposition",
    "slug": "print-imposition",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "sheet, trim, quantity -> sheets",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0641",
    "name": "Paper Ream Weight",
    "slug": "paper-ream-weight",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "gsm, size, sheets -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0642",
    "name": "Ink Coverage Cost",
    "slug": "ink-coverage",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "area, coverage%, rate -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0643",
    "name": "Print Cost per Page",
    "slug": "print-cost-page",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "cartridge, yield, coverage -> cost",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0644",
    "name": "Bleed and Trim Size",
    "slug": "bleed-trim",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "trim size, bleed -> document size",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0645",
    "name": "Booklet Creep",
    "slug": "booklet-creep",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "pages, paper thickness -> creep",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0646",
    "name": "Packaging Cost per Unit",
    "slug": "packaging-cost",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "materials, labour -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0647",
    "name": "Cushioning Thickness",
    "slug": "cushioning-thickness",
    "category": "C38",
    "categoryLabel": "Packaging and Printing",
    "inputsOutputs": "drop height, fragility -> thickness",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "box-volume",
      "corrugated-weight",
      "box-blank-size",
      "carton-pallet-count"
    ]
  },
  {
    "id": "CALC-0648",
    "name": "Economic Order Quantity",
    "slug": "eoq",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "demand, order cost, holding -> Q*",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "reorder-point",
      "safety-stock",
      "days-of-inventory",
      "abc-analysis"
    ]
  },
  {
    "id": "CALC-0649",
    "name": "Reorder Point",
    "slug": "reorder-point",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "demand, lead time, safety -> ROP",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "safety-stock",
      "days-of-inventory",
      "abc-analysis"
    ]
  },
  {
    "id": "CALC-0650",
    "name": "Safety Stock",
    "slug": "safety-stock",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "service level, \u03c3, lead time -> SS",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "days-of-inventory",
      "abc-analysis"
    ]
  },
  {
    "id": "CALC-0651",
    "name": "Days of Inventory",
    "slug": "days-of-inventory",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "COGS, inventory -> days",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "abc-analysis"
    ]
  },
  {
    "id": "CALC-0652",
    "name": "ABC Analysis",
    "slug": "abc-analysis",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "items, values -> A/B/C classes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0653",
    "name": "Stockout Probability",
    "slug": "stockout-probability",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "SS, \u03c3, LT -> probability",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0654",
    "name": "Cycle Count Sample Size",
    "slug": "cycle-count-sample",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "population, confidence -> sample",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0655",
    "name": "Min-Max Levels",
    "slug": "min-max-levels",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "demand, lead time -> min, max",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0656",
    "name": "EOQ with Quantity Discount",
    "slug": "eoq-quantity-discount",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "price breaks -> optimal Q",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0657",
    "name": "Carrying Cost",
    "slug": "carrying-cost",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "inventory value, rate -> annual cost",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0658",
    "name": "Dead Stock Value",
    "slug": "dead-stock-value",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "items, age, price -> write-down",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0659",
    "name": "Inventory Valuation",
    "slug": "inventory-valuation",
    "category": "C39",
    "categoryLabel": "Inventory and Stock Control",
    "inputsOutputs": "units, method (FIFO/avg) -> value",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "eoq",
      "reorder-point",
      "safety-stock",
      "days-of-inventory"
    ]
  },
  {
    "id": "CALC-0660",
    "name": "Lead Time Calculator",
    "slug": "lead-time",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "process steps -> total lead time",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fill-rate",
      "perfect-order-rate",
      "otif",
      "supplier-scorecard"
    ]
  },
  {
    "id": "CALC-0661",
    "name": "Fill Rate",
    "slug": "fill-rate",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "shipped, ordered -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "perfect-order-rate",
      "otif",
      "supplier-scorecard"
    ]
  },
  {
    "id": "CALC-0662",
    "name": "Perfect Order Rate",
    "slug": "perfect-order-rate",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "orders, defects -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "otif",
      "supplier-scorecard"
    ]
  },
  {
    "id": "CALC-0663",
    "name": "OTIF",
    "slug": "otif",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "on-time, in-full -> OTIF%",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "supplier-scorecard"
    ]
  },
  {
    "id": "CALC-0664",
    "name": "Supplier Scorecard",
    "slug": "supplier-scorecard",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "weighted metrics -> score",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0665",
    "name": "Total Cost of Ownership",
    "slug": "total-cost-of-ownership",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "price, logistics, quality -> TCO",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0666",
    "name": "Logistics Cost per Unit",
    "slug": "logistics-cost-unit",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "costs, units -> per unit",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0667",
    "name": "Warehouse Capacity",
    "slug": "warehouse-capacity",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "volume, racking -> pallet positions",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0668",
    "name": "Freight Cost Allocation",
    "slug": "freight-cost-allocation",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "shipments, weight -> allocation",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0669",
    "name": "Demand Forecast Error",
    "slug": "forecast-error",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "actual, forecast -> MAE, MAPE",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0670",
    "name": "Safety Stock with Lead-Time Variability",
    "slug": "safety-lead-time",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "\u03c3_LT, demand -> SS",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0671",
    "name": "Reverse Logistics Cost",
    "slug": "reverse-logistics-cost",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "returns, handling -> cost",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0672",
    "name": "Shelf Life and Expiry",
    "slug": "shelf-life",
    "category": "C40",
    "categoryLabel": "Supply Chain and Logistics",
    "inputsOutputs": "production, shelf life -> expiry",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "lead-time",
      "fill-rate",
      "perfect-order-rate",
      "otif"
    ]
  },
  {
    "id": "CALC-0673",
    "name": "Dimensional Weight",
    "slug": "dimensional-weight",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "dims, divisor -> dim weight",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate",
      "pallet-loading"
    ]
  },
  {
    "id": "CALC-0674",
    "name": "Chargeable Weight (Air)",
    "slug": "chargeable-weight-air",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "gross, volume -> chargeable",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "container-capacity",
      "container-fill-rate",
      "pallet-loading"
    ]
  },
  {
    "id": "CALC-0675",
    "name": "Container Capacity",
    "slug": "container-capacity",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "container type, cargo -> volume, payload",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-fill-rate",
      "pallet-loading"
    ]
  },
  {
    "id": "CALC-0676",
    "name": "Container Fill Rate",
    "slug": "container-fill-rate",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "cargo volume, container -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "pallet-loading"
    ]
  },
  {
    "id": "CALC-0677",
    "name": "Pallet Loading",
    "slug": "pallet-loading",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "carton, pallet, pattern -> cartons",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0678",
    "name": "Pallet Count for Shipment",
    "slug": "pallet-count",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "units, per pallet -> pallets",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0679",
    "name": "LCL Freight Cost",
    "slug": "lcl-freight-cost",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "volume/weight, rate -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0680",
    "name": "Shipping Cost per Unit",
    "slug": "shipping-cost-unit",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "freight, units -> per unit",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0681",
    "name": "Freight Density",
    "slug": "freight-density",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "weight, volume -> kg/m\u00b3",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0682",
    "name": "Truck Load Plan",
    "slug": "truck-load-plan",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "pallets, truck -> utilisation",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0683",
    "name": "Demurrage and Detention",
    "slug": "demurrage-cost",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "days, rate -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0684",
    "name": "Last-Mile Cost per Delivery",
    "slug": "last-mile-cost",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "costs, stops -> per delivery",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0685",
    "name": "Return Shipping Cost",
    "slug": "returns-shipping-cost",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "returns, rate -> cost",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0686",
    "name": "Export Packing Cost",
    "slug": "export-packing-cost",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "materials, labour -> cost",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0687",
    "name": "Cargo Insurance Premium",
    "slug": "cargo-insurance",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "value, rate, route -> premium",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0688",
    "name": "TEU Conversion",
    "slug": "teu-conversion",
    "category": "C41",
    "categoryLabel": "Shipping, Freight and Container Loading",
    "inputsOutputs": "containers -> TEU/FEU",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "dimensional-weight",
      "chargeable-weight-air",
      "container-capacity",
      "container-fill-rate"
    ]
  },
  {
    "id": "CALC-0689",
    "name": "Fuel Cost for a Trip",
    "slug": "fuel-cost-trip",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "distance, consumption, price -> cost",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost",
      "ev-range"
    ]
  },
  {
    "id": "CALC-0690",
    "name": "MPG to L/100 km",
    "slug": "mpg-l100km",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "consumption -> other unit",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "ev-efficiency",
      "ev-charging-cost",
      "ev-range"
    ]
  },
  {
    "id": "CALC-0691",
    "name": "EV Efficiency",
    "slug": "ev-efficiency",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "kWh, distance -> kWh/100 km",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-charging-cost",
      "ev-range"
    ]
  },
  {
    "id": "CALC-0692",
    "name": "EV Charging Cost",
    "slug": "ev-charging-cost",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "kWh, tariff, losses -> cost",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-range"
    ]
  },
  {
    "id": "CALC-0693",
    "name": "EV Range Estimate",
    "slug": "ev-range",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "battery kWh, consumption -> range",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0694",
    "name": "Tire Size Conversion",
    "slug": "tire-size-conversion",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "size code -> diameter, width",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0695",
    "name": "Wheel Offset and Backspace",
    "slug": "wheel-offset",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "width, offset -> backspace",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0696",
    "name": "Speed from Gear Ratio",
    "slug": "speed-gear-ratio",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "rpm, ratios, tire -> speed",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0697",
    "name": "Engine Displacement",
    "slug": "engine-displacement",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "bore, stroke, cylinders -> cc",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0698",
    "name": "Engine Compression Ratio",
    "slug": "engine-compression-ratio",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "swept, clearance volume -> CR",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0699",
    "name": "Horsepower and Torque Conversion",
    "slug": "hp-torque-conversion",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "hp <-> kW <-> torque",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0700",
    "name": "Vehicle Depreciation",
    "slug": "vehicle-depreciation",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "price, years, rate -> value",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0701",
    "name": "Cost per Mile",
    "slug": "cost-per-mile",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "costs, distance -> per mile",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0702",
    "name": "Idling Fuel Consumption",
    "slug": "idling-fuel",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "idle hours, rate -> fuel, cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0703",
    "name": "Payload Capacity",
    "slug": "payload-capacity",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "GVWR, curb, occupants -> payload",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0704",
    "name": "Towing Load Check",
    "slug": "towing-load",
    "category": "C42",
    "categoryLabel": "Automotive and Vehicle Operation",
    "inputsOutputs": "trailer, cargo, limits -> margin",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fuel-cost-trip",
      "mpg-l100km",
      "ev-efficiency",
      "ev-charging-cost"
    ]
  },
  {
    "id": "CALC-0705",
    "name": "Density Altitude",
    "slug": "density-altitude",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "elevation, QNH, temp -> DA",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pressure-altitude",
      "true-airspeed",
      "mach-number",
      "wind-triangle"
    ]
  },
  {
    "id": "CALC-0706",
    "name": "Pressure Altitude",
    "slug": "pressure-altitude",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "elevation, QNH -> PA",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "true-airspeed",
      "mach-number",
      "wind-triangle"
    ]
  },
  {
    "id": "CALC-0707",
    "name": "True Airspeed",
    "slug": "true-airspeed",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "IAS, altitude, temp -> TAS",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "mach-number",
      "wind-triangle"
    ]
  },
  {
    "id": "CALC-0708",
    "name": "Mach Number",
    "slug": "mach-number",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "TAS, temperature -> Mach",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "wind-triangle"
    ]
  },
  {
    "id": "CALC-0709",
    "name": "Wind Triangle",
    "slug": "wind-triangle",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "course, TAS, wind -> GS, drift",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0710",
    "name": "Fuel Endurance",
    "slug": "fuel-endurance",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "fuel, burn rate -> endurance, range",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0711",
    "name": "Crosswind Component",
    "slug": "crosswind-component",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "wind, runway -> crosswind",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0712",
    "name": "Weight and Balance CG",
    "slug": "weight-balance-cg",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "weights, arms -> CG",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0713",
    "name": "Climb Gradient",
    "slug": "climb-gradient",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "altitude gain, distance -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0714",
    "name": "Descent Rate",
    "slug": "descent-rate",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "altitude, ground speed, angle -> fpm",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0715",
    "name": "Flight Time",
    "slug": "flight-time",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "distance, GS -> time",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0716",
    "name": "Takeoff Distance Estimate",
    "slug": "takeoff-distance",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "weight, DA, wind -> distance",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "AFM/POH data required; must not be generated.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0717",
    "name": "QNH and QFE Conversion",
    "slug": "qnh-qfe",
    "category": "C43",
    "categoryLabel": "Aviation and Flight Planning",
    "inputsOutputs": "pressure, elevation -> values",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "density-altitude",
      "pressure-altitude",
      "true-airspeed",
      "mach-number"
    ]
  },
  {
    "id": "CALC-0718",
    "name": "Displacement",
    "slug": "displacement",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "L, B, T, Cb -> tonnes",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip",
      "marine-fuel-consumption"
    ]
  },
  {
    "id": "CALC-0719",
    "name": "Deadweight Tonnage",
    "slug": "deadweight-tonnage",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "loaded, light displacement -> DWT",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "hull-speed",
      "propeller-slip",
      "marine-fuel-consumption"
    ]
  },
  {
    "id": "CALC-0720",
    "name": "Hull Speed",
    "slug": "hull-speed",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "waterline length -> knots",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "propeller-slip",
      "marine-fuel-consumption"
    ]
  },
  {
    "id": "CALC-0721",
    "name": "Propeller Slip",
    "slug": "propeller-slip",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "pitch, rpm, speed -> slip%",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "marine-fuel-consumption"
    ]
  },
  {
    "id": "CALC-0722",
    "name": "Marine Fuel Consumption",
    "slug": "marine-fuel-consumption",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "power, SFOC, hours -> litres",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0723",
    "name": "Metacentric Height",
    "slug": "gm-stability",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "KM, KG, FSC -> GM",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires hydrostatic tables from the vessel.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0724",
    "name": "Anchor Scope",
    "slug": "anchor-scope",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "depth, ratio -> rode length",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0725",
    "name": "Draft Change with Cargo",
    "slug": "draft-change-cargo",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "weight, TPC -> change",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Hydrostatic table interpolation required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0726",
    "name": "Bilge Pump Time",
    "slug": "bilge-pump-time",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "volume, pump rate -> time",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0727",
    "name": "Tide Window",
    "slug": "tide-window",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "depth, tide curve -> window",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0728",
    "name": "Distance, Speed and Time at Sea",
    "slug": "maritime-distance-time",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "any 2 -> third",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0729",
    "name": "Ballast Water Volume",
    "slug": "ballast-water",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "tanks, trim -> volume",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0730",
    "name": "Container Vessel Utilisation",
    "slug": "vessel-utilisation",
    "category": "C44",
    "categoryLabel": "Marine and Maritime Calculations",
    "inputsOutputs": "slots, TEU -> %",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "displacement",
      "deadweight-tonnage",
      "hull-speed",
      "propeller-slip"
    ]
  },
  {
    "id": "CALC-0731",
    "name": "Projectile Motion",
    "slug": "projectile-motion",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "v, angle -> range, apex, time",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy",
      "work-energy"
    ]
  },
  {
    "id": "CALC-0732",
    "name": "Momentum and Impulse",
    "slug": "momentum-impulse",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "mass, velocity, time -> p, J",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "kinetic-energy",
      "potential-energy",
      "work-energy"
    ]
  },
  {
    "id": "CALC-0733",
    "name": "Kinetic Energy",
    "slug": "kinetic-energy",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "mass, velocity -> KE",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "potential-energy",
      "work-energy"
    ]
  },
  {
    "id": "CALC-0734",
    "name": "Potential Energy",
    "slug": "potential-energy",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "mass, height -> PE",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "work-energy"
    ]
  },
  {
    "id": "CALC-0735",
    "name": "Work and Power",
    "slug": "work-energy",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "force, distance, time -> W, P",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0736",
    "name": "Circular Motion",
    "slug": "circular-motion",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "v, r, m -> a_c, F_c",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0737",
    "name": "Gravitational Force",
    "slug": "gravitation",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "masses, distance -> F, g",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0738",
    "name": "Simple Harmonic Motion",
    "slug": "shm-spring",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "k, m, amplitude -> T, f, v_max",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0739",
    "name": "Pendulum Period",
    "slug": "pendulum-period",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "length, g -> T",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0740",
    "name": "Wave Speed",
    "slug": "wave-speed",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "frequency, wavelength -> v",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0741",
    "name": "Doppler Effect",
    "slug": "doppler-effect",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "source/observer speeds -> f'",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0742",
    "name": "Snell's Law Refraction",
    "slug": "snell-refraction",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "n1, \u03b81, n2 -> \u03b82, critical",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0743",
    "name": "Time Dilation",
    "slug": "time-dilation",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "velocity -> \u03b3, \u0394t'",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0744",
    "name": "Photon Energy",
    "slug": "photon-energy",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "wavelength -> E",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0745",
    "name": "de Broglie Wavelength",
    "slug": "de-broglie-wavelength",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "mass, velocity -> \u03bb",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0746",
    "name": "Radioactive Decay",
    "slug": "radioactive-decay",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "half-life, time -> remaining",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0747",
    "name": "Density and Specific Gravity",
    "slug": "density-specific-gravity",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "mass, volume -> \u03c1, SG",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0748",
    "name": "Pressure at Depth",
    "slug": "pressure-depth",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "depth, \u03c1 -> p",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0749",
    "name": "Spring Constant",
    "slug": "spring-constant",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "force, extension -> k",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0750",
    "name": "Coefficient of Restitution",
    "slug": "restitution",
    "category": "C45",
    "categoryLabel": "Physics and Mechanics",
    "inputsOutputs": "velocities -> e",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "projectile-motion",
      "momentum-impulse",
      "kinetic-energy",
      "potential-energy"
    ]
  },
  {
    "id": "CALC-0751",
    "name": "Molarity",
    "slug": "molarity",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "moles, volume -> M",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molality",
      "dilution-c1v1",
      "mass-percent",
      "ppm-ppb"
    ]
  },
  {
    "id": "CALC-0752",
    "name": "Molality",
    "slug": "molality",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "moles, solvent mass -> m",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "dilution-c1v1",
      "mass-percent",
      "ppm-ppb"
    ]
  },
  {
    "id": "CALC-0753",
    "name": "Dilution (C1V1)",
    "slug": "dilution-c1v1",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "C1, V1, C2 -> V2",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "mass-percent",
      "ppm-ppb"
    ]
  },
  {
    "id": "CALC-0754",
    "name": "Mass Percent",
    "slug": "mass-percent",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "solute, solution -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "ppm-ppb"
    ]
  },
  {
    "id": "CALC-0755",
    "name": "ppm and ppb",
    "slug": "ppm-ppb",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "mass ratio -> ppm/ppb",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0756",
    "name": "Normality",
    "slug": "normality",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "molarity, equivalents -> N",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0757",
    "name": "pH of Strong Acid",
    "slug": "ph-strong-acid",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "concentration -> pH",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0758",
    "name": "pH of Weak Acid",
    "slug": "ph-weak-acid",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "Ka, C -> pH",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0759",
    "name": "Buffer pH (Henderson-Hasselbalch)",
    "slug": "buffer-henderson",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "pKa, ratio -> pH",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0760",
    "name": "Titration Calculation",
    "slug": "titration-calculation",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "C, V, stoichiometry -> unknown",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0761",
    "name": "Stoichiometry",
    "slug": "stoichiometry",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "equation, amounts -> product mass",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0762",
    "name": "Limiting Reagent",
    "slug": "limiting-reagent",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "reactant amounts -> limiting, excess",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0763",
    "name": "Theoretical Yield",
    "slug": "theoretical-yield",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "actual, theoretical -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0764",
    "name": "Molar Mass",
    "slug": "molar-mass",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "formula -> g/mol",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0765",
    "name": "Mole Conversion",
    "slug": "mole-conversion",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "mass, moles, particles -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0766",
    "name": "Combined Gas Law",
    "slug": "combined-gas-law",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "P,V,T states -> unknown",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0767",
    "name": "Equilibrium Constant",
    "slug": "equilibrium-constant",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "concentrations -> Kc, Kp",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0768",
    "name": "Reaction Half-Life",
    "slug": "half-life-reaction",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "order, k -> t\u00bd",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0769",
    "name": "Arrhenius Rate",
    "slug": "arrhenius-rate",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "Ea, T -> k ratio",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0770",
    "name": "Empirical Formula",
    "slug": "empirical-formula",
    "category": "C46",
    "categoryLabel": "Chemistry and Laboratory Methods",
    "inputsOutputs": "mass % -> formula",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "molarity",
      "molality",
      "dilution-c1v1",
      "mass-percent"
    ]
  },
  {
    "id": "CALC-0771",
    "name": "Exponential Population Growth",
    "slug": "population-growth",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "N0, r, t -> N",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio",
      "cell-doubling-time"
    ]
  },
  {
    "id": "CALC-0772",
    "name": "Logistic Growth",
    "slug": "logistic-growth",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "N0, r, K, t -> N",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "hardy-weinberg",
      "punnett-ratio",
      "cell-doubling-time"
    ]
  },
  {
    "id": "CALC-0773",
    "name": "Hardy-Weinberg Equilibrium",
    "slug": "hardy-weinberg",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "allele freq -> genotype freq",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "punnett-ratio",
      "cell-doubling-time"
    ]
  },
  {
    "id": "CALC-0774",
    "name": "Punnett Ratio",
    "slug": "punnett-ratio",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "cross -> phenotype ratio",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "cell-doubling-time"
    ]
  },
  {
    "id": "CALC-0775",
    "name": "Cell Doubling Time",
    "slug": "cell-doubling-time",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "counts, time -> t_d",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0776",
    "name": "Bacterial Growth",
    "slug": "bacterial-growth",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "lag, \u03bc, time -> CFU",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0777",
    "name": "DNA Concentration",
    "slug": "dna-concentration",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "A260, dilution -> ng/\u00b5L",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0778",
    "name": "Protein Molecular Weight",
    "slug": "protein-molecular-weight",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "sequence -> kDa",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0779",
    "name": "Michaelis-Menten Kinetics",
    "slug": "enzyme-kinetics-mm",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "Vmax, Km, S -> v",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0780",
    "name": "Serial Dilution",
    "slug": "dilution-series",
    "category": "C47",
    "categoryLabel": "Biology and Life Sciences",
    "inputsOutputs": "stock, factor, steps -> concentrations",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "population-growth",
      "logistic-growth",
      "hardy-weinberg",
      "punnett-ratio"
    ]
  },
  {
    "id": "CALC-0781",
    "name": "Electricity CO2 Emissions",
    "slug": "co2-electricity",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "kWh, grid factor -> kg CO2e",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset",
      "water-footprint"
    ]
  },
  {
    "id": "CALC-0782",
    "name": "Vehicle CO2 per km",
    "slug": "co2-per-km",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "fuel, distance -> g CO2/km",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-litre-fuel",
      "tree-offset",
      "water-footprint"
    ]
  },
  {
    "id": "CALC-0783",
    "name": "CO2 per Litre of Fuel",
    "slug": "co2-per-litre-fuel",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "fuel type, litres -> kg CO2",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "tree-offset",
      "water-footprint"
    ]
  },
  {
    "id": "CALC-0784",
    "name": "Tree Offset Equivalent",
    "slug": "tree-offset",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "CO2, sequestration rate -> trees",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "water-footprint"
    ]
  },
  {
    "id": "CALC-0785",
    "name": "Water Footprint",
    "slug": "water-footprint",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "use items -> litres",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0786",
    "name": "Waste Diversion Rate",
    "slug": "waste-diversion-rate",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "diverted, total -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0787",
    "name": "Recycling Rate",
    "slug": "recycling-rate",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "recycled, generated -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0788",
    "name": "Emission Factor Application",
    "slug": "emission-factor",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "activity, factor -> emissions",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0789",
    "name": "AQI Category",
    "slug": "aqi-category",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "concentration -> AQI, category",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0790",
    "name": "Carbon Credit Equivalent",
    "slug": "carbon-credit",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "emissions -> credits",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0791",
    "name": "Energy Intensity",
    "slug": "energy-intensity",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "energy, output -> intensity",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0792",
    "name": "GWP Conversion",
    "slug": "gwp-conversion",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "gas mass, GWP -> CO2e",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0793",
    "name": "Compost Carbon-Nitrogen Ratio",
    "slug": "compost-cn-ratio",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "inputs -> C:N",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0794",
    "name": "Scope 1-2-3 Emissions Summary",
    "slug": "scope-emissions",
    "category": "C48",
    "categoryLabel": "Environmental Science and Emissions",
    "inputsOutputs": "activities -> scopes",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "co2-electricity",
      "co2-per-km",
      "co2-per-litre-fuel",
      "tree-offset"
    ]
  },
  {
    "id": "CALC-0795",
    "name": "PV System Size",
    "slug": "pv-system-size",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "demand, irradiance, PR -> kWp",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing",
      "pv-payback"
    ]
  },
  {
    "id": "CALC-0796",
    "name": "PV Daily Energy Yield",
    "slug": "pv-daily-yield",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "kWp, irradiance, PR -> kWh",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "panel-count",
      "inverter-sizing",
      "pv-payback"
    ]
  },
  {
    "id": "CALC-0797",
    "name": "Panel Count",
    "slug": "panel-count",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "kWp, panel wattage -> panels, area",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "inverter-sizing",
      "pv-payback"
    ]
  },
  {
    "id": "CALC-0798",
    "name": "Inverter Sizing",
    "slug": "inverter-sizing",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "array kWp, DC:AC -> inverter",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "pv-payback"
    ]
  },
  {
    "id": "CALC-0799",
    "name": "Solar Payback Period",
    "slug": "pv-payback",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "capex, savings -> years",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0800",
    "name": "Solar ROI",
    "slug": "pv-roi",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "capex, cash flows -> ROI",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0801",
    "name": "Optimal Tilt Estimate",
    "slug": "tilt-angle",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "latitude, season -> tilt",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Rule-of-thumb methods only; must be labelled approximate.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0802",
    "name": "Irradiance to kWh",
    "slug": "irradiance-to-kwh",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "area, irradiance, efficiency -> kWh",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0803",
    "name": "String Voltage",
    "slug": "string-voltage",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "Voc, count, temperature -> V range",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0804",
    "name": "PV Cable Sizing",
    "slug": "pv-cable-sizing",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "current, length, drop -> mm\u00b2",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0805",
    "name": "Shading Loss",
    "slug": "shading-loss",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "shaded fraction, config -> loss%",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0806",
    "name": "Solar Row Pitch",
    "slug": "solar-row-spacing",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "tilt, latitude, height -> pitch",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0807",
    "name": "Solar Water Heating",
    "slug": "solar-water-heating",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "demand, collector -> area, saving",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0808",
    "name": "Net Metering Savings",
    "slug": "net-metering-savings",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "generation, consumption, tariff -> saving",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0809",
    "name": "Performance Ratio",
    "slug": "performance-ratio",
    "category": "C49",
    "categoryLabel": "Renewable Energy and Solar Systems",
    "inputsOutputs": "actual, expected -> PR",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pv-system-size",
      "pv-daily-yield",
      "panel-count",
      "inverter-sizing"
    ]
  },
  {
    "id": "CALC-0810",
    "name": "Battery Runtime",
    "slug": "battery-runtime",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "capacity, load, efficiency -> hours",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "ah-wh-conversion",
      "c-rate",
      "charge-time",
      "pack-series-parallel"
    ]
  },
  {
    "id": "CALC-0811",
    "name": "Ah to Wh Conversion",
    "slug": "ah-wh-conversion",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "Ah, voltage -> Wh",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "c-rate",
      "charge-time",
      "pack-series-parallel"
    ]
  },
  {
    "id": "CALC-0812",
    "name": "C-Rate",
    "slug": "c-rate",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "capacity, current -> C",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "charge-time",
      "pack-series-parallel"
    ]
  },
  {
    "id": "CALC-0813",
    "name": "Charge Time",
    "slug": "charge-time",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "capacity, current, efficiency -> hours",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "pack-series-parallel"
    ]
  },
  {
    "id": "CALC-0814",
    "name": "Series and Parallel Packs",
    "slug": "pack-series-parallel",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "cells, config -> V, Ah, Wh",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0815",
    "name": "Peukert Capacity",
    "slug": "peukert-capacity",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "C, I, k -> effective capacity",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0816",
    "name": "Depth of Discharge and Cycles",
    "slug": "dod-cycle-life",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "DoD, chemistry -> life",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0817",
    "name": "UPS Runtime",
    "slug": "ups-runtime",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "VA, load, battery -> minutes",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0818",
    "name": "State of Charge from Voltage",
    "slug": "soc-from-voltage",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "chemistry, V -> SoC",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Chemistry-specific OCV tables required.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0819",
    "name": "Battery Cost per kWh",
    "slug": "battery-cost-kwh",
    "category": "C50",
    "categoryLabel": "Batteries and Electrical Energy Storage",
    "inputsOutputs": "price, capacity -> $/kWh",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "battery-runtime",
      "ah-wh-conversion",
      "c-rate",
      "charge-time"
    ]
  },
  {
    "id": "CALC-0820",
    "name": "Julian Date",
    "slug": "julian-date",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "calendar date/time -> JD, MJD",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "moon-phase",
      "sunrise-sunset",
      "solar-position",
      "escape-velocity"
    ]
  },
  {
    "id": "CALC-0821",
    "name": "Moon Phase",
    "slug": "moon-phase",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "date -> phase, illumination",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "sunrise-sunset",
      "solar-position",
      "escape-velocity"
    ]
  },
  {
    "id": "CALC-0822",
    "name": "Sunrise and Sunset",
    "slug": "sunrise-sunset",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "date, lat, lon -> times",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "NOAA solar calculator algorithm; verify against gml.noaa.gov.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "solar-position",
      "escape-velocity"
    ]
  },
  {
    "id": "CALC-0823",
    "name": "Solar Position",
    "slug": "solar-position",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "date, time, lat, lon -> alt, az",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "escape-velocity"
    ]
  },
  {
    "id": "CALC-0824",
    "name": "Escape Velocity",
    "slug": "escape-velocity",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "mass, radius -> v_esc",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0825",
    "name": "Orbital Period (Kepler)",
    "slug": "orbital-period",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "semi-major axis, mass -> T",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0826",
    "name": "Hohmann Transfer",
    "slug": "hohmann-transfer",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "r1, r2 -> \u0394v, time",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0827",
    "name": "Apparent Magnitude",
    "slug": "star-magnitude",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "flux ratio -> \u0394m",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0828",
    "name": "Angular Size",
    "slug": "angular-size",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "diameter, distance -> angle",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0829",
    "name": "Redshift",
    "slug": "redshift",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "wavelengths -> z, velocity",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0830",
    "name": "Light-Year Distance",
    "slug": "light-year-distance",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "years -> metres, AU, pc",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0831",
    "name": "Sidereal Time",
    "slug": "sidereal-time",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "date, longitude -> LST",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0832",
    "name": "Satellite Look Angle",
    "slug": "satellite-look-angle",
    "category": "C51",
    "categoryLabel": "Astronomy and Orbital Mechanics",
    "inputsOutputs": "observer, satellite -> az, el, range",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "julian-date",
      "moon-phase",
      "sunrise-sunset",
      "solar-position"
    ]
  },
  {
    "id": "CALC-0833",
    "name": "Haversine Distance",
    "slug": "haversine-distance",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "lat/lon pair -> km",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area",
      "slope-gradient"
    ]
  },
  {
    "id": "CALC-0834",
    "name": "Initial Bearing",
    "slug": "initial-bearing",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "lat/lon pair -> bearing",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "latlong-midpoint",
      "coordinate-area",
      "slope-gradient"
    ]
  },
  {
    "id": "CALC-0835",
    "name": "Latitude Longitude Midpoint",
    "slug": "latlong-midpoint",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "2 points -> midpoint",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "coordinate-area",
      "slope-gradient"
    ]
  },
  {
    "id": "CALC-0836",
    "name": "Area from Coordinates",
    "slug": "coordinate-area",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "polygon vertices -> area",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "slope-gradient"
    ]
  },
  {
    "id": "CALC-0837",
    "name": "Slope and Gradient",
    "slug": "slope-gradient",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "rise, run -> %, ratio, degrees",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0838",
    "name": "Contour Interval",
    "slug": "contour-interval",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "scale, terrain -> interval",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0839",
    "name": "Traverse Closure",
    "slug": "traverse-closure",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "legs, bearings -> misclosure",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0840",
    "name": "Distance to Horizon",
    "slug": "distance-to-horizon",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "eye height -> km",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0841",
    "name": "Map Scale Conversion",
    "slug": "map-scale",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "scale, map distance -> ground",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0842",
    "name": "DMS to Decimal Degrees",
    "slug": "dms-decimal",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "d, m, s -> decimal",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0843",
    "name": "UTM Coordinate Conversion",
    "slug": "utm-conversion",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "lat/lon -> UTM",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0844",
    "name": "Timezone from Longitude",
    "slug": "timezone-from-longitude",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "longitude -> offset",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0845",
    "name": "Elevation Profile",
    "slug": "elevation-profile",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "points, elevations -> gain, grade",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0846",
    "name": "North Reference Conversion",
    "slug": "north-reference",
    "category": "C52",
    "categoryLabel": "Geography, Mapping and Surveying",
    "inputsOutputs": "true/magnetic/grid -> bearings",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "haversine-distance",
      "initial-bearing",
      "latlong-midpoint",
      "coordinate-area"
    ]
  },
  {
    "id": "CALC-0847",
    "name": "Wind Chill",
    "slug": "wind-chill",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp \u00b0F/\u00b0C, wind -> wind chill",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Formula, validity limits (T<=50F, V>3mph) and caveats verified on weather.gov.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-008",
        "title": "NOAA / National Weather Service \u2014 Understanding Wind Chill",
        "url": "https://www.weather.gov/safety/cold-wind-chill-chart",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "heat-index",
      "dew-point",
      "relative-humidity",
      "wet-bulb"
    ]
  },
  {
    "id": "CALC-0848",
    "name": "Heat Index",
    "slug": "heat-index",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, RH -> feels-like, category",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Rothfusz coefficients and +/-1.3F error and sun adjustment verified on weather.gov.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-009",
        "title": "NOAA / NWS Amarillo \u2014 What is the Heat Index? (Rothfusz Regression)",
        "url": "https://www.weather.gov/ama/heatindex",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "wind-chill",
      "dew-point",
      "relative-humidity",
      "wet-bulb"
    ]
  },
  {
    "id": "CALC-0849",
    "name": "Dew Point",
    "slug": "dew-point",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, RH -> dew point",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "relative-humidity",
      "wet-bulb"
    ]
  },
  {
    "id": "CALC-0850",
    "name": "Relative Humidity",
    "slug": "relative-humidity",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, dew point -> RH",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "wet-bulb"
    ]
  },
  {
    "id": "CALC-0851",
    "name": "Wet Bulb Temperature",
    "slug": "wet-bulb",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, RH, pressure -> Tw",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0852",
    "name": "Humidex",
    "slug": "humidex",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, dew point -> humidex",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0853",
    "name": "Cloud Base Height",
    "slug": "cloud-base",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "temp, dew point -> base",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0854",
    "name": "Rainfall Volume",
    "slug": "rainfall-volume",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "area, depth -> litres, m3",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0855",
    "name": "Snow Water Equivalent",
    "slug": "snow-water-equivalent",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "snow depth, density -> mm water",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0856",
    "name": "Wind Pressure on a Surface",
    "slug": "wind-load-pressure",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "speed, area, Cd -> force",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0857",
    "name": "Station Pressure from Altitude",
    "slug": "station-pressure",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "elevation, QNH -> pressure",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0858",
    "name": "Barometric Formula",
    "slug": "barometric-formula",
    "category": "C53",
    "categoryLabel": "Meteorology and Climate",
    "inputsOutputs": "altitude -> pressure",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "wind-chill",
      "heat-index",
      "dew-point",
      "relative-humidity"
    ]
  },
  {
    "id": "CALC-0859",
    "name": "Crop Yield",
    "slug": "crop-yield",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "area, production -> t/ha",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "seed-rate",
      "plant-population",
      "row-spacing",
      "growing-degree-days"
    ]
  },
  {
    "id": "CALC-0860",
    "name": "Seed Rate",
    "slug": "seed-rate",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "target plants, TGW, germination -> kg/ha",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "plant-population",
      "row-spacing",
      "growing-degree-days"
    ]
  },
  {
    "id": "CALC-0861",
    "name": "Plant Population",
    "slug": "plant-population",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "row, plant spacing -> plants/ha",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "row-spacing",
      "growing-degree-days"
    ]
  },
  {
    "id": "CALC-0862",
    "name": "Row Spacing and Plant Count",
    "slug": "row-spacing",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "bed width, rows -> spacing",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "growing-degree-days"
    ]
  },
  {
    "id": "CALC-0863",
    "name": "Growing Degree Days",
    "slug": "growing-degree-days",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "temps, base -> GDD",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0864",
    "name": "Grain Moisture Shrink",
    "slug": "grain-moisture-shrink",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "moistures -> shrink%",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0865",
    "name": "Harvest Loss",
    "slug": "harvest-loss",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "yield, loss -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0866",
    "name": "Stocking Rate",
    "slug": "stocking-rate",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "forage, intake -> AU/ha",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0867",
    "name": "Hay Bale Count",
    "slug": "hay-bale-count",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "yield, bale weight -> bales",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0868",
    "name": "Land Area Conversion",
    "slug": "land-area-conversion",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "acres/hectares/m2 -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0869",
    "name": "Field Capacity Time",
    "slug": "field-capacity-time",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "area, implement width, speed -> hours",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0870",
    "name": "Livestock Feed Requirement",
    "slug": "livestock-feed",
    "category": "C54",
    "categoryLabel": "Agriculture and Horticulture",
    "inputsOutputs": "animals, ration -> daily feed",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "crop-yield",
      "seed-rate",
      "plant-population",
      "row-spacing"
    ]
  },
  {
    "id": "CALC-0871",
    "name": "Irrigation Requirement (ETc)",
    "slug": "irrigation-requirement",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "ET0, Kc -> ETc",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "FAO 56 method and reference-surface constants inspected; Kc tables still to be sourced.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-003",
        "title": "FAO Irrigation and Drainage Paper 56 \u2014 Crop Evapotranspiration (ETc = ET0 \u00d7 Kc)",
        "url": "https://www.fao.org/4/x0490e/x0490e06.htm",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing",
      "irrigation-interval"
    ]
  },
  {
    "id": "CALC-0872",
    "name": "Crop Coefficient Calculator",
    "slug": "crop-coefficient-etc",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "ET0, Kc, area -> volume",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "drip-emitter-count",
      "sprinkler-spacing",
      "irrigation-interval"
    ]
  },
  {
    "id": "CALC-0873",
    "name": "Drip Emitter Count",
    "slug": "drip-emitter-count",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "area, spacing -> emitters, flow",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "sprinkler-spacing",
      "irrigation-interval"
    ]
  },
  {
    "id": "CALC-0874",
    "name": "Sprinkler Spacing and Coverage",
    "slug": "sprinkler-spacing",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "head, pressure, wind -> spacing",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "irrigation-interval"
    ]
  },
  {
    "id": "CALC-0875",
    "name": "Irrigation Interval",
    "slug": "irrigation-interval",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "soil water, ETc -> days",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0876",
    "name": "Soil Moisture Depletion",
    "slug": "soil-moisture-depletion",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "FC, PWP, root depth -> depletion",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0877",
    "name": "Leaching Requirement",
    "slug": "leaching-requirement",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "ECw, ECe -> fraction",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0878",
    "name": "NPK Blend Formulation",
    "slug": "npk-blend",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "target grades, products -> blend",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0879",
    "name": "Fertiliser Rate by Nutrient",
    "slug": "fertilizer-rate-nutrient",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "nutrient target, product% -> kg",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0880",
    "name": "Elemental to Oxide Conversion",
    "slug": "oxide-conversion",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "P/K/Ca -> P2O5/K2O/CaO",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0881",
    "name": "Lime Requirement",
    "slug": "lime-requirement",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "soil pH, buffer -> tonnes",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires soil-test buffer method; region-specific.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0882",
    "name": "Compost Application Rate",
    "slug": "compost-application",
    "category": "C55",
    "categoryLabel": "Irrigation, Fertilisers and Crop Production",
    "inputsOutputs": "area, depth, density -> volume",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "irrigation-requirement",
      "crop-coefficient-etc",
      "drip-emitter-count",
      "sprinkler-spacing"
    ]
  },
  {
    "id": "CALC-0883",
    "name": "Recipe Scaling",
    "slug": "recipe-scaling",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "servings, factor -> scaled ingredients",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage",
      "dough-hydration"
    ]
  },
  {
    "id": "CALC-0884",
    "name": "Serving Size Conversion",
    "slug": "serving-conversion",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "recipe yield, portions -> portion size",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "pan-size-conversion",
      "baker-percentage",
      "dough-hydration"
    ]
  },
  {
    "id": "CALC-0885",
    "name": "Baking Pan Size Conversion",
    "slug": "pan-size-conversion",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "pan shapes -> factor",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "baker-percentage",
      "dough-hydration"
    ]
  },
  {
    "id": "CALC-0886",
    "name": "Baker's Percentage",
    "slug": "baker-percentage",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "flour, ingredients -> %",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "dough-hydration"
    ]
  },
  {
    "id": "CALC-0887",
    "name": "Dough Hydration",
    "slug": "dough-hydration",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "water, flour -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0888",
    "name": "Coffee Brew Ratio",
    "slug": "coffee-ratio",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "coffee, water -> ratio, strength",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0889",
    "name": "Brine Concentration",
    "slug": "brine-concentration",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "salt, water -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0890",
    "name": "Alcohol Dilution",
    "slug": "alcohol-dilution",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "volume, ABV -> water to add",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0891",
    "name": "ABV to Proof",
    "slug": "abv-proof",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "ABV <-> proof",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0892",
    "name": "Cooking Time by Weight",
    "slug": "cooking-time-weight",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "mass, rate -> time",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0893",
    "name": "Meat Cooking Loss",
    "slug": "meat-cooking-loss",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "raw, cooked -> loss%",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0894",
    "name": "Recipe Cost",
    "slug": "recipe-cost",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "ingredient costs -> cost per serving",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0895",
    "name": "Portion Size Planning",
    "slug": "portion-size",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "guests, per-portion -> total",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0896",
    "name": "Food Waste Cost",
    "slug": "food-waste-cost",
    "category": "C56",
    "categoryLabel": "Food Preparation and Recipe Scaling",
    "inputsOutputs": "waste, cost -> annual loss",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "recipe-scaling",
      "serving-conversion",
      "pan-size-conversion",
      "baker-percentage"
    ]
  },
  {
    "id": "CALC-0897",
    "name": "BMI Calculator",
    "slug": "bmi",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "height, weight -> BMI, category",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Formula and adult categories verified on cdc.gov; adult-only limitation stated.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-011",
        "title": "US Centers for Disease Control and Prevention \u2014 Adult BMI Categories",
        "url": "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan",
      "macro-split"
    ]
  },
  {
    "id": "CALC-0898",
    "name": "BMR (Mifflin-St Jeor)",
    "slug": "bmr-mifflin",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "age, sex, height, weight -> kcal",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "tdee",
      "calorie-deficit-plan",
      "macro-split"
    ]
  },
  {
    "id": "CALC-0899",
    "name": "TDEE",
    "slug": "tdee",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "BMR, activity -> kcal",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "calorie-deficit-plan",
      "macro-split"
    ]
  },
  {
    "id": "CALC-0900",
    "name": "Calorie Deficit Plan",
    "slug": "calorie-deficit-plan",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "TDEE, target -> intake, timeline",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "macro-split"
    ]
  },
  {
    "id": "CALC-0901",
    "name": "Macro Split",
    "slug": "macro-split",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "calories, ratios -> grams",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0902",
    "name": "Protein Requirement",
    "slug": "protein-requirement",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "weight, goal -> grams",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0903",
    "name": "Fibre Intake",
    "slug": "fiber-intake",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "age, sex -> grams",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0904",
    "name": "Water Intake",
    "slug": "water-intake",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "weight, activity -> litres",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0905",
    "name": "Body Fat (US Navy)",
    "slug": "body-fat-navy",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "circumferences -> body fat%",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0906",
    "name": "Waist-to-Hip Ratio",
    "slug": "waist-hip-ratio",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "waist, hip -> WHR, risk band",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0907",
    "name": "Ideal Body Weight",
    "slug": "ideal-body-weight",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "height, sex -> range",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0908",
    "name": "Child BMI Percentile",
    "slug": "bmi-percentile-child",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "age, sex, BMI -> percentile",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires CDC growth-chart LMS tables; paediatric review.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0909",
    "name": "Sodium Intake",
    "slug": "sodium-intake",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "foods -> mg sodium",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0910",
    "name": "Added Sugar Limit",
    "slug": "added-sugar-limit",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "calories -> grams limit",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0911",
    "name": "Alcohol Calories",
    "slug": "alcohol-calories",
    "category": "C57",
    "categoryLabel": "Nutrition and Dietary Calculations",
    "inputsOutputs": "drink, volume, ABV -> kcal",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bmi",
      "bmr-mifflin",
      "tdee",
      "calorie-deficit-plan"
    ]
  },
  {
    "id": "CALC-0912",
    "name": "One-Rep Max",
    "slug": "one-rep-max",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "weight, reps -> 1RM (Epley/Brzycki)",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "training-volume",
      "running-pace",
      "split-times",
      "vo2max-cooper"
    ]
  },
  {
    "id": "CALC-0913",
    "name": "Training Volume",
    "slug": "training-volume",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "sets, reps, load -> tonnage",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "running-pace",
      "split-times",
      "vo2max-cooper"
    ]
  },
  {
    "id": "CALC-0914",
    "name": "Running Pace",
    "slug": "running-pace",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "distance, time -> pace, speed",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "split-times",
      "vo2max-cooper"
    ]
  },
  {
    "id": "CALC-0915",
    "name": "Split Times",
    "slug": "split-times",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "target time, splits -> per-km",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "vo2max-cooper"
    ]
  },
  {
    "id": "CALC-0916",
    "name": "VO2max (Cooper)",
    "slug": "vo2max-cooper",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "12-min distance -> VO2max",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0917",
    "name": "Heart Rate Zones",
    "slug": "heart-rate-zones",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "age, resting HR -> zones",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0918",
    "name": "Calories Burned (MET)",
    "slug": "met-calorie-burn",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "MET, weight, time -> kcal",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0919",
    "name": "Steps to Distance",
    "slug": "steps-to-distance",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "steps, stride -> km",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0920",
    "name": "Race Time Prediction (Riegel)",
    "slug": "riegel-prediction",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "race 1, race 2 -> predicted",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0921",
    "name": "Swim Pace",
    "slug": "swim-pace",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "distance, time -> per 100 m",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0922",
    "name": "Cycling Speed and Power",
    "slug": "cycling-speed-power",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "power, weight, grade -> speed",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0923",
    "name": "Weight Loss Rate",
    "slug": "weight-loss-rate",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "deficit -> kg/week",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0924",
    "name": "Body Recomposition Tracker",
    "slug": "body-recomp",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "weight, body fat -> lean mass change",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0925",
    "name": "Treadmill Incline Equivalent",
    "slug": "treadmill-incline",
    "category": "C58",
    "categoryLabel": "Fitness and Exercise",
    "inputsOutputs": "speed, incline -> outdoor effort",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "one-rep-max",
      "training-volume",
      "running-pace",
      "split-times"
    ]
  },
  {
    "id": "CALC-0926",
    "name": "eGFR (CKD-EPI 2021)",
    "slug": "egfr-ckdepi",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "creatinine, age, sex -> eGFR",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Renal equation; clinical review and KDIGO citation required before publish.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele",
      "ovulation-window"
    ]
  },
  {
    "id": "CALC-0927",
    "name": "Creatinine Clearance (Cockcroft-Gault)",
    "slug": "creatinine-clearance",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "age, weight, Scr -> CrCl",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Drug-dosing context; pharmacist review.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "blood-alcohol-widmark",
      "due-date-naegele",
      "ovulation-window"
    ]
  },
  {
    "id": "CALC-0928",
    "name": "Blood Alcohol (Widmark)",
    "slug": "blood-alcohol-widmark",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "drinks, weight, time -> BAC",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Estimate only; legally unreliable; disclaimer mandatory.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "due-date-naegele",
      "ovulation-window"
    ]
  },
  {
    "id": "CALC-0929",
    "name": "Due Date (Naegele)",
    "slug": "due-date-naegele",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "LMP, cycle length -> EDD",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "ovulation-window"
    ]
  },
  {
    "id": "CALC-0930",
    "name": "Ovulation Window",
    "slug": "ovulation-window",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "cycle length, LMP -> fertile days",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0931",
    "name": "Paediatric Dose by Weight",
    "slug": "pediatric-dose-weight",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "weight, mg/kg, max -> dose",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires prescriber oversight; high-risk.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0932",
    "name": "IV Drip Rate",
    "slug": "iv-drip-rate",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "volume, time, drop factor -> gtt/min",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Nursing calculation; double-check policy required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0933",
    "name": "Mean Arterial Pressure",
    "slug": "map-calculation",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "SBP, DBP -> MAP",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0934",
    "name": "Anion Gap",
    "slug": "anion-gap",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "Na, Cl, HCO3 -> gap",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Clinical interpretation required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0935",
    "name": "Corrected Calcium",
    "slug": "corrected-calcium",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "Ca, albumin -> corrected",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Clinical use.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0936",
    "name": "LDL Cholesterol (Friedewald)",
    "slug": "ldl-friedewald",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "TC, HDL, TG -> LDL",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Invalid when TG > 400 mg/dL; limitation must be enforced.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0937",
    "name": "Serum Osmolality",
    "slug": "serum-osmolality",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "Na, glucose, BUN -> osmolality",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0938",
    "name": "Pack-Years",
    "slug": "pack-years",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "cigarettes/day, years -> pack-years",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0939",
    "name": "Daily Fluid Requirement",
    "slug": "fluid-requirement",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "weight, age -> mL/day",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0940",
    "name": "Insulin Correction Dose",
    "slug": "insulin-correction",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "BG, target, ISF -> units",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "High-risk; requires clinician-defined parameters.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0941",
    "name": "Cardiovascular Risk Score",
    "slug": "cardiovascular-risk",
    "category": "C59",
    "categoryLabel": "General Health and Clinical Screening",
    "inputsOutputs": "risk factors -> 10-year risk",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Requires a specific validated model (e.g. ASCVD PCE) and population caveats.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egfr-ckdepi",
      "creatinine-clearance",
      "blood-alcohol-widmark",
      "due-date-naegele"
    ]
  },
  {
    "id": "CALC-0942",
    "name": "Date Difference",
    "slug": "date-difference",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "two dates -> days, months, years",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "add-days",
      "business-days",
      "age-calculator",
      "weekday"
    ]
  },
  {
    "id": "CALC-0943",
    "name": "Add or Subtract Days",
    "slug": "add-days",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "date, offset -> new date",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "business-days",
      "age-calculator",
      "weekday"
    ]
  },
  {
    "id": "CALC-0944",
    "name": "Business Days Between",
    "slug": "business-days",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "dates, holidays -> working days",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "age-calculator",
      "weekday"
    ]
  },
  {
    "id": "CALC-0945",
    "name": "Age Calculator",
    "slug": "age-calculator",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "birth date -> age",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "weekday"
    ]
  },
  {
    "id": "CALC-0946",
    "name": "Day of Week",
    "slug": "weekday",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "date -> weekday",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0947",
    "name": "ISO Week Number",
    "slug": "iso-week-number",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "date -> ISO week",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0948",
    "name": "Leap Year Check",
    "slug": "leap-year",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "year -> leap?",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0949",
    "name": "Time Duration",
    "slug": "time-duration",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "start, end -> h:m:s",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0950",
    "name": "Timezone Shift",
    "slug": "timezone-shift",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "time, from, to -> converted",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0951",
    "name": "Work Hours",
    "slug": "work-hours",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "start, end, breaks -> hours",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0952",
    "name": "Countdown",
    "slug": "countdown",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "target date -> remaining",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0953",
    "name": "Day of Year",
    "slug": "day-of-year",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "date -> ordinal day",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0954",
    "name": "ISO 8601 Format Converter",
    "slug": "iso-date-format",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "date -> ISO string",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0955",
    "name": "Timesheet Total",
    "slug": "timesheet-total",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "entries -> total hours, pay",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0956",
    "name": "Date of Easter (Computus)",
    "slug": "date-of-easter",
    "category": "C60",
    "categoryLabel": "Date, Time and Calendar",
    "inputsOutputs": "year -> date",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "date-difference",
      "add-days",
      "business-days",
      "age-calculator"
    ]
  },
  {
    "id": "CALC-0957",
    "name": "Length Converter",
    "slug": "length-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "any length unit -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "mass-converter",
      "area-converter",
      "volume-converter",
      "temperature-converter"
    ]
  },
  {
    "id": "CALC-0958",
    "name": "Mass Converter",
    "slug": "mass-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "any mass unit -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "length-converter",
      "area-converter",
      "volume-converter",
      "temperature-converter"
    ]
  },
  {
    "id": "CALC-0959",
    "name": "Area Converter",
    "slug": "area-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "m2/ft2/acre/ha -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "length-converter",
      "mass-converter",
      "volume-converter",
      "temperature-converter"
    ]
  },
  {
    "id": "CALC-0960",
    "name": "Volume Converter",
    "slug": "volume-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "L/gal/m3 -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "temperature-converter"
    ]
  },
  {
    "id": "CALC-0961",
    "name": "Temperature Converter",
    "slug": "temperature-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "C/F/K/R -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0962",
    "name": "Speed Converter",
    "slug": "speed-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "m/s, km/h, mph, kn -> all",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0963",
    "name": "Pressure Converter",
    "slug": "pressure-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "Pa, bar, psi, atm -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0964",
    "name": "Energy Converter",
    "slug": "energy-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "J, cal, kWh, Btu -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0965",
    "name": "Power Converter",
    "slug": "power-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "W, hp, BTU/h -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0966",
    "name": "Force Converter",
    "slug": "force-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "N, lbf, kgf -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0967",
    "name": "Torque Converter",
    "slug": "torque-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "N\u00b7m, lbf\u00b7ft -> all",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0968",
    "name": "Flow Rate Converter",
    "slug": "flow-rate-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "L/s, m3/h, gpm -> all",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0969",
    "name": "Acceleration Converter",
    "slug": "acceleration-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "m/s2, g, ft/s2 -> all",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0970",
    "name": "Density Converter",
    "slug": "density-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "kg/m3, lb/ft3 -> all",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0971",
    "name": "Viscosity Converter",
    "slug": "viscosity-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "cP, Pa\u00b7s, cSt -> all",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0972",
    "name": "Illuminance Converter",
    "slug": "illuminance-converter",
    "category": "C61",
    "categoryLabel": "Unit Conversion and Measurement",
    "inputsOutputs": "lux, fc, cd/m2 -> all",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "",
    "intent": "convert",
    "sources": [
      {
        "code": "R-001 / R-014",
        "title": "NIST Special Publication 811 \u2014 Guide for the Use of the International System of Units (SI), Appendix B.8",
        "url": "https://www.nist.gov/pml/special-publication-811",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "length-converter",
      "mass-converter",
      "area-converter",
      "volume-converter"
    ]
  },
  {
    "id": "CALC-0973",
    "name": "Number Base Conversion",
    "slug": "number-base-conversion",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "value, base -> others",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode",
      "twos-complement"
    ]
  },
  {
    "id": "CALC-0974",
    "name": "Bitwise Operations",
    "slug": "bitwise-operations",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "integers, op -> result",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "boolean-truth-table",
      "ascii-unicode",
      "twos-complement"
    ]
  },
  {
    "id": "CALC-0975",
    "name": "Boolean Truth Table",
    "slug": "boolean-truth-table",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "expression -> table",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "ascii-unicode",
      "twos-complement"
    ]
  },
  {
    "id": "CALC-0976",
    "name": "ASCII and Unicode Converter",
    "slug": "ascii-unicode",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "text <-> codes",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "twos-complement"
    ]
  },
  {
    "id": "CALC-0977",
    "name": "Two's Complement",
    "slug": "twos-complement",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "value, bits -> binary",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0978",
    "name": "IEEE-754 Representation",
    "slug": "ieee754-representation",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "number -> sign/exp/frac",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0979",
    "name": "Base64 Encoded Size",
    "slug": "base64-length",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "bytes -> encoded length",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0980",
    "name": "Binary Search Steps",
    "slug": "binary-search-steps",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "n, target -> comparisons",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0981",
    "name": "Hash Load Factor",
    "slug": "hash-load-factor",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "entries, buckets -> \u03b1",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0982",
    "name": "Recursion Depth Limit",
    "slug": "recursion-depth",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "input size, branching -> depth",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0983",
    "name": "Algorithm Complexity Classifier",
    "slug": "algorithm-complexity",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "operation counts -> O()",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0984",
    "name": "Checksum and CRC Estimate",
    "slug": "checksum-crc",
    "category": "C62",
    "categoryLabel": "Computer Science and Algorithms",
    "inputsOutputs": "data length, polynomial -> bits",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "number-base-conversion",
      "bitwise-operations",
      "boolean-truth-table",
      "ascii-unicode"
    ]
  },
  {
    "id": "CALC-0985",
    "name": "COCOMO Effort Estimate",
    "slug": "cocomo-effort",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "KLOC, mode -> effort, time",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "function-points",
      "sprint-capacity",
      "velocity",
      "story-point-conversion"
    ]
  },
  {
    "id": "CALC-0986",
    "name": "Function Point Estimate",
    "slug": "function-points",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "components -> FP",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "sprint-capacity",
      "velocity",
      "story-point-conversion"
    ]
  },
  {
    "id": "CALC-0987",
    "name": "Sprint Capacity",
    "slug": "sprint-capacity",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "team, days, focus -> points",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "velocity",
      "story-point-conversion"
    ]
  },
  {
    "id": "CALC-0988",
    "name": "Team Velocity",
    "slug": "velocity",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "completed, sprints -> average",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "story-point-conversion"
    ]
  },
  {
    "id": "CALC-0989",
    "name": "Story Point Conversion",
    "slug": "story-point-conversion",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "points, hours -> ratio",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Non-linear in reality; must be presented as team-specific only.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0990",
    "name": "Bug Density",
    "slug": "bug-density",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "bugs, KLOC -> density",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0991",
    "name": "Test Coverage",
    "slug": "test-coverage",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "executed, total -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0992",
    "name": "Cyclomatic Complexity",
    "slug": "cyclomatic-complexity",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "edges, nodes -> M",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0993",
    "name": "Technical Debt Ratio",
    "slug": "technical-debt-ratio",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "remediation, dev cost -> %",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0994",
    "name": "API Rate Limit Budget",
    "slug": "api-rate-limit",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "requests, window -> safe rate",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0995",
    "name": "Development Time Estimate",
    "slug": "dev-time-estimate",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "tasks, uncertainty -> range",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0996",
    "name": "Code Review Time",
    "slug": "code-review-time",
    "category": "C63",
    "categoryLabel": "Programming and Software Development",
    "inputsOutputs": "diff size, rate -> minutes",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cocomo-effort",
      "function-points",
      "sprint-capacity",
      "velocity"
    ]
  },
  {
    "id": "CALC-0997",
    "name": "CIDR Subnet Calculator",
    "slug": "cidr-subnet",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "CIDR, ip -> mask, hosts",
    "complexity": "Moderate",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "hosts-per-subnet",
      "subnet-split",
      "ip-range",
      "wildcard-mask"
    ]
  },
  {
    "id": "CALC-0998",
    "name": "Hosts per Subnet",
    "slug": "hosts-per-subnet",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "prefix -> usable hosts",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "subnet-split",
      "ip-range",
      "wildcard-mask"
    ]
  },
  {
    "id": "CALC-0999",
    "name": "Subnet Split (VLSM)",
    "slug": "subnet-split",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "network, requirements -> subnets",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "ip-range",
      "wildcard-mask"
    ]
  },
  {
    "id": "CALC-1000",
    "name": "IP Range from CIDR",
    "slug": "ip-range",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "CIDR -> first, last, count",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "wildcard-mask"
    ]
  },
  {
    "id": "CALC-1001",
    "name": "Wildcard Mask",
    "slug": "wildcard-mask",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "subnet mask -> wildcard",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1002",
    "name": "Network and Broadcast Address",
    "slug": "network-broadcast",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "ip, mask -> addresses",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1003",
    "name": "IPv6 Subnet Calculator",
    "slug": "ipv6-subnet",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "prefix, /n -> subnets",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1004",
    "name": "Subnet Overlap Check",
    "slug": "subnet-overlap-check",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "two CIDRs -> overlap?",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1005",
    "name": "DHCP Range Size",
    "slug": "dhcp-range-size",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "start, end, exclusions -> pool",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1006",
    "name": "Bandwidth Transfer Time",
    "slug": "bandwidth-transfer-time",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "size, speed -> time",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1007",
    "name": "Throughput Efficiency",
    "slug": "throughput-efficiency",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "goodput, line rate -> %",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1008",
    "name": "MTU and Fragmentation",
    "slug": "mtu-fragmentation",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "MTU, packet size -> fragments",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1009",
    "name": "Latency-Bandwidth Product",
    "slug": "latency-bandwidth-product",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "RTT, bandwidth -> bytes in flight",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1010",
    "name": "Port Range Reference",
    "slug": "port-range",
    "category": "C64",
    "categoryLabel": "Networking, IP Addressing and Subnetting",
    "inputsOutputs": "service -> port",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cidr-subnet",
      "hosts-per-subnet",
      "subnet-split",
      "ip-range"
    ]
  },
  {
    "id": "CALC-1011",
    "name": "File Size from Bitrate",
    "slug": "file-size-bitrate",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "bitrate, duration -> MB",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size",
      "data-compression-ratio"
    ]
  },
  {
    "id": "CALC-1012",
    "name": "Storage Unit Conversion",
    "slug": "storage-unit-conversion",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "decimal <-> binary",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "raid-capacity",
      "backup-size",
      "data-compression-ratio"
    ]
  },
  {
    "id": "CALC-1013",
    "name": "RAID Capacity",
    "slug": "raid-capacity",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "disks, level -> usable",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "backup-size",
      "data-compression-ratio"
    ]
  },
  {
    "id": "CALC-1014",
    "name": "Backup Size Estimate",
    "slug": "backup-size",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "data, retention, dedupe -> size",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "data-compression-ratio"
    ]
  },
  {
    "id": "CALC-1015",
    "name": "Compression Ratio (Data)",
    "slug": "data-compression-ratio",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "original, compressed -> ratio",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size"
    ]
  },
  {
    "id": "CALC-1016",
    "name": "Storage Transfer Time",
    "slug": "transfer-time-storage",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "size, interface speed -> time",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size"
    ]
  },
  {
    "id": "CALC-1017",
    "name": "Database Size Estimate",
    "slug": "database-size",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "rows, row size, indexes -> GB",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size"
    ]
  },
  {
    "id": "CALC-1018",
    "name": "Log Volume Estimate",
    "slug": "log-volume",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "events/s, event size -> GB/day",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size"
    ]
  },
  {
    "id": "CALC-1019",
    "name": "Tape Rotation Schedule",
    "slug": "tape-rotation",
    "category": "C65",
    "categoryLabel": "Data Storage and File Size",
    "inputsOutputs": "retention, media -> media count",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "file-size-bitrate",
      "storage-unit-conversion",
      "raid-capacity",
      "backup-size"
    ]
  },
  {
    "id": "CALC-1020",
    "name": "Aspect Ratio",
    "slug": "aspect-ratio",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "width, height -> ratio",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb",
      "modular-scale"
    ]
  },
  {
    "id": "CALC-1021",
    "name": "PX to REM",
    "slug": "px-rem-conversion",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "px, root size -> rem",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "color-contrast",
      "hex-rgb",
      "modular-scale"
    ]
  },
  {
    "id": "CALC-1022",
    "name": "Colour Contrast Ratio",
    "slug": "color-contrast",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "two colours -> ratio, WCAG",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "SOURCE_VERIFIED",
    "note": "Contrast formula and thresholds align with WCAG 2.2 (inspected); exact hue math still to be unit-tested.",
    "intent": "calculate",
    "sources": [
      {
        "code": "R-013",
        "title": "W3C Recommendation \u2014 Web Content Accessibility Guidelines (WCAG) 2.2",
        "url": "https://www.w3.org/TR/WCAG22/",
        "accessed": "2026-10-22"
      }
    ],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "hex-rgb",
      "modular-scale"
    ]
  },
  {
    "id": "CALC-1023",
    "name": "Hex to RGB",
    "slug": "hex-rgb",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "hex -> rgb, hsl",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "modular-scale"
    ]
  },
  {
    "id": "CALC-1024",
    "name": "Modular Type Scale",
    "slug": "modular-scale",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "base, ratio, steps -> sizes",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1025",
    "name": "Grid Column Calculator",
    "slug": "grid-columns",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "container, gutter, cols -> width",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1026",
    "name": "Responsive Image Sizes",
    "slug": "responsive-image-sizes",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "viewport, DPR -> srcset",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1027",
    "name": "Page Weight Budget",
    "slug": "page-weight-budget",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "assets -> total, budget",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1028",
    "name": "Performance Budget",
    "slug": "performance-budget",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "targets, current -> variance",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1029",
    "name": "Breakpoint Calculator",
    "slug": "breakpoint-calculator",
    "category": "C66",
    "categoryLabel": "Web Development and Digital Design",
    "inputsOutputs": "content width, gaps -> breakpoints",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "aspect-ratio",
      "px-rem-conversion",
      "color-contrast",
      "hex-rgb"
    ]
  },
  {
    "id": "CALC-1030",
    "name": "Video Storage Size",
    "slug": "video-storage-size",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "bitrate, duration -> GB",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration",
      "frame-rate-conversion"
    ]
  },
  {
    "id": "CALC-1031",
    "name": "Video Bitrate Target",
    "slug": "video-bitrate",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "resolution, fps, quality -> Mbps",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "streaming-bandwidth",
      "video-duration",
      "frame-rate-conversion"
    ]
  },
  {
    "id": "CALC-1032",
    "name": "Streaming Bandwidth",
    "slug": "streaming-bandwidth",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "bitrate, viewers -> Mbps",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "video-duration",
      "frame-rate-conversion"
    ]
  },
  {
    "id": "CALC-1033",
    "name": "Video Duration from Size",
    "slug": "video-duration",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "size, bitrate -> duration",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "frame-rate-conversion"
    ]
  },
  {
    "id": "CALC-1034",
    "name": "Frame Rate Conversion",
    "slug": "frame-rate-conversion",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "fps, frames -> duration",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1035",
    "name": "Video Aspect Conversion",
    "slug": "video-aspect-conversion",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "source, target -> crop/pad",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1036",
    "name": "Render Time Estimate",
    "slug": "render-time",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "frames, seconds/frame -> hours",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1037",
    "name": "GIF Size Estimate",
    "slug": "gif-size",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "frames, size, palette -> MB",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "estimate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1038",
    "name": "Podcast File Size",
    "slug": "podcast-file-size",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "bitrate, minutes -> MB",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1039",
    "name": "Megapixel Resolution",
    "slug": "megapixel-resolution",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "width, height -> MP",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1040",
    "name": "Slideshow Duration",
    "slug": "slideshow-duration",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "slides, per-slide -> total",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1041",
    "name": "Media Archive Size",
    "slug": "media-archive-size",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "assets, duration -> TB",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1042",
    "name": "Upload Time",
    "slug": "upload-time",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "file size, uplink -> time",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1043",
    "name": "Transcode Storage Multiplier",
    "slug": "transcode-multiplier",
    "category": "C67",
    "categoryLabel": "Image, Video and Media",
    "inputsOutputs": "renditions, bitrates -> total",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "video-storage-size",
      "video-bitrate",
      "streaming-bandwidth",
      "video-duration"
    ]
  },
  {
    "id": "CALC-1044",
    "name": "Depth of Field",
    "slug": "depth-of-field",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, aperture, distance, CoC -> DoF",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops",
      "flash-guide-number"
    ]
  },
  {
    "id": "CALC-1045",
    "name": "Hyperfocal Distance",
    "slug": "hyperfocal-distance",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, aperture, CoC -> H",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "exposure-ev",
      "nd-filter-stops",
      "flash-guide-number"
    ]
  },
  {
    "id": "CALC-1046",
    "name": "Exposure Value",
    "slug": "exposure-ev",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "aperture, shutter, ISO -> EV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "nd-filter-stops",
      "flash-guide-number"
    ]
  },
  {
    "id": "CALC-1047",
    "name": "ND Filter Stops",
    "slug": "nd-filter-stops",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "shutter before/after -> stops",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "flash-guide-number"
    ]
  },
  {
    "id": "CALC-1048",
    "name": "Flash Guide Number",
    "slug": "flash-guide-number",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "GN, distance -> aperture",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1049",
    "name": "Crop Factor and Equivalent Focal Length",
    "slug": "crop-factor",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, sensor -> equivalent",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1050",
    "name": "Print Size and PPI",
    "slug": "print-size-ppi",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "pixels, print size -> PPI",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1051",
    "name": "Field of View",
    "slug": "field-of-view",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, sensor -> angle",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1052",
    "name": "Sunny 16 Exposure",
    "slug": "sunny-16",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "conditions -> exposure",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1053",
    "name": "Shutter Angle",
    "slug": "shutter-angle",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "fps, angle -> shutter speed",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1054",
    "name": "Star Trail Exposure",
    "slug": "star-trail-exposure",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, declination -> max time",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1055",
    "name": "Time-Lapse Interval",
    "slug": "timelapse-interval",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "event duration, clip length -> interval",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1056",
    "name": "Macro Magnification",
    "slug": "macro-magnification",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "extension, focal -> magnification",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1057",
    "name": "Lens Aperture Area",
    "slug": "lens-aperture-area",
    "category": "C68",
    "categoryLabel": "Photography and Optics",
    "inputsOutputs": "focal, f-number -> area",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "depth-of-field",
      "hyperfocal-distance",
      "exposure-ev",
      "nd-filter-stops"
    ]
  },
  {
    "id": "CALC-1058",
    "name": "Decibel Addition",
    "slug": "db-spl-addition",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "multiple levels -> combined",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power",
      "room-mode-frequency"
    ]
  },
  {
    "id": "CALC-1059",
    "name": "Decibel Conversion (dBu/dBV/SPL/dBFS)",
    "slug": "decibel-conversion",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "level, reference -> other",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "speaker-impedance",
      "amplifier-power",
      "room-mode-frequency"
    ]
  },
  {
    "id": "CALC-1060",
    "name": "Speaker Impedance and Power",
    "slug": "speaker-impedance",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "amp, speakers -> load, power",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "amplifier-power",
      "room-mode-frequency"
    ]
  },
  {
    "id": "CALC-1061",
    "name": "Amplifier Power Requirement",
    "slug": "amplifier-power",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "sensitivity, distance, SPL -> watts",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "room-mode-frequency"
    ]
  },
  {
    "id": "CALC-1062",
    "name": "Room Mode Frequency",
    "slug": "room-mode-frequency",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "room dims -> axial modes",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1063",
    "name": "Wavelength and Frequency",
    "slug": "wavelength-frequency",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "f or \u03bb -> other",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1064",
    "name": "Speaker Delay and Distance",
    "slug": "speaker-delay-distance",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "distance, temp -> delay",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1065",
    "name": "Dynamic Range",
    "slug": "dynamic-range",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "bit depth -> dB",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1066",
    "name": "Bit Depth and Resolution",
    "slug": "bit-depth-resolution",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "bits, range -> LSB",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1067",
    "name": "Sample Rate Requirement",
    "slug": "sample-rate-requirement",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "max frequency -> Nyquist",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1068",
    "name": "Audio Latency",
    "slug": "audio-latency",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "buffer, sample rate -> ms",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1069",
    "name": "Perceived Loudness Change",
    "slug": "loudness-perception",
    "category": "C69",
    "categoryLabel": "Audio and Acoustics",
    "inputsOutputs": "dB change -> perceived",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "db-spl-addition",
      "decibel-conversion",
      "speaker-impedance",
      "amplifier-power"
    ]
  },
  {
    "id": "CALC-1070",
    "name": "Shannon Capacity",
    "slug": "shannon-capacity",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "bandwidth, SNR -> capacity",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "friis-path-loss",
      "link-budget",
      "fresnel-zone",
      "eirp"
    ]
  },
  {
    "id": "CALC-1071",
    "name": "Free Space Path Loss",
    "slug": "friis-path-loss",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "distance, frequency -> dB",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "link-budget",
      "fresnel-zone",
      "eirp"
    ]
  },
  {
    "id": "CALC-1072",
    "name": "Link Budget",
    "slug": "link-budget",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "tx power, gains, losses -> rx power",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "fresnel-zone",
      "eirp"
    ]
  },
  {
    "id": "CALC-1073",
    "name": "Fresnel Zone Radius",
    "slug": "fresnel-zone",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "distance, frequency -> radius",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "eirp"
    ]
  },
  {
    "id": "CALC-1074",
    "name": "EIRP",
    "slug": "eirp",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "tx power, antenna gain, loss -> EIRP",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1075",
    "name": "Erlang B Blocking",
    "slug": "erlang-traffic",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "traffic, channels -> blocking",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1076",
    "name": "Antenna Gain",
    "slug": "antenna-gain",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "aperture, frequency -> gain",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1077",
    "name": "Fibre Loss Budget",
    "slug": "fiber-loss-budget",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "length, loss/km, splices -> budget",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1078",
    "name": "Bandwidth per User",
    "slug": "bandwidth-per-user",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "capacity, users, oversubscription -> per user",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1079",
    "name": "Spectral Efficiency",
    "slug": "spectral-efficiency",
    "category": "C70",
    "categoryLabel": "Telecommunications",
    "inputsOutputs": "throughput, bandwidth -> b/s/Hz",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "shannon-capacity",
      "friis-path-loss",
      "link-budget",
      "fresnel-zone"
    ]
  },
  {
    "id": "CALC-1080",
    "name": "GPA Calculator",
    "slug": "gpa",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "courses, credits, grades -> GPA",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final",
      "test-percentage"
    ]
  },
  {
    "id": "CALC-1081",
    "name": "Weighted GPA",
    "slug": "weighted-gpa",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "honours weighting -> GPA",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "cgpa-conversion",
      "grade-needed-final",
      "test-percentage"
    ]
  },
  {
    "id": "CALC-1082",
    "name": "CGPA Conversion",
    "slug": "cgpa-conversion",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "scale -> percentage",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "grade-needed-final",
      "test-percentage"
    ]
  },
  {
    "id": "CALC-1083",
    "name": "Grade Needed on Final",
    "slug": "grade-needed-final",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "current, target, weight -> needed",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "test-percentage"
    ]
  },
  {
    "id": "CALC-1084",
    "name": "Test Score Percentage",
    "slug": "test-percentage",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "correct, total -> %",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1085",
    "name": "Standard Score Conversion",
    "slug": "standard-score",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "raw, mean, sd -> z, T, stanine",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1086",
    "name": "Class Rank",
    "slug": "class-rank",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "position, class size -> rank, percentile",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1087",
    "name": "Grading Curve",
    "slug": "grading-curve",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "scores, method -> curved",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1088",
    "name": "Rubric Score",
    "slug": "rubric-score",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "criteria, weights -> total",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1089",
    "name": "Attendance Rate",
    "slug": "attendance-rate",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "present, sessions -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1090",
    "name": "Study Time Planner",
    "slug": "study-time-plan",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "topics, deadline -> hours/day",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1091",
    "name": "Reading Speed",
    "slug": "reading-speed",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "words, minutes -> wpm, time",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1092",
    "name": "Quiz Average",
    "slug": "quiz-average",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "scores, drop-lowest -> average",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1093",
    "name": "Degree Classification",
    "slug": "degree-classification",
    "category": "C71",
    "categoryLabel": "Education, Grades and Examination Scoring",
    "inputsOutputs": "module marks -> class",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "UK/other classification rules are institution-specific.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "gpa",
      "weighted-gpa",
      "cgpa-conversion",
      "grade-needed-final"
    ]
  },
  {
    "id": "CALC-1094",
    "name": "Power Analysis",
    "slug": "power-analysis",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "effect, \u03b1, power -> n",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa",
      "response-rate"
    ]
  },
  {
    "id": "CALC-1095",
    "name": "Effect Size (Cohen's d)",
    "slug": "effect-size-cohen",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "means, sd -> d",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "cronbach-alpha",
      "cohens-kappa",
      "response-rate"
    ]
  },
  {
    "id": "CALC-1096",
    "name": "Cronbach's Alpha",
    "slug": "cronbach-alpha",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "item variances -> \u03b1",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cohens-kappa",
      "response-rate"
    ]
  },
  {
    "id": "CALC-1097",
    "name": "Cohen's Kappa",
    "slug": "cohens-kappa",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "agreement table -> \u03ba",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "response-rate"
    ]
  },
  {
    "id": "CALC-1098",
    "name": "Survey Response Rate",
    "slug": "response-rate",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "responses, invited -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1099",
    "name": "Dropout Adjustment",
    "slug": "dropout-adjustment",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "target n, attrition -> recruit n",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1100",
    "name": "Randomisation List",
    "slug": "randomisation-list",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "n, blocks -> sequence",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1101",
    "name": "Survey Length and Completion",
    "slug": "survey-length",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "questions, time -> completion",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1102",
    "name": "Likert Scoring",
    "slug": "likert-scoring",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "responses, weights -> score",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1103",
    "name": "Meta-Analysis Weight",
    "slug": "meta-analysis-weight",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "effect, variance -> weight",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1104",
    "name": "Risk Ratio",
    "slug": "risk-ratio",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "2x2 table -> RR, CI",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1105",
    "name": "Odds Ratio",
    "slug": "odds-ratio",
    "category": "C72",
    "categoryLabel": "Research Methodology and Experimental Design",
    "inputsOutputs": "2x2 table -> OR, CI",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "power-analysis",
      "effect-size-cohen",
      "cronbach-alpha",
      "cohens-kappa"
    ]
  },
  {
    "id": "CALC-1106",
    "name": "Cp and Cpk",
    "slug": "cp-cpk",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "USL, LSL, \u03bc, \u03c3 -> Cp, Cpk",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pp-ppk",
      "xbar-r-chart",
      "p-chart",
      "c-chart"
    ]
  },
  {
    "id": "CALC-1107",
    "name": "Pp and Ppk",
    "slug": "pp-ppk",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "overall \u03c3 -> Pp, Ppk",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "xbar-r-chart",
      "p-chart",
      "c-chart"
    ]
  },
  {
    "id": "CALC-1108",
    "name": "X-bar and R Control Chart",
    "slug": "xbar-r-chart",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "subgroups -> limits",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "p-chart",
      "c-chart"
    ]
  },
  {
    "id": "CALC-1109",
    "name": "p-Chart",
    "slug": "p-chart",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "defectives, sample -> limits",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "c-chart"
    ]
  },
  {
    "id": "CALC-1110",
    "name": "c-Chart",
    "slug": "c-chart",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "defects per unit -> limits",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1111",
    "name": "MTBF",
    "slug": "mtbf",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "failures, time -> MTBF",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1112",
    "name": "MTTR",
    "slug": "mttr",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "repair time, events -> MTTR",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1113",
    "name": "Availability",
    "slug": "availability-reliability",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "MTBF, MTTR -> A",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1114",
    "name": "Reliability Function",
    "slug": "reliability-function",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "\u03bb or Weibull, t -> R(t)",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1115",
    "name": "FMEA RPN",
    "slug": "fmea-rpn",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "S, O, D -> RPN",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1116",
    "name": "Sigma Level",
    "slug": "sigma-level",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "DPMO -> \u03c3 level",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1117",
    "name": "DPMO",
    "slug": "dpmo",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "defects, opportunities -> DPMO",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1118",
    "name": "Acceptance Sampling Plan",
    "slug": "sampling-plan",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "AQL, lot, level -> n, c",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "ISO 2859-1 tables are licensed.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1119",
    "name": "Gage R&R",
    "slug": "gage-rr",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "measurements -> %GRR",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1120",
    "name": "Arrhenius Life Acceleration",
    "slug": "arrhenius-life",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "Ea, temps -> acceleration factor",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1121",
    "name": "Weibull Shape and Scale",
    "slug": "weibull-shape",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "failure times -> \u03b2, \u03b7",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1122",
    "name": "Tolerance Stack-Up",
    "slug": "tolerance-stack",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "dimensions, tolerances -> worst case/RSS",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1123",
    "name": "Bathtub Curve Hazard Rate",
    "slug": "hazard-rate",
    "category": "C73",
    "categoryLabel": "Quality Control and Reliability Engineering",
    "inputsOutputs": "\u03bb(t) -> hazard",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cp-cpk",
      "pp-ppk",
      "xbar-r-chart",
      "p-chart"
    ]
  },
  {
    "id": "CALC-1124",
    "name": "Headcount Plan",
    "slug": "headcount-plan",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "growth, attrition -> hires needed",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire",
      "time-to-hire"
    ]
  },
  {
    "id": "CALC-1125",
    "name": "Turnover Rate",
    "slug": "turnover-rate",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "leavers, headcount -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "attrition-cost",
      "cost-per-hire",
      "time-to-hire"
    ]
  },
  {
    "id": "CALC-1126",
    "name": "Attrition Cost",
    "slug": "attrition-cost",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "salary, replacement cost -> total",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "cost-per-hire",
      "time-to-hire"
    ]
  },
  {
    "id": "CALC-1127",
    "name": "Cost per Hire",
    "slug": "cost-per-hire",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "recruiting costs, hires -> cost",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "time-to-hire"
    ]
  },
  {
    "id": "CALC-1128",
    "name": "Time to Hire",
    "slug": "time-to-hire",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "stages -> days",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1129",
    "name": "Absence Rate",
    "slug": "absenteeism-rate",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "days absent, workdays -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1130",
    "name": "Span of Control",
    "slug": "span-of-control",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "reports, managers -> ratio",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1131",
    "name": "FTE Calculation",
    "slug": "fte-calculation",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "hours, full-time hours -> FTE",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1132",
    "name": "Leave Entitlement",
    "slug": "leave-entitlement",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "jurisdiction, service -> days",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Statutory; jurisdiction tables required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1133",
    "name": "Training Hours per Employee",
    "slug": "training-hours",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "hours, headcount -> per employee",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1134",
    "name": "Engagement Score",
    "slug": "engagement-score",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "survey responses -> index",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1135",
    "name": "Recruitment Funnel Conversion",
    "slug": "recruitment-funnel",
    "category": "C74",
    "categoryLabel": "Human Resources and Employment",
    "inputsOutputs": "stage counts -> rates",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "headcount-plan",
      "turnover-rate",
      "attrition-cost",
      "cost-per-hire"
    ]
  },
  {
    "id": "CALC-1136",
    "name": "Life Insurance Needs (DIME)",
    "slug": "life-insurance-need",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "debt, income, assets -> cover",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max",
      "claim-payout"
    ]
  },
  {
    "id": "CALC-1137",
    "name": "Deductible Break-Even",
    "slug": "deductible-breakeven",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "plans, expected spend -> cheaper",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "coinsurance-cost",
      "out-of-pocket-max",
      "claim-payout"
    ]
  },
  {
    "id": "CALC-1138",
    "name": "Coinsurance Cost",
    "slug": "coinsurance-cost",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "bill, deductible, rate -> share",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "out-of-pocket-max",
      "claim-payout"
    ]
  },
  {
    "id": "CALC-1139",
    "name": "Out-of-Pocket Maximum",
    "slug": "out-of-pocket-max",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "costs, plan -> OOP",
    "complexity": "Complex",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "claim-payout"
    ]
  },
  {
    "id": "CALC-1140",
    "name": "Claim Payout",
    "slug": "claim-payout",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "loss, deductible, limit -> payout",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1141",
    "name": "Expected Loss",
    "slug": "expected-loss",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "probability, severity -> EL",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1142",
    "name": "Loss Ratio",
    "slug": "loss-ratio",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "claims, premium -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1143",
    "name": "Combined Ratio",
    "slug": "combined-ratio",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "loss, expense -> %",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1144",
    "name": "Premium per 1000 of Cover",
    "slug": "premium-per-1000",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "premium, sum assured -> rate",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1145",
    "name": "Replacement Cost",
    "slug": "replacement-cost",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "area, rate, contents -> sum insured",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1146",
    "name": "Business Interruption Cover",
    "slug": "business-interruption",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "profit, period -> sum insured",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1147",
    "name": "Risk of Ruin",
    "slug": "risk-of-ruin",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "edge, bankroll -> probability",
    "complexity": "Specialist",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1148",
    "name": "Coverage Gap",
    "slug": "coverage-gap",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "need, existing -> gap",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1149",
    "name": "Premium Financing Cost",
    "slug": "premium-financing",
    "category": "C75",
    "categoryLabel": "Insurance and Risk Analysis",
    "inputsOutputs": "premium, APR, months -> cost",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "life-insurance-need",
      "deductible-breakeven",
      "coinsurance-cost",
      "out-of-pocket-max"
    ]
  },
  {
    "id": "CALC-1150",
    "name": "Judgment Interest",
    "slug": "judgment-interest",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "principal, rate, period -> interest",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Jurisdiction-specific; legal review required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "contract-notice-period",
      "limitation-period",
      "inheritance-share",
      "damages-calculation"
    ]
  },
  {
    "id": "CALC-1151",
    "name": "Contract Notice Period",
    "slug": "contract-notice-period",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "dates, clause -> notice date",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "judgment-interest",
      "limitation-period",
      "inheritance-share",
      "damages-calculation"
    ]
  },
  {
    "id": "CALC-1152",
    "name": "Limitation Period Deadline",
    "slug": "limitation-period",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "claim type, accrual -> deadline",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Procedural law varies; not legal advice.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "inheritance-share",
      "damages-calculation"
    ]
  },
  {
    "id": "CALC-1153",
    "name": "Inheritance Share",
    "slug": "inheritance-share",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "estate, heirs, rules -> shares",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Forced-heirship and intestacy rules vary by jurisdiction and school of law.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "damages-calculation"
    ]
  },
  {
    "id": "CALC-1154",
    "name": "Damages with Discounting",
    "slug": "damages-calculation",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "loss stream, discount rate -> PV",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "inheritance-share"
    ]
  },
  {
    "id": "CALC-1155",
    "name": "Lease Notice and Break Date",
    "slug": "lease-notice-period",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "term, notice -> dates",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "inheritance-share"
    ]
  },
  {
    "id": "CALC-1156",
    "name": "Child Support Estimate",
    "slug": "child-support-estimate",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "income, children -> amount",
    "complexity": "Specialist",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Statutory guidelines; jurisdiction-specific; legal review mandatory.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "inheritance-share"
    ]
  },
  {
    "id": "CALC-1157",
    "name": "Redundancy Pay",
    "slug": "redundancy-pay",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "age, service, wage -> statutory pay",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Statutory table required per jurisdiction.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "inheritance-share"
    ]
  },
  {
    "id": "CALC-1158",
    "name": "Court Deadline (Days)",
    "slug": "legal-deadline",
    "category": "C76",
    "categoryLabel": "Legal and Regulatory Calculations",
    "inputsOutputs": "service date, days, rules -> deadline",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "judgment-interest",
      "contract-notice-period",
      "limitation-period",
      "inheritance-share"
    ]
  },
  {
    "id": "CALC-1159",
    "name": "Expected Value of a Bet",
    "slug": "expected-value-bet",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "odds, stake, prob -> EV",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "house-edge",
      "pot-odds",
      "implied-probability",
      "odds-conversion"
    ]
  },
  {
    "id": "CALC-1160",
    "name": "House Edge",
    "slug": "house-edge",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "payouts, probabilities -> edge",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "pot-odds",
      "implied-probability",
      "odds-conversion"
    ]
  },
  {
    "id": "CALC-1161",
    "name": "Pot Odds",
    "slug": "pot-odds",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "pot, bet -> odds, break-even equity",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "implied-probability",
      "odds-conversion"
    ]
  },
  {
    "id": "CALC-1162",
    "name": "Implied Probability",
    "slug": "implied-probability",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "odds -> probability",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "odds-conversion"
    ]
  },
  {
    "id": "CALC-1163",
    "name": "Odds Format Conversion",
    "slug": "odds-conversion",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "decimal/fractional/american -> all",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1164",
    "name": "Parlay Odds",
    "slug": "parlay-odds",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "legs -> combined odds",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1165",
    "name": "Kelly Criterion",
    "slug": "kelly-criterion",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "edge, odds -> stake",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1166",
    "name": "Vig Removal",
    "slug": "vig-removal",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "two-way odds -> fair probability",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1167",
    "name": "Poker Outs and Equity",
    "slug": "poker-outs",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "outs, cards left -> equity",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1168",
    "name": "Lottery Odds",
    "slug": "lottery-odds",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "numbers, draws -> probability",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1169",
    "name": "Break-Even Win Rate",
    "slug": "break-even-win-rate",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "odds -> win% needed",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1170",
    "name": "Betting Variance",
    "slug": "betting-variance",
    "category": "C77",
    "categoryLabel": "Gaming, Odds and Probability",
    "inputsOutputs": "bets, stake, p -> \u03c3, drawdown",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "expected-value-bet",
      "house-edge",
      "pot-odds",
      "implied-probability"
    ]
  },
  {
    "id": "CALC-1171",
    "name": "Batting Average",
    "slug": "batting-average",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "hits, at-bats -> AVG",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "earned-run-average",
      "whip",
      "slugging-percentage",
      "on-base-percentage"
    ]
  },
  {
    "id": "CALC-1172",
    "name": "Earned Run Average",
    "slug": "earned-run-average",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "earned runs, innings -> ERA",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "whip",
      "slugging-percentage",
      "on-base-percentage"
    ]
  },
  {
    "id": "CALC-1173",
    "name": "WHIP",
    "slug": "whip",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "walks, hits, innings -> WHIP",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "slugging-percentage",
      "on-base-percentage"
    ]
  },
  {
    "id": "CALC-1174",
    "name": "Slugging Percentage",
    "slug": "slugging-percentage",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "total bases, at-bats -> SLG",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "on-base-percentage"
    ]
  },
  {
    "id": "CALC-1175",
    "name": "On-Base Percentage",
    "slug": "on-base-percentage",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "hits, walks, PA -> OBP",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1176",
    "name": "True Shooting Percentage",
    "slug": "true-shooting",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "points, FGA, FTA -> TS%",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1177",
    "name": "Elo Rating Change",
    "slug": "elo-rating",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "ratings, result, K -> new ratings",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1178",
    "name": "Win Probability from Rating",
    "slug": "win-probability",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "rating gap -> probability",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1179",
    "name": "Tournament Points",
    "slug": "tournament-points",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "placements, weights -> total",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1180",
    "name": "Golf Course Handicap",
    "slug": "handicap-index",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "index, slope, CR, par -> CH",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1181",
    "name": "Cricket Run Rate",
    "slug": "cricket-run-rate",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "runs, overs -> RR, NRR",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1182",
    "name": "Goal Difference and Points",
    "slug": "football-goal-difference",
    "category": "C78",
    "categoryLabel": "Sports and Athletic Performance Metrics",
    "inputsOutputs": "results -> GD, points",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "batting-average",
      "earned-run-average",
      "whip",
      "slugging-percentage"
    ]
  },
  {
    "id": "CALC-1183",
    "name": "Trip Cost",
    "slug": "trip-cost",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "transport, lodging, food -> total",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery",
      "flight-distance"
    ]
  },
  {
    "id": "CALC-1184",
    "name": "Cost Sharing per Person",
    "slug": "cost-per-person-share",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "total, people, shares -> per person",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "travel-budget-per-day",
      "jet-lag-recovery",
      "flight-distance"
    ]
  },
  {
    "id": "CALC-1185",
    "name": "Daily Travel Budget",
    "slug": "travel-budget-per-day",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "budget, days -> per day",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "jet-lag-recovery",
      "flight-distance"
    ]
  },
  {
    "id": "CALC-1186",
    "name": "Jet Lag Recovery",
    "slug": "jet-lag-recovery",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "time zones, direction -> days",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "flight-distance"
    ]
  },
  {
    "id": "CALC-1187",
    "name": "Great-Circle Flight Distance",
    "slug": "flight-distance",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "airports -> km, time",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1188",
    "name": "Driving Time and Cost",
    "slug": "driving-time",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "distance, speed, consumption -> time, cost",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1189",
    "name": "Rest Stop Planning",
    "slug": "rest-stop-planning",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "duration, interval -> stops",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1190",
    "name": "Baggage Weight Total",
    "slug": "luggage-weight",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "items, limit -> total, excess",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1191",
    "name": "Hotel Cost per Night",
    "slug": "hotel-cost-per-night",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "total, nights, taxes -> per night",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1192",
    "name": "Travel Insurance Cost",
    "slug": "travel-insurance-cost",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "trip cost, days, rate -> premium",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1193",
    "name": "Multi-City Route Distance",
    "slug": "multi-city-distance",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "legs -> total distance",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1194",
    "name": "Time Zone Difference",
    "slug": "timezone-difference",
    "category": "C79",
    "categoryLabel": "Travel and Trip Planning",
    "inputsOutputs": "zones -> offset, call window",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "trip-cost",
      "cost-per-person-share",
      "travel-budget-per-day",
      "jet-lag-recovery"
    ]
  },
  {
    "id": "CALC-1195",
    "name": "50/30/20 Budget",
    "slug": "fifty-thirty-twenty",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "income -> needs, wants, savings",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "savings-rate",
      "emergency-fund",
      "net-worth",
      "subscription-cost"
    ]
  },
  {
    "id": "CALC-1196",
    "name": "Savings Rate",
    "slug": "savings-rate",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "savings, income -> %",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "emergency-fund",
      "net-worth",
      "subscription-cost"
    ]
  },
  {
    "id": "CALC-1197",
    "name": "Emergency Fund",
    "slug": "emergency-fund",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "expenses, months -> target",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "net-worth",
      "subscription-cost"
    ]
  },
  {
    "id": "CALC-1198",
    "name": "Net Worth",
    "slug": "net-worth",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "assets, liabilities -> net worth",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "subscription-cost"
    ]
  },
  {
    "id": "CALC-1199",
    "name": "Subscription Cost Tracker",
    "slug": "subscription-cost",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "subscriptions -> annual total",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1200",
    "name": "Utility Bill Split",
    "slug": "utility-split",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "bill, occupants -> shares",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1201",
    "name": "Rent Affordability",
    "slug": "rent-affordability",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "income, ratio -> max rent",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1202",
    "name": "Grocery Budget",
    "slug": "grocery-budget",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "household, weeks -> budget",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1203",
    "name": "Sinking Fund",
    "slug": "sinking-fund",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "target, months -> monthly set-aside",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1204",
    "name": "Monthly Cash Flow",
    "slug": "cash-flow-monthly",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "income, expenses -> net",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1205",
    "name": "Cost of Living Comparison",
    "slug": "cost-of-living-index",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "index, income -> equivalent",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1206",
    "name": "Envelope Budget",
    "slug": "envelope-budget",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "income, categories -> envelopes",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1207",
    "name": "Goal Savings Timeline",
    "slug": "goal-savings-timeline",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "target, rate, return -> months",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1208",
    "name": "Budget Variance",
    "slug": "home-budget-variance",
    "category": "C80",
    "categoryLabel": "Household Budgets and Personal Finance",
    "inputsOutputs": "budget, actual -> variance",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "fifty-thirty-twenty",
      "savings-rate",
      "emergency-fund",
      "net-worth"
    ]
  },
  {
    "id": "CALC-1209",
    "name": "Sale Price",
    "slug": "sale-price",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "price, discount -> final",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "percent-off",
      "bogo-value",
      "tip-calculator",
      "bill-split"
    ]
  },
  {
    "id": "CALC-1210",
    "name": "Percent Off",
    "slug": "percent-off",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "price, % -> saving",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "bogo-value",
      "tip-calculator",
      "bill-split"
    ]
  },
  {
    "id": "CALC-1211",
    "name": "Buy-One-Get-One Value",
    "slug": "bogo-value",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "price, offer -> effective discount",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "tip-calculator",
      "bill-split"
    ]
  },
  {
    "id": "CALC-1212",
    "name": "Tip Calculator",
    "slug": "tip-calculator",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "bill, tip%, split -> per person",
    "complexity": "Simple",
    "priority": "P0",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "bill-split"
    ]
  },
  {
    "id": "CALC-1213",
    "name": "Bill Split",
    "slug": "bill-split",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "total, people, tax -> shares",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1214",
    "name": "Service Charge and Tax",
    "slug": "service-charge",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "bill, service, tax -> total",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1215",
    "name": "Price Match Savings",
    "slug": "price-match-savings",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "prices -> saving",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1216",
    "name": "Clearance Price Ladder",
    "slug": "clearance-price",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "original, steps -> prices",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1217",
    "name": "Cashback Value",
    "slug": "cashback-value",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "spend, rate, expiry -> value",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1218",
    "name": "Landed Retail Price",
    "slug": "landed-retail-price",
    "category": "C81",
    "categoryLabel": "Retail Pricing and Shopping",
    "inputsOutputs": "cost, shipping, tax -> total",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "sale-price",
      "percent-off",
      "bogo-value",
      "tip-calculator"
    ]
  },
  {
    "id": "CALC-1219",
    "name": "Pet Age in Human Years",
    "slug": "pet-age-human-years",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "species, age -> human years",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "Species/size curves must be sourced; the x7 rule is invalid.",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-calorie-mer",
      "pet-food-portion",
      "pet-water-intake",
      "aquarium-volume"
    ]
  },
  {
    "id": "CALC-1220",
    "name": "Pet Calorie Requirement",
    "slug": "pet-calorie-mer",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "weight, life stage -> kcal/day",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-food-portion",
      "pet-water-intake",
      "aquarium-volume"
    ]
  },
  {
    "id": "CALC-1221",
    "name": "Pet Food Portion",
    "slug": "pet-food-portion",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "kcal/day, food density -> grams",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-water-intake",
      "aquarium-volume"
    ]
  },
  {
    "id": "CALC-1222",
    "name": "Pet Water Intake",
    "slug": "pet-water-intake",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "weight -> mL/day",
    "complexity": "Simple",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-food-portion",
      "aquarium-volume"
    ]
  },
  {
    "id": "CALC-1223",
    "name": "Aquarium Volume",
    "slug": "aquarium-volume",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "dims, displacement -> litres",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-food-portion",
      "pet-water-intake"
    ]
  },
  {
    "id": "CALC-1224",
    "name": "Fish Stocking Density",
    "slug": "fish-stocking-density",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "volume, species -> advisory",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Folklore rules; must not be presented as welfare guidance.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-food-portion",
      "pet-water-intake"
    ]
  },
  {
    "id": "CALC-1225",
    "name": "Pet Medication Dose",
    "slug": "pet-medication-dose",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "weight, mg/kg -> dose",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Prescription-only; veterinary review required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-food-portion",
      "pet-water-intake"
    ]
  },
  {
    "id": "CALC-1226",
    "name": "Pet Insurance Cost",
    "slug": "pet-insurance-cost",
    "category": "C82",
    "categoryLabel": "Pets and Animal Care",
    "inputsOutputs": "species, age, cover -> premium",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "pet-age-human-years",
      "pet-calorie-mer",
      "pet-food-portion",
      "pet-water-intake"
    ]
  },
  {
    "id": "CALC-1227",
    "name": "Occupancy Load",
    "slug": "occupancy-load",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "area, use -> occupants",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Building-code table data required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count",
      "fire-extinguisher-coverage"
    ]
  },
  {
    "id": "CALC-1228",
    "name": "Egress Width",
    "slug": "egress-width",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "occupants, rate -> width",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Code-dependent.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "parking-space-count",
      "restroom-fixture-count",
      "fire-extinguisher-coverage"
    ]
  },
  {
    "id": "CALC-1229",
    "name": "Parking Space Count",
    "slug": "parking-space-count",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "floor area, ratio -> spaces",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Zoning-dependent.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "restroom-fixture-count",
      "fire-extinguisher-coverage"
    ]
  },
  {
    "id": "CALC-1230",
    "name": "Restroom Fixture Count",
    "slug": "restroom-fixture-count",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "occupants, sex split -> fixtures",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Plumbing-code table data required.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "fire-extinguisher-coverage"
    ]
  },
  {
    "id": "CALC-1231",
    "name": "Fire Extinguisher Coverage",
    "slug": "fire-extinguisher-coverage",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "area, hazard -> units",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "NFPA 10 licensed.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1232",
    "name": "Lighting Level (Lumen Method)",
    "slug": "lighting-level",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "lumens, CU, MF, area -> lux",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1233",
    "name": "Swimming Pool Volume",
    "slug": "pool-volume",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "dims, shape -> m3, litres",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1234",
    "name": "Pool Chlorine Dose",
    "slug": "pool-chlorine-dose",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "volume, target ppm -> grams",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1235",
    "name": "Septic Tank Size",
    "slug": "septic-tank-size",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "bedrooms, flow -> litres",
    "complexity": "Complex",
    "priority": "P2",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Local regulation.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1236",
    "name": "Fence Post Spacing",
    "slug": "fence-post-spacing",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "run, spacing -> posts, rails",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1237",
    "name": "Driveway Slope",
    "slug": "driveway-slope",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "rise, run -> %, grade",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1238",
    "name": "Acoustic Panel Count",
    "slug": "acoustic-panel-count",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "room, RT target -> panels",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1239",
    "name": "Kitchen Ventilation",
    "slug": "kitchen-ventilation",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "appliance load, hood -> CFM",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1240",
    "name": "Sign Area and Permit Limit",
    "slug": "sign-area-permit",
    "category": "C83",
    "categoryLabel": "Specialised Trades and Building Services",
    "inputsOutputs": "dims, frontage -> area, ratio",
    "complexity": "Moderate",
    "priority": "P3",
    "formulaStatus": "SPECIALIST_REVIEW_REQUIRED",
    "note": "Sign-code dependent.",
    "intent": "estimate",
    "sources": [],
    "related": [
      "occupancy-load",
      "egress-width",
      "parking-space-count",
      "restroom-fixture-count"
    ]
  },
  {
    "id": "CALC-1241",
    "name": "Number to Words",
    "slug": "number-to-words",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "number, language -> words",
    "complexity": "Moderate",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "roman-numerals",
      "reading-time",
      "typing-speed",
      "character-count"
    ]
  },
  {
    "id": "CALC-1242",
    "name": "Roman Numeral Conversion",
    "slug": "roman-numerals",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "number <-> numeral",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "convert",
    "sources": [],
    "related": [
      "number-to-words",
      "reading-time",
      "typing-speed",
      "character-count"
    ]
  },
  {
    "id": "CALC-1243",
    "name": "Reading Time",
    "slug": "reading-time",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "words, wpm -> minutes",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "typing-speed",
      "character-count"
    ]
  },
  {
    "id": "CALC-1244",
    "name": "Typing Speed",
    "slug": "typing-speed",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "words, time, errors -> WPM, accuracy",
    "complexity": "Simple",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "reading-time",
      "character-count"
    ]
  },
  {
    "id": "CALC-1245",
    "name": "Character Count",
    "slug": "character-count",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "text -> chars, bytes, lines",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "reading-time",
      "typing-speed"
    ]
  },
  {
    "id": "CALC-1246",
    "name": "Word Count",
    "slug": "word-count",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "text -> words, sentences",
    "complexity": "Simple",
    "priority": "P1",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "reading-time",
      "typing-speed"
    ]
  },
  {
    "id": "CALC-1247",
    "name": "Password Entropy",
    "slug": "password-entropy",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "length, charset -> bits",
    "complexity": "Moderate",
    "priority": "P2",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "reading-time",
      "typing-speed"
    ]
  },
  {
    "id": "CALC-1248",
    "name": "QR Code Capacity",
    "slug": "qr-code-capacity",
    "category": "C84",
    "categoryLabel": "Cross-Domain Utilities",
    "inputsOutputs": "version, EC level -> bytes",
    "complexity": "Complex",
    "priority": "P3",
    "formulaStatus": "RESEARCH_REQUIRED",
    "note": "",
    "intent": "calculate",
    "sources": [],
    "related": [
      "number-to-words",
      "roman-numerals",
      "reading-time",
      "typing-speed"
    ]
  }
];
