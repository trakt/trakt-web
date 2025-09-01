import { api, type ApiParams } from '$lib/requests/api.ts';
import { setMarker } from '../../../utils/date/Marker.ts';

type RemoveReactionCommentParams = { id: number } & ApiParams;

export function removeReactionCommentRequest(
  { fetch, id }: RemoveReactionCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .reactions
    .remove({
      params: {
        id: `${id}`,
      },
    })
    .then(({ status }) => {
      setMarker();

      return status === 204;
    });
}
