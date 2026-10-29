import type { VipVeteran } from '$lib/requests/models/VipVeteran.ts';
import type { ProfileResponse } from '@trakt/api';

// TODO: align the vip_veteran_* response with the clients before unflagging.
// Clients name the rung from vip_veteran_tier, so vip_veteran_title is unused.
export function mapToVipVeteran(user: ProfileResponse): VipVeteran | null {
  if (!user.vip_veteran_since || user.vip_veteran_tier == null) return null;

  return {
    since: new Date(user.vip_veteran_since),
    years: user.vip_veteran_years ?? 0,
    tier: user.vip_veteran_tier,
    graceEndsAt: user.vip_grace_ends_at
      ? new Date(user.vip_grace_ends_at)
      : null,
  };
}
