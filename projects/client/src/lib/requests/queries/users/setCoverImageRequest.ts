import { api, type ApiParams } from '$lib/requests/api.ts';
import type { ExtendedMediaType } from '../../models/ExtendedMediaType.ts';

type SetCoverImageRequestParams = {
  type: ExtendedMediaType;
  id: number;
} & ApiParams;

export async function setCoverImageRequest(
  { type, id, fetch }: SetCoverImageRequestParams,
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
