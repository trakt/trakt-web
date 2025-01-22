import { defineQuery } from '$lib/features/query/defineQuery.ts';
import { MediaRatingSchema } from '$lib/requests/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapRatingResponseToMediaRating } from '../../_internal/mapRatingResponseToMediaRating.ts';

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
        season,
        episode,
      },
      query: {
        extended: 'all',
      },
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Failed to fetch episode ratings');
      }

      return response.body;
    });

export const episodeRatingQuery = await defineQuery({
  key: 'episodeRating',
  invalidations: [],
  dependencies: (params) => [params.slug, params.season, params.episode],
  request: episodeRatingRequest,
  mapper: mapRatingResponseToMediaRating,
  schema: MediaRatingSchema,
});
