import {
  useAllPagesInfiniteQuery,
  useInfiniteQuery,
} from '$lib/features/query/useQuery.ts';
import {
  mediaSocialQuery,
  type MediaSocialQueryTarget,
} from '$lib/requests/queries/media/mediaSocialQuery.ts';
import { dedupe } from '$lib/utils/array/dedupe.ts';
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

  // The social endpoint can return the same user twice (also across pages),
  // which blows up keyed `{#each}` blocks downstream (see #2834).
  const entries = query.pipe(
    map(($query) =>
      sortMediaSocialEntries(
        dedupe(
          (entry) => entry.key,
          $query.data?.pages.flatMap((page) => page.entries) ?? [],
        ),
      )
    ),
  );

  const isLoading = query.pipe(map(toLoadingState));
  const hasNextPage = query.pipe(map(($query) => $query.hasNextPage));

  return { entries, isLoading, hasNextPage };
}
