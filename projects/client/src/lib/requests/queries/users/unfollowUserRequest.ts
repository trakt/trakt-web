import { api, type ApiParams } from '$lib/requests/api.ts';

type UnfollowUserRequest = {
  slug: string;
} & ApiParams;

export function unfollowUserRequest(
  { slug, fetch }: UnfollowUserRequest,
): Promise<boolean> {
  return api({ fetch })
    .users
    .unfollow({
      params: {
        id: slug,
      },
    })
    .then(({ status }) => status === 204);
}
