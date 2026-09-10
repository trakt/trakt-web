import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';

type ResolveInvalidationsProps = {
  data: unknown;
  variables: unknown;
};

export type MutationMeta = {
  resolveInvalidations?: (
    props: ResolveInvalidationsProps,
  ) => InvalidateActionOptions[];
};

declare module '@tanstack/query-core' {
  interface Register {
    mutationMeta: MutationMeta;
  }
}
