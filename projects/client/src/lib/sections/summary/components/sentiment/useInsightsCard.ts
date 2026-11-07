import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { distinctUntilChanged, map } from 'rxjs';

export function useInsightsCard() {
  const { user } = useUser();

  const isInsightsCard = user.pipe(
    map(($user) => $user?.isDirector ?? false),
    distinctUntilChanged(),
  );

  return { isInsightsCard };
}
