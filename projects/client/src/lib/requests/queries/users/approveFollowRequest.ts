import { api, type ApiParams } from '$lib/requests/api.ts';

type ApproveFollowRequestParams = {
  requestId: number;
} & ApiParams;

export function approveFollowRequest(
  { fetch, requestId }: ApproveFollowRequestParams,
): Promise<boolean> {
  return api({ fetch })
    .users
    .requests
    .approve({
      params: {
        id: String(requestId),
      },
    })
    .then(({ status }) => status === 200);
}
