import { describe, expect, it } from 'vitest';
import { idsEqual } from './idsEqual.ts';

describe('util: idsEqual', () => {
  it('should treat identical id collections as equal', () => {
    expect(
      idsEqual(
        { movieIds: [1, 2], showIds: [3], episodeIds: [] },
        { movieIds: [1, 2], showIds: [3], episodeIds: [] },
      ),
    ).to.equal(true);
  });

  it('should treat any divergence as not equal', () => {
    expect(
      idsEqual(
        { movieIds: [1, 2], showIds: [3], episodeIds: [] },
        { movieIds: [1, 2], showIds: [4], episodeIds: [] },
      ),
    ).to.equal(false);
  });
});
