import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { server } from '$mocks/server.ts';
import { renderStore, setAuthorization } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useDrop } from './useDrop.ts';

const props = {
  id: ShowSiloMappedMock.id,
  type: 'show' as const,
  title: ShowSiloMappedMock.title,
};

describe('useDrop', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  describe('when the drop never reaches the server', () => {
    beforeEach(() => {
      server.use(
        http.post('http://localhost/users/hidden/:section', () =>
          HttpResponse.error(),
        ),
      );
    });

    it('should settle instead of rejecting', async () => {
      const { drop } = await renderStore(() => useDrop(props));

      await expect(drop()).resolves.toBeUndefined();
    });

    it('should stop dropping', async () => {
      const { drop, isDropping } = await renderStore(() => useDrop(props));

      await drop();

      expect(await firstValueFrom(isDropping)).toBe(false);
    });
  });
});
