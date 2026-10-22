/**
 * Client calculator component registry. Maps a calculator slug to its interactive
 * client component. Adding a calculator: register it here and in
 * @/calculators/registry (meta) plus create its formula + content modules.
 */

import { PercentageOfANumberCalculator } from "./percentage-of-a-number";
import { PercentageChangeCalculator } from "./percentage-change";
import { PercentageDifferenceCalculator } from "./percentage-difference";
import { ArithmeticMeanCalculator } from "./arithmetic-mean";
import { WindChillCalculator } from "./wind-chill";
import { HeatIndexCalculator } from "./heat-index";
import { BMICalculator } from "./bmi";
import { LengthConverterCalculator } from "./length-converter";

const BY_SLUG: Record<string, React.ComponentType> = {
  "percentage-of-a-number": PercentageOfANumberCalculator,
  "percentage-change": PercentageChangeCalculator,
  "percentage-difference": PercentageDifferenceCalculator,
  "arithmetic-mean": ArithmeticMeanCalculator,
  "wind-chill": WindChillCalculator,
  "heat-index": HeatIndexCalculator,
  bmi: BMICalculator,
  "length-converter": LengthConverterCalculator,
};

export function getCalculatorComponent(slug: string) {
  return BY_SLUG[slug];
}

export function getImplementedCalculatorSlugs(): string[] {
  return Object.keys(BY_SLUG);
}
