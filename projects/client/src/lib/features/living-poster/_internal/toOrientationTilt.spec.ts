import { describe, expect, it } from 'vitest';
import { toOrientationTilt } from './toOrientationTilt.ts';

const baseline = { beta: 60, gamma: 5 };

const tiltBy = ({
  beta = 0,
  gamma = 0,
  screenAngle = 0,
}: {
  beta?: number;
  gamma?: number;
  screenAngle?: number;
}) =>
  toOrientationTilt({
    orientation: { beta: baseline.beta + beta, gamma: baseline.gamma + gamma },
    baseline,
    screenAngle,
  });

describe('util: toOrientationTilt', () => {
  it('should be neutral at the angle the phone was held at', () => {
    const { x, y } = tiltBy({});

    expect(x).toBeCloseTo(0, 6);
    expect(y).toBeCloseTo(0, 6);
  });

  it('should be neutral whatever the baseline angle is', () => {
    const { x, y } = toOrientationTilt({
      orientation: { beta: -120, gamma: 70 },
      baseline: { beta: -120, gamma: 70 },
      screenAngle: 0,
    });

    expect(x).toBeCloseTo(0, 6);
    expect(y).toBeCloseTo(0, 6);
  });

  it('should counter the sideways tilt so the poster stays put in the room', () => {
    expect(tiltBy({ gamma: 10 }).x).toBeCloseTo(-0.5, 6);
    expect(tiltBy({ gamma: -10 }).x).toBeCloseTo(0.5, 6);
  });

  it('should counter the forward tilt so the poster stays put in the room', () => {
    expect(tiltBy({ beta: 10 }).y).toBeCloseTo(0.5, 6);
    expect(tiltBy({ beta: -10 }).y).toBeCloseTo(-0.5, 6);
  });

  it('should clamp a large tilt to plus and minus one', () => {
    expect(tiltBy({ gamma: 80, beta: -80 })).toEqual({ x: -1, y: -1 });
    expect(tiltBy({ gamma: -80, beta: 80 })).toEqual({ x: 1, y: 1 });
  });

  it('should take the short way around when beta wraps past 180', () => {
    const { y } = toOrientationTilt({
      orientation: { beta: -175, gamma: 0 },
      baseline: { beta: 175, gamma: 0 },
      screenAngle: 0,
    });

    expect(y).toBeCloseTo(10 / 20, 6);
  });

  it('should swap the axes when the screen is rotated a quarter turn', () => {
    const { x, y } = tiltBy({ gamma: 10, screenAngle: 90 });

    expect(x).toBeCloseTo(0, 6);
    expect(y).toBeCloseTo(0.5, 6);
    expect(tiltBy({ beta: 10, screenAngle: 90 }).x).toBeCloseTo(0.5, 6);
  });

  it('should flip both axes when the screen is upside down', () => {
    expect(tiltBy({ gamma: 10, screenAngle: 180 }).x).toBeCloseTo(0.5, 6);
    expect(tiltBy({ beta: 10, screenAngle: 180 }).y).toBeCloseTo(-0.5, 6);
  });

  it('should mirror the quarter turn for the opposite landscape', () => {
    expect(tiltBy({ gamma: 10, screenAngle: 270 }).y).toBeCloseTo(-0.5, 6);
    expect(tiltBy({ beta: 10, screenAngle: 270 }).x).toBeCloseTo(-0.5, 6);
  });

  it('should treat a negative screen angle like its positive twin', () => {
    expect(tiltBy({ gamma: 10, screenAngle: -90 })).toEqual(
      tiltBy({ gamma: 10, screenAngle: 270 }),
    );
  });
});
