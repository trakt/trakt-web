import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToSeason } from '$lib/requests/_internal/mapToSeason.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import { z } from 'zod';
import { SeasonSchema } from '../../models/Season.ts';

type ShowSeasonsParams = {
  slug: string;
} & ApiParams;

const showSeasonsRequest = (
  { fetch, slug }: ShowSeasonsParams,
) =>
  api({ fetch })
    .shows
    .seasons({
      params: {
        id: slug,
      },
      query: {
        extended: 'full,images',
      },
    });

export const showSeasonsQuery = defineQuery({
  key: 'showSeasons',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showSeasonsRequest,
  mapper: (response) =>
    response.body
      .map(mapToSeason)
      .filter((season) => season.episodes.count > 0),
  schema: z.array(SeasonSchema),
  ttl: time.hours(3),
});
