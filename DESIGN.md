---
name: Joan QA Engineering Portfolio
description: Bilingual portfolio presenting quality as a workflow.
colors:
  primary: "#ff835e"
  background: "#102b32"
  foreground: "#f7f3e8"
  muted: "#d5d7cf"
typography:
  display: { fontFamily: "Bricolage Grotesque, sans-serif" }
  body: { fontFamily: "Literata, Georgia, serif" }
---

<!-- impeccable:design-map -->
Full spec: `.impeccable/design-full.md`; superseded proposal: `.impeccable/portfolio-planning-archive.md`.

## Overview

**Quality as a visible workflow.** Joan's name leads; four connected QA stations make the process tangible. EN/ES share one hierarchy.

## Colors

Petroleum canvas, warm-bone text/shapes, orange final step/focus. Green is reserved for QA states; muted bone supports secondary text. Never rely on color alone.

## Typography

Bricolage Grotesque display/labels (800/700); Literata bio/descriptions (400). Display line-height `.88`, tracking `-.045em`; body line-height `1.58`.

## Layout

One content width, capped at 1600px. Center the final shape, circle, and two-line label. Mobile ≤760px; tablet 761–1024px.

## Elevation & Depth

Flat, with dividers and subtle dot texture. No shadows.

## Shapes

Rounded QA steps, decision diamond, endpoint circles; restrained control corners and language pill.

## Components

Bilingual flow buttons/notes, circular JD wordmark, EN/ES selector. Visible 3px focus ring, 44px controls, reduced-motion support.

## Do's and Don'ts

Keep translations equivalent. Don't invent experience, metrics, results, reports, or employer material. Avoid generic QA icons and unapproved sections.

## Project collaboration and public-repository boundaries

- **Joan — Project Owner:** sets priorities, approves public content and design decisions, accepts or declines review findings, and performs the final merge.
- **Claude — Reviewer & Design Advisor:** reviews and comments when requested; it does not edit files, commit, push, or merge.
- **Codex — QA Engineer & Implementer:** implements the authorized slice on a short-lived branch, explains material decisions, and prepares reviewable changes. Codex does not approve or merge its own work.
- Role labels describe responsibilities; they do not prove that GitHub or Trello used separate authenticated identities. The connected account remains the recorded author unless the platform shows a dedicated identity.
- Never commit a raw CV, personal contact details, confidential employer material, private URLs, credentials, or unapproved personal information. Do not copy employer or assessment code, selectors, scenarios, screenshots, or data. Publish only content Joan has approved.
- The Claude Reviewer workflow sends the pull request diff to Anthropic's Messages API. Keep confidential or private material out of every pull request, and do not send sensitive employer content to external AI tools.
- Do not commit directly to `main`; keep changes on a short-lived branch for review. Public demo sites are not load-test targets; use only local or explicitly authorized environments.

## External font request

The page self-hosts Bricolage Grotesque and Literata from `assets/fonts/` under the SIL Open Font License 1.1. This avoids third-party font requests from visitor browsers. Keep the font license notices with the redistributed files.

## Accessibility and verification acceptance

- Normal text meets WCAG AA contrast (at least 4.5:1); large text and non-text controls meet their applicable contrast thresholds.
- Every interactive element has a visible keyboard focus state. The skip link reaches the main content, and controls work by keyboard.
- `prefers-reduced-motion` behavior is implemented and exercised in a browser check.
- Responsive behavior is checked at 375 px and desktop widths, with screenshots retained as review evidence.
- A browser check confirms no horizontal overflow; visual review covers the English and Spanish layouts.

## Technology and hosting

- The homepage uses static HTML, CSS, and JavaScript with locally hosted font assets. It has no application server, database, analytics, or runtime framework dependency.
- GitHub Pages through GitHub Actions remains the hosting direction; deployment and the Pages base path are not configured in this review slice.
- Playwright + TypeScript is the planned browser check for the portfolio. Add the smallest check workflow after the homepage design is approved.

## Next reviewable slices

1. Resolve accepted review findings and approve the homepage design and content.
2. Add a small Playwright check for language selection, keyboard access, reduced motion, responsive widths, and overflow.
3. Confirm the GitHub Pages URL and configuration before preparing deployment.
4. Build the portfolio QA Lab and separate practice projects one at a time; report only real, reproducible test evidence.
