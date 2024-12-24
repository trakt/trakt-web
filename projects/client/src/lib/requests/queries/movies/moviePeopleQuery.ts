import { mapPeopleResponseToMediaCrew } from '$lib/requests/_internal/mapPeopleResponseToMediaCrew.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type MoviePeopleQuery = { slug: string } & ApiParams;

export function moviePeopleRequest(
  { fetch, slug }: MoviePeopleQuery,
): Promise<MediaCrew> {
  return api({ fetch })
    .movies
    .people({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up movie people');
      }

      return mapPeopleResponseToMediaCrew(body);
    });
}

export const moviePeopleQueryKey = (id: string) => ['moviePeople', id] as const;
export const moviePeopleQuery = (
  params: MoviePeopleQuery,
) => ({
  queryKey: moviePeopleQueryKey(params.slug),
  queryFn: () => moviePeopleRequest(params),
});
