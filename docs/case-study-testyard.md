# UI + API practice case study

## Status

**In progress — setup only.** The local TestYard runtime and automated checks have not yet been validated. The portfolio must not show invented test results or counts.

## Project

[Open the separate practice repository](https://github.com/jdelarosavaldez/qa-practice-testyard). It will include a local copy of the TestYard practice application and the automation suite, so core checks do not rely on a public demo being available.

## Approach

- **Target:** TestYard, pending a local preflight of startup, health, restart, sandbox isolation, and accessible UI locators.
- **Automation:** Playwright + TypeScript with Page Object Model (POM).
- **Scenario notes:** Gherkin `.feature` files document the scenarios only. They are not run with Cucumber and do not claim a BDD implementation.
- **CI:** Docker Compose will start the local app and execute the checks in GitHub Actions.
- **Dashboard:** after real runs exist, publish a sanitized summary and direct run links in the portfolio QA Lab.

## Draft scenarios

The initial scenario notes cover adding a product to a cart and checking API sandbox isolation. They remain drafts until the local app confirms the exact flows, labels, API contract, and reset behavior.

## Evidence

No checks have run yet. The first published status, metrics, screenshots, and report links must come from actual CI execution. Known constraints, including the API sandbox's in-memory lifetime, will be documented with the results.
