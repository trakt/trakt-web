import { browser } from '$app/environment';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  createInfiniteQuery,
  type CreateInfiniteQueryOptions,
  createQuery,
  type CreateQueryOptions,
  type InfiniteData,
  type InfiniteQueryObserverResult,
  type QueryKey,
  type QueryObserverResult,
  useQueryClient,
} from '@tanstack/svelte-query';
import {
  isObservable,
  map,
  Observable,
  type OperatorFunction,
  pipe,
} from 'rxjs';
import type { Paginatable } from '../../requests/models/Paginatable.ts';
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
  let optionsStore:
    | CreateQueryOptions<TOutput, TError>
    | {
      subscribe: (
        run: (val: CreateQueryOptions<TOutput, TError>) => void,
      ) => () => void;
    };
  let getQueryKey: () =>
    | CreateQueryOptions<TOutput, TError>['queryKey']
    | undefined;

  if (isObservable(props)) {
    let currentOptions: CreateQueryOptions<TOutput, TError> | undefined;

    optionsStore = {
      subscribe: (run) => {
        const sub = props.subscribe((val) => {
          currentOptions = val;
          run(val);
        });
        return () => sub.unsubscribe();
      },
    };
    getQueryKey = () => currentOptions?.queryKey;
  } else {
    optionsStore = props;
    getQueryKey = () => props.queryKey;
  }

  return toObservable(createQuery(optionsStore)).pipe(
    invalidationHook(getQueryKey),
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
  return toObservable(createInfiniteQuery(props)).pipe(
    invalidationHook(props.queryKey),
  );
}
