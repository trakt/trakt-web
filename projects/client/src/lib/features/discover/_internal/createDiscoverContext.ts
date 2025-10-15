import { getContext, setContext } from 'svelte';
import { readable, writable } from 'svelte/store';
import {
  DISCOVER_CONTEXT_KEY,
  type DiscoverContext,
  type DiscoverMode,
} from './DiscoverContext.ts';

export function createDiscoverContext(
  mode: DiscoverMode,
  routes: readonly string[],
) {
  const ctx = setContext(
    DISCOVER_CONTEXT_KEY,
    getContext<DiscoverContext>(DISCOVER_CONTEXT_KEY) ??
      {
        mode: writable(mode),
        routes: readable(routes),
      },
  );

  return ctx;
}
