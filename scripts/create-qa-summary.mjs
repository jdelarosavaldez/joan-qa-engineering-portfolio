import { readFile, mkdir, writeFile } from "node:fs/promises";

const reportPath = "test-results/playwright-results.json";
const outputPath = "qa-summary/qa-summary.json";
const runId = process.env.QA_RUN_ID;
const runNumber = Number(process.env.QA_RUN_NUMBER);
const actionsUrl = process.env.QA_ACTIONS_URL;
const commit = process.env.QA_COMMIT?.slice(0, 7);
const completedAt = new Date().toISOString();
const workflowResult = process.env.QA_WORKFLOW_RESULT === "success" ? "success" : "failure";

let report;
try {
  report = JSON.parse(await readFile(reportPath, "utf8"));
} catch {
  report = null;
}

const stats = report?.stats;
const values = stats && ["expected", "unexpected", "skipped", "flaky", "duration"].every((key) => Number.isFinite(stats[key]));
const passed = values ? stats.expected : null;
const failed = values ? stats.unexpected : null;
const skipped = values ? stats.skipped : null;
const flaky = values ? stats.flaky : null;
const total = values ? passed + failed + skipped + flaky : null;

function collectCases(suites, output = []) {
  if (!Array.isArray(suites)) return output;
  for (const suite of suites) {
    for (const spec of suite?.specs || []) {
      const rawTitle = typeof spec?.title === "string" ? spec.title : "";
      for (const test of spec?.tests || []) {
        const results = Array.isArray(test?.results) ? test.results : [];
        const outcome = test?.status;
        const status = outcome === "expected" ? "passed"
          : outcome === "flaky" ? "flaky"
          : outcome === "skipped" ? "skipped"
          : outcome === "unexpected" ? "failed"
          : results.at(-1)?.status === "skipped" ? "skipped"
          : results.at(-1)?.status === "passed" && results.slice(0, -1).some((result) => result.status !== "passed") ? "flaky"
          : results.at(-1)?.status === "passed" ? "passed" : "failed";
        const cleanTitle = rawTitle.replace(/\s+@(?:smoke|regression)\b/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
        if (!cleanTitle) continue;
        const idMatch = cleanTitle.match(/^\[([A-Z0-9]+(?:-[A-Z0-9]+){2,})\]\s*/);
        const title = cleanTitle.replace(/^\[[A-Z0-9]+(?:-[A-Z0-9]+){2,}\]\s*/, "").trim();
        const durationMs = results.reduce((totalMs, result) =>
          totalMs + (Number.isFinite(result?.duration) && result.duration >= 0 ? result.duration : 0), 0);
        output.push({ caseId: idMatch?.[1] || null, title: title || cleanTitle, status, durationMs: Math.round(durationMs) });
      }
    }
    collectCases(suite?.suites, output);
  }
  return output;
}

const allCases = collectCases(report?.suites);
const cases = allCases.slice(0, 100);
const casesTruncated = allCases.length > cases.length;

const summary = {
  schemaVersion: 2,
  latestRun: {
    runId,
    runNumber: Number.isFinite(runNumber) ? runNumber : null,
    status: workflowResult,
    completedAt,
    commit: commit || null,
    passed,
    failed,
    skipped,
    flaky,
    total,
    durationMs: values ? stats.duration : null,
    actionsUrl,
    cases,
    casesTruncated,
  },
};

await mkdir("qa-summary", { recursive: true });
await writeFile(outputPath, JSON.stringify(summary, null, 2) + "\n", "utf8");
