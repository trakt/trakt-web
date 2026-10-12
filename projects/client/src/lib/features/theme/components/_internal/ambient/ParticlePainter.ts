import type { Particle } from './Particle.ts';
import type { ParticleBounds } from './ParticleBounds.ts';

type CreateParticleProps = {
  bounds: ParticleBounds;
  colors: ReadonlyArray<string>;
  isInitial: boolean;
};

export type ParticlePainter<P extends Particle> = {
  areaPerParticle: number;
  maxCount: number;
  colorTokens: ReadonlyArray<string>;
  create: (props: CreateParticleProps) => P;
  step: (particle: P, bounds: ParticleBounds) => boolean;
  draw: (ctx: CanvasRenderingContext2D, particle: P) => void;
};
