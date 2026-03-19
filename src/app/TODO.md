# App Layer TODO

## Scope owned by this layer

- Shared app shell
- Central routing and mode switching
- Cross-mode integration points

## Completed baseline

- [x] React shell layout reads from `appShell`
- [x] Router integration exists for `/`, `/interactive`, and `/classic`
- [x] Runtime registry resolves feature entry modules without hardwiring feature internals into the shell

## Next seams

- [ ] Add shared overlay orchestration once a real interactive popup flow exists
- [ ] Extract richer navigation metadata only if both modes need it

## Guardrails

- Do not store portfolio content here
- Do not move mode-specific UI into this layer
- Keep route ownership centralized
