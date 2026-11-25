import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData, type PortfolioLanguage } from "../data/test-data";

const layouts = [
  { caseId: "001", width: 375, height: 812, language: "en" },
  { caseId: "002", width: 375, height: 812, language: "es" },
  { caseId: "003", width: 1440, height: 900, language: "en" },
  { caseId: "004", width: 1440, height: 900, language: "es" },
  { caseId: "005", width: 1920, height: 1080, language: "en" },
  { caseId: "006", width: 1920, height: 1080, language: "es" },
  { caseId: "007", width: 390, height: 844, language: "en" },
  { caseId: "008", width: 390, height: 844, language: "es" },
  { caseId: "009", width: 960, height: 1080, language: "en" },
  { caseId: "010", width: 960, height: 1080, language: "es" },
] as const;

for (const layout of layouts) {
  const language = layout.language as PortfolioLanguage;
  test.describe(`[PF-LAYOUT-${layout.caseId}] ${layout.width}px ${language.toUpperCase()}`, () => {
    test.use({
      viewport: { width: layout.width, height: layout.height },
      reducedMotion: "reduce",
    });

    test(`keeps the page and quality flow aligned without overflow @regression`, async ({ portfolio }, testInfo) => {
      if (language === "es") await portfolio.language.select("es");

      const { viewportWidth, documentWidth } = await portfolio.documentDimensions();
      expect(documentWidth, `${layout.width}px ${language} page should not scroll horizontally`)
        .toBeLessThanOrEqual(viewportWidth + 1);

      const boxes = await portfolio.layoutBoxes(language);
      for (let index = 0; index < boxes.length - 1; index += 1) {
        const current = boxes[index];
        const next = boxes[index + 1];
        expect(current.y + current.height, `${current.name} should not overlap ${next.name}`)
          .toBeLessThanOrEqual(next.y + 1);
      }

      for (const label of await portfolio.flow.stationLabelWidths()) {
        expect(label.scrollWidth, `station label "${label.label}" should fit`)
          .toBeLessThanOrEqual(label.clientWidth);
      }

      const strategyName = portfolioTestData[language].stations[0];
      const qualityName = portfolioTestData[language].stations[3];
      const spacing = await portfolio.flow.endpointSpacing(strategyName, qualityName);
      expect(spacing.startGap, "the start circle must not touch Strategy").toBeGreaterThanOrEqual(0);
      expect(spacing.endGap, "the finish circle must not touch Quality").toBeGreaterThanOrEqual(0);
      expect(spacing.gapDifference, "the two endpoint gaps should have matching proportions").toBeLessThanOrEqual(2);
      expect(spacing.axisOffset, "the flow line should pass through the vertical centers of its shapes").toBeLessThanOrEqual(1);
      expect(spacing.strategyCenterOffset, "Strategy's shape and label should share a center").toBeLessThanOrEqual(1);

      await testInfo.attach(`portfolio-${layout.width}x${layout.height}-${language}`, {
        body: await portfolio.captureScreenshot(),
        contentType: "image/png",
      });
    });
  });
}

test("[PF-MOTION-001] keeps the hero static when reduced motion is requested @regression", async ({ portfolio, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await portfolio.open();

  await expect(portfolio.title.locator("span").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
