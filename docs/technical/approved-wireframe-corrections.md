# SmartMeal wireframe corrections — 2026-09-26

Status: DRAFT / UNAPPROVED. Existing prototype continued, not a production application. Official PRD unchanged.

## Recommendation → eaten record

`MealUpdate.stampRecommendations` captures one ISO generation timestamp per batch and freezes each recommendation metadata object. Rendering and saving reuse those rows, not newly constructed recommendations. Each eaten item stores its stable record ID, recipe ID, recommendation ID, original `generatedAt`, classification source, meal slot, and classification status. Confirmation time is stored separately on the occasion. The selected eating date is preserved independently.

User-approved Asia/Ho_Chi_Minh ranges, including the latest clarification:

| Main meal | Local generation time |
| --- | --- |
| Bữa sáng | 00:00 inclusive to 10:00 exclusive (including 09:31–09:59) |
| Bữa trưa | 10:00 inclusive to 15:00 exclusive |
| Bữa tối | 15:00 inclusive to next midnight exclusive |

Snacks retain Ăn nhẹ. No generic Bữa chính diary grouping is created; the internal main/snack field remains for approved counters and generation conditions. A missing original timestamp blocks saving instead of inventing a slot. One same-slot save creates one occasion; duplicate save tokens, mixed main/snack selections and combo/component overlap remain guarded. Distinct generation slots cannot silently become a single meal. Time boundaries are RESOLVED, not TBD.

This prototype holds state in the existing in-memory model. Durable server storage and cross-device account synchronization are not implemented or certified by this change.

## Layout and interaction

- Món đơn: scrolling remains on `.saved-list`; an inner `.saved-grid` owns auto-height square rows and equal 16px gaps. Existing card art placement, text, rounding and filters remain. Combo markup was restored after the user chose to undo an unintended height regression; its cards remain 148px.
- Streak: preserve the approved 2×2 Home grid (reconfirmed by user). Count at left, weekday/month grid at right, adapting the supplied wide reference to this tile. Background #39452D; genuinely earned squares #CFE6AF plus a check. Calendar has actual month offsets and no future earned days. No reading statistics copied.
- Rabbit: replaceable `homeKnowledgeAssets.rabbitNormal` and `.rabbitInteraction`, beside `.pyramid`. States: normal → bounce → alternate → normal → reveal. Timing hooks are 350/650/120ms; reduced motion skips delays. Final art/content remains pending. Fullscreen pyramid uses contained aspect ratio, isolated background, Escape/Back and restored Home scroll/focus.
- Digestive history: `.record-history-surface` contains ALL foreground content including Edit; it translates by 82px. Original trash asset remains in a separate rounded action container. Cancel resets the swipe. Editing and confirmation policy unchanged.

## Shared-component impact review

Existing recipe details, persona screen, record form and AI welcome layout were compared before/after; their sampled geometry/content/styles match. The only detected unintended visual regression was Combo; user requested restoration and a follow-up comparison confirms equal geometry. Source changes affecting Home, diary metadata and history rows are within the explicitly requested scope.

Final illustrations, nutrition content, persona identity/content, voices and response-length options remain approved placeholders, not newly invented final material.
