import { type Locator, type Page } from "@playwright/test";

export class QaLab {
  readonly root: Locator;
  readonly heading: Locator;
  readonly status: Locator;
  readonly pendingMessage: Locator;
  readonly chart: Locator;
  readonly history: Locator;
  readonly passed: Locator;
  readonly failed: Locator;
  readonly skipped: Locator;
  readonly runAction: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator("#qa-lab");
    this.heading = this.root.getByRole("heading", { level: 2 });
    this.status = this.root.locator("[data-qa-status]");
    this.pendingMessage = this.root.locator("#qa-empty");
    this.chart = this.root.getByRole("img");
    this.history = this.root.locator("#qa-history-list");
    this.passed = this.root.locator("#qa-passed");
    this.failed = this.root.locator("#qa-failed");
    this.skipped = this.root.locator("#qa-skipped");
    this.runAction = this.root.getByRole("link", { name: /Run checks|Ejecutar pruebas/ });
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.page.evaluate(() => document.fonts.ready);
  }
}
