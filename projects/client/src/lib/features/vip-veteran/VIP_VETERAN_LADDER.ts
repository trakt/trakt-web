import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';
import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

type VipVeteranRung = {
  tier: number;
  title: VipVeteran['title'];
  tone: VipBadgeTone;
};

export const VIP_VETERAN_LADDER: ReadonlyArray<VipVeteranRung> = [
  { tier: 1, title: null, tone: 'vip' },
  { tier: 3, title: null, tone: 'deep' },
  { tier: 5, title: 'veteran', tone: 'copper' },
  { tier: 7, title: 'veteran', tone: 'silver' },
  { tier: 10, title: 'legend', tone: 'gold' },
];
