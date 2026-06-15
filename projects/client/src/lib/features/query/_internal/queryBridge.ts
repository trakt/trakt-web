import { browser } from '$app/environment';
import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
} from '$lib/features/query/types.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import {
  type DefaultedQueryObserverOptions,
  type InfiniteData,
  InfiniteQueryObserver,
  type InfiniteQueryObserverOptions,
  type InfiniteQueryObserverResult,
  type QueryClient,
  type QueryKey,
  QueryObserver,
  type QueryObserverOptions,
  type QueryObserverResult,
} from '@tanstack/query-core';
import { Observable, type Subscriber } from 'rxjs';

/**
 * Drive query-core's `QueryObserver` / `InfiniteQueryObserver` directly from
 * an RxJS Observable. The Observable subscription owns the observer's
 * lifecycle: created on first subscribe, destroyed when the last subscriber
 * leaves. We do not lean on Svelte runes here - runes-based wrappers tear
 * the observer down during reactive flushes, racing with invalidations and
 * dropping refetches.
 */

// The structural surface `bridge` needs. setOptions is not in here because
// the bridge only owns the observer's read/lifecycle calls; setOptions stays
// on the concrete observer at the call site where the option type is known.
type ReadableObserver<TResult> = {
  getCurrentResult(): TResult;
  subscribe(listener: (result: TResult) => void): () => void;
  updateResult(): void;
  destroy(): void;
};

function resolveQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
>(
  client: QueryClient,
  options: QueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryFnData,
    TQueryKey
  >,
): DefaultedQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryFnData,
  TQueryKey
> {
  // Match createBaseQuery's resolved-options shape so the observer hands out
  // optimistic results while a fetch is in-flight, matching what consumers
  // (and our tests) expect.
  const resolved = client.defaultQueryOptions(options);
  resolved._optimisticResults = 'optimistic';
  return resolved;
}

function resolveInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends QueryKey,
  TPageParam,
>(
  client: QueryClient,
  options: InfiniteQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): InfiniteQueryObserverOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey,
  TPageParam
> {
  // The runtime payload still has the infinite-specific keys
  // (`getNextPageParam`, `initialPageParam`); `defaultQueryOptions` just
  // narrows the static type. Cast back to the infinite shape so the
  // InfiniteQueryObserver constructor accepts the result.
  const resolved = client.defaultQueryOptions(
    options as unknown as QueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryFnData,
      TQueryKey
    >,
  ) as unknown as
    & InfiniteQueryObserverOptions<
      TQueryFnData,
      TError,
      TData,
      TQueryKey,
      TPageParam
    >
    & { _optimisticResults?: 'optimistic' | 'isRestoring' };
  resolved._optimisticResults = 'optimistic';
  return resolved;
}

function bridge<TResult>(
  subscriber: Subscriber<TResult>,
  createObserver: () => ReadableObserver<TResult>,
): () => void {
  const observer = createObserver();

  if (!browser) {
    // SSR: emit the current optimistic result once so consumers can render
    // off the dehydrated cache without crashing on `undefined`. No listener
    // attached - effects / timers cannot run on the server anyway.
    subscriber.next(observer.getCurrentResult());
    observer.destroy();
    return NOOP_FN;
  }

  // Emit current state synchronously so consumers reading immediately after
  // subscribing get a value, matching prior Svelte-store behaviour.
  subscriber.next(observer.getCurrentResult());
  const unsubscribe = observer.subscribe((result) => subscriber.next(result));
  // Force a recompute now that a listener is attached. Matches
  // createBaseQuery's post-subscribe `updateResult` - without it, optimistic
  // -> hydrated transitions that resolve synchronously can land before any
  // listener is registered and the consumer only sees the initial snapshot.
  observer.updateResult();

  return () => {
    unsubscribe();
    // `destroy` removes the observer from its Query and clears refetch
    // timers. The Query's listener Set is the source of truth for whether
    // it counts as active, so cleanup keeps cache hygiene honest.
    observer.destroy();
  };
}

export type QueryOptionsRef<TOutput, TError extends Error> = {
  current?: CreateQueryOptions<TOutput, TError>;
};

export function queryBridge<TOutput, TError extends Error>(
  optionsAccessor: () => CreateQueryOptions<TOutput, TError>,
  client: QueryClient,
): Observable<QueryObserverResult<TOutput, TError>> {
  return new Observable<QueryObserverResult<TOutput, TError>>((subscriber) =>
    bridge(
      subscriber,
      () =>
        new QueryObserver(
          client,
          resolveQueryOptions(client, optionsAccessor()),
        ),
    )
  );
}

export function reactiveQueryBridge<TOutput, TError extends Error>(
  options$: Observable<CreateQueryOptions<TOutput, TError>>,
  client: QueryClient,
  optionsRef: QueryOptionsRef<TOutput, TError>,
): Observable<QueryObserverResult<TOutput, TError>> {
  return new Observable<QueryObserverResult<TOutput, TError>>((subscriber) => {
    let observer: QueryObserver<TOutput, TError> | undefined;
    let cleanup: (() => void) | undefined;

    const sub = options$.subscribe({
      next: (value) => {
        optionsRef.current = value;
        const resolved = resolveQueryOptions(client, value);
        if (observer) {
          observer.setOptions(resolved);
          return;
        }
        cleanup = bridge(
          subscriber,
          () => (observer = new QueryObserver(client, resolved)),
        );
      },
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete(),
    });

    return () => {
      sub.unsubscribe();
      cleanup?.();
    };
  });
}

export function infiniteQueryBridge<
  TOutput,
  TError extends Error,
  TData = InfiniteData<TOutput>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  optionsAccessor: () => CreateInfiniteQueryOptions<
    TOutput,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
  client: QueryClient,
): Observable<InfiniteQueryObserverResult<TData, TError>> {
  return new Observable<InfiniteQueryObserverResult<TData, TError>>(
    (subscriber) =>
      bridge(
        subscriber,
        () =>
          new InfiniteQueryObserver(
            client,
            resolveInfiniteQueryOptions(client, optionsAccessor()),
          ),
      ),
  );
}
