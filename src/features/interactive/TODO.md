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
- Done: renderer adapter now turns scene phases, hotspots, and actor actions into a playable React room surface
- Done: keyboard-accessible fallback actions and modal overlays now sit on top of the shared UI shells
- Next: synchronize actor runtime state, overlay reactions, and richer visual rendering without hardwiring them into the shell

## Guardrails

- Keep game logic out of shared modules
- Consume shared content instead of hardcoding portfolio data here
- Expose a stable module entrypoint for the app shell
