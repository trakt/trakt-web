import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import type { AwardSeasonPhase } from './AwardSeasonPhase.ts';

export type AwardGroup = {
  id: string;
  key: AwardCeremonyKey;
  name: string;
  isFestival: boolean;
  entries: ReadonlyArray<AwardEntry>;
  wins: number;
  nominations: number;
  years: ReadonlyArray<number>;
  heldAt: Date | Nil;
  phase: AwardSeasonPhase;
};
