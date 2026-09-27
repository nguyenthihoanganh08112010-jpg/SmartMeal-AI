# Visual screen map — actual export checks

- PASS: generated one RGB PSD, 4200 × 15820 pixels, 61,374,078 bytes.
- PASS: ag-psd round-trip parsed 370 layers, 162 text layers, 63 groups; 52 screen placements. Source hashes and bounds recorded in docs/ux-ui/visual-map/manifest.json.
- PASS: independent Pillow reader decoded the PSD composite successfully.
- PASS: visually inspected flow previews for recording, persona and diary; corrected the diary middle/last deletion captures after observing they initially still showed confirmation. New captures were taken after clicking confirmation in the local prototype. Middle deletion retained three total occasions and removed only the selected vegetable dish; final-item fixture became zero occasions and an empty list.
- PASS: source application and PRD untouched by this export.
- NOT VERIFIED: Adobe Photoshop native open, text editing, save and reopen. Export has text metadata and raster appearance fallbacks but native app compatibility has not been executed.
- NOT VERIFIED in this pass: complete app regression suite, production authentication/AI/synchronization, all hidden/scroll/voice animation states.
- NOT APPLICABLE: running interactive buttons in PSD; use the original prototype.

Evidence: visual-map/verification.json, manifest.json, flow-01.png through flow-10.png, SmartMeal-map-overview.png, screenshot sources and the PSD itself. Screens are representative fixture states, not a continuous real-account session. Historic draft labels are intentionally preserved.
