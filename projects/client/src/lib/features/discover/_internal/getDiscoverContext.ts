import { getContext } from 'svelte';
import {
  DISCOVER_CONTEXT_KEY,
  type DiscoverContext,
} from './DiscoverContext.ts';

export function getDiscoverContext() {
  const context = getContext<DiscoverContext>(DISCOVER_CONTEXT_KEY);
  if (!context) {
    throw new Error(
      'Discover context not found. Make sure to call use this within the DiscoverProvider scope.',
    );
  }
  return context;
}
