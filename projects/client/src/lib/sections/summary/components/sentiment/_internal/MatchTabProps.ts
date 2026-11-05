import type { MatchTaste } from '$lib/requests/models/MatchTaste.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MatchTabProps = {
  score: number;
  taste: MatchTaste[];
  type: MediaType;
  id: number;
};
