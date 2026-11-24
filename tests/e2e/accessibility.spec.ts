import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData } from "../data/test-data";

const wcagAaTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

test("[PF-A11Y-001] has no WCAG 2.2 AA axe violations in English @smoke", async ({ portfolio, page }) => {
  await expect(portfolio.title).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(results.violations, "English accessibility violations").toEqual([]);
});

test("[PF-A11Y-002] has no WCAG 2.2 AA axe violations in Spanish @smoke", async ({ portfolio, page }) => {
  await portfolio.language.select("es");
  const results = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(results.violations, `Spanish accessibility violations for ${portfolioTestData.es.title}`).toEqual([]);
});
