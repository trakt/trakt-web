import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';

type InvalidationProps<TData, TVariables> = {
  data: TData;
  variables: TVariables;
};

export type DefineMutationProps<TData, TVariables = void> = {
  key: string;
  request: (variables: TVariables) => Promise<TData>;
  invalidations:
    | InvalidateActionOptions[]
    | ((
      props: InvalidationProps<TData, TVariables>,
    ) => InvalidateActionOptions[]);
};
