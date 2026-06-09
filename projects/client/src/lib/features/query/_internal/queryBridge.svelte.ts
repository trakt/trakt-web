import { browser } from '$app/environment';
import { NOOP_FN } from '$lib/utils/constants.ts';
import {
  createInfiniteQuery,
  type CreateInfiniteQueryOptions,
  createQuery,
  type CreateQueryOptions,
  type InfiniteData,
  type InfiniteQueryObserverResult,
  type QueryClient,
  type QueryKey,
  type QueryObserverResult,
} from '@tanstack/svelte-query';
import { Observable, type Subscriber } from 'rxjs';

/**
 * @tanstack/svelte-query v6 ships a runes-based API: createQuery takes an
 * Accessor (() => options) and returns a $state-tracked proxy. These helpers
 * bridge that surface back to an RxJS Observable so existing consumers keep
 * working without touching every caller.
 *
 * The QueryClient is captured at the call site (where Svelte context is
 * available) and passed in explicitly, so the bridge can defer createQuery
 * until subscribe time without losing context.
 */

type CreateQueryAccessor = Parameters<typeof createQuery>[0];
type CreateInfiniteQueryAccessor = Parameters<typeof createInfiniteQuery>[0];

function snapshot<T extends object>(query: T): T {
  return { ...query };
}

function shallowEqual<T extends object>(a: T, b: T): boolean {
  if (a === b) return true;
  const keysA = Object.keys(a) as Array<keyof T>;
  const keysB = Object.keys(b) as Array<keyof T>;
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
}

function bridge<T extends object>(
  make: () => T,
  subscriber: Subscriber<T>,
): () => void {
  if (!browser) {
    // SSR: `$effect.root` is a no-op on the server, so the inner callback
    // never runs. Emit a single static snapshot so consumers can render
    // markup off the dehydrated cache without crashing on `undefined`.
    subscriber.next(snapshot(make()));
    return NOOP_FN;
  }

  return $effect.root(() => {
    const query = make();
    // Emit the initial result synchronously so consumers that subscribe and
    // immediately read (without awaiting a microtask) see a value, matching
    // the prior Svelte-store behaviour.
    let lastEmitted = snapshot(query);
    subscriber.next(lastEmitted);

    $effect(() => {
      const value = snapshot(query);
      if (shallowEqual(value, lastEmitted)) {
        return;
      }
      lastEmitted = value;
      // Defer to a microtask so we don't write back into a Svelte effect mid-
      // flush; without this Svelte 5 raises `state_unsafe_mutation`.
      queueMicrotask(() => subscriber.next(value));
    });
  });
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
      () =>
        createQuery(
          optionsAccessor as CreateQueryAccessor,
          () => client,
        ) as unknown as QueryObserverResult<TOutput, TError>,
      subscriber,
    )
  );
}

export function reactiveQueryBridge<TOutput, TError extends Error>(
  options$: Observable<CreateQueryOptions<TOutput, TError>>,
  client: QueryClient,
  optionsRef: QueryOptionsRef<TOutput, TError>,
): Observable<QueryObserverResult<TOutput, TError>> {
  return new Observable<QueryObserverResult<TOutput, TError>>((subscriber) => {
    let mirror = $state<CreateQueryOptions<TOutput, TError> | null>(null);
    let started = false;
    let cleanupRoot: (() => void) | undefined;

    const sub = options$.subscribe({
      next: (value) => {
        mirror = value;
        optionsRef.current = value;
        if (started) return;

        started = true;
        cleanupRoot = bridge(
          () =>
            createQuery(
              (() => mirror) as CreateQueryAccessor,
              () => client,
            ) as unknown as QueryObserverResult<TOutput, TError>,
          subscriber,
        );
      },
      error: (err) => subscriber.error(err),
      complete: () => subscriber.complete(),
    });

    return () => {
      sub.unsubscribe();
      cleanupRoot?.();
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
        () =>
          createInfiniteQuery(
            optionsAccessor as unknown as CreateInfiniteQueryAccessor,
            () => client,
          ) as unknown as InfiniteQueryObserverResult<TData, TError>,
        subscriber,
      ),
  );
}
