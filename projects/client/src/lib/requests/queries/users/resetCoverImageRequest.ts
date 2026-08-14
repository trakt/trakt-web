import { api, type ApiParams } from '$lib/requests/api.ts';

const NO_COVER_MEDIA_ID = 0;

export async function resetCoverImageRequest(
  { fetch }: ApiParams = {},
): Promise<boolean> {
  const { status } = await api({ fetch })
    .users
    .cover({
      body: {
        cover_type: 'show',
        cover_id: NO_COVER_MEDIA_ID,
      },
    });

  return status === 204;
}
