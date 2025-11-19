import { EMPTY_RATINGS } from '$lib/components/summary/_internal/getDisplayableRatings.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { episodeRatingQuery } from '$lib/requests/queries/episode/episodeRatingQuery.ts';
import { movieRatingQuery } from '$lib/requests/queries/movies/movieRatingQuery.ts';
import { showRatingQuery } from '$lib/requests/queries/shows/showRatingQuery.ts';
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

  return {
    ratings: derived(ratings, ($ratings) => $ratings.data ?? EMPTY_RATINGS),
  };
}
