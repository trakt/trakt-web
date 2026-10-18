import { describe, expect, it } from 'vitest';
import { toSmartListRecipePreview } from './toSmartListRecipePreview.ts';

describe('toSmartListRecipePreview', () => {
  it('should show every label when they fit', () => {
    expect(
      toSmartListRecipePreview({
        source: 'discover',
        filters: { genres: ['action', 'comedy'] },
      }),
    ).toEqual({ summary: 'All titles, Action, Comedy', remaining: 0 });
  });

  it('should count the labels that do not fit', () => {
    expect(
      toSmartListRecipePreview({
        source: 'discover',
        filters: { genres: ['action', 'comedy', 'drama', 'horror', 'crime'] },
      }),
    ).toEqual({
      summary: 'All titles, Action, Comedy',
      remaining: 3,
    });
  });
});
