import type { Particle } from '../models/Particle.ts';
import { particleFrame } from './particleFrame.ts';
import { particleSprite } from './particleSprite.ts';

type DrawParticlesParams = {
  context: CanvasRenderingContext2D;
  particles: ReadonlyArray<Particle>;
  seconds: number;
  width: number;
  height: number;
};

type DrawParticleParams = {
  context: CanvasRenderingContext2D;
  particle: Particle;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
};

const GLOW_RADIUS_RATIO = 2.5;

function drawParticle({
  context,
  particle,
  x,
  y,
  opacity,
  scale,
  rotation,
}: DrawParticleParams) {
  const { kind, size, length, color } = particle;
  context.globalAlpha = opacity;

  if (kind === 'rain') {
    context.save();
    context.translate(x + 0.5, y + length / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(
      particleSprite({ kind: 'streak', color }),
      -0.5,
      -length / 2,
      1,
      length,
    );
    context.restore();
    return;
  }

  if (kind === 'snow' || kind === 'dust') {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, (size * scale) / 2, 0, Math.PI * 2);
    context.fill();
    return;
  }

  const radius = size * scale * GLOW_RADIUS_RATIO;
  context.drawImage(
    particleSprite({ kind: 'glow', color }),
    x - radius,
    y - radius,
    radius * 2,
    radius * 2,
  );
}

export function drawParticles({
  context,
  particles,
  seconds,
  width,
  height,
}: DrawParticlesParams) {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    const { box } = particle;
    const frame = particleFrame({ particle, seconds });
    if (frame.opacity <= 0.01) continue;

    drawParticle({
      context,
      particle,
      x: ((box[0] + (frame.x * box[2]) / 100) * width) / 100,
      y: ((box[1] + (frame.y * box[3]) / 100) * height) / 100,
      opacity: frame.opacity,
      scale: frame.scale,
      rotation: frame.rotation,
    });
  }

  context.globalAlpha = 1;
}
