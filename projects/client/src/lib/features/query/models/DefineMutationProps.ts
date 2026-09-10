import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';

export type DefineMutationProps<TData, TVariables = void> = {
  key: string;
  request: (variables: TVariables) => Promise<TData>;
  invalidations: InvalidateActionOptions[];
};
