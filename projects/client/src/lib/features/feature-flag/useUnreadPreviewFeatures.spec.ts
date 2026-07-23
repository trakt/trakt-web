import { renderStore } from '$test/beds/store/renderStore.ts';
import { waitForValue } from '$test/readable/waitForValue.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY } from './_internal/createFeatureFlagContext.ts';
import { FeatureFlag } from './models/FeatureFlag.ts';
import { useUnreadPreviewFeatures } from './useUnreadPreviewFeatures.ts';

describe('store: useUnreadPreviewFeatures', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should report unread features for a first-time visitor', async () => {
    const { hasUnreadFeatures } = await renderStore(() =>
      useUnreadPreviewFeatures()
    );

    expect(await waitForValue(hasUnreadFeatures, true)).toBe(true);
  });

  it('should report no unread features when every feature is read', async () => {
    localStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(Object.values(FeatureFlag)),
    );

    const { hasUnreadFeatures } = await renderStore(() =>
      useUnreadPreviewFeatures()
    );

    expect(await waitForValue(hasUnreadFeatures, false)).toBe(false);
  });

  it('should list only the features shipped after the last acknowledgement', async () => {
    const previouslyShippedFeatures = Object.values(FeatureFlag)
      .filter((feature) => feature !== FeatureFlag.Rewatching);
    localStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(previouslyShippedFeatures),
    );

    const { unreadFeatures } = await renderStore(() =>
      useUnreadPreviewFeatures()
    );

    expect(
      await waitForValue(unreadFeatures, [FeatureFlag.Rewatching]),
    ).toEqual([FeatureFlag.Rewatching]);
  });

  it('should clear the unread state when markAllRead is called', async () => {
    const { hasUnreadFeatures, markAllRead } = await renderStore(() =>
      useUnreadPreviewFeatures()
    );

    markAllRead();

    expect(await waitForValue(hasUnreadFeatures, false)).toBe(false);
  });

  it('should share the unread state between consumers of the same provider', async () => {
    const { first, second } = await renderStore(() => ({
      first: useUnreadPreviewFeatures(),
      second: useUnreadPreviewFeatures(),
    }));

    first.markAllRead();

    expect(await waitForValue(second.hasUnreadFeatures, false)).toBe(false);
  });

  it('should persist read features to localStorage', async () => {
    const { markAllRead } = await renderStore(() => useUnreadPreviewFeatures());

    markAllRead();

    expect(
      JSON.parse(
        localStorage.getItem(READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY) ?? '[]',
      ),
    ).toEqual(Object.values(FeatureFlag));
  });

  it('should treat malformed stored state as nothing read', async () => {
    localStorage.setItem(READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY, 'not-json{');

    const { hasUnreadFeatures } = await renderStore(() =>
      useUnreadPreviewFeatures()
    );

    expect(await waitForValue(hasUnreadFeatures, true)).toBe(true);
  });
});
