import { describe, expect, it } from 'vitest';
import { stepLowPass } from './stepLowPass.ts';

describe('util: stepLowPass', () => {
  it('should not move when no time passed', () => {
    expect(
      stepLowPass({ value: 0.2, target: 1, seconds: 0, timeConstant: 0.1 }),
    ).toBe(0.2);
  });

  it('should cover about two thirds of the gap after one time constant', () => {
    expect(
      stepLowPass({ value: 0, target: 1, seconds: 0.1, timeConstant: 0.1 }),
    ).toBeCloseTo(1 - Math.exp(-1), 6);
  });

  it('should approach the target without passing it', () => {
    const value = stepLowPass({
      value: 0,
      target: 1,
      seconds: 10,
      timeConstant: 0.1,
    });

    expect(value).toBeLessThanOrEqual(1);
    expect(value).toBeCloseTo(1, 6);
  });

  it('should reach the same value in one long step or many short ones', () => {
    const stepped = Array.from({ length: 10 }).reduce<number>(
      (value) =>
        stepLowPass({ value, target: 1, seconds: 0.02, timeConstant: 0.1 }),
      0,
    );

    expect(stepped).toBeCloseTo(
      stepLowPass({ value: 0, target: 1, seconds: 0.2, timeConstant: 0.1 }),
      6,
    );
  });

  it('should move downwards towards a lower target', () => {
    expect(
      stepLowPass({ value: 1, target: -1, seconds: 0.05, timeConstant: 0.1 }),
    ).toBeLessThan(1);
  });
});
