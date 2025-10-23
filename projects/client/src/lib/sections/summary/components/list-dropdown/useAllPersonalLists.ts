import { usePersonalListsSummary } from '$lib/sections/lists/user/usePersonalListsSummary.ts';
import { derived } from 'svelte/store';

export function useAllPersonalLists() {
  const { lists, isLoading } = usePersonalListsSummary({
    type: 'personal',
    sortBy: 'none',
  });

  const { lists: collaborationLists, isLoading: isLoadingCollaborations } =
    usePersonalListsSummary({
      type: 'collaboration',
      sortBy: 'none',
    });

  return {
    isLoading: derived(
      [isLoading, isLoadingCollaborations],
      ([$isLoading, $isLoadingCollaborations]) => {
        return $isLoading || $isLoadingCollaborations;
      },
    ),
    lists: derived(
      [lists, collaborationLists],
      ([$lists, $collaborativeLists]) => {
        return [...$lists, ...$collaborativeLists];
      },
    ),
  };
}
