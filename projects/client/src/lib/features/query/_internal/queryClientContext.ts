import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { QueryClient } from '@tanstack/query-core';
import { getContext, setContext } from 'svelte';

const QUERY_CLIENT_KEY = Symbol('query-client');

export function setQueryClient(client: QueryClient): QueryClient {
  return setContext(QUERY_CLIENT_KEY, client);
}

export function useQueryClient(): QueryClient {
  return assertDefined(
    getContext<QueryClient | undefined>(QUERY_CLIENT_KEY),
    'No QueryClient found in context - wrap the app with QueryClientProvider.',
  );
}
