import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';

export type AwardTally = {
  id: string;
  ceremony: AwardCeremonyKey;
  kind: 'festival' | 'wins' | 'nominations';
  wins: number;
  nominations: number;
};
