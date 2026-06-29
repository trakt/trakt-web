import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import {
  DISCOVER_CONTEXT_KEY,
  type DiscoverContext,
} from './DiscoverContext.ts';

export function createDiscoverContext(useSeasonalFilters: boolean) {
  const ctx = setContext(
    DISCOVER_CONTEXT_KEY,
    getContext<DiscoverContext>(DISCOVER_CONTEXT_KEY) ??
      {
        useSeasonalFilters: new BehaviorSubject(useSeasonalFilters),
      },
  );

  return ctx;
}
