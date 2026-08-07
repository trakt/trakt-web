import { goto } from '$app/navigation';
import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { createRawSnippet, tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FilterProvider from './FilterProvider.svelte';
import { DISCOVER_MODE_PARAM } from './_internal/constants.ts';
import { FilterKey } from './models/Filter.ts';
import { STORED_FILTERS_KEY } from './useStoredFilters.ts';

const children = createRawSnippet(() => ({
  render: () => '<span>child</span>',
}));

const DISCOVER_TOGGLER_KEY = 'trakt_toggler_discover';

describe('FilterProvider', () => {
  const renderProvider = async () => {
    renderComponent(FilterProvider, { props: { children } });
    await tick();
    await tick();
  };

  const storeFilters = (filters: Record<string, string>) =>
    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify(filters));

  const storeMode = (mode: string) =>
    localStorage.setItem(DISCOVER_TOGGLER_KEY, JSON.stringify(mode));

  const targetUrl = () =>
    new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '', 'http://localhost');

  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
    window.history.replaceState({}, '', '/movies');
  });

  it('should restore stored filters into the URL on mount', async () => {
    storeFilters({ [FilterKey.Genres]: 'action' });

    await renderProvider();

    expect(goto).toHaveBeenCalledTimes(1);
    expect(targetUrl().searchParams.get(FilterKey.Genres)).toBe('action');
  });

  it('should not navigate when there are no stored filters', async () => {
    await renderProvider();

    expect(goto).not.toHaveBeenCalled();
  });

  it('should not navigate when stored filters are empty', async () => {
    storeFilters({});

    await renderProvider();

    expect(goto).not.toHaveBeenCalled();
  });

  it('should not override filters already present in the URL', async () => {
    window.history.replaceState({}, '', `/movies?${FilterKey.Genres}=comedy`);
    storeFilters({ [FilterKey.Genres]: 'action' });

    await renderProvider();

    expect(goto).not.toHaveBeenCalled();
  });

  describe('discover mode', () => {
    it('should not add the default mode to the URL', async () => {
      storeFilters({ [FilterKey.Genres]: 'action' });
      storeMode('media');

      await renderProvider();

      expect(goto).toHaveBeenCalledTimes(1);
      expect(targetUrl().searchParams.has(DISCOVER_MODE_PARAM)).toBe(false);
    });

    it('should not navigate for the default mode alone', async () => {
      storeMode('media');

      await renderProvider();

      expect(goto).not.toHaveBeenCalled();
    });

    it('should restore a non-default mode into the URL', async () => {
      storeMode('movie');

      await renderProvider();

      expect(goto).toHaveBeenCalledTimes(1);
      expect(targetUrl().searchParams.get(DISCOVER_MODE_PARAM)).toBe('movie');
    });

    it('should restore a non-default mode alongside stored filters', async () => {
      storeFilters({ [FilterKey.Genres]: 'action' });
      storeMode('show');

      await renderProvider();

      expect(goto).toHaveBeenCalledTimes(1);

      const params = targetUrl().searchParams;
      expect(params.get(DISCOVER_MODE_PARAM)).toBe('show');
      expect(params.get(FilterKey.Genres)).toBe('action');
    });

    it('should not override a mode already present in the URL', async () => {
      window.history.replaceState(
        {},
        '',
        `/movies?${DISCOVER_MODE_PARAM}=show`,
      );
      storeMode('movie');

      await renderProvider();

      expect(goto).not.toHaveBeenCalled();
    });
  });
});
