# -*- coding: utf-8 -*-
# Catalog source of truth for CALCULATOR_MASTER_PLAN_1200_PLUS.md
# Entry tuple: (name, slug, inputs -> outputs, ref_code, complexity, priority, status, note)
# complexity: 1 Simple, 2 Moderate, 3 Complex, 4 Specialist
# priority: 0..3   status: D=DISCOVERED R=RESEARCH_REQUIRED S=SOURCE_VERIFIED
#                 V=INDEPENDENTLY_VALIDATED X=SPECIALIST_REVIEW_REQUIRED
CATEGORIES = []
def cat(code, title, req, families, entries):
    CATEGORIES.append(dict(code=code, title=title, req=req, families=families, entries=entries))

M = "REF-MATH-ELEM"

cat("C01", "Basic Arithmetic and Percentages", "Required topic 1",
"""**F-ARI-01 Percent of a base** `part = p/100 * base`; reverse form `base = part / (p/100)`.
Edge cases: p may be negative; base = 0 is undefined for the reverse form.
**F-ARI-02 Relative change** `change% = (B-A)/|A|*100` (asymmetric, base = A) vs
`symmetric difference% = |A-B|/((A+B)/2)*100`. These are different quantities and must never
be merged: a change from 100 to 120 is +20% change but 18.18% symmetric difference.
**F-ARI-03 Percentage points** `pp = p2 - p1` where p1,p2 are already percentages; cannot be
derived from relative change without the original base.
**F-ARI-04 Successive changes** `net = (1+r1)(1+r2)...-1`; order-independent for multiplication
but NOT for mixed add/subtract-percent workflows applied to a running balance.
**F-ARI-05 Rounding** half-up vs half-even (banker's) vs truncation differ on exact ties;
see REF-IEEE754 for binary floating-point tie behaviour.""",
[
 ("Percentage of a Number","percentage-of-a-number","amount, percent -> portion",M,1,0,"R"),
 ("Percentage Change","percentage-change","old, new -> % change vs old",M,1,0,"R"),
 ("Percentage Difference","percentage-difference","A, B -> % difference vs mean",M,1,0,"R","Distinct from change: symmetric, no base year. Reviewed: not a duplicate."),
 ("Percentage Point Change","percentage-point-change","p1%, p2% -> pp",M,1,0,"R"),
 ("Reverse Percentage","reverse-percentage","final value, % applied -> original",M,1,0,"R"),
 ("Add Percentage to Value","add-percentage","value, % -> increased value",M,1,0,"R"),
 ("Subtract Percentage from Value","subtract-percentage","value, % -> reduced value",M,1,0,"R"),
 ("Successive Percentage Change","successive-percentage-change","list of % changes -> net %",M,2,1,"R"),
 ("Percent Error","percent-error","measured, accepted -> % error",M,1,1,"R"),
 ("Percent of Total (Share)","percent-of-total","parts, total -> shares %",M,1,1,"R"),
 ("Percentage of a Percentage","percent-of-percent","base, %A, %B -> portion",M,1,1,"R"),
 ("Gain Needed to Recover a Loss","recover-loss-gain","loss % -> required gain %",M,1,1,"R"),
 ("Order of Operations Evaluator","order-of-operations","expression -> value",M,2,1,"R"),
 ("Rounding Mode Calculator","rounding-modes","number, places, mode -> rounded",M,1,1,"R"),
])

cat("C02", "Fractions, Ratios, Proportions and Averages", "Required topic 2",
"""**F-FRA-01 Exact rational arithmetic** `a/b + c/d = (ad+cb)/(bd)`, reduced by
`g = gcd(|num|,den)`. Implementation must use exact integers (or BigInt) and only round at
display, otherwise 1/3+1/3+1/3 != 1.
**F-FRA-02 Repeating decimal -> fraction** for `0.\overline{d}` with k repeating digits:
`x = d/(10^k - 1)`; mixed forms require shifting by the non-repeating prefix length.
**F-FRA-03 Means** arithmetic `(Σx)/n`, weighted `Σw·x/Σw`, harmonic `n/Σ(1/x)`,
geometric `(Πx)^(1/n)`. Harmonic is required for averaging rates (e.g. speeds) and geometric
for growth factors; using arithmetic mean there is a documented error.
**F-FRA-04 Proportional sharing** split total T in ratio a:b:c -> `T·a/(a+b+c)`; rounding
residue must be allocated by a stated rule so parts still sum to T.""",
[
 ("Fraction Arithmetic","fraction-arithmetic","two fractions, op -> exact fraction",M,1,0,"R"),
 ("Simplify Fraction","simplify-fraction","num, den -> reduced fraction",M,1,0,"R"),
 ("Mixed Number Converter","mixed-number-converter","mixed <-> improper",M,1,0,"R"),
 ("Fraction to Decimal","fraction-to-decimal","num/den -> decimal, rounding mode",M,1,0,"R"),
 ("Decimal to Fraction","decimal-to-fraction","decimal -> exact fraction",M,1,1,"R"),
 ("Repeating Decimal to Fraction","repeating-decimal-to-fraction","0.dddd... -> fraction",M,2,1,"R"),
 ("Ratio Simplifier","ratio-simplifier","a:b:c -> reduced ratio",M,1,0,"R"),
 ("Ratio to Decimal and Percent","ratio-to-decimal","a:b -> decimal, %",M,1,1,"R"),
 ("Proportion Solver","proportion-solver","a/b = c/x -> x",M,1,0,"R"),
 ("Drawing Scale Converter","drawing-scale","scale 1:n, measured -> real length",M,1,1,"R"),
 ("Arithmetic Mean","arithmetic-mean","numbers -> mean, sum, count",M,1,0,"R"),
 ("Weighted Average","weighted-average","values, weights -> weighted mean",M,1,1,"R"),
 ("Average of Averages","average-of-averages","group means, sizes -> pooled mean",M,2,1,"R"),
 ("Harmonic Mean","harmonic-mean","rates/values -> harmonic mean",M,2,2,"R"),
 ("Geometric Mean","geometric-mean","growth factors -> geometric mean",M,2,1,"R"),
 ("Unit Rate","unit-rate","quantity, cost/time -> per-unit rate",M,1,1,"R"),
 ("Proportional Share Split","proportional-split","total, ratio -> shares",M,1,1,"R"),
])

cat("C03", "Algebra and Equation Solving", "Required topic 3",
"""**F-ALG-01 Quadratic** `x = (-b ± sqrt(b²-4ac))/(2a)`, discriminant `D = b²-4ac` decides
0/1/2 real roots; a=0 is not quadratic and must be rejected, not silently linear-solved.
Use the numerically stable form (`q = -(b + sign(b)sqrt(D))/2`) to avoid catastrophic
cancellation when `b² >> 4ac`.
**F-ALG-02 Linear systems** Gaussian elimination with partial pivoting; singular or
near-singular matrices must report condition, not a fake answer.
**F-ALG-03 Logarithms** `log_b(x)` defined only for x>0, b>0, b≠1; implement as
`ln x / ln b` and special-case b=10, b=2, b=e.
**F-ALG-04 nth roots** odd roots of negative reals are real (`(-8)^(1/3) = -2`); even roots
are not. JavaScript `Math.pow` returns NaN for negative base with fractional exponent.""",
[
 ("Quadratic Equation Solver","quadratic-solver","a,b,c -> roots, discriminant",M,2,0,"R"),
 ("Cubic Equation Solver","cubic-solver","a,b,c,d -> real/complex roots",M,3,2,"R"),
 ("Linear Equation Solver","linear-equation-solver","ax+b=c -> x",M,1,0,"R"),
 ("Two-Variable Linear System","two-equation-system","2 equations -> x,y",M,2,1,"R"),
 ("Three-Variable Linear System","three-equation-system","3 equations -> x,y,z",M,3,2,"R"),
 ("Polynomial Evaluator","polynomial-evaluator","coefficients, x -> value",M,1,1,"R"),
 ("Nth Root Calculator","nth-root","x, n -> real root",M,2,1,"R"),
 ("Exponent and Power Calculator","exponent-power","base, exponent -> power",M,1,0,"R"),
 ("Logarithm Calculator","logarithm","x, base -> log",M,1,1,"R"),
 ("Antilog / Exponential Solver","antilog-exponential","log value, base -> x",M,1,1,"R"),
 ("Radical Simplifier","radical-simplifier","sqrt(n) -> a·sqrt(b)",M,2,2,"R"),
 ("Linear Inequality Solver","linear-inequality","ax+b < c -> interval",M,2,2,"R"),
 ("Absolute Value Equation Solver","absolute-value-equation","abs(ax+b) = c -> roots",M,2,2,"R"),
 ("Direct and Inverse Variation","variation-solver","k, x -> y (direct/inverse)",M,1,2,"R"),
])

cat("C04", "Geometry and Mensuration", "Required topic 4",
"""**F-GEO-01 Circle** `A = πr²`, `C = 2πr`, `d = 2r`; use r>0. Sector:
`A = ½r²θ` with θ in radians, arc `s = rθ`.
**F-GEO-02 Triangle** Heron `A = sqrt(s(s-a)(s-b)(s-c))`, `s=(a+b+c)/2`; validity requires
the triangle inequality `a+b>c` etc. A degenerate (collinear) input returns 0, not an error
value from a negative radicand.
**F-GEO-03 Solids** sphere `V=4/3πr³, S=4πr²`; cylinder `V=πr²h`; cone `V=1/3πr²h`;
frustum `V = (πh/3)(R²+Rr+r²)`; pyramid `V=Ah/3`; torus `V=2π²Rr²`.
**F-GEO-04 Polygon by coordinates** shoelace `A = ½|Σ(x_i·y_{i+1} - x_{i+1}·y_i)|`;
self-intersecting polygons must be rejected or documented.
Rounding policy: state significant figures and never round intermediate values.""",
[
 ("Circle Area and Circumference","circle-area","radius/diameter -> A, C",M,1,0,"R"),
 ("Triangle Area (Heron)","triangle-area-heron","3 sides -> area, angles",M,1,0,"R"),
 ("Pythagorean Theorem","pythagorean-theorem","2 sides -> hypotenuse/leg",M,1,0,"R"),
 ("Rectangle and Square","rectangle-area","sides -> A, P, diagonal",M,1,0,"R"),
 ("Parallelogram","parallelogram-area","base, height, side -> A, P",M,1,0,"R"),
 ("Trapezoid","trapezoid-area","parallel sides, height -> A",M,1,0,"R"),
 ("Kite and Rhombus","kite-rhombus-area","diagonals -> A, P",M,1,1,"R"),
 ("Regular Polygon","regular-polygon","n sides, side/apothem -> A, P",M,1,1,"R"),
 ("Sector and Arc","sector-arc","radius, angle -> arc, sector A",M,1,1,"R"),
 ("Ellipse","ellipse","a, b -> A, P (Ramanujan)",M,2,1,"R"),
 ("Sphere","sphere","r -> V, S",M,1,1,"R"),
 ("Cylinder","cylinder","r, h -> V, lateral, total S",M,1,1,"R"),
 ("Cone","cone","r, h -> V, slant, S",M,1,1,"R"),
 ("Conical Frustum","frustum-cone","R, r, h -> V, S",M,2,2,"R"),
 ("Pyramid","pyramid","base area, h -> V, S",M,2,2,"R"),
 ("Cuboid and Prism","cuboid-prism","dimensions -> V, S",M,1,1,"R"),
 ("Torus","torus","R, r -> V, S",M,2,3,"R"),
 ("Polygon Area from Coordinates","polygon-shoelace","vertices -> area, perimeter",M,2,2,"R"),
 ("Distance and Midpoint","distance-midpoint","2 points -> distance, midpoint",M,1,0,"R"),
 ("Box Space Diagonal","box-diagonal","l,w,h -> diagonal",M,1,1,"R"),
 ("Triangle Inradius and Circumradius","triangle-inradius","3 sides, area -> r, R",M,2,2,"R"),
 ("Circle Segment Area","circle-segment","radius, chord/angle -> segment A",M,2,2,"R"),
 ("Annulus","annulus","outer, inner radius -> A",M,1,1,"R"),
])

cat("C05", "Trigonometry", "Required topic 5",
"""**F-TRI-01 Right triangle** `sin θ = opp/hyp`, `cos θ = adj/hyp`, `tan θ = opp/adj`;
inverse functions return a principal value — the caller must resolve the quadrant.
**F-TRI-02 Law of sines** `a/sin A = b/sin B = c/sin C = 2R`; the ambiguous SSA case has
0, 1 or 2 solutions and must be surfaced explicitly.
**F-TRI-03 Law of cosines** `c² = a² + b² - 2ab cos C`; angle from
`cos C = (a²+b²-c²)/(2ab)`; guard `|cos|>1` from floating-point error.
**F-TRI-04 Degree/radian/grad** `rad = deg·π/180`, `grad = deg·10/9`. Never mix angle units
between an input field and a trig function — the classic unit bug.
**F-TRI-05 Chord/sagitta** `c = 2r sin(θ/2)`, sagitta `h = r(1 - cos(θ/2))`.""",
[
 ("Right Triangle Solver","right-triangle-solver","2 of (a,b,c,angle) -> all",M,2,0,"R"),
 ("Law of Sines","law-of-sines","angles, side -> unknown sides",M,2,1,"R"),
 ("Law of Cosines","law-of-cosines","3 sides or SAS -> angle/side",M,2,1,"R"),
 ("Triangle Area from SAS","triangle-area-sas","2 sides, included angle -> A",M,1,1,"R"),
 ("Angle Unit Converter","angle-unit-converter","deg/rad/grad/turn -> all",M,1,0,"R"),
 ("Trigonometric Function Values","trig-function-values","angle -> sin..tan, exact",M,1,1,"R"),
 ("Inverse Trigonometric Functions","inverse-trig","ratio -> angle (principal)",M,1,1,"R"),
 ("Hyperbolic Functions","hyperbolic-functions","x -> sinh, cosh, tanh...",M,2,2,"R"),
 ("Oblique Triangle Solver","oblique-triangle-solver","any 3 parts -> all (SSA cases)",M,3,2,"R"),
 ("Chord, Sagitta and Arc","chord-sagitta","radius, angle -> chord, sagitta",M,2,2,"R"),
 ("Sine Wave Parameters","sine-wave-params","amplitude, period, phase -> equation",M,2,2,"R"),
 ("Trigonometric Identity Checker","trig-identity-check","expression pair -> equal?",M,3,3,"R"),
])

cat("C06", "Calculus and Numerical Methods", "Required topic 6",
"""**F-CAL-01 Numerical derivative** central difference
`f'(x) ≈ (f(x+h) - f(x-h))/(2h)` with h scaled to `sqrt(ε)·max(1,|x|)`; forward difference
is O(h) and must not be presented as equally accurate.
**F-CAL-02 Quadrature** composite Simpson `h/3[f0+4Σodd+2Σeven+fn]` requires an even number
of intervals; trapezoid `h/2[f0+2Σf+fn]`. Report the method and n, because the result is
method-dependent.
**F-CAL-03 Root finding** bisection needs a sign change on [a,b]; Newton-Raphson needs f'
and can diverge or cycle; always return iteration count and residual.
**F-CAL-04 ODE** explicit Euler `y_{n+1}=y_n+h·f(t,y)` is first order; RK4 is fourth order.
Do not label Euler output as "the solution" — it is an approximation with stated step size.""",
[
 ("Numerical Derivative","numerical-derivative","f(x), x -> f'(x)",M,3,2,"R"),
 ("Symbolic Derivative","symbolic-derivative","expression -> derivative",M,4,3,"R"),
 ("Definite Integral (Simpson)","integral-simpson","f, a, b, n -> area",M,3,2,"R"),
 ("Definite Integral (Trapezoid)","integral-trapezoid","f, a, b, n -> area",M,3,2,"R"),
 ("Riemann Sum","riemann-sum","f, interval, rule -> estimate",M,2,2,"R"),
 ("Limit Estimate","limit-numeric","f, approach point -> L",M,3,3,"R"),
 ("Taylor Series Expansion","taylor-series","f, centre, order -> polynomial",M,4,3,"R"),
 ("Newton-Raphson Root","newton-raphson","f, f', x0 -> root, iterations",M,3,2,"R"),
 ("Bisection Root","bisection-root","f, [a,b] -> root, iterations",M,2,2,"R"),
 ("Secant Method Root","secant-root","f, x0, x1 -> root",M,2,2,"R"),
 ("Function Extremum Finder","extremum-finder","f, interval -> min/max",M,3,3,"R"),
 ("Arc Length of a Curve","arc-length-curve","f, interval -> length",M,3,3,"R"),
 ("Volume of Revolution","volume-revolution","f, interval, axis -> volume",M,3,3,"R"),
 ("Euler Method ODE","euler-ode","y'=f, y0, h, steps -> y(t)",M,3,3,"R"),
 ("Runge-Kutta 4 ODE","rk4-ode","y'=f, y0, h, steps -> y(t)",M,3,3,"R"),
 ("Lagrange Interpolation","lagrange-interpolation","points -> polynomial value",M,3,3,"R"),
])

cat("C07", "Matrices, Vectors and Linear Algebra", "Required topic 7",
"""**F-LIN-01 Matrix product** `C_ij = Σ_k A_ik·B_kj`, defined only when
cols(A) = rows(B); dimensions must be validated before the loop.
**F-LIN-02 Determinant** 2x2 `ad-bc`; general case via LU with partial pivoting — the product
of pivots equals det up to sign flips from row swaps. Never use the cofactor expansion
recursively for n>6 (O(n!)).
**F-LIN-03 Inverse** `A⁻¹ = adj(A)/det(A)` exists iff det ≠ 0; report the condition number
rather than a numerically meaningless inverse for ill-conditioned matrices.
**F-LIN-04 Dot/cross** `a·b = |a||b|cos θ`; `|a×b| = |a||b|sin θ` gives the parallelogram
area; cross product is 3-D only.""",
[
 ("Matrix Multiplication","matrix-multiply","A(m×n), B(n×p) -> C",M,2,1,"R"),
 ("Matrix Addition and Subtraction","matrix-add-subtract","same-shape matrices -> sum",M,1,1,"R"),
 ("Matrix Determinant","matrix-determinant","square matrix -> det",M,2,2,"R"),
 ("Matrix Inverse","matrix-inverse","square matrix -> A^-1, det",M,3,2,"R"),
 ("Matrix Transpose and Trace","matrix-transpose-trace","matrix -> A^T, trace",M,1,1,"R"),
 ("Matrix Rank","matrix-rank","matrix -> rank, basis",M,3,3,"R"),
 ("Solve Linear System by Matrix","matrix-solve-system","A, b -> x",M,3,2,"R"),
 ("Eigenvalues 2x2","eigenvalues-2x2","2x2 -> λ1, λ2, vectors",M,3,3,"R"),
 ("Eigenvalues 3x3","eigenvalues-3x3","3x3 -> λ, vectors",M,4,3,"R"),
 ("Vector Dot Product","vector-dot","2 vectors -> dot, angle",M,1,1,"R"),
 ("Vector Cross Product","vector-cross","2 3-D vectors -> cross vector, magnitude",M,2,2,"R"),
 ("Vector Magnitude and Unit Vector","vector-magnitude","vector -> magnitude, unit vector",M,1,1,"R"),
 ("Vector Projection and Angle","vector-projection","a, b -> proj, angle",M,2,2,"R"),
 ("Matrix Power","matrix-power","A, n -> A^n",M,3,3,"R"),
])

cat("C08", "Statistics and Probability", "Required topic 8",
"""**F-STA-01 Dispersion** population `σ² = Σ(x-μ)²/N` vs sample `s² = Σ(x-x̄)²/(n-1)`.
Mixing the two is the most common statistics defect; the UI must ask which is intended and
state it in the output label.
**F-STA-02 Correlation/regression** Pearson `r = Σ(x-x̄)(y-ȳ) / sqrt(Σ(x-x̄)²Σ(y-ȳ)²)`;
slope `b1 = r·sy/sx`, intercept `b0 = ȳ - b1x̄`. r is not causation and r² is the explained
variance, not the model's validity.
**F-STA-03 Normal distribution** `Φ(z)` has no elementary closed form; use an erfc-based
implementation, not a lookup table with linear interpolation. Inverse normal needs a
rational approximation (Acklam/Moro) with stated accuracy.
**F-STA-04 Confidence interval for a mean** `x̄ ± t_{α/2,n-1}·s/√n`; use z only when σ is
known or n is large, and say which was used.
**F-STA-05 Sample size** `n = (z²·p(1-p))/E²` for a proportion (Cochran); finite-population
correction `n_adj = n / (1 + (n-1)/N)`.""",
[
 ("Mean Calculator","mean","dataset -> mean, sum, n",M,1,0,"R"),
 ("Median and Quartiles","median-quartiles","dataset -> Q1, Q2, Q3",M,1,0,"R"),
 ("Mode and Frequency","mode-frequency","dataset -> mode(s), counts",M,1,1,"R"),
 ("Variance and Standard Deviation","variance-stddev","dataset, pop/sample -> s², s",M,2,0,"R"),
 ("Coefficient of Variation","coefficient-of-variation","dataset -> CV%",M,2,2,"R"),
 ("Z-Score","z-score","x, mean, sd -> z, percentile",M,1,1,"R"),
 ("Percentile Rank","percentile-rank","dataset, value -> percentile",M,2,2,"R"),
 ("Skewness and Kurtosis","skewness-kurtosis","dataset -> skew, kurtosis",M,3,3,"R"),
 ("Covariance","covariance","paired data -> cov (pop/sample)",M,2,2,"R"),
 ("Pearson Correlation","pearson-correlation","x, y -> r, r², p",M,2,1,"R"),
 ("Spearman Rank Correlation","spearman-correlation","x, y -> ρ",M,3,3,"R"),
 ("Simple Linear Regression","linear-regression","x, y -> slope, intercept, r²",M,2,2,"R"),
 ("Multiple Linear Regression","multiple-regression","X, y -> coefficients",M,4,3,"R"),
 ("Outlier Detection (IQR Rule)","outlier-iqr","dataset -> outliers, fences",M,2,2,"R"),
 ("Normal Distribution CDF","normal-cdf","x, μ, σ -> P, percentile",M,3,2,"R"),
 ("Inverse Normal","inverse-normal","p, μ, σ -> x",M,3,3,"R"),
 ("Student t Distribution","t-distribution","t, df -> p",M,3,3,"R"),
 ("Chi-Square Test","chi-square-test","observed, expected -> χ², p",M,3,3,"R"),
 ("Binomial Probability","binomial-probability","n, k, p -> P(X=k)",M,2,2,"R"),
 ("Poisson Probability","poisson-probability","λ, k -> P(X=k)",M,2,2,"R"),
 ("Exponential Distribution","exponential-distribution","λ, x -> pdf, cdf",M,2,3,"R"),
 ("Confidence Interval for a Mean","confidence-interval-mean","x̄, s, n, CL -> CI",M,3,2,"R"),
 ("Confidence Interval for a Proportion","confidence-interval-proportion","p̂, n, CL -> CI",M,3,2,"R"),
 ("Sample Size Calculator","sample-size","margin, CL, p -> n",M,3,2,"R"),
 ("Margin of Error","margin-of-error","n, CL, p -> ±E",M,2,2,"R"),
])

cat("C09", "Discrete Mathematics, Combinatorics and Number Theory", "Required topics 9, 10",
"""**F-DIS-01 Counting** permutations `P(n,r)=n!/(n-r)!`; combinations `C(n,r)=n!/(r!(n-r)!)`;
with repetition `C(n+r-1,r)`. Use log-gamma or iterative products — direct factorials
overflow IEEE-754 doubles at 171!.
**F-DIS-02 Divisibility** `gcd(a,b)` by Euclid; `lcm = |ab|/gcd`; prime factorisation by
trial division to sqrt(n) is adequate only for n below the stated bound (state it).
**F-DIS-03 Modular arithmetic** `modpow` by square-and-multiply so results stay exact in
BigInt; modular inverse exists iff gcd(a,m)=1.
**F-DIS-04 Sequences** arithmetic `a_n = a_1+(n-1)d`; geometric `a_n = a_1 r^(n-1)`;
sum forms differ and both must guard r=1.""",
[
 ("Permutations","permutations","n, r -> P(n,r)",M,1,1,"R"),
 ("Combinations","combinations","n, r -> C(n,r)",M,1,1,"R"),
 ("Combinations with Repetition","combinations-repetition","n, r -> C(n+r-1,r)",M,2,2,"R"),
 ("Factorial","factorial","n -> n!",M,1,1,"R"),
 ("Multinomial Coefficient","multinomial","group sizes -> count",M,2,2,"R"),
 ("GCD and LCM","gcd-lcm","2+ integers -> gcd, lcm",M,1,0,"R"),
 ("Prime Factorisation","prime-factorisation","integer -> factors, exponents",M,2,1,"R"),
 ("Primality Test","primality-test","integer -> prime?",M,2,2,"R"),
 ("Primes in a Range","primes-in-range","limit -> prime list, count",M,2,2,"R"),
 ("Divisor Count and Sum","divisors-count","integer -> τ(n), σ(n)",M,2,2,"R"),
 ("Euler Totient","euler-totient","n -> φ(n)",M,3,3,"R"),
 ("Modular Exponentiation","modular-exponentiation","base, exp, mod -> result",M,2,3,"R"),
 ("Modular Inverse","modular-inverse","a, m -> a^-1 mod m",M,3,3,"R"),
 ("Integer Division and Remainder","integer-division","a, b -> q, r",M,1,0,"R"),
 ("Arithmetic Sequence","arithmetic-sequence","a1, d, n -> a_n, sum",M,1,1,"R"),
 ("Geometric Sequence","geometric-sequence","a1, r, n -> a_n, sum",M,1,1,"R"),
 ("Fibonacci Sequence","fibonacci","n -> F(n), list",M,2,2,"R"),
 ("Catalan Number","catalan","n -> C_n",M,2,3,"R"),
 ("Derangements","derangements","n -> !n",M,2,3,"R"),
 ("Power Set Size","power-set-size","set size -> subsets",M,1,2,"R"),
])

cat("C10", "Interest, Time Value of Money and Discounting", "Required topic 11",
"""**F-FIN-01 Simple interest** `I = P·r·t` with t in years; simple discount uses
`P = F/(1+rt)`. Only valid when interest is not capitalised.
**F-FIN-02 Compound interest** `FV = P(1+r/m)^(mt)`; continuous `FV = Pe^(rt)`;
effective annual rate `EAR = (1+r/m)^m - 1`, continuous `EAR = e^r - 1`.
**F-FIN-03 Annuities** ordinary `FV = PMT[((1+i)^n - 1)/i]`,
`PV = PMT[(1-(1+i)^-n)/i]`; annuity-due multiplies by (1+i); `i=0` is a removable
singularity that must be special-cased or the formula divides by zero.
**F-FIN-04 NPV/IRR** `NPV = Σ CF_t/(1+r)^t`; IRR solves NPV=0 by iteration and may have
multiple roots when cash flows change sign more than once — report all roots in range.
**F-FIN-05 Fisher relation** real return `(1+r_nom)/(1+π) - 1`, not `r_nom - π` (that is
only an approximation, accurate to ~1% when rates are low).""",
[
 ("Simple Interest","simple-interest","P, r, t -> interest, total",M,1,0,"R"),
 ("Compound Interest","compound-interest","P, r, compounding, t -> FV",M,2,0,"R"),
 ("Continuous Compounding","continuous-compounding","P, r, t -> FV",M,2,1,"R"),
 ("Effective Annual Rate","effective-annual-rate","nominal, m -> EAR",M,2,1,"R"),
 ("Nominal Rate Converter","nominal-rate-converter","EAR <-> nominal",M,2,2,"R"),
 ("Future Value of Lump Sum","future-value-lumpsum","PV, r, n -> FV",M,1,0,"R"),
 ("Present Value of Lump Sum","present-value-lumpsum","FV, r, n -> PV",M,1,0,"R"),
 ("Future Value of Annuity","annuity-future-value","PMT, r, n -> FV",M,2,1,"R"),
 ("Present Value of Annuity","annuity-present-value","PMT, r, n -> PV",M,2,1,"R"),
 ("Annuity Payment","annuity-payment","PV, r, n -> PMT",M,2,1,"R"),
 ("Perpetuity Present Value","perpetuity-present-value","PMT, r -> PV",M,1,2,"R"),
 ("Growing Perpetuity","growing-perpetuity","PMT, r, g -> PV",M,2,2,"R"),
 ("Annuity Due","annuity-due","PMT, r, n -> FV, PV",M,2,2,"R"),
 ("Net Present Value","npv","cash flows, discount rate -> NPV",M,2,1,"R"),
 ("Internal Rate of Return","irr","cash flows -> IRR",M,3,2,"R"),
 ("CAGR","cagr","begin, end, years -> CAGR",M,1,0,"R"),
 ("Doubling Time","doubling-time","growth rate -> exact t, rule of 72",M,1,1,"R"),
 ("Real Return (Fisher)","real-return","nominal, inflation -> real",M,2,2,"R"),
 ("Inflation-Adjusted Value","inflation-adjusted-value","amount, rate, years -> real",M,2,2,"R"),
 ("Discount Factor","discount-factor","rate, period -> DF, PV",M,1,1,"R"),
])

cat("C11", "Loans, Amortisation and Credit", "Required topic 12",
"""**F-LOAN-01 Amortising payment** `PMT = P·i/(1-(1+i)^-n)` where `i = APR/12` is the
monthly periodic rate. The nominal-APR-to-periodic-rate convention differs by jurisdiction
(US nominal APR/12 vs EU effective/compounded) — the calculator must state which it uses.
**F-LOAN-02 Amortisation table** each row: interest = balance·i; principal = PMT - interest;
balance' = balance - principal. Final payment must be truncated to clear the balance exactly
(floating-point residue otherwise leaves ±1 cent).
**F-LOAN-03 APR vs flat rate** flat (add-on) rate applies interest to the original principal
for the full term, so a 5% flat rate ≈ 1.8× the true annual cost at 60 months. Converting
flat -> APR requires solving for the rate that amortises the same payment.
**F-LOAN-04 US APR disclosure** follows Reg Z Appendix J: actuarial method, unit-period rules,
APR = unit-period rate × unit-periods per year. Any calculator labelled "APR (US Reg Z)" must
implement Appendix J, not an approximation.
**F-LOAN-05 Affordability** DTI = total monthly debt / gross monthly income; thresholds are
lender-specific and must not be presented as approval criteria.""",
[
 ("Loan Payment","loan-payment","principal, rate, term -> PMT",M,2,0,"R"),
 ("Amortisation Schedule","amortisation-schedule","loan -> per-period table",M,2,0,"R"),
 ("Total Interest Paid","total-interest-paid","loan -> total interest",M,1,0,"R"),
 ("Loan Payoff with Extra Payments","extra-payment-payoff","loan, extra -> months saved",M,2,1,"R"),
 ("Biweekly Payment","biweekly-payment","loan -> biweekly, savings",M,2,1,"R"),
 ("Balloon Payment Loan","balloon-payment","loan, balloon -> PMT, final",M,2,2,"R"),
 ("Interest-Only Payment","interest-only-payment","principal, rate -> monthly",M,1,1,"R"),
 ("Credit Card Payoff Time","credit-card-payoff","balance, APR, payment -> months",M,2,1,"R"),
 ("Minimum Payment Payoff","minimum-payment-time","balance, APR, %min -> months, interest",M,3,2,"R"),
 ("APR from Fees","apr-from-fees","amount, fees, schedule -> APR",M,3,2,"S","Anchored on CFPB Reg Z App. J method; full numeric solver still to be validated."),
 ("APR to Periodic Rate","apr-periodic-rate","APR, frequency -> monthly rate",M,1,1,"R"),
 ("Add-On Interest Rate","add-on-interest","principal, flat rate, term -> payment, true APR",M,2,2,"R"),
 ("Flat vs Reducing Balance","flat-vs-reducing","loan terms -> cost comparison",M,2,2,"R"),
 ("Loan Affordability (DTI)","loan-affordability","income, debts -> max payment",M,2,1,"R"),
 ("Debt Snowball","debt-snowball","debts, extra -> payoff order, date",M,3,2,"R"),
 ("Debt Avalanche","debt-avalanche","debts, extra -> interest saved",M,3,2,"R"),
 ("Student Loan Repayment","student-loan-payment","balance, rate, plan -> payment",M,3,2,"R"),
 ("Auto Lease Payment","auto-lease-payment","cap cost, residual, money factor -> PMT",M,2,2,"R"),
 ("HELOC Payment","heloc-payment","draw, rate, period -> payment",M,2,2,"R"),
 ("Prepayment Penalty Cost","prepayment-penalty","balance, penalty -> cost",M,1,2,"R"),
])

cat("C12", "Mortgages and Property Finance", "Required topic 21",
"""**F-MTG-01 P&I** uses F-LOAN-01 with monthly compounding; PITI adds property tax,
homeowner insurance and (if applicable) mortgage insurance, each with its own basis
(annual/12, loan-to-value dependent).
**F-MTG-02 PMI** conventional US mortgage insurance is typically required above 80% LTV and
removable at 78-80% LTV by servicer/statute; the rate is credit- and program-specific, so the
calculator must expose the rate as an input, not invent one.
**F-MTG-03 Refinance break-even** `months = total closing costs / monthly saving`; ignores
term extension, which changes total interest even when the payment falls.
**F-MTG-04 Points** one point = 1% of loan amount; break-even months = cost / monthly saving.
**F-MTG-05 Rent vs buy** requires an opportunity-cost assumption, holding period and
transaction costs; output must be labelled a model, not advice.""",
[
 ("Mortgage Payment (P&I)","mortgage-payment","loan, rate, term -> monthly P&I",M,2,0,"R"),
 ("Mortgage Payment with Taxes and Insurance","mortgage-piti","loan + tax + ins + PMI -> PITI",M,2,0,"R"),
 ("PMI Cost","pmi-cost","loan, LTV, rate -> monthly PMI",M,2,1,"R"),
 ("Loan-to-Value Ratio","ltv","loan, value -> LTV%",M,1,0,"R"),
 ("Combined LTV","cltv","first, second lien, value -> CLTV",M,1,2,"R"),
 ("Home Affordability","home-affordability","income, debts, rate -> max price",M,3,1,"R"),
 ("Refinance Break-Even","refinance-breakeven","costs, payment saving -> months",M,2,1,"R"),
 ("Refinance Lifetime Savings","refinance-savings","old/new loan -> total saving",M,3,2,"R"),
 ("Cash-Out Refinance","cash-out-refinance","value, LTV, balance -> cash available",M,2,2,"R"),
 ("Mortgage Points Break-Even","mortgage-points","points, rate change -> months",M,2,2,"R"),
 ("ARM Payment Reset","arm-reset","balance, new rate, remaining -> new PMT",M,2,3,"R"),
 ("Mortgage Payoff Date","mortgage-payoff-date","loan, extra -> payoff date",M,2,1,"R"),
 ("Extra Principal Savings","extra-principal-savings","loan, extra -> interest saved",M,2,1,"R"),
 ("Rent vs Buy","rent-vs-buy","rent, price, horizon -> comparison",M,4,2,"X","Assumption-heavy model; requires editorial review of default assumptions."),
 ("Closing Costs Estimate","closing-costs","price, rate, fees -> total cash",M,2,2,"R"),
 ("Down Payment Calculator","down-payment","price, LTV -> cash needed",M,1,0,"R"),
])

cat("C13", "Investments, Returns and Portfolio Analysis", "Required topic 13",
"""**F-INV-01 Holding period return** `HPR = (End - Begin + Income)/Begin`; annualise with
`(1+HPR)^(1/years) - 1`. Do not annualise a sub-year return by simple multiplication without
saying so.
**F-INV-02 Risk-adjusted** Sharpe `(Rp - Rf)/σp` (σ of excess returns), Sortino uses
downside deviation, Treynor uses beta. Their inputs are not interchangeable.
**F-INV-03 CAPM** `E(R) = Rf + β(E(Rm) - Rf)`; beta from regression of asset on market
returns. WACC `= E/V·Re + D/V·Rd(1-T)`.
**F-INV-04 Bonds** price `= Σ C/(1+y)^t + F/(1+y)^n`; YTM by root-finding; Macaulay duration
`= Σ t·PV(CF_t)/Price`, modified duration `= D/(1+y/f)`. Clean vs dirty price and day-count
convention (30/360, ACT/365) must be stated.
**F-INV-05 Fee drag** a 1% annual fee compounds: over 30 years it removes ~26% of terminal
value at 7% gross — calculators must compound fees, not subtract them once.""",
[
 ("Return on Investment","roi","gain, cost -> ROI%",M,1,0,"R"),
 ("Holding Period Return","holding-period-return","begin, end, income -> HPR",M,2,1,"R"),
 ("Annualised Return","annualized-return","HPR, years -> CAGR",M,2,1,"R"),
 ("Sharpe Ratio","sharpe-ratio","returns, Rf -> Sharpe",M,3,2,"R"),
 ("Sortino Ratio","sortino-ratio","returns, target -> Sortino",M,3,3,"R"),
 ("Beta","beta","asset, market returns -> β",M,3,2,"R"),
 ("Jensen Alpha","jensen-alpha","returns, β, market -> α",M,3,3,"R"),
 ("Maximum Drawdown","max-drawdown","price series -> MDD, dates",M,2,2,"R"),
 ("Portfolio Expected Return","portfolio-expected-return","weights, returns -> E(R)",M,2,1,"R"),
 ("Two-Asset Portfolio Variance","portfolio-variance-2asset","weights, σ, ρ -> σp",M,3,2,"R"),
 ("CAPM Required Return","capm","Rf, β, Rm -> E(R)",M,2,2,"R"),
 ("WACC","wacc","E, D, Re, Rd, tax -> WACC",M,3,2,"R"),
 ("Dividend Yield","dividend-yield","dividend, price -> yield%",M,1,1,"R"),
 ("Gordon Growth Model","gordon-growth","D1, r, g -> value",M,2,2,"R"),
 ("Price-to-Earnings Ratio","pe-ratio","price, EPS -> P/E",M,1,1,"R"),
 ("PEG Ratio","peg-ratio","P/E, growth -> PEG",M,1,2,"R"),
 ("Earnings Per Share","eps","net income, shares -> EPS",M,1,1,"R"),
 ("Return on Equity","roe","net income, equity -> ROE%",M,1,1,"R"),
 ("Bond Price","bond-price","face, coupon, y, n -> price",M,3,2,"R"),
 ("Bond Yield to Maturity","ytm","price, coupon, n -> YTM",M,3,2,"R"),
 ("Current Yield","current-yield","coupon, price -> yield%",M,1,2,"R"),
 ("Macaulay Duration","macaulay-duration","cash flows, y -> duration",M,3,3,"R"),
 ("Modified Duration","modified-duration","Macaulay, y, f -> modified",M,3,3,"R"),
 ("Dollar-Cost Averaging","dollar-cost-averaging","contribution, prices -> shares, avg",M,2,2,"R"),
 ("Portfolio Rebalance Trade","rebalancing-trade","holdings, targets -> trades",M,3,2,"R"),
])

cat("C14", "Retirement and Pension Planning", "Required topic 14",
"""**F-RET-01 Accumulation** `FV = PMT[((1+i)^n-1)/i] + PV(1+i)^n` with real or nominal
returns, stated explicitly. Withdrawal phase is the same formula solved for PMT.
**F-RET-02 Safe withdrawal** the 4% rule is a historical US result for a 30-year horizon with
a specific asset mix; it is a planning heuristic, not a guarantee, and must be labelled so.
**F-RET-03 US Social Security PIA** verified against SSA for 2027 eligibility:
`0.90·min(AIME,1340) + 0.32·clamp(AIME,1340,8077) + 0.15·max(AIME-8077,0)`, then rounded
DOWN to the next lower $0.10. Bend points are indexed each year and depend on the year of
first eligibility, not the claim year.
**F-RET-04 RMD** `balance / IRS Uniform Lifetime Table factor(age)`; table version and tax
year must be shown.""",
[
 ("Retirement Savings Goal","retirement-savings-goal","income need, years -> corpus",M,3,1,"R"),
 ("Retirement Corpus Projection","retirement-corpus-projection","contributions, return -> FV",M,2,1,"R"),
 ("Safe Withdrawal Rate Test","safe-withdrawal-4pct","corpus, rate, years -> sustainability",M,3,2,"X","Historical heuristic; assumptions must be user-visible."),
 ("Pension Lump Sum vs Annuity","pension-lumpsum-vs-annuity","lump, annuity, rate -> comparison",M,3,2,"R"),
 ("Annuity Payout","annuity-payout","premium, rate, term -> income",M,2,2,"R"),
 ("US Social Security PIA (2027)","ss-pia","AIME, eligibility year -> PIA",M,3,1,"S","Formula and bend points verified on ssa.gov (2027 table); annual refresh required."),
 ("Social Security Claim Age Benefit","ss-claim-age","PIA, claim age -> benefit",M,3,2,"R","Reduction/increase factors vary by birth year; needs SSA table."),
 ("Employer Match Optimiser","employer-match","salary, match formula -> free money",M,2,1,"R"),
 ("Retirement Age Solver","retirement-age-solver","savings, target income -> earliest age",M,3,2,"R"),
 ("Inflation-Adjusted Retirement Income","inflation-adjusted-income","today income, years, CPI -> future",M,2,2,"R"),
 ("Required Minimum Distribution","rmd","balance, age -> RMD",M,2,2,"R"),
 ("Retirement Income Gap","retirement-income-gap","needs, sources -> shortfall",M,2,2,"R"),
])

cat("C15", "Accounting and Bookkeeping", "Required topic 15",
"""**F-ACC-01 Straight-line depreciation** `(cost - salvage)/life`; declining balance
`opening_book_value · (rate/life)` with the rate stated (e.g. 2.0 for double declining);
switch to straight line when it is larger. Sum-of-years `(cost-salvage)·(n-k+1)/S`.
**F-ACC-02 Margins** gross `(revenue-COGS)/revenue`; operating adds opex; net adds
interest and tax. All are ratios of revenue and must not be mixed.
**F-ACC-03 Liquidity** current `CA/CL`; quick `(CA - inventory - prepaid)/CL`.
**F-ACC-04 Turnover and DSO** inventory turnover `COGS/avg inventory`;
DSO `= AR/revenue×days`; cash conversion cycle `= DIO + DSO - DPO`.
Tax depreciation (e.g. MACRS) is a separate statutory schedule and is not interchangeable
with book depreciation.""",
[
 ("Straight-Line Depreciation","depreciation-straight-line","cost, salvage, life -> annual",M,1,0,"R"),
 ("Declining Balance Depreciation","depreciation-declining-balance","cost, rate, life -> schedule",M,2,1,"R"),
 ("Sum-of-Years-Digits Depreciation","depreciation-sum-of-years","cost, salvage, life -> schedule",M,2,2,"R"),
 ("Units-of-Production Depreciation","depreciation-units","cost, units -> per-unit",M,2,2,"R"),
 ("Intangible Amortisation","intangible-amortisation","cost, life -> annual",M,1,2,"R"),
 ("Gross Margin","gross-margin","revenue, COGS -> GM%",M,1,0,"R"),
 ("Operating Margin","operating-margin","revenue, opex -> OM%",M,1,1,"R"),
 ("Net Margin","net-margin","revenue, net income -> NM%",M,1,1,"R"),
 ("Current Ratio","current-ratio","current assets/liabilities -> ratio",M,1,1,"R"),
 ("Quick Ratio","quick-ratio","cash, AR, CL -> acid test",M,1,2,"R"),
 ("Debt-to-Equity Ratio","debt-to-equity","liabilities, equity -> D/E",M,1,1,"R"),
 ("Inventory Turnover","inventory-turnover","COGS, avg inventory -> turns",M,2,2,"R"),
 ("Receivables Turnover and DSO","receivables-turnover","revenue, AR, days -> turns, DSO",M,2,2,"R"),
 ("Cash Conversion Cycle","cash-conversion-cycle","DIO, DSO, DPO -> CCC",M,2,3,"R"),
 ("Working Capital","working-capital","current assets/liabilities -> WC",M,1,1,"R"),
 ("Break-Even Units","break-even-units","fixed cost, price, VC -> units",M,2,0,"R"),
 ("Break-Even Revenue","break-even-revenue","fixed cost, CM% -> revenue",M,2,1,"R"),
])

cat("C16", "Business Pricing, Margin and Profitability", "Required topic 16",
"""**F-PRC-01 Markup vs margin** markup is on cost, margin on price:
`margin = markup/(1+markup)`; `markup = margin/(1-margin)`. Confusing them is the single
most common pricing error; the calculator must show both.
**F-PRC-02 Discount stacking** successive discounts multiply: `net = 1 - Π(1-d_i)`;
20%+10% is 28% off, not 30%.
**F-PRC-03 Break-even with contribution** `Q* = FC/(P - VC)`; requires `P > VC`; if
`P ≤ VC` the answer is "no break-even", not a negative or infinite quantity.
**F-PRC-04 Price elasticity** `E = (%ΔQ)/(%ΔP)`; revenue rises with a price cut only when
`|E| > 1`. Revenue-maximising price is not profit-maximising — margin must be included.""",
[
 ("Markup Calculator","markup","cost, markup% -> price, profit",M,1,0,"R"),
 ("Margin Calculator","margin","price, cost -> margin%",M,1,0,"R"),
 ("Markup to Margin Converter","markup-margin-converter","markup% <-> margin%",M,1,0,"R"),
 ("Cost-Plus Price","cost-plus-price","cost, overhead, margin -> price",M,2,1,"R"),
 ("Target-Margin Price","target-margin-price","cost, target margin -> price",M,2,1,"R"),
 ("Discount Price","discount-price","price, discount% -> sale price",M,1,0,"R"),
 ("Double Discount","double-discount","price, d1, d2 -> net price",M,1,1,"R"),
 ("Contribution Margin per Unit","contribution-margin-unit","price, VC -> CM",M,1,1,"R"),
 ("Price Elasticity of Revenue","price-elasticity-revenue","elasticity, price change -> revenue",M,3,2,"R"),
 ("Price Increase Impact","price-increase-impact","volume, price, elasticity -> profit",M,3,2,"R"),
 ("Wholesale to Retail Price","wholesale-retail-price","cost, channel margins -> retail",M,2,2,"R"),
 ("Margin Chain (Multi-Tier)","margin-chain","tier margins -> cumulative",M,2,2,"R"),
 ("Commission-Based Price","commission-price","cost, commission% -> price",M,2,2,"R"),
 ("Minimum Viable Price","minimum-price","cost, fees, target profit -> floor",M,2,1,"R"),
 ("Unit Economics","unit-economics","revenue, variable, CAC -> contribution",M,2,1,"R"),
 ("Gross Profit","gross-profit","revenue, COGS -> GP",M,1,0,"R"),
 ("Net Profit","net-profit","revenue, all costs -> NP",M,1,0,"R"),
])

cat("C17", "Taxation", "Required topic 17",
"""**F-TAX-01 Sales tax / VAT (single stage)** `tax = price × rate`; tax-inclusive reverse
`base = total/(1+rate)`. Rates are jurisdiction- and date-specific: store them as versioned
data, never hard-code one country's rate into the component.
**F-TAX-02 Progressive income tax** bracket walk:
`tax = Σ_j rate_j × max(0, min(income, top_j) - bottom_j)`; the marginal rate is the top
bracket touched, the effective rate is tax/income. Deductions apply to the base before the
walk. Verified 2026 US single thresholds (10% to $12,400; 12% to $50,400; 22% to $105,700;
24% to $201,775; 32% to $256,225; 35% to $640,600; 37% above) from IRS IR-2025-103.
**F-TAX-03 Capital gains** holding period determines short- vs long-term treatment; the
statutory split and rates differ by jurisdiction and by income.
**F-TAX-04 Never present a tax output as advice.** Every tax page requires: jurisdiction
selector or fixed-jurisdiction label, effective tax year, source URL, last-reviewed date.""",
[
 ("Sales Tax","sales-tax","price, rate -> tax, total",M,1,0,"R"),
 ("VAT Inclusive Price","vat-inclusive","net, rate -> gross",M,1,0,"R"),
 ("VAT Exclusive Price","vat-exclusive","gross, rate -> net, VAT",M,1,0,"R"),
 ("Reverse Tax (From Total)","reverse-tax","total, rate -> base, tax",M,1,1,"R"),
 ("Progressive Income Tax (Generic)","progressive-income-tax","income, brackets -> tax",M,3,1,"R"),
 ("US Federal Income Tax 2026","us-federal-income-tax","income, filing status -> tax",M,3,1,"S","Bracket thresholds verified on irs.gov IR-2025-103 (TY2026); standard deduction verified."),
 ("US Self-Employment Tax","self-employment-tax","net earnings -> SE tax",M,3,2,"R"),
 ("US Corporate Income Tax","corporate-income-tax","taxable income -> tax",M,3,2,"R"),
 ("Capital Gains Tax","capital-gains-tax","proceeds, basis, holding -> tax",M,3,2,"R"),
 ("Dividend Tax","dividend-tax","dividends, bracket -> tax",M,3,2,"R"),
 ("Property Tax","property-tax","assessed value, mill rate -> annual",M,1,1,"R"),
 ("Import Duty","import-duty","value, duty rate, freight -> duty",M,2,2,"R"),
 ("Excise Tax","excise-tax","quantity, specific rate -> tax",M,2,3,"R"),
 ("Marginal vs Effective Rate","marginal-effective-rate","income, brackets -> both",M,2,1,"R"),
 ("After-Tax Return","after-tax-return","return, tax rate -> net",M,1,1,"R"),
 ("Tax Withholding Estimate","withholding-estimate","wage, W-4 params -> withholding",M,4,3,"X","US W-4 algorithm changes frequently; needs SSA/IRS Pub 15-T validation."),
 ("VAT Recovery","vat-recovery","input VAT, output VAT -> recoverable",M,2,2,"R"),
 ("Stamp Duty / Transfer Tax","stamp-duty","price, jurisdiction -> duty",M,2,2,"X","Regional and banded; jurisdiction table required before publication."),
])

cat("C18", "Payroll, Salary and Compensation", "Required topic 76",
"""**F-PAY-01 FLSA overtime (US)** verified on dol.gov: non-exempt employees receive
1.5× the regular rate for hours over 40 in a fixed 168-hour workweek; averaging across weeks
is not permitted; the regular rate includes non-discretionary bonuses (so a blended rate may
apply), which is why a blended-rate calculator is a distinct tool.
**F-PAY-02 Conversions** annual = hourly × hours/week × 52 (state the 52-week convention);
monthly = annual/12; biweekly = annual/26 (not /24). A 4-week month is a different (and
wrong) convention that must be offered only as an explicitly labelled variant.
**F-PAY-03 Net pay** gross − statutory deductions − voluntary deductions; deduction order and
rounding rules are payroll-system specific and must be shown.
**F-PAY-04 Employer cost** gross + employer contributions (social insurance, pension,
insurance); not the same as employee gross cost.""",
[
 ("Gross Pay from Hours","gross-pay-hourly","hours, rate -> gross",M,1,0,"R"),
 ("FLSA Overtime Pay","overtime-flsa","hours, rate -> regular + OT",M,2,0,"S","40-hour/1.5× rule verified on dol.gov; state premium-pay rules are separate."),
 ("Blended Overtime Rate","overtime-blended-rate","base, bonus, hours -> blended OT",M,3,2,"R"),
 ("Salary to Hourly","salary-to-hourly","annual, hours/week -> hourly",M,1,0,"R"),
 ("Hourly to Salary","hourly-to-salary","hourly, hours -> annual",M,1,0,"R"),
 ("Pay Period Converter","pay-period-converter","any frequency -> all",M,1,0,"R"),
 ("Net Pay","net-pay","gross, deductions -> net",M,2,1,"R"),
 ("FICA Payroll Tax","fica-payroll-tax","wages -> employee/employer",M,2,1,"R"),
 ("Take-Home Pay","take-home-pay","salary, state, allowances -> net",M,4,1,"X","Requires jurisdiction-specific withholding tables."),
 ("Bonus Tax","bonus-tax","bonus, method -> net",M,2,2,"R"),
 ("Commission Pay","commission-pay","sales, rate, tier -> pay",M,2,1,"R"),
 ("Shift Differential","shift-differential","hours, base, differential -> pay",M,2,2,"R"),
 ("PTO Accrual","pto-accrual","rate, hours worked -> balance",M,1,1,"R"),
 ("PTO Payout","pto-payout","balance, rate -> payout",M,1,2,"R"),
 ("Severance Pay","severance-pay","tenure, salary, policy -> amount",M,2,2,"R"),
 ("Final Paycheck","final-paycheck","hours, PTO, deductions -> total",M,2,2,"R"),
 ("Pay Raise","pay-raise","current, raise% -> new pay",M,1,0,"R"),
 ("Employer Cost of Employee","employer-cost","salary, contributions -> total cost",M,2,1,"R"),
])

cat("C19", "Economics and Business Analytics", "Required topic 18",
"""**F-ECO-01 Inflation** `CPI ratio`: `rate = (CPI_t/CPI_{t-1} - 1)×100`; purchasing power
`PP = amount × CPI_base/CPI_current`. CPI is an index with a base period and a basket — state
the series and base year.
**F-ECO-02 Elasticity** `E = (ΔQ/Q)/(ΔP/P)`; use the midpoint (arc) form for large changes:
`E = (ΔQ/((Q1+Q2)/2))/(ΔP/((P1+P2)/2))`.
**F-ECO-03 Surplus** consumer `∫(D(p)-p*)`, approximated for linear demand by
`½×base×height`; state the linearity assumption.
**F-ECO-04 GDP** expenditure identity `Y = C + I + G + (X - M)`; growth is real (deflated),
not nominal.""",
[
 ("Inflation Rate (CPI)","inflation-rate","CPI values -> rate",M,1,1,"R"),
 ("Real Wage","real-wage","nominal wage, CPI -> real",M,2,2,"R"),
 ("Purchasing Power","purchasing-power","amount, CPI -> equivalent",M,2,2,"R"),
 ("Price Index","price-index","basket, base year -> index",M,2,2,"R"),
 ("Demand Elasticity (Arc)","demand-elasticity","P1,P2,Q1,Q2 -> E",M,2,2,"R"),
 ("Supply Elasticity","supply-elasticity","P1,P2,Q1,Q2 -> E",M,2,2,"R"),
 ("Consumer Surplus","consumer-surplus","demand line, price -> surplus",M,3,3,"R"),
 ("Producer Surplus","producer-surplus","supply line, price -> surplus",M,3,3,"R"),
 ("GDP Growth Rate","gdp-growth","GDP series -> growth%",M,1,2,"R"),
 ("Unemployment Rate","unemployment-rate","labour force data -> rate",M,1,2,"R"),
 ("PPP Conversion","ppp-conversion","amount, PPP ratio -> equivalent",M,2,3,"R"),
 ("Currency Conversion","currency-conversion","amount, rate -> converted",M,1,1,"R","Static rate input only; live FX requires a licensed data feed."),
 ("Fiscal Multiplier Effect","multiplier-effect","injection, MPC -> total impact",M,2,3,"R"),
])

cat("C20", "Marketing and Advertising Metrics", "Required topic 19",
"""**F-MKT-01 Cost metrics** CPM `= cost/impressions×1000`; CPC `= cost/clicks`;
CPA `= cost/conversions`. Each is a ratio with a different denominator — never convert
between them without impressions, clicks and conversions.
**F-MKT-02 Funnel** CTR `= clicks/impressions`; CVR `= conversions/clicks`;
end-to-end `= conversions/impressions = CTR×CVR`.
**F-MKT-03 Unit economics** CAC `= total S&M spend / new customers`;
LTV (simple) `= ARPU × gross margin × average lifetime`; LTV:CAC is a ratio, not a currency.
**F-MKT-04 Churn and retention** churn `= lost customers / starting customers` over a stated
period; retention `= 1 - churn` only for that same period and cohort definition.
**F-MKT-05 Break-even ROAS** `= 1/gross margin`. At 40% margin, break-even ROAS is 2.5.""",
[
 ("CPM","cpm","cost, impressions -> CPM",M,1,0,"R"),
 ("CPC","cpc","cost, clicks -> CPC",M,1,0,"R"),
 ("CPA","cpa","cost, conversions -> CPA",M,1,0,"R"),
 ("CTR","ctr","clicks, impressions -> CTR%",M,1,0,"R"),
 ("Conversion Rate","conversion-rate","conversions, visits -> CVR%",M,1,0,"R"),
 ("ROAS","roas","revenue, ad spend -> ROAS",M,1,0,"R"),
 ("Marketing ROI","marketing-roi","gross profit, spend -> ROI%",M,2,1,"R"),
 ("Customer Acquisition Cost","cac","spend, new customers -> CAC",M,2,1,"R"),
 ("Customer Lifetime Value","customer-lifetime-value","ARPU, margin, lifetime -> LTV",M,3,1,"R"),
 ("LTV to CAC Ratio","ltv-cac-ratio","LTV, CAC -> ratio",M,2,1,"R"),
 ("Churn Rate","churn-rate","lost, starting -> churn%",M,1,1,"R"),
 ("Retention Rate","retention-rate","cohort -> retention%",M,2,1,"R"),
 ("MRR and ARR","mrr-arr","subscribers, price -> MRR, ARR",M,2,1,"R"),
 ("ARPU","arpu","revenue, users -> ARPU",M,1,1,"R"),
 ("Break-Even ROAS","breakeven-roas","margin -> ROAS needed",M,1,1,"R"),
 ("Funnel Conversion","funnel-conversion","stage counts -> rates",M,2,2,"R"),
 ("Ad Budget from Target CPA","ad-budget-cpa","target CPA, volume -> budget",M,2,2,"R"),
])

cat("C21", "E-commerce and Online Selling", "Required topic 20",
"""**F-ECM-01 Post-fee profit** `net = price - COGS - referral fee - fulfilment - payment fee
- ad cost`. Marketplace fees are category- and region-specific percentages plus fixed
per-order components; they must be user inputs with sourced defaults, not invented constants.
**F-ECM-02 Landed cost** `= goods + freight + duty + insurance + handling`; duty depends on
HS code and origin (jurisdiction-specific).
**F-ECM-03 Break-even units with ad spend** `Q* = (FC + ad spend)/(price - variable cost)`.
**F-ECM-04 Free-shipping threshold** choose the order value where contribution after
shipping still meets the target margin.""",
[
 ("Marketplace Fee Profit","marketplace-fee-profit","price, fees -> net profit",M,2,1,"R"),
 ("Landed Cost","landed-cost","goods, freight, duty -> total",M,2,1,"R"),
 ("Dropshipping Margin","dropshipping-margin","price, supplier, fees -> margin",M,2,2,"R"),
 ("Break-Even Units with Ad Spend","breakeven-units-ads","FC, ads, CM -> units",M,2,2,"R"),
 ("Discount Profit Impact","discount-profit-impact","price, discount, cost -> profit",M,2,1,"R"),
 ("Bundle Pricing","bundle-pricing","component prices -> bundle price",M,2,2,"R"),
 ("Free Shipping Threshold","free-shipping-threshold","AOV, shipping, margin -> threshold",M,3,2,"R"),
 ("Return Rate Cost","return-rate-cost","returns, shipping -> cost",M,2,2,"R"),
 ("Coupon Stacking","coupon-stacking","coupons -> effective discount",M,2,2,"R"),
 ("Unit Price Comparison","unit-price-comparison","packages -> price per unit",M,1,0,"R"),
 ("Psychological Price Rounding","price-rounding","price, strategy -> rounded",M,1,2,"R"),
 ("Digital Goods VAT","digital-vat","price, buyer country -> VAT",M,3,3,"X","Place-of-supply rules differ per jurisdiction (EU OSS, UK, GCC)."),
 ("Product Cost Markup for Marketplaces","product-cost-markup","target net, fees -> list price",M,3,2,"R"),
])

cat("C22", "Real Estate and Property Investment", "Required topic 21",
"""**F-RE-01 Income metrics** NOI `= gross rent - vacancy - operating expenses` (excludes debt
service and capex); cap rate `= NOI/price`; cash-on-cash `= pre-tax cash flow/cash invested`.
These are different denominators and are frequently conflated.
**F-RE-02 Rule-of-thumb filters** the 1% rule (monthly rent ≥ 1% of price) and 70% rule
(offer ≤ 0.70×ARV − repairs) are screening heuristics from US investor practice, not
valuation methods — label them.
**F-RE-03 Flip profit** `= ARV - purchase - rehab - holding - selling costs - financing`;
holding cost must include taxes, insurance, utilities and interest.
**F-RE-04 Proration** for lease/closing splits use actual days in the month
(`daily = monthly/days_in_month`) — the 30-day convention is a different, jurisdiction-specific
rule and must be selected explicitly.""",
[
 ("Cap Rate","cap-rate","NOI, price -> cap rate",M,2,1,"R"),
 ("Net Operating Income","noi","rent, vacancy, opex -> NOI",M,2,1,"R"),
 ("Gross Rent Multiplier","gross-rent-multiplier","price, gross rent -> GRM",M,1,2,"R"),
 ("Cash-on-Cash Return","cash-on-cash-return","cash flow, invested -> CoC%",M,2,1,"R"),
 ("Rental Yield","rental-yield","rent, price, costs -> gross/net yield",M,2,1,"R"),
 ("Vacancy-Adjusted Income","vacancy-adjusted-income","gross rent, vacancy% -> effective",M,1,2,"R"),
 ("Rental Cash Flow","rental-cash-flow","rent, expenses, debt -> cash flow",M,2,1,"R"),
 ("Property ROI","property-roi","cash flow, appreciation, equity -> ROI",M,3,2,"R"),
 ("Fix-and-Flip Profit","flip-profit","ARV, costs -> profit",M,3,2,"R"),
 ("70% Rule Maximum Offer","seventy-percent-rule","ARV, repairs -> max offer",M,1,2,"R"),
 ("1% Rule Screen","one-percent-rule","rent, price -> pass/fail",M,1,2,"R"),
 ("Rent Increase","rent-increase","current, % -> new rent",M,1,1,"R"),
 ("Agent Commission","agent-commission","price, rate, split -> commission",M,1,1,"R"),
 ("Lease Proration","lease-proration","rent, move dates -> prorated amount",M,2,2,"R"),
 ("Security Deposit Interest","security-deposit","deposit, rate, months -> interest",M,2,3,"R"),
 ("Leveraged Property Return","leverage-roi","equity, mortgage -> levered return",M,3,2,"R"),
])

cat("C23", "Construction Materials and Quantity Takeoff", "Required topic 22",
"""**F-CON-01 Volume** `V = L×W×D` with unit consistency; slab volume in m³ then convert to
bags/yards using the supplier's yield. Waste factor `×(1+w)` is a user input (typical 5-10%),
never a hidden constant.
**F-CON-02 Concrete mix** by mass or volume per a stated mix design (e.g. 1:2:4 cement:sand:
aggregate). Nominal mixes are NOT the same as designed mixes to a strength standard; the tool
must say which. Dry-volume method: `cement bags = V_dry × cement_fraction / bag_yield`.
**F-CON-03 Rebar** unit mass `= (d²/162) kg/m` for steel in mm (derived from π/4·d²·7850);
total `= count × length × unit mass × (1+lap%)`.
**F-CON-04 Masonry** bricks per m² depends on brick + mortar joint size: 
`n = 1/((l+j)(h+j))`; always expose joint thickness.
**F-CON-05 Paint/coverage** `litres = area × coats / coverage_per_litre`; coverage is a
manufacturer property (state product assumption), and porosity/primer changes it.
**F-CON-06 Roofing** one "square" = 100 sq ft (US) — a unit that must be converted explicitly
for metric users.""",
[
 ("Concrete Volume","concrete-volume","L, W, D, waste -> m3/yd3",M,1,0,"R"),
 ("Concrete Weight","concrete-weight","volume, density -> mass",M,1,1,"R"),
 ("Concrete Mix Ratio","concrete-mix-ratio","volume, mix ratio -> cement/sand/aggregate",M,2,1,"R"),
 ("Cement Bags Required","cement-bags","volume, mix -> bags",M,2,1,"R"),
 ("Rebar Quantity","rebar-quantity","spacing, area -> bars, length",M,2,1,"R"),
 ("Rebar Weight","rebar-weight","diameter, length, count -> mass",M,2,1,"R"),
 ("Brick Quantity","brick-quantity","wall area, brick, joint -> count",M,2,1,"R"),
 ("Mortar Quantity","mortar-quantity","brickwork volume -> mortar",M,2,2,"R"),
 ("Concrete Block Quantity","block-quantity","wall area, block size -> count",M,2,1,"R"),
 ("Plaster Quantity","plaster-quantity","area, thickness -> cement, sand",M,2,2,"R"),
 ("Paint Coverage","paint-coverage","area, coats, coverage -> litres",M,2,1,"R"),
 ("Tile Count","tile-count","area, tile size, waste -> tiles, boxes",M,1,0,"R"),
 ("Tile Adhesive and Grout","tile-adhesive-grout","area, trowel, joint -> kg",M,2,2,"R"),
 ("Drywall Sheets","drywall-sheets","area, sheet size -> sheets, screws",M,1,1,"R"),
 ("Insulation Quantity","insulation-quantity","area, R-value, product -> rolls",M,2,2,"R"),
 ("Asphalt Tonnage","asphalt-tonnage","area, depth, density -> tonnes",M,2,2,"R"),
 ("Aggregate Tonnage","aggregate-tonnage","volume, bulk density -> tonnes",M,1,1,"R"),
 ("Sand Volume","sand-volume","area, depth, compaction -> m3",M,1,1,"R"),
 ("Screed Material","screed-material","area, thickness, mix -> cement, sand",M,2,2,"R"),
 ("Water-Cement Ratio","water-cement-ratio","cement mass, ratio -> water",M,1,1,"R"),
 ("Formwork Plywood","formwork-plywood","concrete area, reuse -> sheets",M,2,2,"R"),
 ("Roofing Squares","roofing-squares","area -> squares, bundles",M,1,1,"R"),
 ("Shingle Bundles","shingle-bundles","roof area, waste -> bundles",M,1,2,"R"),
 ("Excavation Volume","excavation-volume","L, W, D, swell -> loose volume",M,2,1,"R"),
 ("Backfill Volume","backfill-volume","excavation, structure -> fill, compaction",M,2,2,"R"),
])

cat("C24", "Architecture, Building Geometry and Interiors", "Required topics 23, 24",
"""**F-ARC-01 Areas** built-up vs carpet vs super built-up differ by wall thickness and common-
area loading factor; the loading factor is a local convention and must be an input.
**F-ARC-02 FAR/FSI** `FAR = total floor area / plot area`; permissible FAR is a zoning rule,
not a calculation — the tool computes the achieved value and compares with a user-entered limit.
**F-ARC-03 Stairs** comfort rule `2R + T = 600-640 mm` (Blondel-based practice, stated as a
design guideline); stringer length `= sqrt(rise² + run²)` per flight.
**F-ARC-04 Wall area** net = gross − openings; openings must be subtracted before paint/tile
quantities to avoid systematic over-ordering.
**F-ARC-05 Ventilation** `ACH = Q/V` where Q is supply/extract volume flow per hour; required
ACH values for a space type come from local building codes or ASHRAE 62.1 (licensed).""",
[
 ("Floor Area Calculator","floor-area","dimensions -> area, perimeter",M,1,0,"R"),
 ("Carpet vs Built-Up Area","carpet-vs-builtup","carpet area, loading -> built-up",M,2,1,"R"),
 ("FAR / FSI","far-fsi","plot, floor areas -> FAR",M,1,2,"R"),
 ("Plot Coverage","plot-coverage","footprint, plot -> coverage%",M,1,2,"R"),
 ("Room Volume","room-volume","L, W, H -> volume, air changes",M,1,1,"R"),
 ("Staircase Rise and Run","staircase-rise-run","floor height, riser -> treads, run",M,2,1,"R"),
 ("Stair Stringer Length","stair-stringer","rise, run -> stringer, angle",M,1,2,"R"),
 ("Ramp Slope Compliance","ramp-slope","rise, run -> slope, ratio",M,1,2,"R"),
 ("Net Wall Area","wall-area-openings","gross wall, openings -> net",M,1,1,"R"),
 ("Wallpaper Rolls","wallpaper-rolls","wall area, roll, repeat -> rolls",M,2,2,"R"),
 ("Curtain Fabric Quantity","curtain-fabric","window, fullness, drop -> metres",M,2,2,"R"),
 ("Flooring Wastage","flooring-wastage","area, pattern, waste -> order qty",M,1,2,"R"),
 ("Skirting Length","skirting-length","room perimeter, openings -> metres",M,1,2,"R"),
 ("False Ceiling Area","false-ceiling-area","room, border -> area, tiles",M,2,2,"R"),
 ("Ceiling Height Clearance","ceiling-height","floor height, services -> clear height",M,2,3,"R"),
 ("Fenestration Ratio","fenestration-ratio","window area, floor area -> ratio",M,1,3,"R"),
 ("Room Air Changes","room-ach","flow, volume -> ACH",M,2,2,"R"),
])

cat("C25", "Civil and Structural Engineering", "Required topics 25",
"""**F-CIV-01 Statics** simply supported UDL: `M_max = wL²/8`, `V_max = wL/2`; cantilever UDL:
`M = wL²/2`. These are linear-elastic, small-deflection, prismatic-section results only.
**F-CIV-02 Section properties** rectangle `I = bh³/12`, `S = bh²/6`; circle `I = πd⁴/64`.
Deflection of a simply supported UDL beam at midspan: `5wL⁴/(384EI)`.
**F-CIV-03 Bearing** `q = P/A`; allowable bearing pressure is a geotechnical determination,
never a calculator output — the tool compares demand with a user-supplied allowable.
**F-CIV-04 Regulatory design (LRFD/ASD, wind, seismic, snow, rebar detailing, pavement
thickness) requires licensed standards** (ASCE 7, ACI 318, AISC 360, AASHTO, Eurocodes).
Licensed text is not reproduced here; these entries are marked SPECIALIST_REVIEW_REQUIRED
and must not be published as design tools without a chartered engineer's sign-off and a
licensed copy of the code. Output must be labelled "preliminary estimate, not design".
**F-CIV-05 Soil** Rankine active pressure `Ka = (1-sin φ)/(1+sin φ)`, `p = Ka·γ·z` —
valid for dry, cohesionless backfill and horizontal surface only.""",
[
 ("Soil Bearing Pressure","soil-bearing-pressure","load, footing area -> pressure",M,2,1,"R"),
 ("Footing Size","footing-size","load, allowable bearing -> area, side",M,2,2,"R"),
 ("Column Axial Load","column-axial-load","tributary area, load -> kN",M,2,2,"R"),
 ("Simply Supported Beam Moment","beam-moment-udl","w, L -> M, V",M,2,1,"R"),
 ("Cantilever Beam Moment","cantilever-moment","w, L -> M, V",M,2,2,"R"),
 ("Beam Shear Force","beam-shear","loads, supports -> V diagram",M,3,2,"R"),
 ("Beam Deflection","beam-deflection","w, L, E, I -> δ",M,3,2,"R"),
 ("Slab Thickness Rule of Thumb","slab-thickness","span, support -> thickness",M,2,3,"X","Span/depth ratios are code-specific (ACI/Eurocode); licensed reference needed."),
 ("Rebar Area Required","rebar-area-required","moment, fy, d -> As",M,4,3,"X","Requires ACI 318 / Eurocode 2 provisions and licensed access."),
 ("Cube to Cylinder Strength","cube-cylinder-strength","cube MPa -> cylinder MPa",M,1,3,"X","Conversion factor is code- and region-specific; must cite the code."),
 ("Rankine Earth Pressure","rankine-earth-pressure","φ, γ, H -> Ka, p, force",M,3,3,"R"),
 ("Retaining Wall Stability","retaining-wall-stability","geometry, loads -> FS overturning/sliding",M,4,3,"X","Requires geotechnical input and code factors."),
 ("Wind Load (ASCE 7)","wind-load","velocity, exposure, height -> pressure",M,4,3,"X","Licensed standard; coefficients not reproduced."),
 ("Snow Load","snow-load","ground snow, exposure -> roof load",M,3,3,"X","Code-specific (ASCE 7 Ch.7 / EN 1991-1-3)."),
 ("LRFD Load Combination","load-combination-lrfd","dead, live, wind -> factored",M,3,3,"X","Combination sets are code-specific and change by edition."),
 ("Pile Capacity","pile-capacity","skin friction, end bearing -> capacity",M,4,3,"X","Geotechnical specialist review mandatory."),
 ("Pavement Thickness (AASHTO)","pavement-thickness","ESAL, soil, materials -> thickness",M,4,3,"X","AASHTO guide is licensed; equations not reproduced."),
 ("ESAL Traffic Loading","esal-traffic","axle loads, counts -> ESAL",M,3,3,"R"),
 ("Concrete Curing Time","concrete-curing","mix, temperature -> strength gain",M,2,3,"R"),
 ("Trench Excavation Safety","trench-excavation","depth, soil -> benching requirement",M,2,3,"X","OSHA 1926 Subpart P soil classification rules apply."),
])

cat("C26", "Mechanical Engineering and Machine Design", "Required topic 26",
"""**F-MEC-01 Newtonian mechanics** `F = ma`, `W = mg` with `g = 9.80665 m/s²` (exact, NIST
SP 811 App. B.8); torque `T = F·r`; rotational power `P = T·ω`, `ω = 2πn/60`.
**F-MEC-02 Transmission** gear ratio `= N_driven/N_driver = ω_in/ω_out`; belt speed
`v = πDn/60`; pulley pairs `n1D1 = n2D2` (ideal, no slip).
**F-MEC-03 Machine elements** bearing life `L10 = (C/P)^p × 10⁶ rev` (p=3 ball, 10/3 roller);
spring rate `k = Gd⁴/(8D³N)`; bolt torque `T = K·F·d` with K a friction factor (0.2 typical,
must be an input, not a constant).
**F-MEC-04 Section properties** `I`, `Z`, radius of gyration `r = sqrt(I/A)`;
Euler buckling `P_cr = π²EI/(KL)²` — valid only in the elastic range and with stated K.
**F-MEC-05 Thermal expansion** `ΔL = α·L·ΔT`; α is material-specific and temperature-dependent.""",
[
 ("Force Calculator","force-newton","mass, acceleration -> force",M,1,0,"R"),
 ("Torque Calculator","torque","force, radius -> torque",M,1,0,"R"),
 ("Rotational Power","rotational-power","torque, rpm -> power",M,2,1,"R"),
 ("Gear Ratio","gear-ratio","teeth, rpm -> ratio, output rpm",M,1,1,"R"),
 ("Belt and Pulley Speed","belt-pulley-speed","diameters, rpm -> speeds",M,2,1,"R"),
 ("Bearing Life L10","bearing-life","C, P, speed -> hours",M,3,2,"R"),
 ("Spring Rate","spring-rate","wire, coil, turns, G -> k",M,3,2,"R"),
 ("Bolt Tightening Torque","bolt-torque","preload, diameter, K -> torque",M,3,2,"R"),
 ("Friction Force","friction-force","normal, μ -> friction",M,1,1,"R"),
 ("Inclined Plane","inclined-plane","mass, angle, μ -> forces",M,2,2,"R"),
 ("Lever Mechanical Advantage","mechanical-advantage","arms -> MA, force",M,1,1,"R"),
 ("Pulley System Advantage","pulley-system","ropes -> MA, effort",M,1,2,"R"),
 ("Area Moment of Inertia","area-moment-inertia","shape, dims -> I",M,2,2,"R"),
 ("Section Modulus","section-modulus","shape, dims -> S",M,2,2,"R"),
 ("Thermal Expansion","thermal-expansion","L, α, ΔT -> ΔL",M,1,2,"R"),
 ("Natural Frequency","natural-frequency","k, m -> fn",M,2,3,"R"),
 ("Shaft Critical Speed","critical-speed","E, I, m, L -> rpm",M,4,3,"R"),
 ("Flywheel Energy","flywheel-energy","I, rpm -> energy",M,2,3,"R"),
 ("Motor Torque and Slip","motor-slip","sync speed, rpm, power -> T, slip",M,3,2,"R"),
 ("Hoist Capacity","hoist-capacity","load, reeving, efficiency -> required",M,3,3,"R"),
])

cat("C27", "Electrical Engineering and Power Systems", "Required topic 27",
"""**F-ELE-01 DC** `V = IR`, `P = VI = I²R = V²/R`; series `R = ΣR_i`; parallel
`1/R = Σ1/R_i`.
**F-ELE-02 AC single phase** `P = VI·cos φ` (real), `S = VI` (apparent), `Q = VI·sin φ`;
power-factor correction `Qc = P(tan φ1 - tan φ2)`.
**F-ELE-03 Three phase** `P = √3·V_LL·I·cos φ`; the √3 arises from line-to-line vs phase
voltage and must not be used for single-phase circuits.
**F-ELE-04 Voltage drop** single phase `ΔV = 2LI(R cos φ + X sin φ)` (go and return);
three phase `ΔV = √3LI(...)`. Conductor resistance depends on temperature and material.
**F-ELE-05 Ampacity, breaker sizing and earthing are governed by licensed codes** (NEC/
NFPA 70, IEC 60364, BS 7671). Tables are not reproduced; calculators expose the table value
as a user input or licensed-data dependency and are marked SPECIALIST_REVIEW_REQUIRED.""",
[
 ("Ohm's Law","ohms-law","any 2 of V,I,R -> third",M,1,0,"R"),
 ("DC Power","dc-power","V, I, R -> P",M,1,0,"R"),
 ("Three-Phase Power","three-phase-power","V, I, PF -> kW, kVA, kVAR",M,2,1,"R"),
 ("Power Factor Correction","power-factor-correction","kW, PF1, PF2 -> kVAR",M,3,2,"R"),
 ("Voltage Drop Single Phase","voltage-drop-single-phase","current, length, cable -> ΔV",M,3,2,"R"),
 ("Voltage Drop Three Phase","voltage-drop-three-phase","current, length, cable -> ΔV",M,3,2,"R"),
 ("Wire Ampacity Selection","wire-ampacity","load, insulation, method -> size",M,4,1,"X","Code tables (NEC/IEC) licensed; inputs must come from a cited table edition."),
 ("Cable Resistance","cable-resistance","material, area, length, temp -> R",M,2,2,"R"),
 ("Energy Consumption kWh","energy-consumption-kwh","watts, hours, days -> kWh",M,1,0,"R"),
 ("Electricity Cost","electricity-cost","kWh, tariff, tiers -> bill",M,2,1,"R"),
 ("Breaker Sizing","breaker-sizing","load, continuous factor -> breaker",M,3,2,"X","Continuous-load 125% rule is code-specific."),
 ("Transformer kVA","transformer-kva","load kW, PF, margin -> kVA",M,2,2,"R"),
 ("Motor Full-Load Current","motor-flc","kW, voltage, PF, eff -> FLC",M,3,2,"R"),
 ("Motor Efficiency","motor-efficiency","input, output -> η, losses",M,2,2,"R"),
 ("Star-Delta Conversion","star-delta-conversion","impedances -> equivalent",M,3,3,"R"),
 ("Resistors in Series and Parallel","resistors-series-parallel","network -> Req",M,2,1,"R"),
 ("Capacitors in Series and Parallel","capacitors-series-parallel","network -> Ceq",M,2,2,"R"),
 ("Impedance of RLC","impedance-rlc","R, L, C, f -> Z, phase",M,3,2,"R"),
 ("Resonant Frequency","resonant-frequency","L, C -> f0",M,2,2,"R"),
 ("RMS and Peak Values","rms-value","waveform -> RMS, peak, avg",M,2,2,"R"),
 ("Transformer Turns Ratio","turns-ratio","turns, voltages -> ratio",M,2,2,"R"),
 ("Earthing Resistance","earthing-resistance","rod, soil, config -> R",M,4,3,"X","Depends on soil model and code; specialist review."),
])

cat("C28", "Electronics and Circuit Analysis", "Required topic 28",
"""**F-ELX-01 Dividers** voltage `Vout = Vin·R2/(R1+R2)` (unloaded); loading effect changes it,
so the load resistance must be an input when significant. Current divider
`I1 = Itot·R2/(R1+R2)` for two parallel resistors.
**F-ELX-02 RC/RL** time constant `τ = RC` or `L/R`; charge `V(t) = V∞(1-e^{-t/τ})`;
cutoff `f_c = 1/(2πRC)`.
**F-ELX-03 Op-amp** inverting `Av = -Rf/Rin`; non-inverting `Av = 1 + Rf/R1`; these ignore
bandwidth and slew limits.
**F-ELX-04 LED resistor** `R = (Vs - Vf)/If`; power `P = If²R` — both must be reported.
**F-ELX-05 dB** `dB = 20log10(V2/V1) = 10log10(P2/P1)`; using 10log for voltage is a common
factor-of-two error.""",
[
 ("Voltage Divider","voltage-divider","Vin, R1, R2 -> Vout",M,1,0,"R"),
 ("Current Divider","current-divider","Itot, resistors -> branch currents",M,1,2,"R"),
 ("LED Series Resistor","led-resistor","Vs, Vf, If -> R, power",M,1,0,"R"),
 ("RC Time Constant","rc-time-constant","R, C -> τ, charge curve",M,2,1,"R"),
 ("RL Time Constant","rl-time-constant","R, L -> τ",M,2,2,"R"),
 ("LC Resonance","lc-resonance","L, C -> f0, Q",M,3,2,"R"),
 ("Op-Amp Gain","opamp-gain","config, resistors -> Av",M,2,1,"R"),
 ("Transistor Bias","transistor-bias","Vcc, Rb, Rc, β -> Q-point",M,4,3,"R"),
 ("Rectifier Ripple","rectifier-ripple","C, load, f -> ripple",M,3,2,"R"),
 ("Zener Regulator","zener-regulator","Vin, Vz, load -> Rs, current",M,3,2,"R"),
 ("PCB Trace Width","pcb-trace-width","current, rise, copper -> width",M,3,2,"R","Based on IPC-2221 charts; licensed reference required before publish."),
 ("Resistor Colour Code","resistor-colour-code","bands -> value, tolerance",M,1,0,"R"),
 ("Capacitor Code","capacitor-code","3-digit code -> value",M,1,1,"R"),
 ("RC Filter Cutoff","filter-cutoff","R, C -> fc, response",M,2,2,"R"),
 ("Gain in Decibels","gain-db","ratio -> dB",M,1,1,"R"),
 ("Signal-to-Noise Ratio","snr","signal, noise -> SNR dB",M,2,2,"R"),
 ("NE555 Timer","ne555-timer","R, C -> frequency, duty",M,3,3,"R"),
 ("PWM Duty Cycle","pwm-duty","on time, period -> duty%, avg V",M,1,2,"R"),
 ("ADC Resolution","adc-resolution","bits, Vref -> LSB, codes",M,2,2,"R"),
 ("Pull-Up Resistor","pullup-resistor","bus capacitance, speed -> R range",M,2,3,"R"),
])

cat("C29", "Chemical Engineering and Process Calculations", "Required topic 29",
"""**F-CHE-01 Material balance** steady state: `Σin = Σout + accumulation(=0)`; conversion
`X = (F_in - F_out)/F_in`; selectivity `= desired/(undesired produced)`.
**F-CHE-02 Reactor sizing** CSTR `V = F_A0·X/(-r_A)`; PFR `V = F_A0∫dX/(-r_A)`;
space time `τ = V/v0`.
**F-CHE-03 Gas laws** ideal `PV = nRT` (R = 8.314462618 J/(mol·K), exact in SI);
van der Waals `(P + a n²/V²)(V - nb) = nRT` — coefficients are substance-specific and must be
tabulated, not invented.
**F-CHE-04 Psychrometry** humidity ratio `W = 0.621945·p_w/(P - p_w)`; enthalpy of moist air
`h = 1.006T + W(2501 + 1.86T)` (kJ/kg dry air, ASHRAE formulation — licensed handbook).
**F-CHE-05 Yield** `%yield = actual/theoretical×100`; limiting reagent determined by
`min(n_i/ν_i)`.""",
[
 ("Reactor Residence Time","reactor-residence-time","volume, flow -> τ",M,2,2,"R"),
 ("Conversion and Selectivity","conversion-selectivity","in/out flows -> X, S",M,3,2,"R"),
 ("Steady-State Mass Balance","mass-balance","streams -> unknown flow",M,2,2,"R"),
 ("Mole Fraction and Partial Pressure","mole-fraction-partial-pressure","composition, P -> p_i",M,2,2,"R"),
 ("Ideal Gas Law","ideal-gas-law","P,V,T,n -> unknown",M,1,1,"R"),
 ("Van der Waals Gas","van-der-waals","P,V,T, a, b -> state",M,3,3,"R"),
 ("Psychrometric Humidity Ratio","humidity-ratio","T, RH, P -> W",M,3,3,"X","ASHRAE formulation; handbook licensed."),
 ("Moist Air Enthalpy","moist-air-enthalpy","T, W -> h",M,3,3,"X","ASHRAE formulation; handbook licensed."),
 ("Distillation Material Balance","distillation-balance","feed, compositions -> products",M,3,3,"R"),
 ("Crystallisation Yield","crystallisation-yield","feed, solubility, temp -> yield",M,4,3,"R"),
 ("Drying Rate","drying-rate","moisture, air, area -> rate",M,4,3,"R"),
 ("Blending Composition","blending-composition","streams -> blend",M,2,2,"R"),
])

cat("C30", "Fluid Mechanics and Hydraulics", "Required topic 30",
"""**F-FLU-01 Continuity** `Q = A·v`; in a filled pipe `v1A1 = v2A2`.
**F-FLU-02 Reynolds** `Re = ρvD/μ = vD/ν`; laminar `<2300`, transitional 2300-4000,
turbulent `>4000` (values are convention, not physics constants).
**F-FLU-03 Head loss** Darcy-Weisbach `h_f = f(L/D)(v²/2g)`; Colebrook
`1/√f = -2log10(ε/(3.7D) + 2.51/(Re√f))` solved iteratively (Swamee-Jain is an explicit
approximation with ~1% error — state it). Hazen-Williams `h_f = 10.67 L Q^1.852/(C^1.852 D^4.87)`
(SI, water at ~20 °C) is empirical and material-specific.
**F-FLU-04 Pump power** hydraulic `P_h = ρgQH`; shaft `P_s = P_h/η`.
**F-FLU-05 Hydrostatics** `p = ρgh`; buoyancy `F = ρ_fluid·g·V_displaced`.""",
[
 ("Flow Rate from Area and Velocity","flow-rate-av","A, v -> Q",M,1,0,"R"),
 ("Reynolds Number","reynolds-number","ρ, v, D, μ -> Re, regime",M,2,1,"R"),
 ("Darcy-Weisbach Head Loss","darcy-weisbach","f, L, D, v -> h_f",M,3,2,"R"),
 ("Hazen-Williams Head Loss","hazen-williams","Q, C, D, L -> h_f",M,3,2,"R"),
 ("Manning Equation","manning-equation","n, R, S -> velocity, Q",M,3,2,"R"),
 ("Colebrook Friction Factor","colebrook-friction-factor","Re, ε/D -> f",M,3,3,"R"),
 ("Bernoulli Equation","bernoulli","p, v, z at 2 points -> unknown",M,2,2,"R"),
 ("Pump Power","pump-power","Q, H, η -> kW",M,2,1,"R"),
 ("Pump Head","pump-head","pressure rise, ρ -> head",M,2,2,"R"),
 ("Pipe Volume","pipe-volume","D, L -> volume, fill time",M,1,1,"R"),
 ("Pipe Diameter Sizing","pipe-diameter-sizing","Q, v_max -> D",M,2,2,"R"),
 ("Orifice Flow","orifice-flow","area, Δp, Cd -> Q",M,3,3,"R"),
 ("Rectangular Weir Flow","rectangular-weir","head, width -> Q",M,3,3,"R"),
 ("Hydrostatic Pressure","hydrostatic-pressure","depth, ρ -> p",M,1,1,"R"),
 ("Buoyancy","buoyancy","volume, ρ -> force, draft",M,2,2,"R"),
 ("Terminal Velocity","terminal-velocity","mass, area, Cd, ρ -> v_t",M,3,3,"R"),
])

cat("C31", "Thermodynamics and Heat Transfer", "Required topic 31",
"""**F-THT-01 Conduction** 1-D steady `q = kAΔT/L`; plane wall resistance `R = L/(kA)`;
cylindrical `R = ln(r2/r1)/(2πkL)`.
**F-THT-02 Convection** Newton `q = hAΔT`; h is empirical and depends on geometry and flow —
it must be an input or derived from a cited correlation with its validity range.
**F-THT-03 Radiation** `q = εσA(T_s⁴ - T_surr⁴)` with σ = 5.670374419e-8 W/(m²·K⁴) and
T in kelvin (using °C is a physically wrong but common bug).
**F-THT-04 HX** LMTD `ΔT_lm = (ΔT1-ΔT2)/ln(ΔT1/ΔT2)`; if ΔT1 = ΔT2 use the limit = ΔT1.
**F-THT-05 HVAC sizing** 1 ton of refrigeration = 12,000 Btu/h = 3.5168528421 kW;
cooling-load estimates are approximations and must be labelled, with a room-by-room
Manual J-type calculation distinguished from a rule-of-thumb.
**F-THT-06 COP and Carnot** `COP_R = Q_c/W`; `COP_Carnot = T_c/(T_h - T_c)` in kelvin —
an upper bound, never achievable.""",
[
 ("Fourier Conduction","conduction-fourier","k, A, ΔT, L -> q",M,2,1,"R"),
 ("Newton Convection","convection-newton","h, A, ΔT -> q",M,1,1,"R"),
 ("Stefan-Boltzmann Radiation","radiation-stefan","ε, A, T -> q",M,2,2,"R"),
 ("Log Mean Temperature Difference","lmtd","inlet/outlet temps -> LMTD",M,2,2,"R"),
 ("Overall Heat Transfer Coefficient","overall-heat-transfer","resistances -> U",M,3,2,"R"),
 ("Heat Exchanger Area","heat-exchanger-area","Q, U, LMTD -> A",M,3,3,"R"),
 ("Sensible Heat","sensible-heat","mass, cp, ΔT -> energy",M,1,1,"R"),
 ("Latent Heat","latent-heat","mass, h_fg -> energy",M,1,2,"R"),
 ("HVAC Tonnage Sizing","hvac-tonnage","area, climate, insulation -> tons",M,3,1,"R","Rule-of-thumb sizing; must be labelled approximate."),
 ("U-Value and R-Value","u-value-r-value","layers -> U, R",M,2,2,"R"),
 ("Refrigeration COP","cop-refrigeration","Q_c, W -> COP",M,2,2,"R"),
 ("Carnot Efficiency","carnot-efficiency","T_hot, T_cold -> η, COP",M,2,2,"R"),
 ("Cooling Load Estimate","cooling-load-simple","area, occupancy, equipment -> kW",M,3,2,"R"),
 ("Duct Sizing","duct-sizing","CFM, velocity -> duct size",M,3,2,"R"),
 ("Pipe Insulation Thickness","pipe-insulation","ΔT, k, h -> thickness",M,4,3,"R"),
 ("Specific Heat Energy","specific-heat-energy","m, c, ΔT -> Q",M,1,1,"R"),
 ("Thermal Expansion of Fluids","fluid-thermal-expansion","V, β, ΔT -> ΔV",M,2,3,"R"),
 ("Heat Pump Balance Point","heat-pump-balance","capacity curve, load -> balance",M,4,3,"R"),
])

cat("C32", "Manufacturing, Production and OEE", "Required topic 32",
"""**F-MFG-01 OEE** `OEE = Availability × Performance × Quality` where
`A = runtime/planned time`, `P = (ideal cycle × units)/runtime`,
`Q = good units/total units`. OEE is multiplicative — averaging the three components or
adding them is invalid and produces >100% results.
**F-MFG-02 Takt** `= available time/customer demand`; cycle time is a measured process value
and is not interchangeable with takt.
**F-MFG-03 Little's law** `WIP = throughput × flow time`; applies to stable systems only.
**F-MFG-04 Line balance** efficiency `= Σ task times/(stations × cycle time)`.
**F-MFG-05 Capacity** `= units/hour × available hours × OEE`; planned vs available time must
be separated from downtime.""",
[
 ("OEE","oee","availability, performance, quality -> OEE",M,2,0,"R"),
 ("Availability Rate","availability-rate","runtime, planned time -> A%",M,1,1,"R"),
 ("Performance Rate","performance-rate","ideal cycle, units, runtime -> P%",M,2,2,"R"),
 ("Quality Rate","quality-rate","good, total units -> Q%",M,1,1,"R"),
 ("Takt Time","takt-time","available time, demand -> takt",M,1,1,"R"),
 ("Cycle Time and Throughput","cycle-time","time per unit -> units/hour",M,1,1,"R"),
 ("Production Capacity","production-capacity","rate, hours, OEE -> units",M,2,1,"R"),
 ("Capacity Utilisation","capacity-utilisation","actual, capacity -> %",M,1,2,"R"),
 ("Production Yield","production-yield","good, started -> yield%",M,1,1,"R"),
 ("Scrap Rate","scrap-rate","scrap, produced -> %",M,1,1,"R"),
 ("Labour Productivity","labour-productivity","output, labour hours -> units/hr",M,1,2,"R"),
 ("Machine Hour Rate","machine-hour-rate","costs, hours -> rate",M,2,2,"R"),
 ("Standard Cost","standard-cost","material, labour, overhead -> cost",M,2,2,"R"),
 ("Line Balance Efficiency","line-balance-efficiency","task times, stations -> %",M,3,3,"R"),
 ("Little's Law WIP","little-law-wip","throughput, flow time -> WIP",M,2,2,"R"),
 ("Kanban Size","kanban-size","demand, lead time, container -> cards",M,2,3,"R"),
])

cat("C33", "Cutting Stock, Nesting and Optimisation", "Required topic 33",
"""**F-CUT-01 1-D cutting stock** minimise stock length used for a demand list; first-fit
decreasing is a heuristic with a known worst case (`FFD ≤ 11/9·OPT + 6/9`), not an optimum.
The tool must state that the plan is heuristic and show the lower bound.
**F-CUT-02 Kerf** every cut consumes blade width: usable length must be reduced by
`(pieces-1)×kerf`; ignoring kerf systematically under-orders material.
**F-CUT-03 2-D nesting** rectangle bin packing is NP-hard; report used area, waste % and the
shelf/guillotine algorithm used. Do not present an approximate nesting as optimal.
**F-CUT-04 Yield** `yield% = used area/length ÷ purchased × 100`; offcut value is
`offcut area × unit price × resale factor`.""",
[
 ("1-D Cutting Stock Planner","cutting-stock-1d","stock length, piece list -> cut plan",M,4,2,"R"),
 ("2-D Sheet Nesting Estimator","sheet-nesting-2d","sheet, rectangles -> layout, waste",M,4,2,"R"),
 ("Cut List Waste","cut-list-waste","pieces, stock -> waste%",M,2,1,"R"),
 ("Kerf Compensation","kerf-compensation","pieces, kerf -> extra length",M,1,1,"R"),
 ("Rebar Cutting Plan","rebar-cutting-plan","bar length, demands -> plan",M,3,2,"R"),
 ("Pipe Cutting Plan","pipe-cutting-plan","stock, lengths -> plan",M,3,2,"R"),
 ("Plank Cut Optimiser","plank-cut-plan","boards, parts -> plan",M,3,2,"R"),
 ("Coil Slitting Plan","coil-slitting-plan","coil width, slits -> plan",M,3,3,"R"),
 ("Sheet Count from Area","sheet-count-from-area","area, sheet size, waste -> sheets",M,1,0,"R"),
 ("Offcut Inventory Value","offcut-value","offcuts, price -> value",M,2,3,"R"),
 ("Cutting Yield Percentage","cutting-yield","used, purchased -> yield%",M,1,1,"R"),
 ("Number of Cuts Required","cuts-required","pieces, stock -> cuts, time",M,1,2,"R"),
])

cat("C34", "Glass Manufacturing and Glazing", "Required topic 34",
"""**F-GLS-01 Weight** `mass = area × thickness × density`; soda-lime glass density
≈2500 kg/m³, so 1 m² of 6 mm glass ≈ 15 kg. Density varies by glass type — expose it.
**F-GLS-02 Cutting yield** `yield% = Σ piece areas / sheet area × 100`, minus kerf/edge trim;
glass cannot be re-joined, so offcut value is only realised if a future order uses it.
**F-GLS-03 Structural glazing** thickness selection for wind load and deflection follows
ASTM E1300 / EN 16612, which are licensed and involve load-duration factors — SPECIALIST
REVIEW REQUIRED. Never compute "required thickness" from area alone and present it as safe.
**F-GLS-04 U-value** IGU centre-of-glass `U ≈ (1/U1 + 1/U2)⁻¹` ignoring gas and frame;
whole-window Uw requires frame and spacer data (EN 14351-1 / NFRC).""",
[
 ("Glass Weight","glass-weight","area, thickness, density -> kg",M,1,0,"R"),
 ("Glass Area and Cost","glass-area-cost","dimensions, rate -> area, price",M,1,0,"R"),
 ("Glass Thickness Selection","glass-thickness-selection","area, wind load -> nominal",M,4,1,"X","ASTM E1300 / EN 16612 licensed; requires engineer sign-off."),
 ("Glass Cutting Yield","glass-cutting-yield","sheet, pieces -> yield%",M,2,1,"R"),
 ("Glass Cutting Optimiser","glass-cutting-optimiser","sheet sizes, pieces -> plan",M,4,2,"R"),
 ("Mirror Size and Cost","mirror-size-cost","dimensions, edgework -> price",M,1,2,"R"),
 ("IGU U-Value","igu-u-value","pane U, gap, gas -> centre U",M,3,2,"R"),
 ("Glass Deflection Check","glass-deflection","thickness, span, load -> deflection",M,4,3,"X","ASTM E1300 procedure; licensed standard."),
 ("Glazing Wind Load","glazing-wind-load","velocity, height, exposure -> pressure",M,4,3,"X","ASCE 7 / EN 1991-1-4 coefficients required."),
 ("Glass Edgework Cost","glass-edgework-cost","perimeter, finish -> cost",M,1,2,"R"),
 ("Glass Offcut Value","glass-offcut-value","offcuts, rate -> value",M,2,3,"R"),
 ("Shower Panel Sizing","shower-panel-size","opening, clearance -> panel dims",M,2,2,"R"),
 ("Glass Balustrade Load","glass-balustrade-load","height, line load -> moment",M,4,3,"X","Requires structural engineer; code line loads vary."),
 ("Laminated vs Tempered Cost","laminated-vs-tempered","area, options -> cost, properties",M,2,2,"R"),
])

cat("C35", "Woodworking, Joinery and Timber", "Required topic 35",
"""**F-WDW-01 Board foot** (US/Canada) `bf = t(in)×w(in)×L(ft)/12`; a "board foot" is a volume,
not an area, and metric users need m³ conversion.
**F-WDW-02 Sheet goods** `sheets = ceil(area/sheet area × (1+waste))`; panel thickness and
nominal vs actual dimensions differ (a "3/4 inch" plywood is 18 mm-ish, not 19.05 mm).
**F-WDW-03 Moisture movement** dimensional change is anisotropic:
`ΔL ≈ L × (MC2 - MC1) × coefficient` with different coefficients for tangential, radial and
longitudinal directions — a single shrinkage number is wrong.
**F-WDW-04 Span tables** joist/rafter sizes come from species-grade-span tables (e.g. IRC
R502, EN 338/1995); they are code documents and cannot be approximated by a formula.""",
[
 ("Board Feet","board-feet","thickness, width, length, qty -> bf",M,1,0,"R"),
 ("Lumber Weight","lumber-weight","volume, species density, MC -> kg",M,2,2,"R"),
 ("Plywood Sheet Count","plywood-sheets","area, sheet, waste -> sheets",M,1,1,"R"),
 ("Timber Beam Size","timber-beam-size","span, load -> section (table)",M,4,3,"X","Requires span tables (IRC/EN); not a formula."),
 ("Wood Moisture Shrinkage","wood-shrinkage","MC change, dimension -> Δdim",M,3,3,"R"),
 ("Decking Board Count","decking-boards","deck area, board, gap -> boards",M,2,1,"R"),
 ("Fence Picket Count","fence-pickets","run, picket, gap -> pickets, rails",M,2,1,"R"),
 ("Screw and Nail Quantity","screw-nail-quantity","area, spacing -> fasteners",M,1,2,"R"),
 ("Stain and Finish Coverage","stain-coverage","area, coats, coverage -> litres",M,2,2,"R"),
 ("Cabinet Cut List","cabinet-cut-list","carcass dims -> parts list",M,3,2,"R"),
 ("Lumber Cost per Board Foot","lumber-cost-boardfoot","price, dims -> cost",M,1,2,"R"),
 ("Wood Glue Coverage","glue-coverage","joint area -> grams",M,1,3,"R"),
])

cat("C36", "Metal Fabrication and Machining", "Required topic 36",
"""**F-MET-01 Mass of steel sections** plate `m = L×W×t×ρ` (ρ = 7850 kg/m³ for carbon steel);
pipe `m = π(D-t)t·L·ρ`; the widely used `d²/162` kg/m for rebar is the same identity with
ρ = 7850 and d in mm.
**F-MET-02 Bend allowance** `BA = θ(π/180)(R + K·T)` with θ in degrees, K the K-factor
(0.33-0.50 depending on R/T and material) — K must be an input, not a constant.
Bend deduction `BD = 2(R+T)tan(θ/2) - BA`.
**F-MET-03 Speeds and feeds** `n = 1000·Vc/(πD)` rpm with Vc in m/min (surface speed);
feed rate `vf = fz·z·n`.
**F-MET-04 Welding** heat input `HI = (V·I·60)/(1000·TS)` kJ/mm; consumable mass depends on
joint geometry and deposition efficiency.
**F-MET-05 Hardness conversion** (HRC/HV/HB) is empirical and standard-specific (ASTM E140);
conversions are not exact and must not be extrapolated.""",
[
 ("Steel Plate Weight","steel-plate-weight","L, W, t, ρ -> kg",M,1,0,"R"),
 ("Pipe Weight","pipe-weight","OD, wall, length -> kg",M,2,1,"R"),
 ("Sheet Metal Weight","sheet-metal-weight","gauge, dims, ρ -> kg",M,2,1,"R"),
 ("Bend Allowance","bend-allowance","angle, R, T, K -> BA",M,3,2,"R"),
 ("Bend Deduction","bend-deduction","angle, R, T, K -> BD",M,3,2,"R"),
 ("Flat Pattern Development","flat-pattern","bends, dims -> flat length",M,3,2,"R"),
 ("Weld Consumable Quantity","weld-consumable","joint, length, efficiency -> kg",M,3,2,"R"),
 ("Weld Heat Input","weld-heat-input","V, I, travel speed -> kJ/mm",M,3,2,"R"),
 ("Cutting Speed (RPM)","cutting-speed-rpm","Vc, diameter -> rpm",M,2,1,"R"),
 ("Machining Time","machining-time","length, feed, passes -> minutes",M,2,2,"R"),
 ("Drilling Time","drilling-time","depth, feed, rpm -> minutes",M,2,2,"R"),
 ("Metal Cost Estimate","metal-cost","mass, rate, waste -> cost",M,2,1,"R"),
 ("Hardness Conversion","hardness-conversion","HRC/HV/HB -> equivalent",M,2,3,"X","ASTM E140 tables are licensed; conversions are empirical."),
 ("Press Tonnage","press-tonnage","perimeter, thickness, shear -> tons",M,3,3,"R"),
 ("Springback Estimate","springback","R/T, material -> angle",M,3,3,"R"),
 ("Galvanising Zinc Weight","galvanizing-zinc","area, coating class -> kg",M,2,2,"R"),
])

cat("C37", "Textile, Fabric and Garment Production", "Required topic 37",
"""**F-TEX-01 Areal density** `GSM = mass(g)/area(m²)`; `oz/yd² = GSM/33.906`.
**F-TEX-02 Yarn count** Ne (cotton) `= 590.5/tex`; Nm `= 1000/tex`; denier `= 9×tex`.
These are reciprocal systems — converting by multiplication is a common defect.
**F-TEX-03 Fabric consumption per garment** `= Σ(pattern area) × (1+waste) × GSM`;
marker efficiency `= garment area/marker area`.
**F-TEX-04 Thread consumption** is stitch-type dependent (301 lockstitch ≠ 504 overlock);
ratios must be sourced per stitch class, not guessed.
**F-TEX-05 Shrinkage** `% = (before-after)/before×100`; apply to pattern dimensions BEFORE
costing, and state the test method (e.g. ISO 6330).""",
[
 ("Fabric GSM","fabric-gsm","mass, area -> GSM, oz/yd²",M,1,0,"R"),
 ("Yarn Count Conversion","yarn-count-conversion","Ne/Nm/tex/denier -> all",M,2,1,"R"),
 ("Fabric Weight for Garment","fabric-weight","consumption, GSM -> kg",M,2,1,"R"),
 ("Fabric Consumption per Garment","fabric-consumption-garment","pattern, width, waste -> metres",M,3,2,"R"),
 ("Marker Efficiency","marker-efficiency","garment area, marker -> %",M,2,2,"R"),
 ("Thread Consumption","thread-consumption","seam length, stitch -> metres",M,3,2,"R"),
 ("Stitch Density","stitch-density","stitches, length -> SPI",M,1,2,"R"),
 ("Fabric Shrinkage","fabric-shrinkage","before, after -> %",M,1,1,"R"),
 ("Roll to Metres","roll-to-metres","roll weight, GSM, width -> metres",M,2,1,"R"),
 ("Fabric Cost per Garment","fabric-cost-garment","consumption, rate -> cost",M,1,1,"R"),
 ("Textile Cutting Waste","cutting-waste-textile","used, issued -> waste%",M,2,2,"R"),
 ("Embroidery Stitch Count and Time","embroidery-stitches","design, speed -> stitches, time",M,2,2,"R"),
 ("GSM to Ounces","gsm-to-oz","GSM -> oz/yd²",M,1,0,"R"),
 ("Fabric Width Conversion","fabric-width-conversion","width, tube/open -> usable",M,2,3,"R"),
 ("Garment Costing","garment-costing","fabric, trim, labour -> FOB cost",M,3,1,"R"),
])

cat("C38", "Packaging and Printing", "Required topic 38",
"""**F-PKG-01 Box volume and blank** internal volume `= l×w×h`; blank length for an RSC
`= 2(l+w) + glue flap`; board area must include flap depth.
**F-PKG-02 Corrugated weight** `= board area × gsm_total/1000` where gsm_total is the sum of
liner and fluting grades (ECT/BCT strength is a separate, test-based property).
**F-PKG-03 Imposition** `sheets = ceil(quantity/(per-sheet × (1-waste)))`; print sheet count
is driven by press sheet size, not finished size.
**F-PKG-04 Paper weight** `ream weight = gsm × sheet area × sheets/ream`; a US ream is 500
sheets, and "basis weight" (lb/ream of a *basis size*) is not gsm.
**F-PKG-05 Bleed/trim** add bleed on all sides before imposition; creep in saddle-stitch
shifts inner pages by `creep = (pages/4)×paper thickness`.""",
[
 ("Box Volume","box-volume","internal dims -> volume, board area",M,1,0,"R"),
 ("Corrugated Board Weight","corrugated-weight","area, gsm -> kg",M,2,1,"R"),
 ("Box Blank Size","box-blank-size","dims, style -> blank, board",M,2,1,"R"),
 ("Cartons per Pallet","carton-pallet-count","pallet, carton, pattern -> count",M,2,1,"R"),
 ("Void Fill Requirement","void-fill","box, contents -> fill volume",M,2,2,"R"),
 ("Shrink Film Size","shrink-film","bundle dims -> film width",M,2,2,"R"),
 ("Label Count per Roll","label-count","roll length, label pitch -> labels",M,1,2,"R"),
 ("Print Imposition","print-imposition","sheet, trim, quantity -> sheets",M,3,1,"R"),
 ("Paper Ream Weight","paper-ream-weight","gsm, size, sheets -> kg",M,2,1,"R"),
 ("Ink Coverage Cost","ink-coverage","area, coverage%, rate -> cost",M,2,2,"R"),
 ("Print Cost per Page","print-cost-page","cartridge, yield, coverage -> cost",M,2,1,"R"),
 ("Bleed and Trim Size","bleed-trim","trim size, bleed -> document size",M,1,0,"R"),
 ("Booklet Creep","booklet-creep","pages, paper thickness -> creep",M,2,3,"R"),
 ("Packaging Cost per Unit","packaging-cost","materials, labour -> cost",M,2,2,"R"),
 ("Cushioning Thickness","cushioning-thickness","drop height, fragility -> thickness",M,3,3,"R"),
])

cat("C39", "Inventory and Stock Control", "Required topic 39",
"""**F-INV-01 EOQ** `Q* = sqrt(2DS/H)` with D annual demand, S order cost, H holding cost per
unit-year; assumes constant demand and no quantity discounts — state it.
**F-INV-02 Reorder point** `ROP = d̄·LT + SS` (SS = z·σ_d·√LT for independent demand).
**F-INV-03 Turnover** `COGS/avg inventory`; days of inventory `= 365/turnover`.
**F-INV-04 ABC** classification by cumulative annual value (Pareto), typically 80/15/5 —
thresholds are policy, not law.
**F-INV-05 Cycle counting** sample size for a desired confidence uses the binomial/hypergeometric
formula, not a fixed "count 10 items" rule.""",
[
 ("Economic Order Quantity","eoq","demand, order cost, holding -> Q*",M,2,1,"R"),
 ("Reorder Point","reorder-point","demand, lead time, safety -> ROP",M,2,1,"R"),
 ("Safety Stock","safety-stock","service level, σ, lead time -> SS",M,3,2,"R"),
 ("Days of Inventory","days-of-inventory","COGS, inventory -> days",M,1,1,"R"),
 ("ABC Analysis","abc-analysis","items, values -> A/B/C classes",M,2,2,"R"),
 ("Stockout Probability","stockout-probability","SS, σ, LT -> probability",M,3,3,"R"),
 ("Cycle Count Sample Size","cycle-count-sample","population, confidence -> sample",M,3,3,"R"),
 ("Min-Max Levels","min-max-levels","demand, lead time -> min, max",M,2,2,"R"),
 ("EOQ with Quantity Discount","eoq-quantity-discount","price breaks -> optimal Q",M,4,3,"R"),
 ("Carrying Cost","carrying-cost","inventory value, rate -> annual cost",M,1,2,"R"),
 ("Dead Stock Value","dead-stock-value","items, age, price -> write-down",M,2,3,"R"),
 ("Inventory Valuation","inventory-valuation","units, method (FIFO/avg) -> value",M,3,2,"R"),
])

cat("C40", "Supply Chain and Logistics", "Required topic 40",
"""**F-SCM-01 Service metrics** fill rate `= units shipped/units ordered`;
OTIF `= orders on time AND in full / total`; perfect order rate further requires damage-free
and correct documentation — these are nested, not alternative, measures.
**F-SCM-02 Lead time** total `= processing + production + transit + customs + receiving`;
variability matters more than the mean for safety stock (see F-INV-02).
**F-SCM-03 Forecast error** MAPE `= mean(|A-F|/A)×100` fails when A=0; prefer MAE/RMSE and
state the horizon.
**F-SCM-04 Total cost of ownership** sum of unit price, freight, duty, inventory carrying,
quality and administration — comparing unit price alone is a documented procurement error.""",
[
 ("Lead Time Calculator","lead-time","process steps -> total lead time",M,1,1,"R"),
 ("Fill Rate","fill-rate","shipped, ordered -> %",M,1,1,"R"),
 ("Perfect Order Rate","perfect-order-rate","orders, defects -> %",M,2,2,"R"),
 ("OTIF","otif","on-time, in-full -> OTIF%",M,1,2,"R"),
 ("Supplier Scorecard","supplier-scorecard","weighted metrics -> score",M,2,2,"R"),
 ("Total Cost of Ownership","total-cost-of-ownership","price, logistics, quality -> TCO",M,3,2,"R"),
 ("Logistics Cost per Unit","logistics-cost-unit","costs, units -> per unit",M,1,1,"R"),
 ("Warehouse Capacity","warehouse-capacity","volume, racking -> pallet positions",M,2,2,"R"),
 ("Freight Cost Allocation","freight-cost-allocation","shipments, weight -> allocation",M,2,3,"R"),
 ("Demand Forecast Error","forecast-error","actual, forecast -> MAE, MAPE",M,2,2,"R"),
 ("Safety Stock with Lead-Time Variability","safety-lead-time","σ_LT, demand -> SS",M,3,3,"R"),
 ("Reverse Logistics Cost","reverse-logistics-cost","returns, handling -> cost",M,2,3,"R"),
 ("Shelf Life and Expiry","shelf-life","production, shelf life -> expiry",M,1,2,"R"),
])

cat("C41", "Shipping, Freight and Container Loading", "Required topic 41",
"""**F-SHP-01 Dimensional weight** `dim weight = L×W×H/divisor` in the carrier's units; the
divisor differs by carrier, service and unit system (e.g. 139 in³/lb, 5000 cm³/kg, 6000 cm³/kg)
and changes over time — it MUST be a user-editable, source-cited field. Chargeable weight
`= max(actual, dimensional)`, rounded up to the carrier's increment.
**F-SHP-02 Air freight chargeable weight** volumetric `= volume(m³)×167 kg` (IATA 6000 cm³/kg);
chargeable `= max(gross, volumetric)`.
**F-SHP-03 Container capacity** nominal vs practical: 20 ft ≈33 m³, 40 ft ≈67 m³,
40 ft HC ≈76 m³; usable volume is lower after packing efficiency (typically 80-90%) and
payload limits are weight-driven, not volume-driven.
**F-SHP-04 Load planning** is 3-D bin packing (NP-hard); report packing efficiency and state
the algorithm.""",
[
 ("Dimensional Weight","dimensional-weight","dims, divisor -> dim weight",M,2,1,"R"),
 ("Chargeable Weight (Air)","chargeable-weight-air","gross, volume -> chargeable",M,2,1,"R"),
 ("Container Capacity","container-capacity","container type, cargo -> volume, payload",M,2,1,"R"),
 ("Container Fill Rate","container-fill-rate","cargo volume, container -> %",M,2,2,"R"),
 ("Pallet Loading","pallet-loading","carton, pallet, pattern -> cartons",M,3,1,"R"),
 ("Pallet Count for Shipment","pallet-count","units, per pallet -> pallets",M,1,1,"R"),
 ("LCL Freight Cost","lcl-freight-cost","volume/weight, rate -> cost",M,2,2,"R"),
 ("Shipping Cost per Unit","shipping-cost-unit","freight, units -> per unit",M,1,1,"R"),
 ("Freight Density","freight-density","weight, volume -> kg/m³",M,1,1,"R"),
 ("Truck Load Plan","truck-load-plan","pallets, truck -> utilisation",M,3,2,"R"),
 ("Demurrage and Detention","demurrage-cost","days, rate -> cost",M,2,2,"R"),
 ("Last-Mile Cost per Delivery","last-mile-cost","costs, stops -> per delivery",M,2,2,"R"),
 ("Return Shipping Cost","returns-shipping-cost","returns, rate -> cost",M,2,3,"R"),
 ("Export Packing Cost","export-packing-cost","materials, labour -> cost",M,2,3,"R"),
 ("Cargo Insurance Premium","cargo-insurance","value, rate, route -> premium",M,2,3,"R"),
 ("TEU Conversion","teu-conversion","containers -> TEU/FEU",M,1,3,"R"),
])

cat("C42", "Automotive and Vehicle Operation", "Required topic 42",
"""**F-AUT-01 Fuel cost** `cost = distance/consumption × price`; unit systems
(L/100 km vs mpg) are reciprocal — convert via `mpg(US) = 235.214583/L per 100 km`.
**F-AUT-02 EV energy** `kWh = distance × consumption(kWh/100 km)/100`; charging cost adds a
charging-loss factor (typically 5-15%, must be an input).
**F-AUT-03 Tire sizing** `section width (mm) / aspect ratio % R rim (in)`; overall diameter
`= rim×25.4 + 2×(width×aspect/100)`. A size change alters speedometer reading by
`new/old - 1`.
**F-AUT-04 Speed from gearing** `v = (rpm × 60 × circumference)/(gear ratio × final drive)`.
**F-AUT-05 Depreciation** straight-line, declining-balance and market-data curves differ; a
calculator using a formula must say it is an estimate, not a valuation.""",
[
 ("Fuel Cost for a Trip","fuel-cost-trip","distance, consumption, price -> cost",M,1,0,"R"),
 ("MPG to L/100 km","mpg-l100km","consumption -> other unit",M,1,0,"R"),
 ("EV Efficiency","ev-efficiency","kWh, distance -> kWh/100 km",M,1,1,"R"),
 ("EV Charging Cost","ev-charging-cost","kWh, tariff, losses -> cost",M,2,1,"R"),
 ("EV Range Estimate","ev-range","battery kWh, consumption -> range",M,2,2,"R"),
 ("Tire Size Conversion","tire-size-conversion","size code -> diameter, width",M,2,1,"R"),
 ("Wheel Offset and Backspace","wheel-offset","width, offset -> backspace",M,2,2,"R"),
 ("Speed from Gear Ratio","speed-gear-ratio","rpm, ratios, tire -> speed",M,3,2,"R"),
 ("Engine Displacement","engine-displacement","bore, stroke, cylinders -> cc",M,2,1,"R"),
 ("Engine Compression Ratio","engine-compression-ratio","swept, clearance volume -> CR",M,2,2,"R"),
 ("Horsepower and Torque Conversion","hp-torque-conversion","hp <-> kW <-> torque",M,2,1,"R"),
 ("Vehicle Depreciation","vehicle-depreciation","price, years, rate -> value",M,2,1,"R"),
 ("Cost per Mile","cost-per-mile","costs, distance -> per mile",M,2,1,"R"),
 ("Idling Fuel Consumption","idling-fuel","idle hours, rate -> fuel, cost",M,2,2,"R"),
 ("Payload Capacity","payload-capacity","GVWR, curb, occupants -> payload",M,2,2,"R"),
 ("Towing Load Check","towing-load","trailer, cargo, limits -> margin",M,2,2,"R"),
])

cat("C43", "Aviation and Flight Planning", "Required topic 43",
"""**F-AVI-01 Atmosphere** pressure altitude `≈ elevation + 30(1013.25 - QNH_hPa)` ft;
density altitude `≈ PA + 120(T - ISA_temp)` °C. Both are approximations — label them.
**F-AVI-02 Airspeed** TAS `≈ IAS × (1 + altitude/1000 × 0.02)` is a rough rule; the
proper relation uses density ratio `TAS = IAS/√σ`, and CAS/EAS distinctions matter.
**F-AVI-03 Wind triangle** ground speed and drift from TAS, true course and wind:
`GS = √(TAS² + W² - 2·TAS·W·cos(Δ))`, `drift = asin(W·sin(Δ)/TAS)`.
**F-AVI-04 Weight and balance** `CG = Σ(moment)/Σ(weight)`; must be checked against an
envelope, not just a single limit.
**F-AVI-05 Regulatory values** (takeoff distances, fuel reserves, minima) come from the
AFM/POH and ICAO/FAA rules — never generated by a calculator.""",
[
 ("Density Altitude","density-altitude","elevation, QNH, temp -> DA",M,2,1,"R"),
 ("Pressure Altitude","pressure-altitude","elevation, QNH -> PA",M,1,2,"R"),
 ("True Airspeed","true-airspeed","IAS, altitude, temp -> TAS",M,3,2,"R"),
 ("Mach Number","mach-number","TAS, temperature -> Mach",M,2,2,"R"),
 ("Wind Triangle","wind-triangle","course, TAS, wind -> GS, drift",M,3,2,"R"),
 ("Fuel Endurance","fuel-endurance","fuel, burn rate -> endurance, range",M,2,1,"R"),
 ("Crosswind Component","crosswind-component","wind, runway -> crosswind",M,2,1,"R"),
 ("Weight and Balance CG","weight-balance-cg","weights, arms -> CG",M,3,2,"R"),
 ("Climb Gradient","climb-gradient","altitude gain, distance -> %",M,2,2,"R"),
 ("Descent Rate","descent-rate","altitude, ground speed, angle -> fpm",M,2,2,"R"),
 ("Flight Time","flight-time","distance, GS -> time",M,1,1,"R"),
 ("Takeoff Distance Estimate","takeoff-distance","weight, DA, wind -> distance",M,4,3,"X","AFM/POH data required; must not be generated."),
 ("QNH and QFE Conversion","qnh-qfe","pressure, elevation -> values",M,2,3,"R"),
])

cat("C44", "Marine and Maritime Calculations", "Required topic 44",
"""**F-MAR-01 Displacement** `Δ = L×B×T×Cb×ρ`; block coefficient Cb is hull-form specific.
**F-MAR-02 Hull speed** `v(kn) ≈ 1.34√LWL(ft)` = `2.43√LWL(m)`; a planing-hull approximation
limit, not a physical maximum.
**F-MAR-03 Propeller slip** `slip% = (theoretical - actual)/theoretical ×100`.
**F-MAR-04 Stability** `GM = KM - KG`; a positive GM is necessary but not sufficient for
seaworthiness — free-surface effect reduces GM by `FSM/Δ`.
**F-MAR-05 Load line / draft change** `Δdraft = weight/(TPC)` where TPC is tonnes per cm
immersion from the hydrostatic table. Never interpolate a hydrostatic table without stating it.""",
[
 ("Displacement","displacement","L, B, T, Cb -> tonnes",M,3,2,"R"),
 ("Deadweight Tonnage","deadweight-tonnage","loaded, light displacement -> DWT",M,2,2,"R"),
 ("Hull Speed","hull-speed","waterline length -> knots",M,1,2,"R"),
 ("Propeller Slip","propeller-slip","pitch, rpm, speed -> slip%",M,3,3,"R"),
 ("Marine Fuel Consumption","marine-fuel-consumption","power, SFOC, hours -> litres",M,3,2,"R"),
 ("Metacentric Height","gm-stability","KM, KG, FSC -> GM",M,4,3,"X","Requires hydrostatic tables from the vessel."),
 ("Anchor Scope","anchor-scope","depth, ratio -> rode length",M,1,2,"R"),
 ("Draft Change with Cargo","draft-change-cargo","weight, TPC -> change",M,3,3,"X","Hydrostatic table interpolation required."),
 ("Bilge Pump Time","bilge-pump-time","volume, pump rate -> time",M,1,2,"R"),
 ("Tide Window","tide-window","depth, tide curve -> window",M,3,3,"R"),
 ("Distance, Speed and Time at Sea","maritime-distance-time","any 2 -> third",M,1,1,"R"),
 ("Ballast Water Volume","ballast-water","tanks, trim -> volume",M,3,3,"R"),
 ("Container Vessel Utilisation","vessel-utilisation","slots, TEU -> %",M,2,3,"R"),
])

cat("C45", "Physics and Mechanics", "Required topic 45",
"""**F-PHY-01 Kinematics** `v = u + at`, `s = ut + ½at²`, `v² = u² + 2as`; valid for constant
acceleration only.
**F-PHY-02 Energy and momentum** `KE = ½mv²`, `PE = mgh`, `p = mv`, impulse `J = FΔt = Δp`;
energy is conserved only in the absence of non-conservative work.
**F-PHY-03 Circular motion** `a_c = v²/r`, `F_c = mv²/r`; centripetal force is a resultant,
not an extra applied force.
**F-PHY-04 Gravity** `F = Gm₁m₂/r²` with `G = 6.67430e-11 m³kg⁻¹s⁻²` (CODATA); surface
`g = GM/r²`.
**F-PHY-05 Waves** `v = fλ`; pendulum `T = 2π√(L/g)` valid for small angles only
(error ~0.2% at 10°, ~2% at 20°).""",
[
 ("Projectile Motion","projectile-motion","v, angle -> range, apex, time",M,3,1,"R"),
 ("Momentum and Impulse","momentum-impulse","mass, velocity, time -> p, J",M,2,1,"R"),
 ("Kinetic Energy","kinetic-energy","mass, velocity -> KE",M,1,0,"R"),
 ("Potential Energy","potential-energy","mass, height -> PE",M,1,1,"R"),
 ("Work and Power","work-energy","force, distance, time -> W, P",M,2,2,"R"),
 ("Circular Motion","circular-motion","v, r, m -> a_c, F_c",M,2,2,"R"),
 ("Gravitational Force","gravitation","masses, distance -> F, g",M,2,2,"R"),
 ("Simple Harmonic Motion","shm-spring","k, m, amplitude -> T, f, v_max",M,3,2,"R"),
 ("Pendulum Period","pendulum-period","length, g -> T",M,2,2,"R"),
 ("Wave Speed","wave-speed","frequency, wavelength -> v",M,1,2,"R"),
 ("Doppler Effect","doppler-effect","source/observer speeds -> f'",M,3,3,"R"),
 ("Snell's Law Refraction","snell-refraction","n1, θ1, n2 -> θ2, critical",M,2,2,"R"),
 ("Time Dilation","time-dilation","velocity -> γ, Δt'",M,3,3,"R"),
 ("Photon Energy","photon-energy","wavelength -> E",M,2,3,"R"),
 ("de Broglie Wavelength","de-broglie-wavelength","mass, velocity -> λ",M,3,3,"R"),
 ("Radioactive Decay","radioactive-decay","half-life, time -> remaining",M,2,3,"R"),
 ("Density and Specific Gravity","density-specific-gravity","mass, volume -> ρ, SG",M,1,1,"R"),
 ("Pressure at Depth","pressure-depth","depth, ρ -> p",M,1,1,"R"),
 ("Spring Constant","spring-constant","force, extension -> k",M,1,2,"R"),
 ("Coefficient of Restitution","restitution","velocities -> e",M,2,3,"R"),
])

cat("C46", "Chemistry and Laboratory Methods", "Required topic 46",
"""**F-CHM-01 Concentration** molarity `M = n/V(L)`; molality `m = n/kg solvent`;
mass percent `= m_solute/m_solution×100`; ppm `= mg/kg` (aqueous, dilute).
**F-CHM-02 Dilution** `C1V1 = C2V2` (moles conserved); does not hold when the solute reacts
or when volumes are not additive — state the assumption.
**F-CHM-03 pH** `pH = -log10(a_H+)`; for strong acid `[H+] = C`; for weak acid solve
`Ka = x²/(C-x)`. Buffer `pH = pKa + log([A-]/[HA])` (Henderson-Hasselbalch) — valid near pKa
and at moderate ionic strength.
**F-CHM-04 Stoichiometry** balance the equation, then limiting reagent
`min(n_i/ν_i)`; theoretical yield from that reagent.
**F-CHM-05 Half-life** first order `t½ = ln2/k`; zero and second order have different forms —
never apply ln2/k outside first order.""",
[
 ("Molarity","molarity","moles, volume -> M",M,1,0,"R"),
 ("Molality","molality","moles, solvent mass -> m",M,1,2,"R"),
 ("Dilution (C1V1)","dilution-c1v1","C1, V1, C2 -> V2",M,1,1,"R"),
 ("Mass Percent","mass-percent","solute, solution -> %",M,1,1,"R"),
 ("ppm and ppb","ppm-ppb","mass ratio -> ppm/ppb",M,1,2,"R"),
 ("Normality","normality","molarity, equivalents -> N",M,2,2,"R"),
 ("pH of Strong Acid","ph-strong-acid","concentration -> pH",M,1,1,"R"),
 ("pH of Weak Acid","ph-weak-acid","Ka, C -> pH",M,3,2,"R"),
 ("Buffer pH (Henderson-Hasselbalch)","buffer-henderson","pKa, ratio -> pH",M,2,2,"R"),
 ("Titration Calculation","titration-calculation","C, V, stoichiometry -> unknown",M,2,2,"R"),
 ("Stoichiometry","stoichiometry","equation, amounts -> product mass",M,2,1,"R"),
 ("Limiting Reagent","limiting-reagent","reactant amounts -> limiting, excess",M,2,2,"R"),
 ("Theoretical Yield","theoretical-yield","actual, theoretical -> %",M,1,1,"R"),
 ("Molar Mass","molar-mass","formula -> g/mol",M,2,1,"R"),
 ("Mole Conversion","mole-conversion","mass, moles, particles -> all",M,1,1,"R"),
 ("Combined Gas Law","combined-gas-law","P,V,T states -> unknown",M,2,2,"R"),
 ("Equilibrium Constant","equilibrium-constant","concentrations -> Kc, Kp",M,3,3,"R"),
 ("Reaction Half-Life","half-life-reaction","order, k -> t½",M,3,3,"R"),
 ("Arrhenius Rate","arrhenius-rate","Ea, T -> k ratio",M,3,3,"R"),
 ("Empirical Formula","empirical-formula","mass % -> formula",M,3,2,"R"),
])

cat("C47", "Biology and Life Sciences", "Required topic 47",
"""**F-BIO-01 Population growth** exponential `N(t) = N0 e^{rt}`; logistic
`N(t) = K/(1 + ((K-N0)/N0)e^{-rt})` — K must be supplied, not inferred.
**F-BIO-02 Hardy-Weinberg** `p² + 2pq + q² = 1`; assumes no selection, mutation, migration,
drift and random mating — state the assumption explicitly.
**F-BIO-03 Mendelian ratios** monohybrid 3:1, dihybrid 9:3:3:1 for independent assorting
heterozygotes; deviation requires a chi-square test (see C08), not eyeballing.
**F-BIO-04 Growth kinetics** doubling time `t_d = ln2/μ`; Monod `μ = μ_max S/(Ks+S)`.
**F-BIO-05 Enzyme kinetics** Michaelis-Menten `v = Vmax S/(Km+S)`; Lineweaver-Burk is a
linearisation that distorts error structure — prefer non-linear fitting.""",
[
 ("Exponential Population Growth","population-growth","N0, r, t -> N",M,2,2,"R"),
 ("Logistic Growth","logistic-growth","N0, r, K, t -> N",M,3,2,"R"),
 ("Hardy-Weinberg Equilibrium","hardy-weinberg","allele freq -> genotype freq",M,2,2,"R"),
 ("Punnett Ratio","punnett-ratio","cross -> phenotype ratio",M,2,2,"R"),
 ("Cell Doubling Time","cell-doubling-time","counts, time -> t_d",M,2,2,"R"),
 ("Bacterial Growth","bacterial-growth","lag, μ, time -> CFU",M,3,2,"R"),
 ("DNA Concentration","dna-concentration","A260, dilution -> ng/µL",M,2,2,"R"),
 ("Protein Molecular Weight","protein-molecular-weight","sequence -> kDa",M,3,3,"R"),
 ("Michaelis-Menten Kinetics","enzyme-kinetics-mm","Vmax, Km, S -> v",M,3,3,"R"),
 ("Serial Dilution","dilution-series","stock, factor, steps -> concentrations",M,2,2,"R"),
])

cat("C48", "Environmental Science and Emissions", "Required topic 48",
"""**F-ENV-01 Activity × factor** `emissions = activity × emission factor`; factors are
jurisdiction- and year-specific (e.g. grid intensity), so they must be versioned data with a
cited source. Scope 1/2/3 boundaries must be stated.
**F-ENV-02 Combustion CO₂** stoichiometric for a fuel: diesel ≈2.68 kg CO₂/L, petrol
≈2.31 kg CO₂/L, natural gas ≈1.9 kg CO₂/m³ — these are standard factors but must be sourced
per inventory (e.g. DEFRA/EPA), not hard-coded from memory.
**F-ENV-03 Waste diversion** `= diverted/(diverted+disposed)×100`; contamination reduces
effective diversion and should be an input.
**F-ENV-04 AQI** is a piecewise-linear index from pollutant concentration breakpoints; the
breakpoint table is pollutant- and jurisdiction-specific (US EPA vs WHO vs national).
**F-ENV-05 GWP** converts non-CO₂ gases using 100-year factors (AR5/AR6 differ: CH₄ 28 vs
29.8 fossil) — the assessment report must be selectable and displayed.""",
[
 ("Electricity CO2 Emissions","co2-electricity","kWh, grid factor -> kg CO2e",M,2,1,"R"),
 ("Vehicle CO2 per km","co2-per-km","fuel, distance -> g CO2/km",M,2,1,"R"),
 ("CO2 per Litre of Fuel","co2-per-litre-fuel","fuel type, litres -> kg CO2",M,1,1,"R"),
 ("Tree Offset Equivalent","tree-offset","CO2, sequestration rate -> trees",M,3,2,"R"),
 ("Water Footprint","water-footprint","use items -> litres",M,2,2,"R"),
 ("Waste Diversion Rate","waste-diversion-rate","diverted, total -> %",M,1,1,"R"),
 ("Recycling Rate","recycling-rate","recycled, generated -> %",M,1,2,"R"),
 ("Emission Factor Application","emission-factor","activity, factor -> emissions",M,1,1,"R"),
 ("AQI Category","aqi-category","concentration -> AQI, category",M,3,2,"R"),
 ("Carbon Credit Equivalent","carbon-credit","emissions -> credits",M,2,2,"R"),
 ("Energy Intensity","energy-intensity","energy, output -> intensity",M,1,2,"R"),
 ("GWP Conversion","gwp-conversion","gas mass, GWP -> CO2e",M,2,2,"R"),
 ("Compost Carbon-Nitrogen Ratio","compost-cn-ratio","inputs -> C:N",M,3,3,"R"),
 ("Scope 1-2-3 Emissions Summary","scope-emissions","activities -> scopes",M,3,2,"R"),
])

cat("C49", "Renewable Energy and Solar Systems", "Required topic 49",
"""**F-SOL-01 Yield** `E(kWh) = P(kW) × H(kWh/m²/day) × PR` where PR (performance ratio)
≈0.75-0.85 includes temperature, soiling, inverter and wiring losses; PR must be an input.
**F-SOL-02 Sizing** `PV kWp = daily demand / (H × PR)`; battery days of autonomy multiply
the required storage, not the array.
**F-SOL-03 Tilt/azimuth** yield depends on latitude, season and azimuth; the optimum tilt
is a site-specific optimisation, not a fixed "latitude" rule — any simple rule must be labelled
an approximation. NREL SAM/PVWatts (fetch failed from this environment) is the reference tool.
**F-SOL-04 Strings** `V_string = N × Voc × (1 + β(T_min - 25))` must stay below inverter
max voltage at record low temperature and above start voltage at high temperature.
**F-SOL-05 Payback** `= capex / annual savings`; ignoring degradation, tariff escalation and
inverter replacement overstates the result.""",
[
 ("PV System Size","pv-system-size","demand, irradiance, PR -> kWp",M,3,1,"R"),
 ("PV Daily Energy Yield","pv-daily-yield","kWp, irradiance, PR -> kWh",M,2,1,"R"),
 ("Panel Count","panel-count","kWp, panel wattage -> panels, area",M,1,1,"R"),
 ("Inverter Sizing","inverter-sizing","array kWp, DC:AC -> inverter",M,2,2,"R"),
 ("Solar Payback Period","pv-payback","capex, savings -> years",M,2,1,"R"),
 ("Solar ROI","pv-roi","capex, cash flows -> ROI",M,3,2,"R"),
 ("Optimal Tilt Estimate","tilt-angle","latitude, season -> tilt",M,2,2,"R","Rule-of-thumb methods only; must be labelled approximate."),
 ("Irradiance to kWh","irradiance-to-kwh","area, irradiance, efficiency -> kWh",M,2,2,"R"),
 ("String Voltage","string-voltage","Voc, count, temperature -> V range",M,3,2,"R"),
 ("PV Cable Sizing","pv-cable-sizing","current, length, drop -> mm²",M,3,2,"R"),
 ("Shading Loss","shading-loss","shaded fraction, config -> loss%",M,3,3,"R"),
 ("Solar Row Pitch","solar-row-spacing","tilt, latitude, height -> pitch",M,3,2,"R"),
 ("Solar Water Heating","solar-water-heating","demand, collector -> area, saving",M,3,3,"R"),
 ("Net Metering Savings","net-metering-savings","generation, consumption, tariff -> saving",M,2,2,"R"),
 ("Performance Ratio","performance-ratio","actual, expected -> PR",M,2,2,"R"),
])

cat("C50", "Batteries and Electrical Energy Storage", "Required topic 50",
"""**F-BAT-01 Runtime** ideal `t = C·V·DoD/P` hours; real runtime is reduced by Peukert
behaviour, inverter efficiency and temperature — an ideal-only answer must be labelled.
**F-BAT-02 Peukert** `t = H(C/(I·H))^k` with k typically 1.1-1.3 for lead-acid, 1.0-1.05 for
lithium; k is chemistry-specific, not universal.
**F-BAT-03 Packs** series adds voltage, parallel adds capacity; `Wh = Ah × V` only for a
single nominal voltage.
**F-BAT-04 Charge time** `t = capacity/(charge current × efficiency)`, and C-rate limits
apply per chemistry; exceeding them damages cells.
**F-BAT-05 SoC from voltage** is only reliable for rested lead-acid; lithium flat OCV curves
make voltage-based SoC unreliable — the tool must say so.""",
[
 ("Battery Runtime","battery-runtime","capacity, load, efficiency -> hours",M,2,1,"R"),
 ("Ah to Wh Conversion","ah-wh-conversion","Ah, voltage -> Wh",M,1,0,"R"),
 ("C-Rate","c-rate","capacity, current -> C",M,1,1,"R"),
 ("Charge Time","charge-time","capacity, current, efficiency -> hours",M,2,1,"R"),
 ("Series and Parallel Packs","pack-series-parallel","cells, config -> V, Ah, Wh",M,2,2,"R"),
 ("Peukert Capacity","peukert-capacity","C, I, k -> effective capacity",M,3,2,"R"),
 ("Depth of Discharge and Cycles","dod-cycle-life","DoD, chemistry -> life",M,3,3,"R"),
 ("UPS Runtime","ups-runtime","VA, load, battery -> minutes",M,3,2,"R"),
 ("State of Charge from Voltage","soc-from-voltage","chemistry, V -> SoC",M,3,3,"R","Chemistry-specific OCV tables required."),
 ("Battery Cost per kWh","battery-cost-kwh","price, capacity -> $/kWh",M,1,2,"R"),
])

cat("C51", "Astronomy and Orbital Mechanics", "Required topic 51",
"""**F-AST-01 Time** Julian Date from the Gregorian calendar; `JD 2451545.0 = 2000-01-01 12:00 TT`
(J2000.0 epoch). Calendar conversion must use the Julian/Gregorian switch rule for dates
before 1582-10-15.
**F-AST-02 Kepler** `T² = 4π²a³/(GM)`; circular orbital speed `v = √(GM/r)`.
**F-AST-03 Geometry** angular size `θ ≈ 2·arctan(d/(2D))`; magnitude difference
`m1 - m2 = -2.5·log10(F1/F2)`; redshift `z = (λ_obs - λ_emit)/λ_emit`.
**F-AST-04 Solar position** accurate solar altitude/azimuth requires the NREL SPA (or Meeus)
algorithm with refraction and nutation terms; simple declination formulas carry ~1° error and
must be labelled approximate.
**F-AST-05 Hohmann transfer** `Δv1 = √(μ/r1)(√(2r2/(r1+r2)) - 1)` — impulsive, coplanar,
circular-to-circular only.""",
[
 ("Julian Date","julian-date","calendar date/time -> JD, MJD",M,2,2,"R"),
 ("Moon Phase","moon-phase","date -> phase, illumination",M,3,2,"R"),
 ("Sunrise and Sunset","sunrise-sunset","date, lat, lon -> times",M,3,1,"R","NOAA solar calculator algorithm; verify against gml.noaa.gov."),
 ("Solar Position","solar-position","date, time, lat, lon -> alt, az",M,4,2,"R"),
 ("Escape Velocity","escape-velocity","mass, radius -> v_esc",M,2,2,"R"),
 ("Orbital Period (Kepler)","orbital-period","semi-major axis, mass -> T",M,2,2,"R"),
 ("Hohmann Transfer","hohmann-transfer","r1, r2 -> Δv, time",M,4,3,"R"),
 ("Apparent Magnitude","star-magnitude","flux ratio -> Δm",M,2,3,"R"),
 ("Angular Size","angular-size","diameter, distance -> angle",M,1,2,"R"),
 ("Redshift","redshift","wavelengths -> z, velocity",M,2,3,"R"),
 ("Light-Year Distance","light-year-distance","years -> metres, AU, pc",M,1,2,"R"),
 ("Sidereal Time","sidereal-time","date, longitude -> LST",M,3,3,"R"),
 ("Satellite Look Angle","satellite-look-angle","observer, satellite -> az, el, range",M,4,3,"R"),
])

cat("C52", "Geography, Mapping and Surveying", "Required topic 52",
"""**F-GEO-05 Great-circle distance** haversine
`d = 2R·asin(√(sin²(Δφ/2) + cosφ1·cosφ2·sin²(Δλ/2)))` with R = 6 371.0088 km (mean) —
different Earth models change results by up to ~0.5%, so the radius must be stated.
**F-GEO-06 Bearing** initial bearing
`θ = atan2(sinΔλ·cosφ2, cosφ1·sinφ2 - sinφ1·cosφ2·cosΔλ)`, normalised to 0-360°.
**F-GEO-07 Coordinate area** spherical excess for geodesic polygons; planar shoelace on
projected coordinates only for small areas.
**F-GEO-08 DMS** `dd = d + m/60 + s/3600` with sign from hemisphere; parsing must reject
`m ≥ 60`, `s ≥ 60`.
**F-GEO-09 Traverse closure** `ΣΔE, ΣΔN`; linear misclosure
`= √(ΣΔE² + ΣΔN²)`, relative precision `= misclosure/perimeter`.""",
[
 ("Haversine Distance","haversine-distance","lat/lon pair -> km",M,2,1,"R"),
 ("Initial Bearing","initial-bearing","lat/lon pair -> bearing",M,2,1,"R"),
 ("Latitude Longitude Midpoint","latlong-midpoint","2 points -> midpoint",M,2,2,"R"),
 ("Area from Coordinates","coordinate-area","polygon vertices -> area",M,3,2,"R"),
 ("Slope and Gradient","slope-gradient","rise, run -> %, ratio, degrees",M,1,1,"R"),
 ("Contour Interval","contour-interval","scale, terrain -> interval",M,2,3,"R"),
 ("Traverse Closure","traverse-closure","legs, bearings -> misclosure",M,3,3,"R"),
 ("Distance to Horizon","distance-to-horizon","eye height -> km",M,1,2,"R"),
 ("Map Scale Conversion","map-scale","scale, map distance -> ground",M,2,1,"R"),
 ("DMS to Decimal Degrees","dms-decimal","d, m, s -> decimal",M,1,0,"R"),
 ("UTM Coordinate Conversion","utm-conversion","lat/lon -> UTM",M,4,2,"R"),
 ("Timezone from Longitude","timezone-from-longitude","longitude -> offset",M,2,2,"R"),
 ("Elevation Profile","elevation-profile","points, elevations -> gain, grade",M,2,2,"R"),
 ("North Reference Conversion","north-reference","true/magnetic/grid -> bearings",M,3,3,"R"),
])

cat("C53", "Meteorology and Climate", "Required topic 53",
"""**F-MET-01 Wind chill (NWS/Canada)** verified on weather.gov:
`T_wc(°F) = 35.74 + 0.6215T - 35.75V^0.16 + 0.4275T·V^0.16`, T in °F, V in mph.
Defined ONLY for T ≤ 50 °F and V > 3 mph; the index applies to human/animal skin, not objects,
and assumes a clear night sky (sun can add 10-18 °F). Inanimate objects cannot be cooled below
air temperature.
**F-MET-02 Heat index (Rothfusz regression, NWS)** verified on weather.gov:
`HI = -42.379 + 2.04901523T + 10.14333127RH - 0.22475541·T·RH - 0.00683783T²
- 0.05481717RH² + 0.00122874T²RH + 0.00085282TRH² - 0.00000199T²RH²`, T °F, RH %.
Stated regression error ±1.3 °F; values are for shade; add up to 15 °F in direct sun.
**F-MET-03 Dew point / humidity** Magnus-Tetens:
`Td = (b·α)/(a - α)`, `α = ln(RH/100) + aT/(b+T)` with a = 17.625 °C, b = 243.04 °C
(valid ~ -40..50 °C, ~1% RH error); state the coefficient set.
**F-MET-04 Wet bulb** requires solving the psychrometric energy balance or a validated
approximation (Stull 2011); do not present a linear rule as exact.
**F-MET-05 Rainfall** `volume = area × depth`; 1 mm over 1 m² = 1 litre.""",
[
 ("Wind Chill","wind-chill","temp °F/°C, wind -> wind chill",M,1,0,"S","Formula, validity limits (T<=50F, V>3mph) and caveats verified on weather.gov."),
 ("Heat Index","heat-index","temp, RH -> feels-like, category",M,2,0,"S","Rothfusz coefficients and +/-1.3F error and sun adjustment verified on weather.gov."),
 ("Dew Point","dew-point","temp, RH -> dew point",M,2,1,"R"),
 ("Relative Humidity","relative-humidity","temp, dew point -> RH",M,2,1,"R"),
 ("Wet Bulb Temperature","wet-bulb","temp, RH, pressure -> Tw",M,3,2,"R"),
 ("Humidex","humidex","temp, dew point -> humidex",M,2,2,"R"),
 ("Cloud Base Height","cloud-base","temp, dew point -> base",M,2,2,"R"),
 ("Rainfall Volume","rainfall-volume","area, depth -> litres, m3",M,1,1,"R"),
 ("Snow Water Equivalent","snow-water-equivalent","snow depth, density -> mm water",M,2,2,"R"),
 ("Wind Pressure on a Surface","wind-load-pressure","speed, area, Cd -> force",M,3,2,"R"),
 ("Station Pressure from Altitude","station-pressure","elevation, QNH -> pressure",M,2,3,"R"),
 ("Barometric Formula","barometric-formula","altitude -> pressure",M,3,3,"R"),
])

cat("C54", "Agriculture and Horticulture", "Required topic 54",
"""**F-AGR-01 Plant population** `plants/ha = 10 000/(row_spacing_m × plant_spacing_m)`.
**F-AGR-02 Seed rate** `kg/ha = target_plants/m² × thousand_grain_weight(g)/1000 / germination`.
**F-AGR-03 Growing degree days** `GDD = Σ max(0, (T_max+T_min)/2 - T_base)`; base temperature
is crop-specific and must come from an extension source for that crop.
**F-AGR-04 Grain moisture shrink** `shrink% = (MC_initial - MC_target)/(100 - MC_target)×100`
(the standard "wet-bushel" shrink formula) — different from a simple linear subtraction.
**F-AGR-05 Stocking rate** `AU/ha = forage_production × utilisation/(animal intake × days)`;
carrying capacity depends on the local forage assessment.""",
[
 ("Crop Yield","crop-yield","area, production -> t/ha",M,1,1,"R"),
 ("Seed Rate","seed-rate","target plants, TGW, germination -> kg/ha",M,3,2,"R"),
 ("Plant Population","plant-population","row, plant spacing -> plants/ha",M,1,1,"R"),
 ("Row Spacing and Plant Count","row-spacing","bed width, rows -> spacing",M,1,2,"R"),
 ("Growing Degree Days","growing-degree-days","temps, base -> GDD",M,2,2,"R"),
 ("Grain Moisture Shrink","grain-moisture-shrink","moistures -> shrink%",M,2,2,"R"),
 ("Harvest Loss","harvest-loss","yield, loss -> %",M,1,2,"R"),
 ("Stocking Rate","stocking-rate","forage, intake -> AU/ha",M,3,3,"R"),
 ("Hay Bale Count","hay-bale-count","yield, bale weight -> bales",M,1,2,"R"),
 ("Land Area Conversion","land-area-conversion","acres/hectares/m2 -> all",M,1,1,"R"),
 ("Field Capacity Time","field-capacity-time","area, implement width, speed -> hours",M,2,2,"R"),
 ("Livestock Feed Requirement","livestock-feed","animals, ration -> daily feed",M,3,3,"R"),
])

cat("C55", "Irrigation, Fertilisers and Crop Production", "Required topic 55",
"""**F-IRR-01 Crop water use** `ETc = ET0 × Kc` (FAO 56). ET0 from the FAO Penman-Monteith
reference surface (h = 0.12 m grass, 2 m measurement height, r_l = 100 s/m, LAI = 24h);
Kc is crop- and stage-specific and must be sourced from FAO 56 tables.
FAO 56 Chapter 2 (inspected) warns the resistance formulation assumes neutral stability and
hourly steps may need stability corrections.
**F-IRR-02 Net irrigation** `d_net = ETc - effective rainfall`; gross `= d_net/application
efficiency` (drip 0.90, sprinkler 0.75, surface 0.60 are typical published ranges — expose them).
**F-IRR-03 Emitters** `count = area/(emitter_spacing × row_spacing)`; run time
`t = volume_required/(emitters × emitter_flow)`.
**F-IRR-04 Fertiliser** nutrient mass `= product mass × nutrient%`; converting elemental P to
P₂O₅ multiplies by 2.2914, K to K₂O by 1.2046, Ca to CaO by 1.3992 — oxide-basis conversions
are a frequent source of gross dosing errors.
**F-IRR-05 Lime requirement** requires soil test buffer pH; it is not derivable from target pH
alone.""",
[
 ("Irrigation Requirement (ETc)","irrigation-requirement","ET0, Kc -> ETc",M,2,1,"S","FAO 56 method and reference-surface constants inspected; Kc tables still to be sourced."),
 ("Crop Coefficient Calculator","crop-coefficient-etc","ET0, Kc, area -> volume",M,2,1,"R"),
 ("Drip Emitter Count","drip-emitter-count","area, spacing -> emitters, flow",M,2,1,"R"),
 ("Sprinkler Spacing and Coverage","sprinkler-spacing","head, pressure, wind -> spacing",M,3,2,"R"),
 ("Irrigation Interval","irrigation-interval","soil water, ETc -> days",M,3,2,"R"),
 ("Soil Moisture Depletion","soil-moisture-depletion","FC, PWP, root depth -> depletion",M,3,2,"R"),
 ("Leaching Requirement","leaching-requirement","ECw, ECe -> fraction",M,3,3,"R"),
 ("NPK Blend Formulation","npk-blend","target grades, products -> blend",M,3,2,"R"),
 ("Fertiliser Rate by Nutrient","fertilizer-rate-nutrient","nutrient target, product% -> kg",M,2,1,"R"),
 ("Elemental to Oxide Conversion","oxide-conversion","P/K/Ca -> P2O5/K2O/CaO",M,1,2,"R"),
 ("Lime Requirement","lime-requirement","soil pH, buffer -> tonnes",M,3,3,"X","Requires soil-test buffer method; region-specific."),
 ("Compost Application Rate","compost-application","area, depth, density -> volume",M,2,2,"R"),
])

cat("C56", "Food Preparation and Recipe Scaling", "Required topic 56",
"""**F-FOD-01 Scaling** every ingredient multiplies by `factor = new_yield/old_yield`; but
leavening, salt, and alcohol do not scale linearly in practice — the tool must warn and offer a
non-linear mode for those categories rather than silently scaling.
**F-FOD-02 Baker's percentage** flour = 100%; `ingredient% = mass/flour_mass×100`;
hydration `= water/flour×100`. Percentages can exceed 100% and sum above 100%.
**F-FOD-03 Pan conversion** compare by area (round: `πr²`; square: `l×w`) and scale by
`new_area/old_area`; depth changes bake time independently of area.
**F-FOD-04 Brine** `% = salt_mass/(water_mass + salt_mass)×100` (w/w) vs salt/water (w/v) —
these differ materially and must be labelled.
**F-FOD-05 Alcohol dilution** `V_w = V_s(C_s/C_t - 1)`; volume contraction on mixing means
the result is approximate (state ±).""",
[
 ("Recipe Scaling","recipe-scaling","servings, factor -> scaled ingredients",M,1,0,"R"),
 ("Serving Size Conversion","serving-conversion","recipe yield, portions -> portion size",M,1,1,"R"),
 ("Baking Pan Size Conversion","pan-size-conversion","pan shapes -> factor",M,2,1,"R"),
 ("Baker's Percentage","baker-percentage","flour, ingredients -> %",M,2,1,"R"),
 ("Dough Hydration","dough-hydration","water, flour -> %",M,1,1,"R"),
 ("Coffee Brew Ratio","coffee-ratio","coffee, water -> ratio, strength",M,1,1,"R"),
 ("Brine Concentration","brine-concentration","salt, water -> %",M,2,2,"R"),
 ("Alcohol Dilution","alcohol-dilution","volume, ABV -> water to add",M,2,2,"R"),
 ("ABV to Proof","abv-proof","ABV <-> proof",M,1,2,"R"),
 ("Cooking Time by Weight","cooking-time-weight","mass, rate -> time",M,2,2,"R"),
 ("Meat Cooking Loss","meat-cooking-loss","raw, cooked -> loss%",M,1,2,"R"),
 ("Recipe Cost","recipe-cost","ingredient costs -> cost per serving",M,2,1,"R"),
 ("Portion Size Planning","portion-size","guests, per-portion -> total",M,1,2,"R"),
 ("Food Waste Cost","food-waste-cost","waste, cost -> annual loss",M,1,3,"R"),
])

cat("C57", "Nutrition and Dietary Calculations", "Required topic 57",
"""**F-NUT-01 BMI** `BMI = kg/m²`; US customary `703×lb/in²`. CDC adult categories verified:
<18.5 underweight; 18.5-<25 healthy; 25-<30 overweight; 30-<35 class 1; 35-<40 class 2;
≥40 class 3. CDC states BMI is a screening measure, not a diagnosis, and applies to adults
20+ regardless of age, sex or race; children need age-sex percentiles.
**F-NUT-02 BMR** Mifflin-St Jeor: men `10kg + 6.25cm - 5age + 5`; women `-161`.
Harris-Benedict (revised) is a different, older equation — results differ ~5%, so the choice
must be shown.
**F-NUT-03 TDEE** `BMR × activity factor`; activity multipliers are population averages with
large individual variance (±20%+).
**F-NUT-04 Macros** `protein 4 kcal/g, carbohydrate 4, fat 9, alcohol 7`; the sum must
reconcile with total energy within rounding.
**F-NUT-05 Body fat (US Navy)** circumference regression; accuracy ±3-4% and population
specific — must be labelled an estimate.""",
[
 ("BMI Calculator","bmi","height, weight -> BMI, category",M,1,0,"S","Formula and adult categories verified on cdc.gov; adult-only limitation stated."),
 ("BMR (Mifflin-St Jeor)","bmr-mifflin","age, sex, height, weight -> kcal",M,1,0,"R"),
 ("TDEE","tdee","BMR, activity -> kcal",M,1,1,"R"),
 ("Calorie Deficit Plan","calorie-deficit-plan","TDEE, target -> intake, timeline",M,2,1,"R"),
 ("Macro Split","macro-split","calories, ratios -> grams",M,1,1,"R"),
 ("Protein Requirement","protein-requirement","weight, goal -> grams",M,2,2,"R"),
 ("Fibre Intake","fiber-intake","age, sex -> grams",M,1,3,"R"),
 ("Water Intake","water-intake","weight, activity -> litres",M,1,2,"R"),
 ("Body Fat (US Navy)","body-fat-navy","circumferences -> body fat%",M,3,2,"R"),
 ("Waist-to-Hip Ratio","waist-hip-ratio","waist, hip -> WHR, risk band",M,1,2,"R"),
 ("Ideal Body Weight","ideal-body-weight","height, sex -> range",M,1,2,"R"),
 ("Child BMI Percentile","bmi-percentile-child","age, sex, BMI -> percentile",M,3,1,"X","Requires CDC growth-chart LMS tables; paediatric review."),
 ("Sodium Intake","sodium-intake","foods -> mg sodium",M,2,3,"R"),
 ("Added Sugar Limit","added-sugar-limit","calories -> grams limit",M,1,3,"R"),
 ("Alcohol Calories","alcohol-calories","drink, volume, ABV -> kcal",M,2,2,"R"),
])

cat("C58", "Fitness and Exercise", "Required topic 58",
"""**F-FIT-01 One-rep max** Epley `1RM = w(1 + reps/30)`; Brzycki `w×36/(37-reps)`. These
estimates diverge above ~10 reps; never present as a measured maximum and require a safety note.
**F-FIT-02 Pace** `pace = time/distance`; conversions must keep min/km vs min/mile explicit.
**F-FIT-03 Heart rate zones** percent-of-max: `HR_max` from 220-age is a population average
with ±10-12 bpm SD; Tanaka (`208 - 0.7age`) is an alternative — the formula must be selectable.
**F-FIT-04 MET calories** `kcal = MET × 3.5 × kg / 200 × minutes`; MET values come from the
Compendium of Physical Activities and are averages.
**F-FIT-05 VO2max (Cooper)** `= (distance_m - 504.9)/44.73` for the 12-minute run — a field
estimate, not a lab measurement.""",
[
 ("One-Rep Max","one-rep-max","weight, reps -> 1RM (Epley/Brzycki)",M,2,1,"R"),
 ("Training Volume","training-volume","sets, reps, load -> tonnage",M,1,2,"R"),
 ("Running Pace","running-pace","distance, time -> pace, speed",M,1,0,"R"),
 ("Split Times","split-times","target time, splits -> per-km",M,1,1,"R"),
 ("VO2max (Cooper)","vo2max-cooper","12-min distance -> VO2max",M,2,2,"R"),
 ("Heart Rate Zones","heart-rate-zones","age, resting HR -> zones",M,2,1,"R"),
 ("Calories Burned (MET)","met-calorie-burn","MET, weight, time -> kcal",M,2,1,"R"),
 ("Steps to Distance","steps-to-distance","steps, stride -> km",M,1,2,"R"),
 ("Race Time Prediction (Riegel)","riegel-prediction","race 1, race 2 -> predicted",M,2,2,"R"),
 ("Swim Pace","swim-pace","distance, time -> per 100 m",M,1,2,"R"),
 ("Cycling Speed and Power","cycling-speed-power","power, weight, grade -> speed",M,4,3,"R"),
 ("Weight Loss Rate","weight-loss-rate","deficit -> kg/week",M,2,1,"R"),
 ("Body Recomposition Tracker","body-recomp","weight, body fat -> lean mass change",M,2,3,"R"),
 ("Treadmill Incline Equivalent","treadmill-incline","speed, incline -> outdoor effort",M,2,3,"R"),
])

cat("C59", "General Health and Clinical Screening", "Required topic 59",
"""These are screening/estimation tools, NOT diagnostic devices. Every page requires a medical
disclaimer, the validated equation name and version, its intended population, and a clear
statement of what the tool cannot do.
**F-HLT-01 eGFR (CKD-EPI 2021)** creatinine-based, race-free:
`eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1.200 × 0.9938^age × 1.012 [if female]`
with κ = 0.7 (F)/0.9 (M), α = -0.241 (F)/-0.302 (M). Requires the 2021 equation; older
MDRD/CKD-EPI-2009 variants give different numbers and must not be mixed.
**F-HLT-02 Cockcroft-Gault** `CrCl = ((140-age)×weight)/(72×Scr) ×0.85 if female` — still used
for drug dosing, but it is NOT eGFR.
**F-HLT-03 Widmark** `BAC% = (A×5.14/W×r) - 0.015t`; r ≈0.73 male/0.66 female; ignores
absorption kinetics and is unsuitable for legal or driving decisions.
**F-HLT-04 Due date** Naegele `LMP + 280 days`; only valid for a regular 28-day cycle —
ultrasound dating supersedes it.
**F-HLT-05 IV rate** `mL/h = volume/time`; `drops/min = (volume×drop_factor)/(time_min)`.
**F-HLT-06 Paediatric dosing** mg/kg requires a verified weight and a stated maximum dose;
the tool must refuse to output a dose without an explicit mg/kg source.""",
[
 ("eGFR (CKD-EPI 2021)","egfr-ckdepi","creatinine, age, sex -> eGFR",M,3,1,"X","Renal equation; clinical review and KDIGO citation required before publish."),
 ("Creatinine Clearance (Cockcroft-Gault)","creatinine-clearance","age, weight, Scr -> CrCl",M,2,2,"X","Drug-dosing context; pharmacist review."),
 ("Blood Alcohol (Widmark)","blood-alcohol-widmark","drinks, weight, time -> BAC",M,3,2,"X","Estimate only; legally unreliable; disclaimer mandatory."),
 ("Due Date (Naegele)","due-date-naegele","LMP, cycle length -> EDD",M,2,1,"R"),
 ("Ovulation Window","ovulation-window","cycle length, LMP -> fertile days",M,2,2,"R"),
 ("Paediatric Dose by Weight","pediatric-dose-weight","weight, mg/kg, max -> dose",M,3,1,"X","Requires prescriber oversight; high-risk."),
 ("IV Drip Rate","iv-drip-rate","volume, time, drop factor -> gtt/min",M,2,1,"X","Nursing calculation; double-check policy required."),
 ("Mean Arterial Pressure","map-calculation","SBP, DBP -> MAP",M,1,2,"R"),
 ("Anion Gap","anion-gap","Na, Cl, HCO3 -> gap",M,1,3,"X","Clinical interpretation required."),
 ("Corrected Calcium","corrected-calcium","Ca, albumin -> corrected",M,2,3,"X","Clinical use."),
 ("LDL Cholesterol (Friedewald)","ldl-friedewald","TC, HDL, TG -> LDL",M,2,2,"R","Invalid when TG > 400 mg/dL; limitation must be enforced."),
 ("Serum Osmolality","serum-osmolality","Na, glucose, BUN -> osmolality",M,2,3,"R"),
 ("Pack-Years","pack-years","cigarettes/day, years -> pack-years",M,1,2,"R"),
 ("Daily Fluid Requirement","fluid-requirement","weight, age -> mL/day",M,2,2,"R"),
 ("Insulin Correction Dose","insulin-correction","BG, target, ISF -> units",M,3,3,"X","High-risk; requires clinician-defined parameters."),
 ("Cardiovascular Risk Score","cardiovascular-risk","risk factors -> 10-year risk",M,4,2,"X","Requires a specific validated model (e.g. ASCVD PCE) and population caveats."),
])

cat("C60", "Date, Time and Calendar", "Required topic 60",
"""**F-DTM-01 Date difference** use calendar arithmetic, not `(ms2-ms1)/86400000`, because DST
transitions and leap seconds make civil days unequal. Define inclusivity explicitly
(days between vs days inclusive) — users assume different conventions.
**F-DTM-02 Add/subtract** `Date + n days` in UTC then convert for display; adding months must
clamp the day-of-month (31 Jan + 1 month = 28/29 Feb).
**F-DTM-03 Business days** require a holiday calendar (jurisdiction/year specific); weekends
alone are not business days in many countries.
**F-DTM-04 ISO week** weeks start Monday, week 1 is the week containing the first Thursday;
naive `weekOfYear` implementations are off by one at year boundaries.
**F-DTM-05 Age** completed years = calendar difference minus one if the birthday has not yet
occurred this year; do not divide days by 365.25 for a stated age.""",
[
 ("Date Difference","date-difference","two dates -> days, months, years",M,2,0,"R"),
 ("Add or Subtract Days","add-days","date, offset -> new date",M,1,0,"R"),
 ("Business Days Between","business-days","dates, holidays -> working days",M,2,1,"R"),
 ("Age Calculator","age-calculator","birth date -> age",M,1,0,"R"),
 ("Day of Week","weekday","date -> weekday",M,1,1,"R"),
 ("ISO Week Number","iso-week-number","date -> ISO week",M,2,2,"R"),
 ("Leap Year Check","leap-year","year -> leap?",M,1,1,"R"),
 ("Time Duration","time-duration","start, end -> h:m:s",M,1,0,"R"),
 ("Timezone Shift","timezone-shift","time, from, to -> converted",M,3,2,"R"),
 ("Work Hours","work-hours","start, end, breaks -> hours",M,2,1,"R"),
 ("Countdown","countdown","target date -> remaining",M,1,2,"R"),
 ("Day of Year","day-of-year","date -> ordinal day",M,1,2,"R"),
 ("ISO 8601 Format Converter","iso-date-format","date -> ISO string",M,1,2,"R"),
 ("Timesheet Total","timesheet-total","entries -> total hours, pay",M,2,1,"R"),
 ("Date of Easter (Computus)","date-of-easter","year -> date",M,3,3,"R"),
])

cat("C61", "Unit Conversion and Measurement", "Required topic 61",
"""**F-UNI-01 Exact factors only.** Conversion factors come from NIST SP 811 Appendix B.
The inspected table marks exact factors in bold, e.g. inch = 25.4 mm (exact), pound =
0.453 592 37 kg (exact), standard gravity 9.806 65 m/s² (exact), standard atmosphere
101 325 Pa (exact), Btu_IT = 1.055 056 kJ (not exact). Convert via a single canonical base unit
(SI) and never round intermediates; round only the displayed result.
**F-UNI-02 Temperature is affine, not multiplicative**: `°F = °C×9/5 + 32`, `K = °C + 273.15`
(exact), `°R = °F + 459.67`. Applying a ratio factor to temperatures is wrong.
**F-UNI-03 Significant figures** must be preserved: a 3-significant-figure input cannot
legitimately produce 10 significant figures of output. Display rounding rules belong in the
shared formatting layer, not in each calculator.
**F-UNI-04 US vs imperial** gallons (US 3.785 411 784 L exact vs imperial 4.546 09 L),
tons (short 907.184 74 kg vs long 1016.046 908 8 kg vs metric 1000 kg) differ — never offer
"gallon" or "ton" without a system qualifier.
**F-UNI-05 SI prefixes** are powers of 10 (kibi/mebi are powers of 2 for data, see C65).""",
[
 ("Length Converter","length-converter","any length unit -> all",M,1,0,"S"),
 ("Mass Converter","mass-converter","any mass unit -> all",M,1,0,"R"),
 ("Area Converter","area-converter","m2/ft2/acre/ha -> all",M,1,0,"R"),
 ("Volume Converter","volume-converter","L/gal/m3 -> all",M,1,0,"S"),
 ("Temperature Converter","temperature-converter","C/F/K/R -> all",M,1,1,"S"),
 ("Speed Converter","speed-converter","m/s, km/h, mph, kn -> all",M,1,0,"S"),
 ("Pressure Converter","pressure-converter","Pa, bar, psi, atm -> all",M,1,1,"S"),
 ("Energy Converter","energy-converter","J, cal, kWh, Btu -> all",M,1,1,"S"),
 ("Power Converter","power-converter","W, hp, BTU/h -> all",M,1,1,"S"),
 ("Force Converter","force-converter","N, lbf, kgf -> all",M,1,1,"S"),
 ("Torque Converter","torque-converter","N·m, lbf·ft -> all",M,1,2,"S"),
 ("Flow Rate Converter","flow-rate-converter","L/s, m3/h, gpm -> all",M,2,2,"S"),
 ("Acceleration Converter","acceleration-converter","m/s2, g, ft/s2 -> all",M,1,3,"S"),
 ("Density Converter","density-converter","kg/m3, lb/ft3 -> all",M,2,3,"R"),
 ("Viscosity Converter","viscosity-converter","cP, Pa·s, cSt -> all",M,3,3,"R"),
 ("Illuminance Converter","illuminance-converter","lux, fc, cd/m2 -> all",M,2,3,"S"),
])

cat("C62", "Computer Science and Algorithms", "Required topic 62",
"""**F-CSC-01 Radix conversion** repeated division; negative values need two's-complement
semantics stated explicitly (e.g. 8-bit `-1 = 11111111`).
**F-CSC-02 IEEE-754** double: 1 sign, 11 exponent (bias 1023), 52 fraction; value
`(-1)^s × 2^(e-1023) × 1.f`. Only ~15-17 significant decimal digits are representable, which
is why money must not use binary floats.
**F-CSC-03 Hash table load factor** `α = n/m`; expected probe cost grows sharply above
α ≈ 0.7 for open addressing.
**F-CSC-04 Binary search** worst case `⌈log2(n+1)⌉` comparisons; requires sorted input —
stating the complexity without the precondition is a common error.
**F-CSC-05 Complexity** O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!);
a calculator can only classify a supplied function, not measure runtime.""",
[
 ("Number Base Conversion","number-base-conversion","value, base -> others",M,2,1,"R"),
 ("Bitwise Operations","bitwise-operations","integers, op -> result",M,1,1,"R"),
 ("Boolean Truth Table","boolean-truth-table","expression -> table",M,2,1,"R"),
 ("ASCII and Unicode Converter","ascii-unicode","text <-> codes",M,1,1,"R"),
 ("Two's Complement","twos-complement","value, bits -> binary",M,2,2,"R"),
 ("IEEE-754 Representation","ieee754-representation","number -> sign/exp/frac",M,3,2,"R"),
 ("Base64 Encoded Size","base64-length","bytes -> encoded length",M,1,2,"R"),
 ("Binary Search Steps","binary-search-steps","n, target -> comparisons",M,1,2,"R"),
 ("Hash Load Factor","hash-load-factor","entries, buckets -> α",M,1,3,"R"),
 ("Recursion Depth Limit","recursion-depth","input size, branching -> depth",M,2,3,"R"),
 ("Algorithm Complexity Classifier","algorithm-complexity","operation counts -> O()",M,4,3,"R"),
 ("Checksum and CRC Estimate","checksum-crc","data length, polynomial -> bits",M,3,3,"R"),
])

cat("C63", "Programming and Software Development", "Required topic 63",
"""**F-PRG-01 COCOMO** basic effort `E = a·(KLOC)^b` person-months with mode-specific a,b
(organic/semi-detached/embedded); the coefficients are from the 1981 COCOMO model and its
accuracy on modern projects is poor — label it a historical model.
**F-PRG-02 Function points** weighted sum of inputs/outputs/queries/files/interfaces with
complexity adjustments; the weighting tables are method-specific (IFPUG).
**F-PRG-03 Velocity** `completed points/sprint`; only valid within a stable team and
definition of done. Story points are not time and cannot be converted by a constant factor.
**F-PRG-04 Cyclomatic complexity** `M = E - N + 2P` from the control-flow graph; it measures
branching, not readability.
**F-PRG-05 Coverage** `= executed lines/total lines`; 100% line coverage does not imply
correctness.""",
[
 ("COCOMO Effort Estimate","cocomo-effort","KLOC, mode -> effort, time",M,3,3,"R"),
 ("Function Point Estimate","function-points","components -> FP",M,3,3,"R"),
 ("Sprint Capacity","sprint-capacity","team, days, focus -> points",M,2,2,"R"),
 ("Team Velocity","velocity","completed, sprints -> average",M,1,2,"R"),
 ("Story Point Conversion","story-point-conversion","points, hours -> ratio",M,2,3,"X","Non-linear in reality; must be presented as team-specific only."),
 ("Bug Density","bug-density","bugs, KLOC -> density",M,1,2,"R"),
 ("Test Coverage","test-coverage","executed, total -> %",M,1,1,"R"),
 ("Cyclomatic Complexity","cyclomatic-complexity","edges, nodes -> M",M,2,2,"R"),
 ("Technical Debt Ratio","technical-debt-ratio","remediation, dev cost -> %",M,2,3,"R"),
 ("API Rate Limit Budget","api-rate-limit","requests, window -> safe rate",M,2,2,"R"),
 ("Development Time Estimate","dev-time-estimate","tasks, uncertainty -> range",M,3,2,"R"),
 ("Code Review Time","code-review-time","diff size, rate -> minutes",M,1,3,"R"),
])

cat("C64", "Networking, IP Addressing and Subnetting", "Required topic 64",
"""**F-NET-01 IPv4 subnetting** mask `/p` gives `2^(32-p)` addresses,
`2^(32-p) - 2` usable hosts (network and broadcast reserved) — except /31 (RFC 3021 point-to-
point, 2 usable) and /32. Block size `= 2^(8 - (p mod 8))` within the relevant octet.
**F-NET-02 Network/broadcast** network `= ip AND mask`; broadcast `= network OR NOT mask`.
**F-NET-03 Private ranges** RFC 1918: 10/8, 172.16/12, 192.168/16; loopback 127/8;
link-local 169.254/16. These must be flagged as non-routable.
**F-NET-04 IPv6** a /64 is the standard host subnet; `2^64` addresses; `2^(128-p)` subnets.
**F-NET-05 Transfer time** `t = size/throughput` with consistent units (Mbps vs MB/s is a
factor-of-8 trap), plus protocol overhead and latency-bandwidth product for realistic estimates.""",
[
 ("CIDR Subnet Calculator","cidr-subnet","CIDR, ip -> mask, hosts",M,2,0,"R"),
 ("Hosts per Subnet","hosts-per-subnet","prefix -> usable hosts",M,1,0,"R"),
 ("Subnet Split (VLSM)","subnet-split","network, requirements -> subnets",M,3,1,"R"),
 ("IP Range from CIDR","ip-range","CIDR -> first, last, count",M,1,1,"R"),
 ("Wildcard Mask","wildcard-mask","subnet mask -> wildcard",M,1,1,"R"),
 ("Network and Broadcast Address","network-broadcast","ip, mask -> addresses",M,2,1,"R"),
 ("IPv6 Subnet Calculator","ipv6-subnet","prefix, /n -> subnets",M,3,2,"R"),
 ("Subnet Overlap Check","subnet-overlap-check","two CIDRs -> overlap?",M,3,2,"R"),
 ("DHCP Range Size","dhcp-range-size","start, end, exclusions -> pool",M,1,2,"R"),
 ("Bandwidth Transfer Time","bandwidth-transfer-time","size, speed -> time",M,1,0,"R"),
 ("Throughput Efficiency","throughput-efficiency","goodput, line rate -> %",M,2,2,"R"),
 ("MTU and Fragmentation","mtu-fragmentation","MTU, packet size -> fragments",M,2,2,"R"),
 ("Latency-Bandwidth Product","latency-bandwidth-product","RTT, bandwidth -> bytes in flight",M,2,3,"R"),
 ("Port Range Reference","port-range","service -> port",M,1,3,"R"),
])

cat("C65", "Data Storage and File Size", "Required topic 65",
"""**F-STO-01 Decimal vs binary prefixes** kB = 10³, KiB = 2¹⁰; a "500 GB" drive is
500×10⁹ bytes = 465.7 GiB, which is the entire basis of the "missing space" complaint.
**F-STO-02 Media size** `bytes = bitrate(bps) × duration(s)/8`; audio/video containers add
per-track overhead and metadata — the result is an estimate.
**F-STO-03 RAID capacity** RAID 0 `= n×min`, RAID 1 `= min`, RAID 5 `= (n-1)×min`,
RAID 6 `= (n-2)×min`, RAID 10 `= n/2×min` (usable, assuming equal disks). Rebuild time and
failure risk grow with disk size.
**F-STO-04 Compression ratio** `= original/compressed`; entropy limits mean ratios above
~2-4× for already-compressed media indicate lossy processing.""",
[
 ("File Size from Bitrate","file-size-bitrate","bitrate, duration -> MB",M,1,0,"R"),
 ("Storage Unit Conversion","storage-unit-conversion","decimal <-> binary",M,1,0,"R"),
 ("RAID Capacity","raid-capacity","disks, level -> usable",M,2,1,"R"),
 ("Backup Size Estimate","backup-size","data, retention, dedupe -> size",M,3,2,"R"),
 ("Compression Ratio (Data)","data-compression-ratio","original, compressed -> ratio",M,1,2,"R"),
 ("Storage Transfer Time","transfer-time-storage","size, interface speed -> time",M,1,1,"R"),
 ("Database Size Estimate","database-size","rows, row size, indexes -> GB",M,3,3,"R"),
 ("Log Volume Estimate","log-volume","events/s, event size -> GB/day",M,2,3,"R"),
 ("Tape Rotation Schedule","tape-rotation","retention, media -> media count",M,2,3,"R"),
])

cat("C66", "Web Development and Digital Design", "Required topic 66",
"""**F-WEB-01 Aspect ratio** `w/h`; resizing keeps the ratio, and "16:9" is a ratio, not a size.
**F-WEB-02 Typographic scale** modular scale `size_n = base × ratio^n`; ratio choices
(1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618) are design decisions, not laws.
**F-WEB-03 Colour contrast** WCAG 2.2 (W3C Recommendation, 12 December 2024) requires
`(L1 + 0.05)/(L2 + 0.05)` where L is relative luminance with sRGB linearisation; thresholds
4.5:1 normal text, 3:1 large text (≥18pt or 14pt bold) and UI components.
**F-WEB-04 Performance budgets** page weight, LCP/INP/CLS thresholds are user-defined targets;
there is no universal "passing" byte count — only published Core Web Vitals thresholds for
timing metrics.
**F-WEB-05 rem/px** conversion depends on the root font size (usually but not always 16px),
so the root size must be an input.""",
[
 ("Aspect Ratio","aspect-ratio","width, height -> ratio",M,1,0,"R"),
 ("PX to REM","px-rem-conversion","px, root size -> rem",M,1,1,"R"),
 ("Colour Contrast Ratio","color-contrast","two colours -> ratio, WCAG",M,2,1,"S","Contrast formula and thresholds align with WCAG 2.2 (inspected); exact hue math still to be unit-tested."),
 ("Hex to RGB","hex-rgb","hex -> rgb, hsl",M,1,1,"R"),
 ("Modular Type Scale","modular-scale","base, ratio, steps -> sizes",M,1,2,"R"),
 ("Grid Column Calculator","grid-columns","container, gutter, cols -> width",M,2,2,"R"),
 ("Responsive Image Sizes","responsive-image-sizes","viewport, DPR -> srcset",M,2,2,"R"),
 ("Page Weight Budget","page-weight-budget","assets -> total, budget",M,2,2,"R"),
 ("Performance Budget","performance-budget","targets, current -> variance",M,2,3,"R"),
 ("Breakpoint Calculator","breakpoint-calculator","content width, gaps -> breakpoints",M,2,2,"R"),
])

cat("C67", "Image, Video and Media", "Required topic 67",
"""**F-MED-01 Resolution** `pixels = width × height`; megapixels `= pixels/1e6`.
**F-MED-02 Storage** `size = bitrate × duration/8`; bitrate in Mbps yields MB.
**F-MED-03 Frame rate conversion** retiming changes duration (`frames/old_fps` vs
`frames/new_fps`); audio must be resampled or pitch-shifted — a calculator cannot silently
assume either.
**F-MED-04 Bandwidth** `required = bitrate × concurrent viewers`; adaptive streaming uses
multiple renditions, so per-viewer average differs from top rendition.
**F-MED-05 Print resolution** effective PPI `= pixels/print_inches`; 300 PPI is a common
photo-print convention, not a universal requirement (large-format viewing distance reduces it).""",
[
 ("Video Storage Size","video-storage-size","bitrate, duration -> GB",M,1,0,"R"),
 ("Video Bitrate Target","video-bitrate","resolution, fps, quality -> Mbps",M,2,2,"R"),
 ("Streaming Bandwidth","streaming-bandwidth","bitrate, viewers -> Mbps",M,2,1,"R"),
 ("Video Duration from Size","video-duration","size, bitrate -> duration",M,1,1,"R"),
 ("Frame Rate Conversion","frame-rate-conversion","fps, frames -> duration",M,2,2,"R"),
 ("Video Aspect Conversion","video-aspect-conversion","source, target -> crop/pad",M,2,2,"R"),
 ("Render Time Estimate","render-time","frames, seconds/frame -> hours",M,2,3,"R"),
 ("GIF Size Estimate","gif-size","frames, size, palette -> MB",M,2,3,"R"),
 ("Podcast File Size","podcast-file-size","bitrate, minutes -> MB",M,1,1,"R"),
 ("Megapixel Resolution","megapixel-resolution","width, height -> MP",M,1,1,"R"),
 ("Slideshow Duration","slideshow-duration","slides, per-slide -> total",M,1,3,"R"),
 ("Media Archive Size","media-archive-size","assets, duration -> TB",M,2,3,"R"),
 ("Upload Time","upload-time","file size, uplink -> time",M,1,1,"R"),
 ("Transcode Storage Multiplier","transcode-multiplier","renditions, bitrates -> total",M,3,3,"R"),
])

cat("C68", "Photography and Optics", "Required topic 68",
"""**F-PHO-01 Depth of field** hyperfocal `H = f²/(N·c) + f`; near limit
`s = H·d/(H + (d-f))`, far `= H·d/(H - (d-f))`; circle of confusion c is format-dependent and
must be an input (0.03 mm for 35 mm full frame is a convention, not physics).
**F-PHO-02 Exposure** `EV = log2(N²/t)` at ISO 100; the exposure triangle scales with ISO:
`EV_ISO = EV_100 - log2(ISO/100)`. Stops are base-2: 1 stop = ×2 light.
**F-PHO-03 ND filters** `stops = log2(t_with/t_without)`; a 10-stop ND multiplies exposure
time by 1024.
**F-PHO-04 Crop factor** `equivalent_focal = f × crop`; it changes field of view, NOT
perspective or exposure (f-number equivalence is a separate, often-misapplied concept).
**F-PHO-05 Print size** `inches = pixels/PPI`; resampling does not add real detail.""",
[
 ("Depth of Field","depth-of-field","focal, aperture, distance, CoC -> DoF",M,3,1,"R"),
 ("Hyperfocal Distance","hyperfocal-distance","focal, aperture, CoC -> H",M,2,1,"R"),
 ("Exposure Value","exposure-ev","aperture, shutter, ISO -> EV",M,2,1,"R"),
 ("ND Filter Stops","nd-filter-stops","shutter before/after -> stops",M,1,1,"R"),
 ("Flash Guide Number","flash-guide-number","GN, distance -> aperture",M,2,2,"R"),
 ("Crop Factor and Equivalent Focal Length","crop-factor","focal, sensor -> equivalent",M,2,2,"R"),
 ("Print Size and PPI","print-size-ppi","pixels, print size -> PPI",M,1,1,"R"),
 ("Field of View","field-of-view","focal, sensor -> angle",M,2,2,"R"),
 ("Sunny 16 Exposure","sunny-16","conditions -> exposure",M,2,2,"R"),
 ("Shutter Angle","shutter-angle","fps, angle -> shutter speed",M,2,2,"R"),
 ("Star Trail Exposure","star-trail-exposure","focal, declination -> max time",M,3,3,"R"),
 ("Time-Lapse Interval","timelapse-interval","event duration, clip length -> interval",M,2,2,"R"),
 ("Macro Magnification","macro-magnification","extension, focal -> magnification",M,3,3,"R"),
 ("Lens Aperture Area","lens-aperture-area","focal, f-number -> area",M,2,3,"R"),
])

cat("C69", "Audio and Acoustics", "Required topic 69",
"""**F-AUD-01 Decibels** power `dB = 10log10(P1/P2)`; amplitude `20log10(A1/A2)`;
digital full scale dBFS, analog dBu (`0 dBu = 0.775 V`) and SPL (dB re 20 µPa) are DIFFERENT
references and must not be mixed.
**F-AUD-02 Summing levels** incoherent sources add as power: `L_total = 10log10(Σ10^(Li/10))`;
two equal 80 dB sources give 83 dB, not 160 dB.
**F-AUD-03 Room modes** axial `f = 343/(2L)` for a rigid-walled rectangular room; real rooms
with absorption and non-parallel walls differ.
**F-AUD-04 Speaker delay** `t = distance/343` m/s (at 20 °C, 343 m/s; temperature-dependent).
**F-AUD-05 Digital audio** dynamic range ≈ `6.02×bits` dB; file size
`= sample_rate × bits × channels × seconds/8`.""",
[
 ("Decibel Addition","db-spl-addition","multiple levels -> combined",M,2,1,"R"),
 ("Decibel Conversion (dBu/dBV/SPL/dBFS)","decibel-conversion","level, reference -> other",M,3,2,"R"),
 ("Speaker Impedance and Power","speaker-impedance","amp, speakers -> load, power",M,2,1,"R"),
 ("Amplifier Power Requirement","amplifier-power","sensitivity, distance, SPL -> watts",M,3,2,"R"),
 ("Room Mode Frequency","room-mode-frequency","room dims -> axial modes",M,2,2,"R"),
 ("Wavelength and Frequency","wavelength-frequency","f or λ -> other",M,1,1,"R"),
 ("Speaker Delay and Distance","speaker-delay-distance","distance, temp -> delay",M,2,2,"R"),
 ("Dynamic Range","dynamic-range","bit depth -> dB",M,1,2,"R"),
 ("Bit Depth and Resolution","bit-depth-resolution","bits, range -> LSB",M,2,2,"R"),
 ("Sample Rate Requirement","sample-rate-requirement","max frequency -> Nyquist",M,1,2,"R"),
 ("Audio Latency","audio-latency","buffer, sample rate -> ms",M,2,2,"R"),
 ("Perceived Loudness Change","loudness-perception","dB change -> perceived",M,2,3,"R"),
])

cat("C70", "Telecommunications", "Required topic 70",
"""**F-TEL-01 Shannon-Hartley** `C = B·log2(1 + S/N)`; S/N is a linear power ratio, not dB —
passing dB directly is the classic error (convert: `SNR_linear = 10^(SNR_dB/10)`).
**F-TEL-02 Friis** `FSPL(dB) = 20log10(d) + 20log10(f) + 20log10(4π/c)`; in the common form
`FSPL(dB) = 32.45 + 20log10(f_MHz) + 20log10(d_km)`.
**F-TEL-03 Link budget** `P_rx = P_tx + G_tx - L + G_rx`; the result must be compared with
receiver sensitivity and a stated fade margin.
**F-TEL-04 Fresnel zone** first zone radius `r = 17.32√(d1·d2/(f·D))` (metres, km, GHz);
60% clearance is the usual planning criterion.
**F-TEL-05 Erlang B** blocking probability from traffic intensity; the recursion is
numerically stable and must be implemented iteratively, not from a lookup table.""",
[
 ("Shannon Capacity","shannon-capacity","bandwidth, SNR -> capacity",M,2,1,"R"),
 ("Free Space Path Loss","friis-path-loss","distance, frequency -> dB",M,2,1,"R"),
 ("Link Budget","link-budget","tx power, gains, losses -> rx power",M,3,2,"R"),
 ("Fresnel Zone Radius","fresnel-zone","distance, frequency -> radius",M,3,2,"R"),
 ("EIRP","eirp","tx power, antenna gain, loss -> EIRP",M,2,2,"R"),
 ("Erlang B Blocking","erlang-traffic","traffic, channels -> blocking",M,4,3,"R"),
 ("Antenna Gain","antenna-gain","aperture, frequency -> gain",M,3,3,"R"),
 ("Fibre Loss Budget","fiber-loss-budget","length, loss/km, splices -> budget",M,3,2,"R"),
 ("Bandwidth per User","bandwidth-per-user","capacity, users, oversubscription -> per user",M,2,2,"R"),
 ("Spectral Efficiency","spectral-efficiency","throughput, bandwidth -> b/s/Hz",M,2,3,"R"),
])

cat("C71", "Education, Grades and Examination Scoring", "Required topic 71",
"""**F-EDU-01 GPA** `GPA = Σ(credits × grade_points)/Σcredits`; grade-point scales differ
(4.0, 4.3, 5.0, 10-point, percentage bands) and are institution-specific — never assume 4.0.
**F-EDU-02 Final grade needed** `needed = (target - current×(1-w))/(w)` where w is the final's
weight; if `needed > 100` the target is unattainable and the tool must say so rather than
printing a number above 100.
**F-EDU-03 Weighted average** `Σ(w_i·x_i)/Σw_i`, with weights summing to 1 or 100% (validate).
**F-EDU-04 Curving** linear `new = old×scale + offset`; square-root and z-score curves are
different transformations with different fairness properties — label the method.
**F-EDU-05 Percentile and standard scores** `T = 50 + 10z`, `stanine`, `z` — these assume a
reference distribution which must be stated.""",
[
 ("GPA Calculator","gpa","courses, credits, grades -> GPA",M,2,1,"R"),
 ("Weighted GPA","weighted-gpa","honours weighting -> GPA",M,2,2,"R"),
 ("CGPA Conversion","cgpa-conversion","scale -> percentage",M,2,2,"R"),
 ("Grade Needed on Final","grade-needed-final","current, target, weight -> needed",M,1,0,"R"),
 ("Test Score Percentage","test-percentage","correct, total -> %",M,1,0,"R"),
 ("Standard Score Conversion","standard-score","raw, mean, sd -> z, T, stanine",M,2,2,"R"),
 ("Class Rank","class-rank","position, class size -> rank, percentile",M,1,2,"R"),
 ("Grading Curve","grading-curve","scores, method -> curved",M,3,2,"R"),
 ("Rubric Score","rubric-score","criteria, weights -> total",M,1,2,"R"),
 ("Attendance Rate","attendance-rate","present, sessions -> %",M,1,1,"R"),
 ("Study Time Planner","study-time-plan","topics, deadline -> hours/day",M,2,2,"R"),
 ("Reading Speed","reading-speed","words, minutes -> wpm, time",M,1,2,"R"),
 ("Quiz Average","quiz-average","scores, drop-lowest -> average",M,1,2,"R"),
 ("Degree Classification","degree-classification","module marks -> class",M,2,2,"X","UK/other classification rules are institution-specific."),
])

cat("C72", "Research Methodology and Experimental Design", "Required topic 72",
"""**F-RES-01 Power** for a two-sample t-test
`n per group ≈ 2(z_{1-α/2} + z_{1-β})²σ²/Δ²`; power `= 1-β`. Post-hoc power from an observed
effect is uninformative and must be discouraged in the tool text.
**F-RES-02 Effect size** Cohen's d `= (m1-m2)/s_pooled`; Hedges' g applies a small-sample
correction. Benchmarks (0.2/0.5/0.8) are conventions, not thresholds of importance.
**F-RES-03 Reliability** Cronbach's α `= (k/(k-1))(1 - Σσ²_i/σ²_total)`; α is not a measure
of unidimensionality, and high α can coexist with multidimensionality.
**F-RES-04 Agreement** Cohen's κ `= (po - pe)/(1 - pe)`; interpret with prevalence caution.
**F-RES-05 Epidemiology** risk ratio `= a/(a+b) ÷ c/(c+d)`; odds ratio
`= (a·d)/(b·c)`; they diverge when the outcome is common (>10%).""",
[
 ("Power Analysis","power-analysis","effect, α, power -> n",M,3,2,"R"),
 ("Effect Size (Cohen's d)","effect-size-cohen","means, sd -> d",M,2,2,"R"),
 ("Cronbach's Alpha","cronbach-alpha","item variances -> α",M,3,2,"R"),
 ("Cohen's Kappa","cohens-kappa","agreement table -> κ",M,2,2,"R"),
 ("Survey Response Rate","response-rate","responses, invited -> %",M,1,1,"R"),
 ("Dropout Adjustment","dropout-adjustment","target n, attrition -> recruit n",M,2,2,"R"),
 ("Randomisation List","randomisation-list","n, blocks -> sequence",M,3,3,"R"),
 ("Survey Length and Completion","survey-length","questions, time -> completion",M,2,3,"R"),
 ("Likert Scoring","likert-scoring","responses, weights -> score",M,2,2,"R"),
 ("Meta-Analysis Weight","meta-analysis-weight","effect, variance -> weight",M,4,3,"R"),
 ("Risk Ratio","risk-ratio","2x2 table -> RR, CI",M,2,2,"R"),
 ("Odds Ratio","odds-ratio","2x2 table -> OR, CI",M,2,2,"R"),
])

cat("C73", "Quality Control and Reliability Engineering", "Required topic 73",
"""**F-QC-01 Capability** `Cp = (USL-LSL)/(6σ)`; `Cpk = min(USL-μ, μ-LSL)/(3σ)`.
Cp says nothing about centring; Cpk does. Pp/Ppk use overall σ instead of within-subgroup σ —
mixing them is invalid.
**F-QC-02 Control limits** X̄-R chart: `UCL_X = X̿ + A2·R̄`, `LCL_X = X̿ - A2·R̄`,
`UCL_R = D4·R̄`, `LCL_R = D3·R̄`; A2/D3/D4 depend on subgroup size (constant tables).
**F-QC-03 Reliability** exponential `R(t) = e^{-λt}`, `MTBF = 1/λ`; Weibull
`R(t) = e^{-(t/η)^β}`; Weibull reduces to exponential only when β = 1.
**F-QC-04 Availability** `A = MTBF/(MTBF+MTTR)`.
**F-QC-05 FMEA RPN** `S×O×D`; RPN is ordinal and its use as a prioritisation scalar is
criticised — action priority tables are preferred in AIAG-VDA, which is licensed.
**F-QC-06 Sigma level** from DPMO via the inverse normal, including the conventional 1.5σ
shift — state whether the shift is applied.""",
[
 ("Cp and Cpk","cp-cpk","USL, LSL, μ, σ -> Cp, Cpk",M,3,1,"R"),
 ("Pp and Ppk","pp-ppk","overall σ -> Pp, Ppk",M,3,2,"R"),
 ("X-bar and R Control Chart","xbar-r-chart","subgroups -> limits",M,3,2,"R"),
 ("p-Chart","p-chart","defectives, sample -> limits",M,3,2,"R"),
 ("c-Chart","c-chart","defects per unit -> limits",M,3,3,"R"),
 ("MTBF","mtbf","failures, time -> MTBF",M,2,1,"R"),
 ("MTTR","mttr","repair time, events -> MTTR",M,1,1,"R"),
 ("Availability","availability-reliability","MTBF, MTTR -> A",M,1,1,"R"),
 ("Reliability Function","reliability-function","λ or Weibull, t -> R(t)",M,3,2,"R"),
 ("FMEA RPN","fmea-rpn","S, O, D -> RPN",M,2,2,"R"),
 ("Sigma Level","sigma-level","DPMO -> σ level",M,3,2,"R"),
 ("DPMO","dpmo","defects, opportunities -> DPMO",M,2,2,"R"),
 ("Acceptance Sampling Plan","sampling-plan","AQL, lot, level -> n, c",M,4,3,"X","ISO 2859-1 tables are licensed."),
 ("Gage R&R","gage-rr","measurements -> %GRR",M,4,3,"R"),
 ("Arrhenius Life Acceleration","arrhenius-life","Ea, temps -> acceleration factor",M,3,3,"R"),
 ("Weibull Shape and Scale","weibull-shape","failure times -> β, η",M,4,3,"R"),
 ("Tolerance Stack-Up","tolerance-stack","dimensions, tolerances -> worst case/RSS",M,3,2,"R"),
 ("Bathtub Curve Hazard Rate","hazard-rate","λ(t) -> hazard",M,3,3,"R"),
])

cat("C74", "Human Resources and Employment", "Required topic 75",
"""**F-HR-01 Turnover** `= leavers/average headcount ×100` (average `= (start+end)/2`); the
period and population must be stated or the number is meaningless.
**F-HR-02 FTE** `= Σ(paid hours)/full-time hours`; part-time, contractor and seasonal
conversions differ and must be declared.
**F-HR-03 Cost per hire** `= (internal + external recruiting costs)/hires`; the definition
(does it include recruiter salary?) changes the result by an order of magnitude — expose it.
**F-HR-04 Absence** `= absence days/(headcount × working days)×100`; Bradford factor
`= S²×D` is a policy index, not a legal measure.
**F-HR-05 Leave** entitlement is statutory and jurisdiction-specific; entitlement calculators
must select a jurisdiction and show the statute, and must not generalise across countries.""",
[
 ("Headcount Plan","headcount-plan","growth, attrition -> hires needed",M,2,2,"R"),
 ("Turnover Rate","turnover-rate","leavers, headcount -> %",M,1,1,"R"),
 ("Attrition Cost","attrition-cost","salary, replacement cost -> total",M,2,2,"R"),
 ("Cost per Hire","cost-per-hire","recruiting costs, hires -> cost",M,2,2,"R"),
 ("Time to Hire","time-to-hire","stages -> days",M,2,2,"R"),
 ("Absence Rate","absenteeism-rate","days absent, workdays -> %",M,1,2,"R"),
 ("Span of Control","span-of-control","reports, managers -> ratio",M,1,3,"R"),
 ("FTE Calculation","fte-calculation","hours, full-time hours -> FTE",M,1,1,"R"),
 ("Leave Entitlement","leave-entitlement","jurisdiction, service -> days",M,2,2,"X","Statutory; jurisdiction tables required."),
 ("Training Hours per Employee","training-hours","hours, headcount -> per employee",M,1,3,"R"),
 ("Engagement Score","engagement-score","survey responses -> index",M,2,3,"R"),
 ("Recruitment Funnel Conversion","recruitment-funnel","stage counts -> rates",M,2,2,"R"),
])

cat("C75", "Insurance and Risk Analysis", "Required topic 77",
"""**F-INS-01 Expected loss** `= probability × severity`; for a portfolio `Σ p_i·s_i`. This is
an expected value, not a premium: loading, expenses and profit are added by the insurer.
**F-INS-02 Out-of-pocket** with deductible D, coinsurance c, out-of-pocket maximum M:
`OOP = min(M, D + c×max(0, cost - D))` for in-network covered services — plan rules vary
widely and the calculator must display its assumptions.
**F-INS-03 Deductible break-even** compare plans by total cost at the user's expected spend:
`total = premium×12 + OOP(expense)`. Comparing premiums alone is a known consumer error.
**F-INS-04 Life insurance need (DIME)** `debt + income×years + mortgage + education -
assets`; a needs analysis, not a recommendation, and it must not be presented as advice.
**F-INS-05 Loss ratio** `= claims/premium`; combined ratio `= loss ratio + expense ratio`;
<100% indicates underwriting profit before investment income.""",
[
 ("Life Insurance Needs (DIME)","life-insurance-need","debt, income, assets -> cover",M,3,1,"R"),
 ("Deductible Break-Even","deductible-breakeven","plans, expected spend -> cheaper",M,3,1,"R"),
 ("Coinsurance Cost","coinsurance-cost","bill, deductible, rate -> share",M,2,1,"R"),
 ("Out-of-Pocket Maximum","out-of-pocket-max","costs, plan -> OOP",M,3,1,"R"),
 ("Claim Payout","claim-payout","loss, deductible, limit -> payout",M,2,2,"R"),
 ("Expected Loss","expected-loss","probability, severity -> EL",M,1,2,"R"),
 ("Loss Ratio","loss-ratio","claims, premium -> %",M,1,2,"R"),
 ("Combined Ratio","combined-ratio","loss, expense -> %",M,1,2,"R"),
 ("Premium per 1000 of Cover","premium-per-1000","premium, sum assured -> rate",M,1,2,"R"),
 ("Replacement Cost","replacement-cost","area, rate, contents -> sum insured",M,2,2,"R"),
 ("Business Interruption Cover","business-interruption","profit, period -> sum insured",M,3,3,"R"),
 ("Risk of Ruin","risk-of-ruin","edge, bankroll -> probability",M,4,3,"R"),
 ("Coverage Gap","coverage-gap","need, existing -> gap",M,1,1,"R"),
 ("Premium Financing Cost","premium-financing","premium, APR, months -> cost",M,2,3,"R"),
])

cat("C76", "Legal and Regulatory Calculations", "Required topic 78",
"""**WARNING: this category is informational only.** Nothing here is legal advice, and no output
may be presented as a legal entitlement. Every calculator requires: jurisdiction selector,
statute/rule citation, effective date, and a prominent "not legal advice" notice. Where a rule
is discretionary (courts, tribunals), the tool must refuse to output a figure or must label it
a range with the governing discretion stated.
**F-LEG-01 Judgment interest** simple or compound per the governing statute; the rate and
compounding basis are jurisdictional, and post-judgment rates often differ from pre-judgment.
**F-LEG-02 Limitation periods** are procedural rules that vary by claim type and can be
paused/tolled; a date arithmetic tool must not imply a claim is time-barred.
**F-LEG-03 Statutory payments** (redundancy, notice, child support) come from tables/formulas
in statute; the version and jurisdiction must be displayed and updated on a review cadence.
**F-LEG-04 Damages** expectation = loss of bargain; compounding of lost profits requires a
discount rate assumption which must be user-supplied and displayed.""",
[
 ("Judgment Interest","judgment-interest","principal, rate, period -> interest",M,2,2,"X","Jurisdiction-specific; legal review required."),
 ("Contract Notice Period","contract-notice-period","dates, clause -> notice date",M,2,2,"R"),
 ("Limitation Period Deadline","limitation-period","claim type, accrual -> deadline",M,2,2,"X","Procedural law varies; not legal advice."),
 ("Inheritance Share","inheritance-share","estate, heirs, rules -> shares",M,3,2,"X","Forced-heirship and intestacy rules vary by jurisdiction and school of law."),
 ("Damages with Discounting","damages-calculation","loss stream, discount rate -> PV",M,3,3,"R"),
 ("Lease Notice and Break Date","lease-notice-period","term, notice -> dates",M,2,3,"R"),
 ("Child Support Estimate","child-support-estimate","income, children -> amount",M,4,2,"X","Statutory guidelines; jurisdiction-specific; legal review mandatory."),
 ("Redundancy Pay","redundancy-pay","age, service, wage -> statutory pay",M,3,2,"X","Statutory table required per jurisdiction."),
 ("Court Deadline (Days)","legal-deadline","service date, days, rules -> deadline",M,2,2,"R"),
])

cat("C77", "Gaming, Odds and Probability", "Required topic 79",
"""**F-GAM-01 Expected value** `EV = Σ p_i·payoff_i`; a positive EV game still has variance and
risk of ruin — the two must be reported together.
**F-GAM-02 Odds conversion** decimal `d`; fractional `a/b` -> `d = 1 + a/b`;
American: positive `+m` -> `d = 1 + m/100`, negative `-m` -> `d = 1 + 100/m`;
implied probability `= 1/d` (before removing vig).
**F-GAM-03 Vig removal** for two-way markets: `p_i' = (1/d_i)/Σ(1/d_j)`.
**F-GAM-04 Kelly** `f* = (bp - q)/b` for fractional odds b, win prob p, q = 1-p; full Kelly is
growth-optimal but has large drawdowns, so fractional Kelly is common practice.
**F-GAM-05 House edge** `= 1 - Σ(p_i·payout_i)` per unit staked; lottery odds
`= 1/C(n,k)` for an exact-match draw.""",
[
 ("Expected Value of a Bet","expected-value-bet","odds, stake, prob -> EV",M,2,1,"R"),
 ("House Edge","house-edge","payouts, probabilities -> edge",M,2,2,"R"),
 ("Pot Odds","pot-odds","pot, bet -> odds, break-even equity",M,2,2,"R"),
 ("Implied Probability","implied-probability","odds -> probability",M,1,1,"R"),
 ("Odds Format Conversion","odds-conversion","decimal/fractional/american -> all",M,1,1,"R"),
 ("Parlay Odds","parlay-odds","legs -> combined odds",M,2,2,"R"),
 ("Kelly Criterion","kelly-criterion","edge, odds -> stake",M,3,2,"R"),
 ("Vig Removal","vig-removal","two-way odds -> fair probability",M,2,3,"R"),
 ("Poker Outs and Equity","poker-outs","outs, cards left -> equity",M,2,2,"R"),
 ("Lottery Odds","lottery-odds","numbers, draws -> probability",M,2,1,"R"),
 ("Break-Even Win Rate","break-even-win-rate","odds -> win% needed",M,1,1,"R"),
 ("Betting Variance","betting-variance","bets, stake, p -> σ, drawdown",M,3,3,"R"),
])

cat("C78", "Sports and Athletic Performance Metrics", "Required topic 80",
"""**F-SPT-01 Baseball** batting average `= H/AB`; OBP `= (H+BB+HBP)/(AB+BB+HBP+SF)`;
SLG `= TB/AB`; OPS `= OBP+SLG`; ERA `= 9×ER/IP`; WHIP `= (BB+H)/(IP)`.
These are defined conventions (official scoring rules) and denominators must not be swapped.
**F-SPT-02 Cricket** run rate `= runs/overs`; required run rate and net run rate use different
denominators (NRR uses runs per over minus conceded rate).
**F-SPT-03 Elo** `E_a = 1/(1 + 10^((R_b-R_a)/400))`; K-factor choice drives responsiveness;
the 400 constant is a convention of the chess implementation.
**F-SPT-04 Basketball** TS% `= PTS/(2×(FGA + 0.44×FTA))`; the 0.44 coefficient is an empirical
estimate of free-throw possessions.
**F-SPT-05 Handicap (golf)** course handicap uses slope rating:
`CH = index × slope/113 + (CR - par)`; the 113 is a defined standard slope.""",
[
 ("Batting Average","batting-average","hits, at-bats -> AVG",M,1,2,"R"),
 ("Earned Run Average","earned-run-average","earned runs, innings -> ERA",M,1,2,"R"),
 ("WHIP","whip","walks, hits, innings -> WHIP",M,1,3,"R"),
 ("Slugging Percentage","slugging-percentage","total bases, at-bats -> SLG",M,1,3,"R"),
 ("On-Base Percentage","on-base-percentage","hits, walks, PA -> OBP",M,1,3,"R"),
 ("True Shooting Percentage","true-shooting","points, FGA, FTA -> TS%",M,2,3,"R"),
 ("Elo Rating Change","elo-rating","ratings, result, K -> new ratings",M,2,2,"R"),
 ("Win Probability from Rating","win-probability","rating gap -> probability",M,2,3,"R"),
 ("Tournament Points","tournament-points","placements, weights -> total",M,2,3,"R"),
 ("Golf Course Handicap","handicap-index","index, slope, CR, par -> CH",M,2,3,"R"),
 ("Cricket Run Rate","cricket-run-rate","runs, overs -> RR, NRR",M,1,2,"R"),
 ("Goal Difference and Points","football-goal-difference","results -> GD, points",M,1,3,"R"),
])

cat("C79", "Travel and Trip Planning", "Required topic 81",
"""**F-TRV-01 Trip cost** `= transport + accommodation×nights + per-diem×days + activities`
plus a contingency percentage; currency conversion must use a user-supplied or dated rate.
**F-TRV-02 Driving time** `= distance/average speed + breaks`; average speed must reflect road
type, and fuel/charging cost should use consumption, not a flat rate.
**F-TRV-03 Jet lag** recovery estimates (≈1 day per time zone eastbound, ~0.75 westbound) are
empirical rules of thumb and must be labelled as such — they are not clinical guidance.
**F-TRV-04 Baggage** `total = Σ item weights`; airline limits are per-carrier and per-fare-class,
so limit values must be user inputs with cited defaults.
**F-TRV-05 Travel insurance** premium ≈ rate × trip cost × days, but exclusions dominate real
risk; the tool must not imply coverage.""",
[
 ("Trip Cost","trip-cost","transport, lodging, food -> total",M,2,1,"R"),
 ("Cost Sharing per Person","cost-per-person-share","total, people, shares -> per person",M,1,1,"R"),
 ("Daily Travel Budget","travel-budget-per-day","budget, days -> per day",M,1,1,"R"),
 ("Jet Lag Recovery","jet-lag-recovery","time zones, direction -> days",M,2,3,"R"),
 ("Great-Circle Flight Distance","flight-distance","airports -> km, time",M,2,2,"R"),
 ("Driving Time and Cost","driving-time","distance, speed, consumption -> time, cost",M,2,1,"R"),
 ("Rest Stop Planning","rest-stop-planning","duration, interval -> stops",M,1,2,"R"),
 ("Baggage Weight Total","luggage-weight","items, limit -> total, excess",M,1,2,"R"),
 ("Hotel Cost per Night","hotel-cost-per-night","total, nights, taxes -> per night",M,1,2,"R"),
 ("Travel Insurance Cost","travel-insurance-cost","trip cost, days, rate -> premium",M,2,2,"R"),
 ("Multi-City Route Distance","multi-city-distance","legs -> total distance",M,2,2,"R"),
 ("Time Zone Difference","timezone-difference","zones -> offset, call window",M,1,1,"R"),
])

cat("C80", "Household Budgets and Personal Finance", "Required topic 82",
"""**F-HHD-01 Budget split** the 50/30/20 rule is a popular heuristic, not a standard; needs,
wants and savings definitions vary by household, so category mapping must be user-editable.
**F-HHD-02 Savings rate** `= savings/gross income` (state gross vs net; both are used).
**F-HHD-03 Emergency fund** `= essential monthly expenses × months`; "3-6 months" is guidance,
not a rule, and depends on income stability.
**F-HHD-04 Net worth** `= assets - liabilities`; illiquid assets and pension entitlements must
be handled per the stated definition.
**F-HHD-05 Goal timeline** `n = ln(FV·i/PMT + 1)/ln(1+i)`; if `PMT ≤ FV·i` the goal is never
reached — the tool must say so explicitly rather than returning an enormous number.""",
[
 ("50/30/20 Budget","fifty-thirty-twenty","income -> needs, wants, savings",M,1,0,"R"),
 ("Savings Rate","savings-rate","savings, income -> %",M,1,1,"R"),
 ("Emergency Fund","emergency-fund","expenses, months -> target",M,1,1,"R"),
 ("Net Worth","net-worth","assets, liabilities -> net worth",M,2,1,"R"),
 ("Subscription Cost Tracker","subscription-cost","subscriptions -> annual total",M,1,2,"R"),
 ("Utility Bill Split","utility-split","bill, occupants -> shares",M,1,2,"R"),
 ("Rent Affordability","rent-affordability","income, ratio -> max rent",M,1,1,"R"),
 ("Grocery Budget","grocery-budget","household, weeks -> budget",M,1,2,"R"),
 ("Sinking Fund","sinking-fund","target, months -> monthly set-aside",M,1,2,"R"),
 ("Monthly Cash Flow","cash-flow-monthly","income, expenses -> net",M,1,1,"R"),
 ("Cost of Living Comparison","cost-of-living-index","index, income -> equivalent",M,2,2,"R"),
 ("Envelope Budget","envelope-budget","income, categories -> envelopes",M,1,2,"R"),
 ("Goal Savings Timeline","goal-savings-timeline","target, rate, return -> months",M,2,1,"R"),
 ("Budget Variance","home-budget-variance","budget, actual -> variance",M,1,2,"R"),
])

cat("C81", "Retail Pricing and Shopping", "Required topic 83",
"""**F-RTL-01 Sale price** `= price×(1-discount)`; stacked discounts multiply (see F-PRC-02).
**F-RTL-02 Unit price** `= price/quantity`; comparing across packs requires the same unit and
the same tax basis, otherwise the comparison is invalid.
**F-RTL-03 Tip** `= bill×tip%`; splitting must define whether tax and service charge are
included in the base — three reasonable conventions produce different totals.
**F-RTL-04 BOGO** "buy one get one 50% off" is 25% off two items, not 50% off — the effective
discount depends on how many items are purchased.
**F-RTL-05 Cashback** `= spend × rate`, and it is not equivalent to a discount if it expires
or is paid in restricted points.""",
[
 ("Sale Price","sale-price","price, discount -> final",M,1,0,"R"),
 ("Percent Off","percent-off","price, % -> saving",M,1,0,"R"),
 ("Buy-One-Get-One Value","bogo-value","price, offer -> effective discount",M,1,2,"R"),
 ("Tip Calculator","tip-calculator","bill, tip%, split -> per person",M,1,0,"R"),
 ("Bill Split","bill-split","total, people, tax -> shares",M,1,1,"R"),
 ("Service Charge and Tax","service-charge","bill, service, tax -> total",M,1,2,"R"),
 ("Price Match Savings","price-match-savings","prices -> saving",M,1,2,"R"),
 ("Clearance Price Ladder","clearance-price","original, steps -> prices",M,1,2,"R"),
 ("Cashback Value","cashback-value","spend, rate, expiry -> value",M,2,2,"R"),
 ("Landed Retail Price","landed-retail-price","cost, shipping, tax -> total",M,2,2,"R"),
])

cat("C82", "Pets and Animal Care", "Required topic 84",
"""**F-PET-01 Pet age** the "×7" rule is a myth; the AVMA/AAHA approach uses species- and
size-specific curves (e.g. a 1-year-old dog ≈15 human years). Any conversion must cite its
source table and be labelled an estimate.
**F-PET-02 Energy requirement** resting energy `RER = 70×(kg)^0.75` kcal/day;
maintenance `MER = RER × factor` where the factor depends on life stage and neuter status
(WSAVA/AAHA guidance). Body condition score matters more than the formula.
**F-PET-03 Water intake** ≈50-60 mL/kg/day for dogs and cats is a clinical rule of thumb;
illness changes it, so it must not be used for diagnosis.
**F-PET-04 Aquarium volume** `= L×W×H/1000` litres (internal dimensions), then subtract
substrate and decor displacement; stocking rules ("1 inch per gallon") are folklore with no
welfare basis and must be labelled as such.
**F-PET-05 Medication** dosing is prescription-only; the tool may compute a mg/kg amount but
must require a prescriber-supplied dose and show a hard warning.""",
[
 ("Pet Age in Human Years","pet-age-human-years","species, age -> human years",M,2,2,"R","Species/size curves must be sourced; the x7 rule is invalid."),
 ("Pet Calorie Requirement","pet-calorie-mer","weight, life stage -> kcal/day",M,3,2,"R"),
 ("Pet Food Portion","pet-food-portion","kcal/day, food density -> grams",M,2,2,"R"),
 ("Pet Water Intake","pet-water-intake","weight -> mL/day",M,1,3,"R"),
 ("Aquarium Volume","aquarium-volume","dims, displacement -> litres",M,1,1,"R"),
 ("Fish Stocking Density","fish-stocking-density","volume, species -> advisory",M,3,3,"X","Folklore rules; must not be presented as welfare guidance."),
 ("Pet Medication Dose","pet-medication-dose","weight, mg/kg -> dose",M,3,3,"X","Prescription-only; veterinary review required."),
 ("Pet Insurance Cost","pet-insurance-cost","species, age, cover -> premium",M,2,3,"R"),
])

cat("C83", "Specialised Trades and Building Services", "Required topics 85, 86",
"""**F-TRD-01 Occupancy load** `= floor area/area per occupant` from the applicable building
code table (function of use). The table values are code-specific and licensed — they must be
supplied as cited data, never invented.
**F-TRD-02 Egress width** `= occupant load × width per person`; clear width, not nominal, and
minimums apply. Code-dependent → SPECIALIST_REVIEW_REQUIRED.
**F-TRD-03 Lighting** `E = Φ×CU×MF/A` (lumen method); CU and MF are project-specific, so
defaults must be stated and ranges shown.
**F-TRD-04 Pool chemistry** free chlorine depends on cyanuric acid (FC/CYA ratio); simple
"ppm" targets without CYA are misleading — state the model used.
**F-TRD-05 Septic sizing** `= bedrooms × daily flow × retention` per local regulation; the
rule set is jurisdictional.""",
[
 ("Occupancy Load","occupancy-load","area, use -> occupants",M,3,2,"X","Building-code table data required."),
 ("Egress Width","egress-width","occupants, rate -> width",M,3,2,"X","Code-dependent."),
 ("Parking Space Count","parking-space-count","floor area, ratio -> spaces",M,2,2,"X","Zoning-dependent."),
 ("Restroom Fixture Count","restroom-fixture-count","occupants, sex split -> fixtures",M,3,2,"X","Plumbing-code table data required."),
 ("Fire Extinguisher Coverage","fire-extinguisher-coverage","area, hazard -> units",M,2,3,"X","NFPA 10 licensed."),
 ("Lighting Level (Lumen Method)","lighting-level","lumens, CU, MF, area -> lux",M,3,2,"R"),
 ("Swimming Pool Volume","pool-volume","dims, shape -> m3, litres",M,2,1,"R"),
 ("Pool Chlorine Dose","pool-chlorine-dose","volume, target ppm -> grams",M,3,2,"R"),
 ("Septic Tank Size","septic-tank-size","bedrooms, flow -> litres",M,3,2,"X","Local regulation."),
 ("Fence Post Spacing","fence-post-spacing","run, spacing -> posts, rails",M,1,1,"R"),
 ("Driveway Slope","driveway-slope","rise, run -> %, grade",M,1,2,"R"),
 ("Acoustic Panel Count","acoustic-panel-count","room, RT target -> panels",M,3,3,"R"),
 ("Kitchen Ventilation","kitchen-ventilation","appliance load, hood -> CFM",M,3,3,"R"),
 ("Sign Area and Permit Limit","sign-area-permit","dims, frontage -> area, ratio",M,2,3,"X","Sign-code dependent."),
])

cat("C84", "Cross-Domain Utilities", "Required topic 86",
"""**F-XD-01 Number to words** requires language-specific grammar (scale words, pluralisation,
hyphenation, "and"); output must be localisation-aware, not English-hardcoded.
**F-XD-02 Roman numerals** standard form is subtractive with a maximum of three repeats
(IIII is invalid); values above 3999 traditionally require an overbar — state the convention.
**F-XD-03 Reading time** `= words/wpm`; 200-250 wpm is a convention, and technical content is
slower; expose the rate.
**F-XD-04 Password entropy** `H = L·log2(alphabet size)` for random passwords only; human-chosen
passwords have far lower effective entropy, so the tool must not imply real-world strength.
**F-XD-05 Character and word counts** must define what counts as a word (whitespace-delimited
vs Unicode word boundaries) — the two disagree on hyphenated and CJK text.""",
[
 ("Number to Words","number-to-words","number, language -> words",M,2,1,"R"),
 ("Roman Numeral Conversion","roman-numerals","number <-> numeral",M,2,2,"R"),
 ("Reading Time","reading-time","words, wpm -> minutes",M,1,1,"R"),
 ("Typing Speed","typing-speed","words, time, errors -> WPM, accuracy",M,1,2,"R"),
 ("Character Count","character-count","text -> chars, bytes, lines",M,1,1,"R"),
 ("Word Count","word-count","text -> words, sentences",M,1,1,"R"),
 ("Password Entropy","password-entropy","length, charset -> bits",M,2,2,"R"),
 ("QR Code Capacity","qr-code-capacity","version, EC level -> bytes",M,3,3,"R"),
])
