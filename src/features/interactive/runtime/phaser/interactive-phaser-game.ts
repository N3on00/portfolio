import Phaser from "phaser";
import { interactiveExperience, interactiveModeDefinition } from "@features/interactive";
import {
  createSceneRuntimeSession,
  getActiveInteractionTargets,
  getSceneOverlayContent,
} from "@features/interactive/scene";
import type {
  ActorActionKind,
  ActorReactionDefinition,
} from "@shared/actors";
import type {
  ResolvedSceneActor,
  ResolvedSceneDefinition,
  SceneInputMode,
  SceneInteractionTarget,
} from "@features/interactive/scene/scene-contracts";
import { preloadPhaserImageAssets } from "./phaser-asset-registry";
import { drawRoundedPanel, drawText } from "./phaser-primitives";
import { drawActorVisual, drawRoomEnvironment } from "./phaser-room-art";
import { bodyStyle, eyebrowStyle, gameHeight, gameWidth, headingStyle, smallStyle, titleStyle, ui } from "./phaser-theme";

const sceneDefinition = interactiveExperience.sceneRegistry[interactiveExperience.defaultSceneId];

const reactionPresentationRegistry = {
  "project-overlay": {
    accent: "Projects",
    description: "Lead work opens as a denser overlay because it carries the strongest proof signals.",
  },
  "mindset-panel": {
    accent: "Mindset",
    description: "Immersion-oriented objects stay lightweight and reflective instead of becoming full project modals.",
  },
  "story-panel": {
    accent: "Story",
    description: "Narrative fragments stay grouped so they support the room rather than replace it.",
  },
  "contact-panel": {
    accent: "Presence",
    description: "Social and contact signals stay practical and quick to scan.",
  },
  "experience-panel": {
    accent: "Timeline",
    description: "Growth and progression use structure instead of interruption.",
  },
  "identity-panel": {
    accent: "Profile",
    description: "Identity remains compact and anchored in shared portfolio content.",
  },
  "hint-layer": {
    accent: "Ambient",
    description: "Ambient reactions stay lightweight guidance.",
  },
} as const;


function getInputMode(): SceneInputMode {
  if (typeof window === "undefined") {
    return "pointer";
  }

  return window.matchMedia("(pointer: coarse)").matches ? "touch" : "pointer";
}

function selectPrimaryAction(actor: ResolvedSceneActor): ActorActionKind {
  const preferredAction = actor.resolvedActor.actions.find((action) => action.kind === "open-content" && action.available);

  if (preferredAction) {
    return preferredAction.kind;
  }

  const fallbackAction = actor.resolvedActor.actions.find(
    (action) => (action.kind === "inspect" || action.kind === "focus" || action.kind === "advance") && action.available,
  );

  return fallbackAction?.kind ?? "focus";
}

function toCurrentPhase(resolvedScene: ResolvedSceneDefinition, phaseId: string) {
  return resolvedScene.scene.phases.find((phase) => phase.id === phaseId) ?? resolvedScene.scene.phases[0];
}

function getReactionPresentation(reaction: ActorReactionDefinition | undefined) {
  if (!reaction) {
    return undefined;
  }

  return reactionPresentationRegistry[reaction.target as keyof typeof reactionPresentationRegistry] ?? {
    accent: reaction.type,
    description: "The reaction stays declarative even when no target-specific presentation is defined.",
  };
}

class InteractivePortfolioPhaserScene extends Phaser.Scene {
  private session = createSceneRuntimeSession(sceneDefinition, 0);
  private snapshot = this.session.snapshot();
  private selectedActorId?: string;
  private root?: Phaser.GameObjects.Container;
  private lastTickAt = 0;
  private inputMode: SceneInputMode = getInputMode();
  private mediaQuery?: MediaQueryList;
  private mediaQueryHandler?: () => void;

  constructor() {
    super("interactive-portfolio-phaser");
  }

  preload() {
    preloadPhaserImageAssets(this);
  }

  create() {
    this.cameras.main.setBackgroundColor(ui.background);
    this.scale.on(Phaser.Scale.Events.RESIZE, this.renderScene, this);

    if (typeof window !== "undefined") {
      this.mediaQuery = window.matchMedia("(pointer: coarse)");
      this.mediaQueryHandler = () => {
        this.inputMode = this.mediaQuery?.matches ? "touch" : "pointer";
        this.renderScene();
      };
      this.mediaQuery.addEventListener("change", this.mediaQueryHandler);
    }

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.renderScene, this);

      if (this.mediaQuery && this.mediaQueryHandler) {
        this.mediaQuery.removeEventListener("change", this.mediaQueryHandler);
      }
    });

    this.renderScene();
  }

  update(time: number) {
    if (time - this.lastTickAt < 250) {
      return;
    }

    this.lastTickAt = time;
    this.snapshot = this.session.tick(time);
    this.renderScene();
  }

  private renderScene = () => {
    this.root?.destroy(true);

    const width = this.scale.width;
    const height = this.scale.height;
    const compact = width < 960;
    const padding = compact ? 20 : 28;
    const headerHeight = compact ? 108 : 104;
    const railWidth = compact ? width - padding * 2 : Math.max(300, width * 0.28);
    const roomWidth = compact ? width - padding * 2 : width - railWidth - padding * 3;
    const roomHeight = compact ? height * 0.5 : height - headerHeight - padding * 2;
    const railHeight = compact ? height - headerHeight - roomHeight - padding * 3 : roomHeight;
    const roomRect = new Phaser.Geom.Rectangle(padding, headerHeight + padding, roomWidth, roomHeight);
    const railRect = compact
      ? new Phaser.Geom.Rectangle(padding, roomRect.bottom + padding, railWidth, railHeight)
      : new Phaser.Geom.Rectangle(roomRect.right + padding, headerHeight + padding, railWidth, railHeight);

    this.root = this.add.container(0, 0);

    this.drawBackdrop(width, height, padding, headerHeight);
    this.drawHeader(width, padding);
    this.drawRoom(roomRect);
    this.drawRail(railRect);
    this.drawBottomActions(roomRect, railRect, compact, padding, height);
    this.drawDetailOverlay(width, height, padding);
  };

  private drawBackdrop(width: number, height: number, padding: number, headerHeight: number) {
    const stage = this.add.graphics();
    stage.fillStyle(ui.stage, 1);
    stage.fillRect(padding, padding, width - padding * 2, height - padding * 2);
    stage.fillStyle(ui.borderStrong, 1);
    stage.fillRect(padding, padding, width - padding * 2, 4);
    stage.fillRect(padding, height - padding - 4, width - padding * 2, 4);
    stage.fillRect(padding, padding, 4, height - padding * 2);
    stage.fillRect(width - padding - 4, padding, 4, height - padding * 2);

    const glow = this.add.graphics();
    glow.fillStyle(ui.accentSoft, 0.2);
    glow.fillRect(padding + 60, headerHeight + 60, 120, 120);
    glow.fillStyle(ui.accent, 0.08);
    glow.fillRect(width - padding - 260, height - padding - 220, 180, 140);

    const scanlines = this.add.graphics();
    scanlines.fillStyle(ui.borderStrong, 0.06);
    for (let y = padding + 8; y < height - padding; y += 12) {
      scanlines.fillRect(padding + 8, y, width - padding * 2 - 16, 2);
    }

    this.root?.add([stage, glow, scanlines]);
  }

  private drawHeader(width: number, padding: number) {
    const header = drawRoundedPanel(this, padding, padding, width - padding * 2, 96, ui.panelStrong);
    const eyebrow = drawText(this, padding + 24, padding + 18, "PIXEL ROOM SAMPLE", eyebrowStyle);
    const title = drawText(this, padding + 24, padding + 38, interactiveModeDefinition.label, titleStyle, width * 0.42);
    const description = drawText(
      this,
      padding + 24,
      padding + 78,
      "A pixel art-ish 2D prototype: Phaser owns the room, hotspots, and detail surfaces while shared contracts still drive the state.",
      smallStyle,
      width * 0.58,
    );
    const status = drawText(
      this,
      width - padding - 250,
      padding + 24,
      `Scene: ${this.snapshot.resolvedScene.scene.label}\nMode: ${this.inputMode}\nActors: ${this.snapshot.resolvedScene.actors.length}`,
      bodyStyle,
      220,
    );

    this.root?.add([header, eyebrow, title, description, status]);
  }

  private drawRoom(roomRect: Phaser.Geom.Rectangle) {
    const room = drawRoundedPanel(this, roomRect.x, roomRect.y, roomRect.width, roomRect.height, 0xfffdf8);
    this.root?.add([room, ...drawRoomEnvironment(this, roomRect, this.snapshot.resolvedScene.scene.id)]);

    const phase = toCurrentPhase(this.snapshot.resolvedScene, this.snapshot.progress.currentPhaseId);
    const activeTargets = this.getActiveTargets(roomRect.width, roomRect.height);

    this.snapshot.resolvedScene.actors.forEach((actor) => {
      const isVisible = phase.enabledActorIds.includes(actor.id);
      const isHintVisible =
        phase.visibleHintActorIds.includes(actor.id) || this.snapshot.progress.shownHintActorIds.includes(actor.id);
      const actorState = this.snapshot.actorState[actor.actor.id];
      const target = activeTargets.find((entry) => entry.actorId === actor.id);
      const x = roomRect.x + actor.placement.x * roomRect.width;
      const y = roomRect.y + actor.placement.y * roomRect.height;
      const width = actor.placement.width * roomRect.width;
      const height = actor.placement.height * roomRect.height;
      const card = this.add.container(x, y);
      const visuals = drawActorVisual(this, actor, 0, 0, width, height);

      const bg = this.add.rectangle(
        width / 2,
        height / 2,
        width,
        height,
        isVisible ? 0xffffff : 0xf2ede3,
        isVisible ? 0.2 : 0.08,
      );
      bg.setStrokeStyle(
        this.snapshot.progress.focusedActorId === actor.id ? 3 : 1,
        isVisible ? ui.accent : ui.border,
        isVisible ? 0.85 : 0.35,
      );

      const labelPill = drawRoundedPanel(this, 8, height - 54, Math.min(width - 16, 164), 42, 0xfffcf7, 0.92, 14);
      const label = drawText(this, 18, height - 48, actor.label, { ...smallStyle, color: "#171411", fontStyle: "700" }, width - 36);
      const meta = drawText(
        this,
        18,
        height - 30,
        `${actor.actor.type} / ${actorState?.state ?? actor.resolvedActor.state.state}`,
        smallStyle,
        width - 36,
      );

      card.add([bg, ...visuals, labelPill, label, meta]);
      card.setDepth(actor.placement.zIndex ?? 1);

      if (this.snapshot.progress.focusedActorId === actor.id) {
        this.tweens.add({
          targets: card,
          scaleX: 1.02,
          scaleY: 1.02,
          duration: 900,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
      }

      this.root?.add(card);

      if (target) {
        const pulseShadow = this.add.ellipse(
          roomRect.x + target.x * roomRect.width + (target.width * roomRect.width) / 2,
          roomRect.y + target.y * roomRect.height + (target.height * roomRect.height) / 2,
          target.width * roomRect.width * 1.18,
          target.height * roomRect.height * 1.18,
          ui.accentSoft,
          0.16,
        );
        const hotspot = this.add.rectangle(
          roomRect.x + target.x * roomRect.width + (target.width * roomRect.width) / 2,
          roomRect.y + target.y * roomRect.height + (target.height * roomRect.height) / 2,
          target.width * roomRect.width,
          target.height * roomRect.height,
        );
        hotspot.setStrokeStyle(2, ui.accent, 1);
        hotspot.setFillStyle(ui.accentSoft, 0.12);
        hotspot.setInteractive({ useHandCursor: true });
        hotspot.on("pointerup", () => this.handleTargetActivate(target.actorId, this.time.now));
        this.tweens.add({
          targets: [hotspot, pulseShadow],
          alpha: { from: 0.95, to: 0.45 },
          duration: 1100,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });
        this.root?.add([pulseShadow, hotspot]);
      }

      if (isHintVisible && actor.hint) {
        const hintWidth = Math.min(200, roomRect.width * 0.28);
        const hint = drawRoundedPanel(this, x, y - 38, hintWidth, 28, ui.overlay, 0.88);
        const hintText = drawText(this, x + 10, y - 31, actor.hint.label, {
          ...smallStyle,
          color: "#fffef8",
        }, hintWidth - 20);
        this.root?.add([hint, hintText]);
      }
    });
  }

  private drawRail(railRect: Phaser.Geom.Rectangle) {
    const panel = drawRoundedPanel(this, railRect.x, railRect.y, railRect.width, railRect.height, ui.panel);
    const phase = toCurrentPhase(this.snapshot.resolvedScene, this.snapshot.progress.currentPhaseId);
    const selectedActor = this.snapshot.resolvedScene.actors.find((actor) => actor.id === this.selectedActorId);
    const selectedState = selectedActor ? this.snapshot.actorState[selectedActor.actor.id] : undefined;
    const selectedAction = selectedState?.lastActionId
      ? selectedActor?.resolvedActor.actions.find((action) => action.id === selectedState.lastActionId)
      : undefined;
    const selectedPresentation = getReactionPresentation(selectedAction?.reaction);

    const items = [
      drawText(this, railRect.x + 22, railRect.y + 18, "STATUS", eyebrowStyle),
      drawText(this, railRect.x + 22, railRect.y + 38, phase.label, headingStyle, railRect.width - 44),
      drawText(this, railRect.x + 22, railRect.y + 72, phase.description, smallStyle, railRect.width - 44),
      drawText(
        this,
        railRect.x + 22,
        railRect.y + 130,
        `Completed interactions: ${this.snapshot.progress.completedActorIds.length}\nTriggered transitions: ${this.snapshot.progress.triggeredIds.length}\nVisible hints: ${this.snapshot.progress.shownHintActorIds.length}`,
        bodyStyle,
        railRect.width - 44,
      ),
      drawText(this, railRect.x + 22, railRect.y + 240, "SELECTED", eyebrowStyle),
      drawText(
        this,
        railRect.x + 22,
        railRect.y + 260,
        selectedActor ? selectedActor.label : "Nothing selected yet",
        headingStyle,
        railRect.width - 44,
      ),
      drawText(
        this,
        railRect.x + 22,
        railRect.y + 294,
        selectedActor
          ? `${selectedPresentation?.accent ?? selectedActor.actor.type}\n${selectedAction?.intent ?? "Select an active hotspot to inspect its content."}`
          : "The Phaser scene owns room interactions directly. Use a highlighted hotspot to inspect a scene object.",
        bodyStyle,
        railRect.width - 44,
      ),
    ];

    this.root?.add([panel, ...items]);
  }

  private drawBottomActions(
    roomRect: Phaser.Geom.Rectangle,
    railRect: Phaser.Geom.Rectangle,
    compact: boolean,
    padding: number,
    height: number,
  ) {
    const listY = compact ? railRect.bottom + padding : height - 120;
    const listWidth = compact ? roomRect.width : roomRect.width + railRect.width + padding;
    const listX = roomRect.x;
    const listHeight = compact ? Math.max(88, height - listY - padding) : 92;
    const panel = drawRoundedPanel(this, listX, listY, listWidth, listHeight, ui.panelStrong);
    const title = drawText(this, listX + 20, listY + 16, "ACTIVE HOTSPOTS", eyebrowStyle);
    const targets = this.getActiveTargets(roomRect.width, roomRect.height);

    this.root?.add([panel, title]);

    if (targets.length === 0) {
      const waiting = drawText(
        this,
        listX + 20,
        listY + 40,
        "The scene is intentionally quiet at first. The opening timer reveals the first guided object.",
        smallStyle,
        listWidth - 40,
      );
      this.root?.add(waiting);
      return;
    }

    let cursorX = listX + 20;
    let cursorY = listY + 42;

    targets.forEach((target) => {
      const itemWidth = Math.min(220, listWidth - 40);
      const itemHeight = 38;

      if (cursorX + itemWidth > listX + listWidth - 20) {
        cursorX = listX + 20;
        cursorY += itemHeight + 10;
      }

      const button = this.add.container(cursorX, cursorY);
      const bg = this.add.rectangle(itemWidth / 2, itemHeight / 2, itemWidth, itemHeight, 0xffffff, 0.9);
      bg.setStrokeStyle(1, ui.border, 1);
      bg.setInteractive({ useHandCursor: true });
      bg.on("pointerup", () => this.handleTargetActivate(target.actorId, this.time.now));

      const label = drawText(
        this,
        12,
        10,
        target.hintLabel ? `${target.label} - ${target.hintLabel}` : target.label,
        smallStyle,
        itemWidth - 24,
      );
      label.setPosition(12, 10);

      button.add([bg, label]);
      this.root?.add(button);
      cursorX += itemWidth + 10;
    });
  }

  private drawDetailOverlay(width: number, height: number, padding: number) {
    const selectedActor = this.snapshot.resolvedScene.actors.find((actor) => actor.id === this.selectedActorId);
    const overlay = selectedActor ? getSceneOverlayContent(this.snapshot.resolvedScene, selectedActor.id) : undefined;
    const selectedState = selectedActor ? this.snapshot.actorState[selectedActor.actor.id] : undefined;
    const selectedAction = selectedState?.lastActionId
      ? selectedActor?.resolvedActor.actions.find((action) => action.id === selectedState.lastActionId)
      : undefined;
    const selectedReaction = selectedAction?.reaction;
    const selectedPresentation = getReactionPresentation(selectedReaction);

    if (!selectedActor || !overlay || !selectedReaction) {
      return;
    }

    const backdrop = this.add.rectangle(width / 2, height / 2, width, height, ui.overlay, 0.42);
    backdrop.setInteractive();
    backdrop.on("pointerup", () => {
      this.selectedActorId = undefined;
      this.renderScene();
    });

    const panelWidth = Math.min(width - padding * 4, selectedReaction.type === "overlay" ? 760 : 640);
    const panelHeight = Math.min(height - padding * 4, selectedReaction.type === "overlay" ? 520 : 420);
    const panelX = (width - panelWidth) / 2;
    const panelY = (height - panelHeight) / 2;
    const panel = drawRoundedPanel(this, panelX, panelY, panelWidth, panelHeight, ui.panel);
    const accent = drawText(this, panelX + 24, panelY + 22, selectedPresentation?.accent ?? selectedReaction.target, eyebrowStyle);
    const title = drawText(this, panelX + 24, panelY + 44, overlay.headline, headingStyle, panelWidth - 100);
    const description = drawText(
      this,
      panelX + 24,
      panelY + 80,
      `${selectedAction?.intent ?? ""} ${selectedPresentation?.description ?? ""}`.trim(),
      smallStyle,
      panelWidth - 48,
    );
    const close = this.add.text(panelX + panelWidth - 74, panelY + 20, "Close", {
      ...smallStyle,
      color: "#8a6a2f",
      fontStyle: "700",
    });
    close.setInteractive({ useHandCursor: true });
    close.on("pointerup", () => {
      this.selectedActorId = undefined;
      this.renderScene();
    });

    this.root?.add([backdrop, panel, accent, title, description, close]);

    let cardY = panelY + 126;

    overlay.cards.slice(0, selectedReaction.type === "overlay" ? 4 : 3).forEach((contentCard) => {
      const cardHeight = selectedReaction.type === "overlay" ? 84 : 72;
      const cardPanel = drawRoundedPanel(this, panelX + 24, cardY, panelWidth - 48, cardHeight, ui.panelStrong);
      const eyebrow = drawText(this, panelX + 40, cardY + 14, contentCard.eyebrow.toUpperCase(), eyebrowStyle);
      const heading = drawText(this, panelX + 40, cardY + 32, contentCard.title, bodyStyle, panelWidth - 120);
      const body = drawText(this, panelX + 40, cardY + 54, contentCard.body, smallStyle, panelWidth - 80);
      this.root?.add([cardPanel, eyebrow, heading, body]);
      cardY += cardHeight + 12;
    });
  }

  private getActiveTargets(viewWidth: number, viewHeight: number): SceneInteractionTarget[] {
    return getActiveInteractionTargets(this.snapshot.resolvedScene, this.snapshot.progress, {
      width: viewWidth,
      height: viewHeight,
      inputMode: this.inputMode,
    });
  }

  private handleTargetActivate(sceneActorId: string, atMs: number) {
    const actor = this.snapshot.resolvedScene.actors.find((entry) => entry.id === sceneActorId);

    if (!actor) {
      return;
    }

    this.selectedActorId = actor.id;
    this.snapshot = this.session.applyActorAction(actor.id, selectPrimaryAction(actor), atMs);
    this.renderScene();
  }
}

export function createInteractivePhaserGame(container: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width: gameWidth,
    height: gameHeight,
      backgroundColor: "#f5f2e9",
      pixelArt: true,
      render: {
      antialias: false,
      roundPixels: true,
      },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: "100%",
      height: "100%",
    },
    scene: [InteractivePortfolioPhaserScene],
  });
}
