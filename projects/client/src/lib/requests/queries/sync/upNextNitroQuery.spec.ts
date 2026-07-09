import { UpNextMappedMock } from '$mocks/data/sync/mapped/UpNextMappedMock.ts';
import { UpNextResponseMock } from '$mocks/data/sync/response/UpNextResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { mapToEntries } from '$test/utils/mapToEntries.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { upNextNitroQuery } from './upNextNitroQuery.ts';

describe('upNextNitroQuery', () => {
  it('should query up next', async () => {
    const result = await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          upNextNitroQuery(),
        ),
      mapper: mapToEntries,
    });

    expect(result).to.deep.equal(UpNextMappedMock);
  });

  it('should request smart sort for up next', async () => {
    let requestedUrl: URL | undefined;

    server.use(
      http.get(
        'http://localhost/sync/progress/up_next_nitro',
        ({ request }) => {
          requestedUrl = new URL(request.url);
          return HttpResponse.json(UpNextResponseMock);
        },
      ),
    );

    await runQuery({
      factory: () =>
        createTestBedInfiniteQuery(
          upNextNitroQuery({ limit: 10, sortBy: 'smart', sortHow: 'desc' }),
        ),
      mapper: mapToEntries,
    });

    expect(requestedUrl?.searchParams.get('sort_by')).toBe('smart');
    expect(requestedUrl?.searchParams.get('sort_how')).toBe('desc');
  });
});
