import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { EpisodeStats } from '$lib/requests/models/EpisodeStats.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaStats } from '$lib/requests/models/MediaStats.ts';
import { episodeStatsQuery } from '$lib/requests/queries/episode/episodeStatsQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
import { map } from 'rxjs';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';
import {
  EMPTY_EPISODE_STATS,
  EMPTY_MEDIA_STATS,
  getDisplayableStats,
} from './getDisplayableStats.ts';

type Stats = MediaStats | EpisodeStats;

type UseStatsProps = MediaDetailsProps;

function toQuery(props: UseStatsProps) {
  switch (props.type) {
    case 'movie':
      return movieStatsQuery({ slug: props.media.slug }) as CreateQueryOptions<
        Stats
      >;
    case 'show':
      return showStatsQuery({ slug: props.media.slug }) as CreateQueryOptions<
        Stats
      >;
    case 'episode':
      return episodeStatsQuery({
        slug: props.show.slug,
        season: props.episode.season,
        episode: props.episode.number,
      }) as CreateQueryOptions<Stats>;
  }
}

function toEntry(props: UseStatsProps): MediaEntry | EpisodeEntry {
  return props.type === 'episode' ? props.episode : props.media;
}

export function useStats(props: UseStatsProps) {
  const query = useQuery(toQuery(props));
  const entry = toEntry(props);

  return {
    stats: query.pipe(map(($query) => {
      if (!$query.data) {
        return props.type === 'episode'
          ? EMPTY_EPISODE_STATS
          : EMPTY_MEDIA_STATS;
      }

      return getDisplayableStats({ stats: $query.data, entry });
    })),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
