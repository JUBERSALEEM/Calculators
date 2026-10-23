import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

const toFahrenheit = (value: number, unit: string) => (unit === "c" ? (value * 9) / 5 + 32 : value);
const fahrenheitToCelsius = (f: number) => ((f - 32) * 5) / 9;

/** NWS heat-index category bands (shade values). */
function classify(f: number) {
  if (f >= 125) return { label: "Extreme danger", detail: "Heat stroke is highly likely with continued exposure.", tone: "danger" as const };
  if (f >= 103) return { label: "Danger", detail: "Heat cramps or heat exhaustion are likely; heat stroke is possible.", tone: "danger" as const };
  if (f >= 90) return { label: "Extreme caution", detail: "Heat stroke, cramps or exhaustion are possible with prolonged exposure or activity.", tone: "caution" as const };
  if (f >= 80) return { label: "Caution", detail: "Fatigue is possible with prolonged exposure or physical activity.", tone: "caution" as const };
  return { label: "No elevated heat risk", detail: "Below the range where the heat index adds a risk category.", tone: "positive" as const };
}

export const heatIndex: Calculator = {
  id: "CALC-0848",
  slug: "heat-index",
  name: "Heat Index Calculator",
  title: "Heat Index Calculator (NWS Formula)",
  description:
    "Calculate the heat index from temperature and relative humidity using the US National Weather Service regression, with the official risk category.",
  summary: "How hot it feels when humidity is factored in.",
  category: { id: "C53", slug: "weather", name: "Weather & Climate" },
  keywords: ["heat index", "feels like temperature", "humidity comfort", "apparent temperature"],
  verification: "source-verified",
  related: ["wind-chill", "temperature-converter"],
  updated: "2026-10-22",
  fields: [
    {
      kind: "select",
      name: "tempUnit",
      label: "Temperature unit",
      defaultValue: "c",
      options: [
        { value: "c", label: "Celsius (°C)" },
        { value: "f", label: "Fahrenheit (°F)" },
      ],
    },
    { kind: "number", name: "temperature", label: "Air temperature", step: 0.1, placeholder: "32", hint: "Shade temperature, not in direct sun. Enter it in the unit selected above." },
    { kind: "number", name: "humidity", label: "Relative humidity", unit: "%", min: 0, max: 100, step: 0.1, placeholder: "70" },
  ],
  compute(values) {
    const tempUnit = asString(values, "tempUnit");
    const temperature = asNumber(values, "temperature");
    const humidity = asNumber(values, "humidity");
    const tempF = toFahrenheit(temperature, tempUnit);
    const rh = humidity;

    // The input may be Celsius or Fahrenheit, so the plausible-range check has to
    // happen on the converted value rather than in the field metadata.
    const errors: Record<string, string> = {};
    if (tempF < -50 || tempF > 150) {
      errors.temperature = "Enter an air temperature between −50 °F and 150 °F (−46 °C and 66 °C).";
    }
    if (rh < 0 || rh > 100) {
      errors.humidity = "Relative humidity must be between 0% and 100%.";
    }
    if (Object.keys(errors).length > 0) return { ok: false, errors };

    const hiF =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * rh -
      0.22475541 * tempF * rh -
      0.00683783 * tempF * tempF -
      0.05481717 * rh * rh +
      0.00122874 * tempF * tempF * rh +
      0.00085282 * tempF * rh * rh -
      0.00000199 * tempF * tempF * rh * rh;

    const hiC = fahrenheitToCelsius(hiF);
    const category = classify(hiF);
    const belowDomain = tempF < 80;

    return {
      ok: true,
      outputs: [
        { label: "Heat index", value: `${formatNumber(hiC, { maxFractionDigits: 1 })} °C`, emphasis: true, hint: `${formatNumber(hiF, { maxFractionDigits: 1 })} °F` },
        { label: "Air temperature", value: `${formatNumber(temperature, { maxFractionDigits: 1 })} °${tempUnit.toUpperCase()}` },
        { label: "Feels-like difference", value: `${formatNumber(hiC - (tempUnit === "c" ? temperature : fahrenheitToCelsius(temperature)), { maxFractionDigits: 1 })} °C`, hint: "How much humidity adds to the apparent temperature." },
      ],
      interpretation: category,
      notes: [
        ...(belowDomain
          ? [
              "The regression is calibrated for air temperatures of 80 °F (26.7 °C) and above. Below that, the result is close to the air temperature and should be treated as indicative only.",
            ]
          : []),
        "The value is for a shaded location. In direct sunlight the heat index can be up to 15 °F (8 °C) higher.",
        "The published regression has a stated error of ±1.3 °F and does not include the NWS operational corrections applied at very low (under 13%) or very high (over 85%) humidity.",
      ],
    };
  },
  formula: [
    {
      label: "NWS heat index (°F, %RH)",
      expression:
        "HI = −42.379 + 2.04901523T + 10.14333127R − 0.22475541TR − 0.00683783T² − 0.05481717R² + 0.00122874T²R + 0.00085282TR² − 0.00000199T²R²",
    },
    { label: "Unit conversion", expression: "°F = °C × 9/5 + 32" },
  ],
  explanation: [
    "The heat index combines air temperature and relative humidity into a single apparent temperature. High humidity slows the evaporation of sweat, so the body cannot shed heat as quickly and the same air temperature feels hotter.",
    "The formula is a multiple regression published by the US National Weather Service, fitted to apparent-temperature values. The NWS states that it gives a close approximation with an error of about ±1.3 °F.",
    "Categories follow the NWS chart: caution from 80 °F, extreme caution from 90 °F, danger from 103 °F and extreme danger at 125 °F and above. Below 80 °F the index adds no risk category, and the regression is outside its calibrated range.",
  ],
  assumptions: [
    "The temperature is a shaded air temperature, not a reading in direct sun.",
    "Relative humidity is between 0% and 100%.",
    "Steady-state conditions: the body is assumed to be in equilibrium with the environment.",
    "Clothing, wind, hydration and individual health are not modelled.",
  ],
  cautions: [
    "Direct sunlight can raise the apparent temperature by up to 15 °F.",
    "This tool implements the published regression only. NWS forecast offices apply additional adjustments at very low and very high humidity; values in those corners may differ from official products.",
    "Heat index is not a substitute for medical advice. Heat stroke is a medical emergency.",
  ],
  references: [
    {
      label: "NOAA / National Weather Service — What is the heat index?",
      url: "https://www.weather.gov/ama/heatindex",
      note: "Rothfusz regression coefficients, ±1.3 °F error, shade-only caveat and the category table. Accessed 22 October 2026.",
    },
  ],
  example: {
    inputs: "100 °F, 55% relative humidity",
    result: "≈ 123.6 °F (the NWS chart lists 124 °F)",
    working:
      "HI = −42.379 + 204.90 + 557.88 − 12.36 − 68.38 − 165.83 + 7.44 + 2.58 − 0.06 ≈ 123.6 °F.",
  },
};
