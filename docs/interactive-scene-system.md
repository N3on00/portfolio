# Interactive Scene System

## Goal

The interactive mode is modeled as a generic scene system with actor-backed objects, scene phases, and trigger-based progression.
The bedroom studio is only the first concrete scene, not the architectural center.

## Architecture choice

- Extend the existing shared actor system instead of bypassing it.
- Keep scene configuration in `src/features/interactive/scene/room-scene.ts`.
- Resolve actor content and actions through registries, not view files.
- Keep progression in pure reducer-style logic so renderers can stay replaceable.

## Technical model

### Scene definition

Scenes declare:

- normalized object placements
- interaction zones
- progression phases
- trigger rules

This keeps renderer details out of scene files and makes a second or third scene cheap to add.

### Object placement

Each scene object references a shared actor id and adds only placement-specific data.
That means the actor owns reusable logic and content links, while the scene owns spatial composition.

### Interaction zones

Zones are normalized and renderer-agnostic.
`getActiveInteractionTargets(...)` expands them to at least 44px for touch input so mobile remains practical.

### Trigger mechanic

Triggers are condition/effect pairs.
The first room uses:

- a 7 second timer to reveal the PC as the first clear next step
- an actor action trigger on `gaming-pc` to unlock open exploration

### Progression

The chosen progression is deliberately light:

- `observe`: no forced click immediately
- `guided-exploration`: one obvious first interaction
- `open-exploration`: the rest of the room opens without hard puzzle logic

## Critique of alternatives

### Monolithic room component

Rejected because object logic, timing, overlays, and spatial rules would collapse into one view-centered implementation that does not scale to additional scenes.

### Scene logic inside renderer files

Rejected because timer triggers and progression state are feature logic, not rendering concerns.
Keeping them separate makes testing and renderer swaps easier.

### Hardcoded content per object in the view

Rejected because project, skill, and personality data would drift away from the shared content source and become harder to reuse across interactive and classic modes.

## Adding new scenes or objects

1. Add or extend an actor in `src/features/interactive/scene/actor-registry.ts` when a new reusable object behavior is needed.
2. Add a new scene config beside `src/features/interactive/scene/room-scene.ts`.
3. Register it in `src/features/interactive/interactive-experience.ts`.
4. Keep renderer code consuming resolved scenes and interaction targets only.
