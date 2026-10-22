# Implementation report — all 1,248 catalog calculators
Generated 2026-10-22. Source of truth: `docs/project-plan/catalog.csv` (now 1,189 `Implemented` + 59 `Implemented (parametric; specialist review pending)`).

## Headline
| Metric | Before | After |
| --- | --- | --- |
| Catalog entries implemented | 8 | **1,248** |
| Outstanding (not implemented) | 1,240 | **0** |
| Categories with working tools | 3 | **84** |
| Automated tests | 34 | **59** |
| Static calculator pages built | 23 | **1,248 (+84 category pages)** |

## Status split
| `formula_status` | Count | How it is implemented |
| --- | --- | --- |
| `SOURCE_VERIFIED` | 21 | Parameters verified against the inspected source cited on the page. |
| `RESEARCH_REQUIRED` | 1168 | Standard closed-form / engineering / user-parameterised arithmetic, formula printed in full. |
| `SPECIALIST_REVIEW_REQUIRED` | 59 | Regulated constants are **inputs**, page carries a review banner, `noindex`, excluded from `sitemap.xml`. |
| **Total** | **1248** | |


## Per category
| Category | Tools | Verified | Standard | Specialist-gated |
| --- | --- | --- | --- | --- |
| C01 · Basic Arithmetic and Percentages | 14 | 0 | 14 | 0 |
| C02 · Fractions, Ratios, Proportions and Averages | 17 | 0 | 17 | 0 |
| C03 · Algebra and Equation Solving | 14 | 0 | 14 | 0 |
| C04 · Geometry and Mensuration | 23 | 0 | 23 | 0 |
| C05 · Trigonometry | 12 | 0 | 12 | 0 |
| C06 · Calculus and Numerical Methods | 16 | 0 | 16 | 0 |
| C07 · Matrices, Vectors and Linear Algebra | 14 | 0 | 14 | 0 |
| C08 · Statistics and Probability | 25 | 0 | 25 | 0 |
| C09 · Discrete Mathematics, Combinatorics and Number Theory | 20 | 0 | 20 | 0 |
| C10 · Interest, Time Value of Money and Discounting | 20 | 0 | 20 | 0 |
| C11 · Loans, Amortisation and Credit | 20 | 1 | 19 | 0 |
| C12 · Mortgages and Property Finance | 16 | 0 | 15 | 1 |
| C13 · Investments, Returns and Portfolio Analysis | 25 | 0 | 25 | 0 |
| C14 · Retirement and Pension Planning | 12 | 1 | 10 | 1 |
| C15 · Accounting and Bookkeeping | 17 | 0 | 17 | 0 |
| C16 · Business Pricing, Margin and Profitability | 17 | 0 | 17 | 0 |
| C17 · Taxation | 18 | 1 | 15 | 2 |
| C18 · Payroll, Salary and Compensation | 18 | 1 | 16 | 1 |
| C19 · Economics and Business Analytics | 13 | 0 | 13 | 0 |
| C20 · Marketing and Advertising Metrics | 17 | 0 | 17 | 0 |
| C21 · E-commerce and Online Selling | 13 | 0 | 12 | 1 |
| C22 · Real Estate and Property Investment | 16 | 0 | 16 | 0 |
| C23 · Construction Materials and Quantity Takeoff | 25 | 0 | 25 | 0 |
| C24 · Architecture, Building Geometry and Interiors | 17 | 0 | 17 | 0 |
| C25 · Civil and Structural Engineering | 20 | 0 | 10 | 10 |
| C26 · Mechanical Engineering and Machine Design | 20 | 0 | 20 | 0 |
| C27 · Electrical Engineering and Power Systems | 22 | 0 | 19 | 3 |
| C28 · Electronics and Circuit Analysis | 20 | 0 | 20 | 0 |
| C29 · Chemical Engineering and Process Calculations | 12 | 0 | 10 | 2 |
| C30 · Fluid Mechanics and Hydraulics | 16 | 0 | 16 | 0 |
| C31 · Thermodynamics and Heat Transfer | 18 | 0 | 18 | 0 |
| C32 · Manufacturing, Production and OEE | 16 | 0 | 16 | 0 |
| C33 · Cutting Stock, Nesting and Optimisation | 12 | 0 | 12 | 0 |
| C34 · Glass Manufacturing and Glazing | 14 | 0 | 10 | 4 |
| C35 · Woodworking, Joinery and Timber | 12 | 0 | 11 | 1 |
| C36 · Metal Fabrication and Machining | 16 | 0 | 15 | 1 |
| C37 · Textile, Fabric and Garment Production | 15 | 0 | 15 | 0 |
| C38 · Packaging and Printing | 15 | 0 | 15 | 0 |
| C39 · Inventory and Stock Control | 12 | 0 | 12 | 0 |
| C40 · Supply Chain and Logistics | 13 | 0 | 13 | 0 |
| C41 · Shipping, Freight and Container Loading | 16 | 0 | 16 | 0 |
| C42 · Automotive and Vehicle Operation | 16 | 0 | 16 | 0 |
| C43 · Aviation and Flight Planning | 13 | 0 | 12 | 1 |
| C44 · Marine and Maritime Calculations | 13 | 0 | 11 | 2 |
| C45 · Physics and Mechanics | 20 | 0 | 20 | 0 |
| C46 · Chemistry and Laboratory Methods | 20 | 0 | 20 | 0 |
| C47 · Biology and Life Sciences | 10 | 0 | 10 | 0 |
| C48 · Environmental Science and Emissions | 14 | 0 | 14 | 0 |
| C49 · Renewable Energy and Solar Systems | 15 | 0 | 15 | 0 |
| C50 · Batteries and Electrical Energy Storage | 10 | 0 | 10 | 0 |
| C51 · Astronomy and Orbital Mechanics | 13 | 0 | 13 | 0 |
| C52 · Geography, Mapping and Surveying | 14 | 0 | 14 | 0 |
| C53 · Meteorology and Climate | 12 | 2 | 10 | 0 |
| C54 · Agriculture and Horticulture | 12 | 0 | 12 | 0 |
| C55 · Irrigation, Fertilisers and Crop Production | 12 | 1 | 10 | 1 |
| C56 · Food Preparation and Recipe Scaling | 14 | 0 | 14 | 0 |
| C57 · Nutrition and Dietary Calculations | 15 | 1 | 13 | 1 |
| C58 · Fitness and Exercise | 14 | 0 | 14 | 0 |
| C59 · General Health and Clinical Screening | 16 | 0 | 7 | 9 |
| C60 · Date, Time and Calendar | 15 | 0 | 15 | 0 |
| C61 · Unit Conversion and Measurement | 16 | 12 | 4 | 0 |
| C62 · Computer Science and Algorithms | 12 | 0 | 12 | 0 |
| C63 · Programming and Software Development | 12 | 0 | 11 | 1 |
| C64 · Networking, IP Addressing and Subnetting | 14 | 0 | 14 | 0 |
| C65 · Data Storage and File Size | 9 | 0 | 9 | 0 |
| C66 · Web Development and Digital Design | 10 | 1 | 9 | 0 |
| C67 · Image, Video and Media | 14 | 0 | 14 | 0 |
| C68 · Photography and Optics | 14 | 0 | 14 | 0 |
| C69 · Audio and Acoustics | 12 | 0 | 12 | 0 |
| C70 · Telecommunications | 10 | 0 | 10 | 0 |
| C71 · Education, Grades and Examination Scoring | 14 | 0 | 13 | 1 |
| C72 · Research Methodology and Experimental Design | 12 | 0 | 12 | 0 |
| C73 · Quality Control and Reliability Engineering | 18 | 0 | 17 | 1 |
| C74 · Human Resources and Employment | 12 | 0 | 11 | 1 |
| C75 · Insurance and Risk Analysis | 14 | 0 | 14 | 0 |
| C76 · Legal and Regulatory Calculations | 9 | 0 | 4 | 5 |
| C77 · Gaming, Odds and Probability | 12 | 0 | 12 | 0 |
| C78 · Sports and Athletic Performance Metrics | 12 | 0 | 12 | 0 |
| C79 · Travel and Trip Planning | 12 | 0 | 12 | 0 |
| C80 · Household Budgets and Personal Finance | 14 | 0 | 14 | 0 |
| C81 · Retail Pricing and Shopping | 10 | 0 | 10 | 0 |
| C82 · Pets and Animal Care | 8 | 0 | 6 | 2 |
| C83 · Specialised Trades and Building Services | 14 | 0 | 7 | 7 |
| C84 · Cross-Domain Utilities | 8 | 0 | 8 | 0 |
| **Total** | **1248** | **21** | **1168** | **59** |


## What the 59 specialist-gated tools do

They are real, working calculators, but every code-regulated, licensed-table or
clinically-gated constant is an exposed input rather than an embedded value. For
example `occupancy-load` divides floor area by an occupant-load factor **you**
supply from your adopted code; `rebar-area-required` solves the lever-arm equation
from your design moment and yield strength; `bmi-percentile-child` applies the LMS
transform to **your** CDC/WHO table values. Nothing is presented as a code
determination, statutory entitlement or clinical recommendation, and those pages
are excluded from the sitemap and marked `noindex`.


## Verification performed

- `npm test` — 59 tests pass, including a sweep over **every** spec: default-case
  finiteness, unique field keys, non-empty formula/variables, perturbed-input
  robustness (no throw, no `NaN`/`Infinity`), and lazy-group reachability.
- `npm run typecheck`, `npm run lint`, `npm run build` — clean; 1,248 calculator
  pages and 84 category pages prerendered statically.
- Live preview verified on `0.0.0.0:3000` (home, directory, calculator, category,
  sitemap, 404).
