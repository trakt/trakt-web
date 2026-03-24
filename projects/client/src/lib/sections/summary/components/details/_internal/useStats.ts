import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EpisodeStats } from '$lib/requests/models/EpisodeStats.ts';
import type { MediaStats } from '$lib/requests/models/MediaStats.ts';
import { episodeStatsQuery } from '$lib/requests/queries/episode/episodeStatsQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { map } from 'rxjs';
import type { MediaDetailsProps } from '../MediaDetailsProps.ts';

type Stats = MediaStats | EpisodeStats;

type UseStatsProps = MediaDetailsProps;

const emptyStats: EpisodeStats = {
  watchers: 0,
  plays: 0,
  collectors: 0,
  comments: 0,
  lists: 0,
};

const emptyMediaStats: MediaStats = {
  ...emptyStats,
  favorited: 0,
  votes: 0,
};

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

export function useStats(props: UseStatsProps) {
  const query = useQuery(toQuery(props));

  return {
    stats: query.pipe(map(($query) => {
      if (!$query.data) {
        return props.type === 'episode' ? emptyStats : emptyMediaStats;
      }

      return $query.data;
    })),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
