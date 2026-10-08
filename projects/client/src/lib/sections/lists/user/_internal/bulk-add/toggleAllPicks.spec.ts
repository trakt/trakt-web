import { describe, expect, it } from 'vitest';
import type { BulkAddPick } from './BulkAddPick.ts';
import { toggleAllPicks } from './toggleAllPicks.ts';

const pick = (id: number, sourceKey = 'watchlist'): BulkAddPick => ({
  key: `movie:${id}`,
  type: 'movie',
  id,
  sourceKey,
});

describe('util: toggleAllPicks', () => {
  it('should add every candidate that is not picked yet', () => {
    expect(toggleAllPicks([pick(1)], [pick(1), pick(2), pick(3)])).toEqual([
      pick(1),
      pick(2),
      pick(3),
    ]);
  });

  it('should remove all candidates when they are all picked', () => {
    expect(
      toggleAllPicks([pick(1), pick(2), pick(3)], [pick(1), pick(2)]),
    ).toEqual([pick(3)]);
  });

  it('should keep picks from other sources when removing', () => {
    expect(
      toggleAllPicks([pick(9, 'list:1'), pick(1)], [pick(1)]),
    ).toEqual([pick(9, 'list:1')]);
  });
});
