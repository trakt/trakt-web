import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { setMarker } from '$lib/utils/date/Marker.ts';
import { error } from '@sveltejs/kit';
import type { CommentReplyParams } from '@trakt/api';
import { mapToMediaComment } from '../../_internal/mapToMediaComment.ts';

type ReplyCommentParams = { id: number; body: CommentReplyParams } & ApiParams;

export function replyCommentRequest(
  { fetch, id, body }: ReplyCommentParams,
): Promise<MediaComment> {
  return api({ fetch })
    .comments
    .reply({
      params: {
        id: `${id}`,
      },
      body,
    })
    .then((response) => {
      if (response.status !== 201) {
        throw error(response.status);
      }

      setMarker();
      return mapToMediaComment(response.body);
    });
}
