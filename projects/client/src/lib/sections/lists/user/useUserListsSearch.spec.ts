import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const goto = vi.hoisted(() => vi.fn());

vi.mock('$app/navigation', () => ({ goto }));

function navigateTo(search: string) {
  globalThis.history.replaceState(
    {},
    '',
    `/users/me/lists/view/personal${search}`,
  );
}

async function loadHook() {
  vi.resetModules();
  const { useUserListsSearch } = await import('./useUserListsSearch.svelte.ts');

  return useUserListsSearch();
}

function lastNavigatedUrl() {
  const [url] = goto.mock.lastCall ?? [];
  return url instanceof URL ? url : undefined;
}

describe('store: useUserListsSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    goto.mockClear();
    navigateTo('');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start closed and empty without a url term', async () => {
    const search = await loadHook();

    expect(search.isOpen).toBe(false);
    expect(search.term).toBe('');
    expect(search.filter).toBe('');
  });

  it('should start open with the term from the url', async () => {
    navigateTo('?terms=marvel');
    const search = await loadHook();

    expect(search.isOpen).toBe(true);
    expect(search.term).toBe('marvel');
    expect(search.filter).toBe('marvel');
  });

  it('should debounce the filter and mirror it into the url', async () => {
    const search = await loadHook();
    search.term = ' Marvel ';

    expect(search.term).toBe(' Marvel ');
    expect(search.filter).toBe('');
    expect(goto).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(search.filter).toBe('Marvel');
    expect(lastNavigatedUrl()?.searchParams.get('terms')).toBe('Marvel');
    expect(goto).toHaveBeenCalledWith(expect.any(URL), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  });

  it('should only commit the last value typed within the debounce window', async () => {
    const search = await loadHook();
    search.term = 'ma';
    search.term = 'mar';
    search.term = 'marv';

    vi.runAllTimers();

    expect(goto).toHaveBeenCalledTimes(1);
    expect(search.filter).toBe('marv');
  });

  it('should clear the term and the url when closed', async () => {
    navigateTo('?terms=marvel&sort_by=name');
    const search = await loadHook();
    search.term = 'marvel movies';

    search.close();
    vi.runAllTimers();

    expect(search.isOpen).toBe(false);
    expect(search.term).toBe('');
    expect(search.filter).toBe('');

    const url = lastNavigatedUrl();
    expect(url?.searchParams.has('terms')).toBe(false);
    expect(url?.searchParams.get('sort_by')).toBe('name');
  });

  it('should toggle between open and closed', async () => {
    const search = await loadHook();

    search.toggle();
    expect(search.isOpen).toBe(true);

    search.toggle();
    expect(search.isOpen).toBe(false);
  });
});
