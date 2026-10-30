import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export type VipVeteranCelebration =
  | { kind: 'promotion'; from: VipVeteran['title'] }
  | { kind: 'anniversary' };
