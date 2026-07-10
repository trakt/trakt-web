import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { distinctUntilChanged, map } from 'rxjs';
import { READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY } from './_internal/createFeatureFlagContext.ts';
import { getFeatureFlagContext } from './_internal/getFeatureFlagContext.ts';
import { FeatureFlag } from './models/FeatureFlag.ts';

const allFeatureFlags: ReadonlyArray<FeatureFlag> = Object.values(FeatureFlag);

function toUnreadFeatures(
  readFeatures: ReadonlyArray<string>,
): ReadonlyArray<FeatureFlag> {
  return allFeatureFlags.filter((feature) => !readFeatures.includes(feature));
}

export function useUnreadPreviewFeatures() {
  const { readFeatures } = getFeatureFlagContext();

  const hasUnreadFeatures = readFeatures.pipe(
    map((read) => toUnreadFeatures(read).length > 0),
    distinctUntilChanged(),
  );

  const acknowledgeUnread = (): ReadonlyArray<FeatureFlag> => {
    const unread = toUnreadFeatures(readFeatures.getValue());

    safeLocalStorage.setItem(
      READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
      JSON.stringify(allFeatureFlags),
    );
    readFeatures.next(allFeatureFlags);

    return unread;
  };

  return {
    hasUnreadFeatures,
    acknowledgeUnread,
  };
}
