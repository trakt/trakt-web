import { describe, expect, it } from 'vitest';
import { toLivingPosterLayerRole } from './toLivingPosterLayerRole.ts';

describe('util: toLivingPosterLayerRole', () => {
  it.each([
    [-1, 'background'],
    [-0.35, 'mid'],
    [0.55, 'figures'],
    [1, 'title'],
  ])('should map the shift %s to %s', (shift, role) => {
    expect(toLivingPosterLayerRole(shift)).toBe(role);
  });

  it('should return null for an unknown shift', () => {
    expect(toLivingPosterLayerRole(0.2)).toBeNull();
  });
});
