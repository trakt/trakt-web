import { describe, expect, it } from 'vitest';
import { stepSpring } from './stepSpring.ts';

const settle = ({ damping, seconds }: { damping: number; seconds: number }) => {
  const peak = { value: 0 };
  const state = Array.from({ length: Math.round(seconds * 60) }).reduce<{
    value: number;
    velocity: number;
  }>(
    (current) => {
      const next = stepSpring({
        state: current,
        target: 1,
        seconds: 1 / 60,
        stiffness: 140,
        damping,
      });
      peak.value = Math.max(peak.value, next.value);
      return next;
    },
    { value: 0, velocity: 0 },
  );

  return { state, peak: peak.value };
};

describe('util: stepSpring', () => {
  it('should stay put when already at the target', () => {
    expect(
      stepSpring({
        state: { value: 1, velocity: 0 },
        target: 1,
        seconds: 1 / 60,
        stiffness: 140,
        damping: 15,
      }),
    ).toEqual({ value: 1, velocity: 0 });
  });

  it('should not move when no time passed', () => {
    expect(
      stepSpring({
        state: { value: 0.2, velocity: 0 },
        target: 1,
        seconds: 0,
        stiffness: 140,
        damping: 15,
      }),
    ).toEqual({ value: 0.2, velocity: 0 });
  });

  it('should settle on the target', () => {
    const { state } = settle({ damping: 15, seconds: 4 });

    expect(state.value).toBeCloseTo(1, 3);
    expect(state.velocity).toBeCloseTo(0, 3);
  });

  it('should overshoot a little when underdamped', () => {
    const { peak } = settle({ damping: 15, seconds: 4 });

    expect(peak).toBeGreaterThan(1);
    expect(peak).toBeLessThan(1.15);
  });

  it('should not overshoot when overdamped', () => {
    const { peak } = settle({ damping: 40, seconds: 6 });

    expect(peak).toBeLessThanOrEqual(1);
  });

  it('should stay stable across a long frame', () => {
    const next = stepSpring({
      state: { value: 0, velocity: 0 },
      target: 1,
      seconds: 0.5,
      stiffness: 140,
      damping: 15,
    });

    expect(Math.abs(next.value)).toBeLessThan(2);
  });
});
