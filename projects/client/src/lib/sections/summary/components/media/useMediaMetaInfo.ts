import { EMPTY_RATINGS } from '$lib/components/summary/_internal/getDisplayableRatings.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { episodeRatingQuery } from '$lib/requests/queries/episode/episodeRatingQuery.ts';
import { episodeStatsQuery } from '$lib/requests/queries/episode/episodeStatsQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { movieStatsQuery } from '$lib/requests/queries/movies/movieStatsQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
import { showStatsQuery } from '$lib/requests/queries/shows/showStatsQuery.ts';
import { derived } from 'svelte/store';

type EpisodeMetaInfoProps = {
  type: 'episode';
  media: ShowEntry;
  episode: EpisodeEntry;
};

type MediaMetaInfoProps = {
  type: MediaType;
  media: MediaEntry;
};

export type MetaInfoProps = EpisodeMetaInfoProps | MediaMetaInfoProps;

function mediaTypeToStatsQuery(slug: string, type: MediaType) {
  switch (type) {
    case 'movie':
      return movieStatsQuery({ slug });
    case 'show':
      return showStatsQuery({ slug });
  }
}

function typeToRatingsQuery(props: MetaInfoProps) {
  const slug = props.media.slug;

  switch (props.type) {
    case 'movie':
      return movieRatingQuery({ slug });
    case 'show':
      return showRatingQuery({ slug });
    case 'episode':
      return episodeRatingQuery({
        slug,
        season: props.episode.season,
        episode: props.episode.number,
      });
  }
}

export function useMediaMetaInfo(props: MetaInfoProps) {
  const ratings = useQuery(typeToRatingsQuery(props));
  const stats = props.type === 'episode'
    ? useQuery(episodeStatsQuery({
      slug: props.media.slug,
      season: props.episode.season,
      episode: props.episode.number,
    }))
    : useQuery(mediaTypeToStatsQuery(props.media.slug, props.type));

  return {
    ratings: derived(ratings, ($ratings) => $ratings.data ?? EMPTY_RATINGS),
    plays: derived(stats, ($stats) => $stats.data?.plays ?? 0),
  };
}
