import { mkdir, readFile, writeFile } from "node:fs/promises";

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const currentRunId = String(process.env.QA_WORKFLOW_RUN_ID || "");
const summaryPath = "qa-artifacts/qa-summary/qa-summary.json";
if (!repository || !token || !currentRunId) throw new Error("Missing required workflow context.");

let summary = null;
try {
  const candidate = JSON.parse(await readFile(summaryPath, "utf8"));
  if (String(candidate?.latestRun?.runId) === currentRunId) summary = candidate.latestRun;
} catch {
  // The workflow may fail before generating a summary artifact; the run metadata still gives a truthful failure state.
}

let history = [];
try {
  const response = await fetch(`https://api.github.com/repos/${repository}/actions/workflows/portfolio-quality.yml/runs?branch=main&status=completed&per_page=20`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) throw new Error(`GitHub Actions history request returned HTTP ${response.status}.`);
  const result = await response.json();
  const allowedEvents = new Set(["push", "workflow_dispatch"]);
  history = (result.workflow_runs || [])
    .filter((run) => run.head_branch === "main" && allowedEvents.has(run.event) && ["success", "failure"].includes(run.conclusion))
    .slice(0, 10)
    .map((run) => ({
      runId: String(run.id),
      runNumber: Number(run.run_number),
      status: run.conclusion,
      completedAt: run.updated_at,
      durationMs: run.run_started_at ? Math.max(0, Date.parse(run.updated_at) - Date.parse(run.run_started_at)) : null,
      commit: String(run.head_sha || "").slice(0, 7) || null,
      actionsUrl: run.html_url,
    }));
} catch {
  // Preserve the static site deploy even if the optional history request is unavailable.
}

const conclusion = process.env.QA_WORKFLOW_CONCLUSION;
const safeCount = (value) => Number.isInteger(value) && value >= 0 ? value : null;
const currentEvent = ["success", "failure"].includes(conclusion) ? {
  runId: currentRunId,
  runNumber: Number(process.env.QA_WORKFLOW_RUN_NUMBER) || null,
  status: conclusion,
  completedAt: process.env.QA_WORKFLOW_COMPLETED_AT || new Date().toISOString(),
  commit: String(process.env.QA_WORKFLOW_SHA || "").slice(0, 7) || null,
  passed: safeCount(summary?.passed),
  failed: safeCount(summary?.failed),
  skipped: safeCount(summary?.skipped),
  flaky: safeCount(summary?.flaky),
  total: safeCount(summary?.total),
  durationMs: Number.isFinite(summary?.durationMs) && summary.durationMs >= 0 ? summary.durationMs : null,
  actionsUrl: process.env.QA_WORKFLOW_URL,
} : null;
const previousRuns = history.filter((run) => run.runId !== currentRunId);
const withCurrent = currentEvent ? [currentEvent, ...previousRuns].slice(0, 10) : previousRuns.slice(0, 10);
const latestRun = currentEvent || withCurrent[0] || null;
const output = { schemaVersion: 1, latestRun, history: withCurrent };

await mkdir("dist/data", { recursive: true });
await writeFile("dist/data/qa-lab-results.json", JSON.stringify(output, null, 2) + "\n", "utf8");
