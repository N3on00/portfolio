import Phaser from "phaser";
import { pixelSize, ui } from "./phaser-theme";

export function snap(value: number, size = pixelSize): number {
  return Math.round(value / size) * size;
}

export function drawRoundedPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor: number,
  alpha = 0.96,
  radius = 24,
): Phaser.GameObjects.Graphics {
  const graphics = scene.add.graphics();
  const sx = snap(x);
  const sy = snap(y);
  const sw = Math.max(sizeOrDefault(width), pixelSize * 2);
  const sh = Math.max(sizeOrDefault(height), pixelSize * 2);
  const border = pixelSize;

  graphics.fillStyle(ui.borderStrong, 1);
  graphics.fillRect(sx, sy, sw, sh);
  graphics.fillStyle(fillColor, alpha);
  graphics.fillRect(sx + border, sy + border, sw - border * 2, sh - border * 2);

  if (radius > 0) {
    graphics.fillStyle(ui.borderStrong, 1);
    graphics.fillRect(sx + border, sy, sw - border * 2, border);
  }

  return graphics;
}

function sizeOrDefault(value: number): number {
  return snap(value);
}

export function drawText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  style: Phaser.Types.GameObjects.Text.TextStyle,
  width?: number,
): Phaser.GameObjects.Text {
  return scene.add.text(x, y, text, {
    ...style,
    wordWrap: width ? { width } : undefined,
  });
}

export function drawSoftShadow(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 0.12,
): Phaser.GameObjects.Ellipse {
  return scene.add.ellipse(snap(x), snap(y), snap(width), snap(height), ui.shadow, alpha);
}
