import type { VipBadgeTone } from '$lib/components/badge/VipBadgeTone.ts';

export type VipVeteranRingTone = Extract<
  VipBadgeTone,
  'copper' | 'silver' | 'gold'
>;
