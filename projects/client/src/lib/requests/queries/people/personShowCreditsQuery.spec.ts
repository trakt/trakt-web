import { PersonFergusonShowCreditsMappedMock } from '$mocks/data/people/mapped/PersonFergusonShowCreditsMappedMock.ts';
import { PersonFergusonResponseMock } from '$mocks/data/people/response/PersonFergusonResponseMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { personShowCreditsQuery } from './personShowCreditsQuery.ts';

describe('personShowCreditsQuery', () => {
  it('should query for show credits', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          personShowCreditsQuery({ slug: PersonFergusonResponseMock.ids.slug }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonFergusonShowCreditsMappedMock);
  });
});
