import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
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
        mode: new BehaviorSubject(mode),
        useSeasonalFilters: new BehaviorSubject(useSeasonalFilters),
      },
  );

  return ctx;
}
