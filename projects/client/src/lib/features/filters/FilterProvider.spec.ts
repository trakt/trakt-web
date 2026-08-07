import { goto } from '$app/navigation';
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

describe('FilterProvider', () => {
  const renderProvider = async () => {
    renderComponent(FilterProvider, { props: { children } });
    await tick();
  };

  const storeFilters = (filters: Record<string, string>) =>
    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify(filters));

  const targetUrl = () =>
    new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '', 'http://localhost');

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/movies');
  });

  it('should restore stored filters into the URL on mount', async () => {
    storeFilters({ [FilterKey.Genres]: 'action' });

    await renderProvider();

    expect(goto).toHaveBeenCalledTimes(1);
    expect(targetUrl().searchParams.get(FilterKey.Genres)).toBe('action');
  });

  it('should not add the discover mode when restoring stored filters', async () => {
    storeFilters({ [FilterKey.Genres]: 'action' });

    await renderProvider();

    expect(targetUrl().searchParams.has(DISCOVER_MODE_PARAM)).toBe(false);
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
});
