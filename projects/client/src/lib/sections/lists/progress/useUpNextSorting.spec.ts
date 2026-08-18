import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useUpNextSorting } from './useUpNextSorting.ts';

describe('useUpNextSorting', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('should hide smart sorting until the preview flag is enabled', async () => {
    const { sorting, featureFlag } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
      featureFlag: useFeatureFlag(),
    }));
    const hasSmartOption = () =>
      firstValueFrom(
        sorting.options.pipe(
          map((options) => options.some((option) => option.value === 'smart')),
        ),
      );
    const waitForSmartOption = () =>
      firstValueFrom(
        sorting.options.pipe(
          map((options) => options.some((option) => option.value === 'smart')),
          filter(Boolean),
          take(1),
        ),
      );

    expect(await hasSmartOption()).toBe(false);

    featureFlag.setFlag(FeatureFlag.UpNextSmartSort, true);

    expect(await waitForSmartOption()).toBe(true);
  });

  it('should ignore smart sorting from the URL until the preview flag is enabled', async () => {
    history.replaceState(null, '', '/?sort_by=smart');

    const { sorting, featureFlag } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
      featureFlag: useFeatureFlag(),
    }));
    const currentSortBy = () =>
      firstValueFrom(
        sorting.current.pipe(map((current) => current.sorting.value)),
      );

    expect(await currentSortBy()).toBeUndefined();

    featureFlag.setFlag(FeatureFlag.UpNextSmartSort, true);

    expect(
      await firstValueFrom(
        sorting.current.pipe(
          map((current) => current.sorting.value),
          filter((sortBy) => sortBy === 'smart'),
          take(1),
        ),
      ),
    ).toBe('smart');
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
