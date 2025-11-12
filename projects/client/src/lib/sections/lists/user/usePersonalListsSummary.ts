import { useQuery } from '$lib/features/query/useQuery.ts';
import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import { likedListsQuery } from '../../../requests/queries/users/likedListsQuery.ts';
import type { PersonalListType } from './models/PersonalListType.ts';

type PersonalListsParams = {
  type: PersonalListType;
  slug?: string;
  sortBy?: 'none' | 'recently-updated';
};

function typeToQuery({ type, slug }: PersonalListsParams) {
  const userSlug = slug ?? 'me';
  switch (type) {
    case 'liked':
      return likedListsQuery();
    case 'personal':
      return personalListsQuery({ slug: userSlug });
    case 'collaboration':
      return collaborationListsQuery({ slug: userSlug });
  }
}

export function usePersonalListsSummary(
  { type, slug, sortBy = 'recently-updated' }: PersonalListsParams,
) {
  const lists = useQuery(typeToQuery({ type, slug }));

  const isLoading = derived(
    lists,
    toLoadingState,
  );

  return {
    isLoading,
    lists: derived(
      lists,
      ($lists) => {
        const data = $lists.data ?? [];

        if (sortBy === 'none') {
          return data;
        }

        return data.toSorted((a, b) =>
          // FIXME: update when we add sorting options
          b.updatedAt.getTime() - a.updatedAt.getTime()
        );
      },
    ),
  };
}
