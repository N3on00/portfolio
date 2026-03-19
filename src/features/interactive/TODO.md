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
- Done: actor runtime state and scene progression are now synchronized through a dedicated interactive runtime session
- Done: actor reactions now choose between modal, panel, and inline presentation without leaking that routing into the shell
- Next: refine dedicated visuals per reaction target while keeping the reaction contract generic

## Guardrails

- Keep game logic out of shared modules
- Consume shared content instead of hardcoding portfolio data here
- Expose a stable module entrypoint for the app shell
