import type { InteractiveSceneDefinition } from "./scene-contracts";

export const roomSceneDefinition: InteractiveSceneDefinition = {
  id: "bedroom-studio",
  label: "Bedroom Studio",
  synopsis:
    "First concrete scene for the interactive portfolio. The visitor observes the room, notices a delayed PC cue, and then moves into lightweight guided exploration.",
  entryPhaseId: "observe",
  phases: [
    {
      id: "observe",
      label: "Observe",
      description: "Let the room breathe before asking for interaction.",
      enabledActorIds: [],
      visibleHintActorIds: [],
    },
    {
      id: "guided-exploration",
      label: "Guided exploration",
      description: "After a short delay, the PC becomes the clear first interaction.",
      enabledActorIds: ["gaming-pc"],
      visibleHintActorIds: ["gaming-pc"],
    },
    {
      id: "open-exploration",
      label: "Open exploration",
      description: "The rest of the room opens up after the PC starts the guided flow.",
      enabledActorIds: [
        "gaming-pc",
        "racing-wheel",
        "vr-headset",
        "desk-headset",
        "soundbar-clock",
        "wall-calendar",
        "post-it-cluster",
        "personal-hints",
      ],
      visibleHintActorIds: ["racing-wheel", "vr-headset", "wall-calendar", "post-it-cluster"],
    },
  ],
  triggers: [
    {
      id: "show-pc-trigger",
      once: true,
      condition: {
        kind: "timer",
        phaseId: "observe",
        afterMs: 7000,
      },
      effects: [
        { kind: "set-phase", phaseId: "guided-exploration" },
        { kind: "show-hint", actorId: "gaming-pc" },
        { kind: "focus-actor", actorId: "gaming-pc" },
      ],
    },
    {
      id: "open-room-after-pc",
      once: true,
      condition: {
        kind: "actor-action",
        phaseId: "guided-exploration",
        actorId: "gaming-pc",
        actionKind: "open-content",
      },
      effects: [{ kind: "set-phase", phaseId: "open-exploration" }],
    },
  ],
  actors: [
    {
      id: "gaming-pc",
      actorId: "gaming-pc",
      label: "Gaming PC",
      placement: { x: 0.56, y: 0.42, width: 0.16, height: 0.2, layer: "midground", zIndex: 5 },
      hint: { label: "Boot the PC", tone: "guided" },
    },
    {
      id: "racing-wheel",
      actorId: "racing-wheel",
      label: "Lenkrad",
      placement: { x: 0.48, y: 0.6, width: 0.12, height: 0.14, layer: "foreground", zIndex: 6 },
      hint: { label: "See how immersion shapes the work", tone: "ambient" },
    },
    {
      id: "vr-headset",
      actorId: "vr-headset",
      label: "VR-Headset",
      placement: { x: 0.34, y: 0.56, width: 0.12, height: 0.12, layer: "foreground", zIndex: 6 },
      hint: { label: "Explore experimental interfaces", tone: "ambient" },
    },
    {
      id: "desk-headset",
      actorId: "desk-headset",
      label: "Headset",
      placement: { x: 0.7, y: 0.48, width: 0.09, height: 0.13, layer: "midground", zIndex: 4 },
    },
    {
      id: "soundbar-clock",
      actorId: "soundbar-clock",
      label: "Soundbar / Wecker",
      placement: { x: 0.2, y: 0.5, width: 0.16, height: 0.1, layer: "midground", zIndex: 3 },
    },
    {
      id: "wall-calendar",
      actorId: "wall-calendar",
      label: "Kalender",
      placement: { x: 0.76, y: 0.18, width: 0.12, height: 0.18, layer: "background", zIndex: 2 },
      hint: { label: "See how planning stays lightweight", tone: "ambient" },
    },
    {
      id: "post-it-cluster",
      actorId: "post-it-cluster",
      label: "Post-its",
      placement: { x: 0.18, y: 0.24, width: 0.14, height: 0.14, layer: "background", zIndex: 2 },
      hint: { label: "Read quick thought fragments", tone: "reward" },
    },
    {
      id: "personal-hints",
      actorId: "personal-hints",
      label: "Persoenliche Hinweise",
      placement: { x: 0.06, y: 0.62, width: 0.14, height: 0.18, layer: "foreground", zIndex: 4 },
    },
  ],
};
