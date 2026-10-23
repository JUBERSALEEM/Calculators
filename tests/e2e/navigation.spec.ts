import { expect, test } from "@playwright/test";

test.describe("navigation and static pages", () => {
  test("category page lists only its own calculators", async ({ page }) => {
    await page.goto("/categories/weather");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Weather");
    await expect(page.getByRole("link", { name: /Wind Chill Calculator/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /BMI Calculator/ })).toHaveCount(0);
  });

  test("unknown URL renders the custom 404 with a way back", async ({ page }) => {
    const response = await page.goto("/calculators/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /That page doesn’t exist|That page doesn't exist/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse all calculators/ })).toBeVisible();
  });

  test("serves robots.txt and sitemap.xml", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Sitemap:");
    expect(robotsBody).toContain("/sitemap.xml");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain("/calculators/percentage-change");
    expect(sitemapBody).toContain("/categories/weather");
    expect(sitemapBody).not.toContain("does-not-exist");
  });

  test("trust pages render their content", async ({ page }) => {
    for (const [path, heading] of [
      ["/about", "About this site"],
      ["/privacy", "Privacy policy"],
      ["/terms", "Terms of use"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    }
  });

  test("every calculator card links to a page that loads", async ({ page, request }) => {
    await page.goto("/calculators");
    const hrefs = await page.locator('a[href^="/calculators/"]').evaluateAll((links) =>
      Array.from(new Set(links.map((link) => link.getAttribute("href")))).filter(
        (href): href is string => href !== null && href !== "/calculators",
      ),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(12);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });
});
