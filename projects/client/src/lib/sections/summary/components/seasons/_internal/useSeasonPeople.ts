import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import { showSeasonPeopleQuery } from '$lib/requests/queries/shows/showSeasonPeopleQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

export const useSeasonPeople = (slug: string, season: number) => {
  const query = useQuery(showSeasonPeopleQuery({ slug, season }));

  return {
    crew: query.pipe(map(($query) => $query.data ?? EMPTY_CREW)),
    isLoading: query.pipe(map(toLoadingState)),
  };
};
