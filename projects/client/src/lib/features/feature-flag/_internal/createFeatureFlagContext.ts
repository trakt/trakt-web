import { safeJsonParse } from '$lib/utils/json/safeJsonParse.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type {
  FeatureFlagContext,
  FeatureFlagOverrides,
} from './FeatureFlagContext.ts';
import { FEATURE_FLAG_CONTEXT_KEY } from './FeatureFlagContextKey.ts';

export const FEATURE_FLAG_LOCAL_STORAGE_KEY = 'trakt-feature-flags';

export const READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY =
  'trakt-read-preview-features';

function initializeOverrides(): FeatureFlagOverrides {
  return safeJsonParse<FeatureFlagOverrides>(
    safeLocalStorage.getItem(FEATURE_FLAG_LOCAL_STORAGE_KEY),
    {},
  );
}

function initializeReadFeatures(): ReadonlyArray<string> {
  const storedFeatures = safeJsonParse<unknown>(
    safeLocalStorage.getItem(READ_PREVIEW_FEATURES_LOCAL_STORAGE_KEY),
    [],
  );

  if (!Array.isArray(storedFeatures)) {
    return [];
  }

  return storedFeatures.filter((id): id is string => typeof id === 'string');
}

export function createFeatureFlagContext() {
  const ctx = setContext(
    FEATURE_FLAG_CONTEXT_KEY,
    getContext<FeatureFlagContext>(FEATURE_FLAG_CONTEXT_KEY) ??
      {
        overrides: new BehaviorSubject(initializeOverrides()),
        readFeatures: new BehaviorSubject(initializeReadFeatures()),
      },
  );

  return ctx;
}
