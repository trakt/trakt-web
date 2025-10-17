import { EpisodeSiloTranslationsMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloTranslationsMappedMock.ts';
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
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([EpisodeSiloTranslationsMappedMock.get('en')]);
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
            enabled: true,
          }),
        ),
      mapper: (response) => response?.data,
    });

    expect(result).to.deep.equal([EpisodeSiloTranslationsMappedMock.get('nl')]);
  });
});
