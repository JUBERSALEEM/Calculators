# Research log (raw evidence trail)

Access date for all items below: 2026-10-22 (UTC). Only sources listed with
"Inspected: yes" are cited as inspected in the master plan. Everything else must be
marked as identified-but-not-inspected in the reference register.

## Batch 1 — Metrology, mathematics, agro-meteorology, social insurance

### R-001 NIST SP 811, Guide for the Use of the International System of Units (SI), 2008 ed.
URL: https://www.nist.gov/pml/special-publication-811
Inspected: yes (landing page + Appendix B.8 factors table, chunk 0 of 6)
Findings:
- SP 811 (2008) is explicitly NOT updated for the 2019 SI redefinition; NIST SP 330 (2019)
  reflects the BIPM SI Brochure 9th edition. -> For SI definitions use SP 330 / BIPM 9th ed;
  for conversion factors SP 811 App. B is still the practical source but must be flagged.
- Appendix B.8 table states: "Factors in boldface are exact."
- Extracted factors (boldface = exact per source):
  standard acceleration of free fall gn -> m/s2: 9.806 65 (exact)
  acre (US survey foot) -> m2: 4.046 873 E+03
  acre foot -> m3: 1.233 489 E+03
  ampere hour -> C: 3.6 E+03 (exact)
  angstrom -> m: 1 E-10 (exact)
  are -> m2: 1 E+02 (exact)
  astronomical unit -> m: 1.495 979 E+11
  standard atmosphere -> Pa: 1.013 25 E+05 (exact)
  technical atmosphere -> Pa: 9.806 65 E+04 (exact)
  bar -> Pa: 1 E+05 (exact)
  barn -> m2: 1 E-28 (exact)
  petroleum barrel (42 US gal) -> m3: 1.589 873 E-01
  Btu_IT -> J: 1.055 056 E+03
  Btu_th -> J: 1.054 350 E+03
  Btu_IT/lb -> J/kg: 2.326 E+03 (exact)
  Btu_IT/h -> W: 2.930 711 E-01
  Btu_IT/(h ft2 degF) -> W/(m2 K): 5.678 263 E+00
  Btu_IT in/(h ft2 degF) -> W/(m K): 1.442 279 E-01
Notes/limitations: This is the "alphabetical" table; only chunks A-B were retrieved.
Volume/mass/length factors for C..Z must be pulled before implementation
(open item ORQ-01).

### R-002 NIST CODATA 2022 fundamental physical constants (NIST SRD 121)
URL: https://physics.nist.gov/cuu/Constants/index.html
Inspected: yes (landing page)
Findings: current recommended set is CODATA 2022; data content last updated May 2024;
2026 adjustment is scheduled (deadline notice: input data discussed in a publication
prior to 31 Dec 2026). => maintainers must plan a constants-version bump.
Notes: the individual numerical values were not extracted from this page (index page only);
individual value pages must be opened per constant before coding (open item ORQ-02).

### R-003 FAO Irrigation and Drainage Paper 56, "Crop evapotranspiration"
Chapter 2 - FAO Penman-Monteith equation. URL: https://www.fao.org/4/x0490e/x0490e06.htm
Inspected: yes (chapters 2 text, chunks 0-1 of 4)
Findings:
- FAO Penman-Monteith is recommended as the SOLE standard ETo method; older FAO-24
  methods "no longer encouraged".
- Standardized grass reference surface: crop height h = 0.12 m; wind/temp/humidity at 2 m.
- d = 2/3 h; z_om = 0.123 h; z_oh = 0.1 z_om; LAI = 24 h; LAI_active = 0.5 LAI;
  r_l = 100 s/m; k (von Karman) = 0.41.
- Equation coefficients are rendered as images in the HTML, so numeric coefficients
  (0.408, 900, 0.34) could NOT be text-verified from this fetch. PDF (ISBN 92-5-104219-5)
  must be used for coefficient verification (open item ORQ-03).
- Constraint recorded: the resistance formulation is restricted to neutral stability;
  hourly timesteps may require stability corrections.

### R-004 US Social Security Administration, "Primary Insurance Amount" (2027 bend points)
URL: https://www.ssa.gov/oact/cola/piaformula.html
Inspected: yes
Findings (effective year stated on page: 2027):
- PIA = 90% of first $1,340 AIME + 32% of AIME over $1,340 through $8,077
  + 15% of AIME over $8,077; result rounded DOWN to next lower multiple of $0.10.
- Bend points derived from 1979 base ($180, $1,085) scaled by wage index
  72,800.33 / 9,779.44.
- Interpretation: bend points are indexed annually and depend on the year of first
  eligibility (age 62 / disability / death), not the year of claim.
Maintenance: annual update required every October (COLA announcement).

## Batch 2 — Search quality policy, consumer credit regulation

### R-005 Google Search Central, "Spam policies for Google web search"
URL: https://developers.google.com/search/docs/essentials/spam-policies
Inspected: yes (chunks 0, 2, 4 of 6)
Findings (verbatim-critical points):
- "Scaled content abuse is when many pages are generated for the primary purpose of
  manipulating search rankings and not helping users." Examples include using generative
  AI tools to generate many pages without adding value.
- "Misleading functionality": a site claiming to provide functionality (e.g. PDF merge,
  countdown timer) but intentionally leading users to deceptive ads rather than providing
  the claimed service. -> DIRECT risk for a calculator site with ads: the calculator must
  work and must not be subordinated to ads.
- Keyword stuffing is a named policy; doorway abuse is a named policy (relevant to
  "one page per city/unit-variant" scale plays).
- Thin affiliation policy targets cookie-cutter templates replicated within a site.
Implication for this project: 1,200 pages is only defensible if each page is a working,
distinct tool with original explanation. The catalog therefore enforces a
"distinctness test" and a launch gate per page, not a page-count race.

### R-006 Google Search Central, "Creating helpful, reliable, people-first content"
URL: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
Inspected: yes (chunk 0 of 4)
Findings: page supplies a self-assessment question set (original information, substantial
completeness, descriptive headings, E-E-A-T "Who/How/Why"). These questions are adopted
directly as the content acceptance checklist in the master plan.

### R-007 CFPB Regulation Z, 12 CFR Part 1026, Appendix J
"Annual Percentage Rate Computations for Closed-End Credit Transactions"
URL: https://www.consumerfinance.gov/rules-policy/regulations/1026/J/
Inspected: yes (chunk 0 of 2; current-regulation banner present)
Findings:
- Appendix J "sets forth the actuarial equations and instructions for calculating the
  annual percentage rate in closed-end credit transactions" and explicitly may be used
  "to program calculators and computers".
- Two permitted methods: actuarial method and United States Rule method. Actuarial:
  at end of each unit-period the unpaid balance is increased by the finance charge earned
  and decreased by the payment made.
- APR = unit-period rate x number of unit-periods per year (nominal, not effective).
- Unit-period selection rules: the common period occurring most frequently, not exceeding
  1 year; tie -> smaller period; no common period -> average rounded to nearest standard
  interval. Single-advance/single-payment -> unit-period is the term, <= 1 year.
- "All months shall be considered equal"; month fractions use day counts divided by 30.
- Regulatory text is US federal (CFPB); calculators claiming APR compliance must state
  jurisdiction + that Reg Z's rule-of-thumb tolerances apply.
Notes/limitation: the closed-form general equation (b)(8) appears in chunk 1, not fetched;
must be retrieved before implementing an APR solver. Also the regulation is US-only.

## Batch 3 — Meteorology, taxation, health screening, employment, accessibility

### R-008 NOAA/NWS, "Understanding Wind Chill"
URL: https://www.weather.gov/safety/cold-wind-chill-chart
Inspected: yes
Findings (verbatim formula):
  Wind chill (°F) = 35.74 + 0.6215T - 35.75(V^0.16) + 0.4275T(V^0.16)
  T = air temperature °F, V = wind speed mph.
- Validity: "defined only for temperatures at or below 50°F and wind speeds above 3 mph".
- Assumptions: 5 ft measurement height (converted from 33 ft anemometer height), human face
  model, heat-transfer theory, calm-wind threshold lowered to 3 mph, no sun impact (clear night).
- Bright sunshine may increase wind chill by 10-18 °F.
- Explicit: wind chill applies only to people/animals; inanimate objects cannot cool below air
  temperature. Frostbite requires actual air temperature below freezing.

### R-009 NOAA/NWS Amarillo, "What is the heat index?"
URL: https://www.weather.gov/ama/heatindex
Inspected: yes (chunks 0-1)
Findings (Rothfusz multiple regression, verbatim):
  HI = -42.379 + 2.04901523T + 10.14333127RH - .22475541TRH - .00683783T^2
       - .05481717RH^2 + .00122874T^2RH + .00085282TRH^2 - .00000199T^2RH^2
  T °F, RH %.
- "obtained using a multiple regression analysis, and therefore, it has an error of ±1.3°F".
- Values are for shady locations; direct sun can add up to 15 °F.
- Classification bands published: Caution 80-90; Extreme Caution 90-103; Danger 103-124;
  Extreme Danger ≥125 °F.
- Example cross-check available: 100 °F / 55% -> 124 °F; 100 °F / 15% -> 96 °F.

### R-010 US IRS, "IRS releases tax inflation adjustments for tax year 2026" (IR-2025-103)
URL: https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill
Inspected: yes
Findings (TY2026, single / MFJ):
- Rates: 10% ≤12,400 (24,800); 12% >12,400; 22% >50,400 (100,800); 24% >105,700 (211,400);
  32% >201,775 (403,550); 35% >256,225 (512,450); 37% >640,600 (768,700).
- Standard deduction: 16,100 single/MFS; 32,200 MFJ/surviving spouse; 24,150 HoH.
- AMT exemption 90,100 single (phase-out 500,000); 140,200 MFJ (phase-out 1,000,000).
- EITC max 8,231 (3+ children); FSA 3,400 with 680 carryover; transportation fringe 340/mo.
- Page carries an "archival/historical" banner and cites Rev. Proc. 2025-32.
Maintenance note: annual; the IRS archival banner means the page itself is not a permanent
citation target — cite Rev. Proc. 2025-32 for durability.

### R-011 US CDC, "Adult BMI Categories"
URL: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
Inspected: yes
Findings:
- BMI = weight(kg) / height(m)^2. For adults 20+, categories are independent of age, sex, race.
- <18.5 underweight; 18.5-<25 healthy; 25-<30 overweight; 30-<35 class 1; 35-<40 class 2;
  ≥40 class 3 (severe).
- "BMI is a screening measure. BMI should be considered with other factors..."; not a
  substitute for professional medical advice.
- Worked example published for 5'9": 124 lb or less <18.5 etc. (useful known-answer test).
- Children/teens 2-19 require BMI percentile by sex and age (separate page).

### R-012 US DOL, "Overtime Pay"
URL: https://www.dol.gov/agencies/whd/overtime
Inspected: yes
Findings:
- FLSA: overtime for hours over 40 in a workweek at not less than 1.5× the regular rate.
- Workweek = fixed, regularly recurring 168 hours (7×24), need not match the calendar week.
- "Averaging of hours over two or more weeks is not permitted."
- FLSA does not require overtime for weekends/holidays per se.

### R-013 W3C, "Web Content Accessibility Guidelines (WCAG) 2.2"
URL: https://www.w3.org/TR/WCAG22/
Inspected: yes (chunk 0 of 36)
Findings: W3C Recommendation dated 12 December 2024; conforming to 2.2 implies 2.0/2.1
conformance; success criteria are technology-neutral and testable. Errata exist.
Limitation: individual success criteria text (e.g. 1.4.3 contrast ratios) not read in this
pass — cited via the specification, not via a quoted criterion.

## Batch 4 — Conversion-factor depth (NIST SP 811 Appendix B.8, chunk 2)

### R-014 NIST SP 811 App. B.8 (continued)
Inspected: yes (chunk 2: D-G)
Extracted factors (bold = exact per source):
  foot -> m: 0.3048 (exact)
  foot (US survey) -> m: 0.304 006
  foot per second -> m/s: 0.3048 (exact)
  foot per minute -> m/s: 5.08E-03 (exact)
  foot per second squared -> m/s2: 0.3048 (exact)
  gallon (US) -> L: 3.785 412; -> m3: 3.785 412E-03
  gallon (Imperial) -> L: 4.546 09 (exact)
  fluid ounce (US) -> mL: 29.573 53
  gallon (US)/min -> L/s: 6.309 020E-02
  footcandle -> lux: 10.763 91
  footlambert -> cd/m2: 3.426 259
  degree Fahrenheit -> Celsius: t/°C = (t/°F - 32)/1.8 (affine, not multiplicative)
  degree Rankine -> kelvin: T/K = (T/°R)/1.8
  degree F interval -> K: 0.5555556 (E-01)
  gon (grade) -> degree: 0.9 (exact)
  dyne -> N: 1E-05 (exact); dyn·cm -> N·m: 1E-07 (exact); dyn/cm2 -> Pa: 1E-01 (exact)
  erg -> J: 1E-07 (exact); erg/s -> W: 1E-07 (exact)
  grain -> kg: 6.479 891E-05 (exact); grain/gal(US) -> mg/L: 17.118 06
  gal (Gal, acceleration) -> m/s2: 1E-02 (exact)
  foot pound-force -> J: 1.355 818; ft·lbf/s -> W: 1.355 818
  electronvolt -> J: 1.602 177E-19
  denier -> kg/m: 1.111 111E-07
Still missing (ORQ-01): H-Z (inch, pound, mile, psi, ton, quart, yard, etc.).

## Failed fetches (recorded, not papered over)
- https://pvwatts.nrel.gov/ — "Failed to fetch" (2026-10-22)
- https://www.nrel.gov/grid/solar-resource/spa.html — "Failed to fetch" (2026-10-22)
Consequence: solar-yield and solar-position methods remain RESEARCH_REQUIRED (ORQ-05).
No substitute or blog source was used to fill the gap.
