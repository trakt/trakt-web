import { getLanguageAndRegion } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { streamAllEpisodeQuery } from '$lib/requests/queries/episode/streamAllEpisodeQuery.ts';
import { streamAllMovieQuery } from '$lib/requests/queries/movies/streamAllMovieQuery.ts';
import { streamAllShowQuery } from '$lib/requests/queries/shows/streamAllShowQuery.ts';
import { toCountryName } from '$lib/utils/formatting/intl/toCountryName.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { map, Observable } from 'rxjs';
import type { MetaInfoProps } from '../../../summary/components/media/useMediaMetaInfo.ts';
import type { NamedServiceOptions } from './models/NamedServiceOptions.ts';

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

type AllStreamOnOptions = {
  list: Observable<NamedServiceOptions[]>;
  isLoading: Observable<boolean>;
};

export function useAllStreamOn(props: MetaInfoProps): AllStreamOnOptions {
  const query = useQuery(mapToQuery(props));
  const { language } = getLanguageAndRegion();

  return {
    list: query.pipe(
      map(($query) => {
        const data = $query?.data ?? [];
        return data.map((entry) => ({
          ...entry,
          countryName: toCountryName(entry.country, language),
        }));
      }),
    ),
    isLoading: query.pipe(map(toLoadingState)),
  };
}
