import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';
import type { MutationKey } from './MutationKey.ts';

type InvalidationProps<TData, TVariables> = {
  data: TData;
  variables: TVariables;
};

export type DefineMutationProps<TData, TVariables = void> = {
  key: MutationKey;
  request: (variables: TVariables) => Promise<TData>;
  invalidations:
    | InvalidateActionOptions[]
    | ((
        props: InvalidationProps<TData, TVariables>,
      ) => InvalidateActionOptions[]);
};
