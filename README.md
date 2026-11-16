# Joan De la Rosa — QA Engineering Portfolio

**QA Engineer | SDET | Quality Engineering**

The public site will open in English and provide a visible `ES` control for the equivalent Spanish version.

This repository will contain a public portfolio site and small, executable quality-engineering projects. The goal is to show how I approach risk, design tests, automate checks, investigate failures, and communicate evidence—not only list tools.

> **Project status:** design review. This repository currently contains planning documents only; there is no app scaffold or deployment. See [DESIGN.md](DESIGN.md) for open decisions and acceptance criteria.

## Portfolio map

- **Website and QA Lab:** planned portfolio site. The framework and template are not selected yet; any CI status must come from a real run.
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

We work one small, reviewable slice at a time. Claude is used as an independent reviewer for copy, design proposals, code changes, and documentation. Claude Design can help explore visual directions and prototypes before implementation. Joan reviews suggestions and approves each decision; no generated design is treated as final by default. Handoffs are manual: Claude is not automatically connected to this repository or Trello. Do not share confidential employer material, private URLs, credentials, or personal data with external AI tools.

## Current limitations

- The site and automation framework are not implemented yet.
- Framework, starter, exact runtime requirements, and setup commands remain unverified and will be chosen before a package manifest is written.
- The public GitHub repository is created and connected to this local repository. It will contain planning documents only until the site design is approved; the Pages path is not configured yet.
- No résumé, biography, employment dates, project metrics, or public contact details are included until reviewed with Joan.
- The initial practice target and starter-template license still need validation before implementation.

## Project documents

- [Design proposal](DESIGN.md)
- [Technical roadmap](ROADMAP.md)
