import {
  useAllPagesInfiniteQuery,
  useInfiniteQuery,
} from '$lib/features/query/useQuery.ts';
import {
  mediaSocialQuery,
  type MediaSocialQueryTarget,
} from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable, switchMap } from 'rxjs';
import { sortMediaSocialEntries } from './sortMediaSocialEntries.ts';

const socialActivitiesLimit = 100;

type UseSocialActivitiesOptions = {
  mode?: 'default' | 'all';
};

export function useSocialActivities(
  target$: Observable<MediaSocialQueryTarget>,
  { mode = 'default' }: UseSocialActivitiesOptions = {},
) {
  const query = target$.pipe(
    switchMap((target) => {
      const queryDef = mediaSocialQuery({
        ...target,
        limit: socialActivitiesLimit,
      });
      return mode === 'all'
        ? useAllPagesInfiniteQuery(queryDef)
        : useInfiniteQuery(queryDef);
    }),
  );

  const entries = query.pipe(
    map(($query) =>
      sortMediaSocialEntries(
        $query.data?.pages.flatMap((page) => page.entries) ?? [],
      )
    ),
  );

  const isLoading = query.pipe(map(toLoadingState));
  const hasNextPage = query.pipe(map(($query) => $query.hasNextPage));

  return { entries, isLoading, hasNextPage };
}
