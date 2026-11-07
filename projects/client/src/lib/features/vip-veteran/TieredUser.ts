import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';

export type TieredUser = {
  isVip: boolean;
  isDirector?: boolean;
  veteran?: VipVeteran | Nil;
};
