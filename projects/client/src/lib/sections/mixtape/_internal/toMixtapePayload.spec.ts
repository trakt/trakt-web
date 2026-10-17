import { describe, expect, it } from 'vitest';
import { toMixtapePayload } from './toMixtapePayload.ts';

describe('toMixtapePayload', () => {
  it('should split the mixtape into movies and shows by trakt id', () => {
    expect(
      toMixtapePayload([
        { id: 1, type: 'movie' },
        { id: 2, type: 'show' },
        { id: 3, type: 'movie' },
      ]),
    ).toEqual({
      movies: [{ ids: { trakt: 1 } }, { ids: { trakt: 3 } }],
      shows: [{ ids: { trakt: 2 } }],
    });
  });
});
