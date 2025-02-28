import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type DrillListProps<M = MediaType> = {
  urlBuilder: (params: { type: M } & Record<string, unknown>) => string;
};
