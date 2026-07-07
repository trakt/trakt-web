import { getContext } from 'svelte';
import type { SpotlightContext } from './SpotlightContext.ts';
import { SPOTLIGHT_CONTEXT_KEY } from './createSpotlightContext.ts';

export function getSpotlightContext(): SpotlightContext {
  const context = getContext<SpotlightContext>(SPOTLIGHT_CONTEXT_KEY);
  if (!context) {
    throw new Error(
      'getSpotlightContext must be used within a SpotlightProvider',
    );
  }
  return context;
}
