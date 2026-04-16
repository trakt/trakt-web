import { describe, expect, it } from 'vitest';
import { getUnsupportedCssFeatures } from './getUnsupportedCssFeatures.ts';

describe('getUnsupportedCssFeatures', () => {
  it('should return an empty list when all required features are supported', () => {
    const unsupportedFeatures = getUnsupportedCssFeatures({
      cssSupports: () => true,
    });

    expect(unsupportedFeatures).toEqual([]);
  });

  it('should return only the unsupported features', () => {
    const unsupportedFeatures = getUnsupportedCssFeatures({
      cssSupports: (query) => !query.includes(':has('),
    });

    expect(unsupportedFeatures).toEqual([':has() selectors']);
  });

  it('should mark all features as unsupported when CSS.supports is unavailable', () => {
    const unsupportedFeatures = getUnsupportedCssFeatures({
      cssSupports: null,
    });

    expect(unsupportedFeatures).toEqual([
      ':has() selectors',
      'color-mix() colors',
      'overflow: clip',
    ]);
  });
});
