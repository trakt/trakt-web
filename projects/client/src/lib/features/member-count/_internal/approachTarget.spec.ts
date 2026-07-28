import { describe, expect, it } from 'vitest';
import { approachTarget } from './approachTarget.ts';

describe('util: approachTarget', () => {
  it('should close exactly half the distance in one half-life', () => {
    expect(approachTarget({
      current: 100,
      target: 200,
      deltaMs: 500,
      halfLifeMs: 500,
    })).toBe(150);
  });

  it('should close three quarters over two half-lives', () => {
    expect(approachTarget({
      current: 0,
      target: 100,
      deltaMs: 1000,
      halfLifeMs: 500,
    })).toBe(75);
  });

  it('should be frame-rate independent', () => {
    const halfLifeMs = 500;
    const oneStep = approachTarget({
      current: 0,
      target: 100,
      deltaMs: 100,
      halfLifeMs,
    });
    const twoSteps = [50, 50].reduce(
      (current, deltaMs) =>
        approachTarget({ current, target: 100, deltaMs, halfLifeMs }),
      0,
    );

    expect(twoSteps).toBeCloseTo(oneStep, 10);
  });

  it('should hold the current value when no time has passed', () => {
    expect(approachTarget({
      current: 42,
      target: 100,
      deltaMs: 0,
      halfLifeMs: 500,
    })).toBe(42);
  });

  it('should not overshoot the target', () => {
    expect(approachTarget({
      current: 0,
      target: 100,
      deltaMs: 10_000,
      halfLifeMs: 500,
    })).toBeLessThanOrEqual(100);
  });

  it('should settle exactly on a target it has all but reached', () => {
    expect(approachTarget({
      current: 17_002_053.9999,
      target: 17_002_054,
      deltaMs: 16,
      halfLifeMs: 300,
    })).toBe(17_002_054);
  });
});
