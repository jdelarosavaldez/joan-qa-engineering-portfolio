import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioCopy } from "../data/copy";

test("[PF-I18N-001] switches the page copy and language metadata to Spanish @smoke", async ({ portfolio, page }) => {
  await portfolio.language.select("es");

  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(portfolio.language.option("es")).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.role).toHaveText(portfolioCopy.es.role);
  await expect(portfolio.introduction).toContainText(portfolioCopy.es.intro);
  await expect(portfolio.about.heading(portfolioCopy.es.aboutHeading)).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /ingeniero de QA/);
  await expect(portfolio.flow.station(portfolioCopy.es.stations[0])).toBeVisible();
});

test("[PF-I18N-002] switches back to English without stale Spanish copy @regression", async ({ portfolio, page }) => {
  await portfolio.language.select("es");
  await portfolio.language.select("en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(portfolio.language.option("en")).toHaveAttribute("aria-pressed", "true");
  await expect(portfolio.role).toHaveText(portfolioCopy.en.role);
  await expect(portfolio.introduction).toContainText(portfolioCopy.en.intro);
  await expect(portfolio.about.heading(portfolioCopy.en.aboutHeading)).toBeVisible();
});
