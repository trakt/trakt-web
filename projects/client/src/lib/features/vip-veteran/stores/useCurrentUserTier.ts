import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import type { TieredMember } from '../TieredMember.ts';
import { useVipVeteran } from './useVipVeteran.ts';

export function useCurrentUserTier() {
  const { user } = useUser();
  const { veteran } = useVipVeteran(
    user.pipe(
      map(($user) => $user.slug),
      distinctUntilChanged(),
    ),
  );

  return {
    member: combineLatest([user, veteran]).pipe(
      map(
        ([$user, $veteran]): TieredMember => ({
          isVip: $user.isVip,
          isDirector: $user.isDirector,
          veteran: $user.isVip ? $veteran : null,
        }),
      ),
    ),
  };
}
