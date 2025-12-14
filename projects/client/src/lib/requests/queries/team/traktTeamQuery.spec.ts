import { TraktTeamMappedMock } from '$mocks/data/team/mapped/TraktTeamMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { traktTeamQuery } from './traktTeamQuery.ts';

describe('traktTeamQuery', () => {
  it('should query for the trakt team', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          traktTeamQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(TraktTeamMappedMock);
  });
});
