import { api, type ApiParams } from '$lib/requests/api.ts';

type DenyFollowRequestParams = {
  requestId: number;
} & ApiParams;

export function denyFollowRequest(
  { fetch, requestId }: DenyFollowRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .requests
    .deny({
      params: {
        id: String(requestId),
      },
    })
    .then(({ status }) => status === 204);
}
