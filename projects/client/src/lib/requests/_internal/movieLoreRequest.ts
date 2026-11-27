import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { MovieLoreResponseSchema } from '../models/MovieLoreResponse.ts';

type MovieLoreRequestParams = {
  slug: string;
} & ApiParams;

export async function movieLoreRequest({
  fetch,
  slug,
}: MovieLoreRequestParams) {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/movies/${slug}/lore`,
  });

  if (response.status === 404) {
    return { body: undefined, status: 204 };
  }

  if (!response.ok) {
    return { body: undefined, status: response.status };
  }

  return {
    body: MovieLoreResponseSchema.parse(await response.json()),
    status: 200,
  };
}
