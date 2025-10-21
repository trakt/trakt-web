import { TraktTeamMappedMock } from '$mocks/data/team/mapped/TraktTeamMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { traktTeamQuery } from './traktTeamQuery.ts';

describe('traktTeamQuery', () => {
  it('should query for the trakt team', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          traktTeamQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(TraktTeamMappedMock);
  });
});
