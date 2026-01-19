import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { time } from '$lib/utils/timing/time.ts';
import type { SeasonsResponse } from '@trakt/api';
import { z } from 'zod';
import { findDefined } from '../../../utils/string/findDefined.ts';
import { mapToPoster } from '../../_internal/mapToPoster.ts';
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
        extended: 'full,images',
      },
    });

export const mapToSeason = (item: SeasonsResponse[0]): Season => {
  const poster = findDefined(
    ...(item.images?.poster ?? []),
  );

  return {
    id: item.ids.trakt,
    key: `season-${item.ids.trakt}`,
    number: item.number,
    episodes: {
      count: item.episode_count ?? 0,
    },
    poster: poster ? mapToPoster(item.images) : undefined,
  };
};

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
  ttl: time.days(1),
});
