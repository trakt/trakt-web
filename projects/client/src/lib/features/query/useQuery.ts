import { browser } from '$app/environment';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  createInfiniteQuery,
  type CreateInfiniteQueryOptions,
  createQuery,
  type CreateQueryOptions,
  type InfiniteData,
  type QueryKey,
  useQueryClient,
} from '@tanstack/svelte-query';
import { tap } from 'rxjs';
import type { Paginatable } from '../../requests/models/Paginatable.ts';
import type { StoreLike } from '../../utils/store/toObservable.ts';
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
  stream: StoreLike<T>,
) {
  /*
   * Keep this file unchanged for now to avoid breaking consumers.
   * I am migrating consumers in batches.
   */
  const client = browser ? useQueryClient() : undefined;

  return toObservable(stream).pipe(
    tap(() => {
      if (client == null) {
        return;
      }

      const id = findQueryId(queryKey);

      if (id == null) {
        return;
      }

      const hasInvalidationMarker = findInvalidationId(queryKey) != null;

      if (!hasInvalidationMarker) {
        return;
      }

      const isInvalidatedQueued = INVALIDATION_MAP.has(id);

      if (isInvalidatedQueued) {
        return;
      }

      const currentState = client.getQueryState(queryKey);
      if (!currentState || currentState.status !== 'success') {
        return;
      }

      const queryAge = Date.now() - currentState.dataUpdatedAt;
      INVALIDATION_MAP.set(id, Date.now());

      if (queryAge < MIN_INVALIDATION_AGE) {
        return;
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
    }),
  );
}

export function useQuery<
  TOutput,
  TError extends Error,
>(
  props: CreateQueryOptions<TOutput, TError>,
) {
  return invalidationHook(props.queryKey, createQuery(props));
}

export function useInfiniteQuery<
  TOutput,
  TError extends Error,
  TData = InfiniteData<Paginatable<TOutput>>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = number,
>(
  props: CreateInfiniteQueryOptions<
    Paginatable<TOutput>,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
) {
  return invalidationHook(props.queryKey, createInfiniteQuery(props));
}
