import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type {
  FeatureFlagContext,
  FeatureFlagOverrides,
} from './FeatureFlagContext.ts';
import { FEATURE_FLAG_CONTEXT_KEY } from './FeatureFlagContextKey.ts';

export const FEATURE_FLAG_LOCAL_STORAGE_KEY = 'trakt-feature-flags';

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

export function createFeatureFlagContext() {
  const ctx = setContext(
    FEATURE_FLAG_CONTEXT_KEY,
    getContext<FeatureFlagContext>(FEATURE_FLAG_CONTEXT_KEY) ??
      {
        overrides: new BehaviorSubject(initializeOverrides()),
      },
  );

  return ctx;
}
