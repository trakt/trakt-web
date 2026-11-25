import type { CanvasEffect } from '../../models/CanvasEffect.ts';
import type { EffectPainter } from '../../models/EffectPainter.ts';
import type { EffectScene } from '../../models/EffectScene.ts';
import type { Rgb } from '../../models/Rgb.ts';
import { cloudTexture } from '../cloudTexture.ts';
import { intensityScale } from '../intensityScale.ts';
import { toPixelBox } from '../toPixelBox.ts';

type Bank = {
  seed: number;
  from: number;
  to: number;
  speed: number;
  opacity: number;
  top: number;
};

const MIST: Rgb = [200, 212, 220];
const BACK_BANK: Bank = {
  seed: 13,
  from: 0.4,
  to: 0.85,
  speed: 8,
  opacity: 0.6,
  top: 0.55,
};
const FRONT_BANK: Bank = {
  seed: 17,
  from: 0.45,
  to: 0.9,
  speed: -12,
  opacity: 0.4,
  top: 0.72,
};
const TILE_SCALE = 1.2;

function drawTiled({
  context,
  texture,
  offset,
  width,
  height,
}: {
  context: CanvasRenderingContext2D;
  texture: HTMLCanvasElement;
  offset: number;
  width: number;
  height: number;
}) {
  const tile = width * TILE_SCALE;
  const start = ((offset % tile) + tile) % tile;

  for (let x = -start; x < width; x += tile) {
    for (let y = 0; y < height; y += tile) {
      context.drawImage(texture, x, y, tile, tile);
    }
  }
}

function createBankPainter({
  bank,
  effect,
}: {
  bank: Bank;
  effect: CanvasEffect;
}) {
  const cache: { texture?: HTMLCanvasElement; layer?: HTMLCanvasElement } = {};
  const opacity = Math.min(1, bank.opacity * intensityScale(effect.intensity));

  return ({ context, seconds, width, height, unit }: EffectScene) => {
    cache.texture ??= cloudTexture({ ...bank, color: MIST });
    cache.layer ??= document.createElement('canvas');

    const layer = cache.layer;
    if (layer.width !== Math.round(width)) layer.width = Math.round(width);
    if (layer.height !== Math.round(height)) layer.height = Math.round(height);

    const draft = layer.getContext('2d');
    if (!draft) return;

    draft.clearRect(0, 0, layer.width, layer.height);
    draft.globalCompositeOperation = 'source-over';
    draft.globalAlpha = opacity;
    drawTiled({
      context: draft,
      texture: cache.texture,
      offset: seconds * bank.speed * unit,
      width: layer.width,
      height: layer.height,
    });

    const box = toPixelBox({ box: effect.box, width, height });
    const ratio = layer.width / width;
    const fade = draft.createLinearGradient(
      0,
      (box.y + box.height * bank.top) * ratio,
      0,
      (box.y + box.height) * ratio,
    );
    fade.addColorStop(0, 'rgba(0, 0, 0, 0)');
    fade.addColorStop(0.5, 'rgba(0, 0, 0, 0.8)');
    fade.addColorStop(1, 'rgba(0, 0, 0, 1)');
    draft.globalCompositeOperation = 'destination-in';
    draft.globalAlpha = 1;
    draft.fillStyle = fade;
    draft.fillRect(0, 0, layer.width, layer.height);

    context.drawImage(
      layer,
      box.x * ratio,
      box.y * ratio,
      box.width * ratio,
      box.height * ratio,
      box.x,
      box.y,
      box.width,
      box.height,
    );
  };
}

export function createFogPainter({
  effect,
}: {
  effect: CanvasEffect;
}): EffectPainter {
  return {
    back: createBankPainter({ bank: BACK_BANK, effect }),
    front: createBankPainter({ bank: FRONT_BANK, effect }),
  };
}
