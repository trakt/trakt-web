import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { MovieHereticTranslationsMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticTranslationsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { movieIntlQuery } from './movieIntlQuery.ts';

describe('movieIntlQuery', () => {
  it('should query English summary for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieIntlQuery({
            slug: MovieHereticMappedMock.slug,
            language: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([
      MovieHereticTranslationsMappedMock.get('en'),
    ]);
  });

  it('should query Dutch summary for Heretic (2024)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          movieIntlQuery({
            slug: MovieHereticMappedMock.slug,
            language: 'nl',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([
      MovieHereticTranslationsMappedMock.get('nl'),
    ]);
  });
});
