---
name: Joan QA Engineering Portfolio
description: A bilingual QA portfolio that presents quality as a clear engineering workflow.
colors:
  primary: "#ff835e"
  secondary: "#365b48"
  neutral-background: "#102b32"
  neutral-foreground: "#f7f3e8"
  neutral-muted: "#d5d7cf"
typography:
  display:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(4rem, 13.9vw, 12.5rem)"
    fontWeight: 800
    lineHeight: ".88"
    letterSpacing: "-.045em"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(1rem, 1.35vw, 1.2rem)"
    fontWeight: 400
    lineHeight: "1.58"
  label:
    fontFamily: "Bricolage Grotesque, sans-serif"
    fontSize: "clamp(.9rem, 1.3vw, 1rem)"
    fontWeight: 700
rounded:
  sm: "6px"
  md: "10px"
spacing:
  page-gutter: "clamp(1.5rem, 7vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.neutral-foreground}"
    textColor: "{colors.neutral-background}"
    rounded: "{rounded.sm}"
    padding: ".35rem .75rem"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-foreground}"
    rounded: "{rounded.sm}"
    padding: ".4rem .65rem"
    height: "44px"
---

# Design System: Joan QA Engineering Portfolio

## Overview

**Creative North Star: “Quality as a visible workflow.”** The home page gives Joan's name first priority, then uses a four-station QA path to make the portfolio's approach tangible. Petroleum and warm bone provide a quiet canvas; orange marks the final station and focused actions. The English and Spanish versions share the same hierarchy and visual treatment.

Key characteristics: typographic, process-led, bilingual, flat, and restrained.

## Colors

The palette pairs a deep petroleum background with warm bone text and one warm orange accent.

### Primary
- **Signal orange** (`#ff835e`): final quality station and visible keyboard focus.

### Secondary
- **Deep green** (`#365b48`): reserved supporting QA state color; do not use for decorative accents.

### Neutral
- **Petroleum** (`#102b32`): page background and the background inside flow endpoint circles.
- **Warm bone** (`#f7f3e8`): primary text, filled workflow shapes, and primary button surface.
- **Muted bone** (`#d5d7cf`): secondary footer text.
- Use text and shape contrast that remains legible on the petroleum background. Never rely on color alone to communicate meaning.

## Typography

**Display font:** Bricolage Grotesque, sans-serif. **Body font:** Literata, Georgia, serif. Labels use Bricolage Grotesque. Font files are self-hosted under `assets/fonts/` and carry their SIL Open Font License notices.

### Hierarchy
- **Display:** weight 800, responsive 4–12.5rem, line-height .88, tracking -.045em; Joan's name is the page's main visual anchor.
- **Role:** weight 500, responsive 1.1–1.75rem; sits immediately below the name.
- **Body:** weight 400, responsive 1–1.2rem, line-height 1.58; biography and station descriptions.
- **Label:** weight 700, responsive .78–1rem; workflow stations and footer metadata.

## Layout

The page uses a centered container capped at 1600px with a responsive horizontal gutter (`clamp(1.5rem, 7vw, 7rem)`). The title, flow, biography, and footer stay within that content width. The flow is a four-column grid; endpoint circles align to the centerline and sit in the page gutter beyond the first and last shapes. The final station label wraps to two balanced lines and centers under its shape. At 760px and below, the gutter becomes 1.5rem and the biography fills the content width. Keep workflow labels at least `.78rem`; use explicit soft hyphens for long words and verify no horizontal overflow. Tablet rules apply from 761px through 1024px. Keep the page free of horizontal overflow.

## Elevation & Depth

The system is flat. It uses color, fine dividers, and the dotted background texture for separation; there are no elevation shadows.

## Shapes

Workflow steps use rounded rectangles, manual testing uses a diamond, and the path starts and ends with circles. Controls use restrained 6px corners or a pill shape for the language selector. The dotted background is subtle and stays behind the content.

## Components

### Navigation and language

The circular “JD.” wordmark links to the page start. The EN/ES selector is visible in the header; English is the default. Each button's accessible name includes its visible language code. The active language uses a filled bone circle, and both controls retain a high-contrast focus ring.

### QA flow

Four real buttons represent strategy, manual testing, automation, and quality throughout. Each button opens its associated description by click, hover, or keyboard focus. A visible note remains hoverable; a click-open note closes on a second click, blur, outside click, or Escape. Keep the final label centered below its orange shape. The progress stroke animates once on entry and stops at Automation.

### Welcome banner

The banner appears after the initial entrance sequence, announces its text after becoming visible with `role="status"`, and can be dismissed by button or Escape. Its primary action scrolls to the QA flow. Reserve enough responsive height for either translation while it is pending or visible to prevent a late layout shift, then release the space when it is dismissed.

### Motion and accessibility

Use the existing one-time entrance sequence and short state transitions. Respect `prefers-reduced-motion` by showing content without motion. All interactive controls need visible focus; touch targets are at least 44px high where specified.

## Do's and Don'ts

- Keep English and Spanish content equivalent and preserve the selected language on every visible label.
- Use the workflow shapes only to express the actual QA stages.
- Do not add invented experience, metrics, test results, reports, or employer material.
- Do not use generic QA icons or color as the only state indicator.
- Do not add gradients, shadows, cards, or extra sections outside an approved slice.
