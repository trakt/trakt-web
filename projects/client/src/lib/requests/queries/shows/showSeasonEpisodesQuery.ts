import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToEpisodeEntry } from '../../_internal/mapToEpisodeEntry.ts';

type ShowSeasonEpisodeParams = {
  slug: string;
  season: number;
} & ApiParams;

const showSeasonEpisodesRequest = (
  { fetch, slug, season }: ShowSeasonEpisodeParams,
) =>
  api({ fetch })
    .shows
    .season
    .episodes({
      params: {
        id: slug,
        season: castNumberAsString(season),
      },
      query: {
        extended: 'full,images',
      },
    });

export const showSeasonEpisodesQuery = defineQuery({
  key: 'showSeasonEpisodes',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season],
  request: showSeasonEpisodesRequest,
  mapper: (response) => response.body.map(mapToEpisodeEntry),
  schema: EpisodeEntrySchema.array(),
  ttl: time.hours(6),
});
