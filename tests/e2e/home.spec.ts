import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test("renders the hero, heading and calculator cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("show their working");
    await expect(page.getByTestId("calculator-search-input")).toBeVisible();
    await expect(page.getByRole("link", { name: /Percentage Change Calculator/ }).first()).toBeVisible();
  });

  test("has exactly one h1 and skips to main content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeAttached();
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("exposes a canonical URL and social metadata", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  });
});

test.describe("search", () => {
  test("filters to a matching calculator and opens it", async ({ page }) => {
    await page.goto("/");
    const input = page.getByTestId("calculator-search-input");
    await input.fill("wind");
    const results = page.getByTestId("search-results");
    await expect(results.getByRole("link", { name: /Wind Chill/ })).toBeVisible();
    await results.getByRole("link", { name: /Wind Chill/ }).click();
    await expect(page).toHaveURL(/\/calculators\/wind-chill$/);
  });

  test("shows a helpful empty state for gibberish", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("calculator-search-input").fill("zzzqqq");
    await expect(page.getByTestId("search-results")).toContainText("No calculators match");
  });

  test("directory search lists everything before typing", async ({ page }) => {
    await page.goto("/calculators");
    const results = page.getByTestId("search-results");
    await expect(results.getByRole("link")).toHaveCount(12);
    await page.getByTestId("calculator-search-input").fill("bmi");
    await expect(results.getByRole("link")).toHaveCount(1);
  });
});
