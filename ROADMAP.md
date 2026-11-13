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
- [x] Define the review workflow: short-lived development branch → draft PR to `main` → Claude review → Joan approval → merge.
- [ ] Review one small wireframe and the design tokens before implementation.

## Milestone 1 — Portfolio site

- [ ] Agree the site's language, content, visual identity, résumé/contact treatment, and wireframe.
- [ ] Ask Claude to review the bio, wireframe, and visual proposal; record findings and Joan's decisions before implementation.
- [ ] Keep implementation on a task branch and present each reviewable slice in a draft PR to `main`.
- [ ] Implement the portfolio site structure and confirmed content first; keep project results and testing out of this slice.
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
