# Interactive Mode TODO

## Scope owned by this module

- 2D room scene and navigation
- Interactive objects and hint system
- PC popup and project exploration overlays

## Parallel work suggestions

- Done: React runtime adapter exists without moving scene concerns into the shell
- Done: actor registry seam exists for registration-driven scene extension
- Done: shared panel, dialog, hint, and typography shells exist without taking ownership of scene logic
- Done: scene resolver and runtime screen now read shared mappings and actor-linked content together
- Done: interactive actor links were realigned to valid shared collections instead of feature-local shadow data
- Next: define renderer adapter and scene graph contracts behind the actor registry
- Next: model hotspots, focus states, keyboard support, and accessibility fallback

## Guardrails

- Keep game logic out of shared modules
- Consume shared content instead of hardcoding portfolio data here
- Expose a stable module entrypoint for the app shell
