import type { LivingPoster } from '../models/LivingPoster.ts';
import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';

type ResolveMaskSourceParams = {
  effect: LivingPosterEffect;
  poster: Pick<LivingPoster, 'layers' | 'mask'>;
};

export function resolveMaskSource({
  effect,
  poster,
}: ResolveMaskSourceParams): string | null {
  if (effect.kind !== 'shimmer' && effect.kind !== 'foil') return null;
  if (effect.mask === 'letters') return poster.mask;

  return poster.layers.at(-1)?.src ?? null;
}
