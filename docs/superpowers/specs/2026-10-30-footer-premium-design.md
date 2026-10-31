# Footer refinement

User asked for faster name vaporization and a more premium contact/footer background.

The particle loop is now 3.8s (previously10s): .6s initial rest, .85s dispersal, .85s recomposition and the remaining readable rest. Visibility pause, static/reduced-motion fallback and existing lifecycle cleanup remain intact. Regression verifies the new cycle and exact return to rest.

The closing invitation now spans the full width with a large heading, connected calligraphy in muted gold and a circular mail action. Below, email/contact details and a quieter three-column navigation align across a fine divider. Copyright and top link remain separate. Deep blue layered background includes a subtle grid texture; no image assets or additional dependencies. PT/EN strings and localized CV links remain.

62 tests pass; build16 routes, diff check. Desktop browser1363×936 verified no horizontal overflow, readable CTA, email/navigation hierarchy, working canvas and background. No mobile visual QA in this bounded pass.
