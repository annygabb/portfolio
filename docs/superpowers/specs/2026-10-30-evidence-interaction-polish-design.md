# Evidence and interaction polish

## Scope

User requested a new Lighthouse presentation using the attached Stats-4 prompt, cover-side arrows and free vertical scrolling in the website carousel, a Vapour-style footer name, direct localized CV downloads, gold/zoom on the contact action and a true light hero palette.

## Implementation

- Four criterion panels adapt the prompt's compact area-chart presentation to the static site. Every panel shows its recorded range plus the three exact values. SVG lines and fills rise from the documented 80-axis floor on visibility, replay on return, and preserve real final coordinates. Full table is available in a disclosure. Records remain explicitly independent, with no time-growth/baseline claim.
- Carousel arrows align to the current real cover bounds after scrolling, resizing and image loads. Status remains in the heading. Horizontal native scrolling remains available to touch/keyboard, with its visual scrollbar hidden. Removed `data-lenis-prevent`, which stopped the Lenis wheel event over the cover from advancing the page. No wheel cancellation or vertical scroll interception was added.
- Header, experience and footer CV links use `download` and the correct PT/EN PDF. Removed the résumé section.
- The hero's light palette includes background, header, display lettering, copy, directional portrait shadow and fade. Existing dark appearance is preserved. Contact uses a restrained gold background and scale on hover/focus, with reduced-motion fallback.
- Original canvas particle implementation inspired by https://21st.dev/@jatin-yadav05/components/vapour-text-effect. Author/reference metadata was inspected; its registry requires an API key and lists unknown license. No proprietary source copied. The footer name disperses and reassembles, only runs while visible and pauses when the document is hidden. Static text remains without canvas or with reduced motion.

## Stack decision

The attached Stats-4 TSX assumes React, Tailwind and shadcn. This repository renders static HTML with MJS, shared CSS and GSAP/Lenis enhancements; adding a second app runtime for four charts would be unnecessary. Equivalent markup is in `src/showcase.mjs`; styles in `public/styles.css`; animation in `public/content-motion.js`. No unused `/components/ui` folder or uncompiled TSX is introduced. If a future React migration is requested: initialize a TypeScript React app, configure Tailwind, run `npx shadcn@latest init` with the `@/components` alias and `/components/ui` path, then install `recharts clsx tailwind-merge lucide-react` and port these same preserved records into the supplied component. That path is useful in a React app so registry component imports and aliases resolve consistently.

## Verification

61 tests pass, including localized direct downloads, exact evidence, reduced motion and particle return positions. Build emits 16 routes. Desktop browser QA confirms chart final coordinates, free vertical scrolling over the cover (scrollY8573→9506 while carousel remains index2), arrows aligned to the cover center, no visible horizontal bar, no document overflow, theme switch and running footer canvas. Console errors observed only from the browser extension metadata service, not the app. No mobile visual QA performed.
