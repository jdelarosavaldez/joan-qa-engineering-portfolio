import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioCopy } from "../data/copy";
import { HomePage } from "../pages/HomePage";

test("[PF-FLOW-001] exposes all four quality stations with exact accessible names in both languages @smoke", async ({ portfolio }) => {
  for (const stationName of portfolioCopy.en.stations) {
    const station = portfolio.flow.station(stationName);
    await expect(station).toBeVisible();
    await expect(station).toHaveAccessibleName(stationName);
  }

  await portfolio.language.select("es");
  for (const stationName of portfolioCopy.es.stations) {
    const station = portfolio.flow.station(stationName);
    await expect(station).toBeVisible();
    await expect(station).toHaveAccessibleName(stationName);
  }
});

test("[PF-FLOW-002] opens and closes station notes by hover, click, and keyboard @regression", async ({ portfolio, page }) => {
  const automation = portfolio.flow.station("Automation");
  await automation.hover();
  await expect(automation).toHaveAttribute("aria-expanded", "true");
  await page.mouse.move(0, 0);
  await expect(automation).toHaveAttribute("aria-expanded", "false");

  const strategy = portfolio.flow.station("Strategy");
  const strategyNote = await portfolio.flow.noteFor("Strategy");

  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "true");
  await expect(strategyNote).toBeVisible();
  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "false");

  const manualTesting = portfolio.flow.station("Manual testing");
  await manualTesting.focus();
  await expect(manualTesting).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "false");
});

test("[PF-FLOW-003] opens a station on touch and closes it on a second tap @regression", async ({ browser }) => {
  const touchPage = await browser.newPage({
    isMobile: true,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  const touchPortfolio = new HomePage(touchPage);

  try {
    await touchPortfolio.open();
    const strategy = touchPortfolio.flow.station("Strategy");
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "true");
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "false");
  } finally {
    await touchPage.close();
  }
});
