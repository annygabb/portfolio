# Foreground project handoff

## User direction

Replace the retreating 3D pages in “O que venho construindo” with a full-screen handoff: the next project comes in front and covers the previous one. Apply the same continuity between PageSpeed and Orchestrator previews, inline evidence and the production website carousel. Scrolling back reverses the handoff.

## Reference comparison

Inspected contact sheets from both supplied videos: the 8-second coffee reference coordinates object movement, typography and scroll as one narrative; the 29-second dental reference keeps a central visual focus and changes content continuously. The prior portfolio instead rotated and reduced whole pages into a dark field, creating disconnected panels and large visual gaps (matching the supplied screenshots).

## Implementation

Keep opaque pages at full size and in document flow. Hold each fitting project screen with GSAP until the next surface reaches the sticky header. No extra pin spacing, page rotation, page scale, faded page or backward depth movement. The incoming surface has the higher stacking order and covers the previous surface. Screenshot-only motion settles from a slight offset/scale, coordinated with arrival.

Tall inline evidence stays naturally scrollable. Only after its bottom reaches the viewport bottom does it hold for the next surface to cover it. Closed/short details and overflowing project screens retain natural scrolling. Existing chart/counter/typing replay, filters, inline tool controls, translations and website carousel remain intact. Reduced motion and small viewports keep readable native scrolling.

## Validation

56 automated tests pass; build produces 16 routes. Updated regression checks cover next-element pin boundaries, no artificial spacer, no page transform/recession, full tall evidence, filter rebuild cleanup and coarse-pointer fallback. Desktop browser inspection at 1363 × 936 confirms full-size foreground overlap, the tall chart held behind the incoming Orchestrator, exact final Lighthouse values, reverse scrolling and no horizontal overflow. No app-origin console errors observed (browser extension metadata errors are unrelated). Mobile visual QA was not performed for this bounded change.
