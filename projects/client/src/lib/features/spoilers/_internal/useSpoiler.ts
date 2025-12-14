import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map } from 'rxjs';

export function useSpoiler() {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isSpoilerHidden = combineLatest(
    [isAuthorized, user],
  ).pipe(
    map(([$isAuthorized, $user]) => {
      if (!$isAuthorized) {
        return false;
      }

      return Boolean($user?.preferences.isSpoilerHidden);
    }),
  );

  return {
    isSpoilerHidden,
  };
}
