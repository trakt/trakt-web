import { browser } from '$app/environment';
import { time } from '$lib/utils/timing/time.ts';
import {
  createQuery,
  type CreateQueryOptions,
  useQueryClient,
} from '@tanstack/svelte-query';
import { derived, type Readable } from 'svelte/store';
import { findInvalidationId } from './_internal/findInvalidationId.ts';
import { findQueryId } from './_internal/findQueryId.ts';
import { invalidationPredicate } from './_internal/invalidationPredicate.ts';

/**
 * Tracks query invalidation requests.
 * Prevents duplicate invalidations for the same query ID within a session.
 */
const INVALIDATION_MAP = new Map<string, number>();

const MIN_INVALIDATION_AGE = time.seconds(30);

function invalidationHook<T>(
  queryKey: CreateQueryOptions['queryKey'],
  stream: Readable<T>,
) {
  const client = browser ? useQueryClient() : undefined;

  return derived(stream, (value) => {
    if (client == null) {
      return value;
    }

    const id = findQueryId(queryKey);

    if (id == null) {
      return value;
    }

    const hasInvalidationMarker = findInvalidationId(queryKey) != null;

    if (!hasInvalidationMarker) {
      return value;
    }

    const isInvalidatedQueued = INVALIDATION_MAP.has(id);

    if (isInvalidatedQueued) {
      return value;
    }

    const currentState = client.getQueryState(queryKey);
    if (!currentState || currentState.status !== 'success') {
      return value;
    }

    const queryAge = Date.now() - currentState.dataUpdatedAt;
    INVALIDATION_MAP.set(id, Date.now());

    if (queryAge < MIN_INVALIDATION_AGE) {
      return value;
    }

    (async () => {
      const isNotReady = () => {
        const state = client.getQueryState(queryKey);

        return state?.status !== 'success' ||
          state?.fetchStatus !== 'idle';
      };

      while (isNotReady()) {
        await new Promise((resolve) => {
          setTimeout(resolve, time.seconds(0.1));
        });
      }

      client.invalidateQueries({
        predicate: (query) => invalidationPredicate(query.queryKey, id),
      });
    })();

    return value;
  });
}

export function useQuery<
  TOutput,
  TError extends Error,
>(
  props: CreateQueryOptions<TOutput, TError>,
) {
  return invalidationHook(props.queryKey, createQuery(props));
}
