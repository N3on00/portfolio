export interface SceneBackgroundBinding {
  sceneId: string;
  assetKey: string;
}

export interface SceneTileBinding {
  sceneId: string;
  sheetKey: string;
  frames: {
    wall: number;
    wallShade: number;
    floor: number;
    floorShade: number;
    frame: number;
    window: number;
    poster: number;
    desk: number;
    bed: number;
    shelf: number;
  };
}

export interface ActorSpriteBinding {
  rendererKey: string;
  assetKey?: string;
  sheetKey?: string;
  frame?: number;
}

export const phaserSceneBackgroundBindings: SceneBackgroundBinding[] = [
  {
    sceneId: "bedroom-studio",
    assetKey: "room-background-bedroom-studio",
  },
];

export const phaserSceneTileBindings: SceneTileBinding[] = [
  {
    sceneId: "bedroom-studio",
    sheetKey: "sheet-room-tiles",
    frames: {
      wall: 0,
      wallShade: 1,
      floor: 2,
      floorShade: 3,
      frame: 4,
      window: 8,
      poster: 9,
      desk: 10,
      bed: 11,
      shelf: 12,
    },
  },
];

export const phaserActorSpriteBindings: ActorSpriteBinding[] = [
  { rendererKey: "desk-pc", sheetKey: "sheet-room-props", frame: 0, assetKey: "prop-desk-pc" },
  { rendererKey: "racing-wheel", sheetKey: "sheet-room-props", frame: 1, assetKey: "prop-racing-wheel" },
  { rendererKey: "vr-headset", sheetKey: "sheet-room-props", frame: 2, assetKey: "prop-vr-headset" },
  { rendererKey: "desk-headset", sheetKey: "sheet-room-props", frame: 3, assetKey: "prop-desk-headset" },
  { rendererKey: "soundbar-clock", sheetKey: "sheet-room-props", frame: 4, assetKey: "prop-soundbar-clock" },
  { rendererKey: "wall-calendar", sheetKey: "sheet-room-props", frame: 5, assetKey: "prop-wall-calendar" },
  { rendererKey: "post-it-cluster", sheetKey: "sheet-room-props", frame: 6, assetKey: "prop-post-it-cluster" },
  { rendererKey: "personal-hints", sheetKey: "sheet-room-props", frame: 7, assetKey: "prop-personal-hints" },
];

export function getSceneBackgroundAssetKey(sceneId: string): string | undefined {
  return phaserSceneBackgroundBindings.find((binding) => binding.sceneId === sceneId)?.assetKey;
}

export function getSceneTileBinding(sceneId: string): SceneTileBinding | undefined {
  return phaserSceneTileBindings.find((binding) => binding.sceneId === sceneId);
}

export function getActorSpriteBinding(rendererKey: string | undefined): ActorSpriteBinding | undefined {
  if (!rendererKey) {
    return undefined;
  }

  return phaserActorSpriteBindings.find((binding) => binding.rendererKey === rendererKey);
}
