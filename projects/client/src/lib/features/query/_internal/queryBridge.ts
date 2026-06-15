import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import type {
  CreateInfiniteQueryOptions,
  CreateQueryOptions,
} from '$lib/features/query/types.ts';
import {
  type InfiniteData,
  InfiniteQueryObserver,
  type InfiniteQueryObserverResult,
  type QueryClient,
  type QueryKey,
  QueryObserver,
  type QueryObserverResult,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';

/**
 * Drive query-core's `QueryObserver` / `InfiniteQueryObserver` directly from
 * an RxJS Observable. The Observable subscription owns the observer's
 * lifecycle: created on first subscribe, destroyed when the last subscriber
 * leaves. We do not lean on Svelte runes here - runes-based wrappers tear
 * the observer down during reactive flushes, racing with invalidations and
 * dropping refetches.
 */

// `any` to avoid TanStack's narrow generic variance fighting our wider
// queryBridge signatures; the runtime contract is identical.
// deno-lint-ignore no-explicit-any
type AnyObserver = QueryObserver<any, any, any, any, any>;
// deno-lint-ignore no-explicit-any
type AnyInfiniteObserver = InfiniteQueryObserver<any, any, any, any, any>;

function driveObserver<TResult>(
  observer: AnyObserver | AnyInfiniteObserver,
  emit: (result: TResult) => void,
): () => void {
  // Emit current state synchronously so consumers reading immediately after
  // subscribing get a value, matching prior Svelte-store behaviour.
  emit(observer.getCurrentResult() as TResult);
  const unsubscribe = observer.subscribe(
    (result: unknown) => emit(result as TResult),
  );
  // Force the observer to recompute its result now that a listener is
  // attached. Matches createBaseQuery's post-subscribe `updateResult` call;
  // without it, optimistic→hydrated transitions (e.g. an MSW handler resolving
  // synchronously in a unit test) can land before any listener is registered
  // and the consumer only sees the initial snapshot.
  observer.updateResult();
  return () => {
    unsubscribe();
    // `destroy` removes the observer from its Query and clears refetch
    // timers. The listener Set is the source of truth for whether a Query is
    // considered active, so cleanup keeps cache hygiene honest.
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
  return new Observable<QueryObserverResult<TOutput, TError>>((subscriber) => {
    // deno-lint-ignore no-explicit-any
    const resolved = client.defaultQueryOptions(optionsAccessor()) as any;
    // Match createBaseQuery's resolved-options shape so the observer hands
    // out optimistic results while a fetch is in-flight, matching what
    // svelte-query consumers (and our tests) expect.
    resolved._optimisticResults = 'optimistic';

    if (!browser) {
      // SSR: emit the current optimistic result once so consumers can render
      // off the dehydrated cache without crashing on `undefined`.
      const observer = new QueryObserver(client, resolved);
      subscriber.next(
        observer.getCurrentResult() as QueryObserverResult<TOutput, TError>,
      );
      observer.destroy();
      return NOOP_FN;
    }

    const observer = new QueryObserver(client, resolved);
    return driveObserver<QueryObserverResult<TOutput, TError>>(
      observer,
      (result) => subscriber.next(result),
    );
  });
}

export function reactiveQueryBridge<TOutput, TError extends Error>(
  options$: Observable<CreateQueryOptions<TOutput, TError>>,
  client: QueryClient,
  optionsRef: QueryOptionsRef<TOutput, TError>,
): Observable<QueryObserverResult<TOutput, TError>> {
  return new Observable<QueryObserverResult<TOutput, TError>>((subscriber) => {
    let observer: AnyObserver | undefined;
    let cleanup: (() => void) | undefined;

    const sub = options$.subscribe({
      next: (value) => {
        optionsRef.current = value;
        // deno-lint-ignore no-explicit-any
        const resolved = client.defaultQueryOptions(value) as any;
        if (!observer) {
          observer = new QueryObserver(client, resolved);
          cleanup = driveObserver<QueryObserverResult<TOutput, TError>>(
            observer,
            (result) => subscriber.next(result),
          );
          return;
        }
        observer.setOptions(resolved);
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
    (subscriber) => {
      // deno-lint-ignore no-explicit-any
      const resolved = client.defaultQueryOptions(optionsAccessor()) as any;

      if (!browser) {
        const observer = new InfiniteQueryObserver(client, resolved);
        subscriber.next(
          observer.getCurrentResult() as InfiniteQueryObserverResult<
            TData,
            TError
          >,
        );
        observer.destroy();
        return NOOP_FN;
      }

      const observer = new InfiniteQueryObserver(client, resolved);
      return driveObserver<InfiniteQueryObserverResult<TData, TError>>(
        observer,
        (result) => subscriber.next(result),
      );
    },
  );
}
