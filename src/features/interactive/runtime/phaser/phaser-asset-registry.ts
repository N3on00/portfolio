import type Phaser from "phaser";
import roomBackgroundAsset from "./assets/room-background.svg";
import gamingPcAsset from "./assets/gaming-pc.svg";
import racingWheelAsset from "./assets/racing-wheel.svg";
import vrHeadsetAsset from "./assets/vr-headset.svg";
import deskHeadsetAsset from "./assets/desk-headset.svg";
import soundbarClockAsset from "./assets/soundbar-clock.svg";
import wallCalendarAsset from "./assets/wall-calendar.svg";
import postItClusterAsset from "./assets/post-it-cluster.svg";
import personalHintsAsset from "./assets/personal-hints.svg";
import roomTilesSheetAsset from "./assets/room-tiles-sheet.svg";
import roomPropsSheetAsset from "./assets/room-props-sheet.svg";

export type PhaserAssetKind = "background" | "prop" | "interactive-object" | "tileset" | "spritesheet";

export interface PhaserImageAssetDefinition {
  key: string;
  src: string;
  kind: PhaserAssetKind;
  label: string;
  tags: string[];
}

export interface PhaserSpriteSheetAssetDefinition {
  key: string;
  src: string;
  kind: PhaserAssetKind;
  label: string;
  tags: string[];
  frameConfig: {
    frameWidth: number;
    frameHeight: number;
    startFrame?: number;
    endFrame?: number;
    margin?: number;
    spacing?: number;
  };
}

const assetDefinitions = [
  {
    key: "room-background-bedroom-studio",
    src: roomBackgroundAsset,
    kind: "background",
    label: "Bedroom studio background",
    tags: ["room", "background", "bedroom-studio"],
  },
  {
    key: "prop-desk-pc",
    src: gamingPcAsset,
    kind: "interactive-object",
    label: "Desk PC sprite",
    tags: ["desk", "pc", "computer"],
  },
  {
    key: "prop-racing-wheel",
    src: racingWheelAsset,
    kind: "interactive-object",
    label: "Racing wheel sprite",
    tags: ["desk", "wheel", "sim"],
  },
  {
    key: "prop-vr-headset",
    src: vrHeadsetAsset,
    kind: "interactive-object",
    label: "VR headset sprite",
    tags: ["desk", "vr", "headset"],
  },
  {
    key: "prop-desk-headset",
    src: deskHeadsetAsset,
    kind: "interactive-object",
    label: "Desk headset sprite",
    tags: ["desk", "audio", "headset"],
  },
  {
    key: "prop-soundbar-clock",
    src: soundbarClockAsset,
    kind: "interactive-object",
    label: "Soundbar and clock sprite",
    tags: ["shelf", "soundbar", "clock"],
  },
  {
    key: "prop-wall-calendar",
    src: wallCalendarAsset,
    kind: "interactive-object",
    label: "Wall calendar sprite",
    tags: ["wall", "calendar", "planning"],
  },
  {
    key: "prop-post-it-cluster",
    src: postItClusterAsset,
    kind: "interactive-object",
    label: "Post-it cluster sprite",
    tags: ["wall", "notes", "planning"],
  },
  {
    key: "prop-personal-hints",
    src: personalHintsAsset,
    kind: "interactive-object",
    label: "Personal hints sprite",
    tags: ["bedside", "notes", "profile"],
  },
] satisfies PhaserImageAssetDefinition[];

export const phaserImageAssetRegistry: Record<string, PhaserImageAssetDefinition> = Object.fromEntries(
  assetDefinitions.map((asset) => [asset.key, asset]),
);

const spriteSheetDefinitions = [
  {
    key: "sheet-room-tiles",
    src: roomTilesSheetAsset,
    kind: "tileset",
    label: "Room tiles sheet",
    tags: ["tileset", "room", "environment"],
    frameConfig: {
      frameWidth: 16,
      frameHeight: 16,
    },
  },
  {
    key: "sheet-room-props",
    src: roomPropsSheetAsset,
    kind: "spritesheet",
    label: "Room props sheet",
    tags: ["spritesheet", "room", "props"],
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
    },
  },
] satisfies PhaserSpriteSheetAssetDefinition[];

export const phaserSpriteSheetRegistry: Record<string, PhaserSpriteSheetAssetDefinition> = Object.fromEntries(
  spriteSheetDefinitions.map((asset) => [asset.key, asset]),
);

export function preloadPhaserImageAssets(scene: Phaser.Scene) {
  Object.values(phaserImageAssetRegistry).forEach((asset) => {
    scene.load.image(asset.key, asset.src);
  });

  Object.values(phaserSpriteSheetRegistry).forEach((asset) => {
    scene.load.spritesheet(asset.key, asset.src, asset.frameConfig);
  });
}
