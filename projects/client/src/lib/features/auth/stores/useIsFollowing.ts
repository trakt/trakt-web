import { map } from 'rxjs';
import { useUser } from './useUser.ts';

export function useIsFollowing(slug: string) {
  const { network } = useUser();

  return {
    isFollowing: network.pipe(
      map(($network) => {
        if (!$network) return undefined;
        return $network.following.some((user) => user.slug === slug);
      }),
    ),
  };
}
