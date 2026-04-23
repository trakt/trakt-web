import { api, type ApiParams } from '$lib/requests/api.ts';

type HideRecommendedShowParams = {
  slug: string;
} & ApiParams;

export async function hideRecommendedShowRequest(
  { slug, fetch }: HideRecommendedShowParams,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .recommendations
    .shows
    .hide({
      params: { id: slug },
    });

  return status === 204;
}
