import { MovieHereticResponseMock } from '$mocks/data/summary/movies/heretic/response/MovieHereticResponseMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import type { Subscription } from 'rxjs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { useSearch } from './useSearch.ts';

const { trackSpy } = vi.hoisted(() => ({ trackSpy: vi.fn() }));

vi.mock('../analytics/useTrack.ts', () => ({
  useTrack: () => ({ track: trackSpy }),
}));

describe('useSearch', () => {
  it('should initialize with empty results', async () => {
    const { results } = await renderStore(() => useSearch());

    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should return empty results when search term is empty', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('', 'media');
    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should return empty results when search string is full of whitespaces', async () => {
    const { search, results } = await renderStore(() => useSearch());

    await search('      ', 'media');
    expect(await waitForEmission(results, 1)).toEqual(null);
  });

  it('should include trending entries of every type in media mode', async () => {
    const { search, results } = await renderStore(() => useSearch());

    search(MovieHereticResponseMock.title, 'media');
    // Emission 1 is the intl overlay's empty first pass; 2 carries the items.
    const response = await waitForEmission(results, 2);

    expect(response?.items.map((item) => item.slug)).toContain(
      ShowSiloResponseMock.ids.slug,
    );
  });

  it('should exclude trending entries of other types when a typed mode is active', async () => {
    const { search, results } = await renderStore(() => useSearch());

    search(MovieHereticResponseMock.title, 'movie');
    const response = await waitForEmission(results, 2);
    const items = response?.type === 'media' ? response.items : [];

    expect(items.map((item) => item.slug)).toContain(
      MovieHereticResponseMock.ids.slug,
    );
    expect(items.every((item) => item.type === 'movie')).toBe(true);
  });

  /**
   * TODO: add more scenarios here once I figure out the AbortSignal error in testing
   */
});

// Real timers: rxjs captures its own scheduler, so vitest's fake timers do not
// drive `debounceTime` here. Waits are kept just past the tracking debounce.
const settle = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('useSearch: tracking volume', () => {
  const subscriptions: Subscription[] = [];

  // Tracking only runs while `results` is subscribed, so every case needs a
  // live subscription and a teardown.
  async function renderTrackedSearch() {
    const store = await renderStore(() => useSearch());
    subscriptions.push(store.results.subscribe());
    return store;
  }

  // `shareReplay(1)` keeps a pipeline alive past its subscriber, so earlier
  // tests leave debounced tracks in flight. Drain before counting.
  beforeAll(async () => {
    await settle(1400);
    trackSpy.mockClear();
  });

  afterEach(() => {
    subscriptions.splice(0).forEach((entry) => entry.unsubscribe());
    trackSpy.mockClear();
  });

  it(
    'should report one search for a query typed a character at a time',
    async () => {
      const { search } = await renderTrackedSearch();

      // 300ms between keystrokes is slower than the query debounce, which is
      // what a touch keyboard looks like.
      const query = 'silo';
      for (let length = 1; length <= query.length; length++) {
        search(query.slice(0, length), 'media');
        await settle(300);
      }

      await settle(1400);

      expect(trackSpy).toHaveBeenCalledTimes(1);
      expect(trackSpy).toHaveBeenCalledWith({ mode: 'media' });
    },
    15000,
  );

  it('should report each query when typing settles between them', async () => {
    const { search } = await renderTrackedSearch();

    search('silo', 'media');
    await settle(1400);

    search('severance', 'media');
    await settle(1400);

    expect(trackSpy).toHaveBeenCalledTimes(2);
  }, 15000);

  it('should not re-report when only the mode re-emits', async () => {
    const { search, mode } = await renderTrackedSearch();

    search('silo', 'media');
    await settle(1400);
    expect(trackSpy).toHaveBeenCalledTimes(1);

    // Shared context subject. A re-emission carrying the same value is not a
    // new search, but `combineLatest` republishes the term alongside it.
    mode.next('media');
    await settle(1400);

    expect(trackSpy).toHaveBeenCalledTimes(1);
  }, 15000);

  it(
    'should report once regardless of how many consumers subscribe',
    async () => {
      const { search, results } = await renderTrackedSearch();
      subscriptions.push(results.subscribe(), results.subscribe());

      search('silo', 'media');
      await settle(1400);

      expect(trackSpy).toHaveBeenCalledTimes(1);
    },
    15000,
  );

  it('should report the same term again after the box is cleared', async () => {
    const { search, clear } = await renderTrackedSearch();

    search('silo', 'media');
    await settle(1400);

    clear();
    await settle(1400);

    search('silo', 'media');
    await settle(1400);

    expect(trackSpy).toHaveBeenCalledTimes(2);
  }, 20000);

  it('should not report a search for an empty term', async () => {
    const { search } = await renderTrackedSearch();

    search('   ', 'media');
    await settle(1400);

    expect(trackSpy).not.toHaveBeenCalled();
  }, 15000);
});
