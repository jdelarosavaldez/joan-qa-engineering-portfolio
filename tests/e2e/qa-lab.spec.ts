import { test, expect } from "../fixtures/portfolio.fixture";
import { type Page } from "@playwright/test";

const workflowRunsUrl = "https://api.github.com/repos/jdelarosavaldez/joan-qa-engineering-portfolio/actions/workflows/portfolio-quality.yml/runs";

async function stubWorkflowRuns(page: Page, workflow_runs: Array<Record<string, unknown>> = []) {
  await page.route(workflowRunsUrl + "**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ workflow_runs }),
  }));
}

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
    flaky: 0,
    total: 18,
    durationMs: 42000,
    actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001",
  },
  history: [
    { runId: "9001", runNumber: 21, status: "success", completedAt: "2026-11-24T21:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001" },
    { runId: "9000", runNumber: 20, status: "failure", completedAt: "2026-11-24T20:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9000" },
  ],
};

test("[PF-QA-001] shows a pending empty state before CI evidence exists @smoke", async ({ portfolio, page, qaLab }) => {
  await stubWorkflowRuns(page);
  await qaLab.reload();
  await expect(qaLab.heading).toBeVisible();
  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.pendingMessage).toBeVisible();
  await expect(qaLab.chart).toBeHidden();
  await expect(qaLab.runAction).toHaveAttribute("href", /actions\/workflows\/portfolio-quality\.yml$/);
  await expect(portfolio.title).toBeVisible();
});

test("[PF-QA-002] renders real-result fields and recent run outcomes in English and Spanish @regression", async ({ portfolio, page, qaLab }) => {
  await stubWorkflowRuns(page);
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
  await expect(qaLab.flaky).toHaveText("0");
  await expect(qaLab.chart).toBeVisible();
  await expect(qaLab.historyPanel).not.toHaveAttribute("open", "");
  await qaLab.expandHistory();
  await expect(qaLab.historyPanel).toHaveAttribute("open", "");
  await expect(qaLab.history.getByRole("listitem")).toHaveCount(2);

  await portfolio.language.option("es").click();
  await expect(qaLab.status).toHaveText("Aprobado");
  await expect(qaLab.heading).toHaveText("Laboratorio de QA");
  await expect(qaLab.chart).toHaveAttribute("aria-label", /Resultados de CI/);
  expect(await qaLab.chartAxisLabelsClearGridline()).toBe(true);
});

test("[PF-QA-003] stays pending until a completed result is published @regression", async ({ portfolio, page, qaLab }) => {
  const githubRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().startsWith("https://api.github.com/")) githubRequests.push(request.url());
  });
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ schemaVersion: 1, latestRun: null, history: [] }),
  }));
  await qaLab.reload();

  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.pendingMessage).toHaveText("The chart will appear after the next CI run on main.");
  expect(githubRequests).toEqual([]);
});

test("[PF-QA-004] keeps malformed public data in the pending state @regression", async ({ portfolio, qaLab, page }) => {
  await stubWorkflowRuns(page);
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: "{malformed",
  }));
  await qaLab.reload();

  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.pendingMessage).toHaveText("The published result is not available yet.");
  await expect(qaLab.chart).toBeHidden();
});

test("[PF-QA-005] localizes the pending state without published CI data @regression", async ({ portfolio, page, qaLab }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({ status: 404, body: "" }));
  await qaLab.reload();
  await expect(qaLab.status).toHaveText("Pending");

  await portfolio.language.option("es").click();

  await expect(qaLab.status).toHaveText("Pendiente");
  await expect(qaLab.pendingMessage).toHaveText("El gráfico aparecerá después de la próxima ejecución de CI en main.");
  await expect(qaLab.runEvidence).toBeHidden();
});

test("[PF-QA-006] filters unsafe and non-result history before rendering @regression", async ({ portfolio, page, qaLab }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      ...successfulFeed,
      history: [
        successfulFeed.history[0],
        { runNumber: 99, status: "cancelled", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/99" },
        { runNumber: 98, status: "failure", actionsUrl: "https://example.com/not-github" },
        { runNumber: 97, status: "success", actionsUrl: null },
      ],
    }),
  }));
  await qaLab.reload();
  await qaLab.expandHistory();

  await expect(qaLab.history.getByRole("listitem")).toHaveCount(1);
  await expect(qaLab.history.getByRole("link")).toHaveAttribute("href", /9001$/);
});
