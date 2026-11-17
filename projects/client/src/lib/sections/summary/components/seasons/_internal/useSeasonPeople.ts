import { FeatureFlag } from '$lib/features/feature-flag/models/FeatureFlag.ts';
import { useFeatureFlag } from '$lib/features/feature-flag/useFeatureFlag.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { showSeasonPeopleQuery } from '$lib/requests/queries/shows/showSeasonPeopleQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, map, type Observable } from 'rxjs';

export const useSeasonPeople = (
  params$: Observable<{ slug: string; season: number }>,
) => {
  const isPortraitsEnabled = useFeatureFlag().isEnabled(
    FeatureFlag.CharacterPortraits,
  );
  const query = useQuery(
    combineLatest([params$, isPortraitsEnabled]).pipe(
      map(([params, portraits]) =>
        showSeasonPeopleQuery({ ...params, guestStars: true, portraits }),
      ),
    ),
  );

  return {
    crew: query.pipe(map(($query) => $query.data ?? EMPTY_CREW)),
    isLoading: query.pipe(map(toLoadingState)),
  };
};
