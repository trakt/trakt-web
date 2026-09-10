import type { CreateMutationOptions } from '$lib/features/query/types.ts';
import {
  MutationObserver,
  type MutationObserverResult,
  type QueryClient,
} from '@tanstack/query-core';
import { Observable } from 'rxjs';
import { untrack } from 'svelte';

// query-core only runs `mutate`'s per-call callbacks while the observer has
// listeners, so the bridge drops that argument: side effects belong on the
// observer options or the MutationCache.
export type MutationBridge<TData, TError extends Error, TVariables> = {
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
  result$: Observable<MutationObserverResult<TData, TError, TVariables>>;
};

export function mutationBridge<TData, TError extends Error, TVariables>(
  options: CreateMutationOptions<TData, TError, TVariables>,
  client: QueryClient,
): MutationBridge<TData, TError, TVariables> {
  const observer = new MutationObserver<TData, TError, TVariables>(
    client,
    options,
  );

  const result$ = new Observable<
    MutationObserverResult<TData, TError, TVariables>
  >((subscriber) => {
    const emit = (result: MutationObserverResult<TData, TError, TVariables>) =>
      untrack(() => subscriber.next(result));

    emit(observer.getCurrentResult());

    return observer.subscribe(emit);
  });

  return {
    mutate: observer.mutate,
    reset: observer.reset,
    result$,
  };
}
