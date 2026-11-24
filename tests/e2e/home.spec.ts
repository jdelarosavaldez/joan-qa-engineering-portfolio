import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData } from "../data/test-data";

test("[PF-HOME-001] presents Joan and the English portfolio introduction by default @smoke", async ({ portfolio, page }) => {
  await expect(page).toHaveTitle(portfolioTestData.en.title);
  await expect(portfolio.title).toBeVisible();
  await expect(portfolio.role).toHaveText(portfolioTestData.en.role);
  await expect(portfolio.introduction).toContainText(portfolioTestData.en.intro);
  await expect(portfolio.language.option("en")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("main")).toBeVisible();
});

test("[PF-NAV-001] opens About from the keyboard @regression", async ({ portfolio, page }) => {
  await portfolio.aboutLink().focus();
  await expect(portfolio.aboutLink).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#about$/);
  await expect(portfolio.about.heading(portfolioTestData.en.aboutHeading)).toBeVisible();
});
