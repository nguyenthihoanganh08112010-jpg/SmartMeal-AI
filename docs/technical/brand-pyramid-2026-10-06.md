# Brand and interactive pyramid — 2026-10-06

## User decisions
- Shared frameless thick purple back control across route headers; purple gradient chat background and lavender user bubbles.
- Replace decorative mascots, Bạn Dài and Hạt Cơm with a new 3D mascot. Keep HIN, LIN, Đi Đi and Anh Anh. User explicitly confirmed this scope.
- BMI chart waits for the user's reference. No BMI classification or design was invented.

## Implementation
- BackButton is used by all route headers and the pyramid full-screen overlay. Calendar previous/next controls remain date controls.
- BrandMascot uses one alpha PNG, named Mầm. Home, digestive landing and mascot persona share the image. The persisted legacy `rice` persona ID is retained to avoid breaking saved accounts; its display identity and server persona text now say Mầm. Old image files remain archived/unreferenced rather than destructively deleted.
- Pyramid uses a high-resolution generated visual reference (1536×1024). Five hit regions and detail crops correspond to its illustrated bands. Example labels describe depicted foods only. Educational recommendations remain explicitly unverified.
- Web uses pointer down/move/up/cancel with capture; native uses PanResponder. Continuous resistance: 100*tanh(delta/150). Height and tilt interpolate continuously; release springs to zero. Reduced motion suppresses tilt and spring.
- The preview measures its current window bounds. The modal interpolates top/left/width/height/radius from that rectangle to full-screen and reverses on Back, retaining Home scroll. Native safe areas and a scrollable full-screen body protect content.
- Selecting a band opens a translucent detail panel, with web backdrop blur; native has translucent fallback, not native blur. No medical or portion claims.
- This is rendered artwork with animated transforms, not an interactive 3D mesh engine.

## Verification
- TypeScript: PASS.
- Web, Android and iOS JavaScript/Hermes exports: PASS (not installed native builds).
- Tests: 47/47 PASS, including finite/bounded/symmetric/monotone continuous drag resistance and existing domain/database regressions.
- Source inspection: no legacy mascot references remain in active app/source/server prompt, except the intentionally retained persisted ID.
- Generated image alpha inspected: mascot 1312×1199 RGBA, pyramid 1536×1024 RGBA.
- Actual browser appearance, pointer gestures, full-screen transition, mobile touch and accessibility on device: NOT VERIFIED. Existing browser policy prevents automation; no screenshot evidence claimed.
- Cloud persona prompt not deployed; local source prepared. No PRD changes.

## Generation provenance
Built-in image_gen tool, not API fallback. Project assets: app/mobile/assets/brand/sprout-3d.png and pyramid-3d.png. Artwork is replaceable via centralized imports.

Mascot prompt:
Create a single original 3D mascot asset for SmartMeal, a premium calming Vietnamese food journaling app with lavender and off-white UI. One friendly rounded little sprout creature, NOT a rabbit, rice grain, banana, cat, dog or human. Soft sculpted pearlescent cream body shaped like a squat rounded pebble, lavender flipper-like arms and feet, two tiny fresh sage leaves on its head, warm expressive dark eyes and small welcoming smile. Sophisticated toy-like clay render, subtle subsurface scattering, gentle studio light, restrained lilac blush, three-quarter frontal pose waving one hand. Entire body visible, centered with generous clear padding, transparent background with actual alpha. No words, no labels, no scene, no ground platform, no border. High resolution clean silhouette readable at small mobile UI sizes. This is an app illustration, not a screenshot.

Pyramid prompt (reference: user-supplied tháp.jpg):
Use attached tiny pyramid illustration solely as a visual composition reference. Produce a high-resolution, premium 3D clay-rendered food pyramid asset isolated on genuine transparent background for SmartMeal app. Pyramid alone, straight frontal view, five clearly separated horizontal tiers. Top tiny coral tier with illustrated sweets and a small oil bottle; next warm beige tier eggs, fish, meat; middle cream tier milk carton and yogurt; next sage tier vegetables and fruit; wide bottom pale lavender tier rice bowl, bread and potatoes. Each recognizable food miniature rests within its tier; clean readable shapes, soft lighting, harmonious pastel lavender/sage/cream, cohesive gentle 3D style. No text, no legend, no numbers, no portions, no health claims. No green card background, no flame or +1 badge, no app UI. Centered complete triangle, no cropping. Five equal-height horizontal tiers aligned without perspective distortion so five equal horizontal hit areas can correspond to layers. Generous transparency margin around triangle. This is a UI illustrative reference, not a validated nutritional recommendation.

The generated tier heights differ; hit regions use the actual output boundaries rather than the requested equal bands.
