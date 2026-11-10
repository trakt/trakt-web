import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export type AwardDecade = {
  key: string;
  decade: number;
  entries: ReadonlyArray<AwardEntry>;
  wins: number;
};
