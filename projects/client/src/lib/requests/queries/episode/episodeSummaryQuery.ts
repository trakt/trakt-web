import type { EpisodeEntry } from '$lib/models/EpisodeEntry.ts';
import { mapEpisodeResponseToEpisodeEntry } from '$lib/requests/_internal/mapEpisodeResponseToEpisodeEntry.ts';
import { api, type ApiParams } from '../../_internal/api.ts';

type EpisodeSummaryParams =
  & { slug: string; season: number; episode: number }
  & ApiParams;

function episodeSummaryRequest(
  { fetch, slug, episode, season }: EpisodeSummaryParams,
): Promise<EpisodeEntry> {
  return api({ fetch })
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
    .then(({ status, body }) => {
      if (status !== 200) {
        throw new Error('Failed to fetch episode summary');
      }

      return mapEpisodeResponseToEpisodeEntry(body);
    });
}

export const episodeSummaryQueryKey = (params: EpisodeSummaryParams) =>
  ['episodeSummary', params.slug, params.season, params.episode] as const;
export const episodeSummaryQuery = (
  params: EpisodeSummaryParams,
) => ({
  queryKey: episodeSummaryQueryKey(params),
  queryFn: () => episodeSummaryRequest(params),
});
