import { goto } from '$app/navigation';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FilterMode } from './models/FilterMode.ts';
import {
  STORED_FILTERS_KEY,
  STORED_FILTERS_MODE_KEY,
  useStoredFilters,
} from './useStoredFilters.ts';
import { useParameters } from '../parameters/useParameters.ts';

function setLocation(path: string) {
  globalThis.history.replaceState({}, '', path);
}

function lastNavigatedUrl() {
  const target = vi.mocked(goto).mock.calls.at(-1)?.at(0);

  return target instanceof URL
    ? target
    : new URL(String(target), 'http://localhost');
}

async function saveGenres(genres: string) {
  const stored = await renderStore(() => {
    const parameters = useParameters();
    const hook = useStoredFilters();

    parameters.update({ genres, unrelated: 'ignored' });
    hook.saveFilters();

    return hook;
  });

  await vi.waitFor(() =>
    expect(globalThis.localStorage.getItem(STORED_FILTERS_KEY)).to.be.a(
      'string',
    ),
  );

  return stored;
}

describe('store: useStoredFilters', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    setLocation('/');
    vi.mocked(goto).mockClear();
  });

  afterEach(() => {
    globalThis.localStorage.clear();
    setLocation('/');
  });

  describe('saveFilters', () => {
    it('should keep only known filters from the current parameters', async () => {
      const stored = await saveGenres('drama');

      expect(await firstValueFrom(stored.storedFilters)).to.deep.equal({
        genres: 'drama',
      });
      expect(
        JSON.parse(globalThis.localStorage.getItem(STORED_FILTERS_KEY) ?? '{}'),
      ).to.deep.equal({ genres: 'drama' });
    });
  });

  describe('restoreFilters', () => {
    it('should apply the saved filters when the url has none', async () => {
      const stored = await saveGenres('drama');
      setLocation('/discover');

      stored.restoreFilters();

      expect(lastNavigatedUrl().searchParams.get('genres')).to.equal('drama');
      expect(vi.mocked(goto).mock.calls.at(-1)?.at(1)).to.deep.include({
        replaceState: true,
      });
    });

    it('should keep the filters already in the url', async () => {
      const stored = await saveGenres('drama');
      setLocation('/discover?genres=comedy');

      stored.restoreFilters();

      expect(goto).not.toHaveBeenCalled();
    });

    it('should add the discover mode when missing', async () => {
      const stored = await saveGenres('drama');
      setLocation('/discover');

      stored.restoreFilters('movie');

      expect(lastNavigatedUrl().searchParams.get('mode')).to.equal('movie');
    });

    it('should keep an explicit discover mode in the url', async () => {
      const stored = await saveGenres('drama');
      setLocation('/discover?mode=show');

      stored.restoreFilters('movie');

      expect(lastNavigatedUrl().searchParams.get('mode')).to.equal('show');
    });

    it('should not navigate when nothing changes', async () => {
      const { restoreFilters } = await renderStore(() => useStoredFilters());
      setLocation('/discover');

      restoreFilters();

      expect(goto).not.toHaveBeenCalled();
    });
  });

  describe('resetFilters', () => {
    it('should fall back to the plain path without saved filters', async () => {
      const { resetFilters } = await renderStore(() => useStoredFilters());
      setLocation('/discover?genres=comedy');

      resetFilters();

      expect(goto).toHaveBeenCalledWith('/discover', { replaceState: true });
    });

    it('should replace the url filters with the saved ones', async () => {
      const stored = await saveGenres('drama');
      setLocation('/discover?genres=comedy&mode=show');

      stored.resetFilters();

      const url = lastNavigatedUrl();
      expect(url.searchParams.get('genres')).to.equal('drama');
      expect(url.searchParams.get('mode')).to.equal('show');
    });
  });

  describe('setActiveMode', () => {
    it('should expose and persist the chosen mode', async () => {
      const { setActiveMode, activeMode } = await renderStore(() =>
        useStoredFilters(),
      );

      setActiveMode(FilterMode.Advanced);

      expect(await firstValueFrom(activeMode)).to.equal(FilterMode.Advanced);
      expect(globalThis.localStorage.getItem(STORED_FILTERS_MODE_KEY)).to.equal(
        FilterMode.Advanced,
      );
    });

    it('should fall back to simple for an unknown mode', async () => {
      const { setActiveMode, activeMode } = await renderStore(() =>
        useStoredFilters(),
      );

      setActiveMode('bogus');

      expect(await firstValueFrom(activeMode)).to.equal(FilterMode.Simple);
    });
  });
});
