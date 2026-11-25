import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData } from "../data/test-data";

test("[PF-FLOW-001] should expose all four stations with exact accessible names in English and Spanish @smoke", async ({ portfolio }) => {
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

test("[PF-FLOW-002] should show a station note on hover and hide it after pointer exit @regression", async ({ portfolio, page }) => {
  const automation = portfolio.flow.station(portfolioTestData.en.stations[2]);
  await automation.hover();
  await expect(automation).toHaveAttribute("aria-expanded", "true");
  await page.mouse.move(0, 0);
  await expect(automation).toHaveAttribute("aria-expanded", "false");
});

test("[PF-FLOW-003] should toggle a station note with a click @regression", async ({ portfolio }) => {
  const strategy = portfolio.flow.station(portfolioTestData.en.stations[0]);
  const strategyNote = await portfolio.flow.noteFor(portfolioTestData.en.stations[0]);

  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "true");
  await expect(strategyNote).toBeVisible();
  await strategy.click();
  await expect(strategy).toHaveAttribute("aria-expanded", "false");
});

test("[PF-FLOW-004] should open and close station notes with keyboard controls @regression", async ({ portfolio, page }) => {
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

  test("[PF-FLOW-005] should open a station note on first touch and close it on a second tap @regression", async ({ portfolio }) => {
    const strategy = portfolio.flow.station(portfolioTestData.en.stations[0]);
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "true");
    await strategy.tap();
    await expect(strategy).toHaveAttribute("aria-expanded", "false");
  });
});
