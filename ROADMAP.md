# Technical roadmap

This portfolio grows through independently runnable milestones. A project moves to the public site only after setup, execution, and its reported evidence have been reviewed.

## Milestone 0 — Design and repository foundation

- [x] Record portfolio direction and implementation boundaries.
- [x] Draft public-facing README and this roadmap.
- [x] Decide language: English by default with an `ES` control for equivalent Spanish content.
- [x] Add Claude as a manual reviewer and Claude Design as a design exploration tool; Joan reviews and approves proposed changes.
- [ ] Confirm résumé format, visual system, first artifact/case, and launch scope.
- [ ] Verify Astro/template versions, license, runtime requirements, and GitHub Pages setup using primary sources.
- [x] Establish the exact GitHub repository and remote before setting the Pages URL/base.
- [x] Merge the review workflow: Joan owns decisions and merges; Codex implements each authorized slice on a short-lived branch, keeps the PR in draft while work is in progress, and marks it ready for review; Claude reviews and comments when the GitHub integration is active.
- [ ] Review the first homepage view and refine the visual system before expanding beyond this slice.

## Milestone 1 — Portfolio site

- [x] Agree the site's language: English by default, with a visible switch to equivalent Spanish content.
- [ ] Review the concise bio and visual proposal with Claude; record Joan's accepted decisions before expanding the site.
- [x] Keep implementation on a task branch and prepare the first reviewable homepage slice for `main`; Joan merges after review.
- [x] Implement the initial responsive portfolio view and confirmed introductory content; keep project results and testing out of this slice.
- [ ] Review the rendered site at mobile and desktop before expanding it.
- [ ] Publish only after the site content, repository visibility, and privacy have been reviewed.

## Milestone 2 — QA Lab: test the portfolio

- [ ] Add Playwright + TypeScript checks for approved behavior, keyboard/focus, reduced motion, 375 px and desktop layouts, and overflow.
- [ ] Save screenshots and link actual execution evidence; show QA Lab status as pending until CI produces a real result.
- [ ] Add the smallest necessary GitHub Actions build/test workflow after local verification.

## Milestone 3 — UI and API practice case study

- [ ] Choose a practice app and confirm its usage constraints; prefer a local/self-hostable target where stability matters.
- [ ] Define risk-based scenarios, test data, state cleanup, and API/UI boundaries.
- [ ] Implement positive, negative, edge, and regression checks.
- [ ] Include architecture notes, diagrams, reports, screenshots where useful, and known limitations.
- [ ] Keep tests safe for shared demos; no load testing against public practice sites.

## Milestone 4 — Python and Pytest API testing

- [ ] Create a distinct Python project with pinned/reproducible dependencies.
- [ ] Validate response codes, schema/contracts, business rules, invalid input, and boundary cases.
- [ ] Add fixtures and data isolation, plus readable reports and CI execution.

## Milestone 5 — Docker Compose integration environment

- [ ] Compose a local application/API and its dependencies or controlled test doubles.
- [ ] Provide health checks, deterministic seed data, startup/teardown, and documented ports.
- [ ] Run integration checks in CI without external credentials.

## Milestone 6 — Performance and reliability

- [ ] Modernize `artillery-base` as a private source for a clean, reusable template.
- [ ] Use a local mock/demo service by default and require explicit target configuration.
- [ ] Document workload model, thresholds, safe limits, and report interpretation.
- [ ] Add distributed-system scenarios for retries, timeouts, idempotency, and partial failure.

## Milestone 7 — LLM quality evaluation

- [ ] Define an evaluation task, dataset provenance, rubric, and measurable baselines.
- [ ] Cover expected behavior, refusal/safety behavior, robustness, and adversarial inputs.
- [ ] Track model/version changes and report uncertainty and limitations.
- [ ] Exclude private user data and employer material.

## Milestone 8 — Mobile automation (optional)

- [ ] Select a maintained public sample app and document emulator/device requirements.
- [ ] Add a small Appium suite with stable test data and CI guidance.
- [ ] Include platform limitations and execution evidence.

## Completion standard

Every project must have a clear purpose, architecture/test strategy, reproducible setup, executable commands, representative scenarios, verifiable results, known limitations, and a privacy review before it is featured publicly.
