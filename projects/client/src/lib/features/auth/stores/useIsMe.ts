import { combineLatest, map } from 'rxjs';
import { useAuth } from './useAuth.ts';
import { useUser } from './useUser.ts';

export function useIsMe(slug: string) {
  const { isAuthorized } = useAuth();
  const { user } = useUser();

  return {
    isMe: combineLatest(
      [user, isAuthorized],
    ).pipe(
      map(([$user, $isAuthorized]) =>
        $isAuthorized && (slug === 'me' || slug === $user.slug)
      ),
    ),
  };
}
