import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { EpisodeEntrySchema } from '$lib/requests/models/EpisodeEntry.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
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
        season: castNumberAsString(season),
        episode,
      },
      query: {
        extended: 'full,images',
      },
    });

export const episodeSummaryQuery = defineQuery({
  key: 'episodeSummary',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeSummaryRequest,
  mapper: (response) => mapToEpisodeEntry(response.body),
  schema: EpisodeEntrySchema,
  ttl: time.hours(3),
});
