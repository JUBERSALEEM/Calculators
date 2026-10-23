import { describe, expect, it } from "vitest";

import { clamp, formatNumber, formatSignedPercent, formatWithUnit, parseLocaleNumber, splitNumberList } from "@/lib/format";

describe("parseLocaleNumber", () => {
  it("parses plain and signed decimals", () => {
    expect(parseLocaleNumber("12.5")).toBe(12.5);
    expect(parseLocaleNumber("-8")).toBe(-8);
    expect(parseLocaleNumber("+3")).toBe(3);
    expect(parseLocaleNumber("0")).toBe(0);
  });

  it("strips thousands separators and normalises a true minus sign", () => {
    expect(parseLocaleNumber("1,234,567.89")).toBe(1234567.89);
    expect(parseLocaleNumber("\u221219.4")).toBe(-19.4);
  });

  it("accepts exponent notation", () => {
    expect(parseLocaleNumber("1e3")).toBe(1000);
    expect(parseLocaleNumber("2.5E-2")).toBe(0.025);
  });

  it("rejects blank input instead of treating it as zero", () => {
    expect(parseLocaleNumber("")).toBeNull();
    expect(parseLocaleNumber("   ")).toBeNull();
  });

  it("rejects partial or malformed numerics", () => {
    expect(parseLocaleNumber("12abc")).toBeNull();
    expect(parseLocaleNumber("1.2.3")).toBeNull();
    expect(parseLocaleNumber("--5")).toBeNull();
    expect(parseLocaleNumber("1,23")).toBeNull();
    expect(parseLocaleNumber("Infinity")).toBeNull();
    expect(parseLocaleNumber("NaN")).toBeNull();
  });
});

describe("formatNumber", () => {
  it("groups thousands and respects fraction limits", () => {
    expect(formatNumber(1234567.891)).toBe("1,234,567.891");
    expect(formatNumber(1.005, { maxFractionDigits: 2 })).toBe("1.01");
    expect(formatNumber(2, { minFractionDigits: 1, maxFractionDigits: 1 })).toBe("2.0");
  });

  it("uses exponential notation at extreme magnitudes rather than rounding to zero", () => {
    expect(formatNumber(1e-9)).toBe("1.0000e-9");
    expect(formatNumber(2.5e16)).toBe("2.5000e16");
  });

  it("uses a true minus for negative values", () => {
    expect(formatNumber(-25)).toBe("\u221225");
    expect(formatNumber(-1234.5)).toBe("\u22121,234.5");
  });

  it("never renders a non-finite number as a value", () => {
    expect(formatNumber(Number.NaN)).toBe("—");
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatSignedPercent", () => {
  it("adds a sign and a true minus, and leaves zero unsigned", () => {
    expect(formatSignedPercent(20)).toBe("+20%");
    expect(formatSignedPercent(-4.5)).toBe("−4.5%");
    expect(formatSignedPercent(0)).toBe("0%");
  });
});

describe("formatWithUnit", () => {
  it("joins the value to the unit with a non-breaking space", () => {
    expect(formatWithUnit(12.5, "kg")).toBe("12.5\u00A0kg");
  });
});

describe("splitNumberList", () => {
  it("splits on commas, semicolons, spaces and newlines", () => {
    expect(splitNumberList("1, 2;3\n4\t5")).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("returns an empty array for blank text", () => {
    expect(splitNumberList("   ")).toEqual([]);
  });
});

describe("clamp", () => {
  it("bounds both ends", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
