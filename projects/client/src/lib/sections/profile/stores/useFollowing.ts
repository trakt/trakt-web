import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { derived } from 'svelte/store';
import { followersQuery } from '../../../requests/queries/users/followersQuery.ts';

export function useFollowing(slug: string) {
  const following = useQuery(followingQuery({ slug }));
  const followers = useQuery(followersQuery({ slug }));

  return {
    following: derived(following, ($following) => $following.data ?? []),
    followers: derived(followers, ($followers) => $followers.data ?? []),
  };
}
