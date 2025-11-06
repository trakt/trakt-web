import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { DiscoverMode } from '../models/DiscoverMode.ts';
import {
  DISCOVER_CONTEXT_KEY,
  type DiscoverContext,
} from './DiscoverContext.ts';

export function createDiscoverContext(
  mode: DiscoverMode,
  useSeasonalFilters: boolean,
) {
  const ctx = setContext(
    DISCOVER_CONTEXT_KEY,
    getContext<DiscoverContext>(DISCOVER_CONTEXT_KEY) ??
      {
        mode: writable(mode),
        useSeasonalFilters: writable(useSeasonalFilters),
      },
  );

  return ctx;
}
