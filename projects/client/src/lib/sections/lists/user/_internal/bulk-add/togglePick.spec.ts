import { describe, expect, it } from 'vitest';
import type { BulkAddPick } from './BulkAddPick.ts';
import { togglePick } from './togglePick.ts';

const pick = (id: number, sourceKey = 'watchlist'): BulkAddPick => ({
  key: `movie:${id}`,
  type: 'movie',
  id,
  sourceKey,
});

describe('util: togglePick', () => {
  it('should add a pick that is not selected', () => {
    expect(togglePick([pick(1)], pick(2))).toEqual([pick(1), pick(2)]);
  });

  it('should remove a pick that is already selected', () => {
    expect(togglePick([pick(1), pick(2)], pick(1))).toEqual([pick(2)]);
  });
});
