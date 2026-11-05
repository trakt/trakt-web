import { api, type ApiParams } from '$lib/requests/api.ts';

export function removeAvatarRequest({
  fetch,
}: ApiParams = {}): Promise<boolean> {
  return api({ fetch })
    .users.removeAvatar()
    .then(({ status }) => status >= 200 && status < 300)
    .catch(() => false);
}
