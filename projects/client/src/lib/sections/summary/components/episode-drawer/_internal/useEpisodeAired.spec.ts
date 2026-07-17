import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { time } from '$lib/utils/timing/time.ts';
import { ShowSiloSeasonEpisodesMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonEpisodesMappedMock.ts';
import { ShowSiloSeasonEpisodesResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloSeasonEpisodesResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useEpisodeAired } from './useEpisodeAired.ts';

const firstEpisode = assertDefined(ShowSiloSeasonEpisodesMappedMock.at(0));
const firstResponse = assertDefined(ShowSiloSeasonEpisodesResponseMock.at(0));

function respondWithUnairedSeason() {
  const releaseDate = new Date(Date.now() + time.days(7)).toISOString();

  server.use(
    http.get(
      `http://localhost/shows/${ShowSiloResponseMock.ids.slug}/seasons/${firstEpisode.season}*`,
      () =>
        HttpResponse.json([{
          ...firstResponse,
          'first_aired': releaseDate,
          'released': releaseDate,
          'effective_release_date': releaseDate,
        }]),
    ),
  );
}

function resolveIsAired() {
  return runQuery({
    factory: () =>
      useEpisodeAired(
        valueObservable({
          slug: ShowSiloResponseMock.ids.slug,
          season: firstEpisode.season,
          episode: firstEpisode.number,
        }),
      ).isAired,
    waitFor: (value) => value != null,
  });
}

describe('store: useEpisodeAired', () => {
  it('should resolve aired from the season episode list', async () => {
    expect(await resolveIsAired()).to.equal(true);
  });

  it('should resolve not aired for an episode releasing in the future', async () => {
    respondWithUnairedSeason();

    expect(await resolveIsAired()).to.equal(false);
  });
});
