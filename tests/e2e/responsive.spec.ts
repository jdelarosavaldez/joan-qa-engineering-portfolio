import { test, expect } from "../fixtures/portfolio.fixture";
import { portfolioTestData, type PortfolioLanguage } from "../data/test-data";

const viewports = [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const languages = ["en", "es"] as const;

let layoutCase = 1;
for (const viewport of viewports) {
  test.describe(`Responsive layout at ${viewport.width}px`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const language of languages) {
      const caseId = String(layoutCase++).padStart(3, "0");
      test(`[PF-LAYOUT-${caseId}] ${language.toUpperCase()} has no overflow, overlap, or clipped station labels @regression`, async ({ portfolio }, testInfo) => {
        if (language === "es") await portfolio.language.select("es");

        const { viewportWidth, documentWidth } = await portfolio.documentDimensions();
        expect(documentWidth, `${viewport.width}px ${language} page should not scroll horizontally`)
          .toBeLessThanOrEqual(viewportWidth + 1);

        const boxes = await portfolio.layoutBoxes(language as PortfolioLanguage);
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

        if (viewport.width >= 1600) {
          const strategy = await portfolio.flow.strategySpacing(portfolioTestData[language].stations[0]);
          expect(strategy.labelAlignment, "the Strategy label should stay aligned with the station")
            .toBeLessThanOrEqual(1);
          expect(strategy.shapeOffset, "the Strategy shape should be offset from its label")
            .toBeGreaterThanOrEqual(12);
          expect(strategy.startCircleClearance, "the Strategy shape should clear the start circle")
            .toBeGreaterThanOrEqual(12);
        }

        await testInfo.attach(`portfolio-${viewport.width}x${viewport.height}-${language}`, {
          body: await portfolio.captureScreenshot(),
          contentType: "image/png",
        });
      });
    }
  });
}

test("[PF-MOTION-001] keeps the hero static when reduced motion is requested @regression", async ({ portfolio, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await portfolio.open();

  await expect(portfolio.title.locator("span").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
