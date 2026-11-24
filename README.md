# Joan De la Rosa — QA Engineering Portfolio

**QA Engineer | SDET | Quality Engineering**

The public site opens in English and provides a visible `ES` control for equivalent Spanish content.

This repository contains a bilingual portfolio site and small, executable quality-engineering projects. The goal is to show how I approach risk, design tests, automate checks, investigate failures, and communicate evidence—not only list tools.

> **Project status:** the bilingual homepage and About section are in `main`. The site is not live until GitHub Pages is enabled and a deployment run succeeds.

## Run the website locally

The website is static HTML, CSS, and JavaScript. From the repository root, run this local preview server:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/). Python is only the local file server; it does not implement the website. Stop it with `Ctrl+C`.

## Portfolio map

- **Website:** static HTML/CSS/JavaScript with bilingual content and self-hosted fonts.
- **QA Lab:** planned Playwright + TypeScript checks for the portfolio. Status stays pending until real CI checks run.
- **UI and API case study:** a clean-room project using a public practice application, with positive, negative, edge, and regression coverage.
- **Python and Pytest:** a separately runnable API or integration-testing project.
- **Docker and CI:** reproducible local dependencies and quality gates.
- **Advanced work:** distributed-system reliability scenarios and LLM evaluation/adversarial tests, added only when each has a clear, executable scope.

Each published case study will include its goal, risks, test strategy, architecture, setup, commands, expected results, actual evidence, and limitations.

## Glossary

- **Evidence:** a reviewable artifact that supports a test result, such as a report excerpt, trace, screenshot, or CI run. It must come from an actual execution.
- **QA Lab:** the portfolio's own test area. Its status remains pending until its checks have run; any later status links to the corresponding real CI evidence.

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

The GitHub Pages workflow and first-time setup are documented in [docs/deployment.md](docs/deployment.md). The expected project URL is [https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/](https://jdelarosavaldez.github.io/joan-qa-engineering-portfolio/). It becomes live only after the repository's Pages source is set to GitHub Actions, the deployment PR is merged, and its workflow succeeds.

## Current limitations

- The Claude Reviewer GitHub App is installed only on this repository. The [review workflow](.github/workflows/claude-review.yml) reviews diffs from public, same-repository PRs and posts an App-authored comment when its Actions credentials are configured; see [Claude Reviewer setup](docs/claude-reviewer-setup.md).
- The site currently has no build tool or automated browser checks.
- Astro and the earlier starter proposal are paused; the current site has no package manifest or third-party runtime dependencies.
- CV delivery format, public contact details, and custom domain are not included or configured.
- The initial practice target and starter-template license still need validation before implementation.

## Project documents

- [Design proposal](DESIGN.md)
- [Technical roadmap](ROADMAP.md)
- [GitHub Pages deployment](docs/deployment.md)
