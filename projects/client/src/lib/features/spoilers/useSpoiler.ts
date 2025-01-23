import { derived } from 'svelte/store';
import { useAuth } from '../auth/stores/useAuth';
import { useUser } from '../auth/stores/useUser';

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
