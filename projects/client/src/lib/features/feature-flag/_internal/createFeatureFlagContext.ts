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
  const storedFlags = safeLocalStorage.getItem(FEATURE_FLAG_LOCAL_STORAGE_KEY);
  if (!storedFlags) {
    return {};
  }

  try {
    return JSON.parse(storedFlags) as FeatureFlagOverrides;
  } catch {
    return {};
  }
}

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
