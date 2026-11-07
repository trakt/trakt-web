import type { HypeReasons } from '$lib/requests/models/HypeReasons.ts';
import type { MatchKind } from '$lib/requests/models/MatchKind.ts';
import type { MatchTaste } from '$lib/requests/models/MatchTaste.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';

export type MatchTabProps = {
  score: number;
  kind: MatchKind;
  reasons: HypeReasons | null;
  taste: MatchTaste[];
  media: MediaEntry;
};
