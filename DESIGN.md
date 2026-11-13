# Portfolio site design proposal

**Status:** design review in progress. The public GitHub repository contains planning documents only; there is no application scaffold or deployment. Work will proceed one reviewable slice at a time.

## Product direction

Build a public QA Engineering portfolio as a static website intended for GitHub Pages. The site itself should demonstrate quality engineering: accessible UI, clear evidence, executable checks, reproducible CI, and honest limitations. The GitHub repository name and remote must be established before configuring the Pages URL or Astro `base` path.

**Language:** English is the default. A visible `ES` control near the top switches to a complete Spanish version with equivalent content; do not show both languages side by side.

**Positioning:** QA Engineer | SDET | Quality Engineering

Use Alice Paggi's portfolio as a reference for information hierarchy and polish, not as a visual template. Do not reuse her copy or assets. The portfolio's identity should come from real QA work: execution report excerpts, traces, scenario tables, and request/response flows when those artifacts exist. Do not use generic QA symbols as decoration. Any visual must explain a real test, artifact, or result.

## Recommended experience

- Start with one small, reviewable slice: a home page and one real test artifact. Add profile, résumé, contact, and more case studies only after content and launch scope are agreed.
- A short profile and grouped skills must be grounded in confirmed experience rather than a keyword wall.
- The "QA Lab" must say **pending** until checks have run. Once it reports status, that status and linked evidence must come from a real CI run.
- Each case study explains its goal, quality risks, strategy, architecture, executable checks, CI evidence, results, and limitations.
- Do not invent personal history, résumé details, metrics, or test outcomes.

Keep navigation direct and the page readable on narrow screens. Do not rely on color alone for test states.

## Visual proposal

- Let report details and real evidence define the page composition; avoid generic editorial portfolio layouts and decorative QA icons.
- If cobalt is selected, reserve it for links and actions. If a warm accent is selected, reserve it for QA states. Confirm the palette and contrast before styling.
- Select a type pairing before implementation. Candidates to compare: IBM Plex Sans + IBM Plex Mono; Atkinson Hyperlegible + IBM Plex Mono; Source Sans 3 + IBM Plex Mono. The final choice and font sources remain open.
- Avoid fabricated reports, metrics, status indicators, ornamental dashboards, and placeholder test data that could be mistaken for Joan's work.

## Collaboration and review

- Keep `main` as the reviewed project baseline. Make each small change on a short-lived branch such as `feature/portfolio-home` or `docs/cv-content`.
- Push the branch and open a draft pull request targeting `main`. Claude reviews that pull request before merge, with concrete findings and severity. Joan reviews the feedback, decides which changes to accept, and approves the merge.
- Resolve review comments and update the same branch; merge only after the requested review is complete.
- Use Claude Design to explore and refine visual directions or prototypes before implementation. Treat its output as a proposal to review, not approved product design. Bring the selected mockup/prototype and its decisions back into this repository before coding.
- Keep a short record of accepted design decisions and review findings in the project documents or the relevant Trello card. Do not send confidential employer code, private URLs, credentials, or data to external AI tools.
- Claude is not connected to this repository or Trello automatically; reviews and design artifacts are handed off manually unless an integration is deliberately configured later.

## Accessibility and visual acceptance

- Normal text meets WCAG AA contrast (at least 4.5:1); large text and non-text UI contrast are checked against their applicable thresholds.
- Every interactive element has a visible keyboard focus state.
- A skip link reaches the main content; all navigation and controls work by keyboard.
- `prefers-reduced-motion` behavior is implemented and exercised in a browser check.
- Responsive behavior is checked at 375 px and desktop widths, with screenshots retained as review evidence.
- A browser check detects horizontal overflow; screenshots and visual review cover meaningful layout differences.

## Technology and hosting

- Astro, TypeScript, the starter template, and exact versions are candidates, not decisions. Verify current package requirements on npm and in Astro's official documentation before writing a manifest.
- Compare the Accessible Astro Starter with a minimal Astro scaffold after checking runtime compatibility, license, and which features are actually needed. The Trello card must match the selected option.
- GitHub Pages deployment through GitHub Actions remains the hosting direction; no workflow or `base` path is approved yet.
- Playwright + TypeScript is the planned browser check. Browser and test commands are not yet locked.
- No server, database, analytics, or secrets are planned for the first release.

## Proposed repository shape

```text
.
├── README.md
├── ROADMAP.md
├── DESIGN.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── public/
├── src/
│   ├── components/       # navigation, evidence labels, QA SVGs
│   ├── content/projects/ # reviewed case studies
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── tests/e2e/            # Playwright checks for the portfolio
└── .github/workflows/    # build, browser checks, Pages deployment
```

## Next reviewable slices

No frontend work starts until the design choices below are answered and the repository target is established.

1. Resolve the content and visual decisions; record them in this file and Trello.
2. Verify the selected framework, starter, license, package versions, Node requirements, and GitHub Pages workflow.
3. [x] Create the public GitHub repository and connect the local remote; only set `site` and `base` after confirming the Pages path.
4. Review the site's information architecture and a small wireframe before coding.
5. Build and review the portfolio site first using only confirmed profile/content; no projects or test suite are required for this slice.
6. After the site is reviewed, add the portfolio's own QA checks, then add separate projects and their tests one by one.

## Decisions for review

1. **Audience and language:** resolved — English by default, with a visible switch to the equivalent Spanish version.
2. **Résumé:** choose web résumé, PDF, both, or defer until current content is supplied.
3. **Visual system:** choose from the typography candidates, then approve the palette and token values with contrast ratios.
4. **First artifact/case:** choose what real test artifact or clean-room case to build and feature first.
5. **Release scope:** choose the smallest public launch slice; keep all unverified CI and project states marked pending.

## Boundaries

- Keep company and assessment repositories private; do not copy their code, selectors, scenarios, URLs, screenshots, or data into this site.
- Do not expose secrets or personal contact details before review.
- Public demo sites are not load-test targets. Keep load testing on a local or explicitly approved environment.
- The site is a portfolio and evidence index, not a claim that every listed technology has production experience.
