import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../fixtures/portfolio.fixture";

test("[PF-A11Y-001] has no WCAG 2.2 AA axe violations in English or Spanish @smoke", async ({ portfolio, page }) => {
  const wcagAaTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];
  const english = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(english.violations, "English accessibility violations").toEqual([]);

  await portfolio.language.select("es");
  const spanish = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(spanish.violations, "Spanish accessibility violations").toEqual([]);
});
