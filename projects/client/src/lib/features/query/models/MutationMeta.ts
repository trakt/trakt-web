import type { InvalidateActionOptions } from '$lib/requests/models/InvalidateAction.ts';

export type MutationMeta = {
  invalidations?: InvalidateActionOptions[];
};

declare module '@tanstack/query-core' {
  interface Register {
    mutationMeta: MutationMeta;
  }
}
