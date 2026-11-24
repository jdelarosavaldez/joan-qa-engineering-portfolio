import { expect, test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { QaLab } from "../pages/components/QaLab";

type PortfolioFixtures = {
  portfolio: HomePage;
  qaLab: QaLab;
};

export const test = base.extend<PortfolioFixtures>({
  qaLab: async ({ page }, use) => {
    await use(new QaLab(page));
  },
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
