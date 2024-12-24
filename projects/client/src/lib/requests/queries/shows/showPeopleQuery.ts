import { mapPeopleResponseToMediaCrew } from '$lib/requests/_internal/mapPeopleResponseToMediaCrew.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type ShowPeopleQuery = { slug: string } & ApiParams;

export function showPeopleRequest(
  { fetch, slug }: ShowPeopleQuery,
): Promise<MediaCrew> {
  return api({ fetch })
    .shows
    .people({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up show people');
      }

      return mapPeopleResponseToMediaCrew(body);
    });
}

export const showPeopleQueryKey = (id: string) => ['showPeople', id] as const;
export const showPeopleQuery = (
  params: ShowPeopleQuery,
) => ({
  queryKey: showPeopleQueryKey(params.slug),
  queryFn: () => showPeopleRequest(params),
});
