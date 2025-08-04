import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { useNavigation } from '$lib/features/navigation/useNavigation.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { derived } from 'svelte/store';

export function useLoginTarget() {
  const { login } = useAuth();
  const { navigation } = useNavigation();

  return {
    target: derived(navigation, ($navigation) => {
      return $navigation === 'dpad'
        ? { href: UrlBuilder.login.activate() }
        : { onclick: login };
    }),
  };
}
