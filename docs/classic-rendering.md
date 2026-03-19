# Classic Rendering System

## Existing shared foundation

- `src/shared/content/portfolio-content.ts` is now the single portfolio knowledge base.
- `src/shared/types/portfolio.ts` defines typed entities, relations, and mode mappings.
- `content.modeMappings` defines the classic and interactive traversal roots.
- `src/shared/actors` provides the shared actor and resolver system used for both modes.

## Considered approaches

### 1. Section-specific adapters

- Each classic section owns its own mapper from shared content to local props.
- Good: fast to ship and easy to reason about per section.
- Weak: mapping logic drifts into many files, duplication grows, and cross-mode reuse stays limited.

### 2. Fully normalized universal blocks

- All shared content is stored as abstract text/media/list blocks and both modes render those blocks directly.
- Good: strong data/presentation separation and high renderer reuse.
- Weak: the content model becomes too generic, loses portfolio semantics, and interactive mode mappings become awkward.

### 3. Shared actors + mode mappings + renderer blocks

- Shared entities and relations hold the canonical content graph.
- Shared mode mappings decide which surfaces traverse which parts of that graph.
- Mode-specific section actors bind the classic surfaces to generic render blocks and then to HTML.
- Good: high reuse, low duplication, clear extension path, and clean separation between content, mapping, and presentation.
- Weak: slightly more setup than per-section adapters.

## Chosen approach

Approach 3 is the best fit.

- Reuse: the actor catalog can feed both classic and interactive mode.
- Duplication: projects, references, skills, and profile copy exist once in the shared entity graph.
- Extendability: new section order or renderer variants only require mapping or renderer changes.
- Separation: shared content stays mode-agnostic while classic rendering stays presentation-focused.

## Implemented flow

1. `portfolioContent` defines shared `entities`, `relations`, and `modeMappings`.
2. `classicSectionRegistry` in `src/features/classic/classic-sections.ts` defines section order, labels, and surface bindings.
3. `classicSectionActors` in `src/features/classic/classic-section-actors.ts` bind those sections into the shared actor system.
4. `createClassicRenderDocument` in `src/features/classic/classic-render-flow.ts` resolves shared surfaces into generic render blocks.
5. `renderClassicDocument` in `src/features/classic/classic-renderer.ts` turns those blocks into reduced monochrome HTML.

## Resulting module split

- `src/shared/*`: data model, content, and shared tokens
- `src/features/classic/classic-sections.ts`: section registry and ordering
- `src/features/classic/classic-section-actors.ts`: classic actor bindings onto shared mappings
- `src/features/classic/classic-rendering-types.ts`: classic document and block contracts
- `src/features/classic/classic-render-flow.ts`: mapping layer from shared graph to classic render model
- `src/features/classic/classic-renderer.ts`: presentation-only HTML renderer

## Notes

- No content is hardcoded inside classic UI components.
- Section order remains configurable through shared mappings.
- The renderer stays black and white in spirit, with shared tokens only used for spacing, type, and neutral surfaces.
