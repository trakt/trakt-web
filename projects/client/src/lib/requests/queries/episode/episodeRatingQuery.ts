import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { api, type ApiParams } from '$lib/requests/api.ts';
import { MediaRatingSchema } from '$lib/requests/models/MediaRating.ts';
import { castNumberAsString } from '$lib/utils/requests/castNumberAsString.ts';
import { time } from '$lib/utils/timing/time.ts';
import { mapToMediaRating } from '../../_internal/mapToMediaRating.ts';

type EpisodeRatingParams = {
  slug: string;
  season: number;
  episode: number;
} & ApiParams;

const episodeRatingRequest = (
  { fetch, slug, season, episode }: EpisodeRatingParams,
) =>
  api({ fetch })
    .shows
    .episode
    .ratings({
      params: {
        id: slug,
        season: castNumberAsString(season),
        episode,
      },
      query: {
        extended: 'all',
      },
    });

export const episodeRatingQuery = defineQuery({
  key: 'episodeRating',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeRatingRequest,
  mapper: (response) => mapToMediaRating(response.body),
  schema: MediaRatingSchema,
  ttl: time.hours(3),
});
