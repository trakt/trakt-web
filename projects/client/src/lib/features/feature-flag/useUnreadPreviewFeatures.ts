import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject, map } from 'rxjs';
import { FeatureFlag } from './models/FeatureFlag.ts';

export const READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY =
  'trakt-read-preview-features';

function initializeReadFeatures(): ReadonlyArray<string> {
  const storedFeatures = safeLocalStorage.getItem(
    READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY,
  );
  if (!storedFeatures) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedFeatures);
    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useUnreadPreviewFeatures() {
  const readFeatures = new BehaviorSubject<ReadonlyArray<string>>(
    initializeReadFeatures(),
  );

  const hasUnreadFeatures = readFeatures.pipe(
    map((read) =>
      Object.values(FeatureFlag).some((feature) => !read.includes(feature))
    ),
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
    markAllRead,
  };
}
