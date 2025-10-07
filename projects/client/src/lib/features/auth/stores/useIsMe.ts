import { derived } from 'svelte/store';
import { useAuth } from './useAuth.ts';
import { useUser } from './useUser.ts';

export function useIsMe(slug: string) {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  return {
    isMe: derived(
      [user, isAuthorized],
      ([$user, $isAuthorized]) =>
        $isAuthorized && (slug === 'me' || slug === $user.slug),
    ),
  };
}
