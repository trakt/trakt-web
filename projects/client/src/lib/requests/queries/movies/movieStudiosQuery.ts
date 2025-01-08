import type { MediaStudio } from '$lib/models/MediaStudio.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapStudioResponseToMediaStudio } from '../../_internal/mapStudioResponseToMediaStudio.ts';

type MovieStudiosQuery = { slug: string } & ApiParams;

export function movieStudiosRequest(
  { fetch, slug }: MovieStudiosQuery,
): Promise<MediaStudio[]> {
  return api({ fetch })
    .movies
    .studios({
      params: {
        id: slug,
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch movie studios');
      }

      return body.map(mapStudioResponseToMediaStudio);
    });
}

export const movieStudiosQueryKey = (id: string) =>
  ['movieStudios', id] as const;
export const movieStudiosQuery = (
  params: MovieStudiosQuery,
) => ({
  queryKey: movieStudiosQueryKey(params.slug),
  queryFn: () => movieStudiosRequest(params),
});
