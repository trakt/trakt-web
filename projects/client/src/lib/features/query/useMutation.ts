import { useQueryClient } from '$lib/features/query/_internal/queryClientContext.ts';
import type { CreateMutationOptions } from '$lib/features/query/types.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import type { MutationObserverResult } from '@tanstack/query-core';
import { distinctUntilChanged, map, type Observable } from 'rxjs';
import { mutationBridge } from './_internal/mutationBridge.ts';

type Mutation<TData, TError extends Error, TVariables> = {
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
  result: Observable<MutationObserverResult<TData, TError, TVariables>>;
  isPending: Observable<boolean>;
};

export function useMutation<
  TData,
  TVariables = void,
  TError extends Error = Error,
>(
  options: CreateMutationOptions<TData, TError, TVariables>,
): Mutation<TData, TError, TVariables> {
  const { mutate, reset, result$ } = mutationBridge(options, useQueryClient());

  const result = result$.pipe(multicast());

  return {
    mutate,
    reset,
    result,
    isPending: result.pipe(
      map(({ isPending }) => isPending),
      distinctUntilChanged(),
    ),
  };
}
