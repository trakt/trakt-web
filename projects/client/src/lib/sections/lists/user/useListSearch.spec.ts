import { renderStore } from '$test/beds/store/renderStore.ts';
import { cleanup } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useListSearch } from './useListSearch.svelte.ts';

const goto = vi.hoisted(() => vi.fn());

vi.mock('$app/navigation', () => ({ goto }));

// A reactive `page.url`, so the hook can see URL changes it did not make.
const location = await vi.hoisted(async () => {
  const { createLocationState } = await import(
    '$test/beds/svelte/createLocationState.svelte.ts'
  );
  return createLocationState();
});

vi.mock('$app/state', () => ({
  page: {
    get url() {
      return location.url;
    },
    route: { id: null },
  },
}));

// Comfortably past the hook's debounce window.
const PAST_DEBOUNCE_MS = 1000;

function navigateTo(search: string) {
  globalThis.history.replaceState(
    {},
    '',
    `/users/me/lists/view/personal${search}`,
  );
  location.sync();
}

function navigateExternally(search: string) {
  navigateTo(search);
  flushSync();
}

function renderHook() {
  return renderStore(() => useListSearch());
}

function lastNavigatedUrl() {
  const [url] = goto.mock.lastCall ?? [];
  return url instanceof URL ? url : undefined;
}

describe('store: useListSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    goto.mockClear();
    navigateTo('');
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('should start closed and empty without a url term', async () => {
    const search = await renderHook();

    expect(search.isOpen).toBe(false);
    expect(search.term).toBe('');
    expect(search.filter).toBe('');
  });

  it('should start open with the term from the url', async () => {
    navigateTo('?terms=marvel');
    const search = await renderHook();

    expect(search.isOpen).toBe(true);
    expect(search.term).toBe('marvel');
    expect(search.filter).toBe('marvel');
  });

  it('should debounce the filter and mirror it into the url', async () => {
    const search = await renderHook();
    search.term = ' Marvel ';

    expect(search.term).toBe(' Marvel ');
    expect(search.filter).toBe('');
    expect(goto).not.toHaveBeenCalled();

    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(search.filter).toBe('Marvel');
    expect(lastNavigatedUrl()?.searchParams.get('terms')).toBe('Marvel');
    expect(goto).toHaveBeenCalledWith(expect.any(URL), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });
  });

  it('should only commit the last value typed within the debounce window', async () => {
    const search = await renderHook();
    ['ma', 'mar', 'marv'].forEach((keystroke) => {
      search.term = keystroke;
    });

    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(goto).toHaveBeenCalledTimes(1);
    expect(search.filter).toBe('marv');
  });

  it('should drop a pending commit when its owner is destroyed', async () => {
    const search = await renderHook();
    search.term = 'marvel';

    cleanup();
    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(goto).not.toHaveBeenCalled();
    expect(search.filter).toBe('');
  });

  it('should follow the url when it changes without the hook', async () => {
    navigateTo('?terms=marvel');
    const search = await renderHook();

    navigateExternally('');

    expect(search.filter).toBe('');
    expect(search.term).toBe('');
    expect(search.isOpen).toBe(false);
  });

  it('should drop a pending commit when the url moves on', async () => {
    const search = await renderHook();
    search.term = 'star';

    navigateExternally('?terms=heretic');
    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(goto).not.toHaveBeenCalled();
    expect(search.filter).toBe('heretic');
    expect(search.isOpen).toBe(true);
  });

  it('should keep the field open when the text is cleared', async () => {
    const search = await renderHook();
    search.open();
    search.term = 'mar';
    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    search.term = '';
    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(search.filter).toBe('');
    expect(search.isOpen).toBe(true);
  });

  it('should clear the term and the url when closed', async () => {
    navigateTo('?terms=marvel&sort_by=name');
    const search = await renderHook();
    search.term = 'marvel movies';

    search.close();
    vi.advanceTimersByTime(PAST_DEBOUNCE_MS);

    expect(search.isOpen).toBe(false);
    expect(search.term).toBe('');
    expect(search.filter).toBe('');

    const url = lastNavigatedUrl();
    expect(url?.searchParams.has('terms')).toBe(false);
    expect(url?.searchParams.get('sort_by')).toBe('name');
  });

  it('should toggle between open and closed', async () => {
    const search = await renderHook();

    search.toggle();
    expect(search.isOpen).toBe(true);

    search.toggle();
    expect(search.isOpen).toBe(false);
  });
});
