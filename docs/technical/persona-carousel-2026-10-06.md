# Hồ sơ AI — 2026-10-06

Reference: two portrait-carousel screenshots and three user browser comments supplied in this task.

- White rounded portrait frame with centered main card and tilted, partially visible adjacent cards; existing SmartMeal portraits reused without creating character artwork.
- Horizontal responder follows pointer/touch; 18% distance or velocity threshold changes one card, end resistance 0.22, spring stiffness 190/damping 24/mass 0.95. Vertical gesture remains available to page scrolling.
- Purple dots expand to a bar for preview; each target at least 44px. Reduced-motion disables settling animation.
- Saved-persona check is a white circular overlay with a purple tick; preview does not write persisted state.
- Borderless thick purple Back arrow, purple Save. Existing save stays on screen; unsaved-exit confirmation retained.
- Name, introduction, character setup, dialogue style and greeting are separate cards. Existing voice controls and original content remain.

Validation: TypeScript PASS; existing regression suite 46/46 PASS; web export PASS. Actual drag/touch feel, visual comparison, narrow-width layout and device testing NOT VERIFIED due browser tool access restriction. Evidence: evidence/mobile/persona-2026-10-06. No screenshot evidence fabricated.
