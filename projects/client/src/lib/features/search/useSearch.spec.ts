import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForEmission } from '$test/readable/waitForEmission.ts';
import type { Subscription } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  /**
   * TODO: add more scenarios here once I figure out the AbortSignal error in testing
   */
});

// Real timers: rxjs captures its own scheduler, so vitest's fake timers do not
// drive `debounceTime` here. Waits are kept just past the tracking debounce.
const settle = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe('useSearch: tracking volume', () => {
  let subscription: Subscription | undefined;

  // Tracking only runs while `results` is subscribed, so every case needs a
  // live subscription and a teardown.
  async function renderTrackedSearch() {
    const { search, results } = await renderStore(() => useSearch());
    subscription = results.subscribe();
    return search;
  }

  afterEach(() => {
    subscription?.unsubscribe();
    trackSpy.mockClear();
  });

  it(
    'should report one search for a query typed a character at a time',
    async () => {
      const search = await renderTrackedSearch();

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
    const search = await renderTrackedSearch();

    search('silo', 'media');
    await settle(1400);

    search('severance', 'media');
    await settle(1400);

    expect(trackSpy).toHaveBeenCalledTimes(2);
  }, 15000);

  it('should not report a search for an empty term', async () => {
    const search = await renderTrackedSearch();

    search('   ', 'media');
    await settle(1400);

    expect(trackSpy).not.toHaveBeenCalled();
  }, 15000);
});
