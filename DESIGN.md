# Portfolio site design proposal

**Status:** first homepage slice implemented on a review branch; no deployment yet. Work will proceed one reviewable slice at a time.

## Product direction

Build a public QA Engineering portfolio as a static website intended for GitHub Pages. The site itself should demonstrate quality engineering: accessible UI, clear evidence, executable checks, reproducible CI, and honest limitations. The GitHub repository name and remote must be established before configuring the Pages URL or Astro `base` path.

**Language:** English is the default. A visible `ES` control near the top switches to a complete Spanish version with equivalent content; do not show both languages side by side.

**Positioning:** QA Engineer | SDET | Quality Engineering

Use Alice Paggi's portfolio as a reference for information hierarchy and polish, not as a visual template. Do not reuse her copy or assets. The portfolio's identity should come from real QA work: execution report excerpts, traces, scenario tables, and request/response flows when those artifacts exist. Do not use generic QA symbols as decoration. Any visual must explain a real test, artifact, or result.

## Recommended experience

- Start with one small, reviewable slice: the home page and Joan-approved introduction. Complete and review the site before adding the QA Lab, test artifacts, or separate projects.
- The first view contains a brief bilingual biography, English by default, and a transparent note that case studies and execution evidence will be added as they are built and reviewed.
- The initial view uses static HTML, CSS, and JavaScript without external dependencies. We are refining this view before deciding whether a framework adds value.
- A short profile and grouped skills must be grounded in confirmed experience rather than a keyword wall.
- The "QA Lab" must say **pending** until checks have run. Once it reports status, that status and linked evidence must come from a real CI run.
- Each case study explains its goal, quality risks, strategy, architecture, executable checks, CI evidence, results, and limitations.
- Do not invent personal history, résumé details, metrics, or test outcomes.

Keep navigation direct and the page readable on narrow screens. Do not rely on color alone for test states.

## Visual direction for this slice

- Lead with Joan's full name, a readable role line, and the approved biography. Keep the `JD.` mark in the header as a compact signature.
- Use the existing warm paper, dark ink, and cobalt palette. Cobalt highlights links, actions, and the brand mark; any future QA state colors must have a separate meaning.
- Keep the display serif and sans-serif body pairing for this review. Check the visual result on mobile and desktop before adding more visual systems.
- Let future real reports and evidence define the composition of project pages; avoid generic QA icons and fabricated dashboards.
- Avoid fabricated reports, metrics, status indicators, ornamental dashboards, and placeholder test data that could be mistaken for Joan's work.
- The Impeccable and Make Interfaces Feel Better skills guide this typography and detail pass. Transitions.dev and GSAP skills are available for later interactions that genuinely need motion; skills do not add site runtime dependencies.

## Collaboration and review

- Keep `main` as the reviewed project baseline. The planning baseline was committed before this review workflow was adopted; all subsequent changes go on short-lived branches such as `feature/portfolio-home` or `docs/portfolio-copy`.
- Follow the responsibilities in [Project roles](#project-roles). Work one small, reviewable slice at a time on a short-lived branch, keeping a PR in draft while work is in progress. Codex marks it ready when the slice is reviewable; Joan decides which findings to accept and performs the merge.
- Claude may review and comment on the public PR or related Trello card when its connected tools allow. Claude does not edit files, create commits, push branches, or merge. If direct comments are unavailable, Codex relays Claude's findings and credits Claude clearly. Resolve accepted findings on the same branch.
- Current GitHub and Trello activity uses the account authenticated by each connector; role labels in comment text describe responsibility and do not create a separate verified agent identity. Dedicated GitHub App identities have not been configured. Branch protection is not configured yet; the no-direct-commit rule is currently a team convention.
- Use Claude Design to explore and refine visual directions or prototypes before implementation. Treat its output as a proposal to review, not approved product design. Bring the selected mockup/prototype and its decisions back into this repository before coding.
- Keep a short record of accepted design decisions and review findings in the project documents or the relevant Trello card. Do not send confidential employer code, private URLs, credentials, or data to external AI tools.
- Never commit a raw CV, personal contact details, or other private information to any branch or PR in this public repository. Keep the source CV in private storage and add only copy Joan has approved for publication.

## Project roles

- **Joan — Project Owner:** sets priorities, approves public content and design decisions, accepts or declines review findings, and performs the final merge.
- **Claude — Reviewer & Design Advisor:** independently reviews the proposed slice and gives design feedback when requested. Claude may leave comments on the PR or Trello card when connected tools permit; it does not edit project files, commit, push, or merge.
- **Codex — QA Engineer & Implementer:** implements the slice Joan authorized, explains material technical choices, prepares the branch and PR, and addresses findings Joan accepts. Codex does not approve or merge its own changes.

These are project responsibilities, not GitHub permission roles or verified account identities. Until separate agent identities are configured, GitHub and Trello show the account used by the connected integration. When a comment is relayed, label it as Claude's review relayed by Codex; do not present a role label as proof of a separate account.

## Accessibility and visual acceptance

- Normal text meets WCAG AA contrast (at least 4.5:1); large text and non-text UI contrast are checked against their applicable thresholds.
- Every interactive element has a visible keyboard focus state.
- A skip link reaches the main content; all navigation and controls work by keyboard.
- `prefers-reduced-motion` behavior is implemented and exercised in a browser check.
- Responsive behavior is checked at 375 px and desktop widths, with screenshots retained as review evidence.
- A browser check detects horizontal overflow; screenshots and visual review cover meaningful layout differences.

## Technology and hosting

- The current site remains static HTML, CSS, and JavaScript while its visual direction is reviewed. Astro and the earlier starter proposal are paused, not part of this slice.
- GitHub Pages deployment through GitHub Actions remains the hosting direction; no workflow or `base` path is approved yet.
- Playwright + TypeScript is the planned browser check. Browser and test commands are not yet locked.
- No server, database, analytics, or secrets are planned for the first release.

## Proposed repository shape

```text
.
├── README.md
├── ROADMAP.md
├── DESIGN.md
├── index.html
├── styles.css
├── script.js
├── tests/e2e/            # Playwright checks for the portfolio
└── .github/workflows/    # build, browser checks, Pages deployment
```

## Next reviewable slices

1. Review the first homepage and biography; record accepted changes in the PR and Trello.
2. Decide whether this static view needs a framework after the homepage design is approved.
3. Confirm the GitHub Pages URL and configuration before setting a deployment workflow.
4. After the homepage is reviewed, add the portfolio's own QA checks, then add separate projects and their tests one by one.

## Decisions for review

1. **Audience and language:** resolved — English by default, with a visible switch to the equivalent Spanish version.
2. **Résumé:** choose web résumé, PDF, both, or defer until current content is supplied. Deferred for this slice.
3. **Visual system:** this first view uses a warm paper background, cobalt action color, native `system-ui` body text, a serif display face, and a `JD.` brand mark. Review the result before expanding the site.
4. **First artifact/case:** choose what real test artifact or clean-room case to build and feature first.
5. **Release scope:** choose the smallest public launch slice; keep all unverified CI and project states marked pending.

## Boundaries

- Keep company and assessment repositories private; do not copy their code, selectors, scenarios, URLs, screenshots, or data into this site.
- Do not expose secrets or personal contact details before review.
- The Claude Reviewer workflow is a narrow exception to the external-AI boundary: while this repository is public, it sends only the PR diff to Anthropic's Messages API for review. Never include confidential employer material, private URLs, credentials, personal data, or unapproved CV content in a PR. The workflow skips reviews if the repository is private.
- Public demo sites are not load-test targets. Keep load testing on a local or explicitly approved environment.
- The site is a portfolio and evidence index, not a claim that every listed technology has production experience.
