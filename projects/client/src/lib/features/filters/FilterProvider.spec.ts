import { afterNavigate, goto } from '$app/navigation';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { waitFor } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FilterProvider from './FilterProvider.svelte';
import { FilterKey } from './models/Filter.ts';
import { STORED_FILTERS_KEY } from './useStoredFilters.ts';

const children = createRawSnippet(() => ({
  render: () => '<span>child</span>',
}));

describe('FilterProvider', () => {
  /*
    afterNavigate is mocked as a no-op, so it never invokes its callback.
    Capture every registered callback and replay them to simulate a
    navigation landing on the page.
  */
  let navigationCallbacks: Array<() => void> = [];

  const replayNavigation = () =>
    navigationCallbacks.forEach((callback) => callback());

  /*
    The component mounts behind async providers, so wait until it has
    registered with afterNavigate before replaying a navigation.
  */
  const renderProvider = async () => {
    renderComponent(FilterProvider, { props: { children } });
    await waitFor(() => expect(navigationCallbacks.length).toBeGreaterThan(0));
  };

  beforeEach(() => {
    localStorage.clear();
    navigationCallbacks = [];

    vi.mocked(afterNavigate).mockImplementation((callback) => {
      navigationCallbacks.push(callback as () => void);
    });

    window.history.replaceState({}, '', '/movies');
  });

  it('should restore stored filters into the URL on navigation', async () => {
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.Genres]: 'action' }),
    );

    await renderProvider();
    replayNavigation();

    expect(goto).toHaveBeenCalledTimes(1);

    const target = new URL(vi.mocked(goto).mock.calls.at(0)?.[0] ?? '');
    expect(target.searchParams.get(FilterKey.Genres)).toBe('action');
  });

  it('should not navigate when there are no stored filters', async () => {
    await renderProvider();
    replayNavigation();

    expect(goto).not.toHaveBeenCalled();
  });

  it('should not navigate when stored filters are empty', async () => {
    localStorage.setItem(STORED_FILTERS_KEY, JSON.stringify({}));

    await renderProvider();
    replayNavigation();

    expect(goto).not.toHaveBeenCalled();
  });

  it('should not override filters already present in the URL', async () => {
    window.history.replaceState({}, '', `/movies?${FilterKey.Genres}=comedy`);
    localStorage.setItem(
      STORED_FILTERS_KEY,
      JSON.stringify({ [FilterKey.Genres]: 'action' }),
    );

    await renderProvider();
    replayNavigation();

    expect(goto).not.toHaveBeenCalled();
  });
});
