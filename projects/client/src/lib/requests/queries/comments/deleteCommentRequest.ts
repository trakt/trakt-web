import { api, type ApiParams } from '$lib/requests/api.ts';
import { setMarker } from '$lib/utils/date/Marker.ts';

type DeleteCommentParams = { id: number } & ApiParams;

export function deleteCommentRequest(
  { fetch, id }: DeleteCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .delete({
      params: { id: `${id}` },
    })
    .then((response) => {
      setMarker();
      return response.status === 204;
    });
}
