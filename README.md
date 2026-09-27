# SmartMeal AI

Editable Vietnamese wireframe/prototype — wireframe baseline frozen by the user on 2026-09-27. Pending artwork/content and production integrations are not approved or completed by that freeze.

## UX/UI handoff

Read the [detailed Vietnamese UX/UI report](docs/ux-ui/SMARTMEAL_UX_UI_HANDOFF.md), its [HTML reading edition](docs/ux-ui/SMARTMEAL_UX_UI_HANDOFF.html), and the [53-state preview index](docs/ux-ui/STATE_INDEX.md). The report records the frozen source revision, every screen group, interactions, data contracts, editing locations, prior evidence and remaining limitations. Historical draft labels in the unchanged prototype/screenshots predate this approval.

To rebuild the report after editing its Markdown, run `python docs/ux-ui/build-report.py` after building the app preview. Serve the repository root to use its relative preview and evidence links. The HTML includes a browser print action; an exported PDF has not been validated.

The existing SmartMeal prototype is maintained in `app/wireframe`. This is not a finished production application. Sample records are explicitly fictional. See `docs/technical/wireframe-origin.md` for the baseline import.

## Preview

Requires Python 3 and Node.js on PATH (or set NODE_BINARY).

```sh
python app/wireframe/build-update.py
python -m http.server 8766 --directory app/wireframe --bind 127.0.0.1
```

Open http://localhost:8766/smartmeal-update-preview.html. The review selector exposes prototype states. Generated previews are intentionally ignored; source, model tests and evidence are versioned.

## Checks

```sh
node app/wireframe/check-approved-fixes.cjs
node app/wireframe/check-meal-update.cjs
node app/wireframe/check-record.cjs
node app/wireframe/check-audit.cjs
```

See `docs/testing/2026-09-26-acceptance.md` for actual checks and limitations, and `docs/technical/approved-wireframe-corrections.md` for meal-time rules and interaction changes. The official PRD was not modified.
