import { describe, expect, it } from 'vitest';
import { seamTarget } from './seamTarget.ts';

describe('util: seamTarget', () => {
  it('should place the seam by side', () => {
    expect(seamTarget('dune')).toBe(0.8);
    expect(seamTarget('double')).toBe(0.6);
    expect(seamTarget('doom')).toBe(0.3);
  });
});
