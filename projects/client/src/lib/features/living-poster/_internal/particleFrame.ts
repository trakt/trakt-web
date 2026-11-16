import type { Particle } from '../models/Particle.ts';

type Keyframe = readonly [at: number, value: number];

type ParticleFrameParams = {
  particle: Particle;
  seconds: number;
};

export type ParticleFrame = {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
};

const STREAK_ROTATION = 12;

function interpolate(progress: number, keyframes: ReadonlyArray<Keyframe>) {
  const next = keyframes.findIndex(([at]) => at >= progress);
  if (next <= 0) return keyframes.at(0)?.[1] ?? 0;

  const [fromAt, fromValue] = keyframes[next - 1] ?? keyframes[0] ?? [0, 0];
  const [toAt, toValue] = keyframes[next] ?? [1, 0];
  const span = toAt - fromAt;
  if (span === 0) return toValue;

  return fromValue + (toValue - fromValue) * ((progress - fromAt) / span);
}

export function particleFrame({
  particle,
  seconds,
}: ParticleFrameParams): ParticleFrame {
  const { kind, x, y, dx, duration, phase } = particle;
  const progress = (seconds / duration + phase) % 1;

  if (kind === 'embers') {
    return {
      x: x + dx * progress,
      y: y - 110 * progress,
      opacity: interpolate(progress, [
        [0, 0],
        [0.12, 1],
        [1, 0],
      ]),
      scale: 1 - 0.6 * progress,
      rotation: 0,
    };
  }

  if (kind === 'snow') {
    return {
      x: x + dx * progress,
      y:
        y +
        interpolate(progress, [
          [0, -10],
          [1, 115],
        ]),
      opacity: interpolate(progress, [
        [0, 0],
        [0.1, 0.95],
        [1, 0.2],
      ]),
      scale: 1,
      rotation: 0,
    };
  }

  if (kind === 'dust') {
    return {
      x:
        x +
        interpolate(progress, [
          [0, 0],
          [0.5, dx],
          [1, 0],
        ]),
      y:
        y +
        interpolate(progress, [
          [0, 0],
          [0.5, -6],
          [1, 0],
        ]),
      opacity: interpolate(progress, [
        [0, 0.15],
        [0.5, 0.85],
        [1, 0.15],
      ]),
      scale: 1,
      rotation: 0,
    };
  }

  if (kind === 'rain') {
    return {
      x: x - 12 * progress,
      y:
        y +
        interpolate(progress, [
          [0, -20],
          [1, 120],
        ]),
      opacity: interpolate(progress, [
        [0, 0],
        [0.15, 0.7],
        [1, 0],
      ]),
      scale: 1,
      rotation: STREAK_ROTATION,
    };
  }

  return {
    x,
    y,
    opacity: interpolate(progress, [
      [0, 0],
      [0.45, 1],
      [0.55, 1],
      [1, 0],
    ]),
    scale: interpolate(progress, [
      [0, 0.6],
      [0.45, 1],
      [0.55, 1],
      [1, 0.6],
    ]),
    rotation: 0,
  };
}
