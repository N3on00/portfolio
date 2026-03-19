import { createActorRegistry } from "@shared/actors";
import type { ActorDefinition, ActorPlacement } from "@shared/actors";

export const interactiveActorDefinitions: ActorDefinition[] = [
  {
    id: "gaming-pc",
    type: "project-terminal",
    label: "Gaming PC",
    capabilities: ["inspectable", "triggerable", "linked-content", "gated-progression"],
    defaultState: "idle",
    states: ["idle", "available", "focused", "active", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "desk-center", order: 1 }],
    actions: [
      {
        id: "pc-focus",
        kind: "focus",
        label: "Focus PC",
        intent: "Make the PC the obvious next step after the observation phase.",
        effects: [{ type: "set-state", state: "focused" }],
      },
      {
        id: "pc-open-projects",
        kind: "open-content",
        label: "Open projects",
        intent: "Start the guided project exploration without turning the room into a puzzle.",
        reaction: { type: "overlay", target: "project-overlay", variant: "content-block" },
        effects: [
          { type: "set-state", state: "active" },
          { type: "set-flag", flag: "guided-exploration-started" },
        ],
      },
      {
        id: "pc-complete",
        kind: "advance",
        label: "Continue exploring",
        intent: "Unlock the wider room after the first clear step.",
        requirements: { requiredFlags: ["guided-exploration-started"] },
        effects: [{ type: "set-state", state: "completed" }],
      },
    ],
    contentLinks: [
      { id: "pc-project-spotonsight", collection: "projects", contentId: "project-spotonsight", role: "primary", required: true },
      { id: "pc-project-payqr", collection: "projects", contentId: "project-pay-qr", role: "secondary" },
      { id: "pc-project-weather", collection: "projects", contentId: "project-better-weather", role: "secondary" },
    ],
    metadata: {
      rendererKey: "desk-pc",
      interactionZone: { x: 0.01, y: 0.02, width: 0.13, height: 0.14, minTouchTargetPx: 52 },
    },
  },
  {
    id: "racing-wheel",
    type: "skill-surface",
    label: "Lenkrad",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "desk-lower", order: 2 }],
    actions: [
      {
        id: "wheel-inspect",
        kind: "inspect",
        label: "Inspect wheel",
        intent: "Show how immersion and simulation thinking influence the work.",
        reaction: { type: "panel", target: "mindset-panel", variant: "immersion" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "wheel-skill-full-stack", collection: "skills", contentId: "skill-full-stack", role: "primary" },
      { id: "wheel-story-builder", collection: "story-hints", contentId: "story-builder", role: "secondary" },
    ],
    metadata: {
      rendererKey: "racing-wheel",
      interactionZone: { x: 0, y: 0, width: 0.12, height: 0.14, minTouchTargetPx: 48 },
    },
  },
  {
    id: "vr-headset",
    type: "skill-surface",
    label: "VR-Headset",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "desk-left", order: 3 }],
    actions: [
      {
        id: "vr-inspect",
        kind: "inspect",
        label: "Inspect VR headset",
        intent: "Reveal curiosity for experimental interfaces.",
        reaction: { type: "panel", target: "story-panel", variant: "experimental" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "vr-skill-frontend", collection: "skills", contentId: "skill-frontend-vue", role: "secondary" },
      { id: "vr-skill-architecture", collection: "skills", contentId: "skill-architecture-docs", role: "secondary" },
      { id: "vr-story-architecture", collection: "story-hints", contentId: "story-architecture", role: "primary" },
    ],
    metadata: {
      rendererKey: "vr-headset",
      interactionZone: { x: 0, y: 0, width: 0.12, height: 0.12, minTouchTargetPx: 48 },
    },
  },
  {
    id: "desk-headset",
    type: "audio-social-surface",
    label: "Headset",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "desk-right", order: 4 }],
    actions: [
      {
        id: "headset-inspect",
        kind: "inspect",
        label: "Inspect headset",
        intent: "Tie collaboration signals to the scene without hardcoding copy in the view.",
        reaction: { type: "panel", target: "contact-panel", variant: "presence" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "headset-contact-github", collection: "contact-links", contentId: "github-profile", role: "primary" },
      { id: "headset-story-builder", collection: "story-hints", contentId: "story-builder", role: "secondary" },
    ],
    metadata: {
      rendererKey: "desk-headset",
      interactionZone: { x: 0, y: 0, width: 0.1, height: 0.13, minTouchTargetPx: 44 },
    },
  },
  {
    id: "soundbar-clock",
    type: "ambient-surface",
    label: "Soundbar / Wecker",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "shelf-left", order: 5 }],
    actions: [
      {
        id: "soundbar-inspect",
        kind: "inspect",
        label: "Inspect soundbar",
        intent: "Show rhythm, setup, and everyday working atmosphere.",
        reaction: { type: "inline", target: "hint-layer", variant: "ambient" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "soundbar-open-pc", collection: "story-hints", contentId: "hint-open-pc", role: "primary" },
      { id: "soundbar-read-notes", collection: "story-hints", contentId: "hint-read-notes", role: "secondary" },
    ],
    metadata: {
      rendererKey: "soundbar-clock",
      interactionZone: { x: 0, y: 0, width: 0.16, height: 0.1, minTouchTargetPx: 44 },
    },
  },
  {
    id: "wall-calendar",
    type: "experience-anchor",
    label: "Kalender",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "wall-right", order: 6 }],
    actions: [
      {
        id: "calendar-inspect",
        kind: "inspect",
        label: "Inspect calendar",
        intent: "Anchor the planning and progression side of the portfolio.",
        reaction: { type: "panel", target: "experience-panel", variant: "timeline" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "calendar-experience-flow", collection: "experience", contentId: "experience-junior-builder", role: "primary" },
      { id: "calendar-experience-coursework", collection: "experience", contentId: "experience-structured-coursework", role: "secondary" },
    ],
    metadata: {
      rendererKey: "wall-calendar",
      interactionZone: { x: 0, y: 0, width: 0.12, height: 0.18, minTouchTargetPx: 44 },
    },
  },
  {
    id: "post-it-cluster",
    type: "experience-anchor",
    label: "Post-its",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "wall-left", order: 7 }],
    actions: [
      {
        id: "postits-inspect",
        kind: "inspect",
        label: "Inspect post-its",
        intent: "Translate small planning artifacts into a content-driven story surface.",
        reaction: { type: "panel", target: "story-panel", variant: "documentation" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "postits-story-docs", collection: "story-hints", contentId: "story-documentation", role: "primary" },
      { id: "postits-check-map", collection: "story-hints", contentId: "hint-check-map", role: "secondary" },
    ],
    metadata: {
      rendererKey: "post-it-cluster",
      interactionZone: { x: 0, y: 0, width: 0.14, height: 0.14, minTouchTargetPx: 44 },
    },
  },
  {
    id: "personal-hints",
    type: "personality-surface",
    label: "Persoenliche Hinweise",
    capabilities: ["inspectable", "linked-content"],
    defaultState: "idle",
    states: ["idle", "focused", "completed"],
    placements: [{ mode: "interactive", surface: "room", slot: "bedside", order: 8 }],
    actions: [
      {
        id: "personal-inspect",
        kind: "inspect",
        label: "Inspect personal hints",
        intent: "Show personality without turning the room into a special-case biography component.",
        reaction: { type: "panel", target: "identity-panel", variant: "profile" },
        effects: [{ type: "set-state", state: "focused" }],
      },
    ],
    contentLinks: [
      { id: "personal-identity", collection: "identity", contentId: "portfolio-patrik-egger", role: "primary" },
      { id: "personal-story-builder", collection: "story-hints", contentId: "story-builder", role: "secondary" },
    ],
    metadata: {
      rendererKey: "personal-hints",
      interactionZone: { x: 0, y: 0, width: 0.14, height: 0.18, minTouchTargetPx: 44 },
    },
  },
];

export const interactiveScenePlacements: ActorPlacement[] = interactiveActorDefinitions.flatMap(
  (actor) => actor.placements,
);

export const interactiveActorRegistry = createActorRegistry(interactiveActorDefinitions);
