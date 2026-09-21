import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { useIsDropped } from './useIsDropped.ts';

function serveDropped(ids: number[]) {
  server.use(
    http.get(
      'http://localhost/v3/users/me/dropped/minimal',
      () => HttpResponse.json(ids),
    ),
  );
}

describe('store: useIsDropped', () => {
  describe('when authorized', () => {
    beforeEach(() => {
      setAuthorization(true);
    });

    it('should be true for a dropped show', async () => {
      serveDropped([ShowSiloMappedMock.id]);

      const result = await runQuery({
        factory: () => useIsDropped(ShowSiloMappedMock).isDropped,
        waitFor: (value) => value === true,
      });

      expect(result).to.equal(true);
    });
  });

  describe('when unauthorized', () => {
    beforeEach(() => {
      setAuthorization(false);
    });

    it('should be false for a dropped show', async () => {
      serveDropped([ShowSiloMappedMock.id]);

      const result = await runQuery({
        factory: () => useIsDropped(ShowSiloMappedMock).isDropped,
        waitFor: (value) => value === false,
      });

      expect(result).to.equal(false);
    });
  });
});
