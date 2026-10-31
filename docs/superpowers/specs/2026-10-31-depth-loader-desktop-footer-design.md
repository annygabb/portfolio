# Expanding 3D arrival and desktop footer scale

## Reference and behavior

User requested a loading screen before the hero, inspired by https://br.pinterest.com/pin/765612005406204743/ . The public page redirected to the particle-sphere reference; its original GIF was inspected as a frame sequence. New implementation uses original canvas code:2,800 Fibonacci-distributed3D particles(1,500 narrow), rotation, depth/perspective projection, blue points and sparse gold accents. Sphere holds/rotates then grows to the viewport bounds. An expanding central aperture reveals the hero, completed around2.4s. No video/image animation asset is loaded.

Shows on each fresh homepage entry, not only the first session visit. Direct section anchors, case pages, back-forward restoration and reduced motion remain direct. It never locks scroll or focus. A3s module deadline and3.4s bootstrap failsafe ensure content remains reachable. No second Lenis instance. Hero spacing waits for intro-ready when active.

## Footer

Earlier full-height footer still constrained typography and shell width. Desktop now uses viewport minus112px with no max-width, larger logo/body/email/navigation/socials and a flexible two-column composition centered in available height. Copyright stays at the bottom. Caligraphic particle background remains behind functional content. Small viewport rules retain the compact layout.

## Verification

67 tests pass;16 route build; diff check. Tests cover expansion phase, near/far perspective, aperture/hero event, missing canvas and a stalled animation deadline. Desktop1363×936 browser QA captured the sphere before the hero and verified arrival completed, footer shell1236×854, navigation16.85px and no horizontal overflow. Reference visuals are inspiration, not copied animation source. No mobile visual QA in this pass.
