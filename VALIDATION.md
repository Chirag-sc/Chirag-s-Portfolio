# Validation — 6 September 2026

This log preserves earlier checks and their limits. The final upgrade section below records the broader checks completed on 8 September.

## Completed

- TypeScript check passed (`tsc --noEmit`).
- Production static export passed using Node 22. An initial Node 24 run produced output but crashed during Windows process shutdown; the successful Node 22 run is the validated runtime.
- Actual in-app Chromium screenshots inspected at desktop 1440 px, mobile 390 px, and narrow 320 px. No horizontal document overflow at the checked widths. The hero, projects, credentials, and contact layouts were inspected.
- Every internal anchor resolves. About, Projects, Experience, Skills, Education, Certificates, Contact, and the hero project action were exercised. Mobile navigation opens and closes; destinations respect the fixed header.
- One canvas remains mounted across section navigation. Both desktop and mobile WebGL renderers were visibly inspected. A mobile uniform-update issue found during QA was corrected.
- Reduced effects switch changes state, persists through reload, and selects demand rendering with frozen orbital time. Its accessible name is present.
- `?scene=static` renders zero canvases and a captured static black-hole scene. Project navigation remains usable at 320 px.
- The resume route returns HTTP 200 and `application/pdf` (136,404 bytes). The served file is the original supplied resume.
- Email uses the actual `mailto:` address. The copy action resolves and announces success. Social hrefs match the resume PDF link annotations. No message was sent and no external social profile was changed.
- Exactly five text-based credentials render with zero certificate images or viewer buttons while images are absent.
- A temporary, clearly labelled development fixture exercised image viewing with renderer artwork, zoom to 150%, reset, Close, Escape, keyboard focus containment, and focus restoration to the trigger. An intentionally missing asset recovered to text without a broken thumbnail after hydration. The fixture and its routes were removed before deployment.
- Source files formatted. No fabricated certificate artwork, product screenshots, project URLs, dates, or deployment claims were added.

## Limits

- No measured FPS, memory, Lighthouse, or physical-device performance claim is made. The large Three.js scene chunk is lazy-loaded; the build reports a chunk-size advisory.
- OS reduced-motion change and hidden-tab handling were reviewed in source; OS preference emulation, prolonged background timing, and actual GPU context-loss injection were not independently instrumented in this browser session.
- Browser developer logs include an upstream Three.js Clock deprecation warning from React Three Fiber. Earlier development import errors were corrected.
- The starter installer reported dependency audit findings. No security audit or blanket dependency upgrade was performed; the deployed artifact contains static HTML/assets and no application server.

Screenshots are stored locally in `outputs/qa/` (excluded from source publishing). The static fallback WebP files in `public/` are intentional production assets captured from the renderer.

## Refinement pass — completed 8 September 2026

- Inspected the existing fullscreen shader, persistent canvas, fallback, preference handling, and adaptive quality before editing. Reused that architecture and the existing navigation.
- Inspected desktop screenshots at 1440 × 1000 and mobile screenshots at 390 × 844: the irregular disk, sharp shadow and arcs, receding About scene, stronger BLACK HOLE AI presentation, asymmetric ACAD-SYNC layout, and quiet Contact background. Mobile project geometry confirms overview, visual, then details in a single column. No horizontal overflow at the checked widths.
- Exercised native anchor and keyboard scrolling. One canvas remained mounted as progress advanced through About (approximately .246), Projects (.439), Experience (.661), and Contact (1). Intermediate progress samples showed damping; text remains ordinary DOM content outside the lens shader.
- Normal mouse input produced nonzero parallax state. Reduced effects reset camera progress and both pointer axes to zero and froze animation time across About/Projects/Contact navigation, on desktop and mobile. Fixed a reduced-mode readability issue by fading the stationary hole before About.
- Confirmed the forced static fallback renders zero canvases; inspected its content at 320 px with no horizontal overflow. Original fallback images are preserved and retain the original disk appearance.
- All five scene-motion tests passed on Node 22, covering section mapping, degenerate measurements, reduced-motion freezing, damping/convergence, and bounded elapsed time. TypeScript passed. The Node 22 production static build completed successfully; its existing large-chunk advisory remains.
- Resume SHA-256 matches the supplied PDF. Professional content, credential gallery, all five credential entries, public assets, and hosting configuration are unchanged. No imagery was generated and nothing was published during this pass.

Refinement screenshots use the `outputs/qa/refined-` prefix. Browser checks used the local development preview; production export was build-verified. Adaptive quality remains implemented, but no physical-device GPU/FPS benchmark was performed. OS preference changes and context-loss handling were reviewed in source, not independently emulated. The new lensing remains an artistic approximation.

## Final upgrade — completed 8 September 2026

- Inspected the current shader, scene, and rendered layouts before extending them. Retained the turbulent disk, depth-dependent stars, continuous native-scroll journey, preference controls, adaptive quality, factual content, and original navigation. Refined hero framing and typography, disk/arc brightness continuity, flagship emphasis, ACAD-SYNC composition, and mobile spacing.
- Inspected screenshots at desktop 1440 × 1000 and mobile 390 × 844, including Home, About, both projects, credentials, Contact, and inspection mode. Checked narrow 320 px and short 320 × 480 / 640 × 360 layouts. Project content follows overview, visual, and details on mobile; checked widths have no horizontal document overflow. The short inspector scrolls to its controls and retains a reachable Close action.
- Exercised the optional inspector with keyboard and emulated touch. Verified one persistent canvas, one named slider, Home/End values, visible pixel changes with star lensing, frozen orbital time/parallax, keyboard focus containment, Escape, trigger-focus restoration, and exact native scroll restoration. Resizing from desktop to mobile during inspection now refreshes section measurements correctly on exit.
- Exercised native section travel through About, BLACK HOLE AI, ACAD-SYNC, Experience, Certificates, and Contact. Measured smooth convergence to their scene states, renewed light around the flagship, and a quiet later scene. Direct loading and reloading `#acad-sync` initializes the correct scene without earlier scrolling. Emulated touch devices ignore mouse parallax.
- Emulated OS reduced motion: the preference enables reduced effects, keeps camera progress and pointer axes at zero, and freezes time across scroll and pointer input. The inspector still redraws its lensing control on demand. Reviewed preference changes during inspection and exit handling.
- Captured all four final desktop/mobile hero and inspection WebP assets directly from the frozen renderer in disposable browser pages, with interface nodes removed. Inspected every asset to ensure no text, controls, or annotation leaders are baked in. Forced-static mode renders zero canvases and the refreshed stills. Inspection reports “Still view” with a disabled slider. Fixed excessive cropping on short landscape phones by selecting the wide capture.
- Injected actual `WEBGL_lose_context` loss during inspection. The application recovered to a still and corrected the control status. Confirmed all four fallback asset routes return HTTP 200.
- Verified the contact copy action announces success, all five factual credentials remain, and the served resume SHA-256 matches the supplied PDF. A clearly labelled temporary credential fixture verified zoom to 125%, reset to 100%, Escape/focus restoration, and readable recovery from a missing image. Removed the fixture route before the production build. No actual certificate images were supplied or invented.
- All ten relevant motion/framing tests passed. Final TypeScript check and Node 22 production static export passed. `git diff --check` passed. No browser runtime errors occurred in the final focused checks. The production build retains the lazy scene chunk-size advisory and a build-plugin timing advisory.
- The local preview remains running at `http://localhost:3000/`. Nothing was published during this upgrade; dependencies, hosting configuration, professional data, and the original resume remain unchanged.

Browser checks used the user-authorized headless Chrome workaround with software WebGL (SwiftShader) on Windows after the normal browser control failed to reconnect. Screenshots in `outputs/qa/upgrade-final-*` document the interactive layouts; `upgrade-clean-*` document the refreshed fallback layouts. The cumulative check record is `outputs/qa/upgrade-verification.json`. These ignored local QA artifacts are not part of the production export.

Remaining limits: no physical-device GPU/FPS, memory, Lighthouse, prolonged hidden-tab timing, or screen-reader benchmark was performed. Adaptive quality and hidden-tab demand rendering remain implemented. Production output was build-verified; browser interactions were tested against the development preview. The renderer and its descriptive lensing control remain an artistic approximation with no calibrated physical measurements. The earlier missing real certificate assets, dates, verification URLs, and project demo/repository URLs remain intentionally absent.

## Observatory design pass — 10 September 2026

- Implemented the five approved composition changes: a cropped desktop horizon with a single-line name and amber rule; a full-width BLACK HOLE AI chapter heading with existing approach/progress evidence; a cooler ACAD-SYNC chapter; one active navigation marker; numbered credential archive rows; and the large Contact invitation with a distant existing renderer capture. No new project claims or generated artwork were added.
- Inspected desktop 1440 × 1000 and mobile 390 × 844 screenshots of the hero, projects, archive, and Contact. Verified one-line name and no document overflow at 320, 390, 651, 800, 1000, and 1440 px. Corrected crowded tablet navigation, tablet hero framing, and a short-viewport reflow issue. Tablet/mobile navigation uses the existing disclosure menu up to 800 px; the scene, annotations, and hero layout share that composition boundary.
- Verified active navigation during native scrolling and direct loads of `#acad-sync`, `#black-hole-ai-details`, and `#contact`. The decorative marker settles under the current desktop link and beside the active mobile link. Tested touch selection, menu closing, and Escape/focus return, including Escape while the opener has focus.
- Verified inspector slider changes, one persistent canvas, Escape/focus return, and reduced-effects freezing of camera, parallax, and orbital time. Both explicit reduced effects and emulated OS reduced motion remove navigation-marker animation. Forced-static inspection retains the honest disabled “Still view” control. Contact reuses the existing still and adds no animation or canvas.
- Verified all five real archive entries remain informational without supplied images. A clearly labelled temporary fixture checked the revised image-row trigger, zoom, reset, Escape/focus restoration, and missing-image recovery. Removed the fixture before building. The real contact copy action still announces success.
- Replaced the desktop hero fallback with a clean capture of the final cropped renderer; preserved the unchanged mobile and inspection assets. Aligned responsive fallback positioning to their scene centers. Checked static layouts and inspection exit at 720 × 500 CSS pixels, plus portrait mobile and tablet widths.
- TypeScript and the production static export passed; the existing ten scene tests passed. The Sites build helper encountered the broken system npm launcher, so the successful production build used the existing Vinext CLI directly with the working Node 22 runtime. Existing chunk-size and build-plugin timing advisories remain. No browser runtime errors occurred in the completed focused checks.
- Preserved the factual data, original resume, dependency manifests, and hosting settings. The local preview was restarted and remains available at `http://localhost:3000/`. Nothing was published.

Screenshots and the focused check record are in ignored `outputs/qa/observatory-*` files. Browser QA used the previously authorized headless Chrome workaround with software WebGL; no physical-device performance claim is made. Existing missing certificate images and project evidence remain absent. Earlier validation limits continue to apply unless explicitly checked above.
