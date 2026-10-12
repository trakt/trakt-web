import { describe, expect, it } from 'vitest';
import { fromLegacyDismissals } from './fromLegacyDismissals.ts';

describe('fromLegacyDismissals', () => {
  it('should turn the stored items into a map by media', () => {
    expect(
      fromLegacyDismissals({
        version: 2,
        items: [
          { id: '1', type: 'movie', dismissedAt: 10 },
          { id: '2', type: 'show', dismissedAt: 20 },
        ],
      }),
    ).to.deep.equal({ 'movie:1': 10, 'show:2': 20 });
  });

  it('should ignore values without items', () => {
    expect(fromLegacyDismissals({ id: 1, type: 'movie' })).to.equal(null);
    expect(fromLegacyDismissals(null)).to.equal(null);
  });
});
