import { test, expect } from "../fixtures/portfolio.fixture";
import { type Page } from "@playwright/test";

const successfulFeed = {
  schemaVersion: 2,
  latestRun: {
    runId: "9001", runNumber: 21, status: "success", completedAt: "2026-11-24T21:20:17.000Z",
    commit: "b9bac30", passed: 3, failed: 0, skipped: 0, flaky: 0, total: 3, durationMs: 42000,
    actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001",
    cases: [
      { caseId: "PF-HOME-001", title: "loads the portfolio", status: "passed", durationMs: 1200 },
      { caseId: "PF-QA-001", title: "shows a pending empty state", status: "passed", durationMs: 600 },
      { caseId: "PF-A11Y-001", title: "passes the English accessibility scan", status: "passed", durationMs: 900 },
    ],
  },
  history: [
    { runId: "9001", runNumber: 21, status: "success", completedAt: "2026-11-24T21:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9001" },
    { runId: "9000", runNumber: 20, status: "failure", completedAt: "2026-11-24T20:20:17.000Z", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/9000" },
  ],
};
const mixedStatusFeed = {
  ...successfulFeed,
  latestRun: {
    ...successfulFeed.latestRun, status: "failure", passed: 1, failed: 1, skipped: 1, flaky: 1, total: 4,
    cases: [
      { caseId: "PF-QA-011", title: "keeps a successful case", status: "passed", durationMs: 100 },
      { caseId: "PF-QA-012", title: "reports a failed case", status: "failed", durationMs: 220 },
      { caseId: "PF-QA-013", title: "reports a skipped case", status: "skipped", durationMs: 0 },
      { caseId: "PF-QA-014", title: "reports a flaky retry", status: "flaky", durationMs: 500 },
    ],
  },
};
async function publishFeed(page: Page, feed: unknown) {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify(feed),
  }));
}

test("[PF-QA-001] shows a truthful pending state before CI evidence exists @smoke", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, { schemaVersion: 2, latestRun: null, history: [] });
  await qaLab.reload();
  await expect(qaLab.heading).toBeVisible();
  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.runDetailsToggle).toBeVisible();
  await expect(qaLab.runDetails).not.toHaveAttribute("open", "");
  await expect(qaLab.runDetailsToggle).toContainText("Waiting for a published CI result.");
  await expect(qaLab.chart).toBeHidden();
  await expect(qaLab.runAction).toHaveAttribute("href", /actions\/workflows\/portfolio-quality\.yml$/);
  await expect(portfolio.title).toBeVisible();
});

test("[PF-QA-002] keeps the latest run compact and reveals details by keyboard @regression", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, successfulFeed);
  await qaLab.reload();
  await expect(page.getByRole("heading", { name: "Latest run", level: 3 })).toBeVisible();
  await expect(qaLab.status).toHaveAttribute("role", "status");
  await expect(qaLab.status.locator("xpath=ancestor::summary")).toHaveCount(0);
  await expect(qaLab.status).toHaveText("Passed");
  await expect(qaLab.runDetailsToggle).toContainText("#21");
  await expect(qaLab.runDetailsToggle).toContainText("Nov");
  await expect(qaLab.runDetails).not.toHaveAttribute("open", "");
  await expect(qaLab.passed).toBeHidden();
  await expect(qaLab.chart).toBeHidden();
  await qaLab.runDetailsToggle.focus();
  await qaLab.runDetailsToggle.press("Space");
  await expect(qaLab.runDetails).toHaveAttribute("open", "");
  await expect(qaLab.passed).toHaveText("3");
  await expect(qaLab.failed).toHaveText("0");
  await expect(qaLab.skipped).toHaveText("0");
  await expect(qaLab.flaky).toHaveText("0");
  await expect(qaLab.duration).toContainText("42");
  await expect(qaLab.chart).toBeVisible();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(3);
  await expect(qaLab.caseRow("PF-HOME-001")).toContainText("loads the portfolio");
  await qaLab.expandHistory();
  await expect(qaLab.historyPanel).toHaveAttribute("open", "");
  await expect(qaLab.history.getByRole("listitem")).toHaveCount(2);
  await portfolio.language.option("es").click();
  await expect(qaLab.status).toHaveText("Aprobado");
  await expect(qaLab.heading).toHaveText("Laboratorio de QA");
  await expect(page.getByRole("heading", { name: "Última ejecución", level: 3 })).toBeVisible();
  await expect(qaLab.caseRow("PF-HOME-001")).toContainText("Aprobado");
  await expect(qaLab.chart).toHaveAttribute("aria-label", /Resultados de CI/);
  expect(await qaLab.chartAxisLabelsClearGridline()).toBe(true);
  await qaLab.runDetailsToggle.press("Space");
  await expect(qaLab.runDetails).not.toHaveAttribute("open", "");
  await expect(qaLab.passed).toBeHidden();
});

test("[PF-QA-003] stays pending when there is no completed run @regression", async ({ portfolio, page, qaLab }) => {
  const githubRequests: string[] = [];
  page.on("request", (request) => { if (request.url().startsWith("https://api.github.com/")) githubRequests.push(request.url()); });
  await publishFeed(page, { schemaVersion: 2, latestRun: null, history: [] });
  await qaLab.reload();
  await expect(qaLab.status).toHaveText("Pending");
  await expect(qaLab.runDetailsToggle).toContainText("Waiting for a published CI result.");
  await qaLab.expandRunDetails();
  await expect(qaLab.pendingMessage).toHaveText("The chart will appear after the next CI run on main.");
  await expect(qaLab.caseEmpty).toHaveText("No case details are included in this published run.");
  expect(githubRequests).toEqual([]);
});

test("[PF-QA-004] keeps malformed public data in the pending state @regression", async ({ portfolio, qaLab, page }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{malformed" }));
  await qaLab.reload();
  await expect(qaLab.status).toHaveText("Pending");
  await qaLab.expandRunDetails();
  await expect(qaLab.pendingMessage).toHaveText("The published result is not available yet.");
  await expect(qaLab.chart).toBeHidden();
});

test("[PF-QA-005] localizes an empty published feed @regression", async ({ portfolio, page, qaLab }) => {
  await page.route("**/data/qa-lab-results.json", (route) => route.fulfill({ status: 404, body: "" }));
  await qaLab.reload();
  await expect(qaLab.status).toHaveText("Pending");
  await portfolio.language.option("es").click();
  await expect(qaLab.status).toHaveText("Pendiente");
  await qaLab.expandRunDetails();
  await expect(qaLab.pendingMessage).toHaveText("El gráfico aparecerá después de la próxima ejecución de CI en main.");
  await expect(qaLab.caseEmpty).toHaveText("Esta ejecución publicada no incluye detalles de casos.");
  await expect(qaLab.runEvidence).toBeHidden();
});

test("[PF-QA-006] filters unsafe links from recent CI history @regression", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, { ...successfulFeed, history: [successfulFeed.history[0],
    { runNumber: 99, status: "cancelled", actionsUrl: "https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/runs/99" },
    { runNumber: 98, status: "failure", actionsUrl: "https://example.com/not-github" },
    { runNumber: 97, status: "success", actionsUrl: null },
  ] });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await qaLab.expandHistory();
  await expect(qaLab.history.getByRole("listitem")).toHaveCount(1);
  await expect(qaLab.history.getByRole("link")).toHaveAttribute("href", /9001$/);
});

test("[PF-QA-007] colors statuses and metric values by semantic outcome @regression", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, mixedStatusFeed);
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.failed).toHaveCSS("color", "rgb(255, 187, 175)");
  await expect(qaLab.caseRow("PF-QA-011").locator(".qa-case-status")).toHaveText("Passed");
  await expect(qaLab.caseRow("PF-QA-012").locator(".qa-case-status")).toHaveText("Failed");
  await expect(qaLab.caseRow("PF-QA-013").locator(".qa-case-status")).toHaveText("Skipped");
  await expect(qaLab.caseRow("PF-QA-014").locator(".qa-case-status")).toHaveText("Flaky");
  await expect(qaLab.caseRow("PF-QA-011").locator(".qa-case-status")).toHaveCSS("color", "rgb(183, 228, 199)");
  await expect(qaLab.caseRow("PF-QA-012").locator(".qa-case-status")).toHaveCSS("color", "rgb(255, 187, 175)");
  await expect(qaLab.caseRow("PF-QA-013").locator(".qa-case-status")).toHaveCSS("color", "rgb(213, 215, 207)");
  await expect(qaLab.caseRow("PF-QA-014").locator(".qa-case-status")).toHaveCSS("color", "rgb(255, 224, 138)");
});

test("[PF-QA-008] renders long markup-like titles as text and fits mobile @regression", async ({ portfolio, page, qaLab }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const longTitle = "<img src=x onerror=alert(1)> " + "long case title ".repeat(15);
  const cases = Array.from({ length: 32 }, (_, index) => ({
    caseId: `PF-UI-${String(index + 1).padStart(3, "0")}`,
    title: index === 0 ? longTitle : `responsive test case ${index + 1}`,
    status: "passed", durationMs: 300 + index,
  }));
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, passed: 32, total: 32, cases } });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(32);
  await expect(qaLab.caseRow("PF-UI-001")).toContainText(longTitle.slice(0, 180));
  await expect(qaLab.caseList.locator("img")).toHaveCount(0);
  const { viewportWidth, documentWidth } = await page.evaluate(() => ({ viewportWidth: document.documentElement.clientWidth, documentWidth: document.documentElement.scrollWidth }));
  expect(documentWidth).toBeLessThanOrEqual(viewportWidth + 1);
});

test("[PF-QA-009] shows no sample rows when published cases are unavailable @regression", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, cases: [] } });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(0);
  await expect(qaLab.caseList).toHaveAttribute("tabindex", "-1");
  await expect(qaLab.caseEmpty).toHaveText("No case details are included in this published run.");
});

test("[PF-QA-010] rejects malformed and control-only titles while rendering accepted titles as text @regression", async ({ portfolio, page, qaLab }) => {
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, cases: [
    { caseId: "<img>", title: "<script>alert(1)</script>", status: "running", durationMs: -4 },
    { caseId: "PF-QA-010-BLANK", title: "\u0001\u0002", status: "passed", durationMs: 1 },
    { caseId: "PF-QA-010", title: "<b>safe text</b>", status: "passed", durationMs: 5 },
  ] } });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(1);
  await expect(qaLab.caseCount).toHaveText("1 test case");
  await expect(qaLab.caseRow("PF-QA-010")).toContainText("<b>safe text</b>");
  await expect(qaLab.caseList.locator("script, b, img")).toHaveCount(0);
});
test("[PF-QA-011] reports the rendered count when published cases were truncated @regression", async ({ portfolio, page, qaLab }) => {
  const cases = Array.from({ length: 100 }, (_, index) => ({
    caseId: `PF-LIMIT-${String(index + 1).padStart(3, "0")}`,
    title: `published test case ${index + 1}`,
    status: index < 2 ? "unknown" : "passed",
    durationMs: 100,
  }));
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, passed: 101, total: 101, cases, casesTruncated: true } });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(98);
  await expect(qaLab.caseCount).toHaveText("Showing 98 cases · more were omitted.");
  await portfolio.language.option("es").click();
  await expect(qaLab.caseCount).toHaveText("Se muestran 98 casos · se omitieron más.");
});

test("[PF-QA-012] limits oversized case feeds and supports keyboard scrolling @regression", async ({ portfolio, page, qaLab }) => {
  const cases = Array.from({ length: 101 }, (_, index) => ({
    caseId: `PF-LIMIT-${String(index + 1).padStart(3, "0")}`,
    title: `published test case ${index + 1}`,
    status: "passed",
    durationMs: 100,
  }));
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, passed: 101, total: 101, cases } });
  await qaLab.reload();
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(100);
  await expect(qaLab.caseCount).toHaveText("Showing 100 cases · more were omitted.");
  await expect(qaLab.caseList).toHaveAttribute("tabindex", "0");
  await qaLab.caseList.focus();
  await expect(qaLab.caseList).toHaveCSS("outline-width", "3px");
  expect(await qaLab.scrollCasesToEndWithKeyboard()).toBeGreaterThan(0);
});
test("[PF-QA-013] restores keyboard access after viewport reflow makes the case list scrollable @regression", async ({ portfolio, page, qaLab }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const cases = Array.from({ length: 4 }, (_, index) => ({
    caseId: "PF-REFLOW-" + String(index + 1).padStart(3, "0"),
    title: "responsive case detail ".repeat(5),
    status: "passed",
    durationMs: 100,
  }));
  await publishFeed(page, { ...successfulFeed, latestRun: { ...successfulFeed.latestRun, passed: 4, total: 4, cases } });
  await qaLab.reload();
  await page.evaluate(() => document.fonts.ready);
  await qaLab.expandRunDetails();
  await expect(qaLab.caseList.getByRole("listitem")).toHaveCount(4);
  await expect(qaLab.caseList).toHaveAttribute("tabindex", "-1");
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(qaLab.caseList).toHaveAttribute("tabindex", "0");
  await qaLab.caseList.focus();
  await expect(qaLab.caseList).toHaveCSS("outline-width", "3px");
  expect(await qaLab.scrollCasesToEndWithKeyboard()).toBeGreaterThan(0);
});
