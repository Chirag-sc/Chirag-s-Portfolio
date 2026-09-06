# Validation — 6 September 2026

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
