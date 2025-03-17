import { api, type ApiParams } from '$lib/requests/api.ts';

type LikeCommentParams = { id: number } & ApiParams;

export function likeCommentRequest(
  { fetch, id }: LikeCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .like({
      params: {
        id: `${id}`,
      },
    })
    .then(({ status }) => status === 204);
}
