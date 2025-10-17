import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloTranslationsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloTranslationsMappedMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { showIntlQuery } from './showIntlQuery.ts';

describe('showIntlQuery', () => {
  it('should query English summary for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showIntlQuery({
            slug: ShowSiloMappedMock.slug,
            language: 'en',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([ShowSiloTranslationsMappedMock.get('en')]);
  });

  it('should query Dutch summary for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showIntlQuery({
            slug: ShowSiloMappedMock.slug,
            language: 'nl',
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([ShowSiloTranslationsMappedMock.get('nl')]);
  });
});
