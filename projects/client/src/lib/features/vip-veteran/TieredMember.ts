import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export type TieredMember = {
  isVip: boolean;
  isDirector?: boolean;
  veteran?: VipVeteran | Nil;
};
