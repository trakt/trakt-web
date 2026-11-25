import type { CanvasEffect } from '../models/CanvasEffect.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';

const CANVAS_KINDS: ReadonlyArray<LivingPosterEffect['kind']> = [
  'embers',
  'snow',
  'dust',
  'rain',
  'fireflies',
  'twinkle',
  'fog',
  'flare',
  'lightning',
];

export function isCanvasEffect(
  effect: LivingPosterEffect,
): effect is CanvasEffect {
  return CANVAS_KINDS.includes(effect.kind);
}
