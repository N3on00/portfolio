# Interactive Mode TODO

## Scope owned by this module

- 2D room scene and navigation
- Interactive objects and hint system
- PC popup and project exploration overlays

## Parallel work suggestions

- [x] React/runtime adapter seam exists without moving scene concerns into the shell
- [x] Actor registry seam exists for registration-driven scene extension
- [x] Define renderer adapter and scene graph contracts behind the actor registry
- [x] Model hotspots, focus states, keyboard support, and mobile-friendly interaction fallback
- [x] Isolate project overlays from renderer internals

## Implemented in this branch

- [x] Generic scene definition with phases, triggers, placements, and actor-backed content
- [x] Timed PC trigger after an observation phase to start guided exploration
- [x] Open exploration flow that unlocks the rest of the room after the first clear action
- [x] Touch target expansion so interaction logic remains usable on mobile

## Guardrails

- Keep game logic out of shared modules
- Consume shared content instead of hardcoding portfolio data here
- Expose a stable module entrypoint for the app shell
