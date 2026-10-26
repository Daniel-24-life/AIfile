# English profile presentation audit

Date: 2026-10-26. Audience: international recruiters and technical collaborators. Scope: GitHub-native profile and portfolio entry pages; existing applications and evidence remain unchanged.

| Priority | Layer | Source evidence and impact | Minimal fix | Confidence |
| --- | --- | --- | --- | --- |
| P1 | Required | English README uses Chinese banner and screenshot assets; the images cannot explain the projects to English readers | Dedicated English banner and explicitly labeled system-overview illustrations; retain the original screenshots in Chinese pages | High |
| P2 | Contextual | Language link appears below the banner | Place a text-based language selector above the banner, aligned right | High |
| P2 | Required | Generated recent release includes Chinese version text; English project entries lead to Chinese default READMEs | Add English release label and preferred English entry; identify untranslated deep documents | High |
| P2 | Contextual | English and Chinese share one cover field, so regeneration can reintroduce Chinese images | Register English covers separately and test the generated English page and assets | High |

Visual contract: retain navy, teal and warm accents; use readable native SVG diagrams with a compact project-specific flow. These diagrams are explanatory illustrations, not screenshots of an English product interface. Markdown text remains the primary readable content. No statistics, new capabilities or endorsements are added.

Source findings are confirmed. Rendered checks and publication are recorded after implementation; no full accessibility conformance is claimed.

## Verification after implementation

| Check | Result | Evidence / limit |
| --- | --- | --- |
| English banner and five project illustrations | pass | English-only SVG text; all generated assets checked for drift |
| English overview links and release label | pass | Registry tests; English generated project section contains no CJK text |
| Top-right language switch | pass | Before banner; keyboard navigation in local Markdown approximation |
| 320 / 375 / 768 / 1440 CSS px | pass | Chinese and English profile in light and dark; no page-wide horizontal overflow in approximation |
| 200% text enlargement / spacing override | pass | English profile at 375px in local approximation |
| Diagram text bounds | pass | Browser-measured SVG text boxes inside the canvas |
| Actual application UI translation | not tested | Not changed; diagrams explicitly identified as explanatory illustrations |
| Exact GitHub UI, Safari, screen readers | not tested | Local Markdown approximation is not GitHub's live CSS; no full accessibility claim |

The reusable local check is `scripts/profile-i18n-qa.cjs`, using the portfolio's existing Playwright and Marked environment. Set `PROFILE_DIR` to the profile checkout; `BROWSER_PATH` can select an installed Chromium executable. It uses an isolated browser and a temporary loopback server and does not load personal browser data. Screenshots and results are ignored under `tmp/english-profile-qa/`.
