import { useQuery } from '$lib/features/query/useQuery.ts';
import { movieJustWatchUrlQuery } from '$lib/requests/queries/movies/movieJustWatchUrlQuery.ts';
import { showJustWatchUrlQuery } from '$lib/requests/queries/shows/showJustWatchUrlQuery.ts';
import { showSeasonJustWatchUrlQuery } from '$lib/requests/queries/shows/showSeasonJustWatchUrlQuery.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map } from 'rxjs';
import type { MetaInfoProps } from '../../../summary/components/media/useMediaMetaInfo.ts';

type UseJustWatchUrlProps = {
  country: string;
} & MetaInfoProps;

function mapToQuery(props: UseJustWatchUrlProps) {
  switch (props.type) {
    case 'movie':
      return movieJustWatchUrlQuery({
        slug: props.media.slug,
        country: props.country,
      });
    case 'show':
      return showJustWatchUrlQuery({
        slug: props.media.slug,
        country: props.country,
      });
    case 'episode':
      return showSeasonJustWatchUrlQuery({
        slug: props.media.slug,
        season: props.episode.season,
        country: props.country,
      });
  }
}

export function useJustWatchUrl(props: UseJustWatchUrlProps) {
  const query = useQuery(mapToQuery(props));

  return {
    url: query.pipe(map(($query) => $query.data)),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
