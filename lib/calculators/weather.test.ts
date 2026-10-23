import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, primary, run } from "@/lib/calculators/testing";

describe("wind chill (CALC-0847)", () => {
  it("reproduces the NWS reference value: 0 °F at 15 mph ≈ −19.4 °F", () => {
    const outcome = primary(run("wind-chill", { tempUnit: "f", temperature: "0", windUnit: "mph", windSpeed: "15" }));
    const fahrenheit = numberOf(outcome.hint ?? "");
    expect(fahrenheit).toBeCloseTo(-19.4, 1);
  });

  it("gives the same answer when the inputs are supplied in metric units", () => {
    // 0 °F = −17.777… °C; 15 mph = 24.14016 km/h.
    const outcome = primary(
      run("wind-chill", { tempUnit: "c", temperature: "-17.7777778", windUnit: "kmh", windSpeed: "24.14016" }),
    );
    expect(numberOf(outcome.hint ?? "")).toBeCloseTo(-19.4, 1);
  });

  it("refuses temperatures above 50 °F rather than extrapolating", () => {
    const outcome = errored(run("wind-chill", { tempUnit: "f", temperature: "60", windUnit: "mph", windSpeed: "15" }));
    expect(outcome.errors.temperature).toMatch(/at or below 50 °F/);
  });

  it("refuses wind speeds at or below 3 mph", () => {
    const outcome = errored(run("wind-chill", { tempUnit: "f", temperature: "0", windUnit: "mph", windSpeed: "3" }));
    expect(outcome.errors.windSpeed).toMatch(/above 3 mph/);
  });

  it("allows exactly 50 °F, the domain boundary", () => {
    const outcome = run("wind-chill", { tempUnit: "f", temperature: "50", windUnit: "mph", windSpeed: "10" });
    expect(outcome.ok).toBe(true);
  });

  it("reports the drop in apparent temperature", () => {
    const outcome = ok(run("wind-chill", { tempUnit: "f", temperature: "0", windUnit: "mph", windSpeed: "15" }));
    // Air temperature 0 °F = −17.8 °C; wind chill −19.4 °F = −28.6 °C; difference ≈ −10.8 °C.
    expect(outcome.outputs.some((output) => output.label === "Difference")).toBe(true);
  });
});

describe("heat index (CALC-0848)", () => {
  it("reproduces the NWS reference value: 100 °F at 55% humidity ≈ 123.6 °F", () => {
    const outcome = primary(run("heat-index", { tempUnit: "f", temperature: "100", humidity: "55" }));
    expect(numberOf(outcome.hint ?? "")).toBeCloseTo(123.6, 1);
  });

  it("reproduces the NWS reference value: 100 °F at 15% humidity ≈ 95.8 °F", () => {
    const outcome = primary(run("heat-index", { tempUnit: "f", temperature: "100", humidity: "15" }));
    expect(numberOf(outcome.hint ?? "")).toBeCloseTo(95.8, 1);
  });

  it("places 123.6 °F in the danger band, one tenth below the extreme-danger cut-off", () => {
    // NWS bands: 103–124 °F is "Danger", 125 °F and above is "Extreme Danger".
    const outcome = ok(run("heat-index", { tempUnit: "f", temperature: "100", humidity: "55" }));
    expect(outcome.interpretation?.label).toBe("Danger");

    const hotter = ok(run("heat-index", { tempUnit: "f", temperature: "110", humidity: "60" }));
    expect(hotter.interpretation?.label).toBe("Extreme danger");
  });

  it("warns below the calibrated range instead of silently extrapolating", () => {
    const outcome = ok(run("heat-index", { tempUnit: "f", temperature: "70", humidity: "50" }));
    expect(outcome.notes?.join(" ")).toMatch(/calibrated for air temperatures of 80 °F/);
  });

  it("rejects humidity above 100%", () => {
    const outcome = errored(run("heat-index", { tempUnit: "f", temperature: "95", humidity: "120" }));
    expect(outcome.errors.humidity).toBeDefined();
  });

  it("accepts Celsius input and reports whether it is above the 80 °F calibration point", () => {
    const outcome = ok(run("heat-index", { tempUnit: "c", temperature: "38", humidity: "55" }));
    expect(outcome.notes?.join(" ")).not.toMatch(/calibrated for air temperatures of 80 °F/);
  });
});
