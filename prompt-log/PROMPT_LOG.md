# SmartMeal AI — Prompt & AI Development Log

## SM-PROMPT-002 · Existing prototype and approved corrections

- Date: 2026-09-26
- Tool: Codex
- Request: work in the official repository; fix notebook spacing, earned-day streak cells, restore rabbit/pyramid placeholders and interactions, preserve AI generation-time meal classification, and move all digestive-history row content together during swipe. Keep PRD unchanged; document, test, commit and open a PR.
- Baseline action: imported the existing workspace prototype because the repository had no application source. This does not claim a new finished application.
- Baseline files: `app/wireframe/` and `docs/technical/wireframe-origin.md`.
- Implementation: fixed Món đơn grid; restored Combo after user review of an unintended height regression; adapted streak to the supplied reference inside the reconfirmed 2×2 grid; restored two Rabbit states and fullscreen pyramid placeholders; generation-time diary grouping with approved 00:00/10:00/15:00 boundaries; grouped digestive-history foreground and rounded trash action.
- Files changed: full list in `evidence/testing/changed-files.txt`; source in `app/wireframe`, technical/acceptance documentation, README and evidence.
- Tests: four model suites PASS (8 new named cases, 11 meal cases, 11 audit cases plus record assertions); build/syntax PASS; browser checks and limitations documented in `docs/testing/2026-09-26-acceptance.md`.
- Evidence: EV-01 through EV-12; raw grid, comparison, generation and row-motion measurements. Production/Figma checks NOT VERIFIED.
- Commit: baseline `2845a23`; implementation commit is the commit containing this completed entry (hash recorded in delivery report).
- Branch: `fix/smartmeal-layout-and-generation-time`.
- Status: implementable prototype corrections complete; DRAFT / UNAPPROVED, final assets/content remain placeholders; official PRD unchanged.

This file records AI-assisted work that materially contributes
to SmartMeal AI.

---

## SM-PROMPT-001

Date:
Tool:
Area:

### User request
-

### Work performed
-

### Files changed
-

### Tests
-

### Evidence
-

### Commit / Pull Request
-

### Status
-

## SM-PROMPT-003 · Final recheck and GitHub delivery

- Date: 2026-09-27
- Request: continue, recheck/fix if necessary, and publish to GitHub.
- Work: reran all four model suites and rebuilt the final preview with syntax validation. No implementation failure found in this rerun.
- Files: evidence/testing/2026-09-27-recheck.txt, evidence/testing/2026-09-27-build.txt, Prompt Log and CHANGELOG_AI.
- Results: PASS for executed suites/build; UI evidence remains the actual previous pass, not a claimed new UI run.
- Evidence: logs named above; prior EV-01 through EV-12 retained.
- Commits: implementation cfc5ee9; this recheck is recorded in the commit containing this entry.
- GitHub: local Git has no usable noninteractive credentials; publishing through the authorized GitHub connector. Remote commit identity may differ while source tree is verified identical.
- PRD unchanged. Final illustration/content placeholders remain unapproved.

## SM-PROMPT-004 · Frozen wireframe UX/UI handoff

- Date: 2026-09-27.
- Request: freeze the current wireframe and create a detailed per-screen UX/UI and interaction report so others can edit it easily.
- Work: documented the frozen GitHub revision d66f16f, screen IDs, anatomy, gestures, states, data contracts, shared components, asset replacement, source ownership and editing/test workflow in Vietnamese. Added a printable HTML reading edition and 53 source-derived preview-state links.
- Files: docs/ux-ui/SMARTMEAL_UX_UI_HANDOFF.md and .html; STATE_INDEX.md and .html; build-report.py; docs/testing/2026-09-27-handoff-report.md; evidence/testing/2026-09-27-report-check.json; README; this log and CHANGELOG_AI.
- Result: documentation-only handoff; no application source or PRD changes. Approval recorded for the wireframe baseline, not pending artwork, persona identity/content, production services or Figma synchronization.
- Review: recorded a source-level search-grid wrapper concern and a focus-trap verification need without silently changing the frozen design. Existing application test results are explicitly dated, not claimed as rerun in this report task.
- Tests/evidence: report builder checked local links, unique anchors, UTF-8, image alt text and 53 source-derived state links; browser rendered the reading edition and its table of contents. See report QA record for scope and NOT VERIFIED items.
- Commit: the documentation commit containing this entry; publication uses the previously authorized GitHub workflow and PR #1.

## SM-PROMPT-005 · Visual screen map for Photoshop

- Date: 2026-09-27.
- Request: a screen-image-centered UX/UI flow map, editable in Photoshop, based on the frozen wireframe.
- Work: captured real local prototype states, composed 10 flow lanes and 52 screen placements, exported a layered PSD with separate screen images, 162 text layers and arrow layers; added visual previews and editing instructions.
- Files: docs/ux-ui/visual-map/*; docs/ux-ui/capture-frame.html; docs/testing/2026-09-27-visual-map.md; Prompt Log and CHANGELOG_AI.
- Results: one 4200 × 15820 RGB PSD; 370 layers / 63 groups. No app or PRD edits. Screens remain bitmap; annotations carry editable text metadata. Native Photoshop verification is NOT VERIFIED.
- Tests/evidence: PSD round-trip; Pillow composite decode; visual preview checks; actual local deletion-result screenshots; manifest hashes and verification.json. No new claim of full application regression testing.
- Commit: the documentation/export commit containing this entry. PSD delivery is local; no claim of GitHub upload without verified publication.

## 2026-10-03 · MOBILE-PRD11-001 · Native application foundation and honest visual audit
- User request: build the app from official PRD v1.1, existing PSD and supplied chibi character boards; roster HIN/LIN/Đi Đi/Anh/regular Hạt Cơm; inspect whether UI matches PSD and which PRD updates are implemented.
- Approvals: Expo + Supabase + server-side OpenAI; bottom confirmation sheet 2/3 overrides PRD centered wording. No service registration, deployment or purchase authorized/performed.
- Implementation: app/mobile Expo TypeScript project; shared business rules and reusable detail routes; demo-only local persistence; Supabase Auth/RPC adapters, RLS migrations, private image storage, authenticated conversation/generation/transcription functions; source portrait crops; notebook/welcome fidelity corrections.
- Files: app/mobile/**; docs/technical/mobile-implementation-2026-10-03.md; docs/technical/mobile-prd-visual-audit-2026-10-03.md; evidence/mobile/audit-2026-10-03/**; .gitignore; prompt-log files.
- Result: runnable development web app, NOT production complete and NOT 100% PSD fidelity. PSD original and official PRD are not modified by this task.
- Tests: 32 domain tests and PostgreSQL migration/account-isolation test executed; TypeScript and web export executed. Native devices/cloud/SMTP/paid AI NOT VERIFIED. Final raw outputs and visual evidence are stored under evidence/mobile/audit-2026-10-03.
- Evidence: psd-current-overview.png, source.json, app-notebook-before.jpg, app-notebook-after-390.jpg, app-ai-before.jpg, app-ai-after.jpg, app-ai-bottom-sheet.jpg, test outputs.
- Remaining: visual/interaction backlog recorded in audit, credentials/deployment, licensed nutrition catalog/goal matrix, final source artwork, legal/SLA and other PRD OPEN items.
- Commit: recorded by the commit containing this entry.
