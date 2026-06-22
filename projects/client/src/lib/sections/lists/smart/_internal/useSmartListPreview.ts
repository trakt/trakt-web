import { map, of } from 'rxjs';
import type { SmartList } from '$lib/requests/queries/users/smartListQuery.ts';
import { useAnticipatedList } from '../../anticipated/useAnticipatedList.ts';
import { usePopularList } from '../../popular/usePopularList.ts';
import { useTrendingList } from '../../trending/useTrendingList.ts';

const previewLimit = 8;

function smartListToPreviewQuery(list: SmartList) {
  const params = {
    limit: previewLimit,
    search: list.params,
    type: list.type,
  };

  switch (list.target) {
    case 'trending':
      return useTrendingList(params);
    case 'popular':
      return usePopularList(params);
    case 'anticipated':
      return useAnticipatedList(params);
    case 'unknown':
      return undefined;
  }
}

export function useSmartListPreview(list: SmartList) {
  const query = smartListToPreviewQuery(list);

  if (!query) {
    return {
      isLoading: of(false),
      posters: of([]),
    };
  }

  return {
    isLoading: query.isLoading,
    posters: query.list.pipe(
      map((items) =>
        items
          .map((item) => item.poster.url.thumb)
          .slice(0, previewLimit)
      ),
    ),
  };
}
