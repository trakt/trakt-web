import { api, type ApiParams } from '$lib/requests/api.ts';
import type { MediaComment } from '$lib/requests/models/MediaComment.ts';
import { error } from '@sveltejs/kit';
import type { CommentPostParams } from '@trakt/api';
import { mapToMediaComment } from '../../_internal/mapToMediaComment.ts';

type PostCommentParams = { body: CommentPostParams } & ApiParams;

export function postCommentRequest(
  { fetch, body }: PostCommentParams,
): Promise<MediaComment> {
  return api({ fetch })
    .comments
    .post({
      body,
    })
    .then((response) => {
      if (response.status !== 201) {
        throw error(response.status);
      }

      return mapToMediaComment(response.body);
    });
}
