import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useUpNextSorting } from './useUpNextSorting.ts';

describe('useUpNextSorting', () => {
  beforeEach(() => {
    localStorage.clear();
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
    const { sorting, featureFlag } = await renderStore(() => ({
      sorting: useUpNextSorting('me'),
      featureFlag: useFeatureFlag(),
    }));
    const currentSortBy = () =>
      firstValueFrom(
        sorting.current.pipe(map((current) => current.sorting.value)),
      );

    sorting.update({ sort_by: 'smart' });

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
});
