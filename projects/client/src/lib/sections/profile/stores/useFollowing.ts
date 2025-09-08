import { useQuery } from '$lib/features/query/useQuery.ts';
import { followingQuery } from '$lib/requests/queries/users/followingQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import { followersQuery } from '../../../requests/queries/users/followersQuery.ts';

export function useFollowing(slug: string, type: 'following' | 'followers') {
  const query = type === 'following'
    ? useQuery(followingQuery({ slug }))
    : useQuery(followersQuery({ slug }));

  return {
    profiles: derived(query, ($query) => {
      const data = $query.data ?? [];
      return data.map((profile) => ({
        ...profile,
        id: profile.slug,
      }));
    }),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
