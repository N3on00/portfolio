# Actor System Architecture

## Why this exists

The repo already separates `app`, `features`, and `shared`, but the next scaling risk was object-specific interactive logic.
Without a shared abstraction, the interactive mode would drift toward `pc-popup`, `calendar-handler`, or renderer-bound hotspot code, while the classic mode would likely invent a second content mapping path.

The actor system is the common foundation that keeps object identity, actions, state, content links, and UI reactions decoupled from concrete renderers.

## What was analyzed

- Existing mode contracts in `src/features/interactive/interactive-mode.contract.ts` and `src/features/classic/classic-mode.contract.ts`
- Shared contracts in `src/shared/types/portfolio.ts`
- Shared content model in `src/shared/content/portfolio-content.ts`
- Current workstreams in `src/shared/TODO.md`, `src/features/interactive/TODO.md`, and `src/features/classic/TODO.md`

## Considered approaches

### 1. Object-specific handlers per mode

- Example direction: `pc-popup.ts`, `calendar-hotspot.ts`, `classic-project-section.ts`
- Strength: fast for one-off prototypes
- Weakness: poor extensibility, high coupling to renderer and UI flow, low reuse across modes
- Verdict: rejected

### 2. Inheritance-heavy actor classes

- Example direction: `BaseActor -> InspectableActor -> ProjectTerminalActor`
- Strength: centralizes some behavior
- Weakness: concrete objects still leak into the type tree, reuse depends on class hierarchy, state and content mapping become harder to remix
- Verdict: rejected

### 3. Capability-driven declarative actors with registry and resolver

- Example direction: actors are plain definitions with capabilities, placements, actions, gates, and content links
- Strength: high extensibility, low coupling, renderer independence, reusable across interactive objects, classic blocks, and overlays
- Weakness: requires a small resolver layer and more up-front contract design
- Verdict: chosen

## Chosen model

Actors are configuration-first definitions.
They describe behavior and relationships, not concrete UI implementation.

- `ActorDefinition`: identity, actor type, supported states, placements, actions, gates, and linked content
- `ActorRegistry`: registration and lookup without renderer knowledge
- `ActorStateStore`: minimal actor-local state and action effect application
- `resolveActorDefinition(...)`: combines registry, state, and shared content into a resolved snapshot for any mode

## Design consequences

- Room objects become actor registrations with scene placements
- Classic content blocks become actor registrations with section placements
- Popups and panels become reactions emitted by actor actions instead of special handlers
- Progression rules stay declarative through gates and action requirements
- Shared content remains the single source of truth; actors only reference it

## Realigned target

The goal is not to build a room-object framework.
The goal is to build a portable interaction model that any surface can consume:

- scene node
- hotspot
- classic section
- overlay trigger
- future guided progression element

That keeps the core logic stable while new objects, rooms, content blocks, or popups are added through registration.

## Files added for the foundation

- `src/shared/actors/actor-contracts.ts`
- `src/shared/actors/actor-registry.ts`
- `src/shared/actors/actor-state.ts`
- `src/shared/actors/actor-resolver.ts`
- `src/shared/actors/index.ts`

## Next integration steps

1. Register real interactive room actors through placements and content links.
2. Bind classic sections to the same registry instead of introducing a parallel mapper.
3. Let renderer adapters consume resolved actors and reactions, not raw feature-specific objects.
