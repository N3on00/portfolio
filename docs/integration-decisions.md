# Integration Decisions

- Keep routing in `src/app` and runtime mounting in `src/runtime/react`; feature modules only expose their mode entrypoints.
- Keep shared content as the single durable source; classic sections and interactive overlays resolve from the same entity graph.
- Keep classic-specific structure in the classic feature, but remove stale duplicate file paths and broken type seams that shadowed the shared graph.
- Keep interactive actor registrations mode-local, but realign their linked content to valid shared collections instead of ad hoc local ids.
- Prefer targeted fixes over broad rewrites: type seams, stale exports, and duplicate classic files were corrected without moving domain ownership across layers.
