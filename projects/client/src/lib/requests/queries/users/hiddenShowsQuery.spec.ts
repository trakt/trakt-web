import { HiddenShowProgressMappedMock } from '$mocks/data/users/mapped/HiddenShowProgressMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { hiddenShowsQuery } from './hiddenShowsQuery.ts';

describe('hiddenShowQuery', () => {
  it('should query hidden items', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          hiddenShowsQuery(),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(HiddenShowProgressMappedMock);
  });
});
