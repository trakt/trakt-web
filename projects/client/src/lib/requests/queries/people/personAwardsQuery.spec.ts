import { PersonGiamattiAwardsMappedMock } from '$mocks/data/awards/mapped/PersonGiamattiAwardsMappedMock.ts';
import { PersonStreepAwardsMappedMock } from '$mocks/data/awards/mapped/PersonStreepAwardsMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { personAwardsQuery } from './personAwardsQuery.ts';

function queryAwards(slug: string) {
  return runQuery({
    factory: () => createTestBedQuery(personAwardsQuery({ slug })),
    mapper: (response) => response?.data,
  });
}

describe('personAwardsQuery', () => {
  it('should query awards for Meryl Streep', async () => {
    const result = await queryAwards('meryl-streep');

    expect(result).to.deep.equal(PersonStreepAwardsMappedMock);
    expect(result).to.have.length(21);
  });

  it('should query awards for Paul Giamatti', async () => {
    const result = await queryAwards('paul-giamatti');

    expect(result).to.deep.equal(PersonGiamattiAwardsMappedMock);
  });
});
