import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import type { MediaListSummary } from '$lib/requests/models/MediaListSummary.ts';
import { useWatchlist } from '$lib/sections/media-actions/watchlist/useWatchlist.ts';
import { derived } from 'svelte/store';
import { useList } from './useList.ts';

type UseListCountProps = {
  lists: MediaListSummary[];
  title: string;
} & MediaStoreProps;

// FIXME: replace with new list check endpoint when available
export function useIsOnAnyList({ lists, title, ...target }: UseListCountProps) {
  const { isWatchlisted } = useWatchlist({ ...target, title });

  const personalLists = lists
    .map((list) => useList({ list, title, ...target }))
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
