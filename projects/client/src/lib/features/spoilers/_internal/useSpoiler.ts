import { useAuth } from '$lib/features/auth/stores/useAuth';
import { useUser } from '$lib/features/auth/stores/useUser';
import { derived } from 'svelte/store';

export function useSpoiler() {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  const isSpoilerHidden = derived(
    [isAuthorized, user],
    ([$isAuthorized, $user]) => {
      if (!$isAuthorized) {
        return false;
      }

      return Boolean($user?.preferences.isSpoilerHidden);
    },
  );

  return {
    isSpoilerHidden,
  };
}
