import { api, type ApiParams } from '$lib/requests/api.ts';
import { setMarker } from '../../../utils/date/Marker.ts';

type DropMovieRequest = {
  id: number;
} & ApiParams;

export function dropMovieRequest(
  { id, fetch }: DropMovieRequest,
): Promise<boolean> {
  return api({ fetch })
    .sync
    .progress
    .drop
    .movie({
      params: {
        id: `${id}`,
      },
    })
    .then(({ status }) => {
      setMarker();

      return status === 204;
    });
}
