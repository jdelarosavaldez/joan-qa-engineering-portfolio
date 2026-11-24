import { test, expect } from "../fixtures/portfolio.fixture";

const viewports = [
  { width: 375, height: 812 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test("[PF-LAYOUT-001] fits mobile, desktop, and wide viewports in both languages without overflow or vertical overlap @regression", async ({ portfolio, page }, testInfo) => {
  for (const viewport of viewports) {
    for (const language of ["en", "es"] as const) {
      await page.setViewportSize(viewport);
      await portfolio.open();
      if (language === "es") await portfolio.language.select("es");

      const { viewportWidth, documentWidth } = await portfolio.documentDimensions();
      expect(documentWidth, `${viewport.width}px ${language} page should not scroll horizontally`).toBeLessThanOrEqual(viewportWidth + 1);

      const boxes = await portfolio.layoutBoxes();
      for (let index = 0; index < boxes.length - 1; index += 1) {
        const current = boxes[index];
        const next = boxes[index + 1];
        expect(current.y + current.height, `${current.name} should not overlap ${next.name} at ${viewport.width}px in ${language}`)
          .toBeLessThanOrEqual(next.y + 1);
      }

      const labelWidths = await portfolio.flow.stationLabelWidths();
      for (const label of labelWidths) {
        expect(label.scrollWidth, `station label "${label.label}" should fit at ${viewport.width}px in ${language}`)
          .toBeLessThanOrEqual(label.clientWidth);
      }

      if (viewport.width >= 1600) {
        const spacing = await portfolio.flow.strategySpacing();
        expect(spacing.labelAlignment, "the Strategy label should stay aligned with the station").toBeLessThanOrEqual(1);
        expect(spacing.shapeOffset, "the Strategy shape should be offset from its label").toBeGreaterThanOrEqual(12);
        expect(spacing.startCircleClearance, "the Strategy shape should clear the start circle").toBeGreaterThanOrEqual(12);
      }

      await page.screenshot({
        path: testInfo.outputPath(`portfolio-${viewport.width}x${viewport.height}-${language}.png`),
        fullPage: true,
        animations: "disabled",
      });
    }
  }
});

test("[PF-MOTION-001] keeps the hero static when reduced motion is requested @regression", async ({ portfolio, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await portfolio.open();

  await expect(portfolio.title.locator("span").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
