import { describe, expect, it } from 'vitest';
import { resolveThresholds } from './resolveThresholds.ts';

describe('util: resolveThresholds', () => {
  const thresholds = [1, 10, 50, 100];

  it('should report a locked state below the first threshold', () => {
    const result = resolveThresholds({ value: 0, thresholds });

    expect(result.tierIndex).toBe(-1);
    expect(result.nextThreshold).toBe(1);
    expect(result.isMaxed).toBe(false);
    expect(result.progress).toBe(0);
  });

  it('should resolve the highest reached tier and next threshold', () => {
    const result = resolveThresholds({ value: 20, thresholds });

    expect(result.tierIndex).toBe(1); // clears 1, 10 but not 50
    expect(result.nextThreshold).toBe(50);
    expect(result.isMaxed).toBe(false);
  });

  it('should compute fractional progress between tiers', () => {
    // Reached 10 (index 1), next 50, value 30 -> halfway.
    expect(resolveThresholds({ value: 30, thresholds }).progress).toBeCloseTo(
      0.5,
    );
  });

  it('should max out at the top threshold', () => {
    const result = resolveThresholds({ value: 150, thresholds });

    expect(result.tierIndex).toBe(3);
    expect(result.nextThreshold).toBeNull();
    expect(result.isMaxed).toBe(true);
    expect(result.progress).toBe(1);
  });

  it('should treat a single-threshold chain as a binary badge', () => {
    expect(resolveThresholds({ value: 0, thresholds: [1] }).isMaxed).toBe(
      false,
    );
    expect(resolveThresholds({ value: 1, thresholds: [1] }).isMaxed).toBe(true);
    expect(resolveThresholds({ value: 1, thresholds: [1] }).tierIndex).toBe(0);
  });
});
