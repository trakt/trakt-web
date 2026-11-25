import { describe, expect, it } from 'vitest';
import { intensityScale } from './intensityScale.ts';

describe('util: intensityScale', () => {
  it('should keep the default intensity at full strength', () => {
    expect(intensityScale(0.5)).toBe(1);
  });

  it('should halve at zero and grow by half at full intensity', () => {
    expect(intensityScale(0)).toBe(0.5);
    expect(intensityScale(1)).toBe(1.5);
  });

  it('should clamp intensity outside zero to one', () => {
    expect(intensityScale(-1)).toBe(0.5);
    expect(intensityScale(3)).toBe(1.5);
  });
});
