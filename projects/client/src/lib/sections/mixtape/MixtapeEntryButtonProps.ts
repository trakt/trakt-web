import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MixtapeEntryButtonProps = {
  type: MediaType;
  source: 'history' | 'related';
  pick?: number;
};
