import { interactiveModeDefinition } from "@features/interactive/interactive-mode.contract";
import { interactiveActorRegistry } from "@features/interactive/scene/actor-registry";
import { roomSceneDefinition } from "@features/interactive/scene/room-scene";
import { resolveScene } from "@features/interactive/scene/scene-resolver";
import { getPortfolioModeMapping } from "@shared/content/portfolio-graph";
import { portfolioContent } from "@shared/content/portfolio-content";

export function InteractiveModeScreen() {
  const interactiveMapping = getPortfolioModeMapping(portfolioContent, "interactive");
  const resolvedScene = resolveScene(roomSceneDefinition);
  const projectCount = portfolioContent.entities.filter((entity) => entity.kind === "project").length;

  return (
    <section className="mode-surface" aria-labelledby="interactive-mode-title">
      <header className="mode-surface__header">
        <p className="surface-label">Interactive runtime foundation</p>
        <h2 id="interactive-mode-title" className="mode-surface__title">
          {interactiveModeDefinition.label}
        </h2>
        <p className="mode-surface__lede">
          React hosts the shell and routing, while the scene, actors, and overlays stay driven by the shared content graph.
        </p>
      </header>

      <div className="mode-surface__grid">
        <article className="module-card">
          <p className="card-label">Registry status</p>
          <h3 className="module-card__title">Actors before visuals</h3>
          <p className="card-text">
            Registered actor types: {interactiveActorRegistry.listActors().length}. Scene placements: {roomSceneDefinition.actors.length}.
          </p>
        </article>

        <article className="module-card">
          <p className="card-label">Shared content</p>
          <h3 className="module-card__title">Single source of truth</h3>
          <p className="card-text">Projects available for overlays: {projectCount}. Shared interactive surfaces: {interactiveMapping?.surfaces.length ?? 0}.</p>
        </article>

        <article className="module-card">
          <p className="card-label">Extension points</p>
          <h3 className="module-card__title">Runtime-ready seams</h3>
          <p className="card-text">Renderer, interactions, popups, and ambience stay separate from shell wiring.</p>
        </article>
      </div>

      <div className="registry-list" aria-label="Interactive extension points">
        {resolvedScene.actors.slice(0, 3).map((sceneActor) => (
          <div key={sceneActor.id} className="registry-item">
            <p className="registry-item__label">Scene actor</p>
            <h3 className="registry-item__title">{sceneActor.label}</h3>
            <p className="registry-item__value">Linked content cards: {sceneActor.resolvedActor.contentLinks.length}. Hint: {sceneActor.hint?.label ?? "none"}.</p>
          </div>
        ))}
        {interactiveModeDefinition.extensionPoints.map((item) => (
          <div key={item} className="registry-item">
            <p className="registry-item__label">Extension point</p>
            <h3 className="registry-item__title">{item}</h3>
            <p className="registry-item__value">Implement behind registries or adapters instead of route-level hardcoding.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
