import { resetGlobalStore } from '$lib/components/toggles/useToggler.ts';
import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { filter, firstValueFrom, map, take } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { useMineTab } from './useMineTab.ts';

describe('useMineTab', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalStore();
  });

  it('only offers the Mine option once the preview flag is enabled', async () => {
    const { mineTab, featureFlag } = await renderStore(() => ({
      mineTab: useMineTab(),
      featureFlag: useFeatureFlag(),
    }));
    const hasMineOption = mineTab.sortOptions.pipe(
      map((options) => options.some((option) => option.value === 'mine')),
    );

    expect(await firstValueFrom(hasMineOption)).toBe(false);

    featureFlag.setFlag(FeatureFlag.ReviewsMineTab, true);

    expect(
      await firstValueFrom(hasMineOption.pipe(filter(Boolean), take(1))),
    ).toBe(true);
  });

  it('switches to Mine without touching the stored sort, and back again', async () => {
    const { onTabChange, activeTab, mineActive, sort } = await renderStore(
      () => useMineTab(),
    );
    const sortBefore = (await firstValueFrom(sort)).value;

    onTabChange('mine');

    expect(await firstValueFrom(activeTab)).toBe('mine');
    expect(await firstValueFrom(mineActive)).toBe(true);
    expect((await firstValueFrom(sort)).value).toBe(sortBefore);

    const otherSort = sortBefore === 'likes' ? 'newest' : 'likes';
    onTabChange(otherSort);

    expect(await firstValueFrom(mineActive)).toBe(false);
    expect(await firstValueFrom(activeTab)).toBe(otherSort);
  });
});
