import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export type VipStreakRung = {
  tier: number;
  title: VipVeteran['title'];
  tone: VipBadgeTone;
  isReached: boolean;
  isCurrent: boolean;
};
