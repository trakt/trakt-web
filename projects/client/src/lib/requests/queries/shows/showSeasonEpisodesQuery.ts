import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapEpisodeResponseToEpisodeEntry } from '../../_internal/mapEpisodeResponseToEpisodeEntry.ts';

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
        extended: 'full,cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch up season episodes');
      }

      return response.body;
    });

export const showSeasonEpisodesQuery = await defineQuery({
  key: 'showSeasonEpisodes',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season],
  request: showSeasonEpisodesRequest,
  mapper: (body) => body.map(mapEpisodeResponseToEpisodeEntry),
  schema: EpisodeEntrySchema.array(),
});
