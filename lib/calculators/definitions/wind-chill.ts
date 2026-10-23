import { asNumber, asString } from "@/lib/calculators/validation";
import { formatNumber } from "@/lib/format";
import type { Calculator } from "@/lib/calculators/types";

const KMH_PER_MPH = 1.609344;

const toFahrenheit = (value: number, unit: string) => (unit === "c" ? (value * 9) / 5 + 32 : value);
const toMph = (value: number, unit: string) => (unit === "kmh" ? value / KMH_PER_MPH : value);
const fahrenheitToCelsius = (f: number) => ((f - 32) * 5) / 9;

export const windChill: Calculator = {
  id: "CALC-0847",
  slug: "wind-chill",
  name: "Wind Chill Calculator",
  title: "Wind Chill Calculator (NWS Formula)",
  description:
    "Calculate the wind chill temperature with the US National Weather Service formula, valid for temperatures at or below 50 °F and winds above 3 mph.",
  summary: "How cold the wind makes exposed skin feel.",
  category: { id: "C53", slug: "weather", name: "Weather & Climate" },
  keywords: ["wind chill", "feels like temperature", "apparent temperature", "nws wind chill"],
  verification: "source-verified",
  related: ["heat-index", "temperature-converter"],
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
    { kind: "number", name: "temperature", label: "Air temperature", step: 0.1, placeholder: "0", hint: "Celsius or Fahrenheit, matching the unit above." },
    {
      kind: "select",
      name: "windUnit",
      label: "Wind speed unit",
      defaultValue: "kmh",
      options: [
        { value: "kmh", label: "Kilometres per hour (km/h)" },
        { value: "mph", label: "Miles per hour (mph)" },
      ],
    },
    { kind: "number", name: "windSpeed", label: "Wind speed", min: 0, max: 300, step: 0.1, placeholder: "24" },
  ],
  compute(values) {
    const tempUnit = asString(values, "tempUnit");
    const windUnit = asString(values, "windUnit");
    const temperature = asNumber(values, "temperature");
    const windSpeed = asNumber(values, "windSpeed");

    const tempF = toFahrenheit(temperature, tempUnit);
    const windMph = toMph(windSpeed, windUnit);

    // The index is defined only inside this domain; outside it the tool refuses
    // rather than extrapolating a regression beyond its calibration.
    const errors: Record<string, string> = {};
    if (tempF > 50) {
      errors.temperature = "Wind chill is defined only at or below 50 °F (10 °C). Use the heat index for warm conditions.";
    }
    if (tempF < -100) {
      errors.temperature = "Enter an air temperature of at least −100 °F (−73 °C); below that this tool is outside its useful range.";
    }
    if (windMph <= 3) {
      errors.windSpeed = "Wind chill is defined only for wind speeds above 3 mph (4.8 km/h). At or below that, the air temperature is the apparent temperature.";
    }
    if (Object.keys(errors).length > 0) return { ok: false, errors };

    const windFactor = Math.pow(windMph, 0.16);
    const chillF = 35.74 + 0.6215 * tempF - 35.75 * windFactor + 0.4275 * tempF * windFactor;
    const chillC = fahrenheitToCelsius(chillF);

    return {
      ok: true,
      outputs: [
        { label: "Wind chill", value: `${formatNumber(chillC, { maxFractionDigits: 1 })} °C`, emphasis: true, hint: `${formatNumber(chillF, { maxFractionDigits: 1 })} °F` },
        { label: "Air temperature", value: `${formatNumber(temperature, { maxFractionDigits: 1 })} °${tempUnit.toUpperCase()}` },
        { label: "Difference", value: `${formatNumber(chillC - (tempUnit === "c" ? temperature : fahrenheitToCelsius(temperature)), { maxFractionDigits: 1 })} °C`, hint: "How much colder the wind makes it feel." },
        { label: "Formula", value: "35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16", hint: "T in °F, V in mph." },
      ],
      interpretation: {
        label: chillC <= -28 ? "Severe cold stress" : chillC <= -10 ? "High cold stress" : "Cold",
        detail:
          chillC <= -28
            ? "At this wind chill, exposed skin can freeze in a short time. Limit time outdoors."
            : "Wind chill describes heat loss from exposed skin. Frostbite is possible only when the actual air temperature is below freezing.",
        tone: chillC <= -10 ? "danger" : "caution",
      },
      notes: [
        "The index applies to people and animals, not to objects: a car radiator cannot be cooled below the actual air temperature.",
        "Values assume a clear night sky. Bright sunshine can make it feel 10–18 °F warmer.",
      ],
    };
  },
  formula: [
    { label: "NWS wind chill (°F, mph)", expression: "T_wc = 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16" },
    { label: "Unit conversion", expression: "°F = °C × 9/5 + 32;  mph = km/h ÷ 1.609344" },
  ],
  explanation: [
    "Wind chill estimates how cold exposed skin feels by accounting for the rate of heat loss caused by wind. Moving air strips away the thin layer of warmed air next to the skin, so heat leaves the body faster and the same air temperature feels colder.",
    "The formula used here is the one published by the US National Weather Service, adopted in 2001. It is based on a human face model, assumes a measurement height of 5 feet, lowers the calm-wind threshold to 3 mph and assumes no sunlight.",
    "The regression is defined only for air temperatures at or below 50 °F and winds above 3 mph. Outside that domain the tool refuses to produce a number instead of returning an extrapolated value that would look authoritative but would not be supported by the published guidance.",
  ],
  assumptions: [
    "Air temperature at or below 50 °F (10 °C).",
    "Wind speed above 3 mph (4.8 km/h).",
    "Clear night sky, with no solar radiation.",
    "Wind measured at the standard 10 m anemometer height and adjusted to about 5 ft, as assumed by the NWS index.",
    "The subject is a person (or animal) with exposed skin; the index does not describe inanimate objects.",
  ],
  cautions: [
    "Wind chill is not a temperature. It does not mean water will freeze at the reported value; frostbite requires an actual air temperature below 0 °C.",
    "The index does not account for humidity, wet clothing, or individual variation in cold tolerance.",
  ],
  references: [
    {
      label: "NOAA / National Weather Service — Understanding Wind Chill",
      url: "https://www.weather.gov/safety/cold-wind-chill-chart",
      note: "Formula, validity domain (≤ 50 °F, > 3 mph), assumptions and caveats. Accessed 22 October 2026.",
    },
  ],
  example: {
    inputs: "0 °F, 15 mph",
    result: "−19.4 °F",
    working: "35.74 + 0.6215(0) − 35.75(15^0.16) + 0.4275(0)(15^0.16) = −19.4 °F, which the NWS example chart lists as −19 °F.",
  },
};
