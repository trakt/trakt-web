import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { createQuery } from '@tanstack/svelte-query';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { movieSummaryQuery } from './movieSummaryQuery.ts';

describe('movieSummaryQuery', () => {
  it('should query for Heretic (2024)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () =>
          createQuery(movieSummaryQuery({ slug: MovieHereticMappedMock.slug })),
        mapper: (response) => response?.data,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(MovieHereticMappedMock);
  });
});
