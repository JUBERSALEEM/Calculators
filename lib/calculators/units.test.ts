import { describe, expect, it } from "vitest";

import { errored, numberOf, ok, primary, run } from "@/lib/calculators/testing";

describe("length converter (CALC-0957)", () => {
  it("converts 1 mile to exactly 1.609344 km", () => {
    const outcome = primary(run("length-converter", { value: "1", from: "mi", to: "km" }));
    expect(outcome.value).toBe("1.609344 km");
  });

  it("converts 1 inch to 25.4 mm", () => {
    expect(primary(run("length-converter", { value: "1", from: "in", to: "mm" })).value).toBe("25.4 mm");
  });

  it("converts a nautical mile to exactly 1852 m", () => {
    expect(primary(run("length-converter", { value: "1", from: "nmi", to: "m" })).value).toBe("1,852 m");
  });

  it("round-trips through the metre base", () => {
    const there = numberOf(primary(run("length-converter", { value: "12.5", from: "ft", to: "cm" })).value);
    // 12.5 ft × 0.3048 = 3.81 m = 381 cm exactly.
    expect(there).toBe(381);
    const back = numberOf(primary(run("length-converter", { value: "381", from: "cm", to: "ft" })).value);
    expect(back).toBeCloseTo(12.5, 6);
  });

  it("shows every other unit as well", () => {
    const outcome = ok(run("length-converter", { value: "1", from: "m", to: "ft" }));
    expect(outcome.outputs).toHaveLength(9);
  });

  it("rejects a blank value", () => {
    expect(errored(run("length-converter", { value: "", from: "m", to: "ft" })).errors.value).toBe("Enter a value");
  });
});

describe("temperature converter (CALC-0961)", () => {
  it("converts 100 °C to 212 °F, 373.15 K and 671.67 °R", () => {
    const outcome = ok(run("temperature-converter", { value: "100", from: "c" }));
    const byLabel = Object.fromEntries(outcome.outputs.map((output) => [output.label, output.value]));
    expect(byLabel.Celsius).toBe("100 °C");
    expect(byLabel.Fahrenheit).toBe("212 °F");
    expect(byLabel.Kelvin).toBe("373.15 K");
    expect(byLabel.Rankine).toBe("671.67 °R");
  });

  it("converts −40 °C to −40 °F, the point where the scales cross", () => {
    const outcome = ok(run("temperature-converter", { value: "-40", from: "c" }));
    expect(numberOf(outcome.outputs.find((output) => output.label === "Fahrenheit")?.value ?? "")).toBe(-40);
  });

  it("treats 0 K as absolute zero, i.e. −273.15 °C and −459.67 °F", () => {
    const outcome = ok(run("temperature-converter", { value: "0", from: "k" }));
    expect(numberOf(outcome.outputs.find((output) => output.label === "Celsius")?.value ?? "")).toBeCloseTo(-273.15, 4);
    expect(numberOf(outcome.outputs.find((output) => output.label === "Fahrenheit")?.value ?? "")).toBeCloseTo(-459.67, 4);
  });

  it("refuses a temperature below absolute zero on the chosen scale", () => {
    const outcome = errored(run("temperature-converter", { value: "-274", from: "c" }));
    expect(outcome.errors.value).toMatch(/below absolute zero/);
  });

  it("uses the correct absolute-zero bound per scale", () => {
    expect(errored(run("temperature-converter", { value: "-460", from: "f" })).errors.value).toBeDefined();
    expect(ok(run("temperature-converter", { value: "-459.67", from: "f" })).outputs).toHaveLength(4);
    expect(errored(run("temperature-converter", { value: "-1", from: "k" })).errors.value).toBeDefined();
  });

  it("converts Rankine to kelvin with the exact 5/9 ratio", () => {
    const outcome = ok(run("temperature-converter", { value: "671.67", from: "r" }));
    expect(numberOf(outcome.outputs.find((output) => output.label === "Kelvin")?.value ?? "")).toBeCloseTo(373.15, 4);
  });

  it("emphasises the scale you did not type, not the one you did", () => {
    const fromCelsius = ok(run("temperature-converter", { value: "100", from: "c" }));
    expect(fromCelsius.outputs.find((output) => output.emphasis)?.label).toBe("Fahrenheit");
  });
});
