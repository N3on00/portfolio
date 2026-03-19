# Content Model Alignment

## Goal

Provide one shared content basis for `interactive` and `classic` mode so both can render the same portfolio knowledge through different surfaces.

## Considered approaches

### 1. Separate mode-shaped content trees

- `classic` and `interactive` each keep their own data tree.
- Shared data would be copied or transformed manually between both structures.

Why not:

- Lowest readability at first glance, but highest duplication over time.
- Story hints, objects, projects, and skills drift apart quickly.
- Weak mapping story because each mode becomes the source of truth for itself.

### 2. One flat registry with fully generic untyped payloads

- Everything becomes a loose blob registry with `kind` plus open metadata.
- Renderers decide how to interpret payloads ad hoc.

Why not:

- Great flexibility, but readability and maintenance drop too far.
- Easy to add inconsistent shapes and implicit contracts.
- Mapping works, but only by moving complexity into renderers.

### 3. Typed entity registry plus relations plus mode mappings

- Content lives in one registry of typed entities.
- Reusable relations connect blocks, objects, projects, skills, experiences, stories, and hints.
- Modes only define surfaces and traversal rules for the shared graph.

Why this wins:

- Low duplication: facts live once and blocks/hints/objects reference them.
- Readable: each entity kind still has a clear typed payload.
- Maintainable: relations express meaning without mode-specific forks.
- Strong mapping: classic sections and interactive hotspots both project from the same graph.

## Chosen model

- `entities`: typed registered carriers for portfolio, blocks, objects, story fragments, hints, projects, skills, and experiences.
- `relations`: reusable links such as `highlights`, `demonstrates`, `supports`, `reveals`, and `points-to`.
- `modeMappings`: per-mode surface definitions that point at root entities and describe which relation types to traverse.

This keeps the shared layer content-centric and renderer-agnostic.

## How to add new content

1. Add one new entity in `src/shared/content/portfolio-content.ts` with the right `kind` and typed `payload`.
2. Link it into the graph with at least one relation so it becomes reachable from an existing block, object, story, or portfolio root.
3. Only update `modeMappings` if the new entity needs a new surface entry point; otherwise let existing traversal pick it up.
4. Keep mode-specific presentation details out of the entity payload unless both modes need them.
