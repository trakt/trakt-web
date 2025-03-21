import { api, type ApiParams } from '$lib/requests/api.ts';
import { error } from '@sveltejs/kit';
import type { CommentReplyParams } from '@trakt/api';

type ReplyCommentParams = { id: number; body: CommentReplyParams } & ApiParams;

export function replyCommentRequest(
  { fetch, id, body }: ReplyCommentParams,
): Promise<boolean> {
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

      return response.status === 201;
    });
}
