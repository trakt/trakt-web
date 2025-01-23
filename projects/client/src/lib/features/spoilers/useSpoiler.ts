import { useAuth } from '$lib/features/auth/stores/useAuth';
import { useUser } from '$lib/features/auth/stores/useUser';
import { derived } from 'svelte/store';

export function useSpoiler() {
  const { isAuthorized } = useAuth();

  return {
    isSpoilerHidden: derived(isAuthorized, ($isAuthorized) => {
      if (!$isAuthorized) {
        return false;
      }

      return Boolean(useUser().current().preferences.isSpoilerHidden);
    }),
  };
}
