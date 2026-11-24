import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData } from "../data/test-data";

test("[PF-FLOW-001] exposes all four quality stations with exact accessible names in both languages @smoke", async ({ portfolio }) => {
  for (const stationName of portfolioTestData.en.stations) {
    const station = portfolio.flow.station(stationName);
    await expect(station).toBeVisible();
    await expect(station).toHaveAccessibleName(stationName);
  }

  await portfolio.language.select("es");
  for (const stationName of portfolioTestData.es.stations) {
    const station = portfolio.flow.station(stationName);
    await expect(station).toBeVisible();
    await expect(station).toHaveAccessibleName(stationName);
  }
});

test("[PF-FLOW-002] opens a station note on hover and closes it when the pointer leaves @regression", async ({ portfolio, page }) => {
  const automation = portfolio.flow.station(portfolioTestData.en.stations[2]);
  await automation.hover();
  await expect(automation).toHaveAttribute("aria-expanded", "true");
  await page.mouse.move(0, 0);
  await expect(automation).toHaveAttribute("aria-expanded", "false");
});

test("[PF-FLOW-003] toggles a station note with click @regression", async ({ portfolio }) => {
  const strategy = portfolio.flow.station(portfolioTestData.en.stations[0]);
  const strategyNote = await portfolio.flow.noteFor(portfolioTestData.en.stations[0]);

  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "true");
  await expect(strategyNote).toBeVisible();
  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "false");
});

test("[PF-FLOW-004] opens and closes a station note with keyboard controls @regression", async ({ portfolio, page }) => {
  const manualTesting = portfolio.flow.station(portfolioTestData.en.stations[1]);
  await manualTesting.focus();
  await expect(manualTesting).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(manualTesting).toHaveAttribute("aria-expanded", "false");
});

test.describe("Touch station notes", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  test("[PF-FLOW-005] opens a station note on touch and closes it on a second tap @regression", async ({ portfolio }) => {
    const strategy = portfolio.flow.station(portfolioTestData.en.stations[0]);
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "true");
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "false");
  });
});
