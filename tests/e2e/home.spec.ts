import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioCopy } from "../data/copy";

test("[PF-HOME-001] presents Joan and the English portfolio introduction by default @smoke", async ({ portfolio, page }) => {
  await expect(page).toHaveTitle(portfolioCopy.en.title);
  await expect(portfolio.title).toBeVisible();
  await expect(portfolio.role).toHaveText(portfolioCopy.en.role);
  await expect(portfolio.introduction).toContainText(portfolioCopy.en.intro);
  await expect(portfolio.language.option("en")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("main")).toBeVisible();
});

test("[PF-NAV-001] opens About from the keyboard @regression", async ({ portfolio, page }) => {
  await portfolio.aboutLink.focus();
  await expect(portfolio.aboutLink).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#about$/);
  await expect(portfolio.about.heading(portfolioCopy.en.aboutHeading)).toBeVisible();
});
