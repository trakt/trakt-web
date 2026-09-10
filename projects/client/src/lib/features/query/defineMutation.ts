import type { CreateMutationOptions } from '$lib/features/query/types.ts';
import type { DefineMutationProps } from './models/DefineMutationProps.ts';
import type { MutationMeta } from './models/MutationMeta.ts';

export function defineMutation<TData, TVariables = void>(
  { key, request, invalidations }: DefineMutationProps<TData, TVariables>,
): CreateMutationOptions<TData, Error, TVariables> {
  const meta: MutationMeta = { invalidations };

  return {
    mutationKey: [key],
    mutationFn: (variables: TVariables) => request(variables),
    meta,
  };
}
