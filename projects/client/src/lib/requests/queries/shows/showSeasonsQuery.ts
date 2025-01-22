import type { SeasonsResponse } from '$lib/api.ts';
import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { z } from 'zod';
import { type Season, SeasonSchema } from '../../models/Season.ts';

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
        extended: 'full',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch seasons');
      }

      return response.body;
    });

const mapSeasonResponseToSeason = (item: SeasonsResponse[0]): Season => ({
  id: item.ids.trakt,
  number: item.number,
  episodes: {
    count: item.episode_count ?? 0,
  },
});

export const showSeasonsQuery = defineQuery({
  key: 'showSeasons',
  invalidations: [],
  dependencies: (params) => [params.slug],
  request: showSeasonsRequest,
  mapper: (response) =>
    response
      .map(mapSeasonResponseToSeason)
      .filter((season) => season.episodes.count > 0 && season.number !== 0),
  schema: z.array(SeasonSchema),
});
