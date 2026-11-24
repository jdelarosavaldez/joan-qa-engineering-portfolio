import { expect, test, type Page } from "@playwright/test";

const desktop = { width: 1440, height: 900 };
const mobile = { width: 375, height: 812 };

async function openPortfolio(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("portfolio-welcome-dismissed", "true");
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
}

test("loads the portfolio and switches complete page content between EN and ES", async ({ page }) => {
  await openPortfolio(page);

  await expect(page).toHaveTitle("Joan De la Rosa — QA Engineer");
  await expect(page.getByRole("heading", { level: 1, name: "Joan De la Rosa" })).toBeVisible();
  await expect(page.getByText("QA Engineer · SDET · Quality Engineering").first()).toBeVisible();
  await expect(page.locator(".bio")).toContainText("years of experience");
  await expect(page.getByRole("button", { name: "EN — English" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("main")).toBeVisible();

  await page.getByRole("button", { name: "ES — Spanish" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("button", { name: "ES — Español" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".bio")).toContainText("Soy ingeniero de QA");
  await expect(page.getByRole("heading", { level: 2, name: "Sobre mi trabajo" })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /ingeniero de QA/);
});

test("the About link works with keyboard activation", async ({ page }) => {
  await openPortfolio(page);

  const aboutLink = page.getByRole("link", { name: "More about my work" });
  await aboutLink.focus();
  await expect(aboutLink).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("heading", { level: 2, name: "About my work" })).toBeVisible();
});

for (const viewport of [mobile, desktop]) {
  test(`fits ${viewport.width}x${viewport.height} without page overflow or section overlap`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await openPortfolio(page);

    const dimensions = await page.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.documentWidth, "the page should not scroll horizontally").toBeLessThanOrEqual(dimensions.viewportWidth + 1);

    const structuralSelectors = [".hero h1", ".role-line", ".flow", ".bio", ".about-link"];
    const boxes = await Promise.all(structuralSelectors.map(async (selector) => {
      const locator = page.locator(selector);
      await expect(locator).toBeVisible();
      const box = await locator.boundingBox();
      expect(box, `${selector} should have measurable dimensions`).not.toBeNull();
      return { selector, ...box! };
    }));

    for (let index = 0; index < boxes.length - 1; index += 1) {
      const current = boxes[index];
      const next = boxes[index + 1];
      expect(
        current.y + current.height,
        `${current.selector} should not overlap ${next.selector}`,
      ).toBeLessThanOrEqual(next.y + 1);
    }

    await page.screenshot({
      path: testInfo.outputPath(`portfolio-${viewport.width}x${viewport.height}.png`),
      fullPage: true,
      animations: "disabled",
    });
  });
}

test("station notes are available by keyboard and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPortfolio(page);

  await expect(page.locator(".hero h1 span").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");

  const strategy = page.getByRole("button", { name: "Strategy" });
  await strategy.focus();
  await expect(strategy).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(strategy).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(strategy).toHaveAttribute("aria-expanded", "true");
});
