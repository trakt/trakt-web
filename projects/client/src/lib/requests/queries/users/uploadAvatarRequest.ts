import { api, type ApiParams } from '$lib/requests/api.ts';

type UserProfileImageRequest = {
  avatar: string;
} & ApiParams;

export function uploadAvatarRequest({
  avatar,
  fetch,
}: UserProfileImageRequest): Promise<boolean> {
  return api({ fetch })
    .users.avatar({
      body: {
        user: {
          avatar,
        },
      },
    })
    .then(({ status }) => status >= 200 && status < 300)
    .catch(() => false);
}
