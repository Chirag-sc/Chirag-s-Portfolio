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

`components/scene/black-hole-shader.ts` is a single full-screen fragment shader. It evaluates a layered procedural starfield in warped source coordinates, so the background itself is distorted near the hole. A circular occlusion mask, thin photon-ring-inspired edge, inclined turbulent annulus, and separately modelled upper/lower disk images suggest light travelling around the shadow. Radial filaments rotate at radius-dependent speeds; modest side-dependent brightness and analytic glow add depth.

This is an **artistic approximation, not a scientifically accurate simulation**. It does not integrate relativistic null geodesics, simulate a Kerr spacetime, or generate scientifically meaningful observations. The decorative renderer is separate from the BLACK HOLE AI project and makes no claim to its analytical capabilities.

## Tune quality and motion

Central parameters in `lib/scene-config.ts`: `lensingStrength`, `diskTilt` (radians), `rotationSpeed`, `exposure`, `starDensity`, `bloom`, DPR caps, and frame-time adaptation threshold. These are intentionally absent from the visitor interface.

One persistent canvas renders the site. DPR is capped at 1.5 on desktop and 1 on mobile. The renderer can lower resolution and drop a star layer after sampling slow frames. This is adaptive behavior, not a measured FPS guarantee. No performance target is represented as an achieved benchmark.

The visible Reduced effects switch freezes orbital time and renders on demand. OS `prefers-reduced-motion` is honored on initial load and when it changes. An explicit visitor choice persists locally when storage is available. Hidden tabs render on demand; animation time is bounded on resume. Native scrolling is never hijacked. Section progress gently shifts and fades the black hole into a calmer starfield.

WebGL2 availability, scene exceptions, shader errors, and context loss lead to a static fallback. The two `public/space-fallback-*.webp` images were captured from this app’s actual renderer. `?scene=static` exercises the no-canvas fallback. Content and all links remain available.

## Missing real assets

- Five certificate images, dates, and verification URLs were not supplied. Dates and verification links are omitted.
- Project repository URLs, live-demo URLs, and product screenshots were not supplied. Project actions navigate to the implementation details on this page.
- The resume’s previous Portfolio URL is not treated as a project demo.

## Validation

See `VALIDATION.md` for the checks actually performed. Screenshots and local QA fixtures are not included in the deployed source or public credential gallery.

