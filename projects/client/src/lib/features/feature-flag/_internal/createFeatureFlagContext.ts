import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import { FeatureFlag } from '../models/FeatureFlag.ts';
import type { FeatureFlagContext } from './FeatureFlagContext.ts';
import { FEATURE_FLAG_CONTEXT_KEY } from './FeatureFlagContextKey.ts';

export const FEATURE_FLAG_LOCAL_STORAGE_KEY = 'trakt-feature-flags';

function initializeFlags() {
  const storedFlags = safeLocalStorage.getItem(FEATURE_FLAG_LOCAL_STORAGE_KEY);
  const parsedFlags = storedFlags ? JSON.parse(storedFlags) : {};

  return Object.values(FeatureFlag).reduce((acc, flag) => {
    acc[flag] = parsedFlags[flag] ?? false;
    return acc;
  }, {} as Record<string, boolean>);
}

export function createFeatureFlagContext() {
  const ctx = setContext(
    FEATURE_FLAG_CONTEXT_KEY,
    getContext<FeatureFlagContext>(FEATURE_FLAG_CONTEXT_KEY) ??
      {
        flags: new BehaviorSubject(initializeFlags()),
      },
  );

  return ctx;
}
