import type { VipVeteranCelebration } from './VipVeteranCelebration.ts';

export type VipVeteranPromotion = Extract<
  VipVeteranCelebration,
  { kind: 'promotion' }
>;
