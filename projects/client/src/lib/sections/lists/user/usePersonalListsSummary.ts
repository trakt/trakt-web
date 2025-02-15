import { useQuery } from '$lib/features/query/useQuery.ts';
import { collaborationListsQuery } from '$lib/requests/queries/users/collaborationListsQuery.ts';
import { personalListsQuery } from '$lib/requests/queries/users/personalListsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import type { PersonalListType } from './models/PersonalListType.ts';

type PersonalListsParams = {
  type: PersonalListType;
};

function typeToQuery({ type }: PersonalListsParams) {
  switch (type) {
    case 'personal':
      return personalListsQuery();
    case 'collaboration':
      return collaborationListsQuery();
  }
}

export function usePersonalListsSummary({ type }: PersonalListsParams) {
  const lists = useQuery(typeToQuery({ type }));

  const isLoading = derived(
    lists,
    toLoadingState,
  );

  return {
    isLoading,
    lists: derived(lists, ($lists) => $lists.data ?? []),
  };
}
