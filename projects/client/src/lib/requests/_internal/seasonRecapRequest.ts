import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import { SeasonRecapResponseSchema } from '../models/SeasonRecapResponse.ts';

type SeasonRecapRequestParams = {
  slug: string;
  season: number;
} & ApiParams;

export async function seasonRecapRequest({
  fetch,
  slug,
  season,
}: SeasonRecapRequestParams) {
  const response = await rawApiFetch({
    fetch,
    path: `/v3/shows/${slug}/seasons/${season}/recap`,
  });

  if (response.status === 404) {
    return { body: undefined, status: 204 };
  }

  if (!response.ok) {
    return { body: undefined, status: response.status };
  }

  return {
    body: SeasonRecapResponseSchema.parse(await response.json()),
    status: 200,
  };
}
