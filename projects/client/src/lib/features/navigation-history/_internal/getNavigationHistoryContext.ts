import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { getContext } from 'svelte';
import {
  NAVIGATION_HISTORY_CONTEXT_KEY,
  type NavigationHistoryContext,
} from './createNavigationHistoryContext.ts';

export function getNavigationHistoryContext() {
  return assertDefined<NavigationHistoryContext>(
    getContext<NavigationHistoryContext>(NAVIGATION_HISTORY_CONTEXT_KEY),
    'Navigation history can only be used within the NavigationHistoryProvider context.',
  );
}
