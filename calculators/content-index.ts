/**
 * Static index of calculator content modules. Imported by the calculator page
 * route for server-rendered SEO content (formula, worked example, assumptions,
 * references). Each content module conforms to CalculatorContent.
 */

import * as pona from "@/calculators/percentage-of-a-number/content";
import * as pc from "@/calculators/percentage-change/content";
import * as pd from "@/calculators/percentage-difference/content";
import * as am from "@/calculators/arithmetic-mean/content";
import * as wc from "@/calculators/wind-chill/content";
import * as hi from "@/calculators/heat-index/content";
import * as bmi from "@/calculators/bmi/content";
import * as lc from "@/calculators/length-converter/content";
import type { CalculatorContent } from "@/calculators/page-types";

export const CONTENT: Record<string, CalculatorContent> = {
  "percentage-of-a-number": pona.content,
  "percentage-change": pc.content,
  "percentage-difference": pd.content,
  "arithmetic-mean": am.content,
  "wind-chill": wc.content,
  "heat-index": hi.content,
  bmi: bmi.content,
  "length-converter": lc.content,
};

export function getContent(slug: string) {
  return CONTENT[slug];
}
