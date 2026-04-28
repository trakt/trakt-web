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
  const shows = props.type === 'show'
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
          const watchedEpisodes = $history.shows.get(showId)?.episodes ?? [];

          return episodes.every((episode) =>
            watchedEpisodes.some((e) => e.episodeId === episode.id)
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
          return shows.every((show) => {
            const watchedShow = $history.shows.get(show.id);
            const episodeCount = show.episode?.count;

            if (!watchedShow || !episodeCount) {
              return false;
            }

            const watchedEpisodeCount = [
              ...watchedShow.playsPerSeason.entries(),
            ]
              .filter(([season]) => season !== 0)
              .reduce((sum, [, count]) => sum + count, 0);

            return watchedEpisodeCount >= episodeCount;
          });
        }
      }
    }),
  );

  return { isWatched };
}
