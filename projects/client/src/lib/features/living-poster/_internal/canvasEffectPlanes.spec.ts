import { describe, expect, it } from 'vitest';
import type { CanvasEffect } from '../models/CanvasEffect.ts';
import { canvasEffectPlanes } from './canvasEffectPlanes.ts';
import { createEffectPainter } from './painters/createEffectPainter.ts';

const KINDS: ReadonlyArray<CanvasEffect['kind']> = [
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

const effect = (kind: CanvasEffect['kind']) =>
  ({
    kind,
    color: null,
    intensity: 0.5,
    box: [0, 0, 100, 100],
    at: [50, 30],
  }) as CanvasEffect;

describe('util: canvasEffectPlanes', () => {
  it.each(KINDS)('should give %s a painter for every plane it uses', (kind) => {
    const planes = Object.keys(canvasEffectPlanes(effect(kind))).sort();
    const painter = createEffectPainter({
      effect: effect(kind),
      seed: 1,
      sources: { backdrop: null, figures: null },
    });

    expect(Object.keys(painter).sort()).toEqual(planes);
  });
});
