import { useAuth } from '$lib/features/auth/stores/useAuth';
import { derived } from 'svelte/store';

export function useSpoiler() {
  const { isAuthorized } = useAuth();

  return {
    // FIXME: calcualte isSpoilerHidden based on user settings
    isSpoilerHidden: derived(isAuthorized, () => {
      return false;
    }),
  };
}
