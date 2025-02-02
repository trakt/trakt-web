import { ShowSiloLanguageMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloLanguageMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
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
            region: 'us',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloLanguageMappedMock.get('en'));
  });

  it('should query Dutch summary for Silo (2023)', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          showIntlQuery({
            slug: ShowSiloMappedMock.slug,
            language: 'nl',
            region: 'nl',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloLanguageMappedMock.get('nl'));
  });
});
