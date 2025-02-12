import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { time } from '$lib/utils/timing/time.ts';

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
        extended: 'full,images',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode summary');
      }

      return response.body;
    });

export const episodeSummaryQuery = defineQuery({
  key: 'episodeSummary',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeSummaryRequest,
  mapper: mapToEpisodeEntry,
  schema: EpisodeEntrySchema,
  ttl: time.days(1),
});
