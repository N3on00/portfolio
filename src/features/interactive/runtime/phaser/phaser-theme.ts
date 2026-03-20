import Phaser from "phaser";

export const gameWidth = 1280;
export const gameHeight = 860;
export const pixelSize = 4;

export const ui = {
  background: 0xf5f2e9,
  stage: 0xfcfaf4,
  panel: 0xfffcf7,
  panelStrong: 0xf0eadf,
  border: 0xd8d2c8,
  borderStrong: 0x6d5841,
  text: 0x171411,
  muted: 0x665c50,
  accent: 0x8a6a2f,
  accentSoft: 0xd8c39a,
  accentBright: 0xf3c969,
  success: 0x557a46,
  overlay: 0x1f1710,
  shadow: 0x000000,
  sky: 0xc7d7e8,
  skyShade: 0x9fb4cc,
  wall: 0xf7f2e8,
  wallShade: 0xebe2d1,
  floor: 0xd7c4a3,
  floorShade: 0xc8b089,
  desk: 0x8e6642,
  deskTop: 0xb4875f,
  bed: 0xd2bfab,
  screen: 0x243342,
} as const;

export const titleStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  color: "#171411",
  fontFamily: "monospace",
  fontSize: "28px",
  fontStyle: "700",
};

export const headingStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  color: "#171411",
  fontFamily: "monospace",
  fontSize: "18px",
  fontStyle: "700",
};

export const eyebrowStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  color: "#8a6a2f",
  fontFamily: "monospace",
  fontSize: "11px",
  fontStyle: "700",
  letterSpacing: 1.2,
};

export const bodyStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  color: "#171411",
  fontFamily: "monospace",
  fontSize: "14px",
  lineSpacing: 4,
};

export const smallStyle: Phaser.Types.GameObjects.Text.TextStyle = {
  color: "#665c50",
  fontFamily: "monospace",
  fontSize: "11px",
  lineSpacing: 2,
};
