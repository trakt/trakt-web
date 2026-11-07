import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { MatchTaste } from '$lib/requests/models/MatchTaste.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';

export type MatchTabProps = {
  score: number;
  kind: MatchKind;
  taste: MatchTaste[];
  type: MediaType;
  id: number;
};
