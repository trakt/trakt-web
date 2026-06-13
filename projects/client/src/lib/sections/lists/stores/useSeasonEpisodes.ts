import { createBulkEpisodeIntl } from '$lib/features/intl-overlay/createBulkEpisodeIntl.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { showSeasonEpisodesQuery } from '$lib/requests/queries/shows/showSeasonEpisodesQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';

export const useSeasonEpisodes = (slug: string, season: number) => {
  const query = useQuery(showSeasonEpisodesQuery({
    slug,
    season,
  }));

  const overlay = createBulkEpisodeIntl<EpisodeEntry>();

  const list = query.pipe(
    map(($query) => $query.data ?? []),
    overlay.operator,
  );

  const baseLoading = query.pipe(map(toLoadingState));

  return {
    list,
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
  };
};
