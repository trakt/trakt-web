import type { ParticleEffect } from '../models/ParticleEffect.ts';

export function isScreenBlendedParticle({ kind }: ParticleEffect) {
  return kind === 'embers' || kind === 'fireflies';
}
