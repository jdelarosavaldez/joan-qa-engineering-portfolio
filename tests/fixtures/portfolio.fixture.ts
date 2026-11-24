import { expect, test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

type PortfolioFixtures = {
  portfolio: HomePage;
};

export const test = base.extend<PortfolioFixtures>({
  portfolio: async ({ page }, use) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("portfolio-welcome-dismissed", "true");
    });
    const portfolio = new HomePage(page);
    await portfolio.open();
    await use(portfolio);
  },
});

export { expect };
