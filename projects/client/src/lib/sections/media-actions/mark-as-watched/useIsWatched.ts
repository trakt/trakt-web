import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { map } from 'rxjs';
import type { ExtendedMediaStoreProps } from '../../../models/MediaStoreProps.ts';

export type IsWatchedProps = ExtendedMediaStoreProps;

export function useIsWatched(props: IsWatchedProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();

  const episodes = props.type === 'episode'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];
  const showId = 'show' in props ? props.show.id : -1;
  const seasons = props.type === 'season'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];

  const isWatched = history.pipe(
    map(($history) => {
      if (!$history) {
        return false;
      }

      switch (type) {
        case 'movie':
          return media.every((m) => $history.movies.has(m.id));
        case 'episode': {
          const watchedEpisodes = $history.shows.get(showId)?.episodes ??
            [];

          return episodes.every((episode) =>
            watchedEpisodes.some((e) =>
              e.season === episode.season && e.episode === episode.number
            )
          );
        }
        case 'season': {
          const countBySeason = $history.shows.get(showId)?.playsPerSeason ??
            new Map<number, number>();

          return seasons.every((season) =>
            (countBySeason.get(season.number) ?? 0) >= season.episodes.count
          );
        }
        case 'show': {
          return media.every((m) =>
            Boolean($history.shows.get(m.id)?.isWatched)
          );
        }
      }
    }),
  );

  return { isWatched };
}
