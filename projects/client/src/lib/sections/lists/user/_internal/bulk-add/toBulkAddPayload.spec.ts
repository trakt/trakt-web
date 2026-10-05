import { describe, expect, it } from 'vitest';
import type { BulkAddPick } from './BulkAddPick.ts';
import { toBulkAddPayload } from './toBulkAddPayload.ts';

const pick = (type: BulkAddPick['type'], id: number): BulkAddPick => ({
  key: `${type}:${id}`,
  type,
  id,
  sourceKey: 'watchlist',
});

describe('util: toBulkAddPayload', () => {
  it('should split picks into movies and shows', () => {
    expect(toBulkAddPayload([pick('movie', 1), pick('show', 2)])).toEqual({
      movies: [{ ids: { trakt: 1 } }],
      shows: [{ ids: { trakt: 2 } }],
    });
  });

  it('should return empty arrays when nothing is picked', () => {
    expect(toBulkAddPayload([])).toEqual({ movies: [], shows: [] });
  });
});
