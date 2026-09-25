import { myEpisodeCommentsQuery } from '$lib/requests/queries/episode/myEpisodeCommentsQuery.ts';
import { myMovieCommentsQuery } from '$lib/requests/queries/movies/myMovieCommentsQuery.ts';
import { myShowCommentsQuery } from '$lib/requests/queries/shows/myShowCommentsQuery.ts';
import { myShowSeasonCommentsQuery } from '$lib/requests/queries/shows/myShowSeasonCommentsQuery.ts';
import type { UseMyCommentsProps } from './UseMyCommentsProps.ts';

export function typeToMyCommentsQuery(props: UseMyCommentsProps) {
  switch (props.type) {
    case 'movie':
      return myMovieCommentsQuery({
        slug: props.slug,
        enabled: props.enabled,
      });
    case 'show':
      return myShowCommentsQuery({ slug: props.slug, enabled: props.enabled });
    case 'season':
      return myShowSeasonCommentsQuery({
        slug: props.slug,
        season: props.season,
        enabled: props.enabled,
      });
    case 'episode':
      return myEpisodeCommentsQuery({
        slug: props.slug,
        season: props.season,
        episode: props.episode,
        enabled: props.enabled,
      });
  }
}
