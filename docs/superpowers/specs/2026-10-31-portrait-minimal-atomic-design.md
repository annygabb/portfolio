# Portrait, minimal footer and entry motion

## User request and implementation

Replaced the hero asset with a new transparent cutout of the supplied eu.jpg. Built-in image editing was used for background extraction; the project asset is public/assets/anny-portrait-cutout.webp,1254×1254 RGBA, saved losslessly. Original400×400 attachment is unchanged. Prompt: remove only the pale wall background; preserve facial identity/proportions, expression, natural skin/lighting, curls/flyaways, earrings, blazer, shirt, pose and square framing; no further cropping, beautification, white halo or added shadow. Existing CSS directional shadow/fade remains theme aware.

Adapted the provided MinimalFooter to this static renderer: logo, concise personal description, contact, three real social icons, Explore/Tools links and localized CV. No placeholder corporate policies or invented social profiles. Subtle radial blue background, fine borders and restrained gold focus/hover. Full-width name is outside the constrained shell, in two large rows, occupying78svh on desktop and60svh on small screens; existing fast vapor cycle is preserved and raster sampling is bounded for the larger canvas.

Portfólio/Portfolio now uses a staggered character opacity/spacing entrance in GSAP, inspired by Gradual Spacing (Dillion Verma/Magic UI, reference metadata MIT). https://21st.dev/@dillionverma/components/gradual-spacing

A brief atomic SVG entry uses the project's blue/gold instead of the reference lime. Inspired by the supplied atom image and https://dribbble.com/shots/21246569-Atomic-preloader-animation . It appears once per session on the home page, waits at most850ms for fonts/photo and fades220ms; a1400ms bootstrap failsafe removes the overlay even if the module fails. It never intercepts pointer input, locks scrolling or creates another Lenis. Reduced motion skips it. Hero lettering waits for its completion when active.

## Stack adaptation

The provided TSX assumes React, Tailwind, TypeScript and shadcn. This repository uses MJS→HTML, shared CSS and progressive JS. Components remain in src/showcase.mjs and src/render.mjs, styles in public/styles.css; unused TSX/runtime dependencies were not introduced. For a future requested migration, initialize React with TypeScript, configure Tailwind, run npx shadcn@latest init with the @/components alias and /components/ui directory, then install lucide-react. The directory gives shadcn registry imports a consistent destination. The current SVG icons are semantic, locally rendered equivalents.

## Verification

64 tests pass; build16 routes. Regression checks prove the preloader fails open when assets hang and case pages remain available. Existing route/CV/motion/carousel checks pass. Desktop1363×936 confirms new image decoded at1254px,9 spacing letters in PT, dismissed entry, minimal footer, full-width1348px name canvas with readable descenders and no horizontal overflow. Reduced-motion fallbacks retained. No mobile visual QA in this pass.
