import type { CanvasEffect } from '../models/CanvasEffect.ts';
import type { EffectBlend } from '../models/EffectBlend.ts';
import type { EffectPlane } from '../models/EffectPlane.ts';

type Planes = Readonly<Partial<Record<EffectPlane, EffectBlend>>>;

const PLANES: Record<CanvasEffect['kind'], Planes> = {
  embers: { back: 'screen' },
  snow: { back: 'normal', front: 'normal' },
  dust: { back: 'screen', front: 'screen' },
  rain: { back: 'normal', front: 'screen' },
  fireflies: { back: 'screen' },
  twinkle: { back: 'screen' },
  fog: { back: 'screen', front: 'screen' },
  flare: { front: 'screen' },
  lightning: { back: 'screen', rim: 'screen', front: 'screen' },
};

export function canvasEffectPlanes({ kind }: CanvasEffect): Planes {
  return PLANES[kind];
}
