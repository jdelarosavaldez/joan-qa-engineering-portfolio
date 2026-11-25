import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData } from "../data/test-data";

test("[PF-I18N-001] should switch the page copy and language metadata to Spanish @smoke", async ({ portfolio, page }) => {
  await portfolio.language.select("es");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(portfolio.language.option("es")).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.role).toHaveText(portfolioTestData.es.role);
  await expect(portfolio.introduction).toContainText(portfolioTestData.es.intro);
  await expect(portfolio.about.heading(portfolioTestData.es.aboutHeading)).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /ingeniero de QA/);
  await expect(portfolio.flow.station(portfolioTestData.es.stations[0])).toBeVisible();
});

test("[PF-I18N-002] should restore English copy and metadata without stale Spanish text @regression", async ({ portfolio, page }) => {
  await portfolio.language.select("es");
  await portfolio.language.select("en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(portfolio.language.option("en")).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.role).toHaveText(portfolioTestData.en.role);
  await expect(portfolio.introduction).toContainText(portfolioTestData.en.intro);
  await expect(portfolio.about.heading(portfolioTestData.en.aboutHeading)).toBeVisible();
});
