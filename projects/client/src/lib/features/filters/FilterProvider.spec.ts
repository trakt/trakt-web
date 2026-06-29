import { goto } from '$app/navigation';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FilterProvider from './FilterProvider.svelte';
import { DISCOVER_MODE_PARAM } from './_internal/constants.ts';
import { FilterKey } from './models/Filter.ts';
import { STORED_FILTERS_KEY } from './useStoredFilters.ts';

const children = createRawSnippet(() => ({
  render: () => '<span>child</span>',
}));

describe('FilterProvider', () => {
  const renderProvider = () =>
    renderComponent(FilterProvider, { props: { children } });

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/movies');
  });

  it('should restore stored filters into the URL on mount', async () => {
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.Genres]: 'action' }),
    );

    renderProvider();

    await waitFor(() => expect(goto).toHaveBeenCalledTimes(1));

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get(FilterKey.Genres)).toBe('action');
  });

  it('should set discover mode when there are no stored filters', async () => {
    renderProvider();

    await waitFor(() => expect(goto).toHaveBeenCalledTimes(1));

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get(DISCOVER_MODE_PARAM)).toBe('media');
  });

  it('should set discover mode when stored filters are empty', async () => {
    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify({}));

    renderProvider();

    await waitFor(() => expect(goto).toHaveBeenCalledTimes(1));

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get(DISCOVER_MODE_PARAM)).toBe('media');
  });

  it('should not override filters already present in the URL', async () => {
    window.history.replaceState({}, '', `/movies?${FilterKey.Genres}=comedy`);
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.Genres]: 'action' }),
    );

    renderProvider();

    await waitFor(() => expect(goto).toHaveBeenCalledTimes(1));

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get(FilterKey.Genres)).toBe('comedy');
  });
});
