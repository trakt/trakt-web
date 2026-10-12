export type ParticleBounds = {
  width: number;
  height: number;
};

export type Particle = {
  x: number;
  y: number;
};

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
