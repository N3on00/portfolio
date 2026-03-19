# App Layer TODO

## Scope owned by this layer

- Shared app shell
- Central routing and mode switching
- Cross-mode integration points

## Parallel work suggestions

- Done: shell layout is implemented against `appShell`
- Done: router integration exists for `/`, `/interactive`, and `/classic`
- Done: mode switcher behavior stays route-based and decoupled from feature internals
- Done: runtime shell now composes both integrated feature modules without route-local fallback glue

## Guardrails

- Do not store portfolio content here
- Do not move mode-specific UI into this layer
- Keep route ownership centralized
