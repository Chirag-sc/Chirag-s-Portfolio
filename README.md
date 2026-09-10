# Event Horizon — Chirag S

A React + TypeScript portfolio with Three.js / React Three Fiber, built on the Sites Vinext starter and exported as a static site. All essential content is server-rendered semantic HTML; the graphics module loads separately. No backend, tracking, contact form, or audio.

## Run and build

Use Node 22.13+ (Node 22 LTS recommended on Windows).

```sh
npm ci
npm run dev
npm run build
```

The static build is written to `dist/client/`. Deploy that directory to any static host. Preserve asset paths and serve `/resume-chirag-s.pdf` as `application/pdf`. Sites metadata lives in `.openai/hosting.json`. The private Sites preview requires the owner to sign in; public sharing is a separate access decision.

On Windows, npm may omit the optional Rolldown native package. This checkout explicitly includes `@rolldown/binding-win32-x64-msvc` as an optional dependency. Other platforms skip it and use Rolldown’s own platform dependency. The bundled Node runtime was used for validation because the system Node version was too old.

## Edit the content

`lib/portfolio-data.ts` contains typed professional content, project details, skill groups, education, contact links, and credentials. The supplied resume is the source of truth. GitHub and LinkedIn URLs were extracted from its PDF link annotations. The original file is served unchanged as `public/resume-chirag-s.pdf`; its phone number is not displayed in the portfolio UI.

Project visuals are labelled conceptual diagrams. No product screenshots, project repository links, deployment claims, performance figures, or additional projects were invented. The 122 unit tests describe the BLACK HOLE AI CV schemas/utilities, as stated in the resume; they are not tests of this portfolio.

## Add certificate images

1. Place a readable image in `public/certificates/`, such as `oracle-agentic.webp`.
2. Add `image: '/certificates/oracle-agentic.webp'` to the matching credential in `lib/portfolio-data.ts`.
3. Optionally add `date` and `verificationUrl` when you have real values.

Without an image, a card displays the issuer, title, and credential type. With an image, it opens the Base UI / shadcn accessible dialog with zoom in/out (100–300%), reset, scroll/pan, close, Escape, focus trapping, and restoration to its trigger. Failed assets revert to readable text. Certifications and virtual job simulations remain distinct.

## How the black hole works

`components/scene/black-hole-shader.ts` is a single full-screen fragment shader. Stable star populations vary in size, brightness, temperature, and spatial density, with dark regions and very faint dust. Source-coordinate lensing stretches nearby stars; DOM text is outside the renderer. A circular occlusion mask, thin luminous edge, inclined annulus, and upper/lower disk images surround the shadow. Domain-warped filaments, broad density variation, localized brightness, and radius-dependent orbital speeds replace periodic striping. Subpixel detail fades to limit shimmer; bloom stays restrained.

This is an **artistic approximation, not a scientifically accurate simulation**. It does not integrate relativistic null geodesics, simulate a Kerr spacetime, or generate scientifically meaningful observations. The decorative renderer is separate from the BLACK HOLE AI project and makes no claim to its analytical capabilities.

## Tune quality and motion

Central parameters in `lib/scene-config.ts`: `lensingStrength`, `diskTilt` (radians), `rotationSpeed`, `exposure`, `starDensity`, `bloom`, DPR caps, and frame-time adaptation threshold. These are intentionally absent from the visitor interface.

One persistent canvas renders the site. DPR is capped at 1.5 on desktop and 1 on mobile. The renderer can lower resolution and drop a star layer after sampling slow frames. This is adaptive behavior, not a measured FPS guarantee. No performance target is represented as an achieved benchmark.

`lib/scene-motion.ts` maps measured section positions to a continuous journey and damps native-scroll progress. `lib/scene-framing.ts` defines the compositions: the monumental opening, quiet About, renewed light around BLACK HOLE AI, cooler ACAD-SYNC, and the subdued final sections. These measured landmarks also initialize direct section loads. Fine mouse pointers produce restrained depth-dependent star parallax; touch input does not.

The visible Reduced effects switch disables camera travel and parallax, freezes orbital time, and renders on demand. Only scroll-driven opacity changes remain, fading the stationary hole before About. OS `prefers-reduced-motion` is honored on initial load and when it changes, including when a visitor tries to disable reduced effects. An explicit visitor choice persists locally when storage is available. Hidden tabs render on demand; animation time is bounded on resume. Native scrolling is never hijacked. Run the motion checks with `node --experimental-strip-types --test tests/scene-motion.test.mjs` on Node 22.

## Inspect the horizon

The optional hero control opens an accessible Base UI dialog. It gives the existing canvas a centered composition and freezes time and parallax while the visitor compares lensing. A single keyboard- and touch-operable slider changes only background-star bending; the disk geometry stays stable. The labels and their leaders are HTML, positioned from the same framing coordinates as the shader. Short viewports use a compact legend and scrollable controls.

The ordinary journey state remains in refs during inspection. Closing restores the exact scroll position and trigger focus, returns normal lensing, and resumes the preserved scene. Measurements refresh after exit so resizing or rotating during inspection does not leave stale section positions. Escape and focus containment use the existing dialog primitive. The effect remains an artistic illustration, with no physical units or calibrated measurements.

When WebGL is unavailable or lost, the dialog shows a still, announces the change, and disables the slider with a “Still view” status. It does not imply that the still responds to the control. The normal site remains fully usable.

Run both framing and motion suites on Node 22 with `node --experimental-strip-types --test tests/scene-motion.test.mjs tests/scene-framing.test.mjs`.

## Navigation and composition

`components/journey-navigation.tsx` tracks the section at the reading position and places one decorative amber marker beside its link. It handles direct section/detail links, restored scroll, resizing, font loading, and the document bottom. The active link exposes `aria-current="location"`; the marker stops moving under reduced effects or OS reduced motion. The existing navigation becomes a disclosure menu at 800 px so tablet links do not crowd the identity.

The hero keeps CHIRAG S. on one line beside the cropped horizon. BLACK HOLE AI uses a full-width chapter heading with its existing conceptual diagram and clearly labelled engineering/progress notes. ACAD-SYNC retains a distinct cooler composition. Credentials render as numbered archive rows, with actual image viewers and verification links only when supplied. The distant Contact horizon reuses the existing renderer capture; it adds no canvas or animation.

WebGL2 availability, scene exceptions, shader errors, and context loss lead to a static fallback. The desktop and mobile `public/space-fallback-*.webp` and `public/space-inspect-*.webp` images are clean captures from the final renderer, including the current filaments and lensing. Inspection stills use the baseline lensing setting. Short landscape phones use the wide captures to preserve the shadow’s silhouette. `?scene=static` exercises the no-canvas fallback. Content and all links remain available.

## Missing real assets

- Five certificate images, dates, and verification URLs were not supplied. Dates and verification links are omitted.
- Project repository URLs, live-demo URLs, and product screenshots were not supplied. Project actions navigate to the implementation details on this page.
- The resume’s previous Portfolio URL is not treated as a project demo.

## Validation

See `VALIDATION.md` for the checks actually performed. Screenshots and local QA fixtures are not included in the deployed source or public credential gallery.
