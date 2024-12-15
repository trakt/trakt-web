// @ts-ignore TODO: (@seferturan): fix typings in vs code
import QueryTestBed from '$test/beds/query/QueryTestBed.svelte';

import { setLocale } from '$lib/features/i18n/index.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/MovieHereticMappedMock.ts';
import { MovieHereticPortugueseMappedMock } from '$mocks/data/summary/movies/heretic/MovieHereticPortugueseMappedMock.ts';
import { waitForQueryResult } from '$test/beds/query/waitForQueryResult.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { useMovie } from './useMovie.ts';

describe('store: useMovie', () => {
  it('should contain summary for Heretic (2024)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => useMovie(MovieHereticMappedMock.slug).movie,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(MovieHereticMappedMock);
  });

  it('should contain english information for Heretic (2024)', async () => {
    render(QueryTestBed, {
      props: {
        queryFactory: () => useMovie(MovieHereticMappedMock.slug).intl,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal({
      'overview': MovieHereticMappedMock.overview,
      'tagline': MovieHereticMappedMock.tagline,
      'title': MovieHereticMappedMock.title,
    });
  });

  it('should contain portuguese information for Heretic (2024)', async () => {
    setLocale('pt-br');

    render(QueryTestBed, {
      props: {
        queryFactory: () => useMovie(MovieHereticMappedMock.slug).intl,
      },
    });

    const result = await waitForQueryResult();
    expect(result).to.deep.equal(MovieHereticPortugueseMappedMock);
  });
});
