import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamAllEpisodeQuery } from '$lib/requests/queries/episode/streamAllEpisodeQuery.ts';
import { streamAllMovieQuery } from '$lib/requests/queries/movies/streamAllMovieQuery.ts';
import { streamAllShowQuery } from '$lib/requests/queries/shows/streamAllShowQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { derived } from 'svelte/store';
import type { MetaInfoProps } from '../../../summary/components/media/useMediaMetaInfo.ts';

function mapToQuery(props: MetaInfoProps) {
  switch (props.type) {
    case 'movie':
      return streamAllMovieQuery({ slug: props.media.slug });
    case 'show':
      return streamAllShowQuery({ slug: props.media.slug });
    case 'episode':
      return streamAllEpisodeQuery({
        slug: props.media.slug,
        season: props.episode.season,
        episode: props.episode.number,
      });
  }
}

export function useAllStreamOn(props: MetaInfoProps) {
  const query = useQuery(mapToQuery(props));

  return {
    list: derived(query, ($query) => $query?.data ?? []),
    isLoading: derived(
      query,
      toLoadingState,
    ),
  };
}
