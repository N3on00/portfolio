import Phaser from "phaser";
import type { ResolvedSceneActor } from "@features/interactive/scene/scene-contracts";
import { drawSoftShadow, snap } from "./phaser-primitives";
import { pixelSize, ui } from "./phaser-theme";
import { getActorSpriteBinding, getSceneBackgroundAssetKey, getSceneTileBinding } from "./phaser-scene-skins";

function stampFrame(
  scene: Phaser.Scene,
  sheetKey: string,
  frame: number,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.Image {
  const sprite = scene.add.image(snap(x), snap(y), sheetKey, frame).setOrigin(0, 0);
  sprite.setDisplaySize(snap(width), snap(height));
  return sprite;
}

function tileFrame(
  scene: Phaser.Scene,
  objects: Phaser.GameObjects.GameObject[],
  sheetKey: string,
  frame: number,
  x: number,
  y: number,
  width: number,
  height: number,
  tileSize: number,
) {
  const columns = Math.max(1, Math.ceil(width / tileSize));
  const rows = Math.max(1, Math.ceil(height / tileSize));

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      objects.push(
        stampFrame(
          scene,
          sheetKey,
          frame,
          x + column * tileSize,
          y + row * tileSize,
          tileSize,
          tileSize,
        ),
      );
    }
  }
}

export function drawRoomEnvironment(
  scene: Phaser.Scene,
  roomRect: Phaser.Geom.Rectangle,
  sceneId: string,
): Phaser.GameObjects.GameObject[] {
  const objects: Phaser.GameObjects.GameObject[] = [];

  const roomTextureKey = getSceneBackgroundAssetKey(sceneId);
  const tileBinding = getSceneTileBinding(sceneId);

  if (roomTextureKey) {
    const roomSprite = scene.add.image(snap(roomRect.x), snap(roomRect.y), roomTextureKey).setOrigin(0, 0);
    roomSprite.setDisplaySize(snap(roomRect.width), snap(roomRect.height));
    objects.push(roomSprite);
  }

  if (tileBinding) {
    const tileSize = pixelSize * 4;
    tileFrame(scene, objects, tileBinding.sheetKey, tileBinding.frames.wall, roomRect.x, roomRect.y, roomRect.width, roomRect.height * 0.72, tileSize);
    tileFrame(scene, objects, tileBinding.sheetKey, tileBinding.frames.wallShade, roomRect.x, roomRect.y + roomRect.height * 0.52, roomRect.width, roomRect.height * 0.2, tileSize);
    tileFrame(scene, objects, tileBinding.sheetKey, tileBinding.frames.floor, roomRect.x + 16, roomRect.bottom - roomRect.height * 0.24, roomRect.width - 32, roomRect.height * 0.2, tileSize);
    tileFrame(scene, objects, tileBinding.sheetKey, tileBinding.frames.floorShade, roomRect.x + 16, roomRect.bottom - roomRect.height * 0.12, roomRect.width - 32, roomRect.height * 0.08, tileSize);
    objects.push(stampFrame(scene, tileBinding.sheetKey, tileBinding.frames.window, roomRect.x + roomRect.width * 0.06, roomRect.y + roomRect.height * 0.08, roomRect.width * 0.18, roomRect.height * 0.24));
    objects.push(stampFrame(scene, tileBinding.sheetKey, tileBinding.frames.poster, roomRect.x + roomRect.width * 0.76, roomRect.y + roomRect.height * 0.1, roomRect.width * 0.1, roomRect.height * 0.16));
    objects.push(stampFrame(scene, tileBinding.sheetKey, tileBinding.frames.desk, roomRect.x + roomRect.width * 0.43, roomRect.y + roomRect.height * 0.54, roomRect.width * 0.38, roomRect.height * 0.18));
    objects.push(stampFrame(scene, tileBinding.sheetKey, tileBinding.frames.bed, roomRect.x + roomRect.width * 0.03, roomRect.y + roomRect.height * 0.67, roomRect.width * 0.22, roomRect.height * 0.12));
    objects.push(stampFrame(scene, tileBinding.sheetKey, tileBinding.frames.shelf, roomRect.x + roomRect.width * 0.08, roomRect.y + roomRect.height * 0.36, roomRect.width * 0.12, roomRect.height * 0.11));
    return objects;
  }

  const wallHeight = snap(roomRect.height * 0.72);
  const wall = scene.add.graphics();
  wall.fillStyle(ui.wall, 1);
  wall.fillRect(snap(roomRect.x), snap(roomRect.y), snap(roomRect.width), wallHeight);
  wall.fillStyle(ui.wallShade, 0.85);
  wall.fillRect(snap(roomRect.x), snap(roomRect.y + wallHeight * 0.72), snap(roomRect.width), snap(wallHeight * 0.28));
  objects.push(wall);

  const floor = scene.add.graphics();
  floor.fillStyle(ui.floor, 0.98);
  floor.fillRect(snap(roomRect.x + 16), snap(roomRect.bottom - roomRect.height * 0.24), snap(roomRect.width - 32), snap(roomRect.height * 0.2));
  floor.fillStyle(ui.floorShade, 0.45);
  for (let index = 0; index < 10; index += 1) {
    floor.fillRect(
      snap(roomRect.x + 24 + index * ((roomRect.width - 72) / 10)),
      snap(roomRect.bottom - roomRect.height * 0.18),
      snap((roomRect.width - 120) / 12),
      pixelSize,
    );
  }
  objects.push(floor);

  const windowGlow = scene.add.graphics();
  const windowX = snap(roomRect.x + roomRect.width * 0.06);
  const windowY = snap(roomRect.y + roomRect.height * 0.08);
  const windowW = snap(roomRect.width * 0.18);
  const windowH = snap(roomRect.height * 0.24);
  windowGlow.fillStyle(ui.borderStrong, 1);
  windowGlow.fillRect(windowX, windowY, windowW, windowH);
  windowGlow.fillStyle(ui.sky, 1);
  windowGlow.fillRect(windowX + pixelSize, windowY + pixelSize, windowW - pixelSize * 2, windowH - pixelSize * 2);
  windowGlow.fillStyle(ui.skyShade, 0.65);
  windowGlow.fillRect(windowX + pixelSize, windowY + windowH * 0.52, windowW - pixelSize * 2, windowH * 0.18);
  windowGlow.fillStyle(ui.borderStrong, 1);
  windowGlow.fillRect(windowX + windowW / 2 - pixelSize / 2, windowY + pixelSize, pixelSize, windowH - pixelSize * 2);
  windowGlow.fillRect(windowX + pixelSize, windowY + windowH / 2 - pixelSize / 2, windowW - pixelSize * 2, pixelSize);
  objects.push(windowGlow);

  const poster = scene.add.graphics();
  poster.fillStyle(ui.borderStrong, 1);
  poster.fillRect(snap(roomRect.x + roomRect.width * 0.76), snap(roomRect.y + roomRect.height * 0.1), snap(roomRect.width * 0.1), snap(roomRect.height * 0.16));
  poster.fillStyle(ui.accentBright, 1);
  poster.fillRect(snap(roomRect.x + roomRect.width * 0.76) + pixelSize, snap(roomRect.y + roomRect.height * 0.1) + pixelSize, snap(roomRect.width * 0.1) - pixelSize * 2, snap(roomRect.height * 0.16) - pixelSize * 2);
  objects.push(poster);

  const desk = scene.add.graphics();
  desk.fillStyle(ui.desk, 1);
  desk.fillRect(snap(roomRect.x + roomRect.width * 0.45), snap(roomRect.y + roomRect.height * 0.58), snap(roomRect.width * 0.34), snap(roomRect.height * 0.08));
  desk.fillStyle(ui.deskTop, 1);
  desk.fillRect(snap(roomRect.x + roomRect.width * 0.43), snap(roomRect.y + roomRect.height * 0.54), snap(roomRect.width * 0.38), snap(roomRect.height * 0.05));
  desk.fillStyle(ui.borderStrong, 0.9);
  desk.fillRect(snap(roomRect.x + roomRect.width * 0.48), snap(roomRect.y + roomRect.height * 0.62), snap(roomRect.width * 0.02), snap(roomRect.height * 0.14));
  desk.fillRect(snap(roomRect.x + roomRect.width * 0.73), snap(roomRect.y + roomRect.height * 0.62), snap(roomRect.width * 0.02), snap(roomRect.height * 0.14));
  objects.push(desk);

  const bed = scene.add.graphics();
  bed.fillStyle(ui.bed, 0.95);
  bed.fillRect(snap(roomRect.x + roomRect.width * 0.03), snap(roomRect.y + roomRect.height * 0.67), snap(roomRect.width * 0.22), snap(roomRect.height * 0.12));
  bed.fillStyle(0xf5eee5, 1);
  bed.fillRect(snap(roomRect.x + roomRect.width * 0.05), snap(roomRect.y + roomRect.height * 0.69), snap(roomRect.width * 0.18), snap(roomRect.height * 0.05));
  objects.push(bed);

  const shelf = scene.add.graphics();
  shelf.fillStyle(ui.desk, 0.9);
  shelf.fillRect(snap(roomRect.x + roomRect.width * 0.08), snap(roomRect.y + roomRect.height * 0.36), snap(roomRect.width * 0.12), snap(roomRect.height * 0.05));
  shelf.fillRect(snap(roomRect.x + roomRect.width * 0.1), snap(roomRect.y + roomRect.height * 0.43), snap(roomRect.width * 0.1), snap(roomRect.height * 0.04));
  objects.push(shelf);

  return objects;
}

export function drawActorVisual(
  scene: Phaser.Scene,
  actor: ResolvedSceneActor,
  x: number,
  y: number,
  width: number,
  height: number,
): Phaser.GameObjects.GameObject[] {
  const objects: Phaser.GameObjects.GameObject[] = [];
  objects.push(drawSoftShadow(scene, x + width / 2, y + height + 8, width * 0.78, 16));

  const spriteBinding = getActorSpriteBinding(actor.actor.metadata?.rendererKey as string | undefined);

  if (spriteBinding?.sheetKey && typeof spriteBinding.frame === "number") {
    const sprite = scene.add.image(snap(x), snap(y), spriteBinding.sheetKey, spriteBinding.frame).setOrigin(0, 0);
    sprite.setDisplaySize(snap(width), snap(height));
    objects.push(sprite);
    return objects;
  }

  if (spriteBinding?.assetKey) {
    const sprite = scene.add.image(snap(x), snap(y), spriteBinding.assetKey).setOrigin(0, 0);
    sprite.setDisplaySize(snap(width), snap(height));
    objects.push(sprite);
    return objects;
  }

  const graphic = scene.add.graphics();
  const type = actor.actor.type;

  if (type === "project-terminal") {
    graphic.fillStyle(ui.borderStrong, 1);
    graphic.fillRect(snap(x + width * 0.1), snap(y + height * 0.02), snap(width * 0.8), snap(height * 0.58));
    graphic.fillStyle(ui.screen, 1);
    graphic.fillRect(snap(x + width * 0.14), snap(y + height * 0.06), snap(width * 0.72), snap(height * 0.48));
    graphic.fillStyle(0x87a8c4, 0.3);
    graphic.fillRect(snap(x + width * 0.2), snap(y + height * 0.12), snap(width * 0.6), snap(height * 0.34));
    graphic.fillStyle(ui.accentBright, 0.9);
    graphic.fillRect(snap(x + width * 0.24), snap(y + height * 0.16), snap(width * 0.16), snap(height * 0.04));
    graphic.fillStyle(ui.deskTop, 1);
    graphic.fillRect(snap(x + width * 0.34), snap(y + height * 0.62), snap(width * 0.32), snap(height * 0.08));
    graphic.fillStyle(ui.desk, 1);
    graphic.fillRect(snap(x + width * 0.47), snap(y + height * 0.57), snap(width * 0.06), snap(height * 0.08));
  } else if (type === "skill-surface") {
    graphic.fillStyle(ui.accentSoft, 0.95);
    graphic.fillRect(snap(x + width * 0.26), snap(y + height * 0.18), snap(width * 0.48), snap(height * 0.48));
    graphic.fillStyle(ui.accent, 1);
    graphic.fillRect(snap(x + width * 0.34), snap(y + height * 0.26), snap(width * 0.32), snap(height * 0.32));
    graphic.fillStyle(ui.accentBright, 1);
    graphic.fillRect(snap(x + width * 0.44), snap(y + height * 0.16), snap(width * 0.12), snap(height * 0.08));
  } else if (type === "audio-social-surface") {
    graphic.fillStyle(0x30343b, 1);
    graphic.fillRect(snap(x + width * 0.2), snap(y + height * 0.08), snap(width * 0.6), snap(height * 0.56));
    graphic.fillStyle(ui.accentSoft, 1);
    graphic.fillRect(snap(x + width * 0.28), snap(y + height * 0.28), snap(width * 0.12), snap(height * 0.12));
    graphic.fillRect(snap(x + width * 0.6), snap(y + height * 0.28), snap(width * 0.12), snap(height * 0.12));
  } else if (type === "ambient-surface") {
    graphic.fillStyle(0x2f353d, 1);
    graphic.fillRect(snap(x + width * 0.12), snap(y + height * 0.32), snap(width * 0.76), snap(height * 0.24));
    graphic.fillStyle(ui.accent, 0.95);
    graphic.fillRect(snap(x + width * 0.2), snap(y + height * 0.4), snap(width * 0.18), snap(height * 0.06));
  } else if (type === "experience-anchor") {
    graphic.fillStyle(0xf7d75c, 0.96);
    graphic.fillRect(snap(x + width * 0.14), snap(y + height * 0.08), snap(width * 0.72), snap(height * 0.72));
    graphic.fillStyle(0xd2b544, 1);
    graphic.fillRect(snap(x + width * 0.22), snap(y + height * 0.22), snap(width * 0.38), pixelSize);
    graphic.fillRect(snap(x + width * 0.22), snap(y + height * 0.34), snap(width * 0.3), pixelSize);
    graphic.fillRect(snap(x + width * 0.22), snap(y + height * 0.46), snap(width * 0.42), pixelSize);
  } else {
    graphic.fillStyle(0xf5eee5, 1);
    graphic.fillRect(snap(x + width * 0.16), snap(y + height * 0.1), snap(width * 0.68), snap(height * 0.68));
    graphic.fillStyle(ui.accentSoft, 0.95);
    graphic.fillRect(snap(x + width * 0.24), snap(y + height * 0.18), snap(width * 0.18), snap(height * 0.18));
  }

  objects.push(graphic);
  return objects;
}
