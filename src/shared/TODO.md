# Shared Layer TODO

## Scope owned by this layer

- Site identity and global configuration
- Shared content and type contracts
- Shared UI tokens

## Parallel work suggestions

- Done: shared UI tokens now cover surface, spacing, layout, radius, and typography foundations
- Done: reusable React primitives exist for layout, panel, trigger, modal shell, hint shell, and text helpers
- Done: shared UI boundaries are documented in `ui/README.md`
- Done: content graph traversal now supports shared evidence flows without duplicating project or skill data per mode
- Done: shared content is curated enough to drive both classic sections and interactive overlays from the same graph
- Next: expand shared types only when both modes need the contract

## Guardrails

- Avoid feature-specific fields unless both modes consume them
- Prefer extension through typed contracts over ad hoc constants
- Keep this layer engine and framework agnostic where possible
