import { classicModeDefinition } from "@features/classic/classic-mode.contract";
import { classicRenderDocument } from "@features/classic/classic-mode.runtime";
import { classicSectionRegistry } from "@features/classic/sections/section-registry";
import {
  createPortfolioEntityIndex,
  getPortfolioModeMapping,
  resolvePortfolioSurface,
} from "@shared/content/portfolio-graph";
import { portfolioContent } from "@shared/content/portfolio-content";

export function ClassicModeScreen() {
  const entityIndex = createPortfolioEntityIndex(portfolioContent);
  const rootEntity = entityIndex.get(portfolioContent.rootPortfolioId);
  const classicMapping = getPortfolioModeMapping(portfolioContent, "classic");
  const resolvedSurfaces = (classicMapping?.surfaces ?? []).map((surface) =>
    resolvePortfolioSurface(portfolioContent, surface),
  );

  return (
    <section className="mode-surface" aria-labelledby="classic-mode-title">
      <header className="mode-surface__header">
        <p className="surface-label">Classic runtime foundation</p>
        <h2 id="classic-mode-title" className="mode-surface__title">
          {classicModeDefinition.label}
        </h2>
        <p className="mode-surface__lede">
          The classic route now reads shared surfaces and renders scan-first sections from the unified content graph.
        </p>
      </header>

      <div className="mode-surface__grid">
        <article className="module-card module-card--mono">
          <p className="card-label">Section registry</p>
          <h3 className="module-card__title">Composable overview</h3>
          <p className="card-text">
            Registered sections: {classicSectionRegistry.length}. Rendered sections: {classicRenderDocument.sections.length}.
          </p>
        </article>

        <article className="module-card module-card--mono">
          <p className="card-label">Shared graph</p>
          <h3 className="module-card__title">Mapped, not duplicated</h3>
          <p className="card-text">
            Root entity: {rootEntity?.title ?? "Portfolio"}. Shared entities: {portfolioContent.entities.length}. Classic surfaces:{" "}
            {resolvedSurfaces.length}.
          </p>
        </article>
      </div>

      <div className="section-list" aria-label="Classic sections">
        {classicRenderDocument.sections.map((section) => {
          const surface = classicMapping?.surfaces.find((entry) => entry.id === section.id);

          return (
            <div key={section.id} className="section-item">
              <p className="section-item__label">Section</p>
              <h3 className="section-item__title">{section.title}</h3>
              <p className="section-item__value">Blocks: {section.blocks.length}. Root entities: {surface?.rootEntityIds.length ?? 0}.</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
