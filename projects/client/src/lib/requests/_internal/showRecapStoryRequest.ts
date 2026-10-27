import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { ShowRecapStoryResponseSchema } from '../models/ShowRecapStoryResponse.ts';

type ShowRecapStoryRequestParams = {
  slug: string;
  through: number;
} & ApiParams;

const UNAVAILABLE_STATUSES = [401, 403, 404];

export async function showRecapStoryRequest({
  fetch,
  slug,
  through,
}: ShowRecapStoryRequestParams) {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/shows/${slug}/recap/story?through=${through}`,
  });

  if (UNAVAILABLE_STATUSES.includes(response.status)) {
    return { body: undefined, status: 204 };
  }

  if (!response.ok) {
    return { body: undefined, status: response.status };
  }

  return {
    body: ShowRecapStoryResponseSchema.parse(await response.json()),
    status: 200,
  };
}
