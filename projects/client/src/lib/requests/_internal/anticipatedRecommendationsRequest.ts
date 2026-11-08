import { type ApiParams, rawApiFetch } from '$lib/requests/api.ts';
import type { FilterParams } from '$lib/requests/models/FilterParams.ts';
import type { PaginationParams } from '$lib/requests/models/PaginationParams.ts';
import type { z } from 'zod';
import { getRecommendedSearchParams } from './getRecommendedSearchParams.ts';

type AnticipatedRecommendationsParams<T> = PaginationParams &
  ApiParams &
  FilterParams & {
    path: string;
    schema: z.ZodType<T>;
  };

export async function anticipatedRecommendationsRequest<T>({
  fetch,
  path,
  schema,
  limit,
  page,
  filter,
}: AnticipatedRecommendationsParams<T>) {
  const searchParams = getRecommendedSearchParams({
    limit,
    page,
    filterParams: filter,
  });

  const response = await rawApiFetch({
    fetch,
    path: `${path}?${searchParams}`,
  });

  if (!response.ok) {
    throw new Error(`Anticipated recommendations failed (${response.status})`);
  }

  return {
    body: schema.parse(await response.json()),
    headers: response.headers,
    status: 200 as const,
  };
}
