import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { map } from 'rxjs';
import { READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY } from './_internal/createFeatureFlagContext.ts';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import { FeatureFlag } from './models/FeatureFlag.ts';

export function useUnreadPreviewFeatures() {
  const { readFeatures } = getFeatureFlagContext();

  const unreadFeatures = readFeatures.pipe(
    map((read) =>
      Object.values(FeatureFlag).filter((feature) => !read.includes(feature))
    ),
  );

  const hasUnreadFeatures = unreadFeatures.pipe(
    map((unread) => unread.length > 0),
  );

  const markAllRead = () => {
    const allFeatures: ReadonlyArray<string> = Object.values(FeatureFlag);
    safeLocalStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(allFeatures),
    );
    readFeatures.next(allFeatures);
  };

  return {
    hasUnreadFeatures,
    unreadFeatures,
    markAllRead,
  };
}
