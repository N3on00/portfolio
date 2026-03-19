# Integration Decisions

- Keep routing in `src/app` and runtime mounting in `src/runtime/react`; feature modules only expose their mode entrypoints.
- Keep shared content as the single durable source; classic sections and interactive overlays resolve from the same entity graph.
- Keep classic-specific structure in the classic feature, but remove stale duplicate file paths and broken type seams that shadowed the shared graph.
- Keep the classic React screen on top of the same `ClassicRenderDocument` used for HTML output so classic mode has one document model and multiple render adapters.
- Keep classic scan order declarative in the section registry so section priority changes do not require renderer rewrites.
- Keep interactive actor registrations mode-local, but realign their linked content to valid shared collections instead of ad hoc local ids.
- Keep the interactive React adapter renderer-thin: it reduces scene progression and renders hotspots, but the scene contract remains the source of timing, placement, and content linkage.
- Keep actor state mutable only inside a dedicated runtime session so React screens consume snapshots instead of owning cross-actor progression rules.
- Keep reaction routing declarative on actor actions; the React adapter decides only how to present `overlay`, `panel`, or `inline`, not which actor gets special treatment.
- Prefer targeted fixes over broad rewrites: type seams, stale exports, and duplicate classic files were corrected without moving domain ownership across layers.
