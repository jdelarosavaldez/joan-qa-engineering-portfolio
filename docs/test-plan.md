# Portfolio test plan

This plan traces browser checks to the portfolio's first implementation slice: the bilingual introduction, quality flow, About section, and responsive presentation. Expected UI text used by assertions lives in `tests/data/test-data.ts`.

| Case ID | Priority | Requirement / acceptance criteria | Preconditions | Steps | Expected result | Tags |
| --- | --- | --- | --- | --- | --- | --- |
| PF-HOME-001 | P1 | English is the default; identify Joan, role, introduction, and main content. | Fresh browser context. | Open the home page; inspect title, name, role, intro, language state, and main landmark. | English copy and accessible page landmarks are visible. | `@smoke` |
| PF-NAV-001 | P1 | About navigation works with keyboard. | Home page loaded in English. | Focus “More about my work”; press Enter. | URL targets `#about` and the About heading is visible. | `@regression` |
| PF-I18N-001 | P1 | Spanish selection updates page language, copy, metadata, and flow. | Home page loaded in English. | Select ES and inspect language metadata and representative copy. | `html[lang]`, selected state, meta description, and page copy are Spanish. | `@smoke` |
| PF-I18N-002 | P2 | Switching back to English clears stale translated copy. | Home page loaded. | Switch to ES and back to EN. | Language state and representative copy return to English. | `@regression` |
| PF-FLOW-001 | P1 | Four quality stations have accessible names in both languages. | Home page loaded. | Inspect each station in EN, then switch to ES and inspect again. | All stations are visible and their accessible names match the selected language. | `@smoke` |
| PF-FLOW-002 | P1 | Hover reveals a station note. | Home page loaded in English. | Hover Automation, then move the pointer away. | The note opens on hover and closes when the pointer leaves. | `@regression` |
| PF-FLOW-003 | P1 | Click toggles a station note. | Home page loaded in English. | Click Strategy twice. | First click opens the note; second click closes it. | `@regression` |
| PF-FLOW-004 | P1 | Keyboard controls open and close a station note. | Home page loaded in English. | Focus Manual testing; press Escape, Enter, and Space. | Focus opens the note; Escape closes it; Enter and Space toggle it. | `@regression` |
| PF-FLOW-005 | P1 | Touch toggles a station note. | Mobile, touch-enabled context (390 × 844). | Tap Strategy, then tap it again. | First tap opens the note; second tap closes it. | `@regression` |
| PF-LAYOUT-001 | P1 | English fits a 375px mobile viewport. | Browser fonts loaded; banner dismissed. | Measure document width, adjacent section boxes, and station-label widths; capture screenshot. | No horizontal overflow, adjacent section overlap, or clipped station label. | `@regression` |
| PF-LAYOUT-002 | P1 | Spanish fits a 375px mobile viewport. | Browser fonts loaded; banner dismissed. | Select ES; measure document width, adjacent section boxes, and station-label widths; capture screenshot. | No horizontal overflow, adjacent section overlap, or clipped station label. | `@regression` |
| PF-LAYOUT-003 | P1 | English fits a 1440px desktop viewport. | Browser fonts loaded; banner dismissed. | Measure document width, adjacent section boxes, and station-label widths; capture screenshot. | No horizontal overflow, adjacent section overlap, or clipped station label. | `@regression` |
| PF-LAYOUT-004 | P1 | Spanish fits a 1440px desktop viewport. | Browser fonts loaded; banner dismissed. | Select ES; measure document width, adjacent section boxes, and station-label widths; capture screenshot. | No horizontal overflow, adjacent section overlap, or clipped station label. | `@regression` |
| PF-LAYOUT-005 | P1 | English fits a 1920px wide viewport and preserves Strategy spacing. | Browser fonts loaded; banner dismissed. | Measure layout; verify Strategy alignment and 12px shape/start-circle clearance; capture screenshot. | No overflow or overlap; Strategy label alignment and shape clearance meet the spacing thresholds. | `@regression` |
| PF-LAYOUT-006 | P1 | Spanish fits a 1920px wide viewport and preserves Strategy spacing. | Browser fonts loaded; banner dismissed. | Select ES; measure layout; verify translated Strategy alignment and 12px shape/start-circle clearance; capture screenshot. | No overflow or overlap; label aligns and shape clearance meets the spacing thresholds. | `@regression` |
| PF-MOTION-001 | P2 | Reduced-motion preference disables hero animation and smooth scrolling. | Browser supports emulated media preference. | Emulate `prefers-reduced-motion: reduce`; reopen the page. | Hero animation is disabled and scrolling is automatic. | `@regression` |
| PF-A11Y-001 | P1 | English passes an automated WCAG 2.2 AA accessibility scan. | Home page loaded in English; banner dismissed. | Run axe with WCAG A/AA tags. | No axe violations are reported for English. | `@smoke` |
| PF-A11Y-002 | P1 | Spanish passes an automated WCAG 2.2 AA accessibility scan. | Home page loaded; banner dismissed. | Select ES and run axe with WCAG A/AA tags. | No axe violations are reported for Spanish. | `@smoke` |

## Scope and limitations

- Each viewport/language pair runs as its own test, so a failure identifies the affected combination and receives an independent timeout.
- The layout check covers the first implementation slice and checks adjacent section boxes; it does not prove that every pair of decorative elements is non-overlapping.
- axe checks catch many automated accessibility failures but do not replace keyboard, screen-reader, content, or manual contrast review.
- Test screenshots are attached to each Playwright test result and are available from the HTML report or CI artifacts.
- The portfolio suite uses semantic roles and visible labels instead of adding test-only IDs to every control.
