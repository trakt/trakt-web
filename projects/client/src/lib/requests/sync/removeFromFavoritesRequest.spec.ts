import { describe, expect, it } from 'vitest';
import { removeFromFavoritesRequest } from './removeFromFavoritesRequest.ts';

describe('removeFromFavoritesRequest', () => {
  it('should report success on the 200 the endpoint returns', async () => {
    const result = await removeFromFavoritesRequest({
      body: { movies: [{ ids: { trakt: 1 } }] },
    });

    expect(result).to.equal(true);
  });
});
