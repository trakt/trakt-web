import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToSeasonRecap } from '../../_internal/mapToSeasonRecap.ts';
import { seasonRecapRequest } from '../../_internal/seasonRecapRequest.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { SeasonRecapSchema } from '../../models/SeasonRecap.ts';

type ShowSeasonRecapParams = {
  slug: string;
  season: number;
  isVip: boolean;
} & ApiParams;

export const showSeasonRecapQuery = defineQuery({
  key: 'showSeasonRecap:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.season, params.isVip],
  request: ({ fetch, slug, season }: ShowSeasonRecapParams) =>
    seasonRecapRequest({ fetch, slug, season }),
  mapper: (response) => mapToSeasonRecap(response.body),
  schema: SeasonRecapSchema.nullable(),
  ttl: time.hours(3),
});
