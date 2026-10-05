import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { showSeasonPeopleQuery } from '$lib/requests/queries/shows/showSeasonPeopleQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, type Observable } from 'rxjs';

export const useSeasonPeople = (
  params$: Observable<{ slug: string; season: number }>,
) => {
  const query = useQuery(
    params$.pipe(
      map((params) => showSeasonPeopleQuery({ ...params, guestStars: true })),
    ),
  );

  return {
    crew: query.pipe(map(($query) => $query.data ?? EMPTY_CREW)),
    isLoading: query.pipe(map(toLoadingState)),
  };
};
