import { api, type ApiParams } from '$lib/requests/api.ts';

type HideRecommendedMovieParams = {
  slug: string;
} & ApiParams;

export async function hideRecommendedMovieRequest(
  { slug, fetch }: HideRecommendedMovieParams,
): Promise<boolean> {
  const { status } = await api({ fetch })
    .recommendations
    .movies
    .hide({
      params: { id: slug },
    });

  return status === 204;
}
