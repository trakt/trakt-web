import { browser } from '$app/environment';
import { multicast } from '$lib/utils/store/multicast.ts';
import { time } from '$lib/utils/timing/time.ts';
import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
} from '$lib/features/query/types.ts';
import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type {
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryKey,
  QueryObserverResult,
} from '@tanstack/query-core';
import {
  isObservable,
  map,
  Observable,
  type OperatorFunction,
  pipe,
  tap,
} from 'rxjs';
import type { Paginatable } from '../../requests/models/Paginatable.ts';
import { findInvalidationId } from './_internal/findInvalidationId.ts';
import { findQueryId } from './_internal/findQueryId.ts';
import { invalidationPredicate } from './_internal/invalidationPredicate.ts';
import {
  infiniteQueryBridge,
  queryBridge,
  type QueryOptionsRef,
  reactiveQueryBridge,
} from './_internal/queryBridge.ts';

/**
 * Tracks query invalidation requests.
 * Prevents duplicate invalidations for the same query ID within a session.
 */
const INVALIDATION_MAP = new Map<string, number>();

const MIN_INVALIDATION_AGE = time.seconds(30);

const MAX_INVALIDATION_POLLS = 50;

function invalidationHook<T>(
  queryKeyOrFn:
    | CreateQueryOptions['queryKey']
    | (() => CreateQueryOptions['queryKey'] | undefined),
): OperatorFunction<T, T> {
  const client = browser ? useQueryClient() : undefined;

  return pipe(
    map((value) => {
      if (client == null) {
        return value;
      }

      const queryKey = typeof queryKeyOrFn === 'function'
        ? queryKeyOrFn()
        : queryKeyOrFn;

      if (!queryKey) {
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

      if (queryAge < MIN_INVALIDATION_AGE) {
        return value;
      }

      INVALIDATION_MAP.set(id, Date.now());

      (async () => {
        const isNotReady = () => {
          const state = client.getQueryState(queryKey);

          return state?.status !== 'success' ||
            state?.fetchStatus !== 'idle';
        };

        let attempts = 0;
        while (isNotReady() && attempts++ < MAX_INVALIDATION_POLLS) {
          await new Promise((resolve) => {
            setTimeout(resolve, time.seconds(0.1));
          });
        }

        client.invalidateQueries({
          predicate: (query) => invalidationPredicate(query.queryKey, id),
        });
      })();

      return value;
    }),
  );
}

export function useQuery<
  TOutput,
  TError extends Error,
>(
  props:
    | CreateQueryOptions<TOutput, TError>
    | Observable<CreateQueryOptions<TOutput, TError>>,
): Observable<QueryObserverResult<TOutput, TError>> {
  const client = useQueryClient();

  if (isObservable(props)) {
    const ref: QueryOptionsRef<TOutput, TError> = {};
    return reactiveQueryBridge(props, client, ref).pipe(
      invalidationHook(() => ref.current?.queryKey),
      multicast(),
    );
  }

  return queryBridge(() => props, client).pipe(
    invalidationHook(() => props.queryKey),
    multicast(),
  );
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
): Observable<InfiniteQueryObserverResult<TData, TError>> {
  const client = useQueryClient();

  return infiniteQueryBridge<
    Paginatable<TOutput>,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >(() => props, client).pipe(
    invalidationHook(props.queryKey),
    multicast(),
  );
}

/**
 * Like `useInfiniteQuery`, but automatically fetches subsequent pages until
 * all data is loaded. Uses live QueryClient state to guard `fetchNextPage()`
 * so that concurrent observers (e.g. multiple `useUser()` call sites) don't
 * duplicate in-flight fetches.
 */
export function useAllPagesInfiniteQuery<
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
): Observable<InfiniteQueryObserverResult<TData, TError>> {
  const client = useQueryClient();

  return useInfiniteQuery<TOutput, TError, TData, TQueryKey, TPageParam>(
    props,
  ).pipe(
    tap((query) => {
      if (
        query.hasNextPage &&
        client.getQueryState(props.queryKey)?.fetchStatus === 'idle'
      ) {
        query.fetchNextPage();
      }
    }),
    multicast(),
  );
}
