import { EpisodeSiloLanguageMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloLanguageMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { createQuery } from '@tanstack/svelte-query';
import { describe, expect, it } from 'vitest';
import { EpisodeSiloResponseMock } from '../../../../mocks/data/summary/episodes/silo/response/EpisodeSiloResponseMock.ts';
import { episodeIntlQuery } from './episodeIntlQuery.ts';

describe('episodeIntlQuery', () => {
  it('should query for English episode summary', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          episodeIntlQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
            language: 'en',
            region: 'us',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloLanguageMappedMock.get('en'));
  });

  it('should query for Dutch episode summary', async () => {
    const result = await runQuery({
      factory: () =>
        createQuery(
          episodeIntlQuery({
            slug: ShowSiloResponseMock.ids.slug,
            season: EpisodeSiloResponseMock.season,
            episode: EpisodeSiloResponseMock.number,
            language: 'nl',
            region: 'nl',
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal(EpisodeSiloLanguageMappedMock.get('nl'));
  });
});
