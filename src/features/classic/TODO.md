# Classic Mode TODO

## Scope owned by this module

- Reduced portfolio overview
- Fast project, skill, experience, and contact access
- Minimal black and white presentation rules

## Parallel work suggestions

- Done: React runtime adapter exists for the classic route surface
- Done: section registry defines structural mounting points for shared content
- Done: shared layout, surface, and typography primitives now provide the reusable visual base
- Done: classic render flow now resolves shared surfaces into buildable sections without a classic-only content fork
- Done: runtime screen, render flow, and renderer types are aligned on the same section document model
- Next: define final section ordering and scan priority

## Guardrails

- Keep this mode fast and lightweight
- Avoid interactive-mode scene concepts in this module
- Preserve shared routing and shell integration contracts
