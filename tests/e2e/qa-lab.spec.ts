import { test, expect } from "../fixtures/portfolio.fixture";

const successfulFeed = {
  schemaVersion: 1,
  latestRun: {
    runId: "9001",
    runNumber: 21,
    status: "success",
    completedAt: "2026-11-24T21:20:17.000Z",
    commit: "b9bac30",
    passed: 18,
    failed: 0,
    skipped: 0,
    total: 18,
    durationMs: 42000,
    actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001",
  },
  history: [
    { runId: "9001", runNumber: 21, status: "success", completedAt: "2026-11-24T21:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001" },
    { runId: "9000", runNumber: 20, status: "failure", completedAt: "2026-11-24T20:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9000" },
  ],
};

test("[PF-QA-001] shows a pending empty state before CI evidence exists @smoke", async ({ portfolio, qaLab }) => {
  await expect(qaLab.heading).toBeVisible();
  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.pendingMessage).toBeVisible();
  await expect(qaLab.chart).toBeHidden();
  await expect(qaLab.runAction).toHaveAttribute("href", /actions\/workflows\/portfolio-quality\.yml$/);
  await expect(portfolio.title).toBeVisible();
});

test("[PF-QA-002] renders real-result fields and recent run outcomes in English and Spanish @regression", async ({ portfolio, page, qaLab }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(successfulFeed),
  }));
  await qaLab.reload();

  await expect(qaLab.status).toHaveText("Passed");
  await expect(qaLab.passed).toHaveText("18");
  await expect(qaLab.failed).toHaveText("0");
  await expect(qaLab.skipped).toHaveText("0");
  await expect(qaLab.chart).toBeVisible();
  await expect(qaLab.history.getByRole("listitem")).toHaveCount(2);

  await portfolio.language.option("es").click();
  await expect(qaLab.status).toHaveText("Aprobado");
  await expect(qaLab.heading).toHaveText("Laboratorio de QA");
  await expect(qaLab.chart).toHaveAttribute("aria-label", /Resultados recientes de CI/);
});

test("[PF-QA-003] keeps malformed public data in the pending state @regression", async ({ qaLab, page }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "{malformed",
  }));
  await qaLab.reload();

  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.pendingMessage).toBeVisible();
  await expect(qaLab.chart).toBeHidden();
});
