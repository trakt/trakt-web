import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { DEFAULT_DRILL_SIZE } from '$lib/utils/constants.ts';
import { MediaLibraryResponseMock } from '$mocks/data/sync/response/MediaLibraryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { combineLatest, filter, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useLibraryList } from './useLibraryList.ts';

describe('useLibraryList', () => {
  it.each(
    [
      { type: 'movie', endpoint: 'movies', entryType: 'movie' },
      { type: 'show', endpoint: 'episodes', entryType: 'episode' },
    ] as const,
  )(
    'should refresh a cached empty $type library with a new marker',
    async ({ type, endpoint, entryType }) => {
      let populated = false;
      const markers: Array<string | null> = [];
      const entry = MediaLibraryResponseMock.find((item) =>
        item.type === entryType
      );
      server.use(
        http.get(
          `http://localhost/sync/collection/${endpoint}`,
          ({ request }) => {
            const url = new URL(request.url);
            expect(url.searchParams.get('available_on')).toBe('other');
            markers.push(url.searchParams.get('marker'));
            return HttpResponse.json(populated ? [entry] : [], {
              headers: {
                'X-Pagination-Page': '1',
                'X-Pagination-Page-Count': '1',
              },
            });
          },
        ),
      );
      const { cached, list, isLoading, hasNextPage } = await renderStore(
        () => ({
          cached: createTestBedInfiniteQuery(
            libraryQuery({
              availableOn: 'other',
              page: 1,
              limit: DEFAULT_DRILL_SIZE,
              type,
            }),
          ),
          ...useLibraryList({
            library: 'other',
            limit: DEFAULT_DRILL_SIZE,
            type,
          }),
        }),
      );
      await firstValueFrom(cached.pipe(filter((query) => query.isSuccess)));
      populated = true;

      const [, items] = await firstValueFrom(
        combineLatest([hasNextPage, list, isLoading]).pipe(
          filter(([, , loading]) => !loading),
        ),
      );

      expect(markers).toHaveLength(2);
      expect(markers.at(0)).toBeTruthy();
      expect(markers.at(1)).not.toBe(markers.at(0));
      expect(items).toHaveLength(1);
      expect(items.at(0)?.type).toBe(entryType);
    },
  );

  it('should keep the refreshed marker when loading the next page', async () => {
    const requests: Array<{ page: string; marker: string | null }> = [];
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page') ?? '1';
        requests.push({ page, marker: url.searchParams.get('marker') });
        const type = page === '1' ? 'movie' : 'episode';
        return HttpResponse.json([
          MediaLibraryResponseMock.find((entry) => entry.type === type),
        ], {
          headers: {
            'X-Pagination-Page': page,
            'X-Pagination-Page-Count': '2',
          },
        });
      }),
    );
    const { list, isLoading, hasNextPage, fetchNextPage } = await renderStore(
      () => useLibraryList({ library: 'other', limit: 1 }),
    );
    const state = combineLatest([hasNextPage, list, isLoading]);
    const [hasMore, initialItems] = await firstValueFrom(
      state.pipe(filter(([, , loading]) => !loading)),
    );
    expect(hasMore).toBe(true);
    expect(initialItems).toHaveLength(1);

    await fetchNextPage();
    const [hasMoreAfterFetch] = await firstValueFrom(
      state.pipe(
        filter(([, items, loading]) => !loading && items.length === 2),
      ),
    );
    expect(hasMoreAfterFetch).toBe(false);
    expect(requests.map((request) => request.page)).toEqual(['1', '2']);
    expect(requests.at(0)?.marker).toBeTruthy();
    expect(requests.at(1)?.marker).toBe(requests.at(0)?.marker);
  });
});
