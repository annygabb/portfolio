# One final footer with a calligraphic background

User corrected the separate final name section: the minimal footer itself must be the last full viewport, with a worked script name animating behind it.

Footer now has min-height100svh minus sticky header. Its functional shell is layer2 and centers the contact/navigation, with copyright at the bottom. Signature is absolute inset0, layer0, opacity.18 desktop/.14 narrow, pointer-events:none; it adds no document height. Pinyon Script matches the existing calligraphic identity. Canvas reads that font and fits actual glyph ink bounds, including flourishes and descenders, rather than advance width alone. Fast particle loop, reduced-motion fallback and existing PT/EN/CV links remain.

65 tests pass and build16 routes. Regression verifies glyph bounds fit both row and width. Desktop1363×936: footer855px starts below82px header; signature behind shell(z0 vs2), correct Pinyon font, no horizontal overflow, links unobstructed. Screenshot shows the name behind the complete footer. No mobile visual QA in this pass.
