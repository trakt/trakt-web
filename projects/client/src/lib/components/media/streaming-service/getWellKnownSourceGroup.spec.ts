import { describe, expect, it } from 'vitest';
import { getWellKnownSourceGroup } from './getWellKnownSourceGroup.ts';

describe('util: getWellKnownSourceGroup', () => {
  it('should map amazon variants to a single brand group', () => {
    expect(getWellKnownSourceGroup('amazon_prime_video')).toBe(
      getWellKnownSourceGroup('amazon_video'),
    );
  });

  it('should resolve a well-known source to its brand key', () => {
    expect(getWellKnownSourceGroup('netflix')).toBe('netflix');
  });

  it('should resolve segment-aware variants to their brand key', () => {
    expect(getWellKnownSourceGroup('netflix_standard_with_ads')).toBe(
      'netflix',
    );
  });

  it('should not resolve partial segment matches', () => {
    expect(getWellKnownSourceGroup('complex')).toBeUndefined();
  });

  it('should return undefined for an unknown source', () => {
    expect(getWellKnownSourceGroup('curiosity_stream')).toBeUndefined();
  });
});
