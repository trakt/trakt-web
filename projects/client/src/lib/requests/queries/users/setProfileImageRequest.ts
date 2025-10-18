import { api, type ApiParams } from '$lib/requests/api.ts';
import type { ExtendedMediaType } from '../../models/ExtendedMediaType.ts';

type SetProfileImageRequestParams = {
  type: ExtendedMediaType;
  id: number;
} & ApiParams;

export async function setProfileImageRequest(
  { type, id, fetch }: SetProfileImageRequestParams,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .users
    .cover({
      body: {
        cover_type: type,
        cover_id: id,
      },
    });

  return status === 204;
}
