import { renderStore } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useUpNextSorting } from './useUpNextSorting.ts';

describe('useUpNextSorting', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('should offer smart sorting', async () => {
    const { sorting } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
    }));
    const options = await firstValueFrom(sorting.options);

    expect(options.some((option) => option.value === 'smart')).toBe(true);
  });

  it('should apply smart sorting from URL', async () => {
    history.replaceState(null, '', '/?sort_by=smart');

    const { sorting } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
    }));
    const current = await firstValueFrom(sorting.current);

    expect(current.sorting.value).toBe('smart');
  });

  it('should describe direction-dependent sorting per sort direction', async () => {
    const { sorting } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
    }));
    const options = await firstValueFrom(sorting.options);

    const subtitleFor = (value: string) =>
      options.find((option) => option.value === value)?.description;

    expect(subtitleFor('released')?.('desc')).toBe('Newest first');
    expect(subtitleFor('released')?.('asc')).toBe('Oldest first');
    expect(subtitleFor('remaining')?.('desc')).toBe('Most episodes left');
    expect(subtitleFor('remaining')?.('asc')).toBe('Fewest episodes left');
  });

  it('should describe direction-neutral sorting the same in both directions', async () => {
    const { sorting } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
    }));
    const options = await firstValueFrom(sorting.options);
    const defaultOption = options.find((option) => option.value === undefined);

    expect(defaultOption?.description?.('asc')).toBe(
      defaultOption?.description?.('desc'),
    );
  });
});
