import { mapMovieResponseToMovieSummary } from '$lib/requests/_internal/mapMovieResponseToMovieSummary.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type PeopleMovieCreditsParams = { slug: string } & ApiParams;

function peopleMovieCreditsRequest(
  { fetch, slug }: PeopleMovieCreditsParams,
): Promise<MovieEntry[]> {
  return api({ fetch })
    .people
    .movies({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch person movie credits');
      }

      return (body.cast ?? [])
        .map(({ movie }) => mapMovieResponseToMovieSummary(movie));
    });
}

export const peopleMovieCreditsQueryKey = (id: string) =>
  ['peopleMovieCredits', id] as const;
export const peopleMovieCreditsQuery = (
  params: PeopleMovieCreditsParams,
) => ({
  queryKey: peopleMovieCreditsQueryKey(params.slug),
  queryFn: () => peopleMovieCreditsRequest(params),
});
