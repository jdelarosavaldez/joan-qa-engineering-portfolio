# Portfolio test plan

This plan traces browser checks to the portfolio's first implementation slice: the bilingual introduction, quality flow, About section, and responsive presentation. It is the test source of truth; expected copy lives in `tests/data/copy.ts`.

| Case ID | Priority | Requirement / acceptance criteria | Preconditions | Steps | Expected result | Tags |
| --- | --- | --- | --- | --- | --- | --- |
| PF-HOME-001 | P1 | English is the default; identify Joan, role, introduction, and main content. | Fresh browser context. | Open `/`; inspect title, name, role, intro, language state, and main landmark. | English copy and accessible page landmarks are visible. | `@smoke` |
| PF-NAV-001 | P1 | About navigation works with keyboard. | Home page loaded in English. | Focus “More about my work”; press Enter. | URL targets `#about` and the About heading is visible. | `@regression` |
| PF-I18N-001 | P1 | Spanish selection updates page language, copy, metadata, and flow. | Home page loaded in English. | Select ES and inspect language metadata and representative copy. | `html[lang]`, selected state, meta description, and page copy are Spanish. | `@smoke` |
| PF-I18N-002 | P2 | Switching back to English clears stale translated copy. | Home page loaded. | Switch to ES and back to EN. | Language state and representative copy return to English. | `@regression` |
| PF-FLOW-001 | P1 | Four quality stations have accessible names in both languages. | Home page loaded. | Inspect each station in EN, then switch to ES and inspect again. | All four stations are visible and named in the selected language. | `@smoke` |
| PF-FLOW-002 | P1 | Station notes support hover, click, and keyboard interactions. | Home page loaded in English. | Hover Automation; move away; click Strategy twice; focus Manual testing; use Escape, Enter, and Space. | `aria-expanded` and note visibility track open/close actions. | `@regression` |
| PF-FLOW-003 | P1 | Station notes support touch interaction. | Touch-enabled mobile browser context. | Tap Strategy, then tap it again. | First tap opens the note; second tap closes it. | `@regression` |
| PF-LAYOUT-001 | P1 | Layout fits 375px, 1440px, and 1920px widths without horizontal overflow or vertical overlap; Strategy remains clear of the start circle on wide screens. | Browser fonts loaded; welcome banner dismissed. | Visit at each viewport; measure the document and key section boxes; at 1920px verify Strategy label alignment, shape offset, and circle clearance; capture screenshot. | No horizontal overflow or adjacent section overlap; at 1920px the label stays aligned and the shape has at least 12px of clearance; screenshots are attached to the test result. | `@regression` |
| PF-MOTION-001 | P2 | Reduced-motion preference disables hero animation and smooth scrolling. | Browser supports emulated media preference. | Emulate `prefers-reduced-motion: reduce`; open the page. | Hero animation is disabled and scrolling is automatic. | `@regression` |
| PF-A11Y-001 | P1 | Automated WCAG 2.2 AA accessibility scan passes for both languages. | Home page loaded; welcome banner dismissed. | Run axe in EN, switch to ES, run axe again. | No axe violations for the selected WCAG tags. | `@smoke` |

## Scope and limitations

- The viewport check covers the first implementation slice and checks adjacent section boxes; it does not prove that every pair of decorative elements is non-overlapping.
- axe checks catch many automated accessibility failures but do not replace keyboard, screen-reader, content, or manual contrast review.
- Test screenshots are saved under Playwright's per-test output directory and can be inspected from the HTML report or CI artifacts.
- Current page controls use semantic roles and accessible names. The suite intentionally uses those user-facing contracts rather than adding test-only IDs to every element.
