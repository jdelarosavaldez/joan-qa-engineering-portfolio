import { type Locator, type Page } from "@playwright/test";

export class QaLab {
  readonly root: Locator;
  readonly heading: Locator;
  readonly status: Locator;
  readonly runMeta: Locator;
  readonly pendingMessage: Locator;
  readonly chart: Locator;
  readonly history: Locator;
  readonly runDetails: Locator;
  readonly runDetailsToggle: Locator;
  readonly caseList: Locator;
  readonly caseEmpty: Locator;
  readonly historyPanel: Locator;
  readonly historyToggle: Locator;
  readonly passed: Locator;
  readonly failed: Locator;
  readonly skipped: Locator;
  readonly flaky: Locator;
  readonly runAction: Locator;
  readonly runEvidence: Locator;
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator("#qa-lab");
    this.heading = this.root.getByRole("heading", { level: 2 });
    this.status = this.root.locator("[data-qa-status]");
    this.runMeta = this.root.locator("#qa-run-meta");
    this.pendingMessage = this.root.locator("#qa-empty");
    this.chart = this.root.locator("#qa-history-chart");
    this.history = this.root.locator("#qa-history-list");
    this.runDetails = this.root.locator("#qa-run-details");
    this.runDetailsToggle = this.runDetails.locator(":scope > summary");
    this.caseList = this.root.locator("#qa-case-list");
    this.caseEmpty = this.root.locator("#qa-case-empty");
    this.historyPanel = this.root.locator("#qa-history");
    this.historyToggle = this.historyPanel.locator("summary");
    this.passed = this.root.locator("#qa-passed");
    this.failed = this.root.locator("#qa-failed");
    this.skipped = this.root.locator("#qa-skipped");
    this.flaky = this.root.locator("#qa-flaky");
    this.runEvidence = this.root.locator('#qa-run-link');
    this.runAction = this.root.getByRole("link", { name: /Run checks|Ejecutar pruebas/ });
  }

  async chartAxisLabelsClearGridline(): Promise<boolean> {
    return this.chart.evaluate((svg) => {
      const label = svg.querySelector<SVGTextElement>(".qa-chart-axis text");
      const gridline = svg.querySelector<SVGLineElement>(".qa-chart-axis line");
      if (!label || !gridline) return false;
      const labelBounds = label.getBBox();
      return labelBounds.x + labelBounds.width < Number(gridline.getAttribute("x1"));
    });
  }

  caseRow(caseId: string): Locator {
    return this.caseList.getByRole("listitem").filter({ hasText: caseId });
  }

  async expandRunDetails(): Promise<void> {
    await this.runDetailsToggle.click();
  }

  async collapseRunDetails(): Promise<void> {
    await this.runDetailsToggle.click();
  }

  async expandHistory(): Promise<void> {
    await this.historyToggle.click();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.page.evaluate(() => document.fonts.ready);
  }
}
