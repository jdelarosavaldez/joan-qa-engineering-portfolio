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

const summary = {
  schemaVersion: 1,
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
  },
};

await mkdir("qa-summary", { recursive: true });
await writeFile(outputPath, JSON.stringify(summary, null, 2) + "\n", "utf8");
