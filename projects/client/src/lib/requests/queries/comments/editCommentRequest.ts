import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { error } from '@sveltejs/kit';
import type { CommentReplyParams } from '@trakt/api';
import { mapToMediaComment } from '../../_internal/mapToMediaComment.ts';

type EditCommentParams = { id: number; body: CommentReplyParams } & ApiParams;

export function editCommentRequest(
  { fetch, id, body }: EditCommentParams,
): Promise<MediaComment> {
  return api({ fetch })
    .comments
    .edit({
      params: {
        id: `${id}`,
      },
      body,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw error(response.status);
      }

      return mapToMediaComment(response.body);
    });
}
