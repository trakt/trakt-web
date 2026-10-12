import type { Particle, ParticlePainter } from '../ParticlePainter.ts';
import { pickColor } from './pickColor.ts';

type Ember = Particle & {
  size: number;
  rise: number;
  drift: number;
  phase: number;
  flicker: number;
  color: string;
};

const HALO_LAYERS = [
  { scale: 5, baseAlpha: 0.04, glowAlpha: 0.04 },
  { scale: 2.5, baseAlpha: 0.08, glowAlpha: 0.1 },
  { scale: 1, baseAlpha: 0.5, glowAlpha: 0.5 },
] as const;

export const emberPainter: ParticlePainter<Ember> = {
  areaPerParticle: 24000,
  maxCount: 48,
  colorTokens: ['--purple-200', '--purple-300', '--purple-400'],
  create: ({ bounds, colors, isInitial }) => ({
    x: Math.random() * bounds.width,
    y: isInitial ? Math.random() * bounds.height : bounds.height + 10,
    size: Math.random() * 1.4 + 0.8,
    rise: Math.random() * 0.35 + 0.15,
    drift: Math.random() * 0.6 + 0.2,
    phase: Math.random() * Math.PI * 2,
    flicker: Math.random() * 0.04 + 0.01,
    color: pickColor(colors),
  }),
  step: (ember) => {
    ember.y -= ember.rise;
    ember.phase += ember.flicker;
    ember.x += Math.sin(ember.phase) * ember.drift * 0.3;

    return ember.y >= -10;
  },
  draw: (ctx, ember) => {
    const glow = (Math.sin(ember.phase * 3) + 1) / 2;

    ctx.fillStyle = ember.color;

    HALO_LAYERS.forEach(({ scale, baseAlpha, glowAlpha }) => {
      ctx.globalAlpha = baseAlpha + glow * glowAlpha;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size * scale, 0, Math.PI * 2);
      ctx.fill();
    });
  },
};
