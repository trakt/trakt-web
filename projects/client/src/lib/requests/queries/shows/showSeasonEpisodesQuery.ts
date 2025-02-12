import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
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
    .episodes({
      params: {
        id: slug,
        season,
      },
      query: {
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch up season episodes');
      }

      return response.body;
    });

export const showSeasonEpisodesQuery = defineQuery({
  key: 'showSeasonEpisodes',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season],
  request: showSeasonEpisodesRequest,
  mapper: (body) => body.map(mapToEpisodeEntry),
  schema: EpisodeEntrySchema.array(),
  ttl: time.hours(6),
});
