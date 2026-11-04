import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MatchTabProps = {
  score: number;
  type: MediaType;
  id: number;
};
