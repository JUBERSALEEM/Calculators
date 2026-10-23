import { expect, test } from "@playwright/test";

test.describe("calculator page", () => {
  test("computes a percentage change and announces the result", async ({ page }) => {
    await page.goto("/calculators/percentage-change");
    await page.getByTestId("input-oldValue").fill("100");
    await page.getByTestId("input-newValue").fill("120");
    await page.getByTestId("calculate-button").click();
    await expect(page.getByTestId("primary-result")).toHaveText("+20%");
  });

  test("shows a field-level error for a zero starting value", async ({ page }) => {
    await page.goto("/calculators/percentage-change");
    await page.getByTestId("input-oldValue").fill("0");
    await page.getByTestId("input-newValue").fill("50");
    await page.getByTestId("calculate-button").click();
    await expect(page.getByText(/undefined when the original value is 0/)).toBeVisible();
    await expect(page.getByTestId("input-oldValue")).toHaveAttribute("aria-invalid", "true");
  });

  test("rejects a blank field instead of treating it as zero", async ({ page }) => {
    await page.goto("/calculators/percentage-change");
    await page.getByTestId("calculate-button").click();
    await expect(page.getByText("Enter a value").first()).toBeVisible();
  });

  test("calculates BMI and labels the CDC category", async ({ page }) => {
    await page.goto("/calculators/bmi");
    await page.getByTestId("select-units").selectOption("imperial");
    await page.getByTestId("input-weight").fill("169");
    await page.getByTestId("input-height").fill("69");
    await page.getByTestId("calculate-button").click();
    await expect(page.getByTestId("primary-result")).toContainText("25.0");
    await expect(page.getByText("Overweight").first()).toBeVisible();
  });

  test("blocks a wind chill request outside the published domain", async ({ page }) => {
    await page.goto("/calculators/wind-chill");
    await page.getByTestId("select-tempUnit").selectOption("f");
    await page.getByTestId("input-temperature").fill("70");
    await page.getByTestId("select-windUnit").selectOption("mph");
    await page.getByTestId("input-windSpeed").fill("15");
    await page.getByTestId("calculate-button").click();
    await expect(page.getByText(/at or below 50 °F/)).toBeVisible();
  });

  test("includes formula, assumptions, sources and structured data", async ({ page }) => {
    await page.goto("/calculators/bmi");
    await expect(page.getByRole("heading", { name: "Formula" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Assumptions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(page.locator('a[href^="https://www.cdc.gov"]')).toHaveCount(1);
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    expect(jsonLd).toContain("WebApplication");
    expect(jsonLd).toContain("BreadcrumbList");
  });
});

test.describe("theme", () => {
  test("toggles dark mode, sets the class and persists the choice", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("theme-toggle");
    const html = page.locator("html");

    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await expect(html).toHaveClass(/dark/);
  });
});
