import type { MediaRating } from '$lib/models/MediaRating.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapRatingResponseToMediaRating } from '../../_internal/mapRatingResponseToMediaRating.ts';

type EpisodeRatingParams =
  & { slug: string; season: number; episode: number }
  & ApiParams;

export function episodeRatingRequest(
  { fetch, slug, season, episode }: EpisodeRatingParams,
): Promise<MediaRating> {
  return api({ fetch })
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
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch episode ratings');
      }

      return mapRatingResponseToMediaRating(body);
    });
}

export const episodeRatingQueryKey = (params: EpisodeRatingParams) =>
  ['episodeRating', params.slug, params.season, params.episode] as const;
export const episodeRatingQuery = (
  params: EpisodeRatingParams,
) => ({
  queryKey: episodeRatingQueryKey(params),
  queryFn: () => episodeRatingRequest(params),
});
