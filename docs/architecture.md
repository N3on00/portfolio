# Portfolio Architecture

## Goal

This repository now provides a modular foundation for a portfolio with two clearly separated modes:

- `interactive`: main experience for the 2D room and project exploration
- `classic`: reduced black and white portfolio overview

The current state is intentionally minimal. It defines boundaries, shared contracts, and extension points so parallel branches can work independently without colliding on the same concerns.

## Module boundaries

### `src/app`

- Shared app shell contract
- Shared route registry
- No mode-specific content or rendering logic

### `src/features/interactive`

- Owns the room scene, object interactions, hints, and PC popup flows
- Must consume shared content instead of duplicating project data
- Contains its own TODO file for deeper implementation work

### `src/features/classic`

- Owns the reduced portfolio overview mode
- Must stay presentation-focused and lightweight
- Contains its own TODO file for section design and content mapping

### `src/shared`

- `config`: site-wide identity and mode configuration
- `content`: central portfolio data source for both modes
- `types`: shared contracts and module interfaces
- `ui`: shared design tokens

### `src/runtime/react`

- Owns React + Vite bootstrapping, route rendering, and shell composition
- Resolves feature screens through a runtime registry keyed by `entryModule`
- Must not become the home of feature behavior or shared domain data

## Routing baseline

- `/` -> defaults to interactive mode
- `/interactive` -> explicit interactive mode
- `/classic` -> explicit classic mode

Routing is defined centrally in `src/app/routing/routes.ts` so both modes can evolve behind stable route contracts.

## Parallel branch guidance

- Branch A can focus on interactive mode internals inside `src/features/interactive`
- Branch B can focus on classic mode layout and content presentation inside `src/features/classic`
- Shared updates to identity, project metadata, and reusable tokens belong in `src/shared`
- Shell-level navigation, mode switching, and cross-mode integration belong in `src/app`

## Current implementation level

- Types, route definitions, shared config, and design tokens exist
- Mode contracts define ownership, extension points, and the shared content mapping they consume
- Shared content now uses one typed entity registry with reusable relations and mode mappings
- A shared actor foundation exists for cross-mode interaction logic and content mapping
- React + Vite runtime wiring now exists in a dedicated adapter layer
- No game logic or final portfolio presentation is locked in yet

## Actor foundation

- The generic actor system lives in `src/shared/actors`
- Architecture rationale and rejected alternatives are documented in `docs/actor-system-architecture.md`
- Both modes now treat actor registration as the preferred path for future room objects, classic blocks, and popup triggers
- Content-model rationale and extension rules are documented in `docs/content-model.md`

## Suggested next steps

1. Expand the interactive actor registry and scene contracts behind the existing runtime seam.
2. Implement the classic mode sections against the shared section registry and shared content mappings.
3. Teach both renderers to traverse `modeMappings` before introducing new mode-local content structures.
4. Build each mode in its own branch against the shared module boundaries.
