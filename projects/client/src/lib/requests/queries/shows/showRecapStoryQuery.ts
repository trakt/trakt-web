import { defineQuery } from '$lib/features/query/defineQuery.ts';
import type { ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToShowRecapStory } from '../../_internal/mapToShowRecapStory.ts';
import { showRecapStoryRequest } from '../../_internal/showRecapStoryRequest.ts';
import { InvalidateAction } from '../../models/InvalidateAction.ts';
import { ShowRecapStorySchema } from '../../models/ShowRecapStory.ts';

type ShowRecapStoryParams = {
  slug: string;
  through: number;
  enabled: boolean;
} & ApiParams;

export const showRecapStoryQuery = defineQuery({
  key: 'showRecapStory:v1',
  invalidations: [InvalidateAction.Vip.Updated],
  dependencies: (params) => [params.slug, params.through],
  request: ({ fetch, slug, through }: ShowRecapStoryParams) =>
    showRecapStoryRequest({ fetch, slug, through }),
  mapper: (response) => mapToShowRecapStory(response.body),
  schema: ShowRecapStorySchema.nullable(),
  ttl: time.hours(3),
  enabled: (params) => params.enabled,
});
