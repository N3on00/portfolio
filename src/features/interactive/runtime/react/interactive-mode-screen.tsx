import { useEffect, useMemo, useRef, useState } from "react";
import { interactiveExperience, interactiveModeDefinition } from "@features/interactive";
import {
  createSceneRuntimeSession,
  getActiveInteractionTargets,
  getSceneOverlayContent,
} from "@features/interactive/scene";
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
import type { ActorReactionDefinition } from "@shared/actors";

const sceneDefinition = interactiveExperience.sceneRegistry[interactiveExperience.defaultSceneId];
const fallbackViewport = { width: 1280, height: 760 };

const reactionPresentationRegistry = {
  "project-overlay": {
    accent: "Projects",
    description: "Lead work opens in a denser overlay because it carries the deepest proof signals.",
    className: "is-project-overlay",
  },
  "mindset-panel": {
    accent: "Mindset",
    description: "Immersion-oriented objects stay lightweight and reflective instead of turning into full project modals.",
    className: "is-mindset-panel",
  },
  "story-panel": {
    accent: "Story",
    description: "Narrative fragments stay grouped in a side panel so they support the room instead of replacing it.",
    className: "is-story-panel",
  },
  "contact-panel": {
    accent: "Presence",
    description: "Social and contact signals stay practical and quick to scan.",
    className: "is-contact-panel",
  },
  "experience-panel": {
    accent: "Timeline",
    description: "Growth and progression use a structured panel instead of an interruptive modal.",
    className: "is-experience-panel",
  },
  "identity-panel": {
    accent: "Profile",
    description: "Identity remains compact and anchored in shared portfolio content.",
    className: "is-identity-panel",
  },
  "hint-layer": {
    accent: "Ambient",
    description: "Ambient reactions stay inline so they feel like guidance, not navigation.",
    className: "is-hint-layer",
  },
} as const;

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

function getReactionPresentation(reaction: ActorReactionDefinition | undefined) {
  if (!reaction) {
    return undefined;
  }

  return reactionPresentationRegistry[reaction.target as keyof typeof reactionPresentationRegistry] ?? {
    accent: reaction.type,
    description: "The reaction stays declarative and feature-owned, even when no target-specific styling is defined yet.",
    className: "is-generic-reaction",
  };
}

export function InteractiveModeScreen() {
  const sessionRef = useRef(createSceneRuntimeSession(sceneDefinition, performance.now()));
  const [snapshot, setSnapshot] = useState(() => sessionRef.current.snapshot());
  const [selectedActorId, setSelectedActorId] = useState<string>();
  const [inputMode, setInputMode] = useState<SceneInputMode>(getInputMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const updateInputMode = () => setInputMode(mediaQuery.matches ? "touch" : "pointer");
    const timer = window.setInterval(() => {
      setSnapshot(sessionRef.current.tick(performance.now()));
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
      getActiveInteractionTargets(snapshot.resolvedScene, snapshot.progress, {
        width: fallbackViewport.width,
        height: fallbackViewport.height,
        inputMode,
      }),
    [snapshot, inputMode],
  );

  const currentPhase = toCurrentPhase(snapshot.resolvedScene, snapshot.progress.currentPhaseId);
  const selectedActor = snapshot.resolvedScene.actors.find((actor) => actor.id === selectedActorId);
  const overlay = selectedActor ? getSceneOverlayContent(snapshot.resolvedScene, selectedActor.id) : undefined;
  const selectedActorState = selectedActor ? snapshot.actorState[selectedActor.actor.id] : undefined;
  const selectedAction = selectedActorState?.lastActionId
    ? selectedActor?.resolvedActor.actions.find((action) => action.id === selectedActorState.lastActionId)
    : undefined;
  const selectedReaction = selectedAction?.reaction;
  const selectedPresentation = getReactionPresentation(selectedReaction);

  const handleTargetActivate = (target: SceneInteractionTarget) => {
    const actor = snapshot.resolvedScene.actors.find((entry) => entry.id === target.actorId);

    if (!actor) {
      return;
    }

    setSelectedActorId(actor.id);
    setSnapshot(sessionRef.current.applyActorAction(actor.id, selectPrimaryAction(actor), performance.now()));
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
                Input mode: {inputMode}. Registered scene actors: {snapshot.resolvedScene.actors.length}. Completed interactions: {snapshot.progress.completedActorIds.length}.
              </Text>
            </Stack>
          </Panel>
        </Grid>

        <div className="interactive-room" aria-label={`${snapshot.resolvedScene.scene.label} scene`}>
          <div className="interactive-room__backdrop" aria-hidden="true">
            <div className="interactive-room__glow interactive-room__glow--left" />
            <div className="interactive-room__glow interactive-room__glow--right" />
          </div>

          <div className="interactive-room__canvas">
            {snapshot.resolvedScene.actors.map((actor) => {
              const isVisible = currentPhase.enabledActorIds.includes(actor.id);
              const isHintVisible =
                currentPhase.visibleHintActorIds.includes(actor.id) || snapshot.progress.shownHintActorIds.includes(actor.id);
              const target = activeTargets.find((entry) => entry.actorId === actor.id);
              const actorSnapshot = snapshot.actorState[actor.actor.id];

              return (
                <div
                  key={actor.id}
                  className={`interactive-room__object${isVisible ? " is-visible" : ""}${snapshot.progress.focusedActorId === actor.id ? " is-focused" : ""}`}
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
                      State: {actorSnapshot?.state ?? actor.resolvedActor.state.state}. Linked entries: {actor.resolvedActor.contentLinks.length}
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
              Triggered transitions: {snapshot.progress.triggeredIds.length}. Visible hints: {snapshot.progress.shownHintActorIds.length}.
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

      {selectedActor && overlay && selectedReaction?.type === "overlay" ? (
        <ModalShell
          eyebrow={`${selectedPresentation?.accent ?? selectedActor.actor.type} - ${selectedReaction.target}`}
          title={overlay.headline}
          footer={<ActionTrigger onClick={() => setSelectedActorId(undefined)}>Close</ActionTrigger>}
        >
          <Stack gap="sm" className={`interactive-reaction ${selectedPresentation?.className ?? ""}`}>
            <Text tone="muted">{selectedPresentation?.description}</Text>
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

      {selectedActor && overlay && selectedReaction && selectedReaction.type !== "overlay" ? (
        <div className={`interactive-room__detail-surface interactive-reaction ${selectedPresentation?.className ?? ""}`}>
          {selectedReaction.type === "panel" ? (
            <Panel as="aside" padding="md" tone="strong">
              <Stack gap="sm">
                <Eyebrow>{selectedPresentation?.accent ?? selectedReaction.target}</Eyebrow>
                <Heading as="h3" size="card">
                  {overlay.headline}
                </Heading>
                <Text tone="muted">{selectedAction?.intent}</Text>
                <Text size="sm" tone="muted">{selectedPresentation?.description}</Text>
                <Stack gap="sm">
                  {overlay.cards.map((card) => (
                    <Panel key={card.id} as="article" padding="sm">
                      <Stack gap="xs">
                        <Eyebrow>{card.eyebrow}</Eyebrow>
                        <Heading as="h4" size="card">
                          {card.title}
                        </Heading>
                        <Text>{card.body}</Text>
                      </Stack>
                    </Panel>
                  ))}
                </Stack>
                <ActionTrigger onClick={() => setSelectedActorId(undefined)}>Close panel</ActionTrigger>
              </Stack>
            </Panel>
          ) : (
            <HintShell label={selectedPresentation?.accent ?? selectedReaction.target} className="interactive-reaction__inline-hint">
              <Text>{selectedAction?.intent}</Text>
              <Text size="sm" tone="muted">{selectedPresentation?.description}</Text>
              {overlay.cards[0] ? <Text tone="muted">{overlay.cards[0].body}</Text> : null}
              <ActionTrigger variant="ghost" onClick={() => setSelectedActorId(undefined)}>
                Dismiss
              </ActionTrigger>
            </HintShell>
          )}
        </div>
      ) : null}
    </Surface>
  );
}
