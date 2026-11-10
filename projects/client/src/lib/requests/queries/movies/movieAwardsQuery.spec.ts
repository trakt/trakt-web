import { MovieOppenheimerAwardsMappedMock } from '$mocks/data/awards/mapped/MovieOppenheimerAwardsMappedMock.ts';
import { MoviePerfectDaysAwardsMappedMock } from '$mocks/data/awards/mapped/MoviePerfectDaysAwardsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { movieAwardsQuery } from './movieAwardsQuery.ts';

function queryAwards(slug: string) {
  return runQuery({
    factory: () => createTestBedQuery(movieAwardsQuery({ slug })),
    mapper: (response) => response?.data,
  });
}

describe('movieAwardsQuery', () => {
  it('should query awards for Oppenheimer (2023)', async () => {
    const result = await queryAwards('oppenheimer-2023');

    expect(result).to.deep.equal(MovieOppenheimerAwardsMappedMock);
    expect(result).to.have.length(21);
  });

  it('should query awards for Perfect Days (2023)', async () => {
    const result = await queryAwards('perfect-days-2023');

    expect(result).to.deep.equal(MoviePerfectDaysAwardsMappedMock);
  });

  it('should return no awards for a title without any', async () => {
    const result = await queryAwards('talk-to-me-2023');

    expect(result).to.deep.equal([]);
  });

  it('should return no awards for an unknown title', async () => {
    const result = await queryAwards('unknown-title');

    expect(result).to.deep.equal([]);
  });
});
