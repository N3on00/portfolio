# Runtime Integration

## Decision

The project now uses React with Vite as the concrete runtime adapter.

This runtime stays isolated in `src/runtime/react`:

- `src/app` remains the source of shell and route contracts
- `src/features/classic` owns classic render flow and its React route surface
- `src/features/interactive` owns actor registry, scene resolution, progression, and its React route surface
- `src/shared` stays framework-agnostic and continues to own the shared content graph, tokens, and generic types

## Integration shape

1. `appShell.routes` remains the single route registry.
2. React resolves `entryModule` values through `src/runtime/react/registry/runtime-module-registry.tsx`.
3. Each feature exports a React runtime module registration without moving core feature logic into the runtime layer.
4. Classic mode reads shared surfaces from the content graph and renders a runtime-ready document flow.
5. Interactive mode resolves scenes from actors, content links, and progression state before any final renderer is chosen.

## Why this stays modular

- Registration replaces route-level hardcoding.
- Shared content stays graph-based, not copied into feature UIs.
- Feature logic is still separable from React rendering.
- New interactive objects should extend actor definitions and content links rather than change shell logic.
- New classic sections should extend shared mappings and render blocks rather than fork portfolio data.
