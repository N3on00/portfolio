# Portfolio Architecture

## Goal

This repository implements one portfolio application with two distinct modes on top of shared content and shared contracts:

- `interactive`: a specified future room-based experience that should only ship once it adds real explanatory value
- `classic`: the direct scan-first portfolio view rendered from the same shared content graph

The architecture is designed so new content, scenes, sections, and presentation variants can be added without rewriting the app shell.

## Boundaries

### `src/app`

- route ids and route definitions
- shell-level contracts only
- no feature behavior or portfolio content

### `src/features/interactive`

- scene definitions
- room object placements and hotspots
- scene progression and runtime session state
- reaction presentation routing for the interactive React adapter

### `src/features/classic`

- section registry and scan priority
- mapping from shared content to classic render blocks
- renderer adapters for HTML and React

### `src/shared`

- `content`: typed entities, relations, notes, and mode mappings
- `actors`: shared actor contracts, registry, resolver, and state store
- `types`: cross-module contracts
- `ui`: design tokens and reusable React primitives

### `src/runtime/react`

- Vite/React bootstrapping
- runtime module registry
- route rendering and shared global styles
- no ownership of feature logic

## Core architectural rules

- shared content is the source of truth
- feature logic stays in feature modules
- rendering adapters stay thin
- routing stays centralized
- new capabilities should prefer registration, mapping, and contracts over hardcoded view logic

## Shared data model

The portfolio content is modeled as:

- `entities`: typed portfolio facts such as portfolio root, projects, skills, experiences, and story fragments
- `relations`: graph links such as evidence, support, or reveal paths
- `modeMappings`: traversal roots and surface definitions per mode

That allows both modes to consume one durable content model instead of forking data.

## Actor model

The actor system in `src/shared/actors` is the reusable interaction backbone.

Actors define:

- identity and type
- placements
- actions and reactions
- state transitions and flags
- content links into the shared graph

Interactive mode uses actors for room objects and overlays.
Classic mode uses the same model for section-oriented content binding.

## Runtime model

### Interactive mode

- scene definitions stay renderer-agnostic
- progression is reducer-based
- a dedicated runtime session synchronizes actor state and scene progression
- the React adapter renders hotspots and chooses presentation variants for reactions

### Classic mode

- the classic render flow builds a `ClassicRenderDocument`
- both HTML and React consume that same document model
- shared block presentation metadata keeps those adapters aligned without coupling them together too tightly

## Routes

- `/` -> deliberate entry choice between direct portfolio and room concept
- `/interactive` -> interactive concept/specification page for the future room mode
- `/classic` -> direct portfolio page

## Extension strategy

### Add interactive content

1. add or extend shared content in `src/shared/content/portfolio-content.ts`
2. register or extend an actor in `src/features/interactive/scene/actor-registry.ts`
3. place it in a scene definition
4. let the runtime adapter consume the resolved actor and reaction

### Add classic content

1. add shared content and relations
2. expose it through an existing or new mode surface mapping
3. update section registry or render flow where needed
4. keep renderer changes adapter-focused

## Reference documents

- `docs/actor-system-architecture.md`
- `docs/content-model.md`
- `docs/interactive-scene-system.md`
- `docs/runtime-integration.md`
- `docs/integration-decisions.md`
- `docs/deployment.md`
- `docs/interactive-experience-spec.md`
