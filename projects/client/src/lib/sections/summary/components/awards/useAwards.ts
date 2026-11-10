import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieAwardsQuery } from '$lib/requests/queries/movies/movieAwardsQuery.ts';
import { personAwardsQuery } from '$lib/requests/queries/people/personAwardsQuery.ts';
import { showAwardsQuery } from '$lib/requests/queries/shows/showAwardsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { multicast } from '$lib/utils/store/multicast.ts';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { toAwardBadge } from './_internal/toAwardBadge.ts';
import { toAwardGroups } from './_internal/toAwardGroups.ts';
import type { AwardsTarget } from './models/AwardsTarget.ts';

function toAwardsQuery({ type, slug }: AwardsTarget) {
  switch (type) {
    case 'movie':
      return movieAwardsQuery({ slug });
    case 'show':
      return showAwardsQuery({ slug });
    case 'person':
      return personAwardsQuery({ slug });
  }
}

export function useAwards(target$: Observable<AwardsTarget>) {
  const query = useQuery(target$.pipe(map(toAwardsQuery)));

  const groups = query.pipe(
    map(($query) =>
      toAwardGroups({ entries: $query.data ?? [], today: new Date() }),
    ),
    multicast(),
  );

  return {
    isLoading: query.pipe(map(toLoadingState)),
    awards: query.pipe(map(($query) => $query.data)),
    groups,
    badge: groups.pipe(map(toAwardBadge)),
  };
}
