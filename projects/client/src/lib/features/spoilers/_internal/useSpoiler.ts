import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { combineLatest, map } from 'rxjs';

export function useSpoiler() {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isSpoilerHidden = combineLatest([isAuthorized, user]).pipe(
    map(([isAuth, currentUser]) => {
      if (!isAuth) {
        return false;
      }

      return Boolean(currentUser?.preferences.isSpoilerHidden);
    }),
  );

  return {
    isSpoilerHidden,
  };
}
