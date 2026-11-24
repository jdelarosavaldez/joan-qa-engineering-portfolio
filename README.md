# Joan De la Rosa — QA Engineering Portfolio

**QA Engineer | SDET | Quality Engineering**

The public site opens in English and provides a visible `ES` control for equivalent Spanish content.

This repository contains a bilingual portfolio site and small, executable quality-engineering projects. The goal is to show how I approach risk, design tests, automate checks, investigate failures, and communicate evidence—not only list tools.

> **Project status:** the bilingual portfolio is published at [jdelarosavaldez.github.io/joan-qa-engineering-portfolio](https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/). GitHub Actions packages and deploys the static site from `main`.

## Run the website locally

The website is static HTML, CSS, and JavaScript. From the repository root, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Python is only the local file server; it does not implement the website. Stop it with `Ctrl+C`.

## Run the portfolio QA checks

The portfolio's browser checks use Playwright and TypeScript with page objects, fixtures, centralized bilingual test data, stable case IDs, and a traceable [test plan](docs/test-plan.md). An axe scan checks the full page in English and Spanish. The framework runs the static site with the Python preview server; it does not add a build framework to the website.

**Requirements:** Node.js 22.12 or newer, npm, and Python 3. GitHub Actions uses Node.js 24.

```sh
npm ci
npx playwright install chromium
npm run qa:check
npm run qa:test
```

Playwright starts the local preview server automatically during `qa:test`. The suite checks the page title and main content, English/Spanish switching, keyboard navigation and station controls, reduced-motion behavior, WCAG-tagged axe results, horizontal overflow, and section overlap at 375 × 812, 1440 × 900, and 1920 × 1080. At 1920 px it also checks Strategy's alignment and clearance from the start circle. Test titles use case IDs such as `[PF-HOME-001]` and `@smoke` / `@regression` tags; the plan maps each ID to its acceptance criteria. It saves full-page screenshots with each viewport's test output.

Page objects in `tests/pages/` keep selectors and interactions close to the page they represent. Specs use accessible roles and labels through those objects; expected bilingual UI text lives in `tests/data/test-data.ts`, and the shared fixture in `tests/fixtures/` opens the portfolio consistently.

To open the HTML report after a run:

```sh
npm run qa:report
```

GitHub Actions runs type checks and browser tests for pull requests to `main` and pushes to `main`. Each run uploads the HTML report, screenshots, and failure artifacts for 14 days. See [Portfolio quality workflow](https://github.com/jdelarosavaldez/joan-qa-engineering-portfolio/actions/workflows/portfolio-quality.yml) for the latest real result; no sample CI status is displayed as live data.

## QA Lab and project pipeline

The homepage includes a bilingual QA Lab with the latest real Playwright run, pass/fail/skip counts, a recent-run outcome chart, and links to the test plan and CI source files. The result feed is generated during the GitHub Pages deployment from the completed Actions run; it exposes only an allowlisted summary, short commit, and public run links. The site shows Pending when no completed result is published. Workflow history is fetched during deployment and packaged as a static feed, so visitors' browsers do not call the GitHub API. Starting a run opens GitHub Actions and requires an authenticated account with repository write access; credentials are never placed in browser code.

The homepage also links to the active QA Lab files and labels the UI/API case study and Python/Pytest project as Planned until their repositories exist.

## Portfolio map

- **Website:** static HTML/CSS/JavaScript with bilingual content and self-hosted fonts.
- **QA Lab:** Playwright + TypeScript checks for this portfolio, with real GitHub Actions reports and screenshot evidence.
- **UI and API case study:** a clean-room project using a public practice application, with positive, negative, edge, and regression coverage.
- **Python and Pytest:** a separately runnable API or integration-testing project.
- **Docker and CI:** reproducible local dependencies and quality gates.
- **Advanced work:** distributed-system reliability scenarios and LLM evaluation/adversarial tests, added only when each has a clear, executable scope.

Each published case study will include its goal, risks, test strategy, architecture, setup, commands, expected results, actual evidence, and limitations.

## Glossary

- **Evidence:** a reviewable artifact that supports a test result, such as a report excerpt, trace, screenshot, or CI run. It must come from an actual execution.
- **QA Lab:** the portfolio's own test area. Its status is supported by the latest real workflow run and linked CI evidence.

## Engineering principles

- Keep projects small, isolated, and reproducible.
- Include positive, negative, edge-case, and regression scenarios where they make sense.
- Prefer accessible locators and observable behavior over brittle implementation details.
- Store no credentials, employer code, company data, private URLs, or copied assessment material in this public portfolio.
- Report only test results that can be reproduced from the repository or linked CI run.
- Explain external-service dependencies and known limitations.

## Review workflow

We work one small, reviewable slice at a time on a short-lived branch. Codex prepares changes at Joan's direction and opens a draft pull request to `main`; Codex marks it ready when the slice is reviewable. Claude reviews and may comment on the PR or the related Trello card when its connection allows. If it cannot comment there, Codex relays its findings with Claude clearly credited. Joan decides which findings to accept and performs the merge. `main` remains the reviewed project baseline.

Project roles and attribution rules are defined in [DESIGN.md](DESIGN.md#project-roles). Claude Design can explore visual directions and prototypes before implementation; its output is a proposal for review. Do not commit a raw CV, personal contact details, confidential employer material, private URLs, credentials, or other private data to any branch of this public repository.

## Deployment status

The GitHub Pages workflow and setup details are in [docs/deployment.md](docs/deployment.md). The live site is [https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/](https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/). Deployment runs from `main`; pull requests package the static site but do not deploy it.

## Current limitations

- The Claude Reviewer GitHub App is installed only on this repository. The [review workflow](.github/workflows/claude-review.yml) reviews diffs from public, same-repository PRs and posts an App-authored comment when its Actions credentials are configured; see [Claude Reviewer setup](docs/claude-reviewer-setup.md).
- The site remains a static page; Astro and the earlier starter proposal are paused.
- CV delivery format, public contact details, and custom domain are not included or configured.
- The initial practice target and starter-template license still need validation before implementation.

## Project documents

- [Design proposal](DESIGN.md)
- [Technical roadmap](ROADMAP.md)
- [GitHub Pages deployment](docs/deployment.md)

