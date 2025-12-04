import { api, type ApiParams } from '$lib/requests/api.ts';

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
      return status === 204;
    });
}
