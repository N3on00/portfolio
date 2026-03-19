# Shared Layer TODO

## Scope owned by this layer

- Site identity and global configuration
- Shared content and type contracts
- Shared UI tokens

## Completed in this branch

- [x] Curated one shared portfolio knowledge base with sections, actors, and mode mappings.
- [x] Expanded shared contracts only where both modes benefit from the structure.
- [x] Kept design tokens generic enough for both classic and interactive rendering.

## Guardrails

- Avoid feature-specific fields unless both modes consume them.
- Prefer extension through typed contracts over ad hoc constants.
- Keep this layer engine and framework agnostic where possible.
