import { api, type ApiParams } from '$lib/requests/api.ts';

type UnlikeCommentParams = { id: number } & ApiParams;

export function unlikeCommentRequest(
  { fetch, id }: UnlikeCommentParams,
): Promise<boolean> {
  return api({ fetch })
    .comments
    .unlike({
      params: {
        id: `${id}`,
      },
    })
    .then(({ status }) => status === 204);
}
