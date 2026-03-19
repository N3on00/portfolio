import { useEffect, useMemo, useState } from "react";
import { interactiveExperience, interactiveModeDefinition } from "@features/interactive";
import { getSceneOverlayContent } from "@features/interactive/scene/scene-resolver";
import {
  createInitialSceneProgress,
  getActiveInteractionTargets,
  reduceSceneProgress,
} from "@features/interactive/scene/scene-progression";
import type { ActorActionKind } from "@shared/actors";
import type {
  ResolvedSceneActor,
  ResolvedSceneDefinition,
  SceneInputMode,
  SceneInteractionTarget,
} from "@features/interactive/scene/scene-contracts";
import {
  ActionTrigger,
  Eyebrow,
  Grid,
  Heading,
  HintShell,
  Inline,
  ModalShell,
  Panel,
  Stack,
  Surface,
  Text,
} from "@shared/ui/react";

const roomScene = interactiveExperience.getScene(interactiveExperience.defaultSceneId);
const fallbackViewport = { width: 1280, height: 760 };

const getInputMode = (): SceneInputMode => {
  if (typeof window === "undefined") {
    return "pointer";
  }

  return window.matchMedia("(pointer: coarse)").matches ? "touch" : "pointer";
};

const selectPrimaryAction = (actor: ResolvedSceneActor): ActorActionKind => {
  const preferredAction = actor.resolvedActor.actions.find((action) => action.kind === "open-content" && action.available);

  if (preferredAction) {
    return preferredAction.kind;
  }

  const fallbackAction = actor.resolvedActor.actions.find(
    (action) => (action.kind === "inspect" || action.kind === "focus" || action.kind === "advance") && action.available,
  );

  return fallbackAction?.kind ?? "focus";
};

function toCurrentPhase(resolvedScene: ResolvedSceneDefinition, phaseId: string) {
  return resolvedScene.scene.phases.find((phase) => phase.id === phaseId) ?? resolvedScene.scene.phases[0];
}

export function InteractiveModeScreen() {
  const [progress, setProgress] = useState(() => createInitialSceneProgress(roomScene, performance.now()));
  const [selectedActorId, setSelectedActorId] = useState<string>();
  const [inputMode, setInputMode] = useState<SceneInputMode>(getInputMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateInputMode = () => setInputMode(mediaQuery.matches ? "touch" : "pointer");
    const timer = window.setInterval(() => {
      setProgress((current) => reduceSceneProgress(roomScene, current, { kind: "tick", atMs: performance.now() }));
    }, 500);

    updateInputMode();
    mediaQuery.addEventListener("change", updateInputMode);

    return () => {
      window.clearInterval(timer);
      mediaQuery.removeEventListener("change", updateInputMode);
    };
  }, []);

  const activeTargets = useMemo(
    () =>
      getActiveInteractionTargets(roomScene, progress, {
        width: fallbackViewport.width,
        height: fallbackViewport.height,
        inputMode,
      }),
    [progress, inputMode],
  );

  const currentPhase = toCurrentPhase(roomScene, progress.currentPhaseId);
  const selectedActor = roomScene.actors.find((actor) => actor.id === selectedActorId);
  const overlay = selectedActor ? getSceneOverlayContent(roomScene, selectedActor.id) : undefined;

  const handleTargetActivate = (target: SceneInteractionTarget) => {
    const actor = roomScene.actors.find((entry) => entry.id === target.actorId);

    if (!actor) {
      return;
    }

    setSelectedActorId(actor.id);
    setProgress((current) =>
      reduceSceneProgress(roomScene, current, {
        kind: "actor-action",
        actorId: actor.id,
        actionKind: selectPrimaryAction(actor),
        atMs: performance.now(),
      }),
    );
  };

  return (
    <Surface as="section" padding="lg" aria-labelledby="interactive-mode-title">
      <Stack gap="lg">
        <Stack gap="sm">
          <Eyebrow>Interactive runtime foundation</Eyebrow>
          <Heading as="h2" size="section" id="interactive-mode-title">
            {interactiveModeDefinition.label}
          </Heading>
          <Text tone="muted" size="lg">
            The React adapter now renders the shared scene model directly: timed progression, actor hotspots, and overlay content all resolve from the same contracts.
          </Text>
        </Stack>

        <Grid>
          <Panel as="article">
            <Stack gap="sm">
              <Eyebrow>Current phase</Eyebrow>
              <Heading as="h3" size="card">
                {currentPhase.label}
              </Heading>
              <Text>{currentPhase.description}</Text>
            </Stack>
          </Panel>

          <Panel as="article">
            <Stack gap="sm">
              <Eyebrow>Interaction coverage</Eyebrow>
              <Heading as="h3" size="card">
                {activeTargets.length} active hotspots
              </Heading>
              <Text>
                Input mode: {inputMode}. Registered scene actors: {roomScene.actors.length}. Completed interactions: {progress.completedActorIds.length}.
              </Text>
            </Stack>
          </Panel>
        </Grid>

        <div className="interactive-room" aria-label={`${roomScene.scene.label} scene`}>
          <div className="interactive-room__backdrop" aria-hidden="true">
            <div className="interactive-room__glow interactive-room__glow--left" />
            <div className="interactive-room__glow interactive-room__glow--right" />
          </div>

          <div className="interactive-room__canvas">
            {roomScene.actors.map((actor) => {
              const isVisible = currentPhase.enabledActorIds.includes(actor.id);
              const isHintVisible =
                currentPhase.visibleHintActorIds.includes(actor.id) || progress.shownHintActorIds.includes(actor.id);
              const target = activeTargets.find((entry) => entry.actorId === actor.id);

              return (
                <div
                  key={actor.id}
                  className={`interactive-room__object${isVisible ? " is-visible" : ""}${progress.focusedActorId === actor.id ? " is-focused" : ""}`}
                  style={{
                    left: `${actor.placement.x * 100}%`,
                    top: `${actor.placement.y * 100}%`,
                    width: `${actor.placement.width * 100}%`,
                    height: `${actor.placement.height * 100}%`,
                    zIndex: actor.placement.zIndex,
                  }}
                >
                  <div className="interactive-room__object-card">
                    <Eyebrow>{actor.actor.type}</Eyebrow>
                    <Heading as="h3" size="card">
                      {actor.label}
                    </Heading>
                    <Text size="sm" tone="muted">
                      {actor.resolvedActor.contentLinks.length} linked entries
                    </Text>
                  </div>

                  {target ? (
                    <button
                      type="button"
                      className="interactive-room__hotspot"
                      style={{
                        left: `${target.x * 100}%`,
                        top: `${target.y * 100}%`,
                        width: `${target.width * 100}%`,
                        height: `${target.height * 100}%`,
                      }}
                      onClick={() => handleTargetActivate(target)}
                      aria-label={`${target.label}: ${target.hintLabel ?? "open details"}`}
                    >
                      <span className="interactive-room__hotspot-ring" />
                    </button>
                  ) : null}

                  {isHintVisible && actor.hint ? (
                    <div className="interactive-room__hint">
                      <Text size="sm">{actor.hint.label}</Text>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <Grid minItemWidth="18rem">
          <Panel as="article" padding="sm">
            <Stack gap="sm">
              <Eyebrow>Accessible fallback</Eyebrow>
              <Heading as="h3" size="card">
                Active interaction list
              </Heading>
              <Stack gap="xs">
                {activeTargets.map((target) => (
                  <Inline key={target.actorId} justify="space-between" align="center" className="interactive-room__target-row">
                    <div>
                      <Text>{target.label}</Text>
                      {target.hintLabel ? <Text size="sm" tone="muted">{target.hintLabel}</Text> : null}
                    </div>
                    <ActionTrigger variant="outline" tone="accent" onClick={() => handleTargetActivate(target)}>
                      Open
                    </ActionTrigger>
                  </Inline>
                ))}
              </Stack>
            </Stack>
          </Panel>

          <HintShell label="Scene progression">
            <Text>
              The room starts in observation mode, nudges the PC after a delay, and opens the rest of the room once project exploration begins.
            </Text>
            <Text size="sm" tone="muted">
              Triggered transitions: {progress.triggeredIds.length}. Visible hints: {progress.shownHintActorIds.length}.
            </Text>
          </HintShell>
        </Grid>

        <Stack gap="sm" aria-label="Interactive extension points">
          {interactiveModeDefinition.extensionPoints.map((item) => (
            <Panel key={item} as="article" padding="sm">
              <Stack gap="xs">
                <Eyebrow>Extension point</Eyebrow>
                <Heading as="h3" size="card">
                  {item}
                </Heading>
                <Text tone="muted">Implement behind registries or adapters instead of route-level hardcoding.</Text>
              </Stack>
            </Panel>
          ))}
        </Stack>
      </Stack>

      {selectedActor && overlay ? (
        <ModalShell
          eyebrow={selectedActor.actor.type}
          title={overlay.headline}
          footer={<ActionTrigger onClick={() => setSelectedActorId(undefined)}>Close</ActionTrigger>}
        >
          <Stack gap="sm">
            {overlay.cards.map((card) => (
              <Panel key={card.id} as="article" padding="sm">
                <Stack gap="xs">
                  <Eyebrow>{card.eyebrow}</Eyebrow>
                  <Heading as="h4" size="card">
                    {card.title}
                  </Heading>
                  <Text>{card.body}</Text>
                  {card.tags.length ? (
                    <Inline gap="xs" wrap>
                      {card.tags.map((tag) => (
                        <Text key={tag} size="sm" tone="muted" className="interactive-room__tag">
                          {tag}
                        </Text>
                      ))}
                    </Inline>
                  ) : null}
                </Stack>
              </Panel>
            ))}
          </Stack>
        </ModalShell>
      ) : null}
    </Surface>
  );
}
