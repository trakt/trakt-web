import type { VipTierTitle } from './VipTierTitle.ts';

export type VipVeteranCelebration =
  | { kind: 'promotion'; from: VipTierTitle | null }
  | { kind: 'anniversary' };
