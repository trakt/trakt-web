import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { filter, firstValueFrom, tap } from 'rxjs';
import { MediaLibraryResponseMock } from '$mocks/data/sync/response/MediaLibraryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { valueObservable } from '$test/beds/store/valueObservable.ts';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { useLibrarySelection } from './useLibrarySelection.ts';

describe('useLibrarySelection', () => {
  it('should refresh a cached empty result before falling back to Plex', async () => {
    let populated = false;
    const markers: Array<string | null> = [];
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        markers.push(new URL(request.url).searchParams.get('marker'));
        return HttpResponse.json(
          populated ? MediaLibraryResponseMock.slice(0, 1) : [],
        );
      }),
    );
    const { cached, selection } = await renderStore(() => ({
      cached: createTestBedInfiniteQuery(
        libraryQuery({ availableOn: 'other', page: 1, limit: 1 }),
      ),
      ...useLibrarySelection(valueObservable('other')),
    }));
    await firstValueFrom(cached.pipe(filter((query) => query.isSuccess)));
    populated = true;
    const values: string[] = [];
    const result = await firstValueFrom(selection.pipe(
      tap((value) => values.push(value.value)),
      filter((value) => !value.isLoading),
    ));
    expect(result.value).toBe('other');
    expect(result.options).toHaveLength(2);
    expect(values).not.toContain('plex');
    expect(markers).toHaveLength(2);
    expect(markers.at(0)).toBeTruthy();
    expect(markers.at(1)).not.toBe(markers.at(0));
  });

  it('should hide an empty custom library and fall back from a saved selection', async () => {
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('available_on')).toBe('other');
        expect(url.searchParams.get('limit')).toBe('1');
        return HttpResponse.json([]);
      }),
    );

    const selection = await runQuery({
      factory: () => useLibrarySelection(valueObservable('other')).selection,
      waitFor: (selection) =>
        !selection.isLoading && selection.options.length === 1,
    });

    expect(selection.value).toBe('plex');
    expect(selection.options.map((option) => option.value)).toEqual(['plex']);
  });

  it('should hide the custom library while the probe is in flight', async () => {
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        () => HttpResponse.json(MediaLibraryResponseMock.slice(0, 1)),
      ),
    );

    const selection = await runQuery({
      factory: () => useLibrarySelection(valueObservable('other')).selection,
    });

    expect(selection.isLoading).toBe(true);
    expect(selection.options.map((option) => option.value)).toEqual(['plex']);
    expect(selection.value).toBe('other');
  });

  it('should retain custom library when it contains an item', async () => {
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        () => HttpResponse.json(MediaLibraryResponseMock.slice(0, 1)),
      ),
    );

    const selection = await runQuery({
      factory: () => useLibrarySelection(valueObservable('other')).selection,
      waitFor: (selection) => !selection.isLoading,
    });

    expect(selection.value).toBe('other');
    expect(selection.options.map((option) => option.value)).toEqual([
      'plex',
      'other',
    ]);
  });
});
