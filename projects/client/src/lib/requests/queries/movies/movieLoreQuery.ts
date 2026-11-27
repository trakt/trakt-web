import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMovieLore } from '../../_internal/mapToMovieLore.ts';
import { movieLoreRequest } from '../../_internal/movieLoreRequest.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { MovieLoreSchema } from '../../models/MovieLore.ts';

type MovieLoreParams = {
  slug: string;
  isVip: boolean;
} & ApiParams;

export const movieLoreQuery = defineQuery({
  key: 'movieLore:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.isVip],
  request: ({ fetch, slug }: MovieLoreParams) =>
    movieLoreRequest({ fetch, slug }),
  mapper: (response) => mapToMovieLore(response.body),
  schema: MovieLoreSchema.nullable(),
  ttl: time.hours(3),
});
