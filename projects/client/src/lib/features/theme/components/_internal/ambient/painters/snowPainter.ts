import type { Particle, ParticlePainter } from '../ParticlePainter.ts';
import { pickColor } from './pickColor.ts';

type Snowflake = Particle & {
  size: number;
  speed: number;
  step: number;
  stepSize: number;
  opacity: number;
  sway: number;
  color: string;
};

export const snowPainter: ParticlePainter<Snowflake> = {
  areaPerParticle: 6000,
  maxCount: 200,
  colorTokens: ['--color-seasonal-snow'],
  create: ({ bounds, colors, isInitial }) => {
    const isFast = Math.random() > 0.6;

    return {
      x: Math.random() * bounds.width,
      y: isInitial ? Math.random() * bounds.height : -10,
      size: isFast ? 1 : Math.random() * 1.5 + 0.5,
      speed: isFast ? Math.random() + 1.5 : Math.random() + 0.5,
      step: Math.random() * Math.PI * 2,
      stepSize: Math.random() / 30,
      opacity: Math.random() * 0.5 + 0.3,
      sway: isFast ? 2 : 1.2,
      color: pickColor(colors),
    };
  },
  step: (flake, bounds) => {
    flake.y += flake.speed;
    flake.step += flake.stepSize;
    flake.x += Math.cos(flake.step) * flake.sway;

    if (flake.x > bounds.width + 20) flake.x = -10;
    if (flake.x < -20) flake.x = bounds.width + 10;

    return flake.y <= bounds.height;
  },
  draw: (ctx, flake) => {
    ctx.globalAlpha = flake.opacity;
    ctx.fillStyle = flake.color;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
    ctx.fill();
  },
};
