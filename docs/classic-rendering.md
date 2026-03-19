# Classic Rendering System

## Existing shared foundation

- `src/shared/content/portfolio-content.ts` is now the single portfolio knowledge base.
- `src/shared/types/portfolio.ts` separates sections, actors, and mode mappings.
- `content.mappings.classic` defines order and renderer intent for the classic mode.
- `content.mappings.interactive` keeps the same actor catalog available to the interactive mode.

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

- Shared actors hold the canonical content.
- Shared mode mappings decide which actors appear in which mode surface and in what order.
- Classic mode converts those mappings into generic render blocks and then renders them.
- Good: high reuse, low duplication, clear extension path, and clean separation between content, mapping, and presentation.
- Weak: slightly more setup than per-section adapters.

## Chosen approach

Approach 3 is the best fit.

- Reuse: the actor catalog can feed both classic and interactive mode.
- Duplication: projects, references, skills, and profile copy exist once.
- Extendability: new section order or renderer variants only require mapping or renderer changes.
- Separation: shared content stays mode-agnostic while classic rendering stays presentation-focused.

## Implemented flow

1. `portfolioContent` defines `sections`, `actors`, and per-mode `mappings`.
2. `createClassicRenderDocument` in `src/features/classic/classic-rendering-flow.ts` resolves actor ids into generic render blocks.
3. `renderClassicDocument` in `src/features/classic/classic-renderer.ts` turns those blocks into reduced monochrome HTML.
4. `src/features/classic/classic-mode.runtime.ts` exposes a ready-to-render classic document and HTML output.

## Resulting module split

- `src/shared/*`: data model, content, and shared tokens
- `src/features/classic/classic-rendering.types.ts`: classic document and block contracts
- `src/features/classic/classic-rendering-flow.ts`: mapping layer from shared data to classic render model
- `src/features/classic/classic-renderer.ts`: presentation-only HTML renderer

## Notes

- No content is hardcoded inside classic UI components.
- Section order remains configurable through shared mappings.
- The renderer stays black and white in spirit, with shared tokens only used for spacing, type, and neutral surfaces.
