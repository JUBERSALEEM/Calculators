import { describe, expect, it } from "vitest";

import { bmi } from "@/lib/calculators/definitions/bmi";
import { heatIndex } from "@/lib/calculators/definitions/heat-index";
import { validateInputs } from "@/lib/calculators/validation";

describe("validateInputs", () => {
  it("rejects a blank required number with an explicit message", () => {
    const result = validateInputs(bmi.fields, { units: "metric", weight: "", height: "175" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.weight).toBe("Enter a value");
  });

  it("rejects non-numeric text rather than coercing it", () => {
    const result = validateInputs(bmi.fields, { units: "metric", weight: "heavy", height: "175" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.weight).toBe("Enter a valid number");
  });

  it("enforces the bounds declared in the field metadata", () => {
    const result = validateInputs(heatIndex.fields, { tempUnit: "f", temperature: "100", humidity: "140" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.humidity).toBe("Relative humidity must be at most 100 %.");
  });

  it("rejects a select value that is not an option", () => {
    const result = validateInputs(bmi.fields, { units: "stone", weight: "70", height: "175" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.units).toBe("Choose one of the available options.");
  });

  it("passes valid input through with numbers already parsed", () => {
    const result = validateInputs(bmi.fields, { units: "metric", weight: "70", height: "175" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.values.weight).toBe(70);
      expect(result.values.height).toBe(175);
      expect(result.values.units).toBe("metric");
    }
  });

  it("reports every bad field at once, not just the first", () => {
    const result = validateInputs(bmi.fields, { units: "metric", weight: "", height: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["height", "weight"]);
    }
  });
});
