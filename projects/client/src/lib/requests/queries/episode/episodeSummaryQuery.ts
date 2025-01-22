import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeSummaryParams = {
  slug: string;
  season: number;
  episode: number;
} & ApiParams;

const episodeSummaryRequest = (
  { fetch, slug, season, episode }: EpisodeSummaryParams,
) =>
  api({ fetch })
    .shows
    .episode
    .summary({
      params: {
        id: slug,
        season,
        episode,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode summary');
      }

      return response.body;
    });

export const episodeSummaryQuery = await defineQuery({
  key: 'episodeSummary',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeSummaryRequest,
  mapper: mapEpisodeResponseToEpisodeEntry,
  schema: EpisodeEntrySchema,
});
