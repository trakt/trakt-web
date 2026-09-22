import { MediaLibraryResponseMock } from '$mocks/data/sync/response/MediaLibraryResponseMock.ts';
import { server } from '$mocks/server.ts';
import { runQuery } from '$test/beds/query/runQuery.ts';
import { libraryQuery } from '$lib/requests/queries/sync/libraryQuery.ts';
import { createTestBedInfiniteQuery } from '$test/beds/query/createTestBedInfiniteQuery.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { http, HttpResponse } from 'msw';
import { filter, firstValueFrom, tap } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useCustomLibrary } from './useCustomLibrary.ts';

describe('useCustomLibrary', () => {
  it('should replace a cached empty library using a new marker before exposing the clear option', async () => {
    const markers: Array<string | null> = [];
    let populated = false;
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        markers.push(new URL(request.url).searchParams.get('marker'));
        return HttpResponse.json(populated ? MediaLibraryResponseMock : [], {
          headers: { 'X-Pagination-Page': '1', 'X-Pagination-Page-Count': '1' },
        });
      }),
    );
    const { cached, collection } = await renderStore(() => ({
      cached: createTestBedInfiniteQuery(
        libraryQuery({ availableOn: 'other', limit: 250 }),
      ),
      collection: useCustomLibrary(),
    }));
    await firstValueFrom(cached.pipe(filter((result) => result.isSuccess)));
    populated = true;
    const emissions: Array<number | null> = [];
    const result = await firstValueFrom(collection.pipe(
      tap((value) =>
        emissions.push(value ? value.movies.size + value.episodes.size : null)
      ),
      filter((value) => value !== null),
    ));

    expect(markers).toHaveLength(2);
    expect(markers.at(0)).toBeTruthy();
    expect(markers.at(1)).not.toBe(markers.at(0));
    expect(result.movies.size + result.episodes.size).toBeGreaterThan(0);
    expect(emissions.at(0)).toBeNull();
    expect(emissions).not.toContain(0);
  });

  it('should collect all non-Plex pages before exposing IDs for the clear option', async () => {
    const movie = MediaLibraryResponseMock.find((item) =>
      item.type === 'movie'
    );
    const episode = MediaLibraryResponseMock.find((item) =>
      item.type === 'episode'
    );
    const pages: string[] = [];
    server.use(
      http.get('http://localhost/sync/collection/media', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('available_on')).toBe('other');
        const page = url.searchParams.get('page') ?? '1';
        pages.push(page);
        return HttpResponse.json(page === '1' ? [movie] : [episode], {
          headers: {
            'X-Pagination-Page': page,
            'X-Pagination-Page-Count': '2',
          },
        });
      }),
    );
    const result = await runQuery({
      factory: useCustomLibrary,
      waitFor: (value) => value !== null,
    });
    expect(pages).toEqual(['1', '2']);
    expect(result).toEqual({
      movies: new Set([movie?.movie?.ids.trakt]),
      episodes: new Set([episode?.episode?.ids.trakt]),
    });
  });

  it('should expose an empty custom library even when Plex has items', async () => {
    server.use(
      http.get(
        'http://localhost/sync/collection/media',
        ({ request }) =>
          HttpResponse.json(
            new URL(request.url).searchParams.get('available_on') === 'other'
              ? []
              : MediaLibraryResponseMock,
          ),
      ),
    );
    const result = await runQuery({
      factory: useCustomLibrary,
      waitFor: (value) => value !== null,
    });
    expect(result).toEqual({ movies: new Set(), episodes: new Set() });
  });
});
