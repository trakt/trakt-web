import { PersonGrantMovieCreditsMappedMock } from '$mocks/data/people/mapped/PersonGrantMovieCreditsMappedMock';
import { PersonGrantResponseMock } from '$mocks/data/people/response/PersonGrantResponseMock';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { peopleMovieCreditsQuery } from './peopleMovieCreditsQuery';

describe('peopleMovieCreditsQuery', () => {
  it('should query for movie credits', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          peopleMovieCreditsQuery({
            slug: PersonGrantResponseMock.ids.slug,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(PersonGrantMovieCreditsMappedMock);
  });
});
