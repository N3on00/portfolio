# Shared UI Boundaries

## Shared stays here

- Design tokens for color, spacing, typography, layout width, and radius
- Small React primitives for layout, surfaces, triggers, dialog shells, hint shells, and text treatment
- Visual framing that both modes can reuse without inheriting each other's logic

## Shared does not stay here

- Room-specific objects, hotspots, focus systems, or renderer behavior
- Classic-only section ordering, scan strategy, or content prioritization
- Business rules, feature state machines, or mode-specific data mapping logic

## Rule of thumb

- If it only answers "how does this look and compose?", shared UI is usually fine
- If it answers "what does this mode do?", keep it inside the owning feature
