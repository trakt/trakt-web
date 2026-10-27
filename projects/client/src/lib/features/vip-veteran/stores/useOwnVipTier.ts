import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { toVipTier } from '../toVipTier.ts';
import { useVipVeteran } from './useVipVeteran.ts';
import { useVipVeteranEnabled } from './useVipVeteranEnabled.ts';

/*
  The signed-in member's tier, for their avatar outside their own profile (the
  menu, settings, the VIP page). Account settings carry no streak, so it comes
  from the same profile query the profile banner reads. Null while the
  preview is off, so callers keep their plain avatar.
*/
export function useOwnVipTier() {
  const { user } = useUser();
  const isEnabled = useVipVeteranEnabled();
  const { veteran } = useVipVeteran(
    user.pipe(
      map(($user) => $user.slug),
      distinctUntilChanged(),
    ),
  );

  return {
    tier: combineLatest([user, veteran, isEnabled]).pipe(
      map(([$user, $veteran, enabled]) =>
        enabled
          ? toVipTier({ ...$user, veteran: $user.isVip ? $veteran : null })
          : null,
      ),
      distinctUntilChanged(),
    ),
  };
}
