import { api, type ApiParams } from '$lib/requests/api.ts';

type UserProfileImageRequest = {
  avatar: string;
} & ApiParams;

export async function uploadAvatarRequest(
  { avatar, fetch }: UserProfileImageRequest,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .users
    .avatar({
      body: {
        user: {
          avatar,
        },
      },
    });

  return status >= 200 && status < 300;
}
