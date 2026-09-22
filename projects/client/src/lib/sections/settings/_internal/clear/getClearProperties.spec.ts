import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import { MediaLibraryResponseMock } from '$mocks/data/sync/response/MediaLibraryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { filter, firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { getClearProperties } from './getClearProperties.ts';

describe('getClearProperties invalidation', () => {
  it('should refetch an inactive library with a new marker after clearing', async () => {
    const markers: Array<string | null> = [];
    let cleared = false;
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        markers.push(new URL(request.url).searchParams.get('marker'));
        return HttpResponse.json(cleared ? [] : MediaLibraryResponseMock);
      }),
    );
    const { query, invalidateAll } = await renderStore(() => ({
      query: createTestBedInfiniteQuery(
        libraryQuery({ availableOn: 'other', page: 1, limit: 1 }),
      ),
      ...useInvalidator(),
    }));
    const initial = await firstValueFrom(
      query.pipe(filter((result) => result.isSuccess)),
    );
    expect(initial.data?.pages.at(0)?.entries.length).toBeGreaterThan(0);

    cleared = true;
    const { invalidations } = getClearProperties({
      type: 'library',
      input: { movies: new Set(), episodes: new Set() },
    });
    await invalidateAll(invalidations, { refetchType: 'all' });

    expect(markers).toHaveLength(2);
    expect(markers.at(0)).toBeTruthy();
    expect(markers.at(1)).not.toBe(markers.at(0));
    const updated = await firstValueFrom(
      query.pipe(filter((result) => result.isSuccess)),
    );
    expect(updated.data?.pages.at(0)?.entries).toEqual([]);
  });
});
