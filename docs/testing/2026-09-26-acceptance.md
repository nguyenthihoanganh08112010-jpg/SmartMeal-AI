# Acceptance and comparison — 2026-09-26

DRAFT / UNAPPROVED. Executed against the existing prototype imported in baseline commit `2845a23`, and the corrected local build. No PRD edit.

## Actual results

| Check | Result | Evidence / method |
| --- | --- | --- |
| Build and generated JavaScript syntax | PASS | Python build-update.py; Node --check executed by builder |
| Approved time ranges incl. 09:31, 09:59:59, 10:00, 14:59:59, 15:00, UTC conversion | PASS | approved-fixes.txt |
| Generation Time A retained when confirmed at later Time B or next day | PASS | approved-fixes.txt; UI generation-ui.json |
| Snacks separate; missing timestamp cannot invent a main-meal slot | PASS | approved-fixes.txt |
| Three selected items → one occasion; repeated save does not duplicate | PASS | model tests and actual AI UI save; status confirmed one occasion / three items, second press refused duplicate |
| Diary save uses generated timestamp | PASS | UI batch 2026-09-26T15:11:11.099Z → Bữa tối; identical timestamp and recommendation IDs retained in all three eaten rows |
| Middle dish deletion preserves siblings/counter; final dish removes empty occasion once | PASS | model tests and browser confirmation flow (3 total unchanged after middle; isolated last occasion → 0) |
| Individual pointer swipe | PASS | actual drag revealed only dish-c; screenshot 12 |
| Diary modal layering | PASS | screenshot 11; only modal controls exposed while underlying list unavailable; confirm executed |
| Shared combo → component detail → Back → combo → Back → Diary | PASS | actual browser traversal, deleted-middle state preserved |
| Món đơn square spacing at 320/360/390/430 CSS widths | PASS | grid-measurements.json; equal 16px row/column gaps and equal square widths. First 390 resize read was stale (320); corrected standalone measurement confirms 390. No horizontal list overflow at confirmed390 |
| Streak real month cells, date alignment, no fabricated/future earned days | PASS | model tests; guest 30 September squares, zero checks; qualifying demo entry has one earned day |
| Streak colors and 2×2 grid | PASS | computed background rgb(57,69,45), 2 equal 166px columns at390; earned #CFE6AF rule; screenshot10 |
| Rabbit interaction → normal → content; pyramid fullscreen and Back | PASS | actual UI; screenshots05/06; no final art generated. Intermediate bounce/alternate duration not frame-by-frame measured |
| Digestive entire foreground moves together | PASS | history-row-motion.json: all seven descendants including Edit translate -82px within floating-point tolerance |
| Digestive rounded cards/trash, cancel restores row, Edit retained | PASS | screenshots08/09 and actual Edit opens populated form |
| Home bowel tile → Ghi lại landing, not form/analysis | PASS | actual UI: two upper icons, original-art placeholder, Bắt đầu |
| Unrelated screen comparison | PASS after fix | shared single/combo detail, persona, record form, welcome sampled text/geometry/colors unchanged. Combo initially FAILED (148→38px), user requested restoration, combo-restoration.json confirms exact sampled geometry equal |
| Existing model regressions | PASS | meal-update (11), audit (11), record suite; new approved-fixes (8). Logs retained, no inferred tests counted |
| Production backend, cross-device sync, real voice services, native phone gestures | NOT VERIFIED | this is an in-memory wireframe; no production integration executed |
| Figma synchronization | NOT VERIFIED | no Figma mutation executed in this pass; editable source and preview are in the official repository |
| Exact final artwork / final character approval | NOT VERIFIED / pending assets | intentional replaceable placeholders; no final character illustrations produced |

## Evidence IDs

- EV-01 / EV-02: screenshots/01-saved-before.png and 02-saved-after.png
- EV-03 / EV-04: screenshots/03-home-before.png and 04-home-after.png
- EV-05: screenshots/05-pyramid-fullscreen.png
- EV-06: screenshots/06-rabbit-content.png
- EV-07 / EV-08: screenshots/07-history-before.png and 08-history-after-swipe.png
- EV-09: screenshots/09-history-cancel-restored.png
- EV-10: screenshots/10-earned-streak.png (count is from one actual prototype qualifying entry; not real user history)
- EV-11: screenshots/11-diary-modal.png
- EV-12: screenshots/12-independent-dish-swipe.png

Paths are under evidence/. Screenshots are unaltered captures; some before/after viewport framing differs. Raw measurement files preserve results and detected regression rather than hiding the initial failure.

## Scope review and remaining items

One unintended change was found: Combo card surface height. The user explicitly selected restoration; fixed and rechecked. No other unintended difference was found in inspected source changes and sampled unaffected screens. This is not a claim of pixel comparison of every possible application state.

User reconfirmed the 2×2 Home grid; the wide streak reference is adapted to the existing tile, not copied as a separate full-width card. No reading statistics or blue active squares are imported.

Still pending supplied/approved content: two Rabbit states, nutrition-pyramid artwork, original Bạn Dài and digestive illustrations/icons, definitive persona assets/text and voice/response options, verified recipe/nutrition content. Those are intentionally labeled placeholders, not missing invented designs. Time-slot mapping is fully resolved. No additional interaction rule was invented to clear this list.
