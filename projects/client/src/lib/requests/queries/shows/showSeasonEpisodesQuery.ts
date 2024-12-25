import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';
import { mapEpisodeResponseToEpisodeEntry } from '../../_internal/mapEpisodeResponseToEpisodeEntry.ts';

type ShowSeasonEpisodeQuery = { slug: string; season: number } & ApiParams;

function showSeasonEpisodesRequest(
  { fetch, slug, season }: ShowSeasonEpisodeQuery,
): Promise<EpisodeEntry[]> {
  return api({ fetch })
    .shows
    .episodes({
      params: {
        id: slug,
        season: season,
      },
      query: {
        extended: 'full,cloud9',
      },
    })
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch up season episodes');
      }

      return body.map(mapEpisodeResponseToEpisodeEntry);
    });
}

export const showSeasonEpisodesQueryKey = (params: ShowSeasonEpisodeQuery) =>
  ['showSeasonEpisodes', params.slug, params.season] as const;
export const showSeasonEpisodesQuery = (
  params: ShowSeasonEpisodeQuery,
) => ({
  queryKey: showSeasonEpisodesQueryKey(params),
  queryFn: () => showSeasonEpisodesRequest(params),
});
