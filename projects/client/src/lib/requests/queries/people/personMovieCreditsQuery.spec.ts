import { PersonGrantMovieCreditsMappedMock } from '$mocks/data/people/mapped/PersonGrantMovieCreditsMappedMock.ts';
import { PersonGrantResponseMock } from '$mocks/data/people/response/PersonGrantResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { personMovieCreditsQuery } from './personMovieCreditsQuery.ts';

describe('personMovieCreditsQuery', () => {
  it('should query for movie credits', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          personMovieCreditsQuery({
            slug: PersonGrantResponseMock.ids.slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonGrantMovieCreditsMappedMock);
  });
});
