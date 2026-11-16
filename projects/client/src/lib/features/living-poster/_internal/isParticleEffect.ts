import type { LivingPosterEffect } from '../models/LivingPosterEffect.ts';
import type { ParticleEffect } from '../models/ParticleEffect.ts';

const PARTICLE_KINDS: ReadonlyArray<LivingPosterEffect['kind']> = [
  'embers',
  'snow',
  'dust',
  'rain',
  'fireflies',
  'twinkle',
];

export function isParticleEffect(
  effect: LivingPosterEffect,
): effect is ParticleEffect {
  return PARTICLE_KINDS.includes(effect.kind);
}
