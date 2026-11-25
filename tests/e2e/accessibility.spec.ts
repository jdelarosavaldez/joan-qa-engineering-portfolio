import AxeBuilder from "@axe-core/playwright";
import { type Page } from "@playwright/test";
import { test, expect } from "../fixtures/portfolio.fixture";
import { QaLab } from "../pages/components/QaLab";
import { portfolioTestData } from "../data/test-data";

const wcagAaTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];

async function openScrollableQaResults(page: Page, qaLab: QaLab): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const cases = Array.from({ length: 32 }, (_, index) => ({
    caseId: `PF-A11Y-${String(index + 1).padStart(3, "0")}`,
    title: `accessible result row ${index + 1}`,
    status: "passed",
    durationMs: 100,
  }));
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      schemaVersion: 2,
      latestRun: {
        runId: "a11y-check",
        runNumber: 99,
        status: "success",
        completedAt: "2026-11-24T21:20:17.000Z",
        commit: "a11ycheck",
        passed: cases.length,
        failed: 0,
        skipped: 0,
        flaky: 0,
        total: cases.length,
        durationMs: 3200,
        actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/99",
        cases,
      },
      history: [],
    }),
  }));
  await qaLab.reload();
  await qaLab.expandRunDetails();
}

test("[PF-A11Y-001] has no WCAG 2.2 AA axe violations in English with expanded cases @smoke", async ({ portfolio, page, qaLab }) => {
  await openScrollableQaResults(page, qaLab);
  await expect(portfolio.title).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(results.violations, "English accessibility violations").toEqual([]);
});

test("[PF-A11Y-002] has no WCAG 2.2 AA axe violations in Spanish with expanded cases @smoke", async ({ portfolio, page, qaLab }) => {
  await openScrollableQaResults(page, qaLab);
  await portfolio.language.select("es");
  const results = await new AxeBuilder({ page }).withTags(wcagAaTags).analyze();
  expect(results.violations, `Spanish accessibility violations for ${portfolioTestData.es.title}`).toEqual([]);
});
