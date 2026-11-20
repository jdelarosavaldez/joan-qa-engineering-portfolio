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

The current page loads Bricolage Grotesque and Literata from Google Fonts. This sends each visitor's IP address and browser User-Agent to Google when the fonts are requested. The portfolio currently has no consent mechanism. This is an intentional design dependency for this slice; self-host the font files before removing the third-party request if the privacy trade-off is no longer acceptable.
