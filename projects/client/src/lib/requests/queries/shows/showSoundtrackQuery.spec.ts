import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSoundtrackMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSoundtrackMappedMock.ts';
import { createTestBedQuery } from '$test/beds/query/createTestBedQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { describe, expect, it } from 'vitest';
import { showSoundtrackQuery } from './showSoundtrackQuery.ts';

describe('showSoundtrackQuery', () => {
  it('should query for the show soundtrack', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedQuery(
          showSoundtrackQuery({ slug: ShowSiloMappedMock.slug, locale: 'en' }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(ShowSiloSoundtrackMappedMock);
  });
});
