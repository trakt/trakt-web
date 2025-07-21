import { derived, readable } from 'svelte/store';
import { useAuth } from './useAuth.ts';
import { useUser } from './useUser.ts';

export function useIsMe(slug: string) {
  const { isAuthorized } = useAuth();

  if (!isAuthorized) {
    return {
      isMe: readable(false),
    };
  }

  const { user } = useUser();
  return {
    isMe: derived(
      user,
      ($user) => slug === 'me' || slug === $user.slug,
    ),
  };
}
