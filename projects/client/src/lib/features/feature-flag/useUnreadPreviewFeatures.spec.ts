import { waitForValue } from '$test/readable/waitForValue.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeatureFlag } from './models/FeatureFlag.ts';
import {
  READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
  useUnreadPreviewFeatures,
} from './useUnreadPreviewFeatures.ts';

describe('store: useUnreadPreviewFeatures', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should report unread features for a first-time visitor', async () => {
    const { hasUnreadFeatures } = useUnreadPreviewFeatures();

    expect(await waitForValue(hasUnreadFeatures, true)).toBe(true);
  });

  it('should report no unread features when every feature is read', async () => {
    localStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(Object.values(FeatureFlag)),
    );

    const { hasUnreadFeatures } = useUnreadPreviewFeatures();

    expect(await waitForValue(hasUnreadFeatures, false)).toBe(false);
  });

  it('should report unread features when a new feature shipped after the last acknowledgement', async () => {
    const previouslyShippedFeatures = Object.values(FeatureFlag)
      .filter((feature) => feature !== FeatureFlag.Rewatching);
    localStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(previouslyShippedFeatures),
    );

    const { hasUnreadFeatures } = useUnreadPreviewFeatures();

    expect(await waitForValue(hasUnreadFeatures, true)).toBe(true);
  });

  it('should clear the unread state when markAllRead is called', async () => {
    const { hasUnreadFeatures, markAllRead } = useUnreadPreviewFeatures();

    markAllRead();

    expect(await waitForValue(hasUnreadFeatures, false)).toBe(false);
  });

  it('should persist read features to localStorage', () => {
    const { markAllRead } = useUnreadPreviewFeatures();

    markAllRead();

    expect(
      JSON.parse(
        localStorage.getItem(READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY) ?? '[]',
      ),
    ).toEqual(Object.values(FeatureFlag));
  });

  it('should treat malformed stored state as nothing read', async () => {
    localStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      'not-json{',
    );

    const { hasUnreadFeatures } = useUnreadPreviewFeatures();

    expect(await waitForValue(hasUnreadFeatures, true)).toBe(true);
  });
});
