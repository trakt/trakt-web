import { EpisodeSiloMappedMock } from '$mocks/data/summary/episodes/silo/mapped/EpisodeSiloMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowActivityHistoryResponseMock } from '$mocks/data/users/response/ShowActivityHistoryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { captureRequests } from '$test/beds/request/captureRequests.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useShowWatchedEpisodes } from './useShowWatchedEpisodes.ts';

const HISTORY_REQUEST = `GET /users/me/history/shows/${ShowSiloMappedMock.id}`;

describe('store: useShowWatchedEpisodes', () => {
  beforeEach(() => {
    server.use(
      http.get('http://localhost/users/me/history/shows/*', () =>
        HttpResponse.json(ShowActivityHistoryResponseMock, {
          headers: {
            'X-Pagination-Page': '1',
            'X-Pagination-Page-Count': '1',
          },
        }),
      ),
    );
  });

  describe('when authorized', () => {
    beforeEach(() => {
      setAuthorization(true);
    });

    it('should group watched episode numbers by season', async () => {
      const result = await runQuery({
        factory: () =>
          useShowWatchedEpisodes({ showId: ShowSiloMappedMock.id })
            .watchedBySeason,
        waitFor: (value) => (value?.size ?? 0) > 0,
      });

      expect(result).to.deep.equal(
        new Map([
          [
            EpisodeSiloMappedMock.season,
            new Set([EpisodeSiloMappedMock.number]),
          ],
        ]),
      );
    });
  });

  describe('when unauthorized', () => {
    beforeEach(() => {
      setAuthorization(false);
    });

    it('should not request the user history', async () => {
      const requests = await captureRequests(() =>
        runQuery({
          factory: () =>
            useShowWatchedEpisodes({ showId: ShowSiloMappedMock.id })
              .watchedBySeason,
        }),
      );

      expect(requests).not.toContain(HISTORY_REQUEST);
    });

    it('should report no watched episodes', async () => {
      const result = await runQuery({
        factory: () =>
          useShowWatchedEpisodes({ showId: ShowSiloMappedMock.id })
            .watchedBySeason,
      });

      expect(result).to.deep.equal(new Map());
    });

    it('should not be loading', async () => {
      const result = await runQuery({
        factory: () =>
          useShowWatchedEpisodes({ showId: ShowSiloMappedMock.id }).isLoading,
        waitFor: (value) => value === false,
      });

      expect(result).to.equal(false);
    });
  });
});
