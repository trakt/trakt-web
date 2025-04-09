import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { useWatchlist } from '$lib/sections/media-actions/watchlist/useWatchlist.ts';
import { derived } from 'svelte/store';
import { useList } from './useList.ts';

type UseListCountProps = {
  lists: MediaListSummary[];
} & MediaStoreProps;

// FIXME: replace with new list check endpoint when available
export function useIsOnAnyList({ lists, ...target }: UseListCountProps) {
  const { isWatchlisted } = useWatchlist(target);

  const personalLists = lists
    .map((list) => useList({ list, ...target }))
    .map(({ isListed }) => isListed);

  return {
    isListed: derived(
      [isWatchlisted, ...personalLists],
      ([$isWatchlisted, ...$personalLists]) => {
        const listCount = $personalLists.filter(Boolean).length;
        return $isWatchlisted || listCount > 0;
      },
    ),
  };
}
